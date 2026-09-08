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

  textFont("Arial");

  for (let i = 0; i < 45; i++) {
    fragments.push(new Fragment());
  }
}

function draw() {
  background(245);

  // Draw connections first
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

  // Draw fragments
  for (let fragment of fragments) {
    fragment.update();
    fragment.display();
  }

  // Mouse influence
  noFill();
  stroke(0, 70);
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
  }

  update() {

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around screen
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;

    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // Mouse influence
    let d = dist(this.x, this.y, mouseX, mouseY);

    if (d < 180) {

      let angle = atan2(
        this.y - mouseY,
        this.x - mouseX
      );

      let force = map(d, 0, 180, 1.5, 0);

      this.x += cos(angle) * force;
      this.y += sin(angle) * force;
    }
  }

  display() {

    noStroke();

    fill(0, 100);

    textSize(this.size);

    if (random() > 0.5) {
      text(this.word, this.x, this.y);
    } else {
      text(this.number, this.x, this.y);
    }

    // Small data point
    fill(0);
    circle(this.x - 8, this.y - 4, 2);
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
