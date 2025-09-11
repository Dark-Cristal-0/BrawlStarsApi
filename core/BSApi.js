const https = require("https");
const { TokenManager } = require("./../bs-auth/TokenManager");
const { ClientError, Club, ClubMemberList, Player } = require("./../types/index");

class BSApi {
  constructor(login, password, hostname = "api.brawlstars.com", versionApi = "v1") {
    this.tokenManager = new TokenManager(login, password);
    this.hostname = hostname;
    this.version = versionApi;
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

  async fetch(path, retry = true) {
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
        res.on("data", (chunk) => (data += chunk));
        res.on("end", async () => {
          try {
            const parsed = JSON.parse(data);

            if (res.statusCode === 403 && retry) {
              await this.tokenManager.refresh();
              const retryResult = await this.fetch(path, false);
              return resolve(retryResult);
            }

            if (res.statusCode >= 400) {
              const error = new ClientError(parsed, res.statusCode);
              return reject(error);
            }

            resolve(parsed);
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on("error", (err) => reject(err));
    });
  }

  async getClub(clubTag) {
    try {
      const raw = await this.fetch(`clubs/${clubTag}`);
      return new Club(raw);
    } catch (err) {
      if (err instanceof ClientError) throw err;
      throw new Error("Unexpected error in getClub: " + err.message);
    }
  }

  async getClubMembers(clubTag, after, before, limit) {
    const path = this.addParamsInPath(`clubs/${clubTag}/members`, after, before, limit);
    try {
      const raw = await this.fetch(path);
      return new ClubMemberList(...raw.items); // або new ClubMemberList(raw), залежно від реалізації
    } catch (err) {
      if (err instanceof ClientError) throw err;
      throw new Error("Unexpected error in getClubMembers: " + err.message);
    }
  }

  async getPlayer(playerTag) {
    try {
      const raw = await this.fetch(`players/${playerTag}`);
      return new Player(raw);
    } catch (err) {
      if (err instanceof ClientError) throw err;
      throw new Error("Unexpected error in getPlayer: " + err.message);
    }
  }

  async revokeToken() {
    return await this.tokenManager.cleanup();
  }
}

module.exports = { BSApi };
