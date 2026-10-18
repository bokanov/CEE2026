FROM node:22-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
EXPOSE 3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
CMD ["npm", "start"]
