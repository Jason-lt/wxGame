/**
 * 公共头像类
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "Avatar";
    },

    properties: {
        avatarWidth : 102,
        avatarHeight : 102,
        avatar : cc.Sprite,
        avatarShadow : cc.Sprite,
        lblName : cc.Label
    },


    onLoad :function() {

        // this.setAvatarUrl("http://ddz.image.tuyoo.com/avatar/head_female_2.png");
        // this.setPlayerName("我是一只小小鸟");
        // this.hideNameDisplay();
    },

    /**
     * 设置玩家名称
     * @param val
     */
    setPlayerName : function (val) {
        this.lblName.string = val;
    },

    /**
     * 设置头像url
     * @param url
     */
    setAvatarUrl : function (url) {
        ty.SystemInfo.getImageWithURL(url,this.avatar);
        this.avatar.node.setContentSize(this.avatarWidth, this.avatarHeight);
        //http://ddz.image.tuyoo.com/avatar/head_female_2.png
        // cc.loader.load(url, function (err, texture) {
        //     if (!err){
        //         //这里要加缓存机制
        //         this.avatar.spriteFrame = new cc.SpriteFrame(texture);
        //         this.avatar.node.setContentSize(this.avatarWidth, this.avatarHeight);
        //     }
        //     else{
        //         //加载失败
        //     }
        // }.bind(this));
    },

    /**
     * 隐藏名称与阴影
     */
    hideNameDisplay : function () {
        this.lblName.visible = false;
        this.avatarShadow.visible = false;
    }

    // start () {
    //
    // },

    // update (dt) {},
});
