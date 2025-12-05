import * as z from "zod";

export const regSchema = z.object({
    name: z.string().nonempty("Name is required!").min(4, "Name must be atleast 5 characters!"),
    email: z.string().nonempty("Email is required!").email("Email is not valid!"),
    password: z.string().nonempty("Password is required!").min(4, "Name must be atleast 5 characters!"),
    rePassword: z.string(),
    dateOfBirth: z.string().refine((date) => {
        const currentYear = new Date().getFullYear()
        const birthYear = new Date(date).getFullYear()
        const age = currentYear - birthYear
        return age >= 18
    }, {message: "User age must be atleast 18"}),
    gender: z.string().nonempty("Please select a gender!")

}).refine( data => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Password must match"
})


export const loginSchema = z.object({
    email: z.string().nonempty("Email is required!").email("Email is not valid!"),
    password: z.string().nonempty("Password is required!").min(4, "Password must be atleast 5 characters!"),

})

export const changePasswordSchema = z.object({
    password: z.string().nonempty("Password is required!").min(4, "Password must be atleast 5 characters!"),
    newPassword: z.string().nonempty("Password is required!").min(4, "Password must be atleast 5 characters!")
})