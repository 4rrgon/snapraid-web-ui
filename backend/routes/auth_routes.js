// routes/auth_routes.js
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { login } from '../data/users.js';

const router = Router();
const JWT_COOKIE_NAME = 'auth_token';
const TOKEN_EXPIRY = '2h';

router.route('/login').post(async (req, res) => {
  try {
    const { email, password } = req.body;

    const missing = [];
    if (!email) missing.push('email');
    if (!password) missing.push('password');

    if (missing.length > 0) {
      return res.status(400).json({
        error: `The missing fields are: ${missing.join(', ')}`
      });
    }

    const user = await login(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const secret = process.env.SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Server misconfiguration: SECRET missing' });
    }

    const token = jwt.sign(
      {
        companyName: user.companyName,
        email: user.email,
        role: user.role
      },
      secret,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000
    });

    return res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ error: e?.message || String(e) });
  }
});

router.route('/signout').get(async (req, res) => {
  try {
    res.clearCookie(JWT_COOKIE_NAME, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    return res.status(200).json({ message: 'Successfully signed out' });
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route('/me').get(async (req, res) => {
  try {
    const token = req.cookies?.[JWT_COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const secret = process.env.SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Server misconfiguration: SECRET missing' });
    }

    const decoded = jwt.verify(token, secret);
    return res.status(200).json(decoded);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;