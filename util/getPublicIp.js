const https = require("https")

const getPublicIP = () => {
  return new Promise((resolve, reject) => {
    https.get("https://api.ipify.org?format=json", (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.ip);
        } catch (err) {
          reject(new Error("IP parse error: " + err));
        }
      });
    }).on("error", err => reject(new Error("IP fetch error: " + err)));
  });
};

module.exports = {getPublicIP}