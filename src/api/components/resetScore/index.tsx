import resetScoreStyles from "../../../../styles/sass/resetScore.module.scss";
import { IResetScore } from "./interface";
import UseUpdateDataYourScore from "../../utils/useUpdateDataYourScore";

const ResetScore = (props: IResetScore) => {
  const { session, setYourScore, setMyHighScore } = props;

  const clickResetScore = async () => {
    const payload = {
      highScore: 0,
      yourScore: 0,
    };
    await UseUpdateDataYourScore(payload, session);
    setYourScore(0);
    setMyHighScore(0);
  };

  return (
    <button onClick={clickResetScore} className={resetScoreStyles.button}>
      Reset Score
    </button>
  );
};

export default ResetScore;
