const { redisClient } = require('./signin');

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      code: 'ERR_UNAUTHORIZED',
      message: 'No auth token provided',
    });
  }

  const token = authorization.startsWith('Bearer ') ? authorization.substring(7, authorization.length) : authorization;

  return redisClient.get(token, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json({
        code: 'ERR_AUTH_TOKEN_EXPIRED',
        message: 'Auth token expired',
      });
    }
    return next();
  });
};

module.exports = {
  requireAuth,
};
