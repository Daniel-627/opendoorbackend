import { db } from "../../db/db";
import {
  lease_applications,
  leases,
  lease_tenants,
} from "../../db/schema";
import { eq } from "drizzle-orm";

export class LeasesService {
  static async createFromApplication(
    applicationId: string,
    data: {
      start_date: string;
      rent_cycle: "monthly" | "quarterly" | "yearly";
      deposit_amount: string;
      tenancy_type?: "residential" | "commercial";
    }
  ) {
    const tenancyTypeMap: Record<
      "residential" | "commercial",
      "single" | "shared"
    > = {
      residential: "single",
      commercial: "shared",
    };

    if (!data) {
      throw new Error("Lease data is required");
    }

    const dbTenancyType = data.tenancy_type
      ? tenancyTypeMap[data.tenancy_type]
      : undefined;

    // 1️⃣ Load application
    const application = await db
      .select()
      .from(lease_applications)
      .where(eq(lease_applications.id, applicationId))
      .then((r) => r[0]);

    if (!application) {
      throw new Error("Application not found");
    }

    if (application.status !== "approved") {
      throw new Error("Application is not approved");
    }

    // 2️⃣ Create lease → directly move to processing_activation
    const leaseRows = await db
      .insert(leases)
      .values({
        unit_id: application.unit_id,
        start_date: data.start_date,
        rent_cycle: data.rent_cycle,
        deposit_amount: data.deposit_amount,
        tenancy_type: dbTenancyType,
        status: "processing_activation",
      })
      .returning();

    const lease = leaseRows[0];
    if (!lease) {
      throw new Error("Failed to create lease");
    }

    // 3️⃣ Link tenant
    await db.insert(lease_tenants).values({
      lease_id: lease.id,
      user_id: application.applicant_id,
      role: "primary",
    });

    return lease;
  }
}