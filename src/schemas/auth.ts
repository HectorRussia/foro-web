import { z } from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(1, { message: "กรุณาระบุชื่อ" }),
    lastname: z.string().min(1, { message: "กรุณาระบุนามสกุล" }),
    phone: z.string().min(10, { message: "เบอร์โทรศัพท์ไม่ถูกต้อง" }),
    email: z.string().email({ message: "อีเมลไม่ถูกต้อง" }),
    password: z.string().min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัว" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;