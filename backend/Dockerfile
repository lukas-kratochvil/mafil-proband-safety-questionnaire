#-------------------------------------------
# BUILD FOR DEVELOPMENT
#-------------------------------------------
FROM node:20-alpine AS development

WORKDIR /usr/src/app/backend

# No need to install pnpm globally as Corepack will handle pnpm for us as long as our package.json has a `packageManager` field
RUN corepack enable pnpm

COPY ["backend/package.json", "backend/pnpm-lock.yaml", "./"]
RUN pnpm i --frozen-lockfile

COPY backend/prisma ./prisma
RUN pnpm exec prisma generate

# Copy shared tsconfig file between the projects inside the monorepo.. must be in the parental folder of the `backend` project.
COPY tsconfig.base.json ../.
COPY ./backend .


#-------------------------------------------
# BUILD FOR PRODUCTION
#-------------------------------------------
FROM development AS build

# Build with devDependencies because we use TypeScript, Nest CLI etc. in the build process and then we generate the production-ready 'node_modules'.
RUN pnpm build && \
    pnpm i --prod --frozen-lockfile

#-------------------------------------------
# PRODUCTION
#-------------------------------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# No need to install pnpm globally as Corepack will handle pnpm for us as long as our package.json has a `packageManager` field
RUN corepack enable pnpm

COPY --from=build ["/usr/src/app/backend/package.json", "/usr/src/app/backend/pnpm-lock.yaml", "./"]
COPY --from=build /usr/src/app/backend/{node_modules,dist,assets,prisma} ./

CMD [ "pnpm", "start:migrate:prod" ]
