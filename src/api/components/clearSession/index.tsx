import { IClearSession } from "./interface";
import clearSessionStyles from "../../../../styles/sass/clearSession.module.scss";
import UseClearSession from "../../utils/useClearSession";

const ClearSession = (props: IClearSession) => {
  const { setLogoutSession } = props;

  return (
    <button
      onClick={() => UseClearSession(setLogoutSession)}
      className={clearSessionStyles.button}
    >
      Clear session user
    </button>
  );
};

export default ClearSession;
