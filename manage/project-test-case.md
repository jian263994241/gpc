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

页面跳转到localhost:3000/management/project页面，并且Project List显示所有存储的项目

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

#### No.TC017

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 点击Candidate按钮进入localhost:3000/management/candidate页面
8. 点击"New Candidate"

期待结果:

出现New Candidate浮动框。当点击Close按钮或者点击浮动框周围，浮动框会消失。

******************************

#### No.TC018

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 点击Candidate按钮进入localhost:3000/management/candidate页面
8. 点击"New Candidate"
9. 在出现的浮动页面中输入项目信息
10. 点击Save按钮

期待结果:

页面刷新，浮动页面消失，Candidate List中加入新的记录

******************************

#### No.TC019

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 点击Candidate按钮进入localhost:3000/management/candidate页面
8. 在Candidate List中选择一个Candidate，点击Option中的Delete按钮

期待结果:

页面刷新，Candidate记录被删除

******************************

#### No.TC020

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 点击User按钮进入localhost:3000/management/user页面
8. 选择一个用户，点击Delete按钮

期待结果:

页面刷新，User记录被删除

******************************

#### No.TC021

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 在Project List中选择一个project，点击Option中的Open按钮

期待结果:

进入localhost:3000/management/project/candidate/{projectid}页面，显示正确的项目信息

******************************

#### No.TC022

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 在Project List中选择一个project，点击Option中的Open按钮

期待结果:

进入localhost:3000/management/project/candidate/{projectid}页面，显示正确的项目信息

******************************

#### No.TC023

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 在Project List中选择一个project，点击Option中的Open按钮
8. 进入localhost:3000/management/project/candidate/{projectid}页面
9. 点击"Add Candidate"按钮

期待结果:

显示Add Selected Candidate浮动页面

******************************

#### No.TC024

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 在Project List中选择一个project，点击Option中的Open按钮
8. 进入localhost:3000/management/project/candidate/{projectid}页面
9. 点击"Add Candidate"按钮
10. 选择Candidate点击Add

期待结果:

Candidate List中加入新的candidate记录

******************************

#### No.TC025

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project页面
7. 在Project List中选择一个project，点击Option中的Open按钮
8. 进入localhost:3000/management/project/candidate/{projectid}页面
9. 选择一条Candidate记录，点击Option中delete按钮

期待结果:

candidate记录被删除

******************************

#### No.TC026

测试模块：项目管理模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/management
3. 页面跳转到项目管理登陆页面
4. 填写信息，输入后端配置的正确Admin和Access Key
5. 点击Sign in按钮
6. 登陆到localhost:3000/management/project 或 localhost:3000/management/candidate 或 localhost:3000/management/project/candidate/{projectid} 或 localhost:3000/management/user
7. 点击右上角logout

期待结果:

Admin用户退出，进入localhost:3000/management页面

******************************

#### No.TC027

测试模块：导演模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/director
3. 页面跳转到项目登陆页面
4. 不要填写信息，或只填写Project Id或Access Key一项
5. 点击Sign in按钮

期待结果:

在登录Form下方出现"Please input your project name and access key"的错误信息

******************************

#### No.TC028

测试模块：导演模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/director
3. 页面跳转到项目登陆页面
4. 填写信息，输入错误的Project Id或Access Key
5. 点击Sign in按钮

期待结果:

在登录Form下方出现"Authentication failed, please check project id and key"的错误信息

******************************

#### No.TC029

测试模块：导演模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/director
3. 页面跳转到项目登陆页面
4. 填写信息，输入正确的Project Id和Access Key
5. 点击Sign in按钮

期待结果:

进入项目localhost:3000/director页面，显示项目信息

******************************

#### No.TC030

测试模块：导演模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 电脑A和B连在同一网络中
3. 在电脑A的浏览器中输入地址：localhost:3000/director
3. 页面跳转到项目登陆页面
4. 填写信息，输入正确的Project Id和Access Key
5. 点击Sign in按钮
6. 正确登录后用电脑B重复步骤3-5

期待结果:

电脑B不能登录到Director页面中去

******************************

#### No.TC031

测试模块：导演模块

测试步骤：

1. 先后启动Database Server和NodeJS Server
2. 在浏览器中输入地址：localhost:3000/director
3. 页面跳转到项目登陆页面
4. 填写信息，输入正确的Project Id和Access Key
5. 点击Sign in按钮
6. 进入localhost:3000/director页面后，用手持设备连入同一网络，用二维码扫描程序扫描二维码

期待结果:

手持设备进入用户登录页面，若用户已经登录过，则导向Home页面

******************************