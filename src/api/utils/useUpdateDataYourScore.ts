import { ISaveYourScoreApi } from "@/src/api/api-interface";

import { saveYourScoreApi } from "@/src/api/api-client";
import { CookieValueTypes } from "cookies-next";

interface IUpdateDataYourScore {
  highScore?: number;
  yourScore?: number;
}

const UseUpdateDataYourScore = async (
  payload: IUpdateDataYourScore,
  session: CookieValueTypes
) => {
  const payloadSaveYourScoreApi: ISaveYourScoreApi = {
    session,
    highScore: payload?.highScore,
    yourScore: payload?.yourScore,
  };
  await saveYourScoreApi(payloadSaveYourScoreApi);
};

export default UseUpdateDataYourScore;
