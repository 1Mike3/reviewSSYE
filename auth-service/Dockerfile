FROM node:20-alpine

ENV JWT_PRIVATE_KEY=/keys/private.key
ENV JWT_PUBLIC_KEY=/keys/public.key
ENV USER_PASS_PEPPER=pepper

VOLUME ["/app/data"]

RUN mkdir -p /keys

WORKDIR /app

COPY package.json /app

RUN npm install

COPY ./*.js /app
COPY ./*.key /keys

EXPOSE 5500

CMD ["node", "index.js"]