const express = require('express');
const app  = express();
const readline = require('readline');
const path = require('path');
const bodyParser = require('body-parser');
const { url } = require('inspector');
const fs = require('fs');
const ytdl = require('ytdl-core');




// bodyParser middleware 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html"); 
})

app.post("/", async (req, res) => {
    const videoLink = req.body.link;
    console.log(videoLink);
    download(videoLink, res);
    // var videoData = await downloadFacebook(videoLink, res);
    // console.log(videoData);
})
app.post("/video", async (req, res) => {
  const videoLink = req.body.link;
  // console.log(videoLink);
  // download(videoLink, res);
  var videoData = await downloadFacebook(videoLink, res);
  console.log(videoData);
})

const a = [{
  "name": "aktar "
},
{
  "name": "ahsan "
}];



  // app.post("/", async (req,res)=>{
  //   const name2 = req.body.link;
  //   console.log(name2);
  
  //   // res.send(a);
  //   const data = {
  //     message: 'Hello, Node.js!',
  //     date: new Date().toDateString(),
  //   };
  
  //   // Render 'index.html' with the provided data
  //   res.render('index', { data });

      
  // });

const port = process.env.PORT || 4000; 
app.listen(port, () => console.log("Server Listen to 127.0.0.1:", port));



async function download(videoLink, res){
  let n = Math.floor(Math.random() * 10000);
  let url = videoLink;
  let videID = ytdl.getURLVideoID(url);

  const output = path.resolve(__dirname, 'video-' + n + '.mp4');
  const video = ytdl(url);

  // Get Info
  ytdl.getInfo(videID).then(info => {
      console.log('title:', info.videoDetails.title);
      console.log('rating:', info.player_response.videoDetails.averageRating);
      console.log('uploaded by:', info.videoDetails.author.name);     
  });

  video.pipe(fs.createWriteStream(output));
  video.once('response', () => {
  starttime = Date.now();
  });

  video.on('progress', (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
      const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
      process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
      process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
      process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
      readline.moveCursor(process.stdout, 0, -1);
    });
    
    video.on('end', () => {
      process.stdout.write('\n\n');
      console.log("Download Completed!");
      res.sendFile(__dirname + "/index.html");
    });


}



async function downloadFacebook(videoLink, res){
  console.log(videoLink);
  const { ndown } = require("nayan-media-downloader");
let apiResponse = await ndown(videoLink)
console.log(apiResponse.data);

return apiResponse.data;

}


// https://www.facebook.com/reel/1080676539942902