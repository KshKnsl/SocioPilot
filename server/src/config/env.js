const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'ENCRYPTION_KEY'];

export function validateEnv() {
  const missing = requiredVars.filter((name) => !process.env[name] || !String(process.env[name]).trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

export function getPort() {
  const port = Number(process.env.PORT || 4000);
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    throw new Error('Invalid PORT environment variable');
  }
  return port;
}
