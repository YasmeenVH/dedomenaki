let roots = [];

const nodes = [
  {
    name: "PLACE",
    x: 0.50,
    y: 0.10,
    children: [
      "LAND",
      "ENVIRONMENT",
      "HISTORY"
    ]
  },

  {
    name: "ARCHIVE",
    x: 0.37,
    y: 0.17,
    children: [
      "RECORD",
      "MEMORY",
      "TRACE"
    ]
  },

  {
    name: "EXPERIENCE",
    x: 0.63,
    y: 0.17,
    children: [
      "PRACTICE",
      "VOICE",
      "LIVED"
    ]
  },

  {
    name: "CONTEXT",
    x: 0.50,
    y: 0.25,
    children: [
      "LOCAL KNOWLEDGE",
      "RELATION",
      "HISTORY"
    ]
  },

  {
    name: "DATA + PEOPLE",
    x: 0.50,
    y: 0.36,
    children: [
      "COLLECTION",
      "OBSERVATION",
      "INTERACTION"
    ]
  },

  {
    name: "SIGNAL / NOISE",
    x: 0.50,
    y: 0.46,
    children: [
      "PATTERN",
      "ABSENCE",
      "TRACE"
    ]
  },

  {
    name: "RELATIONSHIPS",
    x: 0.50,
    y: 0.56,
    children: [
      "CONNECTION",
      "GAP",
      "NETWORK"
    ]
  },

  {
    name: "INTERPRETATION",
    x: 0.50,
    y: 0.66,
    children: [
      "MEANING",
      "PERSPECTIVE",
      "CONTEXT"
    ]
  },

  {
    name: "REPORT",
    x: 0.37,
    y: 0.76,
    children: [
      "DOCUMENT",
      "EVIDENCE"
    ]
  },

  {
    name: "MAP",
    x: 0.50,
    y: 0.76,
    children: [
      "PLACE",
      "RELATION"
    ]
  },

  {
    name: "ARCHIVE",
    x: 0.63,
    y: 0.76,
    children: [
      "MEMORY",
      "RECORD"
    ]
  },

  {
    name: "STORY",
    x: 0.50,
    y: 0.87,
    children: [
      "NARRATIVE",
      "SHARING",
      "EXPERIENCE"
    ]
  },

  {
    name: "BACK TO PLACE",
    x: 0.50,
    y: 0.96,
    children: []
  }
];


function setup() {

  let canvas = createCanvas(windowWidth, windowHeight);

  canvas.parent("approach-canvas");

  canvas.style("position", "fixed");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "1");

  textFont("Arial");

  createRoots();
}


function createRoots() {

  roots = [];

  for (let i = 0; i < nodes.length; i++) {

    let n = nodes[i];

    let x = width * n.x;
    let y = height * n.y;

    let root = new RootNode(
      n.name,
      x,
      y,
      n.children
    );

    roots.push(root);
  }
}


function draw() {

  clear();

  for (let root of roots) {

    root.update();
    root.display();

  }
}


/* =========================================
   ROOT NODE
========================================= */

class RootNode {

  constructor(name, x, y, children) {

    this.name = name;

    this.x = x;
    this.y = y;

    this.children = children;

    this.branches = [];

    this.growth = 0;

    this.createBranches();
  }


  createBranches() {

    let amount = this.children.length;

    for (let i = 0; i < amount; i++) {

      let spread;

      if (amount === 1) {
        spread = 0;
      }
      else {
        spread = map(
          i,
          0,
          amount - 1,
          -0.7,
          0.7
        );
      }

      let angle = -HALF_PI + spread;

      let length = random(35, 75);

      let branch = new Branch(
        this.x,
        this.y,
        angle,
        length,
        this.children[i]
      );

      this.branches.push(branch);
    }
  }


  update() {

    let d = dist(
      mouseX,
      mouseY,
      this.x,
      this.y
    );

    /*
      Cursor activates nearby roots.
    */

    if (d < 180) {

      this.growth += 0.035;

      this.growth = constrain(
        this.growth,
        0,
        1
      );

    }
    else {

      /*
        Never disappear completely.
        They remain as faint traces.
      */

      this.growth -= 0.002;

      this.growth = constrain(
        this.growth,
        0,
        1
      );
    }


    for (let branch of this.branches) {

      branch.update(this.growth);

    }
  }


  display() {

    /*
      Main node label
    */

    noStroke();

    fill(0, 150);

    textAlign(CENTER, CENTER);

    textSize(11);

    text(
      this.name,
      this.x,
      this.y
    );


    /*
      Organic branches
    */

    for (let branch of this.branches) {

      branch.display();

    }
  }
}


/* =========================================
   BRANCH
========================================= */

class Branch {

  constructor(x, y, angle, length, label) {

    this.x = x;
    this.y = y;

    this.angle = angle;

    this.length = length;

    this.label = label;

    this.progress = 0;

    this.seed = random(1000);
  }


  update(parentGrowth) {

    /*
      Branch only grows when parent node
      is activated by the mouse.
    */

    this.progress += parentGrowth * 0.015;

    this.progress = constrain(
      this.progress,
      0,
      1
    );
  }


  display() {

    let segments = 18;

    let visible = floor(
      this.progress * segments
    );

    if (visible <= 0) return;


    noFill();

    stroke(0, 45);

    strokeWeight(0.6);


    beginShape();

    for (let i = 0; i <= visible; i++) {

      let t = i / segments;

      let distance = this.length * t;

      /*
        Small sinusoidal movement creates
        an organic/root-like curve.
      */

      let bend =
        sin(t * 5 + this.seed) *
        10 *
        t;


      let px =
        this.x +
        cos(this.angle) * distance +
        cos(this.angle + HALF_PI) * bend;

      let py =
        this.y +
        sin(this.angle) * distance +
        sin(this.angle + HALF_PI) * bend;


      curveVertex(px, py);
    }

    endShape();


    /*
      Reveal terminal word only
      when branch is almost fully grown.
    */

    if (this.progress > 0.85) {

      let endX =
        this.x +
        cos(this.angle) * this.length;

      let endY =
        this.y +
        sin(this.angle) * this.length;


      fill(0, 85);

      noStroke();

      circle(
        endX,
        endY,
        2
      );


      fill(0, 110);

      textAlign(CENTER, CENTER);

      textSize(8);

      text(
        this.label,
        endX,
        endY - 10
      );
    }
  }
}


function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  createRoots();
}
