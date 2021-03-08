package com.fusion.game.server;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.zip.GZIPInputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ResponseBody;

import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;

/**
 * Created by lz on 2019/4/2.
 */
@Controller
@ResponseBody
@Component
public class WebSocketHandler {
	private Logger logger = LoggerFactory.getLogger(getClass());
    public void SwitchMessageType(String str_json, ChannelHandlerContext ctx) {
    	if("start".equals(str_json)) {
    		StringBuilder sb = new StringBuilder();
    		InputStream inputStream = getClass().getResourceAsStream("test.fai");
    		BufferedReader reader = null;
    		try {
    			reader = new BufferedReader(new InputStreamReader(new GZIPInputStream(inputStream)));
    			String line = reader.readLine();
    			while(null!=line) {
    				line = line.trim();
    				if(line.length()!=0) {
    					sb.append(line);
    					if(sb.length()>=1024*8) {
    						flush(sb, ctx);
    					}else {
    						sb.append(",");
    					}
    				}
    				line = reader.readLine();
    			}
    		} catch (Exception e1) {
				e1.printStackTrace();
			}finally {
				flush(sb, ctx);
				IOUtils.close(reader);
				logger.info("Game data transmit completed");
			}
    	}
    }
    
    private void flush(StringBuilder sb, ChannelHandlerContext ctx) {
    	if(sb.length()>0) {
    		if(sb.charAt(sb.length()-1)==',') {
    			sb.deleteCharAt(sb.length()-1);
    		}
    		sb.insert(0, "[");
    		sb.append("]");
    		ctx.channel().write( new TextWebSocketFrame(sb.toString()));
    		ctx.channel().flush();
    		sb.delete(0, sb.length());
    	}
    }
}
