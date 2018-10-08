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
        titleLable: {
            default: null,
            type: cc.Label
        },
        tipDes1: {
            default: null,
            type: cc.Label
        },
        tipDes2: {
            default: null,
            type: cc.Label
        },
        tipDesRich2: {
            default: null,
            type: cc.RichText
        },
        closeButton: {
            default: null,
            type: cc.Button
        },
        cancelButton: {
            default: null,
            type: cc.Button
        },
        OKButton: {
            default: null,
            type: cc.Button
        },
        okButtonLable: {
            default: null,
            type: cc.RichText
        }
    },

    onLoad: function() {
        ddz.matchModel.isShowingRevive = true;
        ty.NotificationCenter.listen(ddz.EventType.ACTION_CHALLENGE, this.close, this);
        ty.NotificationCenter.listen(ddz.EventType.ARENA_SEND_MATCH_BACK, this.close, this);
        ty.NotificationCenter.listen("arena_revive_share_person", this.showTips, this);
        ty.NotificationCenter.listen("arena_match_back", this.arenaMatchBack, this);
        ty.NotificationCenter.listen(ddz.EventType.SHOW_MATCH_REVIVE, this.showSelf, this);
    },

    showSelf:function () {
        this.node.active = true;
    },

    /**
     {"index":1,"name":"90进75","riseUserCount":75,"totalUserCount":90,"canBack":0,"backFee":"1个钻石","backFeeCount":1}

     * @param matchDes
     * @param stageIndex
     */
    setMatchInfo: function(matchDes, stageIndex) {
        this.matchDes = matchDes;
        this.stageIndex = stageIndex;
        var curArenaConfig = ddz.gameModel.getArenaMatchConfigJson()[this.matchDes.matchId.toString()];
        var sharePointValue = curArenaConfig["reviveSharePoint"];
        this.sharePoint = sharePointValue;
        var leftCount = ddz.ShareRecord[this.sharePoint.toString()] && ddz.ShareRecord[this.sharePoint.toString()].leftCount;
        for(var i in this.matchDes.stages) {
            if(this.matchDes.stages[i].index == this.stageIndex) {
                var stage = this.matchDes.stages[i];
                if(stage.canBack == 1) {
                    this.feeCount = stage.backFeeCount;
                    this.shareRewardOnceCount = 1;
                    if(curArenaConfig["shareRewardOnce"]["type"] == 'diamond') {
                        this.shareRewardOnceCount = curArenaConfig["shareRewardOnce"]["count"];
                    }
                    this.getRewardCount = Math.ceil(this.feeCount/this.shareRewardOnceCount);
                    if(stageIndex <= curArenaConfig["maxStageForReviveShare"] && this.getRewardCount <= leftCount) {
                        //分享复活
                        this.feeType = 'share';
                    } else {
                        //钻石复活
                        this.feeType = 'diamond';
                    }
                    this.updateByReviveType();
                } else {
                    hall.LOGD("arena revive","something error");
                }
            }
        }
    },

    updateByReviveType: function() {
        if(this.feeType == 'share') {
            this.tipDes2.node.active = true;
            this.tipDesRich2.node.active = false;
            this.okButtonLable.string = "<color=#ffffff>分享到群</color>";
        } else if(this.feeType == 'diamond') {
            this.tipDes2.node.active = false;
            this.tipDesRich2.node.active = true;
            this.tipDesRich2.string = "<color=#1A6951>使用 </c><img src='dda_button_diamond_black' height=30 width=34/><color=#1A6951> "+ this.feeCount + "可以继续挑战</c>";
            this.okButtonLable.string = "<color=#ffffff>使用</c><img src='dda_button_diamond' height=34 width=43/>";
        } else {
            hall.LOGE("something error","fix it");
        }
    },

    onClickClose: function() {
        ddz.matchModel.matchGiveUp(this.matchDes.roomId, this.matchDes.matchId);
        this.close();
    },

    onClickCancel: function() {
        ddz.matchModel.matchGiveUp(this.matchDes.roomId, this.matchDes.matchId);
        this.close();
    },

    onClickOK: function() {
        var that = this;
        if(this.feeType == 'diamond') {
            ddz.matchModel.matchBack(this.matchDes.roomId, this.matchDes.matchId);
        }
        else if(this.feeType == 'share') {
            ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeRevial, function (result) {
                //分享成功
                if (result.hasOwnProperty('shareTickets')){
                    //分享到了群
                    ddz.LOGD("ddz_revivalWindow", "分享到了群!");
                    ddz.waitGetRevial = {
                        sharePoint: that.sharePoint,
                        matchType: 'arena',
                        matchDes : that.matchDes,
                        type : 'send',
                        needCount : that.getRewardCount
                    };
                }
                else{
                    ddz.LOGD("ddz_revivalWindow", "分享到了个人!");
                    ddz.waitGetRevial = null;
                    ty.NotificationCenter.trigger("arena_revive_share_person");
                }

            });
        }
        this.node.active = false;//这里不能删除,因为钻石不足的弹窗监听在这窗口上
    },

    showTips: function() {
        var msg = "只有分享到微信群才有效哦~";
        hall.MsgBoxManager.showToast({title : msg});
    },


    close: function() {
        ddz.matchModel.isShowingRevive = false;
        ty.NotificationCenter.ignoreScope(this);
        this.node.removeFromParent();
    },

    onDestroy: function() {
        ddz.matchModel.isShowingRevive = false;
        ty.NotificationCenter.ignoreScope(this);
    },

    arenaMatchBack: function(value) {
        if(this.matchDes.matchId == value.result.matchId) {
            if(value.error) {
                var tipsString = value.error.info;
                var preFabPath = "prefabs/ddz_window_normal";
                var  comName = "ddz_window_normal";
                var that = this;
                hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
                    var window = preFabNode.getComponent(comName);
                    var tiString = "分享到群";

                    window.setTitleContentAndButtonsString("提示","<color=#1A6951>" + tipsString + "</c>",[{title:tiString,callFunc : function () {
                        ddz.Share.shareWithType(ddz.Share.onShareType.clickStatShareTypeGetDiamondHall);
                    }}], function () {
                        ddz.matchModel.matchGiveUp(that.matchDes.roomId, that.matchDes.matchId);
                    });
                });
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});