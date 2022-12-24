import { CustomSubCommand } from "./../../utils";
import { pipe } from "froebel";
import svgToPng from "convert-svg-to-png";
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { getRandomImage } from "../../contracts/index";
import {
  COLLECTION_CONTRACT_URL,
  ERROR_MESSAGE,
  PNG_CONFIG,
} from "../../constants";

/* Local Constants */

const COMMAND_NAME = "hypothetiskull";
const COMMAND_DESCRIPTION =
  "generates a new, random skull not found in the collection";
const EMBED_TITLE = "1 D0N7 3x157, D0 1?";
const EMBED_URL = `${COLLECTION_CONTRACT_URL}#readContract`;
const EMBED_IMAGE_NAME = "24nd0m_5ku11.png";

const ERROR_MSG_COLOR = 0x880808; // red
const EMBED_COLOR = 0x48dd00; // 1337 green

/* Local Utils */

const convertSvgToPngBuffer = pipe(getRandomImage, async ({ svg, seed }) => ({
  image: await svgToPng.convert(svg, PNG_CONFIG),
  seed,
}));

/* Command Interaction Handler */

export const traitRoulette = async (
  interaction: ChatInputCommandInteraction
) => {
  await interaction.deferReply();

  try {
    const { image, seed } = await convertSvgToPngBuffer();

    const embed = new EmbedBuilder()
      .setTitle(EMBED_TITLE)
      .setURL(EMBED_URL)
      .setImage(`attachment://${EMBED_IMAGE_NAME}`)
      .setColor(EMBED_COLOR)
      .addFields([{ name: "Seed:", value: seed, inline: true }]);

    interaction.editReply({
      embeds: [embed],
      files: [new AttachmentBuilder(image, { name: EMBED_IMAGE_NAME })],
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

/* Assembled Command */

const traitRouletteSubCommand = (command: SlashCommandSubcommandBuilder) =>
  command.setName(COMMAND_NAME).setDescription(COMMAND_DESCRIPTION);

const subCommand: CustomSubCommand = {
  subCommand: traitRouletteSubCommand,
  handler: traitRoulette,
};

export default subCommand;
