function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("p5-container");
}

function draw() {
    clear();

    noFill();
    stroke(0);

    circle(mouseX, mouseY, 100);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
