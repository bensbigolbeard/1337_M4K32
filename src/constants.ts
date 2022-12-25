const BASE_OPENSEA_API_URL = "https://api.opensea.io/asset/";
const BASE_ETHERSCAN_API_URL = "https://api.etherscan.io/api/";
const BASE_ETHERSCAN_URL = "https://etherscan.io/address/";
const BASE_ALCHEMY_API_URL = "wss://eth-mainnet.g.alchemy.com/v2/";

const COLLECTION_CONTRACT = "0x9251dec8df720c2adf3b6f46d968107cbbadf4d4";
const COLLECTION_CONTRACT_URL = `${BASE_ETHERSCAN_URL}${COLLECTION_CONTRACT}`;
const COLLECTION_API_URL = `${BASE_OPENSEA_API_URL}${COLLECTION_CONTRACT}`;
const COLLECTION_TOKEN_COUNT = 7331;

const ALL_TRAIT_IMAGES_REGEX = /image.+href="([^\"]+)"/;
const TRAIT_IMAGE_REGEX = /(url\(data:[^\)]*\))/g;

const SVG_DATA_URI_HEADERS = "data:image/svg+xml;base64,";

const PNG_CONFIG = {
  puppeteer: { args: ["--no-sandbox"] },
  width: 150,
  height: 150,
};

const ERROR_MESSAGE = "32202: WH47 D1D Y0U D0?!? 72Y 4941N, 8U7 D0 837732.";

enum TRAIT_INDICES {
  SPECIAL,
  OVER,
  EYES,
  UNDER,
  SKULLS,
  BACKGROUND,
}

export {
  TRAIT_INDICES,
  ALL_TRAIT_IMAGES_REGEX,
  TRAIT_IMAGE_REGEX,
  SVG_DATA_URI_HEADERS,
  ERROR_MESSAGE,
  PNG_CONFIG,
  BASE_OPENSEA_API_URL,
  BASE_ETHERSCAN_API_URL,
  BASE_ALCHEMY_API_URL,
  COLLECTION_CONTRACT,
  COLLECTION_CONTRACT_URL,
  COLLECTION_API_URL,
  COLLECTION_TOKEN_COUNT,
};
