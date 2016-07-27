## 简单概述
这是带登录和设置功能的mui模板项目，主要为了演示登录流程及设置界面div窗口切换效果；

## 核心功能
1. 启动App后校验登录状态，若已登录，直接跳转应用首页；否则，显示登录页面；
2. 支持本地注册；
3. 支持设置手势密码，登录时可使用手势密码代替账号、密码；
4. 支持评分、分享、拨打客服电话  



接口规范
手机端接口规范V1.0

接口说明	
接口地址	
请求参数	
返回参数	
示例：



















接口说明	
接口地址	
请求参数	
返回参数	
示例：
















所有接口统一格式:
请求:
<Post>
{
    "Body": {
        "参数名1": "sample string 1",
        "参数名2": "sample string 2"
    },
    "Header": {
        "App": {
            "PackageName": "包名",
            "AppName": "应用名称",
			“TenantId”:”租户ID”,
            "Version": "版本",
			“Channel”:”推广渠道”
        },
        "Device": {
            "Platform": "iOS或者Android",
            "Model": "设备型号",
            "ScreenSize": "屏幕大小",
            "IMEI": "IMEI",
            "Mac": "IOS设备",
            "ClientId": "客户端id，设备唯一。整个程序存在周期内唯一,譬如安装的时候生成一个Gguid，或者首次启动的时候"
        },
        "User": {
            "Token": "sample string 1"
        }
    }
}
<Get>
{
    "Body": {
        "参数名1": "sample string 1",
        "参数名2": "sample string 2"
    },
    "Header": {
        "App": {
            "Version": "版本"
			“TenantId”:”租户ID”
},
        "User": {
            "Token": "sample string 1"
        }
    }
}

说明:body中为请求的参数，Header中包含app的信息和用户的Token值，Token值在登录后获取到，不需要登录可以调用的接口 Token可以为空

返回：
{
    "Body": {
        "参数1": "结果1",
        "参数2": "结果2",
        "Items": []
    },
    "Code": 200  
}

说明:body中为返回的结果，code为响应这个接口调用的状态返回值，当body中需要返回列表集合数据时放在Items此项中，当客户端需要分页数据信息时返回结构为：
{
    "Body": {
        "TotalCount": "总条数",
        "PageSize": "页大小",
        "PageIndex": "第几页",
        "PageCount": "共几页",
        "Items": []
    },
    "Code": 200
}

