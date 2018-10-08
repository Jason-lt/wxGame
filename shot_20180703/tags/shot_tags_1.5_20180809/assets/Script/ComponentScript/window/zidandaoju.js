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
        lightNode:cc.Node,

        gunNode : cc.Node,
        gunSprite : cc.Sprite,
        gunNameLabel : cc.Label,
        gunDescLabel : cc.Label,

        state : -1
    },

    onLoad:function(){

    },

    onBlack : function () {

    },

    updateProp:function(state){
        this.state = state;
        if (state == 1){
            this.propNode.active = true;
            this.gunNode.active = false;
            this.propSprite.spriteFrame = this.propSpriteList[state];
            this.propTips.string = "瞄准器x1";
            // this.propTips.string = "手榴弹x1";
        }else if (state == 0){
            this.propNode.active = true;
            this.gunNode.active = false;
            this.propSprite.spriteFrame = this.propSpriteList[state];
            this.propTips.string = "无限子弹x1";
        }else if (state == 8){
            this.propNode.active = true;
            this.gunNode.active = false;
            this.propSprite.spriteFrame = this.propSpriteList[state];
            this.propTips.string = "手榴弹x1";
        }else {
            var type = shot.GameWorld.treasureBoxTypeList[state];
            this.propNode.active = false;
            this.gunNode.active = true;
            this.gunSprite.spriteFrame = this.propSpriteList[state];
            this.gunNameLabel.string = shot.GameWorld.propertyConfig[type].name;
            this.gunDescLabel.string = shot.GameWorld.propertyConfig[type].desc;
        }
        this.playLoopAni(state);
    },

    stopLoopAni:function (state) {
        var ani;
        var anim2;
        if(this.state <= 1){
            ani = this.propNode.getComponent(cc.Animation);
            anim2 = ani.getAnimationState("ndwa_0");
        }else {
            ani = this.gunNode.getComponent(cc.Animation);
            anim2 = ani.getAnimationState("daoju_qiang1");
            var anim3 = ani.getAnimationState("daoju_qiang2");
            anim3.stop();
        }
        anim2.stop();
    },

    playLoopAni:function (state) {
        var ani;
        var anim2;
        if(state <= 1){
            ani = this.propNode.getComponent(cc.Animation);
            anim2 = ani.getAnimationState("ndwa_0");
        }else {
            ani = this.gunNode.getComponent(cc.Animation);
            anim2 = ani.getAnimationState("daoju_qiang1");
            anim2.once("finished", function () {
                var nextAni = ani.getAnimationState("daoju_qiang2");
                nextAni.play();
            });
        }
        anim2.play();
        // var ani = this.node.getComponent(cc.Animation);
        // var anim2 = ani.getAnimationState("ndwa_0");
        // var that = this;
        // anim2.once("finished", function () {
        //     that.autoRound = true;
        // });

    },

    onGetReward:function(){
        if(shot.GameWorld.gameGetBox){
            shot.GameWorld.gamePause = false;
            shot.GameWorld.gameGetBox = false;
            if(shot.GameWorld.bottleCount <= 0) { //一局的瓶子打完了
                ty.NotificationCenter.trigger(shot.EventType.GAME_LEVEL_UP);
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
        this.lightNode.rotation += 0.5;
    }
});
