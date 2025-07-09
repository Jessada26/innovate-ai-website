import axios from "axios";
import { IGetExchangeRateUsdApi } from "./interface";

const END_POINT = `${process.env.API_PARTTY_EXCHANGE_RATE}/v6`;

const getExchangeRateUsdApi = async (): Promise<IGetExchangeRateUsdApi> => {
  try {
    const result = await axios({
      method: "get",
      url: `${END_POINT}/333d9c73ce900a5c286e8872/latest/USD`,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

export { getExchangeRateUsdApi };
