package com.fusion.game.server;

import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;

//Netty的配置属性和保存会话的group
/**
 * Created by lz on 2019/1/8.
 */
public class NettyConfig {
    // 存储所有连接的 channel
    public static ChannelGroup group = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);
    // host name 和监听的端口号，需要配置到配置文件中
    public static String WS_HOST = "192.168.3.16";
    public static int WS_PORT = 8508;
}
