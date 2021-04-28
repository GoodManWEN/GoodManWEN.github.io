# GoodManWEN.github.io

```
这是一个web驱动的仿写Deepin桌面UI的博客工具，设计上完全依托于Github Pages开源部署，
你可以用来提供一个你的个人博客或者用来当做个人简历。

这个项目产生于偶然，恰好由于近期需要整理一个博客做项目展示。作者在论坛看到Ubuntu的
同类版本，但由于该作品是由react编写，我不熟悉react，所以想要迁移一个vue的同类版本，
所以有了本项目。

打算要做一个项目的话，首先面临的是要实现哪个系统的问题。由于大家最喜欢的Ubuntu已经
有人完成，重新实现轮子没有什么意义，另外作者本人以前也曾见过MacOS的类似版本，而
Windows由于多年耕耘，模仿其动画细节的成本似乎过大。Linux发行版虽然丰富，但摆在我们
面前的选择似乎并不多，日常使用的红帽系发行版似乎并不专注于桌面体验，实现意义并不大。
剩下的广泛被接受的发行版似乎还剩Manjaro, Fedora, 以及一些所谓的Gaming ready distro。 
最后我还是选择了Deepin，虽然没有用过，但也算是久闻大名，项目放在Github上供全世界的
vue开发者参考，也算是为国产做宣传了吧。
```

## 快速开始

本项目在设计上是由Github Pages提供服务的，所有api都会被转化为静态文件分发。如果你想要在本地运行和调试的话，请尝试以下步骤:
```
git clone https://github.com/GoodManWEN/GoodManWEN.github.io.git
cd GoodManWEN.github.io.git
npm install
npm run serve
```
如果你的npm和vue-cli版本合适的话，这样应该足够令程序跑起来，项目使用的版本你可以在下文和`package.json`中找到参考。

如果你希望修改博客内容，那么你应该直接修改`/blog`目录中的内容，该目录中所有.md内容都会被直接映射到网站中。

修改后执行以下命令生成静态文件。
```
python3 generate.py
npm run build
```
由于修改了vue-cli的默认设置，静态文件生成在/docs目录中。

### 这个项目和同类桌面比有何不同之处？

主要集中在本项目实现了更完善的窗口系统，你可以像正常操作系统一样随意创建多个窗口、移动、缩放他们的大小，以及自如管理他们的显式排序关系。实现了一个简易的递归目录系统所以你可以用来将整个文件夹映射出去作为你的博客。另外附赠一个玩具terminal。

### 我该如何更新我的博客？

如果你的博客是fork自本项目并且完全由Github Pages提供服务，那么您徐只要修改/blog目录的内容后提交commit即可，静态文件编译和分发将由Actions自动在后台完成。

如果你的博客直接fork自本项目，那么你需要检查你的Actions是否全部正确执行。据我所知在fork项目时某些actions会默认关闭自动执行，直到再次手动开启。

### 我该如何修改音乐播放器？

这个项目实现了一个简易的音乐播放器，基于`vue-aplayer`，如果你需要修改歌单，请修改`public`目录下的`musics.json`文件，参照指定格式配置即可。由于版权政策，在默认版本里我没有提供音乐的来源地址，你可以自定配置分发策略并在指定位置粘贴音乐的访问链接即可。

按照默认设置，如果你的音乐的封面都来自于自身分发（非第三方分发），那么封面的存放目录是`/public/musiccovers`

### 博客功能的进一步说明

为了实现基础的博客功能，一个典型需求是您希望将文章链接发布在第三方平台，使用户可以通过链接直接定位到您的文章。为了实现该效果，请遵循以下路由规则构建链接

```
   https://{{域名}}/#/desktop/post/{{文件名}}.md

   如：
   https://GoodManWEN.github.io/#/desktop/post/README.md
```

具体逻辑层面，程序将递归搜索并返回**第一个**文件树中文件名与需求值匹配的项。这意味着如果您有多个文件名相同，但分置于不同目录的文件，程序只能返回其中的一个而忽略其他。您无需在意文件名中的空格问题，他们将被自动转义。

如果没有匹配到结果，将显示一篇404文章。

有关文章识别规则，识别逻辑为，程序将文章的`# 开头行`识别为标题，而其后的非标点符号开头的第一行将被识别为摘要。

### 借物表

这个项目基于以下开源项目:
```
@vue/cli 4.5.11, Blank template with ESLint
vuetify default settings
node-sass & sass-loader
tailwindcss + postcss
animate.css
vuex
vue-router
axios & vue-axios
vue-wechat-title
```
Markdown渲染基于 
```
markdown-it-vue
```
音乐播放器基于
```
vue-aplayer
```

灵感来源于以下项目
- [https://github.com/vivek9patel/vivek9patel.github.io](https://github.com/vivek9patel/vivek9patel.github.io)
- [https://codepen.io/Krishna1947/pen/KKgZgLd](https://codepen.io/Krishna1947/pen/KKgZgLd)


### 贡献方式

为了改进本系统而做出的任何形式的贡献都是欢迎的。但是由于作者本身是非专业前端程序员，并不熟悉GUI应该如何部署自动测试，这让开源社区的代码合并产生了一些困难。在没有自动测试的模式下，如果你要提交PR的话，你应该在PR中注明自己修改的原因、修改的所有地方、以及期望看到的效果。

##### [二次开发说明](https://github.com/GoodManWEN/GoodManWEN.github.io/blob/main/misc/Guidelines%20for%20further%20development.md)

### 现存的问题

由于作者本身是大数据专业，属于一个严重跑题的非专业前端开发。并且由于时间有限，实际编码时间大概在三天左右，很多地方的处理是设想在小规模数据量下能良好工作即可，所以以一切从简为原则实现，这必然会带来许多问题。

目前已知的模仿UI方面与原生界面的不同：
- 我没有时间调教字体，本界面中字体是一套通用字体，与原版有较大差异。
- 图标，为了最大程度减轻获得困难，图标全部来自于截图。
- 本框架中大部分动画来自于animate.css，其表现上与原生有一定差异。

同样地，虽然这个模块遵守响应式设计，但实际在移动平台表现不佳。原因一部分来自于animate.css在移动平台的兼容性问题，另外一部分来自于很多UI组件专门为桌面平台设计，作者本人也不知道在移动平台上应该如何排版它们。

## 关于 Deepin

作者本人与Deepin官方没有任何关系，纯粹由于兴趣爱好和宣传国产系统的目的编写，不以项目的任何形式盈利为目的。 如果您对Deepin感兴趣，请访问官方网站 [https://www.deepin.org/](https://www.deepin.org/)

### 鸣谢

本项目以AGPLv3协议开源，谢谢你浏览这个项目，希望你能在探索中获得乐趣。
