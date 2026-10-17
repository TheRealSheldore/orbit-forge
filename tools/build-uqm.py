#!/usr/bin/env python3
"""Build the original UQM ship engine. Requires Zig 0.13 (pip install ziglang==0.13.0)."""
from pathlib import Path
import os, shutil, subprocess, tempfile, zipfile
from uqm_source import archive
ROOT=Path(__file__).resolve().parents[1]
def build():
    zig=os.environ.get('ZIG') or shutil.which('zig')
    if not zig:
        import ziglang
        zig=str(Path(ziglang.__file__).parent/'zig')
    races='urquan blackurq slylandr chmmr utwig spathi mycon orz chenjesu supox ilwrath druuge melnorme mmrnmhrm pkunk androsyn vux human syreen zoqfot umgah thradd yehat arilou shofixti'.split()
    with tempfile.TemporaryDirectory(prefix='orbit-uqm-') as stage:
        with zipfile.ZipFile(archive()) as source: source.extractall(stage)
        src=Path(stage)/'src'
        files=[src/'uqm'/n for n in 'cyborg.c ship.c weapon.c collide.c velocity.c trans.c displist.c misc.c tactrans.c gravity.c'.split()]
        files += [src/'uqm/ships'/race/(race+'.c') for race in races if race!='arilou']
        files += [src/'libs'/n for n in ['math/random.c','math/sqrt.c','graphics/intersec.c','graphics/boxint.c']]
        files += sorted((ROOT/'native/uqm').glob('*.c'))
        output=ROOT/'assets/engine/uqm.wasm';output.parent.mkdir(parents=True,exist_ok=True)
        command=[zig,'build-exe','-target','wasm32-wasi','-I'+str(ROOT/'native/uqm'),'-I'+str(ROOT/'native/uqm/platform'),'-I'+str(src),'-O','ReleaseFast','-fno-entry','-rdynamic','-fstrip','--export-table','--import-symbols','--stack','1048576','--initial-memory=16777216','-lc','-lm','-cflags','-O2','-Wno-pointer-sign','-Wno-incompatible-pointer-types','--']
        subprocess.run(command+list(map(str,files))+['-femit-bin='+str(output)],check=True)
        print(output)
if __name__=='__main__':build()
