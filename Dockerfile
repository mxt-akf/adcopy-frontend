# ===== 第一阶段：构建 =====

# 用 node:20-alpine 作为基础镜像（alpine 是超轻量版 Linux，只有 5MB）
FROM node:20-alpine AS builder

# 在容器里创建 /app 目录，后续命令都在这里执行
WORKDIR /app

# 先只复制 package.json，利用 Docker 缓存层
# 只要依赖没变，下次构建直接跳过 npm install，加快速度
COPY package*.json ./

# 安装依赖
RUN npm install

# 把项目所有源码复制进去
COPY . .

# 执行打包，生成 /app/dist 目录（就是你平时 npm run build 的产物）
RUN npm run build


# ===== 第二阶段：运行 =====
# 重新用一个干净的 nginx 镜像
# 不带 node_modules、源码等，最终镜像体积从几百MB压到几十MB
FROM nginx:alpine

# 把第一阶段打包好的 dist，复制到 nginx 的静态文件目录
# nginx 会自动把这个目录下的文件作为网站内容提供服务
COPY --from=builder /app/dist /usr/share/nginx/html