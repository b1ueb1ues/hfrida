#!/usr/bin/env python3
import sys
from __init__ import hfrida

if len(sys.argv) > 1:
    js = sys.argv[1]
else:
    js = 'example.js'

f = hfrida()
f.proc_name = 'com.nintendo.zaga'
f.lib_name = 'libil2cpp.so'
f.engine = 'v8'
f.spawn = False
f.jnclude = ['bin.js']
f.run(js)



