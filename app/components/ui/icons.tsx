import {
	Award,
	Briefcase,
	CheckCircle,
	Code,
	FileText,
	GraduationCap,
	GripVertical,
	Heart,
	Languages,
	Package,
	Plus,
	User,
	X,
} from "lucide-react";

/**
 * Collection of icons used throughout the application.
 * All icons are from lucide-react library for consistency.
 */
export const Icons = {
	/** User profile icon for personal information section */
	personalInfo: <User className="w-7 h-7" />,

	/** Document icon for professional summary section */
	professionalSummary: <FileText className="w-7 h-7" />,

	/** Briefcase icon for professional experience section */
	professionalExperience: <Briefcase className="w-7 h-7" />,

	/** Graduation cap icon for academic education section */
	academicEducation: <GraduationCap className="w-7 h-7" />,

	/** Code brackets icon for technical skills section */
	technicalSkills: <Code className="w-7 h-7" />,

	/** Language icon for languages section */
	languages: <Languages className="w-7 h-7" />,

	/** Award icon for certifications section */
	certifications: <Award className="w-7 h-7" />,

	/** Package icon for projects section */
	projects: <Package className="w-7 h-7" />,

	/** Heart icon for volunteer work section */
	volunteer: <Heart className="w-7 h-7" />,

	/** Plus icon for adding new items */
	add: <Plus className="w-5 h-5" />,

	/** X icon for removing items */
	remove: <X className="w-5 h-5" />,

	/** Checkmark icon for actions section */
	actions: <CheckCircle className="w-6 h-6" />,

	/** Drag handle icon for sortable lists */
	drag: <GripVertical className="w-5 h-5" />,
};
