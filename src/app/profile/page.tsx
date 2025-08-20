"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
    const router = useRouter();

    // Section 1: User Profile
    const [userProfile, setUserProfile] = useState({
        username: "Vishan Daby",
        email: "vishan@gmail.com",
        phone: "",
    });

    // Section 2: Disabled Person Info
    const [disabledPerson, setDisabledPerson] = useState({
        name: "",
        phone: "",
    });

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleDisabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDisabledPerson((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("User Profile:", userProfile);
        console.log("Disabled Person:", disabledPerson);

        // Redirect to dashboard
        router.push("/dashboard");
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-muted/50 p-6">
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
            >
                {/* Section 1: User Profile */}
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-xl font-bold">
                            Edit Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <Input
                                name="username"
                                value={userProfile.username}
                                onChange={handleUserChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input
                                type="email"
                                name="email"
                                value={userProfile.email}
                                onChange={handleUserChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <Input
                                type="tel"
                                name="phone"
                                value={userProfile.phone}
                                onChange={handleUserChange}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Disabled Person */}
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-xl font-bold">
                            Disabled Person Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                                name="name"
                                value={disabledPerson.name}
                                onChange={handleDisabledChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <Input
                                type="tel"
                                name="phone"
                                value={disabledPerson.phone}
                                onChange={handleDisabledChange}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button (spans both sections) */}
                <div className="md:col-span-2 flex justify-center">
                    <Button type="submit" className="w-full md:w-1/3">
                        Save & Return to Dashboard
                    </Button>
                </div>
            </form>
        </main>
    );
}
