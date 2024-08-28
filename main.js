import Matter from "matter-js";
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body, Vector } = Matter;

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false, // Disable wireframes
        background: '#ffffff' // Optional: Set background color
    }
});

// create two boxes and a ground
const moco = Bodies.rectangle(400, 200, 80, 80, {
    collisionFilter: {
        category: 0x0002, // custom category for moco
        mask: 0x0001 | 0x0004 // can collide with ground but not with other custom categories
    },
    render: {
        fillStyle: '#808080' // initial color: grey
    }
});
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
Composite.add(engine.world, [moco, ground]);

// run the renderer
Render.run(render);

// create runner
const runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false // Hide mouse constraint wireframes
        }
    },
    collisionFilter: {
        category: 0x0001, // default category
        mask: 0x0002 | 0x0004 // can interact with bodies that belong to custom categories
    }
});
Composite.add(engine.world, mouseConstraint);

// function to move boxB towards the mouse
function moveBoxTowardsMouse() {
    // get the mouse position
    const mousePos = mouse.position;

    // calculate direction vector from boxB to mouse position
    const direction = Vector.sub(mousePos, moco.position);

    // normalize the direction vector
    const length = Vector.magnitude(direction);
    const normalizedDirection = Vector.div(direction, length);

    // apply a force to boxB towards the mouse
    const forceMagnitude = 0.1; // adjust this value as needed
    Body.applyForce(moco, moco.position, Vector.mult(normalizedDirection, forceMagnitude));
}

// run the moveBoxTowardsMouse function every 1 second
setInterval(moveBoxTowardsMouse, 500);

// color change function
function changeColor() {
    const currentColor = moco.render.fillStyle;
    moco.render.fillStyle = currentColor === '#808080' ? '#ff0000' : '#808080'; // Toggle color
}

// Change color 100 times per minute (every 600 milliseconds)
setInterval(changeColor, 600);
