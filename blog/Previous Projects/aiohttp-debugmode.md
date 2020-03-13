# aiohttp-debugmode
This package helps you easily start a aiohttp develpment server in subprocess ,everytime dependencies/statics are modified ,daemon process will automatically reload server thus helps you automation your workflow. Aiohttp-debugtoolbar included. 

.VERSION | LICENCE | VERSION | PUBLISH | BUILD
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![fury](https://img.shields.io/pypi/v/aiohttp-debugmode.svg) | ![licence](https://img.shields.io/github/license/GoodManWEN/aiohttp-debugmode) | ![pyversions](https://img.shields.io/pypi/pyversions/aiohttp-debugmode.svg) | ![Publish](https://github.com/GoodManWEN/aiohttp-debugmode/workflows/Publish/badge.svg) | ![build](https://github.com/GoodManWEN/aiohttp-debugmode/workflows/Build/badge.svg)

- Based on watchdog.
- Works on Python3.7+
- [aiohttp-debugtoolbar](https://github.com/aio-libs/aiohttp-debugtoolbar) included ,thus you can get a full report of traceback if exception raised.

![](https://github.com/GoodManWEN/aiohttp-debugmode/blob/master/screenshots/carbon.png)
![](https://github.com/GoodManWEN/aiohttp-debugmode/blob/master/screenshots/aiohttp_debugtoolba_sceenshot.png)
*(\* Screenshot from [aio-libs/aiohttp-debugtoolbar](https://github.com/aio-libs/aiohttp-debugtoolbar) \*)*

## Install

    pip install aiohttp-debugmode

## Usage

`quick_start.py`
\# here's a demo script from aiohttp.doc\\quickstart
```Python3
from aiohttp import web
routes = web.RouteTableDef()

@routes.get('/')
async def hello(request):
    return web.Response(text="Hello, world")

app = web.Application()
app.add_routes(routes)
web.run_app(app)
```

Simply modify severl lines like this
```Python3
# Add import
from aiohttp_debugmode import Debugmode

# Let Debugmode take over control of run_app
Debugmode.run_app(app)
```

By default ,`templates` & `static` floder is added to observing list of watchdog. You can manually set observe file/floder using append_observe.
```Python3
Debugmode.append_observe(['other/login.html' ,'assets'])
```

If you need some kind of process when a aiohttp server starts up:
```Python3
def stup():
    ... # do something

Debugmode.on_startup(stup) # accepts callable.
```

## Examples

### aiohttp-debugmode with Vue
Assume that you are usiung vue-cli and have a directory structure like this:
```
...
├── Project
│   ├── static
│   ├── templates
│   ├── app.py               # aiohttp app entry
│   └── frontend             # vue frontend folder
│       ├── dist             # webpack output directory
│       │   ├── css
│       │   ├── js
│       │   └── index.html
│       ├── node_modules
│       │   └── ...
│       ├── src              # vue source
│       │   └── ...
│       └── vue.config.js
│   └── ...
```
Assume that webpack outputs built file into `/Project/frontend/dist` floder while your aiohttp app collects templates & statics from `/Project/templates` & `/Project/static` folder.

Here's a sample code:
```Python3
from aiohttp import web
from aiohttp_debugmode import Debugmode
import aiohttp_jinja2

# Pretended doing some tempate rander stuff.
# @aiohttp_jinja2.template('index.html')
async def hello(request):
    return web.Response(text="Randered.") 

# Debugtoolbar included thus you can get 
# a full report of traceback.
async def error(request):
    raise Exception('Testing.')

app = web.Application()
app.router.add_route('GET', '/', hello)
app.router.add_route('GET', '/err', error)
app.add_routes([web.static('/', 'static')])

def initialize():
    import shutil , os , glob
    # You may use os.path.abspath to get absolute path in some situation.
    if os.path.exists('frontend\dist\index.html'):
        shutil.move('frontend\dist\index.html' , 'templates')
        try:
            shutil.rmtree(filepath)
            os.mkdir(filepath)
            for filepath in glob.glob('frontend\dist\*'):
                shutil.move(filepath , 'static')
        except Exception as e:
            raise e

Debugmode.append_observe(['frontend\dist']) # backslashes on windows.
Debugmode.on_startup(initialize)
# Debugmode takes over run_app instead of web.run_app
Debugmode.run_app(app , host = '127.0.0.1' , port = 8080)
```

Thus every time you run `npm run build` ,debugmode will catch file modified event ,init file directory and restart aiohttp server with new generated html/js/css file.
