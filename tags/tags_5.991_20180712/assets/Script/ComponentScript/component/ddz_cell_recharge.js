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
        malletText : {
            default : null,
            type : cc.RichText
        },
        diamondText : {
            default : null,
            type : cc.Label
        },
        ratioLabel : {
            default : null,
            type : cc.Label
        },
        redBar : {
            default : null,
            type : cc.Node
        },
        sureBtn : {
            default : null,
            type : cc.Button
        },
        diamondSpr : {
            default : null,
            type : cc.Sprite
        },
    },

    onLoad:function () {
        ty.NotificationCenter.listen(ddz.EventType.UPDATE_CONVERSION_STATE,this.onUpdateBtnState,this);
        hall.GlobalFuncs.btnEffect(this.sureBtn.node,1.1,this);
    },

    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },

    setDetailInformation:function (resultMap) {
        hall.LOGD("","file = [ddz_cell_recharge] fun = [setDetailInformation] resultMap = " + JSON.stringify(resultMap) );
        this.diamondText.string = resultMap.m_diamond;
        this.updateMallet(resultMap.m_mallet);
        // this.updateRedBar(resultMap.radio);
        this.m_id = resultMap.m_id;
        this.m_mallet = resultMap.m_mallet;
        this.m_name = resultMap.m_name;
    },

    updateMallet:function (num) {
        var str = "<color=#FFFFFF>￥" + num + "</c>";
        this.malletText.string = str;
    },

    updateRedBar:function (num) {
        // (Math.round(this * 10000)/100).toFixed(2) + '%';
        if (num && num > 0) {
            this.redBar.active = true;
            this.ratioLabel.string = "多送" + (Math.round(num * 10000)/100) + '%';
        }else {
            this.redBar.active = false;
        }
    },

    onUpdateBtnState: function(isEnabled){
        this.sureBtn.interactable = isEnabled;
    },

    onClickBtn:function () {
        // ddz.LOGD(null,"file = [ddz_cell_mall] fun = [onClickBtn] this.index = " + this.index);
        // ty.NotificationCenter.trigger(ddz.EventType.UPDATE_CONVERSION_STATE,false);
        ty.Recharge.createOrder(this.m_id,this.m_mallet,this.m_name);
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },
});
