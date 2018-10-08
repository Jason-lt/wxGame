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
        defaultSpriteFramte : cc.SpriteFrame,
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
        this.lblName.string = val ? val : " ";
    },

    /**
     * 设置头像url
     * @param url
     */
    setAvatarUrl : function (url) {
        if (!url){
            this.avatar.spriteFrame = this.defaultSpriteFramte;
            this.hideNameDisplay();
        }
        else{
            ty.SystemInfo.getImageWithURL(url,this.avatar);
            this.showNameDisplay();
        }

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
     * 重置头像
     */
    resetAvatar : function () {
        this.setAvatarUrl();
    },

    /**
     *
     * 隐藏名称与阴影
     */
    hideNameDisplay : function () {
        this.lblName.visible = false;
        // this.avatarShadow.visible = false;
        this.avatarShadow.node.active = false;
    },

    /**
     * 显示名称与阴影
     */
    showNameDisplay : function () {
        this.lblName.visible = true;
        // this.avatarShadow.visible = true;
        this.avatarShadow.node.active = false;
    }

    // start () {
    //
    // },

    // update (dt) {},
});
