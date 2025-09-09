import NextAuth, { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import db from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
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
        const valid = bcrypt.compareSync(validateCredentials.password, user.password);
        if (!valid) {
          throw new CredentialsSignin("Senha incorreta!");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider && account.provider !== "credentials") {
        const existingUser = await db.user.findFirst({
          where: { email: user.email },
        });
        if (existingUser) {
          const existingAccount = await db.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account.provider,
            },
          });

          if (!existingAccount) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
          user.id = existingUser.id;
        }
      }
      return true;
    },
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
          expires: new Date(Date.now() + 10 * 60 * 1000),
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