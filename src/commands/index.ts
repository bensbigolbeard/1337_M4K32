import getById from "./get-by-id";
export const COMMAND_REGISTRY = [getById.command];

export const commands = {
  getById,
};
