// Simple IP allowlist middleware
// Supports exact IPs and /24 CIDR ranges (e.g. 74.220.48.0/24)

const allowed = [
  // Edit this array to add allowed IPs or /24 ranges
  '74.220.48.0/24',
  '74.220.56.0/24',
  '216.151.17.91',
  '216.151.17.92'
];

function normalizeIp(ip) {
  if (!ip) return '';
  // Express may provide IPv4-mapped IPv6 addresses like ::ffff:127.0.0.1
  if (ip.startsWith('::ffff:')) return ip.split('::ffff:')[1];
  // strip IPv6 zone id if present
  const percent = ip.indexOf('%');
  if (percent !== -1) ip = ip.substring(0, percent);
  return ip;
}

function ipInRange(ip, range) {
  if (range.includes('/24')) {
    const prefix = range.split('/')[0];
    const ipParts = ip.split('.')
    const prefixParts = prefix.split('.')
    if (ipParts.length !== 4 || prefixParts.length !== 4) return false;
    // compare first three octets
    return ipParts[0] === prefixParts[0] && ipParts[1] === prefixParts[1] && ipParts[2] === prefixParts[2];
  }
  // exact match
  return ip === range;
}

module.exports = function ipAllowlist(req, res, next) {
  const rawIp = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  const ip = normalizeIp(rawIp);
  if (!ip) return res.status(400).json({ message: 'Unable to determine client IP' });

  for (const r of allowed) {
    if (ipInRange(ip, r)) return next();
  }

  return res.status(403).json({ message: 'IP not allowed' });
};
