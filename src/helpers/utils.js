import bcrypt from 'bcryptjs';

export const passworBcrypt = async (password) => {
  const salt = await bcrypt.genSalt(11);
  return bcrypt.hash(password, salt);
};
