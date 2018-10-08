//
// ddz_global.js
// highladder
//
// Created by guangy on 2016-03-08
// 
//斗地主global

ddz.GlobalFuncs = {};

ddz.GlobalFuncs.SortCardFunc = function(c1, c2) {
	var info1 = c1._info;
	var info2 = c2._info;

	if (info1._type < info2._type){
		return 1;
	}
	else if (info1._type >info2._type){
		return -1
	}
	else{
		if (info1._value < info2._value) {
			return 1;
		} else if (info1._value > info2._value) {
			return -1
		}
		else{
			return info2._color - info1._color;
		}
	}
};
ddz.GlobalFuncs.SortCardFuncForInfo = function(c1, c2) {
	var info1 = c1;
	var info2 = c2;

	if (info1._type < info2._type){
		return 1;
	}
	else if (info1._type >info2._type){
		return -1
	}
	else{
		if (info1._value < info2._value) {
			return 1;
		} else if (info1._value > info2._value) {
			return -1
		}
		else{
			return info2._color - info1._color;
		}
	}
};
/**
 * 按牌的point排序
 * @param  {[type]} o1 [description]
 * @param  {[type]} o2 [description]
 * @return {[type]}    [description]
 */
ddz.GlobalFuncs._sortByPoint = function (o1, o2) {
	return o1.point - o2.point;
};

ddz.GlobalFuncs.GetNextIndex = function(index, totalnum) {
	if (typeof(totalnum) == "undefined") {
		return index % 3 + 1;
	}
	return index % totalnum + 1;
};

ddz.GlobalFuncs.getPreIndex = function(index, totalnum) {
	if (typeof(totalnum) == 'undefined') {
		return index == 1 ? 3 : index - 1;
	}
	return index == 1 ? totalnum : index - 1;
};

ddz.GlobalFuncs.getTopIndex = function  (index,totalnum) {
	if (typeof(totalnum) == 'undefined') {
		return index == 1 ? 2 : 1;
	}
	return index == 1 ? 2 : 1;
};

ddz.GlobalFuncs.getMyIndex = function  (index, totalnum) {
	if (typeof(totalnum) == 'undefined') {
		return index%2+1;
	}
	return index%totalnum +1;
};

ddz.GlobalFuncs.GetCardsOriginInterval = function(container, cardWidth, iNum) {
	var cardsLayerWidth = container.getBoundingBox().width;
	//被挡扑克牌最多允许显示0.5宽度，所以当这个最大宽度小于容器宽度时，必须按最大显示且有偏移， 否则按容器百分比显示
	var maxlen = cardWidth * (iNum - 1) * ddz.CARD_MAX_INTERVAL + cardWidth;
	var origin, interval;
	//指分行的位置，默认应该是个极大值，表示不分行
	var breakline = 10;
	if (maxlen > cardsLayerWidth) {
		// hall.LOGW('global', "poker more than need");
		origin = 0;
		interval = (cardsLayerWidth - cardWidth) / (iNum - 1);
		var minlen = cardWidth * (iNum - 1) * ddz.CARD_MIN_INTERVAL + cardWidth;
		if (minlen > cardsLayerWidth) {
			breakline = Math.ceil((cardsLayerWidth - cardWidth) / (cardWidth * ddz.CARD_MIN_INTERVAL));
			interval = (cardsLayerWidth - cardWidth) / (breakline - 1);
		}

	} else {
		//这里初始位置设定为0.2, 有必要写入global中
		origin = (cardsLayerWidth - maxlen) / 2;
		interval = ddz.CARD_MAX_INTERVAL * cardWidth;
		// hall.LOGW('global', "origin : " + origin + "  interval : " + interval);
	}

	return {
		"origin": origin,
		"interval": interval,
		"breakline": breakline
	};
};

/**
 *
 * @param num
 * @returns {number}
 * @constructor
 */
ddz.GlobalFuncs.numberToPoint = function(num) {
	var point = num % 13;
	if (num == 52 || num == 53) {
		point = num % 13 + 13;
	}
	if (num > 53) { // 癞子牌
		point = num - 54;
	}
	return point;
};

/**
 * 根据牌序号获取牌权重值
 * @param num 牌序号
 * @returns {number} 权重值
 */
ddz.GlobalFuncs.numberToValue = function(num) {
	var point = this.numberToPoint(num);
	return this.pointToValue(point);
	// if (num < 0) {
	// 	hall.LOGW('global', "error, num < 0 in ddz.GlobalFuncs.numberToValue!!");
	// 	return -1;
	// }
	// if (num > 53) {
	// 	return 15; //癞子牌
	// } else if (num == 53) { //大王
	// 	return 14;
	// } else if (num == 52) { //小王
	// 	return 13;
	// } else {
	// 	var point = num % 13 + 1;
	// 	if (point < 3) { // A = 11, 2 = 12
	// 		return point + 10;
	// 	} else {
	// 		return point - 3; // 3 = 0, 4 = 1...
	// 	}
	// }
	// return -1;
};

/**
 * 根据牌点数获取牌权重值
 * @param point 牌点数
 * @returns {*} 牌权重值
 */
ddz.GlobalFuncs.pointToValue = function(point) {
	if (point == -1) {
		return -1
	} else if (point <= 12) {
		return (point - 2 + 13) % 13
	} else {
		return point
	}
};

/**
 * 权重转点数
 * @param value 权重
 * @returns {*}
 */
ddz.GlobalFuncs.valueToPoint = function(value){
	if (value == -1) {
		return -1
	} else if (value <= 12) {
		return (value + 2) % 13
	} else {
		return value
	}
};


// ddz.GlobalFuncs.getLaiziNumByValue = function(value) { //获得需要转换成相应value的癞子number，例如癞子牌当做5打出，则value = 2
// 	if (value >= 0 && value < 11) {
// 		return 56 + value;
// 	} else if (value < 13) {
// 		return 43 + value;
// 	} else {
// 		hall.LOGW('global', "error! value should not larger than 12");
// 	}
// };

ddz.GlobalFuncs.getLaiziNumByValue = function(value) {
	var point = this.valueToPoint(value);
	return this.getLaiziNumByPoint(point);
};

ddz.GlobalFuncs.getLaiziNumByPoint = function(point) {
	return point + 54;
};

ddz.GlobalFuncs.canShowTag = function (breakline, len, index) {
	return index == len - 1 || (index + 1) % breakline  == 0;
};

ddz.GlobalFuncs.setToCenter = function (node) {
	var winSize = cc.director.getWinSize();
	node.x = winSize.width/2;
	node.y = winSize.height/2;
};

/**
 * 秒转换为时间
 * @param value 秒
 */
ddz.GlobalFuncs.formatTime = function (value) {
	var h = Math.floor(value / 3600);
	var m = Math.floor((value % 3600)/60);
	var s = parseInt(value % 60);

	var mh = h < 10 ? "0" + h : "" + h;
	var ms = m < 10 ? "0" + m : "" + m;
	var ss = s < 10 ? "0" + s : "" + s;

	return mh +  ":" + ms + ":" + ss;
};

ddz.GlobalFuncs.drawGameCanvas = function () {
	var webC = cc._renderContext;
	// webC.enable(webC.SCISSOR_TEST);
	webC.clearColor(183/255, 220/255,181/255, 1);//底部颜色
	webC.clear(webC.COLOR_BUFFER_BIT | webC.DEPTH_BUFFER_BIT);
};

// ddz.GlobalFuncs.getWindowWidthscaling = function () {
// 	var winSize = cc.director.getWinSize();
// 	return winSize.width/640;
// };

ddz.GlobalFuncs.getBackButtonPositionY = function () {
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


ddz.GlobalFuncs.getOpenData = function (update) {
	var wechatTypeA = ty.UserInfo.wechatType.split(".");
	if(wechatTypeA[1] && wechatTypeA[1]< 6){
		if(!update){
			hall.MsgBoxManager.showToast({"title":ddz.GameWorld.weChatVersionTips});
		}
		return null;
	}else {
		if(wechatTypeA[1] && wechatTypeA[1] == 6 &&wechatTypeA[2] && wechatTypeA[2] < 2){
			if(!update){
				hall.MsgBoxManager.showToast({"title":ddz.GameWorld.weChatVersionTips});
			}
			return null;
		}
	}
	if (wx.hasOwnProperty('getOpenDataContext')){
		var openDataContext = wx.getOpenDataContext();
		if (openDataContext){
			return openDataContext
		}
	}

	return null;
};

/**
 * 更新自己的排行榜数据
 * @param val
 */
ddz.GlobalFuncs.upDateRankData = function (val) {
	var openDataContext = ddz.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'updateRank',
		sumReward: val,
		userId:ty.UserInfo.userId
	})
};
ddz.GlobalFuncs.upDateRankDataChip = function (val) {
	var openDataContext = ddz.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'updateRankChip',
		chip: val,
		userId:ty.UserInfo.userId
	})
};
ddz.GlobalFuncs.getUserInfo = function () {
	var openDataContext = ddz.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'getUserInfo'
	})
};

/**
 * 获取同玩好友的uid数组
 */
ddz.GlobalFuncs.getFriendUserIds = function () {
	var openDataContext = ddz.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}

	var getFriendUidCallBack = function () {
		var openDataContext = wx.getOpenDataContext();
		var sharedCanvas = openDataContext.canvas;
		var context = sharedCanvas.getContext("2d");
		if (context.hasOwnProperty('friendUids')) {
			ty.Timer.cancelTimer(cc.director, getFriendUidCallBack);
			ty.UserInfo.FriendUids = context['friendUids'];
			var myUserIdIndex = ty.UserInfo.FriendUids.indexOf(ty.UserInfo.userId);
			if (myUserIdIndex > -1){//从好友列表中,删除自己的ID
				ty.UserInfo.FriendUids.splice(myUserIdIndex, 1);
			}
			ddz.LOGD('ddz.GlobalFuncs.getFriendUserIds', JSON.stringify(ty.UserInfo.FriendUids));
			delete context['friendUids'];
		}
	};

	ty.Timer.setTimer(cc.director, getFriendUidCallBack, 1/30);
	openDataContext.postMessage({
		method:'getFriendUserIds'
	})
};

/**
 * 更新自己的群排行榜数据
 * @param val 群shareTicket
 */
ddz.GlobalFuncs.showGroupRank = function (val,rankType) {
	var nowWeek = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_RANK_WEEK, "");
	var openDataContext = ddz.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showGroupRank',
		shareTicket: val,
		week:nowWeek,
		userId:ty.UserInfo.userId,
		rankType : rankType
	})
};

/**
 * 更新自己的好友排行榜数
 */
ddz.GlobalFuncs.showFriendRank = function (shareTicket,rankType) {
	var nowWeek = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_RANK_WEEK, "");
	var openDataContext = ddz.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showFriendRank',
		week:nowWeek,
		userId:ty.UserInfo.userId,
		rankType : rankType
	})
};
/**
 * 初始化
 */
ddz.GlobalFuncs.showOrigin = function () {
	var openDataContext = ddz.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showOrigin'
	})
};

ddz.GlobalFuncs.playZuanShi = function (isShowTips,manager,rewardNumber,isChip,isHongbao,isJiPaiQi) {
	hall.LOGW("=="," file = [DdzGlobalFuncs] fun = [playZuanShi] isShowTips = " + isShowTips);
	cc.loader.loadRes('prefabs/zuanshi/zuanshi', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('ddz_zuanShiAni');
		com.parentScene = manager;
		if(rewardNumber){
			com.setCountWithNumber(rewardNumber);
		}

		if(!isChip){
			var ani = preFabNode.getComponent(cc.Animation);
			var clipName = ani.getClips()[0].name;
			var anim = ani.getAnimationState(clipName);
			com.setTipsRichText(isShowTips);
			anim.once("finished", function () {
			});
			anim.play();
		}else {
			if (isHongbao) {
				com.changeDiamondToHongbao();
			}else {
				if (isJiPaiQi) {
					com.changeDiamondToJiPaiQi();
				}else {
					com.changeDiamondToChip();
				}
			}

		}
	}.bind(this));
};

ddz.GlobalFuncs.playMultiReward = function (coinNum,diamondNum,jipaiqiNum) {
	cc.loader.loadRes('prefabs/ddz_multiReward', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('multiReward');
		if(coinNum){
			com.setCoinLable(coinNum);
		}
		if(diamondNum){
			com.setDiamondLabel(diamondNum);
		}
		if(jipaiqiNum){
			com.setJiPaiQiLabel(jipaiqiNum);
		}

	}.bind(this));
};


ddz.GlobalFuncs.playZuanShiBox = function (_count,isType) {
	hall.LOGW("","file = [DdzGlobalFuncs] fun = [playZuanShiBox] _count = " + _count);
    if (ddz.zuanshiBoxCom) {
        ddz.zuanshiBoxCom.setZuanshiNnm(_count,isType);
        return
    }
	cc.loader.loadRes('prefabs/ddz_zuanshiBox', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		if (preFabNode) {
			cc.director.getScene().addChild(preFabNode,22222);
			// ddz.GlobalFuncs.setToCenter(preFabNode);
            ddz.zuanshiBoxCom = preFabNode.getComponent('ddz_zuanshiBox');
            if (ddz.zuanshiBoxCom) {
                ddz.zuanshiBoxCom.setZuanshiNnm(_count,isType);
            }
		}else {
			hall.LOGW("","file = [DdzGlobalFuncs] fun = [playZuanShiBox] preFabNode = null");
		}
	}.bind(this));
};

ddz.GlobalFuncs.showWindowTipsForFriend = function (callBack) {
	var preFabPath = "prefabs/ddz_window_tips";
	var comName = "ddz_tipsWindow";
	if(ddz.friendModel.tipsWindow){
		hall.LOGW("==ddz.friendModel.tipsWindow==","======ddz.friendModel.tipsWindow======");
		cc.director.getScene().addChild(ddz.friendModel.tipsWindow);
		callBack(ddz.friendModel.tipsWindow,comName);
		var animation = ddz.friendModel.tipsWindow.getComponent(cc.Animation);
		var anim1 = animation.getAnimationState('tipsWindowNode');
		anim1.play();
	}else {
		hall.LOGW("===","======!!!!ddz.friendModel.tipsWindow======");
		cc.loader.loadRes(preFabPath, function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			ddz.friendModel.tipsWindow = preFabNode;
			cc.director.getScene().addChild(preFabNode);
			ddz.GlobalFuncs.setToCenter(preFabNode);
			callBack(preFabNode,comName);
		});
	}
};

ddz.GlobalFuncs.playShareZuanShi = function (rewardNumber,tips,strRich) {
	hall.LOGW("=="," file = [DdzGlobalFuncs] fun = [playShareZuanShi] rewardNumber = " + rewardNumber);
	if(ddz.tipsNode){
		ddz.tipsNode.removeFromParent();
		ddz.tipsNode = null;
	}
	cc.loader.loadRes('prefabs/conversionSuccess', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		if (ddz.tipsNode) {
			ddz.tipsNode.removeFromParent();
			ddz.tipsNode = null;
		}
		ddz.tipsNode = preFabNode;
		var winSize = cc.director.getWinSize();
		preFabNode.x = winSize.width/2;
		preFabNode.y = winSize.height/2 + 103;

		var com = preFabNode.getComponent('conversionSuccess');
		com.updateDiamondCount(rewardNumber);
		
		if (tips) {
			com.updateTipsText(tips);
		}
		if (strRich) {
			com.updateCoinText(strRich);
		}

	}.bind(this));
};
//
// /**
//  * 检查是否为当天第一次失败
//  * @returns {boolean}
//  */
// ddz.GlobalFuncs.checkFirstFail = function () {
//
// 	var lastFailDate = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_FAIL_DATE, "");
// 	var curDate = hall.GlobalTimer.getCurDay();
// 	if (lastFailDate != curDate){
// 		hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_FAIL_DATE, curDate);
// 		return true;
// 	}
// 	return false;
// };
//
/**
 * 检查某个比赛当天失败的次数
 * @returns {int}
 */
ddz.GlobalFuncs.checkFailCount = function (matchName) {
	ddz.matchModel.canShowMatchRevivalPanel = false;
	// FAIL_NUMBER_LIST
	var lastFailDate = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_FAIL_DATE, "");
	var curDate = hall.GlobalTimer.getCurDay();
	var countString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.FAIL_NUMBER_LIST, "");
	var countDic = {};
	if(countString != ""){
		countDic = JSON.parse(countString);
	}
	if (lastFailDate != curDate){
		countDic = {};
		hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_FAIL_DATE, curDate);
		countDic[matchName] = 1;
		hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.FAIL_NUMBER_LIST, JSON.stringify(countDic));
		if(matchName == "arena"){
			ddz.gameModel.setTempDataWithArenaFailTime(1);
		}else {
			ddz.gameModel.setTempDataWithMatchFailTime(1);
		}
		hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.FAIL_NUMBER_LIST, JSON.stringify(countDic));
		return 1;
	}
	if(!countDic[matchName]){
		countDic[matchName] = 1;
		hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.FAIL_NUMBER_LIST, JSON.stringify(countDic));
		if(matchName == "arena"){
			ddz.gameModel.setTempDataWithArenaFailTime(1);
		}else {
			ddz.gameModel.setTempDataWithMatchFailTime(1);
		}
		hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.FAIL_NUMBER_LIST, JSON.stringify(countDic));
		return 1;
	}
	var nowNumber = parseInt(countDic[matchName]);
	nowNumber += 1;
	countDic[matchName] = nowNumber;
	if(matchName == "arena"){
		ddz.gameModel.setTempDataWithArenaFailTime(nowNumber);
	}else {
		ddz.gameModel.setTempDataWithMatchFailTime(nowNumber);
	}
	hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.FAIL_NUMBER_LIST, JSON.stringify(countDic));
	return nowNumber;
};

ddz.GlobalFuncs.getFailCondition = function (matchName,failCount) {
	var config = ddz.gameModel.resurgenceConfig;
	if(!config){
		return null;
		// config = ddz.Share.resurgenceConfig;
	}
	var matchConfig;
	var curWait = ddz.matchModel.getCurWaitInfo();
	if (config.hasOwnProperty('cityConfig')){

		var cityConfig = config.cityConfig;

		matchConfig = cityConfig.fightMatch;
		if(matchName == "arena"){
			matchConfig = cityConfig.arenaMatch;
			if (cityConfig.hasOwnProperty('arenaMatchNew') && curWait){
				matchConfig = cityConfig.arenaMatchNew[curWait.matchId];
			}
		}

		//新老配置兼容,有新配置,取新配置
		matchConfig = ty.UserInfo.isInBSGS ? matchConfig['bsgsCity'] : matchConfig['otherCity']; //以特征为标准取值
	}
	else{
		matchConfig = config.fightMatch;
		if(matchName == "arena"){
			matchConfig = config.arenaMatch;
		}
	}

	var userConfig;
	if(curWait){
		var isNewUser = curWait.newUserProtect == 1;
		if(isNewUser){
			userConfig = matchConfig.newUser;
		}else {
			userConfig = matchConfig.oldUser;
		}
		var stageIndex = curWait.stageIndex;
		for (var i = 0 ; i < userConfig.length ; i ++){
			var configDic = userConfig[i];
			if(stageIndex <= configDic.stageIndexMax && stageIndex >= configDic.stageIndexMin){
				var failCondition = configDic.failCondition;
				for (var j = 0 ; j < failCondition.length ; j ++){
					var failDic = failCondition[j];
					if(failCount >= failDic.failCountMin && failCount <= failDic.failCountMax){
						ddz.matchModel.revivalShareKey = matchName;
						//修改看次数
						failDic.resurgenceCondition.requestCount =  ddz.gameModel.getFightMatchAdConfigJson(stageIndex, ty.UserInfo.tgCount, failCount, isNewUser);
						return failDic;
					}
				}
			}
		}
	}
	return null;
};

ddz.GlobalFuncs.showArenaReviveWindow = function (arenaMatchDes, stageIndex) {
	var preFabPath = "prefabs/ddz_window_revive";
	var  comName = "ddz_window_revive";
	hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		window.setMatchInfo(arenaMatchDes, stageIndex);
	});
};

ddz.GlobalFuncs.showRevivalWindow = function (failCondition,matchName) {

	// if (failCondition.resurgenceCondition.conditionType == "ad" && !hall.adManager.canPlay)
	// {
	// 	//当前复活是用广告方式,要检查广告是否播放成功,如果无可播放广告,不再弹出此窗口,让玩家使用钻石复活
	// 	return;
	// }

	var preFabPath = "prefabs/ddz_window_revival";
	var  comName = "ddz_revivalWindow";
	if(ddz.matchRevivalPanel){
		ddz.matchRevivalPanel.setContentWithFailCondition(failCondition,matchName);
		// var animation = ddz.matchRevivalPanel.getComponent(cc.Animation);
		// animation.play('tipsWindowNode');
		return;
	}
	hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		ddz.matchRevivalPanel = window;
		window.setContentWithFailCondition(failCondition,matchName);
	});
};

//不能观看激励广告时使用banner广告
ddz.GlobalFuncs.showBannerResurgenceWindow = function () {
	var preFabPath = "prefabs/match/ddz_bannerResurgence";
	var  comName = "ddz_bannerResurgence";
	if(ddz.bannerResurgenceWindow){
		return;
	}
	hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		ddz.bannerResurgenceWindow = window;
	});
};


ddz.GlobalFuncs.showShareGuideWindow = function (isWin,chipNumber,multiple,adsCounts) {

	var preFabPath = "prefabs/ddz_window_revival";
	var  comName = "ddz_revivalWindow";
	if(ddz.matchRevivalPanel){
		ddz.matchRevivalPanel.setRewardAndCompersation(isWin,chipNumber,multiple,adsCounts);
		return
	}
	hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		window.setRewardAndCompersation(isWin,chipNumber,multiple,adsCounts);
		ddz.matchRevivalPanel = window;
	});
};

ddz.GlobalFuncs.showTipsWindowWithString = function (widthTips,buttonS) {
	var preFabPath = "prefabs/ddz_window_normal";
	var  comName = "ddz_window_normal";
	hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);

		var tiString = "邀请好友";
		if(buttonS){
			tiString = buttonS;
		}
		window.setTitleContentAndButtonsString("提示",widthTips,[{title:tiString,callFunc : function () {
		}}]);
	});
};

// 钻石不足
ddz.GlobalFuncs.showDiamondInsufficient = function (widthTips,buttonS) {
	var preFabPath = "prefabs/ddz_window_normal";
	var  comName = "ddz_window_normal";
	hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		var tiString = "邀请好友";
		if(buttonS){
			tiString = buttonS;
		}
		window.setTitleContentAndButtonsString("提示",widthTips,[{title:tiString,callFunc : function () {
			var shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondHall;
			ddz.Share.shareWithType(shareType);
		}}]);
	});
};


ddz.GlobalFuncs.showNormalTipsWindow = function (widthTips,buttons,title) {
	var preFabPath = "prefabs/ddz_window_normal";
	var  comName = "ddz_window_normal";
	if(ddz.gameModel.normalWindow){
		var window = ddz.gameModel.normalWindow.getComponent(comName);
		var _title = "提示";
		if(title){
			_title = title;
		}
		window.setTitleContentAndButtonsString(_title,widthTips,buttons);
		var animation = ddz.gameModel.normalWindow.getComponent(cc.Animation);
		var anim1 = animation.getAnimationState('tipsWindowNode');
		anim1.play();
		return;
	}
	hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		ddz.gameModel.normalWindow = preFabNode;
		var _title = "提示";
		if(title){
			_title = title;
		}
		window.setTitleContentAndButtonsString(_title,widthTips,buttons);
		// [{title:确定"",callFunc : function () {}}]
	});
};

ddz.GlobalFuncs.showDropEffect = function (baseScale, pNode) {
	pNode.scale = baseScale * 1.15;
	var seq = cc.sequence(cc.scaleTo(0.1, baseScale * 0.93),cc.scaleTo(0.015, baseScale));
	pNode.runAction(seq);
};

//banner关闭按钮
ddz.GlobalFuncs.onBannerCloseBtn = function (posx, posy) {
	if (ddz.bannerCloseBtn) {
		return
	}
	cc.loader.loadRes('prefabs/ddz_banner_close', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		preFabNode.x = posx;
		preFabNode.y = posy;
		cc.director.getScene().addChild(preFabNode);

		ddz.bannerCloseBtn = preFabNode.getComponent('ddz_banner_close');
		ddz.bannerCloseBtn.updatePos(posx, posy);
	}.bind(this));
};

ddz.GlobalFuncs.showShareMomentsItem = function (type,data) {
	ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, ["shareMoments",type]);

	cc.loader.loadRes('prefabs/ddz_item_shareMoments', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);

		var com = preFabNode.getComponent('ddz_item_shareMoments');
		com.setShareImageType(type,data);
	}.bind(this));
};
//检测当前今日登陆可领取的钻石数量
ddz.GlobalFuncs.setDayLoginRewardCount = function () {
	ddz.gameModel.dayLoginCount = 0;
	var day = hall.GlobalTimer.getCurDay();
	var nowHour = hall.GlobalTimer.getCurHours();
	if(nowHour < 10){
		ddz.GlobalFuncs.setTodayLoginRewardDic(day);
		return 0;
	}
	var lastGetStateString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME, "");
	if(lastGetStateString == "" || lastGetStateString.indexOf("{") < 0){
		ddz.GlobalFuncs.setTodayLoginRewardDic(day);
		return 1;
	}
	var lastGetStateDic = JSON.parse(lastGetStateString);
	if(!lastGetStateDic[day]){
		ddz.GlobalFuncs.setTodayLoginRewardDic(day);
		return 1;
	}
	var dayGetList = lastGetStateDic[day];
	ddz.gameModel.dayLoginCount = dayGetList.length;
	if(dayGetList.length == 0){
		return 1;
	}
	var lastGetHour = dayGetList[dayGetList.length-1];
	if(lastGetHour < 18){
		if(nowHour < 18){
			return -1;
		}else {
			return 1;
		}
	}else {
		return -1;
	}
};
ddz.GlobalFuncs.setTodayLoginRewardDic = function (day) {
	var nowDic = {};
	nowDic[day] = [];
	hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME,JSON.stringify(nowDic));
};

ddz.GlobalFuncs.removeMatchResultPanel = function (com) {
	requestAnimationFrame(function () {
		ty.NotificationCenter.trigger(ddz.EventType.REMOVE_ALL_MATCH_RESULT_PANEL, com);
	})
};

ddz.GlobalFuncs.isFristGetReward = function () {
	var lastDate = hall.GlobalFuncs.ReadStringFromLocalStorage(hall.LAST_GET_REWARD_DAY, "");
	var curDay = hall.GlobalTimer.getCurDay();
	if (lastDate != curDay){
		hall.GlobalFuncs.setInLocalStorage(hall.LAST_GET_REWARD_DAY, curDay);
		return true;
	}
	return false;
};


ddz.GlobalFuncs.noteToFriend = function (noteType , moneyCount) {
	var serverConfig = ddz.gameModel.getServerConfigJson();
	if (serverConfig && serverConfig.version >= 5.7){
		if (ddz.GlobalFuncs.isFristGetReward()) {
			//本日第一次领红包,通知给所有好友
			var mv = 0;
			if (moneyCount){
				mv = moneyCount;
			}else{
				var couponCount = hall.ME.udataInfo.m_couponCount;
				var exchangedCoupon = hall.ME.udataInfo.m_exchangedCoupon;
				mv = hall.GlobalFuncs.getMoneyStringWithCoupons(couponCount + exchangedCoupon);
			}

			ddz.MsgFactory.sendRewardMsgToFriends(ty.UserInfo.FriendUids, mv, noteType);
		}
	}
};

ddz.GlobalFuncs.giftBtnClick = function () {
	if (ddz.gameModel.gongZhonghaoMenuPoint > 0) {
		hall.GlobalFuncs.onOfficialAccountGuide();
	}else {
		ddz.GlobalFuncs.showNormalTipsWindow("今天的免费礼包已领取\n明天奖励更给力哦~",[{title:"确定",callFunc:function () {
		}}],"天天礼包");
	}
};