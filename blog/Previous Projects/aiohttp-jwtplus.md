# aiohttp-jwtplus

.VERSION | LICENCE | VERSION | PUBLISH | BUILD
:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:|:-------------------------:
![fury](https://badge.fury.io/py/aiohttp-jwtplus.svg) | ![licence](https://img.shields.io/github/license/GoodManWEN/aiohttp-jwtplus) | ![pyversions](https://img.shields.io/pypi/pyversions/aiohttp-jwtplus.svg) | ![Publish](https://github.com/GoodManWEN/aiohttp-jwtplus/workflows/Publish/badge.svg) | ![build](https://github.com/GoodManWEN/aiohttp-jwtplus/workflows/Build/badge.svg)

Aiohttp middleware and helper utils for working with JSON web token(signature).
Added a post router for improving security level of SPAs &amp; auto refresh secrets. 

- Secret auto refresh.
- Totally separated content.
- Works on Python3.7+

## Requirements
- [Aiohttp >= 2.3.5](https://github.com/aio-libs/aiohttp)
- [PyJWT](https://github.com/jpadilla/pyjwt)

## Install

    pip install aiohttp-jwtplus

## Usage
- You need to create a SecretManager object ,which manages informations(secret \ scheme \ algorithm \ exp_interval \ auto_refresh_interval etc.) about jwt first.
- Then you need to create a JWTHelper ,in whose slots you can  definite your business logic ,such as where you get token from ,what you do in identify process etc. If you dont pass them in ,JWTHelper will provides you a basic version of token_getter & identifier ,which simplely gets token from headers['Authorization'] value and then check out if decoded dictionary has key value 'username'.
- Finally you can create aiohttp.web.Application and pass middlewares in . It's a necessary condition to passin pre_jwt_identifier() and post_jwt_router() in order if you would like to activate post router. It's no need to register middleware via decorator first.

## Behaviors of routing under different authorization
path | remarks | authorized destination |  unauthorized destination
-|-|-|-
/index.html | Entry of main functional SPA | /index.html | /login.html
/login.html | Entry of login page. Independent SPA | /index.html | /login.html
/login_api  | Login api , one in jwt whitelist. | /login_api | /login_api
/setattr_api | One of protected apis. | /setattr_api | 403 or 401
/404        | Undefined page | /index.html | /login.html

*/\* Status code 404 would be handled in SPA \*/*

## Example
`server_basic.py` 
\# here's a basic aiohttp hello-world server with four kinds of routing requirement respectively.

```Python3
from aiohttp import web

routes = web.RouteTableDef()

@routes.get('/index.html')
async def main_spa_page(request):
    return web.Response(text="this is index.html")

@routes.get('/login.html')
async def login_spa_page(request):
    return web.Response(text="this is login.html")

@routes.get('/authentication')
async def loginapi(request):
    return web.Response(text="loginapi called")

@routes.get('/setattr')
async def setattr(request):
    return web.Response(text= 'this is a procted api')

app = web.Application(middlewares=[])
app.add_routes(routes)
web._run_app(app)
```

`server.py` 
\# Add several lines to easily start a server with jwtplus-plugin.
```Python3
import asyncio
from aiohttp import web
from aiohttp_jwtplus import (
    SecretManager,
    JWTHelper,
    basic_identifier,
    basic_token_getter,
    show_request_info
)

routes = web.RouteTableDef()

@routes.get('/index.html')
async def main_spa_page(request):
    show_request_info(request)
    return web.Response(text="this is index.html")

@routes.get('/login.html')
async def login_spa_page(request):
    show_request_info(request)
    return web.Response(text="this is login.html")

@routes.get('/authentication')
async def loginapi(request):
    show_request_info(request)
    return web.Response(text="loginapi called")

@routes.get('/setattr')
async def setattr(request):
    show_request_info(request)
    return web.Response(text= 'this is a procted api')

secret_manager = SecretManager( secret = 'testsecret' ,    # default empty, will generate a random string.
                                refresh_interval = '30d' , # default 0 ,represents secret auto refresh disabled. Accept string or int 
                                scheme = "Bearer" ,        # default.
                                algorithm = 'HS256' ,      # default.
                                exptime = '30d' ,          # default.
                                )

jwt = JWTHelper(
            unauthorized_return_route = '/login.html' , 
            # this's an exception which means if you've alreadly logined ,you cannot access to this page. 
            unauthorized_return_route_handler = login_spa_page,
            authorized_return_page_handler = main_spa_page,
            secret_manager = secret_manager , 
            token_getter = basic_token_getter,  # default
            identifier =  basic_identifier ,    # default
            whitelist = ('/authentication', ) , # must be a tuple ,accepts regular expresion.
            protected_apis = ['/setattr',] 
        )

app = web.Application(middlewares=[ 
                jwt.pre_jwt_identifier(),
                jwt.post_jwt_router(),
                                ])
app.add_routes(routes)
loop = asyncio.get_event_loop()
loop.create_task(secret_manager.auto_refresh())
# Explicit trigger eventloop since we starts a secret-auto-refresh thread.  
loop.run_until_complete(web._run_app(app))
```

`client.py` 
\# For a quick test with python pretended frontend.
```Python3
import asyncio
from aiohttp import ClientSession 
from aiohttp_jwtplus import (
    SecretManager,
    JWTHelper,
    basic_identifier,     # it's a coroutine
    basic_token_getter,   # it's a coroutine
    show_request_info     # print function
)


secret_manager = SecretManager( secret = 'testsecret' ,    # default empty, will generate a random string.
                                refresh_interval = 0 ,     # default 0 , no auto refresh.
                                algorithm = 'HS256' ,      # default.
                                exptime = '30d' ,          # default.
                                )

url_pattern = 'http://localhost:8080{}'
url_exts = [    '/index.html' ,
                '/login.html' ,
                '/authentication',
                '/setattr',
                '/404',
                ]
                
# Simulate you've alreadly got token feedback from server.
# If you would like to generate token(without scheme) ,it accepts a dictionary
# and items in which would be updated to jwt source payload. 
jwt = secret_manager.encode({'username':'jacky'})

headers = {
    'Authorization': "Bearer " + jwt
}

async def main():
    async with ClientSession() as session:
        print(f'{"#"*22}\nWith authentication')
        for urlext in url_exts:
            async with session.get(url_pattern.format(urlext) , headers = headers) as response:
                text = await response.text()
                print(f"called {urlext} ,\n\tget statuscode {response.status} , \n\treturn text \"{text}\"")
        print(f'{"#"*22}\nWithout authentication')
        for urlext in url_exts:
            async with session.get(url_pattern.format(urlext) , headers={'Authorization':'None'}) as response:
                text = await response.text()
                print(f"called {urlext} ,\n\tget statuscode {response.status} , \n\treturn text \"{text}\"")

asyncio.run(main())

```

`modify_identifier.py` 
\# Self-modified identifier & token_getter.
```Python3
from aiohttp import web
from aiohttp_jwtplus import (
    SecretManager,
    JWTHelper
)

async def identifier_mod(payload):
    '''
    An identifier accepts a payload(as dictionary of jwt decoded result),
    and whose return value will be stored as one of request's property named 'auth_carry'
    If you would like to make identification fail in middleware(before handle requests),
    return False.
    You don't need to worry about exceptions.
    '''
    if 'username' in payload:
        return payload['username']
    else:
        return False

@routes.get('/index.html')
async def authorised(request):
    username = request['auth_carry']['username']
    if username == 'admin':
        return web.Response(text = 'pass')
    else:
        return web.Response(text = 'fail')

secret_manager = SecretManager( secret = 'testsecret' )

jwt = JWTHelper(
            unauthorized_return_route = '' , 
            unauthorized_return_route_handler = authorised,
            authorized_return_page_handler = authorised,
            secret_manager = secret_manager 
        )
        
app = web.Application(middlewares=[ 
        jwt.pre_jwt_identifier(),
        jwt.post_jwt_router(),
                        ])
app.add_routes(routes)
web.run_app(app)

# Then you shall start a simulate client and encode a header with jwt authenrized payload with 'usernaem : admin' in it
# and test if you got the corret response.
```
