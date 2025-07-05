const SHA256 = require("crypto-js/sha256");

export class Block {
    constructor(index, timestamp, data, prevHash, hash, nonce, id) {
        this.id = id ? id : 0;
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = prevHash;
        this.hash = hash ? hash : this.calculateHash();
        this.nonce = nonce ? nonce : 0;
    }

    calculateHash() {
        return SHA256(
            this.index + this.prevHash + this.timestamp + this.data +
                this.nonce,
        ).toString();
    }

    mineBlock(difficulty) {
    }
}
