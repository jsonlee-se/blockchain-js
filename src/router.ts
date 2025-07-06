type Handler = (req: Request) => Response | Promise<Response>;

export class Router {
    public routes: Map<string, Handler>;
    constructor() {
        this.routes = new Map();
    }

    get(path: string, handler: Handler) {
        this.routes.set(`GET:${path}`, handler);
    }

    post(path: string, handler: Handler) {
        this.routes.set(`POST:${path}`, handler);
    }

    handle(req: Request) {
        const url = new URL(req.url);
        const key = `${req.method}:${url.pathname}`;
        const handler = this.routes.get(key);
        if (handler) {
            return handler(req);
        }
        return new Response("Not Found", { status: 404 });
    }
}
