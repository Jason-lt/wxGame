//ddz的音乐文件都包含了hall的音乐文件，这里把hall需要的音乐文件拆了出来，但是代码里还是ddz.music，因为有缓存，多加载一次不会有太大影响，避免了修改代码（为了未来可能需要与移动端兼容）

scratch.EffectPath_mp3 = {
    scratch_scrate_main : 'guaguale/sound/scratch_scrate_main.mp3',     //刮卡音效
    scratch_getReward : 'guaguale/sound/scratch_getReward.mp3',     //获奖弹窗音效
    scratch_turnTable : 'guaguale/sound/scratch_turnTable.mp3',     //幸运转盘转动
    scratch_turnTable_ready_go : 'guaguale/sound/scratch_turnTable_ready_go.mp3',     //幸运转盘readyGo
    scratch_bg : 'guaguale/sound/scratch_bg.mp3'     //刮刮乐背景音乐
};