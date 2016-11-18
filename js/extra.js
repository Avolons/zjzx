/*
"Header": {
    "App": {
      "PackageName": "sample string 1",//包名
      "AppName": "sample string 2",//应用名称
      "Version": "sample string 3",//版本号
      "TenantId": 4,//施教机构id
      "Channel": "sample string 5"//应用安装来源
    },
    "Device": {
      "Platform": "sample string 1",//"iOS或者Android",
      "Model": "sample string 2",//"设备型号",
      "ScreenSize": "sample string 3",//"屏幕大小",
      "IMEI": "sample string 4",//"IMEI",安卓专用
      "Mac": "sample string 5",//设备唯一标示，ios专用
      "ClientId": "sample string 6"//空着
    },
    "User": {
      "Token": "sample string 1"//由后台获取
    }
  }
 */

mui.plusReady(function() {
	if(!JSON.parse(plus.storage.getItem('header'))) {
		var header = {
			App: {
				PackageName: null, //包名
				AppName: null, //应用名称
				Version: null, //版本号
				TenantId: null, //施教机构id
				Channel: null //应用安装来源
			},
			Device: {
				Platform: null, //"iOS或者Android",
				Model: null, //"设备型号",
				ScreenSize: null, //"屏幕大小",
				IMEI: null, //"IMEI",安卓专用
				Mac: null, //设备唯一标示，ios专用
				ClientId: null //空着
			},
			User: {
				Token: null //由后台获取
			}
		};

		header.App.PackageName = 'andrics_sdf'; //人为设定这个值

		plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
			//设置app的名称
			header.App.AppName = wgtinfo.name;
			//设置app的版本号
			header.App.Version = wgtinfo.version;
		});

		//施教机构值
		header.App.TenantId = 8; //施教机构id，人为设置

		header.App.Channel = plus.runtime.origin; //应用安装来源

		header.Device.Platform = plus.os.name; //当前系统名称（安卓/ios）

		header.Device.Model = plus.device.model; //设备的型号

		header.Device.ScreenSize = plus.screen.resolutionHeight + '*' + plus.screen.resolutionWidth; //设备的宽高比

		header.Device.IMEI = plus.device.imei; //设备的国际移动设备身份码(安卓机使用);

		header.Device.Mac = plus.device.uuid; //设备的唯一标示（ios使用）;

		header.User.Token = null;
		//从本地获取到token值，并将其注入  
		//将header保存到本地数据区中 
		plus.storage.setItem("header", JSON.stringify(header));
		//清空token值
	};
});

//判断是否处于登录状态
function urlopenwindow(callback) {
	//获取token值
	var token = JSON.parse(plus.storage.getItem('header')).User.Token;
	//		console.log(token);
	if(token) {
		callback();
	} else {
		var btnArray = ['否', '是'];
		mui.confirm('请登录后继续使用，是否继续？', '请登录', btnArray, function(e) {
			if(e.index == 1) {
				//获取当前页面url
				var thisWebview = plus.webview.currentWebview().id;

				console.log(thisWebview);
				//自定义事件触发登陆页面
				var loginHtml = plus.webview.getWebviewById('login.html');

				mui.fire(loginHtml, 'logined', {
					webviewId: thisWebview
				});

				mui.openWindow({
					url: "login.html"
				});
				//mui.alert(JSON.stringify(thisWebview));
			} else {
				return;
			}
		})
	}
}

//url 配置
//var url='http://zjzxvpn.zjzx.cn/'; 
//var url='http://192.168.1.112/';
var url = 'http://appapi.zjzx.cn/';
 
//ajax封装函数
function sendAjax(urls, data, callback, errors) { 
	errors = errors || function() {   
		return false;
	};
	urls = url + urls;
	console.log(urls);
	mui.ajax(urls, {
		data: data,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 5000, //超时时间设置为5秒；
		success: function(data) { 
			callback(data);
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
			mui.ajax(urls, {  
				data: data,
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 5000, //超时时间设置为5秒；
				success: function(data) {
					callback(data);
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log(type);
					errors()
				}
			});
		}
	});
};