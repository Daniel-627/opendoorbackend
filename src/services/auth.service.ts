import { db } from "../db/db";
import { users, auth_credentials, user_roles } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { SignupDTO, LoginDTO } from "../dtos/auth.dtos";
import { signAccessToken } from "../utils/jwt";
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

    if (!email && !phone) {
      throw new Error("Email or phone is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    // =========================
    // 1️⃣ Prevent duplicate email
    // =========================
    if (email) {
      const existingEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingEmail.length > 0) {
        throw new Error("Email already in use");
      }
    }

    // =========================
    // 2️⃣ Prevent duplicate phone
    // =========================
    if (phone) {
      const existingPhone = await db
        .select()
        .from(users)
        .where(eq(users.phone_number, phone));

      if (existingPhone.length > 0) {
        throw new Error("Phone number already in use");
      }
    }

    const identifierValue = email ? email : phone!;
    const identifierType = email ? "email" : "phone";

    // =========================
    // 3️⃣ Prevent duplicate credential identifier
    // =========================
    const existingCredential = await db
      .select()
      .from(auth_credentials)
      .where(
        and(
          eq(auth_credentials.identifier, identifierValue),
          eq(auth_credentials.identifier_type, identifierType)
        )
      );

    if (existingCredential.length > 0) {
      throw new Error("Identifier already in use");
    }

    // =========================
    // 4️⃣ Create user
    // =========================
    const userResult = await db
      .insert(users)
      .values({
        email,
        phone_number: phone,
        full_name: fullName,
      })
      .returning({ id: users.id });

    const userId = userResult[0]?.id;

    if (!userId) {
      throw new Error("Failed to create user");
    }

    // =========================
    // 5️⃣ Create credentials
    // =========================
    const hashedPassword = await hashPassword(password);

    await db.insert(auth_credentials).values({
      user_id: userId,
      identifier: identifierValue,
      identifier_type: identifierType,
      password_hash: hashedPassword,
    });

    // =========================
    // 6️⃣ Assign default role (tenant)
    // =========================
    const roles = ["tenant"];

    await db.insert(user_roles).values({
      user_id: userId,
      role: "tenant",
      status: "active",
    });

    // =========================
    // 7️⃣ Issue JWT
    // =========================
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

    if (!identifier) {
      throw new Error("Identifier is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    // =========================
    // 1️⃣ Find credential
    // =========================
    const credentialRows = await db
      .select()
      .from(auth_credentials)
      .where(eq(auth_credentials.identifier, identifier));

    const credential = credentialRows[0];

    if (!credential) {
      throw new Error("Invalid credentials");
    }

    // =========================
    // 2️⃣ Verify password
    // =========================
    const validPassword = await verifyPassword(
      password,
      credential.password_hash
    );

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    const userId = credential.user_id;

    // =========================
    // 3️⃣ Fetch ACTIVE roles only
    // =========================
    const rolesRows = await db
      .select()
      .from(user_roles)
      .where(
        and(
          eq(user_roles.user_id, userId),
          eq(user_roles.status, "active")
        )
      );

    const roles = rolesRows.map((r) => r.role);

    // =========================
    // 4️⃣ Issue JWT
    // =========================
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
  // Logout (stateless JWT)
  // =========================
  static async logout() {
    return;
  }
}
