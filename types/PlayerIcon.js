class PlayerIcon{
  /**
   * 
   * @param {number} id 
   */
  constructor(id){
    if(!(typeof id == "number")){
      throw new Error("PlayerIcon constructor data invalid")
    }
    this.id = id
  }
}
module.exports = {
  PlayerIcon
}