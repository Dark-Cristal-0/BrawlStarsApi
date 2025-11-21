const https = require("https");
const fs = require("fs");const _path = require("path")

const { TokenManager } = require("./../bs-auth/TokenManager");
const { 
  ClientError, 
  Club, ClubMemberList, ClubTag, ClubDescription, ClubMember, ClubRole, ClubType, ClubBadgeId,
  Player, PlayerIcon, PlayerTag, ColorCode, PlayerClub,
  BrawlerStatList, BrawlerStat, AccessoryList, Accessory,StarPowerList,StarPower,GearStatList,GearStat } = require("./../types/BS-Api/index");

class BSApi {
  constructor(login, password,keyName="autoCreate", hostname = "api.brawlstars.com", versionApi = "v1") {
    this.tokenManager = new TokenManager(login, password, keyName);
    this.hostname = hostname;
    this.version = versionApi;
    
  }

  async init(){
    await this.tokenManager.init()
  }
  addParamsInPath(path, after, before, limit) {
    if (after || before || limit) {
      path += "?";
      if (typeof after === "string") path += `after=${after}&`;
      if (typeof before === "string") path += `before=${before}&`;
      if (typeof limit === "number") path += `limit=${limit}&`;
      path = path.slice(0, -1);
    }
    return path;
  }

  async fetch(path) {
    const token = await this.tokenManager.getToken();

    return new Promise((resolve, reject) => {
      const reqOption = {
        protocol: "https:",
        method: "GET",
        hostname: this.hostname,
        path: `/${this.version}/${path}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const req = https.get(reqOption, (res) => {
        let data = "";

        res.on("data", chunk => data += chunk);

        res.on("end", async () => {
          console.log(`path:${req.path}\tstatus:${res.statusCode}`)
          if (!data) {
            return reject(new Error("Empty response body"));
          }
          
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch (err) {
            return reject(new Error("Invalid JSON response"));
          }

          if (res.statusCode === 200) {
            fs.writeFileSync(_path.join(__dirname,"data.json"),JSON.stringify(parsed,null,2))
            return resolve(parsed);
          }

          if (res.statusCode === 403) {
            try {
              await this.tokenManager.refresh();
              const retryResult = await this.fetch(path);
              return resolve(retryResult);
            } catch (retryErr) {
              return reject(retryErr);
            }
          }

          if (res.statusCode >= 400) {
            return reject(new ClientError(parsed, res.statusCode));
          }

          // fallback
          return resolve(parsed);
        });
      });

      req.on("error", err => reject(err));
    });
  }
  

  async getClub(clubTag) {
    try {
      const data = await this.fetch(`clubs/${clubTag}`);
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid club data');
      }
      const club = Club.fromObject(data)

      return club;
    } catch (err) {
      console.error(`Failed to get club ${clubTag}:`, err);
      throw err;
    }
  }

  async getClubMembers(clubTag){
    try {
      const data = await this.fetch(`clubs/${clubTag}/members`);
      const items = Array.isArray(data.items) ? data.items : [];
      const members  = ClubMemberList.fromObject(items)
      return members
    } catch (err) {
      console.error(`Failed to get club members ${clubTag}:`, err);
      throw err;
    }
  }

  async getPlayer(playerTag) {
    try {
      const data = await this.fetch(`players/${playerTag}`);
      const player = Player.fromObject(data)

      return player;
    } catch (err) {
      console.error(`Failed to get player ${playerTag}:`, err);
      throw err;
    }
  }

  async getPlauerBattlelog(playerTag){
    try {
      const data = await this.fetch(`players/${playerTag}/battlelog`);
      

      return data
    } catch (err) {
      console.error(`Failed to get player battlelog ${playerTag}:`, err);
      throw err;
    }
  }
}

module.exports = { BSApi };