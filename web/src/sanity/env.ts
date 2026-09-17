// Project ID and dataset are public values. Defaults keep deployments working
// when the environment variables are not set on the host.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "e30j6wkp";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const apiVersion = "2026-09-17";
