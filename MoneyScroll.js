/*Javascript*/

var velocity;
var interval;
var leftpos = [];
var moneyPictures = [];
var time = [];

var canvas = document.getElementById('scrollerCanvas');
var context = canvas.getContext('2d');
var moneyCounter = 0;
var moneyMadeDisp = "Money Made: $0.00";
document.getElementById("moneyMade").innerHTML = moneyMadeDisp;
document.getElementById("newMoney").onclick = function() {addNew()};
document.getElementById("update").onclick = function() {updateVals()};

updateVals();

// draw window
context.beginPath();
context.lineWidth = 1;
context.strokeRect(0,0,canvas.width,canvas.height);



function updateVals() {
  // reset values
  interval;
  leftpos = [];
  moneyPictures = [];
  time = [];

  // get values from user input
  var selectedCurrency = document.getElementById("currency").value;
  salary = document.getElementById('salary').value;
  salary = salary.replace(/\,/g,'');
  salary = parseInt(salary,10);

  // set values based on selections
  newMoney = new Image();
  newMoney.src = '1c_usd.png';
  switch (selectedCurrency) {
    case "cent":
      dollars = 100;
      moneyIncrease = 1;
      moneyHeight = 75;
      moneyWidth = 75;
      newMoney.src = '1c_usd.png';
      moneyY = canvas.height/2 - moneyHeight/2;
    break;

    case "dollar":
      dollars = 1;
      moneyIncrease = 100;
      moneyHeight = 150;
      moneyWidth = 330;
      newMoney.src = '1_usd.png';
      moneyY = canvas.height/2 - moneyHeight/2;
    break;

    case "5c_usd":
      dollars = 20;
      moneyIncrease = 5;
      moneyHeight = 100;
      moneyWidth = 100;
      newMoney.src = '5c_usd.png';
      moneyY = canvas.height/2 - moneyHeight/2;
    break;

    case "10c_usd":
      dollars = 10;
      moneyIncrease = 10;
      moneyHeight = 60;
      moneyWidth = 60;
      newMoney.src = '10c_usd.png';
      moneyY = canvas.height/2 - moneyHeight/2;
    break;

    case "25c_usd":
      dollars = 4;
      moneyIncrease = 25;
      moneyHeight = 125;
      moneyWidth = 125;
      newMoney.src = '25c_usd.png';
      moneyY = canvas.height/2 - moneyHeight/2;
    break;

    case "euro":
      dollars = .89;
      moneyIncrease = 110;
      moneyHeight = 150;
      moneyWidth = 300;
      newMoney.src = '1_euro.png';
      moneyY = canvas.height/2 - moneyHeight/2;
    break;

    case "loonie":
      dollars = 1.35;
      moneyIncrease = 75;
      moneyHeight = 100;
      moneyWidth = 100;
      newMoney.src = 'loonie.png';
      moneyY = canvas.height/2 - moneyHeight/2;
    break;

    case "toonie":
      dollars = 1.35;
      moneyIncrease = 270;
      moneyHeight = 100;
      moneyWidth = 100;
      newMoney.src = 'toonie.png';
      moneyY = canvas.height/2 - moneyHeight/2;
    break;
  }

  var tax = document.getElementById("tax").value;

  var salaryTime = document.getElementById("salaryTime").value;
  switch (salaryTime) {
    case "year":
      var divideExt = 1 / 52 /40 / 60 / 60 / 1000;
    break;

    case "hour":
      var divideExt = 1 / 60 / 60 / 1000;
    break;
  }

  // calculate speed
  salaryPerMili = 1 / (salary*dollars*divideExt*((100-tax)/100));

  if (salaryPerMili < 500) {
    velocity = 1.84;
  }
  else {
    velocity = .92;
  }

  // make sure the salary isn't too much to wreck the animation
  if (salaryPerMili > 5) {
    try {
      clearInterval(salaryLoop);
    }
    finally{
      salaryLoop = setInterval(addNew,salaryPerMili);
    }
  }
  else {
    try {
      clearInterval(salaryLoop);
      clearInterval(interval);
    }
    finally {
      context.clearRect(0,0,canvas.width,canvas.height);
      context.fillStyle = "#15ff00";
      context.font = "bold 25px Arial";
      context.textAlign="center";
      context.fillText("You make too much money, go away"
        , (canvas.width / 2), (canvas.height / 2)-10);
      context.fillText("(or use a more valuable currency)"
        , (canvas.width / 2), (canvas.height / 2)+10);

    }
  }
}

function addNew() {
  leftpos.push(-moneyWidth);
  try  {
    clearInterval(interval);
  }
  finally {
    interval = setInterval(redraw,1);
  }
  moneyPictures.push(newMoney);
  var t = new Date().getTime();
  time.push(t);
}

function redraw() {
  if (leftpos[0] > canvas.width) {
    leftpos.splice(0,1);
    time.splice(0,1);
    moneyCounter += moneyIncrease/100;
    var moneyMadeDisp = "Money Made: $"+moneyCounter.toFixed(2);
    document.getElementById("moneyMade").innerHTML = moneyMadeDisp;
  } else {
    context.clearRect(0,0,canvas.width,canvas.height);
    drawAllMoneys();
  }
}

function drawAllMoneys() {
  context.beginPath();
  context.lineWidth = 1;
  context.strokeRect(0,0,canvas.width,canvas.height);

  for (i=0; i<leftpos.length; i++) {
    context.drawImage(moneyPictures[i]
      ,leftpos[i]
      ,moneyY
      ,moneyWidth
      ,moneyHeight);
    leftpos[i] += velocity;
  }
}






function updateBackground() {
  var bg_val = document.querySelector('input[name = "bgsel"]:checked').value;
  document.getElementById("scrollerCanvas").className = bg_val;
}


// use a queue as the data structure
