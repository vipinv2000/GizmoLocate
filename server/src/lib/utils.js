import jwt from 'jsonwebtoken';

export const generateToken = (id, res) => {
  const token = jwt.sign({ id }, "123456", { expiresIn: '7d' });
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    samesite:"strict",

  });

  return token
};
