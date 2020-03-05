# setu-bot
build instructions for a coolq setu-bot. <br> 
兴趣使然的色图机器人安装指南

## 使用方法
下载->切换目录->执行
```
git clone https://github.com/GoodManWEN/setu-bot.git
cd setu-bot
bash coolq.bot.install
```
↑以上服务器设置完成 <br>
接下来打开coolq图形界面登录 <br>
访问网址 你的服务器IP:8080 按照提示操作 <br>
\# <br>
登录过后，右键点击图标 -> 应用 -> 应用管理 -> 重载应用 -> HTTP API -> 开启 <br>
<br>
编写环境 ： ubuntu 16.04 LTS

## 组件逻辑
```
+--------------+         +------------+ 
|    Redis     |         |  External  |
+--------------+         +------------+
       |                   http ||
       |                        ||
+--------------+    ws   +------------+   ws  +-----------+
| Python Logic | <====== | coolq-http | <==== | picfinder | 
+--------------+         +------------+       +-----------+
                            api || event
                                ||
                         +------------+ 
                         | coolq-wine | 
                         +------------+
                                || 
                                ||
                         +--------------+
                         | coolq-server |
                         +--------------+    
                                ||  request
                                ||
+--------------+         +--------------+
| QQ user pc / | message |   server of  |
| phone client | <======>|   Tencent    |
+--------------+         +--------------+
```

## 数据库相关
本项目图片资料以非关系型数据库redis管理，并将一定量图片缓存在本地<br>
仓库项目本身不含数据，意思是如果只是执行bash脚本安装，即使完全安装上述所有组件，**机器人仍然是无法运行的。**<br>
想让它跑起来，你需要填充自己的图片资料。

现假设加入100张图，Redis内部数据结构如下：（默认db0）
  1. 总体数据结构分为两部分：一系列string，以及一个hash.
  2. 对于每张图，都有一个string键值对储存其地址，形式为 "pid":"地址" , 例如 "4000000":"https://i.pximg.net/img-master/img/2009/04/25/19/36/39/4000000_p0_master1200.jpg" ，使用string是为了方便randomkey()采样。
  3. 对于每张图，在特殊hash（key名"informations"）中都有一个键值对，储存其作者ID与标题（可以为空），为存储开发方便用特殊符号''$^$~'分隔 ,例如"informations":{"4000000":"ThisIsTitle$^$~I'mAuthor'"}

## 使用项目
- [docker-wine-coolq](https://github.com/CoolQ/docker-wine-coolq)
- [coolq-http-api](https://github.com/richardchien/coolq-http-api)
- [python-aiocqhttp](https://github.com/richardchien/python-aiocqhttp)
- [CQ-picfinder-robot](https://github.com/Tsuk1ko/CQ-picfinder-robot)
