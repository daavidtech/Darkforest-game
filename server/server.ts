import index from "./ui/index.html"

Bun.serve({
    port: 4200,
    routes: {
        "/assets/*": (req) => {
            const url = new URL(req.url)
            const path = url.pathname.replace("/assets", "")
            const file = Bun.file(`./server/assets${path}`)
            return new Response(file)
        },
        "/*": index
    }
})