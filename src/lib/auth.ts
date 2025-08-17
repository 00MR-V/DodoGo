import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { schema } from "@/db/schema";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            resend.emails.send({
                from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: user.email,
                subject: "Verify your email",
                react: VerifyEmail({ username: user.name, verifyUrl: url }),
            });
        },
        sendOnSignUp: true,
        expiresIn: 3600,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            const { data, error } = await resend.emails.send({
                from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
                to: user.email,
                subject: "Reset your password",
                react: ForgotPasswordEmail({
                    username: user?.name ?? "there",
                    resetUrl: url,
                    userEmail: user.email,
                }),
            });

            if (error) {
                console.error("Resend error:", error);
            } else {
                console.log("Reset email sent, id:", data?.id);
            }
        },
        requireEmailVerification: true,
    },

    // Database adapter with Drizzle schema
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    // 👇 Extend user model with phone fields
    user: {
        additionalFields: {
            phoneE164: { type: "string" },
            phoneNational: { type: "string" },
            phoneCountry: { type: "string" },
        },
    },

    plugins: [nextCookies()],
});
