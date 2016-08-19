var beecloud = {};
var channels = null;
var w = null;

//两个回调函数，使用dopay来执行,支付成功和支付失败的回调函数
beecloud.payReq = function(data, cbsuccess, cberror) {
	doPay(data, cbsuccess, cberror);
};

beecloud.genBillNo = function() {
	var d = new Date();
	var vYear = d.getFullYear();
	var vMon = d.getMonth() + 1;
	var vDay = d.getDate();
	var h = d.getHours();
	var m = d.getMinutes();
	var se = d.getSeconds();
	var ms = d.getMilliseconds();
	billno = "" + vYear + (vMon < 10 ? "0" + vMon : vMon) + (vDay < 10 ? "0" + vDay : vDay) + (h < 10 ? "0" + h : h) + (m < 10 ? "0" + m : m) + (se < 10 ? "0" + se : se) + ms;
	return billno;
};

/*****有个执行函数
***
获取支付通道，void plus.payment.getChannels( successCB, errorCB );
在进行支付操作前需获取终端支持的支付通道列表，用于提示用户进行选择。获取支付通道成功后通过successCB回调返回支持的所有通道列表，获取支付通道列表失败则通过errorCB回调返回。
successCB: ( ChannelsSuccessCallback ) 必选 获取支付通道成功回调函数
获取支付通道列表成功时的回调函数，用于返回终端支持的支付通道列表。
errorCB: ( PaymentErrorCallback ) 可选 获取支付通道失败回调函数
获取支付通道列表失败时的回调函数，用于返回错误信息。
***/
mui.plusReady(function() {
	plus.payment.getChannels(function(s) {
		//返回支付通道列表
		channels = s;
	}, function(e) {
		alert("获取支付渠道信权限失败:" + e.message);
	});
});

function checkServices(pc) {
	//*****支付服务的检测
	if (!pc.serviceReady) {
		var txt = null;
		switch (pc.id) {
			case "alipay":
				txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
				break;
			default:
				txt = "系统未安装“" + pc.description + "”服务，无法完成支付，是否立即安装？";
				break;
		}
		plus.nativeUI.confirm(txt, function(e) {
			if (e.index == 0) {
				pc.installService();
			}
		}, pc.description);
		return false;
	}
	return true;
}

function getRandomHost() {
	var hosts = ['https://apibj.beecloud.cn',
		'https://apihz.beecloud.cn',
		'https://apisz.beecloud.cn',
		'https://apiqd.beecloud.cn'
	];
	return "" + hosts[parseInt(3 * Math.random())] + "/2/rest/app/bill";
}

function getPayChannel(bc_channel) {
	var dc_channel_id = '';
	switch (bc_channel) {
		case 'ALI_APP':
			dc_channel_id = 'alipay';
			break;
		case 'WX_APP':
			dc_channel_id = 'wxpay';
			break;
		default:
			break;
	}

	for (var i in channels) {
		if (channels[i].id == dc_channel_id && checkServices(channels[i])) {
			return channels[i];
			//返回具体点击的支付程序
		}
	}
	return null;
}

function doPay(payData, cbsuccess, cberror) {
	//***暂时不知道这是个什么值，现在知道了，是个等待框
	if (w) return;
	console.log('doPay: ' + JSON.stringify(payData));
    //等待框
	w = plus.nativeUI.showWaiting();
	//开始ajax请求，将所需要的数据全部发送到中间服务器
	mui.ajax(getRandomHost(), {
		data: JSON.stringify(payData),
		type: 'post',
		dataType: 'json',
		contentType: "application/json",
		success: function(data) {
			console.log(JSON.stringify(data));
			//成功返回后关闭等待框并且重置为空
			w.close();
			w = null;
			
			var paySrc = '';
            //code为零表示数据成功返回
			if (data.result_code == 0) {
				var payChannel = getPayChannel(payData.channel);
				
				if (payChannel) {
					//等于支付宝的时候
					if (payChannel.id === 'alipay') {
						paySrc = data.order_string;
						//等于微信的时候
					} else if (payChannel.id === 'wxpay') {
						var statement = {};
						statement.appid = data.app_id;
						statement.noncestr = data.nonce_str;
						statement.package = data.package;
						statement.partnerid = data.partner_id;
						statement.prepayid = data.prepay_id;
						statement.timestamp = parseInt(data.timestamp);
						statement.sign = data.pay_sign;
						paySrc = JSON.stringify(statement);
					}
					console.log(paySrc);
					/*
					void plus.payment.request( channel, statement, successCB, errorCB );
					说明：
　　　                                                调用指定的支付通道进行支付操作，其中statement包含支付操作的相关信息，支付模块将弹出支付界面供用户进行支付信息的输入确认操作。用户支付操作成功后通过successCB回调返回支付操作结果，支付操作失败则通过errorCB回调返回。 
					参数：
					channel: ( PaymentChannel ) 必选 支付通道
					指定支付操作的通道，通过getChannels接口获取。
					statement: ( String | JSON | OrderStatementIAP ) 必选 支付订单信息
					支付订单信息，由支付通道定义的数据格式，通常是由业务服务器生成或向支付服务器获取，是经过加密的字符串信息。
					successCB: ( PaymentSuccessCallback ) 必选 获取支付通道成功回调函数
					获取支付通道列表成功时的回调函数，用于返回终端支持的支付通道列表。
					errorCB: ( PaymentErrorCallback ) 可选 获取支付通道失败回调函数
					获取支付通道列表失败时的回调函数，用于返回错误信息。
					*/
					plus.payment.request(payChannel, paySrc, cbsuccess, cberror);
					//为银联的时候
				} else if (payData.channel == 'UN_WEB') {
					var web = plus.webview.create('', "beecloudPay");
					web.setJsFile('_www/js/95516.js');
					web.addEventListener('loaded', function() {
						if (!web.isVisible()) {
							web.show();
						}
					});
					web.loadData(data.html);
				}
			} else {
				var bcError = {};
				bcError.code = data.result_code;
				bcError.message = data.result_msg + ":" + data.err_detail;
				cberror(bcError);
			}
		},
		error: function(xhr, errorType, error) {
			w.close();
			w = null;
			cberror(error);
		}
	});
}