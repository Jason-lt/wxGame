/**
 * 动画颜色背影
 */
cc.Class({
    extends: cc.Component,

    ctor:function () {
        this.colorsCfgs = [
            [
                {duration:2, red:21, green:173, blue:163},  //春
                {duration:2, red:183, green:220, blue:181},
            ],
            [
                {duration:2, red:61, green:130, blue:199},  //夏
                {duration:2, red:100, green:216, blue:224},
            ],
            [
                {duration:2, red:233, green:148, blue:58},  //秋
                {duration:2, red:249, green:211, blue:161},
            ],
            [
                {duration:2, red:134, green:150, blue:166},  //冬
                {duration:2, red:193, green:203, blue:215},
            ]
        ];

        this.bgIndex = -1;
        this._curBg = null;
    },

    properties: {
        bgNode : cc.Node,
        bgs : [cc.Sprite]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {

        var winSize = cc.director.getWinSize();

        //全屏适配
        this.bgNode.width = winSize.width;
        this.bgNode.height = winSize.height;

        ddz.LOGD(this._TAG, "窗口大小: width:" + winSize.width + "; height: " + winSize.height);
        for (var i = 0; i < this.bgs.length; i++){
            this.fitBg(i);
        }

        // this.bgGround.node.width = winSize.width;
        // this.bgGround.node.height = winSize.height;
        //
        // this.bgTop.node.width = winSize.width;
        // this.bgTop.node.height = winSize.height;

        // this.stopParticles();

        //以下是测试代码
        // var toChun = cc.tintTo(2,21,173,163); //春
        // var toChun2 = cc.tintTo(2,183,220,181);
        //
        // var toXia = cc.tintTo(2,61,130,199); //夏
        // var toXia2 = cc.tintTo(2,100,216,224);
        //
        // var toQiu = cc.tintTo(2,233,148,58); //秋
        // var toQiu2 = cc.tintTo(2,249,211,161);
        //
        // var toDong = cc.tintTo(2,134,150,166); //冬
        // var toDong2 = cc.tintTo(2,193,203,215);
        //
        // var seq = cc.sequence( cc.delayTime(10),toXia, cc.delayTime(10),toQiu, cc.delayTime(10),toDong, cc.delayTime(10),toChun).repeatForever();
        // var seq2 = cc.sequence( cc.delayTime(10), toXia2, cc.delayTime(10),toQiu2, cc.delayTime(10),toDong2, cc.delayTime(10),toChun2).repeatForever();
        //
        // this.bgGround.node.runAction(seq);
        // this.bgTop.node.runAction(seq2);
        // this.changeParticle(0);
    },

    fitBg:function (bgIndex) {
        this.bgs[bgIndex].node.setContentSize(this.bgNode.width, this.bgNode.height);
    },

    /**
     * 更改背影颜色(有缓动过度效果)
     * @param index 0:春;1:夏;2:秋;3:冬
     */
    changeBgColor:function (index) {
        if (index == this.bgIndex) return;

        // var cfg = this.colorsCfgs[index];
        // var colorBg = cfg[0];
        // var colorTop = cfg[1];

        // this.bgGround.node.runAction(cc.tintTo(colorBg.duration ,colorBg.red ,colorBg.green ,colorBg.blue));
        // this.bgTop.node.runAction(cc.tintTo(colorTop.duration ,colorTop.red ,colorTop.green ,colorTop.blue));

        if (this.bgIndex == -1){
            //初始化
            this.showCurBg(index);
            this.bgIndex = index;
        }
        else{
            this._curBg.runAction(cc.fadeOut(2));

            this.bgIndex = index;

            this._curBg = this.bgs[this.bgIndex].node;
            this._curBg.opacity = 0;
            this._curBg.runAction(cc.fadeIn(2));
        }
    },

    showCurBg:function (index) {
        var isCur = false;
        for (var i = 0; i < this.bgs.length; i++){
            isCur = i == index;
            if (isCur){
                this._curBg = this.bgs[i].node;
                this.bgs[i].node.opacity = 255;
            }
            else{
                this.bgs[i].node.opacity = 0;
            }
        }
    },

    /**
     * 更改背影颜色(立即生效,没有缓动过度效果)
     * @param index 0:春;1:夏;2:秋;3:冬
     */
    setBgColor:function (index) {
        if (index == this.bgIndex) return;

        // var cfg = this.colorsCfgs[index];
        // var colorBg = cfg[0];
        // var colorTop = cfg[1];

        // this.bgGround.node.setColor(cc.color(colorBg.red ,colorBg.green ,colorBg.blue));
        // this.bgTop.node.setColor(cc.color(colorTop.red ,colorTop.green ,colorTop.blue));

        // if (this.bgIndex > -1){
            this.bgs[this.bgIndex == -1 ? 0 : this.bgIndex].setVisible(false);
        // }

        // this.changeParticle(index);
        this.bgIndex = index;
        this.bgs[this.bgIndex].setVisible(true);
    },

    // stopParticles:function () {
    //     var part;
    //     for (var i = 0; i < this.particles.length; i++){
    //         part = this.particles[i];
    //         part.stopSystem();
    //     }
    // },

    // changeParticle:function (index) {
    //     this.stopParticles();
    //     var partSys = this.particles[index];
    //     partSys.resetSystem();
    //     if (index > 2){
    //         partSys = this.particles[index + 1];
    //     }
    //     partSys.resetSystem();
    //
    //     this.bgIndex = index;
    // },

    start:function () {

    },

    // update (dt) {},
});
