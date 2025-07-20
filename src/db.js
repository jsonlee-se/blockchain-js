import { Database } from "bun:sqlite";
const db = new Database("blockchain.sqlite", { create: true });

db.exec(`
  CREATE TABLE IF NOT EXISTS blocks (
    id INTEGER PRIMARY KEY,
    block_index INTEGER,
    timestamp TEXT,
    data TEXT,
    prevHash TEXT,
    hash TEXT,
    nonce INTEGER
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY,
    block_id INTEGER,
    sender TEXT,
    recipient TEXT,
    amount REAL,
    FOREIGN KEY(block_id) REFERENCES blocks(id)
  )
`);

db.exec("PRAGMA journal_mode = WAL;");

const insertBlock = db.query(
  "INSERT INTO blocks (block_index, timestamp, data, prevHash, hash, nonce) \
  VALUES ($block_index, $timestamp, $data, $prevHash, $hash, $nonce)",
);
const getBlocks = db.query("SELECT * FROM blocks ORDER BY block_index ASC");
const getLastBlock = db.query(
  "SELECT * FROM blocks ORDER BY block_index DESC LIMIT 1",
);
const nextIndex = db.query(
  "SELECT COUNT(*) as count FROM blocks",
);
const insertTransactions = db.prepare(
  "INSERT INTO transactions (sender, recipient, amount, block_id) \
  VALUES ($sender, $recipient, $amount, $block_id)",
);
const getTransactions = db.query("SELECT * FROM transactions");

export const blockService = {
  createBlock: (block) => {
    const res = insertBlock.run({
      $block_index: block.index,
      $timestamp: block.timestamp,
      $data: block.data,
      $prevHash: block.prevHash,
      $hash: block.hash,
      $nonce: block.nonce,
    });
    const id = res.lastInsertRowid;

    const transactions = mapTransactions(block.transactions, id);
    let txs = createTransactions(transactions);

    return {
      id: id,
      index: block.block_index,
      timestamp: block.timestamp,
      data: block.data,
      prevHash: block.prevHash,
      hash: block.hash,
      nonce: block.nonce,
      transactions: txs,
    };
  },
  getChain: () => {
    const blocks = getBlocks.all();
    const ts = getTransactions.all();

    const tsbyBlock = ts.reduce((acc, t) => {
      if (!acc[t.block_id]) {
        acc[t.block_id] = [];
      }
      acc[t.block_id].push(t);
      return acc;
    }, {});

    blocks.forEach((b) => {
      b.transactions = tsbyBlock[b.id] || [];
    });
    return blocks;
  },
  getLastBlock: () => {
    return getLastBlock.get();
  },
  nextIndex: () => {
    return nextIndex.get().count;
  },
};

function mapTransactions(txs, id) {
  console.log(id);
  return txs.map((t) => ({
    $sender: t.sender,
    $recipient: t.recipient,
    $amount: t.amount,
    $block_id: id,
  }));
}

function createTransactions(txs) {
  const insertTxs = db.transaction((txs) => {
    const res = [];
    for (const tx of txs) {
      const t = insertTransactions.run(
        tx.$sender,
        tx.$recipient,
        tx.$amount,
        tx.$block_id,
      );
      res.push({
        id: t.lastInsertRowid,
        block_id: tx.$block_id,
        sender: tx.$sender,
        recipient: tx.$recipient,
        amount: tx.$amount,
      });
    }
    return res;
  });
  return insertTxs(txs);
}
