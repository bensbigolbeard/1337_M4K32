import { base64ToBuffer, getRandomTokenId, safeFetch } from "../utils";
import { convert } from "convert-svg-to-png";
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  CommandInteractionOption,
  ApplicationCommandOptionType,
} from "discord.js";
import { COLLECTION_URL } from "../constants";

const COMMAND_NAME = "1337m3";
const INPUT_NAME = "70k3n_1d";
const ERROR_MSG_COLOR = 8000001; // no effing clue... it's red-ish tho

const getFileName = (tokenId: number) => `5ku11_${tokenId}.png`;
const validateInput = ({ name, value = -1 }: CommandInteractionOption) => {
  return name === INPUT_NAME && value >= 0;
};

const getById = async (interaction: ChatInputCommandInteraction) => {
  const opts = interaction.options.data;
  const tokenId = (opts.find(validateInput)?.value ??
    getRandomTokenId()) as number; // type not narrowing, despite checks
  const url = `${COLLECTION_URL}/${tokenId}`;

  await interaction.deferReply();

  try {
    const { token_metadata = "" } = await safeFetch(url);
    const { image_data } = JSON.parse(
      base64ToBuffer(token_metadata).toString()
    );
    if (!image_data) {
      throw new Error("boom. no image.");
    }
    const imageStream = await convert(base64ToBuffer(image_data), {
      width: 250,
      height: 250,
    });

    interaction.editReply({
      files: [
        new AttachmentBuilder(imageStream, { name: getFileName(tokenId) }),
      ],
    });
  } catch (e) {
    console.log(e);
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

const getByIdCommand = {
  name: "1337m3",
  description: "M4Y83 1 W111 5UMM0N 4 5Ku11... M4Y83...",
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: "70k3n_1d",
      description: "token id of a 1337skull",
      min_value: 0,
      max_value: 7330,
    },
  ],
};

export default {
  handler: getById,
  command: getByIdCommand,
  name: COMMAND_NAME,
};
