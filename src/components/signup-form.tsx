// src/components/signup-form.tsx
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createAuthClient } from "better-auth/client";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signUp } from "@/server/users";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    countryCode: z.string().regex(/^\+\d{1,3}$/, "Select a valid country code"),
    phone: z.string().regex(/^\d{6,15}$/, "Enter 6–15 digits (numbers only)"),
});

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [query, setQuery] = useState(""); // search text
    const [options, setOptions] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false); // dropdown toggle
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            countryCode: "+230", // default Mauritius
            phone: "",
        },
    });

    const authClient = createAuthClient();

    const signInWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
    };

    // Fetch country codes
    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const res = await fetch(`/api/country-codes?q=${query}`);
                const data = await res.json();
                setOptions(data);
            } catch (err) {
                console.error("Failed to fetch country codes:", err);
            }
        };
        fetchCodes();
    }, [query]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        const phoneE164 = `${values.countryCode}${values.phone}`;
        const phoneNational = values.phone;
        const phoneCountry = options.find(
            (c) => `+${c.callingCode}` === values.countryCode
        )?.iso2;

        console.log("Saving phone:", { phoneE164, phoneNational, phoneCountry });

        const { success, message } = await signUp(
            values.email,
            values.password,
            values.username,
            phoneE164,
            phoneNational,
            phoneCountry
        );

        if (success) {
            toast.success(message as string);
            router.push("/login");
        } else {
            toast.error(message as string);
        }
        setIsLoading(false);
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Fill in your details to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-col gap-6">
                                {/* Username */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email Address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Phone */}
                                <FormLabel>Phone number</FormLabel>
                                <div className="flex gap-3">
                                    {/* Country code dropdown */}
                                    <FormField
                                        control={form.control}
                                        name="countryCode"
                                        render={() => (
                                            <FormItem className="relative w-32">
                                                <FormControl>
                                                    <div>
                                                        <Input
                                                            placeholder="+Code"
                                                            value={query}
                                                            onFocus={() => setIsOpen(true)}
                                                            onChange={(e) => setQuery(e.target.value)}
                                                            onBlur={() =>
                                                                setTimeout(() => setIsOpen(false), 100)
                                                            }
                                                        />
                                                        {isOpen && options.length > 0 && (
                                                            <div className="absolute left-0 mt-1 w-32 max-h-40 overflow-y-auto rounded-md border bg-white shadow z-50">
                                                                {options.map((c) => (
                                                                    <div
                                                                        key={c.iso2}
                                                                        className="cursor-pointer px-2 py-1 hover:bg-accent"
                                                                        onMouseDown={() => {
                                                                            form.setValue(
                                                                                "countryCode",
                                                                                `+${c.callingCode}`
                                                                            );
                                                                            setQuery(`${c.iso2} +${c.callingCode}`);
                                                                            setIsOpen(false);
                                                                        }}
                                                                    >
                                                                        {c.iso2} +{c.callingCode}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone digits */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        inputMode="numeric"
                                                        placeholder="Phone (digits only)"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const onlyDigits = e.target.value.replace(/\D/g, "");
                                                            field.onChange(onlyDigits);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="********"
                                                        type={showPassword ? "text" : "password"}
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((p) => !p)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="size-4" />
                                                        ) : (
                                                            <Eye className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Buttons */}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    type="button"
                                    onClick={signInWithGoogle}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 48 48"
                                    >
                                        <path
                                            fill="#EA4335"
                                            d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.86-6.86C36.09 2.38 30.45 0 24 0 14.62 0 6.4 5.48 2.56 13.44l7.98 6.19C12.01 13.38 17.59 9.5 24 9.5z"
                                        />
                                        <path
                                            fill="#4285F4"
                                            d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.8c-.55 2.95-2.25 5.45-4.8 7.13l7.38 5.73C43.91 37.36 46.5 31.34 46.5 24.5z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M10.54 28.77a14.47 14.47 0 0 1-.76-4.27c0-1.48.27-2.91.76-4.27l-7.98-6.19C1.2 17.5 0 20.62 0 24c0 3.38 1.2 6.5 3.32 9.23l8.06-6.46z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M24 48c6.45 0 12.09-2.12 16.12-5.77l-7.38-5.73c-2.05 1.38-4.66 2.2-7.54 2.2-6.41 0-11.99-3.88-14.46-9.36l-8.06 6.46C6.4 42.52 14.62 48 24 48z"
                                        />
                                    </svg>
                                    Sign Up with Google
                                </Button>

                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/login" className="underline underline-offset-4">
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
