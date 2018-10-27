/**
 * Created by tuyoo on 2018/5/9.
 */
cc.Class({
    extends: cc.Component,

    ctor:function () {
        this._tableScene = arguments[0];
        this._aniMap = {};
    },

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    /**
     * 从预制件加载动画
     * @param preFabPath 路径
     * @param finish_func 播放完成后的回调
     * @param start_func 播放开始时的回调
     */
    playAniByPrefab:function (preFabPath, start_func,finish_func,isForver) {

        var that = this;
        var showAni = function (chatNode, parentNode, finish_func, start_func) {
            ddz.LOGD(null, "播放动画:" + preFabPath);
            parentNode.addChild(preFabNode);
            var callF;
            var ani = preFabNode.getComponent(cc.Animation);
            var clipName = ani.getClips()[0].name;
            var anim = ani.getAnimationState(clipName);
            if (isForver) {
                callF = function () {
                    if (finish_func){
                        finish_func(preFabNode);
                    }
                    preFabNode.removeFromParent(false);
                    ddz.LOGD(null, "牌桌动画回收:" + preFabPath);
                    that.putAni(preFabPath, preFabNode);//播放完成,放回池里
                };

            }else {
                anim.once("finished", function () {
                    if (finish_func){
                        finish_func(preFabNode);
                    }
                    preFabNode.removeFromParent(false);
                    ddz.LOGD(null, "牌桌动画回收:" + preFabPath);
                    that.putAni(preFabPath, preFabNode);//播放完成,放回池里
                });

            }

            anim.play();

            if (start_func){
                start_func(preFabNode,callF);
            }
        };

        var preFabNode = this.getAniFromCache(preFabPath);
        if (preFabNode){
            showAni(preFabNode, this._tableScene.chatNode, finish_func, start_func);
        }
        else{
            cc.loader.loadRes(preFabPath, function (err, prefab) {

                preFabNode = cc.instantiate(prefab);
                if (!preFabNode){
                    ddz.LOGD(null, "动画实例化失败:" + preFabPath);
                    return;
                }

                if(!this._tableScene){
                    return;
                }
                var _parentNode = this._tableScene.chatNode;
                // this.putAni(preFabPath, preFabNode);

                showAni(preFabNode, _parentNode, finish_func, start_func);
            }.bind(this));
        }

    },

    getAniFromCache:function (preFabPath) {
        var aniList = this._aniMap[preFabPath];
        if (aniList){
            if (aniList.length > 0){
                return aniList.pop();
            }
            else{
                return null;
            }
        }

        return null;
    },

    putAni:function (preFabPath, preFabNode) {
        var aniList = this._aniMap[preFabPath];
        if (!aniList){
            aniList = [];
            this._aniMap[preFabPath] = aniList;
        }
        aniList.push(preFabNode);
    },
    
    // switch (emoId){
    // case 'flower': // 花
    //     str = 'ani/ddz_bq/ddz_table_interactive_emotion3_1_action/meigui2';
    //     gStr = 'ani/ddz_bq/ddz_table_interactive_emotion3_0_action/meigui';
    //     break;
    // case 'diamond': // 钻石
    //     str = 'ani/ddz_bq/ddz_table_interactive_emotion1_1_action/zuanjie2';
    //     gStr = 'ani/ddz_bq/ddz_table_interactive_emotion1_1_action/zuanjie2';
    //     // gStr = 'ani/ddz_bq/ddz_table_interactive_emotion1_0_action/zuanjie';
    //     break;
    // case 'egg': // 鸡蛋
    //     str = 'ani/ddz_bq/ddz_table_interactive_emotion2_1_action/jidan2';
    //     gStr = 'ani/ddz_bq/ddz_table_interactive_emotion2_0_action/jidan';
    //     break;
    // case 'brick': // 板砖
    //     str = 'ani/ddz_bq/ddz_table_interactive_emotion4_1_action/banzhuan2';
    //     gStr = 'ani/ddz_bq/ddz_table_interactive_emotion4_0_action/banzhuan1';
    //     break;
    // };

    /**
     * 播放花飞过去的动画
     */
    playFlowerFly:function (start_func,finish_func) {
        this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion3_0_action/meigui',start_func,finish_func,true);
    },

    /**
     * 播放花动画
     */
    playFlower:function (start_func,finish_func) {
        ddz.AudioHelper.playEffect(ddz.SmiliesPath_mp3['flower'], false);
        this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion3_1_action/meigui2',start_func,finish_func);
    },

    /**
     * 播放钻石飞过去动画
     */
    playDiamondFly:function (start_func,finish_func) {
        this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion1_1_action/zuanjie2',start_func,finish_func,true);
        // this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion1_0_action/zuanjie',start_func,finish_func,true);
    },

    /**
     * 播放钻石动画
     */
    playDiamond:function (start_func,finish_func) {
        ddz.AudioHelper.playEffect(ddz.SmiliesPath_mp3['diamond'], false);
        this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion1_1_action/zuanjie2',start_func,finish_func);
    },

    /**
     * 播放鸡蛋飞过去动画
     */
    playEggFly:function (start_func,finish_func) {
        this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion2_0_action/jidan',start_func,finish_func,true);
    },

    /**
     * 播放鸡蛋动画
     */
    playEgg:function (start_func,finish_func) {
        ddz.AudioHelper.playEffect(ddz.SmiliesPath_mp3['egg'], false);
        this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion2_1_action/jidan2',start_func,finish_func);
    },

    /**
     * 播放板砖飞过去动画
     */
    playBrickFly:function (start_func,finish_func) {
        this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion4_0_action/banzhuan1',start_func,finish_func,true);
    },

    /**
     * 播放板砖动画
     */
    playBrick:function (start_func,finish_func) {
        ddz.AudioHelper.playEffect(ddz.SmiliesPath_mp3['brick'], false);
        this.playAniByPrefab('ani/ddz_bq/ddz_table_interactive_emotion4_1_action/banzhuan2',start_func,finish_func);
    },

    shut:function () {
        this._tableScene = null;
    }

});