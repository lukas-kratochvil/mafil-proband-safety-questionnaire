#-------------------------------------------
# BUILD FOR DEVELOPMENT
#-------------------------------------------
FROM node:18-alpine AS development

WORKDIR /usr/src/app/frontend

COPY ["frontend/package.json", "frontend/package-lock.json", "./"]
RUN npm ci

# Copy shared tsconfig file between the projects inside the monorepo.. must be in the parental folder of the `frontend` project.
COPY tsconfig.base.json ../.
COPY ./frontend .


#-------------------------------------------
# BUILD FOR PRODUCTION
#-------------------------------------------
FROM development AS build

# Build with devDependencies because we use TypeScript, Vite etc. in the build process and then we generate the production-ready 'node_modules'.
RUN npm run build && \
    npm ci --omit='dev' && \
    npm cache clean --force


#-------------------------------------------
# PRODUCTION
#-------------------------------------------
FROM nginx:1.25.5-alpine AS production

COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html

COPY ./frontend/nginx /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
