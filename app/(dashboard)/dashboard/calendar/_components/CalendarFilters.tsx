"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    FaXTwitter,
    FaLinkedin,
    FaFacebook,
    FaInstagram,
} from "react-icons/fa6";

const platforms = [
    { id: "all", label: "All", icon: null },
    { id: "twitter", label: "Twitter", icon: FaXTwitter, color: "text-[#000000]" },
    { id: "linkedin", label: "LinkedIn", icon: FaLinkedin, color: "text-[#0A66C2]" },
    { id: "instagram", label: "Instagram", icon: FaInstagram, color: "text-[#E4405F]" },
    { id: "facebook", label: "Facebook", icon: FaFacebook, color: "text-[#1877F2]" },
];

const statuses = [
    { id: "all", label: "All Status" },
    { id: "scheduled", label: "Scheduled" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Draft" },
    { id: "failed", label: "Failed" },
];

interface CalendarFiltersProps {
    filters: {
        platform: string;
        status: string;
    };
    setFilters: (filters: { platform: string; status: string }) => void;
}

export default function CalendarFilters({ filters, setFilters }: CalendarFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <ToggleGroup
                type="single"
                value={filters.platform}
                onValueChange={(val) => val && setFilters({ ...filters, platform: val })}
                className="justify-start border rounded-md"
            >
                {platforms.map((p) => (
                    <ToggleGroupItem key={p.id} value={p.id} aria-label={p.label} className="px-3">
                        {p.icon && <p.icon className={`h-4 w-4 mr-2 ${p.color}`} />}
                        {p.label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

            <ToggleGroup
                type="single"
                value={filters.status}
                onValueChange={(val) => val && setFilters({ ...filters, status: val })}
                className="justify-start border rounded-md"
            >
                {statuses.map((s) => (
                    <ToggleGroupItem key={s.id} value={s.id} aria-label={s.label} className="px-3">
                        {s.label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
}
