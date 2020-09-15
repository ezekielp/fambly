# PHASE ONE
# Compile frontend assets
# Since we're only using Node to generate our JS bundle,
# we will use a multi-stage build to keep the image small
# The below Node layers will not be included in the final image

# Set up the image aliased as `build`
FROM node:12.18.3-alpine as build

# Set working directory inside node
WORKDIR /usr/src/node_app

# Set environment variables — they must be included in Dockerfile (???)
ARG NODE_ENV=production

# Add node_modules to our path
ENV PATH /usr/src/node_app/node_modules/.bin:$PATH

# Copy over our package.json
COPY package.json /usr/src/node_app/package.json

# Install dependencies 'silently' so we don't have to
# watch the whole thing download every time
RUN yarn install --silent

# Copy over the rest of our file(s?) so Webpack will be able bundle it
COPY . /usr/src/node_app

# Apparently this is a very important line for this build process!
# It's where we 'create our bundle files that we will copy over later'
RUN yarn run postinstall
# 'yarn run postinstall' will (hopefully) run the command: "webpack --mode=production"




