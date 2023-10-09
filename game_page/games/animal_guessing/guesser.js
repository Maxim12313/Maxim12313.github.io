"use strict";
let website = 'https://first-website-8de55.uc.r.appspot.com/';
let items;
let currentItem;
let scale=1.5;
let faceIndex=4;
let emojiFaces = [];

async function getItems(){
    let response = await fetch(website);
    if (response.ok){
        items=await response.json();
        for (let i of items){
            if (i.item==0){
                currentItem=i;
                break;
            }
        }
        changeQuestion(currentItem);
    }
}
async function editApi(newInfo){
    let response = await fetch(website,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify([currentItem,newInfo])
    });
        
    if (response.ok){
        items=await response.json();
        document.getElementById('retry').style.display = 'block';
    }
}

function no(){
    if (faceIndex-1>0){
        faceIndex--;
    }
    if (currentItem.type==='answer'){
        faceIndex = 0;
        document.getElementById('question').innerHTML = "Oh, that's rough..."
        end();
        document.getElementById('teachHolder').style.display = "block";
        document.getElementById('first_animal').innerHTML = currentItem.answer;
        return;
    }

    for (let i of items){
        if (i.item == currentItem.no){
            currentItem = i;
            break
        }
    }
    //currentItem = items[currentItem.no];
    changeQuestion(currentItem);
}

function yes(){
    if (faceIndex+1<8){
        faceIndex++;
    }
    if (currentItem.type==='answer'){
        faceIndex = 8;
        document.getElementById('question').innerHTML = "Wow, you're too easy"
        end();
        document.getElementById('retry').style.display = 'block';
        return;
    }
    for (let i of items){
        if (i.item == currentItem.yes){
            currentItem = i;
            break
        }
    }
    //currentItem = items[currentItem.yes];
    changeQuestion(currentItem);
    
}

function end(){
    document.getElementById('yes').style.display = "none";
    document.getElementById('no').style.display = "none";
}

function changeQuestion(item){
    if (item.type=='question'){
        document.getElementById('question').innerHTML = item.question;
    }
    else{ //is answer
        document.getElementById('question').innerHTML = "Is it a "+item.answer+"?";
    }
}
function showError(){
    document.getElementById('error').style.display="block";
}

function addItem(){
    let a = document.getElementById('item_animal').value;
    let q = document.getElementById('item_question').value;
    let correctAnswer = document.getElementById('item_answer').value;
    if (a.length==0 || q.length==0 || correctAnswer.length==0){
        document.getElementById('error').style.display="block";
        return;
    }
    
    let answer = correctAnswer.toLowerCase();
    if (answer!='yes' && answer!='no'){
        document.getElementById('error').style.display="block";
        return;
    }
    document.getElementById('error').style.display='none';
    document.getElementById('submit').style.display='none';

    if (q.substring(q.length-1)!=='?'){
        q+='?';
    }
    let animal = a.substring(0,1).toUpperCase()+a.substring(1).toLowerCase();
    let question = q.substring(0,1).toUpperCase()+q.substring(1).toLowerCase();


    let thisInfo = {
        animal:animal,
        question:question,
        correctAnswer:answer
    }
    // console.log(currentItem);
    // console.log(thisInfo);
    editApi(thisInfo);

}


function retry(){
    getItems();
    faceIndex=4;
    document.getElementById('yes').style.display = "block";
    document.getElementById('no').style.display = "block";
    document.getElementById('teachHolder').style.display = "none";
    document.getElementById('retry').style.display = "none";
    document.getElementById('error').style.display="none";
    document.getElementById('submit').style.display='block';
}


function start(){
    getItems();
    document.getElementById('error').style.display="none";
    for (let i=1;i<=9;i++){
        emojiFaces.push(loadImage("faces/"+i+".png",scale));
    }
   
}



function frame(){
    graphics.fillStyle = "white";
    graphics.fillRect(0,0,canvas.width,canvas.height);
    graphics.strokeStyle = "grey";
    graphics.strokeRect(0,0,canvas.width,canvas.height);
    drawImage(emojiFaces[faceIndex],canvas.width/2,canvas.height/2);
}

