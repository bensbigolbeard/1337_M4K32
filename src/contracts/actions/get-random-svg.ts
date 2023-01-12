import { ContractAction } from "../../utils";
import { pipe } from "froebel";
import { decodeDataUri } from "../../utils";
import { COLLECTION_CONTRACT, TRAIT_INDICES } from "../../constants";
import { getRandomSeed } from "../utils.js";

/* Local Constants */

/**
 *   These are the number of entries in the TRAITS arrays in the 1337skull contract.
 *   Selecting anything within these ranges will return a valid trait.
 *
 *   Ref: https://etherscan.io/address/0x9251dec8df720c2adf3b6f46d968107cbbadf4d4#code > Indelible.sol#86
 *
 */
const SVG_MAX_BITS = [52, 186, 119, 80, 68, 137];

// Percent chance represented as decimal between 0-1
const SPECIAL_TRAIT_CHANCE = 0.25;
const UNDER_TRAIT_CHANCE = 0.35;

// Hex values that will render an empty trait
const EMPTY_SPECIAL_VALUE = "052";
const EMPTY_UNDER_VALUE = "080";

/* Local Utils */
function chunk<T>(arr: T[], chunkSize: number) {
  let chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

/* Contract Action */

const action: ContractAction = {
  address: COLLECTION_CONTRACT,
  // todo: fix any later
  handler: async ({ contract }: { contract: any }) => {
    const seed = getRandomSeed(SVG_MAX_BITS);
    const randomSeedTraits = pipe(
      (s: string) => s.split(""),
      (arr: string[]) => chunk<string>(arr, 3),
      (cs: string[][]) => cs.map((c: string[]) => c.join(""))
    )(seed);

    // handle trait weighting
    const weightedSpecial =
      Math.random() > 1 - SPECIAL_TRAIT_CHANCE
        ? randomSeedTraits[TRAIT_INDICES.SPECIAL]
        : EMPTY_SPECIAL_VALUE;
    const weightedUnder =
      Math.random() > 1 - UNDER_TRAIT_CHANCE
        ? randomSeedTraits[TRAIT_INDICES.UNDER]
        : EMPTY_UNDER_VALUE;

    // set weighted traits
    randomSeedTraits[TRAIT_INDICES.SPECIAL] = weightedSpecial;
    randomSeedTraits[TRAIT_INDICES.UNDER] = weightedUnder;

    // merge back into single seed value
    const weightedSeed = randomSeedTraits.join("");

    const svg = await pipe(
      contract.methods.hashToSVG(weightedSeed).call,
      decodeDataUri
    )();

    return { svg, seed: weightedSeed };
  },
};

export default action;
