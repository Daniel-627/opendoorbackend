import { db } from "../db/db";
import { users, auth_credentials, auth_sessions, user_roles } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { SignupDTO, LoginDTO } from "../dtos/auth.dtos";
import { v4 as uuid } from "uuid";
import { eq, and } from "drizzle-orm";

export class AuthService {
  
  static async signup(data: SignupDTO) {
  const { email, phone, password, fullName, provider } = data;

  if (provider === "google") {
    throw new Error("Google signup not implemented yet");
  }

  // Create user
  const userResult = await db
    .insert(users)
    .values({
      email,
      phone_number: phone ?? null,
      full_name: fullName,
    })
    .returning({ id: users.id });

  const userId = userResult[0]?.id;
  if (!userId) throw new Error("Failed to create user");

  // Create credentials (EMAIL ONLY)
  const hashed = await hashPassword(password);

  await db.insert(auth_credentials).values({
    user_id: userId,
    identifier: email,
    identifier_type: "email",
    password_hash: hashed,
  });

  // Assign default role
  await db.insert(user_roles).values({
    user_id: userId,
    role: "tenant",
    status: "active",
  });

  // Create session
  const sessionToken = uuid();
  await db.insert(auth_sessions).values({
    user_id: userId,
    session_token: sessionToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    id: userId,
    email,
    phone,
    roles: ["tenant"],
    sessionToken,
  };
}


  
  static async login(data: LoginDTO) {
  const { email, password, provider } = data;

  if (provider === "google") {
    throw new Error("Google login not implemented yet");
  }

  const credentialRows = await db
    .select()
    .from(auth_credentials)
    .where(
      and(
        eq(auth_credentials.identifier, email),
        eq(auth_credentials.identifier_type, "email")
      )
    );

  const credential = credentialRows[0];
  if (!credential) throw new Error("Invalid credentials");

  const valid = await verifyPassword(password, credential.password_hash);
  if (!valid) throw new Error("Invalid credentials");

  const sessionToken = uuid();

  await db.insert(auth_sessions).values({
    user_id: credential.user_id,
    session_token: sessionToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const rolesRows = await db
    .select()
    .from(user_roles)
    .where(eq(user_roles.user_id, credential.user_id));

  return {
    userId: credential.user_id,
    roles: rolesRows.map(r => r.role),
    sessionToken,
  };
}

}
