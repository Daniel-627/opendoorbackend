import jwt, { Secret, SignOptions, JwtPayload as JwtPayloadBase } from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

// Our payload type
export interface JwtPayload {
  userId: string;
  roles: string[];
}

/**
 * Sign JWT with payload
 */
export function signAccessToken(payload: JwtPayload): string {
  // force expiresIn to StringValue type
  const expiresIn: `${number}${"s" | "m" | "h" | "d" | "y"}` = 
    (process.env.JWT_EXPIRES_IN as `${number}${"s" | "m" | "h" | "d" | "y"}`) || "7d";

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload as JwtPayloadBase, JWT_SECRET, options);
}

/**
 * Verify JWT and return payload
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
