import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-fallback-key-do-not-use-in-production';

export interface JwtPayload {
  userId: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) return null;
  
  return verifyToken(token);
}
