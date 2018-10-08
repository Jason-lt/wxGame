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
        banner:cc.Node,
        betRich:cc.RichText,
        shareRedPacket:cc.Prefab,
        panel:cc.Node,
        btnText:cc.RichText,
    },

    onLoad:function(){
        var that = this;
        this.scheduleOnce(function () {
            var ani = that.banner.getComponent(cc.Animation);
            ani.play('btnTick');
        }, 1);
        this.betRich.node.active = false;
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);

        var _shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondHall;
        this.btnText.string = "<color=#E54D42>"+ hall.GlobalFuncs.getButtonTitle(_shareType) +"</c>";
    },

    playAnimationAfterShareWithType : function (type) {
        if (type && type != ddz.Share.onShareType.clickStatShareTypeGetDiamondHall) {
            return;
        }
        var reultType = ddz.Share.resultType;
        switch (reultType) {
            case 1:
                hall.MsgBoxManager.showToast({title : '请分享到微信群哦~'});
                break;
            case 2:
                hall.MsgBoxManager.showToast({title : '请不要频繁分享到一个群~'});
                break;
            case 3:

                break;
            default:
                break;
        }

        ddz.Share.resultType = 0;
    },

    onShareBtn:function(){
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick,
            ["diamondShare"]);
        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
    },

    updateShareInfo:function(data){
        if (data.newUserMulti){
            this.setBtnRichText(data.newUserMulti);
        }
        if (data.bigReward) {
            var window = cc.instantiate(this.shareRedPacket);
            window.x = 185;
            window.y = -125;
            this.panel.addChild(window);
            var com = window.getComponent('shareRedPacket');
            com.setBigReward(data.bigReward);
        }
        if (data.inviteeList && data.inviteeList.length > 0) {
            var that = this;
            var _index = 0;
            var _inviteeList = data.inviteeList;
            var runOneFun = function () {
                if (_inviteeList.length > 0){
                    var _playerData = _inviteeList.shift();
                    if (_index < 5) {
                        if (that["shareRedPacket_"+_index]) {
                            var com = that["shareRedPacket_"+_index].getComponent('shareRedPacket');
                            com.setSharePeopleInfo(_playerData);
                        }else {
                            that["shareRedPacket_"+_index] = cc.instantiate(that.shareRedPacket);
                            switch (_index) {
                                case 0:{
                                    that["shareRedPacket_"+_index].x = -185;
                                    that["shareRedPacket_"+_index].y = 126;
                                    break;
                                }
                                case 1:{
                                    that["shareRedPacket_"+_index].x = 0;
                                    that["shareRedPacket_"+_index].y = 126;
                                    break;
                                }
                                case 2:{
                                    that["shareRedPacket_"+_index].x = 185;
                                    that["shareRedPacket_"+_index].y = 126;
                                    break;
                                }
                                case 3:{
                                    that["shareRedPacket_"+_index].x = -185;
                                    that["shareRedPacket_"+_index].y = -125;
                                    break;
                                }
                                case 4:{
                                    that["shareRedPacket_"+_index].x = 0;
                                    that["shareRedPacket_"+_index].y = -125;
                                    break;
                                }
                            }

                            that.panel.addChild(that["shareRedPacket_"+_index]);
                            var com = that["shareRedPacket_"+_index].getComponent('shareRedPacket');
                            com.setSharePeopleInfo(_playerData);
                        }
                        _index++;
                        requestAnimationFrame(runOneFun);
                    }

                }
            };

            runOneFun();
        }

        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_REWARD_COUNT,data);
    },

    setBtnRichText:function(_bet) {
        if (_bet > 0) {
            this.betRich.node.active = true;
            this.betRich.string = "<color=#9C7343>新玩家点击，可获得</c><color=#ED4824><size=30>" + _bet + "倍奖励</color>";
        }
    },

    removeLoopAni:function () {
        var ani = this.banner.getComponent(cc.Animation);
        ani.stop();
    },

    shut:function () {
        this.removeLoopAni();
        this.node.destroy();
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },

    onClose:function(){
        this.shut();
        ddz.ddz_dayWelfare = null;
    },
});
