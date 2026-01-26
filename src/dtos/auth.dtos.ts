export interface SignupDTO {
  email: string;          // ✅ required
  password: string;       // ✅ required
  fullName: string;       // ✅ required
  phone?: string;         // optional
  provider?: "local" | "google";
  idToken?: string;       // for future Google auth
}

export interface LoginDTO {
  email: string;          // ✅ required
  password: string;       // ✅ required
  provider?: "local" | "google";
  idToken?: string;
}
