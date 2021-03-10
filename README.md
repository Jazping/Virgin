# preview

View in 2D

<img src="https://raw.githubusercontent.com/Jazping/virgin/main/static/ASSETS/IMAGE/20210309185523.jpg" width="1024px" alt="image load fail"/>

View in 3D

<img src="https://raw.githubusercontent.com/Jazping/images/main/20210310/20210310190605.jpg" width="1024px" alt="image load fail"/>

# description

一个基于BABYLON Library游戏框架开发的足球游戏草稿，展示如何使用BABYLON JS制作简单的H5游戏。

除了服务端的代码，其他全部开源，希望能对H5游戏初学者提供一点帮助，尤其是对BABYLON 3D引擎的

初学者。例子包括场景创建、音效、物体移动同步问题。游戏中的球员数据是随机产生的，随机数据有速度、

过人技能。test.fai 是一个由AI产生的GZIP压缩型数据文件，故每次游戏是一样的。


A Draft framework of H5 football game based on BABYLON Library, show you how to use HABYLON develop a

simply 3D game. All source are opened except the code of server side, hope can do some favour for the beginner, 

especial fover in BABYLON JS. Example including scene creation, sound play, specially how to play animation.

soccer data in the game just produce by random, including soccer speed and skill. test.fai is one file produced by AI

and compress with GZIP. so that will be the same game in every start.

# code explain

BasictestApplication 是程序入口，通过Spring boot启动;

BasictestApplication is the entrance of application，launch by Spring boot;

com.fusion.game.server 目录是游戏数据传输代码，通过Netty建立服务程序;

com.fusion.game.server directory is conservation of game data transmit，build by netty;


static 目录下是前端代码;

static/SOUNDS 目录是游戏声音资源
static/LIB 目录是BABYLON原库
static/MYLIB 目录是DEMO需要的JS代码

# change required

把index.html中的“ws://192.168.3.16:8508”改为本机的IP

change "ws://192.168.3.16:8508" in index.html file ip to your ip

把 NettyConfig.java中的WS_HOST = "192.168.3.16"改为本机IP

change "ws://192.168.3.16:8508" in NettyConfig.java file ip to your ip


# access

启动服务端，服务端监听8181和8508端口，用浏览器打开
http://localhost:8181/HTML/TEST/index.html

When launch application, listening on 8181 and 8508, open the URL
http://localhost:8181/HTML/TEST/index.html
