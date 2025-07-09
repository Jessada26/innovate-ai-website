import countYourScore from "./countYourScore";

describe("rockPaperScissors", () => {
  describe("Count your score if you away win", () => {
    test("case: your old score is 0 and your new score after compare bot is 0 should to get current score = 0", () => {
      const payload = {
        yourScore: 0,
        yourScoreAfterActionCompare: 0,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(0);
    });

    test("case: your old score is 0 and your new score after compare bot is 1 should to get current score = 1", () => {
      const payload = {
        yourScore: 0,
        yourScoreAfterActionCompare: 1,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(1);
    });

    test("case: your old score is 0 and your new score after compare bot is -1 should to get current score = 0", () => {
      const payload = {
        yourScore: 0,
        yourScoreAfterActionCompare: -1,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(0);
    });

    test("case: your old score is 1 and your new score after compare bot is 0 should to get current score = 1", () => {
      const payload = {
        yourScore: 1,
        yourScoreAfterActionCompare: 0,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(1);
    });

    test("case: your old score is 1 and your new score after compare bot is 1 should to get current score = 2", () => {
      const payload = {
        yourScore: 1,
        yourScoreAfterActionCompare: 1,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(2);
    });

    test("case: your old score is 1 and your new score after compare bot is -1 should to get current score = 0", () => {
      const payload = {
        yourScore: 1,
        yourScoreAfterActionCompare: -1,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(0);
    });

    test("case: your old score is 2 and your new score after compare bot is 0 should to get current score = 2", () => {
      const payload = {
        yourScore: 2,
        yourScoreAfterActionCompare: 0,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(2);
    });

    test("case: your old score is 2 and your new score after compare bot is -1 should to get current score = 0", () => {
      const payload = {
        yourScore: 2,
        yourScoreAfterActionCompare: -1,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(0);
    });

    test("case: your old score is 2 and your new score after compare bot is 1 should to get current score = 3", () => {
      const payload = {
        yourScore: 2,
        yourScoreAfterActionCompare: 1,
      };
      const { yourScore, yourScoreAfterActionCompare } = payload;
      const request = countYourScore(yourScore, yourScoreAfterActionCompare);
      expect(request).toEqual(3);
    });
  });
});
