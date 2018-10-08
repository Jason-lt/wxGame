// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        txtServer : cc.EditBox,
        btnChange : cc.Button,
        btnReset : cc.Button,
        txtFTID : {
            default : null,
            type : cc.EditBox
        },

        userIdlabel:cc.Label,
        onLaunchParamsLabel : cc.Label,
        onShowParamsLabel : cc.Label
    },

    onLoad:function () {
        var that = this;
        var serPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "");
        this.btnChange.node.on('click', function (evet) {
            hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, that.txtServer.string);
            hall.MsgBoxManager.showToast({title:'服务器地址已更新,请退出重新登录!'});
        });

        this.btnReset.node.on('click', function (evet) {
            that.txtServer.string = "";
            hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "");

            hall.MsgBoxManager.showToast({title:'服务器地址已重置'});
        });

        ddz.LOGD(null, "当前的SDK地址:" + serPath);

        this.txtServer.string = serPath;
    },
    //TODO:加入好友房的处理
    onEnterTable:function () {
        var ftid = this.txtFTID.string;
        if(ftid == '20180407'){
            ty.NotificationCenter.trigger(ddz.EventType.CHANGE_DEBUG_MODE,false);
        }else {
            ddz.friendModel.enterFriendTable(ftid);
        }
        // ddz.MsgFactory.resumeMatch();

        //牌弄测试,上手牌33344497,本家KKKKQQQQ

        // var topCards = [2,15,28, 3, 16, 29, 8 ,7];
        // var myCards = [12, 25, 38, 51, 11, 24, 37, 50];
        // var myCards = [
        //     0, 13, 26, 39,
        //     12, 25, 38, 51,
        //     11, 24, 37, 50,
        //     10, 23, 36, 49,
        //     9, 22, 35, 48
        // ];

        // var types = ddz.RobotGlobal.judgeType(topCards);
        // var types2 = ddz.RobotGlobal.judgeType(myCards);
        // ddz.LOGD(this._TAG, types2.length);

        // types2.isLargerThan(types)
        // 计算被动提示牌
        // var playTips = ddz.RobotGlobal.findWinCardsFromArray(types[0], myCards);
        //管不上
        // if (playTips.length == 0) {
        //     ddz.LOGD(this._TAG, "no cards larger than top card");
        //     return true;
        // }
    },
    testWithString : function () {
        // this.mainScene
        this.userIdlabel.string = "userId  :   "+ ty.UserInfo.userId;

        var sceneInfo = wx.getLaunchOptionsSync();
        this.onLaunchParamsLabel.string = "Launch：  "+JSON.stringify(sceneInfo);

        var onShowString = hall.GlobalFuncs.ReadStringFromLocalStorage(ddz.gameModel.ONSHOW_PARAMS,"");
        this.onShowParamsLabel.string = "onShow :  " + onShowString;
    }

});