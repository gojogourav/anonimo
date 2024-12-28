import * as z from "zod"

export const userValidation = z.object({
    username:z.string(),
    bio:z.string(),
    pfp:z.string().url().nonempty(),
    name:z.string()
})