const server = Bun.serve({
	port: 4000,
	fetch(request) {
		request.url
		return new Response("Welcome to Bun!");
	},
});

console.log(`Listening on localhost:${server.port}`);