import { BlockChain } from "./src/blockchain.ts";
import { Router } from "./src/router.ts";

const router = new Router();
const blockChain = new BlockChain();

router.get("/chain", (req: Request) => {
    return new Response(JSON.stringify(blockChain.getChain(), null, 4), {
        headers: { "Content-Type": "application/json" },
    });
});

const server = Bun.serve({
    port: 3000,
    fetch: router.handle.bind(router),
});

console.log(`Listening on http://localhost:${server.port} ...`);
