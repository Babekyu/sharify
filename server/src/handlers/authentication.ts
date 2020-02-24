import { Request, Response } from 'express';
import passport from 'passport';

const handleLocalLogin = () => {
  passport.authenticate('local');
};

export default {
  handleLocalLogin,
};
