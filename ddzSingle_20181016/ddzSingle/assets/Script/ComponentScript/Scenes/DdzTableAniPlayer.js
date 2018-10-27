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
    playAniByPrefab:function (preFabPath, finish_func, start_func) {

        var that = this;
        var showAni = function (aniNode, parentNode, finish_func, start_func) {
            ddz.LOGD(null, "播放动画:" + preFabPath);
            parentNode.addChild(preFabNode);

            var ani = preFabNode.getComponent(cc.Animation);
            var clipName = ani.getClips()[0].name;
            var anim = ani.getAnimationState(clipName);
            anim.once("finished", function () {
                if (finish_func){
                    finish_func(preFabNode);
                }
                preFabNode.removeFromParent(false);
                ddz.LOGD(null, "牌桌动画回收:" + preFabPath);
                that.putAni(preFabPath, preFabNode);//播放完成,放回池里
            });
            anim.play();

            if (start_func){
                start_func(preFabNode);
            }
        };

        var preFabNode = this.getAniFromCache(preFabPath);
        if (preFabNode){
            showAni(preFabNode, this._tableScene.aniNode, finish_func, start_func);
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
                var _parentNode = this._tableScene.aniNode;

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
        this.playAniByPrefab('ani/winorlose/win1');
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

    /**
     * 播放癞子确定动画
     */
    playLaiZi:function () {
        this.playAniByPrefab('ani/laizi/laizi');
    },
    
    shut:function () {
        this._tableScene = null;
    }



});