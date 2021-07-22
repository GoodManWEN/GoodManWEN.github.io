![](https://raw.githubusercontent.com/GoodManWEN/GoodManWEN.github.io/main/misc/figure.png)

# About GoodManWEN.github.io

A website simulating linux system's GUI, using theme of Deepin distro. You can write blogs with markdown and use it to serve your own technical resumes.

#### [中文文档](https://github.com/GoodManWEN/GoodManWEN.github.io/blob/main/misc/readme_chs.md)

## Quick Start
This project is originally designed to be host on github pages. If this is the way you expect, you follow these steps 
```
1. Fork this project.
2. Goto settings page to link your website to a specified URL.
3. Start the actions manually (According to github's default policy, actions will not be started 
   automatically until they are confirmed manually).
4. Update line 18 of file /.github/workflows/AutoUpdate.yml, connect it to your repo's address.
```
After setting up, if your configuration is correct, then the project will run as expected. All of your changes in `/blog` directory will be identically projected onto the linked website (according to your settings).

Nevertheless, some people may want to self-host it (locally), then you should follow these steps:
```
git clone https://github.com/GoodManWEN/GoodManWEN.github.io.git
cd GoodManWEN.github.io.git
npm install
npm run serve
```
At this point you should get the functionality same as a basic blog framework, and if you want to change the blog content to your own, you should modify **you should change the content in the /blog directory**, and then:
```
python3 generate.py
npm run build
```
This will convert the pages into static distribution files in `/docs` directory, you can serve them in any web framework.

### What's the difference from other comparable programs?

I happened to write this project because I personally need a project demonstration platform recently, other than comparable programs, I believe this project should have some usefulness in addition to aesthetics. Design-wise, it implements a complete window UI and a basic nested directory functionality. So you can show some folder simulatively as your blog, which accepts markdown files will reduce the cost of migration, and you can resize and stretch the window freely for easy navigation.

### How to update blog contents?

If your project is hosted by **Github Pages**, you can simply modify the contents of the blog directory and then submit a commit. Content will be update automatically by Actions, and then distributed to the website (there may be a delay in updates due to caching policies).

### About blog features

To make it easier for you to post your articles as hyperlinks on third-party platforms, you can use the following routing form to allow users to open your specified posts directly with a unique link:
```
   https://{{host}}/#/desktop/post/{{article_file_name}}.md

   e.g.
   https://GoodManWEN.github.io/#/desktop/post/README.md
```

Notably that program will recursively look for the first matched file in the file structure, which means that if you have multiple files using the same file name (like README.md) but distributed in different folders, this will only match the first of them. 

If there is no match, then a 404 file will be returned.

Regarding the logic to generate title & abstract, the article will be titled with the first recognized `# line` and the first subsequent line without a punctuation mark will be recognized as abstract.

### What if I'd like to customize the music module?

This project has a simple built-in music module built using Aplayer. Considering the copyright policy, you need to set up your music play list yourself. The relevant configuration files are stored in `/public/musics.json`, you need to follow the same format when edit. Generally speaking, you need to focus on the name, the author, the link to the source and the link to the cover of the music.

By default, there's no direct music download links available, and all the album covers are configured in the `/public/musiccovers` directory.

### Packages

This website (source code here) uses these sources:
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
Markdown render is powered by 
```
markdown-it-vue
```
Music player is basic on
```
vue-aplayer
```
This project is inspired by:
- [https://github.com/vivek9patel/vivek9patel.github.io](https://github.com/vivek9patel/vivek9patel.github.io)
- [https://codepen.io/Krishna1947/pen/KKgZgLd](https://codepen.io/Krishna1947/pen/KKgZgLd)
- [https://github.com/puruvj/macos-web](https://github.com/puruvj/macos-web)

### Contributing

Any improvements that wish to improve this site are welcome, you need to contribute to this project by submitting a PR. Since the author himself is not a professional programmer focused on front-end, he is not familiar with the way how front-end tests are deployed, so you shoulddescribe clearly in the PR the reason for your submission, all the places you are modifying, and what we should expect to get out of it.

##### [Guidelines for further development](https://github.com/GoodManWEN/GoodManWEN.github.io/blob/main/misc/Guidelines%20for%20further%20development.md)


### Current deficiencies

As mentioned above, since my daily work field is mainly not front-end programming in the past years. As the project is basicly comes from fortuity, I got not many time to finish it other than working hours. The basic coding time is about three days, So this will definitely leave a lot of defects. During the implementation that I realize there are still noticeable differences between the project and the original deepin's UI system, simply put:
- Fonts, I didn't have time to tune the fonts, which caused them to differ significantly from the originals.
- Icons, to get the icons quickly, they come from screenshots.
- Except for some parts, the animations are mainly come from `animate.css`, the performance is different from the original version.

Similarly, this framework does not perform well on mobile platforms. This is partly due to compatibility issues with `animate.css`, and others comes from that many designs are designed for desktop platforms, and I don't know how to arrange them on mobile screens.

## About Deepin

The author of this project has no official relationship with deepin, if you wish to try out the deepin system after viewing this project, please visit [https://www.deepin.org/en/](https://www.deepin.org/en/)

### Spacial thanks

To you, hope you enjoy this website.

[![Stargazers repo roster for @GoodManWEN/GoodManWEN.github.io](https://reporoster.com/stars/GoodManWEN/GoodManWEN.github.io)](https://github.com/GoodManWEN/GoodManWEN.github.io/stargazers)
