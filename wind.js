// Min and Max Strength per Frame during Buildup
const Buildup_Strength = [-2, 2];

// Min and Max Duration of the Buildup time
const Buildup_Duration = [0, 10];

// How rare the creation is
const Creating_Change = 25;

// How strongly the wind decreases per Frame
const Decrease_Value = 0.005;

// Log the events
const verbose = false;

function randomInt(low, hih) {
    return floor(random() * (hih - low) + low);
}


class Wind {
    constructor(initialStrength) {
        this.strength = initialStrength;

        // Strength the wind gains per Frame
        this.buildupStrength = 0;

        // How long the wind builds up
        this.buildupDuration = 0;

        this.markers = [];
    }

    createWind() {
        // Only create Wind sometimes
        if (random() > Creating_Change || this.strength != 0) return;

        this.buildupStrength = random(Buildup_Strength[0], Buildup_Strength[1]);
        this.buildupDuration = randomInt(Buildup_Duration[0] * 2, Buildup_Duration[1] * 2);

        this.initDraw();
        if (verbose) console.log("Created Wind - Strength: " + this.buildupStrength + ", Duration: " + this.buildupDuration);
    }

    update() {
        // Increase Wind
        if (this.buildupStrength != 0 && this.buildupDuration != 0) {
            // We dont need to reset buildupStrength, because buildupDuration will decrease
            this.strength += this.buildupStrength * 0.035;
            this.buildupDuration--;
        }

        // Decrease Wind
        if (this.strength != 0 && this.buildupDuration == 0) {
            this.strength *= Decrease_Value * 2;
            if ((this.strength > 0 && this.strength < 0.5) || (this.strength < 0 && this.strength > -0.5)) {
                this.strength = 0;
            }
        }

        // Apply
        gb.setForce(new Vec2D(this.strength, -0.05))
        if (verbose) console.log("Wind has Strength " + this.strength);
    }

    initDraw() {
        this.markers = [];
        for (let i = 0; i < 4; i++) {
            let line = new wigglyLine(this.buildupStrength);
            this.markers.push(line);
        }
    }

    draw() {
        if (this.buildupDuration != 0) {
            // Draw Lines
            for (let i = 0; i < this.markers.length; i++) {
                this.markers[i].draw();
                this.markers[i].update();
            }
        }
    }
}

// Wiggly lines
class wigglyLine {
    constructor(strength) {
        this.strength = strength;
        this.alpha = 255;

        let x = strength > 0 ? random(-500, -50) : random(width + 500, width + 50);
        this.pos = createVector(x, random(100, height - 100));
    }

    draw() {
        let x = this.pos.x;
        let y = this.pos.y;

        noFill();
        stroke(255, this.alpha);
        strokeWeight(2);
        bezier(x - 150, y, x - 40, y - 100, x + 40, y + 100, x + 150, y);
    }

    update() {
        this.pos.x += this.strength * 15;
        this.alpha -= 6;
    }
}