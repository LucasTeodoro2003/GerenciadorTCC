import { executeActionDB } from "./executeActionDB";
import db from "./prisma";
import { schema } from "./schema";
import bcrypt from "bcryptjs";

const signUp = async (formData: FormData) => {
  return executeActionDB({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const { error, data: validateData } = schema.safeParse({
        email,
        password,
      });
      if (error) {
        const flattened = error.flatten();
        const errors = [
          ...flattened.fieldErrors.email || [],
          ...flattened.fieldErrors.password || [],
        ];
        throw new Error(errors.join(', '));
      }
      const hash = bcrypt.hashSync(validateData.password, 10);
      await db.user.create({
        data: {
          email: validateData.email.toLocaleLowerCase(),
          password: hash,
          permission: 3, //Usuario Normal 3 - Usuario Funcionario 2 - Usuario Administrador 1
        },
      });
    },
  });
};

export { signUp };
