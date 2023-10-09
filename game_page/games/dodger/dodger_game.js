"use strict";
let player;
let gap=80;
let beginTime=0;
let markTime1=60;
let markTime2=120;
let duration1=0;
let duration2=0;
let deathDuration1=0;
let deathDuration2=0;
let speedUpTime=0;
let timeBetween = 240;
let rowObstacles =[7];
let colObstacles  = [5];
let activeProb = 0.75;
let outsidePixels = 80;
let gameHeight;
let opacity = 0;
let resetOpacityTime1 = true;
let resetOpacityTime2 = true;
let opacityTime;
let playing;
let score;
let increaseO = true;
let bestProfile;
let available=false;


async function getHighest(){
    let response = await fetch('https://cs.catlin.edu/node/maxim/dodger/dodger_api');
    if (response.ok){
        bestProfile = await response.json();
        available=true;
    }
}


async function update_scores(){
    let response = await fetch('https://cs.catlin.edu/node/maxim/dodger/dodger_api',
    {method: "POST",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(score)
    });
    if (response.ok){
        bestProfile = await response.json();
        console.log(bestProfile);
        available=true;
        drawStart();
        document.getElementById('highscore').innerHTML = bestProfile.name+" ("+bestProfile.score+")";
       
    }
}

function antiScroll(){
    for (let keyName of ['ArrowRight','ArrowUp','ArrowLeft','ArrowDown']){
        window.addEventListener('keydown', (e) => {  
            if (e.key === keyName && e.target === document.body) {  
              e.preventDefault();  
            }  
          });
    }
    
}

function start() {
    antiScroll();
    //getHighest();

    let name = localStorage.getItem("maxim_username");
    if (name!=null){
        document.getElementById("usernameText").value = name;
    }



    document.addEventListener('keydown', movePlayer);
    player = {
        x:gap*4+5,
        y:gap*3+5,
        width:70,
        color: 'DodgerBlue',
    }
    gameHeight = canvas.height-outsidePixels;
    let scoreName = document.getElementById('usernameText').value;

    score = {
        name:scoreName,
        score:0,
        outlineFont:75,
        x:canvas.width/2-3,
        y:canvas.height-5,
        innerFont:75*0.86
    }
    playing=false;

    for (let c=0;c<7;c++){
        let x = 5+gap+gap*c;
        colObstacles[c] = {
            x:x,
            y:5,
            width:70,
            active: true
        }
    }
    for (let r=0;r<5;r++){
        let y = 5+gap+gap*r;
        rowObstacles[r] = {
            x:5,
            y:y,
            width:70,
            active:true
        }
    }
    graphics.fillStyle = "Azure";
    graphics.fillRect(0,0,canvas.width,canvas.height);
    graphics.strokeStyle = "LightSlateGrey";
    graphics.lineWidth = 3;
    graphics.strokeRect(0,0,canvas.width,canvas.height);
}

function frame() {

    if (isKeyPressed("g")){
        playing=true;
        player.x=gap*4+5;
        player.y=gap*3+5;
        score.score = 0;
    }

    if (playing==false){
        drawStart();
        return;
    }

    beginTime++;
    drawBackground();
    drawPlayer();



    if (beginTime>=markTime1){
        markTime1=beginTime+timeBetween;
        duration1=beginTime+timeBetween/2;
        deathDuration1=beginTime+timeBetween*8/14;
        setWaveCol();
        score.score++;
        resetOpacityTime1=true;
        opacity=0;
        
    }
    if (beginTime>=markTime2){
        markTime2=beginTime+timeBetween;
        duration2=beginTime+timeBetween/2;
        deathDuration2=beginTime+timeBetween*8/14;
        setWaveRow();
        score.score++;
        resetOpacityTime2=true;
        opacity=0;
    }

    if (duration1>=beginTime){
        drawWarningCol();
    }
    else if (deathDuration1>beginTime){
        if (resetOpacityTime1){
            opacityTime=0;
            resetOpacityTime1=false;
        }
        collisionCol();
    }



    if (duration2>=beginTime){
        drawWarningRow();
    }
    else if (deathDuration2>beginTime){
        if (resetOpacityTime2){
            opacityTime=0;
            resetOpacityTime2=false;
        }
        collisionRow();
    }
    

    if (speedUpTime<=beginTime && timeBetween-2>=60){
        speedUpTime=beginTime+60;
        timeBetween-=2;
    }

   drawFade();
}

function reset(){

    graphics.globalAlpha = 1;
    let scoreName = document.getElementById("usernameText").value;

    let prevScore = localStorage.getItem("maxim_highScore");
    if (prevScore==null || prevScore<score.score){
        localStorage.setItem("maxim_highScore",score.score);
    }

    if (scoreName!=null){
        localStorage.setItem("maxim_username",scoreName);
        score.name=scoreName;
    }
    update_scores(); //comment this to enable/disable global high scores

    playing = false;
    beginTime=0;
    markTime1=60;
    markTime2=240;
    duration1=0;
    duration2=0;
    deathDuration1=0;
    deathDuration2=0;
    speedUpTime=0;
    timeBetween = 240;

    
    
}

function drawStart(){

    graphics.font = "70px Impact";
    graphics.fillStyle = "LimeGreen";
    graphics.fillText("Extreme Dodger!",canvas.width/2-200,canvas.height/5);
    

    graphics.font = "50px Impact";
    graphics.fillStyle = "SandyBrown";
    graphics.fillText("Press 'g' to Begin!",canvas.width/2-150,canvas.height*4/5);


    let highScore = localStorage.getItem("maxim_highScore");
    if (highScore==null){
        highScore=0;
    }
    graphics.fillStyle = "Navy";
    graphics.fillText("Personal Highscore: "+highScore, canvas.width/2-225,canvas.height*2/5);
    graphics.fillStyle = "mediumOrchid";
    if (available){
        let string = "Best: "+bestProfile.name+" ("+bestProfile.score+")";
        let size = string.length*15;
        graphics.fillText(string,canvas.width/2-size/2,canvas.height*3/5);
    }
    available=false;
    
}






function setWaveRow(){

    for (let rowO of rowObstacles){
        setProbs(rowO);
    }

    //one must be safe
    let index = parseInt(Math.random()*rowObstacles.length)
    rowObstacles[index].active = false;
}

function drawFade(){
    graphics.fillStyle = "White";

    graphics.globalAlpha = opacity;
    graphics.fillRect(0,0,canvas.width,gameHeight);
    graphics.globalAlpha = 1;
}

function changeOpacity(){
    opacityTime++;
    let time=opacityTime/60;
    let timePeriod = timeBetween/14/60;
    // let part1 = 1/(0.8*Math.sqrt(Math.PI));
    // let part2 = (-1/2)*Math.pow((time-0.2)/0.08,2);
    // let part3 = Math.pow(Math.E,part2);
    // let result = part1*part3;
    let result = Math.abs(0.8*Math.sin((time*Math.PI)/timePeriod));
    opacity = result;
}


function setWaveCol(){
    
    for (let colO of colObstacles){
        setProbs(colO);
    }

    let index = parseInt(Math.random()*colObstacles.length);
    colObstacles[index].active = false;
}

function setProbs(obstacle){
    if (Math.random()<activeProb){
        obstacle.active=true;
    }
    else{
        obstacle.active=false;
    }
}

function collisionRow(){
    for (let rowO of rowObstacles){
        if (rowO.active){
            let y = rowO.y +35;
            drawLine(rowO.x,y,canvas.width,y,"red",10);
            if (player.y==rowO.y){
                reset();
            }
        }
    }
    changeOpacity();
    


}
function collisionCol(){
    for (let colO of colObstacles){
        if (colO.active){
            let x = colO.x+35;
            drawLine(x,colO.y,x,gameHeight,"red",10);
            if (player.x==colO.x){
                reset();
            }
        }
    }
    changeOpacity();
}

function drawWarningRow(){
    for (let rowO of rowObstacles){
        if (rowO.active){
            drawWarning(rowO);
        }
    }
}
function drawWarningCol(){
    for (let colO of colObstacles){
        if (colO.active){
            drawWarning(colO);
        }
    }
}

function drawWarning(obstacle){
    graphics.fillStyle = "red";
    graphics.strokeStyle = "red";
    graphics.lineWidth = 2;

    let width = obstacle.width;
    let fontSize = 50;
    graphics.font = fontSize+"px Impact";
    graphics.strokeRect(obstacle.x,obstacle.y,width,width)
    graphics.fillText('!',obstacle.x+width/2-5,obstacle.y+width/2+fontSize/2);
}



function drawPlayer(){
    graphics.fillStyle = player.color;
    graphics.fillRect(player.x,player.y,player.width,player.width);
}
function movePlayer(event){
    if (playing==false){
        return;
    }
    let key = event.key;
    if ((key=="w" || key=="ArrowUp") && player.y-gap>gap){
        player.y -= gap;
    }
    else if ((key=="s" || key=="ArrowDown") && player.y+gap<gameHeight){
        player.y += gap;
    }
    else if ((key=="a" || key=="ArrowLeft") && player.x-gap>gap){
        player.x-=gap;
    }
    else if ((key=="d" || key=="ArrowRight") && player.x+gap<canvas.width){
        player.x+=gap;
    }
}

function drawBackground(){
    graphics.strokeStyle = 'Black';
    graphics.fillStyle = 'Cornsilk';
    graphics.fillRect(0, 0, canvas.width, gameHeight) 
    

    for (let c=0;c<=8;c++){
        let x = c*80;
        drawLine(x,0,x,gameHeight,);
    }

    for (let r=0;r<=6;r++){
        let y = r*80;
        drawLine(0,y,canvas.width,y);
    }
    graphics.strokeStyle = "LightSlateGrey";
    graphics.lineWidth = 3;
    graphics.strokeRect(0,0,canvas.width,canvas.height);


    graphics.lineWidth = 3;
    graphics.strokeStyle = "Blue"
    graphics.strokeRect(gap,gap,canvas.width-gap,gameHeight-gap);
    


    graphics.fillStyle = "LightSlateGrey";
    graphics.fillRect(0,gameHeight,canvas.width,outsidePixels);

    graphics.fillStyle = "MediumTurquoise";
    graphics.font = score.outlineFont+"px Impact";
    graphics.fillText(score.score,score.x,score.y);
    graphics.font = score.innerFont+"px Impact";
    graphics.fillStyle = "White";
    graphics.fillText(score.score,score.x,score.y);
    
}