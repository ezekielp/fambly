const { environment } = require('@rails/webpacker');
const webpack = require('webpack');
const dotenv = require('dotenv');

const result = dotenv.config();

environment.plugins.prepend(
  'Environment',
  new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(process.env))),
);

module.exports = environment;
