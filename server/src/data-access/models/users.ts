/* eslint-disable func-names */
import mongoose, { Schema, Document } from 'mongoose';
import crypt from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface AuthJSON {
  _id: string;
  username: string;
  jwt: string;
}

export interface IUser extends Document {
  email: string;
  username: string;
  hash: string;
  salt: string;
  validatePassword: (password: string) => boolean
}

export const UserSchema = new mongoose.Schema({
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
  this.salt = bcrypt.genSaltSync();
  this.hash = bcrypt.hashSync(password, this.salt);

  return true;
};

UserSchema.methods.validatePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
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

export default mongoose.model<IUser>('Users', UserSchema);
