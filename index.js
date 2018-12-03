const admin = require("firebase-admin");

const serviceAccount = require("./hello.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://uploadimage-cdb0f.firebaseio.com"
});

const puppeteer = require("puppeteer");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/image", express.static("image"));

var bucket = admin.storage().bucket("gs://uploadimage-cdb0f.appspot.com");
// console.log(bucket);

// router
app.get("/", async (req, res) => {
  const width = 1280;
  const height = 600;
  const { url } = req.query;
  const browser = await puppeteer.launch({
    args: [`--window-size=${width},${height}`]
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto(url);
  const hostName = new URL(url).hostname;
  const screenshot = await page.screenshot({ path: `image/${hostName}.png` });
  //await browser.close();
  const ImgUrl = `http://${req.headers.host}/image/${hostName}.png`;
  // res.send(`<img src=${ImgUrl} />`);
  // Create a root reference
  // var storageRef = firebase.storage().ref();

  // // Create a reference to 'mountains.jpg'
  // var mountainsRef = storageRef.child("image/sfsf.txt");
  // // var file = ... // use the Blob or File API
  // mountainsRef.putString("sfjsfjsgfjsg").then(function(snapshot) {
  //   console.log("Uploaded a blob or file!");
  // });

  bucket
    .file(`screenshot/${hostName}.png`)
    .save(screenshot, {
      resumable: false,
      metadata: {
        contentType: "image/jpeg"
      }
    })
    .then(() => {
      const ImgUrl = `https://storage.googleapis.com/uploadimage-cdb0f.appspot.com/screenshot/${hostName}.png`;

      return res.status(200).json({
        url: hostName,
        status: "200",
        image: ImgUrl
      });
    });
});

app.listen(8080, () => console.log("app running on port 8080"));
