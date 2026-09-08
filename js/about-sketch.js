let fragments = [];

const fragmentWords = [
  "IMAGE",
  "SOUND",
  "ARCHIVE",
  "FIELD",
  "DATA",
  "TRACE",
  "MAP",
  "MEMORY",
  "RECORD",
  "SIGNAL",
  "MATERIAL",
  "TEXT"
];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);

  canvas.parent("about-canvas");

  // Put the canvas behind the HTML
  canvas.style("position", "absolute");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "0");

  textFont("Arial");

  for (let i = 0; i < 45; i++) {
    fragments.push(new Fragment());
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
