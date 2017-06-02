/*Javascript*/




var leftpos = [];
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var moveMoney;
context.beginPath();
context.lineWidth = 1;
context.strokeRect(0,0,480,270);


//var moveMoney = setInterval(redraw,1);

//setInterval(redraw,500, num);

function redraw() {
  if (leftpos[0] > 480) {
    leftpos.shift();
    clearInterval(moveMoney);
    console.log("done")
  } else {
    context.clearRect(0,0,480,270);
    var i = 0
    drawAllMoneys(i);
}


function drawAllMoneys(i) {
  context.beginPath();
  context.lineWidth = 1;
  context.strokeRect(0,0,480,270);

  newMoney = new Image();
  newMoney.src = 'TestMoney.jpg';
  newMoney.onload = function(){
    context.drawImage(newMoney,leftpos[i],75,220,100);
  }
  leftpos[i] += 1;
}

}



document.getElementById("newMoney").onclick = function() {addNew()};
function addNew() {
  if (leftpos.length<1) {
    leftpos.push(5);
    setInterval(redraw,1);
  }
  else {
    leftpos.push(5)
  }
}


// use a queue as the data structure
