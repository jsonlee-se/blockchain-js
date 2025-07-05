import { assert } from "node:console";
import { Block } from "./block.js";
import { blockService } from "./db.js";

export class BlockChain {
    constructor() {
        blockService.create(this.createGenesis());
    }

    createGenesis() {
        return new Block(0, "01/01/2025", "Genesis Block", "0");
    }

    addBlock(json) {
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
}
