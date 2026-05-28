function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateAuthPayload(req, res, next) {
  const { email, password } = req.body || {};
  if (!isNonEmptyString(email) || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!isNonEmptyString(password) || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  return next();
}

export function validateGeneratePayload(req, res, next) {
  const payload = req.body || {};
  const count = Number(payload.numIdeas || payload.topicCount || 3);
  if (!Number.isFinite(count) || count < 1 || count > 20) {
    return res.status(400).json({ error: 'numIdeas/topicCount must be between 1 and 20' });
  }

  if (payload.platforms && !Array.isArray(payload.platforms)) {
    return res.status(400).json({ error: 'platforms must be an array' });
  }
  if (payload.numPosts !== undefined) {
    const numPosts = Number(payload.numPosts);
    if (!Number.isFinite(numPosts) || numPosts < 1 || numPosts > 100) {
      return res.status(400).json({ error: 'numPosts must be between 1 and 100' });
    }
  }
  if (payload.topic !== undefined && typeof payload.topic !== 'string') {
    return res.status(400).json({ error: 'topic must be a string' });
  }

  return next();
}

export function validatePostPatchPayload(req, res, next) {
  const { content, scheduledFor } = req.body || {};
  if (content !== undefined && typeof content !== 'string') {
    return res.status(400).json({ error: 'content must be a string' });
  }

  if (scheduledFor !== undefined && scheduledFor !== null) {
    const parsed = new Date(scheduledFor);
    if (Number.isNaN(parsed.getTime())) {
      return res.status(400).json({ error: 'Invalid scheduledFor date' });
    }
  }

  return next();
}
