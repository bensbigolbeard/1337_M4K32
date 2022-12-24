import { ContractAction } from "./../utils";
import "dotenv/config";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { BASE_ALCHEMY_API_URL, BASE_ETHERSCAN_API_URL } from "../constants";
import fetch from "isomorphic-fetch";

export const initContract = async (action: ContractAction) => {
  const response = await fetch(
    BASE_ETHERSCAN_API_URL.concat(
      "?module=contract",
      "&action=getabi",
      `&address=${action.address}`,
      `&apikey=${process.env.ETHERSCAN}`
    )
  );

  if (!response.ok) throw new Error("response bad");

  const abiSourceString: string = (await response.json())?.result;
  if (!abiSourceString) throw new Error("no abi value");
  const abiSource: AbiItem[] = JSON.parse(abiSourceString);

  const providerEndpoint = `${BASE_ALCHEMY_API_URL}${process.env.ALCHEMY_WS_ID}`;
  const web3 = new Web3(providerEndpoint);

  const contract = new web3.eth.Contract(abiSource, action.address);

  return { web3, contract };
};

const getRandomIntegerWithinMax = (max: number) => {
  // Buffer ensures the max value has about as much chance of getting rolled as any other,
  // otherwise it might get excluded due to `Math.floor`
  const buffer = 0.99;
  const num = Math.floor(Math.random() * max + buffer).toString();
  return Array(3 - num.length)
    .fill("0")
    .concat(num)
    .join("");
};
export const getRandomSeed = (maxBytes: number[]) => {
  return maxBytes.map(getRandomIntegerWithinMax).join("");
};
