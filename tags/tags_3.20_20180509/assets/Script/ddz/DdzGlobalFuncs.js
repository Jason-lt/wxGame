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
		// hall.LOGE('global', "poker more than need");
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
		// hall.LOGE('global', "origin : " + origin + "  interval : " + interval);
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
	// 	hall.LOGE('global', "error, num < 0 in ddz.GlobalFuncs.numberToValue!!");
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
// 		hall.LOGE('global', "error! value should not larger than 12");
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
// ddz.GlobalFuncs.upDateRankDataWeek = function (val) {
// 	// val = "1";
// 	var openDataContext = ddz.GlobalFuncs.getOpenData(true);
// 	if(!openDataContext){
// 		return;
// 	}
// 	openDataContext.postMessage({
// 		method:'updateRankWeek',
// 		week: val,
// 		userId:ty.UserInfo.userId
// 	})
// };


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


/**
 * 显示分奖窗口
 */
ddz.GlobalFuncs.showLotteryWin = function (show_type, valArr) {

	if (hall.GlobalFuncs.isInAtScene("TableScene") && !ddz.matchResultPanel){
		//在牌桌里打牌的情况,只记录,不弹
		ddz.waitLotteryPar = [show_type, valArr];
		return;
	}

	var dateTime, nowDate, lastTime;
	var lastDate = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_REWARD_DATE, "");

	if (show_type == 1){

		if (ddz.isWaitingShowLotteryWin){
			ddz.isWaitingShowLotteryWin.push([show_type, valArr]);
			return;
		}

		if (ddz.showedLotteryWin){
			ddz.showedLotteryWin.setWinType(show_type, valArr);
			return;
		}

		dateTime = valArr[0];
		nowDate = dateTime + "_" + ty.UserInfo.userId;
		if (!lastDate){
			//显示开奖窗口
			ddz.GlobalFuncs.loadLotteryWin(show_type, valArr);
			ddz.isWaitingShowLotteryWin = [];
			hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_REWARD_DATE, nowDate);
		}
		else{
			lastTime = lastDate.split('_')[0];
			if(dateTime != lastTime){
				ddz.GlobalFuncs.loadLotteryWin(show_type, valArr);
				ddz.isWaitingShowLotteryWin = [];
				hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_REWARD_DATE, nowDate);
			}
		}
	}
	else{
		/*
		 　"histories":{
		 　　　　　　"winnerCount":2,
		 　　　　　　"matchCount":2,
		 　　　　　　"curLottery":{
		 　　　　　　　　"winnerCount":2,
		 　　　　　　　　"lotteryTime":"2018-04-08 19:15",
		 　　　　　　　　"rewards":[
		 　　　　　　　　　　{
		 　　　　　　　　　　　　"count":2,
		 　　　　　　　　　　　　"itemId":"item:1311"
		 　　　　　　　　　　},
		 　　　　　　　　　　{
		 　　　　　　　　　　　　"count":1200000,
		 　　　　　　　　　　　　"itemId":"user:chip"
		 　　　　　　　　　　},
		 　　　　　　　　　　{
		 　　　　　　　　　　　　"count":10000,
		 　　　　　　　　　　　　"itemId":"user:coupon"
		 　　　　　　　　　　}
		 　　　　　　　　]
		 　　　　　　},
		 　　　　　　"records":Array[2]
		 　　　　},
		 */

		var matchDes = ddz.matchModel.getCurDes();
		var histories = matchDes.histories;
		if (histories){
			var yestodayM = histories.lastLottery;
			if(yestodayM && yestodayM.winnerCount && yestodayM.rewards.length > 0){
				var yestodayCount = yestodayM.winnerCount;
				if (yestodayCount != 0){
					dateTime = yestodayM.lotteryTime;
					if(!dateTime){
						return;
					}
					nowDate = dateTime + "_" + ty.UserInfo.userId;

					if (!lastDate){
						//显示开奖窗口
						ddz.GlobalFuncs.loadLotteryWin(show_type);
						hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_REWARD_DATE, nowDate);
					}
					else{
						lastTime = lastDate.split('_')[0];
						if(dateTime != lastTime){
							//显示开奖窗口
							ddz.GlobalFuncs.loadLotteryWin(show_type);
							hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_REWARD_DATE, nowDate);
						}
					}
				}
			}
		}
	}
};

ddz.GlobalFuncs.loadLotteryWin = function (winType, valArr) {

	ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow, ["mainRewardTips"]);

	cc.loader.loadRes('prefabs/lotteryWin', function (err, prefab) {

		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);

		var com = preFabNode.getComponent('LotteryWin');
		ddz.showedLotteryWin = com;
		com.setWinType(winType, valArr);

	}.bind(this));

};

ddz.GlobalFuncs.playZuanShi = function (isShowTips,manager,rewardNumber,isChip) {
	hall.LOGE("=="," file = [DdzGlobalFuncs] fun = [playZuanShi] isShowTips = " + isShowTips);
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
			com.changeDiamondToChip();
		}
	}.bind(this));
};

ddz.GlobalFuncs.showWindowTipsForFriend = function (callBack) {
	var preFabPath = "prefabs/ddz_window_tips";
	var comName = "ddz_tipsWindow";
	if(ddz.friendModel.tipsWindow){
		hall.LOGE("==ddz.friendModel.tipsWindow==","======ddz.friendModel.tipsWindow======");
		callBack(ddz.friendModel.tipsWindow,comName);
	}else {
		hall.LOGE("===","======!!!!ddz.friendModel.tipsWindow======");
		cc.loader.loadRes(preFabPath, function (err, prefab) {
			var preFabNode = cc.instantiate(prefab);
			ddz.friendModel.tipsWindow = preFabNode;
			cc.director.getScene().addChild(preFabNode);
			ddz.GlobalFuncs.setToCenter(preFabNode);
			callBack(preFabNode,comName);
		});
	}
};

ddz.GlobalFuncs.playShareZuanShi = function (rewardNumber) {
	hall.LOGE("=="," file = [DdzGlobalFuncs] fun = [playShareZuanShi] rewardNumber = " + rewardNumber);
	if(ddz.tipsNode){
		ddz.tipsNode.removeFromParent();
		ddz.tipsNode = null;
	}

	cc.loader.loadRes('prefabs/conversionSuccess', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.tipsNode = preFabNode;
		var winSize = cc.director.getWinSize();
		preFabNode.x = winSize.width/2;
		preFabNode.y = winSize.height/2 + 103;

		var com = preFabNode.getComponent('conversionSuccess');
		com.updateDiamondCount(rewardNumber);

	}.bind(this));
};

ddz.GlobalFuncs.showWaitLottreyWin = function () {
	if (ddz.waitLotteryPar){
		ddz.GlobalFuncs.showLotteryWin(ddz.waitLotteryPar[0],ddz.waitLotteryPar[1]);
		ddz.waitLotteryPar = null;
	}
};

/**
 * 检查是否为当天第一次失败
 * @returns {boolean}
 */
ddz.GlobalFuncs.checkFirstFail = function () {

	var lastFailDate = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_FAIL_DATE, "");
	var curDate = hall.GlobalTimer.getCurDay();
	if (lastFailDate != curDate){
		hall.GlobalFuncs.setInLocalStorage(ddz.matchModel.LAST_FAIL_DATE, curDate);
		return true;
	}

	return false;
};


ddz.GlobalFuncs.showRevialWindow = function (widthTips,type) {
	var preFabPath = "prefabs/ddz_window_revival";
	var  comName = "ddz_revivalWindow";
	ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		if(type == 2){
			window.changeTypeWithTypeAndParamters(true);
		}
		if (widthTips){
			window.showTips();
		}
	});
};

ddz.GlobalFuncs.showShareGuideWindow = function (isWin,chipNumber,multiple) {
	var preFabPath = "prefabs/ddz_window_revival";
	var  comName = "ddz_revivalWindow";
	ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		window.changeTypeWithTypeAndParamters(false,isWin,chipNumber,multiple);
		ddz.matchResultPanel2 = preFabNode;
	});
};


ddz.GlobalFuncs.showTipsWindowWithString = function (widthTips,buttonS) {
	var preFabPath = "prefabs/ddz_window_normal";
	var  comName = "ddz_window_normal";
	ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		var tiString = "分享到群";
		if(buttonS){
			tiString = buttonS;
		}
		window.setTitleContentAndButtonsString("提示",widthTips,[tiString]);
		window.centerCallFunc = function () {
			ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
		};
	});
};

ddz.GlobalFuncs.showNormalTipsWindow = function (widthTips) {
	var preFabPath = "prefabs/ddz_window_normal";
	var  comName = "ddz_window_normal";
	ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		window.setTitleContentAndButtonsString("提示",widthTips,["确定"]);
	});
};

ddz.GlobalFuncs.showDropEffect = function (baseScale, pNode) {
	pNode.scale = baseScale * 1.15;
	var seq = cc.sequence(cc.scaleTo(0.1, baseScale * 0.93),cc.scaleTo(0.015, baseScale));
	pNode.runAction(seq);
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
			return 0;
		}else {
			return 1;
		}
	}else {
		return 0;
	}
};
ddz.GlobalFuncs.setTodayLoginRewardDic = function (day) {
	var nowDic = {};
	nowDic[day] = [];
	hall.GlobalFuncs.setInLocalStorage(ddz.gameModel.LAST_GETDAYREWARD_TIME,JSON.stringify(nowDic));
};