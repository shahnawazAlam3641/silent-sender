import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(6, "Password must be atleast of 6 character(s)"),
});
