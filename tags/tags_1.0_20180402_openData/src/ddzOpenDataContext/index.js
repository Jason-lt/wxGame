

var logD = function (string) {
	console.log(string);
};

/**
更新用户托管数据
*/
var updateRank = function(data){
	wx.setUserCloudStorage({
		KVDataList :[{key:'rank',value:data.rank},{key:'userId',value:data.userId+""}],
		success : function () {
			logD("setUserCloudStorage===="+data.rank+"===="+ JSON.stringify(arguments));
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
		keyList:["avatarUrl","nickName","rank",'userId'],
		success : function (result) {
			var resultData = result.data;
			drawRankList(resultData,data.userId);
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
		keyList:["avatarUrl","nickName","rank",'userId'],
		success : function (result) {
			var resultData = result.data;
			drawRankList(resultData,data.userId);
		},
		fail : function () {logD(null, JSON.stringify(arguments));},
		complete : function () {},
	});
};

var drawRankList = function (rankDatas,userId) {
	logD("drawRankList+++++++++++++++++"+JSON.stringify(rankDatas));
	//排序
	for (var j = 1 ; j < rankDatas.length;j ++){
		var temp = rankDatas[j];
		if(!temp){
			break;
		}
		var number1 = 0;
		if(temp.KVDataList && temp.KVDataList[0]){
			number1 = parseInt(temp.KVDataList[0].value);
		}
		var k = j -1;
		while ( k >= 0 ){
			var number2 = 0;
			if(rankDatas[k].KVDataList && rankDatas[k].KVDataList[0]){
				number2 = parseInt(rankDatas[k].KVDataList[0].value);
			}
			if(number1 > number2){
				rankDatas[k+1] = rankDatas[k];
				rankDatas[k] = temp;
				k --;
			}else {
				break;
			}
		}
	}
	//选出自己,放在最前面
	for (var i = 0 ; i < rankDatas.length ; i ++){
		var userKVData = rankDatas[i].KVDataList;
		if(userKVData && userKVData.length == 2){
			var user = userKVData[1];
			if(user.value == userId){
				rankDatas[i].rank = i + 1;
				rankDatas.unshift(rankDatas[i]);
				break;
			}
		}
	}

	var shareCanvas = wx.getSharedCanvas();
	var context = shareCanvas.getContext("2d");
	context.clearRect(0,0,530,1890);

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
			if (i < rankDatas.length){
				//排行
				context.textAlign="center";
				if(i < 4){
					if(i == 0){
						rankS = rankDatas[0].rank;
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
				context.fillText(rankDic.nickname,186,baseHeight);

				//次数
				context.textAlign="right";
				if(rankDic.KVDataList[0] && rankDic.KVDataList[0].value){
					context.fillText(rankDic.KVDataList[0].value+"次",480,baseHeight);
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

wx.onMessage(function(data) {

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
  }

});