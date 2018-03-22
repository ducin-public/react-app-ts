// by default, `json-server` supports `_limit` parameter to determine size of returned collection.
// following (so called middleware) function allows a different param name (`limit`) to be used.

module.exports = (req, res, next) => {
  if (req.query.limit) {
    console.info(`Rewriting limit=${req.query.limit} query string param to supported _limit`)
    req.query._limit = req.query.limit
  }
  next()
}

