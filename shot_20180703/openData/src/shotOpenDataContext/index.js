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
		},
		fail : function () {
			logD(JSON.stringify(arguments));
		},
		complete : function () {
		}
	});
};
/**
 更新用户托管星期
 */
var updateRankWeek = function(data){
	logD("updateRankWeek===="+JSON.stringify(data));
	wx.setUserCloudStorage({
		// KVDataList :[{key:'week',value:data.week+""},{key:'userId',value:data.userId+""}],
		KVDataList :[{key:'week',value:data.week+""}],
		success : function () {
			logD("updateRankWeek======="+ JSON.stringify(arguments));
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
		keyList:["avatarUrl","nickName",'userId','week',data.rankType],
		success : function (result) {
			var resultData = result.data;
			drawRankList(resultData,data.userId,data.rankType,data.week);
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
		keyList:["avatarUrl","nickName",'userId','week',data.rankType],
		success : function (result) {
			logD("showFriendRank===="+"===="+ JSON.stringify(arguments));
			var resultData = result.data;
			drawRankList(resultData,data.userId,data.rankType,data.week);
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
		keyList:["avatarUrl","nickName",'userId',"sumScore",'week'],
		success : function (result) {
			logD("getFriendGameData===="+"===="+ JSON.stringify(arguments));
			var resultData = result.data;
			rankFriendData(resultData,data.week,data.sumScore,data.userId,"friend");
		},
		fail : function () {logD(null, JSON.stringify(arguments));},
		complete : function () {}
	});
};

var getResultRank = function (data) {
	wx.getFriendCloudStorage({
		keyList:["avatarUrl","nickName",'userId',"sumScore",'week'],
		success : function (result) {
			logD("getFriendGameData===="+"===="+ JSON.stringify(arguments));
			var resultData = result.data;
			rankFriendData(resultData,data.week,data.sumScore,data.userId,"result");
		},
		fail : function () {logD(null, JSON.stringify(arguments));},
		complete : function () {}
	});
};

var rankFriendData = function (rankDatas,week,sumScore,userId,type) {
	if(rankDatas && rankDatas.length > 0){
		addInformation(rankDatas[0]);
		while (rankDatas.length > 0 && rankDatas[0].week != week){
			rankDatas.shift();
			addInformation(rankDatas[0]);
		}
	}
	rankDatas[0].rank = 1;
	//排序
	var j = 1;
	while (j < rankDatas.length){
		var temp = rankDatas[j];
		if(!temp){
			break;
		}
		addInformation(temp);
		temp.rank = j+1;

		var number1 = temp["sumScore"];
		if(temp.week != week || number1 == null){
			rankDatas.splice(j,1);
			continue;
		}
		var k = j -1;
		while ( k >= 0 ){
			var number2 = rankDatas[k]["sumScore"];
			if(number1 > number2){
				temp.rank = k+1;
				rankDatas[k].rank = k+2;
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
	if(type == "friend"){ //游戏内超越好友
		context.clearRect(0,0,300,60);
		context.fillStyle="#FCE5BC";
		context.textAlign="left";
		var userIndex = rankDatas.length-1;
		var nextUser = rankDatas[userIndex];
		while (userIndex >= 0 && (nextUser.sumScore == 0 ||
		nextUser.userId == userId ||
		nextUser.sumScore <= sumScore) ){
			userIndex -- ;
			if(userIndex == -1){
				context.textAlign="center";
				context.font="30px Arial";
				context.fillText("您排名第一",100,30);
				return;
			}
			nextUser = rankDatas[userIndex];
		}

		var headImageBg = wx.createImage();
		headImageBg.toY =0;
		headImageBg.src = nextUser.avatarUrl;
		if(headImageBg.src == ""){
			headImageBg.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
		}
		headImageBg.onload = function (event) {
			var img = event.target;
			context.drawImage(img,0,img.toY,60,60);
		};
		context.font="20px Arial";
		context.fillText(SliceStringToLength(nextUser.nickname,10),70,22);
		context.fillText(nextUser.sumScore,70,53);
	}else { //结算界面部分排行榜
		context.clearRect(0,0,550,280);
		context.fillStyle="#ffffff";
		context.textAlign="center";
		context.font="22px Arial";
		var rankSelf = 0;
		for (var i = 0 ; i < rankDatas.length ; i ++){
			if(rankDatas[i].userId == userId){
				rankSelf = i;
			}
		}
		var backImage;
		var backImage2;
		if(rankDatas.length == 1){
			backImage = wx.createImage();
			backImage.toY = 7;
			backImage.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_middle.png";
			backImage.onload = function (event) {
				var img = event.target;
				context.drawImage(img,192,img.toY,166,255);
				var headImageBg = wx.createImage();
				headImageBg.toY =70;
				headImageBg.src = rankDatas[0].avatarUrl;
				if(headImageBg.src == ""){
					headImageBg.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
				}
				headImageBg.onload = function (event) {
					var img = event.target;
					context.drawImage(img,216,img.toY,118,118);
					context.fillStyle="#EF7E20";
					context.fillText("1",275,50);
					context.fillStyle="#000000";
					context.fillText(SliceStringToLength(rankDatas[0].nickname,10),275,217);
					context.fillStyle="#845B2C";
					context.fillText(rankDatas[0].sumScore,275,247);
				};
			};
		}else if(rankDatas.length == 2){
			backImage = wx.createImage();
			backImage.toY = 7;
			rankSelf == 0 ? backImage.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_middle.png" :
				backImage.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_left.png";
			// backImage.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_middle.png";
			backImage.onload = function (event) {
				var img = event.target;
				context.drawImage(img,192-83,img.toY,166,255);
				var headImageBg = wx.createImage();
				headImageBg.toY =70;
				headImageBg.src = rankDatas[0].avatarUrl;
				if(headImageBg.src == ""){
					headImageBg.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
				}
				headImageBg.onload = function (event) {
					var img = event.target;
					context.drawImage(img,216-83,img.toY,118,118);
					context.fillStyle="#EF7E20";
					context.fillText("1",275-83,50);
					context.fillStyle="#000000";
					context.fillText(SliceStringToLength(rankDatas[0].nickname,10),275-83,217);
					context.fillStyle="#845B2C";
					context.fillText(rankDatas[0].sumScore,275-83,247);
				};
			};

			backImage2 = wx.createImage();
			backImage2.toY = 7;
			rankSelf == 0 ? backImage2.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_right.png" :
				backImage2.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_middle.png";
			// backImage.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_middle.png";
			backImage2.onload = function (event) {
				var img = event.target;
				context.drawImage(img,192+83,img.toY,166,255);
				var headImageBg2 = wx.createImage();
				headImageBg2.toY =70;
				headImageBg2.src = rankDatas[1].avatarUrl;
				if(headImageBg2.src == ""){
					headImageBg2.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
				}
				headImageBg2.onload = function (event) {
					var img = event.target;
					context.drawImage(img,216+83,img.toY,118,118);
					context.fillStyle="#EF7E20";
					context.fillText("2",275+83,50);
					context.fillStyle="#000000";
					context.fillText(SliceStringToLength(rankDatas[1].nickname,10),275+83,217);
					context.fillStyle="#845B2C";
					context.fillText(rankDatas[1].sumScore,275+83,247);
				};
			};
		}else {
			var index1;
			var index2;
			var index3;
			backImage = wx.createImage();
			backImage.toY = 7;
			backImage2 = wx.createImage();
			backImage2.toY = 7;
			var backImage3 = wx.createImage();
			backImage3.toY = 7;
			backImage.onload = function (event) {
				var img = event.target;
				context.drawImage(img,0,img.toY,166,255);
				var headImageBg = wx.createImage();
				headImageBg.toY =70;
				headImageBg.src = rankDatas[index1].avatarUrl;
				if(headImageBg.src == ""){
					headImageBg.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
				}
				headImageBg.onload = function (event) {
					var img = event.target;
					context.drawImage(img,216-192,img.toY,118,118);
					context.fillStyle="#EF7E20";
					context.fillText((index1+1)+"",275-192,50);
					context.fillStyle="#000000";
					context.fillText(SliceStringToLength(rankDatas[index1].nickname,10),275-192,217);
					context.fillStyle="#845B2C";
					context.fillText(rankDatas[index1].sumScore,275-192,247);
				};
			};

			backImage2.onload = function (event) {
				var img = event.target;
				context.drawImage(img,192,img.toY,166,255);
				var headImageBg2 = wx.createImage();
				headImageBg2.toY =70;
				headImageBg2.src = rankDatas[index2].avatarUrl;
				if(headImageBg2.src == ""){
					headImageBg2.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
				}
				headImageBg2.onload = function (event) {
					var img = event.target;
					context.drawImage(img,216,img.toY,118,118);
					context.fillStyle="#EF7E20";
					context.fillText((index2+1)+"",275,50);
					context.fillStyle="#000000";
					context.fillText(SliceStringToLength(rankDatas[index2].nickname,10),275,217);
					context.fillStyle="#845B2C";
					context.fillText(rankDatas[index2].sumScore,275,247);
				};
			};
			backImage3.onload = function (event) {
				var img = event.target;
				context.drawImage(img,192+192,img.toY,166,255);
				var headImageBg3 = wx.createImage();
				headImageBg3.toY =70;
				headImageBg3.src = rankDatas[index3].avatarUrl;
				if(headImageBg3.src == ""){
					headImageBg3.src = "res/raw-assets/resources/table/nopack/rank_avatar_default.png";
				}
				headImageBg3.onload = function (event) {
					var img = event.target;
					context.drawImage(img,216+192,img.toY,118,118);
					context.fillStyle="#EF7E20";
					context.fillText((index3+1)+"",275+192,50);
					context.fillStyle="#000000";
					context.fillText(SliceStringToLength(rankDatas[index3].nickname,10),275+192,217);
					context.fillStyle="#845B2C";
					context.fillText(rankDatas[index3].sumScore,275+192,247);
				};
			};

			if(rankSelf == 0){
				backImage.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_middle.png";
				backImage2.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_left.png";
				backImage3.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_right.png";
				index1 = 0;
				index2 = 1;
				index3 = 2;
			}else if(rankSelf == rankDatas.length-1){
				backImage.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_left.png";
				backImage2.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_right.png";
				backImage3.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_middle.png";
				index1 = rankSelf-2;
				index2 = rankSelf-1;
				index3 = rankSelf;
			}else {
				backImage.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_left.png";
				backImage2.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_middle.png";
				backImage3.src = "res/raw-assets/resources/table/nopack/shot_result_avatar_bg_right.png";
				index1 = rankSelf -1;
				index2 = rankSelf;
				index3 = rankSelf+1;
			}
		}
	}



	// context['game_friendData'] = JSON.stringify(rankDatas);
	// context['game_friendData_success'] = true;
	// logD("rankFriendData ..+++++++++++++++++"+JSON.stringify(rankDatas));
};

var addInformation = function (temp) {
	var week = 0;
	var number = 0;
	var userId = "";
	if(temp.KVDataList && temp.KVDataList.length > 0){
		for (var i = 0; i < temp.KVDataList.length; i ++){
			var keyS = temp.KVDataList[i].key;
			if (keyS == 'userId'){
				userId = temp.KVDataList[i].value;
			}
			if (keyS == 'sumScore'){
				number = parseInt(temp.KVDataList[i].value);
				if(!number || number < 1){
					number = 0;
				}
			}
			if (keyS == 'week'){
				week = parseInt(temp.KVDataList[i].value);
				if(!week || week < 1){
					week = 0;
				}
			}
		}
	}
	temp.sumScore = number;
	temp.userId = userId;
	temp.week = week;
};

var drawRankList = function (rankDatas,userId,rankType,week) {
	// week = "1";
	if(rankDatas && rankDatas.length > 0){
		addInformation(rankDatas[0]);
		while (rankDatas.length > 0 && rankDatas[0].week != week){
			rankDatas.shift();
			addInformation(rankDatas[0]);
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

		var number1 = temp[rankType];
		if(number1 == null || temp.week != week){
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
	//选出自己,放在最前面
	var i;
	for (i = 0 ; i < rankDatas.length ; i ++){
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
		for (i = 0 ; i < 21 ; i ++){
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
					var mineImageBg = wx.createImage();
					mineImageBg.src = "res/raw-assets/resources/table/nopack/rabk_mine.png";
					mineImageBg.onload = function (event) {
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
			image.toY = baseHeight-21;
			image.src = "res/raw-assets/resources/table/nopack/rank_1.png";
			image.onload = function (event) {
			var img = event.target;
			context.drawImage(img,24,img.toY,40,40);};
		}else if(rankS == 2){
			image.toY = baseHeight-21;
			image.src = "res/raw-assets/resources/table/nopack/rank_2.png";
			image.onload = function (event) {
			var img = event.target;
			context.drawImage(img,24,img.toY,40,40);};
		}else if (rankS == 3){
			image.toY = baseHeight-21;
			image.src = "res/raw-assets/resources/table/nopack/rank_3.png";
			image.onload = function (event) {
			var img = event.target;
			context.drawImage(img,24,img.toY,40,40);};
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
		var beforeImage = wx.createImage();
		beforeImage.lineTop = lineTop;
		if(img.toY == 0){
			beforeImage.src = "res/raw-assets/resources/table/nopack/rank_avatar_bg_1.png";
		}else {
			beforeImage.src = "res/raw-assets/resources/table/nopack/rank_avatar_bg_2.png";
		}
		beforeImage.onload = function (event) {
			var image = event.target;
			context.drawImage(image,73,image.lineTop,r*2,r*2);
		}
	};

	//昵称
	context.textAlign="left";
	context.fillText(SliceStringToLength(rankDic.nickname, 10),186,baseHeight);

	//总分
	context.textAlign="right";
	if(rankDic["sumScore"]){
		context.fillText(rankDic["sumScore"]+"分",510,baseHeight);
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
		case 'updateRankWeek':{
			updateRankWeek(data);
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
		case 'getUserInfo':{
			getUserInfo();
			break;
		}
		case 'getFriendInfo':{
			getFriendGameData(data);
			break;
		}
		case 'getResultRank':{
			getResultRank(data);
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
		}
	})
};