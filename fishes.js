

const MAX_DIM = 400
const REPULSIVE_RANGE = 20
const ATTRACTIVE_RANGE = 50
const FISH_BANK_SIZE = 40
const AIMING_PULL_INTENSITY = 0.001
const AIMING_PUSH_INTENSITY = 01
const MIRRORING_INTENSITY = 0.05
const MAX_SPEED = 1
const DIMENTIONAL_CLUSTER_DIVISION = 10

function setup() {
    createCanvas(MAX_DIM, MAX_DIM);
}

const createDimension = (x, y) => {
    return {
        x,
        y,
        objects: [],
        objectCount: 0 //does it optimizes anything vs objects.size?
    }
}

const createFish = (index) => {
    return {
        index,
        y: Math.random() * MAX_DIM,
        x: Math.random() * MAX_DIM,
        // x: 0,
        // y: 0,
        frameY: null,
        frameX: null,
        vy: (Math.random() - 0.5),
        vx: (Math.random() - 0.5)
    }
}

// const xyDimensions = new Array(DIMENTIONAL_CLUSTER_DIVISION).map((_, xIndex) => {
//     new Array(DIMENTIONAL_CLUSTER_DIVISION).map((_, yIndex) => {
//         createDimension(xIndex * MAX_DIM / DIMENTIONAL_CLUSTER_DIVISION, yIndex * MAX_DIM / DIMENTIONAL_CLUSTER_DIVISION)
//     })
// })

const fishBank = Array(FISH_BANK_SIZE).fill().map((_, index) => createFish(index))

randomAim = (obj) => {
    obj.vy += 0.05 * (Math.random() - 0.5)
    obj.vx += 0.05 * (Math.random() - 0.5)
}

seekSibling = (obj, distX, distY, distance) => {
    const intensity = (REPULSIVE_RANGE > distance) ? AIMING_PUSH_INTENSITY : AIMING_PULL_INTENSITY

    // (REPULSIVE_RANGE - distance) :   Pool if far, repulse if close
    // / ((distance || 1) :               mostly equals 1 but big towards null distance
    const force = (REPULSIVE_RANGE - distance) / (distance || 1) * (intensity)
    // distX :                          Proportional to the X or Y distance
    obj.vx += distX * force
    obj.vy += distY * force
}

mirrorSibling = (obj, sibling, distance) => {
    obj.vx += sibling.vx * MIRRORING_INTENSITY / (1 + distance)
    obj.vy += sibling.vy * MIRRORING_INTENSITY / (1 + distance)
}

aim = (obj, envir) => {
    for (let sibling of envir) {
        if (sibling.index !== obj.index) {
            let distX = obj.frameX - sibling.frameX
            let distY = obj.frameY - sibling.frameY
            let distance = Math.hypot(distX, distY)
            if (distance < ATTRACTIVE_RANGE) {
                seekSibling(obj, distX, distY, distance)
                mirrorSibling(obj, sibling, distance)
            }
        }
    }
}

move = (movingObject) => {
    movingObject.y += movingObject.vy
    movingObject.x += movingObject.vx
}

keepInFrame = (obj) => {
    obj.frameX = obj.x < 0 ? (MAX_DIM + obj.x % MAX_DIM) : obj.x % MAX_DIM
    obj.frameY = obj.y < 0 ? (MAX_DIM + obj.y % MAX_DIM) : obj.y % MAX_DIM
}
paint = (obj) => {
    // noFill()
    // strokeWeight(1);
    // stroke('green')
    // circle(obj.frameY % MAX_DIM, obj.frameX % MAX_DIM, ATTRACTIVE_RANGE)
    // stroke('red')
    // circle(obj.frameY % MAX_DIM, obj.frameX % MAX_DIM, REPULSIVE_RANGE)
    // strokeWeight(5);

    stroke(`rgba(
        ${Math.abs(floor(obj.vx * 100)) % 255},
        ${Math.abs(floor(obj.vy * 100)) % 255},
        ${Math.abs(floor(obj.vx * obj.vx * 100)) % 255},
        0.95)`);
    point(obj.frameY % MAX_DIM, obj.frameX % MAX_DIM);

}
normalizeSpeed = (obj) => {
    let speed = Math.hypot(obj.vx, obj.vy)
    obj.vx = obj.vx * (speed > MAX_SPEED ? 0.5 : 1.1)
    obj.vy = obj.vy * (speed > MAX_SPEED ? 0.5 : 1.1)
}

function draw() {
    background('rgba(255,255,255,0.95)')
    strokeWeight(5);
    fishBank.forEach((fish) => {
        paint(fish)
        randomAim(fish)
        aim(fish, fishBank)
        normalizeSpeed(fish)
        move(fish)
        keepInFrame(fish)
    })
    square(0, 0, 40,)


}


