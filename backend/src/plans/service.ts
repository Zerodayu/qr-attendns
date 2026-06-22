import db from "@drizzle";
import { planFeature } from "@drizzle/schema";
import { eq, and } from "drizzle-orm";

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  essential: 1,
  premium: 2,
};

export function meetsMinimumPlan(userPlan: string, minimum: string): boolean {
  return (PLAN_HIERARCHY[userPlan] ?? 0) >= (PLAN_HIERARCHY[minimum] ?? 0);
}

export async function hasFeatureAccess(
  userPlan: string,
  featureKey: string,
): Promise<boolean> {
  const row = await db
    .select({ isEnabled: planFeature.isEnabled })
    .from(planFeature)
    .where(
      and(
        eq(planFeature.plan, userPlan),
        eq(planFeature.featureKey, featureKey),
      ),
    )
    .limit(1)
    .then((rows) => rows[0]);

  return row?.isEnabled ?? false;
}

export async function getEnabledFeatures(userPlan: string): Promise<string[]> {
  const rows = await db
    .select({ featureKey: planFeature.featureKey })
    .from(planFeature)
    .where(
      and(eq(planFeature.plan, userPlan), eq(planFeature.isEnabled, true)),
    );

  return rows.map((r) => r.featureKey);
}
