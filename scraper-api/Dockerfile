FROM 8base/docker-amazonlinux-node

WORKDIR /usr/src/scraper-api

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "run", "prodstart"]
