import { ContractAction } from "./../utils";
import { pipe } from "froebel";
import { initContract } from "./utils";
import getRandomSvg from "./actions/get-random-svg";
import getRandomMeta from "./actions/get-random-traits";

export const executeAction = async (action: ContractAction) =>
  pipe(initContract, action.handler)(action);

export const getRandomImage = () => executeAction(getRandomSvg);
export const getRandomTraits = () => executeAction(getRandomMeta);
