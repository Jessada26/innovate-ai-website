import axios from "axios";
import { getCookie } from "cookies-next";
import {
  ILoginApi,
  ILogoutApi,
  IBotActionApi,
  ICompareYourScoreApi,
  ISaveYourScoreApi,
  IGetYourScoreApi,
  IClearSessionApi,
  IDataCmcTopRankApi,
  IGetProfileApi,
  IUpdateUserCoinsApi,
  IGetBooksResponse,
  ICreateBookDto,
  IUpdateBookDto,
  IBooks,
} from "../api-interface";

const END_POINT = `${process.env.API_URL}/api`;

const loginApi = async (payload: ILoginApi) => {
  try {
    const result = await axios({
      method: "post",
      url: `${END_POINT}/auth/login`,
      data: payload,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const getCmcTopRankApi = async (): Promise<IDataCmcTopRankApi[]> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: getCookie("access_token") || "",
      },
    };
    const result = await axios({
      method: "get",
      url: `${END_POINT}/coinmarketcaps/top-cmc-rank`,
      headers: config.headers,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const getProfileApi = async (): Promise<IGetProfileApi | null> => {
  const config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: getCookie("access_token") || "",
    },
  };
  try {
    const result = await axios({
      method: "get",
      url: `${END_POINT}/users/profile`,
      headers: config.headers,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const botActionApi = async (payload: IBotActionApi) => {
  try {
    const { session } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: session,
      },
    };
    const result = await axios({
      method: "get",
      url: `${END_POINT}/botAction`,
      headers: config.headers,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const getYourScoreApi = async (payload: IGetYourScoreApi) => {
  try {
    const { session } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: session,
      },
    };

    const result = await axios({
      method: "get",
      url: `${END_POINT}/yourScore`,
      headers: config.headers,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const compareYourScoreApi = async (payload: ICompareYourScoreApi) => {
  try {
    const { session, botAction, yourAction } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: session,
      },
    };
    const body = {
      botAction,
      yourAction,
    };
    const result = await axios({
      method: "post",
      url: `${END_POINT}/compareActionGetYourScore`,
      headers: config.headers,
      data: body,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const saveYourScoreApi = async (payload: ISaveYourScoreApi) => {
  try {
    const { session, highScore, yourScore } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: session,
      },
    };
    const body = {
      highScore,
      yourScore,
    };
    const result = await axios({
      method: "post",
      url: `${END_POINT}/saveYourScore`,
      headers: config.headers,
      data: body,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const logoutApi = async (): Promise<ILogoutApi> => {
  const config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: getCookie("access_token") || "",
    },
  };
  try {
    const result = await axios({
      method: "post",
      url: `${END_POINT}/auth/logout`,
      withCredentials: true,
      headers: config.headers,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const clearSessionApi = async (): Promise<IClearSessionApi> => {
  try {
    const result = await axios({
      method: "post",
      url: `${END_POINT}/clearSession`,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const updateUserCoinsApi = async (payload: IUpdateUserCoinsApi) => {
  try {
    const { id, coin, favorCoin } = payload;
    const config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: getCookie("access_token") || "",
      },
    };
    const body = {
      coin,
      favorCoin,
    };
    const result = await axios({
      method: "patch",
      url: `${END_POINT}/users/${id}`,
      headers: config.headers,
      data: body,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const getBooks = async (
  page: number = 1,
  limit: number = 10
): Promise<IGetBooksResponse> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: getCookie("access_token") || "",
      },
      params: {
        page,
        limit,
      },
    };
    const result = await axios.get(`${END_POINT}/books`, config);
    return result.data;
  } catch (err) {
    throw err;
  }
};

const getBookById = async (id: string): Promise<IBooks> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: getCookie("access_token") || "",
      },
    };
    const result = await axios.get(`${END_POINT}/books/${id}`, {
      headers: config.headers,
      withCredentials: true,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const createBook = async (payload: ICreateBookDto): Promise<IBooks> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: getCookie("access_token") || "",
      },
    };
    const result = await axios.post(`${END_POINT}/books`, payload, {
      headers: config.headers,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const updateBook = async (
  id: string,
  payload: IUpdateBookDto
): Promise<IBooks> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: getCookie("access_token") || "",
      },
    };
    const result = await axios.patch(`${END_POINT}/books/${id}`, payload, {
      headers: config.headers,
    });
    return result.data;
  } catch (err) {
    throw err;
  }
};

const deleteBook = async (id: string): Promise<void> => {
  try {
    const config = {
      headers: {
        Authorization: getCookie("access_token") || "",
      },
    };
    await axios.delete(`${END_POINT}/books/${id}`, {
      headers: config.headers,
    });
  } catch (err) {
    throw err;
  }
};

export {
  loginApi,
  logoutApi,
  botActionApi,
  compareYourScoreApi,
  saveYourScoreApi,
  getYourScoreApi,
  clearSessionApi,
  getCmcTopRankApi,
  getProfileApi,
  updateUserCoinsApi,
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
