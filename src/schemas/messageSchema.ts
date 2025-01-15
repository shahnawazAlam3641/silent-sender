import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message must be atleast of 10 character(s)" })
    .max(300, { message: "Message must not be more than 300 character(s)" }),
});
