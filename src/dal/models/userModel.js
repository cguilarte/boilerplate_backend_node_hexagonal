import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    verify_code: String,
    code_change_password: String,
    status: Boolean,
    deleted: Boolean,
    verified_account: Boolean,
  },
  { timestamps: {} },
);

const userModel = model('User', userSchema);

module.exports = userModel;
