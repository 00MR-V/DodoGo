// src/components/preferences-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { savePreferences } from "@/server/preferences";

type PrefRow = {
    id: number;
    key: string;
    label: string;
    category: string;
    description: string | null;
    active: boolean;
    sortOrder: number;
    createdAt: string | Date;
};

export default function PreferencesForm({
    grouped,
    initialSelected,
    onAfterSave,
}: {
    grouped: Record<string, PrefRow[]>;
    initialSelected?: number[];
    onAfterSave?: () => void;
}) {
    const [selected, setSelected] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    // initialize once from server-provided selections
    useEffect(() => {
        if (initialSelected && initialSelected.length) setSelected(initialSelected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggle = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await savePreferences(selected);
        setSaving(false);

        if (res.success) {
            toast.success("Preferences saved!");
            onAfterSave ? onAfterSave() : router.push("/dashboard");
        } else {
            toast.error(res.message ?? "Could not save preferences");
        }
    };

    const onSkip = async () => {
        setSaving(true);
        const res = await savePreferences([]); // mark as completed with no selections
        setSaving(false);

        if (res.success) {
            onAfterSave ? onAfterSave() : router.push("/dashboard");
        } else {
            toast.error(res.message ?? "Could not skip");
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* top bar with Skip */}
            <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    Choose as many as you like — you can change these later.
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onSkip}
                    disabled={saving}
                    className="px-3"
                >
                    Skip for now
                </Button>
            </div>

            {Object.entries(grouped).map(([category, items]) => (
                <Card key={category}>
                    <CardHeader>
                        <CardTitle className="capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {items.map((p) => (
                            <label
                                key={p.id}
                                className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/30 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selected.includes(p.id)}
                                    onCheckedChange={() => toggle(p.id)}
                                />
                                <div className="grid">
                                    <span className="font-medium">{p.label}</span>
                                    {p.description ? (
                                        <span className="text-xs text-muted-foreground">
                                            {p.description}
                                        </span>
                                    ) : null}
                                </div>
                            </label>
                        ))}
                    </CardContent>
                </Card>
            ))}

            {/* bottom action: Continue */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-6"
                >
                    {saving ? "Saving..." : "Continue"}
                </Button>
            </div>
        </form>
    );
}
