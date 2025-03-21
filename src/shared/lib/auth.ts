import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import db from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { schema } from "./schema";
import { v4 as uuid } from "uuid";
import { encode } from "@auth/core/jwt";

const adapter = PrismaAdapter(db);

export const { handlers, auth, signIn } = NextAuth({
  adapter: adapter,
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validateCredentials = schema.parse(credentials);

        const user = await db.user.findFirst({
          where: {
            email: validateCredentials.email,
            password: validateCredentials.password,
          },
        });
        if (!user) {
          throw new Error("Credenciais Invalidas!");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();
        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }
        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }
        return sessionToken;
      }
      return encode(params);
    },
  },
});
