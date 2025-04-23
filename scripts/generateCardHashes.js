// api/userHash.js
const crypto = require('crypto');

module.exports = (req, res) => {
  // Vercel sets x-forwarded-for to the real client IP
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.connection.remoteAddress || '0.0.0.0';

  const userHash = crypto
    .createHash('sha256')
    .update(ip)
    .digest('hex')
    .substring(0, 16);

  // cache briefly at the edge
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
  res.status(200).json({ userHash });
};
