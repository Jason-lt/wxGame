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
    ctor : function () {
        this.bulletAniNodePool = null;
    },

    properties: {
        gunAniNode : {
            default : null,
            type : cc.Node
        },
        bulletAniNode : {
            default : null,
            type : cc.Node
        },
        bulletAniPrefab : {
            default : null,
            type : cc.Prefab
        },
        isAction : false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        this.bulletAniNodePool = new cc.NodePool();
        for (var i = 0; i <  15; i++) {
            this.bulletAniNodePool.put(cc.instantiate(this.bulletAniPrefab)); // 通过 putInPool 接口放入对象池
        }
    },

    openFire : function () {
        // hall.LOGW("===","========openFire=====");
        shot.AudioHelper.playEffect(shot.EffectPath_mp3.gunHits,false);

        this.playGunAni();
    },

    stopGunAni : function () {
        if(this.isAction){
            var ani = this.gunAniNode.getComponent(cc.Animation);
            var anim = ani.getAnimationState("qiang");
            anim.stop();
        }
    },
    playGunAni:function () {
        this.stopGunAni();
        this.isAction = true;
        var that = this;
        var ani = this.gunAniNode.getComponent(cc.Animation);
        var anim = ani.getAnimationState("qiang");
        anim.once("finished", function () {
            that.isAction = false;
        });
        anim.play();

        var bulletAni;
        if (this.bulletAniNodePool.size() > 0) {
            bulletAni = this.bulletAniNodePool.get();
        } else {
            bulletAni = cc.instantiate(this.bulletAniPrefab);
        }
        var bulletAnima = bulletAni.getComponent(cc.Animation);
        var animation = bulletAnima.getAnimationState("zidan");
        this.bulletAniNode.addChild(bulletAni);
        animation.once("finished", function () {
            that.bulletAniNodePool.put(bulletAni);
            bulletAni.removeFromParent();
        });
        animation.play();
    },

    onDestroy : function () {
        // this.aniNode.removeAllChildren();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // start () {
    //
    // },

    // update (dt) {},
});
