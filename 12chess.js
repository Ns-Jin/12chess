let one_player_button = document.getElementById("one_player_button");
let two_player_button = document.getElementById("two_player_button");

/*  player: player가 green인지 red인지 확인
    kind: unit의 종류 확인
    sX: 그리기 시작하는 X좌표
    sY: 그리기 시작하는 Y좌표
    size: unit의 사이즈
    move: 움직일 수 있는 방향(1,3,5,6,7,9,11,12시)   */
let unit = [
    {distinguishable_number: '0',player: 'green', kind: '將', move: [3,6,9,12]},           //sX - 0:300, 1:500, 2:700           [200*sX + 300]
    {distinguishable_number: '1',player: 'green', kind: '王', move: [1,3,5,6,7,9,11,12]},  //sY - 0:0,   1:200, 2:400, 3: 600   [200*sY]
    {distinguishable_number: '2',player: 'green', kind: '相', move: [1,5,7,11]},
    {distinguishable_number: '3',player: 'green', kind: '子', move: [6]},      //後일때 move [3,5,6,7,9,12]
    {distinguishable_number: '7',player: 'red', kind: '將', move: [3,6,9,12]},
    {distinguishable_number: '6',player: 'red', kind: '王', move: [1,3,5,6,7,9,11,12]},
    {distinguishable_number: '5',player: 'red', kind: '相', move: [1,5,7,11]},
    {distinguishable_number: '4',player: 'red', kind: '子', move: [12]},       ////後일때 move [1,3,6,9,11,12]
];

let board_condition = [[-1,-1,-1],
                        [-1,-1,-1],
                        [0,1,2],
                        [-1,3,-1],
                        [-1,4,-1],        //i:sY, j:sX
                        [5,6,7],
                        [-1,-1,-1],
                        [-1,-1,-1]];       //1:green 2:red 0:빈칸

let mouseInfo = {
    oX: 0,
    oY: 0,
    last_oX_oY: [-1,-1],
    checkClick: 0       //2로 나눠을때 나머지가 1일때 클릭(선택)된것, 클릭(선택)됐을때 oX,oY는 고정된다.
}

let turn = 0;  //0:red    1:green

let possible_move = [];

function find_unit_index_form_d(d_num) {
    for(let i=0;i<8;i++) {
        if(d_num == unit[i].distinguishable_number) {
            return i;
        }
    }
    
}

function pocket_push(d_num, player) {
    if(player == 'red') {
        outer: for(let i=6;i<8;i++) {
            for(let j=0;j<3;j++) {
                if(board_condition[i][j] == -1) {
                    board_condition[i][j] = parseInt(d_num);
                    unit[find_unit_index_form_d(d_num)].player = 'red';
                    if(d_num == 3 || d_num == 4){       //子이거나 後일때
                        unit[find_unit_index_form_d(d_num)].move = [12];
                        if(unit[find_unit_index_form_d(d_num)].kind = '後') {
                            unit[find_unit_index_form_d(d_num)].kind = '子';
                        }
                    }
                    break outer;
                }
            }
        }
    }
    else {
        outer: for(let i=0;i<2;i++) {
            for(let j=0;j<3;j++) {
                if(board_condition[i][j] == -1) {
                    board_condition[i][j] = parseInt(d_num);
                    unit[find_unit_index_form_d(d_num)].player = 'green';
                    if(d_num == 3 || d_num == 4){       //子이거나 後일때
                        unit[find_unit_index_form_d(d_num)].move = [6];
                        if(unit[find_unit_index_form_d(d_num)].kind = '後') {
                            unit[find_unit_index_form_d(d_num)].kind = '子';
                        }
                    }
                    break outer;
                }
            }
        }
    }
}

function find_index_from_location(x,y) {
    let i = parseInt(y/200) + 2;
    let j = parseInt((x-300)/200);
    let result = [i,j];

    return result;
}

function find_unit(x,y) {
    let result = [-1,-1,-1];
    if(x != -1 && y != -1) {
        let d_num = board_condition[x][y];
        for(let i=0;i<8;i++) {
            if(unit[i].distinguishable_number == d_num) {
                result[0] = unit[i].player;
                result[1] = unit[i].distinguishable_number;
                result[2] = unit[i].kind;
                break;
            }
        }
    }
    
    return result;
}
function find_empty(player) {
    let result = [];
    if(player == 'red') {
        for(let i=3;i<6;i++) {
            for(let j=0;j<3;j++) {
                if(board_condition[i][j] == -1) {
                    result.push([i,j]);
                }
            }
        }
    }
    else {
        for(let i=2;i<5;i++) {
            for(let j=0;j<3;j++) {
                if(board_condition[i][j] == -1) {
                    result.push([i,j]);
                }
            }
        }
    }

    return result;
}
    
const board = {
    cv: document.getElementById("game_board"),
    ctx: document.getElementById("game_board").getContext("2d"),
    cv2: document.getElementById("hint"),
    ctx2: document.getElementById("hint").getContext("2d"),

    draw: function() {
        this.cv.width = 1200;
        this.cv.height = 800;
        let ctx = this.ctx;
        this.cv2.width = 1200;
        this.cv2.height = 800;
        let ctx2 = this.ctx2;

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

        //유닛 그리기
        for(let i=0;i<unit.length;i++) {
            let d_number = unit[i].distinguishable_number;
                                               //식별번호
            let player = unit[i].player;       //플레이어 색상
            let kind = unit[i].kind;           //말 종류
            let move = unit[i].move;           //이동가능(시계로 방향표시)
            let x = -1;                        //board_condition 배열에서 i
            let y = -1;                        //board_condition 배열에서 j
            let size = 0;                      //말 사이즈
            let sX = -100;                     //보드상 x좌표
            let sY = -100;                     //보드상 y좌표
            for(let j=0;j<8;j++) {
                for(let k=0;k<3;k++) {
                    if(board_condition[j][k] == d_number) {
                        x = j;
                        y = k;
                        break;
                    }
                }
            }
            ctx.beginPath();
            ctx.strokeStyle = player;
            if (x>=2 && x<=5 && y>=0 && y<=2) {    //경기보드안에 있을때
                size = 180;
                sX = (y)*200 + 300;
                sY = (x-2)*200;
                ctx.rect(sX+10, sY+10, size, size);
                ctx.font = '150px sans-serif';
                ctx.lineWidth = 5;
            }
            else {              //포켓에있을때
                size = 90;
                if(player === 'green') {
                    sX = y*100;
                    sY = x*100;
                }
                else {
                    sX = y*100 + 900;
                    sY = x*100;
                }
                ctx.rect(sX+5, sY+5, size, size);
                ctx.font = '75px sans-serif';
                ctx.lineWidth = 3;
            }
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.fillText(kind, sX+parseInt(size*11/80), sY+parseInt(size*11/10*0.775));
            ctx.stroke();

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
                        break;
                     case 3:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/12)+parseInt(size/24), sY+parseInt(size*11/20)-parseInt(size/18));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/12), sY+parseInt(size*11/20));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/24), sY+parseInt(size*11/20)+parseInt(size/18));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/24), sY+parseInt(size*11/20)-parseInt(size/18));
                        ctx.fill();
                        break;
                     case 5:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/12), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/12), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/12)+parseInt(size/12), sY+parseInt(size*99/100)-parseInt(size/12));
                        ctx.lineTo(sX+parseInt(size*11/12), sY+parseInt(size*99/100));
                        ctx.fill();
                        break;
                     case 6:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/20)-parseInt(size/18), sY+parseInt(size*99/100)-parseInt(size/24));
                        ctx.lineTo(sX+parseInt(size*11/20)+parseInt(size/18), sY+parseInt(size*99/100)-parseInt(size/24));
                        ctx.lineTo(sX+parseInt(size*11/20), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/20)-parseInt(size/18), sY+parseInt(size*99/100)-parseInt(size/24));
                        ctx.fill();
                        break;
                     case 7:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/60), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*99/100)-parseInt(size/12));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*99/100));
                        ctx.lineTo(sX+parseInt(size*11/60), sY+parseInt(size*99/100));
                        ctx.fill();
                        break;
                     case 9:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/60)-parseInt(size/24), sY+parseInt(size*11/20)-parseInt(size/18));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*11/20));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/24), sY+parseInt(size*11/20)+parseInt(size/18));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/24), sY+parseInt(size*11/20)-parseInt(size/18));
                        ctx.fill();
                        break;
                     case 11:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/60), sY+parseInt(size*11/100));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*11/100)+parseInt(size/12));
                        ctx.lineTo(sX+parseInt(size*11/60)-parseInt(size/12), sY+parseInt(size*11/100));
                        ctx.lineTo(sX+parseInt(size*11/60), sY+parseInt(size*11/100));
                        ctx.fill();
                        break;
                     case 12:
                        ctx.beginPath();
                        ctx.moveTo(sX+parseInt(size*11/20)-parseInt(size/18), sY+parseInt(size*11/100)+parseInt(size/24));
                        ctx.lineTo(sX+parseInt(size*11/20)+parseInt(size/18), sY+parseInt(size*11/100)+parseInt(size/24));
                        ctx.lineTo(sX+parseInt(size*11/20), sY+parseInt(size*11/100));
                        ctx.lineTo(sX+parseInt(size*11/20)-parseInt(size/18), sY+parseInt(size*11/100)+parseInt(size/24));
                        ctx.fill();
                        break;
                }
            });

            //힌트그리기
            if(turn % 2 == 0) {  //red turn
                let inform = find_unit(x,y);
                let oX = mouseInfo.oX;
                let oY = mouseInfo.oY;
                let click = mouseInfo.checkClick;
                if(click % 2 === 0) {       //클릭(선택)이 안됐을때 선택가능한 말 힌트 표시
                    if(size === 180 && inform[0] == 'red') {     //게임 보드판위에있을때
                        if(oX > sX && oX < sX + 200 && oY > sY && oY < sY + 200) {
                            ctx2.beginPath();
                            ctx2.fillStyle = '#ffeb3b61';
                            ctx2.arc(sX + 100, sY + 100, 70, 0, Math.PI*2);
                            ctx2.fill();
                        }
                    }
                    else if(size === 90 && inform[0] == 'red') {      //포켓안에 있을때
                        if(oX > sX && oX < sX + 100 && oY > sY && oY < sY + 100) {
                            ctx2.beginPath();
                            ctx2.fillStyle = '#ffeb3b61';
                            ctx2.arc(sX + 50, sY + 50, 35, 0, Math.PI*2);
                            ctx2.fill();
                        }
                    }
                }
                else {      //클릭(선택)됐을때 선택된 말이 이동가능한구역 힌트 표시
                    if(size === 180) {     //게임 보드판위에있을때
                        if(oX > sX && oX < sX + 200 && oY > sY && oY < sY + 200 && inform[0] == 'red') {
                            let confirm = [];
                            move.forEach((i) => {
                                switch(i) {
                                    case 1:
                                        if(sX != 700 && sY != 0) {
                                            confirm = find_unit(x-1,y+1);
                                            if(confirm[0] != 'red') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 300, sY - 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x-1,y+1]);
                                            }
                                        }
                                        break;

                                    case 3:
                                        if(sX != 700) {
                                            confirm = find_unit(x,y+1);
                                            if(confirm[0] != 'red') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 300, sY + 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x,y+1]);
                                            }
                                        }
                                        break;

                                    case 5:
                                        if(sX != 700 && sY != 600) {
                                            confirm = find_unit(x+1,y+1);
                                            if(confirm[0] != 'red') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 300, sY + 300, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x+1,y+1]);
                                            }
                                        }
                                        break;

                                    case 6:
                                        if(sY != 600) {
                                            confirm = find_unit(x+1,y);
                                            if(confirm[0] != 'red') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 100, sY + 300, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x+1,y]);
                                            }
                                        }
                                        break;

                                    case 7:
                                        if(sX != 300 && sY != 600) {
                                            confirm = find_unit(x+1,y-1);
                                            if(confirm[0] != 'red') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX - 100, sY + 300, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x+1,y-1]);
                                            }
                                        }
                                        break;

                                    case 9:
                                        if(sX != 300) {
                                            confirm = find_unit(x,y-1);
                                            if(confirm[0] != 'red') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX - 100, sY + 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x,y-1]);
                                            }
                                        }
                                        break;

                                    case 11:
                                        if(sX != 300 && sY != 0) {
                                            confirm = find_unit(x-1,y-1);
                                            if(confirm[0] != 'red') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX - 100, sY - 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x-1,y-1]);
                                            }
                                        }
                                        break;

                                    case 12:
                                        if(sY != 0) {
                                            confirm = find_unit(x-1,y);
                                            if(confirm[0] != 'red') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 100, sY - 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x-1,y]);
                                            }
                                        }
                                        break;

                                }
                            });
                        }
                    }
                    else if(oX >= 900 && oY >= 600) {      //포켓안에 있을때
                        let empty_area = find_empty('red');
                        for(let j=0;j<empty_area.length;j++) {
                            let space = empty_area[j];
                            let tsX = space[1]*200 + 300;
                            let tsY = space[0]*200 - 200;
                            ctx2.beginPath();
                            ctx2.fillStyle = '#ffeb3b61';
                            ctx2.arc(tsX + 100, tsY - 100, 70, 0, Math.PI*2);
                            ctx2.fill();
                            possible_move.push(empty_area[j]);
                        }
                    }
                }
            }

            else {      //green turn
                let inform = find_unit(x,y);
                let oX = mouseInfo.oX;
                let oY = mouseInfo.oY;
                let click = mouseInfo.checkClick;
                if(click % 2 === 0) {       //클릭(선택)이 안됐을때 선택가능한 말 힌트 표시
                    if(size === 180 && inform[0] == 'green') {     //게임 보드판위에있을때
                        if(oX > sX && oX < sX + 200 && oY > sY && oY < sY + 200) {
                            ctx2.beginPath();
                            ctx2.fillStyle = '#ffeb3b61';
                            ctx2.arc(sX + 100, sY + 100, 70, 0, Math.PI*2);
                            ctx2.fill();
                        }
                    }
                    else if(size === 90 && inform[0] == 'green') {      //포켓안에 있을때
                        if(oX > sX && oX < sX + 100 && oY > sY && oY < sY + 100) {
                            ctx2.beginPath();
                            ctx2.fillStyle = '#ffeb3b61';
                            ctx2.arc(sX + 50, sY + 50, 35, 0, Math.PI*2);
                            ctx2.fill();
                        }
                    }
                }
                else {      //클릭(선택)됐을때 선택된 말이 이동가능한구역 힌트 표시
                    if(size === 180) {     //게임 보드판위에있을때
                        if(oX > sX && oX < sX + 200 && oY > sY && oY < sY + 200 && inform[0] == 'green') {
                            let confirm = [];
                            move.forEach((i) => {
                                switch(i) {
                                    case 1:
                                        if(sX != 700 && sY != 0) {
                                            confirm = find_unit(x-1,y+1);
                                            if(confirm[0] != 'green') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 300, sY - 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x-1,y+1]);
                                            }
                                        }
                                        break;

                                    case 3:
                                        if(sX != 700) {
                                            confirm = find_unit(x,y+1);
                                            if(confirm[0] != 'green') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 300, sY + 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x,y+1]);
                                            }
                                        }
                                        break;

                                    case 5:
                                        if(sX != 700 && sY != 600) {
                                            confirm = find_unit(x+1,y+1);
                                            if(confirm[0] != 'green') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 300, sY + 300, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x+1,y+1]);
                                            }
                                        }
                                        break;

                                    case 6:
                                        if(sY != 600) {
                                            confirm = find_unit(x+1,y);
                                            if(confirm[0] != 'green') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 100, sY + 300, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x+1,y]);
                                            }
                                        }
                                        break;

                                    case 7:
                                        if(sX != 300 && sY != 600) {
                                            confirm = find_unit(x+1,y-1);
                                            if(confirm[0] != 'green') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX - 100, sY + 300, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x+1,y-1]);
                                            }
                                        }
                                        break;

                                    case 9:
                                        if(sX != 300) {
                                            confirm = find_unit(x,y-1);
                                            if(confirm[0] != 'green') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX - 100, sY + 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x,y-1]);
                                            }
                                        }
                                        break;

                                    case 11:
                                        if(sX != 300 && sY != 0) {
                                            confirm = find_unit(x-1,y-1);
                                            if(confirm[0] != 'green') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX - 100, sY - 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x-1,y-1]);
                                            }
                                        }
                                        break;

                                    case 12:
                                        if(sY != 0) {
                                            confirm = find_unit(x-1,y);
                                            if(confirm[0] != 'green') {
                                                ctx2.beginPath();
                                                ctx2.fillStyle = '#ffeb3b61';
                                                ctx2.arc(sX + 100, sY - 100, 70, 0, Math.PI*2);
                                                ctx2.fill();
                                                possible_move.push([x-1,y]);
                                            }
                                        }
                                        break;

                                }
                            });
                        }
                    }
                    else if(oX <= 300 && oY <= 200) {      //포켓안에 있을때
                        let empty_area = find_empty('green');
                        for(let j=0;j<empty_area.length;j++) {
                            let = space = empty_area[j];
                            let tsX = space[1]*200 + 300;
                            let tsY = space[0]*200 - 200;
                            ctx2.beginPath();
                            ctx2.fillStyle = '#ffeb3b61';
                            ctx2.arc(tsX + 100, tsY - 100, 70, 0, Math.PI*2);
                            ctx2.fill();
                            possible_move.push(empty_area[j]);
                        }
                    }
                }
            }
            //힌트그리기 끝  

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
    board.draw();
    board.cv2.addEventListener('mousemove', (e) => {
        if(mouseInfo.checkClick%2 === 0) {
            mouseInfo.oX = e.offsetX;
            mouseInfo.oY = e.offsetY;
            board.draw();
        }
    });
    board.cv2.addEventListener('click', (e) => {
        //턴에 따라 선택할수있는거 변동
        if(turn % 2 == 0) {         //레드턴 일때
            let selected_unit_location = [];
            let selected_unit;
            if(mouseInfo.checkClick%2 === 0) {          //말 선택할때
                let sX = -100;
                let sY = -100;
                let size = 0;
                
                for(let i=0;i<unit.length;i++) {
                    let d_number = unit[i].distinguishable_number;
                    if(unit[i].player == 'red') {
                        for(let j=0;j<8;j++) {
                            for(let k=0;k<3;k++) {
                                if(board_condition[j][k] == d_number) {
                                    if (j>=2 && j<=5 && k>=0 && k<=2) {    //경기보드안에 있을때
                                        size = 180;
                                        sX = (k)*200 + 300;
                                        sY = (j-2)*200;
                                    }
                                    else {
                                        size = 90;
                                        if (unit[i].player == 'green') {
                                            sX = k*100;
                                            sY = j*100;
                                        }
                                        else {
                                            sX = k*100 + 900;
                                            sY = j*100;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(e.offsetX > sX && e.offsetX < sX+size*11/10 && e.offsetY > sY && e.offsetY < sY+size*11/10) {
                        mouseInfo.checkClick++;
                        mouseInfo.last_oX_oY[0] = e.offsetX;
                        mouseInfo.last_oX_oY[1] = e.offsetY;
                        board.draw();
                        break;
                    }
                }  
            }
            else {      //말 선택됐을때
                if(e.offsetX >= 300 && e.offsetX <= 900 && e.offsetY >= 0 && e.offsetY <= 800) {
                    mouseInfo.checkClick++;
                    let location = find_index_from_location(mouseInfo.last_oX_oY[0],mouseInfo.last_oX_oY[1]);
                    selected_unit_location.push(location[0]);
                    selected_unit_location.push(location[1]);
                    selected_unit = find_unit(location[0],location[1]);
                    mouseInfo.last_oX_oY[0] = e.offsetX;
                    mouseInfo.last_oX_oY[1] = e.offsetY;
                    let index = find_index_from_location(mouseInfo.last_oX_oY[0], mouseInfo.last_oX_oY[1]);
                    let possible = false;
                    for(let i=0;i<possible_move.length;i++) {
                        let temp = possible_move[i];
                        if(temp[0] == index[0] && temp[1] == index[1]) {
                            possible = true;
                            break;
                        }
                    }
                    if(possible) {
                        board_condition[selected_unit_location[0]][selected_unit_location[1]] = -1;
                        let d_num = board_condition[index[0]][index[1]];
                        if(d_num == -1) {
                            board_condition[index[0]][index[1]] = parseInt(selected_unit[1]);
                        }
                        else {
                            board_condition[index[0]][index[1]] = parseInt(selected_unit[1]);
                            pocket_push(d_num,'red');
                        }
                        possible_move = [];
                        turn++;
                    }
                    board.draw();
                }
            }
        }        //레드 턴일때 끝
        
        else {      //초록 턴일때
            let selected_unit_location = [];
            let selected_unit;
            if(mouseInfo.checkClick%2 === 0) {          //말 선택할때
                let sX = -100;
                let sY = -100;
                let size = 0;
                
                for(let i=0;i<unit.length;i++) {
                    let d_number = unit[i].distinguishable_number;
                    if(unit[i].player == 'green') {
                        for(let j=0;j<8;j++) {
                            for(let k=0;k<3;k++) {
                                if(board_condition[j][k] == d_number) {
                                    if (j>=2 && j<=5 && k>=0 && k<=2) {    //경기보드안에 있을때
                                        size = 180;
                                        sX = (k)*200 + 300;
                                        sY = (j-2)*200;
                                    }
                                    else {
                                        size = 90;
                                        if (unit[i].player == 'green') {
                                            sX = k*100;
                                            sY = j*100;
                                        }
                                        else {
                                            sX = k*100 + 900;
                                            sY = j*100;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(e.offsetX > sX && e.offsetX < sX+size*11/10 && e.offsetY > sY && e.offsetY < sY+size*11/10) {
                        mouseInfo.checkClick++;
                        mouseInfo.last_oX_oY[0] = e.offsetX;
                        mouseInfo.last_oX_oY[1] = e.offsetY;
                        board.draw();
                        break;
                    }
                }  
            }
            else {      //말 선택됐을때
                if(e.offsetX >= 300 && e.offsetX <= 900 && e.offsetY >= 0 && e.offsetY <= 800) {
                    mouseInfo.checkClick++;
                    let location = find_index_from_location(mouseInfo.last_oX_oY[0],mouseInfo.last_oX_oY[1]);
                    selected_unit_location.push(location[0]);
                    selected_unit_location.push(location[1]);
                    selected_unit = find_unit(location[0],location[1]);
                    mouseInfo.last_oX_oY[0] = e.offsetX;
                    mouseInfo.last_oX_oY[1] = e.offsetY;
                    let index = find_index_from_location(mouseInfo.last_oX_oY[0], mouseInfo.last_oX_oY[1]);
                    let possible = false;
                    for(let i=0;i<possible_move.length;i++) {
                        let temp = possible_move[i];
                        if(temp[0] == index[0] && temp[1] == index[1]) {
                            possible = true;
                            break;
                        }
                    }
                    if(possible) {
                        board_condition[selected_unit_location[0]][selected_unit_location[1]] = -1;
                        let d_num = parseInt(board_condition[index[0]][index[1]]);
                        if(d_num == -1) {
                            board_condition[index[0]][index[1]] = parseInt(selected_unit[1]);
                        }
                        else {
                            board_condition[index[0]][index[1]] = parseInt(selected_unit[1]);
                            pocket_push(d_num,'green');
                        }
                        possible_move = [];
                        turn++;
                    }
                    board.draw();
                }
            }
        }   //초록턴일때 끝
        
    });
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
