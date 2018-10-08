/**
 *   战绩头像
 */
cc.Class({
    extends: cc.Component,
    ctor : function () {
        this._TAG = "ddz_avatar_window";
    },

    properties: {
        avatarWidth : 102,
        avatarHeight : 102,
        lblName : cc.Label,
        sumScore : cc.Label,
        avatar : cc.Node,
        firstSpr : cc.Node,
    },

    onLoad :function() {
        // this.setAvatarUrl("http://ddz.image.tuyoo.com/avatar/head_female_2.png");
        // this.setPlayerName("我是一只小小鸟");
        // this.hideNameDisplay();
    },

    /**
     * 设置玩家战绩总分
     * @param val
     */
    setSumScore : function (score) {
        this.sumScore.string = score;
    },
    
    setFirstSpr:function(isActive){
        this.firstSpr.active = isActive;
    },

    /**
     * 设置头像信息 头像,名字
     * @param url
     */

    setPlayerInfo:function(url, name){
        if (url) {
            this.node.active = true;
            var com = this.avatar.getComponent('Avatar');
            com.setAvatarUrl(url);
            this.lblName.string = name;
            com.hideNameDisplay();
        }else {
            this.node.active = false;
        }
    },

});
