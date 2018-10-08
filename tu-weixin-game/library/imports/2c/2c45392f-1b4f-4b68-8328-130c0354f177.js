"use strict";
cc._RF.push(module, '2c453kvG09LaIMoEwwDVPF3', 'ddz_rank_list');
// Script/ComponentScript/window/ddz_rank_list.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // tableView : {
        //     default : null,
        //     type : cc.Node
        // },
        rankButton: {
            default: null,
            type: cc.Button
        },

        startButton: {
            default: null,
            type: cc.Button
        },
        detailPanel: {
            default: null,
            type: cc.Node
        },
        parentScene: {
            default: null
        },

        btnRichtext: {
            default: null,
            type: cc.RichText
        }

    },

    onLoad: function onLoad() {
        this.rankButton.node.on("click", this.onRankButton, this);
        this.startButton.node.on("click", this.onStartButton, this);
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_RANK_LIST, this.updateRankList, this);
        // ty.NotificationCenter.listen(ddz.EventType.SCROLLTOBOTTOM, this.scrollViewToBottom, this);
        //替换button
        // this.changeButtonToRank();
        ddz.matchModel.getMatchDes();
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_MATCH_DES, this.changeButtonTitleString, this);

        // ty.NotificationCenter.listen(ddz.EventType.UPDATE_WAIT_INFO, this.changeButtonTitleString, this);
        // ty.NotificationCenter.listen(ddz.EventType.RECIVE_MATCH_RECORD, this.changeButtonTitleString, this);
    },

    updateRankList: function updateRankList() {
        hall.LOGW("==", " file = [ddz_rank_list] fun = [updateRankList] ");
        this.detailPanel.active = true;
        if (this.parentScene) {
            this.parentScene.showBackButton();
        }
    },

    changeButtonToRank: function changeButtonToRank() {
        this.changeButtonTitleString();
        this.startButton.node.active = true;
        this.rankButton.node.active = false;
    },
    changeButtonTitleString: function changeButtonTitleString() {
        var matchDes = ddz.matchModel.getCurDes();
        var savaInfo = matchDes.saveInfo;
        if (matchDes.matchId == 6789 && savaInfo && savaInfo.record && savaInfo.record.stageIndex) {
            var _stageIndex = savaInfo.record.stageIndex;
            if (_stageIndex && _stageIndex > 1) {
                this.btnRichtext.string = "<img src='ddz_main_icon_begin'/><color=#ffffff> 继续第" + _stageIndex + "关" + " </color>";
            } else {
                this.btnRichtext.string = "<img src='ddz_main_icon_begin'/><color=#ffffff>   开始闯关</color>";
            }
        }
    },
    onRankButton: function onRankButton() {
        var shareType = ddz.Share.onShareType.clickStatShareTypeRankList;
        ddz.Share.shareWithType(shareType);
    },
    onStartButton: function onStartButton() {
        ddz.LOGD(null, "木有了");
        this.detailPanel.active = false;
        if (this.parentScene) {
            this.parentScene.hideBackButton();
        }

        ddz.matchModel.startMatchProgress();
        // var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onDestroy: function onDestroy() {
        // this.button.node.off('click', this.callback, this);
        ty.NotificationCenter.ignoreScope(this);
    }
    // update (dt) {},
});

cc._RF.pop();