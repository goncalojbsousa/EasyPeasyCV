"use client";

import {
	BarChart3,
	BookOpen,
	Building,
	Code,
	DollarSign,
	Heart,
	type LucideIcon,
	Package,
	Palette,
	TrendingUp,
	Users,
} from "lucide-react";
import type { CVType } from "../../types/cv";

const CV_TYPE_ICONS: Record<CVType, LucideIcon> = {
	development: Code,
	marketing: BarChart3,
	sales: TrendingUp,
	hr: Users,
	finance: DollarSign,
	design: Palette,
	health: Heart,
	education: BookOpen,
	admin: Building,
	other: Package,
};

/**
 * Icon for a CV type. Shared by the desktop action bar and the mobile sheet so
 * both menus always show the same iconography.
 */
export function CvTypeIcon({
	type,
	className = "w-4 h-4",
}: {
	type: string;
	className?: string;
}) {
	const Icon = CV_TYPE_ICONS[type as CVType] ?? CV_TYPE_ICONS.other;
	return <Icon className={className} />;
}
