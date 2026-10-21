#!/usr/bin/env python3
"""Restore the large mining track from its exact binary parts."""
from pathlib import Path
import hashlib
ROOT = Path(__file__).resolve().parents[1]
def prepare():
    path = ROOT / 'assets/music/mining.wav'
    if path.exists() and hashlib.sha256(path.read_bytes()).hexdigest() == '7d1e9078393adde53e4a16901883b5a31aa272fdb7df7db69adae463f685ba68':
        return
    parts = sorted(path.parent.glob('mining.wav.part*'))
    data = b''.join(part.read_bytes() for part in parts)
    assert hashlib.sha256(data).hexdigest() == '7d1e9078393adde53e4a16901883b5a31aa272fdb7df7db69adae463f685ba68', 'Mining audio parts are incomplete or damaged'
    if not path.exists() or path.read_bytes() != data:
        path.write_bytes(data)
if __name__ == '__main__':
    prepare()
