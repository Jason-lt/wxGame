var TodoTaskVec = require('TodoTaskVec');

cc.Class({

    ctor: function() {
        this._TAG = 'hall.GameWorld';
        this.model = {

        };
        this.normal = {

        };
    },
    // 默认的析构函数
    destroy: function() {
        this.model = null;
        this.normal = null;
        hall.LOGD(this._TAG, "destroy in hall._GameWorld");
    }
});