FROM nginx
COPY proxy/. /etc/nginx/templates/
ENV UI_SERVER_HOST=
ENV API_SERVER_HOST=