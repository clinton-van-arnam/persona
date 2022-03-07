//facemesh setup circle tracks where sample is played for now
let facemesh;
let video;
var mode = 0
let imgd;//desktop image

let predictions = [];
let d = 0;
//audio setup
var songs = [
  "1.mp3",
  "2.mp3",
  "3.mp3",
  "4.mp3",
  "5.mp3",
  "6.mp3",
  "7.mp3",
  "8.mp3",
  "9.mp3",
  "10.mp3",
  "11.mp3",
  "12.mp3",
  "13.mp3",
  "14.mp3",
  "15.mp3",
  "16.mp3",
  "17.mp3",
  "18.mp3",
  "19.mp3",
  "20.mp3",
  "21.mp3",
  "22.mp3",
  "23.mp3",
  "24.mp3",
  "25.mp3",
  "26.mp3",
  "27.mp3",
  "28.mp3",
  "29.mp3",
  "30.mp3",
  "31.mp3",
  "32.mp3",
  "33.mp3",
  "34.mp3",
  "35.mp3",
 
];
let mouthAccent;
let font;
let volume = 0.2;
var sounds = [];

let colorLevel;
let colorLevelBG;

let pg;
//this is how big the boxes are that are playing the sound
let boxSize = 15;
var soundBoxes = [];

function preload() {
  for (let i = 0; i < songs.length; i++) {
    sounds[i] = loadSound(songs[i]);
  }
  // mouthAccent = loadSound("b1.mp3");
  font = loadFont("FreeSans.ttf");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  let i = 0;
  textFont(font);

  amplitude = new p5.Amplitude();

  cols = 5;
  rows = 5;
  w = width / cols;
  h = height / rows;
  //this below sets up the width and height of the boxes
  for (let rr = 0; rr < width; rr += boxSize) {
    for (let cc = 0; cc < height; cc += boxSize) {
      i++;
      i %= sounds.length;
      let sbNow = new soundBox([rr, cc], [boxSize, boxSize], sounds[i]);
      soundBoxes.push(sbNow);
    }
  }
  video = createCapture(VIDEO);
  video.size(width, height);

  facemesh = ml5.facemesh(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new predictions are made
  facemesh.on("predict", (results) => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
  // translate(width/2,height/2)
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {

	
    translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);
  
  let level = amplitude.getLevel();

  colorLevel = map(level, 0, 0.06, 210, 330);
  colorLevel = constrain(colorLevel, 210, 330);

  colorLevelBG = map(level, 0, 0.06, 0.6, 0.09); //background input of sound for alpha
  colorLevelBG=constrain(colorLevelBG, .06, .6);
  
  // print(colorLevel);
    fill(0, .06);
  // print(ecolorLevelBG);
  rect(0, 0, width, height);
   //translate(-width/2,-height/2)
  
  //tint(255, 2); // make the video partially transparent without changing the color

  //image(video, 0, 0, width, height);
  // background(0,10,10,10);

  // scale(-1,1);
  // tint(255, 255);
  // We can call both functions to draw all keypoints
 drawKeypoints(colorLevel);
}

////////Machine Learning/////////////
function drawKeypoints(soundInput) {
  translate(-width/2,colorLevelBG);
  let faceScale= map(windowWidth, 0, 1250, 1, 3.5);
  //scale(-1,1);
 
// print(windowWidth);

   scale(faceScale);
  for (let sb = 0; sb < soundBoxes.length; sb++) {
    let sbNow = soundBoxes[sb];

    // sbNow.drawBox(); //box on which is very slow
  }
  
  for (let i = 0; i < predictions.length; i += 1) {
    const keypoints = predictions[i].scaledMesh;

    // Draw facial keypoints.
    for (let j = 0; j < keypoints.length; j += 1) {
      const [x, y] = keypoints[j];
      for (let sb = 0; sb < soundBoxes.length; sb++) {
        let sbNow = soundBoxes[sb];
        //this triggers notes based on location
        sbNow.checkHover(keypoints[9][0], keypoints[9][1]);
      }

      //text input
      fill(soundInput + j * 0.1, 30, j * 2, map(colorLevelBG,0.6, 0.09,0,.9));
      //print(soundInput)(level, 0, 0.06, 0.6, 0.09)
      // textSize(2);
     textSize(map(soundInput, 210, 231, .25, 1));
       text(j, x, y);
      
      
      //turn this on for ellipse
//circle( x, y,2);
      
     // ellipse(keypoints[9][0], keypoints[9][1], 10, 10);

      let dNow = dist(
        keypoints[78][0],
        keypoints[78][1],
        keypoints[82][0],
        keypoints[82][1]
      );
      if (d != dNow) {
        d += (dNow - d) / 100;
      }
    }

    //mouthOpen(d);
    // console.log(d);
  }
}

//soundbox items
class soundBox {
  constructor(loc, size, sound) {
    this.loc = loc; // looks like [50,50]
    this.size = size;
    this.sound = sound;
    this.isPlaying = false;
    this.hovering = false;
  }

  checkHover(checkX, checkY) {
    if (
      checkX > this.loc[0] &&
      checkX < this.loc[0] + this.size[0] &&
      checkY > this.loc[1] &&
      checkY < this.loc[1] + this.size[1]
    ) {
      if (this.hovering == false) {
        this.hovering = true;
        // start playing sound here
        this.sound.play();
        this.sound.amp(volume); //volume
        //let speed = map(checkY, 0.1, height, 0, 2);//pitch adjustment
        // speed = constrain(speed, 0.01, 4);//pitch adjustment
        //  this.sound.rate(speed);//pitch adjustment
        this.isPlaying = true;
      }
    } else {
      this.hovering = false;
    }
  }
//if you turn this on, you can make the grid visable
  drawBox() {
    if (this.hovering) {
      fill("red");
    } else {
      fill("white");
    }
    rect(this.loc[0], this.loc[1], this.size[0], this.size[1]);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {

  // If you hit the s key, save an image
  if (key == 's') {
    save("mySketch.png");
  }
}



