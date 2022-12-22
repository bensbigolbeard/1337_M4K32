import { pipe } from "froebel";
import svgToPng from "convert-svg-to-png";
import {
  AttachmentBuilder,
  bold,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
} from "discord.js";
import {
  CustomCommand,
  getRandomTokenId,
  fetchTokenImage,
  fetchTokenMeta,
  ParsedAssetResponse,
} from "../utils";
import { COLLECTION_TOKEN_COUNT, COLLECTION_URL } from "../constants";

/* Local Constants */

const COMMAND_NAME = "1337_m3";
const COMMAND_DESCRIPTION = "M4Y83 1 W111 5UMM0N 4 5Ku11... M4Y83...";
const ID_INPUT_NAME = "token_id";
const MESSAGE_INPUT_NAME = "message";
const SHOW_TRAITS_INPUT_NAME = "show_traits";

const ERROR_MSG_COLOR = 0x880808; // red
const EMBED_COLOR = 0x48dd00; // 1337 green
const PNG_CONFIG = {
  puppeteer: { args: ["--no-sandbox"] },
  width: 150,
  height: 150,
};

/* Local Utils */

const getFileName = (tokenId: number) => `5ku11_${tokenId}.png`;
const getAssetUrl = (tokenId: number) => `${COLLECTION_URL}/${tokenId}`;
const filterInvalidImage = (input: Buffer | null) => {
  if (!input) throw new Error("boom. no image.");
  return input;
};

const parseTraits = (traits: ParsedAssetResponse["traits"]) =>
  traits.map(({ name, value }) => `${bold(name)}: ${value}`).join(", ");
const parseImageBuffer = pipe(
  fetchTokenImage,
  filterInvalidImage,
  (svgBuffer: Buffer): Buffer => svgToPng.convert(svgBuffer, PNG_CONFIG)
);

/* Command API Implementations */

const getById = async (interaction: ChatInputCommandInteraction) => {
  /* @ts-ignore: discord types for `member` missing `displayName` */
  const username = interaction.member?.displayName;
  const tokenId =
    interaction.options.getInteger(ID_INPUT_NAME) ?? getRandomTokenId();
  const message = interaction.options.getString(MESSAGE_INPUT_NAME);
  const showTraits = interaction.options.getBoolean(SHOW_TRAITS_INPUT_NAME);
  const url = getAssetUrl(tokenId);

  await interaction.deferReply();

  try {
    const meta = await fetchTokenMeta(url);
    const image = await parseImageBuffer(meta);

    const embed = new EmbedBuilder()
      .setTitle(meta.name)
      .setURL(meta.permalink)
      .setImage(`attachment://5ku11_${tokenId}.png`)
      .setColor(EMBED_COLOR)
      .addFields(
        showTraits
          ? [{ name: bold("Traits:"), value: parseTraits(meta.traits) }]
          : []
      );

    interaction.editReply({
      content: message ? `${bold(username)}: ${message}` : undefined,
      embeds: [embed],
      files: [
        new AttachmentBuilder(image, {
          name: getFileName(tokenId),
        }),
      ],
    });
  } catch (e) {
    console.error(e);
    interaction.editReply({
      embeds: [
        {
          title: "32202: WH47 D1D Y0U D0?!? 72Y 4941N, 8U7 D0 837732.",
          color: ERROR_MSG_COLOR,
        },
      ],
    });
  }
};

/* Command Options */

const idIntegerOption = (option: SlashCommandIntegerOption) =>
  option
    .setName(ID_INPUT_NAME)
    .setDescription("token id of a 1337skull")
    .setMinValue(0)
    .setMaxValue(COLLECTION_TOKEN_COUNT - 1);

const messageStringOption = (option: SlashCommandStringOption) =>
  option
    .setName(MESSAGE_INPUT_NAME)
    .setDescription("message to accompany image");

const includeInfoBooleanOption = (option: SlashCommandBooleanOption) =>
  option
    .setName(SHOW_TRAITS_INPUT_NAME)
    .setDescription("adds basic information for specific token");

/* Assembled Command */

const getByIdCommand = new SlashCommandBuilder()
  .setName(COMMAND_NAME)
  .setDescription(COMMAND_DESCRIPTION)
  .addIntegerOption(idIntegerOption)
  .addBooleanOption(includeInfoBooleanOption)
  .addStringOption(messageStringOption)
  .toJSON();

const command: CustomCommand = {
  handler: getById,
  command: getByIdCommand,
  name: COMMAND_NAME,
};

export default command;
