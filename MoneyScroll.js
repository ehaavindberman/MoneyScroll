/*Javascript*/

var moneyList = [];
var userValues;
var addNewInterval;
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
var backgroundTable = {
  'wood' : {'image' : 'yes', 'value' : 'url(backgrounds//wood.png)'},
  'bank' : {'image' : 'yes', 'value' : 'url(backgrounds//bank.png)'},
  'white' : {'image' : 'no', 'value' : 'white'}
}

class scrollingMoney {
  constructor(currencyVals,dist) {
    this.vals = currencyVals;
    this.x = -1*currencyVals.width;
    this.start = new Date().getTime();
    this.end = this.start + 4000;
    this.newMoney = new Image();
    this.newMoney.src = this.vals.img;
  }
}

class windowVals {
  constructor() {
    this.selectedCurrency = document.querySelector('input[name = "currency"]:checked').value;
    this.selectedNote = document.querySelector('input[name = "note"]:checked').value;
    //this.tax = document.getElementById('tax').value;
    this.salaryTime = document.getElementById('salaryTime').value;
    this.salary = document.getElementById('salary').value;
    this.salary = this.salary.replace(/\,/g,'');
    this.salary = parseInt(this.salary,10);
  }
}


var canvas = document.getElementById('scrollerCanvas');
var context = canvas.getContext('2d');
var moneyCounter = 0;
var moneyMadeDisp = 'Money Made: $0.00';
document.getElementById('moneyMade').innerHTML = moneyMadeDisp;

userChangedSomething();
updateShownCurrency();
// draw window
context.beginPath();
context.lineWidth = 1;
context.strokeRect(0,0,canvas.width,canvas.height);


draw();


function userChangedSomething() {
  userValues = new windowVals;
  switch (userValues.salaryTime) {
    case 'year':
      var timeDivider = 1 / 52 / 40 / 60 / 60 / 1000;
    break;

    case 'hour':
      var timeDivider = 1 / 60 / 60 / 1000;
    break;
  }

  var inc = currencyTable[userValues.selectedCurrency][userValues.selectedNote].increase;

  // calculate number of miliseconds between new money
  var salaryPerMili = 1 / (userValues.salary*timeDivider*(1/inc)); //*(1-userValues.tax/100)

  // add a new currency each time
  console.log(salaryPerMili);
  try {
    clearInterval(addNewInterval);
  }
  finally {
    addNewInterval = setInterval(function(){addNew()},salaryPerMili);
  }
}


function addNew() {
  var currency = userValues.selectedCurrency;
  var note = userValues.selectedNote;
  moneyList.push(new scrollingMoney(currencyTable[currency][note],canvas.width))
}


function draw() {

  // clear and redraw canvas
  context.clearRect(0,0,canvas.width,canvas.height);
  context.beginPath();
  context.lineWidth = 1;
  context.strokeRect(0,0,canvas.width,canvas.height);

  // draw all scrolling money at it's correct position
  for (var i=moneyList.length-1; i>=0; --i) {
    var now = new Date().getTime();
    var pct = (moneyList[i].end - now) / (moneyList[i].end - moneyList[i].start);

    // show money at it's correct point or take it out if it's done
    if (pct > 0) {
      var moneyX = moneyList[i].x + (canvas.width + 2*moneyList[i].vals.width) * (1-pct);
      var moneyY = canvas.height/2 - moneyList[i].vals.height/2;

      context.drawImage(moneyList[i].newMoney
        , moneyX, moneyY
        , moneyList[i].vals.width, moneyList[i].vals.height
      );

    }
    // money is now off screen, so pop and increase counter
    else {
      // increase counter
      moneyCounter += moneyList[i].vals.increase;
      document.getElementById('moneyMade').innerHTML = 'Money Made: $'+moneyCounter.toFixed(2);
      moneyList.splice(i,1);
    }
  }
  window.requestAnimationFrame(draw);
}


// change the shown currency at a button push
function updateShownCurrency() {
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
  /*if (backgroundTable[bg_val].image == 'yes') {
    /*var img = new Image();
    img.src = backgroundTable[bg_val].value;
    var patrn = context.createPattern(img,'no-repeat');
    context.fillStyle = patrn;
    context.fillRect(0,0, canvas.width, canvas.height);
    //

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.'+bg_val+' { border: 3px #CCC solid; background:'
      +backgroundTable[bg_val].value+'; background-repeat: no-repeat; background-size: 100% 100%; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    document.getElementById('scrollerCanvas').className = '.'+bg_val;

    //document.getElementById("scrollerCanvas").style.backgroundRepeat = 'no-repeat';
    //document.getElementById("scrollerCanvas").className = backgroundTable[bg_val].value;

  }
  else {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.'+bg_val+' { border: 3px #CCC solid; background:'
      +backgroundTable[bg_val].value+'; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    document.getElementById('scrollerCanvas').className = '.'+bg_val;


    //document.getElementById("scrollerCanvas").style.background = backgroundTable[bg_val].value;
  }
  console.log(document.getElementById('scrollerCanvas').className)*/
  document.getElementById('scrollerCanvas').className = bg_val;

}
