#-------------------------------------------
# BUILD FOR DEVELOPMENT
#-------------------------------------------
FROM node:18-alpine AS development

WORKDIR /usr/src/app/backend

COPY ["backend/package.json", "backend/package-lock.json", "./"]
RUN npm ci

COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy shared tsconfig file between the projects inside the monorepo.. must be in the parental folder of the `backend` project.
COPY tsconfig.base.json ../.
COPY ./backend .


#-------------------------------------------
# BUILD FOR PRODUCTION
#-------------------------------------------
FROM development AS build

# Build with devDependencies because we use TypeScript, Nest CLI etc. in the build process and then we generate the production-ready 'node_modules'.
RUN npm run build && \
    npm ci --omit='dev' && \
    npm cache clean --force


#-------------------------------------------
# PRODUCTION
#-------------------------------------------
FROM node:18-alpine AS production

WORKDIR /usr/src/app

COPY --from=build ["/usr/src/app/backend/package.json", "/usr/src/app/backend/package-lock.json", "./"]
COPY --from=build /usr/src/app/backend/node_modules ./node_modules
COPY --from=build /usr/src/app/backend/dist ./dist
COPY --from=build /usr/src/app/backend/assets ./assets
COPY --from=build /usr/src/app/backend/prisma ./prisma

CMD [ "npm", "run", "start:migrate:prod" ]
