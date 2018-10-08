

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
        titleLabel2 : {
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
            default : null
        },

        btnRichtext : {
            default : null,
            type : cc.RichText
        }

    },

    onLoad :function() {
        this.rankButton.node.on("click",this.onRankButton,this);
        this.startButton.node.on("click",this.onStartButton,this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_RANK_LIST, this.updateRankList, this);
        // ty.NotificationCenter.listen(ddz.EventType.SCROLLTOBOTTOM, this.scrollViewToBottom, this);
        //替换button
        // this.changeButtonToRank();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WAIT_INFO, this.changeButtonTitleString, this);
        ty.NotificationCenter.listen(ddz.EventType.RECIVE_MATCH_RECORD, this.changeButtonTitleString, this);
    },

    updateRankList:function(){
        hall.LOGE("=="," file = [ddz_rank_list] fun = [updateRankList] ");
        this.detailPanel.active = true;
        if(this.parentScene){
            this.parentScene.showBackButton();
        }
    },

    changeButtonToRank : function () {
        this.changeButtonTitleString();
        this.startButton.node.active = true;
        this.rankButton.node.active = false;
        this.titleLabel.string = "群财富榜";
        this.titleLabel2.string = "群奖金榜";
    },
    changeButtonTitleString : function () {
        var  stage = ddz.matchModel.getStageIndex();
        var titlS = "";
        if (ddz.matchModel.showBack()) {
            if (stage > 1) {
                titlS = "<img src='ddz_main_icon_begin'/><color=#ffffff> 继续第"+stage+ "关" + " </color>";
            }else {
                titlS = "<img src='ddz_main_icon_begin'/><color=#ffffff> 开始闯关 </color>";
            }
        }else {
            titlS = "<img src='ddz_main_icon_begin'/><color=#ffffff> 开始闯关 </color>";
        }

        // var _tile = ddz.matchModel.showBack();
        // hall.LOGD("","ddz = [ddz_rank_list] fun = [changeButtonToRank] _tile = " + _tile);
        // var titlS = "";
        // if (_tile){
        //     titlS = "<img src='ddz_main_icon_begin'/><color=#ffffff> 继续闯关</color>"
        // }else {
        //     titlS = "<img src='ddz_main_icon_begin'/><color=#ffffff> 开始闯关</color>"
        // }
        this.btnRichtext.string = titlS;
    },
    onRankButton : function () {
        var shareType = ddz.Share.onShareType.clickStatShareTypeRankList;
        ddz.Share.shareWithType(shareType);
    },
    onStartButton : function () {
        ddz.LOGD(null, "木有了");
        this.detailPanel.active = false;
        if(this.parentScene){
            this.parentScene.hideBackButton();
        }

        ddz.matchModel.startMatchProgress();
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
