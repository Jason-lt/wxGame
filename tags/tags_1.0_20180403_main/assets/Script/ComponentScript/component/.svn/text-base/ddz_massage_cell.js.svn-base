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
        detailLabel : {
            default : null,
            type : cc.Label
        },
        diamondSprite : {
            default : null,
            type : cc.Sprite
        },
        countLabel : {
            default : null,
            type : cc.Label
        },
    },
    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },
    setDetailInformation:function (resultMap) {
        // {
        //     "rewardState":1,
        //     "pic":"http://ddz.dl.tuyoo.com/cdn37/hall/avatar/New_avatar_170803.png",
        //     "userId":10666,
        //     "name":"来宾029aseFGg"
        // "bindRewardCount":2,
        //"type":  //1、邀请好友得钻石,2、每日登录赠送钻石
        // }
        if(resultMap.type == 1){
            this.detailLabel.string = "你已成功邀请好友";
        }else if(resultMap.type == 2){
            this.detailLabel.string = "每日登录";
        }else {
            this.detailLabel.string = "出错啦~";
        }
        this.countLabel.string = "x"+resultMap.bindRewardCount;
    },
});
