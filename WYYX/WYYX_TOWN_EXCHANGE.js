/*
先运行一次查看商品id和type,再在boxjs中填写要兑换的商品id和type
boxjs订阅：https://raw.githubusercontent.com/xzxxn777/quanx/main/xzxxn.json
[task_local]
1 0 * * * https://raw.githubusercontent.com/xzxxn777/quanx/main/WYYX/WYYX_TOWN_EXCHANGE.js, tag=网易严选-水晶兑换, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/yanxuan.png, enabled=true
*/
const $ = new Env('网易严选-水晶兑换');
let ckStr = ($.isNode() ? process.env.WYYX : $.getdata("WYYX")) || "";
let id = ($.isNode() ? process.env.WYYXID : $.getdata("WYYXID")) || "";
let type = ($.isNode() ? process.env.WYYXTYPE : $.getdata("WYYXTYPE")) || "";
!(async () => {
    let ckArr = await Variable_Check(ckStr, "WYYX");
    for (let index = 0; index < ckArr.length; index++) {
        let num = index + 1;
        console.log(`\n-------- 开始【第 ${num} 个账号】--------`);
        cookie = ckArr[index];
        console.log("\n获取兑换列表")
        await list(cookie);
        console.log("\n兑换商品")
        if(id==0 ||type==0){
            $.msg("请在boxjs填写要兑换的商品id和type")
            continue
        }
        await exchangePoints(cookie,id,type,num)
    }
})().catch((e) => {$.log(e)}).finally(() => {$.done({});});

function list(cookie) {
    return new Promise(resolve => {
        const options = {
            url: `https://m.you.163.com/act/napi/wishtown/assets/queryPoints.json?__timestamp=1669097190644&`,
            headers: {
                'Host': 'm.you.163.com',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-': 'XMLHttpRequest',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://m.you.163.com',
                'Content-Length': '0',
                'Connection': 'keep-alive',
                //'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 yanxuan/7.6.8 device-id/ed179fedbfda9a7c5c9d462616c7bd96 app-chan-id/AppStore trustId/ios_trustid_781b2e99fe3a488eab858e05e4d48d63`,
                'Cookie' :cookie,
                'Referer' : `https://m.you.163.com/points/index`,
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    let pointsConfigs = data1.result.pointsConfigs;
                    let productConfigs = data1.result.productConfigs;
                    let firstExchangeProducts = data1.result.firstExchangeProduct;
                    console.log("水晶兑积分")
                    for (let i = 0; i < pointsConfigs.length; i++) {
                        let name = pointsConfigs[i].points;
                        let needPoint = pointsConfigs[i].expendValue;
                        let itemId = pointsConfigs[i].id;
                        let rewardType = pointsConfigs[i].rewardType;
                        console.log("商品：" + name + "积分 需要水晶：" + needPoint)
                        console.log("商品id："+itemId+" 商品类型："+rewardType)
                    }
                        console.log("\n首次专享商品")
                    for (let i = 0; i < firstExchangeProducts.length; i++) {
                        let name = firstExchangeProducts[i].name;
                        let needPoint = firstExchangeProducts[i].expendValue;
                        let itemId = firstExchangeProducts[i].id;
                        let rewardType = firstExchangeProducts[i].rewardType;
                        let thresholdPrice = firstExchangeProducts[i].thresholdPrice;
                        if(thresholdPrice==null){
                            console.log("商品："+name+" 已兑完！")
                        }else {
                            console.log("商品："+name+" 需要水晶："+needPoint+"满"+thresholdPrice+"元随单0元带走")
                            console.log("商品id："+itemId+" 商品类型："+rewardType)
                        }
                    }
                    console.log("\n普通商品")
                    for (let i = 0; i < productConfigs.length; i++) {
                        let name = productConfigs[i].name;
                        let needPoint = productConfigs[i].expendValue;
                        let itemId = productConfigs[i].id;
                        let rewardType = productConfigs[i].rewardType;
                        let thresholdPrice = productConfigs[i].thresholdPrice;
                        if(thresholdPrice==null){
                            console.log("商品："+name+" 已兑完！")
                        }else {
                            console.log("商品："+name+" 需要水晶："+needPoint+"满"+thresholdPrice+"元随单0元带走")
                            console.log("商品id："+itemId+" 商品类型："+rewardType)
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

function exchangePoints(cookie,itemId,rewardType,num) {
    return new Promise(resolve => {
        const options = {
            url: `https://m.you.163.com/act/napi/wishtown/assets/exchangePoints.json`,
            headers: {
                'Host': 'm.you.163.com',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-': 'XMLHttpRequest',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
                'Content-Type': 'application/json',
                'Origin': 'https://m.you.163.com',
                'Content-Length': '0',
                'Connection': 'keep-alive',
                //'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 yanxuan/7.6.8 device-id/ed179fedbfda9a7c5c9d462616c7bd96 app-chan-id/AppStore trustId/ios_trustid_781b2e99fe3a488eab858e05e4d48d63`,
                'Cookie' :cookie,
                'Referer' : `https://m.you.163.com/points/index`,
            },
            body:JSON.stringify(
                {
                    "id": itemId,
                    "rewardType": rewardType
                }
            )
        }
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    let msg = data1.msg
                    console.log(msg)
                    await getYouUserInfo(cookie,num,msg)
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function getYouUserInfo(cookie,num,msg) {
    return new Promise(resolve => {
        const options = {
            url: `https://act.you.163.com/napi/yxcommon/ajax/getYouUserInfo.do?csrf_token=2e92d3145410ea8af714b74acb204783&__timestamp=1669032249164&`,
            headers: {
                'Cookie':cookie,
                'Host': 'act.you.163.com',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json',
                'Origin': 'https://act.you.163.com'
            },
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    let data1 = JSON.parse(data)
                    $.msg($.name,`第${num}个账号：${data1.content.nickName}`,`${msg}`)
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
