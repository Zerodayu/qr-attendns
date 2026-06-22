const forbidden = (message: string) => ({ error: message });

export function requireTeacherPlan(
  session: { user: { role: string[]; plan: string } },
  set: { status: number },
): { error: string } | undefined {
  if (!session.user.role.includes("teacher")) {
    set.status = 403;
    return forbidden("Only teachers can perform this action");
  }

  if (session.user.plan === "free") {
    set.status = 403;
    return forbidden("Teachers must have an active subscription");
  }
}
