import jwt from 'jsonwebtoken';
import { Response } from 'express';
const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRE || '30d') as any,
  });
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
  return token;
};
export default generateToken;
