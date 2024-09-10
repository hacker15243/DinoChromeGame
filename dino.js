//board
let board;//this is the variable that will be used to reference the canvas tag
let boardWidth = 750;
let boardHeight = 250;
let context;//will be used for drawing in your canvas

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight-dinoHeight;
let dinoImg;//references the img of the dino


let dino = {
    x : dinoX,
    y : dinoY,
    width : dinoWidth,
    height : dinoHeight
}


//cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight-cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8;//cactus moving speed
let velocityY = 0; //speed for jumping. Set to 0 so you are ground
let gravity = .4; //speed for up and down

let gameOver = false; //because a game isn't over until you lose
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");//used to draw on the board

    //draw initial dino
    // context.fillStyle = "green";//changes the pen color to green
    // context.fillRect(dino.x, dino.y, dino.width, dino.height)//draw where the dino will be
    dinoImg = new Image();
    dinoImg.src = "./imgs/dino.png";
    dinoImg.onload = function(){
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./imgs/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./imgs/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./imgs/cactus3.png";


    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);//every second, placeCactus is called
    //1000 millisecond = 1 second
    document.addEventListener("keydown", moveDino);

}

function update(){
    
    requestAnimationFrame(update);//updates frame
    if(gameOver){
        return;//no need to update
    }
    //clears the frame
    context.clearRect(0, 0, board.width, board.height);

    //draw dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY);//apply gravity to current dino Y
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for(let i = 0; i < cactusArray.length; i++){
        let cactus = cactusArray[i];
        //update the x
        cactus.x += velocityX;//this is moving the dino to the left
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)){
            gameOver = true;
            dinoImg.src = "./imgs/dino-dead.png";
            dinoImg.onload = function (){
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score stuff
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20)
}


function moveDino(e){
    if(gameOver){
        return;//user cannot jump
    }
    if (((e.code == "Space") || (e.code == "ArrowUp")) && (dino.y == dinoY)){
        //dino.y == dinoY checks if the dino is on the ground
        velocityY = -10;
    }
}




function placeCactus(){
    //this function is called every second

    //place cactus

    //this creates a js objected named "cactus" and assigns these properties to it
    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height: cactusHeight
    }


    //this is to get a chance of placing a cactus
    let placeCactusChance = Math.random();//gives a num from 0-0.999999


    if(placeCactusChance > .90){
        //there is a 10 percent chance of you getting a cactus 3

        //in order to access properties of an object, you put the name.property name
        //as you can see here, the width is set to the cactus3Width, which we defined at the top
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    } else if (placeCactusChance > 0.70){
        //20 percent chance you will get cactus 2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus); 
    }
    if (cactusArray.length > 5){
        cactusArray.shift();//removes the first element from the array so that the array doesn't become too big and take up too much space
    }

}

function detectCollision(a,b){
    return a.x < b.x + b.width &&  //a's top left corner doesn't reach b's topright corner
           a.x + a.width > b.x &&  //a's top right corner passes b's top left corner
           a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;   //a's bottom left corner passes b's top left corner
}