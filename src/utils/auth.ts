import * as jose from 'jose';

const SECRET = new TextEncoder().encode(
  import.meta.env.VITE_JWT_SECRET || 'your-secret-key-at-least-32-characters-long-123456'
);

export async function signToken(payload: any) {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET);
  return jwt;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}
