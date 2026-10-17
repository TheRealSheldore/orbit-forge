"""Restore the exact supplied archive from small binary parts."""
from pathlib import Path
import hashlib
ROOT=Path(__file__).resolve().parents[1]
def archive():
    output=ROOT/'vendor/uqm-src.zip'
    parts=sorted(output.parent.glob('uqm-src.zip.part*'))
    if parts:
        data=b''.join(p.read_bytes() for p in parts)
        if hashlib.sha256(data).hexdigest()!='e8955b8dd1a6221dee00dfe7292bd3b3c9a65aad174d4e2ec5ec933d41bcdc42':
            raise ValueError('UQM source archive parts are incomplete or damaged')
        if not output.exists() or output.read_bytes()!=data:output.write_bytes(data)
    return output
if __name__=='__main__':print(archive())
