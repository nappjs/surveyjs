envsubst < /usr/share/nginx/html/config.temp.js > /usr/share/nginx/html/config.js

exec nginx -g "daemon off;"