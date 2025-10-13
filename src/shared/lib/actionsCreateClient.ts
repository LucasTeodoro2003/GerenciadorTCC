"use server";

import { executeActionDB } from "./executeActionDB";
import db from "./prisma";
import { schema } from "./schema";
import bcrypt from "bcryptjs";

export const createClient = async (formData: FormData) => {
  let createdUserId: string | undefined;
  let createdUserEmail: string | undefined;
  let oldpassword: string | undefined;

  const result = await executeActionDB({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      oldpassword = password?.toString();
      const { error, data: validateData } = schema.safeParse({
        email,
        password,
      });
      if (error) {
        const flattened = error.flatten();
        const errors = [
          ...(flattened.fieldErrors.email || []),
          ...(flattened.fieldErrors.password || []),
        ];
        throw new Error(errors.join(", "));
      }
      const hash = bcrypt.hashSync(validateData.password, 10);
      const newUser = await db.user.create({
        data: {
          email: validateData.email.toLowerCase(),
          password: hash,
          name: formData.get("name")?.toString() || "",
          enterpriseId: "1",
          permission: 3, //Usuario Normal 3 - Usuario Funcionario 2 - Usuario Administrador 1
        },
      });
      createdUserId = newUser.id;
      createdUserEmail = newUser.email || ""

    },
  });
  return { userId: createdUserId, email: createdUserEmail, password: oldpassword};
};
