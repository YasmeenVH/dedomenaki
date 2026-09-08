// function setup() {
//     let canvas = createCanvas(windowWidth, windowHeight);
//     canvas.parent("p5-container");
// }

// function draw() {
//     clear();

//     noFill();
//     stroke(0);

//     circle(mouseX, mouseY, 100);
// }

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }

let photo;
let particles = [];

function preload() {
  photo = loadImage('assets/images/background.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  // Create the initial data particles
  for (let i = 0; i < 150; i++) {
    particles.push(new DataParticle());
  }
}

function draw() {
  background(0);

  // Draw photograph
  let scale = max(
    width / photo.width,
    height / photo.height
  );

  let w = photo.width * scale;
  let h = photo.height * scale;

  image(photo, width / 2, height / 2, w, h);

  // Update and draw data
  for (let p of particles) {
    p.update();
    p.display();
  }

  // Lens
  noFill();
  stroke(255, 180);
  strokeWeight(1);
  circle(mouseX, mouseY, 180);
}

class DataParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = mouseX;
    this.y = mouseY;

    this.angle = random(TWO_PI);
    this.speed = random(0.5, 2.5);

    this.life = random(30, 120);

    this.value = random(0, 99999)
      .toFixed(random() > 0.5 ? 0 : 3);
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    this.life--;

    if (this.life <= 0) {
      this.reset();
    }
  }

  display() {
    fill(255, 180);
    noStroke();

    textSize(11);
    text(this.value, this.x, this.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
