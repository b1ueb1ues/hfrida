function print() { console.log.apply(null, arguments); }

var arrow = function(p, offset) { return p.add(offset).readPointer(); }
arrow.p = function(p, offset) { return p.add(offset).readPointer(); }
arrow.i = function(p, offset) { return p.add(offset).readInt(); }
arrow.f = function(p, offset) { return p.add(offset).readFloat(); }
arrow.d = function(p, offset) { return p.add(offset).readDouble(); }

var star = function(p) { return p.readPointer(); }
star.p = function(p) { return p.readPointer(); }
star.i = function(p) { return p.readInt(); }
star.f = function(p) { return p.readFloat(); }
star.p = function(p) { return p.readDouble(); }

var myp=0;
var mypp=0;
myp = Memory.alloc(4);
mypp = Memory.alloc(8);
function r2i(r){ return r.toInt32(); }
function r2f(r){ myp.writeInt(r.toInt32()); return myp.readFloat(); }
function r2d(r){ mypp.writeInt(r.toInt32()); return mypp.readDouble(); }

function dict(o) {
    var keys = Object.getOwnPropertyNames(o.__proto__);
    for (var i in keys) {
        try {
            console.log(keys[i], '\t', o[keys[i]]);
        } catch(e) {
            console.log(keys[i]);
        }
    }
}

function module(libname) { return new _module(libname); }
function _module(libname) {
    if (libname == undefined)
        this.lib_name = __libname__;
    else
        this.lib_name = libname;
    var lib_base = Module.findBaseAddress(this.lib_name);
    this.lib_base = lib_base;
    send('process_id: '+Process.id);
    send('lib_base: '+this.lib_base);
    this.hook = function(address, hook) {
        Interceptor.attach(lib_base.add(address), hook);
    }
    this.fhook = function(address, hook) {
        Interceptor.attach(lib_base.add(address),
            { onEnter: hookin, onLeave: hookout });
    }
    this.chook = function(address) {
        var interceptor = {};
        interceptor._onEnter = function(){}
        interceptor._onLeave = function(){}
        interceptor.o = function(func){
            interceptor._onEnter = func;
            return this;
        }
        interceptor.x = function(func){
            interceptor._onLeave = func;
            return this;
        }
        Interceptor.attach(lib_base.add(address), {
                onEnter: function(args){interceptor._onEnter(args)},
                onLeave: function(retv){interceptor._onLeave(retv)}
            }
        );
        return interceptor;
    }
    this.bt = function(context){
        var b = Thread.backtrace(context);
        console.log('bt');
        for (var i in b) {
            console.log(ptr(b[i]).add(0-lib_base));
        }
    }
}


