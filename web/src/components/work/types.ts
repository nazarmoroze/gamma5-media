import type { CASE_QUERY_RESULT, CASES_QUERY_RESULT } from "../../../sanity.types";

export type CaseSummary = CASES_QUERY_RESULT[number];
export type CaseDetail = NonNullable<CASE_QUERY_RESULT>;
export type CaseCategory = "commercial" | "youtube" | "short";

export const categoryLabels: Record<CaseCategory, string> = {
  commercial: "Commercial",
  youtube: "YouTube",
  short: "Short content",
};

export const caseHref = (slug: string | null) => `/work/${slug ?? ""}`;

export function categoryLabel(category: string | null) {
  return category && category in categoryLabels ? categoryLabels[category as CaseCategory] : "";
}
