'use strict';


let dataVisual;
let activities;




function drawBackground(){
    graphics.fillStyle = 'cornsilk';
    graphics.fillRect(0,0,canvas.width,canvas.height);

    if (dataVisual.type==='circle'){
        fillCircle(canvas.width/2,canvas.height/2,dataVisual.radius,dataVisual.color);
        if (activities.length>0){
            let angleUnit = 360/activities[activities.length-1].endTime;
            let angle=90;
    
            for (let activity of activities){
                let margin  = 20;
                let prevAngle = angle;
                angle -= activity.duration*angleUnit;
                let radians = toRadians(angle);
                let cos = Math.cos(radians);
                let sin = Math.sin(radians);
            
                let x = canvas.width/2+dataVisual.radius*cos;
                let y = canvas.height/2-dataVisual.radius*sin;
                drawLine(canvas.width/2,canvas.height/2,x,y,'black');

                let timeX = canvas.width/2+(dataVisual.radius+margin)*cos;
                let timeY = canvas.height/2-(dataVisual.radius+margin)*sin;
                let hour = Math.floor(activity.endTime/60);
                let minute = activity.endTime%60;
                graphics.font = "20px Serif";
                graphics.fillStyle = 'black';
                graphics.fillText(hour+":"+minute,timeX,timeY,);

                let nameAngle = (angle+prevAngle)/2;
                let nameRadians = toRadians(nameAngle);

                graphics.font = "40px Serif";
                let nameX = canvas.width/2+(dataVisual.radius*3/4)*Math.cos(nameRadians);
                let nameY = canvas.height/2-(dataVisual.radius*3/4)*Math.sin(nameRadians);
                graphics.fillText(activity.name,nameX,nameY);
                
            }
        }
    }
}

function beginNow(){
    dataVisual.beginTime = 0;
}

function toRadians(angle){
    return angle*Math.PI/180;
}

function toDegrees(angle){
    return angle*180/Math.PI;
}

function updateValues(){
    let duration = parseInt(document.getElementById('activityDuration').value);
    let endTime = duration+dataVisual.beginTime;
    let prevActivity = activities[activities.length-1];
    if (prevActivity!== undefined){
        endTime = prevActivity.endTime+duration;
    }

    let activity = {
        name:document.getElementById('activityName').value,
        duration:duration,
        endTime:endTime
    }
    console.log(activity);

    activities.push(activity);
    drawBackground();
}

function saveData(){
    // let storageData = {
    //     activities:activities,
    //     dataVisual:dataVisual
    // }

    localStorage.setItem('maxim_shortA',JSON.stringify(activities));
    localStorage.setItem('maxim_shortV',JSON.stringify(dataVisual));
}

function reset(){
    

    dataVisual = {
        type:'circle',
        radius:canvas.height*3/7,
        color:'lightblue',
        beginTime:0
    }
    beginNow();


    activities = [];
    drawBackground();
}

function recalibrate(index,newDuration){
    let endTime = newDuration+dataVisual.beginTime;
    let prevActivity = activities[index-1];
    if (prevActivity!== undefined){
        endTime = prevActivity.endTime+newDuration;
    }
    activities[i].duration = newDuration;
    activities[i].endTime = endTime;
    for (let i=index+1;i<activities.length;i++){
        let activity = activities[i];
        let prev = activities[i-1];
        activity.endTime = prev.endTime+activity.duration;
    }
}


    

function start(){
    
    document.getElementById('durationCheck').checked = true;
    let a = localStorage.getItem('maxim_shortA');
    let v = localStorage.getItem('maxim_shortV');


    if (a === null){
        reset();
    }
    else{
        activities = JSON.parse(a);
        dataVisual = JSON.parse(v);
        drawBackground();
    }
    
    
    

}

function timeOptions(){
    if (document.getElementById('durationCheck').checked){
        document.getElementById('durationBox').style.display = 'block';
        document.getElementById('endTimeBox').style.display= 'none';
    }
    else{
        document.getElementById('endTimeBox').style.display = 'block';
        document.getElementById('durationBox').style.display = 'none';
    }
}


function frame(){
   //if mouse pressed, then check
   timeOptions();

}

