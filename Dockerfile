# build client js
FROM node:22 AS client
WORKDIR /src
# packages
COPY client/package.json .
COPY client/package-lock.json .
RUN npm install
# src files
COPY client .
RUN npm run build

# host
FROM node:22
WORKDIR /srv
# built files
COPY server/package.json .
COPY server/package-lock.json .
RUN npm install
COPY --from=client /dist /dist
COPY server .
# exec
ENV ENVIRONMENT="RELEASE"
CMD ["npm", "run", "start"]
