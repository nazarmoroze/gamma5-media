import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/client";
import { token } from "@/sanity/token";

// Presentation in Studio calls this with a short-lived secret to turn on Draft Mode.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
