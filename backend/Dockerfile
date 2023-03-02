#-------------------------------------------
# BUILD FOR DEVELOPMENT
#-------------------------------------------
FROM node:16-alpine AS development

WORKDIR /usr/src/app/backend

COPY ["backend/package.json", "backend/package-lock.json", "./"]
RUN npm ci

COPY backend/prisma ./prisma
RUN npx prisma generate

# copy shared tsconfig file between the projects inside the monorepo.. must be in the parental folder of the `backend` project
COPY tsconfig.base.json ../.
COPY ./backend .


#-------------------------------------------
# BUILD FOR PRODUCTION
#-------------------------------------------
FROM node:16-alpine AS build

WORKDIR /usr/src/app/backend

COPY --from=development ["/usr/src/app/backend/package.json", "/usr/src/app/backend/package-lock.json", "./"]
COPY --from=development /usr/src/app/backend/node_modules ./node_modules
COPY --from=development /usr/src/app/. ../.

RUN npm run build

RUN npm ci --production && npm cache clean --force


#-------------------------------------------
# PRODUCTION
#-------------------------------------------
FROM node:16-alpine AS production

WORKDIR /usr/src/app

COPY --from=build ["/usr/src/app/backend/package.json", "/usr/src/app/backend/package-lock.json", "./"]
COPY --from=build /usr/src/app/backend/prisma ./prisma
COPY --from=build /usr/src/app/backend/node_modules ./node_modules
COPY --from=build /usr/src/app/backend/dist ./dist

CMD [ "npm", "run", "start:migrate:prod" ]
