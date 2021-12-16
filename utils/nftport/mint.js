const fetch = require("node-fetch");
const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const fs = require("fs");

const AUTH = '89fc2294-0a7b-409a-abe9-770a4dedf409';
const CONTRACT_ADDRESS = '0x2CbcF1457e4A74398581d7bAAb819ECEe90e63a7';
const MINT_TO_ADDRESS = '0x3e3f8d33b2b9f0e17b089F25F20602300Ffa4c61';
const CHAIN = 'rinkeby';

const ipfsMetas = JSON.parse(
  fs.readFileSync(`${basePath}/build/json/_ipfsMetas.json`)
);

fs.writeFileSync(`${basePath}/build/minted.json`, "");
const writter = fs.createWriteStream(`${basePath}/build/minted.json`, {
  flags: "a",
});
writter.write("[");
nftCount = ipfsMetas.length;

ipfsMetas.forEach((meta, index) => {
  setTimeout(function(){

    let url = "https://api.nftport.xyz/v0/mints/customizable";

    const mintInfo = {
      chain: CHAIN,
      contract_address: CONTRACT_ADDRESS,
      metadata_uri: meta.metadata_uri,
      mint_to_address: MINT_TO_ADDRESS,
      token_id: meta.edition,
    };

    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH,
      },
      body: JSON.stringify(mintInfo),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        writter.write(JSON.stringify(json, null, 2));
        nftCount--;

        if (nftCount === 0) {
          writter.write("]");
          writter.end();
        } else {
          writter.write(",\n");
        }

        console.log(`Minted: ${json.transaction_external_url}`);
      })
      .catch((err) => console.error("error:" + err));
  }, 5000 * (index + 1))
});
