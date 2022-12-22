import { pipe } from "froebel";
import fetch from "isomorphic-fetch";
import {
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { COLLECTION_TOKEN_COUNT } from "./constants";

/* Custom Command Interface */

export interface CustomCommand {
  name: string;
  handler: (interaction: ChatInputCommandInteraction) => void;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
}

type AssetTrait = {
  trait_type: string;
  value: string;
};
type AssetResponse = {
  image_url: string;
  name: string;
  permalink: string;
  traits: {
    trait_type: string;
    value: string;
  }[];
};
export type ParsedAssetResponse = {
  image_url: string;
  name: string;
  permalink: string;
  traits: {
    name: string;
    value: string;
  }[];
};

/* Asset Fetching Utils */

export const parseTokenInfo = (res: AssetResponse): ParsedAssetResponse => {
  const { image_url, name, permalink, traits } = res;
  return {
    image_url,
    name,
    permalink,
    traits: traits.map(({ trait_type, value }) => ({
      name: trait_type,
      value,
    })),
  };
};

export const fetchTokenMeta = pipe(
  fetch,
  (res: Response) => res.json(),
  parseTokenInfo
);

export const fetchTokenImage = pipe(
  ({ image_url }: ParsedAssetResponse) => image_url,
  fetch,
  (res: Response) => res.arrayBuffer(),
  (ab: ArrayBuffer) => Buffer.from(ab)
);

/* General Utils */

export const getRandomTokenId = () =>
  Math.floor(Math.random() * COLLECTION_TOKEN_COUNT) || 1;
