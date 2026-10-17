#!/usr/bin/env python3
"""Verify extracted engine function bodies are present verbatim in the supplied source."""
from pathlib import Path
import re, zipfile
from uqm_source import archive
root=Path(__file__).resolve().parents[1]
with zipfile.ZipFile(archive()) as z:
    count=0
    for file in ['process','status']:
        original=z.read('src/uqm/'+file+'.c').decode()
        port=(root/'native/uqm'/f'{file}-core.c').read_text()
        for match in re.finditer(r'(?m)^(?:static )?(?:inline )?[\w* ]+\n(\w+)\s*\(',port):
            name=match[1]
            if name.startswith('orbit_'):continue
            start=port.index('{',match.start());depth=1;end=start+1
            while depth:
                if port[end]=='{':depth+=1
                if port[end]=='}':depth-=1
                end+=1
            function=port[match.start():end]
            assert function in original, f'Extracted function changed: {name}'
            count+=1
    print(f'PASS: {count} extracted native functions match original source verbatim.')
