//NOTES
//It only works right now if the board is square

var bombMap,
    numBombs = 10,
    gameWidth = 10,
    gameHeight = 10,
    bombsArray = [],
    bombLimits = gameWidth * gameHeight,
    myChildren,
    neighbor,
    emptySquareID,
    timerStarted = false,
    timerValue;

//random number generator
function randomizer(n){
  return Math.floor((Math.random() * n) + 1);
}

//generate array of Bomb numbers
function makeBombs(n){
  for(var b = 1; b <= numBombs; b += 1){
    bombsArray.push(randomizer(bombLimits));
  }
};

//call the makeBombs function
makeBombs(numBombs);      

//replace duplicates found in the bombsArray
function replacer(a){
  var duplicate = false;
    
  a.sort(function(a, b){
    return a - b;
  })
    
  for (var i = 0; i < a.length; i += 1){
    if(a[i] === a[i -1]){
      duplicate = true;
      a[i] = randomizer(bombLimits);
      replacer(a);
    }
  }
}

replacer(bombsArray);        
  
//create multidemensional array.  Had to look up how to do this
bombMap = new Array(gameHeight);

for(var i = 0; i < gameHeight; i += 1){
  bombMap[i] = new Array(gameWidth);
}

//insert default values into each position in the bombMap        
(function(){
  for (var y = 0; y < gameHeight; y += 1){
    for (var x = 0; x < gameWidth; x += 1){
      bombMap[y][x] = 0;
    }
  }
})();

//insert bombs into the multidimensional array
(function(){
    
  var col,
      row;
    
  //Divide each member of bombsArray by the gameHeight to find out which row it needs to fall in
  for (var b = 0; b < bombsArray.length; b += 1){
      
    //find column array position for the bomb
    //If 25 => 0
    col = (bombsArray[b] % gameWidth) - 1;
    
    //test for col edge case
    if(col === -1){
      col = gameWidth - 1;
    }
    
    //find row array position for the bomb
    //if bombsArray[b] is evenly divisible by gameheight, subtract 1
    //if 20 / 5 = 4, we need to set it in the 4 row array position
    row = Math.floor(bombsArray[b] / gameHeight );
    
    if(bombsArray[b] % gameHeight === 0){
        row -= 1;
    }
                
    bombMap[row][col] = " * ";    
  }
    
})();        
  
// add in the indicator numbers
// probably shouldn't do this, should add in numbers after click
(function(c,r){
  var marker;
  for (var y = 0; y < r; y += 1){
    for (var x = 0; x < c; x += 1){
        
      //if the square we're on isn't a bomb
      if (bombMap[y][x] === 0){
        marker = 0;
        
        //count the number of bombs in the surrounding squares
        if (bombMap[y][x + 1] === " * "){marker += 1;}
        if (bombMap[y][x - 1] === " * "){marker += 1;}
        
        if(bombMap[y + 1] !== undefined){
          if (bombMap[y + 1][x] === " * "){marker += 1;}
          if (bombMap[y + 1][x + 1] === " * "){marker += 1;}
          if (bombMap[y + 1][x - 1] === " * "){marker += 1;}
        }
        
        if(bombMap[y - 1] !== undefined){
          if (bombMap[y - 1][x] === " * "){marker += 1;}
          if (bombMap[y - 1][x - 1] === " * "){marker += 1;}
          if (bombMap[y - 1][x + 1] === " * "){marker += 1;}
        }
        
        if(marker > 0){
          bombMap[y][x] = marker;
        } else {
          bombMap[y][x] = "&nbsp;";    
        }
      }
        
    }
  }
})(gameWidth, gameHeight);        
         
//game board generator
(function(c, r){
    
  var tableCells = '<tr>',
      counter = 1,
      bombNumberClass;
  
  for (var y = 0; y < r; y += 1){
    for (var x = 0; x < c; x += 1){
      if (bombMap[y][x] === 1){
        bombNumberClass = "bombBlue";
      } else if (bombMap[y][x] === 2){
        bombNumberClass = "bombGreen";    
      } else if (bombMap[y][x] === 3){
        bombNumberClass = "bombRed";    
      } else if (bombMap[y][x] === 4){
        bombNumberClass = "bombDarkBlue";    
      } else if (bombMap[y][x] === 5){
        bombNumberClass = "bombDarkRed";    
      } else if (bombMap[y][x] === 6){
        bombNumberClass = "bombAqua";    
      } else if (bombMap[y][x] === 7){
        bombNumberClass = "bombPurple";    
      } else if (bombMap[y][x] === 8){
        bombNumberClass = "bombBlack";    
      }
      tableCells += '<td id="'+counter+'" class="unmarked '+bombNumberClass+'"><span class="hidden">'+ bombMap[y][x] +'</span></td>';
      counter += 1;
    }
    tableCells += '</tr>';
  }
  document.getElementById('game').innerHTML = tableCells;
})(gameWidth, gameHeight)
         
  //Left-Click Event Listener
  document.getElementById("game").addEventListener('click', 
      function(e){
          if(e.srcElement.tagName === "TD"){
                
              if(timerStarted === false){
                 timerStarted = true;
                 gameTimer(); 
              }
              
              console.log(e.srcElement);
              //console.log(e.srcElemnt.className);
              
              //removeClass "unmarked" class
              e.srcElement.className = e.srcElement.className.replace( /(?:^|\s)unmarked(?!\S)/g , '' );

              //add the "clicked" class                   
              e.srcElement.className += " clicked";
              e.srcElement.children[0].className = "visable";
              
              //clear adjacent cells                    
              var clearCells = (function(){
                  if(e.srcElement.innerHTML.indexOf("&nbsp;") !== -1){                            
                      
                      //get the ID of the element Clicked
                      emptySquareID = parseInt(e.srcElement.id);
                      
                      var counter = 1;
                      var cellID;
                      
                      for (var i = 0; i < 8; i += 1){
                          
                          //if the element clicked on was ID === 1
                          if (counter === 1) {        //east  //2
                              cellID = emptySquareID + 1;
                          } else if (counter === 2){  //southeast  //12
                              cellID = emptySquareID + gameWidth + 1;
                          } else if (counter === 3){  //south // 11
                              cellID = emptySquareID + gameWidth;
                          } else if (counter === 4){  //southwest
                              cellID = emptySquareID + gameWidth - 1;
                          } else if (counter === 5){  //west
                              cellID = emptySquareID - 1;
                          } else if (counter === 6){  //northwest
                              cellID = emptySquareID - gameWidth - 1;    
                          } else if (counter === 7){  //north
                              cellID = emptySquareID - gameWidth;    
                          } else if (counter === 8){  //northeast
                              cellID = emptySquareID - gameWidth + 1;    
                          }                                
                          
                          console.log("CellID: " + cellID);
                          
                          neighbor = document.getElementById(cellID);
                                              
                          var crossedBorder = false;
                          
                          
                          //something Funny happens with cellID === 11 or 0
                          if((cellID - 1) % gameWidth === 0 || cellID === (gameWidth + 1)){
                              crossedBorder = true;
                          }
                          
                          console.log("Crossed Boarder: " + crossedBorder);                               
                          
                          //if the square is related and doesn't have a bomb uncover it.
                          if (neighbor.innerHTML.indexOf(" * ") === -1 && crossedBorder === false){
                              console.log('ran neighbor: ');
                              
                              //removeClass "unmarked" class
                              neighbor.className = neighbor.className.replace( /(?:^|\s)unmarked(?!\S)/g , '' );

                              //add the "clicked" class                                       
                              neighbor.className += " clicked";
                              neighbor.children[0].className = "visable";
                          }
                          counter += 1; 
                      }
                      
                  }
              })();
              
              
              //alert if bomb clicked
              if(e.srcElement.innerHTML.indexOf("*") !== -1){
                  alert("Game Over!");
                  stopTimer();
              }
          
          }
      }, 
  false);
  
  //Right-Click Event Listener
  //Had to look up how to listen for the right click
  document.getElementById("game").addEventListener('contextmenu', 
      function(e){
          e.preventDefault();
                                          
          if(e.srcElement.tagName === "TD"){
              if (e.srcElement.className === "marked"){ 
                  e.srcElement.className = "suspect";
                  bombCounter(+1);
              } else if (e.srcElement.className === "suspect") {
                  e.srcElement.className = "unmarked";
              } else {  //add red
                 e.srcElement.className = "marked";
                 bombCounter(-1);
              }
          }                
          //return false;
      }, 
  false);
  
  //Game Timer
  //Had to look this up
  document.getElementById("timer").innerHTML = "0";
  var gameTimer = function(){
      var start = new Date;
      var myTimer = document.getElementById("timer");
      myInterval = setInterval(function() {
          timerValue = parseInt(((new Date - start) / 1000));
          myTimer.innerHTML = timerValue;
      }, 1000);             
  }
  
  var stopTimer = function(){
      clearInterval(myInterval);
  }

  //Bomb Count Down  THIS NEEDS WORK
  document.getElementById("bombCounter").innerHTML = numBombs; 
  
  //Need to fix for the case of when a user LEFT clicks a square that is marked.
  var bombCounter = function(n){
      var bombCount = parseInt(document.getElementById("bombCounter").innerHTML);
      document.getElementById("bombCounter").innerHTML = bombCount + n;
  }