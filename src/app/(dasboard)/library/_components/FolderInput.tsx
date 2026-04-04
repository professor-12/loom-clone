"use client";

import { cn } from "@/lib/utils";

type Props = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
};

export function FolderInput({ id, label, value, onChange, className }: Props) {
    return (
        <div className={cn("grid gap-2", className)}>
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
        </div>
    );
}
