let tree = [];
let leaves = [];

let count = 0;

let physics;
let totalLevels = 8;
let wind;

let gb;

let mic;
let amp;
let fr = 18;

let x = 50;
let y = 0;


function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    //create & start an audio input
    cnv.mousePressed(userStartAudio);

    frameRate(fr);

    mic = new p5.AudioIn();
    mic.start();

    //create an amplitude object that will use mic as input
    amp = new p5.Amplitude();
    //let ampLevel = amp.getLevel();
    amp.setInput(mic);

    physics = new VerletPhysics2D();

    wind = new Wind(0);

    gb = new GravityBehavior(new Vec2D(0, -0.01));
    physics.addBehavior(gb);
    physics.setWorldBounds(new Rect(0, 0, width, height));

    let a = new VerletParticle2D(width / 2, height);
    let b = new VerletParticle2D(width / 2, height - height / 4);
    a.lock();
    //b.lock();
    physics.addParticle(a);
    physics.addParticle(b);
    let root = new Branch(a, b, 0);
    tree[0] = root;
    //for (let n = 0; n < ampLevel; n++) {
    for (let n = 0; n < totalLevels; n++) {
        for (let i = tree.length - 1; i >= 0; i--) {
            if (!tree[i].finished) {
                let a = tree[i].branchA();
                let b = tree[i].branchB();
                tree.push(a);
                tree.push(b);
                // if (n == 5) {
                //     let holder1 = new VerletParticle2D(a.end.x, 0);
                //     holder1.lock();
                //     let d1 = dist(holder1.x, holder1.y, a.end.x, a.end.y);
                //     let spring1 = new VerletSpring2D(holder1, a.end, d1, 0.01);
                //     physics.addSpring(spring1);
                //     let holder2 = new VerletParticle2D(b.end.x, 0);
                //     holder2.lock();
                //     let d2 = dist(holder2.x, holder2.y, b.end.x, b.end.y);
                //     let spring2 = new VerletSpring2D(holder2, b.end, d2, 0.01);
                //     physics.addSpring(spring2);
                // }
            }
            tree[i].finished = true;
        }
    }
    //background(0);
}

// function mousePress() {
//     // gb.x = 0;
//     // gb.y = 0;
// }

let xoff = 0;

function draw() {
    background(0);
    for (let x = 10; x < width; x += 20) {
        for (let y = 10; y < height; y += 20) {
            noStroke();
            let d = dist(x, y, mouseX, mouseY);
            fill(frameCount % 255, x, y);
            circle(x, y, d / 300);
        }
    }
    physics.update();
    xoff += 0.01;
    gb.scaledForce.y = map(noise(xoff + 1000), 0, 1, -0.02, 0.005);
    gb.scaledForce.x = map(noise(xoff), 0, 1, -0.05, 0.05);

    if (mouseIsPressed) {
        let last = tree[tree.length - 1].end;
        last.lock();
        last.x = mouseX;
        last.y = mouseY;
        last.unlock();
        //clear();
    }
    // let micLevel;
    // micLevel = mic.getLevel();
    // for (let i = 0; i < micLevel * 5; i++) {
    //     circle(random(width), random(height / 2), random(10));
    // }

    //get the level of amplitude of the mic
    let level = amp.getLevel() * 100;
    console.log(level);

    stroke(255, 50);
    fill(255, 10);
    //draw ellipse in the middle of canvas
    //use value of level for the width and height of ellipse
    ellipse(x, y, level / 100 * width / 2, level / 100 * width / 2);

    y += 2;

    if (y > height) {
        x += 80;
        y = 0;
    }

    if (x > width) {
        x = 25;
        y = 0;
    }

    //microphone input affects speed
    if (level < 10) {
        fr = 24;
        frameRate(fr);
    } else {
        fr = 60;
        frameRate(fr);
        // Randomly Create wind
        wind.createWind()
        wind.draw()
        wind.update()
    }
    console.log(fr);

    for (let i = 0; i < tree.length; i++) {
        tree[i].show();
    }

}