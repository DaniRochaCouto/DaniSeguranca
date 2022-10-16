FROM node:14.17.4-alpine
EXPOSE 3001

WORKDIR /home/app

COPY . /home/app

ENV PATH /home/node_modules/bin:$PATH

RUN npm config set prefix "/home/node_modules" \
    && npm i express \ 
    && npm i mysql2\
    && npm i -g nodemon \
    && npm i express-rate-limit \
    && npm i express-oauth2-jwt-bearer

CMD nodemon -L app.js
