
let player;
let gameBox;
let obstacles;
let time;
let spawnTime;
let playing=false;
let gameSpeed;
let time2;
let shotList;
let gameDetails;
let bestScore = 0;



function drawFrame(){
    graphics.fillStyle = 'grey';
    graphics.fillRect(0,0,canvas.width,gameBox.y);
    graphics.fillRect(0,0,gameBox.x,canvas.height);
    graphics.fillRect(gameBox.x+gameBox.width,gameBox.y,20,gameBox.y+gameBox.height);
    graphics.fillRect(gameBox.x,gameBox.y+gameBox.height,canvas.width,20);
    //graphics.fillRect(0,0,canvas.width,canvas.height);
}

function drawGameBox(){
    graphics.fillStyle=gameBox.color;
    graphics.fillRect(gameBox.x,gameBox.y,gameBox.width,gameBox.height);
}


function reset(){



    player = {
        invulnerableTime:60,
        invulnerableTimer:0,
        isInvulnerable:false,
        x:canvas.width/2,
        y:canvas.height/2,
        radius:10,
        speed:3,
        color:'dodgerblue',
        time:5*60,
        attackTime:1*60,
        attacking:false,
        fadeOpacity:0,
        explosion: {
            x:0,
            y:0,
            radius:0,
            expandSpeed:5,
            isExpanding:false,
            color:'orange',
            maxRadius:50
        }
    }

    gameBox = {
        x:20,
        y:100,
        width:canvas.width-40,
        height:canvas.height-120,
        color:'cornsilk',
    }

    let height = 30;
    let marginRow = (gameBox.y-height)/4;
    let hpGap = 2;
    let maxHp = 200;
    let width = 200*hpGap;
    let marginCol = (canvas.width-width)/2;
    let abilityGap = width/player.attackTime;
    gameDetails = {
        score:0,
        maxHp:maxHp,
        hp:maxHp,
        hpGap:hpGap,
        width:width,
        height:height,
        x:marginCol,
        y:marginRow,
        regenTime:120,
        regenTimer:0,
        abilityY:height+marginRow*2,
        abilityGap:abilityGap,
        scoreTimer:0,
    }

    obstacles = [];
    shotList = [];

    time=120;
    time2=0;
    spawnTime=40;
}

function updatePlayer(){
    player.time++;

    movePlayer();
    let c = gameBoxBoundary(player);
    player.x=c.x;
    player.y=c.y;
    if (isMousePressed() && player.time>=player.attackTime) {
        let pos = getMousePosition();
        player.time=0;
        player.attacking=true;
        player.explosion.isExpanding=true;
        player.explosion.x = pos.x;
        player.explosion.y = pos.y;
    }

    if (player.attacking){
        playerAttack();
    }
    if (player.isInvulnerable){
        playerInvulnerable();
    }
    

   
}

function playerInvulnerable(){
    player.invulnerableTimer++;
    if (player.invulnerableTimer>=player.invulnerableTime){
        player.isInvulnerable = false;
        player.invulnerableTimer=0;
    }
    else{
        let t = player.invulnerableTimer;
        player.fadeOpacity = (-1/2)*Math.cos((Math.PI*t)/15)+(1/2);
    }
}

function playerAttack(){


    if (player.explosion.radius<=0 && !player.explosion.isExpanding){
        player.attacking=false;
        return;
    }

    if (player.explosion.radius>=player.explosion.maxRadius){
        player.explosion.isExpanding=false;
    }



    if (player.explosion.isExpanding){
        player.explosion.radius+=player.explosion.expandSpeed;
    }
    else{
        player.explosion.radius-=player.explosion.expandSpeed;
    }


    let explosion = player.explosion;
    fillCircle(explosion.x,explosion.y,explosion.radius,explosion.color);

    
}

function collision(ob1,ob2){
    let distX = ob2.x-ob1.x;
    let distY = ob2.y-ob1.y;
    let totalDist = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
    if (totalDist<ob1.radius+ob2.radius){
        return true;
    }
    else{
        return false;
    }
}

function movePlayer(){
    if (isKeyPressed('w') || isKeyPressed('ArrowUp')){
        player.y-=player.speed;
    }
    else if (isKeyPressed('s') || isKeyPressed('ArrowDown')){
        player.y+=player.speed;
    }


    if (isKeyPressed('a') || isKeyPressed('ArrowLeft')){
        player.x-=player.speed;
    }
    else if (isKeyPressed('d') || isKeyPressed('ArrowRight')){
        player.x+=player.speed;
    }
}

function gameBoxBoundary(object){
    let x=object.x;
    let y=object.y;
    
    if (object.x-object.radius<gameBox.x){
        x=gameBox.x+object.radius;
    }
    else if (object.x+object.radius>gameBox.x+gameBox.width){
        x=gameBox.x+gameBox.width-object.radius;
        
    }

    if (object.y-object.radius<gameBox.y){
        y=gameBox.y+object.radius;
       
    }
    else if (object.y+object.radius>gameBox.y+gameBox.height){
        y=gameBox.y+gameBox.height-object.radius;
       
    }
    return {
        x:x,
        y:y
    }
}

function vectorBoundary(object){
    
    if (object.x-object.radius<gameBox.x){
        return {
            velocityX:object.speed,
            velocityY:0
        }
    }
    else if (object.x+object.radius>gameBox.x+gameBox.width){
        return {
            velocityX:-object.speed,
            velocityY:0
        }
        
    }

    if (object.y-object.radius<gameBox.y){
        return {
            velocityX:0,
            velocityY:object.speed
        }
       
    }
    else if (object.y+object.radius>gameBox.y+gameBox.height){
        return {
            velocityX:0,
            velocityY:-object.speed
        }
       
    }
}

function spreadShot(coordinates){
    return {
        type:'spreadShot',
        time:5*60/4,
        attackTime:4*60,
        attacks:0,
        maxAttacks:3,
        x:coordinates.x,
        y:coordinates.y,
        radius:15,
        color:'blue',
        speed:1,
        vector: {
            velocityX:0,
            velocityY:0
        },
        shotSpeed:1.5,
        isAttacking:false,
        damage:40
    }
}

function searchDestroy(coordinates,radius,speed,color,damage){
    return {
        type:'searchDestroy',
        time:0,
        attackTime:0.5*60,
        attacks:0,
        maxAttacks:20,
        x:coordinates.x,
        y:coordinates.y,
        radius:radius,
        damage:damage,
        color:color,
        speed:speed,
        vector: {
            velocityX:0,
            velocityY:0
        }
    }
}

function laser(coordinates){

    
    return {
        type:'laser',
        time:5*60/4,
        attackTime:5*60,
        attacks:0,
        timeBeforeMoving:0,
        movementTime:60,
        maxAttacks:3,
        x:coordinates.x,
        y:coordinates.y,
        radius:10,
        color:'lime',
        beam: {
            x1:0,
            y1:0,
            x2:0,
            y2:0,
            slope:0,
            thickness:10,
            isActive:false,
            warningColor:'yellow',
            shootingColor:'red',
            time:0,
            warningTime:60,
            shootingTime:15,
        },
        isAttacking:false,
        speed:1.5,
        damage:15,
        vector: {
            velocityX:0,
            velocityY:0
        }
    }
}

function laserMovement(obstacle){
    let x = (gameBox.x+gameBox.width/2)-150+Math.random()*150;
    let y = (gameBox.x+gameBox.width/2)-125+Math.random()*125;

    return createVector(obstacle,{
        x:x,
        y:y
    }, obstacle.speed);
}

function laserAttack(obstacle){


    
    let slope = (player.y-obstacle.y)/(player.x-obstacle.x);
    obstacle.beam.slope = slope;
    let leftX = gameBox.x;
    let leftY = getY(obstacle.x,obstacle.y,slope,leftX);

    let rightX = gameBox.x+gameBox.width;
    let rightY = getY(obstacle.x,obstacle.y,slope,rightX);

    obstacle.beam.x1=leftX;
    obstacle.beam.y1=leftY;
    obstacle.beam.x2=rightX;
    obstacle.beam.y2=rightY;
    obstacle.isAttacking = true;
    obstacle.vector.velocityX=0;
    obstacle.vector.velocityY=0;
}

function laserBeam(obstacle){
    let color;
    let beam = obstacle.beam;
    beam.time++;
    

    if (beam.time>beam.warningTime+beam.shootingTime){
        obstacle.isAttacking=false;
        beam.isActive = false;
        beam.time=0;
        obstacle.vector = laserMovement(obstacle);
        return;
    }

    if (beam.time<beam.warningTime){
        color=beam.warningColor;
    }
    else {
        color=beam.shootingColor;
        beam.isActive = true;
    }
    drawLine(beam.x1,beam.y1,beam.x2,beam.y2,color,beam.thickness);
}

function getY(x2,y2,slope,pointX){
    return leftY=slope*(pointX-x2)+y2;
    //y=m(x-x2)+y2
}

function laserCollision(obstacle){
    //tests all x points of player
    let t = obstacle.beam.thickness/2;
    for (let x=player.x-player.radius-t;x<=player.x+player.radius+t;x++){
        let y = getY(obstacle.beam.x2,obstacle.beam.y2,obstacle.beam.slope,x);
        let pointSpace = {
            x:x,
            y:y,
            radius:t
        }
        if (collision(player,pointSpace)){
            return true;
        }
    }
    return false;
}

function searchDestroyAttack(obstacle){
    obstacle.vector = createVector(obstacle,player,obstacle.speed);
}

function spreadShotAttack(obstacle){

    let speed = obstacle.speed;
    if (Math.random()<0.5){
        speed*=-1;
    }

    if (Math.random()<0.5){
        obstacle.vector.velocityX=speed;
        obstacle.vector.velocityY=0;
    }
    else{
        obstacle.vector.velocityX=0;
        obstacle.vector.velocityY=speed;
    }

    let shotSpeed=obstacle.shotSpeed
    for (let x=-1;x<=1;x++){
        for (let y=-1;y<=1;y++){
            if (x!=0 || y!=0){
                shotList.push({
                    x:obstacle.x,
                    y:obstacle.y,
                    radius:5,
                    vector:createVector(obstacle,{
                        x:obstacle.x+x,
                        y:obstacle.y+y
                    },
                    shotSpeed),
                    damage:10,
                })
            }
        }
    }
    


    
}


function createVector(obstacle,nextObstacle,desiredMag){

    let distX = nextObstacle.x-obstacle.x;
    let distY = nextObstacle.y-obstacle.y;


    let currentMag = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
    let factor = desiredMag/currentMag;
    return {
        velocityX:distX*factor,
        velocityY:distY*factor
    }


}

function createObstacle(){
    //1 = searchDestroy small fast
    //2 = searchDestroy big slow 
    //3 = spreadShot
    //4 = laser

    let obstacleTypes=4;
    let random = Math.random()*obstacleTypes;
    let obstacle = null;
    let coordinates = getCoordinates();

    if (random<=1){ 
        obstacle = searchDestroy(coordinates,10,2,'mediumpurple',15);
    }
    else if (random<=2){
        obstacle = searchDestroy(coordinates,40,0.5,'darkcyan',50);
    }
    else if (random<=3){ 
        obstacle = spreadShot(coordinates);
    }
    else if (random<=4){
        obstacle = laser(coordinates);
    }
    
    obstacles.push(obstacle);
}

function shotOutsideScreen(shot){
    if (shot.x+shot.radius<gameBox.x){
        return true;
    }
    else if (shot.x-shot.radius>gameBox.x+gameBox.width){
        return true;
    }
    else if (shot.y-shot.radius<gameBox.y){
        return true;
    }
    else if (shot.y-shot.radius>gameBox.y+gameBox.height){
        return true;
    }
    else{
        return false;
    }
}


function updateObstacles(){

    for (let i=0;i<shotList.length;i++){
        shot = shotList[i];
        if (player.attacking && collision(player.explosion,shot)){
            shotList.splice(i,1);
            i--;
            continue;
        }
        if (shotOutsideScreen(shot)){
            shotList.splice(i,1);
            i--;
            continue;
        }

        if (!player.isInvulnerable && collision(player,shot)){
            gameDetails.hp-=shot.damage;
            fillCircle(shot.x,shot.y,shot.radius,'green');
            player.isInvulnerable = true;
            shotList.splice(i,1);
            i--;
            continue;
        }
        shot.x += shot.vector.velocityX;
        shot.y += shot.vector.velocityY;
        fillCircle(shot.x,shot.y,shot.radius,'green');
    }

    for (let i=0;i<obstacles.length;i++){
        let obstacle = obstacles[i];

        if (player.attacking && collision(player.explosion,obstacle)){
            obstacles.splice(i,1);
            i--;
            continue;
        }

        if (!player.isInvulnerable && collision(player,obstacle)){
            gameDetails.hp-=obstacle.damage;
            player.isInvulnerable = true;
            fillCircle(obstacle.x,obstacle.y,obstacle.radius,obstacle.color);
            obstacles.splice(i,1);
            i--;
            continue;
        }


        obstacle.time++;

        if (obstacle.time>=obstacle.attackTime){
            obstacle.attacks++;
            if (obstacle.attacks>obstacle.maxAttacks){
                obstacles.splice(i,1);
                i--;
                continue;
            }
            

            obstacle.time=0;

            if (obstacle.type==='searchDestroy'){
                searchDestroyAttack(obstacle);
            }

            if (obstacle.type === 'spreadShot'){
                spreadShotAttack(obstacle);
            }
            if (obstacle.type === 'laser'){
                laserAttack(obstacle);
            }

            
        }

        if (obstacle.type === 'laser'){

            if (obstacle.isAttacking){
                
                if (!player.isInvulnerable && obstacle.beam.isActive && laserCollision(obstacle)){
                    laserBeam(obstacle);
                    gameDetails.hp-=obstacle.damage;
                    player.isInvulnerable = true;
                    obstacles.splice(i,1);
                    i--;
                    continue;
                }
                laserBeam(obstacle);
            }
        }



        let boundaryVector = vectorBoundary(obstacle);
        if (boundaryVector!=null){
            obstacle.vector = boundaryVector;
        }

        obstacle.x+=obstacle.vector.velocityX;
        obstacle.y+=obstacle.vector.velocityY;

        fillCircle(obstacle.x,obstacle.y,obstacle.radius,obstacle.color);
    }
}

function getCoordinates(){
    if (Math.random()<0.5){
        return topBottom();
    }
    else{
        return leftRight();
    }
}

function topBottom(){
    let distAway=70;
    let y=gameBox.y-distAway
    if (Math.random()<0.5){
        y=gameBox.y+gameBox.height+distAway;
    }


    return {
        x:Math.random()*gameBox.width,
        y:y,
    }
}

function leftRight(){
    let distAway=70;

    let x=gameBox-distAway;
    if (Math.random()<0.5){
        x=gameBox.x+gameBox.width+distAway;
    }


    return {
        x:x,
        y:Math.random()*gameBox.height,
    }
}

function drawStart(){
    graphics.font = "70px Impact";
    graphics.fillStyle = "plum";
    graphics.fillText("Brink!",canvas.width/2-100,canvas.height*2/5);
    


    graphics.font = "50px Impact";
    graphics.fillStyle = "indianred";
    graphics.fillText("Press 'r' to Begin!",canvas.width/2-150,canvas.height*4/5);


    graphics.font = "60px Impact";
    graphics.fillStyle = 'mediumAquaMarine';
    graphics.fillText("Personal Best: "+bestScore,canvas.width/2-200,canvas.height*3/5);
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



function start(){
   
    antiScroll();
    
	
    graphics.fillStyle = 'azure';
    graphics.fillRect(0,0,canvas.width,canvas.height);

    graphics.strokeStyle = 'steel';
    graphics.strokeRect(0,0,canvas.width,canvas.height);
    
}

function frame(){

    if (!playing){
        bestScore = localStorage.getItem('maxim_brinkScore');
        if (bestScore === null){
            bestScore = 0;
        }

        if (gameDetails!=undefined){
            if (bestScore<gameDetails.score){
                bestScore = gameDetails.score;
                localStorage.setItem('maxim_brinkScore',gameDetails.score);
            }
        }

        drawStart();
        if (isKeyPressed('r')){
            playing=true;
            reset();
        }
    }


    if (playing){
        gameDetails.scoreTimer++;
        time++;
        time2++;
        gameDetails.regenTimer++;

        if (gameDetails.scoreTimer>=60){
            gameDetails.scoreTimer = 0;
            gameDetails.score++;
        }

        if (gameDetails.hp<gameDetails.maxHp && gameDetails.regenTimer>=gameDetails.regenTime){
            gameDetails.regenTimer=0;
            gameDetails.hp++;
        }

        if (time>=spawnTime){
            time=0;
            createObstacle();
        }

        if (time2>420 && spawnTime-1>=30){
            time2=0;
            spawnTime--;
        }

        drawGameBox();
        updatePlayer();
        updateObstacles();
        drawFrame();

        fillCircle(player.x,player.y,player.radius,player.color); //draw player
        graphics.globalAlpha = player.fadeOpacity;
        fillCircle(player.x,player.y,player.radius,'white');
        graphics.globalAlpha = 1;
        if (player.isInvulnerable){
            strokeCircle(player.x,player.y,player.radius-6/2,'black',6);
        }

        graphics.fillStyle = 'orangeRed';
        graphics.fillRect(gameDetails.x,gameDetails.y,gameDetails.width,gameDetails.height);
        graphics.fillStyle = 'springGreen';
        graphics.fillRect(gameDetails.x,gameDetails.y,gameDetails.hp*gameDetails.hpGap,gameDetails.height);

        graphics.fillStyle = 'lightCyan';
        let width = player.attackTime*gameDetails.abilityGap;
        graphics.fillRect(canvas.width/2-width/2,gameDetails.abilityY,width,20);
        
        let abilityCooldown = player.time;
        if (abilityCooldown>=player.attackTime){
            abilityCooldown = player.attackTime;
        }
        graphics.fillStyle = 'lightSalmon';
        graphics.fillRect(canvas.width/2-width/2,gameDetails.abilityY,abilityCooldown*gameDetails.abilityGap,20);

        graphics.fillStyle = 'snow';
        graphics.font = "70px Impact";
        graphics.fillText(gameDetails.score,gameDetails.x/4,80);

        graphics.fillStyle = 'lavender'
        graphics.fillText(bestScore,canvas.width-gameDetails.x*3/4-20,80);
       

        if (gameDetails.hp<=0){
            graphics.fillStyle = 'orangeRed';
            graphics.fillRect(gameDetails.x,gameDetails.y,gameDetails.width,gameDetails.height);
            playing=false;
        }
    }
    
    




}