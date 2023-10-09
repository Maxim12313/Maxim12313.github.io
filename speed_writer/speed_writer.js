let round = 0;
let data;
let tempIdList = [];
let story = [];
let formExtraIds = [];
let formInputTextIds = [];
let multiplayer = false;
let gamePin;
let players = 0;
let vocab = false;
let speedy = false;
let formCleared = false;

let time = 1;
let startTimer = false;
let endTime=60;

// let prompts = ["a", "b", "c", "d", "e"];
// let x = Math.random() * prompts.length - 1;

const path = "https://writer-api-dot-first-website-8de55.uc.r.appspot.com/";

async function getRandomPrompts(extra_path){    //if extra is '', then normal, if '/community', then community single
    let response = await fetch(path+extra_path);
    if (response.ok){
        data = response.json() //this will give you an array of 3 prompts
        return data;
    }
}

function beginTimer(){
    document.getElementById('timer').innerHTML = endTime;
    startTimer = true;
    time=1;
}

setInterval(()=>{
    if (!startTimer) return;
    
    if (time>endTime){
        nextPrompt();
    }
    let timeLeft = endTime-time;
    let element = document.getElementById('timer')

    if (timeLeft<=10) element.style.color = 'red';
    else if (timeLeft<=endTime/2) element.style.color = 'orange';
    else element.style.color = 'white';
    
    element.innerHTML = timeLeft;
    time++;
},1000);




async function play(extra_path,speedy,vocabulary){

    if (speedy)endTime = 30;
    else endTime = 60;
    vocab = vocabulary;
        
    removeTempItems();
    clearForm();
    data = await getRandomPrompts(extra_path);
    let timer = document.createElement("h1");
    timer.setAttribute('id','timer');
    timer.style.alignSelf = 'center';
    timer.style.fontSize = '100px';
    timer.style.margin = '0px';
    mainContainer.append(timer);
    tempIdList.push('timer');
    beginTimer();

    let p = document.createElement("p");
    p.setAttribute('id','prompt')
    p.innerHTML = data[round];
    p.style.color = 'rgb(202, 223, 18)';
    p.style.fontWeight = 'bold';
    mainContainer.append(p);
    tempIdList.push('prompt');
    setup();

}

function setup(){
    if (vocab){
        let line = document.createElement('hr')
        line.setAttribute('id','vocabLine');
        tempIdList.push('vocabLine');
        mainContainer.append(line);

        let vocabWord = document.createElement('h2');
        vocabWord.setAttribute('id','vocabWord');
        tempIdList.push('vocabWord');
        mainContainer.append(vocabWord);
        vocabWord.style.marginBottom = '0px';

        let vocabDefinition = document.createElement('p');
        vocabDefinition.setAttribute('id','vocabDefinition');
        vocabDefinition.style.marginTop = '10px';
        vocabDefinition.style.marginBottom = '0px';
        tempIdList.push('vocabDefinition');
        mainContainer.append(vocabDefinition);

        let vocabExample = document.createElement('p');
        vocabExample.setAttribute('id','vocabExample');
        vocabExample.style.marginTop = '10px';
        tempIdList.push('vocabExample');
        mainContainer.append(vocabExample);
        getVocab();
    } 
    

    //document.getElementById('play').style.display = 'none';

    let textArea = document.createElement("textarea");
    textArea.setAttribute('id','textArea');
    textArea.style.width = "50vw";
    textArea.style.height = "20vw";
    textArea.style.fontSize = "17px";
    mainContainer.append(textArea);
    tempIdList.push('textArea');

    let submit = document.createElement('button');
    submit.setAttribute('id','submit');
    submit.setAttribute('onClick','nextPrompt()');
    submit.style.width = "50vw";
    submit.style.marginTop = "10px";
    submit.innerHTML = 'Finish';
    mainContainer.append(submit);
    tempIdList.push('submit');

    let note = document.createElement("p");
    note.setAttribute('id','note')
    note.innerHTML = "Use cntrl/cmd enter to quick finish";
    mainContainer.append(note);
    tempIdList.push('note');

}

function removeTempItems(){
    for (let id of tempIdList){

        document.getElementById(id).remove();
    }
    tempIdList = [];
}


function reset(){
    document.getElementById('play').style.display = 'block';
    removeTempItems();
    let num = 1;
    startTimer=false;
    vocab = false;

    for (let text of story){

        let prompt = document.createElement('p');
        prompt.innerHTML = data[num-1];
        let promptId = 'prompt'+num;
        prompt.setAttribute('id',promptId);
        prompt.style.marginBottom = '0px';
        prompt.style.color = 'rgb(202, 223, 18)';
        mainContainer.append(prompt);
        tempIdList.push(promptId);


        let storyPiece = document.createElement('p');
        storyPiece.innerHTML = text;
        if (!text.length>0){
            storyPiece.innerHTML = "___";
        }
        let id = 'storyPart'+num;
        storyPiece.setAttribute('id',id);
        mainContainer.append(storyPiece);

        tempIdList.push(id);
        num++;
    }
    
    round=0;
    story = [];


    let line = document.createElement('hr');
    line.setAttribute('id','line7');
    tempIdList.push('line7');
    mainContainer.append(line);

    let message1 = document.createElement('h2');
    message1.setAttribute('id','message1');
    message1.innerHTML = 'Add Your Own Prompts to The Database!';
    message1.style.marginBottom = '0px';
    
    formExtraIds.push('message1');
    mainContainer.append(message1);

    let message2 = document.createElement('h5');
    message2.setAttribute('id','message2');
    message2.innerHTML = 'These will show up in the community single player';
    formExtraIds.push('message2');
    mainContainer.append(message2);

    loadForm();
}

function enterSubmit(){
    window.addEventListener('keydown',(event)=>{
        if (event.key === 'Enter' && event.target === document.getElementById('textArea')){//)
            if (document.getElementById('textArea').value.length>0){
                if (event.ctrlKey || event.metaKey){
                    nextPrompt();
                }
            }
        }
    });
}

function nextPrompt(){
    
    story.push(document.getElementById('textArea').value);
    beginTimer();
    round+=1;
    if (round>=data.length){
        reset();
        return;
    }

    if (vocab){
        getVocab();
    }

    document.getElementById('prompt').innerHTML = data[round];
    document.getElementById('textArea').value = "";
}
function settings() {
    let settingsContainer = document.createElement("div");
    settingsContainer.setAttribute("id", "settings-container");
    document.getElementById("overall").append(settingsContainer);

    let settingsMenu = document.createElement("div");
    settingsMenu.setAttribute("id", "settings-menu");
    document.getElementById("overall").append(settingsMenu);
}




async function getVocab(){
    let response = await fetch(path+'/vocab');
    if (response.ok){
        let wordObject = await response.json();
        document.getElementById('vocabWord').innerHTML = "Word: "+wordObject.word;
        document.getElementById('vocabDefinition').innerHTML = "Definition: "+wordObject.definition;
        document.getElementById('vocabExample').innerHTML = "Example: "+wordObject.exampleSentence;
    }

    
}

function loadForm(){    //we will want to strip all <> and slashes to stop injection attacks
    for (let order of ['First','Second','Third']){
        let description = document.createElement('p');
        description.innerHTML = order+" scenario + what the player should describe";
        let descriptionId = order+'Description';
        description.setAttribute('id',descriptionId);
        description.style.marginBottom = '3px';
        description.style.alignSelf = 'start';
        formExtraIds.push(descriptionId);
        mainContainer.append(description);

        let inputText = document.createElement('input');
        inputText.setAttribute('type','text');
        let inputTextId = order+'InputText';
        inputText.setAttribute('id',inputTextId);
        inputText.setAttribute('size','80');
        inputText.style.alignSelf = 'start';
        formInputTextIds.push(inputTextId);
        mainContainer.append(inputText);
    }

    let formSubmit = document.createElement('button');
    formSubmit.innerHTML = 'Submit';
    formSubmit.setAttribute('id','formSubmit');
    formSubmit.setAttribute('onclick','sendForm()');
    formSubmit.style.alignSelf = 'start';
    mainContainer.append(formSubmit);
}

function sendForm(){ //do for loop and get rid of <>
    let dataSet = [];



    for (let inputTextId of formInputTextIds){
        let inputTextElement = document.getElementById(inputTextId);
        if (!inputTextElement.value.length>0){
            alert("Missing fields");
            return;
        }
        else if (inputTextElement.value.includes('<') || inputTextElement.value.includes('>')){
            alert("No <> symbols");
            return;
        }
        dataSet.push(inputTextElement.value);
    }

    clearForm();
    

    let message = document.createElement('h1');
    message.innerHTML = 'Thank You for Submitting!';
    message.setAttribute('id','message7');
    tempIdList.push('message7');
    mainContainer.append(message);
    sendFormRequest(dataSet);
}

function clearForm(){
    for (let id of formInputTextIds){
        document.getElementById(id).remove();
     }
     for (let id of formExtraIds){
         document.getElementById(id).remove();
     }
     let button = document.getElementById('formSubmit');
     if (button !== undefined && button !== null){
         button.remove();
     }
     formInputTextIds = [];
     formExtraIds = [];
}

async function sendFormRequest(data){
    let response = await fetch(path+'/community/'+JSON.stringify(data),{ method: "POST" });
}







// function loadMultiplayerTools(){
//     removeTempItems();
//     clearForm();
//     startTimer = false;
    
//     let div = document.createElement('div');
//     div.setAttribute('class','multiplayerOptions');
//     div.setAttribute('id','multiplayerDiv');
//     tempIdList.push('multiplayerDiv');
//     let inputText = document.createElement('input');
//     inputText.setAttribute('id','gamePin');
//     inputText.setAttribute('type','text');
//     inputText.setAttribute('size','30');
//     div.append(inputText);

//     let joinButton = document.createElement('button');
//     joinButton.innerHTML = 'Join by Pin';
//     joinButton.setAttribute('onclick','joinGame()');
//     div.append(joinButton);


//     let newGameButton = document.createElement('button');
//     newGameButton.innerHTML = 'New Game';
//     newGameButton.setAttribute('onclick','newGame()');
//     div.append(newGameButton);

//     mainContainer.append(div);
// }




// function setupMultiLobby(){
//    removeTempItems();
//    clearForm();
   
//    inputDetails();

//    let lobbyDiv = document.createElement('div');
//    lobbyDiv.setAttribute('id','lobbyDiv');
//    lobbyDiv.setAttribute('class','multiplayerOptions');
   

//    let readyMessage = document.createElement('h1');
//    readyMessage.innerHTML = "1/5 Ready"; //make dynamic
//    readyMessage.setAttribute('id','readyMessage');
//    readyMessage.style.marginBottom = "0px";
//    lobbyDiv.append(readyMessage);

//    let readyButton = document.createElement('button');
//    readyButton.setAttribute('id','readyButton');
//    readyButton.innerHTML = 'Not Ready';

//    lobbyDiv.append(readyButton);


//    tempIdList.push('lobbyDiv');
//    mainContainer.append(lobbyDiv);


// }

// function readyEvents(){
//     let eventSource = new EventSource(path+'/ready/'+gamePin);
//     eventSource.addEventListener('playerReadyStatus','');
// }

// function populationEvents(){
//     let eventSource = new EventSource(path+'/player-count/'+ gamePin);
//     eventSource.addEventListener('playerCount',updatePlayerCount);
// }

// function updatePlayerCount(event){
//     let playerCount = JSON.parse(event.data);
//     console.log(playerCount.size);
//     // document.getElementById('readyMessage').innerHTML = 
// }



// async function joinGame(){
//     let pin = document.getElementById('gamePin').value;
//     let response = await fetch(path+'/join/'+pin);
//     if (response.ok){
//         worked = response.json();
//         if (worked){
//             gamePin = pin;
//             setupMultiLobby();
//         }
//         else alert('Could not find any game under that pin');
//     }
// }

// async function inputDetails(){
//     let response = await fetch(path+'/player-count/'+gamePin);
// }


// async function newGame(){
//     let response = await fetch(path+'/make-game');
//     if (response.ok){
//         gamePin = await response.json();
//         console.log(gamePin);
//         players=1;
//         setupMultiLobby();
//     }
// }

