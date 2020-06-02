const jwt = require('jsonwebtoken');

const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '2 days' });
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  const { exp } = jwt.decode(token);
  const expiresIn = new Date(exp * 1000).toISOString();
  return setToken(token, id)
    .then(() => ({ authToken: token, expiresIn }))
    .catch(console.log);
};

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then((user) => user[0])
          .catch(() => res.status(400).json('unable to get user'));
      }
      throw new Error('wrong credentials');
    })
    .catch(console.log);
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send('Unauthorized');
    }
    return res.json({ id: reply });
  });
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
      .then((data) => (data.id && data.email ? createSession(data) : Promise.reject(data)))
      .then((session) => res.json(session))
      .catch((err) => res.status(400).json(err));
};

module.exports = {
  signinAuthentication,
  redisClient,
};
