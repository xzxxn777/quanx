## 安徽电信小程序-流量来了-签到
### QX(圈叉)使用方法
#### 重写获取body
[MITM]
```
hostname = llhb.ah163.net
```
[rewrite_local]
```
# 流量来了获取body
^https:\/\/llhb\.ah163\.net\/ah_red_come\/app\/getphone url script-request-body https://raw.githubusercontent.com/xzxxn777/quanx/main/AHDX/AHDX_getBody.js
```
#### body上传青龙
[task_local]
```
0 0 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/AHDX/post-ql.js, tag=body上传青龙, enabled=true
```
### STASH使用方法
在STASH中安装覆写：
```
https://raw.githubusercontent.com/xzxxn777/quanx/main/AHDX/AHDX_getBody.stoverride
```
```
https://raw.githubusercontent.com/xzxxn777/quanx/main/AHDX/post-ql.stoverride
```
### 青龙配置（必须）
上传AHDX.js到青龙scripts目录 新建任务
```
task AHDX.js
```
### bark通知
变量
```
bark_key #bark接口
bark_icon #bark图标
```
感谢[@TuringLabNews](https://t.me/TuringLabNews)提供脚本