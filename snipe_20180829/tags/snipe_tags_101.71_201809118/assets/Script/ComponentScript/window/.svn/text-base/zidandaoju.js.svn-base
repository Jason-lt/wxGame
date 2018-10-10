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
        propNode : cc.Node,
        propSprite:cc.Sprite,
        propSpriteList : [cc.SpriteFrame],
        propTips:cc.Label,
        propDescLabel : cc.Label,
        quanSprite : cc.Sprite ,

        state : -1
    },

    onLoad:function(){

    },

    onBlack : function () {

    },

    updateProp:function(state,count){
        if(!count){
            count = 1;
        }
        this.state = state;
        this.propDescLabel.node.active = false;
        this.quanSprite.node.active = true;
        this.propSprite.spriteFrame = this.propSpriteList[state];
        if (state == 1){
            this.propTips.string = "瞄准器x"+count;
        }else if (state == 0){
            this.propTips.string = "无限子弹x"+count;
        }else if (state == 2){
            this.propTips.string = "手榴弹x"+count;
        }else {
            this.quanSprite.node.active = false;
            this.propDescLabel.node.active = true;
            var type = snipe.GameWorld.treasureBoxTypeList[state];
            this.propTips.string = snipe.GameWorld.propertyConfig[type].name;
            this.propDescLabel.string = snipe.GameWorld.propertyConfig[type].desc;
        }
        this.playLoopAni(state);
    },

    stopLoopAni:function (state) {
        var ani;
        var anim2;

        ani = this.propNode.getComponent(cc.Animation);
        anim2 = ani.getAnimationState("huode_tanchuang");
        anim2.stop();
    },

    playLoopAni:function (state) {
        var ani;
        var anim2;
        ani = this.propNode.getComponent(cc.Animation);
        anim2 = ani.getAnimationState("huode_tanchuang");
        anim2.once("finished", function () {
            // var nextAni = ani.getAnimationState("daoju_qiang2");
            // nextAni.play();
        });
        anim2.play();
    },

    onGetReward:function(){
        if(snipe.GameWorld.gameGetBox){
            snipe.GameWorld.gamePause = false;
            snipe.GameWorld.gameGetBox = false;
            if(snipe.GameWorld.bottleCount <= 0) { //一局的瓶子打完了
                ty.NotificationCenter.trigger(snipe.EventType.GAME_LEVEL_UP);
            }
        }
        this.stopLoopAni();
        this.node.destroy();
    },

    onDestroy : function () {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    },

    update:function(dt){
        // this.lightNode.rotation += 0.5;
    }
});
