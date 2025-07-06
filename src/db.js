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

db.exec("PRAGMA journal_mode = WAL;");

const insertBlock = db.query(
  "INSERT INTO blocks (block_index, timestamp, data, prevHash, hash, nonce) \
  VALUES ($block_index, $timestamp, $data, $prevHash, $hash, $nonce)",
);
const getChain = db.query("SELECT * FROM blocks ORDER BY block_index ASC");
const getLastBlock = db.query(
  "SELECT * FROM blocks ORDER BY block_index DESC LIMIT 1",
);
const nextIndex = db.query(
  "SELECT COUNT(*) as count FROM blocks",
);

export const blockService = {
  create: (block) => {
    const res = insertBlock.run({
      $block_index: block.index,
      $timestamp: block.timestamp,
      $data: block.data,
      $prevHash: block.prevHash,
      $hash: block.hash,
      $nonce: block.nonce,
    });
    return {
      id: res.lastInsertRowId,
      index: block.block_index,
      timestamp: block.timestamp,
      data: block.data,
      prevHash: block.prevHash,
      hash: block.hash,
      nonce: block.nonce,
    };
  },
  getChain: () => {
    return getChain.all();
  },

  getLastBlock: () => {
    return getLastBlock.get();
  },
  nextIndex: () => {
    return nextIndex.get().count;
  },
};
