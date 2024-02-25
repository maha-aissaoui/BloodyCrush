var bloodies =["A-", "A+", "AB-", "AB+", "B-", "B+", "O+", "O-"];
var board = [];
var rows=7;
var columns=7;
var score =0;

var currTile;
var otherTile;
var currImg;

var ind;

var A_Group =["A+","AB+","AB-","A-"];
var B_Group =["B+","AB+","AB-","B-"];
var AB_Group =["AB+","AB-"];
var AplusGroup =["AB+","A+"];
var BplusGroup =["AB+","B+"];
var OplusGroup =["A+","B+","AB+","O+"];

window.onload=function() {
    startGame();

    window.setInterval(function(){
        crushBloody();
        slideBloody();
        bloodyGenerator();
        incrementAndToggleKey();
    },100)
}


function randomBloody(){
    return bloodies[Math.floor(Math.random() * bloodies.length)];//0-7

}


function startGame(){
    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<columns;c++){
            //<img id="0-0" src="./images/A+.png">
            let tile= document.createElement("img");
            tile.id= r.toString() + "-" + c.toString();
            tile.src ="./images/" + randomBloody() +".png";

            //drag fonctionality
            tile.addEventListener("dragstart", dragStart);//click on bloody, initialieze drag process
            tile.addEventListener("dragover", dragOver); //click on bloody, moving the mouse to drug the bloody
            tile.addEventListener("dragenter", dragEnter);//dragging bloody into another bloody
            tile.addEventListener("dragleave", dragLeave);//leave bloody over another bloody
            tile.addEventListener("drop", dragDrop);      //dropping a bloody over another bloody
            tile.addEventListener("dragend",dragEnd);    //after the drag process complited,we swap bloodies

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function dragStart(){
    //this refers to the tile that was clicked on dragging
    currTile=this;
}

function dragOver(e){
    e.preventDefault();
}

function dragEnter(e){
    e.preventDefault();
}

function dragLeave(){

}

function dragDrop(){
    // this refers to the target tile that was droped on 
    otherTile=this;
}

function dragEnd(){


    if(currTile.src.includes("blank") || otherTile.src.includes("blank")){
        return;
    }


    let currCoords = currTile.id.split("-");//id="0-0" -> ["0" ,"0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    
    let otherCoords =otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);


    let moveLeft= c2 == c-1 && r==r2;
    let moveRight= c2 == c+1 && r==r2;
    
    let moveUp = r2==r-1 && c2==c;
    let moveDown= r2==r+1 && c2==c;

    let isAdjacent= moveLeft || moveRight || moveUp || moveDown;

    if(isAdjacent){
        let currImg =currTile.src;
        let otherImg =otherTile.src;
        currTile.src= otherImg;
        otherTile.src= currImg;


        let validMove = checkValid();
        if(!validMove){
            let currImg =currTile.src;
            let otherImg =otherTile.src;
            currTile.src= otherImg;
            otherTile.src= currImg;
        }
    }
    
}

function crushBloody(){
    // crushFive()
    // crushFour()
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree(){
    //check rows
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns-2;c++){
            let bloody1= board[r][c];
            let bloody2= board[r][c+1];
            let bloody3= board[r][c+2];
            if (bloody1.src==bloody2.src && bloody2.src==bloody3.src && !bloody1.src.includes("blank")){
                bloody1.src="image/blank.png";
                bloody2.src="image/blank.png";
                bloody3.src="image/blank.png";
                score+=30;

            }

        }
    }
    //check columns
    for(let c=0;c<columns;c++){
        for(let r=0;r<rows-2;r++){
            let bloody1= board[r][c];
            let bloody2= board[r+1][c];
            let bloody3= board[r+2][c];
            if (bloody1.src==bloody2.src && bloody2.src==bloody3.src && !bloody1.src.includes("blank")){
                bloody1.src="image/blank.png";
                bloody2.src="image/blank.png";
                bloody3.src="image/blank.png";
                score+=30;
            }

        }
    }
}
function checkValid(){
    //check rows
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns-2;c++){
            let bloody1= board[r][c];
            let bloody2= board[r][c+1];
            let bloody3= board[r][c+2];
            if ((bloody1.src==bloody2.src && bloody2.src==bloody3.src && !bloody1.src.includes("blank"))){
                return true;
            }

        
        }
    }
    //check columns
    for(let c=0;c<columns;c++){
        for(let r=0;r<rows-2;r++){
            let bloody1= board[r][c];
            let bloody2= board[r+1][c];
            let bloody3= board[r+2][c];
            if (bloody1.src==bloody2.src && bloody2.src==bloody3.src && !bloody1.src.includes("blank")){
                return true;
            }

        }
    }
    return false;
}




function slideBloody(){
    for(let c=0;c<columns;c++){
        let ind = rows-1;
        for(let r=columns-1;r>=0;r--){
            if(!board[r][c].src.includes("blank")){
                board[ind][c].src=board[r][c].src;
                ind -=1;

            }
        }

        for(let r= ind;r>=0;r--){
            board[r][c].src="images/blank.png";

        }
    }
}

function bloodyGenerator(){
    for(let c=0; c< columns ;c++){
        if (board[0][c].src.includes("blank")){
            board[0][c].src = "./images/" + randomBloody() +".png";
        }
    }
}


function bloodyCompatibility(){
    for(let c=0;c<columns;c++){
        for(let r=0;r<rows-2;r++){
            let bloody1= board[r][c];
            let bloody2= board[r+1][c];
            let bloody3= board[r+2][c];
            switch(bloody1){
                // "O-" can donate for all groups
                case "images/O-.png":
                    return (bloodies.includes(bloody2) && bloodies.includes(bloody3));
                // "O+" can donate for posetive groups 
                case "images/O+.png":
                    return (OplusGroup.includes(bloody2) && OplusGroup.includes(bloody3));
                // "A+" can donate for himself and "AB+"
                case "images/A+.png":
                    return (AplusGroup.includes(bloody2) && AplusGroup.includes(bloody3));
                // "A-" can donate for himself,"A+","AB-" and "AB+"
                case "images/A-.png":
                    return (A_Group.includes(bloody2) && A_Group.includes(bloody3));
                // "B+" can donate for himself and "AB+"
                case "images/B+.png":
                    return (BplusGroup.includes(bloody2) && BplusGroup.includes(bloody3));
                // "B-" can donate for himself ,"B+" ,"AB-"and "AB+"
                case "images/B-.png":
                    return (B_Group.includes(bloody2) && B_Group.includes(bloody3));
                // "AB-" can donate for himself and "AB+"
                case "images/AB-.png":
                    return (AB_Group.includes(bloody2) && AB_Group.includes(bloody3));
                

                
            }
        }
    }
}

function incrementAndToggleKey() {
    //when he find a compatible goup he will win a key 
    if (bloodyCompatibility()) {
      numberOfKeys+=2;
      document.getElementById("keys").innerText = keys_number.append(keyElement);
      setTimeout(() => {
        keyElement.style.display = "none";
      }, 1000);
    }
  }
  
// after every 5 keys collected he will get a blood information to improve his knowlege 