FROM nginx:1.17.1-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY ./src /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]
