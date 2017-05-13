var board = new Array();
var score = 0;
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
//控制得分音效
var lastScore = 0;
var currentScore = 0;

var getIdEle = function(id){
	return document.getElementById(id);
}

window.onload = function () {
	var bgm = document.getElementById('bgm');
	var bgm2 = document.getElementById('bgm2');
	var slide = document.getElementById('slide');
	var over = document.getElementById('over');
	var showGameOver = document.getElementById('showGameOver');
	var scoreSound = document.getElementById('scoreSound');
	prepareForMobile()
	newgame();
}

function prepareForMobile(){
	//在屏幕比较大时（电脑）不需要做自适应
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}

	var container = getIdEle('grid-container');
	container.style.width = (gridContainerWidth - 2 * cellSpace) + 'px';
	container.style.height = (gridContainerWidth - 2 * cellSpace) + 'px';
	container.style.padding = cellSpace + 'px';
	container.style.borderRadius = (0.02 * gridContainerWidth) + 'px';

	var cells = document.getElementsByClassName('grid-cell');
	for(var i = 0 ; i < cells.length ; i++){
		cells[i].style.width = cellSideLength + 'px';
		cells[i].style.height = cellSideLength + 'px';
		cells[i].style.borderRadius = (0.02 * cellSideLength) + 'px';		
	}

}

function newgame (){
	score = 0;
	updateScore(score);
	bgm.pause();
	bgm2.pause();
	(Math.random() > 0.5) ? bgm.play() : bgm2.play();
	showGameOver.style.zIndex = '-1';
	showGameOver.style.opacity = '0'; 
	document.getElementById('scoreList').style.display = "none";
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i = 0 ; i < 4 ; i++){
		for(var j = 0 ; j < 4 ; j++){
			var gridCell = getIdEle('grid-cell-' + i + '-' + j);
			gridCell.style.top = getPosTop(i,j) + 'px';
			gridCell.style.left = getPosLeft(i,j) + 'px';
		}
	}

	for(var i = 0 ; i<4 ; i++){
		board[i] = new Array();
		for(var j = 0 ; j<4 ; j++){
			board[i][j] = 0;	
		}
	}
	//更新棋盘
	updataBoardView();
}

//更新棋盘
function updataBoardView(){
	var numberCells = document.getElementsByClassName('number-cell');
	//删除所有子节点，注意不能从0开始遍历，这是因为当你把索引为0的子节点删除后那么很自然的原来索引，这样程序运行的结果就是只删除了一半的子节点
	for(var i = numberCells.length - 1 ; i >= 0 ; i--){
		numberCells[i].parentNode.removeChild(numberCells[i]);
		numberCells[i] = null;
	}
	numberCells = null;

	for(var i = 0 ; i<4 ; i++){
		for(var j = 0 ; j<4 ; j++){
			var numberCell = document.createElement('div');
			numberCell.className = 'number-cell';
			numberCell.id = 'number-cell-' + i + '-' + j;
			getIdEle('grid-container').appendChild(numberCell);
			//元素需要重新获取
			var numberCell = getIdEle('number-cell-' + i + '-' + j);
			numberCell.style.transition = '';
			numberCell.style.lineHeight = cellSideLength + 'px';
			numberCell.style.fontSize = (0.6 * cellSideLength) + 'px';

			if(board[i][j] == 0){
				//numberCell
				numberCell.style.width = '0px';
				numberCell.style.height = '0px';
				numberCell.style.opacity = '0';
				numberCell.style.top = getPosTop(i,j) + (cellSideLength/2) + 'px';
				numberCell.style.left = getPosLeft(i,j) + (cellSideLength/2) + 'px';
			}else{
				numberCell.style.width = cellSideLength + 'px';
				numberCell.style.height = cellSideLength + 'px';

				numberCell.style.top = getPosTop(i,j) + 'px';
				numberCell.style.left = getPosLeft(i,j) + 'px';

				numberCell.style.backgroundColor = getNumberBgColor(board[i][j]);
				numberCell.style.color = getNumberColor(board[i][j]);
				numberCell.innerHTML = board[i][j];
			}
		}
	}
}
//生成新数字2或4
function generateOneNumber(){
	if( nospace(board) ){
		return false;
	}
	//随机生成一个位置
	var randx = (Math.random() * 4) >> 0;
	var randy = (Math.random() * 4) >> 0;
	while(true){
		if(board[randx][randy] == 0)
			break;
		randx = (Math.random() * 4) >> 0;
		randy = (Math.random() * 4) >> 0;
	}
	//随机生成一个数字
	var ranNumber = Math.random() < 0.5 ? 2 : 4;
	//在随机位置显示随机数字
	board[randx][randy] = ranNumber;
	//动画
	showNumberWithAnimation(randx,randy,ranNumber);
	return true;
}
//电脑键盘事件
document.onkeydown = function(event){
	//键盘按键代码
	switch(event.keyCode){
		case 37:
			event.preventDefault() ;
			if(moveLeft()){
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()' , 300) ;
			};
			break;
		case 38:
			event.preventDefault() ;
			if(moveUp()){
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()' , 300) ;
			}
			break;
		case 39:
			event.preventDefault() ;
			if(moveRight()){
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()' , 300) ;
			}
			break;
		case 40:
			event.preventDefault() ;
			if(moveDown()){
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()' , 300) ;
			}
			break;
		default:break;
	}
}

//移动端触控事件
document.addEventListener('touchmove',function(event){
	event.preventDefault();
});
document.addEventListener('touchstart',function(event){
	//event.preventDefault();
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});
document.addEventListener('touchend',function(event){
	//event.preventDefault();
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

	var deltaX = endX - startX;
	var deltaY = endY - startY;

	var angle = Math.atan2(deltaY,deltaX);

	if( angle == 0 || deltaX*deltaX + deltaY*deltaY < 0.14*documentWidth*0.14*documentWidth){
		return false;
	}
	else if( ( angle > -(Math.PI / 4) ) && ( angle < (Math.PI / 4) )){
		if(moveRight()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()' , 300) ;
		}
	}else if(( angle > (Math.PI / 4) ) && ( angle < (3 * Math.PI / 4) )){
		if(moveDown()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()' , 300) ;
		}
	}else if(( angle > -(3 * Math.PI / 4) ) && ( angle < -(Math.PI / 4) )){
		if(moveUp()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()' , 300) ;
		}
	}else{
		if(moveLeft()){
			setTimeout('generateOneNumber()',210);
			setTimeout('isgameover()' , 300) ;
		};
	};
});

//检测是否游戏结束
function isgameover(){
	if( nospace(board) && nomove(board) ){
		gameover();
	}
}

//游戏结束动画
function gameover(){
	bgm.pause();
	bgm2.pause();
	over.play();
	// showGameOver.style.display = 'block';
	showGameOver.style.zIndex = '2';
	showGameOver.style.opacity = '1';

	Bmob.initialize("1bec93ff6e8cc6fdb96a3d225a5c8b11", "1f31eecf3cdd2bbdcd28124a0da91b12");

	setTimeout(function(){
		document.getElementById('playerMes').style.display = 'block';

		document.getElementById('submitBtn').onclick = function(){
			if(document.getElementById('player').value === '')	return;
			// showGameOver.style.display = 'none';
			showGameOver.style.opacity = '0';
			showGameOver.style.zIndex = '-5';
			var GameScore = Bmob.Object.extend("GameScore");
			var gameScore = new GameScore();
			gameScore.set("score", score);
			gameScore.set('username', document.getElementById('player').value);
			gameScore.save(null, {
			success: function(object) {
				document.getElementById('playerMes').style.display = 'none';
				var query = new Bmob.Query(GameScore);
				query.limit(10);
				query.descending("score");
				query.find({
					success: function(results){
						// console.log(results);
						var html = ''
						for(var i = 0; i < results.length; i++){
							var mes = results[i].attributes
							html += '<tr><td>  ' + (i+1) + '.</td><td>  ' +  mes.username + '  </td><td>&emsp;' + mes.score +  '</td></tr>';
						}
						// var html = results;
						document.getElementById('scoreList').style.display = 'block';
						document.getElementById('scoreList').querySelector('tbody').innerHTML = html;
					},
					error: function(error){

					}
				})
			},
			error: function(model, error) {
				// alert("create object fail");
			}
			});
		}
	},2500)



}

function moveLeft(){
	if(!canMoveLeft(board))	return false;
	currentScore = 0;
	//移动
	for(var i = 0 ; i<4 ; i++){

		var hasMerge = false;

		for(var j = 1 ; j<4 ; j++){
			if(board[i][j] != 0){
				//遍历这一格A左边的所有格
				for(var k = 0 ; k<j ; k++){
					//左边的某格B为空且B与A之间没有障碍（没有其他的数字）
					if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
						//move
						//动画(i,j)移动到(i,k)
						showMoveAnimation(i , j , i , k) 	;
						//A移动到了B的位置
						board[i][k] = board[i][j];
						board[i][j] = 0;
						//跳出循环
						break;
							//左边的某格B与A的数字是相等的，同时他们之间没有障碍物
					}else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board)){

						if( !hasMerge ){
							//move
							//动画
							showMoveAnimation(i , j , i , k);
							//add，(i,j)中的数字叠加到了(i,k)中的数字
							board[i][k] *= 2;
							board[i][j] = 0;

							hasMerge = true;
							
							score += board[i][k];
							currentScore =  (currentScore < board[i][k]) ?	board[i][k] : currentScore;

							break;
						}else{
							continue;
						}

					}

				}
			}
		}
	}

	updateScore(score);

	setTimeout('updataBoardView()',200); 

	return true;
}

function moveUp(){
	if(!canMoveUp(board))	return false;
	currentScore = 0;
	//移动
	for(var j = 0 ; j<4 ; j++){

		var hasMerge = false;

		for(var i = 1 ; i<4 ; i++){
			if(board[i][j] != 0){
				//遍历这一格A上边的所有格
				for(var k = 0 ; k<i ; k++){
					//上边的某格B为空且B与A之间没有障碍（没有其他的数字）
					if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
						//move
						//动画(i,j)移动到(i,k)
						showMoveAnimation(i , j , k , j) 	;
						//A移动到了B的位置
						board[k][j] = board[i][j];
						board[i][j] = 0;
						//跳出循环
						break;
							//上边的某格B与A的数字是相等的，同时他们之间没有障碍物
					}else if(board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) ){

						if( !hasMerge){
							//move
							//动画
							showMoveAnimation(i , j , k , j);
							//add，(i,j)中的数字叠加到了(i,k)中的数字
							board[k][j] *= 2;
							board[i][j] = 0;

							hasMerge = true;

							score += board[k][j];
							currentScore =  (currentScore < board[k][j]) ?	board[k][j] : currentScore;			
							
							break;
						}else{
							continue;
						}

					}

				}
			}
		}
	}

	updateScore(score);	

	setTimeout('updataBoardView()',200); 

	return true;
}

function moveRight(){
	if(!canMoveRight(board))	return false;
	currentScore = 0;
	//移动
	for(var i = 0 ; i<4 ; i++){

		var hasMerge = false;

		for(var j = 2 ; j>=0 ; j--){
			if(board[i][j] != 0){
				//遍历这一格A上边的所有格
				for(var k = 3 ;  k > j ; k -- ){
					//上边的某格B为空且B与A之间没有障碍（没有其他的数字）
					if(board[i][k] == 0 && noBlockHorizontal( i , j , k ,board)){
						//move
						//动画(i,j)移动到(i,k)
						showMoveAnimation(i , j , i , k ) 	;
						//A移动到了B的位置
						board[i][k] = board[i][j];
						board[i][j] = 0;
						//跳出循环
						break;
							//上边的某格B与A的数字是相等的，同时他们之间没有障碍物
					}else if(board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) ){
						//move
						if( !hasMerge){
							showMoveAnimation(i , j , i , k );
							//add，(i,j)中的数字叠加到了(i,k)中的数字
							board[i][k] *= 2;
							board[i][j] = 0;

							hasMerge = true;

							score += board[i][k];
							currentScore =  (currentScore < board[i][k]) ?	board[i][k] : currentScore;
							
							break;
						}else{
							continue;
						}
						//动画

					}

				}
			}
		}
	}

	updateScore(score);

	setTimeout('updataBoardView()',200); 

	return true;
}

function moveDown(){
	if(!canMoveDown(board))	return false;
	currentScore = 0;
	//移动
	for(var j = 0 ; j<4 ; j++){
		var hasMerge = false;
		for(var i = 2 ; i >= 0 ; i-- ){
			if(board[i][j] != 0){
				//遍历这一格A上边的所有格
				for(var k = 3 ; k > i ; k -- ){
					//上边的某格B为空且B与A之间没有障碍（没有其他的数字）
					if(board[k][j] == 0 && noBlockVertical( j , i , k , board) ){
						//move
						//动画(i,j)移动到(i,k)
						showMoveAnimation(i , j , k , j) 	;
						//A移动到了B的位置
						board[k][j] = board[i][j];
						board[i][j] = 0;
						//跳出循环
						break;
							//上边的某格B与A的数字是相等的，同时他们之间没有障碍物
					}else if(board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) ){
						//move
						if(!hasMerge){
							//动画
							showMoveAnimation(i , j , k , j);
							//add，(i,j)中的数字叠加到了(i,k)中的数字
							board[k][j] *= 2;
							board[i][j] = 0;

							hasMerge = true;

							score += board[k][j];
							currentScore =  (currentScore < board[k][j]) ?	board[k][j] : currentScore;
							
							break;
						}else{
							continue;
						}
						
					}

				}
			}
		}
	}

	updateScore(score);

	setTimeout('updataBoardView()',200); 

	return true;
}




