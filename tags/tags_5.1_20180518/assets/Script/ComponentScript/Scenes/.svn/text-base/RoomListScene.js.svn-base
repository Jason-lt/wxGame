// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        backButton : {
            default : null,
            type : cc.Button
        },
        tableView : {
            default : null,
            type : cc.Node
        },

        scrollView : {
            default : null,
            type : cc.ScrollView
        },

        personalAssets : {
            default : null,
            type : cc.Node
        },

        conversionSuccess : {
            default : null,
            type : cc.Prefab
        },

        cellHeight:243,

        ddz_cell_roomlist:cc.Prefab,

        leftCellX:-156,
        rightCellX:156,
    },

    onLoad:function () {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
        this.isOnStart = false;
        this.play_mode;
        this.content = this.scrollView.content;
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_HALL_INFO, this.onHallInfo, this);
        // 请求房间列表
        hall.MsgFactory.getHallInfo(ty.SystemInfo.gameId);
        ty.NotificationCenter.listen(ddz.EventType.CONVERSION_SUCCESS,this.onConversionSuccess,this);
       
        ty.NotificationCenter.listen(ddz.EventType.SAVE_MATCH_SUCCESS, this.onSaveMatch, this);
        this.setPersonalAssets();
    },

    setPlayMode:function(playMode) {
        this._playMode = playMode;
    },

    onHallInfo:function () {
        // 经典场
        var roomInfo = hall.gameWorld.getRoomsByType(ddz.Enums.PlayType.PLAY_TYPE_JINGDIAN);
        if (this._playMode) {
            switch (this._playMode) {
                case 1:
                    roomInfo = hall.gameWorld.getRoomsByType(ddz.Enums.PlayType.PLAY_TYPE_JINGDIAN);
                    break;
                case 2:
                    roomInfo = hall.gameWorld.getRoomsByType(ddz.Enums.PlayType.PLAY_TYPE_LAIZI);
                    break;
                default:
                    break;
            }
        }
        
        this.isOnStart = false;
        ddz.LOGD(null,"file = [RoomListScene] fun = [onHallInfo] roomInfo = " + JSON.stringify(roomInfo));
        this.updateRoomList(roomInfo);
    },

    updateRoomList:function (roomInfo) {
        // var window = this.tableView.getComponent('ddz_tableView');
        // window.setDataArray(roomInfo);
        this.content.removeAllChildren();
        this.scrollView.content.height = Math.ceil(roomInfo.length/2) * this.cellHeight;
        var isOnce = true;
        if (roomInfo.length > 0) {
            for (var i = 0; i < roomInfo.length; i++) {
                var cell = cc.instantiate(this.ddz_cell_roomlist);
                var com = cell.getComponent('ddz_cell_roomlist');
                com.addDataWithObject(roomInfo[i]);
                com.index = i;
                if (roomInfo[i].play_mode){
                    this.play_mode = roomInfo[i].play_mode;
                }

                if ((i%2) == 0) {
                    cell.x = this.leftCellX;
                }else {
                    cell.x = this.rightCellX;
                }
                cell.y = - Math.floor(i/2) * this.cellHeight - (this.cellHeight / 2) - 5;
                this.content.addChild(cell);

                var _chip = hall.ME.getChip();
                if (isOnce && _chip <= roomInfo[i].minQuickStartChip){
                    isOnce = false;
                    var index = 0;
                    if (i > 0){
                        index = i -1;
                    }
                    ty.NotificationCenter.trigger(ddz.EventType.UPDATE_ROOMLIST_KUANG,index);
                }
            }

            if (isOnce) {
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_ROOMLIST_KUANG,roomInfo.length - 1);
            }
        }
        
    },

    onConversionSuccess : function (num) {
        // if (this._success) {
        //     ty.Timer.cancelTimer(this,function(){
        //         this._success.removeFromParent();
        //         this._success = null;
        //     });
        // }
        // this._success = cc.instantiate(this.conversionSuccess);
        //
        // var winSize = cc.director.getWinSize();
        // this._success.x = winSize.width/2;
        // this._success.y = winSize.height/2 + 103;
        //
        // cc.director.getScene().addChild(this._success);
        // var window = this._success.getComponent('conversionSuccess');
        // var str = "<img src='ddz_coin_white'/><color=#FFFFFF> " + num + "</c>";
        // window.updateCoinText(str);
        // var tips = "兑换成功";
        // window.updateTipsText(tips);
        //
        // ty.Timer.setTimer(this, function(){
        //     if (this._success) {
        //         this._success.removeFromParent();
        //         this._success = null;
        //     }
        // }, 3, 0, 0);
    },

    // 点击tips 邀请好友按钮
    onClickCenterButton:function(){
        var shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondHall;
        ddz.Share.shareWithType(shareType);
    },

    setPersonalAssets:function () {
        // 个人财产信息
        var wimdow = this.personalAssets.getComponent("personalAssets");
        wimdow.updateInfo();
    },

    onSaveMatch:function () {
        if (this.isOnStart) {
            this.isOnStart = false;
            var _gameId = ty.SystemInfo.gameId || ty.SystemInfo.hallId;

            hall.MsgFactory.getQuickStart(ty.UserInfo.userId, _gameId, null, hall.staticSystemInfo.version, null, null, null,null,null,this.play_mode);
            // hall.MsgFactory.getQuickStart(ty.UserInfo.userId, _gameId, null, hall.staticSystemInfo.version, null, null, null,null,null,this.play_mode);
        }
    },

    // 快速开始
    quickBegan:function () {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["roomListClick","快速开始"]);
        if (ddz.matchModel.getCurWaitInfo()){
            this.isOnStart = true;
            ddz.MsgFactory.saveMatch();
        } else {
            this.isOnStart = false;
            var _gameId = ty.SystemInfo.gameId || ty.SystemInfo.hallId;
            hall.MsgFactory.getQuickStart(ty.UserInfo.userId, _gameId, null, hall.staticSystemInfo.version, null, null, null,null,null,this.play_mode);
        }
    },

    backAction : function () {
        ddz.LOGD(null, "file = [RoomListScene] fun = [backAction]");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.popScene();
    },

    onDestroy : function () {
        this._playMode = null;
        ty.NotificationCenter.ignoreScope(this);
    },
    
});
