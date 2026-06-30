import { env } from "@/env";

export const DevEnv = ({ children }: { children: React.ReactNode }) => {
  if (!env.DEV_ENV) {
    return <>{children}</>;
  }

  return (
    <section>
      <span className="pointer-events-none fixed top-auto bottom-0 z-100 flex w-full items-center justify-center bg-muted/30 backdrop-blur-sm">
        This is a Development environment using —{" "}
        <code className="rounded-sm bg-accent px-1">.env.dev</code>
      </span>
      {children}
    </section>
  );
};
