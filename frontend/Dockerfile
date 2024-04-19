#-------------------------------------------
# BUILD FOR DEVELOPMENT
#-------------------------------------------
FROM node:18-alpine AS development

WORKDIR /usr/src/app/frontend

COPY ["frontend/package.json", "frontend/package-lock.json", "./"]
RUN npm ci

# copy shared tsconfig file between the projects inside the monorepo.. must be in the parental folder of the `frontend` project
COPY tsconfig.base.json ../.
COPY ./frontend .


#-------------------------------------------
# BUILD FOR PRODUCTION
#-------------------------------------------
FROM node:18-alpine AS build

WORKDIR /usr/src/app/frontend

COPY --from=development ["/usr/src/app/frontend/package.json", "/usr/src/app/frontend/package-lock.json", "./"]
COPY --from=development /usr/src/app/frontend/node_modules ./node_modules
COPY --from=development /usr/src/app/. ../.

# build with devDependencies because we use Vite, TypeScript etc. in the build process and then we generate the production-ready node_modules
RUN npm run build
RUN npm ci --omit='dev' && npm cache clean --force


#-------------------------------------------
# PRODUCTION
#-------------------------------------------
FROM nginx:1.25.5-alpine AS production

# inject environment variables into the Nginx container JavaScript files using the start-nginx.sh script
# that's how we do it: https://developers.redhat.com/blog/making-environment-variables-accessible-in-front-end-containers
ENV JSFILES=/usr/share/nginx/html/assets/*.js
COPY ./frontend/start-nginx.sh /usr/bin/start-nginx.sh
RUN chmod +x /usr/bin/start-nginx.sh

COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html

COPY ./frontend/nginx /etc/nginx

# install bash to be able to execute start-nginx.sh script
RUN apk add --no-cache bash

ENTRYPOINT ["start-nginx.sh"]
