"""Check live file refresh, static routes, and no-cache headers."""
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path
import tempfile
import threading
import urllib.request
import re
import json
from serve import Handler, ROOT


def get(url, method='GET'):
    with urllib.request.urlopen(urllib.request.Request(url, method=method), timeout=3) as response:
        assert response.status == 200
        assert response.headers['Cache-Control'] == 'no-store'
        return response.read()


def exercise(directory, check):
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(directory)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        check(f'http://127.0.0.1:{server.server_port}')
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def game_routes(url):
    html = get(url + '/index.html').decode()
    for asset in re.findall(r'(?:src|href)="((?:src|styles|settings|assets)/[^"]+)"', html):
        get(url + '/' + asset, 'HEAD')
    assert 'settings/game-settings.js' in html
    assert get(url + '/assets/engine/uqm.wasm')[:4] == b'\0asm'
    for asset in json.loads((ROOT / 'assets/manifest.json').read_text()):
        get(url + '/' + asset['path'], 'HEAD')


exercise(ROOT, game_routes)
with tempfile.TemporaryDirectory() as folder:
    path = Path(folder) / 'settings.js'
    path.write_text('damage = 1')
    def edits(url):
        assert get(url + '/settings.js') == b'damage = 1'
        path.write_text('damage = 2')
        assert get(url + '/settings.js') == b'damage = 2'
    exercise(folder, edits)
print('PASS: all game routes and assets, native WASM, no-cache headers, and edited-file refresh without rebuilding.')
