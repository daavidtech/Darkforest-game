FROM oven/bun
WORKDIR /usr/src/darkforest
COPY . .
RUN bun install --frozen-lockfile
RUN bun run lint
RUN bun run format:check
RUN bun run typecheck
RUN bun test --bail
CMD ["bun", "run", "./server/server.ts"]