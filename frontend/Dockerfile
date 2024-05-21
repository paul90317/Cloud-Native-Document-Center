# 第一階段 - 建立階段
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ /app/src/
COPY .env.production /app/
COPY public/ /app/public/
COPY index.html /app/
COPY 50x.html /app/
COPY vite.config.js /app/

RUN npm run build

# 第二階段 - 運行階段
FROM nginx:stable-alpine

# 從建立階段複製應用程式到運行階段
COPY --from=build /app/dist /usr/share/nginx/html

# 新增 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]