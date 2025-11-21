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
  static fromObject(data){
    return new PlayerIcon(data.id)
  }
}
module.exports = {
  PlayerIcon
}