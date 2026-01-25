import { User } from "../db/schema/users"; // Drizzle-generated type

declare global {
  namespace Express {
    interface Request {
      user?: typeof users.$inferSelect;
    }
  }
}
