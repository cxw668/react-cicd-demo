import * as jose from 'jose';

const SECRET = new TextEncoder().encode(
  'your-256-bit-secret-key-at-least-32-chars-long'
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
