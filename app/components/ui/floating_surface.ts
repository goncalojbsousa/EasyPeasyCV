/**
 * Shared chrome for the builder's floating controls: the sections toolbar
 * pinned above the form and the action bar at the bottom of the screen.
 *
 * Both float above the content, so they share one treatment and read as one
 * family of controls:
 * - light theme: a soft, diffuse shadow lifts them off the page;
 * - dark theme: shadows are invisible on a near-black page, so elevation comes
 *   from a surface one step lighter, a faint edge and a 1px highlight along
 *   the top.
 */
export const FLOATING_SURFACE =
	"rounded-xl border border-gray-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-zinc-800/85 supports-[backdrop-filter]:dark:bg-zinc-800/75 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_32px_-12px_rgba(0,0,0,0.8)]";
