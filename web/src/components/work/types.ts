import { stegaClean, type StegaBranded } from "next-sanity";

import type { CASE_QUERY_RESULT, CASES_QUERY_RESULT } from "../../../sanity.types";

export type CaseSummary = StegaBranded<CASES_QUERY_RESULT[number]>;
export type CaseDetail = StegaBranded<NonNullable<CASE_QUERY_RESULT>>;
export type CaseCategory = "commercial" | "youtube" | "short";

export const categoryLabels: Record<CaseCategory, string> = {
  commercial: "Commercial",
  youtube: "YouTube",
  short: "Short content",
};

// Values from Sanity may carry click-to-edit markers in Draft Mode, so clean before using them as data.
export const caseHref = (slug: string | null) => `/work/${stegaClean(slug) ?? ""}`;

export const caseCategory = (category: string | null) => stegaClean(category) as CaseCategory | null;

export const isVertical = (orientation: string | null) => stegaClean(orientation) === "vertical";

export function categoryLabel(category: string | null) {
  const value = caseCategory(category);
  return value && value in categoryLabels ? categoryLabels[value] : "";
}
