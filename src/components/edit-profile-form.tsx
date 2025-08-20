"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    user: {
        id: string;
        name: string | null;
        email: string;
        phoneE164: string | null;
    };
};

export default function EditProfileForm({ user }: Props) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: user.name ?? "",
        email: user.email,
        phoneE164: user.phoneE164 ?? "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch("/api/profile/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        router.refresh(); // reload server data
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-md border p-2"
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-md border p-2"
                />
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                    type="text"
                    name="phoneE164"
                    value={form.phoneE164}
                    onChange={handleChange}
                    className="w-full rounded-md border p-2"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md hover:opacity-90"
            >
                Save Changes
            </button>
        </form>
    );
}
