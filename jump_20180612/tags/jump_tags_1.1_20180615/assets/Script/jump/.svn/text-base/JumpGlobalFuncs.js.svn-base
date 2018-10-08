//
// highladder
//
// Created by guangy on 2016-03-08
// 

jump.GlobalFuncs = {};

/**
 * 秒转换为时间
 * @param value 秒
 */
jump.GlobalFuncs.formatTime = function (value) {
	var h = Math.floor(value / 3600);
	var m = Math.floor((value % 3600)/60);
	var s = parseInt(value % 60);

	var mh = h < 10 ? "0" + h : "" + h;
	var ms = m < 10 ? "0" + m : "" + m;
	var ss = s < 10 ? "0" + s : "" + s;

	return mh +  ":" + ms + ":" + ss;
};

jump.GlobalFuncs.drawGameCanvas = function () {
	var webC = cc._renderContext;
	// webC.enable(webC.SCISSOR_TEST);
	webC.clearColor(183/255, 220/255,181/255, 1);//底部颜色
	webC.clear(webC.COLOR_BUFFER_BIT | webC.DEPTH_BUFFER_BIT);
};

jump.GlobalFuncs.getBackButtonPositionY = function () {
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


jump.GlobalFuncs.getOpenData = function (withOutMsg) {
	if (!wx.hasOwnProperty('getOpenDataContext')){
		if (!withOutMsg){
			hall.MsgBoxManager.showToast({title:'您当前版本,不支持排行榜,请升级微信!'});
		}
		return null;
	}
	var openDataContext = wx.getOpenDataContext();
	if (openDataContext){
		return openDataContext
	}
	return null;
};

/**
 * 更新自己的排行榜数据
 * @param val
 */
jump.GlobalFuncs.upDateRankData = function (val) {
	jump.gameModel.saveHigherScore(jump.gameModel.totalScore);
	var openDataContext = jump.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'updateRank',
		sumScore: val,
		userId:ty.UserInfo.userId
	})
};

jump.GlobalFuncs.getUserInfo = function () {
	var openDataContext = jump.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'getUserInfo'
	})
};

jump.GlobalFuncs.getFriendInfo = function () {
	var openDataContext = jump.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'getFriendInfo'
	})
};

/**
 * 更新自己的群排行榜数据
 * @param val 群shareTicket
 */
jump.GlobalFuncs.showGroupRank = function (val) {
	var openDataContext = jump.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showGroupRank',
		shareTicket: val,
		userId:ty.UserInfo.userId,
		rankType : "sumScore"
	})
};

/**
 * 展示自己的好友排行榜数
 */
jump.GlobalFuncs.showFriendRank = function () {
	var openDataContext = jump.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showFriendRank',
		userId:ty.UserInfo.userId,
		rankType : "sumScore"
	})
};
/**
 * 初始化
 */
jump.GlobalFuncs.showOrigin = function () {
	var openDataContext = jump.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showOrigin'
	})
};

jump.GlobalFuncs.showDropEffect = function (baseScale, pNode) {
	pNode.scale = baseScale * 1.15;
	var seq = cc.sequence(cc.scaleTo(0.1, baseScale * 0.93),cc.scaleTo(0.015, baseScale));
	pNode.runAction(seq);
};

jump.GlobalFuncs.setToCenter = function (node) {
	var winSize = cc.director.getWinSize();
	node.x = winSize.width/2;
	node.y = winSize.height/2;
};
//展示游戏结束是否复活界面
jump.GlobalFuncs.showGameResultResurgence = function () {
	cc.loader.loadRes('prefabs/jump_window_result', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		jump.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示游戏复活倒计时
jump.GlobalFuncs.showGameResurgenceCountDown = function () {
	cc.loader.loadRes('prefabs/countDown', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		jump.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示游戏结束我的成绩界面
jump.GlobalFuncs.showGameOverWithMyScore = function () {
	cc.loader.loadRes('prefabs/jump_result', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		jump.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示互助礼界面
jump.GlobalFuncs.showDiamondGift = function (state,result) {
	cc.loader.loadRes('prefabs/jump_diamond', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		jump.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('jump_diamond');
		com.changeStateWithInfo(state,result);
	}.bind(this));
};
//展示排行榜界面
jump.GlobalFuncs.showRankList = function (shareTicket) {
	if(jump.gameModel.rankWindow){
		var com = jump.gameModel.rankWindow.getComponent('jump_rank');
		com.changeButtonToRank(shareTicket);
	}else {
		cc.loader.loadRes('prefabs/jump_rank_list', function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			jump.gameModel.rankWindow = preFabNode;
			var curScene = cc.director.getScene();
			if(curScene){
				curScene.addChild(preFabNode);
				jump.GlobalFuncs.setToCenter(preFabNode);
				var com = preFabNode.getComponent('jump_rank');
				com.changeButtonToRank(shareTicket);
			}else {

			}
		}.bind(this));
	}
};
//展示提示
jump.GlobalFuncs.showNoDiamondToastTip = function (titleString) {
	cc.loader.loadRes('prefabs/jump_noDiamond_toastTip', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		jump.GlobalFuncs.setToCenter(preFabNode);
		if(titleString){
			var com = preFabNode.getComponent('jump_noDiamond_toastTip');
			com.changeTitle(titleString);
		}
	}.bind(this));
};
//展示好友帮助获得钻石提示
jump.GlobalFuncs.showMainToastWithName = function (name,count,picUrl) {
	var curScene = cc.director.getScene();
	hall.LOGD(this._TAG, "curScene : " + curScene.name);
	if (curScene.name == "jump_main"){
		return;
	}
	cc.loader.loadRes('prefabs/main_toast', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		jump.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('main_toast');
		com.changeName(name,count,picUrl);
	}.bind(this));
};
//展示新手引导面板
jump.GlobalFuncs.showNewTipsPanel = function () {
	cc.loader.loadRes('prefabs/jump_new_tips', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		jump.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};
//展示debug面板
jump.GlobalFuncs.showDebugPanel = function () {
	cc.loader.loadRes('prefabs/debugNode', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		jump.GlobalFuncs.setToCenter(preFabNode);
	}.bind(this));
};