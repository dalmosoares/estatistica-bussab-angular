const webpack = require('webpack');

module.exports = (config, options, targetOptions) => {
  config.plugins.push(new webpack.ContextReplacementPlugin(/fs/, /pt-br/));

  return config;
};