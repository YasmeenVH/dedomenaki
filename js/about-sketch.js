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

  // Keep the p5 canvas behind the HTML text
  canvas.style("position", "absolute");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "1");

  textFont("Arial");

  // Create fragments
  for (let i = 0; i < 45; i++) {
    fragments.push(new Fragment());
  }
}


function draw() {

  // Transparent canvas
  clear();

  // Size of interactive area around mouse
  let interactionRadius = 220;


  // --------------------------------
  // CONNECTIONS BETWEEN DATA
  // --------------------------------

  for (let i = 0; i < fragments.length; i++) {

    for (let j = i + 1; j < fragments.length; j++) {

      let d = dist(
        fragments[i].x,
        fragments[i].y,
        fragments[j].x,
        fragments[j].y
      );

      if (d < 130) {

        stroke(0, 25);
        strokeWeight(0.5);

        line(
          fragments[i].x,
          fragments[i].y,
          fragments[j].x,
          fragments[j].y
        );
      }
    }
  }


  // --------------------------------
  // DATA FRAGMENTS
  // --------------------------------

  for (let fragment of fragments) {

    fragment.update();
    fragment.display();

  }


  // --------------------------------
  // INTERACTIVE LENS
  // --------------------------------

  noFill();

  stroke(0, 100);
  strokeWeight(1);

  circle(
    mouseX,
    mouseY,
    interactionRadius * 2
  );


  // Inner circle

  stroke(0, 35);

  circle(
    mouseX,
    mouseY,
    interactionRadius * 2 - 12
  );
}


// ==================================
// FRAGMENT
// ==================================

class Fragment {

  constructor() {

    // Starting position

    this.x = random(width);
    this.y = random(height);


    // Very slow ambient movement

    this.vx = random(-0.15, 0.15);
    this.vy = random(-0.15, 0.15);


    // Text size

    this.size = random(9, 15);


    // Word

    this.word = random(fragmentWords);


    // Number

    this.number = random(0, 99999)
      .toFixed(
        random() > 0.5 ? 0 : 3
      );


    // Decide once whether this
    // fragment is a word or number

    this.type =
      random() > 0.5
        ? "word"
        : "number";


    // Interaction state

    this.active = false;
  }


  // --------------------------------
  // UPDATE
  // --------------------------------

  update() {

    // Slow ambient movement

    this.x += this.vx;
    this.y += this.vy;


    // --------------------------------
    // WRAP AROUND SCREEN
    // --------------------------------

    if (this.x < 0) {
      this.x = width;
    }

    if (this.x > width) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = height;
    }

    if (this.y > height) {
      this.y = 0;
    }


    // --------------------------------
    // MOUSE INTERACTION
    // --------------------------------

    let d = dist(
      this.x,
      this.y,
      mouseX,
      mouseY
    );


    if (d < 220) {

      this.active = true;


      // Push fragments away
      // from the mouse

      let angle = atan2(
        this.y - mouseY,
        this.x - mouseX
      );


      // Strongest near cursor

      let force = map(
        d,
        0,
        220,
        3.5,
        0
      );


      this.x +=
        cos(angle) * force;

      this.y +=
        sin(angle) * force;

    } else {

      this.active = false;

    }
  }


  // --------------------------------
  // DISPLAY
  // --------------------------------

  display() {

    noStroke();

    textSize(this.size);


    // Active fragments become darker

    if (this.active) {

      fill(0, 220);

    } else {

      fill(0, 70);

    }


    // Draw word or number

    if (this.type === "word") {

      text(
        this.word,
        this.x,
        this.y
      );

    } else {

      text(
        this.number,
        this.x,
        this.y
      );

    }


    // --------------------------------
    // DATA POINT
    // --------------------------------

    if (this.active) {

      fill(0);

      circle(
        this.x - 8,
        this.y - 4,
        3
      );

    } else {

      fill(0, 80);

      circle(
        this.x - 8,
        this.y - 4,
        2
      );

    }
  }
}


// ==================================
// WINDOW RESIZE
// ==================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

}
