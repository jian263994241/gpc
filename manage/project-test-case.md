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