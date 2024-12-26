FROM node:22.11.0-bookworm


COPY ./tools/ .
RUN chmod +x /setup_backend.sh

WORKDIR /backend

ENTRYPOINT [ "bash", "/setup_backend.sh" ]
