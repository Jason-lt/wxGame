//
// highladder
//
// Created by guangy on 2016-03-08
// 

scratch.GlobalFuncs = {};

/**
 * 秒转换为时间
 * @param value 秒
 */
scratch.GlobalFuncs.formatTime = function (value) {
	var h = Math.floor(value / 3600);
	var m = Math.floor((value % 3600)/60);
	var s = parseInt(value % 60);

	var mh = h < 10 ? "0" + h : "" + h;
	var ms = m < 10 ? "0" + m : "" + m;
	var ss = s < 10 ? "0" + s : "" + s;

	return mh +  ":" + ms + ":" + ss;
};

scratch.GlobalFuncs.drawGameCanvas = function () {
	var webC = cc._renderContext;
	// webC.enable(webC.SCISSOR_TEST);
	webC.clearColor(183/255, 220/255,181/255, 1);//底部颜色
	webC.clear(webC.COLOR_BUFFER_BIT | webC.DEPTH_BUFFER_BIT);
};

scratch.GlobalFuncs.getBackButtonPositionY = function () {
	var systemTy = ty.UserInfo.systemType;
	var sceneSize = cc.director.getWinSize();
	var reultHeight = 0;
	if (systemTy == ty.UserInfo.SYSTEMTYPE.iphoneOtherType){//其他iPhone
		reultHeight = sceneSize.height/2-49;
	}else if(systemTy == ty.UserInfo.SYSTEMTYPE.iPhoneXType){ //iPhoneX
		reultHeight = sceneSize.height/2-102;
	}else if(systemTy == ty.UserInfo.SYSTEMTYPE.ANDROIDOther){ //cc.sys.OS_ANDROID
		reultHeight = sceneSize.height/2-54;
	}else if(systemTy == ty.UserInfo.SYSTEMTYPE.iPhone7P8PType){ //8p
		reultHeight = sceneSize.height/2-46;
	} else if(systemTy == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85){ //vivo Y85A
		reultHeight = sceneSize.height/2-104;
	}
	return reultHeight;
};
//
// scratch.GlobalFuncs.getOpenData = function (withOutMsg) {
// 	if (!wx.hasOwnProperty('getOpenDataContext')){
// 		if (!withOutMsg){
// 			hall.MsgBoxManager.showToast({title:'您当前版本,不支持排行榜,请升级微信!'});
// 		}
// 		return null;
// 	}
// 	var openDataContext = wx.getOpenDataContext();
// 	if (openDataContext){
// 		return openDataContext
// 	}
// 	return null;
// };
//
// /**
//  * 更新自己的排行榜数据
//  * @param val
//  */
// scratch.GlobalFuncs.upDateRankData = function (val) {
// 	if(!ty.UserInfo.userId){
// 		return;
// 	}
// 	// scratch.gameModel.saveHigherScore(scratch.GameWorld.totalScore);
// 	var openDataContext = scratch.GlobalFuncs.getOpenData(true);
// 	if(!openDataContext){
// 		return;
// 	}
// 	openDataContext.postMessage({
// 		method:'updateRank',
// 		sumScore: val,
// 		userId:ty.UserInfo.userId
// 	})
// };
//
// /**
//  * 更新自己的排行榜星期数据
//  * @param val
//  */
// scratch.GlobalFuncs.upDateRankDataWeek = function (val) {
// 	var openDataContext = scratch.GlobalFuncs.getOpenData(true);
// 	if(!openDataContext){
// 		return;
// 	}
// 	openDataContext.postMessage({
// 		method:'updateRankWeek',
// 		week: val
// 	})
// };
//
// scratch.GlobalFuncs.getUserInfo = function () {
// 	var openDataContext = scratch.GlobalFuncs.getOpenData(true);
// 	if(!openDataContext){
// 		return;
// 	}
// 	openDataContext.postMessage({
// 		method:'getUserInfo'
// 	})
// };
//
// scratch.GlobalFuncs.getFriendInfo = function () {
// 	var openDataContext = scratch.GlobalFuncs.getOpenData(true);
// 	if(!openDataContext){
// 		return;
// 	}
// 	var week = hall.GlobalTimer.getCurWeek();
// 	openDataContext.postMessage({
// 		method:'getFriendInfo',
// 		week : week,
// 		userId : ty.UserInfo.userId,
// 		sumScore : scratch.GameWorld.totalScore
// 	})
// };
//
// scratch.GlobalFuncs.getThirdRankInfo = function () {
// 	var openDataContext = scratch.GlobalFuncs.getOpenData(true);
// 	if(!openDataContext){
// 		return;
// 	}
// 	var week = hall.GlobalTimer.getCurWeek();
// 	openDataContext.postMessage({
// 		method:'getResultRank',
// 		week : week,
// 		userId : ty.UserInfo.userId,
// 		sumScore : scratch.GameWorld.totalScore
// 	})
// };
//
// /**
//  * 获取群排行榜数据
//  * @param val 群shareTicket
//  */
// scratch.GlobalFuncs.showGroupRank = function (val) {
// 	var openDataContext = scratch.GlobalFuncs.getOpenData();
// 	if(!openDataContext){
// 		return;
// 	}
// 	var week = hall.GlobalTimer.getCurWeek();
// 	openDataContext.postMessage({
// 		method:'showGroupRank',
// 		shareTicket: val,
// 		userId:ty.UserInfo.userId,
// 		rankType : "sumScore",
// 		week : week
// 	})
// };
//
// /**
//  * 展示自己的好友排行榜数
//  */
// scratch.GlobalFuncs.showFriendRank = function () {
// 	var openDataContext = scratch.GlobalFuncs.getOpenData();
// 	if(!openDataContext){
// 		return;
// 	}
// 	var week = hall.GlobalTimer.getCurWeek();
// 	openDataContext.postMessage({
// 		method:'showFriendRank',
// 		userId:ty.UserInfo.userId,
// 		rankType : "sumScore",
// 		week : week
// 	})
// };
// /**
//  * 初始化
//  */
// scratch.GlobalFuncs.showOrigin = function () {
// 	var openDataContext = scratch.GlobalFuncs.getOpenData();
// 	if(!openDataContext){
// 		return;
// 	}
// 	openDataContext.postMessage({
// 		method:'showOrigin'
// 	})
// };

scratch.GlobalFuncs.showDropEffect = function (baseScale, pNode) {
	pNode.scale = baseScale * 1.15;
	var seq = cc.sequence(cc.scaleTo(0.1, baseScale * 0.93),cc.scaleTo(0.015, baseScale));
	pNode.runAction(seq);
};

scratch.GlobalFuncs.setToCenter = function (node) {
	var winSize = cc.director.getWinSize();
	node.x = winSize.width/2;
	node.y = winSize.height/2;
};


//展示规则界面
scratch.GlobalFuncs.showRoleTips = function (cardID,type) {
	cc.loader.loadRes('prefabs/roleTips', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('roleTips');
		com.changeInfo(cardID,type);
	}.bind(this));
};
//展示实物兑换主界面
scratch.GlobalFuncs.showChangeMain = function () {
	cc.loader.loadRes('prefabs/scratch_change_main', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};

//展示实物兑换界面
scratch.GlobalFuncs.showChangePanel = function (resultMap) {
	cc.loader.loadRes('prefabs/scratch_change', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('scratch_change');
		com.updateTipsInfo(resultMap);
	}.bind(this));
};
//展示提现记录界面
scratch.GlobalFuncs.showDrawList = function () {
	cc.loader.loadRes('prefabs/scratch_drawList', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示金币礼包界面
scratch.GlobalFuncs.showGoldGift  = function () {
	cc.loader.loadRes('prefabs/scratch_goldGift', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示兑换实物奖励界面
scratch.GlobalFuncs.showChangeInvitePanel  = function (resultMap) {
	cc.loader.loadRes('prefabs/scratch_reward', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('scratch_reward');
		com.updateTipsInfo(resultMap);
	}.bind(this));
};
//展示中奖提示界面
scratch.GlobalFuncs.showWinTips  = function (getReward,resultValue) {
	scratch.AudioHelper.playEffect(scratch.EffectPath_mp3.scratch_getReward);
	cc.loader.loadRes('prefabs/scratch_win', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('scratch_win');
		com.updateTipsInfo(getReward,resultValue);
	}.bind(this));
};
//展示提现成功、兑换成功
scratch.GlobalFuncs.showScratchSuccess  = function (getReward,resultValue) {
	cc.loader.loadRes('prefabs/scratch_successWindow', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('scratch_successWindow');
		com.updateTipsInfo(getReward,resultValue);
	}.bind(this));
};
//展示提现界面
scratch.GlobalFuncs.showWithDraw  = function () {
	cc.loader.loadRes('prefabs/scratch_withDraw', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示转盘界面
scratch.GlobalFuncs.showTurnTable  = function (number,cardID) {
	cc.loader.loadRes('prefabs/scratch_turnTable', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		scratch.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('scratch_turnTable');
		com.setTurnTableNumber(number,cardID);
	}.bind(this));
};
// //展示debug面板
// scratch.GlobalFuncs.showDebugPanel = function () {
// 	cc.loader.loadRes('scratch_prefabs/debugNode', function (err, prefab) {
// 		var preFabNode = cc.instantiate(prefab);
// 		cc.director.getScene().addChild(preFabNode);
// 		scratch.GlobalFuncs.setToCenter(preFabNode);
// 	}.bind(this));
// };