import { BlockChain } from "./src/blockchain.ts";

const server = Bun.serve({
    port: 3000,
    fetch(req) {
        let jsChain = new BlockChain();
        jsChain.addBlock({
            timestamp: new Date().toISOString(),
            data: "amount = 5",
        });
        jsChain.addBlock({
            timestamp: new Date().toISOString(),
            data: "amount = 10",
        });

        const res = JSON.stringify(jsChain.getChain(), null, 4);
        return new Response(res);
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);
