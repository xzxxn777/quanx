## 网易严选
### QX(圈叉)使用方法
#### 重写获取ck
打开网易严选app-个人-积分-获取ck

多账号微信打开 https://m.you.163.com/ -个人-积分-获取ck

[MITM]
```
hostname = m.you.163.com
```
[rewrite_local]
```
# 网易严选获取cookie
^https:\/\/m\.you\.163\.com\/xhr\/points\/index.json/? url script-request-header https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX.js
```
#### 重写获取小程序ck
打开网易严选微信小程序-个人-免费领水果-浇水获取ck

[MITM]
```
hostname = miniapp.you.163.com
```
[rewrite_local]
```
# 网易严选小程序获取cookie
^https:\/\/miniapp\.you\.163\.com\/orchard\/game\/water\/drop.json url script-request-header https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX_FRUIT.js
```
#### 活动名：领鸡蛋
活动入口：网易严选app-个人-领鸡蛋

[task_local]
```
2 0,23 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX.js, tag=网易严选-领鸡蛋, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/yanxuan.png, enabled=true
```
#### 活动名：赚积分
活动入口：网易严选app-个人-积分

[task_local]
```
10 0,23 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX_JF.js, tag=网易严选-积分, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/yanxuan.png, enabled=true
```
#### 活动名：严选家园
活动入口：网易严选app-个人-严选家园

[task_local]
```
20 0-23/3 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX_TOWN.js, tag=网易严选-严选家园, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/yanxuan.png, enabled=true
```
#### 活动名：网易严选-水晶兑换
活动入口：网易严选app-个人-严选家园-水晶兑换

[task_local]
```
1 0 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX_TOWN_EXCHANGE.js, tag=网易严选-水晶兑换, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/yanxuan.png, enabled=true
```
#### 活动名：免费领水果
活动入口：网易严选微信小程序-个人-免费领水果

[task_local]
```
22 8,13,19 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX_FRUIT.js, tag=网易严选-小程序-免费领水果, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/yanxuan.png, enabled=true
```