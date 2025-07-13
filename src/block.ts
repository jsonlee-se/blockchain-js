const SHA256 = require("crypto-js/sha256");

const DIFFICULTY = 4;

export class Block {
    public id: number;
    public index: number;
    public timestamp: string;
    public data: string;
    public prevHash: string;
    public hash: string;
    public nonce: number;

    constructor(
        index: number,
        data: string,
        prevHash: string,
        id?: number,
    ) {
        this.id = id ? id : 0;
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.prevHash = prevHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            this.index + this.prevHash + this.timestamp + this.data +
                this.nonce,
        ).toString();
    }

    mineBlock(): void {
        do {
            this.nonce++;
            this.hash = this.calculateHash();
        } while (!this.hash.startsWith("0".repeat(DIFFICULTY)));
    }
}
