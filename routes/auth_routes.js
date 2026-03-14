import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { login as loginUser } from '../data/users.js'; 

const router = Router();
const JWT_COOKIE_NAME = 'auth_token';
const TOKEN_EXPIRY = '2h';

router
  .route('/login')
  .post(async (req, res) => {
    try {
      let email = req.body.email;
      let password = req.body.password;

      let missing = [];
      if (!email) missing.push('email');
      if (!password) missing.push('password');
      if (missing.length > 0) {
        return res.status(400).render('register', {
          error: `The missing fields are: ${missing.join(', ')}`
        });
      }

      const user = await loginUser(email, password);

      const payload = {
        companyName: user.companyName,
        email: user.email,
        role: user.role
      };

      const secret = process.env.SECRET;
      if (!secret) {
        return res.status(500).json({ error: 'Server misconfiguration: SECRET missing' });
      }

      const token = jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY });

      res.cookie(JWT_COOKIE_NAME, token, {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax', 
        maxAge: 2 * 60 * 60 * 1000
      });

      return res.status(200).json(user);
    } catch (e) {
      return res.status(400).json({ error: e.toString ? e.toString() : e });
    }
  });

router.route('/signout').get(async (req, res) => {
  try {
    res.clearCookie(JWT_COOKIE_NAME, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    res.status(200).json({ message: 'Successfully signed out' });
  } catch (e) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router