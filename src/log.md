#修改记录
------------------
##director

###修复
1.director 登录后 start vote 刷新浏览器 vote status 和 server status 不同步 一起的系列问题 (2013.11.12)
2,修复投票人数数据不同步 (2013.11.13)

###增加
1.增加已经投票status 识别, 并且显示投票人数 (2013.11.13)
2.防止误操作功能, 如果已经完成了投票.再次打开投票 增加警告(2013.11.13)

##user

###修复
1.director 操作过快,导致推送间隔太短,或者user网络阻塞 . 导致 director 推送无效 ,director和 user 数据不同步 . (2013.11.07)


###增加
