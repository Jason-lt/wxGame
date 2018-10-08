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
        backButton : {
            default : null,
            type : cc.Button
        },
        tableView : {
            default : null,
            type : cc.Node
        },

        personalAssets : {
            default : null,
            type : cc.Node
        },

        conversionSuccess : {
            default : null,
            type : cc.Prefab
        },

    },

    onLoad : function () {
        ddz.GlobalFuncs.drawGameCanvas();
        var backButtonH = ddz.GlobalFuncs.getBackButtonPositionY();
        if (backButtonH){
            this.backButton.node.y = backButtonH;
        }

        this.updateMallData();

        ty.NotificationCenter.listen(ddz.EventType.CHARGE_SUCCESS,this.onConversionSuccess,this);
        
    },

    updateMallData:function(){
        var _m_diamondList = hall.gameWorld.model.m_diamondList;

        // 个人财产信息
        var wimdow = this.personalAssets.getComponent("personalAssets");
        wimdow.updateInfo();

        var resultArr = [];
        if (_m_diamondList.length <= 0) {
            return
        }
        for (var i = 0; i < _m_diamondList.length; i++){
            var addMap = {};
            addMap.m_diamond = _m_diamondList[i].m_price_diamond;
            addMap.m_mallet = _m_diamondList[i].m_price;
            addMap.m_id = _m_diamondList[i].m_id;
            addMap.m_name = _m_diamondList[i].m_name;
            // addMap.radio = 0;
            resultArr.push(addMap);
        }
        var window = this.tableView.getComponent('ddz_tableView');
        window.setDataArray(resultArr);
    },

    onConversionSuccess : function (num) {
        hall.LOGW(null,"file = [RechargeScene] fun = [onConversionSuccess] num = ");
        var that = this;
        if (this._success) {
            ty.Timer.cancelTimer(this,function(){
                hall.LOGW(null,"file = [MallScene] fun = [onConversionSuccess] canceTimer");
                ty.NotificationCenter.trigger(ddz.EventType.UPDATE_CONVERSION_STATE,false);
                that._success.removeFromParent();
                that._success = null;
            });
        }
        this._success = cc.instantiate(this.conversionSuccess);

        var winSize = cc.director.getWinSize();
        this._success.x = winSize.width/2;
        this._success.y = winSize.height/2 + 103;

        cc.director.getScene().addChild(this._success);
        var window = this._success.getComponent('conversionSuccess');
        var str = "<img src='ddz_button_diamond'/><color=#FFFFFF> " + num + "</c>";
        window.updateCoinText(str);
        var tips = "购买成功";
        window.updateTipsText(tips);

        ty.Timer.setTimer(this, function(){
            if (that._success) {
                that._success.removeFromParent();
                that._success = null;
            }
            ty.NotificationCenter.trigger(ddz.EventType.UPDATE_CONVERSION_STATE,true);
        }, 3, 0, 0);
    },

    // 钻石不够
    diamondInsufficient : function (_tips) {
        ddz.LOGD(null,"file = [MallScene] fun = [diamondInsufficient] _tips = " + JSON.stringify(_tips));
        var preFabPath = "prefabs/ddz_window_tips";
        var  comName = "ddz_tipsWindow";
        var that = this;
        hall.GlobalFuncs.showPopWinByPreFab(preFabPath, function (preFabNode) {
            var window = preFabNode.getComponent(comName);
            window.parentScene = that;
            var testArray = [
                {
                    title :"邀请好友",
                    bottomType : 0
                }
            ];
            var tips = _tips;
            window.setTitleContentAndButtons("提示",tips, testArray);
        });
        ty.NotificationCenter.trigger(ddz.EventType.UPDATE_CONVERSION_STATE,true);
    },

    // 点击tips 邀请好友按钮
    onClickCenterButton:function(){
        var shareType = ddz.Share.onShareType.clickStatShareTypeGetDiamondHall;
        ddz.Share.shareWithType(shareType);
    },

    backAction : function () {
        ddz.LOGD(null, "file = [MallScene] fun = [backAction]");
        ddz.AudioHelper.playEffect(ddz.EffectPath_mp3.back_button_click_sound, false);
        var sceneName = 'Ddz';
        // cc.director.loadScene(sceneName);
        hall.GlobalFuncs.popScene();
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
    },

});
