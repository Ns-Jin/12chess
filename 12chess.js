let one_player_button = document.getElementById("one_player_button");
let two_player_button = document.getElementById("two_player_button");

/*  player: player가 green인지 red인지 확인
    kind: unit의 종류 확인
    sX: 그리기 시작하는 X좌표
    sY: 그리기 시작하는 Y좌표
    size: unit의 사이즈
    move: 움직일 수 있는 방향(1,3,5,6,7,9,11,12시)   */
    let unit = [
        {player: 'green', kind: '將', sX: 0, sY: 0, size: 180, move: [3,6,9,12]},           //sX - 0:300, 1:500, 2:700           [200*sX + 300]
        {player: 'green', kind: '王', sX: 1, sY: 0, size: 180, move: [1,3,5,6,7,9,11,12]},  //sY - 0:0,   1:200, 2:400, 3: 600   [200*sY]
        {player: 'green', kind: '相', sX: 2, sY: 0, size: 180, move: [1,5,7,11]},
        {player: 'green', kind: '子', sX: 1, sY: 1, size: 180, move: [6]},
        {player: 'red', kind: '將', sX: 2, sY: 3, size: 180, move: [3,6,9,12]},
        {player: 'red', kind: '王', sX: 1, sY: 3, size: 180, move: [1,3,5,6,7,9,11,12]},
        {player: 'red', kind: '相', sX: 0, sY: 3, size: 180, move: [1,5,7,11]},
        {player: 'red', kind: '子', sX: 1, sY: 2, size: 180, move: [12]},
        {player: 'green', kind: '後', sX: 0, sY: 0, size: 0, move: [3,5,6,7,9,12]},
        {player: 'red', kind: '後', sX: 0, sY: 0, size: 0, move: [1,3,6,9,11,12]},
    ];

    let board_condition = [[1,1,1],
                           [0,1,0],
                           [0,2,0],        //i:sY, j:sX
                           [2,2,2]];       //1:green 2:red 0:빈칸
    
    let mouseInfo = {
        oX: 0,
        oY: 0,
        checkClick: 0       //2로 나눠을때 나머지가 1일때 클릭(선택)된것, 클릭(선택)됐을때 oX,oY는 고정된다.
    }
    
const board = {
    cv: document.getElementById("game_board"),
    ctx: document.getElementById("game_board").getContext("2d"),

    draw: function() {
        this.cv.width = 1200;
        this.cv.height = 800;
        let ctx = this.ctx;

        ctx.clearRect(0,0,1200,800);   //최신화를 위해 지우고 다시그리기
        // 경기보드
        for(let i=0;i<4;i++) {
            for(let j=0;j<3;j++) {
                if(i === 0) {
                    ctx.fillStyle = '#95E18F';
                }
                else if(i === 3) {
                    ctx.fillStyle = '#EA8684';
                }
                else {
                    ctx.fillStyle = '#EBD57A';
                }
                ctx.beginPath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.rect(300 + 200*j, i*200, 200, 200);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
        
        //green_pocket
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = '#EBD57A';
        ctx.lineWidth = 2;
        ctx.rect(0, 0, 100, 100);
        ctx.rect(100, 0, 100, 100);
        ctx.rect(200, 0, 100, 100);
        ctx.rect(0, 100, 100, 100);
        ctx.rect(100, 100, 100, 100);
        ctx.rect(200, 100, 100, 100);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //red_pocket
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = '#EBD57A';
        ctx.lineWidth = 2;
        ctx.rect(900, 600, 100, 100);
        ctx.rect(1000, 600, 100, 100);
        ctx.rect(1100, 600, 100, 100);
        ctx.rect(900, 700, 100, 100);
        ctx.rect(1000, 700, 100, 100);
        ctx.rect(1100, 700, 100, 100);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //유닛 그리기
        for(let i=0;i<unit.length;i++) {
            let player = unit[i].player;       //플레이어1,2
            let kind = unit[i].kind;           //말 종류
            let size = unit[i].size;           //말 사이즈 (경기장에 있는지 포켓에 있는지 확인 가능)
            let sX = unit[i].sX*200 + 300;               //말 시작 위치(startX)
            let sY = unit[i].sY*200;               //말 시작 위치(startY)
            let move = unit[i].move;           //이동가능(시계로 방향표시)

            if(size === 0) {
                continue;
            }
            ctx.beginPath();
            ctx.strokeStyle = player;
            if(size === 180) {
                ctx.rect(sX+10, sY+10, size, size);
                ctx.font = '150px sans-serif';
                ctx.lineWidth = 5;
            }
            else if(size === 90) {
                ctx.rect(sX+5, sY+5, size, size);
                ctx.font = '75px sans-serif';
                ctx.lineWidth = 3;
            }
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.fillText(kind, sX+parseInt(size*11/80), sY+parseInt(size*11/10*0.775));
            ctx.stroke();
            ctx.closePath();

            //이동가능 구역 표시
            move.forEach((i) => {
                switch(i) {
                    case 1:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/12), sY+parseInt(size*11/100));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/12), sY+parseInt(size*11/100));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/12), sY+parseInt(size*11/100)+parseInt(size/12));
                        ctx.lineTo(sX+parseInt(size*11/12), sY+parseInt(size*11/100));
                        ctx.fill();
                        ctx.closePath();
                        break;
                     case 3:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/12)+parseInt(size/24), sY+parseInt(size*11/20)-parseInt(size/18));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/12), sY+parseInt(size*11/20));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/24), sY+parseInt(size*11/20)+parseInt(size/18));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/24), sY+parseInt(size*11/20)-parseInt(size/18));
                        ctx.fill();
                        ctx.closePath();
                        break;
                     case 5:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/12), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/12), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/12), sY+parseInt(size*99/100)-parseInt(size/12));
                        ctx.lineTo(sX+parseInt(size*11/12), sY+parseInt(size*99/100));
                        ctx.fill();
                        ctx.closePath();
                        break;
                     case 6:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/20)-parseInt(size/18), sY+parseInt(size*99/100)-parseInt(size/24));
                        ctx.lineTo(sX+parseInt(size*11/20)+parseInt(size/18), sY+parseInt(size*99/100)-parseInt(size/24));
                        ctx.lineTo(sX+parseInt(size*11/20), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/20)-parseInt(size/18), sY+parseInt(size*99/100)-parseInt(size/24));
                        ctx.fill();
                        ctx.closePath();
                        break;
                     case 7:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/60), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*99/100)-parseInt(size/12));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/60), sY+parseInt(size*99/100));
                        ctx.fill();
                        ctx.closePath();
                        break;
                     case 9:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/60)-parseInt(size/24), sY+parseInt(size*11/20)-parseInt(size/18));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*11/20));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/24), sY+parseInt(size*11/20)+parseInt(size/18));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/24), sY+parseInt(size*11/20)-parseInt(size/18));
                        ctx.fill();
                        ctx.closePath();
                        break;
                     case 11:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/60), sY+parseInt(size*11/100));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*11/100)+parseInt(size/12));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*11/100));
                        ctx.lineTo(sX+parseInt(size*11/60), sY+parseInt(size*11/100));
                        ctx.fill();
                        ctx.closePath();
                        break;
                     case 12:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/20)-parseInt(size/18), sY+parseInt(size*11/100)+parseInt(size/24));
                        ctx.lineTo(sX+parseInt(size*11/20)+parseInt(size/18), sY+parseInt(size*11/100)+parseInt(size/24));
                        ctx.lineTo(sX+parseInt(size*11/20), sY+parseInt(size*11/100));
                        ctx.lineTo(sX+parseInt(size*11/20)-parseInt(size/18), sY+parseInt(size*11/100)+parseInt(size/24));
                        ctx.fill();
                        ctx.closePath();
                        break;
                }
            });

            //힌트그리기
            let oX = mouseInfo.oX;
            let oY = mouseInfo.oY;
            let click = mouseInfo.checkClick;
            if(click % 2 === 0) {       //클릭(선택)이 안됐을때 선택가능한 말 힌트 표시
                if(size === 180) {     //게임 보드판위에있을때
                    if(oX > sX && oX < sX + 200 && oY > sY && oY < sY + 200) {
                        ctx.beginPath();
                        ctx.fillStyle = '#ffeb3b61'
                        ctx.arc(parseInt(sX/100)*100 + 100, parseInt(sY/100)*100 + 100, 70, 0, Math.PI*2);
                        ctx.fill();
                        ctx.closePath();
                    }
                }
                else if(size === 90) {      //포켓안에 있을때
                    if(oX > sX && oX < sX + 100 && oY > sY && oY < sY + 100) {
                        ctx.beginPath();
                        ctx.fillStyle = '#ffeb3b61'
                        ctx.arc(parseInt(sX/100)*100 + 50, parseInt(sY/100)*100 + 50, 35, 0, Math.PI*2);
                        ctx.fill();
                        ctx.closePath();
                    }
                }
            }
            else {      //클릭(선택)됐을때 선택된 말이 이동가능한구역 힌트 표시
                if(size === 180) {     //게임 보드판위에있을때
                    if(oX > sX && oX < sX + 200 && oY > sY && oY < sY + 200) {
                        move.forEach((i) => {
                            switch(i) {
                                case 1:
                                    if(sX != 700 && sY != 0) {
                                        ctx.beginPath();
                                        ctx.fillStyle = '#ffeb3b61'
                                        ctx.arc(parseInt(sX/100)*100 + 300, parseInt(sY/100)*100 - 100, 70, 0, Math.PI*2);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    break;
                                 case 3:
                                    if(sX != 700) {
                                        ctx.beginPath();
                                        ctx.fillStyle = '#ffeb3b61'
                                        ctx.arc(parseInt(sX/100)*100 + 300, parseInt(sY/100)*100 + 100, 70, 0, Math.PI*2);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    break;
                                 case 5:
                                    if(sX != 700 && sY != 600) {
                                        ctx.beginPath();
                                        ctx.fillStyle = '#ffeb3b61'
                                        ctx.arc(parseInt(sX/100)*100 + 300, parseInt(sY/100)*100 + 300, 70, 0, Math.PI*2);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    break;
                                 case 6:
                                    if(sY != 600) {
                                        ctx.beginPath();
                                        ctx.fillStyle = '#ffeb3b61'
                                        ctx.arc(parseInt(sX/100)*100 + 100, parseInt(sY/100)*100 + 300, 70, 0, Math.PI*2);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    break;
                                 case 7:
                                    if(sX != 300 && sY != 600) {
                                        ctx.beginPath();
                                        ctx.fillStyle = '#ffeb3b61'
                                        ctx.arc(parseInt(sX/100)*100 - 100, parseInt(sY/100)*100 + 300, 70, 0, Math.PI*2);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    break;
                                 case 9:
                                    if(sX != 300) {
                                        ctx.beginPath();
                                        ctx.fillStyle = '#ffeb3b61'
                                        ctx.arc(parseInt(sX/100)*100 - 100, parseInt(sY/100)*100 + 100, 70, 0, Math.PI*2);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    break;
                                 case 11:
                                    if(sX != 300 && sY != 0) {
                                        ctx.beginPath();
                                        ctx.fillStyle = '#ffeb3b61'
                                        ctx.arc(parseInt(sX/100)*100 - 100, parseInt(sY/100)*100 - 100, 70, 0, Math.PI*2);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    break;
                                 case 12:
                                    if(sY != 0) {
                                        ctx.beginPath();
                                        ctx.fillStyle = '#ffeb3b61'
                                        ctx.arc(parseInt(sX/100)*100 + 100, parseInt(sY/100)*100 - 100, 70, 0, Math.PI*2);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    break;
                            }
                        });
                    }
                }
                else if(size === 90) {      //포켓안에 있을때
                
                }
            }
            
            //선택후 이동가능한 영역 표시
        }
    }
    //draw끝
}
function hide_unnecessary_elements() {
    let elements = document.getElementsByClassName("hide");
    for(let i=0; i<elements.length; i++){
        elements[i].style.display="none";
    }
}

function solo_game_start() {
    hide_unnecessary_elements();
    board.cv.addEventListener('mousemove', (e) => {
        if(mouseInfo.checkClick%2 === 0) {
            mouseInfo.oX = e.offsetX;
            mouseInfo.oY = e.offsetY;
            board.draw(unit, mouseInfo);
        }
    });
    board.cv.addEventListener('click', (e) => {
        for(let i=0;i<unit.length;i++) {
            let sX = unit[i].sX*200 + 300;
            let sY = unit[i].sY*200;
            let size = unit[i].size;
            if(e.offsetX > sX && e.offsetX <sX+size*11/10 && e.offsetY >sY && e.offsetY < sY+size*11/10) {
                mouseInfo.checkClick++;
                board.draw(unit, mouseInfo);
            }
        }
    });
    board.draw(unit, mouseInfo);
}

function multi_game_start() {
    hide_unnecessary_elements();
    board.draw(unit, mouseInfo);
}

function show_img_one() {
    let player = document.getElementById("one_player_img");
    player.style.visibility = "visible";
}

function hide_img_one() {
    let player = document.getElementById("one_player_img");
    player.style.visibility = "hidden";
}

function show_img_two() {
    let player = document.getElementById("two_player_img");
    player.style.visibility = "visible";
}

function hide_img_two() {
    let player = document.getElementById("two_player_img");
    player.style.visibility = "hidden";
}

one_player_button.addEventListener("click", solo_game_start);
two_player_button.addEventListener("click", multi_game_start);

one_player_button.addEventListener("mouseover", show_img_one);
one_player_button.addEventListener("mouseout", hide_img_one);
two_player_button.addEventListener("mouseover", show_img_two);
two_player_button.addEventListener("mouseout", hide_img_two);
