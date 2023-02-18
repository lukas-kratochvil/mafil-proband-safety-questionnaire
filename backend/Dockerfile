#-------------------------------------------
# BUILD FOR DEVELOPMENT
#-------------------------------------------
FROM node:16-alpine AS development

WORKDIR /usr/src/app

# we do not want to run under the root user, we will use already created `node` user instead (created in the base `node` image)
# RUN chown -R node:node /usr/src
# USER node

COPY ["backend/package.json", "backend/package-lock.json", "./"]
RUN npm ci

COPY backend/prisma/schema.prisma ./prisma/
RUN npx prisma generate

# copy shared tsconfig file between the projects inside the monorepo.. must be in the parental folder of the `backend` project
COPY tsconfig.base.json ../.
COPY ./backend .


#-------------------------------------------
# BUILD FOR PRODUCTION
#-------------------------------------------
FROM node:16-alpine AS build

WORKDIR /usr/src/app

# we do not want to run under the root user, we will use already created `node` user instead (created in the base `node` image)
# RUN chown -R node:node /usr/src
# USER node

COPY --from=development ["/usr/src/app/package.json", "/usr/src/app/package-lock.json", "./"]
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/. ../.

RUN npm run build

RUN npm ci --production && npm cache clean --force


#-------------------------------------------
# PRODUCTION
#-------------------------------------------
FROM node:16-alpine AS production

WORKDIR /usr/src/app

# we do not want to run under the root user, we will use already created `node` user instead (created in the base `node` image)
# RUN chown -R node:node /usr/src/app
# USER node

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
