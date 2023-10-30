/*
打开我的-收货地址-获取ck(不行就退出微信重新进)
活动入口：微信小程序-每日鲜奶铺
必须填一个地址
[task_local]
0 15 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/MRXNP/MRXNP_TASK.js, tag=每日鲜奶铺-开盲盒, enabled=true
[MITM]
hostname = timingmilk.timingmar.com
[rewrite_local]
# 每日鲜奶铺获取cookie
^https:\/\/timingmilk\.timingmar\.com\/applet\/mc\/eu\/address\/list url script-request-header https://raw.githubusercontent.com/xzxxn777/quanx/main/MRXNP/MRXNP_TASK.js
*/
const $ = new Env('每日鲜奶铺-开盲盒');
const isRequest = typeof $request != "undefined"
let ckStr = ($.isNode() ? process.env.MILK : $.getdata("MILK")) || "";
!(async () => {
    if (isRequest) {
        await getCookie();
    } else {
        let ckArr = await Variable_Check(ckStr, "MILK");
        for (let index = 0; index < ckArr.length; index++) {
            let num = index + 1;
            $.isLogin = true;
            console.log(`\n-------- 开始【第 ${num} 个账号】--------`);
            cookie = ckArr[index];
            console.log("获取助力码")
            await getHelpId(cookie,num);
            if (!$.isLogin) {
                continue
            }
            await $.wait(2000)
            await getNum(cookie)
        }
        console.log("\n开始助力")
        codeStr = $.getdata("MILKCODE") || "";
        let codeArr = await Variable_Check(codeStr, "MILKCODE");
        for (let index = 0; index < ckArr.length; index++) {
            let num = index + 1;
            $.isLogin = true;
            console.log(`\n-------- 开始【第 ${num} 个账号】--------`);
            cookie = ckArr[index];
            for (let index1 = 0; index1 < codeArr.length; index1++) {
                code = codeArr[index1];
                await help(cookie, code);
                await $.wait(2000)
            }
        }
        $.setdata("", "MILKCODE");
    }
})().catch((e) => {$.log(e)}).finally(() => {$.done({});});

function getCookie() {
    if (isRequest) {
        const ck = $request.headers["access_token"]
        if (ckStr) {
            if (ckStr.indexOf(ck) == -1) { // 找不到返回 -1
                ckStr = ckStr + "?" + ck;
                $.setdata(ckStr, "MILK");
                ckList = ckStr.split("?");
                $.msg($.name + ` 获取第${ckList.length}个 ck 成功: ${ck}`);
            }
        } else {
            $.setdata(ck, "MILK");
            $.msg($.name + ` 获取第1个 ck 成功: ${ck}`);
        }
    }
    $.done({})
}

function getHelpId(cookie,num) {
    return new Promise(resolve => {
        const options = {
            url: `https://timingmilk.timingmar.com/applet/lottery/activity/get-link-Code?id=6&noLoad=true`,
            headers: {
                "Host": "timingmilk.timingmar.com",
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
                "Accept-Language": "en-us,en",
                "Referer": "https://servicewechat.com/wx22e71861f072baf5/2/page-frame.html",
                "Content-Type": "application/json",
                "access_token": cookie,
            },
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    if(data1.code==1004) {
                        $.isLogin = false;
                        $.msg($.name + `第${num}个账号：ck已过期，请重新获取`);
                        return
                    }
                    let code = data1.data;
                    codeStr = $.getdata("MILKCODE") || "";
                    if (codeStr) {
                        if (codeStr.indexOf(code) == -1) { // 找不到返回 -1
                            codeStr = codeStr + "?" + code;
                            $.setdata(codeStr, "MILKCODE");
                            codeList = codeStr.split("?");
                            console.log(`获取第${codeList.length}个助力码成功: ${code}`);
                        }
                    } else {
                        $.setdata(code, "MILKCODE");
                        console.log(`获取第1个助力码成功: ${code}`);
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

function help(cookie,id) {
    return new Promise(resolve => {
        const options = {
            url: `https://timingmilk.timingmar.com/applet/lottery/activity/get-ticket-new?activityId=6&linkCode=${id}`,
            headers: {
                "Host": "timingmilk.timingmar.com",
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
                "Accept-Language": "en-us,en",
                "Referer": "https://servicewechat.com/wx22e71861f072baf5/2/page-frame.html",
                "Content-Type": "application/json",
                "access_token": cookie,
            },
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                }
                else {
                    let data1 = JSON.parse(data)
                    console.log(data1.message)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}
function getNum(cookie) {
    return new Promise(resolve => {
        const options = {
            url: `https://timingmilk.timingmar.com/applet/lottery/activity/time?id=6&noLoad=true`,
            headers: {
                "Host": "timingmilk.timingmar.com",
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
                "Accept-Language": "en-us,en",
                "Referer": "https://servicewechat.com/wx22e71861f072baf5/2/page-frame.html",
                "Content-Type": "application/json",
                "access_token": cookie,
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    let num = data1.data.num;
                    console.log("拥有盲盒："+num+"个")
                    if (num>0) {
                        console.log("\n开盲盒")
                        for (let i = 0; i < num; i++) {
                            await $.wait(2000)
                            await open(cookie)
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

function open(cookie) {
    return new Promise(resolve => {
        const options = {
            url: `https://timingmilk.timingmar.com/applet/lottery/activity/get-prize?id=6&noLoad=true&prizeChannel=1`,
            headers: {
                "Host": "timingmilk.timingmar.com",
                "Accept": "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate",
                "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
                "Accept-Language": "en-us,en",
                "Referer": "https://servicewechat.com/wx22e71861f072baf5/2/page-frame.html",
                "Content-Type": "application/json",
                "access_token": cookie,
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    console.log("获得："+data1.data.gitBoxVO.name)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
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

