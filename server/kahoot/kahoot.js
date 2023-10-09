"use strict";
const express = require("express"); // use the express library
const app = express();
const fs = require("fs"); // create an express application called app
const port = 9214; //9013,9213 THIS SHOULD BE YOUR ASSIGNED PORT NUMBER 

const dataList = {
    20:{
        players:[], //response,name
        clients:[]
    }     
}


app.post('/',(request,response)=>{
    const name = request.query.name;
    const pin = Math.floor(Math.random()*100);
    dataList[pin] = {
        players:[name],
        client:[response]
    }
    const stringData = JSON.stringify(dataList);
    response.send(stringData);
})

app.put('/',(request,response)=>{
    const name = request.query.name;
    const pin = request.query.pin;
    if (dataList[pin] === undefined){
        return;
    }
    //otherwise...
    dataList[pin].players.push({name});
    dataList[pin].client.push({response});
    response.send(dataList[pin])

})



app.get('/',(request,response)=>{
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    const pin = request.query.pin;
    const name = request.query.name;
    const players = dataList[pin];
    if (players === undefined){
        return;
    } 
    //otherwise...

    console.log(dataList[pin]);
    request.on('close', closeConnection);
    function closeConnection() {
        dataList[pin].splice(dataList[pin].indexOf(response), 1);  // remove this client from the clients list
        console.log('connection closed');
    }
})








// //players have: name, response, current message, an array for their stories and one for prompts

// const game1 = {
//     players:[],
//     status:"waiting"
// }

// const game2 = {
//     players:[],
//     status:"waiting"
// }
// const game3 = {
//     players:[],
//     status:"waiting"
// }

   
// app.post('/1/:name',(request,response)=>{
//     const name = request.params.name;
//     game1.players.push({
//         name:name,
//         request:request
//     });
//     setTimeout(sendPlayerNumbers,0);
//     response.end();
// })

// app.delete('/1:name',(request,response)=>{
//     const name = request.params.name;
//     let count=0;
//     for (let player of game1.players){
//         if (player.request === request){
//             game1.players.splice(count,1);
//             break;
//         }
//         count++;
//     }
//     setTimeout(sendPlayerNumbers,0);
//     response.send("lol");
// })



   
// app.post('/2/:name',(request,response)=>{
//     const name = request.params.name;
//     game2.players.push({
//         name:name,
//         request:request
//     });
//     setTimeout(sendPlayerNumbers,0);
//     response.end();
// })

// app.delete('/2:name',(request,response)=>{
//     const name = request.params.name;
//     let count=0;
//     for (let player of game2.players){
//         if (player.request === request){
//             game2.players.splice(count,1);
//             break;
//         }
//         count++;
//     }
//     setTimeout(sendPlayerNumbers,0);
//     response.end();
// })



// app.post('/3/:name',(request,response)=>{
//     const name = request.params.name;
//     game3.players.push({
//         name:name,
//         request:request
//     });
//     setTimeout(sendPlayerNumbers,0);
//     response.end();
// })

// app.delete('/3:name',(request,response)=>{
//     const name = request.params.name;
//     let count=0;
//     for (let player of game3.players){
//         if (player.request === request){
//             game3.players.splice(count,1);
//             break;
//         }
//         count++;
//     }
//     setTimeout(sendPlayerNumbers,0);
//     response.end();
// })




// function sendPlayerNumbers(){
//     let data = [
//         {
//             id:1,
//             size:Object.keys(game1.players).length,
//             status:game1.status,
//         }, 
//         {
//             id:2,
//             size: Object.keys(game2.players).length,
//             status:game2.status,
//         },
//         {
//             id:3,
//             size:Object.keys(game3.players).length,
//             status:game3.status,
//        }
//     ]
//     let dataString = JSON.stringify(data);
//     for (let client of mainClients) {
//         client.write('event: data\n');
//         client.write(`data: ${dataString}\n\n`);
//     }
// }



// let games = {
//     20:{
//         pointList:{
//             "zebraKiller": 0,
//             "ze3raKiller": 0,
//             "zeb5aKiller": 0,
//             "zebr4Killer": 0,
//             "zebr6Killer": 0,
//             "zebra7iller": 0,
//             "zeraKiller": 0,
//             "zebrailler": 0,
//             "zebraKller": 0,
//             "zeraKiller": 0,
//             "zebraKller": 0,
//         },
//         round:0,

//     }
// };



// app.get('/kahoot',(request,response)=>{
//     const headers = {
//         'Content-Type': 'text/event-stream',
//         'Connection': 'keep-alive',
//         'Cache-Control': 'no-cache'
//       };
//       response.writeHead(200, headers);

//       clients.push(response);

//       passMessage();
//       request.on('close', closeConnection);
//       function closeConnection() {
//         clients.splice(clients.indexOf(response), 1);  // remove this client from the clients list
//         console.log('connection closed');
//     }
// });

// app.post('/kahoot',(request,response)=>{
//     const name = request.query.name;
//     let pin = request.query.pin; 
//     if (games[pin]===undefined){
//         games[pin] = {
//             pointList:{
//             [name]:0
//             }
//         }
//     }
//     else{
//         games[pin].pointList[name] = 0;
//     }
    
// })

// app.get('/kahoot/players',(request,response)=>{
//     response.send("hello there");
// })

app.listen(port);






//ASIIHDKASODJASHJVDLKBDAKJDSKBJDLJKHVAKSJLDAJBHDKJL;DSJBHBKJDLAJBHSKJDBH

//MAKE 5 DIFFERENT LOBBIES THAT PEOPLE CAN JOIN AND UPDATE THE STUFF IN EACH OF THOSE ONES
//UPLOAD YOUR OLD POEMS TO TEEN INK

//STYUI8OUGYUIPOASGFUHIJSAHKJVDLJSADHVGSAJHLKDSAHVGDJHJHALSDVSAKDHAD
