import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/lib/sanity/client";

const draft = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN || "" }),
});
export const GET: typeof draft.GET = async (...args) => {
  if (!process.env.SANITY_API_READ_TOKEN)
    return new Response("Draft preview is not configured.", { status: 503 });
  return draft.GET(...args);
};
