var ys = Object.defineProperty;
var xs = (e, r, t) => r in e ? ys(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t;
var rr = (e, r, t) => xs(e, typeof r != "symbol" ? r + "" : r, t);
import Oa, { app as xt, BrowserWindow as Da } from "electron";
import Qe from "node:path";
import { fileURLToPath as ks } from "node:url";
import { createRequire as Ss } from "node:module";
import Tr from "fs";
import Ar from "path";
import Es from "https";
import Ia from "stream";
import Cs from "events";
import Ts from "buffer";
import Ni from "util";
var se = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ae = {}, Ba = {}, Fa = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.changePermissions = e.downloadFile = e.getPath = void 0;
  const r = Oa, t = Tr, i = Ar, a = Es, n = () => {
    const f = r.app.getPath("userData");
    return i.resolve(`${f}/extensions`);
  };
  e.getPath = n;
  const o = r.net ? r.net.request : a.get, s = (f, l) => new Promise((w, h) => {
    const d = o(f);
    d.on("response", (g) => {
      if (g.statusCode && g.statusCode >= 300 && g.statusCode < 400 && g.headers.location)
        return (0, e.downloadFile)(g.headers.location, l).then(w).catch(h);
      g.pipe(t.createWriteStream(l)).on("close", w), g.on("error", h);
    }), d.on("error", h), d.end();
  });
  e.downloadFile = s;
  const c = (f, l) => {
    t.readdirSync(f).forEach((h) => {
      const d = i.join(f, h);
      t.chmodSync(d, parseInt(`${l}`, 8)), t.statSync(d).isDirectory() && (0, e.changePermissions)(d, l);
    });
  };
  e.changePermissions = c;
})(Fa);
var St = {}, Zr = {}, ne = {}, ir = { exports: {} }, nr = { exports: {} }, rn;
function Rr() {
  if (rn) return nr.exports;
  rn = 1, typeof process > "u" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.indexOf("v1.8.") !== 0 ? nr.exports = { nextTick: e } : nr.exports = process;
  function e(r, t, i, a) {
    if (typeof r != "function")
      throw new TypeError('"callback" argument must be a function');
    var n = arguments.length, o, s;
    switch (n) {
      case 0:
      case 1:
        return process.nextTick(r);
      case 2:
        return process.nextTick(function() {
          r.call(null, t);
        });
      case 3:
        return process.nextTick(function() {
          r.call(null, t, i);
        });
      case 4:
        return process.nextTick(function() {
          r.call(null, t, i, a);
        });
      default:
        for (o = new Array(n - 1), s = 0; s < o.length; )
          o[s++] = arguments[s];
        return process.nextTick(function() {
          r.apply(null, o);
        });
    }
  }
  return nr.exports;
}
var Wr, nn;
function As() {
  if (nn) return Wr;
  nn = 1;
  var e = {}.toString;
  return Wr = Array.isArray || function(r) {
    return e.call(r) == "[object Array]";
  }, Wr;
}
var Hr, an;
function za() {
  return an || (an = 1, Hr = Ia), Hr;
}
var ar = { exports: {} }, on;
function Or() {
  return on || (on = 1, function(e, r) {
    var t = Ts, i = t.Buffer;
    function a(o, s) {
      for (var c in o)
        s[c] = o[c];
    }
    i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? e.exports = t : (a(t, r), r.Buffer = n);
    function n(o, s, c) {
      return i(o, s, c);
    }
    a(i, n), n.from = function(o, s, c) {
      if (typeof o == "number")
        throw new TypeError("Argument must not be a number");
      return i(o, s, c);
    }, n.alloc = function(o, s, c) {
      if (typeof o != "number")
        throw new TypeError("Argument must be a number");
      var f = i(o);
      return s !== void 0 ? typeof c == "string" ? f.fill(s, c) : f.fill(s) : f.fill(0), f;
    }, n.allocUnsafe = function(o) {
      if (typeof o != "number")
        throw new TypeError("Argument must be a number");
      return i(o);
    }, n.allocUnsafeSlow = function(o) {
      if (typeof o != "number")
        throw new TypeError("Argument must be a number");
      return t.SlowBuffer(o);
    };
  }(ar, ar.exports)), ar.exports;
}
var le = {}, sn;
function Yt() {
  if (sn) return le;
  sn = 1;
  function e(m) {
    return Array.isArray ? Array.isArray(m) : g(m) === "[object Array]";
  }
  le.isArray = e;
  function r(m) {
    return typeof m == "boolean";
  }
  le.isBoolean = r;
  function t(m) {
    return m === null;
  }
  le.isNull = t;
  function i(m) {
    return m == null;
  }
  le.isNullOrUndefined = i;
  function a(m) {
    return typeof m == "number";
  }
  le.isNumber = a;
  function n(m) {
    return typeof m == "string";
  }
  le.isString = n;
  function o(m) {
    return typeof m == "symbol";
  }
  le.isSymbol = o;
  function s(m) {
    return m === void 0;
  }
  le.isUndefined = s;
  function c(m) {
    return g(m) === "[object RegExp]";
  }
  le.isRegExp = c;
  function f(m) {
    return typeof m == "object" && m !== null;
  }
  le.isObject = f;
  function l(m) {
    return g(m) === "[object Date]";
  }
  le.isDate = l;
  function w(m) {
    return g(m) === "[object Error]" || m instanceof Error;
  }
  le.isError = w;
  function h(m) {
    return typeof m == "function";
  }
  le.isFunction = h;
  function d(m) {
    return m === null || typeof m == "boolean" || typeof m == "number" || typeof m == "string" || typeof m == "symbol" || // ES6 symbol
    typeof m > "u";
  }
  le.isPrimitive = d, le.isBuffer = Buffer.isBuffer;
  function g(m) {
    return Object.prototype.toString.call(m);
  }
  return le;
}
var or = { exports: {} }, sr = { exports: {} }, fn;
function Rs() {
  return fn || (fn = 1, typeof Object.create == "function" ? sr.exports = function(r, t) {
    t && (r.super_ = t, r.prototype = Object.create(t.prototype, {
      constructor: {
        value: r,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : sr.exports = function(r, t) {
    if (t) {
      r.super_ = t;
      var i = function() {
      };
      i.prototype = t.prototype, r.prototype = new i(), r.prototype.constructor = r;
    }
  }), sr.exports;
}
var ln;
function Kt() {
  if (ln) return or.exports;
  ln = 1;
  try {
    var e = require("util");
    if (typeof e.inherits != "function") throw "";
    or.exports = e.inherits;
  } catch {
    or.exports = Rs();
  }
  return or.exports;
}
var qr = { exports: {} }, un;
function Os() {
  return un || (un = 1, function(e) {
    function r(n, o) {
      if (!(n instanceof o))
        throw new TypeError("Cannot call a class as a function");
    }
    var t = Or().Buffer, i = Ni;
    function a(n, o, s) {
      n.copy(o, s);
    }
    e.exports = function() {
      function n() {
        r(this, n), this.head = null, this.tail = null, this.length = 0;
      }
      return n.prototype.push = function(s) {
        var c = { data: s, next: null };
        this.length > 0 ? this.tail.next = c : this.head = c, this.tail = c, ++this.length;
      }, n.prototype.unshift = function(s) {
        var c = { data: s, next: this.head };
        this.length === 0 && (this.tail = c), this.head = c, ++this.length;
      }, n.prototype.shift = function() {
        if (this.length !== 0) {
          var s = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, s;
        }
      }, n.prototype.clear = function() {
        this.head = this.tail = null, this.length = 0;
      }, n.prototype.join = function(s) {
        if (this.length === 0) return "";
        for (var c = this.head, f = "" + c.data; c = c.next; )
          f += s + c.data;
        return f;
      }, n.prototype.concat = function(s) {
        if (this.length === 0) return t.alloc(0);
        for (var c = t.allocUnsafe(s >>> 0), f = this.head, l = 0; f; )
          a(f.data, c, l), l += f.data.length, f = f.next;
        return c;
      }, n;
    }(), i && i.inspect && i.inspect.custom && (e.exports.prototype[i.inspect.custom] = function() {
      var n = i.inspect({ length: this.length });
      return this.constructor.name + " " + n;
    });
  }(qr)), qr.exports;
}
var Gr, hn;
function Na() {
  if (hn) return Gr;
  hn = 1;
  var e = Rr();
  function r(a, n) {
    var o = this, s = this._readableState && this._readableState.destroyed, c = this._writableState && this._writableState.destroyed;
    return s || c ? (n ? n(a) : a && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, e.nextTick(i, this, a)) : e.nextTick(i, this, a)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(a || null, function(f) {
      !n && f ? o._writableState ? o._writableState.errorEmitted || (o._writableState.errorEmitted = !0, e.nextTick(i, o, f)) : e.nextTick(i, o, f) : n && n(f);
    }), this);
  }
  function t() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function i(a, n) {
    a.emit("error", n);
  }
  return Gr = {
    destroy: r,
    undestroy: t
  }, Gr;
}
var Yr, dn;
function Ds() {
  return dn || (dn = 1, Yr = Ni.deprecate), Yr;
}
var Kr, cn;
function La() {
  if (cn) return Kr;
  cn = 1;
  var e = Rr();
  Kr = m;
  function r(x) {
    var y = this;
    this.next = null, this.entry = null, this.finish = function() {
      $e(y, x);
    };
  }
  var t = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : e.nextTick, i;
  m.WritableState = d;
  var a = Object.create(Yt());
  a.inherits = Kt();
  var n = {
    deprecate: Ds()
  }, o = za(), s = Or().Buffer, c = (typeof se < "u" ? se : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function f(x) {
    return s.from(x);
  }
  function l(x) {
    return s.isBuffer(x) || x instanceof c;
  }
  var w = Na();
  a.inherits(m, o);
  function h() {
  }
  function d(x, y) {
    i = i || kt(), x = x || {};
    var R = y instanceof i;
    this.objectMode = !!x.objectMode, R && (this.objectMode = this.objectMode || !!x.writableObjectMode);
    var $ = x.highWaterMark, Z = x.writableHighWaterMark, G = this.objectMode ? 16 : 16 * 1024;
    $ || $ === 0 ? this.highWaterMark = $ : R && (Z || Z === 0) ? this.highWaterMark = Z : this.highWaterMark = G, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var re = x.decodeStrings === !1;
    this.decodeStrings = !re, this.defaultEncoding = x.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(ce) {
      z(y, ce);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new r(this);
  }
  d.prototype.getBuffer = function() {
    for (var y = this.bufferedRequest, R = []; y; )
      R.push(y), y = y.next;
    return R;
  }, function() {
    try {
      Object.defineProperty(d.prototype, "buffer", {
        get: n.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  }();
  var g;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (g = Function.prototype[Symbol.hasInstance], Object.defineProperty(m, Symbol.hasInstance, {
    value: function(x) {
      return g.call(this, x) ? !0 : this !== m ? !1 : x && x._writableState instanceof d;
    }
  })) : g = function(x) {
    return x instanceof this;
  };
  function m(x) {
    if (i = i || kt(), !g.call(m, this) && !(this instanceof i))
      return new m(x);
    this._writableState = new d(x, this), this.writable = !0, x && (typeof x.write == "function" && (this._write = x.write), typeof x.writev == "function" && (this._writev = x.writev), typeof x.destroy == "function" && (this._destroy = x.destroy), typeof x.final == "function" && (this._final = x.final)), o.call(this);
  }
  m.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function C(x, y) {
    var R = new Error("write after end");
    x.emit("error", R), e.nextTick(y, R);
  }
  function u(x, y, R, $) {
    var Z = !0, G = !1;
    return R === null ? G = new TypeError("May not write null values to stream") : typeof R != "string" && R !== void 0 && !y.objectMode && (G = new TypeError("Invalid non-string/buffer chunk")), G && (x.emit("error", G), e.nextTick($, G), Z = !1), Z;
  }
  m.prototype.write = function(x, y, R) {
    var $ = this._writableState, Z = !1, G = !$.objectMode && l(x);
    return G && !s.isBuffer(x) && (x = f(x)), typeof y == "function" && (R = y, y = null), G ? y = "buffer" : y || (y = $.defaultEncoding), typeof R != "function" && (R = h), $.ended ? C(this, R) : (G || u(this, $, x, R)) && ($.pendingcb++, Z = b(this, $, G, x, y, R)), Z;
  }, m.prototype.cork = function() {
    var x = this._writableState;
    x.corked++;
  }, m.prototype.uncork = function() {
    var x = this._writableState;
    x.corked && (x.corked--, !x.writing && !x.corked && !x.bufferProcessing && x.bufferedRequest && j(this, x));
  }, m.prototype.setDefaultEncoding = function(y) {
    if (typeof y == "string" && (y = y.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((y + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + y);
    return this._writableState.defaultEncoding = y, this;
  };
  function _(x, y, R) {
    return !x.objectMode && x.decodeStrings !== !1 && typeof y == "string" && (y = s.from(y, R)), y;
  }
  Object.defineProperty(m.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function b(x, y, R, $, Z, G) {
    if (!R) {
      var re = _(y, $, Z);
      $ !== re && (R = !0, Z = "buffer", $ = re);
    }
    var ce = y.objectMode ? 1 : $.length;
    y.length += ce;
    var Te = y.length < y.highWaterMark;
    if (Te || (y.needDrain = !0), y.writing || y.corked) {
      var he = y.lastBufferedRequest;
      y.lastBufferedRequest = {
        chunk: $,
        encoding: Z,
        isBuf: R,
        callback: G,
        next: null
      }, he ? he.next = y.lastBufferedRequest : y.bufferedRequest = y.lastBufferedRequest, y.bufferedRequestCount += 1;
    } else
      S(x, y, !1, ce, $, Z, G);
    return Te;
  }
  function S(x, y, R, $, Z, G, re) {
    y.writelen = $, y.writecb = re, y.writing = !0, y.sync = !0, R ? x._writev(Z, y.onwrite) : x._write(Z, G, y.onwrite), y.sync = !1;
  }
  function E(x, y, R, $, Z) {
    --y.pendingcb, R ? (e.nextTick(Z, $), e.nextTick(U, x, y), x._writableState.errorEmitted = !0, x.emit("error", $)) : (Z($), x._writableState.errorEmitted = !0, x.emit("error", $), U(x, y));
  }
  function F(x) {
    x.writing = !1, x.writecb = null, x.length -= x.writelen, x.writelen = 0;
  }
  function z(x, y) {
    var R = x._writableState, $ = R.sync, Z = R.writecb;
    if (F(R), y) E(x, R, $, y, Z);
    else {
      var G = D(R);
      !G && !R.corked && !R.bufferProcessing && R.bufferedRequest && j(x, R), $ ? t(B, x, R, G, Z) : B(x, R, G, Z);
    }
  }
  function B(x, y, R, $) {
    R || L(x, y), y.pendingcb--, $(), U(x, y);
  }
  function L(x, y) {
    y.length === 0 && y.needDrain && (y.needDrain = !1, x.emit("drain"));
  }
  function j(x, y) {
    y.bufferProcessing = !0;
    var R = y.bufferedRequest;
    if (x._writev && R && R.next) {
      var $ = y.bufferedRequestCount, Z = new Array($), G = y.corkedRequestsFree;
      G.entry = R;
      for (var re = 0, ce = !0; R; )
        Z[re] = R, R.isBuf || (ce = !1), R = R.next, re += 1;
      Z.allBuffers = ce, S(x, y, !0, y.length, Z, "", G.finish), y.pendingcb++, y.lastBufferedRequest = null, G.next ? (y.corkedRequestsFree = G.next, G.next = null) : y.corkedRequestsFree = new r(y), y.bufferedRequestCount = 0;
    } else {
      for (; R; ) {
        var Te = R.chunk, he = R.encoding, v = R.callback, p = y.objectMode ? 1 : Te.length;
        if (S(x, y, !1, p, Te, he, v), R = R.next, y.bufferedRequestCount--, y.writing)
          break;
      }
      R === null && (y.lastBufferedRequest = null);
    }
    y.bufferedRequest = R, y.bufferProcessing = !1;
  }
  m.prototype._write = function(x, y, R) {
    R(new Error("_write() is not implemented"));
  }, m.prototype._writev = null, m.prototype.end = function(x, y, R) {
    var $ = this._writableState;
    typeof x == "function" ? (R = x, x = null, y = null) : typeof y == "function" && (R = y, y = null), x != null && this.write(x, y), $.corked && ($.corked = 1, this.uncork()), $.ending || Fe(this, $, R);
  };
  function D(x) {
    return x.ending && x.length === 0 && x.bufferedRequest === null && !x.finished && !x.writing;
  }
  function J(x, y) {
    x._final(function(R) {
      y.pendingcb--, R && x.emit("error", R), y.prefinished = !0, x.emit("prefinish"), U(x, y);
    });
  }
  function fe(x, y) {
    !y.prefinished && !y.finalCalled && (typeof x._final == "function" ? (y.pendingcb++, y.finalCalled = !0, e.nextTick(J, x, y)) : (y.prefinished = !0, x.emit("prefinish")));
  }
  function U(x, y) {
    var R = D(y);
    return R && (fe(x, y), y.pendingcb === 0 && (y.finished = !0, x.emit("finish"))), R;
  }
  function Fe(x, y, R) {
    y.ending = !0, U(x, y), R && (y.finished ? e.nextTick(R) : x.once("finish", R)), y.ended = !0, x.writable = !1;
  }
  function $e(x, y, R) {
    var $ = x.entry;
    for (x.entry = null; $; ) {
      var Z = $.callback;
      y.pendingcb--, Z(R), $ = $.next;
    }
    y.corkedRequestsFree.next = x;
  }
  return Object.defineProperty(m.prototype, "destroyed", {
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(x) {
      this._writableState && (this._writableState.destroyed = x);
    }
  }), m.prototype.destroy = w.destroy, m.prototype._undestroy = w.undestroy, m.prototype._destroy = function(x, y) {
    this.end(), y(x);
  }, Kr;
}
var Vr, vn;
function kt() {
  if (vn) return Vr;
  vn = 1;
  var e = Rr(), r = Object.keys || function(w) {
    var h = [];
    for (var d in w)
      h.push(d);
    return h;
  };
  Vr = c;
  var t = Object.create(Yt());
  t.inherits = Kt();
  var i = Pa(), a = La();
  t.inherits(c, i);
  for (var n = r(a.prototype), o = 0; o < n.length; o++) {
    var s = n[o];
    c.prototype[s] || (c.prototype[s] = a.prototype[s]);
  }
  function c(w) {
    if (!(this instanceof c)) return new c(w);
    i.call(this, w), a.call(this, w), w && w.readable === !1 && (this.readable = !1), w && w.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, w && w.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", f);
  }
  Object.defineProperty(c.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function f() {
    this.allowHalfOpen || this._writableState.ended || e.nextTick(l, this);
  }
  function l(w) {
    w.end();
  }
  return Object.defineProperty(c.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(w) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = w, this._writableState.destroyed = w);
    }
  }), c.prototype._destroy = function(w, h) {
    this.push(null), this.end(), e.nextTick(h, w);
  }, Vr;
}
var Xr = {}, pn;
function _n() {
  if (pn) return Xr;
  pn = 1;
  var e = Or().Buffer, r = e.isEncoding || function(u) {
    switch (u = "" + u, u && u.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return !0;
      default:
        return !1;
    }
  };
  function t(u) {
    if (!u) return "utf8";
    for (var _; ; )
      switch (u) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return u;
        default:
          if (_) return;
          u = ("" + u).toLowerCase(), _ = !0;
      }
  }
  function i(u) {
    var _ = t(u);
    if (typeof _ != "string" && (e.isEncoding === r || !r(u))) throw new Error("Unknown encoding: " + u);
    return _ || u;
  }
  Xr.StringDecoder = a;
  function a(u) {
    this.encoding = i(u);
    var _;
    switch (this.encoding) {
      case "utf16le":
        this.text = w, this.end = h, _ = 4;
        break;
      case "utf8":
        this.fillLast = c, _ = 4;
        break;
      case "base64":
        this.text = d, this.end = g, _ = 3;
        break;
      default:
        this.write = m, this.end = C;
        return;
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = e.allocUnsafe(_);
  }
  a.prototype.write = function(u) {
    if (u.length === 0) return "";
    var _, b;
    if (this.lastNeed) {
      if (_ = this.fillLast(u), _ === void 0) return "";
      b = this.lastNeed, this.lastNeed = 0;
    } else
      b = 0;
    return b < u.length ? _ ? _ + this.text(u, b) : this.text(u, b) : _ || "";
  }, a.prototype.end = l, a.prototype.text = f, a.prototype.fillLast = function(u) {
    if (this.lastNeed <= u.length)
      return u.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    u.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, u.length), this.lastNeed -= u.length;
  };
  function n(u) {
    return u <= 127 ? 0 : u >> 5 === 6 ? 2 : u >> 4 === 14 ? 3 : u >> 3 === 30 ? 4 : u >> 6 === 2 ? -1 : -2;
  }
  function o(u, _, b) {
    var S = _.length - 1;
    if (S < b) return 0;
    var E = n(_[S]);
    return E >= 0 ? (E > 0 && (u.lastNeed = E - 1), E) : --S < b || E === -2 ? 0 : (E = n(_[S]), E >= 0 ? (E > 0 && (u.lastNeed = E - 2), E) : --S < b || E === -2 ? 0 : (E = n(_[S]), E >= 0 ? (E > 0 && (E === 2 ? E = 0 : u.lastNeed = E - 3), E) : 0));
  }
  function s(u, _, b) {
    if ((_[0] & 192) !== 128)
      return u.lastNeed = 0, "�";
    if (u.lastNeed > 1 && _.length > 1) {
      if ((_[1] & 192) !== 128)
        return u.lastNeed = 1, "�";
      if (u.lastNeed > 2 && _.length > 2 && (_[2] & 192) !== 128)
        return u.lastNeed = 2, "�";
    }
  }
  function c(u) {
    var _ = this.lastTotal - this.lastNeed, b = s(this, u);
    if (b !== void 0) return b;
    if (this.lastNeed <= u.length)
      return u.copy(this.lastChar, _, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    u.copy(this.lastChar, _, 0, u.length), this.lastNeed -= u.length;
  }
  function f(u, _) {
    var b = o(this, u, _);
    if (!this.lastNeed) return u.toString("utf8", _);
    this.lastTotal = b;
    var S = u.length - (b - this.lastNeed);
    return u.copy(this.lastChar, 0, S), u.toString("utf8", _, S);
  }
  function l(u) {
    var _ = u && u.length ? this.write(u) : "";
    return this.lastNeed ? _ + "�" : _;
  }
  function w(u, _) {
    if ((u.length - _) % 2 === 0) {
      var b = u.toString("utf16le", _);
      if (b) {
        var S = b.charCodeAt(b.length - 1);
        if (S >= 55296 && S <= 56319)
          return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = u[u.length - 2], this.lastChar[1] = u[u.length - 1], b.slice(0, -1);
      }
      return b;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = u[u.length - 1], u.toString("utf16le", _, u.length - 1);
  }
  function h(u) {
    var _ = u && u.length ? this.write(u) : "";
    if (this.lastNeed) {
      var b = this.lastTotal - this.lastNeed;
      return _ + this.lastChar.toString("utf16le", 0, b);
    }
    return _;
  }
  function d(u, _) {
    var b = (u.length - _) % 3;
    return b === 0 ? u.toString("base64", _) : (this.lastNeed = 3 - b, this.lastTotal = 3, b === 1 ? this.lastChar[0] = u[u.length - 1] : (this.lastChar[0] = u[u.length - 2], this.lastChar[1] = u[u.length - 1]), u.toString("base64", _, u.length - b));
  }
  function g(u) {
    var _ = u && u.length ? this.write(u) : "";
    return this.lastNeed ? _ + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : _;
  }
  function m(u) {
    return u.toString(this.encoding);
  }
  function C(u) {
    return u && u.length ? this.write(u) : "";
  }
  return Xr;
}
var Jr, gn;
function Pa() {
  if (gn) return Jr;
  gn = 1;
  var e = Rr();
  Jr = _;
  var r = As(), t;
  _.ReadableState = u, Cs.EventEmitter;
  var i = function(v, p) {
    return v.listeners(p).length;
  }, a = za(), n = Or().Buffer, o = (typeof se < "u" ? se : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function s(v) {
    return n.from(v);
  }
  function c(v) {
    return n.isBuffer(v) || v instanceof o;
  }
  var f = Object.create(Yt());
  f.inherits = Kt();
  var l = Ni, w = void 0;
  l && l.debuglog ? w = l.debuglog("stream") : w = function() {
  };
  var h = Os(), d = Na(), g;
  f.inherits(_, a);
  var m = ["error", "close", "destroy", "pause", "resume"];
  function C(v, p, A) {
    if (typeof v.prependListener == "function") return v.prependListener(p, A);
    !v._events || !v._events[p] ? v.on(p, A) : r(v._events[p]) ? v._events[p].unshift(A) : v._events[p] = [A, v._events[p]];
  }
  function u(v, p) {
    t = t || kt(), v = v || {};
    var A = p instanceof t;
    this.objectMode = !!v.objectMode, A && (this.objectMode = this.objectMode || !!v.readableObjectMode);
    var I = v.highWaterMark, W = v.readableHighWaterMark, P = this.objectMode ? 16 : 16 * 1024;
    I || I === 0 ? this.highWaterMark = I : A && (W || W === 0) ? this.highWaterMark = W : this.highWaterMark = P, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new h(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = v.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, v.encoding && (g || (g = _n().StringDecoder), this.decoder = new g(v.encoding), this.encoding = v.encoding);
  }
  function _(v) {
    if (t = t || kt(), !(this instanceof _)) return new _(v);
    this._readableState = new u(v, this), this.readable = !0, v && (typeof v.read == "function" && (this._read = v.read), typeof v.destroy == "function" && (this._destroy = v.destroy)), a.call(this);
  }
  Object.defineProperty(_.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(v) {
      this._readableState && (this._readableState.destroyed = v);
    }
  }), _.prototype.destroy = d.destroy, _.prototype._undestroy = d.undestroy, _.prototype._destroy = function(v, p) {
    this.push(null), p(v);
  }, _.prototype.push = function(v, p) {
    var A = this._readableState, I;
    return A.objectMode ? I = !0 : typeof v == "string" && (p = p || A.defaultEncoding, p !== A.encoding && (v = n.from(v, p), p = ""), I = !0), b(this, v, p, !1, I);
  }, _.prototype.unshift = function(v) {
    return b(this, v, null, !0, !1);
  };
  function b(v, p, A, I, W) {
    var P = v._readableState;
    if (p === null)
      P.reading = !1, j(v, P);
    else {
      var M;
      W || (M = E(P, p)), M ? v.emit("error", M) : P.objectMode || p && p.length > 0 ? (typeof p != "string" && !P.objectMode && Object.getPrototypeOf(p) !== n.prototype && (p = s(p)), I ? P.endEmitted ? v.emit("error", new Error("stream.unshift() after end event")) : S(v, P, p, !0) : P.ended ? v.emit("error", new Error("stream.push() after EOF")) : (P.reading = !1, P.decoder && !A ? (p = P.decoder.write(p), P.objectMode || p.length !== 0 ? S(v, P, p, !1) : fe(v, P)) : S(v, P, p, !1))) : I || (P.reading = !1);
    }
    return F(P);
  }
  function S(v, p, A, I) {
    p.flowing && p.length === 0 && !p.sync ? (v.emit("data", A), v.read(0)) : (p.length += p.objectMode ? 1 : A.length, I ? p.buffer.unshift(A) : p.buffer.push(A), p.needReadable && D(v)), fe(v, p);
  }
  function E(v, p) {
    var A;
    return !c(p) && typeof p != "string" && p !== void 0 && !v.objectMode && (A = new TypeError("Invalid non-string/buffer chunk")), A;
  }
  function F(v) {
    return !v.ended && (v.needReadable || v.length < v.highWaterMark || v.length === 0);
  }
  _.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, _.prototype.setEncoding = function(v) {
    return g || (g = _n().StringDecoder), this._readableState.decoder = new g(v), this._readableState.encoding = v, this;
  };
  var z = 8388608;
  function B(v) {
    return v >= z ? v = z : (v--, v |= v >>> 1, v |= v >>> 2, v |= v >>> 4, v |= v >>> 8, v |= v >>> 16, v++), v;
  }
  function L(v, p) {
    return v <= 0 || p.length === 0 && p.ended ? 0 : p.objectMode ? 1 : v !== v ? p.flowing && p.length ? p.buffer.head.data.length : p.length : (v > p.highWaterMark && (p.highWaterMark = B(v)), v <= p.length ? v : p.ended ? p.length : (p.needReadable = !0, 0));
  }
  _.prototype.read = function(v) {
    w("read", v), v = parseInt(v, 10);
    var p = this._readableState, A = v;
    if (v !== 0 && (p.emittedReadable = !1), v === 0 && p.needReadable && (p.length >= p.highWaterMark || p.ended))
      return w("read: emitReadable", p.length, p.ended), p.length === 0 && p.ended ? ce(this) : D(this), null;
    if (v = L(v, p), v === 0 && p.ended)
      return p.length === 0 && ce(this), null;
    var I = p.needReadable;
    w("need readable", I), (p.length === 0 || p.length - v < p.highWaterMark) && (I = !0, w("length less than watermark", I)), p.ended || p.reading ? (I = !1, w("reading or ended", I)) : I && (w("do read"), p.reading = !0, p.sync = !0, p.length === 0 && (p.needReadable = !0), this._read(p.highWaterMark), p.sync = !1, p.reading || (v = L(A, p)));
    var W;
    return v > 0 ? W = $(v, p) : W = null, W === null ? (p.needReadable = !0, v = 0) : p.length -= v, p.length === 0 && (p.ended || (p.needReadable = !0), A !== v && p.ended && ce(this)), W !== null && this.emit("data", W), W;
  };
  function j(v, p) {
    if (!p.ended) {
      if (p.decoder) {
        var A = p.decoder.end();
        A && A.length && (p.buffer.push(A), p.length += p.objectMode ? 1 : A.length);
      }
      p.ended = !0, D(v);
    }
  }
  function D(v) {
    var p = v._readableState;
    p.needReadable = !1, p.emittedReadable || (w("emitReadable", p.flowing), p.emittedReadable = !0, p.sync ? e.nextTick(J, v) : J(v));
  }
  function J(v) {
    w("emit readable"), v.emit("readable"), R(v);
  }
  function fe(v, p) {
    p.readingMore || (p.readingMore = !0, e.nextTick(U, v, p));
  }
  function U(v, p) {
    for (var A = p.length; !p.reading && !p.flowing && !p.ended && p.length < p.highWaterMark && (w("maybeReadMore read 0"), v.read(0), A !== p.length); )
      A = p.length;
    p.readingMore = !1;
  }
  _.prototype._read = function(v) {
    this.emit("error", new Error("_read() is not implemented"));
  }, _.prototype.pipe = function(v, p) {
    var A = this, I = this._readableState;
    switch (I.pipesCount) {
      case 0:
        I.pipes = v;
        break;
      case 1:
        I.pipes = [I.pipes, v];
        break;
      default:
        I.pipes.push(v);
        break;
    }
    I.pipesCount += 1, w("pipe count=%d opts=%j", I.pipesCount, p);
    var W = (!p || p.end !== !1) && v !== process.stdout && v !== process.stderr, P = W ? lt : T;
    I.endEmitted ? e.nextTick(P) : A.once("end", P), v.on("unpipe", M);
    function M(O, N) {
      w("onunpipe"), O === A && N && N.hasUnpiped === !1 && (N.hasUnpiped = !0, Ur());
    }
    function lt() {
      w("onend"), v.end();
    }
    var ut = Fe(A);
    v.on("drain", ut);
    var It = !1;
    function Ur() {
      w("cleanup"), v.removeListener("close", ht), v.removeListener("finish", k), v.removeListener("drain", ut), v.removeListener("error", Bt), v.removeListener("unpipe", M), A.removeListener("end", lt), A.removeListener("end", T), A.removeListener("data", Ke), It = !0, I.awaitDrain && (!v._writableState || v._writableState.needDrain) && ut();
    }
    var ie = !1;
    A.on("data", Ke);
    function Ke(O) {
      w("ondata"), ie = !1;
      var N = v.write(O);
      N === !1 && !ie && ((I.pipesCount === 1 && I.pipes === v || I.pipesCount > 1 && he(I.pipes, v) !== -1) && !It && (w("false write response, pause", I.awaitDrain), I.awaitDrain++, ie = !0), A.pause());
    }
    function Bt(O) {
      w("onerror", O), T(), v.removeListener("error", Bt), i(v, "error") === 0 && v.emit("error", O);
    }
    C(v, "error", Bt);
    function ht() {
      v.removeListener("finish", k), T();
    }
    v.once("close", ht);
    function k() {
      w("onfinish"), v.removeListener("close", ht), T();
    }
    v.once("finish", k);
    function T() {
      w("unpipe"), A.unpipe(v);
    }
    return v.emit("pipe", A), I.flowing || (w("pipe resume"), A.resume()), v;
  };
  function Fe(v) {
    return function() {
      var p = v._readableState;
      w("pipeOnDrain", p.awaitDrain), p.awaitDrain && p.awaitDrain--, p.awaitDrain === 0 && i(v, "data") && (p.flowing = !0, R(v));
    };
  }
  _.prototype.unpipe = function(v) {
    var p = this._readableState, A = { hasUnpiped: !1 };
    if (p.pipesCount === 0) return this;
    if (p.pipesCount === 1)
      return v && v !== p.pipes ? this : (v || (v = p.pipes), p.pipes = null, p.pipesCount = 0, p.flowing = !1, v && v.emit("unpipe", this, A), this);
    if (!v) {
      var I = p.pipes, W = p.pipesCount;
      p.pipes = null, p.pipesCount = 0, p.flowing = !1;
      for (var P = 0; P < W; P++)
        I[P].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var M = he(p.pipes, v);
    return M === -1 ? this : (p.pipes.splice(M, 1), p.pipesCount -= 1, p.pipesCount === 1 && (p.pipes = p.pipes[0]), v.emit("unpipe", this, A), this);
  }, _.prototype.on = function(v, p) {
    var A = a.prototype.on.call(this, v, p);
    if (v === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (v === "readable") {
      var I = this._readableState;
      !I.endEmitted && !I.readableListening && (I.readableListening = I.needReadable = !0, I.emittedReadable = !1, I.reading ? I.length && D(this) : e.nextTick($e, this));
    }
    return A;
  }, _.prototype.addListener = _.prototype.on;
  function $e(v) {
    w("readable nexttick read 0"), v.read(0);
  }
  _.prototype.resume = function() {
    var v = this._readableState;
    return v.flowing || (w("resume"), v.flowing = !0, x(this, v)), this;
  };
  function x(v, p) {
    p.resumeScheduled || (p.resumeScheduled = !0, e.nextTick(y, v, p));
  }
  function y(v, p) {
    p.reading || (w("resume read 0"), v.read(0)), p.resumeScheduled = !1, p.awaitDrain = 0, v.emit("resume"), R(v), p.flowing && !p.reading && v.read(0);
  }
  _.prototype.pause = function() {
    return w("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (w("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
  };
  function R(v) {
    var p = v._readableState;
    for (w("flow", p.flowing); p.flowing && v.read() !== null; )
      ;
  }
  _.prototype.wrap = function(v) {
    var p = this, A = this._readableState, I = !1;
    v.on("end", function() {
      if (w("wrapped end"), A.decoder && !A.ended) {
        var M = A.decoder.end();
        M && M.length && p.push(M);
      }
      p.push(null);
    }), v.on("data", function(M) {
      if (w("wrapped data"), A.decoder && (M = A.decoder.write(M)), !(A.objectMode && M == null) && !(!A.objectMode && (!M || !M.length))) {
        var lt = p.push(M);
        lt || (I = !0, v.pause());
      }
    });
    for (var W in v)
      this[W] === void 0 && typeof v[W] == "function" && (this[W] = /* @__PURE__ */ function(M) {
        return function() {
          return v[M].apply(v, arguments);
        };
      }(W));
    for (var P = 0; P < m.length; P++)
      v.on(m[P], this.emit.bind(this, m[P]));
    return this._read = function(M) {
      w("wrapped _read", M), I && (I = !1, v.resume());
    }, this;
  }, Object.defineProperty(_.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), _._fromList = $;
  function $(v, p) {
    if (p.length === 0) return null;
    var A;
    return p.objectMode ? A = p.buffer.shift() : !v || v >= p.length ? (p.decoder ? A = p.buffer.join("") : p.buffer.length === 1 ? A = p.buffer.head.data : A = p.buffer.concat(p.length), p.buffer.clear()) : A = Z(v, p.buffer, p.decoder), A;
  }
  function Z(v, p, A) {
    var I;
    return v < p.head.data.length ? (I = p.head.data.slice(0, v), p.head.data = p.head.data.slice(v)) : v === p.head.data.length ? I = p.shift() : I = A ? G(v, p) : re(v, p), I;
  }
  function G(v, p) {
    var A = p.head, I = 1, W = A.data;
    for (v -= W.length; A = A.next; ) {
      var P = A.data, M = v > P.length ? P.length : v;
      if (M === P.length ? W += P : W += P.slice(0, v), v -= M, v === 0) {
        M === P.length ? (++I, A.next ? p.head = A.next : p.head = p.tail = null) : (p.head = A, A.data = P.slice(M));
        break;
      }
      ++I;
    }
    return p.length -= I, W;
  }
  function re(v, p) {
    var A = n.allocUnsafe(v), I = p.head, W = 1;
    for (I.data.copy(A), v -= I.data.length; I = I.next; ) {
      var P = I.data, M = v > P.length ? P.length : v;
      if (P.copy(A, A.length - v, 0, M), v -= M, v === 0) {
        M === P.length ? (++W, I.next ? p.head = I.next : p.head = p.tail = null) : (p.head = I, I.data = P.slice(M));
        break;
      }
      ++W;
    }
    return p.length -= W, A;
  }
  function ce(v) {
    var p = v._readableState;
    if (p.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    p.endEmitted || (p.ended = !0, e.nextTick(Te, p, v));
  }
  function Te(v, p) {
    !v.endEmitted && v.length === 0 && (v.endEmitted = !0, p.readable = !1, p.emit("end"));
  }
  function he(v, p) {
    for (var A = 0, I = v.length; A < I; A++)
      if (v[A] === p) return A;
    return -1;
  }
  return Jr;
}
var Qr, mn;
function $a() {
  if (mn) return Qr;
  mn = 1, Qr = i;
  var e = kt(), r = Object.create(Yt());
  r.inherits = Kt(), r.inherits(i, e);
  function t(o, s) {
    var c = this._transformState;
    c.transforming = !1;
    var f = c.writecb;
    if (!f)
      return this.emit("error", new Error("write callback called multiple times"));
    c.writechunk = null, c.writecb = null, s != null && this.push(s), f(o);
    var l = this._readableState;
    l.reading = !1, (l.needReadable || l.length < l.highWaterMark) && this._read(l.highWaterMark);
  }
  function i(o) {
    if (!(this instanceof i)) return new i(o);
    e.call(this, o), this._transformState = {
      afterTransform: t.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, o && (typeof o.transform == "function" && (this._transform = o.transform), typeof o.flush == "function" && (this._flush = o.flush)), this.on("prefinish", a);
  }
  function a() {
    var o = this;
    typeof this._flush == "function" ? this._flush(function(s, c) {
      n(o, s, c);
    }) : n(this, null, null);
  }
  i.prototype.push = function(o, s) {
    return this._transformState.needTransform = !1, e.prototype.push.call(this, o, s);
  }, i.prototype._transform = function(o, s, c) {
    throw new Error("_transform() is not implemented");
  }, i.prototype._write = function(o, s, c) {
    var f = this._transformState;
    if (f.writecb = c, f.writechunk = o, f.writeencoding = s, !f.transforming) {
      var l = this._readableState;
      (f.needTransform || l.needReadable || l.length < l.highWaterMark) && this._read(l.highWaterMark);
    }
  }, i.prototype._read = function(o) {
    var s = this._transformState;
    s.writechunk !== null && s.writecb && !s.transforming ? (s.transforming = !0, this._transform(s.writechunk, s.writeencoding, s.afterTransform)) : s.needTransform = !0;
  }, i.prototype._destroy = function(o, s) {
    var c = this;
    e.prototype._destroy.call(this, o, function(f) {
      s(f), c.emit("close");
    });
  };
  function n(o, s, c) {
    if (s) return o.emit("error", s);
    if (c != null && o.push(c), o._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (o._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return o.push(null);
  }
  return Qr;
}
var ei, wn;
function Is() {
  if (wn) return ei;
  wn = 1, ei = t;
  var e = $a(), r = Object.create(Yt());
  r.inherits = Kt(), r.inherits(t, e);
  function t(i) {
    if (!(this instanceof t)) return new t(i);
    e.call(this, i);
  }
  return t.prototype._transform = function(i, a, n) {
    n(null, i);
  }, ei;
}
var bn;
function Ma() {
  return bn || (bn = 1, function(e, r) {
    var t = Ia;
    process.env.READABLE_STREAM === "disable" && t ? (e.exports = t, r = e.exports = t.Readable, r.Readable = t.Readable, r.Writable = t.Writable, r.Duplex = t.Duplex, r.Transform = t.Transform, r.PassThrough = t.PassThrough, r.Stream = t) : (r = e.exports = Pa(), r.Stream = t || r, r.Readable = r, r.Writable = La(), r.Duplex = kt(), r.Transform = $a(), r.PassThrough = Is());
  }(ir, ir.exports)), ir.exports;
}
var yn, fr;
ne.base64 = !0;
ne.array = !0;
ne.string = !0;
ne.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u";
ne.nodebuffer = typeof Buffer < "u";
ne.uint8array = typeof Uint8Array < "u";
if (typeof ArrayBuffer > "u")
  fr = ne.blob = !1;
else {
  var xn = new ArrayBuffer(0);
  try {
    fr = ne.blob = new Blob([xn], {
      type: "application/zip"
    }).size === 0;
  } catch {
    try {
      var Bs = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder, kn = new Bs();
      kn.append(xn), fr = ne.blob = kn.getBlob("application/zip").size === 0;
    } catch {
      fr = ne.blob = !1;
    }
  }
}
try {
  yn = ne.nodestream = !!Ma().Readable;
} catch {
  yn = ne.nodestream = !1;
}
var lr = {}, Sn;
function ja() {
  if (Sn) return lr;
  Sn = 1;
  var e = ee(), r = ne, t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  return lr.encode = function(i) {
    for (var a = [], n, o, s, c, f, l, w, h = 0, d = i.length, g = d, m = e.getTypeOf(i) !== "string"; h < i.length; )
      g = d - h, m ? (n = i[h++], o = h < d ? i[h++] : 0, s = h < d ? i[h++] : 0) : (n = i.charCodeAt(h++), o = h < d ? i.charCodeAt(h++) : 0, s = h < d ? i.charCodeAt(h++) : 0), c = n >> 2, f = (n & 3) << 4 | o >> 4, l = g > 1 ? (o & 15) << 2 | s >> 6 : 64, w = g > 2 ? s & 63 : 64, a.push(t.charAt(c) + t.charAt(f) + t.charAt(l) + t.charAt(w));
    return a.join("");
  }, lr.decode = function(i) {
    var a, n, o, s, c, f, l, w = 0, h = 0, d = "data:";
    if (i.substr(0, d.length) === d)
      throw new Error("Invalid base64 input, it looks like a data url.");
    i = i.replace(/[^A-Za-z0-9+/=]/g, "");
    var g = i.length * 3 / 4;
    if (i.charAt(i.length - 1) === t.charAt(64) && g--, i.charAt(i.length - 2) === t.charAt(64) && g--, g % 1 !== 0)
      throw new Error("Invalid base64 input, bad content length.");
    var m;
    for (r.uint8array ? m = new Uint8Array(g | 0) : m = new Array(g | 0); w < i.length; )
      s = t.indexOf(i.charAt(w++)), c = t.indexOf(i.charAt(w++)), f = t.indexOf(i.charAt(w++)), l = t.indexOf(i.charAt(w++)), a = s << 2 | c >> 4, n = (c & 15) << 4 | f >> 2, o = (f & 3) << 6 | l, m[h++] = a, f !== 64 && (m[h++] = n), l !== 64 && (m[h++] = o);
    return m;
  }, lr;
}
var Dr = {
  /**
   * True if this is running in Nodejs, will be undefined in a browser.
   * In a browser, browserify won't include this file and the whole module
   * will be resolved an empty object.
   */
  isNode: typeof Buffer < "u",
  /**
   * Create a new nodejs Buffer from an existing content.
   * @param {Object} data the data to pass to the constructor.
   * @param {String} encoding the encoding to use.
   * @return {Buffer} a new Buffer.
   */
  newBufferFrom: function(e, r) {
    if (Buffer.from && Buffer.from !== Uint8Array.from)
      return Buffer.from(e, r);
    if (typeof e == "number")
      throw new Error('The "data" argument must not be a number');
    return new Buffer(e, r);
  },
  /**
   * Create a new nodejs Buffer with the specified size.
   * @param {Integer} size the size of the buffer.
   * @return {Buffer} a new Buffer.
   */
  allocBuffer: function(e) {
    if (Buffer.alloc)
      return Buffer.alloc(e);
    var r = new Buffer(e);
    return r.fill(0), r;
  },
  /**
   * Find out if an object is a Buffer.
   * @param {Object} b the object to test.
   * @return {Boolean} true if the object is a Buffer, false otherwise.
   */
  isBuffer: function(e) {
    return Buffer.isBuffer(e);
  },
  isStream: function(e) {
    return e && typeof e.on == "function" && typeof e.pause == "function" && typeof e.resume == "function";
  }
}, ti, En;
function Fs() {
  if (En) return ti;
  En = 1;
  var e = se.MutationObserver || se.WebKitMutationObserver, r;
  if (process.browser)
    if (e) {
      var t = 0, i = new e(c), a = se.document.createTextNode("");
      i.observe(a, {
        characterData: !0
      }), r = function() {
        a.data = t = ++t % 2;
      };
    } else if (!se.setImmediate && typeof se.MessageChannel < "u") {
      var n = new se.MessageChannel();
      n.port1.onmessage = c, r = function() {
        n.port2.postMessage(0);
      };
    } else "document" in se && "onreadystatechange" in se.document.createElement("script") ? r = function() {
      var l = se.document.createElement("script");
      l.onreadystatechange = function() {
        c(), l.onreadystatechange = null, l.parentNode.removeChild(l), l = null;
      }, se.document.documentElement.appendChild(l);
    } : r = function() {
      setTimeout(c, 0);
    };
  else
    r = function() {
      process.nextTick(c);
    };
  var o, s = [];
  function c() {
    o = !0;
    for (var l, w, h = s.length; h; ) {
      for (w = s, s = [], l = -1; ++l < h; )
        w[l]();
      h = s.length;
    }
    o = !1;
  }
  ti = f;
  function f(l) {
    s.push(l) === 1 && !o && r();
  }
  return ti;
}
var ri, Cn;
function zs() {
  if (Cn) return ri;
  Cn = 1;
  var e = Fs();
  function r() {
  }
  var t = {}, i = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
  if (!process.browser)
    var o = ["UNHANDLED"];
  ri = s;
  function s(u) {
    if (typeof u != "function")
      throw new TypeError("resolver must be a function");
    this.state = n, this.queue = [], this.outcome = void 0, process.browser || (this.handled = o), u !== r && w(this, u);
  }
  s.prototype.finally = function(u) {
    if (typeof u != "function")
      return this;
    var _ = this.constructor;
    return this.then(b, S);
    function b(E) {
      function F() {
        return E;
      }
      return _.resolve(u()).then(F);
    }
    function S(E) {
      function F() {
        throw E;
      }
      return _.resolve(u()).then(F);
    }
  }, s.prototype.catch = function(u) {
    return this.then(null, u);
  }, s.prototype.then = function(u, _) {
    if (typeof u != "function" && this.state === a || typeof _ != "function" && this.state === i)
      return this;
    var b = new this.constructor(r);
    if (process.browser || this.handled === o && (this.handled = null), this.state !== n) {
      var S = this.state === a ? u : _;
      f(b, S, this.outcome);
    } else
      this.queue.push(new c(b, u, _));
    return b;
  };
  function c(u, _, b) {
    this.promise = u, typeof _ == "function" && (this.onFulfilled = _, this.callFulfilled = this.otherCallFulfilled), typeof b == "function" && (this.onRejected = b, this.callRejected = this.otherCallRejected);
  }
  c.prototype.callFulfilled = function(u) {
    t.resolve(this.promise, u);
  }, c.prototype.otherCallFulfilled = function(u) {
    f(this.promise, this.onFulfilled, u);
  }, c.prototype.callRejected = function(u) {
    t.reject(this.promise, u);
  }, c.prototype.otherCallRejected = function(u) {
    f(this.promise, this.onRejected, u);
  };
  function f(u, _, b) {
    e(function() {
      var S;
      try {
        S = _(b);
      } catch (E) {
        return t.reject(u, E);
      }
      S === u ? t.reject(u, new TypeError("Cannot resolve promise with itself")) : t.resolve(u, S);
    });
  }
  t.resolve = function(u, _) {
    var b = h(l, _);
    if (b.status === "error")
      return t.reject(u, b.value);
    var S = b.value;
    if (S)
      w(u, S);
    else {
      u.state = a, u.outcome = _;
      for (var E = -1, F = u.queue.length; ++E < F; )
        u.queue[E].callFulfilled(_);
    }
    return u;
  }, t.reject = function(u, _) {
    u.state = i, u.outcome = _, process.browser || u.handled === o && e(function() {
      u.handled === o && process.emit("unhandledRejection", _, u);
    });
    for (var b = -1, S = u.queue.length; ++b < S; )
      u.queue[b].callRejected(_);
    return u;
  };
  function l(u) {
    var _ = u && u.then;
    if (u && (typeof u == "object" || typeof u == "function") && typeof _ == "function")
      return function() {
        _.apply(u, arguments);
      };
  }
  function w(u, _) {
    var b = !1;
    function S(B) {
      b || (b = !0, t.reject(u, B));
    }
    function E(B) {
      b || (b = !0, t.resolve(u, B));
    }
    function F() {
      _(E, S);
    }
    var z = h(F);
    z.status === "error" && S(z.value);
  }
  function h(u, _) {
    var b = {};
    try {
      b.value = u(_), b.status = "success";
    } catch (S) {
      b.status = "error", b.value = S;
    }
    return b;
  }
  s.resolve = d;
  function d(u) {
    return u instanceof this ? u : t.resolve(new this(r), u);
  }
  s.reject = g;
  function g(u) {
    var _ = new this(r);
    return t.reject(_, u);
  }
  s.all = m;
  function m(u) {
    var _ = this;
    if (Object.prototype.toString.call(u) !== "[object Array]")
      return this.reject(new TypeError("must be an array"));
    var b = u.length, S = !1;
    if (!b)
      return this.resolve([]);
    for (var E = new Array(b), F = 0, z = -1, B = new this(r); ++z < b; )
      L(u[z], z);
    return B;
    function L(j, D) {
      _.resolve(j).then(J, function(fe) {
        S || (S = !0, t.reject(B, fe));
      });
      function J(fe) {
        E[D] = fe, ++F === b && !S && (S = !0, t.resolve(B, E));
      }
    }
  }
  s.race = C;
  function C(u) {
    var _ = this;
    if (Object.prototype.toString.call(u) !== "[object Array]")
      return this.reject(new TypeError("must be an array"));
    var b = u.length, S = !1;
    if (!b)
      return this.resolve([]);
    for (var E = -1, F = new this(r); ++E < b; )
      z(u[E]);
    return F;
    function z(B) {
      _.resolve(B).then(function(L) {
        S || (S = !0, t.resolve(F, L));
      }, function(L) {
        S || (S = !0, t.reject(F, L));
      });
    }
  }
  return ri;
}
var ki = null;
typeof Promise < "u" ? ki = Promise : ki = zs();
var Vt = {
  Promise: ki
};
(function(e, r) {
  if (e.setImmediate)
    return;
  var t = 1, i = {}, a = !1, n = e.document, o;
  function s(_) {
    typeof _ != "function" && (_ = new Function("" + _));
    for (var b = new Array(arguments.length - 1), S = 0; S < b.length; S++)
      b[S] = arguments[S + 1];
    var E = { callback: _, args: b };
    return i[t] = E, o(t), t++;
  }
  function c(_) {
    delete i[_];
  }
  function f(_) {
    var b = _.callback, S = _.args;
    switch (S.length) {
      case 0:
        b();
        break;
      case 1:
        b(S[0]);
        break;
      case 2:
        b(S[0], S[1]);
        break;
      case 3:
        b(S[0], S[1], S[2]);
        break;
      default:
        b.apply(r, S);
        break;
    }
  }
  function l(_) {
    if (a)
      setTimeout(l, 0, _);
    else {
      var b = i[_];
      if (b) {
        a = !0;
        try {
          f(b);
        } finally {
          c(_), a = !1;
        }
      }
    }
  }
  function w() {
    o = function(_) {
      process.nextTick(function() {
        l(_);
      });
    };
  }
  function h() {
    if (e.postMessage && !e.importScripts) {
      var _ = !0, b = e.onmessage;
      return e.onmessage = function() {
        _ = !1;
      }, e.postMessage("", "*"), e.onmessage = b, _;
    }
  }
  function d() {
    var _ = "setImmediate$" + Math.random() + "$", b = function(S) {
      S.source === e && typeof S.data == "string" && S.data.indexOf(_) === 0 && l(+S.data.slice(_.length));
    };
    e.addEventListener ? e.addEventListener("message", b, !1) : e.attachEvent("onmessage", b), o = function(S) {
      e.postMessage(_ + S, "*");
    };
  }
  function g() {
    var _ = new MessageChannel();
    _.port1.onmessage = function(b) {
      var S = b.data;
      l(S);
    }, o = function(b) {
      _.port2.postMessage(b);
    };
  }
  function m() {
    var _ = n.documentElement;
    o = function(b) {
      var S = n.createElement("script");
      S.onreadystatechange = function() {
        l(b), S.onreadystatechange = null, _.removeChild(S), S = null;
      }, _.appendChild(S);
    };
  }
  function C() {
    o = function(_) {
      setTimeout(l, 0, _);
    };
  }
  var u = Object.getPrototypeOf && Object.getPrototypeOf(e);
  u = u && u.setTimeout ? u : e, {}.toString.call(e.process) === "[object process]" ? w() : h() ? d() : e.MessageChannel ? g() : n && "onreadystatechange" in n.createElement("script") ? m() : C(), u.setImmediate = s, u.clearImmediate = c;
})(typeof self > "u" ? se : self);
var Tn;
function ee() {
  return Tn || (Tn = 1, function(e) {
    var r = ne, t = ja(), i = Dr, a = Vt;
    function n(h) {
      var d = null;
      return r.uint8array ? d = new Uint8Array(h.length) : d = new Array(h.length), s(h, d);
    }
    e.newBlob = function(h, d) {
      e.checkSupport("blob");
      try {
        return new Blob([h], {
          type: d
        });
      } catch {
        try {
          var g = self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder, m = new g();
          return m.append(h), m.getBlob(d);
        } catch {
          throw new Error("Bug : can't construct the Blob.");
        }
      }
    };
    function o(h) {
      return h;
    }
    function s(h, d) {
      for (var g = 0; g < h.length; ++g)
        d[g] = h.charCodeAt(g) & 255;
      return d;
    }
    var c = {
      /**
       * Transform an array of int into a string, chunk by chunk.
       * See the performances notes on arrayLikeToString.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @param {String} type the type of the array.
       * @param {Integer} chunk the chunk size.
       * @return {String} the resulting string.
       * @throws Error if the chunk is too big for the stack.
       */
      stringifyByChunk: function(h, d, g) {
        var m = [], C = 0, u = h.length;
        if (u <= g)
          return String.fromCharCode.apply(null, h);
        for (; C < u; )
          d === "array" || d === "nodebuffer" ? m.push(String.fromCharCode.apply(null, h.slice(C, Math.min(C + g, u)))) : m.push(String.fromCharCode.apply(null, h.subarray(C, Math.min(C + g, u)))), C += g;
        return m.join("");
      },
      /**
       * Call String.fromCharCode on every item in the array.
       * This is the naive implementation, which generate A LOT of intermediate string.
       * This should be used when everything else fail.
       * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
       * @return {String} the result.
       */
      stringifyByChar: function(h) {
        for (var d = "", g = 0; g < h.length; g++)
          d += String.fromCharCode(h[g]);
        return d;
      },
      applyCanBeUsed: {
        /**
         * true if the browser accepts to use String.fromCharCode on Uint8Array
         */
        uint8array: function() {
          try {
            return r.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
          } catch {
            return !1;
          }
        }(),
        /**
         * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
         */
        nodebuffer: function() {
          try {
            return r.nodebuffer && String.fromCharCode.apply(null, i.allocBuffer(1)).length === 1;
          } catch {
            return !1;
          }
        }()
      }
    };
    function f(h) {
      var d = 65536, g = e.getTypeOf(h), m = !0;
      if (g === "uint8array" ? m = c.applyCanBeUsed.uint8array : g === "nodebuffer" && (m = c.applyCanBeUsed.nodebuffer), m)
        for (; d > 1; )
          try {
            return c.stringifyByChunk(h, g, d);
          } catch {
            d = Math.floor(d / 2);
          }
      return c.stringifyByChar(h);
    }
    e.applyFromCharCode = f;
    function l(h, d) {
      for (var g = 0; g < h.length; g++)
        d[g] = h[g];
      return d;
    }
    var w = {};
    w.string = {
      string: o,
      array: function(h) {
        return s(h, new Array(h.length));
      },
      arraybuffer: function(h) {
        return w.string.uint8array(h).buffer;
      },
      uint8array: function(h) {
        return s(h, new Uint8Array(h.length));
      },
      nodebuffer: function(h) {
        return s(h, i.allocBuffer(h.length));
      }
    }, w.array = {
      string: f,
      array: o,
      arraybuffer: function(h) {
        return new Uint8Array(h).buffer;
      },
      uint8array: function(h) {
        return new Uint8Array(h);
      },
      nodebuffer: function(h) {
        return i.newBufferFrom(h);
      }
    }, w.arraybuffer = {
      string: function(h) {
        return f(new Uint8Array(h));
      },
      array: function(h) {
        return l(new Uint8Array(h), new Array(h.byteLength));
      },
      arraybuffer: o,
      uint8array: function(h) {
        return new Uint8Array(h);
      },
      nodebuffer: function(h) {
        return i.newBufferFrom(new Uint8Array(h));
      }
    }, w.uint8array = {
      string: f,
      array: function(h) {
        return l(h, new Array(h.length));
      },
      arraybuffer: function(h) {
        return h.buffer;
      },
      uint8array: o,
      nodebuffer: function(h) {
        return i.newBufferFrom(h);
      }
    }, w.nodebuffer = {
      string: f,
      array: function(h) {
        return l(h, new Array(h.length));
      },
      arraybuffer: function(h) {
        return w.nodebuffer.uint8array(h).buffer;
      },
      uint8array: function(h) {
        return l(h, new Uint8Array(h.length));
      },
      nodebuffer: o
    }, e.transformTo = function(h, d) {
      if (d || (d = ""), !h)
        return d;
      e.checkSupport(h);
      var g = e.getTypeOf(d), m = w[g][h](d);
      return m;
    }, e.resolve = function(h) {
      for (var d = h.split("/"), g = [], m = 0; m < d.length; m++) {
        var C = d[m];
        C === "." || C === "" && m !== 0 && m !== d.length - 1 || (C === ".." ? g.pop() : g.push(C));
      }
      return g.join("/");
    }, e.getTypeOf = function(h) {
      if (typeof h == "string")
        return "string";
      if (Object.prototype.toString.call(h) === "[object Array]")
        return "array";
      if (r.nodebuffer && i.isBuffer(h))
        return "nodebuffer";
      if (r.uint8array && h instanceof Uint8Array)
        return "uint8array";
      if (r.arraybuffer && h instanceof ArrayBuffer)
        return "arraybuffer";
    }, e.checkSupport = function(h) {
      var d = r[h.toLowerCase()];
      if (!d)
        throw new Error(h + " is not supported by this platform");
    }, e.MAX_VALUE_16BITS = 65535, e.MAX_VALUE_32BITS = -1, e.pretty = function(h) {
      var d = "", g, m;
      for (m = 0; m < (h || "").length; m++)
        g = h.charCodeAt(m), d += "\\x" + (g < 16 ? "0" : "") + g.toString(16).toUpperCase();
      return d;
    }, e.delay = function(h, d, g) {
      setImmediate(function() {
        h.apply(g || null, d || []);
      });
    }, e.inherits = function(h, d) {
      var g = function() {
      };
      g.prototype = d.prototype, h.prototype = new g();
    }, e.extend = function() {
      var h = {}, d, g;
      for (d = 0; d < arguments.length; d++)
        for (g in arguments[d])
          Object.prototype.hasOwnProperty.call(arguments[d], g) && typeof h[g] > "u" && (h[g] = arguments[d][g]);
      return h;
    }, e.prepareContent = function(h, d, g, m, C) {
      var u = a.Promise.resolve(d).then(function(_) {
        var b = r.blob && (_ instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(_)) !== -1);
        return b && typeof FileReader < "u" ? new a.Promise(function(S, E) {
          var F = new FileReader();
          F.onload = function(z) {
            S(z.target.result);
          }, F.onerror = function(z) {
            E(z.target.error);
          }, F.readAsArrayBuffer(_);
        }) : _;
      });
      return u.then(function(_) {
        var b = e.getTypeOf(_);
        return b ? (b === "arraybuffer" ? _ = e.transformTo("uint8array", _) : b === "string" && (C ? _ = t.decode(_) : g && m !== !0 && (_ = n(_))), _) : a.Promise.reject(
          new Error("Can't read the data of '" + h + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?")
        );
      });
    };
  }(Zr)), Zr;
}
function Ua(e) {
  this.name = e || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
    data: [],
    end: [],
    error: []
  }, this.previous = null;
}
Ua.prototype = {
  /**
   * Push a chunk to the next workers.
   * @param {Object} chunk the chunk to push
   */
  push: function(e) {
    this.emit("data", e);
  },
  /**
   * End the stream.
   * @return {Boolean} true if this call ended the worker, false otherwise.
   */
  end: function() {
    if (this.isFinished)
      return !1;
    this.flush();
    try {
      this.emit("end"), this.cleanUp(), this.isFinished = !0;
    } catch (e) {
      this.emit("error", e);
    }
    return !0;
  },
  /**
   * End the stream with an error.
   * @param {Error} e the error which caused the premature end.
   * @return {Boolean} true if this call ended the worker with an error, false otherwise.
   */
  error: function(e) {
    return this.isFinished ? !1 : (this.isPaused ? this.generatedError = e : (this.isFinished = !0, this.emit("error", e), this.previous && this.previous.error(e), this.cleanUp()), !0);
  },
  /**
   * Add a callback on an event.
   * @param {String} name the name of the event (data, end, error)
   * @param {Function} listener the function to call when the event is triggered
   * @return {GenericWorker} the current object for chainability
   */
  on: function(e, r) {
    return this._listeners[e].push(r), this;
  },
  /**
   * Clean any references when a worker is ending.
   */
  cleanUp: function() {
    this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
  },
  /**
   * Trigger an event. This will call registered callback with the provided arg.
   * @param {String} name the name of the event (data, end, error)
   * @param {Object} arg the argument to call the callback with.
   */
  emit: function(e, r) {
    if (this._listeners[e])
      for (var t = 0; t < this._listeners[e].length; t++)
        this._listeners[e][t].call(this, r);
  },
  /**
   * Chain a worker with an other.
   * @param {Worker} next the worker receiving events from the current one.
   * @return {worker} the next worker for chainability
   */
  pipe: function(e) {
    return e.registerPrevious(this);
  },
  /**
   * Same as `pipe` in the other direction.
   * Using an API with `pipe(next)` is very easy.
   * Implementing the API with the point of view of the next one registering
   * a source is easier, see the ZipFileWorker.
   * @param {Worker} previous the previous worker, sending events to this one
   * @return {Worker} the current worker for chainability
   */
  registerPrevious: function(e) {
    if (this.isLocked)
      throw new Error("The stream '" + this + "' has already been used.");
    this.streamInfo = e.streamInfo, this.mergeStreamInfo(), this.previous = e;
    var r = this;
    return e.on("data", function(t) {
      r.processChunk(t);
    }), e.on("end", function() {
      r.end();
    }), e.on("error", function(t) {
      r.error(t);
    }), this;
  },
  /**
   * Pause the stream so it doesn't send events anymore.
   * @return {Boolean} true if this call paused the worker, false otherwise.
   */
  pause: function() {
    return this.isPaused || this.isFinished ? !1 : (this.isPaused = !0, this.previous && this.previous.pause(), !0);
  },
  /**
   * Resume a paused stream.
   * @return {Boolean} true if this call resumed the worker, false otherwise.
   */
  resume: function() {
    if (!this.isPaused || this.isFinished)
      return !1;
    this.isPaused = !1;
    var e = !1;
    return this.generatedError && (this.error(this.generatedError), e = !0), this.previous && this.previous.resume(), !e;
  },
  /**
   * Flush any remaining bytes as the stream is ending.
   */
  flush: function() {
  },
  /**
   * Process a chunk. This is usually the method overridden.
   * @param {Object} chunk the chunk to process.
   */
  processChunk: function(e) {
    this.push(e);
  },
  /**
   * Add a key/value to be added in the workers chain streamInfo once activated.
   * @param {String} key the key to use
   * @param {Object} value the associated value
   * @return {Worker} the current worker for chainability
   */
  withStreamInfo: function(e, r) {
    return this.extraStreamInfo[e] = r, this.mergeStreamInfo(), this;
  },
  /**
   * Merge this worker's streamInfo into the chain's streamInfo.
   */
  mergeStreamInfo: function() {
    for (var e in this.extraStreamInfo)
      Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e) && (this.streamInfo[e] = this.extraStreamInfo[e]);
  },
  /**
   * Lock the stream to prevent further updates on the workers chain.
   * After calling this method, all calls to pipe will fail.
   */
  lock: function() {
    if (this.isLocked)
      throw new Error("The stream '" + this + "' has already been used.");
    this.isLocked = !0, this.previous && this.previous.lock();
  },
  /**
   *
   * Pretty print the workers chain.
   */
  toString: function() {
    var e = "Worker " + this.name;
    return this.previous ? this.previous + " -> " + e : e;
  }
};
var ye = Ua;
(function(e) {
  for (var r = ee(), t = ne, i = Dr, a = ye, n = new Array(256), o = 0; o < 256; o++)
    n[o] = o >= 252 ? 6 : o >= 248 ? 5 : o >= 240 ? 4 : o >= 224 ? 3 : o >= 192 ? 2 : 1;
  n[254] = n[254] = 1;
  var s = function(h) {
    var d, g, m, C, u, _ = h.length, b = 0;
    for (C = 0; C < _; C++)
      g = h.charCodeAt(C), (g & 64512) === 55296 && C + 1 < _ && (m = h.charCodeAt(C + 1), (m & 64512) === 56320 && (g = 65536 + (g - 55296 << 10) + (m - 56320), C++)), b += g < 128 ? 1 : g < 2048 ? 2 : g < 65536 ? 3 : 4;
    for (t.uint8array ? d = new Uint8Array(b) : d = new Array(b), u = 0, C = 0; u < b; C++)
      g = h.charCodeAt(C), (g & 64512) === 55296 && C + 1 < _ && (m = h.charCodeAt(C + 1), (m & 64512) === 56320 && (g = 65536 + (g - 55296 << 10) + (m - 56320), C++)), g < 128 ? d[u++] = g : g < 2048 ? (d[u++] = 192 | g >>> 6, d[u++] = 128 | g & 63) : g < 65536 ? (d[u++] = 224 | g >>> 12, d[u++] = 128 | g >>> 6 & 63, d[u++] = 128 | g & 63) : (d[u++] = 240 | g >>> 18, d[u++] = 128 | g >>> 12 & 63, d[u++] = 128 | g >>> 6 & 63, d[u++] = 128 | g & 63);
    return d;
  }, c = function(h, d) {
    var g;
    for (d = d || h.length, d > h.length && (d = h.length), g = d - 1; g >= 0 && (h[g] & 192) === 128; )
      g--;
    return g < 0 || g === 0 ? d : g + n[h[g]] > d ? g : d;
  }, f = function(h) {
    var d, g, m, C, u = h.length, _ = new Array(u * 2);
    for (g = 0, d = 0; d < u; ) {
      if (m = h[d++], m < 128) {
        _[g++] = m;
        continue;
      }
      if (C = n[m], C > 4) {
        _[g++] = 65533, d += C - 1;
        continue;
      }
      for (m &= C === 2 ? 31 : C === 3 ? 15 : 7; C > 1 && d < u; )
        m = m << 6 | h[d++] & 63, C--;
      if (C > 1) {
        _[g++] = 65533;
        continue;
      }
      m < 65536 ? _[g++] = m : (m -= 65536, _[g++] = 55296 | m >> 10 & 1023, _[g++] = 56320 | m & 1023);
    }
    return _.length !== g && (_.subarray ? _ = _.subarray(0, g) : _.length = g), r.applyFromCharCode(_);
  };
  e.utf8encode = function(d) {
    return t.nodebuffer ? i.newBufferFrom(d, "utf-8") : s(d);
  }, e.utf8decode = function(d) {
    return t.nodebuffer ? r.transformTo("nodebuffer", d).toString("utf-8") : (d = r.transformTo(t.uint8array ? "uint8array" : "array", d), f(d));
  };
  function l() {
    a.call(this, "utf-8 decode"), this.leftOver = null;
  }
  r.inherits(l, a), l.prototype.processChunk = function(h) {
    var d = r.transformTo(t.uint8array ? "uint8array" : "array", h.data);
    if (this.leftOver && this.leftOver.length) {
      if (t.uint8array) {
        var g = d;
        d = new Uint8Array(g.length + this.leftOver.length), d.set(this.leftOver, 0), d.set(g, this.leftOver.length);
      } else
        d = this.leftOver.concat(d);
      this.leftOver = null;
    }
    var m = c(d), C = d;
    m !== d.length && (t.uint8array ? (C = d.subarray(0, m), this.leftOver = d.subarray(m, d.length)) : (C = d.slice(0, m), this.leftOver = d.slice(m, d.length))), this.push({
      data: e.utf8decode(C),
      meta: h.meta
    });
  }, l.prototype.flush = function() {
    this.leftOver && this.leftOver.length && (this.push({
      data: e.utf8decode(this.leftOver),
      meta: {}
    }), this.leftOver = null);
  }, e.Utf8DecodeWorker = l;
  function w() {
    a.call(this, "utf-8 encode");
  }
  r.inherits(w, a), w.prototype.processChunk = function(h) {
    this.push({
      data: e.utf8encode(h.data),
      meta: h.meta
    });
  }, e.Utf8EncodeWorker = w;
})(St);
var Za = ye, Wa = ee();
function Li(e) {
  Za.call(this, "ConvertWorker to " + e), this.destType = e;
}
Wa.inherits(Li, Za);
Li.prototype.processChunk = function(e) {
  this.push({
    data: Wa.transformTo(this.destType, e.data),
    meta: e.meta
  });
};
var Ns = Li, ii, An;
function Ls() {
  if (An) return ii;
  An = 1;
  var e = Ma().Readable, r = ee();
  r.inherits(t, e);
  function t(i, a, n) {
    e.call(this, a), this._helper = i;
    var o = this;
    i.on("data", function(s, c) {
      o.push(s) || o._helper.pause(), n && n(c);
    }).on("error", function(s) {
      o.emit("error", s);
    }).on("end", function() {
      o.push(null);
    });
  }
  return t.prototype._read = function() {
    this._helper.resume();
  }, ii = t, ii;
}
var et = ee(), Ps = Ns, $s = ye, Ms = ja(), js = ne, Us = Vt, Ha = null;
if (js.nodestream)
  try {
    Ha = Ls();
  } catch {
  }
function Zs(e, r, t) {
  switch (e) {
    case "blob":
      return et.newBlob(et.transformTo("arraybuffer", r), t);
    case "base64":
      return Ms.encode(r);
    default:
      return et.transformTo(e, r);
  }
}
function Ws(e, r) {
  var t, i = 0, a = null, n = 0;
  for (t = 0; t < r.length; t++)
    n += r[t].length;
  switch (e) {
    case "string":
      return r.join("");
    case "array":
      return Array.prototype.concat.apply([], r);
    case "uint8array":
      for (a = new Uint8Array(n), t = 0; t < r.length; t++)
        a.set(r[t], i), i += r[t].length;
      return a;
    case "nodebuffer":
      return Buffer.concat(r);
    default:
      throw new Error("concat : unsupported type '" + e + "'");
  }
}
function Hs(e, r) {
  return new Us.Promise(function(t, i) {
    var a = [], n = e._internalType, o = e._outputType, s = e._mimeType;
    e.on("data", function(c, f) {
      a.push(c), r && r(f);
    }).on("error", function(c) {
      a = [], i(c);
    }).on("end", function() {
      try {
        var c = Zs(o, Ws(n, a), s);
        t(c);
      } catch (f) {
        i(f);
      }
      a = [];
    }).resume();
  });
}
function qa(e, r, t) {
  var i = r;
  switch (r) {
    case "blob":
    case "arraybuffer":
      i = "uint8array";
      break;
    case "base64":
      i = "string";
      break;
  }
  try {
    this._internalType = i, this._outputType = r, this._mimeType = t, et.checkSupport(i), this._worker = e.pipe(new Ps(i)), e.lock();
  } catch (a) {
    this._worker = new $s("error"), this._worker.error(a);
  }
}
qa.prototype = {
  /**
   * Listen a StreamHelper, accumulate its content and concatenate it into a
   * complete block.
   * @param {Function} updateCb the update callback.
   * @return Promise the promise for the accumulation.
   */
  accumulate: function(e) {
    return Hs(this, e);
  },
  /**
   * Add a listener on an event triggered on a stream.
   * @param {String} evt the name of the event
   * @param {Function} fn the listener
   * @return {StreamHelper} the current helper.
   */
  on: function(e, r) {
    var t = this;
    return e === "data" ? this._worker.on(e, function(i) {
      r.call(t, i.data, i.meta);
    }) : this._worker.on(e, function() {
      et.delay(r, arguments, t);
    }), this;
  },
  /**
   * Resume the flow of chunks.
   * @return {StreamHelper} the current helper.
   */
  resume: function() {
    return et.delay(this._worker.resume, [], this._worker), this;
  },
  /**
   * Pause the flow of chunks.
   * @return {StreamHelper} the current helper.
   */
  pause: function() {
    return this._worker.pause(), this;
  },
  /**
   * Return a nodejs stream for this helper.
   * @param {Function} updateCb the update callback.
   * @return {NodejsStreamOutputAdapter} the nodejs stream.
   */
  toNodejsStream: function(e) {
    if (et.checkSupport("nodestream"), this._outputType !== "nodebuffer")
      throw new Error(this._outputType + " is not supported by this method");
    return new Ha(this, {
      objectMode: this._outputType !== "nodebuffer"
    }, e);
  }
};
var Ga = qa, xe = {};
xe.base64 = !1;
xe.binary = !1;
xe.dir = !1;
xe.createFolders = !0;
xe.date = null;
xe.compression = null;
xe.compressionOptions = null;
xe.comment = null;
xe.unixPermissions = null;
xe.dosPermissions = null;
var Ir = ee(), Br = ye, qs = 16 * 1024;
function Et(e) {
  Br.call(this, "DataWorker");
  var r = this;
  this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, e.then(function(t) {
    r.dataIsReady = !0, r.data = t, r.max = t && t.length || 0, r.type = Ir.getTypeOf(t), r.isPaused || r._tickAndRepeat();
  }, function(t) {
    r.error(t);
  });
}
Ir.inherits(Et, Br);
Et.prototype.cleanUp = function() {
  Br.prototype.cleanUp.call(this), this.data = null;
};
Et.prototype.resume = function() {
  return Br.prototype.resume.call(this) ? (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, Ir.delay(this._tickAndRepeat, [], this)), !0) : !1;
};
Et.prototype._tickAndRepeat = function() {
  this._tickScheduled = !1, !(this.isPaused || this.isFinished) && (this._tick(), this.isFinished || (Ir.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
};
Et.prototype._tick = function() {
  if (this.isPaused || this.isFinished)
    return !1;
  var e = qs, r = null, t = Math.min(this.max, this.index + e);
  if (this.index >= this.max)
    return this.end();
  switch (this.type) {
    case "string":
      r = this.data.substring(this.index, t);
      break;
    case "uint8array":
      r = this.data.subarray(this.index, t);
      break;
    case "array":
    case "nodebuffer":
      r = this.data.slice(this.index, t);
      break;
  }
  return this.index = t, this.push({
    data: r,
    meta: {
      percent: this.max ? this.index / this.max * 100 : 0
    }
  });
};
var Ya = Et, Gs = ee();
function Ys() {
  for (var e, r = [], t = 0; t < 256; t++) {
    e = t;
    for (var i = 0; i < 8; i++)
      e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
    r[t] = e;
  }
  return r;
}
var Ka = Ys();
function Ks(e, r, t, i) {
  var a = Ka, n = i + t;
  e = e ^ -1;
  for (var o = i; o < n; o++)
    e = e >>> 8 ^ a[(e ^ r[o]) & 255];
  return e ^ -1;
}
function Vs(e, r, t, i) {
  var a = Ka, n = i + t;
  e = e ^ -1;
  for (var o = i; o < n; o++)
    e = e >>> 8 ^ a[(e ^ r.charCodeAt(o)) & 255];
  return e ^ -1;
}
var Pi = function(r, t) {
  if (typeof r > "u" || !r.length)
    return 0;
  var i = Gs.getTypeOf(r) !== "string";
  return i ? Ks(t | 0, r, r.length, 0) : Vs(t | 0, r, r.length, 0);
}, Va = ye, Xs = Pi, Js = ee();
function $i() {
  Va.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
}
Js.inherits($i, Va);
$i.prototype.processChunk = function(e) {
  this.streamInfo.crc32 = Xs(e.data, this.streamInfo.crc32 || 0), this.push(e);
};
var Xa = $i, Qs = ee(), Mi = ye;
function ji(e) {
  Mi.call(this, "DataLengthProbe for " + e), this.propName = e, this.withStreamInfo(e, 0);
}
Qs.inherits(ji, Mi);
ji.prototype.processChunk = function(e) {
  if (e) {
    var r = this.streamInfo[this.propName] || 0;
    this.streamInfo[this.propName] = r + e.data.length;
  }
  Mi.prototype.processChunk.call(this, e);
};
var ef = ji, Rn = Vt, On = Ya, tf = Xa, Si = ef;
function Ui(e, r, t, i, a) {
  this.compressedSize = e, this.uncompressedSize = r, this.crc32 = t, this.compression = i, this.compressedContent = a;
}
Ui.prototype = {
  /**
   * Create a worker to get the uncompressed content.
   * @return {GenericWorker} the worker.
   */
  getContentWorker: function() {
    var e = new On(Rn.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new Si("data_length")), r = this;
    return e.on("end", function() {
      if (this.streamInfo.data_length !== r.uncompressedSize)
        throw new Error("Bug : uncompressed data size mismatch");
    }), e;
  },
  /**
   * Create a worker to get the compressed content.
   * @return {GenericWorker} the worker.
   */
  getCompressedWorker: function() {
    return new On(Rn.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
  }
};
Ui.createWorkerFrom = function(e, r, t) {
  return e.pipe(new tf()).pipe(new Si("uncompressedSize")).pipe(r.compressWorker(t)).pipe(new Si("compressedSize")).withStreamInfo("compression", r);
};
var Zi = Ui, rf = Ga, nf = Ya, ni = St, ai = Zi, Dn = ye, Wi = function(e, r, t) {
  this.name = e, this.dir = t.dir, this.date = t.date, this.comment = t.comment, this.unixPermissions = t.unixPermissions, this.dosPermissions = t.dosPermissions, this._data = r, this._dataBinary = t.binary, this.options = {
    compression: t.compression,
    compressionOptions: t.compressionOptions
  };
};
Wi.prototype = {
  /**
   * Create an internal stream for the content of this object.
   * @param {String} type the type of each chunk.
   * @return StreamHelper the stream.
   */
  internalStream: function(e) {
    var r = null, t = "string";
    try {
      if (!e)
        throw new Error("No output type specified.");
      t = e.toLowerCase();
      var i = t === "string" || t === "text";
      (t === "binarystring" || t === "text") && (t = "string"), r = this._decompressWorker();
      var a = !this._dataBinary;
      a && !i && (r = r.pipe(new ni.Utf8EncodeWorker())), !a && i && (r = r.pipe(new ni.Utf8DecodeWorker()));
    } catch (n) {
      r = new Dn("error"), r.error(n);
    }
    return new rf(r, t, "");
  },
  /**
   * Prepare the content in the asked type.
   * @param {String} type the type of the result.
   * @param {Function} onUpdate a function to call on each internal update.
   * @return Promise the promise of the result.
   */
  async: function(e, r) {
    return this.internalStream(e).accumulate(r);
  },
  /**
   * Prepare the content as a nodejs stream.
   * @param {String} type the type of each chunk.
   * @param {Function} onUpdate a function to call on each internal update.
   * @return Stream the stream.
   */
  nodeStream: function(e, r) {
    return this.internalStream(e || "nodebuffer").toNodejsStream(r);
  },
  /**
   * Return a worker for the compressed content.
   * @private
   * @param {Object} compression the compression object to use.
   * @param {Object} compressionOptions the options to use when compressing.
   * @return Worker the worker.
   */
  _compressWorker: function(e, r) {
    if (this._data instanceof ai && this._data.compression.magic === e.magic)
      return this._data.getCompressedWorker();
    var t = this._decompressWorker();
    return this._dataBinary || (t = t.pipe(new ni.Utf8EncodeWorker())), ai.createWorkerFrom(t, e, r);
  },
  /**
   * Return a worker for the decompressed content.
   * @private
   * @return Worker the worker.
   */
  _decompressWorker: function() {
    return this._data instanceof ai ? this._data.getContentWorker() : this._data instanceof Dn ? this._data : new nf(this._data);
  }
};
var In = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], af = function() {
  throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
};
for (var oi = 0; oi < In.length; oi++)
  Wi.prototype[In[oi]] = af;
var of = Wi, Ja = {}, Fr = {}, zr = {}, Pe = {};
(function(e) {
  var r = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
  function t(n, o) {
    return Object.prototype.hasOwnProperty.call(n, o);
  }
  e.assign = function(n) {
    for (var o = Array.prototype.slice.call(arguments, 1); o.length; ) {
      var s = o.shift();
      if (s) {
        if (typeof s != "object")
          throw new TypeError(s + "must be non-object");
        for (var c in s)
          t(s, c) && (n[c] = s[c]);
      }
    }
    return n;
  }, e.shrinkBuf = function(n, o) {
    return n.length === o ? n : n.subarray ? n.subarray(0, o) : (n.length = o, n);
  };
  var i = {
    arraySet: function(n, o, s, c, f) {
      if (o.subarray && n.subarray) {
        n.set(o.subarray(s, s + c), f);
        return;
      }
      for (var l = 0; l < c; l++)
        n[f + l] = o[s + l];
    },
    // Join array of chunks to single array.
    flattenChunks: function(n) {
      var o, s, c, f, l, w;
      for (c = 0, o = 0, s = n.length; o < s; o++)
        c += n[o].length;
      for (w = new Uint8Array(c), f = 0, o = 0, s = n.length; o < s; o++)
        l = n[o], w.set(l, f), f += l.length;
      return w;
    }
  }, a = {
    arraySet: function(n, o, s, c, f) {
      for (var l = 0; l < c; l++)
        n[f + l] = o[s + l];
    },
    // Join array of chunks to single array.
    flattenChunks: function(n) {
      return [].concat.apply([], n);
    }
  };
  e.setTyped = function(n) {
    n ? (e.Buf8 = Uint8Array, e.Buf16 = Uint16Array, e.Buf32 = Int32Array, e.assign(e, i)) : (e.Buf8 = Array, e.Buf16 = Array, e.Buf32 = Array, e.assign(e, a));
  }, e.setTyped(r);
})(Pe);
var Xt = {}, Be = {}, Ct = {}, sf = Pe, ff = 4, Bn = 0, Fn = 1, lf = 2;
function Tt(e) {
  for (var r = e.length; --r >= 0; )
    e[r] = 0;
}
var uf = 0, Qa = 1, hf = 2, df = 3, cf = 258, Hi = 29, Jt = 256, Zt = Jt + 1 + Hi, gt = 30, qi = 19, eo = 2 * Zt + 1, Xe = 15, si = 16, vf = 7, Gi = 256, to = 16, ro = 17, io = 18, Ei = (
  /* extra bits for each length code */
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
), mr = (
  /* extra bits for each distance code */
  [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
), pf = (
  /* extra bits for each bit length code */
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
), no = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], _f = 512, Le = new Array((Zt + 2) * 2);
Tt(Le);
var Nt = new Array(gt * 2);
Tt(Nt);
var Wt = new Array(_f);
Tt(Wt);
var Ht = new Array(cf - df + 1);
Tt(Ht);
var Yi = new Array(Hi);
Tt(Yi);
var Sr = new Array(gt);
Tt(Sr);
function fi(e, r, t, i, a) {
  this.static_tree = e, this.extra_bits = r, this.extra_base = t, this.elems = i, this.max_length = a, this.has_stree = e && e.length;
}
var ao, oo, so;
function li(e, r) {
  this.dyn_tree = e, this.max_code = 0, this.stat_desc = r;
}
function fo(e) {
  return e < 256 ? Wt[e] : Wt[256 + (e >>> 7)];
}
function qt(e, r) {
  e.pending_buf[e.pending++] = r & 255, e.pending_buf[e.pending++] = r >>> 8 & 255;
}
function ve(e, r, t) {
  e.bi_valid > si - t ? (e.bi_buf |= r << e.bi_valid & 65535, qt(e, e.bi_buf), e.bi_buf = r >> si - e.bi_valid, e.bi_valid += t - si) : (e.bi_buf |= r << e.bi_valid & 65535, e.bi_valid += t);
}
function De(e, r, t) {
  ve(
    e,
    t[r * 2],
    t[r * 2 + 1]
    /*.Len*/
  );
}
function lo(e, r) {
  var t = 0;
  do
    t |= e & 1, e >>>= 1, t <<= 1;
  while (--r > 0);
  return t >>> 1;
}
function gf(e) {
  e.bi_valid === 16 ? (qt(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = e.bi_buf & 255, e.bi_buf >>= 8, e.bi_valid -= 8);
}
function mf(e, r) {
  var t = r.dyn_tree, i = r.max_code, a = r.stat_desc.static_tree, n = r.stat_desc.has_stree, o = r.stat_desc.extra_bits, s = r.stat_desc.extra_base, c = r.stat_desc.max_length, f, l, w, h, d, g, m = 0;
  for (h = 0; h <= Xe; h++)
    e.bl_count[h] = 0;
  for (t[e.heap[e.heap_max] * 2 + 1] = 0, f = e.heap_max + 1; f < eo; f++)
    l = e.heap[f], h = t[t[l * 2 + 1] * 2 + 1] + 1, h > c && (h = c, m++), t[l * 2 + 1] = h, !(l > i) && (e.bl_count[h]++, d = 0, l >= s && (d = o[l - s]), g = t[l * 2], e.opt_len += g * (h + d), n && (e.static_len += g * (a[l * 2 + 1] + d)));
  if (m !== 0) {
    do {
      for (h = c - 1; e.bl_count[h] === 0; )
        h--;
      e.bl_count[h]--, e.bl_count[h + 1] += 2, e.bl_count[c]--, m -= 2;
    } while (m > 0);
    for (h = c; h !== 0; h--)
      for (l = e.bl_count[h]; l !== 0; )
        w = e.heap[--f], !(w > i) && (t[w * 2 + 1] !== h && (e.opt_len += (h - t[w * 2 + 1]) * t[w * 2], t[w * 2 + 1] = h), l--);
  }
}
function uo(e, r, t) {
  var i = new Array(Xe + 1), a = 0, n, o;
  for (n = 1; n <= Xe; n++)
    i[n] = a = a + t[n - 1] << 1;
  for (o = 0; o <= r; o++) {
    var s = e[o * 2 + 1];
    s !== 0 && (e[o * 2] = lo(i[s]++, s));
  }
}
function wf() {
  var e, r, t, i, a, n = new Array(Xe + 1);
  for (t = 0, i = 0; i < Hi - 1; i++)
    for (Yi[i] = t, e = 0; e < 1 << Ei[i]; e++)
      Ht[t++] = i;
  for (Ht[t - 1] = i, a = 0, i = 0; i < 16; i++)
    for (Sr[i] = a, e = 0; e < 1 << mr[i]; e++)
      Wt[a++] = i;
  for (a >>= 7; i < gt; i++)
    for (Sr[i] = a << 7, e = 0; e < 1 << mr[i] - 7; e++)
      Wt[256 + a++] = i;
  for (r = 0; r <= Xe; r++)
    n[r] = 0;
  for (e = 0; e <= 143; )
    Le[e * 2 + 1] = 8, e++, n[8]++;
  for (; e <= 255; )
    Le[e * 2 + 1] = 9, e++, n[9]++;
  for (; e <= 279; )
    Le[e * 2 + 1] = 7, e++, n[7]++;
  for (; e <= 287; )
    Le[e * 2 + 1] = 8, e++, n[8]++;
  for (uo(Le, Zt + 1, n), e = 0; e < gt; e++)
    Nt[e * 2 + 1] = 5, Nt[e * 2] = lo(e, 5);
  ao = new fi(Le, Ei, Jt + 1, Zt, Xe), oo = new fi(Nt, mr, 0, gt, Xe), so = new fi(new Array(0), pf, 0, qi, vf);
}
function ho(e) {
  var r;
  for (r = 0; r < Zt; r++)
    e.dyn_ltree[r * 2] = 0;
  for (r = 0; r < gt; r++)
    e.dyn_dtree[r * 2] = 0;
  for (r = 0; r < qi; r++)
    e.bl_tree[r * 2] = 0;
  e.dyn_ltree[Gi * 2] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;
}
function co(e) {
  e.bi_valid > 8 ? qt(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
}
function bf(e, r, t, i) {
  co(e), qt(e, t), qt(e, ~t), sf.arraySet(e.pending_buf, e.window, r, t, e.pending), e.pending += t;
}
function zn(e, r, t, i) {
  var a = r * 2, n = t * 2;
  return e[a] < e[n] || e[a] === e[n] && i[r] <= i[t];
}
function ui(e, r, t) {
  for (var i = e.heap[t], a = t << 1; a <= e.heap_len && (a < e.heap_len && zn(r, e.heap[a + 1], e.heap[a], e.depth) && a++, !zn(r, i, e.heap[a], e.depth)); )
    e.heap[t] = e.heap[a], t = a, a <<= 1;
  e.heap[t] = i;
}
function Nn(e, r, t) {
  var i, a, n = 0, o, s;
  if (e.last_lit !== 0)
    do
      i = e.pending_buf[e.d_buf + n * 2] << 8 | e.pending_buf[e.d_buf + n * 2 + 1], a = e.pending_buf[e.l_buf + n], n++, i === 0 ? De(e, a, r) : (o = Ht[a], De(e, o + Jt + 1, r), s = Ei[o], s !== 0 && (a -= Yi[o], ve(e, a, s)), i--, o = fo(i), De(e, o, t), s = mr[o], s !== 0 && (i -= Sr[o], ve(e, i, s)));
    while (n < e.last_lit);
  De(e, Gi, r);
}
function Ci(e, r) {
  var t = r.dyn_tree, i = r.stat_desc.static_tree, a = r.stat_desc.has_stree, n = r.stat_desc.elems, o, s, c = -1, f;
  for (e.heap_len = 0, e.heap_max = eo, o = 0; o < n; o++)
    t[o * 2] !== 0 ? (e.heap[++e.heap_len] = c = o, e.depth[o] = 0) : t[o * 2 + 1] = 0;
  for (; e.heap_len < 2; )
    f = e.heap[++e.heap_len] = c < 2 ? ++c : 0, t[f * 2] = 1, e.depth[f] = 0, e.opt_len--, a && (e.static_len -= i[f * 2 + 1]);
  for (r.max_code = c, o = e.heap_len >> 1; o >= 1; o--)
    ui(e, t, o);
  f = n;
  do
    o = e.heap[
      1
      /*SMALLEST*/
    ], e.heap[
      1
      /*SMALLEST*/
    ] = e.heap[e.heap_len--], ui(
      e,
      t,
      1
      /*SMALLEST*/
    ), s = e.heap[
      1
      /*SMALLEST*/
    ], e.heap[--e.heap_max] = o, e.heap[--e.heap_max] = s, t[f * 2] = t[o * 2] + t[s * 2], e.depth[f] = (e.depth[o] >= e.depth[s] ? e.depth[o] : e.depth[s]) + 1, t[o * 2 + 1] = t[s * 2 + 1] = f, e.heap[
      1
      /*SMALLEST*/
    ] = f++, ui(
      e,
      t,
      1
      /*SMALLEST*/
    );
  while (e.heap_len >= 2);
  e.heap[--e.heap_max] = e.heap[
    1
    /*SMALLEST*/
  ], mf(e, r), uo(t, c, e.bl_count);
}
function Ln(e, r, t) {
  var i, a = -1, n, o = r[0 * 2 + 1], s = 0, c = 7, f = 4;
  for (o === 0 && (c = 138, f = 3), r[(t + 1) * 2 + 1] = 65535, i = 0; i <= t; i++)
    n = o, o = r[(i + 1) * 2 + 1], !(++s < c && n === o) && (s < f ? e.bl_tree[n * 2] += s : n !== 0 ? (n !== a && e.bl_tree[n * 2]++, e.bl_tree[to * 2]++) : s <= 10 ? e.bl_tree[ro * 2]++ : e.bl_tree[io * 2]++, s = 0, a = n, o === 0 ? (c = 138, f = 3) : n === o ? (c = 6, f = 3) : (c = 7, f = 4));
}
function Pn(e, r, t) {
  var i, a = -1, n, o = r[0 * 2 + 1], s = 0, c = 7, f = 4;
  for (o === 0 && (c = 138, f = 3), i = 0; i <= t; i++)
    if (n = o, o = r[(i + 1) * 2 + 1], !(++s < c && n === o)) {
      if (s < f)
        do
          De(e, n, e.bl_tree);
        while (--s !== 0);
      else n !== 0 ? (n !== a && (De(e, n, e.bl_tree), s--), De(e, to, e.bl_tree), ve(e, s - 3, 2)) : s <= 10 ? (De(e, ro, e.bl_tree), ve(e, s - 3, 3)) : (De(e, io, e.bl_tree), ve(e, s - 11, 7));
      s = 0, a = n, o === 0 ? (c = 138, f = 3) : n === o ? (c = 6, f = 3) : (c = 7, f = 4);
    }
}
function yf(e) {
  var r;
  for (Ln(e, e.dyn_ltree, e.l_desc.max_code), Ln(e, e.dyn_dtree, e.d_desc.max_code), Ci(e, e.bl_desc), r = qi - 1; r >= 3 && e.bl_tree[no[r] * 2 + 1] === 0; r--)
    ;
  return e.opt_len += 3 * (r + 1) + 5 + 5 + 4, r;
}
function xf(e, r, t, i) {
  var a;
  for (ve(e, r - 257, 5), ve(e, t - 1, 5), ve(e, i - 4, 4), a = 0; a < i; a++)
    ve(e, e.bl_tree[no[a] * 2 + 1], 3);
  Pn(e, e.dyn_ltree, r - 1), Pn(e, e.dyn_dtree, t - 1);
}
function kf(e) {
  var r = 4093624447, t;
  for (t = 0; t <= 31; t++, r >>>= 1)
    if (r & 1 && e.dyn_ltree[t * 2] !== 0)
      return Bn;
  if (e.dyn_ltree[9 * 2] !== 0 || e.dyn_ltree[10 * 2] !== 0 || e.dyn_ltree[13 * 2] !== 0)
    return Fn;
  for (t = 32; t < Jt; t++)
    if (e.dyn_ltree[t * 2] !== 0)
      return Fn;
  return Bn;
}
var $n = !1;
function Sf(e) {
  $n || (wf(), $n = !0), e.l_desc = new li(e.dyn_ltree, ao), e.d_desc = new li(e.dyn_dtree, oo), e.bl_desc = new li(e.bl_tree, so), e.bi_buf = 0, e.bi_valid = 0, ho(e);
}
function vo(e, r, t, i) {
  ve(e, (uf << 1) + (i ? 1 : 0), 3), bf(e, r, t);
}
function Ef(e) {
  ve(e, Qa << 1, 3), De(e, Gi, Le), gf(e);
}
function Cf(e, r, t, i) {
  var a, n, o = 0;
  e.level > 0 ? (e.strm.data_type === lf && (e.strm.data_type = kf(e)), Ci(e, e.l_desc), Ci(e, e.d_desc), o = yf(e), a = e.opt_len + 3 + 7 >>> 3, n = e.static_len + 3 + 7 >>> 3, n <= a && (a = n)) : a = n = t + 5, t + 4 <= a && r !== -1 ? vo(e, r, t, i) : e.strategy === ff || n === a ? (ve(e, (Qa << 1) + (i ? 1 : 0), 3), Nn(e, Le, Nt)) : (ve(e, (hf << 1) + (i ? 1 : 0), 3), xf(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, o + 1), Nn(e, e.dyn_ltree, e.dyn_dtree)), ho(e), i && co(e);
}
function Tf(e, r, t) {
  return e.pending_buf[e.d_buf + e.last_lit * 2] = r >>> 8 & 255, e.pending_buf[e.d_buf + e.last_lit * 2 + 1] = r & 255, e.pending_buf[e.l_buf + e.last_lit] = t & 255, e.last_lit++, r === 0 ? e.dyn_ltree[t * 2]++ : (e.matches++, r--, e.dyn_ltree[(Ht[t] + Jt + 1) * 2]++, e.dyn_dtree[fo(r) * 2]++), e.last_lit === e.lit_bufsize - 1;
}
Ct._tr_init = Sf;
Ct._tr_stored_block = vo;
Ct._tr_flush_block = Cf;
Ct._tr_tally = Tf;
Ct._tr_align = Ef;
function Af(e, r, t, i) {
  for (var a = e & 65535 | 0, n = e >>> 16 & 65535 | 0, o = 0; t !== 0; ) {
    o = t > 2e3 ? 2e3 : t, t -= o;
    do
      a = a + r[i++] | 0, n = n + a | 0;
    while (--o);
    a %= 65521, n %= 65521;
  }
  return a | n << 16 | 0;
}
var po = Af;
function Rf() {
  for (var e, r = [], t = 0; t < 256; t++) {
    e = t;
    for (var i = 0; i < 8; i++)
      e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
    r[t] = e;
  }
  return r;
}
var Of = Rf();
function Df(e, r, t, i) {
  var a = Of, n = i + t;
  e ^= -1;
  for (var o = i; o < n; o++)
    e = e >>> 8 ^ a[(e ^ r[o]) & 255];
  return e ^ -1;
}
var _o = Df, Ki = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, de = Pe, ge = Ct, go = po, Ue = _o, If = Ki, ot = 0, Bf = 1, Ff = 3, Ge = 4, Mn = 5, Ie = 0, jn = 1, me = -2, zf = -3, hi = -5, Nf = -1, Lf = 1, ur = 2, Pf = 3, $f = 4, Mf = 0, jf = 2, Nr = 8, Uf = 9, Zf = 15, Wf = 8, Hf = 29, qf = 256, Ti = qf + 1 + Hf, Gf = 30, Yf = 19, Kf = 2 * Ti + 1, Vf = 15, H = 3, He = 258, Se = He + H + 1, Xf = 32, Lr = 42, Ai = 69, wr = 73, br = 91, yr = 103, Je = 113, zt = 666, oe = 1, Qt = 2, tt = 3, At = 4, Jf = 3;
function qe(e, r) {
  return e.msg = If[r], r;
}
function Un(e) {
  return (e << 1) - (e > 4 ? 9 : 0);
}
function We(e) {
  for (var r = e.length; --r >= 0; )
    e[r] = 0;
}
function Ze(e) {
  var r = e.state, t = r.pending;
  t > e.avail_out && (t = e.avail_out), t !== 0 && (de.arraySet(e.output, r.pending_buf, r.pending_out, t, e.next_out), e.next_out += t, r.pending_out += t, e.total_out += t, e.avail_out -= t, r.pending -= t, r.pending === 0 && (r.pending_out = 0));
}
function ue(e, r) {
  ge._tr_flush_block(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, r), e.block_start = e.strstart, Ze(e.strm);
}
function q(e, r) {
  e.pending_buf[e.pending++] = r;
}
function Ft(e, r) {
  e.pending_buf[e.pending++] = r >>> 8 & 255, e.pending_buf[e.pending++] = r & 255;
}
function Qf(e, r, t, i) {
  var a = e.avail_in;
  return a > i && (a = i), a === 0 ? 0 : (e.avail_in -= a, de.arraySet(r, e.input, e.next_in, a, t), e.state.wrap === 1 ? e.adler = go(e.adler, r, a, t) : e.state.wrap === 2 && (e.adler = Ue(e.adler, r, a, t)), e.next_in += a, e.total_in += a, a);
}
function mo(e, r) {
  var t = e.max_chain_length, i = e.strstart, a, n, o = e.prev_length, s = e.nice_match, c = e.strstart > e.w_size - Se ? e.strstart - (e.w_size - Se) : 0, f = e.window, l = e.w_mask, w = e.prev, h = e.strstart + He, d = f[i + o - 1], g = f[i + o];
  e.prev_length >= e.good_match && (t >>= 2), s > e.lookahead && (s = e.lookahead);
  do
    if (a = r, !(f[a + o] !== g || f[a + o - 1] !== d || f[a] !== f[i] || f[++a] !== f[i + 1])) {
      i += 2, a++;
      do
        ;
      while (f[++i] === f[++a] && f[++i] === f[++a] && f[++i] === f[++a] && f[++i] === f[++a] && f[++i] === f[++a] && f[++i] === f[++a] && f[++i] === f[++a] && f[++i] === f[++a] && i < h);
      if (n = He - (h - i), i = h - He, n > o) {
        if (e.match_start = r, o = n, n >= s)
          break;
        d = f[i + o - 1], g = f[i + o];
      }
    }
  while ((r = w[r & l]) > c && --t !== 0);
  return o <= e.lookahead ? o : e.lookahead;
}
function rt(e) {
  var r = e.w_size, t, i, a, n, o;
  do {
    if (n = e.window_size - e.lookahead - e.strstart, e.strstart >= r + (r - Se)) {
      de.arraySet(e.window, e.window, r, r, 0), e.match_start -= r, e.strstart -= r, e.block_start -= r, i = e.hash_size, t = i;
      do
        a = e.head[--t], e.head[t] = a >= r ? a - r : 0;
      while (--i);
      i = r, t = i;
      do
        a = e.prev[--t], e.prev[t] = a >= r ? a - r : 0;
      while (--i);
      n += r;
    }
    if (e.strm.avail_in === 0)
      break;
    if (i = Qf(e.strm, e.window, e.strstart + e.lookahead, n), e.lookahead += i, e.lookahead + e.insert >= H)
      for (o = e.strstart - e.insert, e.ins_h = e.window[o], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[o + H - 1]) & e.hash_mask, e.prev[o & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = o, o++, e.insert--, !(e.lookahead + e.insert < H)); )
        ;
  } while (e.lookahead < Se && e.strm.avail_in !== 0);
}
function el(e, r) {
  var t = 65535;
  for (t > e.pending_buf_size - 5 && (t = e.pending_buf_size - 5); ; ) {
    if (e.lookahead <= 1) {
      if (rt(e), e.lookahead === 0 && r === ot)
        return oe;
      if (e.lookahead === 0)
        break;
    }
    e.strstart += e.lookahead, e.lookahead = 0;
    var i = e.block_start + t;
    if ((e.strstart === 0 || e.strstart >= i) && (e.lookahead = e.strstart - i, e.strstart = i, ue(e, !1), e.strm.avail_out === 0) || e.strstart - e.block_start >= e.w_size - Se && (ue(e, !1), e.strm.avail_out === 0))
      return oe;
  }
  return e.insert = 0, r === Ge ? (ue(e, !0), e.strm.avail_out === 0 ? tt : At) : (e.strstart > e.block_start && (ue(e, !1), e.strm.avail_out === 0), oe);
}
function di(e, r) {
  for (var t, i; ; ) {
    if (e.lookahead < Se) {
      if (rt(e), e.lookahead < Se && r === ot)
        return oe;
      if (e.lookahead === 0)
        break;
    }
    if (t = 0, e.lookahead >= H && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + H - 1]) & e.hash_mask, t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), t !== 0 && e.strstart - t <= e.w_size - Se && (e.match_length = mo(e, t)), e.match_length >= H)
      if (i = ge._tr_tally(e, e.strstart - e.match_start, e.match_length - H), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= H) {
        e.match_length--;
        do
          e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + H - 1]) & e.hash_mask, t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;
        while (--e.match_length !== 0);
        e.strstart++;
      } else
        e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
    else
      i = ge._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
    if (i && (ue(e, !1), e.strm.avail_out === 0))
      return oe;
  }
  return e.insert = e.strstart < H - 1 ? e.strstart : H - 1, r === Ge ? (ue(e, !0), e.strm.avail_out === 0 ? tt : At) : e.last_lit && (ue(e, !1), e.strm.avail_out === 0) ? oe : Qt;
}
function dt(e, r) {
  for (var t, i, a; ; ) {
    if (e.lookahead < Se) {
      if (rt(e), e.lookahead < Se && r === ot)
        return oe;
      if (e.lookahead === 0)
        break;
    }
    if (t = 0, e.lookahead >= H && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + H - 1]) & e.hash_mask, t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = H - 1, t !== 0 && e.prev_length < e.max_lazy_match && e.strstart - t <= e.w_size - Se && (e.match_length = mo(e, t), e.match_length <= 5 && (e.strategy === Lf || e.match_length === H && e.strstart - e.match_start > 4096) && (e.match_length = H - 1)), e.prev_length >= H && e.match_length <= e.prev_length) {
      a = e.strstart + e.lookahead - H, i = ge._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - H), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
      do
        ++e.strstart <= a && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + H - 1]) & e.hash_mask, t = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);
      while (--e.prev_length !== 0);
      if (e.match_available = 0, e.match_length = H - 1, e.strstart++, i && (ue(e, !1), e.strm.avail_out === 0))
        return oe;
    } else if (e.match_available) {
      if (i = ge._tr_tally(e, 0, e.window[e.strstart - 1]), i && ue(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0)
        return oe;
    } else
      e.match_available = 1, e.strstart++, e.lookahead--;
  }
  return e.match_available && (i = ge._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < H - 1 ? e.strstart : H - 1, r === Ge ? (ue(e, !0), e.strm.avail_out === 0 ? tt : At) : e.last_lit && (ue(e, !1), e.strm.avail_out === 0) ? oe : Qt;
}
function tl(e, r) {
  for (var t, i, a, n, o = e.window; ; ) {
    if (e.lookahead <= He) {
      if (rt(e), e.lookahead <= He && r === ot)
        return oe;
      if (e.lookahead === 0)
        break;
    }
    if (e.match_length = 0, e.lookahead >= H && e.strstart > 0 && (a = e.strstart - 1, i = o[a], i === o[++a] && i === o[++a] && i === o[++a])) {
      n = e.strstart + He;
      do
        ;
      while (i === o[++a] && i === o[++a] && i === o[++a] && i === o[++a] && i === o[++a] && i === o[++a] && i === o[++a] && i === o[++a] && a < n);
      e.match_length = He - (n - a), e.match_length > e.lookahead && (e.match_length = e.lookahead);
    }
    if (e.match_length >= H ? (t = ge._tr_tally(e, 1, e.match_length - H), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (t = ge._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), t && (ue(e, !1), e.strm.avail_out === 0))
      return oe;
  }
  return e.insert = 0, r === Ge ? (ue(e, !0), e.strm.avail_out === 0 ? tt : At) : e.last_lit && (ue(e, !1), e.strm.avail_out === 0) ? oe : Qt;
}
function rl(e, r) {
  for (var t; ; ) {
    if (e.lookahead === 0 && (rt(e), e.lookahead === 0)) {
      if (r === ot)
        return oe;
      break;
    }
    if (e.match_length = 0, t = ge._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, t && (ue(e, !1), e.strm.avail_out === 0))
      return oe;
  }
  return e.insert = 0, r === Ge ? (ue(e, !0), e.strm.avail_out === 0 ? tt : At) : e.last_lit && (ue(e, !1), e.strm.avail_out === 0) ? oe : Qt;
}
function Re(e, r, t, i, a) {
  this.good_length = e, this.max_lazy = r, this.nice_length = t, this.max_chain = i, this.func = a;
}
var pt;
pt = [
  /*      good lazy nice chain */
  new Re(0, 0, 0, 0, el),
  /* 0 store only */
  new Re(4, 4, 8, 4, di),
  /* 1 max speed, no lazy matches */
  new Re(4, 5, 16, 8, di),
  /* 2 */
  new Re(4, 6, 32, 32, di),
  /* 3 */
  new Re(4, 4, 16, 16, dt),
  /* 4 lazy matches */
  new Re(8, 16, 32, 32, dt),
  /* 5 */
  new Re(8, 16, 128, 128, dt),
  /* 6 */
  new Re(8, 32, 128, 256, dt),
  /* 7 */
  new Re(32, 128, 258, 1024, dt),
  /* 8 */
  new Re(32, 258, 258, 4096, dt)
  /* 9 max compression */
];
function il(e) {
  e.window_size = 2 * e.w_size, We(e.head), e.max_lazy_match = pt[e.level].max_lazy, e.good_match = pt[e.level].good_length, e.nice_match = pt[e.level].nice_length, e.max_chain_length = pt[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = H - 1, e.match_available = 0, e.ins_h = 0;
}
function nl() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Nr, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new de.Buf16(Kf * 2), this.dyn_dtree = new de.Buf16((2 * Gf + 1) * 2), this.bl_tree = new de.Buf16((2 * Yf + 1) * 2), We(this.dyn_ltree), We(this.dyn_dtree), We(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new de.Buf16(Vf + 1), this.heap = new de.Buf16(2 * Ti + 1), We(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new de.Buf16(2 * Ti + 1), We(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
function wo(e) {
  var r;
  return !e || !e.state ? qe(e, me) : (e.total_in = e.total_out = 0, e.data_type = jf, r = e.state, r.pending = 0, r.pending_out = 0, r.wrap < 0 && (r.wrap = -r.wrap), r.status = r.wrap ? Lr : Je, e.adler = r.wrap === 2 ? 0 : 1, r.last_flush = ot, ge._tr_init(r), Ie);
}
function bo(e) {
  var r = wo(e);
  return r === Ie && il(e.state), r;
}
function al(e, r) {
  return !e || !e.state || e.state.wrap !== 2 ? me : (e.state.gzhead = r, Ie);
}
function yo(e, r, t, i, a, n) {
  if (!e)
    return me;
  var o = 1;
  if (r === Nf && (r = 6), i < 0 ? (o = 0, i = -i) : i > 15 && (o = 2, i -= 16), a < 1 || a > Uf || t !== Nr || i < 8 || i > 15 || r < 0 || r > 9 || n < 0 || n > $f)
    return qe(e, me);
  i === 8 && (i = 9);
  var s = new nl();
  return e.state = s, s.strm = e, s.wrap = o, s.gzhead = null, s.w_bits = i, s.w_size = 1 << s.w_bits, s.w_mask = s.w_size - 1, s.hash_bits = a + 7, s.hash_size = 1 << s.hash_bits, s.hash_mask = s.hash_size - 1, s.hash_shift = ~~((s.hash_bits + H - 1) / H), s.window = new de.Buf8(s.w_size * 2), s.head = new de.Buf16(s.hash_size), s.prev = new de.Buf16(s.w_size), s.lit_bufsize = 1 << a + 6, s.pending_buf_size = s.lit_bufsize * 4, s.pending_buf = new de.Buf8(s.pending_buf_size), s.d_buf = 1 * s.lit_bufsize, s.l_buf = 3 * s.lit_bufsize, s.level = r, s.strategy = n, s.method = t, bo(e);
}
function ol(e, r) {
  return yo(e, r, Nr, Zf, Wf, Mf);
}
function sl(e, r) {
  var t, i, a, n;
  if (!e || !e.state || r > Mn || r < 0)
    return e ? qe(e, me) : me;
  if (i = e.state, !e.output || !e.input && e.avail_in !== 0 || i.status === zt && r !== Ge)
    return qe(e, e.avail_out === 0 ? hi : me);
  if (i.strm = e, t = i.last_flush, i.last_flush = r, i.status === Lr)
    if (i.wrap === 2)
      e.adler = 0, q(i, 31), q(i, 139), q(i, 8), i.gzhead ? (q(
        i,
        (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)
      ), q(i, i.gzhead.time & 255), q(i, i.gzhead.time >> 8 & 255), q(i, i.gzhead.time >> 16 & 255), q(i, i.gzhead.time >> 24 & 255), q(i, i.level === 9 ? 2 : i.strategy >= ur || i.level < 2 ? 4 : 0), q(i, i.gzhead.os & 255), i.gzhead.extra && i.gzhead.extra.length && (q(i, i.gzhead.extra.length & 255), q(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (e.adler = Ue(e.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = Ai) : (q(i, 0), q(i, 0), q(i, 0), q(i, 0), q(i, 0), q(i, i.level === 9 ? 2 : i.strategy >= ur || i.level < 2 ? 4 : 0), q(i, Jf), i.status = Je);
    else {
      var o = Nr + (i.w_bits - 8 << 4) << 8, s = -1;
      i.strategy >= ur || i.level < 2 ? s = 0 : i.level < 6 ? s = 1 : i.level === 6 ? s = 2 : s = 3, o |= s << 6, i.strstart !== 0 && (o |= Xf), o += 31 - o % 31, i.status = Je, Ft(i, o), i.strstart !== 0 && (Ft(i, e.adler >>> 16), Ft(i, e.adler & 65535)), e.adler = 1;
    }
  if (i.status === Ai)
    if (i.gzhead.extra) {
      for (a = i.pending; i.gzindex < (i.gzhead.extra.length & 65535) && !(i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > a && (e.adler = Ue(e.adler, i.pending_buf, i.pending - a, a)), Ze(e), a = i.pending, i.pending === i.pending_buf_size)); )
        q(i, i.gzhead.extra[i.gzindex] & 255), i.gzindex++;
      i.gzhead.hcrc && i.pending > a && (e.adler = Ue(e.adler, i.pending_buf, i.pending - a, a)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = wr);
    } else
      i.status = wr;
  if (i.status === wr)
    if (i.gzhead.name) {
      a = i.pending;
      do {
        if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > a && (e.adler = Ue(e.adler, i.pending_buf, i.pending - a, a)), Ze(e), a = i.pending, i.pending === i.pending_buf_size)) {
          n = 1;
          break;
        }
        i.gzindex < i.gzhead.name.length ? n = i.gzhead.name.charCodeAt(i.gzindex++) & 255 : n = 0, q(i, n);
      } while (n !== 0);
      i.gzhead.hcrc && i.pending > a && (e.adler = Ue(e.adler, i.pending_buf, i.pending - a, a)), n === 0 && (i.gzindex = 0, i.status = br);
    } else
      i.status = br;
  if (i.status === br)
    if (i.gzhead.comment) {
      a = i.pending;
      do {
        if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > a && (e.adler = Ue(e.adler, i.pending_buf, i.pending - a, a)), Ze(e), a = i.pending, i.pending === i.pending_buf_size)) {
          n = 1;
          break;
        }
        i.gzindex < i.gzhead.comment.length ? n = i.gzhead.comment.charCodeAt(i.gzindex++) & 255 : n = 0, q(i, n);
      } while (n !== 0);
      i.gzhead.hcrc && i.pending > a && (e.adler = Ue(e.adler, i.pending_buf, i.pending - a, a)), n === 0 && (i.status = yr);
    } else
      i.status = yr;
  if (i.status === yr && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && Ze(e), i.pending + 2 <= i.pending_buf_size && (q(i, e.adler & 255), q(i, e.adler >> 8 & 255), e.adler = 0, i.status = Je)) : i.status = Je), i.pending !== 0) {
    if (Ze(e), e.avail_out === 0)
      return i.last_flush = -1, Ie;
  } else if (e.avail_in === 0 && Un(r) <= Un(t) && r !== Ge)
    return qe(e, hi);
  if (i.status === zt && e.avail_in !== 0)
    return qe(e, hi);
  if (e.avail_in !== 0 || i.lookahead !== 0 || r !== ot && i.status !== zt) {
    var c = i.strategy === ur ? rl(i, r) : i.strategy === Pf ? tl(i, r) : pt[i.level].func(i, r);
    if ((c === tt || c === At) && (i.status = zt), c === oe || c === tt)
      return e.avail_out === 0 && (i.last_flush = -1), Ie;
    if (c === Qt && (r === Bf ? ge._tr_align(i) : r !== Mn && (ge._tr_stored_block(i, 0, 0, !1), r === Ff && (We(i.head), i.lookahead === 0 && (i.strstart = 0, i.block_start = 0, i.insert = 0))), Ze(e), e.avail_out === 0))
      return i.last_flush = -1, Ie;
  }
  return r !== Ge ? Ie : i.wrap <= 0 ? jn : (i.wrap === 2 ? (q(i, e.adler & 255), q(i, e.adler >> 8 & 255), q(i, e.adler >> 16 & 255), q(i, e.adler >> 24 & 255), q(i, e.total_in & 255), q(i, e.total_in >> 8 & 255), q(i, e.total_in >> 16 & 255), q(i, e.total_in >> 24 & 255)) : (Ft(i, e.adler >>> 16), Ft(i, e.adler & 65535)), Ze(e), i.wrap > 0 && (i.wrap = -i.wrap), i.pending !== 0 ? Ie : jn);
}
function fl(e) {
  var r;
  return !e || !e.state ? me : (r = e.state.status, r !== Lr && r !== Ai && r !== wr && r !== br && r !== yr && r !== Je && r !== zt ? qe(e, me) : (e.state = null, r === Je ? qe(e, zf) : Ie));
}
function ll(e, r) {
  var t = r.length, i, a, n, o, s, c, f, l;
  if (!e || !e.state || (i = e.state, o = i.wrap, o === 2 || o === 1 && i.status !== Lr || i.lookahead))
    return me;
  for (o === 1 && (e.adler = go(e.adler, r, t, 0)), i.wrap = 0, t >= i.w_size && (o === 0 && (We(i.head), i.strstart = 0, i.block_start = 0, i.insert = 0), l = new de.Buf8(i.w_size), de.arraySet(l, r, t - i.w_size, i.w_size, 0), r = l, t = i.w_size), s = e.avail_in, c = e.next_in, f = e.input, e.avail_in = t, e.next_in = 0, e.input = r, rt(i); i.lookahead >= H; ) {
    a = i.strstart, n = i.lookahead - (H - 1);
    do
      i.ins_h = (i.ins_h << i.hash_shift ^ i.window[a + H - 1]) & i.hash_mask, i.prev[a & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = a, a++;
    while (--n);
    i.strstart = a, i.lookahead = H - 1, rt(i);
  }
  return i.strstart += i.lookahead, i.block_start = i.strstart, i.insert = i.lookahead, i.lookahead = 0, i.match_length = i.prev_length = H - 1, i.match_available = 0, e.next_in = c, e.input = f, e.avail_in = s, i.wrap = o, Ie;
}
Be.deflateInit = ol;
Be.deflateInit2 = yo;
Be.deflateReset = bo;
Be.deflateResetKeep = wo;
Be.deflateSetHeader = al;
Be.deflate = sl;
Be.deflateEnd = fl;
Be.deflateSetDictionary = ll;
Be.deflateInfo = "pako deflate (from Nodeca project)";
var st = {}, Pr = Pe, xo = !0, ko = !0;
try {
  String.fromCharCode.apply(null, [0]);
} catch {
  xo = !1;
}
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  ko = !1;
}
var Gt = new Pr.Buf8(256);
for (var Me = 0; Me < 256; Me++)
  Gt[Me] = Me >= 252 ? 6 : Me >= 248 ? 5 : Me >= 240 ? 4 : Me >= 224 ? 3 : Me >= 192 ? 2 : 1;
Gt[254] = Gt[254] = 1;
st.string2buf = function(e) {
  var r, t, i, a, n, o = e.length, s = 0;
  for (a = 0; a < o; a++)
    t = e.charCodeAt(a), (t & 64512) === 55296 && a + 1 < o && (i = e.charCodeAt(a + 1), (i & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (i - 56320), a++)), s += t < 128 ? 1 : t < 2048 ? 2 : t < 65536 ? 3 : 4;
  for (r = new Pr.Buf8(s), n = 0, a = 0; n < s; a++)
    t = e.charCodeAt(a), (t & 64512) === 55296 && a + 1 < o && (i = e.charCodeAt(a + 1), (i & 64512) === 56320 && (t = 65536 + (t - 55296 << 10) + (i - 56320), a++)), t < 128 ? r[n++] = t : t < 2048 ? (r[n++] = 192 | t >>> 6, r[n++] = 128 | t & 63) : t < 65536 ? (r[n++] = 224 | t >>> 12, r[n++] = 128 | t >>> 6 & 63, r[n++] = 128 | t & 63) : (r[n++] = 240 | t >>> 18, r[n++] = 128 | t >>> 12 & 63, r[n++] = 128 | t >>> 6 & 63, r[n++] = 128 | t & 63);
  return r;
};
function So(e, r) {
  if (r < 65534 && (e.subarray && ko || !e.subarray && xo))
    return String.fromCharCode.apply(null, Pr.shrinkBuf(e, r));
  for (var t = "", i = 0; i < r; i++)
    t += String.fromCharCode(e[i]);
  return t;
}
st.buf2binstring = function(e) {
  return So(e, e.length);
};
st.binstring2buf = function(e) {
  for (var r = new Pr.Buf8(e.length), t = 0, i = r.length; t < i; t++)
    r[t] = e.charCodeAt(t);
  return r;
};
st.buf2string = function(e, r) {
  var t, i, a, n, o = r || e.length, s = new Array(o * 2);
  for (i = 0, t = 0; t < o; ) {
    if (a = e[t++], a < 128) {
      s[i++] = a;
      continue;
    }
    if (n = Gt[a], n > 4) {
      s[i++] = 65533, t += n - 1;
      continue;
    }
    for (a &= n === 2 ? 31 : n === 3 ? 15 : 7; n > 1 && t < o; )
      a = a << 6 | e[t++] & 63, n--;
    if (n > 1) {
      s[i++] = 65533;
      continue;
    }
    a < 65536 ? s[i++] = a : (a -= 65536, s[i++] = 55296 | a >> 10 & 1023, s[i++] = 56320 | a & 1023);
  }
  return So(s, i);
};
st.utf8border = function(e, r) {
  var t;
  for (r = r || e.length, r > e.length && (r = e.length), t = r - 1; t >= 0 && (e[t] & 192) === 128; )
    t--;
  return t < 0 || t === 0 ? r : t + Gt[e[t]] > r ? t : r;
};
function ul() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var Eo = ul, Lt = Be, Pt = Pe, Ri = st, Oi = Ki, hl = Eo, Co = Object.prototype.toString, dl = 0, ci = 4, mt = 0, Zn = 1, Wn = 2, cl = -1, vl = 0, pl = 8;
function it(e) {
  if (!(this instanceof it)) return new it(e);
  this.options = Pt.assign({
    level: cl,
    method: pl,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: vl,
    to: ""
  }, e || {});
  var r = this.options;
  r.raw && r.windowBits > 0 ? r.windowBits = -r.windowBits : r.gzip && r.windowBits > 0 && r.windowBits < 16 && (r.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new hl(), this.strm.avail_out = 0;
  var t = Lt.deflateInit2(
    this.strm,
    r.level,
    r.method,
    r.windowBits,
    r.memLevel,
    r.strategy
  );
  if (t !== mt)
    throw new Error(Oi[t]);
  if (r.header && Lt.deflateSetHeader(this.strm, r.header), r.dictionary) {
    var i;
    if (typeof r.dictionary == "string" ? i = Ri.string2buf(r.dictionary) : Co.call(r.dictionary) === "[object ArrayBuffer]" ? i = new Uint8Array(r.dictionary) : i = r.dictionary, t = Lt.deflateSetDictionary(this.strm, i), t !== mt)
      throw new Error(Oi[t]);
    this._dict_set = !0;
  }
}
it.prototype.push = function(e, r) {
  var t = this.strm, i = this.options.chunkSize, a, n;
  if (this.ended)
    return !1;
  n = r === ~~r ? r : r === !0 ? ci : dl, typeof e == "string" ? t.input = Ri.string2buf(e) : Co.call(e) === "[object ArrayBuffer]" ? t.input = new Uint8Array(e) : t.input = e, t.next_in = 0, t.avail_in = t.input.length;
  do {
    if (t.avail_out === 0 && (t.output = new Pt.Buf8(i), t.next_out = 0, t.avail_out = i), a = Lt.deflate(t, n), a !== Zn && a !== mt)
      return this.onEnd(a), this.ended = !0, !1;
    (t.avail_out === 0 || t.avail_in === 0 && (n === ci || n === Wn)) && (this.options.to === "string" ? this.onData(Ri.buf2binstring(Pt.shrinkBuf(t.output, t.next_out))) : this.onData(Pt.shrinkBuf(t.output, t.next_out)));
  } while ((t.avail_in > 0 || t.avail_out === 0) && a !== Zn);
  return n === ci ? (a = Lt.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === mt) : (n === Wn && (this.onEnd(mt), t.avail_out = 0), !0);
};
it.prototype.onData = function(e) {
  this.chunks.push(e);
};
it.prototype.onEnd = function(e) {
  e === mt && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Pt.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function Vi(e, r) {
  var t = new it(r);
  if (t.push(e, !0), t.err)
    throw t.msg || Oi[t.err];
  return t.result;
}
function _l(e, r) {
  return r = r || {}, r.raw = !0, Vi(e, r);
}
function gl(e, r) {
  return r = r || {}, r.gzip = !0, Vi(e, r);
}
Xt.Deflate = it;
Xt.deflate = Vi;
Xt.deflateRaw = _l;
Xt.gzip = gl;
var er = {}, Ee = {}, hr = 30, ml = 12, wl = function(r, t) {
  var i, a, n, o, s, c, f, l, w, h, d, g, m, C, u, _, b, S, E, F, z, B, L, j, D;
  i = r.state, a = r.next_in, j = r.input, n = a + (r.avail_in - 5), o = r.next_out, D = r.output, s = o - (t - r.avail_out), c = o + (r.avail_out - 257), f = i.dmax, l = i.wsize, w = i.whave, h = i.wnext, d = i.window, g = i.hold, m = i.bits, C = i.lencode, u = i.distcode, _ = (1 << i.lenbits) - 1, b = (1 << i.distbits) - 1;
  e:
    do {
      m < 15 && (g += j[a++] << m, m += 8, g += j[a++] << m, m += 8), S = C[g & _];
      t:
        for (; ; ) {
          if (E = S >>> 24, g >>>= E, m -= E, E = S >>> 16 & 255, E === 0)
            D[o++] = S & 65535;
          else if (E & 16) {
            F = S & 65535, E &= 15, E && (m < E && (g += j[a++] << m, m += 8), F += g & (1 << E) - 1, g >>>= E, m -= E), m < 15 && (g += j[a++] << m, m += 8, g += j[a++] << m, m += 8), S = u[g & b];
            r:
              for (; ; ) {
                if (E = S >>> 24, g >>>= E, m -= E, E = S >>> 16 & 255, E & 16) {
                  if (z = S & 65535, E &= 15, m < E && (g += j[a++] << m, m += 8, m < E && (g += j[a++] << m, m += 8)), z += g & (1 << E) - 1, z > f) {
                    r.msg = "invalid distance too far back", i.mode = hr;
                    break e;
                  }
                  if (g >>>= E, m -= E, E = o - s, z > E) {
                    if (E = z - E, E > w && i.sane) {
                      r.msg = "invalid distance too far back", i.mode = hr;
                      break e;
                    }
                    if (B = 0, L = d, h === 0) {
                      if (B += l - E, E < F) {
                        F -= E;
                        do
                          D[o++] = d[B++];
                        while (--E);
                        B = o - z, L = D;
                      }
                    } else if (h < E) {
                      if (B += l + h - E, E -= h, E < F) {
                        F -= E;
                        do
                          D[o++] = d[B++];
                        while (--E);
                        if (B = 0, h < F) {
                          E = h, F -= E;
                          do
                            D[o++] = d[B++];
                          while (--E);
                          B = o - z, L = D;
                        }
                      }
                    } else if (B += h - E, E < F) {
                      F -= E;
                      do
                        D[o++] = d[B++];
                      while (--E);
                      B = o - z, L = D;
                    }
                    for (; F > 2; )
                      D[o++] = L[B++], D[o++] = L[B++], D[o++] = L[B++], F -= 3;
                    F && (D[o++] = L[B++], F > 1 && (D[o++] = L[B++]));
                  } else {
                    B = o - z;
                    do
                      D[o++] = D[B++], D[o++] = D[B++], D[o++] = D[B++], F -= 3;
                    while (F > 2);
                    F && (D[o++] = D[B++], F > 1 && (D[o++] = D[B++]));
                  }
                } else if (E & 64) {
                  r.msg = "invalid distance code", i.mode = hr;
                  break e;
                } else {
                  S = u[(S & 65535) + (g & (1 << E) - 1)];
                  continue r;
                }
                break;
              }
          } else if (E & 64)
            if (E & 32) {
              i.mode = ml;
              break e;
            } else {
              r.msg = "invalid literal/length code", i.mode = hr;
              break e;
            }
          else {
            S = C[(S & 65535) + (g & (1 << E) - 1)];
            continue t;
          }
          break;
        }
    } while (a < n && o < c);
  F = m >> 3, a -= F, m -= F << 3, g &= (1 << m) - 1, r.next_in = a, r.next_out = o, r.avail_in = a < n ? 5 + (n - a) : 5 - (a - n), r.avail_out = o < c ? 257 + (c - o) : 257 - (o - c), i.hold = g, i.bits = m;
}, Hn = Pe, ct = 15, qn = 852, Gn = 592, Yn = 0, vi = 1, Kn = 2, bl = [
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
], yl = [
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
], xl = [
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
], kl = [
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
], Sl = function(r, t, i, a, n, o, s, c) {
  var f = c.bits, l = 0, w = 0, h = 0, d = 0, g = 0, m = 0, C = 0, u = 0, _ = 0, b = 0, S, E, F, z, B, L = null, j = 0, D, J = new Hn.Buf16(ct + 1), fe = new Hn.Buf16(ct + 1), U = null, Fe = 0, $e, x, y;
  for (l = 0; l <= ct; l++)
    J[l] = 0;
  for (w = 0; w < a; w++)
    J[t[i + w]]++;
  for (g = f, d = ct; d >= 1 && J[d] === 0; d--)
    ;
  if (g > d && (g = d), d === 0)
    return n[o++] = 1 << 24 | 64 << 16 | 0, n[o++] = 1 << 24 | 64 << 16 | 0, c.bits = 1, 0;
  for (h = 1; h < d && J[h] === 0; h++)
    ;
  for (g < h && (g = h), u = 1, l = 1; l <= ct; l++)
    if (u <<= 1, u -= J[l], u < 0)
      return -1;
  if (u > 0 && (r === Yn || d !== 1))
    return -1;
  for (fe[1] = 0, l = 1; l < ct; l++)
    fe[l + 1] = fe[l] + J[l];
  for (w = 0; w < a; w++)
    t[i + w] !== 0 && (s[fe[t[i + w]]++] = w);
  if (r === Yn ? (L = U = s, D = 19) : r === vi ? (L = bl, j -= 257, U = yl, Fe -= 257, D = 256) : (L = xl, U = kl, D = -1), b = 0, w = 0, l = h, B = o, m = g, C = 0, F = -1, _ = 1 << g, z = _ - 1, r === vi && _ > qn || r === Kn && _ > Gn)
    return 1;
  for (; ; ) {
    $e = l - C, s[w] < D ? (x = 0, y = s[w]) : s[w] > D ? (x = U[Fe + s[w]], y = L[j + s[w]]) : (x = 96, y = 0), S = 1 << l - C, E = 1 << m, h = E;
    do
      E -= S, n[B + (b >> C) + E] = $e << 24 | x << 16 | y | 0;
    while (E !== 0);
    for (S = 1 << l - 1; b & S; )
      S >>= 1;
    if (S !== 0 ? (b &= S - 1, b += S) : b = 0, w++, --J[l] === 0) {
      if (l === d)
        break;
      l = t[i + s[w]];
    }
    if (l > g && (b & z) !== F) {
      for (C === 0 && (C = g), B += h, m = l - C, u = 1 << m; m + C < d && (u -= J[m + C], !(u <= 0)); )
        m++, u <<= 1;
      if (_ += 1 << m, r === vi && _ > qn || r === Kn && _ > Gn)
        return 1;
      F = b & z, n[F] = g << 24 | m << 16 | B - o | 0;
    }
  }
  return b !== 0 && (n[B + b] = l - C << 24 | 64 << 16 | 0), c.bits = g, 0;
}, pe = Pe, Di = po, Oe = _o, El = wl, $t = Sl, Cl = 0, To = 1, Ao = 2, Vn = 4, Tl = 5, dr = 6, nt = 0, Al = 1, Rl = 2, be = -2, Ro = -3, Oo = -4, Ol = -5, Xn = 8, Do = 1, Jn = 2, Qn = 3, ea = 4, ta = 5, ra = 6, ia = 7, na = 8, aa = 9, oa = 10, Er = 11, ze = 12, pi = 13, sa = 14, _i = 15, fa = 16, la = 17, ua = 18, ha = 19, cr = 20, vr = 21, da = 22, ca = 23, va = 24, pa = 25, _a = 26, gi = 27, ga = 28, ma = 29, Q = 30, Io = 31, Dl = 32, Il = 852, Bl = 592, Fl = 15, zl = Fl;
function wa(e) {
  return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24);
}
function Nl() {
  this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new pe.Buf16(320), this.work = new pe.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
function Bo(e) {
  var r;
  return !e || !e.state ? be : (r = e.state, e.total_in = e.total_out = r.total = 0, e.msg = "", r.wrap && (e.adler = r.wrap & 1), r.mode = Do, r.last = 0, r.havedict = 0, r.dmax = 32768, r.head = null, r.hold = 0, r.bits = 0, r.lencode = r.lendyn = new pe.Buf32(Il), r.distcode = r.distdyn = new pe.Buf32(Bl), r.sane = 1, r.back = -1, nt);
}
function Fo(e) {
  var r;
  return !e || !e.state ? be : (r = e.state, r.wsize = 0, r.whave = 0, r.wnext = 0, Bo(e));
}
function zo(e, r) {
  var t, i;
  return !e || !e.state || (i = e.state, r < 0 ? (t = 0, r = -r) : (t = (r >> 4) + 1, r < 48 && (r &= 15)), r && (r < 8 || r > 15)) ? be : (i.window !== null && i.wbits !== r && (i.window = null), i.wrap = t, i.wbits = r, Fo(e));
}
function No(e, r) {
  var t, i;
  return e ? (i = new Nl(), e.state = i, i.window = null, t = zo(e, r), t !== nt && (e.state = null), t) : be;
}
function Ll(e) {
  return No(e, zl);
}
var ba = !0, mi, wi;
function Pl(e) {
  if (ba) {
    var r;
    for (mi = new pe.Buf32(512), wi = new pe.Buf32(32), r = 0; r < 144; )
      e.lens[r++] = 8;
    for (; r < 256; )
      e.lens[r++] = 9;
    for (; r < 280; )
      e.lens[r++] = 7;
    for (; r < 288; )
      e.lens[r++] = 8;
    for ($t(To, e.lens, 0, 288, mi, 0, e.work, { bits: 9 }), r = 0; r < 32; )
      e.lens[r++] = 5;
    $t(Ao, e.lens, 0, 32, wi, 0, e.work, { bits: 5 }), ba = !1;
  }
  e.lencode = mi, e.lenbits = 9, e.distcode = wi, e.distbits = 5;
}
function Lo(e, r, t, i) {
  var a, n = e.state;
  return n.window === null && (n.wsize = 1 << n.wbits, n.wnext = 0, n.whave = 0, n.window = new pe.Buf8(n.wsize)), i >= n.wsize ? (pe.arraySet(n.window, r, t - n.wsize, n.wsize, 0), n.wnext = 0, n.whave = n.wsize) : (a = n.wsize - n.wnext, a > i && (a = i), pe.arraySet(n.window, r, t - i, a, n.wnext), i -= a, i ? (pe.arraySet(n.window, r, t - i, i, 0), n.wnext = i, n.whave = n.wsize) : (n.wnext += a, n.wnext === n.wsize && (n.wnext = 0), n.whave < n.wsize && (n.whave += a))), 0;
}
function $l(e, r) {
  var t, i, a, n, o, s, c, f, l, w, h, d, g, m, C = 0, u, _, b, S, E, F, z, B, L = new pe.Buf8(4), j, D, J = (
    /* permutation of code lengths */
    [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
  );
  if (!e || !e.state || !e.output || !e.input && e.avail_in !== 0)
    return be;
  t = e.state, t.mode === ze && (t.mode = pi), o = e.next_out, a = e.output, c = e.avail_out, n = e.next_in, i = e.input, s = e.avail_in, f = t.hold, l = t.bits, w = s, h = c, B = nt;
  e:
    for (; ; )
      switch (t.mode) {
        case Do:
          if (t.wrap === 0) {
            t.mode = pi;
            break;
          }
          for (; l < 16; ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          if (t.wrap & 2 && f === 35615) {
            t.check = 0, L[0] = f & 255, L[1] = f >>> 8 & 255, t.check = Oe(t.check, L, 2, 0), f = 0, l = 0, t.mode = Jn;
            break;
          }
          if (t.flags = 0, t.head && (t.head.done = !1), !(t.wrap & 1) || /* check if zlib header allowed */
          (((f & 255) << 8) + (f >> 8)) % 31) {
            e.msg = "incorrect header check", t.mode = Q;
            break;
          }
          if ((f & 15) !== Xn) {
            e.msg = "unknown compression method", t.mode = Q;
            break;
          }
          if (f >>>= 4, l -= 4, z = (f & 15) + 8, t.wbits === 0)
            t.wbits = z;
          else if (z > t.wbits) {
            e.msg = "invalid window size", t.mode = Q;
            break;
          }
          t.dmax = 1 << z, e.adler = t.check = 1, t.mode = f & 512 ? oa : ze, f = 0, l = 0;
          break;
        case Jn:
          for (; l < 16; ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          if (t.flags = f, (t.flags & 255) !== Xn) {
            e.msg = "unknown compression method", t.mode = Q;
            break;
          }
          if (t.flags & 57344) {
            e.msg = "unknown header flags set", t.mode = Q;
            break;
          }
          t.head && (t.head.text = f >> 8 & 1), t.flags & 512 && (L[0] = f & 255, L[1] = f >>> 8 & 255, t.check = Oe(t.check, L, 2, 0)), f = 0, l = 0, t.mode = Qn;
        case Qn:
          for (; l < 32; ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          t.head && (t.head.time = f), t.flags & 512 && (L[0] = f & 255, L[1] = f >>> 8 & 255, L[2] = f >>> 16 & 255, L[3] = f >>> 24 & 255, t.check = Oe(t.check, L, 4, 0)), f = 0, l = 0, t.mode = ea;
        case ea:
          for (; l < 16; ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          t.head && (t.head.xflags = f & 255, t.head.os = f >> 8), t.flags & 512 && (L[0] = f & 255, L[1] = f >>> 8 & 255, t.check = Oe(t.check, L, 2, 0)), f = 0, l = 0, t.mode = ta;
        case ta:
          if (t.flags & 1024) {
            for (; l < 16; ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            t.length = f, t.head && (t.head.extra_len = f), t.flags & 512 && (L[0] = f & 255, L[1] = f >>> 8 & 255, t.check = Oe(t.check, L, 2, 0)), f = 0, l = 0;
          } else t.head && (t.head.extra = null);
          t.mode = ra;
        case ra:
          if (t.flags & 1024 && (d = t.length, d > s && (d = s), d && (t.head && (z = t.head.extra_len - t.length, t.head.extra || (t.head.extra = new Array(t.head.extra_len)), pe.arraySet(
            t.head.extra,
            i,
            n,
            // extra field is limited to 65536 bytes
            // - no need for additional size check
            d,
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            z
          )), t.flags & 512 && (t.check = Oe(t.check, i, d, n)), s -= d, n += d, t.length -= d), t.length))
            break e;
          t.length = 0, t.mode = ia;
        case ia:
          if (t.flags & 2048) {
            if (s === 0)
              break e;
            d = 0;
            do
              z = i[n + d++], t.head && z && t.length < 65536 && (t.head.name += String.fromCharCode(z));
            while (z && d < s);
            if (t.flags & 512 && (t.check = Oe(t.check, i, d, n)), s -= d, n += d, z)
              break e;
          } else t.head && (t.head.name = null);
          t.length = 0, t.mode = na;
        case na:
          if (t.flags & 4096) {
            if (s === 0)
              break e;
            d = 0;
            do
              z = i[n + d++], t.head && z && t.length < 65536 && (t.head.comment += String.fromCharCode(z));
            while (z && d < s);
            if (t.flags & 512 && (t.check = Oe(t.check, i, d, n)), s -= d, n += d, z)
              break e;
          } else t.head && (t.head.comment = null);
          t.mode = aa;
        case aa:
          if (t.flags & 512) {
            for (; l < 16; ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            if (f !== (t.check & 65535)) {
              e.msg = "header crc mismatch", t.mode = Q;
              break;
            }
            f = 0, l = 0;
          }
          t.head && (t.head.hcrc = t.flags >> 9 & 1, t.head.done = !0), e.adler = t.check = 0, t.mode = ze;
          break;
        case oa:
          for (; l < 32; ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          e.adler = t.check = wa(f), f = 0, l = 0, t.mode = Er;
        case Er:
          if (t.havedict === 0)
            return e.next_out = o, e.avail_out = c, e.next_in = n, e.avail_in = s, t.hold = f, t.bits = l, Rl;
          e.adler = t.check = 1, t.mode = ze;
        case ze:
          if (r === Tl || r === dr)
            break e;
        case pi:
          if (t.last) {
            f >>>= l & 7, l -= l & 7, t.mode = gi;
            break;
          }
          for (; l < 3; ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          switch (t.last = f & 1, f >>>= 1, l -= 1, f & 3) {
            case 0:
              t.mode = sa;
              break;
            case 1:
              if (Pl(t), t.mode = cr, r === dr) {
                f >>>= 2, l -= 2;
                break e;
              }
              break;
            case 2:
              t.mode = la;
              break;
            case 3:
              e.msg = "invalid block type", t.mode = Q;
          }
          f >>>= 2, l -= 2;
          break;
        case sa:
          for (f >>>= l & 7, l -= l & 7; l < 32; ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          if ((f & 65535) !== (f >>> 16 ^ 65535)) {
            e.msg = "invalid stored block lengths", t.mode = Q;
            break;
          }
          if (t.length = f & 65535, f = 0, l = 0, t.mode = _i, r === dr)
            break e;
        case _i:
          t.mode = fa;
        case fa:
          if (d = t.length, d) {
            if (d > s && (d = s), d > c && (d = c), d === 0)
              break e;
            pe.arraySet(a, i, n, d, o), s -= d, n += d, c -= d, o += d, t.length -= d;
            break;
          }
          t.mode = ze;
          break;
        case la:
          for (; l < 14; ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          if (t.nlen = (f & 31) + 257, f >>>= 5, l -= 5, t.ndist = (f & 31) + 1, f >>>= 5, l -= 5, t.ncode = (f & 15) + 4, f >>>= 4, l -= 4, t.nlen > 286 || t.ndist > 30) {
            e.msg = "too many length or distance symbols", t.mode = Q;
            break;
          }
          t.have = 0, t.mode = ua;
        case ua:
          for (; t.have < t.ncode; ) {
            for (; l < 3; ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            t.lens[J[t.have++]] = f & 7, f >>>= 3, l -= 3;
          }
          for (; t.have < 19; )
            t.lens[J[t.have++]] = 0;
          if (t.lencode = t.lendyn, t.lenbits = 7, j = { bits: t.lenbits }, B = $t(Cl, t.lens, 0, 19, t.lencode, 0, t.work, j), t.lenbits = j.bits, B) {
            e.msg = "invalid code lengths set", t.mode = Q;
            break;
          }
          t.have = 0, t.mode = ha;
        case ha:
          for (; t.have < t.nlen + t.ndist; ) {
            for (; C = t.lencode[f & (1 << t.lenbits) - 1], u = C >>> 24, _ = C >>> 16 & 255, b = C & 65535, !(u <= l); ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            if (b < 16)
              f >>>= u, l -= u, t.lens[t.have++] = b;
            else {
              if (b === 16) {
                for (D = u + 2; l < D; ) {
                  if (s === 0)
                    break e;
                  s--, f += i[n++] << l, l += 8;
                }
                if (f >>>= u, l -= u, t.have === 0) {
                  e.msg = "invalid bit length repeat", t.mode = Q;
                  break;
                }
                z = t.lens[t.have - 1], d = 3 + (f & 3), f >>>= 2, l -= 2;
              } else if (b === 17) {
                for (D = u + 3; l < D; ) {
                  if (s === 0)
                    break e;
                  s--, f += i[n++] << l, l += 8;
                }
                f >>>= u, l -= u, z = 0, d = 3 + (f & 7), f >>>= 3, l -= 3;
              } else {
                for (D = u + 7; l < D; ) {
                  if (s === 0)
                    break e;
                  s--, f += i[n++] << l, l += 8;
                }
                f >>>= u, l -= u, z = 0, d = 11 + (f & 127), f >>>= 7, l -= 7;
              }
              if (t.have + d > t.nlen + t.ndist) {
                e.msg = "invalid bit length repeat", t.mode = Q;
                break;
              }
              for (; d--; )
                t.lens[t.have++] = z;
            }
          }
          if (t.mode === Q)
            break;
          if (t.lens[256] === 0) {
            e.msg = "invalid code -- missing end-of-block", t.mode = Q;
            break;
          }
          if (t.lenbits = 9, j = { bits: t.lenbits }, B = $t(To, t.lens, 0, t.nlen, t.lencode, 0, t.work, j), t.lenbits = j.bits, B) {
            e.msg = "invalid literal/lengths set", t.mode = Q;
            break;
          }
          if (t.distbits = 6, t.distcode = t.distdyn, j = { bits: t.distbits }, B = $t(Ao, t.lens, t.nlen, t.ndist, t.distcode, 0, t.work, j), t.distbits = j.bits, B) {
            e.msg = "invalid distances set", t.mode = Q;
            break;
          }
          if (t.mode = cr, r === dr)
            break e;
        case cr:
          t.mode = vr;
        case vr:
          if (s >= 6 && c >= 258) {
            e.next_out = o, e.avail_out = c, e.next_in = n, e.avail_in = s, t.hold = f, t.bits = l, El(e, h), o = e.next_out, a = e.output, c = e.avail_out, n = e.next_in, i = e.input, s = e.avail_in, f = t.hold, l = t.bits, t.mode === ze && (t.back = -1);
            break;
          }
          for (t.back = 0; C = t.lencode[f & (1 << t.lenbits) - 1], u = C >>> 24, _ = C >>> 16 & 255, b = C & 65535, !(u <= l); ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          if (_ && !(_ & 240)) {
            for (S = u, E = _, F = b; C = t.lencode[F + ((f & (1 << S + E) - 1) >> S)], u = C >>> 24, _ = C >>> 16 & 255, b = C & 65535, !(S + u <= l); ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            f >>>= S, l -= S, t.back += S;
          }
          if (f >>>= u, l -= u, t.back += u, t.length = b, _ === 0) {
            t.mode = _a;
            break;
          }
          if (_ & 32) {
            t.back = -1, t.mode = ze;
            break;
          }
          if (_ & 64) {
            e.msg = "invalid literal/length code", t.mode = Q;
            break;
          }
          t.extra = _ & 15, t.mode = da;
        case da:
          if (t.extra) {
            for (D = t.extra; l < D; ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            t.length += f & (1 << t.extra) - 1, f >>>= t.extra, l -= t.extra, t.back += t.extra;
          }
          t.was = t.length, t.mode = ca;
        case ca:
          for (; C = t.distcode[f & (1 << t.distbits) - 1], u = C >>> 24, _ = C >>> 16 & 255, b = C & 65535, !(u <= l); ) {
            if (s === 0)
              break e;
            s--, f += i[n++] << l, l += 8;
          }
          if (!(_ & 240)) {
            for (S = u, E = _, F = b; C = t.distcode[F + ((f & (1 << S + E) - 1) >> S)], u = C >>> 24, _ = C >>> 16 & 255, b = C & 65535, !(S + u <= l); ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            f >>>= S, l -= S, t.back += S;
          }
          if (f >>>= u, l -= u, t.back += u, _ & 64) {
            e.msg = "invalid distance code", t.mode = Q;
            break;
          }
          t.offset = b, t.extra = _ & 15, t.mode = va;
        case va:
          if (t.extra) {
            for (D = t.extra; l < D; ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            t.offset += f & (1 << t.extra) - 1, f >>>= t.extra, l -= t.extra, t.back += t.extra;
          }
          if (t.offset > t.dmax) {
            e.msg = "invalid distance too far back", t.mode = Q;
            break;
          }
          t.mode = pa;
        case pa:
          if (c === 0)
            break e;
          if (d = h - c, t.offset > d) {
            if (d = t.offset - d, d > t.whave && t.sane) {
              e.msg = "invalid distance too far back", t.mode = Q;
              break;
            }
            d > t.wnext ? (d -= t.wnext, g = t.wsize - d) : g = t.wnext - d, d > t.length && (d = t.length), m = t.window;
          } else
            m = a, g = o - t.offset, d = t.length;
          d > c && (d = c), c -= d, t.length -= d;
          do
            a[o++] = m[g++];
          while (--d);
          t.length === 0 && (t.mode = vr);
          break;
        case _a:
          if (c === 0)
            break e;
          a[o++] = t.length, c--, t.mode = vr;
          break;
        case gi:
          if (t.wrap) {
            for (; l < 32; ) {
              if (s === 0)
                break e;
              s--, f |= i[n++] << l, l += 8;
            }
            if (h -= c, e.total_out += h, t.total += h, h && (e.adler = t.check = /*UPDATE(state.check, put - _out, _out);*/
            t.flags ? Oe(t.check, a, h, o - h) : Di(t.check, a, h, o - h)), h = c, (t.flags ? f : wa(f)) !== t.check) {
              e.msg = "incorrect data check", t.mode = Q;
              break;
            }
            f = 0, l = 0;
          }
          t.mode = ga;
        case ga:
          if (t.wrap && t.flags) {
            for (; l < 32; ) {
              if (s === 0)
                break e;
              s--, f += i[n++] << l, l += 8;
            }
            if (f !== (t.total & 4294967295)) {
              e.msg = "incorrect length check", t.mode = Q;
              break;
            }
            f = 0, l = 0;
          }
          t.mode = ma;
        case ma:
          B = Al;
          break e;
        case Q:
          B = Ro;
          break e;
        case Io:
          return Oo;
        case Dl:
        default:
          return be;
      }
  return e.next_out = o, e.avail_out = c, e.next_in = n, e.avail_in = s, t.hold = f, t.bits = l, (t.wsize || h !== e.avail_out && t.mode < Q && (t.mode < gi || r !== Vn)) && Lo(e, e.output, e.next_out, h - e.avail_out), w -= e.avail_in, h -= e.avail_out, e.total_in += w, e.total_out += h, t.total += h, t.wrap && h && (e.adler = t.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
  t.flags ? Oe(t.check, a, h, e.next_out - h) : Di(t.check, a, h, e.next_out - h)), e.data_type = t.bits + (t.last ? 64 : 0) + (t.mode === ze ? 128 : 0) + (t.mode === cr || t.mode === _i ? 256 : 0), (w === 0 && h === 0 || r === Vn) && B === nt && (B = Ol), B;
}
function Ml(e) {
  if (!e || !e.state)
    return be;
  var r = e.state;
  return r.window && (r.window = null), e.state = null, nt;
}
function jl(e, r) {
  var t;
  return !e || !e.state || (t = e.state, !(t.wrap & 2)) ? be : (t.head = r, r.done = !1, nt);
}
function Ul(e, r) {
  var t = r.length, i, a, n;
  return !e || !e.state || (i = e.state, i.wrap !== 0 && i.mode !== Er) ? be : i.mode === Er && (a = 1, a = Di(a, r, t, 0), a !== i.check) ? Ro : (n = Lo(e, r, t, t), n ? (i.mode = Io, Oo) : (i.havedict = 1, nt));
}
Ee.inflateReset = Fo;
Ee.inflateReset2 = zo;
Ee.inflateResetKeep = Bo;
Ee.inflateInit = Ll;
Ee.inflateInit2 = No;
Ee.inflate = $l;
Ee.inflateEnd = Ml;
Ee.inflateGetHeader = jl;
Ee.inflateSetDictionary = Ul;
Ee.inflateInfo = "pako inflate (from Nodeca project)";
var Po = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  //Z_MEM_ERROR:     -4,
  Z_BUF_ERROR: -5,
  //Z_VERSION_ERROR: -6,
  /* compression levels */
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY: 0,
  Z_TEXT: 1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
function Zl() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Wl = Zl, wt = Ee, Mt = Pe, xr = st, te = Po, Ii = Ki, Hl = Eo, ql = Wl, $o = Object.prototype.toString;
function at(e) {
  if (!(this instanceof at)) return new at(e);
  this.options = Mt.assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ""
  }, e || {});
  var r = this.options;
  r.raw && r.windowBits >= 0 && r.windowBits < 16 && (r.windowBits = -r.windowBits, r.windowBits === 0 && (r.windowBits = -15)), r.windowBits >= 0 && r.windowBits < 16 && !(e && e.windowBits) && (r.windowBits += 32), r.windowBits > 15 && r.windowBits < 48 && (r.windowBits & 15 || (r.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Hl(), this.strm.avail_out = 0;
  var t = wt.inflateInit2(
    this.strm,
    r.windowBits
  );
  if (t !== te.Z_OK)
    throw new Error(Ii[t]);
  if (this.header = new ql(), wt.inflateGetHeader(this.strm, this.header), r.dictionary && (typeof r.dictionary == "string" ? r.dictionary = xr.string2buf(r.dictionary) : $o.call(r.dictionary) === "[object ArrayBuffer]" && (r.dictionary = new Uint8Array(r.dictionary)), r.raw && (t = wt.inflateSetDictionary(this.strm, r.dictionary), t !== te.Z_OK)))
    throw new Error(Ii[t]);
}
at.prototype.push = function(e, r) {
  var t = this.strm, i = this.options.chunkSize, a = this.options.dictionary, n, o, s, c, f, l = !1;
  if (this.ended)
    return !1;
  o = r === ~~r ? r : r === !0 ? te.Z_FINISH : te.Z_NO_FLUSH, typeof e == "string" ? t.input = xr.binstring2buf(e) : $o.call(e) === "[object ArrayBuffer]" ? t.input = new Uint8Array(e) : t.input = e, t.next_in = 0, t.avail_in = t.input.length;
  do {
    if (t.avail_out === 0 && (t.output = new Mt.Buf8(i), t.next_out = 0, t.avail_out = i), n = wt.inflate(t, te.Z_NO_FLUSH), n === te.Z_NEED_DICT && a && (n = wt.inflateSetDictionary(this.strm, a)), n === te.Z_BUF_ERROR && l === !0 && (n = te.Z_OK, l = !1), n !== te.Z_STREAM_END && n !== te.Z_OK)
      return this.onEnd(n), this.ended = !0, !1;
    t.next_out && (t.avail_out === 0 || n === te.Z_STREAM_END || t.avail_in === 0 && (o === te.Z_FINISH || o === te.Z_SYNC_FLUSH)) && (this.options.to === "string" ? (s = xr.utf8border(t.output, t.next_out), c = t.next_out - s, f = xr.buf2string(t.output, s), t.next_out = c, t.avail_out = i - c, c && Mt.arraySet(t.output, t.output, s, c, 0), this.onData(f)) : this.onData(Mt.shrinkBuf(t.output, t.next_out))), t.avail_in === 0 && t.avail_out === 0 && (l = !0);
  } while ((t.avail_in > 0 || t.avail_out === 0) && n !== te.Z_STREAM_END);
  return n === te.Z_STREAM_END && (o = te.Z_FINISH), o === te.Z_FINISH ? (n = wt.inflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === te.Z_OK) : (o === te.Z_SYNC_FLUSH && (this.onEnd(te.Z_OK), t.avail_out = 0), !0);
};
at.prototype.onData = function(e) {
  this.chunks.push(e);
};
at.prototype.onEnd = function(e) {
  e === te.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Mt.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function Xi(e, r) {
  var t = new at(r);
  if (t.push(e, !0), t.err)
    throw t.msg || Ii[t.err];
  return t.result;
}
function Gl(e, r) {
  return r = r || {}, r.raw = !0, Xi(e, r);
}
er.Inflate = at;
er.inflate = Xi;
er.inflateRaw = Gl;
er.ungzip = Xi;
var Yl = Pe.assign, Kl = Xt, Vl = er, Xl = Po, Mo = {};
Yl(Mo, Kl, Vl, Xl);
var Jl = Mo, Ql = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", eu = Jl, jo = ee(), $r = ye, tu = Ql ? "uint8array" : "array";
zr.magic = "\b\0";
function ft(e, r) {
  $r.call(this, "FlateWorker/" + e), this._pako = null, this._pakoAction = e, this._pakoOptions = r, this.meta = {};
}
jo.inherits(ft, $r);
ft.prototype.processChunk = function(e) {
  this.meta = e.meta, this._pako === null && this._createPako(), this._pako.push(jo.transformTo(tu, e.data), !1);
};
ft.prototype.flush = function() {
  $r.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
};
ft.prototype.cleanUp = function() {
  $r.prototype.cleanUp.call(this), this._pako = null;
};
ft.prototype._createPako = function() {
  this._pako = new eu[this._pakoAction]({
    raw: !0,
    level: this._pakoOptions.level || -1
    // default compression
  });
  var e = this;
  this._pako.onData = function(r) {
    e.push({
      data: r,
      meta: e.meta
    });
  };
};
zr.compressWorker = function(e) {
  return new ft("Deflate", e);
};
zr.uncompressWorker = function() {
  return new ft("Inflate", {});
};
var ya = ye;
Fr.STORE = {
  magic: "\0\0",
  compressWorker: function() {
    return new ya("STORE compression");
  },
  uncompressWorker: function() {
    return new ya("STORE decompression");
  }
};
Fr.DEFLATE = zr;
var Ye = {};
Ye.LOCAL_FILE_HEADER = "PK";
Ye.CENTRAL_FILE_HEADER = "PK";
Ye.CENTRAL_DIRECTORY_END = "PK";
Ye.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
Ye.ZIP64_CENTRAL_DIRECTORY_END = "PK";
Ye.DATA_DESCRIPTOR = "PK\x07\b";
var _t = ee(), Rt = ye, bi = St, xa = Pi, Cr = Ye, V = function(e, r) {
  var t = "", i;
  for (i = 0; i < r; i++)
    t += String.fromCharCode(e & 255), e = e >>> 8;
  return t;
}, ru = function(e, r) {
  var t = e;
  return e || (t = r ? 16893 : 33204), (t & 65535) << 16;
}, iu = function(e) {
  return (e || 0) & 63;
}, Uo = function(e, r, t, i, a, n) {
  var o = e.file, s = e.compression, c = n !== bi.utf8encode, f = _t.transformTo("string", n(o.name)), l = _t.transformTo("string", bi.utf8encode(o.name)), w = o.comment, h = _t.transformTo("string", n(w)), d = _t.transformTo("string", bi.utf8encode(w)), g = l.length !== o.name.length, m = d.length !== w.length, C, u, _ = "", b = "", S = "", E = o.dir, F = o.date, z = {
    crc32: 0,
    compressedSize: 0,
    uncompressedSize: 0
  };
  (!r || t) && (z.crc32 = e.crc32, z.compressedSize = e.compressedSize, z.uncompressedSize = e.uncompressedSize);
  var B = 0;
  r && (B |= 8), !c && (g || m) && (B |= 2048);
  var L = 0, j = 0;
  E && (L |= 16), a === "UNIX" ? (j = 798, L |= ru(o.unixPermissions, E)) : (j = 20, L |= iu(o.dosPermissions)), C = F.getUTCHours(), C = C << 6, C = C | F.getUTCMinutes(), C = C << 5, C = C | F.getUTCSeconds() / 2, u = F.getUTCFullYear() - 1980, u = u << 4, u = u | F.getUTCMonth() + 1, u = u << 5, u = u | F.getUTCDate(), g && (b = // Version
  V(1, 1) + // NameCRC32
  V(xa(f), 4) + // UnicodeName
  l, _ += // Info-ZIP Unicode Path Extra Field
  "up" + // size
  V(b.length, 2) + // content
  b), m && (S = // Version
  V(1, 1) + // CommentCRC32
  V(xa(h), 4) + // UnicodeName
  d, _ += // Info-ZIP Unicode Path Extra Field
  "uc" + // size
  V(S.length, 2) + // content
  S);
  var D = "";
  D += `
\0`, D += V(B, 2), D += s.magic, D += V(C, 2), D += V(u, 2), D += V(z.crc32, 4), D += V(z.compressedSize, 4), D += V(z.uncompressedSize, 4), D += V(f.length, 2), D += V(_.length, 2);
  var J = Cr.LOCAL_FILE_HEADER + D + f + _, fe = Cr.CENTRAL_FILE_HEADER + // version made by (00: DOS)
  V(j, 2) + // file header (common to file and central directory)
  D + // file comment length
  V(h.length, 2) + // disk number start
  "\0\0\0\0" + // external file attributes
  V(L, 4) + // relative offset of local header
  V(i, 4) + // file name
  f + // extra field
  _ + // file comment
  h;
  return {
    fileRecord: J,
    dirRecord: fe
  };
}, nu = function(e, r, t, i, a) {
  var n = "", o = _t.transformTo("string", a(i));
  return n = Cr.CENTRAL_DIRECTORY_END + // number of this disk
  "\0\0\0\0" + // total number of entries in the central directory on this disk
  V(e, 2) + // total number of entries in the central directory
  V(e, 2) + // size of the central directory   4 bytes
  V(r, 4) + // offset of start of central directory with respect to the starting disk number
  V(t, 4) + // .ZIP file comment length
  V(o.length, 2) + // .ZIP file comment
  o, n;
}, au = function(e) {
  var r = "";
  return r = Cr.DATA_DESCRIPTOR + // crc-32                          4 bytes
  V(e.crc32, 4) + // compressed size                 4 bytes
  V(e.compressedSize, 4) + // uncompressed size               4 bytes
  V(e.uncompressedSize, 4), r;
};
function Ce(e, r, t, i) {
  Rt.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = r, this.zipPlatform = t, this.encodeFileName = i, this.streamFiles = e, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
}
_t.inherits(Ce, Rt);
Ce.prototype.push = function(e) {
  var r = e.meta.percent || 0, t = this.entriesCount, i = this._sources.length;
  this.accumulate ? this.contentBuffer.push(e) : (this.bytesWritten += e.data.length, Rt.prototype.push.call(this, {
    data: e.data,
    meta: {
      currentFile: this.currentFile,
      percent: t ? (r + 100 * (t - i - 1)) / t : 100
    }
  }));
};
Ce.prototype.openedSource = function(e) {
  this.currentSourceOffset = this.bytesWritten, this.currentFile = e.file.name;
  var r = this.streamFiles && !e.file.dir;
  if (r) {
    var t = Uo(e, r, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
    this.push({
      data: t.fileRecord,
      meta: { percent: 0 }
    });
  } else
    this.accumulate = !0;
};
Ce.prototype.closedSource = function(e) {
  this.accumulate = !1;
  var r = this.streamFiles && !e.file.dir, t = Uo(e, r, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
  if (this.dirRecords.push(t.dirRecord), r)
    this.push({
      data: au(e),
      meta: { percent: 100 }
    });
  else
    for (this.push({
      data: t.fileRecord,
      meta: { percent: 0 }
    }); this.contentBuffer.length; )
      this.push(this.contentBuffer.shift());
  this.currentFile = null;
};
Ce.prototype.flush = function() {
  for (var e = this.bytesWritten, r = 0; r < this.dirRecords.length; r++)
    this.push({
      data: this.dirRecords[r],
      meta: { percent: 100 }
    });
  var t = this.bytesWritten - e, i = nu(this.dirRecords.length, t, e, this.zipComment, this.encodeFileName);
  this.push({
    data: i,
    meta: { percent: 100 }
  });
};
Ce.prototype.prepareNextSource = function() {
  this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
};
Ce.prototype.registerPrevious = function(e) {
  this._sources.push(e);
  var r = this;
  return e.on("data", function(t) {
    r.processChunk(t);
  }), e.on("end", function() {
    r.closedSource(r.previous.streamInfo), r._sources.length ? r.prepareNextSource() : r.end();
  }), e.on("error", function(t) {
    r.error(t);
  }), this;
};
Ce.prototype.resume = function() {
  if (!Rt.prototype.resume.call(this))
    return !1;
  if (!this.previous && this._sources.length)
    return this.prepareNextSource(), !0;
  if (!this.previous && !this._sources.length && !this.generatedError)
    return this.end(), !0;
};
Ce.prototype.error = function(e) {
  var r = this._sources;
  if (!Rt.prototype.error.call(this, e))
    return !1;
  for (var t = 0; t < r.length; t++)
    try {
      r[t].error(e);
    } catch {
    }
  return !0;
};
Ce.prototype.lock = function() {
  Rt.prototype.lock.call(this);
  for (var e = this._sources, r = 0; r < e.length; r++)
    e[r].lock();
};
var ou = Ce, su = Fr, fu = ou, lu = function(e, r) {
  var t = e || r, i = su[t];
  if (!i)
    throw new Error(t + " is not a valid compression method !");
  return i;
};
Ja.generateWorker = function(e, r, t) {
  var i = new fu(r.streamFiles, t, r.platform, r.encodeFileName), a = 0;
  try {
    e.forEach(function(n, o) {
      a++;
      var s = lu(o.options.compression, r.compression), c = o.options.compressionOptions || r.compressionOptions || {}, f = o.dir, l = o.date;
      o._compressWorker(s, c).withStreamInfo("file", {
        name: n,
        dir: f,
        date: l,
        comment: o.comment || "",
        unixPermissions: o.unixPermissions,
        dosPermissions: o.dosPermissions
      }).pipe(i);
    }), i.entriesCount = a;
  } catch (n) {
    i.error(n);
  }
  return i;
};
var uu = ee(), Mr = ye;
function tr(e, r) {
  Mr.call(this, "Nodejs stream input adapter for " + e), this._upstreamEnded = !1, this._bindStream(r);
}
uu.inherits(tr, Mr);
tr.prototype._bindStream = function(e) {
  var r = this;
  this._stream = e, e.pause(), e.on("data", function(t) {
    r.push({
      data: t,
      meta: {
        percent: 0
      }
    });
  }).on("error", function(t) {
    r.isPaused ? this.generatedError = t : r.error(t);
  }).on("end", function() {
    r.isPaused ? r._upstreamEnded = !0 : r.end();
  });
};
tr.prototype.pause = function() {
  return Mr.prototype.pause.call(this) ? (this._stream.pause(), !0) : !1;
};
tr.prototype.resume = function() {
  return Mr.prototype.resume.call(this) ? (this._upstreamEnded ? this.end() : this._stream.resume(), !0) : !1;
};
var hu = tr, du = St, jt = ee(), Zo = ye, cu = Ga, Wo = xe, ka = Zi, vu = of, pu = Ja, Sa = Dr, _u = hu, Ho = function(e, r, t) {
  var i = jt.getTypeOf(r), a, n = jt.extend(t || {}, Wo);
  n.date = n.date || /* @__PURE__ */ new Date(), n.compression !== null && (n.compression = n.compression.toUpperCase()), typeof n.unixPermissions == "string" && (n.unixPermissions = parseInt(n.unixPermissions, 8)), n.unixPermissions && n.unixPermissions & 16384 && (n.dir = !0), n.dosPermissions && n.dosPermissions & 16 && (n.dir = !0), n.dir && (e = qo(e)), n.createFolders && (a = gu(e)) && Go.call(this, a, !0);
  var o = i === "string" && n.binary === !1 && n.base64 === !1;
  (!t || typeof t.binary > "u") && (n.binary = !o);
  var s = r instanceof ka && r.uncompressedSize === 0;
  (s || n.dir || !r || r.length === 0) && (n.base64 = !1, n.binary = !0, r = "", n.compression = "STORE", i = "string");
  var c = null;
  r instanceof ka || r instanceof Zo ? c = r : Sa.isNode && Sa.isStream(r) ? c = new _u(e, r) : c = jt.prepareContent(e, r, n.binary, n.optimizedBinaryString, n.base64);
  var f = new vu(e, c, n);
  this.files[e] = f;
}, gu = function(e) {
  e.slice(-1) === "/" && (e = e.substring(0, e.length - 1));
  var r = e.lastIndexOf("/");
  return r > 0 ? e.substring(0, r) : "";
}, qo = function(e) {
  return e.slice(-1) !== "/" && (e += "/"), e;
}, Go = function(e, r) {
  return r = typeof r < "u" ? r : Wo.createFolders, e = qo(e), this.files[e] || Ho.call(this, e, null, {
    dir: !0,
    createFolders: r
  }), this.files[e];
};
function Ea(e) {
  return Object.prototype.toString.call(e) === "[object RegExp]";
}
var mu = {
  /**
   * @see loadAsync
   */
  load: function() {
    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
  },
  /**
   * Call a callback function for each entry at this folder level.
   * @param {Function} cb the callback function:
   * function (relativePath, file) {...}
   * It takes 2 arguments : the relative path and the file.
   */
  forEach: function(e) {
    var r, t, i;
    for (r in this.files)
      i = this.files[r], t = r.slice(this.root.length, r.length), t && r.slice(0, this.root.length) === this.root && e(t, i);
  },
  /**
   * Filter nested files/folders with the specified function.
   * @param {Function} search the predicate to use :
   * function (relativePath, file) {...}
   * It takes 2 arguments : the relative path and the file.
   * @return {Array} An array of matching elements.
   */
  filter: function(e) {
    var r = [];
    return this.forEach(function(t, i) {
      e(t, i) && r.push(i);
    }), r;
  },
  /**
   * Add a file to the zip file, or search a file.
   * @param   {string|RegExp} name The name of the file to add (if data is defined),
   * the name of the file to find (if no data) or a regex to match files.
   * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
   * @param   {Object} o     File options
   * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
   * a file (when searching by string) or an array of files (when searching by regex).
   */
  file: function(e, r, t) {
    if (arguments.length === 1)
      if (Ea(e)) {
        var i = e;
        return this.filter(function(n, o) {
          return !o.dir && i.test(n);
        });
      } else {
        var a = this.files[this.root + e];
        return a && !a.dir ? a : null;
      }
    else
      e = this.root + e, Ho.call(this, e, r, t);
    return this;
  },
  /**
   * Add a directory to the zip file, or search.
   * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
   * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
   */
  folder: function(e) {
    if (!e)
      return this;
    if (Ea(e))
      return this.filter(function(a, n) {
        return n.dir && e.test(a);
      });
    var r = this.root + e, t = Go.call(this, r), i = this.clone();
    return i.root = t.name, i;
  },
  /**
   * Delete a file, or a directory and all sub-files, from the zip
   * @param {string} name the name of the file to delete
   * @return {JSZip} this JSZip object
   */
  remove: function(e) {
    e = this.root + e;
    var r = this.files[e];
    if (r || (e.slice(-1) !== "/" && (e += "/"), r = this.files[e]), r && !r.dir)
      delete this.files[e];
    else
      for (var t = this.filter(function(a, n) {
        return n.name.slice(0, e.length) === e;
      }), i = 0; i < t.length; i++)
        delete this.files[t[i].name];
    return this;
  },
  /**
   * @deprecated This method has been removed in JSZip 3.0, please check the upgrade guide.
   */
  generate: function() {
    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
  },
  /**
   * Generate the complete zip file as an internal stream.
   * @param {Object} options the options to generate the zip file :
   * - compression, "STORE" by default.
   * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
   * @return {StreamHelper} the streamed zip file.
   */
  generateInternalStream: function(e) {
    var r, t = {};
    try {
      if (t = jt.extend(e || {}, {
        streamFiles: !1,
        compression: "STORE",
        compressionOptions: null,
        type: "",
        platform: "DOS",
        comment: null,
        mimeType: "application/zip",
        encodeFileName: du.utf8encode
      }), t.type = t.type.toLowerCase(), t.compression = t.compression.toUpperCase(), t.type === "binarystring" && (t.type = "string"), !t.type)
        throw new Error("No output type specified.");
      jt.checkSupport(t.type), (t.platform === "darwin" || t.platform === "freebsd" || t.platform === "linux" || t.platform === "sunos") && (t.platform = "UNIX"), t.platform === "win32" && (t.platform = "DOS");
      var i = t.comment || this.comment || "";
      r = pu.generateWorker(this, t, i);
    } catch (a) {
      r = new Zo("error"), r.error(a);
    }
    return new cu(r, t.type || "string", t.mimeType);
  },
  /**
   * Generate the complete zip file asynchronously.
   * @see generateInternalStream
   */
  generateAsync: function(e, r) {
    return this.generateInternalStream(e).accumulate(r);
  },
  /**
   * Generate the complete zip file asynchronously.
   * @see generateInternalStream
   */
  generateNodeStream: function(e, r) {
    return e = e || {}, e.type || (e.type = "nodebuffer"), this.generateInternalStream(e).toNodejsStream(r);
  }
}, wu = mu, bu = ee();
function Yo(e) {
  this.data = e, this.length = e.length, this.index = 0, this.zero = 0;
}
Yo.prototype = {
  /**
   * Check that the offset will not go too far.
   * @param {string} offset the additional offset to check.
   * @throws {Error} an Error if the offset is out of bounds.
   */
  checkOffset: function(e) {
    this.checkIndex(this.index + e);
  },
  /**
   * Check that the specified index will not be too far.
   * @param {string} newIndex the index to check.
   * @throws {Error} an Error if the index is out of bounds.
   */
  checkIndex: function(e) {
    if (this.length < this.zero + e || e < 0)
      throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e + "). Corrupted zip ?");
  },
  /**
   * Change the index.
   * @param {number} newIndex The new index.
   * @throws {Error} if the new index is out of the data.
   */
  setIndex: function(e) {
    this.checkIndex(e), this.index = e;
  },
  /**
   * Skip the next n bytes.
   * @param {number} n the number of bytes to skip.
   * @throws {Error} if the new index is out of the data.
   */
  skip: function(e) {
    this.setIndex(this.index + e);
  },
  /**
   * Get the byte at the specified index.
   * @param {number} i the index to use.
   * @return {number} a byte.
   */
  byteAt: function() {
  },
  /**
   * Get the next number with a given byte size.
   * @param {number} size the number of bytes to read.
   * @return {number} the corresponding number.
   */
  readInt: function(e) {
    var r = 0, t;
    for (this.checkOffset(e), t = this.index + e - 1; t >= this.index; t--)
      r = (r << 8) + this.byteAt(t);
    return this.index += e, r;
  },
  /**
   * Get the next string with a given byte size.
   * @param {number} size the number of bytes to read.
   * @return {string} the corresponding string.
   */
  readString: function(e) {
    return bu.transformTo("string", this.readData(e));
  },
  /**
   * Get raw data without conversion, <size> bytes.
   * @param {number} size the number of bytes to read.
   * @return {Object} the raw data, implementation specific.
   */
  readData: function() {
  },
  /**
   * Find the last occurrence of a zip signature (4 bytes).
   * @param {string} sig the signature to find.
   * @return {number} the index of the last occurrence, -1 if not found.
   */
  lastIndexOfSignature: function() {
  },
  /**
   * Read the signature (4 bytes) at the current position and compare it with sig.
   * @param {string} sig the expected signature
   * @return {boolean} true if the signature matches, false otherwise.
   */
  readAndCheckSignature: function() {
  },
  /**
   * Get the next date.
   * @return {Date} the date.
   */
  readDate: function() {
    var e = this.readInt(4);
    return new Date(Date.UTC(
      (e >> 25 & 127) + 1980,
      // year
      (e >> 21 & 15) - 1,
      // month
      e >> 16 & 31,
      // day
      e >> 11 & 31,
      // hour
      e >> 5 & 63,
      // minute
      (e & 31) << 1
    ));
  }
};
var Ko = Yo, Vo = Ko, yu = ee();
function Ot(e) {
  Vo.call(this, e);
  for (var r = 0; r < this.data.length; r++)
    e[r] = e[r] & 255;
}
yu.inherits(Ot, Vo);
Ot.prototype.byteAt = function(e) {
  return this.data[this.zero + e];
};
Ot.prototype.lastIndexOfSignature = function(e) {
  for (var r = e.charCodeAt(0), t = e.charCodeAt(1), i = e.charCodeAt(2), a = e.charCodeAt(3), n = this.length - 4; n >= 0; --n)
    if (this.data[n] === r && this.data[n + 1] === t && this.data[n + 2] === i && this.data[n + 3] === a)
      return n - this.zero;
  return -1;
};
Ot.prototype.readAndCheckSignature = function(e) {
  var r = e.charCodeAt(0), t = e.charCodeAt(1), i = e.charCodeAt(2), a = e.charCodeAt(3), n = this.readData(4);
  return r === n[0] && t === n[1] && i === n[2] && a === n[3];
};
Ot.prototype.readData = function(e) {
  if (this.checkOffset(e), e === 0)
    return [];
  var r = this.data.slice(this.zero + this.index, this.zero + this.index + e);
  return this.index += e, r;
};
var Xo = Ot, Jo = Ko, xu = ee();
function Dt(e) {
  Jo.call(this, e);
}
xu.inherits(Dt, Jo);
Dt.prototype.byteAt = function(e) {
  return this.data.charCodeAt(this.zero + e);
};
Dt.prototype.lastIndexOfSignature = function(e) {
  return this.data.lastIndexOf(e) - this.zero;
};
Dt.prototype.readAndCheckSignature = function(e) {
  var r = this.readData(4);
  return e === r;
};
Dt.prototype.readData = function(e) {
  this.checkOffset(e);
  var r = this.data.slice(this.zero + this.index, this.zero + this.index + e);
  return this.index += e, r;
};
var ku = Dt, Qo = Xo, Su = ee();
function Ji(e) {
  Qo.call(this, e);
}
Su.inherits(Ji, Qo);
Ji.prototype.readData = function(e) {
  if (this.checkOffset(e), e === 0)
    return new Uint8Array(0);
  var r = this.data.subarray(this.zero + this.index, this.zero + this.index + e);
  return this.index += e, r;
};
var es = Ji, ts = es, Eu = ee();
function Qi(e) {
  ts.call(this, e);
}
Eu.inherits(Qi, ts);
Qi.prototype.readData = function(e) {
  this.checkOffset(e);
  var r = this.data.slice(this.zero + this.index, this.zero + this.index + e);
  return this.index += e, r;
};
var Cu = Qi, pr = ee(), Ca = ne, Tu = Xo, Au = ku, Ru = Cu, Ou = es, rs = function(e) {
  var r = pr.getTypeOf(e);
  return pr.checkSupport(r), r === "string" && !Ca.uint8array ? new Au(e) : r === "nodebuffer" ? new Ru(e) : Ca.uint8array ? new Ou(pr.transformTo("uint8array", e)) : new Tu(pr.transformTo("array", e));
}, yi = rs, je = ee(), Du = Zi, Ta = Pi, _r = St, gr = Fr, Iu = ne, Bu = 0, Fu = 3, zu = function(e) {
  for (var r in gr)
    if (Object.prototype.hasOwnProperty.call(gr, r) && gr[r].magic === e)
      return gr[r];
  return null;
};
function is(e, r) {
  this.options = e, this.loadOptions = r;
}
is.prototype = {
  /**
   * say if the file is encrypted.
   * @return {boolean} true if the file is encrypted, false otherwise.
   */
  isEncrypted: function() {
    return (this.bitFlag & 1) === 1;
  },
  /**
   * say if the file has utf-8 filename/comment.
   * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
   */
  useUTF8: function() {
    return (this.bitFlag & 2048) === 2048;
  },
  /**
   * Read the local part of a zip file and add the info in this object.
   * @param {DataReader} reader the reader to use.
   */
  readLocalPart: function(e) {
    var r, t;
    if (e.skip(22), this.fileNameLength = e.readInt(2), t = e.readInt(2), this.fileName = e.readData(this.fileNameLength), e.skip(t), this.compressedSize === -1 || this.uncompressedSize === -1)
      throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
    if (r = zu(this.compressionMethod), r === null)
      throw new Error("Corrupted zip : compression " + je.pretty(this.compressionMethod) + " unknown (inner file : " + je.transformTo("string", this.fileName) + ")");
    this.decompressed = new Du(this.compressedSize, this.uncompressedSize, this.crc32, r, e.readData(this.compressedSize));
  },
  /**
   * Read the central part of a zip file and add the info in this object.
   * @param {DataReader} reader the reader to use.
   */
  readCentralPart: function(e) {
    this.versionMadeBy = e.readInt(2), e.skip(2), this.bitFlag = e.readInt(2), this.compressionMethod = e.readString(2), this.date = e.readDate(), this.crc32 = e.readInt(4), this.compressedSize = e.readInt(4), this.uncompressedSize = e.readInt(4);
    var r = e.readInt(2);
    if (this.extraFieldsLength = e.readInt(2), this.fileCommentLength = e.readInt(2), this.diskNumberStart = e.readInt(2), this.internalFileAttributes = e.readInt(2), this.externalFileAttributes = e.readInt(4), this.localHeaderOffset = e.readInt(4), this.isEncrypted())
      throw new Error("Encrypted zip are not supported");
    e.skip(r), this.readExtraFields(e), this.parseZIP64ExtraField(e), this.fileComment = e.readData(this.fileCommentLength);
  },
  /**
   * Parse the external file attributes and get the unix/dos permissions.
   */
  processAttributes: function() {
    this.unixPermissions = null, this.dosPermissions = null;
    var e = this.versionMadeBy >> 8;
    this.dir = !!(this.externalFileAttributes & 16), e === Bu && (this.dosPermissions = this.externalFileAttributes & 63), e === Fu && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), !this.dir && this.fileNameStr.slice(-1) === "/" && (this.dir = !0);
  },
  /**
   * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
   * @param {DataReader} reader the reader to use.
   */
  parseZIP64ExtraField: function() {
    if (this.extraFields[1]) {
      var e = yi(this.extraFields[1].value);
      this.uncompressedSize === je.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8)), this.compressedSize === je.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8)), this.localHeaderOffset === je.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8)), this.diskNumberStart === je.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4));
    }
  },
  /**
   * Read the central part of a zip file and add the info in this object.
   * @param {DataReader} reader the reader to use.
   */
  readExtraFields: function(e) {
    var r = e.index + this.extraFieldsLength, t, i, a;
    for (this.extraFields || (this.extraFields = {}); e.index + 4 < r; )
      t = e.readInt(2), i = e.readInt(2), a = e.readData(i), this.extraFields[t] = {
        id: t,
        length: i,
        value: a
      };
    e.setIndex(r);
  },
  /**
   * Apply an UTF8 transformation if needed.
   */
  handleUTF8: function() {
    var e = Iu.uint8array ? "uint8array" : "array";
    if (this.useUTF8())
      this.fileNameStr = _r.utf8decode(this.fileName), this.fileCommentStr = _r.utf8decode(this.fileComment);
    else {
      var r = this.findExtraFieldUnicodePath();
      if (r !== null)
        this.fileNameStr = r;
      else {
        var t = je.transformTo(e, this.fileName);
        this.fileNameStr = this.loadOptions.decodeFileName(t);
      }
      var i = this.findExtraFieldUnicodeComment();
      if (i !== null)
        this.fileCommentStr = i;
      else {
        var a = je.transformTo(e, this.fileComment);
        this.fileCommentStr = this.loadOptions.decodeFileName(a);
      }
    }
  },
  /**
   * Find the unicode path declared in the extra field, if any.
   * @return {String} the unicode path, null otherwise.
   */
  findExtraFieldUnicodePath: function() {
    var e = this.extraFields[28789];
    if (e) {
      var r = yi(e.value);
      return r.readInt(1) !== 1 || Ta(this.fileName) !== r.readInt(4) ? null : _r.utf8decode(r.readData(e.length - 5));
    }
    return null;
  },
  /**
   * Find the unicode comment declared in the extra field, if any.
   * @return {String} the unicode comment, null otherwise.
   */
  findExtraFieldUnicodeComment: function() {
    var e = this.extraFields[25461];
    if (e) {
      var r = yi(e.value);
      return r.readInt(1) !== 1 || Ta(this.fileComment) !== r.readInt(4) ? null : _r.utf8decode(r.readData(e.length - 5));
    }
    return null;
  }
};
var Nu = is, Lu = rs, Ne = ee(), ke = Ye, Pu = Nu, $u = ne;
function ns(e) {
  this.files = [], this.loadOptions = e;
}
ns.prototype = {
  /**
   * Check that the reader is on the specified signature.
   * @param {string} expectedSignature the expected signature.
   * @throws {Error} if it is an other signature.
   */
  checkSignature: function(e) {
    if (!this.reader.readAndCheckSignature(e)) {
      this.reader.index -= 4;
      var r = this.reader.readString(4);
      throw new Error("Corrupted zip or bug: unexpected signature (" + Ne.pretty(r) + ", expected " + Ne.pretty(e) + ")");
    }
  },
  /**
   * Check if the given signature is at the given index.
   * @param {number} askedIndex the index to check.
   * @param {string} expectedSignature the signature to expect.
   * @return {boolean} true if the signature is here, false otherwise.
   */
  isSignature: function(e, r) {
    var t = this.reader.index;
    this.reader.setIndex(e);
    var i = this.reader.readString(4), a = i === r;
    return this.reader.setIndex(t), a;
  },
  /**
   * Read the end of the central directory.
   */
  readBlockEndOfCentral: function() {
    this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
    var e = this.reader.readData(this.zipCommentLength), r = $u.uint8array ? "uint8array" : "array", t = Ne.transformTo(r, e);
    this.zipComment = this.loadOptions.decodeFileName(t);
  },
  /**
   * Read the end of the Zip 64 central directory.
   * Not merged with the method readEndOfCentral :
   * The end of central can coexist with its Zip64 brother,
   * I don't want to read the wrong number of bytes !
   */
  readBlockZip64EndOfCentral: function() {
    this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
    for (var e = this.zip64EndOfCentralSize - 44, r = 0, t, i, a; r < e; )
      t = this.reader.readInt(2), i = this.reader.readInt(4), a = this.reader.readData(i), this.zip64ExtensibleData[t] = {
        id: t,
        length: i,
        value: a
      };
  },
  /**
   * Read the end of the Zip 64 central directory locator.
   */
  readBlockZip64EndOfCentralLocator: function() {
    if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), this.disksCount > 1)
      throw new Error("Multi-volumes zip are not supported");
  },
  /**
   * Read the local files, based on the offset read in the central part.
   */
  readLocalFiles: function() {
    var e, r;
    for (e = 0; e < this.files.length; e++)
      r = this.files[e], this.reader.setIndex(r.localHeaderOffset), this.checkSignature(ke.LOCAL_FILE_HEADER), r.readLocalPart(this.reader), r.handleUTF8(), r.processAttributes();
  },
  /**
   * Read the central directory.
   */
  readCentralDir: function() {
    var e;
    for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(ke.CENTRAL_FILE_HEADER); )
      e = new Pu({
        zip64: this.zip64
      }, this.loadOptions), e.readCentralPart(this.reader), this.files.push(e);
    if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0)
      throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
  },
  /**
   * Read the end of central directory.
   */
  readEndOfCentral: function() {
    var e = this.reader.lastIndexOfSignature(ke.CENTRAL_DIRECTORY_END);
    if (e < 0) {
      var r = !this.isSignature(0, ke.LOCAL_FILE_HEADER);
      throw r ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
    }
    this.reader.setIndex(e);
    var t = e;
    if (this.checkSignature(ke.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === Ne.MAX_VALUE_16BITS || this.diskWithCentralDirStart === Ne.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === Ne.MAX_VALUE_16BITS || this.centralDirRecords === Ne.MAX_VALUE_16BITS || this.centralDirSize === Ne.MAX_VALUE_32BITS || this.centralDirOffset === Ne.MAX_VALUE_32BITS) {
      if (this.zip64 = !0, e = this.reader.lastIndexOfSignature(ke.ZIP64_CENTRAL_DIRECTORY_LOCATOR), e < 0)
        throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
      if (this.reader.setIndex(e), this.checkSignature(ke.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, ke.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(ke.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
        throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
      this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(ke.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
    }
    var i = this.centralDirOffset + this.centralDirSize;
    this.zip64 && (i += 20, i += 12 + this.zip64EndOfCentralSize);
    var a = t - i;
    if (a > 0)
      this.isSignature(t, ke.CENTRAL_FILE_HEADER) || (this.reader.zero = a);
    else if (a < 0)
      throw new Error("Corrupted zip: missing " + Math.abs(a) + " bytes.");
  },
  prepareReader: function(e) {
    this.reader = Lu(e);
  },
  /**
   * Read a zip file and create ZipEntries.
   * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
   */
  load: function(e) {
    this.prepareReader(e), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
  }
};
var Mu = ns, xi = ee(), kr = Vt, ju = St, Uu = Mu, Zu = Xa, Aa = Dr;
function Wu(e) {
  return new kr.Promise(function(r, t) {
    var i = e.decompressed.getContentWorker().pipe(new Zu());
    i.on("error", function(a) {
      t(a);
    }).on("end", function() {
      i.streamInfo.crc32 !== e.decompressed.crc32 ? t(new Error("Corrupted zip : CRC32 mismatch")) : r();
    }).resume();
  });
}
var Hu = function(e, r) {
  var t = this;
  return r = xi.extend(r || {}, {
    base64: !1,
    checkCRC32: !1,
    optimizedBinaryString: !1,
    createFolders: !1,
    decodeFileName: ju.utf8decode
  }), Aa.isNode && Aa.isStream(e) ? kr.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : xi.prepareContent("the loaded zip file", e, !0, r.optimizedBinaryString, r.base64).then(function(i) {
    var a = new Uu(r);
    return a.load(i), a;
  }).then(function(a) {
    var n = [kr.Promise.resolve(a)], o = a.files;
    if (r.checkCRC32)
      for (var s = 0; s < o.length; s++)
        n.push(Wu(o[s]));
    return kr.Promise.all(n);
  }).then(function(a) {
    for (var n = a.shift(), o = n.files, s = 0; s < o.length; s++) {
      var c = o[s], f = c.fileNameStr, l = xi.resolve(c.fileNameStr);
      t.file(l, c.decompressed, {
        binary: !0,
        optimizedBinaryString: !0,
        date: c.date,
        dir: c.dir,
        comment: c.fileCommentStr.length ? c.fileCommentStr : null,
        unixPermissions: c.unixPermissions,
        dosPermissions: c.dosPermissions,
        createFolders: r.createFolders
      }), c.dir || (t.file(l).unsafeOriginalName = f);
    }
    return n.zipComment.length && (t.comment = n.zipComment), t;
  });
};
function we() {
  if (!(this instanceof we))
    return new we();
  if (arguments.length)
    throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
  this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
    var e = new we();
    for (var r in this)
      typeof this[r] != "function" && (e[r] = this[r]);
    return e;
  };
}
we.prototype = wu;
we.prototype.loadAsync = Hu;
we.support = ne;
we.defaults = xe;
we.version = "3.10.1";
we.loadAsync = function(e, r) {
  return new we().loadAsync(e, r);
};
we.external = Vt;
var qu = we, Ut = Ar, as = Tr, os = parseInt("0777", 8), Gu = bt.mkdirp = bt.mkdirP = bt;
function bt(e, r, t, i) {
  typeof r == "function" ? (t = r, r = {}) : (!r || typeof r != "object") && (r = { mode: r });
  var a = r.mode, n = r.fs || as;
  a === void 0 && (a = os), i || (i = null);
  var o = t || /* istanbul ignore next */
  function() {
  };
  e = Ut.resolve(e), n.mkdir(e, a, function(s) {
    if (!s)
      return i = i || e, o(null, i);
    switch (s.code) {
      case "ENOENT":
        if (Ut.dirname(e) === e) return o(s);
        bt(Ut.dirname(e), r, function(c, f) {
          c ? o(c, f) : bt(e, r, o, f);
        });
        break;
      default:
        n.stat(e, function(c, f) {
          c || !f.isDirectory() ? o(s, i) : o(null, i);
        });
        break;
    }
  });
}
bt.sync = function e(r, t, i) {
  (!t || typeof t != "object") && (t = { mode: t });
  var a = t.mode, n = t.fs || as;
  a === void 0 && (a = os), i || (i = null), r = Ut.resolve(r);
  try {
    n.mkdirSync(r, a), i = i || r;
  } catch (s) {
    switch (s.code) {
      case "ENOENT":
        i = e(Ut.dirname(r), t, i), e(r, t, i);
        break;
      default:
        var o;
        try {
          o = n.statSync(r);
        } catch {
          throw s;
        }
        if (!o.isDirectory()) throw s;
        break;
    }
  }
  return i;
};
var ss = { exports: {} };
(function() {
  var e, r = null, t = typeof window == "object" ? window : se, i = !1, a = t.process, n = Array, o = Error, s = 0, c = 1, f = 2, l = "Symbol", w = "iterator", h = "species", d = l + "(" + h + ")", g = "return", m = "_uh", C = "_pt", u = "_st", _ = "Invalid this", b = "Invalid argument", S = `
From previous `, E = "Chaining cycle detected for promise", F = "Uncaught (in promise)", z = "rejectionHandled", B = "unhandledRejection", L, j, D = { e: r }, J = function() {
  }, fe = /^.+\/node_modules\/yaku\/.+\n?/mg, U = ss.exports = function(T) {
    var O = this, N;
    if (!x(O) || O._s !== e)
      throw he(_);
    if (O._s = f, i && (O[C] = v()), T !== J) {
      if (!y(T))
        throw he(b);
      N = re(T)(
        M(O, c),
        M(O, s)
      ), N === D && ie(O, s, N.e);
    }
  };
  U.default = U, $e(U, {
    /**
     * Appends fulfillment and rejection handlers to the promise,
     * and returns a new promise resolving to the return value of the called handler.
     * @param  {Function} onFulfilled Optional. Called when the Promise is resolved.
     * @param  {Function} onRejected  Optional. Called when the Promise is rejected.
     * @return {Yaku} It will return a new Yaku which will resolve or reject after
     * @example
     * the current Promise.
     * ```js
     * var Promise = require('yaku');
     * var p = Promise.resolve(10);
     *
     * p.then((v) => {
     *     console.log(v);
     * });
     * ```
     */
    then: function(T, O) {
      if (this._s === void 0) throw he();
      return lt(
        this,
        P(U.speciesConstructor(this, U)),
        T,
        O
      );
    },
    /**
     * The `catch()` method returns a Promise and deals with rejected cases only.
     * It behaves the same as calling `Promise.prototype.then(undefined, onRejected)`.
     * @param  {Function} onRejected A Function called when the Promise is rejected.
     * This function has one argument, the rejection reason.
     * @return {Yaku} A Promise that deals with rejected cases only.
     * @example
     * ```js
     * var Promise = require('yaku');
     * var p = Promise.reject(new Error("ERR"));
     *
     * p['catch']((v) => {
     *     console.log(v);
     * });
     * ```
     */
    catch: function(k) {
      return this.then(e, k);
    },
    // The number of current promises that attach to this Yaku instance.
    _pCount: 0,
    // The parent Yaku.
    _pre: r,
    // A unique type flag, it helps different versions of Yaku know each other.
    _Yaku: 1
  }), U.resolve = function(T) {
    return W(T) ? T : Ke(P(this), T);
  }, U.reject = function(T) {
    return ie(P(this), s, T);
  }, U.race = function(T) {
    var O = this, N = P(O), X = function(_e) {
      ie(N, c, _e);
    }, K = function(_e) {
      ie(N, s, _e);
    }, Ae = re(Te)(T, function(_e) {
      O.resolve(_e).then(X, K);
    });
    return Ae === D ? O.reject(Ae.e) : N;
  }, U.all = function(T) {
    var O = this, N = P(O), X = [], K;
    function Ae(_e) {
      ie(N, s, _e);
    }
    return K = re(Te)(T, function(_e, ws) {
      O.resolve(_e).then(function(bs) {
        X[ws] = bs, --K || ie(N, c, X);
      }, Ae);
    }), K === D ? O.reject(K.e) : (K || ie(N, c, []), N);
  }, U.Symbol = t[l] || {}, re(function() {
    Object.defineProperty(U, Fe(), {
      get: function() {
        return this;
      }
    });
  })(), U.speciesConstructor = function(k, T) {
    var O = k.constructor;
    return O && O[Fe()] || T;
  }, U.unhandledRejection = function(k, T) {
    try {
      t.console.error(
        F,
        i ? T.longStack : It(k, T)
      );
    } catch {
    }
  }, U.rejectionHandled = J, U.enableLongStackTrace = function() {
    i = !0;
  }, U.nextTick = a ? a.nextTick : function(k) {
    setTimeout(k);
  }, U._Yaku = 1;
  function Fe() {
    return U[l][h] || d;
  }
  function $e(k, T) {
    for (var O in T)
      k.prototype[O] = T[O];
    return k;
  }
  function x(k) {
    return k && typeof k == "object";
  }
  function y(k) {
    return typeof k == "function";
  }
  function R(k, T) {
    return k instanceof T;
  }
  function $(k) {
    return R(k, o);
  }
  function Z(k, T, O) {
    if (!T(k)) throw he(O);
  }
  function G() {
    try {
      return L.apply(j, arguments);
    } catch (k) {
      return D.e = k, D;
    }
  }
  function re(k, T) {
    return L = k, j = T, G;
  }
  function ce(k, T) {
    var O = n(k), N = 0;
    function X() {
      for (var K = 0; K < N; )
        T(O[K], O[K + 1]), O[K++] = e, O[K++] = e;
      N = 0, O.length > k && (O.length = k);
    }
    return function(K, Ae) {
      O[N++] = K, O[N++] = Ae, N === 2 && U.nextTick(X);
    };
  }
  function Te(k, T) {
    var O, N = 0, X, K, Ae;
    if (!k) throw he(b);
    var _e = k[U[l][w]];
    if (y(_e))
      X = _e.call(k);
    else if (y(k.next))
      X = k;
    else if (R(k, n)) {
      for (O = k.length; N < O; )
        T(k[N], N++);
      return N;
    } else
      throw he(b);
    for (; !(K = X.next()).done; )
      if (Ae = re(T)(K.value, N++), Ae === D)
        throw y(X[g]) && X[g](), Ae.e;
    return N;
  }
  function he(k) {
    return new TypeError(k);
  }
  function v(k) {
    return (k ? "" : S) + new o().stack;
  }
  var p = ce(999, function(k, T) {
    var O, N;
    if (N = k._s ? T._onFulfilled : T._onRejected, N === e) {
      ie(T, k._s, k._v);
      return;
    }
    if (O = re(Ur)(N, k._v), O === D) {
      ie(T, s, O.e);
      return;
    }
    Ke(T, O);
  }), A = ce(9, function(k) {
    ut(k) || (k[m] = 1, I(B, k));
  });
  function I(k, T) {
    var O = "on" + k.toLowerCase(), N = t[O];
    a && a.listeners(k).length ? k === B ? a.emit(k, T._v, T) : a.emit(k, T) : N ? N({ reason: T._v, promise: T }) : U[k](T._v, T);
  }
  function W(k) {
    return k && k._Yaku;
  }
  function P(k) {
    if (W(k)) return new k(J);
    var T, O, N;
    return T = new k(function(X, K) {
      if (T) throw he();
      O = X, N = K;
    }), Z(O, y), Z(N, y), T;
  }
  function M(k, T) {
    return function(O) {
      i && (k[u] = v(!0)), T === c ? Ke(k, O) : ie(k, T, O);
    };
  }
  function lt(k, T, O, N) {
    return y(O) && (T._onFulfilled = O), y(N) && (k[m] && I(z, k), T._onRejected = N), i && (T._pre = k), k[k._pCount++] = T, k._s !== f && p(k, T), T;
  }
  function ut(k) {
    if (k._umark)
      return !0;
    k._umark = !0;
    for (var T = 0, O = k._pCount, N; T < O; )
      if (N = k[T++], N._onRejected || ut(N)) return !0;
  }
  function It(k, T) {
    var O = [];
    function N(X) {
      return O.push(X.replace(/^\s+|\s+$/g, ""));
    }
    return i && (T[u] && N(T[u]), function X(K) {
      K && C in K && (X(K._next), N(K[C] + ""), X(K._pre));
    }(T)), (k && k.stack ? k.stack : k) + (`
` + O.join(`
`)).replace(fe, "");
  }
  function Ur(k, T) {
    return k(T);
  }
  function ie(k, T, O) {
    var N = 0, X = k._pCount;
    if (k._s === f)
      for (k._s = T, k._v = O, T === s && (i && $(O) && (O.longStack = It(O, k)), A(k)); N < X; )
        p(k, k[N++]);
    return k;
  }
  function Ke(k, T) {
    if (T === k && T)
      return ie(k, s, he(E)), k;
    if (T !== r && (y(T) || x(T))) {
      var O = re(Bt)(T);
      if (O === D)
        return ie(k, s, O.e), k;
      y(O) ? (i && W(T) && (k._next = T), W(T) ? ht(k, T, O) : U.nextTick(function() {
        ht(k, T, O);
      })) : ie(k, c, T);
    } else
      ie(k, c, T);
    return k;
  }
  function Bt(k) {
    return k.then;
  }
  function ht(k, T, O) {
    var N = re(O, T)(function(X) {
      T && (T = r, Ke(k, X));
    }, function(X) {
      T && (T = r, ie(k, s, X));
    });
    N === D && T && (ie(k, s, N.e), T = r);
  }
})();
var Yu = ss.exports, Ku = Yu, Vu = {
  isFunction: function(e) {
    return typeof e == "function";
  },
  Promise: Ku
}, fs = Vu, vt = fs.isFunction, Xu = function(e, r) {
  return function(t, i, a, n, o) {
    var s = arguments.length, c, f, l, w;
    f = new fs.Promise(function(g, m) {
      l = g, w = m;
    });
    function h(g, m) {
      g == null ? l(m) : w(g);
    }
    switch (s) {
      case 0:
        e.call(r, h);
        break;
      case 1:
        vt(t) ? e.call(r, t) : e.call(r, t, h);
        break;
      case 2:
        vt(i) ? e.call(r, t, i) : e.call(r, t, i, h);
        break;
      case 3:
        vt(a) ? e.call(r, t, i, a) : e.call(r, t, i, a, h);
        break;
      case 4:
        vt(n) ? e.call(r, t, i, a, n) : e.call(r, t, i, a, n, h);
        break;
      case 5:
        vt(o) ? e.call(r, t, i, a, n, o) : e.call(r, t, i, a, n, o, h);
        break;
      default:
        c = new Array(s);
        for (var d = 0; d < s; d++)
          c[d] = arguments[d];
        if (vt(c[s - 1]))
          return e.apply(r, c);
        c[d] = h, e.apply(r, c);
    }
    return f;
  };
}, ls = Tr, Ve = Ar, Ju = qu, Qu = Gu, en = Xu, eh = en(ls.writeFile), th = en(ls.readFile), rh = en(Qu);
function ih(e) {
  function r(f, l, w, h) {
    var d = 0;
    return d += f, d += l << 8, d += w << 16, d += h << 24, d;
  }
  if (e[0] === 80 && e[1] === 75 && e[2] === 3 && e[3] === 4)
    return e;
  if (e[0] !== 67 || e[1] !== 114 || e[2] !== 50 || e[3] !== 52)
    throw new Error("Invalid header: Does not start with Cr24");
  var t = e[4] === 3, i = e[4] === 2;
  if (!i && !t || e[5] || e[6] || e[7])
    throw new Error("Unexpected crx format version number.");
  if (i) {
    var a = r(e[8], e[9], e[10], e[11]), n = r(e[12], e[13], e[14], e[15]), o = 16 + a + n;
    return e.slice(o, e.length);
  }
  var s = r(e[8], e[9], e[10], e[11]), c = 12 + s;
  return e.slice(c, e.length);
}
function nh(e, r) {
  var t = Ve.resolve(e), i = Ve.extname(e), a = Ve.basename(e, i), n = Ve.dirname(e);
  return r = r || Ve.resolve(n, a), th(t).then(function(o) {
    return Ju.loadAsync(ih(o));
  }).then(function(o) {
    var s = Object.keys(o.files);
    return Promise.all(s.map(function(c) {
      var f = !o.files[c].dir, l = Ve.join(r, c), w = f && Ve.dirname(l) || l, h = o.files[c].async("nodebuffer");
      return rh(w).then(function() {
        return f ? h : !1;
      }).then(function(d) {
        return d ? eh(l, d) : !0;
      });
    }));
  });
}
var ah = nh;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.downloadChromeExtension = void 0;
  const r = Tr, t = Ar, i = Fa, a = ah, n = async (o, { forceDownload: s = !1, attempts: c = 5 } = {}) => {
    const f = (0, i.getPath)();
    r.existsSync(f) || await r.promises.mkdir(f, { recursive: !0 });
    const l = t.resolve(`${f}/${o}`);
    if (!r.existsSync(l) || s) {
      r.existsSync(l) && await r.promises.rmdir(l, {
        recursive: !0
      });
      const w = `https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${o}%26uc&prodversion=${process.versions.chrome}`, h = t.resolve(`${l}.crx`);
      try {
        await (0, i.downloadFile)(w, h);
        try {
          return await a(h, l), (0, i.changePermissions)(l, 755), l;
        } catch (d) {
          if (!r.existsSync(t.resolve(l, "manifest.json")))
            throw d;
        }
      } catch (d) {
        if (console.error(`Failed to fetch extension, trying ${c - 1} more times`), c <= 1)
          throw d;
        return await new Promise((g) => setTimeout(g, 200)), await (0, e.downloadChromeExtension)(o, {
          forceDownload: s,
          attempts: c - 1
        });
      }
    }
    return l;
  };
  e.downloadChromeExtension = n;
})(Ba);
Object.defineProperty(ae, "__esModule", { value: !0 });
ae.MOBX_DEVTOOLS = us = ae.REDUX_DEVTOOLS = ae.VUEJS_DEVTOOLS_BETA = ae.VUEJS_DEVTOOLS = ae.JQUERY_DEBUGGER = ae.BACKBONE_DEBUGGER = ae.REACT_DEVELOPER_TOOLS = ae.EMBER_INSPECTOR = void 0;
ae.installExtension = tn;
const oh = Oa, sh = Ba;
async function tn(e, r = {}) {
  const { forceDownload: t, loadExtensionOptions: i, session: a } = r, n = a || oh.session.defaultSession;
  if (process.type !== "browser")
    return Promise.reject(new Error("electron-devtools-installer can only be used from the main process"));
  if (Array.isArray(e))
    return e.reduce((f, l) => f.then(async (w) => {
      const h = await tn(l, r);
      return [...w, h];
    }), Promise.resolve([]));
  let o;
  if (typeof e == "object" && e.id)
    o = e.id;
  else if (typeof e == "string")
    o = e;
  else
    throw new Error(`Invalid extensionReference passed in: "${e}"`);
  const s = n.getAllExtensions().find((f) => f.id === o);
  if (!t && s)
    return s;
  const c = await (0, sh.downloadChromeExtension)(o, {
    forceDownload: t || !1
  });
  if (s != null && s.id) {
    const f = new Promise((l) => {
      const w = (h, d) => {
        d.id === s.id && (n.removeListener("extension-unloaded", w), l());
      };
      n.on("extension-unloaded", w);
    });
    n.removeExtension(s.id), await f;
  }
  return n.loadExtension(c, i);
}
var fh = ae.default = tn;
ae.EMBER_INSPECTOR = {
  id: "bmdblncegkenkacieihfhpjfppoconhi"
};
ae.REACT_DEVELOPER_TOOLS = {
  id: "fmkadmapgofadopljbjfkapdkoienihi"
};
ae.BACKBONE_DEBUGGER = {
  id: "bhljhndlimiafopmmhjlgfpnnchjjbhd"
};
ae.JQUERY_DEBUGGER = {
  id: "dbhhnnnpaeobfddmlalhnehgclcmjimi"
};
ae.VUEJS_DEVTOOLS = {
  id: "nhdogjmejiglipccpnnnanhbledajbpd"
};
ae.VUEJS_DEVTOOLS_BETA = {
  id: "ljjemllljcmogpfapbkkighbhhppjdbg"
};
var us = ae.REDUX_DEVTOOLS = {
  id: "lmhkpmbekcpmknklioeibfkpmmfibljd"
};
ae.MOBX_DEVTOOLS = {
  id: "pfgnfdagidkfgccljigdamigbcnndkod"
};
class Ra {
  constructor(r) {
    rr(this, "buf", []);
    // rolling input buffer
    rr(this, "comb61", []);
    // for fragmented 0x61 bodies
    rr(this, "onDataCallback");
    this.onDataCallback = r;
  }
  setOnDataCallback(r) {
    this.onDataCallback = r;
  }
  push(r) {
    for (const t of r) this.buf.push(t);
    for (; this.buf.length >= 3; ) {
      if (this.buf[0] !== 85) {
        this.buf.shift();
        continue;
      }
      const t = this.buf[1];
      if (t === 97) {
        if (this.buf.length >= 20) {
          const i = this.buf.slice(0, 20);
          this.decode61(i.slice(2, 20)), this.buf.splice(0, 20);
          continue;
        }
        if (this.buf.length > 2) {
          let i = 0;
          for (let a = 2; a < this.buf.length && this.buf[a] !== 85; a++)
            i++;
          if (i > 0) {
            const a = this.buf.slice(2, 2 + i);
            for (this.comb61.push(...a), this.buf.splice(0, 2 + i); this.comb61.length >= 18; ) {
              const n = this.comb61.slice(0, 18);
              this.decode61(n), this.comb61 = this.comb61.slice(18);
            }
            continue;
          }
          break;
        }
        break;
      }
      if (t >= 80 && t <= 90) {
        if (this.buf.length < 11) break;
        const i = this.buf.slice(0, 11);
        if (i.slice(0, 10).reduce((n, o) => n + o & 255, 0) !== i[10]) {
          this.buf.shift();
          continue;
        }
        this.decodeStd(i), this.buf.splice(0, 11);
        continue;
      }
      if (t === 113) {
        if (this.buf.length >= 22) {
          const i = this.buf.slice(0, 22);
          if (i.slice(0, 21).reduce((n, o) => n + o & 255, 0) === i[21]) {
            this.decode71(i.slice(2, 20)), this.buf.splice(0, 22);
            continue;
          }
        }
        if (this.buf.length >= 20) {
          const i = this.buf.slice(0, 20);
          this.decode71(i.slice(2, 20)), this.buf.splice(0, 20);
          continue;
        }
        break;
      }
      this.buf.shift();
    }
  }
  i16(r, t) {
    let i = t << 8 | r;
    return i & 32768 && (i -= 65536), i;
  }
  decode61(r) {
    var g;
    const t = (m) => this.i16(r[m], r[m + 1]), a = t(0) / 32768 * 16 * 9.80665, n = t(2) / 32768 * 16 * 9.80665, o = t(4) / 32768 * 16 * 9.80665, s = t(6) / 32768 * 2e3, c = t(8) / 32768 * 2e3, f = t(10) / 32768 * 2e3, l = t(12) / 32768 * 180, w = t(14) / 32768 * 180, h = t(16) / 32768 * 180, d = {
      acc: { x: a, y: n, z: o },
      gyro: { x: s, y: c, z: f },
      angle: { roll: l, pitch: w, yaw: h }
    };
    (g = this.onDataCallback) == null || g.call(this, d);
  }
  decodeStd(r) {
    var o;
    const t = r[1], i = (s) => r[2 + s], a = (s) => this.i16(i(s), i(s + 1)), n = {};
    switch (t) {
      case 81: {
        n.acc = {
          x: a(0) / 32768 * 16 * 9.80665,
          y: a(2) / 32768 * 16 * 9.80665,
          z: a(4) / 32768 * 16 * 9.80665
        };
        break;
      }
      case 82: {
        n.gyro = {
          x: a(0) / 32768 * 2e3,
          y: a(2) / 32768 * 2e3,
          z: a(4) / 32768 * 2e3
        };
        break;
      }
      case 83: {
        n.angle = {
          roll: a(0) / 32768 * 180,
          pitch: a(2) / 32768 * 180,
          yaw: a(4) / 32768 * 180
        };
        break;
      }
      case 84: {
        n.mag = { x: a(0), y: a(2), z: a(4) };
        break;
      }
      case 89: {
        n.quat = {
          w: a(0) / 32768,
          x: a(2) / 32768,
          y: a(4) / 32768,
          z: a(6) / 32768
        };
        break;
      }
    }
    (n.acc || n.gyro || n.angle || n.mag || n.quat) && ((o = this.onDataCallback) == null || o.call(this, n));
  }
  decode71(r) {
    var o;
    const t = {
      Quaternion: 0,
      Magnetometer: 1,
      Temperature: 2
    }, i = r[0], a = (s) => this.i16(r[s], r[s + 1]), n = {};
    switch (i) {
      case t.Quaternion:
        n.quat = {
          w: a(2) / 32768,
          x: a(4) / 32768,
          y: a(6) / 32768,
          z: a(8) / 32768
        };
        break;
      case t.Magnetometer:
        n.mag = {
          x: a(2),
          y: a(4),
          z: a(6)
        };
        break;
      case t.Temperature:
        n.temp = a(2) / 100;
        break;
    }
    (n.acc || n.gyro || n.angle || n.mag || n.quat || n.temp !== void 0) && ((o = this.onDataCallback) == null || o.call(this, n));
  }
  // Convert WIT-Motion data to our standard IMU format
  static processWitMotionData(r) {
    var t;
    try {
      const i = {
        heading: 0
      };
      if (((t = r.angle) == null ? void 0 : t.yaw) !== void 0)
        i.heading = (r.angle.yaw % 360 + 360) % 360, i.pitch = r.angle.pitch, i.roll = r.angle.roll;
      else if (r.quat) {
        const { w: a, x: n, y: o, z: s } = r.quat, c = 2 * (a * s + n * o), f = 1 - 2 * (o * o + s * s), l = Math.atan2(c, f) * 180 / Math.PI;
        i.heading = (l % 360 + 360) % 360;
      } else
        return null;
      return r.acc && (i.acceleration = r.acc), r.gyro && (i.gyroscope = r.gyro), r.mag && (i.magnetometer = r.mag), r.quat && (i.quaternion = r.quat), r.temp !== void 0 && (i.temperature = r.temp), i;
    } catch (i) {
      return console.error("Error processing WIT-Motion data:", i), null;
    }
  }
}
const hs = Ss(import.meta.url), { SerialPort: ds } = hs("serialport"), { ipcMain: jr } = hs("electron"), cs = Qe.dirname(ks(import.meta.url)), Bi = !xt.isPackaged || process.env.NODE_ENV === "development";
process.env.APP_ROOT = Qe.join(cs, "..");
const Fi = process.env.VITE_DEV_SERVER_URL, vs = Qe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Fi ? Qe.join(process.env.APP_ROOT, "public") : vs;
let Y = null;
xt.commandLine.appendSwitch("disable-usb-blocklist");
const ps = {
  imu: null,
  primaryGNSS: null,
  secondaryGNSS: null
}, lh = new Ra((e) => {
  const r = Ra.processWitMotionData(e);
  r && Y && Y.webContents.send("serial-data", {
    portType: "imu",
    data: r,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}), zi = {
  imu: !1,
  primaryGNSS: !1,
  secondaryGNSS: !1
};
function _s(e) {
  return ps[e] || null;
}
function gs(e, r) {
  ps[e] = r;
}
function yt(e, r) {
  zi[e] = r, Y && Y.webContents.send("connection-status-update", zi);
}
function uh(e, r) {
  e.on("data", (t) => {
    r === "primaryGNSS" || r === "secondaryGNSS" ? t.toString().split(/\r?\n/).forEach((a) => {
      const n = a.trim();
      if (n && n.startsWith("$") && (n.startsWith("$GNGGA") || n.startsWith("$GPGGA"))) {
        const o = n.split(",");
        if (o.length > 5) {
          const s = o[2], c = o[3], f = o[4], l = o[5];
          if (s && f) {
            const w = parseFloat(s.slice(0, 2)), h = parseFloat(s.slice(2)), d = parseFloat(f.slice(0, 3)), g = parseFloat(f.slice(3));
            let m = w + h / 60, C = d + g / 60;
            c === "S" && (m = -m), l === "W" && (C = -C);
            const u = {
              portType: r,
              data: {
                latitude: m,
                longitude: C,
                raw: n
              },
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            };
            Y && Y.webContents.send("serial-data", u);
          }
        }
      }
    }) : r === "imu" ? lh.push(t) : Y && Y.webContents.send("serial-data", {
      portType: r,
      data: t.toString(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }), e.on("close", () => yt(r, !1)), e.on("error", (t) => {
    yt(r, !1), Y && Y.webContents.send(
      "navigation-error",
      `${r} error: ${t.message}`
    );
  });
}
function ms() {
  Y = new Da({
    width: 2e3,
    height: 980,
    icon: Qe.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: Qe.join(cs, "preload.mjs"),
      contextIsolation: !0,
      devTools: Bi
    }
  });
  let e;
  const r = Y.webContents.session;
  r.on("select-usb-device", (t, i, a) => {
    if (r.on("usb-device-added", (n, o) => {
      console.log("usb-device-added FIRED WITH", o);
    }), r.on("usb-device-removed", (n, o) => {
      console.log("usb-device-removed FIRED WITH", o);
    }), t.preventDefault(), i.deviceList && i.deviceList.length > 0) {
      const n = i.deviceList.find((o) => !e || o.deviceId !== e.deviceId);
      n ? a(n.deviceId) : a();
    }
  }), r.setPermissionCheckHandler(
    (t, i, a, n) => i === "usb" && n.securityOrigin === "file:///"
  ), r.setDevicePermissionHandler((t) => t.deviceType === "usb" && t.origin === "file://" ? e ? !1 : (e = t.device, !0) : !1), r.setUSBProtectedClassesHandler((t) => t.protectedClasses.filter((i) => i.indexOf("audio") === -1)), Y.webContents.on("did-finish-load", () => {
    Y == null || Y.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), Bi && (Y == null || Y.webContents.openDevTools());
  }), Fi ? Y.loadURL(Fi) : Y.loadFile(Qe.join(vs, "index.html"));
}
xt.on("window-all-closed", () => {
  process.platform !== "darwin" && (xt.quit(), Y = null);
});
xt.on("activate", () => {
  Da.getAllWindows().length === 0 && ms();
});
xt.whenReady().then(async () => {
  if (Bi)
    try {
      await fh(us, {
        loadExtensionOptions: { allowFileAccess: !0 },
        forceDownload: !0
      }), console.log("Redux DevTools installed");
    } catch (e) {
      console.error("Redux DevTools install failed:", e);
    }
  ms();
});
jr.handle("list-serial-ports", async () => {
  try {
    return await ds.list();
  } catch {
    return [];
  }
});
jr.handle(
  "connect-to-port",
  async (e, { portPath: r, baudRate: t, portType: i }) => {
    try {
      const a = _s(i);
      a && a.isOpen && await new Promise((o) => a.close(o));
      const n = new ds({
        path: r,
        baudRate: t,
        autoOpen: !1
      });
      return n.open((o) => {
        if (o) {
          yt(i, !1), Y && Y.webContents.send(
            "navigation-error",
            `${i} open error: ${o.message}`
          );
          return;
        }
        yt(i, !0);
      }), uh(n, i), gs(i, n), { success: !0, portType: i };
    } catch (a) {
      return yt(i, !1), Y && Y.webContents.send(
        "navigation-error",
        `${i} connect error: ${a.message}`
      ), { success: !1, portType: i, error: a.message };
    }
  }
);
jr.handle("restart-port", async (e, r) => {
  try {
    const t = _s(r);
    return t && t.isOpen && await new Promise((i) => t.close(i)), gs(r, null), yt(r, !1), { success: !0 };
  } catch (t) {
    return Y && Y.webContents.send(
      "navigation-error",
      `${r} restart error: ${t.message}`
    ), { success: !1, error: t.message };
  }
});
jr.handle("get-connection-status", () => zi);
