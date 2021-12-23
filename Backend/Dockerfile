FROM nikolaik/python-nodejs:python3.10-nodejs14


WORKDIR /backend
COPY package.json /backend

RUN npm install
COPY . .

EXPOSE 8000
CMD [ "node", "index.js" ]