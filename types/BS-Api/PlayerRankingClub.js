
class PlayerRankingClub {
  constructor(name){
    if(!(typeof name ==="string")){
      throw new Error("PlayerRakingClub constructor data invalid")
    }
    this.name =name
  }
}

module.exports = {
  PlayerRankingClub
}