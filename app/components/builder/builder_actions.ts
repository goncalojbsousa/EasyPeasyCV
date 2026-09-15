import type {
	CvColor,
	CvData,
	CvRenderSettings,
	CvTemplate,
} from "../../types/cv";
import type { CvProfileMeta } from "../../utils/useCvProfiles";

/**
 * Everything the builder exposes to its action bars.
 *
 * Both the desktop bar and the mobile bar take exactly this, so the two are
 * two presentations of one set of actions rather than two parallel APIs.
 */
export interface BuilderActions {
	/** The CV being edited — also carries template, color, settings and order */
	data: CvData;
	onTemplateChange: (template: CvTemplate) => void;
	onColorChange: (color: CvColor) => void;
	onSettingsChange: (settings: CvRenderSettings) => void;
	onResetSectionOrder: () => void;
	/** Returns false (and warns the user) when the CV has no content yet */
	onGeneratePDF: () => boolean;
	onShowSuccessMessage: () => void;
	onExportXml: () => void;
	onImportXml: (xml: string) => void;
	hasAnyContent: boolean;
	profiles: CvProfileMeta[];
	currentProfileId: string | null;
	onCreateProfile: () => void;
	onDuplicateProfile: (profileId: string) => void;
	onSwitchProfile: (profileId: string) => void;
	onRenameProfile: (profileId: string, nextName: string) => void;
	onDeleteProfile: (profileId: string) => void;
}
