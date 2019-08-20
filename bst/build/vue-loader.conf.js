'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: process.env.NODE_ENV === 'production'
    ? config.build.productionSourceMap
    : process.env.NODE_ENV === 'testing'
    ? config.testing.productionSourceMap
    : config.dev.cssSourceMap,
    // sourceMap: isProduction
    //   ? config.build.productionSourceMap
    //   : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
