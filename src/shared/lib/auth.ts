import NextAuth, { CredentialsSignin } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import db from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { schema } from "./schema";
import { v4 as uuid } from "uuid";
import { encode } from "@auth/core/jwt";
import Resend from "next-auth/providers/resend";
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
        const valid = bcrypt.compareSync(
          validateCredentials.password,
          user.password
        );
        if (!valid) {
          throw new CredentialsSignin("Senha incorreta!");
        }
        return user;
      },
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "EstetiCar <esteticar@vocalloop.com>",
      async sendVerificationRequest({ identifier, url, token }) {
        const resetUrl = new URL("/resetPassword", url);
        resetUrl.searchParams.set("token", token);
        resetUrl.searchParams.set("email", identifier);

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "EstetiCar <noreply@resend.dev>",
            to: identifier,
            subject: "Redefinir sua senha",
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 0; text-align: center;">
                <div style="max-width: 480px; background-color: #ffffff; margin: 0 auto; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
                  <h2 style="color: #111111; font-size: 22px; margin-bottom: 20px;">Redefinir senha</h2>
                  <p style="color: #333333; font-size: 15px; margin-bottom: 30px;">
                    Olá <strong>${identifier}</strong>,<br />
                    Clique no botão abaixo para redefinir sua senha:
                  </p>
                  <a
                    href="${resetUrl}"
                    style="
                      display: inline-block;
                      background-color: #000000;
                      color: #ffffff;
                      padding: 12px 24px;
                      border-radius: 6px;
                      text-decoration: none;
                      font-weight: bold;
                      font-size: 14px;
                      transition: background-color 0.2s ease;
                    "
                  >
                    Redefinir senha
                  </a>
                  <p style="color: #555555; font-size: 13px; margin-top: 25px;">
                    Ou copie e cole este link no navegador:<br />
                    <a href="${resetUrl}" style="color: #1a73e8; word-break: break-all;">${resetUrl}</a>
                  </p>
                  <p style="color: #666666; font-size: 12px; margin-top: 30px;">
                    Se você não solicitou a redefinição de senha, ignore este email.
                  </p>
                </div>
                <p style="color: #999999; font-size: 12px; margin-top: 20px;">
                  © ${new Date().getFullYear()} — Todos os direitos reservados
                </p>
              </div>
            `,
          }),
        });
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
      if (account?.provider === "resend") {
        return true;
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
