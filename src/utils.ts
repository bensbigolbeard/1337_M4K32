import { pipe } from "froebel";
import fetch from "isomorphic-fetch";
import {
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { COLLECTION_TOKEN_COUNT } from "./constants";

/* Custom Command Interface */
export type CustomCommand =
  | CustomSlashCommand
  | CustomSlashCommandWithSubCommands;
interface CustomSlashCommand {
  name: string;
  handler: (interaction: ChatInputCommandInteraction) => void;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
}
interface CustomSlashCommandWithSubCommands {
  name: string;
  subCommands: Record<
    string,
    (interaction: ChatInputCommandInteraction) => void
  >;
  command: RESTPostAPIChatInputApplicationCommandsJSONBody;
}

export interface CustomSubCommand {
  handler: (interaction: ChatInputCommandInteraction) => void;
  subCommand: (
    command: SlashCommandSubcommandBuilder
  ) => SlashCommandSubcommandBuilder;
}

export interface ContractAction {
  address: string;
  // todo: find the type for web3.js Contract
  handler: ({
    contract,
  }: {
    contract: any;
  }) => Promise<Record<string, unknown>>;
}

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

export const decodeDataUri = pipe(
  (str: string) => str.split("base64,"),
  (arr: string[]) => arr.slice(-1)[0],
  (dataUri: string) => Buffer.from(dataUri, "base64"),
  (buffer: Buffer) => buffer.toString()
);

/* General Utils */

export const getRandomTokenId = () =>
  Math.floor(Math.random() * COLLECTION_TOKEN_COUNT) || 1;

export function tap<T>(msg: string) {
  return (v: T): T => {
    console.log(`*** ${msg}`, v);
    return v;
  };
}
