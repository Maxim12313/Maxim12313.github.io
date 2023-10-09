"use script";
const express = require('express');           // use the express library
const app = express();  
const fs = require('fs');                      // create an express application called app
const cors = require('cors');

const port = process.env.PORT || 8080 //was 9013
const fileName = 'items.txt';                            // THIS SHOULD BE YOUR ASSIGNED PORT NUMBER
let items = JSON.parse(fs.readFileSync(fileName));

const corsOptions = {
    origin: 'https://www.maximkim.com'
  };
  
app.use(cors(corsOptions));



app.get('/',getItems);
app.post('/',express.json(),newItem);
app.listen(port);

function getItems(request,response){
    response.send(items);
}


function newItem(request,response){
    let itemPair = request.body;
    let prevIndex = itemPair[0].item;
    let newInfo = itemPair[1];

    let s = 1+1;

    let newAnswer = {
        item:items.length,
        type:"answer",
        answer:newInfo.animal
    }
    items.push(newAnswer);

    let prevNewItem;
    //let oldItemNum = prevIndex;
    for (let i of items){
        if (i.item == prevIndex){
            i.item=items.length;
            prevNewItem = i.item;
            break;
        }
    }

    let newQuestion = {
        item:prevIndex,
        type:"question",
        question:newInfo.question,
        no:prevNewItem,
        yes:newAnswer.item
    }
    let answer = newInfo.correctAnswer;
    if (answer==='no'){
        newQuestion.no = newAnswer.item;
        newQuestion.yes = prevNewItem;
    }

    items.push(newQuestion);
    fs.writeFileSync(fileName,JSON.stringify(items));
    response.send(items);
}