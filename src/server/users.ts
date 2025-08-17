// src/server/users.ts
"use server";

import { auth } from "@/lib/auth";

export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        console.log("Login successful");

        return {
            success: true,
            message: "Signed in successfully.",
        };
    } catch (error) {
        const e = error as Error;

        return {
            success: false,
            message: e.message || "An unknown error occurred.",
        };
    }
};

export const signUp = async (
    email: string,
    password: string,
    username: string,
    phoneE164: string,
    phoneNational: string,
    phoneCountry: string
) => {
    try {
        // 1. Pass phone fields directly in signUp
        const { user } = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: username,
                phoneE164,
                phoneNational,
                phoneCountry,
            },
        });

        return {
            success: true,
            message: "Signed up successfully.",
        };
    } catch (error) {
        const e = error as Error;
        return {
            success: false,
            message: e.message || "An unknown error occurred.",
        };
    }
};

