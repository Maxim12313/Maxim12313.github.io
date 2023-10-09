
//remade this
const express = require('express');           // use the express library
const app = express();  
const fs = require('fs');                      // create an express application called app
const port = 9213; //was 9216
const fileName = 'highscores.txt';                            // THIS SHOULD BE YOUR ASSIGNED PORT NUMBER
let highscore = JSON.parse(fs.readFileSync(fileName));

app.get('/dodger_api',highestScore);
app.post('/dodger_api',express.json(),updateScores);
app.listen(port);



function highestScore(request,response){
    response.send(highscore);
}

function updateScores(request, response){
    let score = request.body.score;
    let name = request.body.name;
    let newScore = {
        score:score,
        name:name
    }
    if (highscore.score<score && name!=0){
        fs.writeFileSync(fileName,JSON.stringify(newScore));
        highscore = newScore;
    }
    response.send(highscore);
}


