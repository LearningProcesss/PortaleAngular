var d = require('debug')("app:routeToMongoMiddleware")

module.exports = function(options) {
    return function(req, res, next) {
      d("middleaware", options)
      next()
    }
  }