const {ClubTag} = require("./primitive/ClubTag")

class PlayerClub{
  /**
   * 
   * @param {ClubTag} tag 
   * @param {string} name 
   */
  constructor(tag,name){
    if((!(tag instanceof ClubTag && typeof name =="string"))||(!tag && !name)){
      throw new Error("PlayerClub constructor data invalid")
    }
    this.tag = tag
    this.tag = name
  }
  static fromObject(data){
    return new PlayerClub(new ClubTag(data.tag),data.name)
  }
}

module.exports = {
  PlayerClub
}