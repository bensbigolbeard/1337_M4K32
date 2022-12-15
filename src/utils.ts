import { pipe } from "froebel";
import fetch from "isomorphic-fetch";
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
export const fetchImageUrl = pipe(
  fetch,
  (res: Response) => res.json(),
  ({ image_url }: AssetResponse) => image_url
);

const fetchAssetImage = pipe(
  fetch,
  (res: Response) => res.arrayBuffer(),
  (ab: ArrayBuffer) => Buffer.from(ab)
);

export const fetchAssetImageBuffer = async (
  url: string
): Promise<Buffer | null> => {
  try {
    return pipe(fetchImageUrl, fetchAssetImage)(url);
  } catch (e) {
    console.error("fetchError:", e);
    return null;
  }
};

/* General Utils */

export const getRandomTokenId = () =>
  Math.floor(Math.random() * COLLECTION_TOKEN_COUNT) || 1;
