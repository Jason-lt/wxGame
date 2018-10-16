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
更新用户托管数据总奖金
*/
var updateRank = function(data){
	logD("setUserCloudStorageSum===="+JSON.stringify(data));
	wx.setUserCloudStorage({
		KVDataList :[{key:'sumReward',value:data.sumReward},{key:'userId',value:data.userId+""}],
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
var updateRankChip = function (data) {
	logD("setUserCloudStorageChip===="+JSON.stringify(data));
	wx.setUserCloudStorage({
		KVDataList :[{key:'chip',value:data.chip},{key:'userId',value:data.userId+""}],
		success : function () {
			logD("setUserCloudStorageChip===="+data.chip+"===="+ JSON.stringify(arguments));
		},
		fail : function () {
			logD(JSON.stringify(arguments));
		},
		complete : function () {
		}
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

var getFriendUserIds = function () {
	wx.getFriendCloudStorage({
		keyList:['userId'],
		success : function (result) {
			// logD("showFriendUserIds===="+"===="+ JSON.stringify(arguments));
			var resultData = result.data;
			var dataItem;
			var uids = [];
			for (var i = 0; i < resultData.length; i++){
				dataItem = resultData[i];
				if (dataItem.KVDataList && dataItem.KVDataList.length > 0){
					uids.push(parseInt(dataItem.KVDataList[0].value));
				}
			}

			var sharedCanvas = wx.getSharedCanvas();
			var context = sharedCanvas.getContext("2d");
			context['friendUids'] = uids;
			context['status_friendUids'] = true;
		},
		fail : function () {
			var sharedCanvas = wx.getSharedCanvas();
			var context = sharedCanvas.getContext("2d");
			context['status_friendUids'] = false;
		},
		complete : function () {}
	});
};

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
			if (keyS == 'sumReward'){
				number2 = parseInt(temp.KVDataList[i].value);
				if(!number2 || number2 < 1){
					number2 = 0;
				}
			}
			if (keyS == 'chip'){
				number1 = parseInt(temp.KVDataList[i].value);
				if(!number1 || number1 < 1){
					number1 = 0;
				}
			}
		}
	}
	temp.chip = number1;
	temp.sumReward = number2;
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
					context.fillStyle="#ffffff";
				}else {
					context.fillStyle="#ffffff";
				}
			}else {
				context.fillStyle="#ffffff";
			}
			context.fillRect(0,baseHeight-45,530,90);
			if(i == 0){
				context.fillStyle="#ED4824";
			}else {
				context.fillStyle="#9C7343";
			}
			
			var rankS = i+"";
			if(!rankDatas[0].rank){
				rankS = (i+1) + "";
			}
			if (i < rankDatas.length){
				//排行
				context.textAlign="center";
				if(i==0){
					var myImage = wx.createImage();
					myImage.toY = baseHeight;
					myImage.src = "res/raw-assets/resources/opendata/ddz_rank_my.png";
					myImage.onload = function (event) {
						var img = event.target;
						context.drawImage(img,0,img.toY - 45,566,89);

						var myHeight = 45;

						logD("排行榜绘制自己.+++++++++++++++++");
						if(rankDatas[0].rank){
							rankS = rankDatas[0].rank;
						}
						var image = wx.createImage();

						if(rankS == 1){
							image.src = "res/raw-assets/resources/opendata/ddz_rank_1.png";
						}else if(rankS == 2){
							image.src = "res/raw-assets/resources/opendata/ddz_rank_2.png";
						}else if (rankS == 3){
							image.src = "res/raw-assets/resources/opendata/ddz_rank_3.png";
						}else {
							context.textAlign="center";
							context.fillStyle="#ED4824";
							context.fillText(rankS,40,myHeight);
						}
						image.onload = function (event) {
							var img = event.target;
							context.drawImage(img,17,myHeight-23,48,55);
						};
						var rankDic = rankDatas[0];

						//头像
						var headImage = wx.createImage();
						headImage.toY = 0;
						if(rankDic.avatarUrl != ""){
							headImage.src = rankDic.avatarUrl;
						}else {
							headImage.src = "res/raw-assets/resources/opendata/ddz_avatar_bg.png";
						}
						headImage.onload = function (event) {
							var img = event.target;
							var r = 32;
							var lineTop = img.toY * 90 +45-r;
							context.drawImage(img,73,lineTop,r*2,r*2);
							var beforeImage = wx.createImage();
							beforeImage.lineTop = lineTop;
							beforeImage.src = "res/raw-assets/resources/opendata/ddz_avatar_00.png";
							beforeImage.onload = function (event) {
								var image = event.target;
								context.drawImage(image,73,image.lineTop,r*2,r*2);
							}
						};

						//昵称
						context.textAlign="left";
						context.fillText(SliceStringToLength(rankDic.nickname, 10),186,myHeight);

						//总奖金
						context.textAlign="right";
						if(rankDic[rankType]){
							context.fillText(sliceNumber(rankDic[rankType]+""),510,myHeight);
						}else {
							context.fillText("0",500,myHeight);
						}
						if(rankType == 'chip'){
							var image = wx.createImage();
							image.toY = myHeight-18;
							image.src = "res/raw-assets/resources/opendata/ddz_coin_white.png";
							image.onload = function (event) {
								var img = event.target;
								context.drawImage(img,360,img.toY,42,42);
							};
						}
					};		
				}else{
					if(i < 4){
						var image = wx.createImage();
						image.toY = baseHeight-23;
						if(rankS == 1){
							image.src = "res/raw-assets/resources/opendata/ddz_rank_1.png";
						}else if(rankS == 2){
							image.src = "res/raw-assets/resources/opendata/ddz_rank_2.png";
						}else if (rankS == 3){
							image.src = "res/raw-assets/resources/opendata/ddz_rank_3.png";
						}else {
							context.fillText(rankS,40,baseHeight);
						}
						image.onload = function (event) {
							var img = event.target;
							context.drawImage(img,17,img.toY,48,55);
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
						headImage.src = "res/raw-assets/resources/opendata/ddz_avatar_bg.png";
					}
					headImage.onload = function (event) {
						var img = event.target;
						var r = 32;
						var lineTop = img.toY * 90 +45-r;
						context.drawImage(img,73,lineTop,r*2,r*2);
						var beforeImage = wx.createImage();
						beforeImage.lineTop = lineTop;
						beforeImage.src = "res/raw-assets/resources/opendata/ddz_avatar_01.png";
						beforeImage.onload = function (event) {
							var image = event.target;
							context.drawImage(image,73,image.lineTop,r*2,r*2);
						}
					};

					//线
					var lineImage = wx.createImage();
					lineImage.toY = i;
					lineImage.src = "res/raw-assets/resources/opendata/ddz_rank_line.png";
					lineImage.onload = function (event) {
						var img = event.target;
						var lineTop = img.toY * 90 + 90;
						context.drawImage(img,32,lineTop,476,1);
					};

					//昵称
					context.textAlign="left";
					context.fillText(SliceStringToLength(rankDic.nickname, 10),186,baseHeight);

					//总奖金
					context.textAlign="right";
					if(rankDic[rankType]){
						context.fillText(sliceNumber(rankDic[rankType]+""),510,baseHeight);
					}else {
						context.fillText("0",500,baseHeight);
					}
					if(rankType == 'chip'){
						var image = wx.createImage();
						image.toY = baseHeight-18;
						image.src = "res/raw-assets/resources/opendata/ddz_coin_white.png";
						image.onload = function (event) {
							var img = event.target;
							context.drawImage(img,360,img.toY,40,40);
						};
					}
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
	context.fillStyle="#ffffff";
	context.fillRect(0,0,530,1890);
	context.font="26px Arial";
	context.fillStyle="#9C7343";
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
		case 'getFriendUserIds':{
			getFriendUserIds();
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