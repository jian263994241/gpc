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