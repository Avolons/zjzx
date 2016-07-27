(function($) {
	$.enterfocus = function(selector, callback) {
		//借用原型将类似数组的对象转化为真正的数组
		var boxArray = [].slice.call(document.querySelectorAll(selector));
		//遍历数组
		for (var index in boxArray) {
			var box = boxArray[index];
			//全部添加keyup事件
			box.addEventListener('keyup', function(event) {
				//按下回车键触发事件
				if (event.keyCode == 13) {
					//记录这个div在整个div数组中的位置
					var boxIndex = boxArray.indexOf(this);
					//如果这是数组中的最后一个div，则执行callback函数
					if (boxIndex == boxArray.length - 1) {
						if (callback) callback();
					} else {
						//console.log(boxIndex);
						var nextBox = boxArray[++boxIndex];
						//给checkbox设置焦点
						nextBox.focus();
					}
				}
			}, false);
		}
	};
}(window.mui = window.mui || {}));