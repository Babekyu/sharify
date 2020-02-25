import express from 'express';
import mongoose from 'mongoose';
import auth from '../../authentication';
import { IUser, UserSchema } from '../../../data-access/models/users';

const Users = mongoose.model('Users', UserSchema);
const router = express.Router();

router.post('/', auth.optional, (req, res) => {
  if (!req.body || !req.body.user) {
    return res.status(422).json({
      failed: true,
      errors: {
        user: 'is required',
      },
    });
  }
  const {
    body: { user },
  } = req;
  if (!user.username) {
    return res.status(422).json({
      failed: true,
      errors: {
        username: 'is required',
      },
    });
  }

  if (!user.name) {
    return res.status(422).json({
      failed: true,
      errors: {
        name: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      failed: true,
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new Users(user) as IUser;

  finalUser.setPassword(user.password);

  return finalUser
    .save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }))
    .catch(() => res.status(500).json({
      failed: true,
      errors: {
        db: 'data base failure',
      },
    }));
});

export default router;
