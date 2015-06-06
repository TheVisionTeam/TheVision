#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# vim: set et sw=4 ts=4 sts=4 ff=unix fenc=utf8:
# Author: Binux<17175297.hk@gmail.com>
#         http://binux.me
# Created on 2012-12-15 16:16:38

import logging
import tornado.web
import tornado.websocket
from tornado.web import HTTPError
from tornado.options import options

__ALL__ = ['HTTPError', 'BaseHandler', 'BaseWebSocket', 'BaseUIModule', ]

class BaseHandler(tornado.web.RequestHandler):
    application_export = set(('room_manager', ))
    def __getattr__(self, key):
        if key in self.application_export:
            return getattr(self.application, key)
        super(BaseHandler, self).__getattr__(key)

    def render_string(self, template_name, **kwargs):
        if "options" not in kwargs:
            kwargs["options"] = options
        return super(BaseHandler, self).render_string(template_name, **kwargs)

class BaseWebSocket(tornado.websocket.WebSocketHandler):
    application_export = set(('room_manager', ))
    def __getattr__(self, key):
        if key in self.application_export:
            return getattr(self.application, key)
        super(BaseWebSocket, self).__getattr__(key)

class BaseUIModule(tornado.web.UIModule):
    pass
