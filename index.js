const csv = require("csvtojson");
const fs = require("fs");
async function convert(files) {
  let totalItem = [];

  for (let i = 0; i < files.length; i++) {
    const jsonResult = await csv().fromFile(files[i]);
    totalItem = [...totalItem, ...jsonResult].filter(
      (props) => props["Cate No"]
    );
    totalItem.sort((a, b) => {
      return +a["Cate No"] - +b["Cate No"];
    });
  }

  const mappingResult = totalItem.reduce((acc, curr) => {
    const cate = curr["Cate No"];
    const type = curr["Type No"];
    const itemName = curr["Title"].replace("\n", " ");
    const description = curr["Details"]
      .replace("\n", " ")
      .replace("\r", "")
      .trim();
    const image = curr["Image Name"];
    const id = cate + "-" + type;
    acc[id] = {
      itemName,
      description,
      image,
    };
    return acc;
  }, {});
  console.log(mappingResult);

  fs.writeFile(
    "output.json",
    JSON.stringify(mappingResult, null, '\t'),
    "utf-8",
    function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
    }
  );
}

convert(["1.csv", "2.csv"]);
