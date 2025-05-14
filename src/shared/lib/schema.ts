import {z} from "zod"
const schema = z.object({
    email: z.string().email("Email já cadastrado"),
    password: z.string().min(8, "Senha deve conter no minimo 8 caracteres!")
})

export {schema};