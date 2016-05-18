//判断当前用户是否处于登陆状态,如果不是,将其转到登陆界面



	function urlopenwindow(callback) {
		var stateText = localStorage.getItem('$state') || "{}";
		stateText = JSON.parse(stateText);
		if (stateText.logined==true) {
             callback();
		} else {
			var btnArray = ['否', '是'];
				mui.confirm('请登录后继续使用，是否继续？', '请登录', btnArray, function(e) {
					if (e.index == 1) {
						mui.openWindow({
							url: "login.html"
						})
					} else {
						return;
					}
				})
		}
	}

