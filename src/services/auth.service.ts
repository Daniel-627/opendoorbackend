import { db } from "../db/db"; // Drizzle client
import { hashPassword, verifyPassword } from "../utils/password";
import { SignupDTO, LoginDTO } from "../dtos/auth.dtos";
import { v4 as uuid } from "uuid";

export class AuthService {
  // Signup user
  static async signup(data: SignupDTO) {
    const { email, phone, password, fullName, provider, idToken } = data;

    if (provider === "google") {
      // 🔑 Placeholder: verify Google token
      // const googleUser = await verifyGoogleToken(idToken);
      // create user and auth_providers
    } else {
      if (!email && !phone) throw new Error("Email or phone is required");
      if (!password) throw new Error("Password is required");

      const userId = uuid();

      // 1️⃣ Create user
      await db.users.insert({
        id: userId,
        email,
        phone_number: phone,
        full_name: fullName,
      });

      // 2️⃣ Create credentials
      const hashed = await hashPassword(password);
      await db.auth_credentials.insert({
        id: uuid(),
        user_id: userId,
        identifier: email || phone!,
        identifier_type: email ? "email" : "phone",
        password_hash: hashed,
      });

      // 3️⃣ Assign default tenant role
      await db.user_roles.insert({
        id: uuid(),
        user_id: userId,
        role: "tenant",
        status: "active",
      });

      // 4️⃣ Create session (placeholder)
      const sessionToken = uuid();
      await db.auth_sessions.insert({
        id: uuid(),
        user_id: userId,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      });

      return {
        id: userId,
        email,
        phone,
        roles: ["tenant"],
        sessionToken,
      };
    }
  }

  // Login user
  static async login(data: LoginDTO) {
    const { identifier, password, provider, idToken } = data;

    if (provider === "google") {
      // 🔑 Placeholder: verify Google token and find auth_provider
    } else {
      // Find credentials
      const credential = await db.auth_credentials
        .select()
        .where("identifier", "=", identifier)
        .first();

      if (!credential) throw new Error("Invalid credentials");

      const valid = await verifyPassword(password, credential.password_hash);
      if (!valid) throw new Error("Invalid credentials");

      const userId = credential.user_id;

      // Create session
      const sessionToken = uuid();
      await db.auth_sessions.insert({
        id: uuid(),
        user_id: userId,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      // Fetch roles
      const roles = await db.user_roles
        .select()
        .where("user_id", "=", userId);

      return { userId, roles: roles.map(r => r.role), sessionToken };
    }
  }

  static async logout(userId: string, sessionToken: string) {
    await db.auth_sessions
      .delete()
      .where("user_id", "=", userId)
      .where("session_token", "=", sessionToken);
  }
}


