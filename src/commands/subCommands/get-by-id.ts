import { pipe } from "froebel";
import svgToPng from "convert-svg-to-png";
import {
  AttachmentBuilder,
  bold,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBooleanOption,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import {
  getRandomTokenId,
  fetchTokenImage,
  fetchTokenMeta,
  ParsedAssetResponse,
  CustomSubCommand,
} from "../../utils";
import {
  COLLECTION_TOKEN_COUNT,
  COLLECTION_API_URL,
  ERROR_MESSAGE,
  PNG_CONFIG,
} from "../../constants";

/* Local Constants */

const SUB_COMMAND_NAME = "unleash_skull";
const SUB_COMMAND_DESCRIPTION = "summons a skull from the official collection";

const ID_INPUT_NAME = "token_id";
const ID_INPUT_DESCRIPTION = "token id of a 1337skull";
const MESSAGE_INPUT_NAME = "message";
const MESSAGE_INPUT_DESCRIPTION = "message";
const SHOW_TRAITS_INPUT_NAME = "show_traits";
const SHOW_TRAITS_INPUT_DESCRIPTION = "show_traits";

const ERROR_MSG_COLOR = 0x880808; // red
const EMBED_COLOR = 0x48dd00; // 1337 green

/* Local Utils */

const getFileName = (tokenId: number) => `5ku11_${tokenId}.png`;
const getAssetUrl = (tokenId: number) => `${COLLECTION_API_URL}/${tokenId}`;
const formatTraits = (traits: ParsedAssetResponse["traits"]) =>
  traits.map(({ name, value }) => `${bold(name)}: ${value}`).join(", ");

const filterInvalidImage = (input: Buffer | null) => {
  if (!input) throw new Error("boom. no image.");
  return input;
};

const parseImageBuffer = pipe(
  fetchTokenImage,
  filterInvalidImage,
  (svgBuffer: Buffer): Buffer => svgToPng.convert(svgBuffer, PNG_CONFIG)
);

/* Command Interaction Handler */

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
      .setImage(`attachment://${getFileName(tokenId)}`)
      .setColor(EMBED_COLOR)
      .addFields(
        showTraits
          ? [{ name: bold("Traits:"), value: formatTraits(meta.traits) }]
          : []
      );

    interaction.editReply({
      content: message ? `${bold(username)}: ${message}` : undefined,
      embeds: [embed],
      files: [new AttachmentBuilder(image, { name: getFileName(tokenId) })],
    });
  } catch (e) {
    console.error(e);
    interaction.editReply({
      embeds: [
        {
          title: ERROR_MESSAGE,
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
    .setDescription(ID_INPUT_DESCRIPTION)
    .setMinValue(0)
    .setMaxValue(COLLECTION_TOKEN_COUNT - 1);

const messageStringOption = (option: SlashCommandStringOption) =>
  option.setName(MESSAGE_INPUT_NAME).setDescription(MESSAGE_INPUT_DESCRIPTION);

const includeInfoBooleanOption = (option: SlashCommandBooleanOption) =>
  option
    .setName(SHOW_TRAITS_INPUT_NAME)
    .setDescription(SHOW_TRAITS_INPUT_DESCRIPTION);

/** Sub Command */

const getByIdSubCommand = (subCommand: SlashCommandSubcommandBuilder) =>
  subCommand
    .setName(SUB_COMMAND_NAME)
    .setDescription(SUB_COMMAND_DESCRIPTION)
    .addIntegerOption(idIntegerOption)
    .addBooleanOption(includeInfoBooleanOption)
    .addStringOption(messageStringOption);

const subCommand: CustomSubCommand = {
  subCommand: getByIdSubCommand,
  handler: getById,
};

export default subCommand;
