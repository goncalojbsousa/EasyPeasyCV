"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CvData } from "../types/cv";
import { cloneCvData, createEmptyCvData, generateId } from "./cv-data";

const PROFILES_STORAGE_KEY = "cv-builder-profiles-v1";
const LEGACY_STORAGE_KEY = "cv-builder-data";

export interface CvProfileMeta {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

interface CvProfilesStorage {
	currentProfileId: string | null;
	profiles: Record<string, CvData>;
	meta: Record<string, CvProfileMeta>;
}

const emptyStorage = (): CvProfilesStorage => ({
	currentProfileId: null,
	profiles: {},
	meta: {},
});

function parseStorage(raw: string | null): CvProfilesStorage {
	if (!raw) return emptyStorage();
	try {
		const parsed = JSON.parse(raw) as Partial<CvProfilesStorage>;
		return {
			currentProfileId: parsed.currentProfileId ?? null,
			profiles: parsed.profiles || {},
			meta: parsed.meta || {},
		};
	} catch {
		return emptyStorage();
	}
}

function readStorage(): CvProfilesStorage {
	return parseStorage(localStorage.getItem(PROFILES_STORAGE_KEY));
}

function writeStorage(storage: CvProfilesStorage): void {
	localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(storage));
}

/** First id that actually has a profile, preferring the stored current one. */
function resolveActiveId(storage: CvProfilesStorage): string | null {
	if (storage.currentProfileId && storage.profiles[storage.currentProfileId]) {
		return storage.currentProfileId;
	}
	return Object.keys(storage.profiles)[0] || null;
}

/** Append " 2", " 3"… until the name is unique among `existingNames`. */
function uniqueName(baseName: string, existingNames: Iterable<string>): string {
	const normalized = baseName.trim() || "Profile";
	const taken = new Set(
		Array.from(existingNames)
			.map((name) => name.trim())
			.filter(Boolean),
	);
	if (!taken.has(normalized)) return normalized;

	let counter = 2;
	while (taken.has(`${normalized} ${counter}`)) counter += 1;
	return `${normalized} ${counter}`;
}

/** Names already in use, optionally excluding one profile. */
function existingNames(
	storage: CvProfilesStorage,
	exceptId?: string,
): string[] {
	return Object.values(storage.meta)
		.filter((meta) => meta.id !== exceptId)
		.map((meta) => meta.name);
}

/** Name to show for a CV that has never been named explicitly. */
function derivedName(data: CvData, fallback: string): string {
	return (
		data.personalInfo?.name?.trim() ||
		data.personalInfo?.desiredRole?.trim() ||
		fallback
	);
}

export interface UseCvProfilesOptions {
	/** The CV currently being edited, used when saving */
	data: CvData;
	/** Load a stored CV into the editor */
	applyData: (data: CvData) => void;
	/** Called after data is loaded from storage (for the "data loaded" banner) */
	onLoaded?: () => void;
	/** Localized label for a brand new profile */
	newProfileLabel: string;
	/** Localized label for an unnamed profile */
	unnamedLabel: string;
	/** Builds the name of a duplicated profile from the source name */
	copyLabel: (sourceName: string) => string;
	/** Whether the current CV is worth persisting */
	shouldSave: (data: CvData, currentProfileId: string | null) => boolean;
}

export interface CvProfilesController {
	profiles: CvProfileMeta[];
	currentProfileId: string | null;
	create: () => void;
	duplicate: (profileId: string) => void;
	switchTo: (profileId: string) => void;
	rename: (profileId: string, nextName: string) => void;
	remove: (profileId: string) => void;
}

/**
 * Owns the multi-profile localStorage layer: loading (including migration from
 * the legacy single-profile key), auto-saving the CV being edited, and the
 * create/duplicate/switch/rename/delete operations.
 *
 * Extracted from the builder page so the page only wires UI to these actions.
 */
export function useCvProfiles({
	data,
	applyData,
	onLoaded,
	newProfileLabel,
	unnamedLabel,
	copyLabel,
	shouldSave,
}: UseCvProfilesOptions): CvProfilesController {
	const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
	const [profiles, setProfiles] = useState<CvProfileMeta[]>([]);

	// Kept in refs so the load/save effects do not re-run on every keystroke.
	const dataRef = useRef(data);
	dataRef.current = data;
	const labelsRef = useRef({ newProfileLabel, unnamedLabel, copyLabel });
	labelsRef.current = { newProfileLabel, unnamedLabel, copyLabel };
	const onLoadedRef = useRef(onLoaded);
	onLoadedRef.current = onLoaded;

	/** Commit `updated` to storage and mirror its meta into React state. */
	const commit = useCallback((storage: CvProfilesStorage) => {
		writeStorage(storage);
		setProfiles(Object.values(storage.meta));
		setCurrentProfileId(storage.currentProfileId);
	}, []);

	/** Load the active profile on mount, migrating legacy data if needed. */
	useEffect(() => {
		try {
			const storage = readStorage();

			if (Object.keys(storage.profiles).length > 0) {
				const activeId = resolveActiveId(storage);
				setCurrentProfileId(activeId);
				setProfiles(Object.values(storage.meta));
				if (activeId) {
					applyData(storage.profiles[activeId]);
					onLoadedRef.current?.();
				}
				return;
			}

			// Migration from legacy single-profile storage
			const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
			if (!legacyRaw) return;

			const legacyData = JSON.parse(legacyRaw) as CvData;
			const id = generateId();
			const now = new Date().toISOString();
			commit({
				currentProfileId: id,
				profiles: { [id]: legacyData },
				meta: {
					[id]: {
						id,
						name: derivedName(legacyData, labelsRef.current.newProfileLabel),
						createdAt: now,
						updatedAt: now,
					},
				},
			});
			applyData(legacyData);
			onLoadedRef.current?.();
		} catch {
			// Silently handle error loading saved data
		}
	}, [applyData, commit]);

	/** Persist the CV being edited into its profile slot. */
	const save = useCallback(() => {
		try {
			const currentData = dataRef.current;
			const storage = readStorage();
			const now = new Date().toISOString();

			const profileId = currentProfileId ?? generateId();
			const existingMeta = storage.meta[profileId];
			const name =
				existingMeta?.name ||
				derivedName(
					currentData,
					uniqueName(
						labelsRef.current.newProfileLabel,
						existingNames(storage, profileId),
					),
				);

			storage.meta[profileId] = {
				id: profileId,
				name,
				createdAt: existingMeta?.createdAt || now,
				updatedAt: now,
			};
			storage.profiles[profileId] = currentData;
			storage.currentProfileId = profileId;
			commit(storage);
		} catch {
			// Silently ignore storage errors
		}
	}, [commit, currentProfileId]);

	// Auto-save whenever the CV changes and is worth saving.
	useEffect(() => {
		if (shouldSave(data, currentProfileId)) save();
	}, [data, currentProfileId, save, shouldSave]);

	const create = useCallback(() => {
		try {
			const storage = readStorage();
			const id = generateId();
			const now = new Date().toISOString();
			const blank = createEmptyCvData();

			storage.profiles[id] = blank;
			storage.meta[id] = {
				id,
				name: uniqueName(
					labelsRef.current.newProfileLabel,
					existingNames(storage),
				),
				createdAt: now,
				updatedAt: now,
			};
			storage.currentProfileId = id;
			commit(storage);
			applyData(blank);
		} catch {
			// Ignore errors when creating profiles
		}
	}, [applyData, commit]);

	const duplicate = useCallback(
		(profileId: string) => {
			if (!profileId) return;
			try {
				save();
				const storage = readStorage();
				const source = storage.profiles[profileId];
				if (!source) return;

				const sourceName =
					storage.meta[profileId]?.name ||
					derivedName(source, labelsRef.current.unnamedLabel);
				const id = generateId();
				const now = new Date().toISOString();
				const copy = cloneCvData(source);

				storage.profiles[id] = copy;
				storage.meta[id] = {
					id,
					name: uniqueName(
						labelsRef.current.copyLabel(sourceName),
						existingNames(storage),
					),
					createdAt: now,
					updatedAt: now,
				};
				storage.currentProfileId = id;
				commit(storage);
				applyData(copy);
			} catch {
				// Ignore errors during profile duplication
			}
		},
		[applyData, commit, save],
	);

	const switchTo = useCallback(
		(profileId: string) => {
			if (!profileId || profileId === currentProfileId) return;
			try {
				// Save the profile being left before loading the next one
				save();
				const storage = readStorage();
				const next = storage.profiles[profileId];
				if (!next) return;

				storage.currentProfileId = profileId;
				commit(storage);
				applyData(next);
			} catch {
				// Ignore errors during profile switching
			}
		},
		[applyData, commit, currentProfileId, save],
	);

	const rename = useCallback(
		(profileId: string, nextName: string) => {
			const trimmed = nextName.trim();
			if (!profileId || !trimmed) return;
			try {
				const storage = readStorage();
				const existingMeta = storage.meta[profileId];
				if (!storage.profiles[profileId] || !existingMeta) return;

				storage.meta[profileId] = {
					...existingMeta,
					name: trimmed,
					updatedAt: new Date().toISOString(),
				};
				storage.currentProfileId = resolveActiveId(storage);
				commit(storage);
			} catch {
				// Ignore errors during profile rename
			}
		},
		[commit],
	);

	const remove = useCallback(
		(profileId: string) => {
			if (!profileId) return;
			try {
				const storage = readStorage();
				if (!storage.profiles[profileId]) return;
				// Keep at least one profile to avoid entering an empty/broken state.
				if (Object.keys(storage.profiles).length <= 1) return;

				const wasCurrent = profileId === currentProfileId;
				delete storage.profiles[profileId];
				delete storage.meta[profileId];
				storage.currentProfileId = resolveActiveId(storage);
				commit(storage);

				if (wasCurrent && storage.currentProfileId) {
					applyData(storage.profiles[storage.currentProfileId]);
				}
			} catch {
				// Ignore errors during profile deletion
			}
		},
		[applyData, commit, currentProfileId],
	);

	return {
		profiles,
		currentProfileId,
		create,
		duplicate,
		switchTo,
		rename,
		remove,
	};
}
