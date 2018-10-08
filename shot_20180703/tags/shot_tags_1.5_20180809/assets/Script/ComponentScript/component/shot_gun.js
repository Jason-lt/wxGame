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

        grenadeFromNode : {
            default : null,
            type : cc.Node
        },
        grenadeAniNode : {
            default : null,
            type : cc.Node
        },
        grenadeAnimationNode : {
            default : null,
            type : cc.Node
        },
        grenadeNode : {
            default : null,
            type : cc.Node
        },
        grenadePrefab : {
            default : null,
            type : cc.Prefab
        },

        isAction : false,
        animation : {
            default : null,
            type : cc.AnimationState
        },
        parentScene: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad : function() {
        this.bulletAniNodePool = new cc.NodePool();
        for (var i = 0; i <  15; i++) {
            this.bulletAniNodePool.put(cc.instantiate(this.bulletAniPrefab)); // 通过 putInPool 接口放入对象池
        }
        this.animation = this.gunAniNode.getComponent(cc.Animation).getAnimationState("qiang");
        var that = this;
        this.animation.once("finished", function () {
            that.isAction = false;
        });

        this.grenadeFromNode.y = - cc.director.getWinSize().height/2;

        if(!shot.GameWorld.gunnerShareSchemeConfig || shot.GameWorld.gunnerShareSchemeConfig.showBanner){
            this.grenadeAniNode.y = 188;
        }else {
            this.grenadeAniNode.y = 228;
        }
    },

    openFire : function () {
        shot.GameWorld.nowBulletPenetrate = shot.GameWorld.bulletPenetrate;//穿透属性
        shot.GameWorld.grenadeRunning = false;
        // hall.LOGW("===","========openFire=====");
        shot.AudioHelper.playEffect(shot.EffectPath_mp3.gunHits,false);
        this.playGunAni();
    },

    stopGunAni : function () {
        if(this.isAction){
            this.animation.stop();
        }
    },
    playGunAni:function () {
        this.stopGunAni();
        this.isAction = true;
        this.animation.play();

        var that = this;
        var bulletAni;
        if (this.bulletAniNodePool.size() > 0) {
            bulletAni = this.bulletAniNodePool.get();
        } else {
            bulletAni = cc.instantiate(this.bulletAniPrefab);
        }
        var bulletAnima = bulletAni.getComponent(cc.Animation);
        var animation = bulletAnima.getAnimationState("zidan");
        this.bulletAniNode.addChild(bulletAni);
        animation.once("finished", function (target) {
            that.bulletAniNodePool.put(bulletAni);
            bulletAni.removeFromParent();
        });
        animation.play();
    },

    onActionGrenade: function(callFunc) {
        var to_pos = this.node.convertToNodeSpace(this.grenadeAniNode.convertToWorldSpace(cc.p(0,0)));
        var from_pos = this.node.convertToNodeSpace(this.grenadeFromNode.convertToWorldSpace(cc.p(0,0)));

        var that = this;

        var startFunc = function(_preFabNode){
            _preFabNode.x = to_pos.x;
            _preFabNode.y = to_pos.y;

        };
        var gStartFunc = function (_preFabNode,_callFunc){
            _preFabNode.x = from_pos.x;
            _preFabNode.y = from_pos.y;
            _preFabNode.active = true;
            var midy;
            var midx;

            if (Math.abs(to_pos.x - from_pos.x) < 100){
                midx = to_pos.x + 200;
                midy = from_pos.y + (to_pos.y - from_pos.y)/2;
            }else if (Math.abs(to_pos.y - from_pos.y) < 100){
                midx = (to_pos.x - from_pos.x) / 2;
                midy = from_pos.y;
            }else {
                midx = -200;
                midy = from_pos.y + (to_pos.y - from_pos.y)/2 + 100;
            }
            hall.LOGD("", "曲线运动中间点 midx = " + midx + "  midy = " + midy );
            var midPoint = cc.p(midx, midy);
            var controlPoints1 = [     from_pos,     midPoint,     to_pos   ];
            var bezierToDst1 = cc.bezierTo(0.7, controlPoints1);

            var rotationAct = cc.rotateBy(0.7,180);
            var rotationR = that.parentScene.getBucketRoundSpeedIn() * 0.18;
            var rotationAct2 = cc.rotateBy(0.18,rotationR);

            var strikeSound = cc.callFunc(function () {
                shot.AudioHelper.playEffect(shot.EffectPath_mp3.grenadeStrike);
            });

            _preFabNode.rotation = hall.GlobalFuncs.getRandomNumberBefore(360);
            _preFabNode.runAction(cc.sequence(cc.spawn(rotationAct,bezierToDst1),cc.spawn(rotationAct2,strikeSound), cc.callFunc(function () {
                startFunc(_preFabNode);
                _preFabNode.active = false;

                // var aniNode = cc.instantiate(that.grenadePrefab);
                // that.grenadeAniNode.addChild(aniNode);
                shot.AudioHelper.playEffect(shot.EffectPath_mp3.grenadeBoom);
                that.grenadeAniNode.active = true;
                that.grenadeAniNode.rotation = _preFabNode.rotation;
                var ani2 = that.grenadeAnimationNode.getComponent(cc.Animation);
                var anim2 = ani2.getAnimationState("shouleibaozha_01");
                anim2.once("finished", function () {
                    // aniNode.removeFromParent();
                    that.grenadeAniNode.active = false;
                    shot.GameWorld.grenadeRunning = false;
                });
                anim2.play();

                if(_callFunc){
                    _callFunc();
                }

            }, that)));
        };

        gStartFunc(this.grenadeNode,callFunc);
    },

    onDestroy : function () {
        this.bulletAniNodePool.clear();
        // this.aniNode.removeAllChildren();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
    }
    // start () {
    //
    // },
    // update (dt) {},
});
