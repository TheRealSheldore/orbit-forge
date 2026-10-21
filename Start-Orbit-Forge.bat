@echo off
setlocal
cd /d "%~dp0"
py -3 -c "import sys; assert sys.version_info >= (3, 9)" >nul 2>&1
if not errorlevel 1 (
  py -3 tools\serve.py --open
  goto finished
)
python -c "import sys; assert sys.version_info >= (3, 9)" >nul 2>&1
if not errorlevel 1 (
  python tools\serve.py --open
  goto finished
)
echo Python 3.9 or newer is needed for the local launcher.
echo Install Python from https://www.python.org/downloads/windows/
echo Then double-click this file again.
:finished
pause
