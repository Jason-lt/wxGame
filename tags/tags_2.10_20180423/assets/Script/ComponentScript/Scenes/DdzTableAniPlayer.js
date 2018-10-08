cc.Class({
    extends: cc.Component,

    ctor:function () {
        this._tableScene = arguments[0];
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
    playAniByPrefab:function (preFabPath, finish_func, start_func) {
        cc.loader.loadRes(preFabPath, function (err, prefab) {

            var preFabNode = cc.instantiate(prefab);

            if (preFabPath == 'ani/winorlose/lose'){
                ddz.LOGD('playAniByPrefab ani/winorlose/lose:', JSON.stringify(preFabNode));
            }
            // cc.director.getScene().addChild(preFabNode);
            this._tableScene.aniNode.addChild(preFabNode);
            // ddz.GlobalFuncs.setToCenter(preFabNode);

            var ani = preFabNode.getComponent(cc.Animation);
            var clipName = ani.getClips()[0].name;
            var anim = ani.getAnimationState(clipName);
            anim.once("finished", function () {
                if (finish_func){
                    finish_func(preFabNode);
                }
                // ddz.LOGD(this._TAG, "删除动画:" + clipName);
                // preFabNode.destroy();
            });
            anim.play();

            if (start_func){
                start_func(preFabNode);
            }
        }.bind(this));
    },

    /**
     * 播放炸弹动画
     * @param pt 炸弹被扔出来的点
     */
    playBomb:function (pt) {
        this.playAniByPrefab('ani/doudizhu/ddz_table_ani_bomb_blast_action/ddz_table_ani_bomb_blast');
    },

    /**
     * 播放飞机动画
     */
    playPlane:function () {
        this.playAniByPrefab('ani/doudizhu/ddz_table_ani_plane_action/ddz_table_ani_plane');
    },

    /**
     * 播放火箭动画
     */
    playRocket:function () {
        this.playAniByPrefab('ani/doudizhu/ddz_table_ani_rocket_fly_action/ddz_table_ani_rocket_fly');
        this.playAniByPrefab('ani/doudizhu/ddz_table_ani_rocket_blast_action/ddz_table_ani_rocket_blast');
    },

    /**
     * 播放顺子
     */
    playShunZi:function () {
        this.playAniByPrefab('ani/doudizhu/ddz_table_ani_shunzi_action/ddz_table_shunzi');
    },

    /**
     * 播放连对
     */
    playLianDui:function () {
        this.playAniByPrefab('ani/doudizhu/ddz_table_liandui_action/ddz_table_liandui');
    },

    /**
     * 播放春天
     */
    playChunTian:function () {
        this.playAniByPrefab('ani/doudizhu/ddz_table_result_title_chuntian_action/ddz_table_result_title_chuntian');
    },

    /**
     * 播放胜利
     */
    playWin:function () {
        this.playAniByPrefab('ani/winorlose/win');
    },

    /**
     * 播放失败
     */
    playLose:function () {
        this.playAniByPrefab('ani/winorlose/shibai');
    },

    /**
     * 播放流局
     */
    playGameFlow:function () {
        this.playAniByPrefab('ani/winorlose/gameFlow');
    },

    shut:function () {
        this._tableScene = null;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {
    //
    // },

    // update (dt) {},
});
