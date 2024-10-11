#-------------------------------------------
# BUILD FOR DEVELOPMENT
#-------------------------------------------
FROM node:20-alpine AS development

WORKDIR /usr/src/app/frontend

# No need to install pnpm globally as Corepack will handle pnpm for us as long as our package.json has a `packageManager` field
RUN corepack enable pnpm

COPY ["frontend/package.json", "frontend/pnpm-lock.yaml", "./"]
RUN pnpm i --frozen-lockfile

# Copy shared tsconfig file between the projects inside the monorepo.. must be in the parental folder of the `frontend` project.
COPY tsconfig.base.json ../.
COPY ./frontend .


#-------------------------------------------
# BUILD FOR PRODUCTION
#-------------------------------------------
FROM development AS build

# Build with devDependencies because we use TypeScript, Vite etc. in the build process and then we generate the production-ready 'node_modules'.
RUN pnpm build && \
    pnpm i --prod --frozen-lockfile

#-------------------------------------------
# PRODUCTION
#-------------------------------------------
FROM nginx:1.25.5-alpine AS production

# Problem of specifying custom ENTRYPOINT shell script in Nginx image: https://github.com/nginxinc/docker-nginx/issues/422#issuecomment-644299743
# That's why we copy our script to the '/docker-entrypoint.d' directory. Scripts inside this directory are executed before Nginx is.
COPY ./frontend/config-copy.sh /docker-entrypoint.d/config-copy.sh
RUN chmod +x /docker-entrypoint.d/config-copy.sh

COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html

COPY ./frontend/nginx /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
