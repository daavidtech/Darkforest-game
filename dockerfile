FROM rust:1.76 as rust_build

WORKDIR /usr/src/server
COPY ./server .
RUN cargo build --release

FROM oven/bun as bun_build
WORKDIR /usr/src/web
COPY ./web .
RUN bun install
RUN bun run build

FROM ubuntu:latest
WORKDIR /usr/src
COPY --from=rust_build /usr/src/server/target/release/darkforest ./server/
COPY --from=bun_build /usr/src/web/dist ./web/dist
RUN chmod +x ./server/darkforest
CMD ["./server/darkforest"]