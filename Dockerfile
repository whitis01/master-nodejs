FROM  node:latest

RUN apt update && apt install -y sudo
RUN apt update && apt install -y wget curl

RUN DEBIAN_FRONTEND=noninteractive \
    TZ=America/Chicago \
    apt install -y nodejs npm vim

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN ls -al

LABEL maintainer="Isaac A. White <whitis01@gmail.com>" \
      version="1.0"
CMD node index.js

