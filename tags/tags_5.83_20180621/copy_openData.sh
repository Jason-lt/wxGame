#!/bin/sh
#------------------------------------------------------------------------
# 将游戏资源发布到publish内
#-----------------------------------------------------------------------

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# copy
cp -r /Users/tuyoo/svn/h5/openData/ /Users/tuyoo/svn/h5/tu-weixin-game/build/wechatgame
