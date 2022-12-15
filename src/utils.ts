import isoFetch from "isomorphic-fetch";
import {
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { COLLECTION_TOKEN_COUNT } from "./constants";

/* Internal Custom Command API */

export type CustomCommand = {
  name: string;
  handler: (interaction: ChatInputCommandInteraction) => void;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
};

/* Asset Fetching Utils */

type AssetResponse = Record<"image_url", string>;
export const fetchImageUrl = async (url: string) => {
  const res = await isoFetch(url);
  const asset = await res.json();
  return (asset as unknown as AssetResponse).image_url;
};

const fetchAssetImage = async (url: string) => {
  const res = await isoFetch(url);
  return Buffer.from(await res.arrayBuffer());
};

export const fetchAssetImageBuffer = async (
  url: string
): Promise<Buffer | null> => {
  try {
    const imageUrl = await fetchImageUrl(url);
    const imageSteam = await fetchAssetImage(imageUrl);
    return imageSteam;
  } catch (e) {
    console.log("fetchError:", e);
    return null;
  }
};

/* General Utils */

export const getRandomTokenId = () =>
  Math.floor(Math.random() * COLLECTION_TOKEN_COUNT) || 1;
