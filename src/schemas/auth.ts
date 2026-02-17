import { z } from "zod";

const msg = {
    th: {
        name: "กรุณาระบุชื่อ",
        lastname: "กรุณาระบุนามสกุล",
        phone: "เบอร์โทรศัพท์ไม่ถูกต้อง",
        email: "อีเมลไม่ถูกต้อง",
        email_format: "รูปแบบอีเมลไม่ถูกต้อง",
        password_min: "รหัสผ่านต้องมีอย่างน้อย 8 ตัว",
        password_required: "กรุณากรอกรหัสผ่าน",
        password_mismatch: "รหัสผ่านไม่ตรงกัน",
        agreed: "กรุณายอมรับเงื่อนไขการใช้งาน",
    },
    en: {
        name: "Please enter your name",
        lastname: "Please enter your last name",
        phone: "Invalid phone number",
        email: "Invalid email",
        email_format: "Invalid email format",
        password_min: "Password must be at least 8 characters",
        password_required: "Please enter your password",
        password_mismatch: "Passwords do not match",
        agreed: "Please agree to the terms and conditions",
    }
};

export const getRegisterSchema = (lang: 'th' | 'en' = 'th') => z.object({
    name: z.string().min(1, { message: msg[lang].name }),
    lastname: z.string().min(1, { message: msg[lang].lastname }),
    phone: z.string().min(10, { message: msg[lang].phone }),
    email: z.string().email({ message: msg[lang].email }),
    password: z.string().min(8, { message: msg[lang].password_min }),
    confirmPassword: z.string(),
    agreed: z.boolean().refine(val => val === true, {
        message: msg[lang].agreed,
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: msg[lang].password_mismatch,
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<ReturnType<typeof getRegisterSchema>>;

export const getForgotPasswordSchema = (lang: 'th' | 'en' = 'th') => z.object({
    email: z.string().email({ message: msg[lang].email }),
    phone: z.string().min(10, { message: msg[lang].phone }),
    new_password: z.string().min(8, { message: msg[lang].password_min }),
    confirm_new_password: z.string(),
}).refine((data) => data.new_password === data.confirm_new_password, {
    message: msg[lang].password_mismatch,
    path: ["confirm_new_password"],
});

export type ForgotPasswordInput = z.infer<ReturnType<typeof getForgotPasswordSchema>>;

export const getLoginSchema = (lang: 'th' | 'en' = 'th') => z.object({
    email: z.string().email(msg[lang].email_format),
    password: z.string().min(1, msg[lang].password_required),
});

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;
