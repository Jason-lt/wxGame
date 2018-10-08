//
// ddz_global.js
// highladder
//
// Created by guangy on 2016-03-08
// 
//斗地主global

ddz.GlobalFuncs = {};

ddz.GlobalFuncs.SortCardFunc = function(c1, c2) { //在chrome浏览器上只返回true,false会有问题，正确方法应该是返回正数，负数，0
	var info1 = c1._info;
	var info2 = c2._info;
	if (info1._value < info2._value) {
		return 1;
	} else if (info1._value > info2._value) {
		return -1
	}
	if (info1._color < info2._color) {
		return 1;
	} else if (info1._color > info2._color) {
		return -1
	}
	return info1._tag - info2._tag;
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

ddz.GlobalFuncs.getMyIndex = function  (index,totalnum) {
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

ddz.GlobalFuncs.GetAvatarBySexDizhu = function(sex, bIsDizhu) {
	var name;
	if (sex == ddz.Enums.PlayerSexEnum.SEX_MALE) { //male
		if (bIsDizhu) { //经典场，地主。欢乐场待做
			name = "head_dizhu1.png";
		} else {
			name = "head_nongmin1.png";
		}

	} else { //femal
		if (bIsDizhu) {
			name = "head_dizhu2.png";
		} else {
			name = "head_nongmin2.png";
		}
	}
	return name;
};

ddz.GlobalFuncs.GetCardPointByNum = function(num) {
	var point = num % 13 + 1;
	if (num == 52 || num == 53) {
		point = num % 13 + 14;
	}
	if (num > 53) { // 癞子牌
		point = num - 53;
	}
	return point;
};

ddz.GlobalFuncs.getCardValueByNum = function(num) {
	if (num < 0) {
		hall.LOGE('global', "error, num < 0 in ddz.GlobalFuncs.getCardValueByNum!!");
		return -1;
	}
	if (num > 53) {
		return 15; //癞子牌
	} else if (num == 53) { //大王
		return 14;
	} else if (num == 52) { //小王
		return 13;
	} else {
		var point = num % 13 + 1;
		if (point < 3) { // A = 11, 2 = 12
			return point + 10;
		} else {
			return point - 3; // 3 = 0, 4 = 1...	
		}
	}
	return -1;
};

ddz.GlobalFuncs.GetCardValueByPoint = function(point) { //根据point来获取value
	if (point < 3) { // A = 11, 2 = 12
		return point + 10;
	} else if (point < 14) {
		return point - 3; // 3 = 0, 4 = 1...	
	} else if (point < 16) {
		return point - 1; //小王point = 14, value = 13, 大王point = 15, value = 14
	} else { //不能有point > 15的情况
		hall.LOGE('global', "error! value should not larger than 13");
	}
};

ddz.GlobalFuncs.getLaiziNumByValue = function(value) { //获得需要转换成相应value的癞子number，例如癞子牌当做5打出，则value = 2
	if (value >= 0 && value < 11) {
		return 56 + value;
	} else if (value < 13) {
		return 43 + value;
	} else {
		hall.LOGE('global', "error! value should not larger than 12");
	}
};


ddz.GlobalFuncs.getSendAction = function(kind) {
	var frames = [];
	var prefix = "info_n_send_" + kind + "_";
	var fc = cc.spriteFrameCache;
	for (var i = 1; i < 10; i++) {
		var name = prefix + i + ".png";
		var f = fc.getSpriteFrame(name);
		frames.push(f);
	}
	return h5.globalFunc.getAction(frames, 0.08, 1);
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
	if (systemTy == 1){//其他iPhone
		reultHeight = sceneSize.height/2-56;
	}else if(systemTy == 2){ //iPhoneX
		reultHeight = sceneSize.height/2-102;
	}else if(systemTy == 3){ //cc.sys.OS_ANDROID
		reultHeight = sceneSize.height/2-54;
	}else if(systemTy == 4){ //8p
		reultHeight = sceneSize.height/2-46;
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
	// openDataContext.postMessage({
	// 	method:'updateRank',
	// 	winnerCount: val,
	// 	userId:ty.UserInfo.userId,
	// })

	openDataContext.postMessage({
		method:'updateRank',
		sumReward: val,
		userId:ty.UserInfo.userId,
	})
};
ddz.GlobalFuncs.upDateRankDataWeek = function (val) {
	// val = "1";
	var openDataContext = ddz.GlobalFuncs.getOpenData(true);
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'updateRankWeek',
		week: val,
		userId:ty.UserInfo.userId,
	})
};


/**
 * 更新自己的群排行榜数据
 * @param val 群shareTicket
 */
ddz.GlobalFuncs.showGroupRank = function (val) {
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
	})
};

/**
 * 更新自己的好友排行榜数
 */
ddz.GlobalFuncs.showFriendRank = function () {
	var nowWeek = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.matchModel.LAST_RANK_WEEK, "");
	var openDataContext = ddz.GlobalFuncs.getOpenData();
	if(!openDataContext){
		return;
	}
	openDataContext.postMessage({
		method:'showFriendRank',
		week:nowWeek,
		userId:ty.UserInfo.userId,
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

	cc.loader.loadRes('prefabs/lotteryWin', function (err, prefab) {

		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);

		var com = preFabNode.getComponent('LotteryWin');
		ddz.showedLotteryWin = com;
		com.setWinType(winType, valArr);

	}.bind(this));

};

ddz.GlobalFuncs.playZuanShi = function (isShowTips,manager) {
	hall.LOGE("=="," file = [DdzGlobalFuncs] fun = [playZuanShi] isShowTips = " + isShowTips);
	cc.loader.loadRes('prefabs/zuanshi/zuanshi', function (err, prefab) {
		var preFabNode = cc.instantiate(prefab);
		cc.director.getScene().addChild(preFabNode);
		ddz.GlobalFuncs.setToCenter(preFabNode);
		var com = preFabNode.getComponent('ddz_zuanShiAni');
		com.parentScene = manager;
		var ani = preFabNode.getComponent(cc.Animation);
		var clipName = ani.getClips()[0].name;
		var anim = ani.getAnimationState(clipName);
		com.setTipsRichText(isShowTips);
		anim.once("finished", function () {
		});
		anim.play();

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
		window.setShowType(type);
		if (widthTips){
			window.showTips();
		}
	});
};


ddz.GlobalFuncs.showTipsWindowWithString = function (widthTips,manager,buttonS) {
	var preFabPath = "prefabs/ddz_window_tips";
	var  comName = "ddz_tipsWindow";
	ddz.matchModel.showPopWinByPreFab(preFabPath, function (preFabNode) {
		var window = preFabNode.getComponent(comName);
		window.parentScene = manager;
		var tiString = "分享到群";
		if(buttonS){
			tiString = buttonS;
		}
		var testArray = [{
			title :tiString,
			bottomType : 0
		}];
		window.setTitleContentAndButtons("提示",widthTips,testArray);
	});
};

ddz.GlobalFuncs.showDropEffect = function (baseScale, pNode) {
	pNode.scale = baseScale * 1.15;
	var seq = cc.sequence(cc.scaleTo(0.1, baseScale * 0.93),cc.scaleTo(0.015, baseScale));
	pNode.runAction(seq);
};