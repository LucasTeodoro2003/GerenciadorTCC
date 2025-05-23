import NextAuth, { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials";
import db from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { schema } from "./schema";
import { v4 as uuid } from "uuid";
import { encode } from "@auth/core/jwt";
import bcrypt from "bcryptjs";

const adapter = PrismaAdapter(db);

export const { handlers, auth, signIn } = NextAuth({
  adapter: adapter,
  providers: [
    GitHub,
    Google,
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
          },
        });
        if (!user || !user.password) {
          throw new CredentialsSignin("Usuário não encontrado!");
        }
        const valid = bcrypt.compareSync(validateCredentials.password, user.password)
        if (!valid) {
          throw new CredentialsSignin("Senha incorreta!");
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
          expires: new Date(Date.now() + 10 * 60 * 1000)
        });

        if (!createdSession) {
          throw new Error("Erro ao criar sessão");
        }
        return sessionToken;
      }
      return encode(params);
    },
  },
});
