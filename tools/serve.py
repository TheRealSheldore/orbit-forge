#!/usr/bin/env python3
"""Serve the editable game locally, without a build step or third-party packages."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import threading
import webbrowser

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Refresh must always pick up edited code and settings.
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def list_directory(self, path):
        self.send_error(404, 'Open the game at /index.html')
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8765)
    parser.add_argument('--open', action='store_true', help='Open the game in your browser')
    args = parser.parse_args()
    if not (ROOT / 'assets/music/mining.wav').is_file():
        from prepare import prepare
        prepare()
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(Handler, directory=str(ROOT)))
    except OSError as error:
        print(f'Could not start Orbit Forge on port {args.port}: {error}', file=sys.stderr)
        print('Close an earlier Orbit Forge server window, then try again.', file=sys.stderr)
        return 1
    url = f'http://127.0.0.1:{args.port}/'
    print(f'Orbit Forge: {url}\nEdit a file, save, and refresh the browser.\nKeep this window open. Press Ctrl+C to stop.', flush=True)
    if args.open:
        threading.Timer(.4, webbrowser.open, args=(url,)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nOrbit Forge stopped.')
    finally:
        server.server_close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
