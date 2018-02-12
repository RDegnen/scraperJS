FROM node:6.10.0
RUN mkdir -p /etc/letsencrypt/live/scraperjsapi.info
WORKDIR /usr/src/scraper-api

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "run", "prodstart"]
USER node
