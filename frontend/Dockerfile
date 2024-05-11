# 第一階段 - 建立階段
FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# 第二階段 - 運行階段
FROM node:14-alpine

WORKDIR /app

# 從建立階段複製應用程式到運行階段
COPY --from=build /app/dist ./dist

# 只安裝運行時依賴項
COPY package*.json ./
RUN npm install --production

EXPOSE 3000

CMD [ "npm", "run", "serve" ]