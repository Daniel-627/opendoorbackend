import { db } from "../db/db";
import { users, auth_credentials, user_roles } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { SignupDTO, LoginDTO } from "../dtos/auth.dtos";
import { signAccessToken } from "../utils/jwt";
import { eq } from "drizzle-orm";

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

    const identifierValue: string = email ? email : phone!;

    // 1️⃣ Create user
    const userResult = await db
      .insert(users)
      .values({
        email,
        phone_number: phone,
        full_name: fullName,
      })
      .returning({ id: users.id });

    const userId = userResult[0]?.id;
    if (!userId) throw new Error("Failed to create user");

    // 2️⃣ Create credentials
    const hashed = await hashPassword(password);
    await db.insert(auth_credentials).values({
      user_id: userId,
      identifier: identifierValue,
      identifier_type: email ? "email" : "phone",
      password_hash: hashed,
    });

    // 3️⃣ Assign default role
    const roles = ["tenant"];

    await db.insert(user_roles).values({
      user_id: userId,
      role: "tenant",
      status: "active",
    });

    // 4️⃣ Issue JWT (WITH ROLES)
    const accessToken = signAccessToken({
      userId,
      roles,
    });

    return {
      id: userId,
      email,
      phone,
      roles,
      accessToken,
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

    // 1️⃣ Find credentials
    const credentialRows = await db
      .select()
      .from(auth_credentials)
      .where(eq(auth_credentials.identifier, identifier));

    const credential = credentialRows[0];
    if (!credential) throw new Error("Invalid credentials");

    // 2️⃣ Verify password
    const valid = await verifyPassword(password, credential.password_hash);
    if (!valid) throw new Error("Invalid credentials");

    const userId = credential.user_id;

    // 3️⃣ Fetch roles
    const rolesRows = await db
      .select()
      .from(user_roles)
      .where(eq(user_roles.user_id, userId));

    const roles = rolesRows.map(r => r.role);

    // 4️⃣ Issue JWT (WITH ROLES)
    const accessToken = signAccessToken({
      userId,
      roles,
    });

    return {
      userId,
      roles,
      accessToken,
    };
  }

  // =========================
  // Logout (stateless)
  // =========================
  static async logout() {
    // JWT logout = clear cookie on client
    return;
  }
}
