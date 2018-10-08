

cc.Class({
    extends: cc.Component,

    properties: {
        startRichText : {
            default : null,
            type : cc.RichText
        }
    },
    onLoad : function () {
        //屏幕适配
        // var widthScaling = ddz.GlobalFuncs.getWindowWidthscaling();
        // this.titleL.fontSize = this.titleL.fontSize*widthScaling;
        // this.detailText.fontSize = this.detailText.fontSize*widthScaling;
        // this.coutLabel.fontSize = this.coutLabel.fontSize*widthScaling;
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_WAIT_INFO, this.changeEnterBtnState, this);
        ty.NotificationCenter.listen(ddz.EventType.RECIVE_MATCH_RECORD, this.changeEnterBtnState, this);
        this.changeEnterBtnState(ddz.matchModel.getStageIndex());
    },
    changeEnterBtnState:function (_stageIndex) {
        if (ddz.matchModel.showBack()) {
            if (_stageIndex > 1) {
                this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff> 继续第"+_stageIndex+ "关" + " </color>";
            }else {
                this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff> 开始闯关 </color>";
            }
        }else {
            this.startRichText.string = "<img src='ddz_main_icon_begin'/><color=#ffffff> 开始闯关 </color>";
        }
    },
    onDestroy : function () {
        // this.button.node.off('click', this.callback, this);
        ty.NotificationCenter.ignoreScope(this);
    }
});
