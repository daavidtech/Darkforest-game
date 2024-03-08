FROM rust:1.76

WORKDIR /usr/src/server
COPY ./server .
RUN cargo build --release

FROM oven/bun
WORKDIR /usr/src/web
COPY ./web .
RUN bun install
RUN bun run build