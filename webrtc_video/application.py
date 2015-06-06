#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# vim: set et sw=4 ts=4 sts=4 ff=unix fenc=utf8:
# Author: Binux<17175297.hk@gmail.com>
#         http://binux.me
# Created on 2012-12-15 16:11:13

import os.path
import logging
import tornado.web
from tornado.options import define, options
from libs.room_manager import RoomManager

define("bind", default="127.0.0.1", help="addrs bind to")
define("port", default=8888, help="the port listen to")
define("debug", default=False, help="debug mode")
define("config", default="", help="config file")
define("file_path", default="./data/", help="file path for websocket peer")

class Application(tornado.web.Application):
    def __init__(self):
        from handlers import handlers, ui_modules, ui_methods
        settings = dict(
                template_path = os.path.join(os.path.dirname(__file__), "tpl"),
                static_path = os.path.join(os.path.dirname(__file__), "static"),
                debug = options.debug,
                gzip = True,

                ui_modules = ui_modules,
                ui_methods = ui_methods,
                )
        super(Application, self).__init__(handlers, **settings)

        self.room_manager = RoomManager()


if __name__ == "__main__":
    import tornado.options
    from tornado.ioloop import IOLoop
    from tornado.httpserver import HTTPServer

    tornado.options.parse_command_line()
    if options.config:
        tornado.options.parse_config_file(options.config)
    tornado.options.parse_command_line()

    if options.debug:
        import logging;logging.getLogger().setLevel(logging.DEBUG)

    http_server = HTTPServer(Application(), xheaders=True)
    http_server.bind(options.port, options.bind)
    http_server.start()

    logging.info("http server started on %s:%s" % (options.bind, options.port))
    IOLoop.instance().start()
