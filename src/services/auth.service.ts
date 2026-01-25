import { db } from "../db/db";
import { users, auth_credentials, auth_sessions, user_roles } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { SignupDTO, LoginDTO } from "../dtos/auth.dtos";
import { v4 as uuid } from "uuid";
import { eq, and } from "drizzle-orm";

export class AuthService {
  // =========================
  // Signup
  // =========================
  static async signup(data: SignupDTO) {
    const { email, phone, password, fullName, provider } = data;

    if (provider === "google") {
      throw new Error("Google signup not implemented yet");
    }

    if (!email && !phone) throw new Error("Email or phone is required");
    if (!password) throw new Error("Password is required");

    // 🔒 Hard type narrowing
    const identifierValue: string = email ? email : (phone as string);

    // Create user
    const userResult = await db.insert(users).values({
      email,
      phone_number: phone,
      full_name: fullName,
    }).returning({ id: users.id });

    if (!userResult[0]) throw new Error("Failed to create user");
    const userId = userResult[0].id;

    // Create credentials
    const hashed = await hashPassword(password);
    await db.insert(auth_credentials).values({
      user_id: userId,
      identifier: identifierValue,
      identifier_type: email ? "email" : "phone",
      password_hash: hashed,
    });

    // Assign default tenant role
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

  // =========================
  // Login
  // =========================
  static async login(data: LoginDTO) {
    const { identifier, password, provider } = data;

    if (provider === "google") {
      throw new Error("Google login not implemented yet");
    }

    if (!identifier) throw new Error("Identifier is required");
    if (!password) throw new Error("Password is required");
    const safeIdentifier: string = identifier; // 🔒 hard narrow

    // Find credentials
    const credentialRows = await db
      .select()
      .from(auth_credentials)
      .where(eq(auth_credentials.identifier, safeIdentifier));

    const credential = credentialRows[0];
    if (!credential) throw new Error("Invalid credentials");

    const valid = await verifyPassword(password, credential.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    const userId = credential.user_id;

    // Create session
    const sessionToken = uuid();
    await db.insert(auth_sessions).values({
      user_id: userId,
      session_token: sessionToken,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    // Fetch roles
    const rolesRows = await db
      .select()
      .from(user_roles)
      .where(eq(user_roles.user_id, userId));

    const roles = rolesRows.map(r => r.role);

    return { userId, roles, sessionToken };
  }

  // =========================
  // Logout
  // =========================
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
