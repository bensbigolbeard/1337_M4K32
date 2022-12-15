import { pipe } from "froebel";
import svgToPng from "convert-svg-to-png";
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import {
  CustomCommand,
  fetchAssetImageBuffer,
  getRandomTokenId,
} from "../utils";
import { COLLECTION_TOKEN_COUNT, COLLECTION_URL } from "../constants";

/* Local Constants */

const COMMAND_NAME = "1337_m3";
const INPUT_NAME = "70k3n_1d";
const ERROR_MSG_COLOR = 0x880808; // red
const PNG_CONFIG = {
  puppeteer: { args: ["--no-sandbox"] },
  width: 125,
  height: 125,
};

/* Local Utils */

const getFileName = (tokenId: number) => `5ku11_${tokenId}.png`;
const getAssetUrl = (tokenId: number) => `${COLLECTION_URL}/${tokenId}`;
const filterInvalidImage = (input: Buffer | null) => {
  if (!input) throw new Error("boom. no image.");
  return input;
};

/* Command API Implementations */

const getById = async (interaction: ChatInputCommandInteraction) => {
  const tokenId =
    interaction.options.getInteger(INPUT_NAME) ?? getRandomTokenId();
  const url = getAssetUrl(tokenId);

  await interaction.deferReply();

  try {
    const attachment = await pipe(
      fetchAssetImageBuffer,
      filterInvalidImage,
      (svgBuffer): Buffer => svgToPng.convert(svgBuffer, PNG_CONFIG),
      (pngBuffer) =>
        new AttachmentBuilder(pngBuffer, {
          name: getFileName(tokenId),
        })
    )(url);

    interaction.editReply({ files: [attachment] });
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

const getByIdCommand = new SlashCommandBuilder()
  .setName(COMMAND_NAME)
  .setDescription("M4Y83 1 W111 5UMM0N 4 5Ku11... M4Y83...")
  .addIntegerOption((option) =>
    option
      .setName(INPUT_NAME)
      .setDescription("token id of a 1337skull")
      .setMinValue(0)
      .setMaxValue(COLLECTION_TOKEN_COUNT - 1)
  )
  .toJSON();

const command: CustomCommand = {
  handler: getById,
  command: getByIdCommand,
  name: COMMAND_NAME,
};

export default command;
