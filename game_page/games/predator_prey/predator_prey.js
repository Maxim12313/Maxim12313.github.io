"use strict";

let numRows;
let numCols;
let board;
let time;
let day;
let preyRepAge;
let predatorRepAge;
let starveAge;
let predatorRepRate;
let preyRepRate;
let rowLength;
let colLength;
let predators;
let preys;
let predatorColor;
let preyColor;
let backgroundColor;
let startPredators;
let startPreys;
let isGrided;


function defaultPrey(r,c){
    return {
        type:'prey',
        r:r,
        c:c,
        age:0,
        canReproduce:false,
        hasMoved:false,
    }
}

function defaultPredator(r,c){
    return {
        type:'predator',
        r:r,
        c:c,
        age:0,
        canReproduce:false,
        hasMoved:false,
        timeSinceEaten:0,
    }
}

function overallUpdate(){
    for (let row of board){
        for (let animal of row){
            if (animal !== undefined){
                animal.age++;
                if (animal.type === 'predator'){
                    updatePredator(animal);
                }
                else{
                    updatePrey(animal);
                }
            }
        }
    }
}

function updatePredator(predator){
    predator.timeSinceEaten+=1;
    if (predator.timeSinceEaten>=starveAge){
        board[predator.r][predator.c] = undefined;
        return;
    }

    let location = predatorMove(predator.r,predator.c);
    if (location!=null){ //if you can move;
        let newR = location[0];
        let newC = location[1];
        board[predator.r][predator.c] = undefined;

        if (predator.age>=predatorRepAge && predator.hasMoved && Math.random()<predatorRepRate){
            predator.age=0;
            let newPredator = defaultPredator(predator.r,predator.c);
            board[predator.r][predator.c]=newPredator;
        }


        predator.r=newR;
        predator.c=newC;
        if (board[newR][newC] !== undefined && board[newR][newC] !== null){
            predator.timeSinceEaten = 0;
        }
        board[newR][newC]= predator;
        predator.hasMoved=true;
    }

    graphics.fillStyle = predatorColor;
    graphics.fillRect(predator.c*colLength,predator.r*rowLength,colLength,rowLength);
   
}

function updatePrey(prey){
    let location = preyMove(prey.r,prey.c);
    if (location!=null){ //if you can move;
        let newR = location[0];
        let newC = location[1];

        board[prey.r][prey.c]=undefined;
        if (prey.age>=preyRepAge && prey.hasMoved && Math.random()<preyRepRate){
            prey.age=0;
            let newPrey = defaultPrey(prey.r,prey.c);
            board[prey.r][prey.c]=newPrey;
            //console.log(preys.length);
        }

        prey.r=newR;
        prey.c=newC;
        prey.hasMoved=true;
        board[newR][newC]=prey;
    }

    graphics.fillStyle = preyColor;
    graphics.fillRect(prey.c*colLength,prey.r*rowLength,colLength,rowLength);
}

function predatorMove(r,c){
    let neighbors = baseMoveOptions(r,c);
    let aNeighbors = [];
    for (let neighbor of neighbors){
        let r = neighbor[0];
        let c = neighbor[1];
        let occupant = board[r][c];
        if (occupant === undefined || occupant.type === "prey"){
            aNeighbors.push(neighbor);
        }
    }
    if (aNeighbors.length==0){
        return null;
    }
    else{
        return aNeighbors[parseInt(Math.random()*aNeighbors.length)];
    }
    
}

function preyMove(r,c){
    let neighbors = baseMoveOptions(r,c);
    let aNeighbors = [];
    for (let neighbor of neighbors){
        let r = neighbor[0];
        let c = neighbor[1];
        let occupant = board[r][c];
        if (occupant === undefined){
            aNeighbors.push(neighbor);
        }
    }
    if (aNeighbors.length==0){
        return null;
    }
    else{
        return aNeighbors[parseInt(Math.random()*aNeighbors.length)];
    }
}

function baseMoveOptions(r,c){
    let neighbors = [[r-1,c],[r+1,c],[r,c+1],[r,c-1]];
    let aNeighbors=[];
    for (let neighbor of neighbors){
        if (neighbor !==undefined ){
            let r = neighbor[0];
            let c = neighbor[1];
            if ((r>=0 && r<numRows)&&(c>=0 && c<numCols)){
                aNeighbors.push(neighbor);
            }
        }
    }
    return aNeighbors;
    
}


function isDuplicate(r,c){
    for (let predator of predators){
        if (predator.r==r && predator.c==c){
            return true;
        }
    }
    for (let prey of preys){
        if (prey.r==r && prey.c==c){
            return true;
        }
    }
}

function getLocation(){
    let r=Math.floor(Math.random()*numRows);
    let c=Math.floor(Math.random()*numCols);
    while (isDuplicate(r,c)){
        r=Math.floor(Math.random()*numRows);
        c=Math.floor(Math.random()*numCols);
    }
    return {
        r:r,
        c:c,
    }
}

function reset(){
    time=0;
    predators=[];
    preys = [];
    board=[];
    numRows=document.getElementById('rowNum').value;
    numCols=document.getElementById('colNum').value;
    if (document.getElementById('adjust').checked){
        numCols = parseInt(numRows*(canvas.width/canvas.height));
    }
    // //parseInt(numRows*(canvas.width/canvas.height));
    isGrided = document.getElementById('isGrided').checked;
    day=document.getElementById('day').value;
    preyRepAge=document.getElementById('preyRepAge').value;
    predatorRepAge=document.getElementById('predatorRepAge').value;
    preyRepRate = document.getElementById('preyRepChance').value/100;
    predatorRepRate = document.getElementById('predatorRepChance').value/100;



    predatorColor = document.getElementById('predatorColor').value;
    preyColor = document.getElementById('preyColor').value;
    backgroundColor = document.getElementById('backgroundColor').value;

    
    starveAge=document.getElementById('starveDays').value;
    startPredators=document.getElementById('startingPredators').value;
    startPreys=document.getElementById('startingPrey').value;


    // if (numRows*numCols < startPredators + startPreys){
    //     console.log(numRows*numCols);
    //     console.log(startPredators);
    //     alert("Too many starting animals (more than board space)");
    //     return;
    // }


    


    drawBackground();


    for (let o=0;o<numRows;o++){
        let col = [];
        col.length=numCols;
        board.push(col);
    }



    for (let p=0;p<startPredators;p++){
        let location = getLocation();
        let newPredator = defaultPredator(location.r,location.c);
        predators.push(newPredator);
        board[newPredator.r][newPredator.c]= newPredator;
        graphics.fillStyle = predatorColor;
        graphics.fillRect(newPredator.c*colLength,newPredator.r*rowLength,colLength,rowLength);
    }

    for (let p=0;p<startPreys;p++){
        let location = getLocation();
        let newPrey= defaultPrey(location.r,location.c);
        preys.push(newPrey);
        board[newPrey.r][newPrey.c] = newPrey;
        graphics.fillStyle = preyColor;
        graphics.fillRect(newPrey.c*colLength,newPrey.r*rowLength,colLength,rowLength);
    }
}

function drawBackground(){
    
    graphics.fillStyle = 'cornsilk';
    graphics.fillRect(0,0,canvas.width,canvas.height);
    graphics.strokeStyle = 'lightSlateGrey';
    graphics.strokeRect(0,0,canvas.width,canvas.height);

    colLength = canvas.width/numCols;
    rowLength = canvas.height/numRows;


    if (isGrided){
        let lineColor = 'lightSlateGrey';

        for (let c=1;c<numCols;c++){
            let x = c*colLength;
            drawLine(x,0,x,canvas.height, lineColor);
        }
    
        
        for (let r=1;r<numRows;r++){
            let y = r*rowLength;
            drawLine(0,y,canvas.width,y, lineColor);
        }
    }
    

   

    
    
   
}

function standard(){
    document.getElementById('isGrided').checked = true;
    document.getElementById('adjust').checked = true;
    document.getElementById('rowNum').value=125;
    document.getElementById('colNum').value=parseInt(125*(canvas.width/canvas.height));
    document.getElementById('day').value=1;
    document.getElementById('preyRepAge').value=2;
    document.getElementById('predatorRepAge').value=2;
    document.getElementById('preyRepChance').value=50;
    document.getElementById('predatorRepChance').value=50;
    document.getElementById('predatorColor').value='red';
    document.getElementById('preyColor').value='green';
    document.getElementById('backgroundColor').value='cornsilk';
    document.getElementById('starveDays').value=4;
    document.getElementById('startingPredators').value=30;
    document.getElementById('startingPrey').value=30;
}

function start(){
    standard();
    reset();
}


function frame(){
    time++;
    if (time>=day){
        time=0;
        drawBackground();
        overallUpdate();
    }
}

