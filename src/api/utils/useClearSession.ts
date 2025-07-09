import { clearSessionApi } from "@/src/api/api-client";
import { IClearSessionApi } from "@/src/api/api-interface";
import { setCookie } from "cookies-next";

const UseClearSession = async (setSession: Function) => {
  try {
    const result: IClearSessionApi = await clearSessionApi();
    if (result?.message === "clear session") {
      setSession("", result.message);
      setCookie("token", "");
    }
  } catch (err) {
    throw err;
  }
};

export default UseClearSession;
