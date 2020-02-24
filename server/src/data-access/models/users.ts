/* eslint-disable func-names */
import mongoose from 'mongoose';
import crypt from 'crypto';
import jwt from 'jsonwebtoken';
import { HASH_ITERATIONS, HASH_LENGTH } from '../config/constants';

export interface AuthJSON {
  _id: string;
  username: string;
  jwt: string;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
});

UserSchema.methods.setPassword = function (password: string): boolean {
  this.salt = crypt.randomBytes(16).toString('hex');
  this.hash = crypt.pbkdf2Sync(
    password,
    this.salt,
    HASH_ITERATIONS,
    HASH_LENGTH,
    'sha512',
  ).toString('hex');

  return true;
};

UserSchema.methods.validatePassword = function (password: string): boolean {
  const hash = crypt.pbkdf2Sync(
    password,
    this.salt,
    HASH_ITERATIONS,
    HASH_LENGTH,
    'sha512',
  ).toString('hex');

  return hash === this.hash;
};

UserSchema.methods.generateJWT = function (): string {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: Number(expirationDate.getTime() / 1000),
  }, process.env.USER_SECRET);
};

UserSchema.methods.toAuthJSON = function (): AuthJSON {
  return {
    _id: this._id,
    username: this.username,
    jwt: this.generateJWT(),
  };
};
