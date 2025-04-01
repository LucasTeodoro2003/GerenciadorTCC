import { executeActionDB } from "./executeActionDB"
import db from "./prisma"
import { schema } from "./schema"

const signUp = async (formData: FormData) => {
    return executeActionDB({
        actionFn: async()=>{
            const email = formData.get("email")
            const password = formData.get("password")
            const validateData = schema.parse({email, password})
            await db.user.create({
                data:{
                    email: validateData.email.toLocaleLowerCase(),
                    password: validateData.password,
                    permission: 3 //Usuario Normal 3 - Usuario Funcionario 2 - Usuario Administrador 1
                }
            })
        }
    })
} 

export {signUp};