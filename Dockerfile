ARG  NODE_VERSION
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /tmp

COPY . ./

RUN yarn install && yarn build:site


FROM nginx:1.23

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
