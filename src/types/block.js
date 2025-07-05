const SHA256 = require("crypto-js/sha256");

export class Block {
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
        this.transactions = [];
    }

    calculateHash() {
        return SHA256(
            this.index + this.previousHash + this.timestamp + this.data +
                this.nonce,
        ).toString();
    }

    mineBlock(difficulty) {
    }
}
