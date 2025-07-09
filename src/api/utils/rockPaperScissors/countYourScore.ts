const countYourScore =(yourScore: number, yourScoreAfterActionCompare: number):number=>{
    let count = yourScore;
    if (yourScoreAfterActionCompare > 0) {
      count++;
    } else {
      if (yourScoreAfterActionCompare === -1) count = 0;
    }
    return count
}

export default countYourScore