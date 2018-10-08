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
        avatar : {
            default : null,
            type : cc.Node
        },
        nickName : {
            default : null,
            type : cc.Label
        },
        uid : {
            default : null,
            type : cc.Label
        },
        totalCount : {
            default : null,
            type : cc.Label
        },
        winCount : {
            default : null,
            type : cc.Label
        },
        winRatioCount : {
            default : null,
            type : cc.Label
        },
        maxBetCount : {
            default : null,
            type : cc.Label
        },
        backButton : {
            default : null,
            type : cc.Button
        }
    },

    onLoad: function () {
        var wimdow = this.avatar.getComponent("Avatar");
        if(ty.UserInfo.userPic){
            wimdow.setAvatarUrl(ty.UserInfo.userPic);
            wimdow.hideNameDisplay();
        }
        this.nickName.string = "昵称 : " + ty.UserInfo.userName;
        this.uid.string = "账号 : " + ty.UserInfo.userId;

        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }
    },

    updateInfo:function(){
        // 模拟数据
        // var data = {};
        // data.total = 0;
        // data.maxWin = 0;
        // data.winRatio = "0%";
        // data.maxBet = 0;
        //
        // this.totalCount.string = data.total || 0;
        // this.winCount.string = data.maxWin || 0;
        // this.winRatioCount.string = data.winRatio || 0 + '%';
        // this.maxBetCount.string = data.maxBet || 0;

        this.totalCount.node.active = false;
        this.winCount.node.active = false;
        this.winRatioCount.node.active = false;
        this.maxBetCount.node.active = false;
    },

    backAction:function () {
        this.node.removeFromParent();
    },


});
