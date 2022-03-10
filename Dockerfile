FROM node:13.7.0-buster AS builder

WORKDIR /tmp

COPY package.json lerna.json .yarn yarn.lock tsconfig.json ./
COPY configs ./configs
COPY packages ./packages/

RUN yarn install --ignore-engines \
    && yarn build:site


FROM nginx:1.17

ARG WEBROOT=/var/www

COPY --from=builder /tmp/packages/site-demo/public $WEBROOT
COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY .docker/robots.txt ${WEBROOT}

WORKDIR $WEBROOT

RUN touch /var/run/nginx.pid \
    && chown -R www-data:www-data /var/run/nginx.pid \
    && chown -R www-data:www-data /var/cache/nginx \
    && chmod -R 644 $WEBROOT/* \
    && chmod -R +X $WEBROOT \
    && chown -R root:www-data $WEBROOT

USER www-data

EXPOSE 8080
