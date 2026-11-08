from __future__ import unicode_literals

import unittest

from mopidy_mobile import Extension


class ExtensionTest(unittest.TestCase):

    def test_get_default_config(self):
        ext = Extension()
        config = ext.get_default_config()
        self.assertIn('[mobile]', config)
        self.assertIn('enabled = true', config)

    def test_get_config_schema(self):
        ext = Extension()
        schema = ext.get_config_schema()
        self.assertIn('title', schema)
        self.assertIn('ws_url', schema)

    def test_factory_routes(self):
        from tornado.web import RedirectHandler

        from mopidy_mobile.web import IndexHandler, StaticHandler

        ext = Extension()
        config = {'mobile': {'title': 'Mopidy Mobile', 'ws_url': ''}}
        routes = ext.factory(config, None)

        def handler(path):
            import re
            for route in routes:
                if re.match(route[0] + '$', path):
                    return route[1]

        self.assertIs(handler('/'), RedirectHandler)
        self.assertIs(handler('/index.html'), IndexHandler)
        self.assertIs(handler('/manifest.json'), IndexHandler)
        # the service worker manifest must not be rendered as a template
        self.assertIs(handler('/ngsw.json'), StaticHandler)
        self.assertIs(handler('/ngsw-worker.js'), StaticHandler)
        self.assertIs(handler('/main.js'), StaticHandler)
