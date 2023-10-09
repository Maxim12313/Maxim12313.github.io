"use strict";
let player;
let groundY;
let groundThickness=100;
let dashTimeLimit=8;
let jumpTimeLimit=20;
let jumpSpeed=10;
let boostSpeedX=20;
let dashRight=true;
let time;
let obstacles=[];
let rowGap=200;
let obstacleHeight=25;
let grounded=false;
let goal;
let backgroundImage = loadImage("background.png", 2);
let totalHeight;
let speedRange;
let rowNum;
let score;
let sections;
let imageY;




function start(){
    fullReset();
    document.addEventListener('keyup',jump);
    reset();
    console.log("rowNum: "+obstacles.length);

    //credit for anti spacebar scroll: https://thewebdev.info/2021/07/30/how-to-prevent-the-pressing-of-the-space-bar-from-scrolling-the-page-with-javascript/#:~:text=Page%20with%20JavaScript-,To%20prevent%20the%20pressing%20of%20the%20space%20bar%20from%20scrolling,bar%20on%20the%20body%20element.
    window.addEventListener('keydown', (e) => {  
        if (e.key === ' ' && e.target === document.body) {  
          e.preventDefault();  
        }  
      });
    
}

function reset(){
    imageY=120;
    groundY=canvas.height+50-groundThickness;

    player = {
        width:50,
        x:canvas.width/3,
        y:canvas.height-100,
        speed:5,
        velocityY:0,
        inAir:false,
        timeInAir:0,
        hold:true,
        attack:false,
        facingRight:true,
        canDash:true,
        timeDashing:0,
        dashing:false,
        scrollingY:false,
    }

    obstacles=[];
    obstacles.length = rowNum;
    let y;
    let maxRowLength=4;
    for (let i=0;i<obstacles.length;i++){
        y =groundY-(i+1)*rowGap;
        obstacles[i] = {
            active:true,
            speedX:2+Math.random()*speedRange,
            y:y,
            row:[],
            collisions:false,
            
        }
        let list = obstacles[i].row;
        let x=canvas.width;
        list.length=maxRowLength-parseInt(i/sections);
        for(let o=0;o<list.length;o++){
            list[o] = {
                width:75+Math.random()*60,
                x:x
            }
            x+=list[o].width+canvas.width/list.length;
        }
    }
    totalHeight = y;
    let goalRadius = 50;
    goal =  {

        y:totalHeight-rowGap,
        x:canvas.width/2,
        radius: goalRadius,
        color:"green",
        active:false,
    }
}




function frame(){
    graphics.fillText("Wow, you've far surpassed my expectations",200,100);
    time++;
    checkScrollY();
    movePlayer();

    if (isMousePressed() && player.canDash && player.inAir){
        player.isDashing=true;
        dashRight = player.facingRight;
        player.canDash=false;
    }

    if (player.isDashing){
        dash();
    }


    drawBackground();
    updateObstacles();
    updateGoal();
    drawGameInfo();
    drawPlayer();
    
    
    

    
}


function nextLevel(){
    speedRange++;
    score++;
    rowNum+=4;
    sections++;

}

function fullReset(){
    speedRange=1;
    score=0;
    time=0;
    rowNum=8;
    sections=2;
}

function drawBackground(){
    //sky
    graphics.fillStyle = "skyblue";
    graphics.fillRect(0,0,canvas.width,canvas.height);

    drawImage(backgroundImage,canvas.width/2,imageY);

    
    graphics.fillStyle = "burlyWood";
    graphics.fillRect(0,groundY,canvas.width,groundThickness);


}




function drawPlayer(){
    graphics.fillStyle = "dodgerBlue";
    graphics.fillRect(player.x,player.y,player.width,player.width);
    if (player.isDashing){
        graphics.fillStyle = "red";
        graphics.fillRect(player.x,player.y,player.width,player.width);
    }
}


function moveWorld(speedY){
    groundY-=speedY;
    goal.y-=speedY;
    imageY-=speedY/20;
    for (let obstacleLine of obstacles){
        obstacleLine.y-=speedY;
    }

}

function movePlayer(){

    if (isKeyPressed("a")){
        player.x-=player.speed;
        player.facingRight=false;
    }
    else if (isKeyPressed("d")){
        player.x+=player.speed;
        player.facingRight=true;
    }

    if (isKeyPressed(" ") && player.timeInAir<=jumpTimeLimit && player.hold){
            player.velocityY=jumpSpeed;
        }

    if (player.inAir && player.velocityY>=-20){
        player.velocityY-=1; //gravity
    }

    if (player.scrollingY){
        moveWorld(-player.velocityY);
    }
    else{
        player.y-=player.velocityY;
    }
    player.x=teleportX(player.x,player.width);
}

function jump(event){
    let key=event.key;
    if (key==" "){
        player.hold=false;
    }

}
function teleportX(x,width){
    if (x+width<0){
        return canvas.width;
    }
    else if (x>canvas.width){
        return width;
    }
    return x;
}

function dash(){
    player.timeDashing++;
    let boost = boostSpeedX;
    if (!dashRight){
        boost*=-1;
    }
    player.x+=boost;
    if (player.timeDashing>=dashTimeLimit){
        player.isDashing=false;
        player.timeDashing=0;
    }
}
    
function updateObstacles(){
    grounded=false;
    graphics.fillStyle = "cornsilk"
    for (let obstacleLine of obstacles){
        let list = obstacleLine.row;
        let y = obstacleLine.y;
        checkActive(obstacleLine);
        if (obstacleLine.active){
            for (let obstacle of list){
                obstacle.x=teleportX(obstacle.x,obstacle.width);
                if (obstacleLine.collisions){
                    obstacleCollision(obstacle.x,y,obstacle.width,obstacleHeight);
                }
                obstacle.x-=obstacleLine.speedX;
                graphics.fillRect(obstacle.x,y,obstacle.width,obstacleHeight);
            }
        }
    }
    obstacleCollision(0,groundY,canvas.width,groundThickness);
    player.inAir = !grounded;
    if (player.inAir){
        player.timeInAir++;
    }
}

function obstacleCollision(x,y,width,height){
    let playerTopY = player.y;
    let playerBottomY = player.y+player.width;
    let playerRightX = player.x+player.width;

    if (playerTopY>=y && playerTopY<y+height){
        if (player.x>x && player.x<x+width){
            headCollision(y,height);
        }
        else if (playerRightX>x && playerRightX<x+width){
            headCollision(y,height);
        }
    }



    //only top obstacle y to avoid tele from bottom
    if (playerBottomY>=y && playerBottomY<y+height){
        if (player.x>x && player.x<x+width){
            groundCollision(y,height);
        }
        else if (playerRightX>x && playerRightX<x+width){
            groundCollision(y,height);
        }
    }
   
}



function headCollision(y,height){
    player.velocityY=0;
    player.hold=false;
    if (player.scrollingY){
        let diff=y-player.y+height;
        moveWorld(diff);
    }
    else{
        player.y=y+height;
    }
    //player.y=y+height;
}


function getDistance(x,y){
    let distX = goal.x-x;
    let distY = goal.y-y;
    return Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
}

function goalCollisions(){
    let topLeft = getDistance(player.x,player.y);
    let topRight = getDistance(player.x+player.width,player.y);
    let bottomLeft = getDistance(player.x,player.y+player.width);
    let bottomRight = getDistance(player.x+player.width,player.y+player.width);
    let pointDists = [topLeft,topRight,bottomLeft,bottomRight,];

    for (let pointDist of pointDists){
        if (pointDist<goal.radius){
            nextLevel();
            reset();
            
        }
    }
}


function updateGoal(){
    let dist = Math.abs(goal.y-player.y);
    if (dist<=canvas.height){
        goalCollisions();
        fillCircle(goal.x,goal.y,goal.radius,goal.color);
    }
    

}

function groundCollision(y){
    if (player.scrollingY){
        let diff=y-player.y-player.width;
        moveWorld(diff);
    }
    else{
        player.y=y-player.width;
    }
    //player.y=y-player.width;
    player.inAir=false;
    player.timeInAir=0;
    player.hold=true;
    player.canDash=true;
    grounded=true;
    player.velocityY=0;
}

function checkScrollY(){
    if(groundY+groundThickness-50<canvas.height){
        player.scrollingY=false;
        moveWorld(-1);
    }
    
    if ((Math.abs(groundY-player.y)>canvas.height/3)){
        player.scrollingY=true;
    }
    else{
        player.scrollingY=false;
    }
}

function checkActive(obstacleLine){
    let dist = Math.abs(obstacleLine.y-player.y);
    if (dist<=canvas.height){
        obstacleLine.active=true;
        if (dist<=rowGap/2){
            obstacleLine.collisions=true;
        }
    }
}

function drawGameInfo(){
    graphics.fillStyle = "red";
    graphics.font = "75px Impact";
    graphics.fillText(score,5,75);
}

function setScores(){
    
}