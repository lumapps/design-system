FROM node:10.16-buster AS builder

WORKDIR /tmp

COPY package.json lerna.json yarn.lock tsconfig.json tslint.json ./
COPY configs ./configs
COPY packages ./packages/

RUN yarn install \
    && yarn build:site


FROM nginx:1.17

ARG WEBROOT=/var/www

COPY --from=builder /tmp/packages/site-demo/dist $WEBROOT
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
