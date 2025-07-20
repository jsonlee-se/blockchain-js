import { assert } from "node:console";
import { Block } from "./block.ts";
import { Transaction } from "./transaction.ts";
import { blockService } from "./db.js";

export class BlockChain {
    private mempool: Transaction[];

    constructor() {
        this.mempool = [];
        const chain = this.getChain();
        if (chain.length === 0) {
            blockService.createBlock(this.createGenesis());
        }
    }

    createGenesis() {
        return new Block(0, "Genesis Block", "0", []);
    }

    mineBlock(json: any) {
        const block = new Block(
            blockService.nextIndex(),
            json.data,
            "",
            this.mempool,
        );
        const lastBlock = blockService.getLastBlock();
        block.prevHash = lastBlock.hash;
        block.mine();

        const res = blockService.createBlock(block);
        this.clearMempool();

        return res;
    }

    checkValid() {
        const chain = this.getChain();
        assert(chain.length > 0);

        for (let i = 1; i < chain.length; i++) {
            const curBlock = chain[i];
            const prevBlock = chain[i - 1];

            if (curBlock.hash != curBlock.calculateHash()) {
                return false;
            }

            if (curBlock.prevHash != prevBlock.hash) {
                return false;
            }
        }

        return true;
    }

    getChain() {
        const chain = blockService.getChain();
        return chain.map((b) => this._buildBlock(b));
    }

    _buildBlock(row: any) {
        const transactions = this._buildTsx(row.transactions);
        const block = new Block(
            row.block_index,
            row.data,
            row.prevHash,
            transactions,
            row.nonce,
            row.id,
            row.hash,
            row.timestamp,
        );
        return block;
    }

    _buildTsx(rows: any) {
        return rows.map((r) =>
            new Transaction(
                r.sender,
                r.recipient,
                r.amount,
            )
        );
    }

    addTransaction(json: any): void {
        const tx = new Transaction(json.from, json.to, json.amount);
        this.mempool.push(tx);
    }

    getPendingTransactions(): Transaction[] {
        return this.mempool;
    }

    clearMempool(): void {
        this.mempool = [];
    }
}
