//
function showNumberWithAnimation(i,j,ranNumber){
	var numberCell = document.getElementById('number-cell-' + i + "-"+ j);

	numberCell.style.transitionProperty = 'opacity,width';
	numberCell.style.transitionDuration = '50ms'; 

	numberCell.style.opacity="1";
	numberCell.style.backgroundColor = getNumberBgColor( ranNumber );
	numberCell.style.color = getNumberColor( ranNumber );
	numberCell.innerHTML = ranNumber;
	numberCell.style.width = cellSideLength + 'px';
	numberCell.style.height = cellSideLength + 'px';
	numberCell.style.top = getPosTop( i , j ) + 'px';
	numberCell.style.left = getPosLeft( i , j ) + 'px';

}

function showMoveAnimation(fromx , fromy , tox , toy){
    var numberCell = document.getElementById('number-cell-' + fromx + '-' + fromy);
    numberCell.style.transition = 'all 200ms';

    numberCell.style.top = getPosTop( tox , toy ) + 'px';
    numberCell.style.left = getPosLeft(tox,toy) + 'px';
    slide.currentTime = 0;
    slide.play();
}

function updateScore(score){
	if( (currentScore > lastScore) && lastScore != 0){
		scoreSound.currentTime = 0;
		scoreSound.play();
	}	
	document.getElementById('score').innerHTML = score;
	lastScore = currentScore;
}

