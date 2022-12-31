export default (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const apiKey = Buffer.from(b64auth, 'base64').toString();

  if (apiKey === process.env.PRIVATE_API_KEY) {
    next();
  } else {
    res.status(401);
    res.send('Access forbidden');
  }
};
