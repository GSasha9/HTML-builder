const fs = require("fs");
const path = require("path");
const rStream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf-8");
let data = "";
rStream.on("data", (chunk) => data += chunk);
rStream.on("end", () => console.log(data));
rStream.on("error", (error) => console.log(`Don't work because ${error.message}`));