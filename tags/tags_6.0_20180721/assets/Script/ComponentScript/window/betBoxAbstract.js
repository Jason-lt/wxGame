// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        tipsNode_1:cc.Node,
        tipsNode_2:cc.Node,
        tipsNode_3:cc.Node,
        tipsNode_4:cc.Node,
    },

    onLoad:function(){
        ty.NotificationCenter.listen(ddz.EventType.CLOSE_BETBOXABSTRACT, this.onClose, this);
    },

    setParentScene:function(params){
        this.parentScene = params;
    },

    updateInfo:function(){
        if(this.parentScene){
            var tableinfo = this.parentScene.tableInfo();
            var boxConfig = tableinfo.m_boxConfig;
            ddz.LOGD("","file = [betBoxAblstract] fun = [updateInfo] boxConfig = " + JSON.stringify(boxConfig));
            
            if(boxConfig){
                if (boxConfig.length && boxConfig.length > 0){
                    for (var i = 0; i < boxConfig.length; i++){
                        if (this["tipsNode_" + (i+1)]){
                            var com = this["tipsNode_" + (i+1)].getComponent("boxTipsNode");
                            com.setBoxTips(boxConfig[i].windoubles,boxConfig[i].boxType,i);
                        }
                    }
                }
            }
        }
    },

    onClose:function(){
        this.node.destroy();
    },
    
    onDestroy :function () {
        ty.NotificationCenter.ignoreScope(this);
        this.parentScene = null;
    },

});
