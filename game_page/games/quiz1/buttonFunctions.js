"use strict";
function checkAnswers(){
    alert("You are submitting your answers. Your knowledge and worth will be tested. Do you understand?");
    let score = 0;
    if (document.getElementById('a4').checked){
        score++;
    }
    if (document.getElementById('an1').checked){
        score++;
    }
    let keyWords = ['bad','disgusting','overpriced','expensive','horrible','terrible','suck'];
    for (const word of keyWords){
        if (document.getElementById('textAnswer').value.includes(word)){
            score++
            break;
        }
    }
    let list = document.getElementById('q4');
    let value = list.options[list.selectedIndex].value;
    if (value=="1998"){
        score++;
    }
    
    let pepperoni = document.getElementById('op1').checked;
    let cheese = document.getElementById('op2').checked;
    if (cheese && pepperoni){
        score++;
    }
    let outcome = document.getElementById('outcome')
    if (score==5){
       outcome.src = "success.png";
    }
    else{
        outcome.src = "fail.png";
    }
} 