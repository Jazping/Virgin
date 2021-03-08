package com.fusion.game.server;

import java.io.Closeable;
import java.io.IOException;

public class IOUtils {
	private IOUtils() {}
	public static void close(Closeable c) {
		try {
			c.close();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
}
