import { assert } from "node:console";
import { Block } from "./block.ts";
import { blockService } from "./db.js";

export class BlockChain {
    constructor() {
        const chain = this.getChain();
        if (chain.length === 0) {
            blockService.create(this.createGenesis());
        }
    }

    createGenesis() {
        return new Block(0, new Date().toISOString(), "Genesis Block", "0");
    }

    addBlock(json: object) {
        const block = new Block(
            blockService.nextIndex(),
            json.timestamp,
            json.data,
            "",
        );
        const lastBlock = blockService.getLastBlock();
        block.prevHash = lastBlock.hash;
        block.hash = block.calculateHash();
        return blockService.create(block);
    }

    checkValid() {
        const chain = blockService.getChain();
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
        chain.map((row) => this.buildBlock(row));
        return chain;
    }

    buildBlock(row) {
        const block = new Block(
            row.block_index,
            row.timestamp,
            row.data,
            row.prevHash,
            row.hash,
            row.nonce,
            row.id,
        );
        return block;
    }
}
