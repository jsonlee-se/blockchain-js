import type { Transaction } from "./transaction.ts";

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
    public transactions: Transaction[];

    constructor(
        index: number,
        data: string,
        prevHash: string,
        txs: Transaction[],
        nonce?: number,
        id?: number,
        hash?: string,
        timestamp?: string,
    ) {
        this.index = index;
        this.data = data;
        this.prevHash = prevHash;
        this.transactions = txs;
        this.nonce = nonce ? nonce : 0;
        this.id = id ? id : 0;
        this.hash = hash ? hash : this.calculateHash();
        this.timestamp = timestamp ? timestamp : new Date().toISOString();
    }

    calculateHash() {
        return SHA256(
            this.index + this.prevHash + this.timestamp + this.data +
                this.transactions + this.nonce,
        ).toString();
    }

    mine(): void {
        do {
            this.nonce++;
            this.hash = this.calculateHash();
        } while (!this.hash.startsWith("0".repeat(DIFFICULTY)));
    }
}
