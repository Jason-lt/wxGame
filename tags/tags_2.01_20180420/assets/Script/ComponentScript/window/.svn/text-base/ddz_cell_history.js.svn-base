

/*
 ➢	好友房战绩弹窗展示一轮牌局信息：用户头像、时间、牌局类型和用户本人分数结算
 ➢	好友房战绩展示最近十条
 ➢	点击具体战绩，打开对局详情弹窗
 ➢	弹窗为叠加展示，即关闭对局详情展示好友房战绩。关闭好友房战绩，展示创建房间牌桌。
 */

cc.Class({
    extends: cc.Component,

    properties: {

        bgBtn: {
            default : null,
            type : cc.Button
        },
        playLabel: {
            default : null,
            type : cc.Label
        },
        timeLabel: {
            default : null,
            type : cc.Label
        },
        countLabel: {
            default : null,
            type : cc.Label
        },

        player_1 : cc.Node,

        player_2 : cc.Node,

        player_3 : cc.Node,
    },

    onLoad : function () {
        this.bgBtn.node.on("click",this.showGameDetail,this);
    },

    addDataWithObject : function (objc) {
        this.setDetailInformation(objc);
    },

    setDetailInformation:function (resultMap) {
        var urls = resultMap.urls;
        this.updateAcatar(this.player_1,urls[0]);
        this.updateAcatar(this.player_2,urls[1]);
        this.updateAcatar(this.player_3,urls[2]);

        this.setPlayMode(resultMap.titleS);
        this.updateTimer(resultMap.timeS);
        this.setSumScore(resultMap.score);

    },

    updateAcatar:function(_player,_url){
        ddz.LOGD("", "file = [ddz_cell_history] fun = [updateAcatar] name ");
        var com = _player.getComponent('Avatar');
        com.hideNameDisplay();
        com.setAvatarUrl(_url);
    },

    setPlayMode:function(str){
        this.playLabel.string = str;
    },

    updateTimer:function(_timer){
        // var date = new Date().setTime(_timer);
        var date = new Date(_timer);
        var timeY = date.getFullYear() + '-';
        var timeM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var timeD = date.getDate();

        var str = timeY + timeM + timeD;

        this.timeLabel.string = str;
    },

    setSumScore:function(score){
        this.countLabel.string = score;
    },

    showGameDetail:function(){
        ddz.LOGD("", "file = [ddz_window_history] fun = [showGameDetail] ");
        hall.GlobalFuncs.onShowDetail();
    },

});
