const https = require("https");


function getLocationFromIP(ip) {
  return new Promise((resolve, reject) => {
    const BASE_URL = "https://api.ip2location.io/";
    const apiKey = process.env.IP2LOCATION_KEY;  // Ensure you have set your API key in env variables

    // Build query parameters
    const params = new URLSearchParams({
      key: apiKey,
      ip: ip,
    });
    const url = `${BASE_URL}?${params.toString()}`;

    let responseData = "";
    https.get(url, (res) => {
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        try {
          const geoData = JSON.parse(responseData);
          resolve(geoData);
        } catch (err) {
          reject(new Error("Error parsing geo location data"));
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = { getLocationFromIP };
