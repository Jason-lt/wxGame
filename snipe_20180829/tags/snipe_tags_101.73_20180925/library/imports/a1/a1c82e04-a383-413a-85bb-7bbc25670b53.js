"use strict";
cc._RF.push(module, 'a1c824Eo4NBOoW7e7wlZwtT', 'zidandaoju');
// Script/ComponentScript/window/zidandaoju.js

"use strict";

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
        propNode: cc.Node,
        propSprite: cc.Sprite,
        propSpriteList: [cc.SpriteFrame],
        propTips: cc.Label,
        lightNode: cc.Node,

        gunNode: cc.Node,
        gunSprite: cc.Sprite,
        gunNameLabel: cc.Label,
        gunDescLabel: cc.Label,

        state: -1
    },

    onLoad: function onLoad() {},

    onBlack: function onBlack() {},

    updateProp: function updateProp(state, count) {
        if (!count) {
            count = 1;
        }
        this.state = state;
        if (state == 1) {
            this.propNode.active = true;
            this.gunNode.active = false;
            this.propSprite.spriteFrame = this.propSpriteList[state];
            this.propTips.string = "瞄准器x" + count;
            // this.propTips.string = "手榴弹x1";
        } else if (state == 0) {
            this.propNode.active = true;
            this.gunNode.active = false;
            this.propSprite.spriteFrame = this.propSpriteList[state];
            this.propTips.string = "无限子弹x" + count;
        } else if (state == 2) {
            this.propNode.active = true;
            this.gunNode.active = false;
            this.propSprite.spriteFrame = this.propSpriteList[state];
            this.propTips.string = "手榴弹x" + count;
        } else {
            var type = shot.GameWorld.treasureBoxTypeList[state];
            this.propNode.active = false;
            this.gunNode.active = true;
            this.gunSprite.spriteFrame = this.propSpriteList[state];
            this.gunNameLabel.string = shot.GameWorld.propertyConfig[type].name;
            this.gunDescLabel.string = shot.GameWorld.propertyConfig[type].desc;
        }
        this.playLoopAni(state);
    },

    stopLoopAni: function stopLoopAni(state) {
        var ani;
        var anim2;
        if (this.state <= 1) {
            ani = this.propNode.getComponent(cc.Animation);
            anim2 = ani.getAnimationState("ndwa_0");
        } else {
            ani = this.gunNode.getComponent(cc.Animation);
            anim2 = ani.getAnimationState("daoju_qiang1");
            var anim3 = ani.getAnimationState("daoju_qiang2");
            anim3.stop();
        }
        anim2.stop();
    },

    playLoopAni: function playLoopAni(state) {
        var ani;
        var anim2;
        if (state <= 1) {
            ani = this.propNode.getComponent(cc.Animation);
            anim2 = ani.getAnimationState("ndwa_0");
        } else {
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

    onGetReward: function onGetReward() {
        if (shot.GameWorld.gameGetBox) {
            shot.GameWorld.gamePause = false;
            shot.GameWorld.gameGetBox = false;
            if (shot.GameWorld.bottleCount <= 0) {
                //一局的瓶子打完了
                ty.NotificationCenter.trigger(shot.EventType.GAME_LEVEL_UP);
            }
        }
        this.stopLoopAni();
        this.node.destroy();
    },

    onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    },

    update: function update(dt) {
        this.lightNode.rotation += 0.5;
    }
});

cc._RF.pop();