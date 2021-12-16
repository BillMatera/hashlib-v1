const FormData = require("form-data");
const fetch = require("node-fetch");

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");

// add ur own API key that you retrieved from nftport
const AUTH = '89fc2294-0a7b-409a-abe9-770a4dedf409';

fs.readdirSync(`${basePath}/build/images`).forEach((file, index) => {
  setTimeout(function(){
    const formData = new FormData();
    const fileStream = fs.createReadStream(`${basePath}/build/images/${file}`);
    formData.append("file", fileStream);

    let url = "https://api.nftport.xyz/v0/files";
    let options = {
      method: "POST",
      headers: {
        Authorization: AUTH,
      },
      body: formData,
    };

  
    fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      const fileName = path.parse(json.file_name).name;
      let rawdata = fs.readFileSync(`${basePath}/build/json/${fileName}.json`);
      let metaData = JSON.parse(rawdata);

      metaData.file_url = json.ipfs_url;

      fs.writeFileSync(
        `${basePath}/build/json/${fileName}.json`,
        JSON.stringify(metaData, null, 2)
      );

      console.log(`${json.file_name} uploaded & ${fileName}.json updated!`);
    })
    .catch((err) => console.error("error:" + err));
  }, 5000 * (index + 1))
});
