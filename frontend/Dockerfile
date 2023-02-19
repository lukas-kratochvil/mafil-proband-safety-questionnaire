#-------------------------------------------
# BUILD FOR DEVELOPMENT
#-------------------------------------------
FROM node:16-alpine AS development

WORKDIR /usr/src/app

# we do not want to run under the root user, we will use already created `node` user instead (created in the base `node` image)
# RUN chown -R node:node /usr/src
# USER node

COPY ["frontend/package.json", "frontend/package-lock.json", "./"]
RUN npm ci

# copy shared tsconfig file between the projects inside the monorepo.. must be in the parental folder of the `frontend` project
COPY tsconfig.base.json ../.
COPY ./frontend .


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
FROM nginx:1.23.3-alpine AS production

# we do not want to run under the root user, we will use already created `node` user instead (created in the base `node` image)
# RUN chown -R node:node /usr/src/app
# USER node

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY ./nginx /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
