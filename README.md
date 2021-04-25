# vuetify-tailwind-animate-starter
A production ready template with essential tools.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Packages

```
@vue/cli 4.5.11, Blank template with ESLint
vuetify default
node-sass & sass-loader
tailwindcss + postcss
animate.css
vuex
vue-router
axios & vue-axios
vue-wechat-title
```

### Steps
To create a production ready project:
```
vue create demo
cd demo
vue add vuetify
npm install -D sass-loader node-sass
npm install animate.css
npm install tailwindcss
```
create ./assets/tailwind.css:
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```
add to main.js
```
import "@/assets/tailwind.css"
```
create setting file
```
npx tailwind init --full
```
test run
```
npm run serve
```
oops, program went wrong seems like we're still missing some dependencies.
```
npm uninstall tailwindcss postcss autoprefixer
npm install tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```
and create a postcss configure file: postcss.config.js
```
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```
then
```
npm install vuex --save
npm install vue-router
npm install axios --save
npm install vue-axios --save
npm install vue-wechat-title --save
```

### Remarks

- By default, backend proxy at 127.0.0.1:8079 -> /dev/
- By default, all tailwind.css classes should be used with prefix `tw-` and all animate.css classes should be used with prefix `animate__`
