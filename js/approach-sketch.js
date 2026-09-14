let nodes = [];
let branches = [];

let activeNode = null;


/* =========================================
   NODE DEFINITIONS
========================================= */

const nodeData = [

  {
    name: "PLACE",
    x: 0.50,
    y: 0.09,
    children: ["LAND", "ENVIRONMENT", "HISTORY"]
  },

  {
    name: "ARCHIVE",
    x: 0.35,
    y: 0.17,
    children: ["RECORD", "MEMORY", "TRACE"]
  },

  {
    name: "EXPERIENCE",
    x: 0.65,
    y: 0.17,
    children: ["PRACTICE", "VOICE", "LIVED"]
  },

  {
    name: "CONTEXT",
    x: 0.50,
    y: 0.25,
    children: ["LOCAL KNOWLEDGE", "MEMORY", "PLACE"]
  },

  {
    name: "DATA + PEOPLE",
    x: 0.50,
    y: 0.36,
    children: ["COLLECTION", "OBSERVATION", "INTERACTION"]
  },

  {
    name: "SIGNAL / NOISE",
    x: 0.50,
    y: 0.47,
    children: ["PATTERN", "ABSENCE", "TRACE"]
  },

  {
    name: "RELATIONSHIPS",
    x: 0.50,
    y: 0.57,
    children: ["CONNECTION", "GAP", "NETWORK"]
  },

  {
    name: "INTERPRETATION",
    x: 0.50,
    y: 0.67,
    children: ["MEANING", "PERSPECTIVE", "CONTEXT"]
  },

  {
    name: "REPORT",
    x: 0.35,
    y: 0.77,
    children: ["DOCUMENT", "EVIDENCE"]
  },

  {
    name: "MAP",
    x: 0.50,
    y: 0.77,
    children: ["PLACE", "RELATION"]
  },

  {
    name: "ARCHIVE",
    x: 0.65,
    y: 0.77,
    children: ["MEMORY", "RECORD"]
  },

  {
    name: "STORY",
    x: 0.50,
    y: 0.87,
    children: ["NARRATIVE", "SHARING", "EXPERIENCE"]
  },

  {
    name: "BACK TO PLACE",
    x: 0.50,
    y: 0.96,
    children: []
  }
];


/* =========================================
   SETUP
========================================= */

function setup() {

  let canvas = createCanvas(
    windowWidth * 0.58,
    windowHeight
  );

  canvas.parent("approach-canvas");

  canvas.style("position", "absolute");
  canvas.style("top", "0");
  canvas.style("left", "0");

  textFont("Arial");

  createNodes();
}


/* =========================================
   CREATE NODES
========================================= */

function createNodes() {

  nodes = [];

  for (let data of nodeData) {

    let node = new Node(
      data.name,
      width * data.x,
      height * data.y,
      data.children
    );

    nodes.push(node);
  }
}


/* =========================================
   DRAW
========================================= */

function draw() {

  clear();

  for (let node of nodes) {
    node.update();
  }

  for (let node of nodes) {
    node.display();
  }
}


/* =========================================
   NODE
========================================= */

class Node {

  constructor(name, x, y, children) {

    this.name = name;

    this.x = x;
    this.y = y;

    this.children = children;

    this.grown = false;
    this.growth = 0;

    this.branches = [];

    this.createBranches();
  }


  createBranches() {

    let count = this.children.length;

    for (let i = 0; i < count; i++) {

      let angle;

      if (count === 1) {

        angle = -HALF_PI;

      } else {

        angle = map(
          i,
          0,
          count - 1,
          -0.8,
          0.8
        ) - HALF_PI;

      }

      let branch = new Branch(
        this.x,
        this.y,
        angle,
        random(45, 75),
        this.children[i]
      );

      this.branches.push(branch);
    }
  }


  update() {

    let distance = dist(
      mouseX,
      mouseY,
      this.x,
      this.y
    );


    /*
      Interaction only causes growth.
      It does NOT cause disappearance.
    */

    if (distance < 140) {

      this.grown = true;

    }


    if (this.grown) {

      this.growth += 0.018;

      this.growth = constrain(
        this.growth,
        0,
        1
      );

    }


    for (let branch of this.branches) {

      branch.grow(this.growth);

    }
  }


  display() {

    /*
      Main word
    */

    noStroke();

    fill(0, 165);

    textAlign(CENTER, CENTER);

    textSize(10);

    text(
      this.name,
      this.x,
      this.y
    );


    /*
      Branches
    */

    for (let branch of this.branches) {

      branch.display();

    }


    /*
      Small interaction point
    */

    if (
      dist(
        mouseX,
        mouseY,
        this.x,
        this.y
      ) < 140
    ) {

      fill(0, 180);

      circle(
        this.x,
        this.y,
        3
      );
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


  grow(amount) {

    /*
      Permanent accumulation.
    */

    if (amount > this.progress) {

      this.progress += 0.012;

      this.progress = constrain(
        this.progress,
        0,
        1
      );
    }
  }


  display() {

    /*
      Very faint dormant root.
    */

    if (this.progress <= 0) return;


    let segments = 20;

    let visibleSegments = floor(
      this.progress * segments
    );


    stroke(0, 40);

    strokeWeight(0.55);

    noFill();

    beginShape();


    for (
      let i = 0;
      i <= visibleSegments;
      i++
    ) {

      let t = i / segments;

      let distance =
        this.length * t;


      /*
        Organic curvature.
        Very cheap computationally.
      */

      let bend =
        sin(
          t * 5 +
          this.seed
        ) *
        8 *
        t;


      let px =
        this.x +
        cos(this.angle) *
        distance +
        cos(this.angle + HALF_PI) *
        bend;


      let py =
        this.y +
        sin(this.angle) *
        distance +
        sin(this.angle + HALF_PI) *
        bend;


      curveVertex(
        px,
        py
      );
    }


    endShape();


    /*
      Terminal point.
    */

    if (this.progress >= 1) {

      let endX =
        this.x +
        cos(this.angle) *
        this.length;

      let endY =
        this.y +
        sin(this.angle) *
        this.length;


      noStroke();

      fill(0, 90);

      circle(
        endX,
        endY,
        2
      );


      /*
        Tiny secondary vocabulary.
      */

      fill(0, 90);

      textSize(7);

      textAlign(
        CENTER,
        CENTER
      );

      text(
        this.label,
        endX,
        endY - 9
      );
    }
  }
}


/* =========================================
   RESIZE
========================================= */

function windowResized() {

  resizeCanvas(
    windowWidth * 0.58,
    windowHeight
  );

  /*
    Important:
    don't recreate nodes here.

    Existing growth should remain.
  */

  for (let i = 0; i < nodes.length; i++) {

    nodes[i].x =
      width * nodeData[i].x;

    nodes[i].y =
      height * nodeData[i].y;
  }
}
