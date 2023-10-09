"use strict";
const path = "https://cs.catlin.edu/node/maxim/main/kahoot";


let gameNumber;
let data;


function joinEvent(){
  let eventSource = new EventSource(path);
  eventSource.addEventListener('data',updatePlayerNumbers)
}

function updatePlayerNumbers(event){
  data = JSON.parse(event.data);
  console.log(data);
  for (let num=0;num<data.length;num++){
    let game = data[num]
    let players = game.size;
    let label = num+1;
    document.getElementById("players"+label).innerHTML = players+" Players";
    document.getElementById("status"+label).innerHTML = "Status: "+game.status;
  }
}


async function getGames(){
  let response = await fetch(path);
  if (response.ok){
    games = await response.json();
  }
}

async function createGame() {
  console.log("you suck");
  const username = document.getElementById("username").value; //$('username').innerHTML;
  if (username !== undefined && username.length > 0) {
    let response = await fetch(path+"?name="+username, { method: "POST" });
    if (response.ok){
      console.log(response.json());
    }
  }
}

async function joinGame(pin) {
  const username = document.getElementById("username").value; //$('username').innerHTML;
  if (username !== undefined && username.length > 0) {
    let response = await fetch(path+"?pin="+pin+"&name="+username,{method: "PUT"});
  }
}

function loadLobby(){
  getGames();
  document.getElementById('startScreen').style.display='none';
  const names = document.getElementById('names');
  for (let player of Object.keys(data.pointList)){
    const element = document.createElement('p');
    element.innerText = player;
    names.append(element);
  }
}





// async function joinGame(game){
//   let username = document.getElementById('username').value;
//   if (username !== undefined && username.length>0){
//     let response = await fetch(path+"/"+game+"/"+username,{method:"POST"});
//     if (gameNumber !== undefined){
//       response = await fetch(path+"/"+game+"/"+username,{method:"DELETE"});
//     }
//     gameNumber = game;
//   }
// }





// function clickEvents(){
//   let eventSource = new EventSource(path);
//   eventSource.addEventListener("update", updateChoice);

// }



// function stringCleaner(word) {}

// function start(){

// }

// function frame(){
//     graphics.fillStyle = "cornsilk";
//     graphics.fillRect(0,0,canvas.width,canvas.height);
// }
