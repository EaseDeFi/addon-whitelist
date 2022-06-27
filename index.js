const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const fs = require('fs');
const whilelist = require("./whitelist.json")
const newIds = require("./newIds.json")

//TODO: 
// var returnWhitelist = async() => {
//   console.log(whilelist);
// };

var getIds = async() => {
  try {
    for(let i = 1; i <= 4; i++) {
      let coins = await CoinGeckoClient.coins.markets({order: CoinGecko.ORDER.MARKET_CAP_DESC, per_page: 250, page: i});

      coins.data.forEach(e => {
        try {
          let data = fs.readFileSync('newIds.json');
          var json = JSON.parse(data);
          Object.keys(e).forEach((key) => "id".includes(key) || delete e[key]);
          json.push(e);

          try {
            fs.writeFileSync("newIds.json", JSON.stringify(json));
          } catch (err) {
            console.log('Error', err.message);
          }

        } catch (err) {
          console.log('Error', err.message);
        }
      });
    };  
  } catch (err) {
    console.log('Error', err.message);
  }
}

var getLinks = async() => {
  const wait = (ms) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve()
    }, ms)
  )

  for (const e of newIds) {  
    try {
      await wait(1300)
      let links = await CoinGeckoClient.coins.fetch(e.id, {});
      try {
        let data = fs.readFileSync('whitelist.json');
        var json = JSON.parse(data);
        Object.keys(links.data).forEach((key) => "links".includes(key) || delete links.data[key]);
        json.push(links.data);

        try {
          fs.writeFileSync("whitelist.json", JSON.stringify(json));
        } catch (err) {
          console.log('Error', err.message);
          console.log(JSON.stringify(e.id))
          break
        }

      } catch (err) {
        console.log('Error', err.message);
        console.log(JSON.stringify(e.id))
      }
    } catch (err) {
      console.log('Error', err.message);
      console.log(JSON.stringify(e.id))
    }
  }

}

var main = async() => {
  process.argv.forEach(function (val, index, arrax) {
    //TODO: finish function returnWhitelist()
    // if(val == "return"){
    //   returnWhitelist();
    // }
    if(val == "getIds"){
      getIds();
    }
    if(val == "getLinks"){
      getLinks();
    }
  });
};

main();
