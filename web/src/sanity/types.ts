import type { StegaBranded } from "next-sanity";

import type { HOME_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "../../sanity.types";

// Data from sanityFetch may carry click-to-edit markers in Draft Mode.
export type HomeData = StegaBranded<NonNullable<HOME_QUERY_RESULT>>;
export type Settings = StegaBranded<NonNullable<SETTINGS_QUERY_RESULT>>;
