FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY public public/
COPY src src/
RUN npm run build

# 第二个阶段: 创建并运行Ngnix服务器，并且把打包好的文件复制粘贴到服务器文件夹中
FROM nginx:alpine
COPY --from=build /app/build/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]