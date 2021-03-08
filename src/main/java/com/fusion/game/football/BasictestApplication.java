package com.fusion.game.football;

import java.net.InetSocketAddress;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.fusion.game.server.NettyConfig;
import com.fusion.game.server.ServerInitializer;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

@SpringBootApplication
public class BasictestApplication implements CommandLineRunner{
	private Logger logger = LoggerFactory.getLogger(getClass());
    public static void main(String[] args) {
        SpringApplication.run(BasictestApplication.class, args);
    }
    @Override
    public void run(String... args) throws Exception {
    	EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workGroup = new NioEventLoopGroup();
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(bossGroup, workGroup)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ServerInitializer())//处理响应的channel
                .option(ChannelOption.SO_BACKLOG, 128)
                .childOption(ChannelOption.SO_KEEPALIVE, true);

        InetSocketAddress address = new InetSocketAddress(NettyConfig.WS_HOST, NettyConfig.WS_PORT);
        bootstrap.bind(address).syncUninterruptibly();
        Runtime.getRuntime().addShutdownHook(new Thread(){
            @Override
            public void run() {
            	 workGroup.shutdownGracefully();
                 bossGroup.shutdownGracefully();
            }
        });

        logger.info("Game socket binded on {}:{} ",NettyConfig.WS_HOST, NettyConfig.WS_PORT);
    }
}
