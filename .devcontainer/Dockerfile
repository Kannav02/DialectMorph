FROM --platform=$TARGETPLATFORM ubuntu:latest

RUN apt-get update && apt-get install -y curl unzip git

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

