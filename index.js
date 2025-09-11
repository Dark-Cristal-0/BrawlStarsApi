


// /**
//  * @typedef {("global")} BSApi.CountryCode Two letter country code, or 'global' for global rankings.
//  * @typedef {string} BSApi.playerTag Tag of the player.
//  * @typedef {string} BSApi.clubTag Tag of the club.
//  * 
//  * @typedef {(
//  * {reason:"accessDenied",message:"Invalid authorization"}|
//  * {reason: 'notFound', message: 'Not found with tag undefined'}|
//  * {reason: "badRequest", message: "Both 'after' and 'before' can't be specified in the request"}|
//  * {reason: "badRequest", message: "Invalid 'after' or 'before' marker used in the request"}|
//  * {reason:string,message:string,type:string,detail:*,statusCode:number})} BSApi.ClientError
//  * 
//  */



const https = require("https")

/**
 * @typedef {import('./types')} BS
 */


/**@type {BSApi.ClientError} */
class BSApiClientError{
  constructor(reason,message,type,detail,statusCode){
    this.reason = reason
    this.message = message
    this.type = type
    this.detail = detail
    this.statusCode = statusCode
  }
}

class BSApi{
  /**
   * 
   * @param {string} login login by https://developer.brawlstars.com/
   * @param {string} password password by https://developer.brawlstars.com/
   * @param {string} hostname hostname brawl stars api
   * @param {string} versionApi 
   */
  constructor(login,password,hostname="api.brawlstars.com",versionApi="v1"){
    this.login = login
    this.password = password
    this.hostname = hostname
    this.version = versionApi
    this.token = ""
  }
  /**
   * 
   * @param {string} path 
   * @param {string} after 
   * @param {string} before 
   * @param {number} limit 
   * @returns 
   */
  addParamsInPath(path,after,before,limit){
    if(after||before||limit){
      path+="?"
      if(typeof after === 'string'){
        path+=`after=${after}&`
      }
      if(typeof before === 'string'){
        path+=`after=${before}&`
      }
      if(typeof limit === 'number'){
        path+=`limit=${limit}&`
      }
      path = path.substring(0,path.length-1)
    }
    return path
  }
  /**
   * 
   * @param {string} path 
   * @param {*} before Return only items that occur before this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
   * @param {*} after Return only items that occur after this marker. Before marker can be found from the response, inside the 'paging' property. Note that only after or before can be specified for a request, not both.
   * @param {*} limit Limit the number of items returned in the response.
   * @returns 
   */
  async fetch(path){
    return new Promise((resolve,reject)=>{
      const reqOption = {
        protocol: "https:",
        method: "GET",
        hostname: this.hostname,
        path: `/${this.version}/${path}`,
        headers:{
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      }
      const req = https.get(reqOption,(res)=>{
        let data = ""
        res.on("data",(chank)=>{
          data+=chank
        })
        res.on("end",()=>{
          try{
            
            const dataInObj = JSON.parse(data)
            if((res.statusCode>=400)){
              if(res.statusCode == 403){
                //**************************************************************** */
              }
              /**@type {BSApi.ClientError} */
              const clientErr = dataInObj
              clientErr.statuseCode = res.statusCode
              reject(clientErr)
            }
            resolve(dataInObj)
          }catch(err){
            reject(err)
          }
        })
      })
      req.on("error",(err)=>{
        reject(err)
      })
    })
  }
  /**
   * @param {BSApi.clubTag} clubTag 
   * @returns 
   */
  async getClub(clubTag){
    /**
     *@type {{
     * tag: string;
     * name: string;
     * description: string;
     * trophies: number;
     * requiredTrophies: number;
     * members: BSApi.ClubMemberList;
     * type: BSApi.types.ClubType;
     * badgeId: number;
     *}}
     */
    const data = await this.fetch(`clubs/${clubTag}`)
    return data
  }
  /**
   * 
   * @param {BSApi.clubTag} clubTag 
   * @param {string} after 
   * @param {string} before 
   * @param {number} limit 
   * @returns 
   */
  async getClubMembers(clubTag,after,before, limit){
    let path = this.addParamsInPath(`clubs/${clubTag}/members`,after,before,limit)
    /**
     * @type {Array[{
     *  icon: BSApi.PlayerIcon;
     *  tag: string;
     *  name: string;
     *  trophies: number;
     *  role: BSApi.types.ClubMemberRole;
     *  nameColor: string;
     * }]}
     */
    const data = await this.fetch(path)
    return data
  }
  /**
   * 
   * @param {BSApi.playerTag} playerTag 
   * @returns 
   */
  async getPlayer(playerTag){
    const data = await this.fetch(`players/${playerTag}`)
    return data
  }
}

module.exports = {BSApi}
