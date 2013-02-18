## Project GPC -- Test Case

****************************

#### No.TC001

测试模块：用户注册

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/register
3. 页面跳转到用户注册页面
4. 不输入任何信息，点击Submit按钮

期待结果:

在注册Form下方出现"Please input the information completely"的错误信息

****************************

#### No.TC002

测试模块：用户注册

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/register
3. 页面跳转到用户注册页面
4. 输入用户名或密码或Email，不要全部填入
5. 点击Submit按钮

期待结果:

在注册Form下方出现"Please input the information completely"的错误信息

*****************************

#### No.TC003

测试模块：用户注册

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/register
3. 页面跳转到用户注册页面
4. 填写所有输入框，在Password和Repeat Password两栏中填写信息不一样
5. 点击Submit按钮

期待结果:

在注册Form下方出现"Please confirm the repeated password"的错误信息

******************************

#### No.TC004

测试模块：用户注册

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/register
3. 页面跳转到用户注册页面
4. 填写所有输入框，确保用户名没有注册过，Password和Repeat Password输入信息一致。Email一栏中，不要填写Email格式，写入一串不带@的字符。
5. 点击Submit按钮

期待结果:

在注册Form下方出现"Email format error"的错误信息

******************************

#### No.TC005

测试模块：用户注册

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/register
3. 页面跳转到用户注册页面
4. 填写所有输入框，Password和Repeat Password输入信息一致。Email填写正确。确保用户名已经被注册。
5. 点击Submit按钮

期待结果:

在注册Form下方出现"Username has been already occupied. Please change username."的错误信息

******************************

#### No.TC006

测试模块：用户注册

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/register
3. 页面跳转到用户注册页面
4. 填写所有输入框，Password和Repeat Password输入信息一致。Email填写正确。确保用户名没有被注册。
5. 点击Submit按钮

期待结果:

页面跳转到localhost:3000/home页面

******************************

#### No.TC007

测试模块：用户登录

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000或者localhost:3000/login
3. 页面跳转到用户登录页面
4. 不要填写信息，或只填写Username或Password一项
5. 点击Sign in按钮

期待结果:

在登录Form下方出现"Please input your username and password"的错误信息

******************************

#### No.TC008

测试模块：用户登录

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000或者localhost:3000/login
3. 页面跳转到用户登录页面
4. 填写信息，Username或Password有一项要填写错误，即与注册信息不符合
5. 点击Sign in按钮

期待结果:

在登录Form下方出现"Authentication failed, please check username and password"的错误信息

******************************

#### No.TC009

测试模块：用户登录

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000或者localhost:3000/login
3. 页面跳转到用户登录页面
4. 填写信息，确保Username和Password输入信息正确
5. 点击Sign in按钮

期待结果:

页面跳转到localhost:3000/home页面

******************************

#### No.TC010

测试模块：用户退出

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000或者localhost:3000/login
3. 页面跳转到用户登录页面
4. 填写信息，确保Username和Password输入信息正确
5. 点击Sign in按钮
6. 进入localhost:3000/home页面之后，点击右上方logout按钮

期待结果:

用户退出，跳转到localhost:3000/页面，再次刷新页面之后仍然留在login 页面

******************************

#### No.TC011

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 不要填写信息，或只填写Admin或Access key一项
5. 点击Sign in按钮

期待结果:

在登录Form下方出现"Please input your username and password"的错误信息

******************************

#### No.TC012

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，Admin或Access Key有一项要填写错误，即与注册信息不符合
5. 点击Sign in按钮

期待结果:

在登录Form下方出现"Management Login Error"的错误信息

******************************

#### No.TC013

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮

期待结果:

页面跳转到localhost:3000/management/project页面

******************************

#### No.TC014

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 点击'New Project'按钮

期待结果:

出现New Project浮动页面。当点击Close按钮或者点击浮动框周围，浮动框会消失。

******************************

#### No.TC015

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 点击'New Project'按钮
8. 在出现的浮动页面中输入项目信息
9. 点击Save按钮

期待结果:

浮动框消失，同时在localhost:3000/management/project的Project List中出现新的记录

******************************

#### No.TC016

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. Project List中选择一个项目，点击Option中的Delete按钮

期待结果:

页面刷新，项目记录被删除

******************************