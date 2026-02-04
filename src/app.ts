import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Auth
import { authRoutes } from "./routes/auth.routes";

// Public
import publicPropertiesRoutes from "./routes/public/properties.routes";
import publicUnitsRoutes from "./routes/public/units.routes";

// Owner
import ownerPropertiesRoutes from "./routes/owner/properties.routes";
import ownerUnitsRoutes from "./routes/owner/unit.routes";

// Lease
import leaseApplicationsRoutes from "./routes/lease/applications.routes";
import leaseCreationRoutes from "./routes/lease/lease-applications.routes";
import leasesRoutes from "./routes/lease/leases.routes";

// Finance
import balanceRoutes from "./routes/finance/balance.routes";
import invoicesRoutes from "./routes/finance/invoices.routes";
import ledgerRoutes from "./routes/finance/ledger.routes";


export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  /**
   * Health check
   */
  app.get("/open", (_req, res) => {
    res.json({ status: "ok", message: "OpenDoor backend running" });
  });

  /**
   * Auth
   */
  app.use("/auth", authRoutes);

  /**
   * Public (no auth)
   */
  app.use("/public/properties", publicPropertiesRoutes);
  app.use("/public/units", publicUnitsRoutes);

  /**
   * Owner
   */
  app.use("/owner/properties", ownerPropertiesRoutes);
  app.use("/owner/units", ownerUnitsRoutes);

  /**
   * Lease domain
   */
  app.use("/lease/applications", leaseApplicationsRoutes);
  app.use("/lease", leaseCreationRoutes); // /applications/:id/lease
  app.use("/lease", leasesRoutes);        // /leases/:leaseId

  /**
   * Finance domain
   */
  app.use("/finance/balance", balanceRoutes);
  app.use("/finance/invoices", invoicesRoutes);
  app.use("/finance/ledger", ledgerRoutes);

  /**
   * Global error handler
   */
  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}
