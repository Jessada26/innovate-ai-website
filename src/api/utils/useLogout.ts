import { logoutApi } from "@/src/api/api-client";
import { ILogoutApi } from "@/src/api/api-interface";
import { setCookie } from "cookies-next";

const UseLogout = async (setSession: Function) => {
  try {
    const result: ILogoutApi = await logoutApi();
    if (result?.message === "logout") {
      setSession("", result.message);
      setCookie("token", "");
    }
  } catch (err) {
    throw err;
  }
};

export default UseLogout;
