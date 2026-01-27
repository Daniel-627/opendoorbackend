export interface SignupDTO {
  email?: string;
  phone?: string;
  password?: string;
  fullName?: string;
  provider?: "google";
  idToken?: string;
}

export interface LoginDTO {
  identifier?: string; // email or phone
  password?: string;
  provider?: "google";
  idToken?: string;
}