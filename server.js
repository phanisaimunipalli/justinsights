const express = require("express");
const fileUpload = require("express-fileupload");
const { EOL } = require("os");
const fs = require("fs");
const path = require("path");
const { parse } = require("fast-csv");

const app = express();

app.use(fileUpload());

function evalTransactions(res, file) {
  let rows = [];
  let totalToday = 0;
  let minBalance = 0;
  let maxBalance = 0;

  fs.createReadStream(
    path.resolve(`${__dirname}/client/public/uploads/`, `${file.name}`)
  )
    .pipe(parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      if (row.Amount !== "" && row.Date !== "" && row.CustomerId !== "") {
        // console.log(row);
        //each row can be written to db
        rows.push(row);
      }
    })
    .on("end", (rowCount) => {
      console.log(`Parsed ${rowCount} rows`);
      const groupedMap = rows.reduce(
        (entryMap, e) =>
          entryMap.set(e.CustomerId, [
            ...(entryMap.get(e.CustomerId) || []),
            e,
          ]),
        new Map()
      );
      // console.log(groupedMap);
      let rowTrans = [];
      var tempMap = new Map();
      var result = {};

      for (let value of groupedMap.values()) {
        rowTrans.length = 0;
        const map = new Map(Object.entries(value));
        console.log(map.values().next().value.Amount);
        console.log(map.values().next().value.CustomerId);

        var firstBalance = map.values().next().value.Amount;
        minBalance = Number(firstBalance);
        maxBalance = 0;
        totalToday = 0;
        console.log("init minBalance: ", minBalance);
        let dates = [];
        for (let each of map.values()) {
          // console.log("Going through CustomerId: ", each.CustomerId);
          console.log("current each: ", each);

          var currAmount = Number(each.Amount);
          totalToday = totalToday + currAmount;
          // console.log("endingBalance: ", totalToday);

          // passing parameters not in date format
          var actualDate =
            each.Date.substring(0, 3) + each.Date.substring(6, 10);
          console.log("actualDate: ", actualDate);
          // rowTrans.push("date3:", date3);
          dates.push(actualDate);
          // console.log("dates: ", dates);

          if (Number(totalToday) < Number(minBalance)) {
            minBalance = totalToday;
            // console.log("minBalance: ", minBalance);
          }
          if (Number(totalToday) > Number(maxBalance)) {
            maxBalance = totalToday;
            // console.log("maxBalance: ", maxBalance);
          }
        }
        // console.log("minBalance: ", minBalance);
        // console.log("maxBalance: ", maxBalance);
        // console.log("endingBalance: ", totalToday);
        rowTrans.push(minBalance);
        rowTrans.push(maxBalance);
        rowTrans.push(totalToday);
        // console.log("rowTrans: ", rowTrans);

        result[map.values().next().value.CustomerId] = {
          cid: map.values().next().value.CustomerId,
          monthYear: dates[0],
          minBalance: minBalance,
          maxBalance: maxBalance,
          endingBalance: totalToday,
        };

        console.log("result: ", result);
        // console.log("----------");
      }
      res.json({
        fileName: file.name,
        filePath: `/uploads/${file.name}`,
        result: result,
      });
    });
}

// Upload endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file was uploaded" });
  }
  const file = req.files.file;
  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  });
  return evalTransactions(res, file);
});

app.listen(5000, () => console.log("Server started..."));
