/*Javascript*/

var velocity;
var interval;
var leftpos = [];
var moneyPictures = [];
var time = [];
var currencyTable = {
  'usd_div': {
    'c1': {'height': 75,'width': 75,'img': 'usd/1c_usd.png','increase': .01}
    ,'c5': {'height': 100,'width': 100,'img': 'usd/5c_usd.png','increase': .05}
    ,'c10': {'height': 60,'width': 60,'img': 'usd/10c_usd.png','increase': .1}
    ,'c25': {'height': 75,'width': 75,'img': 'usd/25c_usd.png','increase': .10}
    ,'d1': {'height': 100,'width': 150,'img': 'usd/1_usd.png','increase': 1}
  },
  'nok_div': {
    'k1': {'height': 75,'width': 75,'img': 'nok/1_nok.png','increase': 1}
    ,'k5': {'height': 100,'width': 100,'img': 'nok/5_nok.png','increase': 5}
    ,'k10': {'height': 60,'width': 60,'img': 'nok/10_nok.png','increase': 10}
    ,'k20': {'height': 125,'width': 125,'img': 'nok/20_nok.png','increase': 20}
    ,'k50': {'height': 150,'width': 300,'img': 'nok/50_nok.png','increase': 50}
    ,'k100': {'height': 150,'width': 305,'img': 'nok/100_nok.png','increase': 100}
  },
  'sni_div': {
    'reg' : {'height':100,'width':170,'img':'sni/snickers.png','increase':.89},
    'mini' : {'height':100,'width':100,'img':'sni/mini.png','increase':.1},
    'xl' : {'height':120,'width':300,'img':'sni/snickers.png','increase':5},
    'alm' : {'height':130,'width':190,'img':'sni/almond.png','increase':.89}
  }
};


var canvas = document.getElementById('scrollerCanvas');
var context = canvas.getContext('2d');
var moneyCounter = 0;
var moneyMadeDisp = "Money Made: $0.00";
document.getElementById("moneyMade").innerHTML = moneyMadeDisp;
document.getElementById("newMoney").onclick = function() {addNew()};
document.getElementById("update").onclick = function() {updateVals()};

updateCurrency();

// draw window
context.beginPath();
context.lineWidth = 1;
context.strokeRect(0,0,canvas.width,canvas.height);

updateVals();




function updateVals() {
  // reset values
  interval;
  leftpos = [];
  moneyPictures = [];
  time = [];

  // get values from user input
  var selectedCurrency = document.querySelector('input[name = "currency"]:checked').value;
  var selectedNote = document.querySelector('input[name = "note"]:checked').value;
  var salary = document.getElementById('salary').value;
  salary = salary.replace(/\,/g,'');
  salary = parseInt(salary,10);

  // set values based on selections
  newMoney = new Image();

  moneyIncrease = currencyTable[selectedCurrency][selectedNote].increase;
  moneyHeight = currencyTable[selectedCurrency][selectedNote].height;
  moneyWidth = currencyTable[selectedCurrency][selectedNote].width;
  newMoney.src = currencyTable[selectedCurrency][selectedNote].img;
  moneyY = canvas.height/2 - moneyHeight/2;

  var tax = document.getElementById("tax").value;

  var salaryTime = document.getElementById("salaryTime").value;
  switch (salaryTime) {
    case "year":
      var timeDivider = 1 / 52 /40 / 60 / 60 / 1000;
    break;

    case "hour":
      var timeDivider = 1 / 60 / 60 / 1000;
    break;
  }

  // calculate speed
  salaryPerMili = moneyIncrease / (salary*timeDivider*((100-tax)/100));

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
    moneyCounter += moneyIncrease;
    var moneyMadeDisp = "Money Made: $"+moneyCounter.toFixed(2);
    document.getElementById("moneyMade").innerHTML = moneyMadeDisp;
  }
  else {
    context.clearRect(0,0,canvas.width,canvas.height);
    drawAllMoneys();
  }
}


function drawAllMoneys() {
  context.beginPath();
  context.lineWidth = 1;
  context.strokeRect(0,0,canvas.width,canvas.height);

  for (var i=0; i<leftpos.length; i++) {
    context.drawImage(moneyPictures[i]
      ,leftpos[i]
      ,moneyY
      ,moneyWidth
      ,moneyHeight);
    leftpos[i] += velocity;
  }
}

// change the currency at a button push
function updateCurrency() {
  var currencies = ['usd_div','nok_div','sni_div']; //'mmk','try','kes'
  for (var i=0;i<currencies.length;i++) {
    var temp = document.getElementById(currencies[i]);
    temp.style.display = 'none';
  }
  var currency_val = document.querySelector('input[name = "currency"]:checked').value;
  var temp = document.getElementById(currency_val);
  temp.style.display = 'inline';
}


// change background color to value selected
function updateBackground() {
  var bg_val = document.querySelector('input[name = "bgsel"]:checked').value;
  document.getElementById("scrollerCanvas").className = bg_val;
}
