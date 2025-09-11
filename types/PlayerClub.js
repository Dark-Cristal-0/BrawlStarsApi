const {ClubTag} = require("./primitive/ClubTag")

class PlayerClub{
  /**
   * 
   * @param {ClubTag} tag 
   * @param {string} name 
   */
  constructor(tag,name){
    if(!(tag instanceof ClubTag && typeof name =="string")){
      throw new Error("PlayerClub constructor data invalid")
    }
    this.tag = tag
    this.tag = name
  }
}

module.exports = {
  PlayerClub
}