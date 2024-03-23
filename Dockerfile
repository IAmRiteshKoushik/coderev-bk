# Multi-stage build
# - Stage 1 : Completes the build process and stores all artifacts inside the 
#             build/ directory
# - Stage 2 : Takes the build artifacts from the build directory and moves 
#             them to app/ directory for running the server


# Stage 01
FROM node:18 as builder
WORKDIR /build

COPY package*.json
RUN npm install

COPY src/ src/
COPY tsconfig.json tsconfig.json

RUN npm run build

# Stage 02
FROM node:18 as runner
WORKDIR app/

COPY --from=builder build/package*.json
COPY --from=builder build/node_modules node_modules/
COPY --from=builder build/dist dist/

CMD [ "npm", "start" ]
