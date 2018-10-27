/**
 * 闯关进度
 */
cc.Class({
    extends: cc.Component,

    properties: {
        completeArray : [cc.Node],
    },

    /**
     * 设置当前进度
     * @param progress 当前进度
     * @param isSucces 当前关卡,是否成功
     */
    setProgress : function (progress, isSucces) {

        //ddz_anim_guanqia01 过关
        //ddz_anim_guanqia02 失败
        var node, animationCom, anim;
        for (var i = 0;i < this.completeArray.length ; i ++){
            node = this.completeArray[i];
            animationCom = node.getComponent(cc.Animation);

            if (i < progress){
                //已经通过
                // anim = animationCom.getAnimationState('ddz_anim_guanqia01');
                // anim.play();
            }
            else if (i == progress){
                //当前
                if (isSucces){
                    anim = animationCom.getAnimationState('ddz_anim_guanqia01');
                    anim.play();
                }
                else{
                    anim = animationCom.getAnimationState('ddz_anim_guanqia02');
                    anim.play();
                }
            }else{

                //还未闯的
                node.getChildByName('ddz_complete').active = false;
                node.getChildByName('ddz_complete_02').active = false;
                node.getChildByName('ddz_complete_01').active = false;

                if (progress < this.completeArray.length - 1 && isSucces && i == progress + 1){
                    //如果没有通关,显示下一关的关卡动态
                    anim = animationCom.getAnimationState('ddz_anim_guanqia02');
                    anim.play();
                }
            }

        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},
});
