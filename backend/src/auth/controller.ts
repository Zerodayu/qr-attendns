import { Elysia } from "elysia";
import { auth } from "./service";

export const authPlugin = new Elysia({ name: "auth" }).macro({
  auth: {
    async resolve({ request: { headers }, set }) {
      const session = await auth.api.getSession({ headers });

      if (!session) {
        set.status = 401;
        return;
      }

      return { session } as { session: typeof session };
    },
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: async (prefix = "api/v1/auth") => {
    const { paths } = await getSchema();
    const reference: any = Object.create(null);
    for (const path of Object.keys(paths)) {
      const key = prefix + path;
      reference[key] = paths[path];
      for (const method of Object.keys(paths[path])) {
        const operation = reference[key][method];
        operation.tags = ["Better Auth"];
      }
    }
    return reference;
  },
  components: getSchema().then(({ components }) => components),
};
