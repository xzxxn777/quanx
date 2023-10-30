/*
活动入口：网易严选微信小程序-个人-免费领水果
打开个人-免费领水果-浇水获取ck
[task_local]
22 8,13,19 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX_FRUIT.js, tag=网易严选-小程序-免费领水果, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/yanxuan.png, enabled=true
[MITM]
hostname = miniapp.you.163.com

[rewrite_local]
# 网易严选小程序获取cookie
^https:\/\/miniapp\.you\.163\.com\/orchard\/game\/water\/drop.json url script-request-header https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX_FRUIT.js
 */
const $ = new Env('网易严选-小程序-免费领水果');
const isRequest = typeof $request != "undefined"
let ckStr = ($.isNode() ? process.env.WYYXFRUIT : $.getdata("WYYXFRUIT")) || "";
!(async () => {
    if (isRequest) {
        await getCookie();
    } else {
        let ckArr = await Variable_Check(ckStr, "WYYXFRUIT");
        for (let index = 0; index < ckArr.length; index++) {
            let num = index + 1;
            $.isLogin = true;
            console.log(`\n-------- 开始【第 ${num} 个账号】--------`);
            cookie = ckArr[index];
            console.log("\n开始做任务")
            await taskList(cookie,num);
            if (!$.isLogin) {
                continue
            }
            await $.wait(2000)
            await queryInfo(cookie,num);
        }
    }
})().catch((e) => {$.log(e)}).finally(() => {$.done({});});

function getCookie() {
    if (isRequest) {
        const ck = $request.headers["X-WX-3RD-Session"]
        if (ckStr) {
            if (ckStr.indexOf(ck) == -1) { // 找不到返回 -1
                ckStr = ckStr + "?" + ck;
                $.setdata(ckStr, "WYYXFRUIT");
                ckList = ckStr.split("?");
                $.msg($.name + ` 获取第${ckList.length}个 ck 成功: ${ck}`);
            }
        } else {
            $.setdata(ck, "WYYXFRUIT");
            $.msg($.name + ` 获取第1个 ck 成功: ${ck}`);
        }
    }
    $.done({})
}

function queryInfo(cookie,num) {
    return new Promise(resolve => {
        const options = {
            url: `https://miniapp.you.163.com/orchard/game/water/index/dynamic.json`,
            headers: {
            'Host': 'miniapp.you.163.com',
            'Connection': 'keep-alive',
            'X-WX-3RD-Session': cookie,
            'content-type': 'application/json',
            'Referer': 'https://servicewechat.com/wx5b768b801d27f022/469/page-frame.html'
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    let desc = data1.result.levelDesc;
                    $.msg($.name,`第${num}个账号`,`${desc}`)
                    let leftAmount = data1.result.leftAmount;
                    console.log("\n当前拥有水滴："+leftAmount)
                    console.log("开始浇水")
                    for (let i = 0; i < leftAmount/10; i++) {
                        await $.wait(2000)
                        await drop(cookie);
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function checkIn(cookie) {
    return new Promise(resolve => {
        const options = {
            url: `https://miniapp.you.163.com/act/money/checkIn/V3/checkIn.json`,
            headers: {
                'Host': 'miniapp.you.163.com',
                'Connection': 'keep-alive',
                'X-WX-3RD-Session': cookie,
                'content-type': 'application/json',
                'Referer': 'https://servicewechat.com/wx5b768b801d27f022/469/page-frame.html'
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    //console.log(data1)
                    if(data1.code==200){
                        console.log("签到成功 账号余额："+data1.data.totalAmount)
                    } else {
                        console.log("已签到！")
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function taskList(cookie,num) {
    return new Promise(resolve => {
        const options = {
            url: `https://miniapp.you.163.com/orchard/task/list.json?taskIdList=%5B%22FRIEND_HELP%22%2C%22VISIT_ITEM%22%2C%22PAY_ITEM%22%2C%22GET_EVERYDAY_RANDOM%22%2C%22NOTIFY_TOMORROW%22%2C%22GET_EVERYDAY_FREE%22%2C%22PAY_SUPER_MC%22%2C%22FINISH_PIN%22%2C%22DROP_WATER_CONTINUOUS%22%2C%22VISIT_PAGE%22%2C%22GARDEN_CHECK_IN_MUTUAL_GUIDE%22%5D`,
            headers: {
                'Host': 'miniapp.you.163.com',
                'Connection': 'keep-alive',
                'X-WX-3RD-Session': cookie,
                'content-type': 'application/json',
                'Referer': 'https://servicewechat.com/wx5b768b801d27f022/469/page-frame.html'
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    if(data1.code==401){
                        $.isLogin = false;
                        $.msg($.name + `第${num}个账号：ck已过期，请重新获取`);
                        return
                    }
                    let tasks = data1.result;
                    for(let i in tasks) {
                        console.log("任务："+tasks[i].desc);
                        let taskRecordId = tasks[i].taskRecordId;
                        if(i=="GARDEN_CHECK_IN_MUTUAL_GUIDE"){
                            console.log("开始签到")
                            await $.wait(1000)
                            await checkIn(cookie);
                        }
                        if(i=="NOTIFY_TOMORROW"){
                            await $.wait(1000)
                            await subscribe(cookie)
                        }
                        if(i=="VISIT_ITEM"){
                            await $.wait(1000)
                            await finish(cookie)
                        }
                        if(taskRecordId==0||taskRecordId==undefined){
                            if(i=="GET_EVERYDAY_FREE"){
                                let url=`https://miniapp.you.163.com/orchard/task/water/get.json?taskId=${i}`
                                await get(cookie,url);
                                await $.wait(30000)
                            }
                            await $.wait(2000)
                            let url=`https://miniapp.you.163.com/orchard/task/water/get.json?taskId=${i}`
                            await get(cookie,url);
                        }else {
                            await $.wait(2000)
                            let url=`https://miniapp.you.163.com/orchard/task/water/get.json?taskId=${i}&taskRecordId=${taskRecordId}&subTaskId=`
                            await get(cookie,url);
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function subscribe(cookie) {
    return new Promise(resolve => {
        const options = {
            url: `https://miniapp.you.163.com/act/utils/message/subscribe/add.json?module=orchardUserNotice`,
            headers: {
                'Host': 'miniapp.you.163.com',
                'Connection': 'keep-alive',
                'X-WX-3RD-Session': cookie,
                'content-type': 'application/json',
                'Referer': 'https://servicewechat.com/wx5b768b801d27f022/469/page-frame.html'
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    //console.log(data1)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function finish(cookie) {
    return new Promise(resolve => {
        const options = {
            url: `https://miniapp.you.163.com/orchard/task/finish.json?taskId=VISIT_ITEM&taskRecordId=0`,
            headers: {
                'Host': 'miniapp.you.163.com',
                'Connection': 'keep-alive',
                'X-WX-3RD-Session': cookie,
                'content-type': 'application/json',
                'Referer': 'https://servicewechat.com/wx5b768b801d27f022/469/page-frame.html'
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    if(data1.result.result==1){
                        console.log("完成")
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function get(cookie,url) {
    return new Promise(resolve => {
        const options = {
            url: url,
            headers: {
                'Host': 'miniapp.you.163.com',
                'Connection': 'keep-alive',
                'X-WX-3RD-Session': cookie,
                'content-type': 'application/json',
                'Referer': 'https://servicewechat.com/wx5b768b801d27f022/469/page-frame.html'
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    //console.log(data1)
                    if(data1.code==200){
                        console.log("领取水滴："+data1.result.water)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function drop(cookie) {
    return new Promise(resolve => {
        const options = {
            url: `https://miniapp.you.163.com/orchard/game/water/drop.json`,
            headers: {
                'Host': 'miniapp.you.163.com',
                'Connection': 'keep-alive',
                'X-WX-3RD-Session': cookie,
                'content-type': 'application/json',
                'Referer': 'https://servicewechat.com/wx5b768b801d27f022/469/page-frame.html'
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    if(data1.code==200){
                        console.log("浇水成功！")
                    }
                    if(data1.code==500){
                        console.log(data1.msg)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

//获取当前日期函数
function getNowFormatDate() {
    let date = new Date(),
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate() // 获取当前日(1-31)
    if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
    if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0

    let currentdate = `${year}${month}${strDate}`
    return currentdate
}

/**
 * 变量检查
 */
async function Variable_Check(ck, Variables) {
    return new Promise((resolve) => {
        let ckArr = [];
        if (ck) {
            if (ck.indexOf("?") !== -1) {
                ck.split("?").forEach((item) => {
                    ckArr.push(item);
                });
            } else {
                ckArr.push(ck);
            }
            resolve(ckArr);
        } else {
            console.log(` ${$.name}:未填写变量 ${Variables} ,请仔细阅读脚本说明!`);
            $.done()
        }
    });
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
