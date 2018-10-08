

cc.Class({
    extends: cc.Component,

    properties: {
        // tableView : {
        //     default : null,
        //     type : cc.Node
        // },
        titleLabel : {
            default : null,
            type : cc.Label
        },
        defaultLabel : {
            default : null,
            type : cc.Label
        },
        rankButton : {
            default : null,
            type : cc.Button
        },

        startButton : {
            default : null,
            type : cc.Button
        },
        detailPanel : {
            default : null,
            type : cc.Node
        },
        parentScene :{
            default : null,
        },

    },

    onLoad :function() {
        this.rankButton.node.on("click",this.onRankButton,this);
        this.startButton.node.on("click",this.onStartButton,this);
        // ty.NotificationCenter.listen(ddz.EventType.SCROLLTOBOTTOM, this.scrollViewToBottom, this);
        //替换button
        // this.changeButtonToRank();
    },
    // setOrigData : function (dataA) {
    //     if (dataA && dataA.length > 0){
    //         this.defaultLabel.node.active = false;
    //         this.tableView.active = true;
    //
    //         // for (var i = 0 ; i < dataA.length ; i ++){
    //         //     var tempObject = dataA[i];
    //         //     if (tempObject.userId && tempObject.userId == ty.UserInfo.userId){
    //         //         //
    //         //         var addObject = new Object(tempObject);
    //         //         addObject.isSelf = true;
    //         //         dataA.unshift(addObject);
    //         //         break;
    //         //     }
    //         // }
    //         var window = this.tableView.getComponent('ddz_tableView');
    //         window.setDataArray(dataA);
    //     }else {
    //         this.defaultLabel.node.active = true;
    //         this.tableView.active = false;
    //     }
    // },

    // scrollViewToBottom : function () {
    //     // var window = this.tableView.getComponent('ddz_tableView');
    //     // var testA = [];
    //     // for (var  i = 25;i < 50 ; i ++){
    //     //     var obj = {"data" :[(i+1)+"","你好啊",15,i+""]};
    //     //     testA.push(obj);
    //     // }
    //     // window.addDataArray(testA);
    // },

    changeButtonToRank : function () {
        this.startButton.node.active = true;
        this.rankButton.node.active = false;
        this.titleLabel.string = "群通关榜";
    },
    onRankButton : function () {
        // var tempFilePath = canvas.toTempFilePathSync({
        //     x: 0,
        //     y: 0,
        //     width: 360,
        //     height: 288,
        //     destWidth: 360,
        //     destHeight: 288
        // });
        // hall.LOGE(null, "tempFilePathtempFilePathtempFilePath==="+tempFilePath);

        var titleA = ddz.GameWorld.shareMassageList.rankList;
        var imageA = ddz.GameWorld.shareImageList.rankList;
        ty.TuyooSDK.shareWithTitleArrayAndImageArray(titleA,imageA);
    },
    onStartButton : function () {
        ddz.LOGD(null, "木有了");
        if (ddz.matchModel.showBack()){
            if (ddz.matchModel.getCurWaitInfo().state == 2){
                ddz.matchModel.matchChallenge();
            } else if(ddz.matchModel.getCurWaitInfo().state == 1){ //在牌桌打牌中
                //在打牌中进入群排行榜(错误信息)
            } else{
                //重新开始
                ddz.matchModel.waitSignin = true;
                ddz.matchModel.matchGiveUp();
            }
        } else{
            ddz.matchModel.matchSignin();
        }
        this.detailPanel.active = false;
        if(this.parentScene){
            this.parentScene.hideBackButton();
        }
        // var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onDestroy : function () {
        // this.button.node.off('click', this.callback, this);
        ty.NotificationCenter.ignoreScope(this);

    }
    // update (dt) {},
});
