//先算出整个字符串的长度，并获得第length - 2个字符串的位置，给".."留2个位置
var SliceStringToLength = function(str, length) {
	if(!str) {
		return str;
	}
	var len = 0;
	var tmp = 0;
	var s;
	for (var i = 0; i < str.length; i++) {
		var charCode = str.charCodeAt(i);
		if (charCode >= 0 && charCode <= 128) {
			tmp += 1;
		} else { // 如果是中文则长度加2
			tmp += 2;
		}
		if (tmp <= length - 2) {
			len++;
		}
	}
	if (tmp <= length) {
		s = str.slice(0);
	} else {
		s = str.slice(0, len);
		s += "..";
	}
	return s;
};

var logD = function (string) {
	console.log(string);
};

/**
更新用户托管数据通关次数
*/
var updateRank = function(data){
	wx.setUserCloudStorage({
		KVDataList :[{key:'winnerCount',value:data.winnerCount},{key:'userId',value:data.userId+""}],
		success : function () {
			logD("setUserCloudStorage===="+data.winnerCount+"===="+ JSON.stringify(arguments));
		},
		fail : function () {
			logD(JSON.stringify(arguments));
		},
		complete : function () {
		},
	});
};
/**
 更新用户托管数据通关星期
 */
var updateRankWeek = function(data){
	wx.setUserCloudStorage({
		KVDataList :[{key:'week',value:data.week},{key:'userId',value:data.userId+""}],
		success : function () {
			logD("setUserCloudStorage===="+data.week+"===="+ JSON.stringify(arguments));
		},
		fail : function () {
			logD(JSON.stringify(arguments));
		},
		complete : function () {
		},
	});
};

/**
显示群排行
*/
var showGroupRank = function(data){
	logD("开放数据域逻辑加载成功！showGroupRank");
	wx.getGroupCloudStorage({
		shareTicket:data.shareTicket,
		keyList:["avatarUrl","nickName","winnerCount",'userId','week'],
		success : function (result) {
			var resultData = result.data;
			drawRankList(resultData,data.userId,data.week);
			// logD("showGroupRank===="+"===="+ JSON.stringify(arguments));
		},
		fail : function () {logD(null, JSON.stringify(arguments));},
		complete : function () {},
	});
};

/**
 显示好友排行
 */
var showFriendRank = function(data){
	logD("开放数据域逻辑加载成功！showFriendRank");
	wx.getFriendCloudStorage({
		keyList:["avatarUrl","nickName","winnerCount",'userId','week'],
		success : function (result) {
			var resultData = result.data;
			drawRankList(resultData,data.userId,data.week);
		},
		fail : function () {logD(null, JSON.stringify(arguments));},
		complete : function () {},
	});
};
var addInformation = function (temp) {
	var number1 = 0;
	var userId = "";
	var week = 0;
	if(temp.KVDataList && temp.KVDataList.length > 0){
		for (var i = 0; i < temp.KVDataList.length; i ++){
			var keyS = temp.KVDataList[i].key;
			if (keyS == 'winnerCount'){
				number1 = parseInt(temp.KVDataList[i].value);
			}
			if (keyS == 'userId'){
				userId = temp.KVDataList[i].value;
			}
			if (keyS == 'week'){
				week = parseInt(temp.KVDataList[i].value);
			}
		}
	}
	temp.winnerCount = number1;
	temp.userId = userId;
	temp.week = week;
};

var drawRankList = function (rankDatas,userId,week) {
	// week = "1";
	logD("drawRankList+++++++++++++++++"+JSON.stringify(rankDatas));
	while (rankDatas && rankDatas.length > 0){
		addInformation(rankDatas[0]);
		if(rankDatas[0].week != week){
			rankDatas.splice(0,1);
		}else {
			break;
		}
	}
	//排序
	var j = 1;
	while (j < rankDatas.length){
		var temp = rankDatas[j];
		if(!temp){
			break;
		}
		addInformation(temp);
		if(temp.week != week){
			rankDatas.splice(j,1);
			continue;
		}

		var number1 = temp.winnerCount;
		var k = j -1;
		while ( k >= 0 ){
			var number2 = rankDatas[k].winnerCount;
			if(number1 > number2){
				rankDatas[k+1] = rankDatas[k];
				rankDatas[k] = temp;
				k --;
			}else {
				break;
			}
		}
		j ++;
	}

	// for (var j = 1 ; j < rankDatas.length;j ++){
	// 	// var temp = rankDatas[j];
	// 	// if(!temp){
	// 	// 	break;
	// 	// }
	// 	// addInformation(temp);
     //    //
	// 	// if(temp.week != week){
	// 	// 	rankDatas.splice(j,1);
	// 	// 	j --;
	// 	// 	continue;
	// 	// }
	// 	//
	// 	// var number1 = temp.winnerCount;
	// 	// var k = j -1;
	// 	// while ( k >= 0 ){
	// 	// 	var number2 = rankDatas[k].winnerCount;
	// 	// 	if(number1 > number2){
	// 	// 		rankDatas[k+1] = rankDatas[k];
	// 	// 		rankDatas[k] = temp;
	// 	// 		k --;
	// 	// 	}else {
	// 	// 		break;
	// 	// 	}
	// 	// }
	// }
	//选出自己,放在最前面
	for (var i = 0 ; i < rankDatas.length ; i ++){
		if(rankDatas[i].userId == userId){
			rankDatas[i].rank = i + 1;
			rankDatas.unshift(rankDatas[i]);
			break;
		}
	}

	var shareCanvas = wx.getSharedCanvas();
	var context = shareCanvas.getContext("2d");
	// context.clearRect(0,0,530,1890);

	//530*600
	context.font="26px Arial";
	context.textBaseline="middle";
	context.textAlign="center";

	if(rankDatas && rankDatas.length > 0){
		for (var i = 0 ; i < 21 ; i ++){
			var baseHeight = i * 90 +45;
			if(i%2 == 0){
				if(i == 0){
					context.fillStyle="#338675";
				}else {
					context.fillStyle="#149586";
				}
			}else {
				context.fillStyle="#24a08e";
			}
			context.fillRect(0,baseHeight-45,530,90);

			context.fillStyle="#ffffff";
			var rankS = i+"";
			if(!rankDatas[0].rank){
				rankS = (i+1) + "";
			}
			if (i < rankDatas.length){
				//排行
				context.textAlign="center";
				if(i < 4){
					if(i == 0){
						if(rankDatas[0].rank){
							rankS = rankDatas[0].rank;
						}
					}
					var image = wx.createImage();
					image.toY = baseHeight-18;
					if(rankS == 1){
						image.src = "res/raw-assets/resources/table/nopack/ddz_rank_1.png";
					}else if(rankS == 2){
						image.src = "res/raw-assets/resources/table/nopack/ddz_rank_2.png";
					}else if (rankS == 3){
						image.src = "res/raw-assets/resources/table/nopack/ddz_rank_3.png";
					}else {
						context.fillText(rankS,40,baseHeight);
					}
					image.onload = function (event) {
						var img = event.target;
						context.drawImage(img,17,img.toY,46,37);
					};
				}else {
					context.fillText(rankS,40,baseHeight);
				}

				var rankDic = rankDatas[i];

				//头像
				var headImage = wx.createImage();
				headImage.toY = i;
				if(rankDic.avatarUrl != ""){
					headImage.src = rankDic.avatarUrl;
				}else {
					headImage.src = "res/raw-assets/resources/table/nopack/ddz_avatar_default.png";
				}
				headImage.onload = function (event) {
					var img = event.target;
					var r = 33;
					var lineTop = img.toY * 90 +45-r;
					context.drawImage(img,73,lineTop,r*2,r*2);
					var beforeImage = wx.createImage();
					beforeImage.lineTop = lineTop;
					if(img.toY == 0){
						beforeImage.src = "res/raw-assets/resources/table/nopack/ddz_avatar_03.png";
					}else if(img.toY%2 == 0){
						beforeImage.src = "res/raw-assets/resources/table/nopack/ddz_avatar_02.png";
					}else {
						beforeImage.src = "res/raw-assets/resources/table/nopack/ddz_avatar_01.png";
					}
					beforeImage.onload = function (event) {
						var image = event.target;
						context.drawImage(image,73,image.lineTop,r*2,r*2);
					}
				};

				//昵称
				context.textAlign="left";
				context.fillText(SliceStringToLength(rankDic.nickname, 10),186,baseHeight);

				//次数
				context.textAlign="right";
				if(rankDic.winnerCount){
					context.fillText(rankDic.winnerCount+"次",480,baseHeight);
				}else {
					context.fillText("0次",480,baseHeight);
				}
			}else {
				context.textAlign="center";
				context.fillText(rankS,40,baseHeight);
				context.textAlign="left";
				context.fillText("虚位以待",186,baseHeight);
			}
		}
	}
};

var showOrigin = function(){
	var shareCanvas = wx.getSharedCanvas();
	var context = shareCanvas.getContext("2d");
	context.clearRect(0,0,530,1890);
	context.fillStyle="#24a08e";
	context.fillRect(0,0,530,1890);
	context.font="26px Arial";
	context.fillStyle="#ffffff";
	context.textAlign="center";
	context.fillText("加载中...",265,350);
};

wx.onMessage(function(data) {
	// showOrigin();
	switch (data.method){
		case 'updateRank':{
			updateRank(data);
			break;
		}
		case 'showGroupRank':{
			showGroupRank(data);
			break;
		}
		case 'showFriendRank':{
			showFriendRank(data);
			break;
		}
		case 'showOrigin':{
			showOrigin();
			break;
		}
		case 'updateRankWeek':{
			updateRankWeek(data);
			break;
		}
  }
});