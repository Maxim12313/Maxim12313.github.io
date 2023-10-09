'use strict';


let boidList;
let maxVelocity; 
let minVelocity; 
let numOfBoids;
let radius;
let cohesionRadius;
let seperationRadius;
let alignmentRadius;
let cohesionStrength;
let seperationStrength;
let alignmentStrength;
let opacity;



function newBoid(id,radius,cohesionRadius,seperationRadius,alignmentRadius){
    let x = canvas.width/10+Math.random()*canvas.width*8/10;
    let y = canvas.height/10+Math.random()*canvas.height*8/10;
    return {
        id:id,
        x:x,
        y:y,
        radius:radius,
        cohesionRadius:cohesionRadius,
        seperationRadius:seperationRadius,
        alignmentRadius:alignmentRadius,
        bodyColor: makeRandomColor(),
        velocityX:3,
        velocityY:3,
        thickness:5

    }
}


function drawBoid(boid){

    //y^2+x^2 = r^2
    let angle = Math.atan2(boid.velocityY,boid.velocityX);
    //let angle = 180*Math.PI/180;
    let radius = boid.radius;


    let topX = boid.x+radius*Math.cos(angle);
    let topY = boid.y+radius*Math.sin(angle);

    angle+=120*(Math.PI/180);

    let leftX=boid.x+radius*Math.cos(angle);
    let leftY=boid.y+radius*Math.sin(angle);

    angle+=120*(Math.PI/180);

    let rightX=boid.x+radius*Math.cos(angle);
    let rightY=boid.y+radius*Math.sin(angle);


    fillCircle(boid.x,boid.y,boid.radius,'white');

    drawLine(topX,topY,rightX,rightY,boid.bodyColor,boid.thickness);
    drawLine(topX,topY,leftX,leftY,boid.bodyColor,boid.thickness);
    drawLine(leftX,leftY,rightX,rightY,boid.bodyColor,boid.thickness);

    let factor=boid.radius/10;
     
    drawLine(boid.x,boid.y,boid.x+boid.velocityX*factor,boid.y+boid.velocityY*factor,boid.bodyColor,boid.thickness);

   
}


function updateBoids(){
    for (let boid of boidList){

        //set vectors;

        let newVelX=0;
        let newVelY=0;
        let num=0;

        let cohesionNeighbors = findNeighbors(boid,boid.cohesionRadius);
        if (cohesionNeighbors.length>0){
            let vector = cohesionVector(boid,cohesionNeighbors);
            newVelX+=vector.velocityX;
            newVelY+=vector.velocityY;
            num++;
        }
        let seperationNeighbors = findNeighbors(boid,boid.seperationRadius);
        if (seperationNeighbors.length>0){
            let vector = seperationVector(boid,seperationNeighbors);
            newVelX+=vector.velocityX;
            newVelY+=vector.velocityY;
            num++
        }

        let alignmentNeighbors = findNeighbors(boid,boid.alignmentRadius);
        if (alignmentNeighbors.length>0){
            let vector = alignmentVector(boid,alignmentNeighbors);
            newVelX+=vector.velocityX;
            newVelY+=vector.velocityY;
            num++;
        }


        if (num>0){
            boid.velocityX+=newVelX;
            boid.velocityY+=newVelY;

            let newVector = vectorMinMax(boid.velocityX,boid.velocityY);
            if (newVector!=null){
                boid.velocityX=newVector.velocityX;
                boid.velocityY=newVector.velocityY;
            }
        }

        //


        avoidEdge(boid);

        boid.x+=boid.velocityX;
        boid.y+=boid.velocityY;

        //teleport(boid);
       


        drawBoid(boid);
        //strokeCircle(boid.x,boid.y,boid.interactRadius,boid.interactColor);
    }



    //add border a few pixels outside for where boids turn back
}

function findNeighbors(thisBoid,radius){
    let neighborBoids = [];
    for (let boid of boidList){
        let dist = getDistance(thisBoid.x,thisBoid.y,boid.x,boid.y)
        if (dist<radius){
            if (thisBoid.id !== boid.id){
                neighborBoids.push(boid);
            }
            
        }
    }
    
    return neighborBoids;
}

function getDistance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
}


function unitVector(velocityX,velocityY,unit){
    let combined = Math.sqrt(Math.pow(velocityX,2)+Math.pow(velocityY,2));
    let factor = unit/combined;
    return {
        velocityX:velocityX*factor,
        velocityY:velocityY*factor
    }
}

function vectorMinMax(velocityX,velocityY){
    let combined = Math.sqrt(Math.pow(velocityX,2)+Math.pow(velocityY,2));
    if (Math.abs(combined)<minVelocity){
        return unitVector(velocityX,velocityY,minVelocity);
    }
    else if (Math.abs(combined>maxVelocity)){
        return unitVector(velocityX,velocityY,maxVelocity);
    }
    else{
        return null;
    }
}


function seperationVector(thisBoid,neighborBoids){
    let velocityX=0;
    let velocityY=0;
    for (let neighbor of neighborBoids){
        let distX=neighbor.x-thisBoid.x;
        let distY=neighbor.y-thisBoid.y;
        velocityX-=distX;
        velocityY-=distY;
    }

    return unitVector(velocityX,velocityY,seperationStrength);
}

function alignmentVector(thisBoid,neighborBoids){
    let velocityX = thisBoid.velocityX;
    let velocityY = thisBoid.velocityY;
    let num = neighborBoids.length;

    for (let boid of neighborBoids){
        velocityX+=boid.velocityX;
        velocityY+=boid.velocityY;
    }
    velocityX/=num;
    velocityY/=num;
    return unitVector(velocityX,velocityY,alignmentStrength);

}





function cohesionVector(boid,neighborBoids){
    let center = cohesionCenter(neighborBoids);
    let velocityX = center.x-boid.x;
    let velocityY = center.y-boid.y;
    return unitVector(velocityX,velocityY,cohesionStrength);

}


function cohesionCenter(neighborBoids){
    let x=0;
    let y=0;

    for (let boid of neighborBoids){
        x+=boid.x;
        y+=boid.y;
    }

    x/=neighborBoids.length;
    y/=neighborBoids.length;

    return{
        x:x,
        y:y
    }
}




function teleport(boid){
    let x = boid.x;
    let y = boid.y;
    let radius = boid.radius;

    if (x+radius<0){
        boid.x=canvas.width+radius;
    }
    else if (x-radius>canvas.width){
        boid.x=-radius;
    }

    if (y+radius<0){
        boid.y=canvas.height+radius;
    }
    else if (y-radius>canvas.height){
        boid.y=-radius;
    }
}

function avoidEdge(boid){
    let margin = 50;
    let factor = 1/2;
    if (boid.x<margin){
        boid.velocityX+=factor;
    }
    else if (boid.x>canvas.width-margin){
        boid.velocityX-=factor;
    }

    if (boid.y<margin){
        boid.velocityY+=factor;
    }
    else if (boid.y>canvas.height-margin){
        boid.velocityY-=factor;
    }
}


function drawBackground(){
    graphics.globalAlpha = opacity;
    graphics.fillStyle = 'cornsilk';
    graphics.fillRect(0,0,canvas.width, canvas.height);
    graphics.globalAlpha = 1;

}

function reset(){
    maxVelocity = document.getElementById('maxVelocity').value;
    minVelocity = document.getElementById('minVelocity').value;
    numOfBoids = document.getElementById('numOfBoids').value;
    radius = document.getElementById('radius').value;
    cohesionRadius = document.getElementById('cohesionRadius').value;
    seperationRadius = document.getElementById('seperationRadius').value;
    alignmentRadius = document.getElementById('alignmentRadius').value;
    cohesionStrength = document.getElementById('cohesionStrength').value/10;
    seperationStrength = document.getElementById('seperationStrength').value;
    alignmentStrength = document.getElementById('alignmentStrength').value/10;
    opacity = document.getElementById('opacity').value/100;
    
    

    boidList=[];
    while (numOfBoids>0){
        boidList.push(newBoid(numOfBoids,radius,cohesionRadius,seperationRadius,alignmentStrength));
        numOfBoids--;
    }
}

function standard(){
    document.getElementById('maxVelocity').value=10;
    document.getElementById('minVelocity').value=3;
    document.getElementById('numOfBoids').value=30;
    document.getElementById('radius').value=10;
    document.getElementById('cohesionRadius').value=125;
    document.getElementById('seperationRadius').value=75;
    document.getElementById('alignmentRadius').value=100;
    document.getElementById('cohesionStrength').value=0.5*10;
    document.getElementById('seperationStrength').value=5;
    document.getElementById('alignmentStrength').value=0.1*10;
    document.getElementById('opacity').value = 0.35*100;
    
}


function start(){
    standard();
    reset();
}



function frame(){

    drawBackground();
    updateBoids();

}