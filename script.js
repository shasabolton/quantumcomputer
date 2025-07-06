//can do tp on a tp for mmore than 2 qbits
//make cnot function
// y gate
var zero = [[1],[0]];
var one =  [[0],[1]];



var H = [[Math.sqrt(0.5),Math.sqrt(0.5)],
         [Math.sqrt(0.5),-Math.sqrt(0.5)]           
        ]

var cNot = [[1,0,0,0],
            [0,1,0,0],
            [0,0,0,1],
            [0,0,1,0]]

var I= [[1,0],
         [0,1]];

var X= [[0,1],
        [1,0]];

var Z= [[1,0],
        [0,-1]];

var H2= [[0.5,0.5,0.5,0.5],
         [0.5,-0.5,0.5,-0.5],
         [0.5,0.5,-0.5,-0.5],
         [0.5,-0.5,-0.5,0.5]];

var displayDiv = document.getElementById("display");
var binaryDiv = document.getElementById("binary");
///////////////////////////////////////////////////////////////////////////////
////phase kickback
var phaseKickback = [[H,I,cX(0,1,2),H],
                     [H,Z,I,        H]];

//bernstein-vazirani
var bernsteinVazirani = [[H, I, cX(0,3,4), cX(1,3,4), H],
                         [H, I, I,       I,       H],
                         [H, I, I,       I,       H],
                         [H, Z, I,       I,       H]];
var HH = [[H, H]];

var simpleCircuit = [[X],
                     [X],
                     [I]];

var threeNot = [[cX(1,0,3)],
                 [I],
                 [I]];

var entangle = [[H,cNot],
               [ I,I]     ]
               
var qbit =[[X,H]];

var wignersFriend = [[H,cX(0,1,2),I],
                     [I,I,        H]];

var H2C= [[X,H2],
          [X,I]];

var circuit = wignersFriend;
displayBinary();
runCircuit(circuit);
//cX(1, 0, 2)
//displayMatrix(tp(I,I));
////////////////////////////////////////////////////////////////////////////////

//displayMatrix(tp(H,H));

function matMul(a,b){
  var c = [];
  for (var row = 0; row<a.length; row++){
    c.push([]);
    for(var col = 0; col<b[0].length; col++){
      var sum = 0;
      
        for(var index = 0;  index < a[0].length; index++){
          sum+=(a[row][index]*b[index][col]);
        }            
      c[row].push(sum);
    }
  }
  return c;
}



function tp(a,b){
  var c = [];
  for( var aRow = 0; aRow<a.length; aRow++){
    //console.log("aRow: ",aRow);
    for(var bRow = 0; bRow<b.length; bRow++){
      c.push([]);
      for(var aCol = 0; aCol<a[0].length; aCol++){
        //console.log("bRow: ",bRow);
        
        for(var bCol=0; bCol<b[0].length; bCol++){
          console.log(aRow*b.length + bRow);
           c[aRow*b.length + bRow].push([a[aRow][aCol]*b[bRow][bCol]]);
        }      
      }
    }
    
  }
  return c;
}



function displayMatrix(matrix, type){
  var HTML ="<table class = '" + type + "'>";
  for (var row =0; row<matrix.length; row++){
    HTML += "<tr>";
    for(var col = 0; col<matrix[row].length; col++){
      HTML += "<td>";
      var val = Number(matrix[row][col]).toFixed(2);
      HTML += val;
      HTML += "</td>";
    }
    HTML += "</tr>";
  }
  HTML+="</table>";
  displayDiv.innerHTML += HTML;
}



function displayBinary(){
  var HTML ="<table>";
  for (var row =0; row<Math.pow(2,circuit.length); row++){
    HTML += "<tr><td>";
    var val = row.toString(2);
    while(val.length<circuit.length){
      val= "0"+val;
    }
    HTML += val;
    HTML += "</td></tr>";
    }
   HTML+="</table>";
   binaryDiv.innerHTML = HTML;
  }




function cX(control, target, numQbits){
  var fullI = makeI(numQbits);
  var gate = [];
  for(var i = 0; i < Math.pow(2,numQbits); i++){
    gate.push(fullI[i]);
    var bin = i.toString(2);
    while(bin.length < numQbits){
      bin ="0" + bin;
    }
    if(bin[control] === "1"& bin[target]==="1"){
      var swapBin = bin.substring(0,target) + "0" + bin.substring(target+1);
      var swapIndex = parseInt(swapBin,2);
      gate[i] = fullI[swapIndex];
      gate[swapIndex] = fullI[i];
    }
  }
  return gate;
}

function makeI(numQbits){
  var result = I;
  for(var qBit = 1; qBit<numQbits; qBit++){
    result = tp(I,result)
  }
  return result;
}


function runCircuit(circuit){
  //make all zero state
  var state = [[1]];
  for(var inQubit = 1; inQubit < Math.pow(2,circuit.length); inQubit ++){
    state.push([0]);
  }
  
  displayDiv.innerHTML = "";
  displayMatrix(state, "state");
  
  for(var gate = 0; gate< circuit[0].length; gate++){
    var gateMatrix = circuit[0][gate];
    if(gateMatrix.length != state.length){
      for(var qbit = 1; qbit<circuit.length; qbit++){
        gateMatrix = tp(gateMatrix,circuit[qbit][gate]);
      }
    }
    
    displayMatrix(gateMatrix);
    state = matMul(gateMatrix,state);
    displayMatrix(state, "state");
  }
 
}

//console.log(matMul(tp(H,H),matMul(cNot,tp(matMul(H,zero),matMul(H,one)))));
//console.log(matMul(tp(I,X),tp(zero,zero)));


