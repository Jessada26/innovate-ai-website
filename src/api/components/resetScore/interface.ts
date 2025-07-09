import { CookieValueTypes } from "cookies-next";

export interface IResetScore {
  session: CookieValueTypes;
  setYourScore: Function;
  setMyHighScore: Function;
}
