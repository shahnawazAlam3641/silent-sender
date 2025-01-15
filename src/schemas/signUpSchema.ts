import { z } from "zod";

export const UsernameValidation = z
  .string()
  .min(2, "Username must be of aleast 2 character(s)")
  .max(20, "Username must be not more than of 20 character(s) ")
  .regex(/^[a-zA-z0-9]+$/, "Username must nott contain any special character");

export const SignUpSchema = z.object({
  username: UsernameValidation,
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast of 6 character(s)" }),
});
