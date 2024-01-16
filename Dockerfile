FROM node:latest
WORKDIR /user/src/app

COPY server-side/package*.json ./server-side/
COPY server-side/tsconfig.json ./server-side/

COPY client-side/package*.json ./client-side/
COPY client-side/tsconfig.json ./client-side/

COPY client-side ./client-side/
COPY server-side ./server-side/

RUN cd client-side && npm install -g typescript && cd ..

RUN cd client-side && npm install --save-dev && cd ..
RUN cd server-side && npm install --save-dev
RUN cd server-side && tsc

CMD cd server-side && npm run start

EXPOSE 3000