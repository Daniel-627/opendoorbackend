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

    if (!email && !phone) throw new Error("Email or phone is required");
    if (!password) throw new Error("Password is required");

    const identifierValue = email ?? phone; // ✅ guaranteed string

    const userId = uuid();

    await db.insert(users).values({
      id: userId,
      email,
      phone_number: phone,
      full_name: fullName,
    });

    const hashed = await hashPassword(password);
    await db.insert(auth_credentials).values({
      id: uuid(),
      user_id: userId,
      identifier: identifierValue,
      identifier_type: email ? "email" : "phone",
      password_hash: hashed,
    });

    await db.insert(user_roles).values({
      id: uuid(),
      user_id: userId,
      role: "tenant",
      status: "active",
    });

    const sessionToken = uuid();
    await db.insert(auth_sessions).values({
      id: uuid(),
      user_id: userId,
      session_token: sessionToken,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
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
    const { identifier, password, provider } = data;

    if (provider === "google") {
      throw new Error("Google login not implemented yet");
    }

    const credentialRows = await db
      .select()
      .from(auth_credentials)
      .where(eq(auth_credentials.identifier, identifier));

    const credential = credentialRows[0];
    if (!credential) throw new Error("Invalid credentials");

    const valid = await verifyPassword(password, credential.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    const userId = credential.user_id;

    const sessionToken = uuid();
    await db.insert(auth_sessions).values({
      id: uuid(),
      user_id: userId,
      session_token: sessionToken,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    const rolesRows = await db
      .select()
      .from(user_roles)
      .where(eq(user_roles.user_id, userId));

    const roles = rolesRows.map(r => r.role);

    return { userId, roles, sessionToken };
  }

  static async logout(userId: string, sessionToken: string) {
    await db
      .delete(auth_sessions)
      .where(
        and(
          eq(auth_sessions.user_id, userId),
          eq(auth_sessions.session_token, sessionToken)
        )
      );
  }
}
