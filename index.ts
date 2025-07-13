import { BlockChain } from "./src/blockchain.ts";
import { Router } from "./src/router.ts";

const router = new Router();
const blockChain = new BlockChain();

router.get("/chain", (req: Request) => {
    return new Response(JSON.stringify(blockChain.getChain(), null, 4), {
        headers: { "Content-Type": "application/json" },
    });
});

router.post("/block", async (req: Request) => {
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: "invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    const block = blockChain.addBlock(body);
    const res = {
        "message": "Block added",
        "block": block,
    };
    return new Response(JSON.stringify(res, null, 4), {
        headers: { "Content-Type": "application/json" },
    });
});

const server = Bun.serve({
    port: 3000,
    fetch: router.handle.bind(router),
});

console.log(`Listening on http://localhost:${server.port} ...`);
