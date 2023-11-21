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

# Jednotné přihlášení MUNI client_id is set in the GitHub Actions
ARG JPM_CLIENT_ID
# App bar color to differentiate environments is set in the GitHub Actions
ARG APP_BAR_COLOR

RUN VITE_JPM_CLIENT_ID=$JPM_CLIENT_ID VITE_APP_BAR_COLOR=$APP_BAR_COLOR npm run build

RUN npm ci --omit='dev' && npm cache clean --force


#-------------------------------------------
# PRODUCTION
#-------------------------------------------
FROM nginx:1.23.3-alpine AS production

COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html

COPY ./frontend/nginx /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
