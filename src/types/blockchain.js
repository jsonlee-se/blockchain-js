import { Block } from "./block.js";

export class BlockChain {
    constructor() {
        this.chain = [this.createGenesis()];
    }

    createGenesis() {
        return new Block(0, "01/01/2025", "Genesis Block", "0");
    }

    latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.previousHash = this.latestBlock().hash;
        block.hash = block.calculateHash();
        this.chain.push(block);
    }

    checkValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (curBlock.hash != curBlock.calculateHash()) {
                return false;
            }

            if (curBlock.previousHash != prevBlock.hash) {
                return false;
            }
        }

        return true;
    }
}
