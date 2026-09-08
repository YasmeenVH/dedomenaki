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


function draw() {

  // Transparent canvas so the page background remains visible
  clear();

  // Draw connections between nearby fragments
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


  // Draw the fragments
  for (let fragment of fragments) {

    fragment.update();
    fragment.display();

  }


  // Interactive lens around mouse
  noFill();

  stroke(0, 70);
  strokeWeight(1);

  circle(mouseX, mouseY, 180);

}


class Fragment {

  constructor() {

    this.x = random(width);
    this.y = random(height);

    this.vx = random(-0.15, 0.15);
    this.vy = random(-0.15, 0.15);

    this.size = random(9, 15);

    this.word = random(fragmentWords);

    this.number = random(0, 99999)
      .toFixed(random() > 0.5 ? 0 : 3);

    // Decide once whether this fragment is a word or number
    this.type = random() > 0.5 ? "word" : "number";
  }


  update() {

    this.x += this.vx;
    this.y += this.vy;


    // Wrap around screen

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


    // Mouse influence

    let d = dist(
      this.x,
      this.y,
      mouseX,
      mouseY
    );


    if (d < 180) {

      let angle = atan2(
        this.y - mouseY,
        this.x - mouseX
      );

      let force = map(
        d,
        0,
        180,
        1.5,
        0
      );

      this.x += cos(angle) * force;
      this.y += sin(angle) * force;

    }

  }


  display() {

    noStroke();

    fill(0, 100);

    textSize(this.size);


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


    // Small data point

    fill(0);

    circle(
      this.x - 8,
      this.y - 4,
      2
    );

  }

}


function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

}
