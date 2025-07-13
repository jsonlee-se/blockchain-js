const SHA256 = require("crypto-js/sha256");

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
        hash?: string,
        nonce?: number,
        id?: number,
    ) {
        this.id = id ? id : 0;
        this.index = index;
        this.timestamp = new Date().toISOString();
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

    mineBlock(difficulty: number): void {
    }
}
