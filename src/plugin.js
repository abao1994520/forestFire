import { createDiscreteApi } from 'naive-ui';

const { message, notification, dialog, loadingBar } = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar']);

Array.prototype.myForEach = async function(callback, thisArg) {
  for (let i = 0; i < this.length; i ++) {
    await callback.call(thisArg, this[i], i, this)
  }
}

export default {
  install: (app, options) => {
    let proxy = app.config.globalProperties;
    
    //全局变量方便使用
    window.proxy = proxy;

    proxy.$loading = loadingBar;
    proxy.$message = message;
    proxy.$dialog = dialog;
    
    //确定
    proxy.confirm = function(msg, okFun){
        dialog.create({
            title: '提示',
            showIcon: false,
            maskClosable: false,
            content: msg,
            positiveText: '确定',
            negativeText: '取消',
            positiveButtonProps: {size: 'medium', type: 'warning'},
            negativeButtonProps: {size: 'medium'},
            onPositiveClick: ()=>{
                okFun();
            }
        })
    }
    //确定删除
    proxy.confirmDel = function(okFun){
      proxy.confirm('确定要删除这条数据吗？', okFun);
    }

    proxy.ajax = function (url, data, type = 'POST', contentType = 'application/x-www-form-urlencoded') {
      let bodyData = null;
      if(data){
        if (contentType == 'application/x-www-form-urlencoded') {
          //把对象序列化成字符串
          let data_temp = Object.assign({}, data);
          for(let key in data_temp){
            if(typeof(data_temp[key])=='object'){
              data_temp[key] = JSON.stringify(data_temp[key]);
            }
          }
          bodyData = new URLSearchParams(data_temp);
        }
        else if (contentType == 'application/json') {
          bodyData = JSON.stringify(data);
        }
      }
      
      let requestHeader = { 'Content-Type': contentType};      

      let p = new Promise((resolve, reject) => {
        fetch(url, { credentials: 'same-origin', method: type, body: bodyData, headers: requestHeader }).then(response => {
          if (response.ok) {
            let rs_ct = response.headers.get('Content-Type');
            if(rs_ct==='application/json'){
              response.json().then(res => {
                resolve(res.data ? res.data : {});
              })
            }
            else if(rs_ct==='application/geo+json'){
              response.json().then(res=>{
                resolve(res);
              })
            }
            else if(rs_ct.startsWith('text/html') || rs_ct.startsWith('text/plain') || rs_ct.startsWith('text/xml')){
              response.text().then(res => {
                resolve(res);
              })
            }
            else{
              response.blob().then(res => {
                resolve(res);
              })
            }
          }
          else {
            //reject({ code: response.status, msg: response.statusText });
            response.json().then(res => {
              //401，token无效跳转到登录页面
              if(res.code==401){
                tokenStore.reset();
                proxy.$router.push('/');
              }
              else{
                reject({ code: res.code, msg: res.msg });
              }
            })
          }
        }).catch(e => {
          console.log(e)
          reject({ code: e.name, msg: '请求失败：' + url });
        })
      })
      return p;
    }

    proxy.post = function (url, data, contentType = 'application/x-www-form-urlencoded') {
      return proxy.ajax(url, data, 'POST', contentType);
    }

    proxy.get = function (url, data) {
      if (data) {
        let paramsArray = [];
        //拼接参数
        Object.keys(data).forEach(key => paramsArray.push(key + '=' + data[key]))
        if (url.search(/\?/) === -1) {
          url += '?' + paramsArray.join('&')
        } else {
          url += '&' + paramsArray.join('&')
        }
      }
      return proxy.ajax(url, null, 'GET');
    }
    
  }
}