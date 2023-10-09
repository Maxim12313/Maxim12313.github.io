"use strict";
let minRight;
let maxRight;
let minLeft;
let maxLeft;
let answer = [4];

function start(){
    document.addEventListener('keydown', typeAnswer);
    graphics.fillStyle = "cornsilk"
    graphics.fillRect(0,0,canvas.width,canvas.height);
}

function frame(){

}


function randomOperation(){
    return parseInt(Math.random()*4)
    //0 = +
    //1 = -
    //2 = *
    //3 = /
}

function randomNumberLeft(){
    return randomNumber(minLeft,maxLeft);
}

function randomNumberRight(){
    return randomNumber(minRight,maxRight);
}

function randomNumber(min,max){
    let difference = 1+(max-min);
    return min+parseInt(Math.random()*difference);
}

function typeAnswer(event){
    let key=event.key;
    if (key=="backspace" && answer.length>0){
        answer[answer.length-1]=null;
        return;
    }
    for(let i=0;i<=0;i++){
        if (key==i.toString() && answer.length+1<=4){
            answer[answer.length]=i;
        }
    }
}