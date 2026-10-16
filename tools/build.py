#!/usr/bin/env python3
"""Build Orbit Forge as one offline HTML file using Python's standard library."""
import argparse
import base64
import json
from pathlib import Path
import re

from prepare import prepare

prepare()
ROOT = Path(__file__).resolve().parents[1]


def inline_assets(text):
    for asset in json.loads((ROOT / 'assets/manifest.json').read_text()):
        payload = base64.b64encode((ROOT / asset['path']).read_bytes()).decode('ascii')
        url = 'data:' + asset['mime'] + ';base64,' + payload
        text = text.replace(asset['path'], url)
    return text


def build(output=None):
    version = (ROOT / 'VERSION').read_text().strip()
    output = Path(output) if output else ROOT / 'dist' / f'Orbit-Forge-v{version}.html'
    html = (ROOT / 'index.html').read_text()

    def script(match):
        body = inline_assets((ROOT / match.group(1)).read_text())
        return '<script>' + body + '</script>'

    html = re.sub(r'<script src="([^"]+)"></script>', script, html)

    def style(match):
        return '<style>' + inline_assets((ROOT / match.group(1)).read_text()) + '</style>'

    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', style, html)
    html = inline_assets(html)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html)
    return output


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, help='Optional output HTML path')
    print(build(parser.parse_args().output))
