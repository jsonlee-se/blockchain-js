import { BlockChain } from "./blockchain.js";

let jsChain = new BlockChain();
jsChain.addBlock({ timestamp: "12/25/2017", data: "amount = 5" });
jsChain.addBlock({ timestamp: "12/26/2017", data: "amount = 10" });

console.log(JSON.stringify(jsChain, null, 4));
console.log("Is blockchain valid? " + jsChain.checkValid());
