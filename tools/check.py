#!/usr/bin/env python3
"""Check local asset references and JavaScript syntax before committing."""
from html.parser import HTMLParser
import json
from pathlib import Path
import shutil
import subprocess

from prepare import prepare

prepare()
ROOT = Path(__file__).resolve().parents[1]


class References(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('src', 'href') and value and not value.startswith(('data:', 'http:', 'https:', '#')):
                assert (ROOT / value).is_file(), f'Missing {value}'


References().feed((ROOT / 'index.html').read_text())
for asset in json.loads((ROOT / 'assets/manifest.json').read_text()):
    assert (ROOT / asset['path']).is_file(), f'Missing {asset["path"]}'
node = shutil.which('node')
if node:
    for script in sorted((ROOT / 'src').glob('*.js')):
        subprocess.run([node, '--check', str(script)], check=True)
else:
    print('Node.js is unavailable; JavaScript syntax checks were skipped.')
print('Project references checked' + ('; JavaScript syntax passed.' if node else '.'))
