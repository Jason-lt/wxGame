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

var sliceNumber = function (numberString) {
	if(numberString.length <= 4){
		return numberString;
	}
	if(numberString.length <= 8){
		return numberString.slice(0,numberString.length-4)+"万";
	}
	return numberString.slice(0,numberString.length-8)+"亿";
};

var logD = function (string) {
	// console.log(string);
};

/**
更新用户托管数据总分
*/
var updateRank = function(data){
	logD("updateRank===="+JSON.stringify(data));
	wx.setUserCloudStorage({
		KVDataList :[{key:'sumScore',value:data.sumScore+""},{key:'userId',value:data.userId+""}],
		success : function () {
			logD("setUserCloudStorageSum===="+data.sumReward+"===="+ JSON.stringify(arguments));
		},
		fail : function () {
			logD(JSON.stringify(arguments));
		},
		complete : function () {
		}
	});
};

/**
显示群排行
*/
var showGroupRank = function(data){
	logD("开放数据域逻辑加载成功！showGroupRank");
	wx.getGroupCloudStorage({
		shareTicket:data.shareTicket,
		keyList:["avatarUrl","nickName",'userId',data.rankType],
		success : function (result) {
			var resultData = result.data;
			drawRankList(resultData,data.userId,data.rankType);
			// logD("showGroupRank===="+"===="+ JSON.stringify(arguments));
		},
		fail : function () {logD(null, JSON.stringify(arguments));},
		complete : function () {}
	});
};

/**
 显示好友排行
 */
var showFriendRank = function(data){
	logD("开放数据域逻辑加载成功！showFriendRank==="+JSON.stringify(data));
	wx.getFriendCloudStorage({
		keyList:["avatarUrl","nickName",'userId',data.rankType],
		success : function (result) {
			logD("showFriendRank===="+"===="+ JSON.stringify(arguments));
			var resultData = result.data;
			drawRankList(resultData,data.userId,data.rankType);
		},
		fail : function () {logD(null, JSON.stringify(arguments));},
		complete : function () {}
	});
};

/**
 获取好友数据
 */
var getFriendGameData = function(data){
	wx.getFriendCloudStorage({
		keyList:["avatarUrl","nickName",'userId',"sumScore"],
		success : function (result) {
			logD("getFriendGameData===="+"===="+ JSON.stringify(arguments));
			var resultData = result.data;
			rankFriendData(resultData,data.userId,data.sumScore);
		},
		fail : function () {logD(null, JSON.stringify(arguments));},
		complete : function () {}
	});
};

var rankFriendData = function (rankDatas,userId,sumScore) {
	if(rankDatas && rankDatas.length > 0){
		addInformation(rankDatas[0]);
	}
	//排序
	var j = 1;
	while (j < rankDatas.length){
		var temp = rankDatas[j];
		if(!temp){
			break;
		}
		addInformation(temp);

		var number1 = temp["sumScore"];
		if(number1 == null){
			rankDatas.splice(j,1);
			continue;
		}
		var k = j -1;
		while ( k >= 0 ){
			var number2 = rankDatas[k]["sumScore"];
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
	var sharedCanvas = wx.getSharedCanvas();
	var context = sharedCanvas.getContext("2d");


	context.clearRect(0,0,550,100);
	context.fillStyle="#ffffff";
		context.textAlign="left";
		context.font="36px Arial";
		var userIndex = rankDatas.length-1;
		var nextUser = rankDatas[userIndex];
		while (userIndex >= 0 && (nextUser.sumScore == 0 ||
		nextUser.userId == userId ||
		nextUser.sumScore <= sumScore) ){
			userIndex -- ;
			if(userIndex == -1){
				context.textAlign="center";
				context.fillText("您排名第一",225,60);
				return;
			}
			nextUser = rankDatas[userIndex];
		}
		context.fillText("即将超越的好友：",10,60);
		var headImageBg = wx.createImage();
		headImageBg.toY =10;
		headImageBg.src = nextUser.avatarUrl;
		if(headImageBg.src == ""){
			headImageBg.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
		}
		headImageBg.onload = function (event) {
			var img = event.target;
			context.drawImage(img,300,img.toY,80,80);
		};
		context.textAlign="right";
		context.fillText(sumScore+"米",530,60);




	context['game_friendData'] = JSON.stringify(rankDatas);
	context['game_friendData_success'] = true;
	logD("rankFriendData ..+++++++++++++++++"+JSON.stringify(rankDatas));
}

var addInformation = function (temp) {
	var number1 = 0;
	var number2 = 0;
	var userId = "";
	if(temp.KVDataList && temp.KVDataList.length > 0){
		for (var i = 0; i < temp.KVDataList.length; i ++){
			var keyS = temp.KVDataList[i].key;
			if (keyS == 'userId'){
				userId = temp.KVDataList[i].value;
			}
			if (keyS == 'sumScore'){
				number2 = parseInt(temp.KVDataList[i].value);
				if(!number2 || number2 < 1){
					number2 = 0;
				}
			}
		}
	}
	temp.sumScore = number2;
	temp.userId = userId;
};

var drawRankList = function (rankDatas,userId,rankType) {
	// week = "1";
	if(rankDatas && rankDatas.length > 0){
		addInformation(rankDatas[0]);
	}
	//排序
	var j = 1;
	while (j < rankDatas.length){
		var temp = rankDatas[j];
		if(!temp){
			break;
		}
		addInformation(temp);

		var number1 = temp[rankType];
		if(number1 == null){
			rankDatas.splice(j,1);
			continue;
		}
		var k = j -1;
		while ( k >= 0 ){
			var number2 = rankDatas[k][rankType];
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
	logD("drawRankList ..+++++++++++++++++"+JSON.stringify(rankDatas));
	// logD("drawRankList ..+++++++++++++++++userId = "+userId);
	//选出自己,放在最前面
	for (var i = 0 ; i < rankDatas.length ; i ++){
		if(rankDatas[i].userId == userId && userId != 0){
			rankDatas[i].rank = i + 1;
			rankDatas.unshift(rankDatas[i]);
			break;
		}
	}

	var shareCanvas = wx.getSharedCanvas();
	var context = shareCanvas.getContext("2d");
	context.clearRect(0,0,530,1890);

	//530*600
	context.font="28px Arial";
	context.textBaseline="middle";
	context.textAlign="center";

	if(rankDatas && rankDatas.length > 0){
		for (var i = 0 ; i < 21 ; i ++){
			var headImageBg = wx.createImage();
			headImageBg.toY = 86+ i * 90;
	        headImageBg.src = "res/raw-assets/resources/table/nopack/rank_line.png";
	        headImageBg.onload = function (event) {
			   var img = event.target;
			   context.drawImage(img,30,img.toY,507,4);
	        };

			context.fillStyle="#000000";
			if (i < rankDatas.length){
				if(i == 0){
				var headImageBg = wx.createImage();
				headImageBg.src = "res/raw-assets/resources/table/nopack/rabk_mine.png";
				headImageBg.onload = function (event) {
					var img = event.target;
					context.drawImage(img,0,0,563,89);
					context.fillStyle="#ffffff";
					drawUserInformationWithIndexAndData(0,rankDatas,context);
				};
				}else{
				   drawUserInformationWithIndexAndData(i,rankDatas,context);
				}
			}else {
				var rankS = i+"";
			    if(!rankDatas[0].rank){rankS = (i+1) + "";}
			    var baseHeight = i * 90 +45;
				context.textAlign="center";
				context.fillText(rankS,40,baseHeight);
				context.textAlign="left";
				context.fillText("虚位以待",186,baseHeight);
			}
		}
	}
};

var drawUserInformationWithIndexAndData = function(i,rankDatas,context){
	var baseHeight = i * 90 +45;
	var rankS = i+"";
	if(!rankDatas[0].rank){
	rankS = (i+1) + "";
	}
	//排行
	context.textAlign="center";
	if(i < 4){
		if(i == 0){
			if(rankDatas[0].rank){
				rankS = rankDatas[0].rank;
			}
		}
		var image = wx.createImage();
		if(rankS == 1){
			image.toY = baseHeight-32;
			image.src = "res/raw-assets/resources/table/nopack/rank_1.png";
			image.onload = function (event) {
			var img = event.target;
			context.drawImage(img,21,img.toY,39,64);};
		}else if(rankS == 2){
			image.toY = baseHeight-21;
			image.src = "res/raw-assets/resources/table/nopack/rank_2.png";
			image.onload = function (event) {
			var img = event.target;
			context.drawImage(img,24,img.toY,33,42);};
		}else if (rankS == 3){
			image.toY = baseHeight-23;
			image.src = "res/raw-assets/resources/table/nopack/rank_3.png";
			image.onload = function (event) {
			var img = event.target;
			context.drawImage(img,27,img.toY,27,45);};
		}else {
			context.fillText(rankS,40,baseHeight);
		}
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
		headImage.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
	}
	headImage.onload = function (event) {
		var img = event.target;
		var r = 33;
		var lineTop = img.toY * 90 +45-r;
		context.drawImage(img,73,lineTop,r*2,r*2);
		// var beforeImage = wx.createImage();
		// beforeImage.lineTop = lineTop;
		// if(img.toY == 0){
		// 	beforeImage.src = "res/raw-assets/resources/table/nopack/rank_avatar_bg_1.png";
		// }else {
		// 	beforeImage.src = "res/raw-assets/resources/table/nopack/rank_avatar_bg_2.png";
		// }
		// beforeImage.onload = function (event) {
		// 	var image = event.target;
		// 	context.drawImage(image,73,image.lineTop,r*2,r*2);
		// }
	};

	//昵称
	context.textAlign="left";
	context.fillText(SliceStringToLength(rankDic.nickname, 10),186,baseHeight);

	//总分
	context.textAlign="right";
	if(rankDic["sumScore"]){
		context.fillText(rankDic["sumScore"]+"米",510,baseHeight);
	}else {
		context.fillText("0",500,baseHeight);
	}
};

var showOrigin = function(){
	var shareCanvas = wx.getSharedCanvas();
	var context = shareCanvas.getContext("2d");
	context.clearRect(0,0,530,1890);
	// context.fillStyle="#24a08e";
	// context.fillRect(0,0,530,1890);
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
		case 'updateRankChip':{
			updateRankChip(data);
			break;
		}
		case 'getUserInfo':{
			getUserInfo();
			break;
		}
		case 'getNextSurpass':{
			getFriendGameData(data);
			break;
		}
  }
});

var getUserInfo = function(data) {
	wx.getUserInfo({
		openIdList : ['selfOpenId'],
		lang    : 'zh_CN',
		success   : function(res) {
			// console.log('OpenRegion | getUserInfo | success | ' + JSON.stringify(arguments))

			var sharedCanvas = wx.getSharedCanvas();
			var context = sharedCanvas.getContext("2d");
			context['game_getUserInfo'] = res.data[0];
			context['status_getUserInfo'] = true;
		},
		fail : function(params) {
			// console.log('OpenRegion | getUserInfo | fail | ' + JSON.stringify(arguments))

			var sharedCanvas = wx.getSharedCanvas();
			var context = sharedCanvas.getContext("2d");
			context['game_getUserInfo'] = JSON.stringify(arguments);
			context['status_getUserInfo'] = false;
		},
	})
};