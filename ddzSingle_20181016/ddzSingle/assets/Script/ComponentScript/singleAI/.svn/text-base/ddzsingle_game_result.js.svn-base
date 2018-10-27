/*
  * File : game_result.js
  * Author : WangHp
  * Fucntion : 封装游戏结果相关信息
  * Date : 2015/2/10
*/

// 游戏结果种类
(function() {
	ddz.GameResultKind = {
		Invalid : 'invalid',
		NoWin : 'nowin',
		Lose : 'lose',
		DaManGuan : 'damanguan',
		ChunTian : 'chuntian',
		LianSheng : 'liansheng',
		NormalWin : 'normalwin',
	};
})();

ddz.GameResult = function() {
	var result = ddz.GameResultKind.Invalid;
	var tag = 'ddz.GameResult'; 
	var setResult = function(val) {
		result = val;
	}

	// 返给外部使用的对象
	var gameResultObj = {};
	gameResultObj.reset = function() {
		setResult(ddz.GameResultKind.Invalid);
	}

	// 根据服务器返回的结果判断游戏结果
	/*  result，服务器返回的结果; 
	     bIamDizhu : 当前玩家是不是地主
	     mySeatIndex : 当前玩家座位id
	*/
	gameResultObj.parseResult = function(result, bIamDizhu, mySeatIndex) {
		//游戏结果
		cc.log('parseResult = ' + JSON.stringify(result));
		
		setResult(ddz.GameResultKind.Invalid);
		if (typeof(result) == 'undefined' || result == null) {
			setResult(ddz.GameResultKind.Invalid);
			return;
		}

		// 首先判断是否是流局
		var nowin = result['nowin'];

		if( typeof(nowin) !='undefined' && null!=result && 1==nowin ){
			setResult(ddz.GameResultKind.NoWin);
			return;
		}

		//地主是否胜利？
		var dzwin = result["dizhuwin"];
		var win = (bIamDizhu && dzwin) || (!bIamDizhu && !dzwin);

		//失败
		if (!win) {
			setResult(ddz.GameResultKind.Lose);
			return;
		}

		//大满贯
		if (result['stat']['slam'] == 1) {
			setResult(ddz.GameResultKind.DaManGuan);
		}
		//春天
		else if(result['stat']['chuntian']>1){
			setResult(ddz.GameResultKind.ChunTian);
		}
		//连胜
		else if(result['winStreak'][mySeatIndex-1]>=3){
			setResult(ddz.GameResultKind.LianSheng);
		}
		//普通胜利
		else{
			setResult(ddz.GameResultKind.NormalWin);
		}
	}

	gameResultObj.is = function(val) {
		cc.log('test gameResultObj.is come in result = ' + result + ' val = ' + val);
		return result === val;
	}
	gameResultObj.not = function(val) {
		return result != val;
	}
	gameResultObj.Set = function(val) {
		cc.log('test gameResultObj.Set val = ' + val);
		setResult(val);
	}
	gameResultObj.get = function() {
		return result;
	}
	gameResultObj.isWin = function() {
		return !gameResultObj.is(ddz.GameResultKind.Lose);
	}

	// 获取结算控件
	gameResultObj.getResultController = function(result, parent) {
		cc.log('gameResultObj.getResultController come in 0000');
		// setResult(ddz.GameResultKind.Lose); // for test
		// setResult(ddz.GameResultKind.NormalWin); // for test
		if (gameResultObj.is(ddz.GameResultKind.ChunTian)) {
			//播放春天动画
			return new ddz.PlayChuntianController(result, parent);
		}
		else if (gameResultObj.is(ddz.GameResultKind.Lose)) {
			return new ddz.PlayGameFailedController(result, parent);
		}
		else if (gameResultObj.is(ddz.GameResultKind.NormalWin) || gameResultObj.is(ddz.GameResultKind.DaManGuan) || gameResultObj.is(ddz.GameResultKind.LianSheng)) {
			return new ddz.PlayNormalWinController(result, parent);
		} 
		// 单机里没有nowin
		// else if (gameResultObj.is(ddz.GameResultKind.NoWin)) {
		// 	return new ddz.PlayLiujuController(null, parent);
		// }

		// if (gameResultObj.is(ddz.GameResultKind.Lose)) {
		// 	return new ddz.PlayGameFailedController(result, parent);
		// }
		// else if (gameResultObj.is(ddz.GameResultKind.NormalWin)) {
		// 	return new ddz.PlayNormalWinController(result, parent);
		// }
		// else if (gameResultObj.is(ddz.GameResultKind.DaManGuan) || gameResultObj.is(ddz.GameResultKind.ChunTian) || gameResultObj.is(ddz.GameResultKind.LianSheng)) {
		// 	return new ddz.PlayResultSpecialController(result, parent);
		// }

		return null;
	}

	return gameResultObj;
};
