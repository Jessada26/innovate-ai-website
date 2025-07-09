import { CookieValueTypes } from "cookies-next";

export interface ILoginApi {
  username: string;
  password: string;
}

export interface ILogoutApi {
  message: string;
}

export interface IClearSessionApi extends ILogoutApi {}

export interface IBotActionApi {
  session: CookieValueTypes;
}

export interface IGetYourScoreApi extends IBotActionApi {}

export interface ICompareYourScoreApi extends IBotActionApi {
  botAction: string;
  yourAction: string;
}

export interface ISaveYourScoreApi extends IBotActionApi {
  highScore?: number;
  yourScore?: number;
}

interface IUsdCmcTopRankApi {
  price: number;
}
interface IQuoteCmcTopRankApi {
  USD: IUsdCmcTopRankApi;
}
export interface IDataCmcTopRankApi {
  id: number;
  cmc_rank: number;
  name: string;
  quote: IQuoteCmcTopRankApi;
}

interface ICoin {
  currencyId: number;
  amount: number;
}

interface IFavorCoin {
  currencyId: number;
}

export interface IUpdateUserCoinsApi {
  id: string;
  coin: ICoin[];
  favorCoin: IFavorCoin[];
}

export interface IGetProfileApi extends IUpdateUserCoinsApi {
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
}

export interface IMergeUserData extends IDataCmcTopRankApi {
  amount: number;
  favor: boolean;
}

export interface IBooks {
  id: string;
  title: string;
  author: string;
  publishedYear: Number;
  genre: string;
}

export interface IGetBooksResponse {
  data: IBooks[];
  total: number;
}

export interface ICreateBookDto {
  title: string;
  author: string;
  publishedYear?: number;
  genre?: string;
}

export interface IUpdateBookDto extends Partial<ICreateBookDto> {}
