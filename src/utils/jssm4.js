! function (r, e) {
  "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.JSSM4 = e() : r.JSSM4 = e()
}(this, (function () {
  return function (r) {
    var e = {};

    function t(n) {
      if (e[n]) return e[n].exports;
      var o = e[n] = {
        i: n,
        l: !1,
        exports: {}
      };
      return r[n].call(o.exports, o, o.exports, t), o.l = !0, o.exports
    }
    return t.m = r, t.c = e, t.d = function (r, e, n) {
      t.o(r, e) || Object.defineProperty(r, e, {
        enumerable: !0,
        get: n
      })
    }, t.r = function (r) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(r, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(r, "__esModule", {
        value: !0
      })
    }, t.t = function (r, e) {
      if (1 & e && (r = t(r)), 8 & e) return r;
      if (4 & e && "object" == typeof r && r && r.__esModule) return r;
      var n = Object.create(null);
      if (t.r(n), Object.defineProperty(n, "default", {
          enumerable: !0,
          value: r
        }), 2 & e && "string" != typeof r)
        for (var o in r) t.d(n, o, function (e) {
          return r[e]
        }.bind(null, o));
      return n
    }, t.n = function (r) {
      var e = r && r.__esModule ? function () {
        return r.default
      } : function () {
        return r
      };
      return t.d(e, "a", e), e
    }, t.o = function (r, e) {
      return Object.prototype.hasOwnProperty.call(r, e)
    }, t.p = "", t(t.s = 1)
  }([function (r, e, t) {
    "use strict";
    e.byteLength = function (r) {
      var e = c(r),
        t = e[0],
        n = e[1];
      return 3 * (t + n) / 4 - n
    }, e.toByteArray = function (r) {
      var e, t, n = c(r),
        i = n[0],
        a = n[1],
        f = new u(function (r, e, t) {
          return 3 * (e + t) / 4 - t
        }(0, i, a)),
        l = 0,
        s = a > 0 ? i - 4 : i;
      for (t = 0; t < s; t += 4) e = o[r.charCodeAt(t)] << 18 | o[r.charCodeAt(t + 1)] << 12 | o[r.charCodeAt(t + 2)] << 6 | o[r.charCodeAt(t + 3)], f[l++] = e >> 16 & 255, f[l++] = e >> 8 & 255, f[l++] = 255 & e;
      2 === a && (e = o[r.charCodeAt(t)] << 2 | o[r.charCodeAt(t + 1)] >> 4, f[l++] = 255 & e);
      1 === a && (e = o[r.charCodeAt(t)] << 10 | o[r.charCodeAt(t + 1)] << 4 | o[r.charCodeAt(t + 2)] >> 2, f[l++] = e >> 8 & 255, f[l++] = 255 & e);
      return f
    }, e.fromByteArray = function (r) {
      for (var e, t = r.length, o = t % 3, u = [], i = 0, a = t - o; i < a; i += 16383) u.push(l(r, i, i + 16383 > a ? a : i + 16383));
      1 === o ? (e = r[t - 1], u.push(n[e >> 2] + n[e << 4 & 63] + "==")) : 2 === o && (e = (r[t - 2] << 8) + r[t - 1], u.push(n[e >> 10] + n[e >> 4 & 63] + n[e << 2 & 63] + "="));
      return u.join("")
    };
    for (var n = [], o = [], u = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, f = i.length; a < f; ++a) n[a] = i[a], o[i.charCodeAt(a)] = a;

    function c(r) {
      var e = r.length;
      if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var t = r.indexOf("=");
      return -1 === t && (t = e), [t, t === e ? 0 : 4 - t % 4]
    }

    function l(r, e, t) {
      for (var o, u, i = [], a = e; a < t; a += 3) o = (r[a] << 16 & 16711680) + (r[a + 1] << 8 & 65280) + (255 & r[a + 2]), i.push(n[(u = o) >> 18 & 63] + n[u >> 12 & 63] + n[u >> 6 & 63] + n[63 & u]);
      return i.join("")
    }
    o["-".charCodeAt(0)] = 62, o["_".charCodeAt(0)] = 63
  }, function (r, e, t) {
    "use strict";
    t.r(e);
    var n = t(0),
      o = t.n(n);

    function u() {
      this.mode = 1, this.sk = new Array(32), this.isPadding = !0
    }

    function i(r, e) {
      return (255 & r[e]) << 24 | (255 & r[e + 1]) << 16 | (255 & r[e + 2]) << 8 | 255 & r[e + 3]
    }

    function a(r, e, t) {
      e[t] = 255 & r >> 24, e[t + 1] = 255 & r >> 16, e[t + 2] = 255 & r >> 8, e[t + 3] = 255 & r
    }

    function f(r, e, t = 32) {
      return r << (e %= t) | r >>> t - e
    }
    var c = [214, 144, 233, 254, 204, 225, 61, 183, 22, 182, 20, 194, 40, 251, 44, 5, 43, 103, 154, 118, 42, 190, 4, 195, 170, 68, 19, 38, 73, 134, 6, 153, 156, 66, 80, 244, 145, 239, 152, 122, 51, 84, 11, 67, 237, 207, 172, 98, 228, 179, 28, 169, 201, 8, 232, 149, 128, 223, 148, 250, 117, 143, 63, 166, 71, 7, 167, 252, 243, 115, 23, 186, 131, 89, 60, 25, 230, 133, 79, 168, 104, 107, 129, 178, 113, 100, 218, 139, 248, 235, 15, 75, 112, 86, 157, 53, 30, 36, 14, 94, 99, 88, 209, 162, 37, 34, 124, 59, 1, 33, 120, 135, 212, 0, 70, 87, 159, 211, 39, 82, 76, 54, 2, 231, 160, 196, 200, 158, 234, 191, 138, 210, 64, 199, 56, 181, 163, 247, 242, 206, 249, 97, 21, 161, 224, 174, 93, 164, 155, 52, 26, 85, 173, 147, 50, 48, 245, 140, 177, 227, 29, 246, 226, 46, 130, 102, 202, 96, 192, 41, 35, 171, 13, 83, 78, 111, 213, 219, 55, 69, 222, 253, 142, 47, 3, 255, 106, 114, 109, 108, 91, 81, 141, 27, 175, 146, 187, 221, 188, 127, 17, 217, 92, 65, 31, 16, 90, 216, 10, 193, 49, 136, 165, 205, 123, 189, 45, 116, 208, 18, 184, 229, 180, 176, 137, 105, 151, 74, 12, 150, 119, 126, 101, 185, 241, 9, 197, 110, 198, 132, 24, 240, 125, 236, 58, 220, 77, 32, 121, 238, 95, 62, 215, 203, 57, 72],
      l = [462357, 472066609, 943670861, 1415275113, 1886879365, 2358483617, 2830087869, 3301692121, 3773296373, 4228057617, 404694573, 876298825, 1347903077, 1819507329, 2291111581, 2762715833, 3234320085, 3705924337, 4177462797, 337322537, 808926789, 1280531041, 1752135293, 2223739545, 2695343797, 3166948049, 3638552301, 4110090761, 269950501, 741554753, 1213159005, 1684763257],
      s = [2746333894, 1453994832, 1736282519, 2993693404];

    function d(r) {
      return c[255 & r]
    }

    function h(r, e, t, n, o) {
      return r ^ (u = e ^ t ^ n ^ o, l = new Array(4), s = new Array(4), a(u, l, 0), s[0] = d(l[0]), s[1] = d(l[1]), s[2] = d(l[2]), s[3] = d(l[3]), (c = i(s, 0)) ^ f(c, 2) ^ f(c, 10) ^ f(c, 18) ^ f(c, 24));
      var u, c, l, s
    }

    function y(r, e) {
      var t, n, o, u, c = new Array(4),
        h = new Array(36),
        y = 0;
      for (c[0] = i(e, 0), c[1] = i(e, 4), c[2] = i(e, 8), c[3] = i(e, 12), h[0] = c[0] ^ s[0], h[1] = c[1] ^ s[1], h[2] = c[2] ^ s[2], h[3] = c[3] ^ s[3]; y < 32; y++) h[y + 4] = h[y] ^ (t = h[y + 1] ^ h[y + 2] ^ h[y + 3] ^ l[y], n = void 0, o = void 0, u = void 0, o = new Array(4), u = new Array(4), a(t, o, 0), u[0] = d(o[0]), u[1] = d(o[1]), u[2] = d(o[2]), u[3] = d(o[3]), (n = i(u, 0)) ^ f(n, 13) ^ f(n, 23)), r[y] = h[y + 4]
    }

    function p(r, e, t) {
      var n = 0,
        o = new Array(36);
      for (o[0] = i(e, 0), o[1] = i(e, 4), o[2] = i(e, 8), o[3] = i(e, 12); n < 32;) o[n + 4] = h(o[n], o[n + 1], o[n + 2], o[n + 3], r[n]), n++;
      a(o[35], t, 0), a(o[34], t, 4), a(o[33], t, 8), a(o[32], t, 12)
    }

    function v(r, e) {
      if (null == r) return null;
      var t = [];
      if (t = t.concat(r), 1 == e)
        for (var n = 16 - r.length % 16, o = 0; o < n; o++) t[r.length + o] = n;
      else {
        n = r[r.length - 1];
        for (var u = 0; u < n; u++) t.pop()
      }
      return t
    }

    function g(r, e) {
      null == e | "" == e && Error("input is null!"), r.isPadding && 1 == r.mode && (e = v(e, 1));
      for (var t = e.length, n = [], o = 0; o < t; o += 16) {
        var u = [],
          i = [];
        u.push(e[o + 0], e[o + 1], e[o + 2], e[o + 3], e[o + 4], e[o + 5], e[o + 6], e[o + 7], e[o + 8], e[o + 9], e[o + 10], e[o + 11], e[o + 12], e[o + 13], e[o + 14], e[o + 15]), p(r.sk, u, i), n = n.concat(i)
      }
      return r.isPadding && 0 == r.mode && (n = v(n, 0)), n
    }

    function A(r) {
      var e, t, n = new Array;
      e = r.length;
      for (var o = 0; o < e; o++)(t = r.charCodeAt(o)) >= 65536 && t <= 1114111 ? (n.push(t >> 18 & 7 | 240), n.push(t >> 12 & 63 | 128), n.push(t >> 6 & 63 | 128), n.push(63 & t | 128)) : t >= 2048 && t <= 65535 ? (n.push(t >> 12 & 15 | 224), n.push(t >> 6 & 63 | 128), n.push(63 & t | 128)) : t >= 128 && t <= 2047 ? (n.push(t >> 6 & 31 | 192), n.push(63 & t | 128)) : n.push(255 & t);
      return n
    }
    e.default = function (r) {
      this.seckey = r, this.encryptData_ECB = function (r) {
        var e, t = new u;
        t.isPadding = !0, t.mode = 1;
        try {
          if (null == this.seckey) throw "key 不规范";
          e = A(this.seckey)
        } catch (r) {
          Error(r.message)
        }! function (r, e) {
          null == r && Error("ctx is null!"), null != e && 16 == e.length || Error("key error!"), r.mode = 1, y(r.sk, e)
        }(t, e);
        var n = g(t, A(r)),
          i = o.a.fromByteArray(n);
        null != i && i.trim().length > 0 && i.replace(/(\s*|\t|\r|\n)/g, "");
        return i
      }, this.decryptData_ECB = function (r) {
        try {
          var e = new u;
          e.isPadding = !0, e.mode = 0;
          var t = A(this.seckey);
          return function (r, e) {
              null == r && Error("ctx is null!"), null != e && 16 == e.length || Error("key error!"), r.mode = 0, y(r.sk, e), r.sk = r.sk.reverse()
            }(e, t),
            function (r) {
              if ("string" == typeof r) return r;
              for (var e = "", t = r, n = 0; n < t.length; n++) {
                var o = t[n].toString(2),
                  u = o.match(/^1+?(?=0)/);
                if (u && 8 == o.length) {
                  for (var i = u[0].length, a = t[n].toString(2).slice(7 - i), f = 1; f < i; f++) a += t[f + n].toString(2).slice(2);
                  e += String.fromCharCode(parseInt(a, 2)), n += i - 1
                } else e += String.fromCharCode(t[n])
              }
              return e
            }(g(e, o.a.toByteArray(r)))
        } catch (r) {
          return Error(r.message), null
        }
      }
    }
  }]).default
}));
