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



# PHASE TWO
# Built base image? With Ruby and other essentials
FROM ruby:2.7.1-alpine

# The 'no-cache' flag is apparently so that the image
# isn't 'clogged up with things we are downloading'
RUN apk add --no-cache --update build-base \
  linux-headers \
  git \
  postgresql-dev \
  nodejs \
  tzdata

# Set environment variables
ARG DATABASE_URL="postgres://postgres@db"
ARG RAILS_ENV=production

# Copy over Gemfile
WORKDIR /my_app
COPY Gemfile /my_app/Gemfile
COPY Gemfile.lock /my_app/Gemfile.lock

# Run 'gem install bundler' due to a specific issue with
# bundler 2.0, then we can 'bundle install'
RUN gem install bundler && bundle install
COPY . /my_app

# Copy over the bundled JS files from earlier
COPY --from=build /usr/src/node_app/app/assets/javascripts/bundle.js ./app/assets/javascripts/
COPY --from=build /usr/src/node_app/app/assets/javascripts/bundle.js.map ./app/assets/javascripts/

# Add the 'entrypoint.sh' script to be executed every time the container starts
# to deal with a Rails-specific Docker issue
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# Expose our port
EXPOSE 3000

# Start the main process
CMD ["rails", "server", "-b", "0.0.0.0"]
