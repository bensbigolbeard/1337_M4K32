import { getById, traitRoulette } from "./subCommands/index";
import { SlashCommandBuilder } from "discord.js";
import { CustomCommand } from "../utils";

/* Local Constants */

const COMMAND_NAME = "1337_m3";
const COMMAND_DESCRIPTION = "M4Y83 1 W111 5UMM0N 4 5Ku11... M4Y83...";

/* Assembled Command */

const getSkullCommand = new SlashCommandBuilder()
  .setName(COMMAND_NAME)
  .setDescription(COMMAND_DESCRIPTION)
  .addSubcommand(getById.subCommand)
  .addSubcommand(traitRoulette.subCommand)
  .toJSON();

const command: CustomCommand = {
  command: getSkullCommand,
  name: COMMAND_NAME,
  subCommands: {
    unleash_skull: getById.handler,
    hypothetiskull: traitRoulette.handler,
  },
};

export default command;
