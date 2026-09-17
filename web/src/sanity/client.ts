import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  // Stega (click-to-edit markers) is only switched on by sanityFetch while Draft Mode is enabled.
  stega: { studioUrl },
});
