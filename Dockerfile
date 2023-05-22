FROM node:20 as BUILD
WORKDIR /tmp/frontendbuild
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "build"]

FROM nginx:1.14.2
COPY --from=BUILD /tmp/frontendbuild/dist/dsh/* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY mime.types /etc/nginx/mime.types
