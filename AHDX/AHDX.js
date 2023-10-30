const $ = new Env('流量来了签到');

var request = require('request');
const t = require('crypto-js');
const r = t.enc.Utf8.parse("hbdxWxSmall96548")
const n = t.enc.Utf8.parse("6606136474185246")

let ckStr = ($.isNode() ? process.env.AHDX : $.getdata("AHDX")) || "";
let bark_key = ($.isNode() ? process.env.bark_key : $.getdata("bark_key")) || "";
let icon_url = ($.isNode() ? process.env.bark_icon : $.getdata("bark_icon")) || "";
let body1 = '';

!(async () => {
    let ckArr = await Variable_Check(ckStr, "AHDX");
    for (let index = 0; index < ckArr.length; index++) {
        let num = index + 1;
        console.log(`\n-------- 开始【第 ${num} 个账号】--------`);
        cookie = ckArr[index].split("&");
        phone = JSON.parse(JSON.parse(Decrypt(cookie[0])).data).token
        //token=ckArr[index].split("&");
        $.message = ''
        await getuser(phone,num)
        await isSign(phone)
        await getSign(phone)
        await $.wait(2000)
    }
    try {
        const notify = $.isNode() ? require('./sendNotify') : '';
        await notify.sendNotify($.name, $.message)
    } catch (error) {

    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

function getuser(phone,num) {
    return new Promise(resolve =>
        request(taskUrl('getuser', {"queryDate": formatTime(new Date()), "phone": `${phone}`}), (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let data = JSON.parse(Decrypt(body))
                if (data.code === 0) {
                    $.num =data.data.phone
                } else {
                    Notice($.name,`第 ${num} 个账号`,`请重新获取body`);
                }
                resolve()
            }
        })
    )
}

function getSign(phone) {
    return new Promise(resolve => {
        request(taskUrl('getSign', {"queryDate": formatTime(new Date()), "phone": `${phone}`}), (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let data = JSON.parse(Decrypt(body))
                if (data.code === 0) {
                    Notice($.name,`用户${$.num}`,body1+` 本月共计签到${data.data.times}天`);
                    $.log(`用户${$.num}本月已签到${data.data.times}天`)
                }
                resolve()
            }
        })
    })
}

function isSign(phone) {
    return new Promise(resolve => {
        request(taskUrl('isSign', {"queryDate": formatTime(new Date()), "phone": `${phone}`}), async (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let data = JSON.parse(Decrypt(body))
                if (data.code === 0) {
                    if (data.data === 0) {
                        $.log("用户未签到，去签到")
                        await userSign(phone)
                    } else {
                        body1='今日已签到'
                        $.log(`用户${$.num}今日已签到`)
                    }
                } else {
                    $.message += data.msg
                    $.log(data.msg)
                }
                resolve()
            }
        })
    })
}

function userSign(phone) {
    return new Promise(resolve => {
        request(taskUrl('userSign', {"queryDate": formatTime(new Date()), "phone": `${phone}`}), (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let data = JSON.parse(Decrypt(body))
                if (data.code === 0) {
                    $.message += `用户${$.num}签到成功🎉\n`
                    $.log(`用户${$.num}签到成功🎉\n`)
                } else {
                    $.message += `用户${$.num}签到失败，${data.msg}，请检查🎉\n`
                    $.log(`用户${$.num}签到失败，${data.msg}，请检查🎉\n`)
                }
                resolve()
            }
        })
    })
}

function formatTime(t) {
    const e = function (e) {
        return (e = e.toString())[1] ? e : "0" + e;
    }
    var r = t.getFullYear(), n = t.getMonth() + 1, a = t.getDate(), o = t.getHours(), u = t.getMinutes(),
        s = t.getSeconds();
    return [r, n, a].map(e).join("-") + " " + [o, u, s].map(e).join(":");
}

function Decrypt(e) {
    var a = t.enc.Hex.parse(e), o = t.enc.Base64.stringify(a);
    return t.AES.decrypt(o, r, {
        iv: n,
        mode: t.mode.CBC,
        padding: t.pad.Pkcs7
    }).toString(t.enc.Utf8).toString();
}

function DecryptReq(e) {
    var a = t.enc.Hex.parse(e), o = t.enc.Base64.stringify(a);
    return t.AES.decrypt(o, r, {
        iv: n,
        mode: t.mode.CBC,
        padding: t.pad.Pkcs7
    }).toString(t.enc.Utf8).toString();
}

function Encrypt(e) {
    var a = t.enc.Utf8.parse(e);
    return t.AES.encrypt(a, r, {
        iv: n,
        mode: t.mode.CBC,
        padding: t.pad.Pkcs7
    }).ciphertext.toString();
}

function taskUrl(function_id, body) {
    return {
        url: `https://llhb.ah163.net/ah_red_come/app/${function_id}`,
        body: JSON.stringify({"para": Encrypt(JSON.stringify(body))}),
        method: 'POST',
        headers: {
            'Host': 'llhb.ah163.net',
            'content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.16(0x18001034) NetType/WIFI Language/zh_CN',
            'Referer': 'https://servicewechat.com/wx1f62ea786b9aaf30/72/page-frame.html'
        }
    }
}

/**
 * 变量检查
 */
async function Variable_Check(ck, Variables) {
    return new Promise((resolve) => {
        let ckArr = [];
        if (ck) {
            if (ck.indexOf("@") !== -1) {
                ck.split("@").forEach((item) => {
                    ckArr.push(item);
                });
            } else if (ck.indexOf("\n") !== -1) {
                ck.split("\n").forEach((item) => {
                    ckArr.push(item);
                });
            } else {
                ckArr.push(ck);
            }
            resolve(ckArr);
        } else {
            console.log(` ${$.name}:未填写变量 ${Variables} ,请仔细阅读脚本说明!`);
        }
    });
}

function Notice(title,body,body1){
    let bark_title=title
    let bark_body=body
    let bark_body1=body1
    if(bark_key)
    {
        let bark_icon
        if(icon_url){bark_icon=`?icon=${icon_url}`}
        else {bark_icon=''}

        let bark_other=$.getdata(' ')
        let effective=bark_icon.indexOf("?icon")
        if((effective!=-1)&&bark_other){bark_other=`&${bark_other}`}
        else if((effective==-1)&&bark_other){bark_other=`?${bark_other}`}
        else{bark_other=''}
        let url =`${bark_key}${encodeURIComponent(bark_title)}/${encodeURIComponent(bark_body)}${encodeURIComponent('\n')}${encodeURIComponent(bark_body1)}${bark_icon}${bark_other}`

        $.post({url})
    }else{$.msg(title,body,body1)}

}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
