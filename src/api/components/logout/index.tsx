import logoutStyles from "../../../../styles/sass/logout.module.scss";
import UseLogout from "@/src/api/utils/useLogout";
import { ILogout } from "./interface";

const Logout = (props: ILogout) => {
  const { setLogoutSession } = props;
  return (
    <button
      className={logoutStyles.button}
      onClick={() => UseLogout(setLogoutSession)}
      id="logout"
    >
      Logout
    </button>
  );
};

export default Logout;
