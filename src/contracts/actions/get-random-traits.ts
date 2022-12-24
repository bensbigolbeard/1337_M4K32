import { ContractAction } from "../../utils";
import { COLLECTION_CONTRACT } from "../../constants";
import { getRandomSeed } from "../utils.js";

/** Local Constants */

/**
 *   This is definitely weird, but the seed is an 18-bit number,
 *   made up of 6, 3-bit sections controlling separate traits.
 *
 *   These numbers below were the max values I could enter for
 *   each trait, without triggering an error. I did this manually
 *   by reverse engineering it, so there could be incorrect assumptions here.
 */
const TRAITS_MAX_BITS = [255, 999, 999, 255, 999, 999];

/* Contract Action */

const action: ContractAction = {
  address: COLLECTION_CONTRACT,
  // todo: fix any later
  handler: async ({ contract }: { contract: any }) => {
    const seed = getRandomSeed(TRAITS_MAX_BITS);

    const traits = await contract.methods.hashToMetadata(seed).call();

    return { traits };
  },
};

export default action;
