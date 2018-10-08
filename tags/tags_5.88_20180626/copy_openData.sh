#!/bin/sh
#------------------------------------------------------------------------
# 将游戏资源发布到publish内
#-----------------------------------------------------------------------

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# copy
cp -r /Users/tuyoo/svn/h5/openData/ /Users/tuyoo/svn/h5/tags/tags_5.88_20180626/build/wechatgame
