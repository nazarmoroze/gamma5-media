import "server-only";

import { client } from "./client";

const writeToken = process.env.SANITY_API_WRITE_TOKEN;

// Only used on the server to store form submissions. Null when the token is not set.
export const writeClient = writeToken ? client.withConfig({ token: writeToken, useCdn: false, stega: false }) : null;
