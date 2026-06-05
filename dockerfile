FROM node:22-bookworm AS bitsenbytesfrontend
RUN apt-get update
RUN apt-get install iputils-ping -y
WORKDIR /usr/src/
COPY ./frontend/package-lock.json ./frontend/package-lock.json
COPY ./frontend/package.json ./frontend/package.json
COPY ./frontend ./frontend
WORKDIR /usr/src/frontend
RUN npm ci --no-audit --no-fund

FROM node:22-bookworm AS bitsenbytesbackend
RUN apt-get update
RUN apt-get install iputils-ping -y
WORKDIR /usr/src/
COPY ./backend/package-lock.json ./backend/package-lock.json
COPY ./backend/package.json ./backend/package.json
COPY ./backend ./backend
WORKDIR /usr/src/backend
RUN npm ci --no-audit --no-fund