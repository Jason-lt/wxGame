/**
 * Created by tuyoo on 2018/10/24.
 */
//带入分数
ddz.scoreData = {
    getAIScore:function(){
        var score = hall.ME.getChip();
        var myScore = hall.ME.getChip();
        if (ddz.gameConfig.dragInConfig.length && ddz.gameConfig.dragInConfig.length > 0) {
            var _dragInConfig = ddz.gameConfig.dragInConfig;
            var len = _dragInConfig.length;
            for (var i = 0; i < len; i++){
                if (myScore >= _dragInConfig[i].playerGold[0] && myScore <= _dragInConfig[i].playerGold[1]){
                    score = Math.ceil(Math.random()*(_dragInConfig[i].AIGold[1] - _dragInConfig[i].AIGold[0]) + _dragInConfig[i].AIGold[0]);
                    ddz.LOGD("","file = [scoreData] fun = [getAIScore] score = " + score);
                    break;
                }
            }
        }
        return score
    },
    getBaseScore:function(){
        var base = 1;
        var myScore = hall.ME.getChip();
        if (ddz.gameConfig.dragInConfig.length && ddz.gameConfig.dragInConfig.length > 0) {
            var _dragInConfig = ddz.gameConfig.dragInConfig;
            var len = _dragInConfig.length;
            for (var i = 0; i < len; i++){
                if (myScore >= _dragInConfig[i].playerGold[0] && myScore <= _dragInConfig[i].playerGold[1]){
                    base = _dragInConfig[i].baseScore;
                    break;
                }
            }
        }
        return base;
    },
};