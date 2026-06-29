#dev
FROM node:22-bookworm AS bitsenbytesfrontend
RUN apt-get update
RUN apt-get install iputils-ping -y
WORKDIR /usr/src/
COPY ./frontend/package-lock.json ./frontend/package-lock.json
COPY ./frontend/package.json ./frontend/package.json
WORKDIR /usr/src/frontend
RUN npm i --ignore-scripts

FROM node:22-bookworm AS bitsenbytesbackend
RUN apt-get update
RUN apt-get install iputils-ping -y
WORKDIR /usr/src/
COPY ./backend/package-lock.json ./backend/package-lock.json
COPY ./backend/package.json ./backend/package.json
WORKDIR /usr/src/backend
RUN npm i --ignore-scripts

#acc
FROM nginx:stable-alpine-perl as bitsenbytesfrontendACC
COPY ./frontend/dist /usr/share/nginx/html

FROM node:22-bookworm AS bitsenbytesbackendACC
COPY ./backend/dist /usr/backend
COPY ./backend/package.json /usr/backend/package.json
WORKDIR /usr/backend
RUN npm i --ignore-scripts
CMD ["node", "/usr/backend/src/index.js"]

# prod
FROM nginx:stable-alpine-perl as bitsenbytesfrontendPROD
COPY ./frontend/dist /usr/share/nginx/html

FROM node:22-bookworm AS bitsenbytesbackendPROD
COPY ./backend/dist /usr/backend
COPY ./backend/package.json /usr/backend/package.json
WORKDIR /usr/backend
RUN npm i --ignore-scripts
CMD ["node", "/usr/backend/src/index.js"]