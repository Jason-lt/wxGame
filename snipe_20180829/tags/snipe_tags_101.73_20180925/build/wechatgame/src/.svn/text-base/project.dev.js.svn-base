require = function() {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function(r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }
      return n[i].exports;
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o;
  }
  return r;
}()({
  1: [ function(require, module, exports) {
    var asn1 = exports;
    asn1.bignum = require("bn.js");
    asn1.define = require("./asn1/api").define;
    asn1.base = require("./asn1/base");
    asn1.constants = require("./asn1/constants");
    asn1.decoders = require("./asn1/decoders");
    asn1.encoders = require("./asn1/encoders");
  }, {
    "./asn1/api": 2,
    "./asn1/base": 4,
    "./asn1/constants": 8,
    "./asn1/decoders": 10,
    "./asn1/encoders": 13,
    "bn.js": 16
  } ],
  2: [ function(require, module, exports) {
    var asn1 = require("../asn1");
    var inherits = require("inherits");
    var api = exports;
    api.define = function define(name, body) {
      return new Entity(name, body);
    };
    function Entity(name, body) {
      this.name = name;
      this.body = body;
      this.decoders = {};
      this.encoders = {};
    }
    Entity.prototype._createNamed = function createNamed(base) {
      var named;
      try {
        named = require("vm").runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})");
      } catch (e) {
        named = function(entity) {
          this._initNamed(entity);
        };
      }
      inherits(named, base);
      named.prototype._initNamed = function initnamed(entity) {
        base.call(this, entity);
      };
      return new named(this);
    };
    Entity.prototype._getDecoder = function _getDecoder(enc) {
      enc = enc || "der";
      this.decoders.hasOwnProperty(enc) || (this.decoders[enc] = this._createNamed(asn1.decoders[enc]));
      return this.decoders[enc];
    };
    Entity.prototype.decode = function decode(data, enc, options) {
      return this._getDecoder(enc).decode(data, options);
    };
    Entity.prototype._getEncoder = function _getEncoder(enc) {
      enc = enc || "der";
      this.encoders.hasOwnProperty(enc) || (this.encoders[enc] = this._createNamed(asn1.encoders[enc]));
      return this.encoders[enc];
    };
    Entity.prototype.encode = function encode(data, enc, reporter) {
      return this._getEncoder(enc).encode(data, reporter);
    };
  }, {
    "../asn1": 1,
    inherits: 101,
    vm: 155
  } ],
  3: [ function(require, module, exports) {
    var inherits = require("inherits");
    var Reporter = require("../base").Reporter;
    var Buffer = require("buffer").Buffer;
    function DecoderBuffer(base, options) {
      Reporter.call(this, options);
      if (!Buffer.isBuffer(base)) {
        this.error("Input not Buffer");
        return;
      }
      this.base = base;
      this.offset = 0;
      this.length = base.length;
    }
    inherits(DecoderBuffer, Reporter);
    exports.DecoderBuffer = DecoderBuffer;
    DecoderBuffer.prototype.save = function save() {
      return {
        offset: this.offset,
        reporter: Reporter.prototype.save.call(this)
      };
    };
    DecoderBuffer.prototype.restore = function restore(save) {
      var res = new DecoderBuffer(this.base);
      res.offset = save.offset;
      res.length = this.offset;
      this.offset = save.offset;
      Reporter.prototype.restore.call(this, save.reporter);
      return res;
    };
    DecoderBuffer.prototype.isEmpty = function isEmpty() {
      return this.offset === this.length;
    };
    DecoderBuffer.prototype.readUInt8 = function readUInt8(fail) {
      return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, true) : this.error(fail || "DecoderBuffer overrun");
    };
    DecoderBuffer.prototype.skip = function skip(bytes, fail) {
      if (!(this.offset + bytes <= this.length)) return this.error(fail || "DecoderBuffer overrun");
      var res = new DecoderBuffer(this.base);
      res._reporterState = this._reporterState;
      res.offset = this.offset;
      res.length = this.offset + bytes;
      this.offset += bytes;
      return res;
    };
    DecoderBuffer.prototype.raw = function raw(save) {
      return this.base.slice(save ? save.offset : this.offset, this.length);
    };
    function EncoderBuffer(value, reporter) {
      if (Array.isArray(value)) {
        this.length = 0;
        this.value = value.map(function(item) {
          item instanceof EncoderBuffer || (item = new EncoderBuffer(item, reporter));
          this.length += item.length;
          return item;
        }, this);
      } else if ("number" === typeof value) {
        if (!(0 <= value && value <= 255)) return reporter.error("non-byte EncoderBuffer value");
        this.value = value;
        this.length = 1;
      } else if ("string" === typeof value) {
        this.value = value;
        this.length = Buffer.byteLength(value);
      } else {
        if (!Buffer.isBuffer(value)) return reporter.error("Unsupported type: " + typeof value);
        this.value = value;
        this.length = value.length;
      }
    }
    exports.EncoderBuffer = EncoderBuffer;
    EncoderBuffer.prototype.join = function join(out, offset) {
      out || (out = new Buffer(this.length));
      offset || (offset = 0);
      if (0 === this.length) return out;
      if (Array.isArray(this.value)) this.value.forEach(function(item) {
        item.join(out, offset);
        offset += item.length;
      }); else {
        "number" === typeof this.value ? out[offset] = this.value : "string" === typeof this.value ? out.write(this.value, offset) : Buffer.isBuffer(this.value) && this.value.copy(out, offset);
        offset += this.length;
      }
      return out;
    };
  }, {
    "../base": 4,
    buffer: 47,
    inherits: 101
  } ],
  4: [ function(require, module, exports) {
    var base = exports;
    base.Reporter = require("./reporter").Reporter;
    base.DecoderBuffer = require("./buffer").DecoderBuffer;
    base.EncoderBuffer = require("./buffer").EncoderBuffer;
    base.Node = require("./node");
  }, {
    "./buffer": 3,
    "./node": 5,
    "./reporter": 6
  } ],
  5: [ function(require, module, exports) {
    var Reporter = require("../base").Reporter;
    var EncoderBuffer = require("../base").EncoderBuffer;
    var DecoderBuffer = require("../base").DecoderBuffer;
    var assert = require("minimalistic-assert");
    var tags = [ "seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr" ];
    var methods = [ "key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains" ].concat(tags);
    var overrided = [ "_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool" ];
    function Node(enc, parent) {
      var state = {};
      this._baseState = state;
      state.enc = enc;
      state.parent = parent || null;
      state.children = null;
      state.tag = null;
      state.args = null;
      state.reverseArgs = null;
      state.choice = null;
      state.optional = false;
      state.any = false;
      state.obj = false;
      state.use = null;
      state.useDecoder = null;
      state.key = null;
      state["default"] = null;
      state.explicit = null;
      state.implicit = null;
      state.contains = null;
      if (!state.parent) {
        state.children = [];
        this._wrap();
      }
    }
    module.exports = Node;
    var stateProps = [ "enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains" ];
    Node.prototype.clone = function clone() {
      var state = this._baseState;
      var cstate = {};
      stateProps.forEach(function(prop) {
        cstate[prop] = state[prop];
      });
      var res = new this.constructor(cstate.parent);
      res._baseState = cstate;
      return res;
    };
    Node.prototype._wrap = function wrap() {
      var state = this._baseState;
      methods.forEach(function(method) {
        this[method] = function _wrappedMethod() {
          var clone = new this.constructor(this);
          state.children.push(clone);
          return clone[method].apply(clone, arguments);
        };
      }, this);
    };
    Node.prototype._init = function init(body) {
      var state = this._baseState;
      assert(null === state.parent);
      body.call(this);
      state.children = state.children.filter(function(child) {
        return child._baseState.parent === this;
      }, this);
      assert.equal(state.children.length, 1, "Root node can have only one child");
    };
    Node.prototype._useArgs = function useArgs(args) {
      var state = this._baseState;
      var children = args.filter(function(arg) {
        return arg instanceof this.constructor;
      }, this);
      args = args.filter(function(arg) {
        return !(arg instanceof this.constructor);
      }, this);
      if (0 !== children.length) {
        assert(null === state.children);
        state.children = children;
        children.forEach(function(child) {
          child._baseState.parent = this;
        }, this);
      }
      if (0 !== args.length) {
        assert(null === state.args);
        state.args = args;
        state.reverseArgs = args.map(function(arg) {
          if ("object" !== typeof arg || arg.constructor !== Object) return arg;
          var res = {};
          Object.keys(arg).forEach(function(key) {
            key == (0 | key) && (key |= 0);
            var value = arg[key];
            res[value] = key;
          });
          return res;
        });
      }
    };
    overrided.forEach(function(method) {
      Node.prototype[method] = function _overrided() {
        var state = this._baseState;
        throw new Error(method + " not implemented for encoding: " + state.enc);
      };
    });
    tags.forEach(function(tag) {
      Node.prototype[tag] = function _tagMethod() {
        var state = this._baseState;
        var args = Array.prototype.slice.call(arguments);
        assert(null === state.tag);
        state.tag = tag;
        this._useArgs(args);
        return this;
      };
    });
    Node.prototype.use = function use(item) {
      assert(item);
      var state = this._baseState;
      assert(null === state.use);
      state.use = item;
      return this;
    };
    Node.prototype.optional = function optional() {
      var state = this._baseState;
      state.optional = true;
      return this;
    };
    Node.prototype.def = function def(val) {
      var state = this._baseState;
      assert(null === state["default"]);
      state["default"] = val;
      state.optional = true;
      return this;
    };
    Node.prototype.explicit = function explicit(num) {
      var state = this._baseState;
      assert(null === state.explicit && null === state.implicit);
      state.explicit = num;
      return this;
    };
    Node.prototype.implicit = function implicit(num) {
      var state = this._baseState;
      assert(null === state.explicit && null === state.implicit);
      state.implicit = num;
      return this;
    };
    Node.prototype.obj = function obj() {
      var state = this._baseState;
      var args = Array.prototype.slice.call(arguments);
      state.obj = true;
      0 !== args.length && this._useArgs(args);
      return this;
    };
    Node.prototype.key = function key(newKey) {
      var state = this._baseState;
      assert(null === state.key);
      state.key = newKey;
      return this;
    };
    Node.prototype.any = function any() {
      var state = this._baseState;
      state.any = true;
      return this;
    };
    Node.prototype.choice = function choice(obj) {
      var state = this._baseState;
      assert(null === state.choice);
      state.choice = obj;
      this._useArgs(Object.keys(obj).map(function(key) {
        return obj[key];
      }));
      return this;
    };
    Node.prototype.contains = function contains(item) {
      var state = this._baseState;
      assert(null === state.use);
      state.contains = item;
      return this;
    };
    Node.prototype._decode = function decode(input, options) {
      var state = this._baseState;
      if (null === state.parent) return input.wrapResult(state.children[0]._decode(input, options));
      var result = state["default"];
      var present = true;
      var prevKey = null;
      null !== state.key && (prevKey = input.enterKey(state.key));
      if (state.optional) {
        var tag = null;
        null !== state.explicit ? tag = state.explicit : null !== state.implicit ? tag = state.implicit : null !== state.tag && (tag = state.tag);
        if (null !== tag || state.any) {
          present = this._peekTag(input, tag, state.any);
          if (input.isError(present)) return present;
        } else {
          var save = input.save();
          try {
            null === state.choice ? this._decodeGeneric(state.tag, input, options) : this._decodeChoice(input, options);
            present = true;
          } catch (e) {
            present = false;
          }
          input.restore(save);
        }
      }
      var prevObj;
      state.obj && present && (prevObj = input.enterObject());
      if (present) {
        if (null !== state.explicit) {
          var explicit = this._decodeTag(input, state.explicit);
          if (input.isError(explicit)) return explicit;
          input = explicit;
        }
        var start = input.offset;
        if (null === state.use && null === state.choice) {
          if (state.any) var save = input.save();
          var body = this._decodeTag(input, null !== state.implicit ? state.implicit : state.tag, state.any);
          if (input.isError(body)) return body;
          state.any ? result = input.raw(save) : input = body;
        }
        options && options.track && null !== state.tag && options.track(input.path(), start, input.length, "tagged");
        options && options.track && null !== state.tag && options.track(input.path(), input.offset, input.length, "content");
        result = state.any ? result : null === state.choice ? this._decodeGeneric(state.tag, input, options) : this._decodeChoice(input, options);
        if (input.isError(result)) return result;
        state.any || null !== state.choice || null === state.children || state.children.forEach(function decodeChildren(child) {
          child._decode(input, options);
        });
        if (state.contains && ("octstr" === state.tag || "bitstr" === state.tag)) {
          var data = new DecoderBuffer(result);
          result = this._getUse(state.contains, input._reporterState.obj)._decode(data, options);
        }
      }
      state.obj && present && (result = input.leaveObject(prevObj));
      null === state.key || null === result && true !== present ? null !== prevKey && input.exitKey(prevKey) : input.leaveKey(prevKey, state.key, result);
      return result;
    };
    Node.prototype._decodeGeneric = function decodeGeneric(tag, input, options) {
      var state = this._baseState;
      if ("seq" === tag || "set" === tag) return null;
      if ("seqof" === tag || "setof" === tag) return this._decodeList(input, tag, state.args[0], options);
      if (/str$/.test(tag)) return this._decodeStr(input, tag, options);
      if ("objid" === tag && state.args) return this._decodeObjid(input, state.args[0], state.args[1], options);
      if ("objid" === tag) return this._decodeObjid(input, null, null, options);
      if ("gentime" === tag || "utctime" === tag) return this._decodeTime(input, tag, options);
      if ("null_" === tag) return this._decodeNull(input, options);
      if ("bool" === tag) return this._decodeBool(input, options);
      if ("objDesc" === tag) return this._decodeStr(input, tag, options);
      if ("int" === tag || "enum" === tag) return this._decodeInt(input, state.args && state.args[0], options);
      return null !== state.use ? this._getUse(state.use, input._reporterState.obj)._decode(input, options) : input.error("unknown tag: " + tag);
    };
    Node.prototype._getUse = function _getUse(entity, obj) {
      var state = this._baseState;
      state.useDecoder = this._use(entity, obj);
      assert(null === state.useDecoder._baseState.parent);
      state.useDecoder = state.useDecoder._baseState.children[0];
      if (state.implicit !== state.useDecoder._baseState.implicit) {
        state.useDecoder = state.useDecoder.clone();
        state.useDecoder._baseState.implicit = state.implicit;
      }
      return state.useDecoder;
    };
    Node.prototype._decodeChoice = function decodeChoice(input, options) {
      var state = this._baseState;
      var result = null;
      var match = false;
      Object.keys(state.choice).some(function(key) {
        var save = input.save();
        var node = state.choice[key];
        try {
          var value = node._decode(input, options);
          if (input.isError(value)) return false;
          result = {
            type: key,
            value: value
          };
          match = true;
        } catch (e) {
          input.restore(save);
          return false;
        }
        return true;
      }, this);
      if (!match) return input.error("Choice not matched");
      return result;
    };
    Node.prototype._createEncoderBuffer = function createEncoderBuffer(data) {
      return new EncoderBuffer(data, this.reporter);
    };
    Node.prototype._encode = function encode(data, reporter, parent) {
      var state = this._baseState;
      if (null !== state["default"] && state["default"] === data) return;
      var result = this._encodeValue(data, reporter, parent);
      if (void 0 === result) return;
      if (this._skipDefault(result, reporter, parent)) return;
      return result;
    };
    Node.prototype._encodeValue = function encode(data, reporter, parent) {
      var state = this._baseState;
      if (null === state.parent) return state.children[0]._encode(data, reporter || new Reporter());
      var result = null;
      this.reporter = reporter;
      if (state.optional && void 0 === data) {
        if (null === state["default"]) return;
        data = state["default"];
      }
      var content = null;
      var primitive = false;
      if (state.any) result = this._createEncoderBuffer(data); else if (state.choice) result = this._encodeChoice(data, reporter); else if (state.contains) {
        content = this._getUse(state.contains, parent)._encode(data, reporter);
        primitive = true;
      } else if (state.children) {
        content = state.children.map(function(child) {
          if ("null_" === child._baseState.tag) return child._encode(null, reporter, data);
          if (null === child._baseState.key) return reporter.error("Child should have a key");
          var prevKey = reporter.enterKey(child._baseState.key);
          if ("object" !== typeof data) return reporter.error("Child expected, but input is not object");
          var res = child._encode(data[child._baseState.key], reporter, data);
          reporter.leaveKey(prevKey);
          return res;
        }, this).filter(function(child) {
          return child;
        });
        content = this._createEncoderBuffer(content);
      } else if ("seqof" === state.tag || "setof" === state.tag) {
        if (!(state.args && 1 === state.args.length)) return reporter.error("Too many args for : " + state.tag);
        if (!Array.isArray(data)) return reporter.error("seqof/setof, but data is not Array");
        var child = this.clone();
        child._baseState.implicit = null;
        content = this._createEncoderBuffer(data.map(function(item) {
          var state = this._baseState;
          return this._getUse(state.args[0], data)._encode(item, reporter);
        }, child));
      } else if (null !== state.use) result = this._getUse(state.use, parent)._encode(data, reporter); else {
        content = this._encodePrimitive(state.tag, data);
        primitive = true;
      }
      var result;
      if (!state.any && null === state.choice) {
        var tag = null !== state.implicit ? state.implicit : state.tag;
        var cls = null === state.implicit ? "universal" : "context";
        null === tag ? null === state.use && reporter.error("Tag could be omitted only for .use()") : null === state.use && (result = this._encodeComposite(tag, primitive, cls, content));
      }
      null !== state.explicit && (result = this._encodeComposite(state.explicit, false, "context", result));
      return result;
    };
    Node.prototype._encodeChoice = function encodeChoice(data, reporter) {
      var state = this._baseState;
      var node = state.choice[data.type];
      node || assert(false, data.type + " not found in " + JSON.stringify(Object.keys(state.choice)));
      return node._encode(data.value, reporter);
    };
    Node.prototype._encodePrimitive = function encodePrimitive(tag, data) {
      var state = this._baseState;
      if (/str$/.test(tag)) return this._encodeStr(data, tag);
      if ("objid" === tag && state.args) return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
      if ("objid" === tag) return this._encodeObjid(data, null, null);
      if ("gentime" === tag || "utctime" === tag) return this._encodeTime(data, tag);
      if ("null_" === tag) return this._encodeNull();
      if ("int" === tag || "enum" === tag) return this._encodeInt(data, state.args && state.reverseArgs[0]);
      if ("bool" === tag) return this._encodeBool(data);
      if ("objDesc" === tag) return this._encodeStr(data, tag);
      throw new Error("Unsupported tag: " + tag);
    };
    Node.prototype._isNumstr = function isNumstr(str) {
      return /^[0-9 ]*$/.test(str);
    };
    Node.prototype._isPrintstr = function isPrintstr(str) {
      return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(str);
    };
  }, {
    "../base": 4,
    "minimalistic-assert": 105
  } ],
  6: [ function(require, module, exports) {
    var inherits = require("inherits");
    function Reporter(options) {
      this._reporterState = {
        obj: null,
        path: [],
        options: options || {},
        errors: []
      };
    }
    exports.Reporter = Reporter;
    Reporter.prototype.isError = function isError(obj) {
      return obj instanceof ReporterError;
    };
    Reporter.prototype.save = function save() {
      var state = this._reporterState;
      return {
        obj: state.obj,
        pathLen: state.path.length
      };
    };
    Reporter.prototype.restore = function restore(data) {
      var state = this._reporterState;
      state.obj = data.obj;
      state.path = state.path.slice(0, data.pathLen);
    };
    Reporter.prototype.enterKey = function enterKey(key) {
      return this._reporterState.path.push(key);
    };
    Reporter.prototype.exitKey = function exitKey(index) {
      var state = this._reporterState;
      state.path = state.path.slice(0, index - 1);
    };
    Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
      var state = this._reporterState;
      this.exitKey(index);
      null !== state.obj && (state.obj[key] = value);
    };
    Reporter.prototype.path = function path() {
      return this._reporterState.path.join("/");
    };
    Reporter.prototype.enterObject = function enterObject() {
      var state = this._reporterState;
      var prev = state.obj;
      state.obj = {};
      return prev;
    };
    Reporter.prototype.leaveObject = function leaveObject(prev) {
      var state = this._reporterState;
      var now = state.obj;
      state.obj = prev;
      return now;
    };
    Reporter.prototype.error = function error(msg) {
      var err;
      var state = this._reporterState;
      var inherited = msg instanceof ReporterError;
      err = inherited ? msg : new ReporterError(state.path.map(function(elem) {
        return "[" + JSON.stringify(elem) + "]";
      }).join(""), msg.message || msg, msg.stack);
      if (!state.options.partial) throw err;
      inherited || state.errors.push(err);
      return err;
    };
    Reporter.prototype.wrapResult = function wrapResult(result) {
      var state = this._reporterState;
      if (!state.options.partial) return result;
      return {
        result: this.isError(result) ? null : result,
        errors: state.errors
      };
    };
    function ReporterError(path, msg) {
      this.path = path;
      this.rethrow(msg);
    }
    inherits(ReporterError, Error);
    ReporterError.prototype.rethrow = function rethrow(msg) {
      this.message = msg + " at: " + (this.path || "(shallow)");
      Error.captureStackTrace && Error.captureStackTrace(this, ReporterError);
      if (!this.stack) try {
        throw new Error(this.message);
      } catch (e) {
        this.stack = e.stack;
      }
      return this;
    };
  }, {
    inherits: 101
  } ],
  7: [ function(require, module, exports) {
    var constants = require("../constants");
    exports.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    };
    exports.tagClassByName = constants._reverse(exports.tagClass);
    exports.tag = {
      0: "end",
      1: "bool",
      2: "int",
      3: "bitstr",
      4: "octstr",
      5: "null_",
      6: "objid",
      7: "objDesc",
      8: "external",
      9: "real",
      10: "enum",
      11: "embed",
      12: "utf8str",
      13: "relativeOid",
      16: "seq",
      17: "set",
      18: "numstr",
      19: "printstr",
      20: "t61str",
      21: "videostr",
      22: "ia5str",
      23: "utctime",
      24: "gentime",
      25: "graphstr",
      26: "iso646str",
      27: "genstr",
      28: "unistr",
      29: "charstr",
      30: "bmpstr"
    };
    exports.tagByName = constants._reverse(exports.tag);
  }, {
    "../constants": 8
  } ],
  8: [ function(require, module, exports) {
    var constants = exports;
    constants._reverse = function reverse(map) {
      var res = {};
      Object.keys(map).forEach(function(key) {
        (0 | key) == key && (key |= 0);
        var value = map[key];
        res[value] = key;
      });
      return res;
    };
    constants.der = require("./der");
  }, {
    "./der": 7
  } ],
  9: [ function(require, module, exports) {
    var inherits = require("inherits");
    var asn1 = require("../../asn1");
    var base = asn1.base;
    var bignum = asn1.bignum;
    var der = asn1.constants.der;
    function DERDecoder(entity) {
      this.enc = "der";
      this.name = entity.name;
      this.entity = entity;
      this.tree = new DERNode();
      this.tree._init(entity.body);
    }
    module.exports = DERDecoder;
    DERDecoder.prototype.decode = function decode(data, options) {
      data instanceof base.DecoderBuffer || (data = new base.DecoderBuffer(data, options));
      return this.tree._decode(data, options);
    };
    function DERNode(parent) {
      base.Node.call(this, "der", parent);
    }
    inherits(DERNode, base.Node);
    DERNode.prototype._peekTag = function peekTag(buffer, tag, any) {
      if (buffer.isEmpty()) return false;
      var state = buffer.save();
      var decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
      if (buffer.isError(decodedTag)) return decodedTag;
      buffer.restore(state);
      return decodedTag.tag === tag || decodedTag.tagStr === tag || decodedTag.tagStr + "of" === tag || any;
    };
    DERNode.prototype._decodeTag = function decodeTag(buffer, tag, any) {
      var decodedTag = derDecodeTag(buffer, 'Failed to decode tag of "' + tag + '"');
      if (buffer.isError(decodedTag)) return decodedTag;
      var len = derDecodeLen(buffer, decodedTag.primitive, 'Failed to get length of "' + tag + '"');
      if (buffer.isError(len)) return len;
      if (!any && decodedTag.tag !== tag && decodedTag.tagStr !== tag && decodedTag.tagStr + "of" !== tag) return buffer.error('Failed to match tag: "' + tag + '"');
      if (decodedTag.primitive || null !== len) return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
      var state = buffer.save();
      var res = this._skipUntilEnd(buffer, 'Failed to skip indefinite length body: "' + this.tag + '"');
      if (buffer.isError(res)) return res;
      len = buffer.offset - state.offset;
      buffer.restore(state);
      return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
    };
    DERNode.prototype._skipUntilEnd = function skipUntilEnd(buffer, fail) {
      while (true) {
        var tag = derDecodeTag(buffer, fail);
        if (buffer.isError(tag)) return tag;
        var len = derDecodeLen(buffer, tag.primitive, fail);
        if (buffer.isError(len)) return len;
        var res;
        res = tag.primitive || null !== len ? buffer.skip(len) : this._skipUntilEnd(buffer, fail);
        if (buffer.isError(res)) return res;
        if ("end" === tag.tagStr) break;
      }
    };
    DERNode.prototype._decodeList = function decodeList(buffer, tag, decoder, options) {
      var result = [];
      while (!buffer.isEmpty()) {
        var possibleEnd = this._peekTag(buffer, "end");
        if (buffer.isError(possibleEnd)) return possibleEnd;
        var res = decoder.decode(buffer, "der", options);
        if (buffer.isError(res) && possibleEnd) break;
        result.push(res);
      }
      return result;
    };
    DERNode.prototype._decodeStr = function decodeStr(buffer, tag) {
      if ("bitstr" === tag) {
        var unused = buffer.readUInt8();
        if (buffer.isError(unused)) return unused;
        return {
          unused: unused,
          data: buffer.raw()
        };
      }
      if ("bmpstr" === tag) {
        var raw = buffer.raw();
        if (raw.length % 2 === 1) return buffer.error("Decoding of string type: bmpstr length mismatch");
        var str = "";
        for (var i = 0; i < raw.length / 2; i++) str += String.fromCharCode(raw.readUInt16BE(2 * i));
        return str;
      }
      if ("numstr" === tag) {
        var numstr = buffer.raw().toString("ascii");
        if (!this._isNumstr(numstr)) return buffer.error("Decoding of string type: numstr unsupported characters");
        return numstr;
      }
      if ("octstr" === tag) return buffer.raw();
      if ("objDesc" === tag) return buffer.raw();
      if ("printstr" === tag) {
        var printstr = buffer.raw().toString("ascii");
        if (!this._isPrintstr(printstr)) return buffer.error("Decoding of string type: printstr unsupported characters");
        return printstr;
      }
      return /str$/.test(tag) ? buffer.raw().toString() : buffer.error("Decoding of string type: " + tag + " unsupported");
    };
    DERNode.prototype._decodeObjid = function decodeObjid(buffer, values, relative) {
      var result;
      var identifiers = [];
      var ident = 0;
      while (!buffer.isEmpty()) {
        var subident = buffer.readUInt8();
        ident <<= 7;
        ident |= 127 & subident;
        if (0 === (128 & subident)) {
          identifiers.push(ident);
          ident = 0;
        }
      }
      128 & subident && identifiers.push(ident);
      var first = identifiers[0] / 40 | 0;
      var second = identifiers[0] % 40;
      result = relative ? identifiers : [ first, second ].concat(identifiers.slice(1));
      if (values) {
        var tmp = values[result.join(" ")];
        void 0 === tmp && (tmp = values[result.join(".")]);
        void 0 !== tmp && (result = tmp);
      }
      return result;
    };
    DERNode.prototype._decodeTime = function decodeTime(buffer, tag) {
      var str = buffer.raw().toString();
      if ("gentime" === tag) {
        var year = 0 | str.slice(0, 4);
        var mon = 0 | str.slice(4, 6);
        var day = 0 | str.slice(6, 8);
        var hour = 0 | str.slice(8, 10);
        var min = 0 | str.slice(10, 12);
        var sec = 0 | str.slice(12, 14);
      } else {
        if ("utctime" !== tag) return buffer.error("Decoding " + tag + " time is not supported yet");
        var year = 0 | str.slice(0, 2);
        var mon = 0 | str.slice(2, 4);
        var day = 0 | str.slice(4, 6);
        var hour = 0 | str.slice(6, 8);
        var min = 0 | str.slice(8, 10);
        var sec = 0 | str.slice(10, 12);
        year = year < 70 ? 2e3 + year : 1900 + year;
      }
      return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
    };
    DERNode.prototype._decodeNull = function decodeNull(buffer) {
      return null;
    };
    DERNode.prototype._decodeBool = function decodeBool(buffer) {
      var res = buffer.readUInt8();
      return buffer.isError(res) ? res : 0 !== res;
    };
    DERNode.prototype._decodeInt = function decodeInt(buffer, values) {
      var raw = buffer.raw();
      var res = new bignum(raw);
      values && (res = values[res.toString(10)] || res);
      return res;
    };
    DERNode.prototype._use = function use(entity, obj) {
      "function" === typeof entity && (entity = entity(obj));
      return entity._getDecoder("der").tree;
    };
    function derDecodeTag(buf, fail) {
      var tag = buf.readUInt8(fail);
      if (buf.isError(tag)) return tag;
      var cls = der.tagClass[tag >> 6];
      var primitive = 0 === (32 & tag);
      if (31 === (31 & tag)) {
        var oct = tag;
        tag = 0;
        while (128 === (128 & oct)) {
          oct = buf.readUInt8(fail);
          if (buf.isError(oct)) return oct;
          tag <<= 7;
          tag |= 127 & oct;
        }
      } else tag &= 31;
      var tagStr = der.tag[tag];
      return {
        cls: cls,
        primitive: primitive,
        tag: tag,
        tagStr: tagStr
      };
    }
    function derDecodeLen(buf, primitive, fail) {
      var len = buf.readUInt8(fail);
      if (buf.isError(len)) return len;
      if (!primitive && 128 === len) return null;
      if (0 === (128 & len)) return len;
      var num = 127 & len;
      if (num > 4) return buf.error("length octect is too long");
      len = 0;
      for (var i = 0; i < num; i++) {
        len <<= 8;
        var j = buf.readUInt8(fail);
        if (buf.isError(j)) return j;
        len |= j;
      }
      return len;
    }
  }, {
    "../../asn1": 1,
    inherits: 101
  } ],
  10: [ function(require, module, exports) {
    var decoders = exports;
    decoders.der = require("./der");
    decoders.pem = require("./pem");
  }, {
    "./der": 9,
    "./pem": 11
  } ],
  11: [ function(require, module, exports) {
    var inherits = require("inherits");
    var Buffer = require("buffer").Buffer;
    var DERDecoder = require("./der");
    function PEMDecoder(entity) {
      DERDecoder.call(this, entity);
      this.enc = "pem";
    }
    inherits(PEMDecoder, DERDecoder);
    module.exports = PEMDecoder;
    PEMDecoder.prototype.decode = function decode(data, options) {
      var lines = data.toString().split(/[\r\n]+/g);
      var label = options.label.toUpperCase();
      var re = /^-----(BEGIN|END) ([^-]+)-----$/;
      var start = -1;
      var end = -1;
      for (var i = 0; i < lines.length; i++) {
        var match = lines[i].match(re);
        if (null === match) continue;
        if (match[2] !== label) continue;
        if (-1 !== start) {
          if ("END" !== match[1]) break;
          end = i;
          break;
        }
        if ("BEGIN" !== match[1]) break;
        start = i;
      }
      if (-1 === start || -1 === end) throw new Error("PEM section not found for: " + label);
      var base64 = lines.slice(start + 1, end).join("");
      base64.replace(/[^a-z0-9\+\/=]+/gi, "");
      var input = new Buffer(base64, "base64");
      return DERDecoder.prototype.decode.call(this, input, options);
    };
  }, {
    "./der": 9,
    buffer: 47,
    inherits: 101
  } ],
  12: [ function(require, module, exports) {
    var inherits = require("inherits");
    var Buffer = require("buffer").Buffer;
    var asn1 = require("../../asn1");
    var base = asn1.base;
    var der = asn1.constants.der;
    function DEREncoder(entity) {
      this.enc = "der";
      this.name = entity.name;
      this.entity = entity;
      this.tree = new DERNode();
      this.tree._init(entity.body);
    }
    module.exports = DEREncoder;
    DEREncoder.prototype.encode = function encode(data, reporter) {
      return this.tree._encode(data, reporter).join();
    };
    function DERNode(parent) {
      base.Node.call(this, "der", parent);
    }
    inherits(DERNode, base.Node);
    DERNode.prototype._encodeComposite = function encodeComposite(tag, primitive, cls, content) {
      var encodedTag = encodeTag(tag, primitive, cls, this.reporter);
      if (content.length < 128) {
        var header = new Buffer(2);
        header[0] = encodedTag;
        header[1] = content.length;
        return this._createEncoderBuffer([ header, content ]);
      }
      var lenOctets = 1;
      for (var i = content.length; i >= 256; i >>= 8) lenOctets++;
      var header = new Buffer(2 + lenOctets);
      header[0] = encodedTag;
      header[1] = 128 | lenOctets;
      for (var i = 1 + lenOctets, j = content.length; j > 0; i--, j >>= 8) header[i] = 255 & j;
      return this._createEncoderBuffer([ header, content ]);
    };
    DERNode.prototype._encodeStr = function encodeStr(str, tag) {
      if ("bitstr" === tag) return this._createEncoderBuffer([ 0 | str.unused, str.data ]);
      if ("bmpstr" === tag) {
        var buf = new Buffer(2 * str.length);
        for (var i = 0; i < str.length; i++) buf.writeUInt16BE(str.charCodeAt(i), 2 * i);
        return this._createEncoderBuffer(buf);
      }
      if ("numstr" === tag) {
        if (!this._isNumstr(str)) return this.reporter.error("Encoding of string type: numstr supports only digits and space");
        return this._createEncoderBuffer(str);
      }
      if ("printstr" === tag) {
        if (!this._isPrintstr(str)) return this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark");
        return this._createEncoderBuffer(str);
      }
      return /str$/.test(tag) ? this._createEncoderBuffer(str) : "objDesc" === tag ? this._createEncoderBuffer(str) : this.reporter.error("Encoding of string type: " + tag + " unsupported");
    };
    DERNode.prototype._encodeObjid = function encodeObjid(id, values, relative) {
      if ("string" === typeof id) {
        if (!values) return this.reporter.error("string objid given, but no values map found");
        if (!values.hasOwnProperty(id)) return this.reporter.error("objid not found in values map");
        id = values[id].split(/[\s\.]+/g);
        for (var i = 0; i < id.length; i++) id[i] |= 0;
      } else if (Array.isArray(id)) {
        id = id.slice();
        for (var i = 0; i < id.length; i++) id[i] |= 0;
      }
      if (!Array.isArray(id)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(id));
      if (!relative) {
        if (id[1] >= 40) return this.reporter.error("Second objid identifier OOB");
        id.splice(0, 2, 40 * id[0] + id[1]);
      }
      var size = 0;
      for (var i = 0; i < id.length; i++) {
        var ident = id[i];
        for (size++; ident >= 128; ident >>= 7) size++;
      }
      var objid = new Buffer(size);
      var offset = objid.length - 1;
      for (var i = id.length - 1; i >= 0; i--) {
        var ident = id[i];
        objid[offset--] = 127 & ident;
        while ((ident >>= 7) > 0) objid[offset--] = 128 | 127 & ident;
      }
      return this._createEncoderBuffer(objid);
    };
    function two(num) {
      return num < 10 ? "0" + num : num;
    }
    DERNode.prototype._encodeTime = function encodeTime(time, tag) {
      var str;
      var date = new Date(time);
      "gentime" === tag ? str = [ two(date.getFullYear()), two(date.getUTCMonth() + 1), two(date.getUTCDate()), two(date.getUTCHours()), two(date.getUTCMinutes()), two(date.getUTCSeconds()), "Z" ].join("") : "utctime" === tag ? str = [ two(date.getFullYear() % 100), two(date.getUTCMonth() + 1), two(date.getUTCDate()), two(date.getUTCHours()), two(date.getUTCMinutes()), two(date.getUTCSeconds()), "Z" ].join("") : this.reporter.error("Encoding " + tag + " time is not supported yet");
      return this._encodeStr(str, "octstr");
    };
    DERNode.prototype._encodeNull = function encodeNull() {
      return this._createEncoderBuffer("");
    };
    DERNode.prototype._encodeInt = function encodeInt(num, values) {
      if ("string" === typeof num) {
        if (!values) return this.reporter.error("String int or enum given, but no values map");
        if (!values.hasOwnProperty(num)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(num));
        num = values[num];
      }
      if ("number" !== typeof num && !Buffer.isBuffer(num)) {
        var numArray = num.toArray();
        !num.sign && 128 & numArray[0] && numArray.unshift(0);
        num = new Buffer(numArray);
      }
      if (Buffer.isBuffer(num)) {
        var size = num.length;
        0 === num.length && size++;
        var out = new Buffer(size);
        num.copy(out);
        0 === num.length && (out[0] = 0);
        return this._createEncoderBuffer(out);
      }
      if (num < 128) return this._createEncoderBuffer(num);
      if (num < 256) return this._createEncoderBuffer([ 0, num ]);
      var size = 1;
      for (var i = num; i >= 256; i >>= 8) size++;
      var out = new Array(size);
      for (var i = out.length - 1; i >= 0; i--) {
        out[i] = 255 & num;
        num >>= 8;
      }
      128 & out[0] && out.unshift(0);
      return this._createEncoderBuffer(new Buffer(out));
    };
    DERNode.prototype._encodeBool = function encodeBool(value) {
      return this._createEncoderBuffer(value ? 255 : 0);
    };
    DERNode.prototype._use = function use(entity, obj) {
      "function" === typeof entity && (entity = entity(obj));
      return entity._getEncoder("der").tree;
    };
    DERNode.prototype._skipDefault = function skipDefault(dataBuffer, reporter, parent) {
      var state = this._baseState;
      var i;
      if (null === state["default"]) return false;
      var data = dataBuffer.join();
      void 0 === state.defaultBuffer && (state.defaultBuffer = this._encodeValue(state["default"], reporter, parent).join());
      if (data.length !== state.defaultBuffer.length) return false;
      for (i = 0; i < data.length; i++) if (data[i] !== state.defaultBuffer[i]) return false;
      return true;
    };
    function encodeTag(tag, primitive, cls, reporter) {
      var res;
      "seqof" === tag ? tag = "seq" : "setof" === tag && (tag = "set");
      if (der.tagByName.hasOwnProperty(tag)) res = der.tagByName[tag]; else {
        if ("number" !== typeof tag || (0 | tag) !== tag) return reporter.error("Unknown tag: " + tag);
        res = tag;
      }
      if (res >= 31) return reporter.error("Multi-octet tag encoding unsupported");
      primitive || (res |= 32);
      res |= der.tagClassByName[cls || "universal"] << 6;
      return res;
    }
  }, {
    "../../asn1": 1,
    buffer: 47,
    inherits: 101
  } ],
  13: [ function(require, module, exports) {
    var encoders = exports;
    encoders.der = require("./der");
    encoders.pem = require("./pem");
  }, {
    "./der": 12,
    "./pem": 14
  } ],
  14: [ function(require, module, exports) {
    var inherits = require("inherits");
    var DEREncoder = require("./der");
    function PEMEncoder(entity) {
      DEREncoder.call(this, entity);
      this.enc = "pem";
    }
    inherits(PEMEncoder, DEREncoder);
    module.exports = PEMEncoder;
    PEMEncoder.prototype.encode = function encode(data, options) {
      var buf = DEREncoder.prototype.encode.call(this, data);
      var p = buf.toString("base64");
      var out = [ "-----BEGIN " + options.label + "-----" ];
      for (var i = 0; i < p.length; i += 64) out.push(p.slice(i, i + 64));
      out.push("-----END " + options.label + "-----");
      return out.join("\n");
    };
  }, {
    "./der": 12,
    inherits: 101
  } ],
  15: [ function(require, module, exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len = b64.length;
      if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var validLen = b64.indexOf("=");
      -1 === validLen && (validLen = len);
      var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
      return [ validLen, placeHoldersLen ];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
      for (var i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      if (2 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = 255 & tmp;
      }
      if (1 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[63 & num];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (255 & uint8[i + 2]);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      if (1 === extraBytes) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (2 === extraBytes) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
  }, {} ],
  16: [ function(require, module, exports) {
    (function(module, exports) {
      "use strict";
      function assert(val, msg) {
        if (!val) throw new Error(msg || "Assertion failed");
      }
      function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
      function BN(number, base, endian) {
        if (BN.isBN(number)) return number;
        this.negative = 0;
        this.words = null;
        this.length = 0;
        this.red = null;
        if (null !== number) {
          if ("le" === base || "be" === base) {
            endian = base;
            base = 10;
          }
          this._init(number || 0, base || 10, endian || "be");
        }
      }
      "object" === typeof module ? module.exports = BN : exports.BN = BN;
      BN.BN = BN;
      BN.wordSize = 26;
      var Buffer;
      try {
        Buffer = require("buffer").Buffer;
      } catch (e) {}
      BN.isBN = function isBN(num) {
        if (num instanceof BN) return true;
        return null !== num && "object" === typeof num && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
      };
      BN.max = function max(left, right) {
        if (left.cmp(right) > 0) return left;
        return right;
      };
      BN.min = function min(left, right) {
        if (left.cmp(right) < 0) return left;
        return right;
      };
      BN.prototype._init = function init(number, base, endian) {
        if ("number" === typeof number) return this._initNumber(number, base, endian);
        if ("object" === typeof number) return this._initArray(number, base, endian);
        "hex" === base && (base = 16);
        assert(base === (0 | base) && base >= 2 && base <= 36);
        number = number.toString().replace(/\s+/g, "");
        var start = 0;
        "-" === number[0] && start++;
        16 === base ? this._parseHex(number, start) : this._parseBase(number, base, start);
        "-" === number[0] && (this.negative = 1);
        this.strip();
        if ("le" !== endian) return;
        this._initArray(this.toArray(), base, endian);
      };
      BN.prototype._initNumber = function _initNumber(number, base, endian) {
        if (number < 0) {
          this.negative = 1;
          number = -number;
        }
        if (number < 67108864) {
          this.words = [ 67108863 & number ];
          this.length = 1;
        } else if (number < 4503599627370496) {
          this.words = [ 67108863 & number, number / 67108864 & 67108863 ];
          this.length = 2;
        } else {
          assert(number < 9007199254740992);
          this.words = [ 67108863 & number, number / 67108864 & 67108863, 1 ];
          this.length = 3;
        }
        if ("le" !== endian) return;
        this._initArray(this.toArray(), base, endian);
      };
      BN.prototype._initArray = function _initArray(number, base, endian) {
        assert("number" === typeof number.length);
        if (number.length <= 0) {
          this.words = [ 0 ];
          this.length = 1;
          return this;
        }
        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) this.words[i] = 0;
        var j, w;
        var off = 0;
        if ("be" === endian) for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
          w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
          this.words[j] |= w << off & 67108863;
          this.words[j + 1] = w >>> 26 - off & 67108863;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        } else if ("le" === endian) for (i = 0, j = 0; i < number.length; i += 3) {
          w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
          this.words[j] |= w << off & 67108863;
          this.words[j + 1] = w >>> 26 - off & 67108863;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
        return this.strip();
      };
      function parseHex(str, start, end) {
        var r = 0;
        var len = Math.min(str.length, end);
        for (var i = start; i < len; i++) {
          var c = str.charCodeAt(i) - 48;
          r <<= 4;
          r |= c >= 49 && c <= 54 ? c - 49 + 10 : c >= 17 && c <= 22 ? c - 17 + 10 : 15 & c;
        }
        return r;
      }
      BN.prototype._parseHex = function _parseHex(number, start) {
        this.length = Math.ceil((number.length - start) / 6);
        this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) this.words[i] = 0;
        var j, w;
        var off = 0;
        for (i = number.length - 6, j = 0; i >= start; i -= 6) {
          w = parseHex(number, i, i + 6);
          this.words[j] |= w << off & 67108863;
          this.words[j + 1] |= w >>> 26 - off & 4194303;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
        if (i + 6 !== start) {
          w = parseHex(number, start, i + 6);
          this.words[j] |= w << off & 67108863;
          this.words[j + 1] |= w >>> 26 - off & 4194303;
        }
        this.strip();
      };
      function parseBase(str, start, end, mul) {
        var r = 0;
        var len = Math.min(str.length, end);
        for (var i = start; i < len; i++) {
          var c = str.charCodeAt(i) - 48;
          r *= mul;
          r += c >= 49 ? c - 49 + 10 : c >= 17 ? c - 17 + 10 : c;
        }
        return r;
      }
      BN.prototype._parseBase = function _parseBase(number, base, start) {
        this.words = [ 0 ];
        this.length = 1;
        for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base) limbLen++;
        limbLen--;
        limbPow = limbPow / base | 0;
        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;
        var word = 0;
        for (var i = start; i < end; i += limbLen) {
          word = parseBase(number, i, i + limbLen, base);
          this.imuln(limbPow);
          this.words[0] + word < 67108864 ? this.words[0] += word : this._iaddn(word);
        }
        if (0 !== mod) {
          var pow = 1;
          word = parseBase(number, i, number.length, base);
          for (i = 0; i < mod; i++) pow *= base;
          this.imuln(pow);
          this.words[0] + word < 67108864 ? this.words[0] += word : this._iaddn(word);
        }
      };
      BN.prototype.copy = function copy(dest) {
        dest.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) dest.words[i] = this.words[i];
        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
      };
      BN.prototype.clone = function clone() {
        var r = new BN(null);
        this.copy(r);
        return r;
      };
      BN.prototype._expand = function _expand(size) {
        while (this.length < size) this.words[this.length++] = 0;
        return this;
      };
      BN.prototype.strip = function strip() {
        while (this.length > 1 && 0 === this.words[this.length - 1]) this.length--;
        return this._normSign();
      };
      BN.prototype._normSign = function _normSign() {
        1 === this.length && 0 === this.words[0] && (this.negative = 0);
        return this;
      };
      BN.prototype.inspect = function inspect() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      };
      var zeros = [ "", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000" ];
      var groupSizes = [ 0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ];
      var groupBases = [ 0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176 ];
      BN.prototype.toString = function toString(base, padding) {
        base = base || 10;
        padding = 0 | padding || 1;
        var out;
        if (16 === base || "hex" === base) {
          out = "";
          var off = 0;
          var carry = 0;
          for (var i = 0; i < this.length; i++) {
            var w = this.words[i];
            var word = (16777215 & (w << off | carry)).toString(16);
            carry = w >>> 24 - off & 16777215;
            out = 0 !== carry || i !== this.length - 1 ? zeros[6 - word.length] + word + out : word + out;
            off += 2;
            if (off >= 26) {
              off -= 26;
              i--;
            }
          }
          0 !== carry && (out = carry.toString(16) + out);
          while (out.length % padding !== 0) out = "0" + out;
          0 !== this.negative && (out = "-" + out);
          return out;
        }
        if (base === (0 | base) && base >= 2 && base <= 36) {
          var groupSize = groupSizes[base];
          var groupBase = groupBases[base];
          out = "";
          var c = this.clone();
          c.negative = 0;
          while (!c.isZero()) {
            var r = c.modn(groupBase).toString(base);
            c = c.idivn(groupBase);
            out = c.isZero() ? r + out : zeros[groupSize - r.length] + r + out;
          }
          this.isZero() && (out = "0" + out);
          while (out.length % padding !== 0) out = "0" + out;
          0 !== this.negative && (out = "-" + out);
          return out;
        }
        assert(false, "Base should be between 2 and 36");
      };
      BN.prototype.toNumber = function toNumber() {
        var ret = this.words[0];
        2 === this.length ? ret += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? ret += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && assert(false, "Number can only safely store up to 53 bits");
        return 0 !== this.negative ? -ret : ret;
      };
      BN.prototype.toJSON = function toJSON() {
        return this.toString(16);
      };
      BN.prototype.toBuffer = function toBuffer(endian, length) {
        assert("undefined" !== typeof Buffer);
        return this.toArrayLike(Buffer, endian, length);
      };
      BN.prototype.toArray = function toArray(endian, length) {
        return this.toArrayLike(Array, endian, length);
      };
      BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        assert(byteLength <= reqLength, "byte array longer than desired length");
        assert(reqLength > 0, "Requested array length <= 0");
        this.strip();
        var littleEndian = "le" === endian;
        var res = new ArrayType(reqLength);
        var b, i;
        var q = this.clone();
        if (littleEndian) {
          for (i = 0; !q.isZero(); i++) {
            b = q.andln(255);
            q.iushrn(8);
            res[i] = b;
          }
          for (;i < reqLength; i++) res[i] = 0;
        } else {
          for (i = 0; i < reqLength - byteLength; i++) res[i] = 0;
          for (i = 0; !q.isZero(); i++) {
            b = q.andln(255);
            q.iushrn(8);
            res[reqLength - i - 1] = b;
          }
        }
        return res;
      };
      Math.clz32 ? BN.prototype._countBits = function _countBits(w) {
        return 32 - Math.clz32(w);
      } : BN.prototype._countBits = function _countBits(w) {
        var t = w;
        var r = 0;
        if (t >= 4096) {
          r += 13;
          t >>>= 13;
        }
        if (t >= 64) {
          r += 7;
          t >>>= 7;
        }
        if (t >= 8) {
          r += 4;
          t >>>= 4;
        }
        if (t >= 2) {
          r += 2;
          t >>>= 2;
        }
        return r + t;
      };
      BN.prototype._zeroBits = function _zeroBits(w) {
        if (0 === w) return 26;
        var t = w;
        var r = 0;
        if (0 === (8191 & t)) {
          r += 13;
          t >>>= 13;
        }
        if (0 === (127 & t)) {
          r += 7;
          t >>>= 7;
        }
        if (0 === (15 & t)) {
          r += 4;
          t >>>= 4;
        }
        if (0 === (3 & t)) {
          r += 2;
          t >>>= 2;
        }
        0 === (1 & t) && r++;
        return r;
      };
      BN.prototype.bitLength = function bitLength() {
        var w = this.words[this.length - 1];
        var hi = this._countBits(w);
        return 26 * (this.length - 1) + hi;
      };
      function toBitArray(num) {
        var w = new Array(num.bitLength());
        for (var bit = 0; bit < w.length; bit++) {
          var off = bit / 26 | 0;
          var wbit = bit % 26;
          w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
        }
        return w;
      }
      BN.prototype.zeroBits = function zeroBits() {
        if (this.isZero()) return 0;
        var r = 0;
        for (var i = 0; i < this.length; i++) {
          var b = this._zeroBits(this.words[i]);
          r += b;
          if (26 !== b) break;
        }
        return r;
      };
      BN.prototype.byteLength = function byteLength() {
        return Math.ceil(this.bitLength() / 8);
      };
      BN.prototype.toTwos = function toTwos(width) {
        if (0 !== this.negative) return this.abs().inotn(width).iaddn(1);
        return this.clone();
      };
      BN.prototype.fromTwos = function fromTwos(width) {
        if (this.testn(width - 1)) return this.notn(width).iaddn(1).ineg();
        return this.clone();
      };
      BN.prototype.isNeg = function isNeg() {
        return 0 !== this.negative;
      };
      BN.prototype.neg = function neg() {
        return this.clone().ineg();
      };
      BN.prototype.ineg = function ineg() {
        this.isZero() || (this.negative ^= 1);
        return this;
      };
      BN.prototype.iuor = function iuor(num) {
        while (this.length < num.length) this.words[this.length++] = 0;
        for (var i = 0; i < num.length; i++) this.words[i] = this.words[i] | num.words[i];
        return this.strip();
      };
      BN.prototype.ior = function ior(num) {
        assert(0 === (this.negative | num.negative));
        return this.iuor(num);
      };
      BN.prototype.or = function or(num) {
        if (this.length > num.length) return this.clone().ior(num);
        return num.clone().ior(this);
      };
      BN.prototype.uor = function uor(num) {
        if (this.length > num.length) return this.clone().iuor(num);
        return num.clone().iuor(this);
      };
      BN.prototype.iuand = function iuand(num) {
        var b;
        b = this.length > num.length ? num : this;
        for (var i = 0; i < b.length; i++) this.words[i] = this.words[i] & num.words[i];
        this.length = b.length;
        return this.strip();
      };
      BN.prototype.iand = function iand(num) {
        assert(0 === (this.negative | num.negative));
        return this.iuand(num);
      };
      BN.prototype.and = function and(num) {
        if (this.length > num.length) return this.clone().iand(num);
        return num.clone().iand(this);
      };
      BN.prototype.uand = function uand(num) {
        if (this.length > num.length) return this.clone().iuand(num);
        return num.clone().iuand(this);
      };
      BN.prototype.iuxor = function iuxor(num) {
        var a;
        var b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        for (var i = 0; i < b.length; i++) this.words[i] = a.words[i] ^ b.words[i];
        if (this !== a) for (;i < a.length; i++) this.words[i] = a.words[i];
        this.length = a.length;
        return this.strip();
      };
      BN.prototype.ixor = function ixor(num) {
        assert(0 === (this.negative | num.negative));
        return this.iuxor(num);
      };
      BN.prototype.xor = function xor(num) {
        if (this.length > num.length) return this.clone().ixor(num);
        return num.clone().ixor(this);
      };
      BN.prototype.uxor = function uxor(num) {
        if (this.length > num.length) return this.clone().iuxor(num);
        return num.clone().iuxor(this);
      };
      BN.prototype.inotn = function inotn(width) {
        assert("number" === typeof width && width >= 0);
        var bytesNeeded = 0 | Math.ceil(width / 26);
        var bitsLeft = width % 26;
        this._expand(bytesNeeded);
        bitsLeft > 0 && bytesNeeded--;
        for (var i = 0; i < bytesNeeded; i++) this.words[i] = 67108863 & ~this.words[i];
        bitsLeft > 0 && (this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft);
        return this.strip();
      };
      BN.prototype.notn = function notn(width) {
        return this.clone().inotn(width);
      };
      BN.prototype.setn = function setn(bit, val) {
        assert("number" === typeof bit && bit >= 0);
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        this._expand(off + 1);
        this.words[off] = val ? this.words[off] | 1 << wbit : this.words[off] & ~(1 << wbit);
        return this.strip();
      };
      BN.prototype.iadd = function iadd(num) {
        var r;
        if (0 !== this.negative && 0 === num.negative) {
          this.negative = 0;
          r = this.isub(num);
          this.negative ^= 1;
          return this._normSign();
        }
        if (0 === this.negative && 0 !== num.negative) {
          num.negative = 0;
          r = this.isub(num);
          num.negative = 1;
          return r._normSign();
        }
        var a, b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        var carry = 0;
        for (var i = 0; i < b.length; i++) {
          r = (0 | a.words[i]) + (0 | b.words[i]) + carry;
          this.words[i] = 67108863 & r;
          carry = r >>> 26;
        }
        for (;0 !== carry && i < a.length; i++) {
          r = (0 | a.words[i]) + carry;
          this.words[i] = 67108863 & r;
          carry = r >>> 26;
        }
        this.length = a.length;
        if (0 !== carry) {
          this.words[this.length] = carry;
          this.length++;
        } else if (a !== this) for (;i < a.length; i++) this.words[i] = a.words[i];
        return this;
      };
      BN.prototype.add = function add(num) {
        var res;
        if (0 !== num.negative && 0 === this.negative) {
          num.negative = 0;
          res = this.sub(num);
          num.negative ^= 1;
          return res;
        }
        if (0 === num.negative && 0 !== this.negative) {
          this.negative = 0;
          res = num.sub(this);
          this.negative = 1;
          return res;
        }
        if (this.length > num.length) return this.clone().iadd(num);
        return num.clone().iadd(this);
      };
      BN.prototype.isub = function isub(num) {
        if (0 !== num.negative) {
          num.negative = 0;
          var r = this.iadd(num);
          num.negative = 1;
          return r._normSign();
        }
        if (0 !== this.negative) {
          this.negative = 0;
          this.iadd(num);
          this.negative = 1;
          return this._normSign();
        }
        var cmp = this.cmp(num);
        if (0 === cmp) {
          this.negative = 0;
          this.length = 1;
          this.words[0] = 0;
          return this;
        }
        var a, b;
        if (cmp > 0) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        var carry = 0;
        for (var i = 0; i < b.length; i++) {
          r = (0 | a.words[i]) - (0 | b.words[i]) + carry;
          carry = r >> 26;
          this.words[i] = 67108863 & r;
        }
        for (;0 !== carry && i < a.length; i++) {
          r = (0 | a.words[i]) + carry;
          carry = r >> 26;
          this.words[i] = 67108863 & r;
        }
        if (0 === carry && i < a.length && a !== this) for (;i < a.length; i++) this.words[i] = a.words[i];
        this.length = Math.max(this.length, i);
        a !== this && (this.negative = 1);
        return this.strip();
      };
      BN.prototype.sub = function sub(num) {
        return this.clone().isub(num);
      };
      function smallMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        var len = self.length + num.length | 0;
        out.length = len;
        len = len - 1 | 0;
        var a = 0 | self.words[0];
        var b = 0 | num.words[0];
        var r = a * b;
        var lo = 67108863 & r;
        var carry = r / 67108864 | 0;
        out.words[0] = lo;
        for (var k = 1; k < len; k++) {
          var ncarry = carry >>> 26;
          var rword = 67108863 & carry;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
            var i = k - j | 0;
            a = 0 | self.words[i];
            b = 0 | num.words[j];
            r = a * b + rword;
            ncarry += r / 67108864 | 0;
            rword = 67108863 & r;
          }
          out.words[k] = 0 | rword;
          carry = 0 | ncarry;
        }
        0 !== carry ? out.words[k] = 0 | carry : out.length--;
        return out.strip();
      }
      var comb10MulTo = function comb10MulTo(self, num, out) {
        var a = self.words;
        var b = num.words;
        var o = out.words;
        var c = 0;
        var lo;
        var mid;
        var hi;
        var a0 = 0 | a[0];
        var al0 = 8191 & a0;
        var ah0 = a0 >>> 13;
        var a1 = 0 | a[1];
        var al1 = 8191 & a1;
        var ah1 = a1 >>> 13;
        var a2 = 0 | a[2];
        var al2 = 8191 & a2;
        var ah2 = a2 >>> 13;
        var a3 = 0 | a[3];
        var al3 = 8191 & a3;
        var ah3 = a3 >>> 13;
        var a4 = 0 | a[4];
        var al4 = 8191 & a4;
        var ah4 = a4 >>> 13;
        var a5 = 0 | a[5];
        var al5 = 8191 & a5;
        var ah5 = a5 >>> 13;
        var a6 = 0 | a[6];
        var al6 = 8191 & a6;
        var ah6 = a6 >>> 13;
        var a7 = 0 | a[7];
        var al7 = 8191 & a7;
        var ah7 = a7 >>> 13;
        var a8 = 0 | a[8];
        var al8 = 8191 & a8;
        var ah8 = a8 >>> 13;
        var a9 = 0 | a[9];
        var al9 = 8191 & a9;
        var ah9 = a9 >>> 13;
        var b0 = 0 | b[0];
        var bl0 = 8191 & b0;
        var bh0 = b0 >>> 13;
        var b1 = 0 | b[1];
        var bl1 = 8191 & b1;
        var bh1 = b1 >>> 13;
        var b2 = 0 | b[2];
        var bl2 = 8191 & b2;
        var bh2 = b2 >>> 13;
        var b3 = 0 | b[3];
        var bl3 = 8191 & b3;
        var bh3 = b3 >>> 13;
        var b4 = 0 | b[4];
        var bl4 = 8191 & b4;
        var bh4 = b4 >>> 13;
        var b5 = 0 | b[5];
        var bl5 = 8191 & b5;
        var bh5 = b5 >>> 13;
        var b6 = 0 | b[6];
        var bl6 = 8191 & b6;
        var bh6 = b6 >>> 13;
        var b7 = 0 | b[7];
        var bl7 = 8191 & b7;
        var bh7 = b7 >>> 13;
        var b8 = 0 | b[8];
        var bl8 = 8191 & b8;
        var bh8 = b8 >>> 13;
        var b9 = 0 | b[9];
        var bl9 = 8191 & b9;
        var bh9 = b9 >>> 13;
        out.negative = self.negative ^ num.negative;
        out.length = 19;
        lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = mid + Math.imul(ah0, bl0) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
        w0 &= 67108863;
        lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = mid + Math.imul(ah1, bl0) | 0;
        hi = Math.imul(ah1, bh0);
        lo = lo + Math.imul(al0, bl1) | 0;
        mid = mid + Math.imul(al0, bh1) | 0;
        mid = mid + Math.imul(ah0, bl1) | 0;
        hi = hi + Math.imul(ah0, bh1) | 0;
        var w1 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
        w1 &= 67108863;
        lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = mid + Math.imul(ah2, bl0) | 0;
        hi = Math.imul(ah2, bh0);
        lo = lo + Math.imul(al1, bl1) | 0;
        mid = mid + Math.imul(al1, bh1) | 0;
        mid = mid + Math.imul(ah1, bl1) | 0;
        hi = hi + Math.imul(ah1, bh1) | 0;
        lo = lo + Math.imul(al0, bl2) | 0;
        mid = mid + Math.imul(al0, bh2) | 0;
        mid = mid + Math.imul(ah0, bl2) | 0;
        hi = hi + Math.imul(ah0, bh2) | 0;
        var w2 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
        w2 &= 67108863;
        lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = mid + Math.imul(ah3, bl0) | 0;
        hi = Math.imul(ah3, bh0);
        lo = lo + Math.imul(al2, bl1) | 0;
        mid = mid + Math.imul(al2, bh1) | 0;
        mid = mid + Math.imul(ah2, bl1) | 0;
        hi = hi + Math.imul(ah2, bh1) | 0;
        lo = lo + Math.imul(al1, bl2) | 0;
        mid = mid + Math.imul(al1, bh2) | 0;
        mid = mid + Math.imul(ah1, bl2) | 0;
        hi = hi + Math.imul(ah1, bh2) | 0;
        lo = lo + Math.imul(al0, bl3) | 0;
        mid = mid + Math.imul(al0, bh3) | 0;
        mid = mid + Math.imul(ah0, bl3) | 0;
        hi = hi + Math.imul(ah0, bh3) | 0;
        var w3 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
        w3 &= 67108863;
        lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = mid + Math.imul(ah4, bl0) | 0;
        hi = Math.imul(ah4, bh0);
        lo = lo + Math.imul(al3, bl1) | 0;
        mid = mid + Math.imul(al3, bh1) | 0;
        mid = mid + Math.imul(ah3, bl1) | 0;
        hi = hi + Math.imul(ah3, bh1) | 0;
        lo = lo + Math.imul(al2, bl2) | 0;
        mid = mid + Math.imul(al2, bh2) | 0;
        mid = mid + Math.imul(ah2, bl2) | 0;
        hi = hi + Math.imul(ah2, bh2) | 0;
        lo = lo + Math.imul(al1, bl3) | 0;
        mid = mid + Math.imul(al1, bh3) | 0;
        mid = mid + Math.imul(ah1, bl3) | 0;
        hi = hi + Math.imul(ah1, bh3) | 0;
        lo = lo + Math.imul(al0, bl4) | 0;
        mid = mid + Math.imul(al0, bh4) | 0;
        mid = mid + Math.imul(ah0, bl4) | 0;
        hi = hi + Math.imul(ah0, bh4) | 0;
        var w4 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
        w4 &= 67108863;
        lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = mid + Math.imul(ah5, bl0) | 0;
        hi = Math.imul(ah5, bh0);
        lo = lo + Math.imul(al4, bl1) | 0;
        mid = mid + Math.imul(al4, bh1) | 0;
        mid = mid + Math.imul(ah4, bl1) | 0;
        hi = hi + Math.imul(ah4, bh1) | 0;
        lo = lo + Math.imul(al3, bl2) | 0;
        mid = mid + Math.imul(al3, bh2) | 0;
        mid = mid + Math.imul(ah3, bl2) | 0;
        hi = hi + Math.imul(ah3, bh2) | 0;
        lo = lo + Math.imul(al2, bl3) | 0;
        mid = mid + Math.imul(al2, bh3) | 0;
        mid = mid + Math.imul(ah2, bl3) | 0;
        hi = hi + Math.imul(ah2, bh3) | 0;
        lo = lo + Math.imul(al1, bl4) | 0;
        mid = mid + Math.imul(al1, bh4) | 0;
        mid = mid + Math.imul(ah1, bl4) | 0;
        hi = hi + Math.imul(ah1, bh4) | 0;
        lo = lo + Math.imul(al0, bl5) | 0;
        mid = mid + Math.imul(al0, bh5) | 0;
        mid = mid + Math.imul(ah0, bl5) | 0;
        hi = hi + Math.imul(ah0, bh5) | 0;
        var w5 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
        w5 &= 67108863;
        lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = mid + Math.imul(ah6, bl0) | 0;
        hi = Math.imul(ah6, bh0);
        lo = lo + Math.imul(al5, bl1) | 0;
        mid = mid + Math.imul(al5, bh1) | 0;
        mid = mid + Math.imul(ah5, bl1) | 0;
        hi = hi + Math.imul(ah5, bh1) | 0;
        lo = lo + Math.imul(al4, bl2) | 0;
        mid = mid + Math.imul(al4, bh2) | 0;
        mid = mid + Math.imul(ah4, bl2) | 0;
        hi = hi + Math.imul(ah4, bh2) | 0;
        lo = lo + Math.imul(al3, bl3) | 0;
        mid = mid + Math.imul(al3, bh3) | 0;
        mid = mid + Math.imul(ah3, bl3) | 0;
        hi = hi + Math.imul(ah3, bh3) | 0;
        lo = lo + Math.imul(al2, bl4) | 0;
        mid = mid + Math.imul(al2, bh4) | 0;
        mid = mid + Math.imul(ah2, bl4) | 0;
        hi = hi + Math.imul(ah2, bh4) | 0;
        lo = lo + Math.imul(al1, bl5) | 0;
        mid = mid + Math.imul(al1, bh5) | 0;
        mid = mid + Math.imul(ah1, bl5) | 0;
        hi = hi + Math.imul(ah1, bh5) | 0;
        lo = lo + Math.imul(al0, bl6) | 0;
        mid = mid + Math.imul(al0, bh6) | 0;
        mid = mid + Math.imul(ah0, bl6) | 0;
        hi = hi + Math.imul(ah0, bh6) | 0;
        var w6 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
        w6 &= 67108863;
        lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = mid + Math.imul(ah7, bl0) | 0;
        hi = Math.imul(ah7, bh0);
        lo = lo + Math.imul(al6, bl1) | 0;
        mid = mid + Math.imul(al6, bh1) | 0;
        mid = mid + Math.imul(ah6, bl1) | 0;
        hi = hi + Math.imul(ah6, bh1) | 0;
        lo = lo + Math.imul(al5, bl2) | 0;
        mid = mid + Math.imul(al5, bh2) | 0;
        mid = mid + Math.imul(ah5, bl2) | 0;
        hi = hi + Math.imul(ah5, bh2) | 0;
        lo = lo + Math.imul(al4, bl3) | 0;
        mid = mid + Math.imul(al4, bh3) | 0;
        mid = mid + Math.imul(ah4, bl3) | 0;
        hi = hi + Math.imul(ah4, bh3) | 0;
        lo = lo + Math.imul(al3, bl4) | 0;
        mid = mid + Math.imul(al3, bh4) | 0;
        mid = mid + Math.imul(ah3, bl4) | 0;
        hi = hi + Math.imul(ah3, bh4) | 0;
        lo = lo + Math.imul(al2, bl5) | 0;
        mid = mid + Math.imul(al2, bh5) | 0;
        mid = mid + Math.imul(ah2, bl5) | 0;
        hi = hi + Math.imul(ah2, bh5) | 0;
        lo = lo + Math.imul(al1, bl6) | 0;
        mid = mid + Math.imul(al1, bh6) | 0;
        mid = mid + Math.imul(ah1, bl6) | 0;
        hi = hi + Math.imul(ah1, bh6) | 0;
        lo = lo + Math.imul(al0, bl7) | 0;
        mid = mid + Math.imul(al0, bh7) | 0;
        mid = mid + Math.imul(ah0, bl7) | 0;
        hi = hi + Math.imul(ah0, bh7) | 0;
        var w7 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
        w7 &= 67108863;
        lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = mid + Math.imul(ah8, bl0) | 0;
        hi = Math.imul(ah8, bh0);
        lo = lo + Math.imul(al7, bl1) | 0;
        mid = mid + Math.imul(al7, bh1) | 0;
        mid = mid + Math.imul(ah7, bl1) | 0;
        hi = hi + Math.imul(ah7, bh1) | 0;
        lo = lo + Math.imul(al6, bl2) | 0;
        mid = mid + Math.imul(al6, bh2) | 0;
        mid = mid + Math.imul(ah6, bl2) | 0;
        hi = hi + Math.imul(ah6, bh2) | 0;
        lo = lo + Math.imul(al5, bl3) | 0;
        mid = mid + Math.imul(al5, bh3) | 0;
        mid = mid + Math.imul(ah5, bl3) | 0;
        hi = hi + Math.imul(ah5, bh3) | 0;
        lo = lo + Math.imul(al4, bl4) | 0;
        mid = mid + Math.imul(al4, bh4) | 0;
        mid = mid + Math.imul(ah4, bl4) | 0;
        hi = hi + Math.imul(ah4, bh4) | 0;
        lo = lo + Math.imul(al3, bl5) | 0;
        mid = mid + Math.imul(al3, bh5) | 0;
        mid = mid + Math.imul(ah3, bl5) | 0;
        hi = hi + Math.imul(ah3, bh5) | 0;
        lo = lo + Math.imul(al2, bl6) | 0;
        mid = mid + Math.imul(al2, bh6) | 0;
        mid = mid + Math.imul(ah2, bl6) | 0;
        hi = hi + Math.imul(ah2, bh6) | 0;
        lo = lo + Math.imul(al1, bl7) | 0;
        mid = mid + Math.imul(al1, bh7) | 0;
        mid = mid + Math.imul(ah1, bl7) | 0;
        hi = hi + Math.imul(ah1, bh7) | 0;
        lo = lo + Math.imul(al0, bl8) | 0;
        mid = mid + Math.imul(al0, bh8) | 0;
        mid = mid + Math.imul(ah0, bl8) | 0;
        hi = hi + Math.imul(ah0, bh8) | 0;
        var w8 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
        w8 &= 67108863;
        lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = mid + Math.imul(ah9, bl0) | 0;
        hi = Math.imul(ah9, bh0);
        lo = lo + Math.imul(al8, bl1) | 0;
        mid = mid + Math.imul(al8, bh1) | 0;
        mid = mid + Math.imul(ah8, bl1) | 0;
        hi = hi + Math.imul(ah8, bh1) | 0;
        lo = lo + Math.imul(al7, bl2) | 0;
        mid = mid + Math.imul(al7, bh2) | 0;
        mid = mid + Math.imul(ah7, bl2) | 0;
        hi = hi + Math.imul(ah7, bh2) | 0;
        lo = lo + Math.imul(al6, bl3) | 0;
        mid = mid + Math.imul(al6, bh3) | 0;
        mid = mid + Math.imul(ah6, bl3) | 0;
        hi = hi + Math.imul(ah6, bh3) | 0;
        lo = lo + Math.imul(al5, bl4) | 0;
        mid = mid + Math.imul(al5, bh4) | 0;
        mid = mid + Math.imul(ah5, bl4) | 0;
        hi = hi + Math.imul(ah5, bh4) | 0;
        lo = lo + Math.imul(al4, bl5) | 0;
        mid = mid + Math.imul(al4, bh5) | 0;
        mid = mid + Math.imul(ah4, bl5) | 0;
        hi = hi + Math.imul(ah4, bh5) | 0;
        lo = lo + Math.imul(al3, bl6) | 0;
        mid = mid + Math.imul(al3, bh6) | 0;
        mid = mid + Math.imul(ah3, bl6) | 0;
        hi = hi + Math.imul(ah3, bh6) | 0;
        lo = lo + Math.imul(al2, bl7) | 0;
        mid = mid + Math.imul(al2, bh7) | 0;
        mid = mid + Math.imul(ah2, bl7) | 0;
        hi = hi + Math.imul(ah2, bh7) | 0;
        lo = lo + Math.imul(al1, bl8) | 0;
        mid = mid + Math.imul(al1, bh8) | 0;
        mid = mid + Math.imul(ah1, bl8) | 0;
        hi = hi + Math.imul(ah1, bh8) | 0;
        lo = lo + Math.imul(al0, bl9) | 0;
        mid = mid + Math.imul(al0, bh9) | 0;
        mid = mid + Math.imul(ah0, bl9) | 0;
        hi = hi + Math.imul(ah0, bh9) | 0;
        var w9 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
        w9 &= 67108863;
        lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = mid + Math.imul(ah9, bl1) | 0;
        hi = Math.imul(ah9, bh1);
        lo = lo + Math.imul(al8, bl2) | 0;
        mid = mid + Math.imul(al8, bh2) | 0;
        mid = mid + Math.imul(ah8, bl2) | 0;
        hi = hi + Math.imul(ah8, bh2) | 0;
        lo = lo + Math.imul(al7, bl3) | 0;
        mid = mid + Math.imul(al7, bh3) | 0;
        mid = mid + Math.imul(ah7, bl3) | 0;
        hi = hi + Math.imul(ah7, bh3) | 0;
        lo = lo + Math.imul(al6, bl4) | 0;
        mid = mid + Math.imul(al6, bh4) | 0;
        mid = mid + Math.imul(ah6, bl4) | 0;
        hi = hi + Math.imul(ah6, bh4) | 0;
        lo = lo + Math.imul(al5, bl5) | 0;
        mid = mid + Math.imul(al5, bh5) | 0;
        mid = mid + Math.imul(ah5, bl5) | 0;
        hi = hi + Math.imul(ah5, bh5) | 0;
        lo = lo + Math.imul(al4, bl6) | 0;
        mid = mid + Math.imul(al4, bh6) | 0;
        mid = mid + Math.imul(ah4, bl6) | 0;
        hi = hi + Math.imul(ah4, bh6) | 0;
        lo = lo + Math.imul(al3, bl7) | 0;
        mid = mid + Math.imul(al3, bh7) | 0;
        mid = mid + Math.imul(ah3, bl7) | 0;
        hi = hi + Math.imul(ah3, bh7) | 0;
        lo = lo + Math.imul(al2, bl8) | 0;
        mid = mid + Math.imul(al2, bh8) | 0;
        mid = mid + Math.imul(ah2, bl8) | 0;
        hi = hi + Math.imul(ah2, bh8) | 0;
        lo = lo + Math.imul(al1, bl9) | 0;
        mid = mid + Math.imul(al1, bh9) | 0;
        mid = mid + Math.imul(ah1, bl9) | 0;
        hi = hi + Math.imul(ah1, bh9) | 0;
        var w10 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
        w10 &= 67108863;
        lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = mid + Math.imul(ah9, bl2) | 0;
        hi = Math.imul(ah9, bh2);
        lo = lo + Math.imul(al8, bl3) | 0;
        mid = mid + Math.imul(al8, bh3) | 0;
        mid = mid + Math.imul(ah8, bl3) | 0;
        hi = hi + Math.imul(ah8, bh3) | 0;
        lo = lo + Math.imul(al7, bl4) | 0;
        mid = mid + Math.imul(al7, bh4) | 0;
        mid = mid + Math.imul(ah7, bl4) | 0;
        hi = hi + Math.imul(ah7, bh4) | 0;
        lo = lo + Math.imul(al6, bl5) | 0;
        mid = mid + Math.imul(al6, bh5) | 0;
        mid = mid + Math.imul(ah6, bl5) | 0;
        hi = hi + Math.imul(ah6, bh5) | 0;
        lo = lo + Math.imul(al5, bl6) | 0;
        mid = mid + Math.imul(al5, bh6) | 0;
        mid = mid + Math.imul(ah5, bl6) | 0;
        hi = hi + Math.imul(ah5, bh6) | 0;
        lo = lo + Math.imul(al4, bl7) | 0;
        mid = mid + Math.imul(al4, bh7) | 0;
        mid = mid + Math.imul(ah4, bl7) | 0;
        hi = hi + Math.imul(ah4, bh7) | 0;
        lo = lo + Math.imul(al3, bl8) | 0;
        mid = mid + Math.imul(al3, bh8) | 0;
        mid = mid + Math.imul(ah3, bl8) | 0;
        hi = hi + Math.imul(ah3, bh8) | 0;
        lo = lo + Math.imul(al2, bl9) | 0;
        mid = mid + Math.imul(al2, bh9) | 0;
        mid = mid + Math.imul(ah2, bl9) | 0;
        hi = hi + Math.imul(ah2, bh9) | 0;
        var w11 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
        w11 &= 67108863;
        lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = mid + Math.imul(ah9, bl3) | 0;
        hi = Math.imul(ah9, bh3);
        lo = lo + Math.imul(al8, bl4) | 0;
        mid = mid + Math.imul(al8, bh4) | 0;
        mid = mid + Math.imul(ah8, bl4) | 0;
        hi = hi + Math.imul(ah8, bh4) | 0;
        lo = lo + Math.imul(al7, bl5) | 0;
        mid = mid + Math.imul(al7, bh5) | 0;
        mid = mid + Math.imul(ah7, bl5) | 0;
        hi = hi + Math.imul(ah7, bh5) | 0;
        lo = lo + Math.imul(al6, bl6) | 0;
        mid = mid + Math.imul(al6, bh6) | 0;
        mid = mid + Math.imul(ah6, bl6) | 0;
        hi = hi + Math.imul(ah6, bh6) | 0;
        lo = lo + Math.imul(al5, bl7) | 0;
        mid = mid + Math.imul(al5, bh7) | 0;
        mid = mid + Math.imul(ah5, bl7) | 0;
        hi = hi + Math.imul(ah5, bh7) | 0;
        lo = lo + Math.imul(al4, bl8) | 0;
        mid = mid + Math.imul(al4, bh8) | 0;
        mid = mid + Math.imul(ah4, bl8) | 0;
        hi = hi + Math.imul(ah4, bh8) | 0;
        lo = lo + Math.imul(al3, bl9) | 0;
        mid = mid + Math.imul(al3, bh9) | 0;
        mid = mid + Math.imul(ah3, bl9) | 0;
        hi = hi + Math.imul(ah3, bh9) | 0;
        var w12 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
        w12 &= 67108863;
        lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = mid + Math.imul(ah9, bl4) | 0;
        hi = Math.imul(ah9, bh4);
        lo = lo + Math.imul(al8, bl5) | 0;
        mid = mid + Math.imul(al8, bh5) | 0;
        mid = mid + Math.imul(ah8, bl5) | 0;
        hi = hi + Math.imul(ah8, bh5) | 0;
        lo = lo + Math.imul(al7, bl6) | 0;
        mid = mid + Math.imul(al7, bh6) | 0;
        mid = mid + Math.imul(ah7, bl6) | 0;
        hi = hi + Math.imul(ah7, bh6) | 0;
        lo = lo + Math.imul(al6, bl7) | 0;
        mid = mid + Math.imul(al6, bh7) | 0;
        mid = mid + Math.imul(ah6, bl7) | 0;
        hi = hi + Math.imul(ah6, bh7) | 0;
        lo = lo + Math.imul(al5, bl8) | 0;
        mid = mid + Math.imul(al5, bh8) | 0;
        mid = mid + Math.imul(ah5, bl8) | 0;
        hi = hi + Math.imul(ah5, bh8) | 0;
        lo = lo + Math.imul(al4, bl9) | 0;
        mid = mid + Math.imul(al4, bh9) | 0;
        mid = mid + Math.imul(ah4, bl9) | 0;
        hi = hi + Math.imul(ah4, bh9) | 0;
        var w13 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
        w13 &= 67108863;
        lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = mid + Math.imul(ah9, bl5) | 0;
        hi = Math.imul(ah9, bh5);
        lo = lo + Math.imul(al8, bl6) | 0;
        mid = mid + Math.imul(al8, bh6) | 0;
        mid = mid + Math.imul(ah8, bl6) | 0;
        hi = hi + Math.imul(ah8, bh6) | 0;
        lo = lo + Math.imul(al7, bl7) | 0;
        mid = mid + Math.imul(al7, bh7) | 0;
        mid = mid + Math.imul(ah7, bl7) | 0;
        hi = hi + Math.imul(ah7, bh7) | 0;
        lo = lo + Math.imul(al6, bl8) | 0;
        mid = mid + Math.imul(al6, bh8) | 0;
        mid = mid + Math.imul(ah6, bl8) | 0;
        hi = hi + Math.imul(ah6, bh8) | 0;
        lo = lo + Math.imul(al5, bl9) | 0;
        mid = mid + Math.imul(al5, bh9) | 0;
        mid = mid + Math.imul(ah5, bl9) | 0;
        hi = hi + Math.imul(ah5, bh9) | 0;
        var w14 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
        w14 &= 67108863;
        lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = mid + Math.imul(ah9, bl6) | 0;
        hi = Math.imul(ah9, bh6);
        lo = lo + Math.imul(al8, bl7) | 0;
        mid = mid + Math.imul(al8, bh7) | 0;
        mid = mid + Math.imul(ah8, bl7) | 0;
        hi = hi + Math.imul(ah8, bh7) | 0;
        lo = lo + Math.imul(al7, bl8) | 0;
        mid = mid + Math.imul(al7, bh8) | 0;
        mid = mid + Math.imul(ah7, bl8) | 0;
        hi = hi + Math.imul(ah7, bh8) | 0;
        lo = lo + Math.imul(al6, bl9) | 0;
        mid = mid + Math.imul(al6, bh9) | 0;
        mid = mid + Math.imul(ah6, bl9) | 0;
        hi = hi + Math.imul(ah6, bh9) | 0;
        var w15 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
        w15 &= 67108863;
        lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = mid + Math.imul(ah9, bl7) | 0;
        hi = Math.imul(ah9, bh7);
        lo = lo + Math.imul(al8, bl8) | 0;
        mid = mid + Math.imul(al8, bh8) | 0;
        mid = mid + Math.imul(ah8, bl8) | 0;
        hi = hi + Math.imul(ah8, bh8) | 0;
        lo = lo + Math.imul(al7, bl9) | 0;
        mid = mid + Math.imul(al7, bh9) | 0;
        mid = mid + Math.imul(ah7, bl9) | 0;
        hi = hi + Math.imul(ah7, bh9) | 0;
        var w16 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
        w16 &= 67108863;
        lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = mid + Math.imul(ah9, bl8) | 0;
        hi = Math.imul(ah9, bh8);
        lo = lo + Math.imul(al8, bl9) | 0;
        mid = mid + Math.imul(al8, bh9) | 0;
        mid = mid + Math.imul(ah8, bl9) | 0;
        hi = hi + Math.imul(ah8, bh9) | 0;
        var w17 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
        w17 &= 67108863;
        lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = mid + Math.imul(ah9, bl9) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (c + lo | 0) + ((8191 & mid) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
        w18 &= 67108863;
        o[0] = w0;
        o[1] = w1;
        o[2] = w2;
        o[3] = w3;
        o[4] = w4;
        o[5] = w5;
        o[6] = w6;
        o[7] = w7;
        o[8] = w8;
        o[9] = w9;
        o[10] = w10;
        o[11] = w11;
        o[12] = w12;
        o[13] = w13;
        o[14] = w14;
        o[15] = w15;
        o[16] = w16;
        o[17] = w17;
        o[18] = w18;
        if (0 !== c) {
          o[19] = c;
          out.length++;
        }
        return out;
      };
      Math.imul || (comb10MulTo = smallMulTo);
      function bigMulTo(self, num, out) {
        out.negative = num.negative ^ self.negative;
        out.length = self.length + num.length;
        var carry = 0;
        var hncarry = 0;
        for (var k = 0; k < out.length - 1; k++) {
          var ncarry = hncarry;
          hncarry = 0;
          var rword = 67108863 & carry;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
            var i = k - j;
            var a = 0 | self.words[i];
            var b = 0 | num.words[j];
            var r = a * b;
            var lo = 67108863 & r;
            ncarry = ncarry + (r / 67108864 | 0) | 0;
            lo = lo + rword | 0;
            rword = 67108863 & lo;
            ncarry = ncarry + (lo >>> 26) | 0;
            hncarry += ncarry >>> 26;
            ncarry &= 67108863;
          }
          out.words[k] = rword;
          carry = ncarry;
          ncarry = hncarry;
        }
        0 !== carry ? out.words[k] = carry : out.length--;
        return out.strip();
      }
      function jumboMulTo(self, num, out) {
        var fftm = new FFTM();
        return fftm.mulp(self, num, out);
      }
      BN.prototype.mulTo = function mulTo(num, out) {
        var res;
        var len = this.length + num.length;
        res = 10 === this.length && 10 === num.length ? comb10MulTo(this, num, out) : len < 63 ? smallMulTo(this, num, out) : len < 1024 ? bigMulTo(this, num, out) : jumboMulTo(this, num, out);
        return res;
      };
      function FFTM(x, y) {
        this.x = x;
        this.y = y;
      }
      FFTM.prototype.makeRBT = function makeRBT(N) {
        var t = new Array(N);
        var l = BN.prototype._countBits(N) - 1;
        for (var i = 0; i < N; i++) t[i] = this.revBin(i, l, N);
        return t;
      };
      FFTM.prototype.revBin = function revBin(x, l, N) {
        if (0 === x || x === N - 1) return x;
        var rb = 0;
        for (var i = 0; i < l; i++) {
          rb |= (1 & x) << l - i - 1;
          x >>= 1;
        }
        return rb;
      };
      FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
        for (var i = 0; i < N; i++) {
          rtws[i] = rws[rbt[i]];
          itws[i] = iws[rbt[i]];
        }
      };
      FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);
        for (var s = 1; s < N; s <<= 1) {
          var l = s << 1;
          var rtwdf = Math.cos(2 * Math.PI / l);
          var itwdf = Math.sin(2 * Math.PI / l);
          for (var p = 0; p < N; p += l) {
            var rtwdf_ = rtwdf;
            var itwdf_ = itwdf;
            for (var j = 0; j < s; j++) {
              var re = rtws[p + j];
              var ie = itws[p + j];
              var ro = rtws[p + j + s];
              var io = itws[p + j + s];
              var rx = rtwdf_ * ro - itwdf_ * io;
              io = rtwdf_ * io + itwdf_ * ro;
              ro = rx;
              rtws[p + j] = re + ro;
              itws[p + j] = ie + io;
              rtws[p + j + s] = re - ro;
              itws[p + j + s] = ie - io;
              if (j !== l) {
                rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                rtwdf_ = rx;
              }
            }
          }
        }
      };
      FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
        var N = 1 | Math.max(m, n);
        var odd = 1 & N;
        var i = 0;
        for (N = N / 2 | 0; N; N >>>= 1) i++;
        return 1 << i + 1 + odd;
      };
      FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
        if (N <= 1) return;
        for (var i = 0; i < N / 2; i++) {
          var t = rws[i];
          rws[i] = rws[N - i - 1];
          rws[N - i - 1] = t;
          t = iws[i];
          iws[i] = -iws[N - i - 1];
          iws[N - i - 1] = -t;
        }
      };
      FFTM.prototype.normalize13b = function normalize13b(ws, N) {
        var carry = 0;
        for (var i = 0; i < N / 2; i++) {
          var w = 8192 * Math.round(ws[2 * i + 1] / N) + Math.round(ws[2 * i] / N) + carry;
          ws[i] = 67108863 & w;
          carry = w < 67108864 ? 0 : w / 67108864 | 0;
        }
        return ws;
      };
      FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
        var carry = 0;
        for (var i = 0; i < len; i++) {
          carry += 0 | ws[i];
          rws[2 * i] = 8191 & carry;
          carry >>>= 13;
          rws[2 * i + 1] = 8191 & carry;
          carry >>>= 13;
        }
        for (i = 2 * len; i < N; ++i) rws[i] = 0;
        assert(0 === carry);
        assert(0 === (-8192 & carry));
      };
      FFTM.prototype.stub = function stub(N) {
        var ph = new Array(N);
        for (var i = 0; i < N; i++) ph[i] = 0;
        return ph;
      };
      FFTM.prototype.mulp = function mulp(x, y, out) {
        var N = 2 * this.guessLen13b(x.length, y.length);
        var rbt = this.makeRBT(N);
        var _ = this.stub(N);
        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);
        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);
        var rmws = out.words;
        rmws.length = N;
        this.convert13b(x.words, x.length, rws, N);
        this.convert13b(y.words, y.length, nrws, N);
        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);
        for (var i = 0; i < N; i++) {
          var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
          iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
          rwst[i] = rx;
        }
        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);
        out.negative = x.negative ^ y.negative;
        out.length = x.length + y.length;
        return out.strip();
      };
      BN.prototype.mul = function mul(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
      };
      BN.prototype.mulf = function mulf(num) {
        var out = new BN(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
      };
      BN.prototype.imul = function imul(num) {
        return this.clone().mulTo(num, this);
      };
      BN.prototype.imuln = function imuln(num) {
        assert("number" === typeof num);
        assert(num < 67108864);
        var carry = 0;
        for (var i = 0; i < this.length; i++) {
          var w = (0 | this.words[i]) * num;
          var lo = (67108863 & w) + (67108863 & carry);
          carry >>= 26;
          carry += w / 67108864 | 0;
          carry += lo >>> 26;
          this.words[i] = 67108863 & lo;
        }
        if (0 !== carry) {
          this.words[i] = carry;
          this.length++;
        }
        return this;
      };
      BN.prototype.muln = function muln(num) {
        return this.clone().imuln(num);
      };
      BN.prototype.sqr = function sqr() {
        return this.mul(this);
      };
      BN.prototype.isqr = function isqr() {
        return this.imul(this.clone());
      };
      BN.prototype.pow = function pow(num) {
        var w = toBitArray(num);
        if (0 === w.length) return new BN(1);
        var res = this;
        for (var i = 0; i < w.length; i++, res = res.sqr()) if (0 !== w[i]) break;
        if (++i < w.length) for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
          if (0 === w[i]) continue;
          res = res.mul(q);
        }
        return res;
      };
      BN.prototype.iushln = function iushln(bits) {
        assert("number" === typeof bits && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        var carryMask = 67108863 >>> 26 - r << 26 - r;
        var i;
        if (0 !== r) {
          var carry = 0;
          for (i = 0; i < this.length; i++) {
            var newCarry = this.words[i] & carryMask;
            var c = (0 | this.words[i]) - newCarry << r;
            this.words[i] = c | carry;
            carry = newCarry >>> 26 - r;
          }
          if (carry) {
            this.words[i] = carry;
            this.length++;
          }
        }
        if (0 !== s) {
          for (i = this.length - 1; i >= 0; i--) this.words[i + s] = this.words[i];
          for (i = 0; i < s; i++) this.words[i] = 0;
          this.length += s;
        }
        return this.strip();
      };
      BN.prototype.ishln = function ishln(bits) {
        assert(0 === this.negative);
        return this.iushln(bits);
      };
      BN.prototype.iushrn = function iushrn(bits, hint, extended) {
        assert("number" === typeof bits && bits >= 0);
        var h;
        h = hint ? (hint - hint % 26) / 26 : 0;
        var r = bits % 26;
        var s = Math.min((bits - r) / 26, this.length);
        var mask = 67108863 ^ 67108863 >>> r << r;
        var maskedWords = extended;
        h -= s;
        h = Math.max(0, h);
        if (maskedWords) {
          for (var i = 0; i < s; i++) maskedWords.words[i] = this.words[i];
          maskedWords.length = s;
        }
        if (0 === s) ; else if (this.length > s) {
          this.length -= s;
          for (i = 0; i < this.length; i++) this.words[i] = this.words[i + s];
        } else {
          this.words[0] = 0;
          this.length = 1;
        }
        var carry = 0;
        for (i = this.length - 1; i >= 0 && (0 !== carry || i >= h); i--) {
          var word = 0 | this.words[i];
          this.words[i] = carry << 26 - r | word >>> r;
          carry = word & mask;
        }
        maskedWords && 0 !== carry && (maskedWords.words[maskedWords.length++] = carry);
        if (0 === this.length) {
          this.words[0] = 0;
          this.length = 1;
        }
        return this.strip();
      };
      BN.prototype.ishrn = function ishrn(bits, hint, extended) {
        assert(0 === this.negative);
        return this.iushrn(bits, hint, extended);
      };
      BN.prototype.shln = function shln(bits) {
        return this.clone().ishln(bits);
      };
      BN.prototype.ushln = function ushln(bits) {
        return this.clone().iushln(bits);
      };
      BN.prototype.shrn = function shrn(bits) {
        return this.clone().ishrn(bits);
      };
      BN.prototype.ushrn = function ushrn(bits) {
        return this.clone().iushrn(bits);
      };
      BN.prototype.testn = function testn(bit) {
        assert("number" === typeof bit && bit >= 0);
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        if (this.length <= s) return false;
        var w = this.words[s];
        return !!(w & q);
      };
      BN.prototype.imaskn = function imaskn(bits) {
        assert("number" === typeof bits && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        assert(0 === this.negative, "imaskn works only with positive numbers");
        if (this.length <= s) return this;
        0 !== r && s++;
        this.length = Math.min(s, this.length);
        if (0 !== r) {
          var mask = 67108863 ^ 67108863 >>> r << r;
          this.words[this.length - 1] &= mask;
        }
        return this.strip();
      };
      BN.prototype.maskn = function maskn(bits) {
        return this.clone().imaskn(bits);
      };
      BN.prototype.iaddn = function iaddn(num) {
        assert("number" === typeof num);
        assert(num < 67108864);
        if (num < 0) return this.isubn(-num);
        if (0 !== this.negative) {
          if (1 === this.length && (0 | this.words[0]) < num) {
            this.words[0] = num - (0 | this.words[0]);
            this.negative = 0;
            return this;
          }
          this.negative = 0;
          this.isubn(num);
          this.negative = 1;
          return this;
        }
        return this._iaddn(num);
      };
      BN.prototype._iaddn = function _iaddn(num) {
        this.words[0] += num;
        for (var i = 0; i < this.length && this.words[i] >= 67108864; i++) {
          this.words[i] -= 67108864;
          i === this.length - 1 ? this.words[i + 1] = 1 : this.words[i + 1]++;
        }
        this.length = Math.max(this.length, i + 1);
        return this;
      };
      BN.prototype.isubn = function isubn(num) {
        assert("number" === typeof num);
        assert(num < 67108864);
        if (num < 0) return this.iaddn(-num);
        if (0 !== this.negative) {
          this.negative = 0;
          this.iaddn(num);
          this.negative = 1;
          return this;
        }
        this.words[0] -= num;
        if (1 === this.length && this.words[0] < 0) {
          this.words[0] = -this.words[0];
          this.negative = 1;
        } else for (var i = 0; i < this.length && this.words[i] < 0; i++) {
          this.words[i] += 67108864;
          this.words[i + 1] -= 1;
        }
        return this.strip();
      };
      BN.prototype.addn = function addn(num) {
        return this.clone().iaddn(num);
      };
      BN.prototype.subn = function subn(num) {
        return this.clone().isubn(num);
      };
      BN.prototype.iabs = function iabs() {
        this.negative = 0;
        return this;
      };
      BN.prototype.abs = function abs() {
        return this.clone().iabs();
      };
      BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
        var len = num.length + shift;
        var i;
        this._expand(len);
        var w;
        var carry = 0;
        for (i = 0; i < num.length; i++) {
          w = (0 | this.words[i + shift]) + carry;
          var right = (0 | num.words[i]) * mul;
          w -= 67108863 & right;
          carry = (w >> 26) - (right / 67108864 | 0);
          this.words[i + shift] = 67108863 & w;
        }
        for (;i < this.length - shift; i++) {
          w = (0 | this.words[i + shift]) + carry;
          carry = w >> 26;
          this.words[i + shift] = 67108863 & w;
        }
        if (0 === carry) return this.strip();
        assert(-1 === carry);
        carry = 0;
        for (i = 0; i < this.length; i++) {
          w = -(0 | this.words[i]) + carry;
          carry = w >> 26;
          this.words[i] = 67108863 & w;
        }
        this.negative = 1;
        return this.strip();
      };
      BN.prototype._wordDiv = function _wordDiv(num, mode) {
        var shift = this.length - num.length;
        var a = this.clone();
        var b = num;
        var bhi = 0 | b.words[b.length - 1];
        var bhiBits = this._countBits(bhi);
        shift = 26 - bhiBits;
        if (0 !== shift) {
          b = b.ushln(shift);
          a.iushln(shift);
          bhi = 0 | b.words[b.length - 1];
        }
        var m = a.length - b.length;
        var q;
        if ("mod" !== mode) {
          q = new BN(null);
          q.length = m + 1;
          q.words = new Array(q.length);
          for (var i = 0; i < q.length; i++) q.words[i] = 0;
        }
        var diff = a.clone()._ishlnsubmul(b, 1, m);
        if (0 === diff.negative) {
          a = diff;
          q && (q.words[m] = 1);
        }
        for (var j = m - 1; j >= 0; j--) {
          var qj = 67108864 * (0 | a.words[b.length + j]) + (0 | a.words[b.length + j - 1]);
          qj = Math.min(qj / bhi | 0, 67108863);
          a._ishlnsubmul(b, qj, j);
          while (0 !== a.negative) {
            qj--;
            a.negative = 0;
            a._ishlnsubmul(b, 1, j);
            a.isZero() || (a.negative ^= 1);
          }
          q && (q.words[j] = qj);
        }
        q && q.strip();
        a.strip();
        "div" !== mode && 0 !== shift && a.iushrn(shift);
        return {
          div: q || null,
          mod: a
        };
      };
      BN.prototype.divmod = function divmod(num, mode, positive) {
        assert(!num.isZero());
        if (this.isZero()) return {
          div: new BN(0),
          mod: new BN(0)
        };
        var div, mod, res;
        if (0 !== this.negative && 0 === num.negative) {
          res = this.neg().divmod(num, mode);
          "mod" !== mode && (div = res.div.neg());
          if ("div" !== mode) {
            mod = res.mod.neg();
            positive && 0 !== mod.negative && mod.iadd(num);
          }
          return {
            div: div,
            mod: mod
          };
        }
        if (0 === this.negative && 0 !== num.negative) {
          res = this.divmod(num.neg(), mode);
          "mod" !== mode && (div = res.div.neg());
          return {
            div: div,
            mod: res.mod
          };
        }
        if (0 !== (this.negative & num.negative)) {
          res = this.neg().divmod(num.neg(), mode);
          if ("div" !== mode) {
            mod = res.mod.neg();
            positive && 0 !== mod.negative && mod.isub(num);
          }
          return {
            div: res.div,
            mod: mod
          };
        }
        if (num.length > this.length || this.cmp(num) < 0) return {
          div: new BN(0),
          mod: this
        };
        if (1 === num.length) {
          if ("div" === mode) return {
            div: this.divn(num.words[0]),
            mod: null
          };
          if ("mod" === mode) return {
            div: null,
            mod: new BN(this.modn(num.words[0]))
          };
          return {
            div: this.divn(num.words[0]),
            mod: new BN(this.modn(num.words[0]))
          };
        }
        return this._wordDiv(num, mode);
      };
      BN.prototype.div = function div(num) {
        return this.divmod(num, "div", false).div;
      };
      BN.prototype.mod = function mod(num) {
        return this.divmod(num, "mod", false).mod;
      };
      BN.prototype.umod = function umod(num) {
        return this.divmod(num, "mod", true).mod;
      };
      BN.prototype.divRound = function divRound(num) {
        var dm = this.divmod(num);
        if (dm.mod.isZero()) return dm.div;
        var mod = 0 !== dm.div.negative ? dm.mod.isub(num) : dm.mod;
        var half = num.ushrn(1);
        var r2 = num.andln(1);
        var cmp = mod.cmp(half);
        if (cmp < 0 || 1 === r2 && 0 === cmp) return dm.div;
        return 0 !== dm.div.negative ? dm.div.isubn(1) : dm.div.iaddn(1);
      };
      BN.prototype.modn = function modn(num) {
        assert(num <= 67108863);
        var p = (1 << 26) % num;
        var acc = 0;
        for (var i = this.length - 1; i >= 0; i--) acc = (p * acc + (0 | this.words[i])) % num;
        return acc;
      };
      BN.prototype.idivn = function idivn(num) {
        assert(num <= 67108863);
        var carry = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          var w = (0 | this.words[i]) + 67108864 * carry;
          this.words[i] = w / num | 0;
          carry = w % num;
        }
        return this.strip();
      };
      BN.prototype.divn = function divn(num) {
        return this.clone().idivn(num);
      };
      BN.prototype.egcd = function egcd(p) {
        assert(0 === p.negative);
        assert(!p.isZero());
        var x = this;
        var y = p.clone();
        x = 0 !== x.negative ? x.umod(p) : x.clone();
        var A = new BN(1);
        var B = new BN(0);
        var C = new BN(0);
        var D = new BN(1);
        var g = 0;
        while (x.isEven() && y.isEven()) {
          x.iushrn(1);
          y.iushrn(1);
          ++g;
        }
        var yp = y.clone();
        var xp = x.clone();
        while (!x.isZero()) {
          for (var i = 0, im = 1; 0 === (x.words[0] & im) && i < 26; ++i, im <<= 1) ;
          if (i > 0) {
            x.iushrn(i);
            while (i-- > 0) {
              if (A.isOdd() || B.isOdd()) {
                A.iadd(yp);
                B.isub(xp);
              }
              A.iushrn(1);
              B.iushrn(1);
            }
          }
          for (var j = 0, jm = 1; 0 === (y.words[0] & jm) && j < 26; ++j, jm <<= 1) ;
          if (j > 0) {
            y.iushrn(j);
            while (j-- > 0) {
              if (C.isOdd() || D.isOdd()) {
                C.iadd(yp);
                D.isub(xp);
              }
              C.iushrn(1);
              D.iushrn(1);
            }
          }
          if (x.cmp(y) >= 0) {
            x.isub(y);
            A.isub(C);
            B.isub(D);
          } else {
            y.isub(x);
            C.isub(A);
            D.isub(B);
          }
        }
        return {
          a: C,
          b: D,
          gcd: y.iushln(g)
        };
      };
      BN.prototype._invmp = function _invmp(p) {
        assert(0 === p.negative);
        assert(!p.isZero());
        var a = this;
        var b = p.clone();
        a = 0 !== a.negative ? a.umod(p) : a.clone();
        var x1 = new BN(1);
        var x2 = new BN(0);
        var delta = b.clone();
        while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
          for (var i = 0, im = 1; 0 === (a.words[0] & im) && i < 26; ++i, im <<= 1) ;
          if (i > 0) {
            a.iushrn(i);
            while (i-- > 0) {
              x1.isOdd() && x1.iadd(delta);
              x1.iushrn(1);
            }
          }
          for (var j = 0, jm = 1; 0 === (b.words[0] & jm) && j < 26; ++j, jm <<= 1) ;
          if (j > 0) {
            b.iushrn(j);
            while (j-- > 0) {
              x2.isOdd() && x2.iadd(delta);
              x2.iushrn(1);
            }
          }
          if (a.cmp(b) >= 0) {
            a.isub(b);
            x1.isub(x2);
          } else {
            b.isub(a);
            x2.isub(x1);
          }
        }
        var res;
        res = 0 === a.cmpn(1) ? x1 : x2;
        res.cmpn(0) < 0 && res.iadd(p);
        return res;
      };
      BN.prototype.gcd = function gcd(num) {
        if (this.isZero()) return num.abs();
        if (num.isZero()) return this.abs();
        var a = this.clone();
        var b = num.clone();
        a.negative = 0;
        b.negative = 0;
        for (var shift = 0; a.isEven() && b.isEven(); shift++) {
          a.iushrn(1);
          b.iushrn(1);
        }
        do {
          while (a.isEven()) a.iushrn(1);
          while (b.isEven()) b.iushrn(1);
          var r = a.cmp(b);
          if (r < 0) {
            var t = a;
            a = b;
            b = t;
          } else if (0 === r || 0 === b.cmpn(1)) break;
          a.isub(b);
        } while (true);
        return b.iushln(shift);
      };
      BN.prototype.invm = function invm(num) {
        return this.egcd(num).a.umod(num);
      };
      BN.prototype.isEven = function isEven() {
        return 0 === (1 & this.words[0]);
      };
      BN.prototype.isOdd = function isOdd() {
        return 1 === (1 & this.words[0]);
      };
      BN.prototype.andln = function andln(num) {
        return this.words[0] & num;
      };
      BN.prototype.bincn = function bincn(bit) {
        assert("number" === typeof bit);
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        if (this.length <= s) {
          this._expand(s + 1);
          this.words[s] |= q;
          return this;
        }
        var carry = q;
        for (var i = s; 0 !== carry && i < this.length; i++) {
          var w = 0 | this.words[i];
          w += carry;
          carry = w >>> 26;
          w &= 67108863;
          this.words[i] = w;
        }
        if (0 !== carry) {
          this.words[i] = carry;
          this.length++;
        }
        return this;
      };
      BN.prototype.isZero = function isZero() {
        return 1 === this.length && 0 === this.words[0];
      };
      BN.prototype.cmpn = function cmpn(num) {
        var negative = num < 0;
        if (0 !== this.negative && !negative) return -1;
        if (0 === this.negative && negative) return 1;
        this.strip();
        var res;
        if (this.length > 1) res = 1; else {
          negative && (num = -num);
          assert(num <= 67108863, "Number is too big");
          var w = 0 | this.words[0];
          res = w === num ? 0 : w < num ? -1 : 1;
        }
        if (0 !== this.negative) return 0 | -res;
        return res;
      };
      BN.prototype.cmp = function cmp(num) {
        if (0 !== this.negative && 0 === num.negative) return -1;
        if (0 === this.negative && 0 !== num.negative) return 1;
        var res = this.ucmp(num);
        if (0 !== this.negative) return 0 | -res;
        return res;
      };
      BN.prototype.ucmp = function ucmp(num) {
        if (this.length > num.length) return 1;
        if (this.length < num.length) return -1;
        var res = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          var a = 0 | this.words[i];
          var b = 0 | num.words[i];
          if (a === b) continue;
          a < b ? res = -1 : a > b && (res = 1);
          break;
        }
        return res;
      };
      BN.prototype.gtn = function gtn(num) {
        return 1 === this.cmpn(num);
      };
      BN.prototype.gt = function gt(num) {
        return 1 === this.cmp(num);
      };
      BN.prototype.gten = function gten(num) {
        return this.cmpn(num) >= 0;
      };
      BN.prototype.gte = function gte(num) {
        return this.cmp(num) >= 0;
      };
      BN.prototype.ltn = function ltn(num) {
        return -1 === this.cmpn(num);
      };
      BN.prototype.lt = function lt(num) {
        return -1 === this.cmp(num);
      };
      BN.prototype.lten = function lten(num) {
        return this.cmpn(num) <= 0;
      };
      BN.prototype.lte = function lte(num) {
        return this.cmp(num) <= 0;
      };
      BN.prototype.eqn = function eqn(num) {
        return 0 === this.cmpn(num);
      };
      BN.prototype.eq = function eq(num) {
        return 0 === this.cmp(num);
      };
      BN.red = function red(num) {
        return new Red(num);
      };
      BN.prototype.toRed = function toRed(ctx) {
        assert(!this.red, "Already a number in reduction context");
        assert(0 === this.negative, "red works only with positives");
        return ctx.convertTo(this)._forceRed(ctx);
      };
      BN.prototype.fromRed = function fromRed() {
        assert(this.red, "fromRed works only with numbers in reduction context");
        return this.red.convertFrom(this);
      };
      BN.prototype._forceRed = function _forceRed(ctx) {
        this.red = ctx;
        return this;
      };
      BN.prototype.forceRed = function forceRed(ctx) {
        assert(!this.red, "Already a number in reduction context");
        return this._forceRed(ctx);
      };
      BN.prototype.redAdd = function redAdd(num) {
        assert(this.red, "redAdd works only with red numbers");
        return this.red.add(this, num);
      };
      BN.prototype.redIAdd = function redIAdd(num) {
        assert(this.red, "redIAdd works only with red numbers");
        return this.red.iadd(this, num);
      };
      BN.prototype.redSub = function redSub(num) {
        assert(this.red, "redSub works only with red numbers");
        return this.red.sub(this, num);
      };
      BN.prototype.redISub = function redISub(num) {
        assert(this.red, "redISub works only with red numbers");
        return this.red.isub(this, num);
      };
      BN.prototype.redShl = function redShl(num) {
        assert(this.red, "redShl works only with red numbers");
        return this.red.shl(this, num);
      };
      BN.prototype.redMul = function redMul(num) {
        assert(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.mul(this, num);
      };
      BN.prototype.redIMul = function redIMul(num) {
        assert(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.imul(this, num);
      };
      BN.prototype.redSqr = function redSqr() {
        assert(this.red, "redSqr works only with red numbers");
        this.red._verify1(this);
        return this.red.sqr(this);
      };
      BN.prototype.redISqr = function redISqr() {
        assert(this.red, "redISqr works only with red numbers");
        this.red._verify1(this);
        return this.red.isqr(this);
      };
      BN.prototype.redSqrt = function redSqrt() {
        assert(this.red, "redSqrt works only with red numbers");
        this.red._verify1(this);
        return this.red.sqrt(this);
      };
      BN.prototype.redInvm = function redInvm() {
        assert(this.red, "redInvm works only with red numbers");
        this.red._verify1(this);
        return this.red.invm(this);
      };
      BN.prototype.redNeg = function redNeg() {
        assert(this.red, "redNeg works only with red numbers");
        this.red._verify1(this);
        return this.red.neg(this);
      };
      BN.prototype.redPow = function redPow(num) {
        assert(this.red && !num.red, "redPow(normalNum)");
        this.red._verify1(this);
        return this.red.pow(this, num);
      };
      var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };
      function MPrime(name, p) {
        this.name = name;
        this.p = new BN(p, 16);
        this.n = this.p.bitLength();
        this.k = new BN(1).iushln(this.n).isub(this.p);
        this.tmp = this._tmp();
      }
      MPrime.prototype._tmp = function _tmp() {
        var tmp = new BN(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
      };
      MPrime.prototype.ireduce = function ireduce(num) {
        var r = num;
        var rlen;
        do {
          this.split(r, this.tmp);
          r = this.imulK(r);
          r = r.iadd(this.tmp);
          rlen = r.bitLength();
        } while (rlen > this.n);
        var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
        if (0 === cmp) {
          r.words[0] = 0;
          r.length = 1;
        } else cmp > 0 ? r.isub(this.p) : r.strip();
        return r;
      };
      MPrime.prototype.split = function split(input, out) {
        input.iushrn(this.n, 0, out);
      };
      MPrime.prototype.imulK = function imulK(num) {
        return num.imul(this.k);
      };
      function K256() {
        MPrime.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
      }
      inherits(K256, MPrime);
      K256.prototype.split = function split(input, output) {
        var mask = 4194303;
        var outLen = Math.min(input.length, 9);
        for (var i = 0; i < outLen; i++) output.words[i] = input.words[i];
        output.length = outLen;
        if (input.length <= 9) {
          input.words[0] = 0;
          input.length = 1;
          return;
        }
        var prev = input.words[9];
        output.words[output.length++] = prev & mask;
        for (i = 10; i < input.length; i++) {
          var next = 0 | input.words[i];
          input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
          prev = next;
        }
        prev >>>= 22;
        input.words[i - 10] = prev;
        0 === prev && input.length > 10 ? input.length -= 10 : input.length -= 9;
      };
      K256.prototype.imulK = function imulK(num) {
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2;
        var lo = 0;
        for (var i = 0; i < num.length; i++) {
          var w = 0 | num.words[i];
          lo += 977 * w;
          num.words[i] = 67108863 & lo;
          lo = 64 * w + (lo / 67108864 | 0);
        }
        if (0 === num.words[num.length - 1]) {
          num.length--;
          0 === num.words[num.length - 1] && num.length--;
        }
        return num;
      };
      function P224() {
        MPrime.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
      }
      inherits(P224, MPrime);
      function P192() {
        MPrime.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
      }
      inherits(P192, MPrime);
      function P25519() {
        MPrime.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
      }
      inherits(P25519, MPrime);
      P25519.prototype.imulK = function imulK(num) {
        var carry = 0;
        for (var i = 0; i < num.length; i++) {
          var hi = 19 * (0 | num.words[i]) + carry;
          var lo = 67108863 & hi;
          hi >>>= 26;
          num.words[i] = lo;
          carry = hi;
        }
        0 !== carry && (num.words[num.length++] = carry);
        return num;
      };
      BN._prime = function prime(name) {
        if (primes[name]) return primes[name];
        var prime;
        if ("k256" === name) prime = new K256(); else if ("p224" === name) prime = new P224(); else if ("p192" === name) prime = new P192(); else {
          if ("p25519" !== name) throw new Error("Unknown prime " + name);
          prime = new P25519();
        }
        primes[name] = prime;
        return prime;
      };
      function Red(m) {
        if ("string" === typeof m) {
          var prime = BN._prime(m);
          this.m = prime.p;
          this.prime = prime;
        } else {
          assert(m.gtn(1), "modulus must be greater than 1");
          this.m = m;
          this.prime = null;
        }
      }
      Red.prototype._verify1 = function _verify1(a) {
        assert(0 === a.negative, "red works only with positives");
        assert(a.red, "red works only with red numbers");
      };
      Red.prototype._verify2 = function _verify2(a, b) {
        assert(0 === (a.negative | b.negative), "red works only with positives");
        assert(a.red && a.red === b.red, "red works only with red numbers");
      };
      Red.prototype.imod = function imod(a) {
        if (this.prime) return this.prime.ireduce(a)._forceRed(this);
        return a.umod(this.m)._forceRed(this);
      };
      Red.prototype.neg = function neg(a) {
        if (a.isZero()) return a.clone();
        return this.m.sub(a)._forceRed(this);
      };
      Red.prototype.add = function add(a, b) {
        this._verify2(a, b);
        var res = a.add(b);
        res.cmp(this.m) >= 0 && res.isub(this.m);
        return res._forceRed(this);
      };
      Red.prototype.iadd = function iadd(a, b) {
        this._verify2(a, b);
        var res = a.iadd(b);
        res.cmp(this.m) >= 0 && res.isub(this.m);
        return res;
      };
      Red.prototype.sub = function sub(a, b) {
        this._verify2(a, b);
        var res = a.sub(b);
        res.cmpn(0) < 0 && res.iadd(this.m);
        return res._forceRed(this);
      };
      Red.prototype.isub = function isub(a, b) {
        this._verify2(a, b);
        var res = a.isub(b);
        res.cmpn(0) < 0 && res.iadd(this.m);
        return res;
      };
      Red.prototype.shl = function shl(a, num) {
        this._verify1(a);
        return this.imod(a.ushln(num));
      };
      Red.prototype.imul = function imul(a, b) {
        this._verify2(a, b);
        return this.imod(a.imul(b));
      };
      Red.prototype.mul = function mul(a, b) {
        this._verify2(a, b);
        return this.imod(a.mul(b));
      };
      Red.prototype.isqr = function isqr(a) {
        return this.imul(a, a.clone());
      };
      Red.prototype.sqr = function sqr(a) {
        return this.mul(a, a);
      };
      Red.prototype.sqrt = function sqrt(a) {
        if (a.isZero()) return a.clone();
        var mod3 = this.m.andln(3);
        assert(mod3 % 2 === 1);
        if (3 === mod3) {
          var pow = this.m.add(new BN(1)).iushrn(2);
          return this.pow(a, pow);
        }
        var q = this.m.subn(1);
        var s = 0;
        while (!q.isZero() && 0 === q.andln(1)) {
          s++;
          q.iushrn(1);
        }
        assert(!q.isZero());
        var one = new BN(1).toRed(this);
        var nOne = one.redNeg();
        var lpow = this.m.subn(1).iushrn(1);
        var z = this.m.bitLength();
        z = new BN(2 * z * z).toRed(this);
        while (0 !== this.pow(z, lpow).cmp(nOne)) z.redIAdd(nOne);
        var c = this.pow(z, q);
        var r = this.pow(a, q.addn(1).iushrn(1));
        var t = this.pow(a, q);
        var m = s;
        while (0 !== t.cmp(one)) {
          var tmp = t;
          for (var i = 0; 0 !== tmp.cmp(one); i++) tmp = tmp.redSqr();
          assert(i < m);
          var b = this.pow(c, new BN(1).iushln(m - i - 1));
          r = r.redMul(b);
          c = b.redSqr();
          t = t.redMul(c);
          m = i;
        }
        return r;
      };
      Red.prototype.invm = function invm(a) {
        var inv = a._invmp(this.m);
        if (0 !== inv.negative) {
          inv.negative = 0;
          return this.imod(inv).redNeg();
        }
        return this.imod(inv);
      };
      Red.prototype.pow = function pow(a, num) {
        if (num.isZero()) return new BN(1).toRed(this);
        if (0 === num.cmpn(1)) return a.clone();
        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN(1).toRed(this);
        wnd[1] = a;
        for (var i = 2; i < wnd.length; i++) wnd[i] = this.mul(wnd[i - 1], a);
        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start = num.bitLength() % 26;
        0 === start && (start = 26);
        for (i = num.length - 1; i >= 0; i--) {
          var word = num.words[i];
          for (var j = start - 1; j >= 0; j--) {
            var bit = word >> j & 1;
            res !== wnd[0] && (res = this.sqr(res));
            if (0 === bit && 0 === current) {
              currentLen = 0;
              continue;
            }
            current <<= 1;
            current |= bit;
            currentLen++;
            if (currentLen !== windowSize && (0 !== i || 0 !== j)) continue;
            res = this.mul(res, wnd[current]);
            currentLen = 0;
            current = 0;
          }
          start = 26;
        }
        return res;
      };
      Red.prototype.convertTo = function convertTo(num) {
        var r = num.umod(this.m);
        return r === num ? r.clone() : r;
      };
      Red.prototype.convertFrom = function convertFrom(num) {
        var res = num.clone();
        res.red = null;
        return res;
      };
      BN.mont = function mont(num) {
        return new Mont(num);
      };
      function Mont(m) {
        Red.call(this, m);
        this.shift = this.m.bitLength();
        this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26);
        this.r = new BN(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);
        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
      }
      inherits(Mont, Red);
      Mont.prototype.convertTo = function convertTo(num) {
        return this.imod(num.ushln(this.shift));
      };
      Mont.prototype.convertFrom = function convertFrom(num) {
        var r = this.imod(num.mul(this.rinv));
        r.red = null;
        return r;
      };
      Mont.prototype.imul = function imul(a, b) {
        if (a.isZero() || b.isZero()) {
          a.words[0] = 0;
          a.length = 1;
          return a;
        }
        var t = a.imul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        u.cmp(this.m) >= 0 ? res = u.isub(this.m) : u.cmpn(0) < 0 && (res = u.iadd(this.m));
        return res._forceRed(this);
      };
      Mont.prototype.mul = function mul(a, b) {
        if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
        var t = a.mul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        u.cmp(this.m) >= 0 ? res = u.isub(this.m) : u.cmpn(0) < 0 && (res = u.iadd(this.m));
        return res._forceRed(this);
      };
      Mont.prototype.invm = function invm(a) {
        var res = this.imod(a._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
      };
    })("undefined" === typeof module || module, this);
  }, {
    buffer: 18
  } ],
  17: [ function(require, module, exports) {
    var r;
    module.exports = function rand(len) {
      r || (r = new Rand(null));
      return r.generate(len);
    };
    function Rand(rand) {
      this.rand = rand;
    }
    module.exports.Rand = Rand;
    Rand.prototype.generate = function generate(len) {
      return this._rand(len);
    };
    Rand.prototype._rand = function _rand(n) {
      if (this.rand.getBytes) return this.rand.getBytes(n);
      var res = new Uint8Array(n);
      for (var i = 0; i < res.length; i++) res[i] = this.rand.getByte();
      return res;
    };
    if ("object" === typeof self) self.crypto && self.crypto.getRandomValues ? Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.crypto.getRandomValues(arr);
      return arr;
    } : self.msCrypto && self.msCrypto.getRandomValues ? Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.msCrypto.getRandomValues(arr);
      return arr;
    } : "object" === typeof window && (Rand.prototype._rand = function() {
      throw new Error("Not implemented yet");
    }); else try {
      var crypto = require("crypto");
      if ("function" !== typeof crypto.randomBytes) throw new Error("Not supported");
      Rand.prototype._rand = function _rand(n) {
        return crypto.randomBytes(n);
      };
    } catch (e) {}
  }, {
    crypto: 18
  } ],
  18: [ function(require, module, exports) {}, {} ],
  19: [ function(require, module, exports) {
    var Buffer = require("safe-buffer").Buffer;
    function asUInt32Array(buf) {
      Buffer.isBuffer(buf) || (buf = Buffer.from(buf));
      var len = buf.length / 4 | 0;
      var out = new Array(len);
      for (var i = 0; i < len; i++) out[i] = buf.readUInt32BE(4 * i);
      return out;
    }
    function scrubVec(v) {
      for (var i = 0; i < v.length; v++) v[i] = 0;
    }
    function cryptBlock(M, keySchedule, SUB_MIX, SBOX, nRounds) {
      var SUB_MIX0 = SUB_MIX[0];
      var SUB_MIX1 = SUB_MIX[1];
      var SUB_MIX2 = SUB_MIX[2];
      var SUB_MIX3 = SUB_MIX[3];
      var s0 = M[0] ^ keySchedule[0];
      var s1 = M[1] ^ keySchedule[1];
      var s2 = M[2] ^ keySchedule[2];
      var s3 = M[3] ^ keySchedule[3];
      var t0, t1, t2, t3;
      var ksRow = 4;
      for (var round = 1; round < nRounds; round++) {
        t0 = SUB_MIX0[s0 >>> 24] ^ SUB_MIX1[s1 >>> 16 & 255] ^ SUB_MIX2[s2 >>> 8 & 255] ^ SUB_MIX3[255 & s3] ^ keySchedule[ksRow++];
        t1 = SUB_MIX0[s1 >>> 24] ^ SUB_MIX1[s2 >>> 16 & 255] ^ SUB_MIX2[s3 >>> 8 & 255] ^ SUB_MIX3[255 & s0] ^ keySchedule[ksRow++];
        t2 = SUB_MIX0[s2 >>> 24] ^ SUB_MIX1[s3 >>> 16 & 255] ^ SUB_MIX2[s0 >>> 8 & 255] ^ SUB_MIX3[255 & s1] ^ keySchedule[ksRow++];
        t3 = SUB_MIX0[s3 >>> 24] ^ SUB_MIX1[s0 >>> 16 & 255] ^ SUB_MIX2[s1 >>> 8 & 255] ^ SUB_MIX3[255 & s2] ^ keySchedule[ksRow++];
        s0 = t0;
        s1 = t1;
        s2 = t2;
        s3 = t3;
      }
      t0 = (SBOX[s0 >>> 24] << 24 | SBOX[s1 >>> 16 & 255] << 16 | SBOX[s2 >>> 8 & 255] << 8 | SBOX[255 & s3]) ^ keySchedule[ksRow++];
      t1 = (SBOX[s1 >>> 24] << 24 | SBOX[s2 >>> 16 & 255] << 16 | SBOX[s3 >>> 8 & 255] << 8 | SBOX[255 & s0]) ^ keySchedule[ksRow++];
      t2 = (SBOX[s2 >>> 24] << 24 | SBOX[s3 >>> 16 & 255] << 16 | SBOX[s0 >>> 8 & 255] << 8 | SBOX[255 & s1]) ^ keySchedule[ksRow++];
      t3 = (SBOX[s3 >>> 24] << 24 | SBOX[s0 >>> 16 & 255] << 16 | SBOX[s1 >>> 8 & 255] << 8 | SBOX[255 & s2]) ^ keySchedule[ksRow++];
      t0 >>>= 0;
      t1 >>>= 0;
      t2 >>>= 0;
      t3 >>>= 0;
      return [ t0, t1, t2, t3 ];
    }
    var RCON = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ];
    var G = function() {
      var d = new Array(256);
      for (var j = 0; j < 256; j++) d[j] = j < 128 ? j << 1 : j << 1 ^ 283;
      var SBOX = [];
      var INV_SBOX = [];
      var SUB_MIX = [ [], [], [], [] ];
      var INV_SUB_MIX = [ [], [], [], [] ];
      var x = 0;
      var xi = 0;
      for (var i = 0; i < 256; ++i) {
        var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
        sx = sx >>> 8 ^ 255 & sx ^ 99;
        SBOX[x] = sx;
        INV_SBOX[sx] = x;
        var x2 = d[x];
        var x4 = d[x2];
        var x8 = d[x4];
        var t = 257 * d[sx] ^ 16843008 * sx;
        SUB_MIX[0][x] = t << 24 | t >>> 8;
        SUB_MIX[1][x] = t << 16 | t >>> 16;
        SUB_MIX[2][x] = t << 8 | t >>> 24;
        SUB_MIX[3][x] = t;
        t = 16843009 * x8 ^ 65537 * x4 ^ 257 * x2 ^ 16843008 * x;
        INV_SUB_MIX[0][sx] = t << 24 | t >>> 8;
        INV_SUB_MIX[1][sx] = t << 16 | t >>> 16;
        INV_SUB_MIX[2][sx] = t << 8 | t >>> 24;
        INV_SUB_MIX[3][sx] = t;
        if (0 === x) x = xi = 1; else {
          x = x2 ^ d[d[d[x8 ^ x2]]];
          xi ^= d[d[xi]];
        }
      }
      return {
        SBOX: SBOX,
        INV_SBOX: INV_SBOX,
        SUB_MIX: SUB_MIX,
        INV_SUB_MIX: INV_SUB_MIX
      };
    }();
    function AES(key) {
      this._key = asUInt32Array(key);
      this._reset();
    }
    AES.blockSize = 16;
    AES.keySize = 32;
    AES.prototype.blockSize = AES.blockSize;
    AES.prototype.keySize = AES.keySize;
    AES.prototype._reset = function() {
      var keyWords = this._key;
      var keySize = keyWords.length;
      var nRounds = keySize + 6;
      var ksRows = 4 * (nRounds + 1);
      var keySchedule = [];
      for (var k = 0; k < keySize; k++) keySchedule[k] = keyWords[k];
      for (k = keySize; k < ksRows; k++) {
        var t = keySchedule[k - 1];
        if (k % keySize === 0) {
          t = t << 8 | t >>> 24;
          t = G.SBOX[t >>> 24] << 24 | G.SBOX[t >>> 16 & 255] << 16 | G.SBOX[t >>> 8 & 255] << 8 | G.SBOX[255 & t];
          t ^= RCON[k / keySize | 0] << 24;
        } else keySize > 6 && k % keySize === 4 && (t = G.SBOX[t >>> 24] << 24 | G.SBOX[t >>> 16 & 255] << 16 | G.SBOX[t >>> 8 & 255] << 8 | G.SBOX[255 & t]);
        keySchedule[k] = keySchedule[k - keySize] ^ t;
      }
      var invKeySchedule = [];
      for (var ik = 0; ik < ksRows; ik++) {
        var ksR = ksRows - ik;
        var tt = keySchedule[ksR - (ik % 4 ? 0 : 4)];
        invKeySchedule[ik] = ik < 4 || ksR <= 4 ? tt : G.INV_SUB_MIX[0][G.SBOX[tt >>> 24]] ^ G.INV_SUB_MIX[1][G.SBOX[tt >>> 16 & 255]] ^ G.INV_SUB_MIX[2][G.SBOX[tt >>> 8 & 255]] ^ G.INV_SUB_MIX[3][G.SBOX[255 & tt]];
      }
      this._nRounds = nRounds;
      this._keySchedule = keySchedule;
      this._invKeySchedule = invKeySchedule;
    };
    AES.prototype.encryptBlockRaw = function(M) {
      M = asUInt32Array(M);
      return cryptBlock(M, this._keySchedule, G.SUB_MIX, G.SBOX, this._nRounds);
    };
    AES.prototype.encryptBlock = function(M) {
      var out = this.encryptBlockRaw(M);
      var buf = Buffer.allocUnsafe(16);
      buf.writeUInt32BE(out[0], 0);
      buf.writeUInt32BE(out[1], 4);
      buf.writeUInt32BE(out[2], 8);
      buf.writeUInt32BE(out[3], 12);
      return buf;
    };
    AES.prototype.decryptBlock = function(M) {
      M = asUInt32Array(M);
      var m1 = M[1];
      M[1] = M[3];
      M[3] = m1;
      var out = cryptBlock(M, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX, this._nRounds);
      var buf = Buffer.allocUnsafe(16);
      buf.writeUInt32BE(out[0], 0);
      buf.writeUInt32BE(out[3], 4);
      buf.writeUInt32BE(out[2], 8);
      buf.writeUInt32BE(out[1], 12);
      return buf;
    };
    AES.prototype.scrub = function() {
      scrubVec(this._keySchedule);
      scrubVec(this._invKeySchedule);
      scrubVec(this._key);
    };
    module.exports.AES = AES;
  }, {
    "safe-buffer": 143
  } ],
  20: [ function(require, module, exports) {
    var aes = require("./aes");
    var Buffer = require("safe-buffer").Buffer;
    var Transform = require("cipher-base");
    var inherits = require("inherits");
    var GHASH = require("./ghash");
    var xor = require("buffer-xor");
    var incr32 = require("./incr32");
    function xorTest(a, b) {
      var out = 0;
      a.length !== b.length && out++;
      var len = Math.min(a.length, b.length);
      for (var i = 0; i < len; ++i) out += a[i] ^ b[i];
      return out;
    }
    function calcIv(self, iv, ck) {
      if (12 === iv.length) {
        self._finID = Buffer.concat([ iv, Buffer.from([ 0, 0, 0, 1 ]) ]);
        return Buffer.concat([ iv, Buffer.from([ 0, 0, 0, 2 ]) ]);
      }
      var ghash = new GHASH(ck);
      var len = iv.length;
      var toPad = len % 16;
      ghash.update(iv);
      if (toPad) {
        toPad = 16 - toPad;
        ghash.update(Buffer.alloc(toPad, 0));
      }
      ghash.update(Buffer.alloc(8, 0));
      var ivBits = 8 * len;
      var tail = Buffer.alloc(8);
      tail.writeUIntBE(ivBits, 0, 8);
      ghash.update(tail);
      self._finID = ghash.state;
      var out = Buffer.from(self._finID);
      incr32(out);
      return out;
    }
    function StreamCipher(mode, key, iv, decrypt) {
      Transform.call(this);
      var h = Buffer.alloc(4, 0);
      this._cipher = new aes.AES(key);
      var ck = this._cipher.encryptBlock(h);
      this._ghash = new GHASH(ck);
      iv = calcIv(this, iv, ck);
      this._prev = Buffer.from(iv);
      this._cache = Buffer.allocUnsafe(0);
      this._secCache = Buffer.allocUnsafe(0);
      this._decrypt = decrypt;
      this._alen = 0;
      this._len = 0;
      this._mode = mode;
      this._authTag = null;
      this._called = false;
    }
    inherits(StreamCipher, Transform);
    StreamCipher.prototype._update = function(chunk) {
      if (!this._called && this._alen) {
        var rump = 16 - this._alen % 16;
        if (rump < 16) {
          rump = Buffer.alloc(rump, 0);
          this._ghash.update(rump);
        }
      }
      this._called = true;
      var out = this._mode.encrypt(this, chunk);
      this._decrypt ? this._ghash.update(chunk) : this._ghash.update(out);
      this._len += chunk.length;
      return out;
    };
    StreamCipher.prototype._final = function() {
      if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
      var tag = xor(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
      if (this._decrypt && xorTest(tag, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
      this._authTag = tag;
      this._cipher.scrub();
    };
    StreamCipher.prototype.getAuthTag = function getAuthTag() {
      if (this._decrypt || !Buffer.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
      return this._authTag;
    };
    StreamCipher.prototype.setAuthTag = function setAuthTag(tag) {
      if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
      this._authTag = tag;
    };
    StreamCipher.prototype.setAAD = function setAAD(buf) {
      if (this._called) throw new Error("Attempting to set AAD in unsupported state");
      this._ghash.update(buf);
      this._alen += buf.length;
    };
    module.exports = StreamCipher;
  }, {
    "./aes": 19,
    "./ghash": 24,
    "./incr32": 25,
    "buffer-xor": 46,
    "cipher-base": 49,
    inherits: 101,
    "safe-buffer": 143
  } ],
  21: [ function(require, module, exports) {
    var ciphers = require("./encrypter");
    var deciphers = require("./decrypter");
    var modes = require("./modes/list.json");
    function getCiphers() {
      return Object.keys(modes);
    }
    exports.createCipher = exports.Cipher = ciphers.createCipher;
    exports.createCipheriv = exports.Cipheriv = ciphers.createCipheriv;
    exports.createDecipher = exports.Decipher = deciphers.createDecipher;
    exports.createDecipheriv = exports.Decipheriv = deciphers.createDecipheriv;
    exports.listCiphers = exports.getCiphers = getCiphers;
  }, {
    "./decrypter": 22,
    "./encrypter": 23,
    "./modes/list.json": 33
  } ],
  22: [ function(require, module, exports) {
    var AuthCipher = require("./authCipher");
    var Buffer = require("safe-buffer").Buffer;
    var MODES = require("./modes");
    var StreamCipher = require("./streamCipher");
    var Transform = require("cipher-base");
    var aes = require("./aes");
    var ebtk = require("evp_bytestokey");
    var inherits = require("inherits");
    function Decipher(mode, key, iv) {
      Transform.call(this);
      this._cache = new Splitter();
      this._last = void 0;
      this._cipher = new aes.AES(key);
      this._prev = Buffer.from(iv);
      this._mode = mode;
      this._autopadding = true;
    }
    inherits(Decipher, Transform);
    Decipher.prototype._update = function(data) {
      this._cache.add(data);
      var chunk;
      var thing;
      var out = [];
      while (chunk = this._cache.get(this._autopadding)) {
        thing = this._mode.decrypt(this, chunk);
        out.push(thing);
      }
      return Buffer.concat(out);
    };
    Decipher.prototype._final = function() {
      var chunk = this._cache.flush();
      if (this._autopadding) return unpad(this._mode.decrypt(this, chunk));
      if (chunk) throw new Error("data not multiple of block length");
    };
    Decipher.prototype.setAutoPadding = function(setTo) {
      this._autopadding = !!setTo;
      return this;
    };
    function Splitter() {
      this.cache = Buffer.allocUnsafe(0);
    }
    Splitter.prototype.add = function(data) {
      this.cache = Buffer.concat([ this.cache, data ]);
    };
    Splitter.prototype.get = function(autoPadding) {
      var out;
      if (autoPadding) {
        if (this.cache.length > 16) {
          out = this.cache.slice(0, 16);
          this.cache = this.cache.slice(16);
          return out;
        }
      } else if (this.cache.length >= 16) {
        out = this.cache.slice(0, 16);
        this.cache = this.cache.slice(16);
        return out;
      }
      return null;
    };
    Splitter.prototype.flush = function() {
      if (this.cache.length) return this.cache;
    };
    function unpad(last) {
      var padded = last[15];
      if (padded < 1 || padded > 16) throw new Error("unable to decrypt data");
      var i = -1;
      while (++i < padded) if (last[i + (16 - padded)] !== padded) throw new Error("unable to decrypt data");
      if (16 === padded) return;
      return last.slice(0, 16 - padded);
    }
    function createDecipheriv(suite, password, iv) {
      var config = MODES[suite.toLowerCase()];
      if (!config) throw new TypeError("invalid suite type");
      "string" === typeof iv && (iv = Buffer.from(iv));
      if ("GCM" !== config.mode && iv.length !== config.iv) throw new TypeError("invalid iv length " + iv.length);
      "string" === typeof password && (password = Buffer.from(password));
      if (password.length !== config.key / 8) throw new TypeError("invalid key length " + password.length);
      if ("stream" === config.type) return new StreamCipher(config.module, password, iv, true);
      if ("auth" === config.type) return new AuthCipher(config.module, password, iv, true);
      return new Decipher(config.module, password, iv);
    }
    function createDecipher(suite, password) {
      var config = MODES[suite.toLowerCase()];
      if (!config) throw new TypeError("invalid suite type");
      var keys = ebtk(password, false, config.key, config.iv);
      return createDecipheriv(suite, keys.key, keys.iv);
    }
    exports.createDecipher = createDecipher;
    exports.createDecipheriv = createDecipheriv;
  }, {
    "./aes": 19,
    "./authCipher": 20,
    "./modes": 32,
    "./streamCipher": 35,
    "cipher-base": 49,
    evp_bytestokey: 84,
    inherits: 101,
    "safe-buffer": 143
  } ],
  23: [ function(require, module, exports) {
    var MODES = require("./modes");
    var AuthCipher = require("./authCipher");
    var Buffer = require("safe-buffer").Buffer;
    var StreamCipher = require("./streamCipher");
    var Transform = require("cipher-base");
    var aes = require("./aes");
    var ebtk = require("evp_bytestokey");
    var inherits = require("inherits");
    function Cipher(mode, key, iv) {
      Transform.call(this);
      this._cache = new Splitter();
      this._cipher = new aes.AES(key);
      this._prev = Buffer.from(iv);
      this._mode = mode;
      this._autopadding = true;
    }
    inherits(Cipher, Transform);
    Cipher.prototype._update = function(data) {
      this._cache.add(data);
      var chunk;
      var thing;
      var out = [];
      while (chunk = this._cache.get()) {
        thing = this._mode.encrypt(this, chunk);
        out.push(thing);
      }
      return Buffer.concat(out);
    };
    var PADDING = Buffer.alloc(16, 16);
    Cipher.prototype._final = function() {
      var chunk = this._cache.flush();
      if (this._autopadding) {
        chunk = this._mode.encrypt(this, chunk);
        this._cipher.scrub();
        return chunk;
      }
      if (!chunk.equals(PADDING)) {
        this._cipher.scrub();
        throw new Error("data not multiple of block length");
      }
    };
    Cipher.prototype.setAutoPadding = function(setTo) {
      this._autopadding = !!setTo;
      return this;
    };
    function Splitter() {
      this.cache = Buffer.allocUnsafe(0);
    }
    Splitter.prototype.add = function(data) {
      this.cache = Buffer.concat([ this.cache, data ]);
    };
    Splitter.prototype.get = function() {
      if (this.cache.length > 15) {
        var out = this.cache.slice(0, 16);
        this.cache = this.cache.slice(16);
        return out;
      }
      return null;
    };
    Splitter.prototype.flush = function() {
      var len = 16 - this.cache.length;
      var padBuff = Buffer.allocUnsafe(len);
      var i = -1;
      while (++i < len) padBuff.writeUInt8(len, i);
      return Buffer.concat([ this.cache, padBuff ]);
    };
    function createCipheriv(suite, password, iv) {
      var config = MODES[suite.toLowerCase()];
      if (!config) throw new TypeError("invalid suite type");
      "string" === typeof password && (password = Buffer.from(password));
      if (password.length !== config.key / 8) throw new TypeError("invalid key length " + password.length);
      "string" === typeof iv && (iv = Buffer.from(iv));
      if ("GCM" !== config.mode && iv.length !== config.iv) throw new TypeError("invalid iv length " + iv.length);
      if ("stream" === config.type) return new StreamCipher(config.module, password, iv);
      if ("auth" === config.type) return new AuthCipher(config.module, password, iv);
      return new Cipher(config.module, password, iv);
    }
    function createCipher(suite, password) {
      var config = MODES[suite.toLowerCase()];
      if (!config) throw new TypeError("invalid suite type");
      var keys = ebtk(password, false, config.key, config.iv);
      return createCipheriv(suite, keys.key, keys.iv);
    }
    exports.createCipheriv = createCipheriv;
    exports.createCipher = createCipher;
  }, {
    "./aes": 19,
    "./authCipher": 20,
    "./modes": 32,
    "./streamCipher": 35,
    "cipher-base": 49,
    evp_bytestokey: 84,
    inherits: 101,
    "safe-buffer": 143
  } ],
  24: [ function(require, module, exports) {
    var Buffer = require("safe-buffer").Buffer;
    var ZEROES = Buffer.alloc(16, 0);
    function toArray(buf) {
      return [ buf.readUInt32BE(0), buf.readUInt32BE(4), buf.readUInt32BE(8), buf.readUInt32BE(12) ];
    }
    function fromArray(out) {
      var buf = Buffer.allocUnsafe(16);
      buf.writeUInt32BE(out[0] >>> 0, 0);
      buf.writeUInt32BE(out[1] >>> 0, 4);
      buf.writeUInt32BE(out[2] >>> 0, 8);
      buf.writeUInt32BE(out[3] >>> 0, 12);
      return buf;
    }
    function GHASH(key) {
      this.h = key;
      this.state = Buffer.alloc(16, 0);
      this.cache = Buffer.allocUnsafe(0);
    }
    GHASH.prototype.ghash = function(block) {
      var i = -1;
      while (++i < block.length) this.state[i] ^= block[i];
      this._multiply();
    };
    GHASH.prototype._multiply = function() {
      var Vi = toArray(this.h);
      var Zi = [ 0, 0, 0, 0 ];
      var j, xi, lsbVi;
      var i = -1;
      while (++i < 128) {
        xi = 0 !== (this.state[~~(i / 8)] & 1 << 7 - i % 8);
        if (xi) {
          Zi[0] ^= Vi[0];
          Zi[1] ^= Vi[1];
          Zi[2] ^= Vi[2];
          Zi[3] ^= Vi[3];
        }
        lsbVi = 0 !== (1 & Vi[3]);
        for (j = 3; j > 0; j--) Vi[j] = Vi[j] >>> 1 | (1 & Vi[j - 1]) << 31;
        Vi[0] = Vi[0] >>> 1;
        lsbVi && (Vi[0] = Vi[0] ^ 225 << 24);
      }
      this.state = fromArray(Zi);
    };
    GHASH.prototype.update = function(buf) {
      this.cache = Buffer.concat([ this.cache, buf ]);
      var chunk;
      while (this.cache.length >= 16) {
        chunk = this.cache.slice(0, 16);
        this.cache = this.cache.slice(16);
        this.ghash(chunk);
      }
    };
    GHASH.prototype.final = function(abl, bl) {
      this.cache.length && this.ghash(Buffer.concat([ this.cache, ZEROES ], 16));
      this.ghash(fromArray([ 0, abl, 0, bl ]));
      return this.state;
    };
    module.exports = GHASH;
  }, {
    "safe-buffer": 143
  } ],
  25: [ function(require, module, exports) {
    function incr32(iv) {
      var len = iv.length;
      var item;
      while (len--) {
        item = iv.readUInt8(len);
        if (255 !== item) {
          item++;
          iv.writeUInt8(item, len);
          break;
        }
        iv.writeUInt8(0, len);
      }
    }
    module.exports = incr32;
  }, {} ],
  26: [ function(require, module, exports) {
    var xor = require("buffer-xor");
    exports.encrypt = function(self, block) {
      var data = xor(block, self._prev);
      self._prev = self._cipher.encryptBlock(data);
      return self._prev;
    };
    exports.decrypt = function(self, block) {
      var pad = self._prev;
      self._prev = block;
      var out = self._cipher.decryptBlock(block);
      return xor(out, pad);
    };
  }, {
    "buffer-xor": 46
  } ],
  27: [ function(require, module, exports) {
    var Buffer = require("safe-buffer").Buffer;
    var xor = require("buffer-xor");
    function encryptStart(self, data, decrypt) {
      var len = data.length;
      var out = xor(data, self._cache);
      self._cache = self._cache.slice(len);
      self._prev = Buffer.concat([ self._prev, decrypt ? data : out ]);
      return out;
    }
    exports.encrypt = function(self, data, decrypt) {
      var out = Buffer.allocUnsafe(0);
      var len;
      while (data.length) {
        if (0 === self._cache.length) {
          self._cache = self._cipher.encryptBlock(self._prev);
          self._prev = Buffer.allocUnsafe(0);
        }
        if (!(self._cache.length <= data.length)) {
          out = Buffer.concat([ out, encryptStart(self, data, decrypt) ]);
          break;
        }
        len = self._cache.length;
        out = Buffer.concat([ out, encryptStart(self, data.slice(0, len), decrypt) ]);
        data = data.slice(len);
      }
      return out;
    };
  }, {
    "buffer-xor": 46,
    "safe-buffer": 143
  } ],
  28: [ function(require, module, exports) {
    var Buffer = require("safe-buffer").Buffer;
    function encryptByte(self, byteParam, decrypt) {
      var pad;
      var i = -1;
      var len = 8;
      var out = 0;
      var bit, value;
      while (++i < len) {
        pad = self._cipher.encryptBlock(self._prev);
        bit = byteParam & 1 << 7 - i ? 128 : 0;
        value = pad[0] ^ bit;
        out += (128 & value) >> i % 8;
        self._prev = shiftIn(self._prev, decrypt ? bit : value);
      }
      return out;
    }
    function shiftIn(buffer, value) {
      var len = buffer.length;
      var i = -1;
      var out = Buffer.allocUnsafe(buffer.length);
      buffer = Buffer.concat([ buffer, Buffer.from([ value ]) ]);
      while (++i < len) out[i] = buffer[i] << 1 | buffer[i + 1] >> 7;
      return out;
    }
    exports.encrypt = function(self, chunk, decrypt) {
      var len = chunk.length;
      var out = Buffer.allocUnsafe(len);
      var i = -1;
      while (++i < len) out[i] = encryptByte(self, chunk[i], decrypt);
      return out;
    };
  }, {
    "safe-buffer": 143
  } ],
  29: [ function(require, module, exports) {
    var Buffer = require("safe-buffer").Buffer;
    function encryptByte(self, byteParam, decrypt) {
      var pad = self._cipher.encryptBlock(self._prev);
      var out = pad[0] ^ byteParam;
      self._prev = Buffer.concat([ self._prev.slice(1), Buffer.from([ decrypt ? byteParam : out ]) ]);
      return out;
    }
    exports.encrypt = function(self, chunk, decrypt) {
      var len = chunk.length;
      var out = Buffer.allocUnsafe(len);
      var i = -1;
      while (++i < len) out[i] = encryptByte(self, chunk[i], decrypt);
      return out;
    };
  }, {
    "safe-buffer": 143
  } ],
  30: [ function(require, module, exports) {
    var xor = require("buffer-xor");
    var Buffer = require("safe-buffer").Buffer;
    var incr32 = require("../incr32");
    function getBlock(self) {
      var out = self._cipher.encryptBlockRaw(self._prev);
      incr32(self._prev);
      return out;
    }
    var blockSize = 16;
    exports.encrypt = function(self, chunk) {
      var chunkNum = Math.ceil(chunk.length / blockSize);
      var start = self._cache.length;
      self._cache = Buffer.concat([ self._cache, Buffer.allocUnsafe(chunkNum * blockSize) ]);
      for (var i = 0; i < chunkNum; i++) {
        var out = getBlock(self);
        var offset = start + i * blockSize;
        self._cache.writeUInt32BE(out[0], offset + 0);
        self._cache.writeUInt32BE(out[1], offset + 4);
        self._cache.writeUInt32BE(out[2], offset + 8);
        self._cache.writeUInt32BE(out[3], offset + 12);
      }
      var pad = self._cache.slice(0, chunk.length);
      self._cache = self._cache.slice(chunk.length);
      return xor(chunk, pad);
    };
  }, {
    "../incr32": 25,
    "buffer-xor": 46,
    "safe-buffer": 143
  } ],
  31: [ function(require, module, exports) {
    exports.encrypt = function(self, block) {
      return self._cipher.encryptBlock(block);
    };
    exports.decrypt = function(self, block) {
      return self._cipher.decryptBlock(block);
    };
  }, {} ],
  32: [ function(require, module, exports) {
    var modeModules = {
      ECB: require("./ecb"),
      CBC: require("./cbc"),
      CFB: require("./cfb"),
      CFB8: require("./cfb8"),
      CFB1: require("./cfb1"),
      OFB: require("./ofb"),
      CTR: require("./ctr"),
      GCM: require("./ctr")
    };
    var modes = require("./list.json");
    for (var key in modes) modes[key].module = modeModules[modes[key].mode];
    module.exports = modes;
  }, {
    "./cbc": 26,
    "./cfb": 27,
    "./cfb1": 28,
    "./cfb8": 29,
    "./ctr": 30,
    "./ecb": 31,
    "./list.json": 33,
    "./ofb": 34
  } ],
  33: [ function(require, module, exports) {
    module.exports = {
      "aes-128-ecb": {
        cipher: "AES",
        key: 128,
        iv: 0,
        mode: "ECB",
        type: "block"
      },
      "aes-192-ecb": {
        cipher: "AES",
        key: 192,
        iv: 0,
        mode: "ECB",
        type: "block"
      },
      "aes-256-ecb": {
        cipher: "AES",
        key: 256,
        iv: 0,
        mode: "ECB",
        type: "block"
      },
      "aes-128-cbc": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      "aes-192-cbc": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      "aes-256-cbc": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      aes128: {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      aes192: {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      aes256: {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CBC",
        type: "block"
      },
      "aes-128-cfb": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CFB",
        type: "stream"
      },
      "aes-192-cfb": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CFB",
        type: "stream"
      },
      "aes-256-cfb": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CFB",
        type: "stream"
      },
      "aes-128-cfb8": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CFB8",
        type: "stream"
      },
      "aes-192-cfb8": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CFB8",
        type: "stream"
      },
      "aes-256-cfb8": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CFB8",
        type: "stream"
      },
      "aes-128-cfb1": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CFB1",
        type: "stream"
      },
      "aes-192-cfb1": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CFB1",
        type: "stream"
      },
      "aes-256-cfb1": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CFB1",
        type: "stream"
      },
      "aes-128-ofb": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "OFB",
        type: "stream"
      },
      "aes-192-ofb": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "OFB",
        type: "stream"
      },
      "aes-256-ofb": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "OFB",
        type: "stream"
      },
      "aes-128-ctr": {
        cipher: "AES",
        key: 128,
        iv: 16,
        mode: "CTR",
        type: "stream"
      },
      "aes-192-ctr": {
        cipher: "AES",
        key: 192,
        iv: 16,
        mode: "CTR",
        type: "stream"
      },
      "aes-256-ctr": {
        cipher: "AES",
        key: 256,
        iv: 16,
        mode: "CTR",
        type: "stream"
      },
      "aes-128-gcm": {
        cipher: "AES",
        key: 128,
        iv: 12,
        mode: "GCM",
        type: "auth"
      },
      "aes-192-gcm": {
        cipher: "AES",
        key: 192,
        iv: 12,
        mode: "GCM",
        type: "auth"
      },
      "aes-256-gcm": {
        cipher: "AES",
        key: 256,
        iv: 12,
        mode: "GCM",
        type: "auth"
      }
    };
  }, {} ],
  34: [ function(require, module, exports) {
    (function(Buffer) {
      var xor = require("buffer-xor");
      function getBlock(self) {
        self._prev = self._cipher.encryptBlock(self._prev);
        return self._prev;
      }
      exports.encrypt = function(self, chunk) {
        while (self._cache.length < chunk.length) self._cache = Buffer.concat([ self._cache, getBlock(self) ]);
        var pad = self._cache.slice(0, chunk.length);
        self._cache = self._cache.slice(chunk.length);
        return xor(chunk, pad);
      };
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 47,
    "buffer-xor": 46
  } ],
  35: [ function(require, module, exports) {
    var aes = require("./aes");
    var Buffer = require("safe-buffer").Buffer;
    var Transform = require("cipher-base");
    var inherits = require("inherits");
    function StreamCipher(mode, key, iv, decrypt) {
      Transform.call(this);
      this._cipher = new aes.AES(key);
      this._prev = Buffer.from(iv);
      this._cache = Buffer.allocUnsafe(0);
      this._secCache = Buffer.allocUnsafe(0);
      this._decrypt = decrypt;
      this._mode = mode;
    }
    inherits(StreamCipher, Transform);
    StreamCipher.prototype._update = function(chunk) {
      return this._mode.encrypt(this, chunk, this._decrypt);
    };
    StreamCipher.prototype._final = function() {
      this._cipher.scrub();
    };
    module.exports = StreamCipher;
  }, {
    "./aes": 19,
    "cipher-base": 49,
    inherits: 101,
    "safe-buffer": 143
  } ],
  36: [ function(require, module, exports) {
    var DES = require("browserify-des");
    var aes = require("browserify-aes/browser");
    var aesModes = require("browserify-aes/modes");
    var desModes = require("browserify-des/modes");
    var ebtk = require("evp_bytestokey");
    function createCipher(suite, password) {
      suite = suite.toLowerCase();
      var keyLen, ivLen;
      if (aesModes[suite]) {
        keyLen = aesModes[suite].key;
        ivLen = aesModes[suite].iv;
      } else {
        if (!desModes[suite]) throw new TypeError("invalid suite type");
        keyLen = 8 * desModes[suite].key;
        ivLen = desModes[suite].iv;
      }
      var keys = ebtk(password, false, keyLen, ivLen);
      return createCipheriv(suite, keys.key, keys.iv);
    }
    function createDecipher(suite, password) {
      suite = suite.toLowerCase();
      var keyLen, ivLen;
      if (aesModes[suite]) {
        keyLen = aesModes[suite].key;
        ivLen = aesModes[suite].iv;
      } else {
        if (!desModes[suite]) throw new TypeError("invalid suite type");
        keyLen = 8 * desModes[suite].key;
        ivLen = desModes[suite].iv;
      }
      var keys = ebtk(password, false, keyLen, ivLen);
      return createDecipheriv(suite, keys.key, keys.iv);
    }
    function createCipheriv(suite, key, iv) {
      suite = suite.toLowerCase();
      if (aesModes[suite]) return aes.createCipheriv(suite, key, iv);
      if (desModes[suite]) return new DES({
        key: key,
        iv: iv,
        mode: suite
      });
      throw new TypeError("invalid suite type");
    }
    function createDecipheriv(suite, key, iv) {
      suite = suite.toLowerCase();
      if (aesModes[suite]) return aes.createDecipheriv(suite, key, iv);
      if (desModes[suite]) return new DES({
        key: key,
        iv: iv,
        mode: suite,
        decrypt: true
      });
      throw new TypeError("invalid suite type");
    }
    function getCiphers() {
      return Object.keys(desModes).concat(aes.getCiphers());
    }
    exports.createCipher = exports.Cipher = createCipher;
    exports.createCipheriv = exports.Cipheriv = createCipheriv;
    exports.createDecipher = exports.Decipher = createDecipher;
    exports.createDecipheriv = exports.Decipheriv = createDecipheriv;
    exports.listCiphers = exports.getCiphers = getCiphers;
  }, {
    "browserify-aes/browser": 21,
    "browserify-aes/modes": 32,
    "browserify-des": 37,
    "browserify-des/modes": 38,
    evp_bytestokey: 84
  } ],
  37: [ function(require, module, exports) {
    (function(Buffer) {
      var CipherBase = require("cipher-base");
      var des = require("des.js");
      var inherits = require("inherits");
      var modes = {
        "des-ede3-cbc": des.CBC.instantiate(des.EDE),
        "des-ede3": des.EDE,
        "des-ede-cbc": des.CBC.instantiate(des.EDE),
        "des-ede": des.EDE,
        "des-cbc": des.CBC.instantiate(des.DES),
        "des-ecb": des.DES
      };
      modes.des = modes["des-cbc"];
      modes.des3 = modes["des-ede3-cbc"];
      module.exports = DES;
      inherits(DES, CipherBase);
      function DES(opts) {
        CipherBase.call(this);
        var modeName = opts.mode.toLowerCase();
        var mode = modes[modeName];
        var type;
        type = opts.decrypt ? "decrypt" : "encrypt";
        var key = opts.key;
        "des-ede" !== modeName && "des-ede-cbc" !== modeName || (key = Buffer.concat([ key, key.slice(0, 8) ]));
        var iv = opts.iv;
        this._des = mode.create({
          key: key,
          iv: iv,
          type: type
        });
      }
      DES.prototype._update = function(data) {
        return new Buffer(this._des.update(data));
      };
      DES.prototype._final = function() {
        return new Buffer(this._des.final());
      };
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 47,
    "cipher-base": 49,
    "des.js": 57,
    inherits: 101
  } ],
  38: [ function(require, module, exports) {
    exports["des-ecb"] = {
      key: 8,
      iv: 0
    };
    exports["des-cbc"] = exports.des = {
      key: 8,
      iv: 8
    };
    exports["des-ede3-cbc"] = exports.des3 = {
      key: 24,
      iv: 8
    };
    exports["des-ede3"] = {
      key: 24,
      iv: 0
    };
    exports["des-ede-cbc"] = {
      key: 16,
      iv: 8
    };
    exports["des-ede"] = {
      key: 16,
      iv: 0
    };
  }, {} ],
  39: [ function(require, module, exports) {
    (function(Buffer) {
      var bn = require("bn.js");
      var randomBytes = require("randombytes");
      module.exports = crt;
      function blind(priv) {
        var r = getr(priv);
        var blinder = r.toRed(bn.mont(priv.modulus)).redPow(new bn(priv.publicExponent)).fromRed();
        return {
          blinder: blinder,
          unblinder: r.invm(priv.modulus)
        };
      }
      function crt(msg, priv) {
        var blinds = blind(priv);
        var len = priv.modulus.byteLength();
        var mod = bn.mont(priv.modulus);
        var blinded = new bn(msg).mul(blinds.blinder).umod(priv.modulus);
        var c1 = blinded.toRed(bn.mont(priv.prime1));
        var c2 = blinded.toRed(bn.mont(priv.prime2));
        var qinv = priv.coefficient;
        var p = priv.prime1;
        var q = priv.prime2;
        var m1 = c1.redPow(priv.exponent1);
        var m2 = c2.redPow(priv.exponent2);
        m1 = m1.fromRed();
        m2 = m2.fromRed();
        var h = m1.isub(m2).imul(qinv).umod(p);
        h.imul(q);
        m2.iadd(h);
        return new Buffer(m2.imul(blinds.unblinder).umod(priv.modulus).toArray(false, len));
      }
      crt.getr = getr;
      function getr(priv) {
        var len = priv.modulus.byteLength();
        var r = new bn(randomBytes(len));
        while (r.cmp(priv.modulus) >= 0 || !r.umod(priv.prime1) || !r.umod(priv.prime2)) r = new bn(randomBytes(len));
        return r;
      }
    }).call(this, require("buffer").Buffer);
  }, {
    "bn.js": 16,
    buffer: 47,
    randombytes: 125
  } ],
  40: [ function(require, module, exports) {
    module.exports = require("./browser/algorithms.json");
  }, {
    "./browser/algorithms.json": 41
  } ],
  41: [ function(require, module, exports) {
    module.exports = {
      sha224WithRSAEncryption: {
        sign: "rsa",
        hash: "sha224",
        id: "302d300d06096086480165030402040500041c"
      },
      "RSA-SHA224": {
        sign: "ecdsa/rsa",
        hash: "sha224",
        id: "302d300d06096086480165030402040500041c"
      },
      sha256WithRSAEncryption: {
        sign: "rsa",
        hash: "sha256",
        id: "3031300d060960864801650304020105000420"
      },
      "RSA-SHA256": {
        sign: "ecdsa/rsa",
        hash: "sha256",
        id: "3031300d060960864801650304020105000420"
      },
      sha384WithRSAEncryption: {
        sign: "rsa",
        hash: "sha384",
        id: "3041300d060960864801650304020205000430"
      },
      "RSA-SHA384": {
        sign: "ecdsa/rsa",
        hash: "sha384",
        id: "3041300d060960864801650304020205000430"
      },
      sha512WithRSAEncryption: {
        sign: "rsa",
        hash: "sha512",
        id: "3051300d060960864801650304020305000440"
      },
      "RSA-SHA512": {
        sign: "ecdsa/rsa",
        hash: "sha512",
        id: "3051300d060960864801650304020305000440"
      },
      "RSA-SHA1": {
        sign: "rsa",
        hash: "sha1",
        id: "3021300906052b0e03021a05000414"
      },
      "ecdsa-with-SHA1": {
        sign: "ecdsa",
        hash: "sha1",
        id: ""
      },
      sha256: {
        sign: "ecdsa",
        hash: "sha256",
        id: ""
      },
      sha224: {
        sign: "ecdsa",
        hash: "sha224",
        id: ""
      },
      sha384: {
        sign: "ecdsa",
        hash: "sha384",
        id: ""
      },
      sha512: {
        sign: "ecdsa",
        hash: "sha512",
        id: ""
      },
      "DSA-SHA": {
        sign: "dsa",
        hash: "sha1",
        id: ""
      },
      "DSA-SHA1": {
        sign: "dsa",
        hash: "sha1",
        id: ""
      },
      DSA: {
        sign: "dsa",
        hash: "sha1",
        id: ""
      },
      "DSA-WITH-SHA224": {
        sign: "dsa",
        hash: "sha224",
        id: ""
      },
      "DSA-SHA224": {
        sign: "dsa",
        hash: "sha224",
        id: ""
      },
      "DSA-WITH-SHA256": {
        sign: "dsa",
        hash: "sha256",
        id: ""
      },
      "DSA-SHA256": {
        sign: "dsa",
        hash: "sha256",
        id: ""
      },
      "DSA-WITH-SHA384": {
        sign: "dsa",
        hash: "sha384",
        id: ""
      },
      "DSA-SHA384": {
        sign: "dsa",
        hash: "sha384",
        id: ""
      },
      "DSA-WITH-SHA512": {
        sign: "dsa",
        hash: "sha512",
        id: ""
      },
      "DSA-SHA512": {
        sign: "dsa",
        hash: "sha512",
        id: ""
      },
      "DSA-RIPEMD160": {
        sign: "dsa",
        hash: "rmd160",
        id: ""
      },
      ripemd160WithRSA: {
        sign: "rsa",
        hash: "rmd160",
        id: "3021300906052b2403020105000414"
      },
      "RSA-RIPEMD160": {
        sign: "rsa",
        hash: "rmd160",
        id: "3021300906052b2403020105000414"
      },
      md5WithRSAEncryption: {
        sign: "rsa",
        hash: "md5",
        id: "3020300c06082a864886f70d020505000410"
      },
      "RSA-MD5": {
        sign: "rsa",
        hash: "md5",
        id: "3020300c06082a864886f70d020505000410"
      }
    };
  }, {} ],
  42: [ function(require, module, exports) {
    module.exports = {
      "1.3.132.0.10": "secp256k1",
      "1.3.132.0.33": "p224",
      "1.2.840.10045.3.1.1": "p192",
      "1.2.840.10045.3.1.7": "p256",
      "1.3.132.0.34": "p384",
      "1.3.132.0.35": "p521"
    };
  }, {} ],
  43: [ function(require, module, exports) {
    (function(Buffer) {
      var createHash = require("create-hash");
      var stream = require("stream");
      var inherits = require("inherits");
      var sign = require("./sign");
      var verify = require("./verify");
      var algorithms = require("./algorithms.json");
      Object.keys(algorithms).forEach(function(key) {
        algorithms[key].id = new Buffer(algorithms[key].id, "hex");
        algorithms[key.toLowerCase()] = algorithms[key];
      });
      function Sign(algorithm) {
        stream.Writable.call(this);
        var data = algorithms[algorithm];
        if (!data) throw new Error("Unknown message digest");
        this._hashType = data.hash;
        this._hash = createHash(data.hash);
        this._tag = data.id;
        this._signType = data.sign;
      }
      inherits(Sign, stream.Writable);
      Sign.prototype._write = function _write(data, _, done) {
        this._hash.update(data);
        done();
      };
      Sign.prototype.update = function update(data, enc) {
        "string" === typeof data && (data = new Buffer(data, enc));
        this._hash.update(data);
        return this;
      };
      Sign.prototype.sign = function signMethod(key, enc) {
        this.end();
        var hash = this._hash.digest();
        var sig = sign(hash, key, this._hashType, this._signType, this._tag);
        return enc ? sig.toString(enc) : sig;
      };
      function Verify(algorithm) {
        stream.Writable.call(this);
        var data = algorithms[algorithm];
        if (!data) throw new Error("Unknown message digest");
        this._hash = createHash(data.hash);
        this._tag = data.id;
        this._signType = data.sign;
      }
      inherits(Verify, stream.Writable);
      Verify.prototype._write = function _write(data, _, done) {
        this._hash.update(data);
        done();
      };
      Verify.prototype.update = function update(data, enc) {
        "string" === typeof data && (data = new Buffer(data, enc));
        this._hash.update(data);
        return this;
      };
      Verify.prototype.verify = function verifyMethod(key, sig, enc) {
        "string" === typeof sig && (sig = new Buffer(sig, enc));
        this.end();
        var hash = this._hash.digest();
        return verify(sig, hash, key, this._signType, this._tag);
      };
      function createSign(algorithm) {
        return new Sign(algorithm);
      }
      function createVerify(algorithm) {
        return new Verify(algorithm);
      }
      module.exports = {
        Sign: createSign,
        Verify: createVerify,
        createSign: createSign,
        createVerify: createVerify
      };
    }).call(this, require("buffer").Buffer);
  }, {
    "./algorithms.json": 41,
    "./sign": 44,
    "./verify": 45,
    buffer: 47,
    "create-hash": 52,
    inherits: 101,
    stream: 152
  } ],
  44: [ function(require, module, exports) {
    (function(Buffer) {
      var createHmac = require("create-hmac");
      var crt = require("browserify-rsa");
      var EC = require("elliptic").ec;
      var BN = require("bn.js");
      var parseKeys = require("parse-asn1");
      var curves = require("./curves.json");
      function sign(hash, key, hashType, signType, tag) {
        var priv = parseKeys(key);
        if (priv.curve) {
          if ("ecdsa" !== signType && "ecdsa/rsa" !== signType) throw new Error("wrong private key type");
          return ecSign(hash, priv);
        }
        if ("dsa" === priv.type) {
          if ("dsa" !== signType) throw new Error("wrong private key type");
          return dsaSign(hash, priv, hashType);
        }
        if ("rsa" !== signType && "ecdsa/rsa" !== signType) throw new Error("wrong private key type");
        hash = Buffer.concat([ tag, hash ]);
        var len = priv.modulus.byteLength();
        var pad = [ 0, 1 ];
        while (hash.length + pad.length + 1 < len) pad.push(255);
        pad.push(0);
        var i = -1;
        while (++i < hash.length) pad.push(hash[i]);
        var out = crt(pad, priv);
        return out;
      }
      function ecSign(hash, priv) {
        var curveId = curves[priv.curve.join(".")];
        if (!curveId) throw new Error("unknown curve " + priv.curve.join("."));
        var curve = new EC(curveId);
        var key = curve.keyFromPrivate(priv.privateKey);
        var out = key.sign(hash);
        return new Buffer(out.toDER());
      }
      function dsaSign(hash, priv, algo) {
        var x = priv.params.priv_key;
        var p = priv.params.p;
        var q = priv.params.q;
        var g = priv.params.g;
        var r = new BN(0);
        var k;
        var H = bits2int(hash, q).mod(q);
        var s = false;
        var kv = getKey(x, q, hash, algo);
        while (false === s) {
          k = makeKey(q, kv, algo);
          r = makeR(g, k, p, q);
          s = k.invm(q).imul(H.add(x.mul(r))).mod(q);
          if (0 === s.cmpn(0)) {
            s = false;
            r = new BN(0);
          }
        }
        return toDER(r, s);
      }
      function toDER(r, s) {
        r = r.toArray();
        s = s.toArray();
        128 & r[0] && (r = [ 0 ].concat(r));
        128 & s[0] && (s = [ 0 ].concat(s));
        var total = r.length + s.length + 4;
        var res = [ 48, total, 2, r.length ];
        res = res.concat(r, [ 2, s.length ], s);
        return new Buffer(res);
      }
      function getKey(x, q, hash, algo) {
        x = new Buffer(x.toArray());
        if (x.length < q.byteLength()) {
          var zeros = new Buffer(q.byteLength() - x.length);
          zeros.fill(0);
          x = Buffer.concat([ zeros, x ]);
        }
        var hlen = hash.length;
        var hbits = bits2octets(hash, q);
        var v = new Buffer(hlen);
        v.fill(1);
        var k = new Buffer(hlen);
        k.fill(0);
        k = createHmac(algo, k).update(v).update(new Buffer([ 0 ])).update(x).update(hbits).digest();
        v = createHmac(algo, k).update(v).digest();
        k = createHmac(algo, k).update(v).update(new Buffer([ 1 ])).update(x).update(hbits).digest();
        v = createHmac(algo, k).update(v).digest();
        return {
          k: k,
          v: v
        };
      }
      function bits2int(obits, q) {
        var bits = new BN(obits);
        var shift = (obits.length << 3) - q.bitLength();
        shift > 0 && bits.ishrn(shift);
        return bits;
      }
      function bits2octets(bits, q) {
        bits = bits2int(bits, q);
        bits = bits.mod(q);
        var out = new Buffer(bits.toArray());
        if (out.length < q.byteLength()) {
          var zeros = new Buffer(q.byteLength() - out.length);
          zeros.fill(0);
          out = Buffer.concat([ zeros, out ]);
        }
        return out;
      }
      function makeKey(q, kv, algo) {
        var t;
        var k;
        do {
          t = new Buffer(0);
          while (8 * t.length < q.bitLength()) {
            kv.v = createHmac(algo, kv.k).update(kv.v).digest();
            t = Buffer.concat([ t, kv.v ]);
          }
          k = bits2int(t, q);
          kv.k = createHmac(algo, kv.k).update(kv.v).update(new Buffer([ 0 ])).digest();
          kv.v = createHmac(algo, kv.k).update(kv.v).digest();
        } while (-1 !== k.cmp(q));
        return k;
      }
      function makeR(g, k, p, q) {
        return g.toRed(BN.mont(p)).redPow(k).fromRed().mod(q);
      }
      module.exports = sign;
      module.exports.getKey = getKey;
      module.exports.makeKey = makeKey;
    }).call(this, require("buffer").Buffer);
  }, {
    "./curves.json": 42,
    "bn.js": 16,
    "browserify-rsa": 39,
    buffer: 47,
    "create-hmac": 54,
    elliptic: 67,
    "parse-asn1": 111
  } ],
  45: [ function(require, module, exports) {
    (function(Buffer) {
      var BN = require("bn.js");
      var EC = require("elliptic").ec;
      var parseKeys = require("parse-asn1");
      var curves = require("./curves.json");
      function verify(sig, hash, key, signType, tag) {
        var pub = parseKeys(key);
        if ("ec" === pub.type) {
          if ("ecdsa" !== signType && "ecdsa/rsa" !== signType) throw new Error("wrong public key type");
          return ecVerify(sig, hash, pub);
        }
        if ("dsa" === pub.type) {
          if ("dsa" !== signType) throw new Error("wrong public key type");
          return dsaVerify(sig, hash, pub);
        }
        if ("rsa" !== signType && "ecdsa/rsa" !== signType) throw new Error("wrong public key type");
        hash = Buffer.concat([ tag, hash ]);
        var len = pub.modulus.byteLength();
        var pad = [ 1 ];
        var padNum = 0;
        while (hash.length + pad.length + 2 < len) {
          pad.push(255);
          padNum++;
        }
        pad.push(0);
        var i = -1;
        while (++i < hash.length) pad.push(hash[i]);
        pad = new Buffer(pad);
        var red = BN.mont(pub.modulus);
        sig = new BN(sig).toRed(red);
        sig = sig.redPow(new BN(pub.publicExponent));
        sig = new Buffer(sig.fromRed().toArray());
        var out = padNum < 8 ? 1 : 0;
        len = Math.min(sig.length, pad.length);
        sig.length !== pad.length && (out = 1);
        i = -1;
        while (++i < len) out |= sig[i] ^ pad[i];
        return 0 === out;
      }
      function ecVerify(sig, hash, pub) {
        var curveId = curves[pub.data.algorithm.curve.join(".")];
        if (!curveId) throw new Error("unknown curve " + pub.data.algorithm.curve.join("."));
        var curve = new EC(curveId);
        var pubkey = pub.data.subjectPrivateKey.data;
        return curve.verify(hash, sig, pubkey);
      }
      function dsaVerify(sig, hash, pub) {
        var p = pub.data.p;
        var q = pub.data.q;
        var g = pub.data.g;
        var y = pub.data.pub_key;
        var unpacked = parseKeys.signature.decode(sig, "der");
        var s = unpacked.s;
        var r = unpacked.r;
        checkValue(s, q);
        checkValue(r, q);
        var montp = BN.mont(p);
        var w = s.invm(q);
        var v = g.toRed(montp).redPow(new BN(hash).mul(w).mod(q)).fromRed().mul(y.toRed(montp).redPow(r.mul(w).mod(q)).fromRed()).mod(p).mod(q);
        return 0 === v.cmp(r);
      }
      function checkValue(b, q) {
        if (b.cmpn(0) <= 0) throw new Error("invalid sig");
        if (b.cmp(q) >= q) throw new Error("invalid sig");
      }
      module.exports = verify;
    }).call(this, require("buffer").Buffer);
  }, {
    "./curves.json": 42,
    "bn.js": 16,
    buffer: 47,
    elliptic: 67,
    "parse-asn1": 111
  } ],
  46: [ function(require, module, exports) {
    (function(Buffer) {
      module.exports = function xor(a, b) {
        var length = Math.min(a.length, b.length);
        var buffer = new Buffer(length);
        for (var i = 0; i < length; ++i) buffer[i] = a[i] ^ b[i];
        return buffer;
      };
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 47
  } ],
  47: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      var base64 = require("base64-js");
      var ieee754 = require("ieee754");
      var isArray = require("isarray");
      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      Buffer.TYPED_ARRAY_SUPPORT = void 0 !== global.TYPED_ARRAY_SUPPORT ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
      exports.kMaxLength = kMaxLength();
      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function() {
              return 42;
            }
          };
          return 42 === arr.foo() && "function" === typeof arr.subarray && 0 === arr.subarray(1, 1).byteLength;
        } catch (e) {
          return false;
        }
      }
      function kMaxLength() {
        return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
      }
      function createBuffer(that, length) {
        if (kMaxLength() < length) throw new RangeError("Invalid typed array length");
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = new Uint8Array(length);
          that.__proto__ = Buffer.prototype;
        } else {
          null === that && (that = new Buffer(length));
          that.length = length;
        }
        return that;
      }
      function Buffer(arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) return new Buffer(arg, encodingOrOffset, length);
        if ("number" === typeof arg) {
          if ("string" === typeof encodingOrOffset) throw new Error("If encoding is specified then the first argument must be a string");
          return allocUnsafe(this, arg);
        }
        return from(this, arg, encodingOrOffset, length);
      }
      Buffer.poolSize = 8192;
      Buffer._augment = function(arr) {
        arr.__proto__ = Buffer.prototype;
        return arr;
      };
      function from(that, value, encodingOrOffset, length) {
        if ("number" === typeof value) throw new TypeError('"value" argument must not be a number');
        if ("undefined" !== typeof ArrayBuffer && value instanceof ArrayBuffer) return fromArrayBuffer(that, value, encodingOrOffset, length);
        if ("string" === typeof value) return fromString(that, value, encodingOrOffset);
        return fromObject(that, value);
      }
      Buffer.from = function(value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length);
      };
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype;
        Buffer.__proto__ = Uint8Array;
        "undefined" !== typeof Symbol && Symbol.species && Buffer[Symbol.species] === Buffer && Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true
        });
      }
      function assertSize(size) {
        if ("number" !== typeof size) throw new TypeError('"size" argument must be a number');
        if (size < 0) throw new RangeError('"size" argument must not be negative');
      }
      function alloc(that, size, fill, encoding) {
        assertSize(size);
        if (size <= 0) return createBuffer(that, size);
        if (void 0 !== fill) return "string" === typeof encoding ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
        return createBuffer(that, size);
      }
      Buffer.alloc = function(size, fill, encoding) {
        return alloc(null, size, fill, encoding);
      };
      function allocUnsafe(that, size) {
        assertSize(size);
        that = createBuffer(that, size < 0 ? 0 : 0 | checked(size));
        if (!Buffer.TYPED_ARRAY_SUPPORT) for (var i = 0; i < size; ++i) that[i] = 0;
        return that;
      }
      Buffer.allocUnsafe = function(size) {
        return allocUnsafe(null, size);
      };
      Buffer.allocUnsafeSlow = function(size) {
        return allocUnsafe(null, size);
      };
      function fromString(that, string, encoding) {
        "string" === typeof encoding && "" !== encoding || (encoding = "utf8");
        if (!Buffer.isEncoding(encoding)) throw new TypeError('"encoding" must be a valid string encoding');
        var length = 0 | byteLength(string, encoding);
        that = createBuffer(that, length);
        var actual = that.write(string, encoding);
        actual !== length && (that = that.slice(0, actual));
        return that;
      }
      function fromArrayLike(that, array) {
        var length = array.length < 0 ? 0 : 0 | checked(array.length);
        that = createBuffer(that, length);
        for (var i = 0; i < length; i += 1) that[i] = 255 & array[i];
        return that;
      }
      function fromArrayBuffer(that, array, byteOffset, length) {
        array.byteLength;
        if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError("'offset' is out of bounds");
        if (array.byteLength < byteOffset + (length || 0)) throw new RangeError("'length' is out of bounds");
        array = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = array;
          that.__proto__ = Buffer.prototype;
        } else that = fromArrayLike(that, array);
        return that;
      }
      function fromObject(that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = 0 | checked(obj.length);
          that = createBuffer(that, len);
          if (0 === that.length) return that;
          obj.copy(that, 0, 0, len);
          return that;
        }
        if (obj) {
          if ("undefined" !== typeof ArrayBuffer && obj.buffer instanceof ArrayBuffer || "length" in obj) {
            if ("number" !== typeof obj.length || isnan(obj.length)) return createBuffer(that, 0);
            return fromArrayLike(that, obj);
          }
          if ("Buffer" === obj.type && isArray(obj.data)) return fromArrayLike(that, obj.data);
        }
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }
      function checked(length) {
        if (length >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
        return 0 | length;
      }
      function SlowBuffer(length) {
        +length != length && (length = 0);
        return Buffer.alloc(+length);
      }
      Buffer.isBuffer = function isBuffer(b) {
        return !!(null != b && b._isBuffer);
      };
      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
        if (a === b) return 0;
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
         case "hex":
         case "utf8":
         case "utf-8":
         case "ascii":
         case "latin1":
         case "binary":
         case "base64":
         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return true;

         default:
          return false;
        }
      };
      Buffer.concat = function concat(list, length) {
        if (!isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === list.length) return Buffer.alloc(0);
        var i;
        if (void 0 === length) {
          length = 0;
          for (i = 0; i < list.length; ++i) length += list[i].length;
        }
        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;
        for (i = 0; i < list.length; ++i) {
          var buf = list[i];
          if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
          buf.copy(buffer, pos);
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) return string.length;
        if ("undefined" !== typeof ArrayBuffer && "function" === typeof ArrayBuffer.isView && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) return string.byteLength;
        "string" !== typeof string && (string = "" + string);
        var len = string.length;
        if (0 === len) return 0;
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "ascii":
         case "latin1":
         case "binary":
          return len;

         case "utf8":
         case "utf-8":
         case void 0:
          return utf8ToBytes(string).length;

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return 2 * len;

         case "hex":
          return len >>> 1;

         case "base64":
          return base64ToBytes(string).length;

         default:
          if (loweredCase) return utf8ToBytes(string).length;
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        var loweredCase = false;
        (void 0 === start || start < 0) && (start = 0);
        if (start > this.length) return "";
        (void 0 === end || end > this.length) && (end = this.length);
        if (end <= 0) return "";
        end >>>= 0;
        start >>>= 0;
        if (end <= start) return "";
        encoding || (encoding = "utf8");
        while (true) switch (encoding) {
         case "hex":
          return hexSlice(this, start, end);

         case "utf8":
         case "utf-8":
          return utf8Slice(this, start, end);

         case "ascii":
          return asciiSlice(this, start, end);

         case "latin1":
         case "binary":
          return latin1Slice(this, start, end);

         case "base64":
          return base64Slice(this, start, end);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return utf16leSlice(this, start, end);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.prototype._isBuffer = true;
      function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer.prototype.swap16 = function swap16() {
        var len = this.length;
        if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (var i = 0; i < len; i += 2) swap(this, i, i + 1);
        return this;
      };
      Buffer.prototype.swap32 = function swap32() {
        var len = this.length;
        if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer.prototype.swap64 = function swap64() {
        var len = this.length;
        if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer.prototype.toString = function toString() {
        var length = 0 | this.length;
        if (0 === length) return "";
        if (0 === arguments.length) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return 0 === Buffer.compare(this, b);
      };
      Buffer.prototype.inspect = function inspect() {
        var str = "";
        var max = exports.INSPECT_MAX_BYTES;
        if (this.length > 0) {
          str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
          this.length > max && (str += " ... ");
        }
        return "<Buffer " + str + ">";
      };
      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) throw new TypeError("Argument must be a Buffer");
        void 0 === start && (start = 0);
        void 0 === end && (end = target ? target.length : 0);
        void 0 === thisStart && (thisStart = 0);
        void 0 === thisEnd && (thisEnd = this.length);
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
        if (thisStart >= thisEnd && start >= end) return 0;
        if (thisStart >= thisEnd) return -1;
        if (start >= end) return 1;
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);
        for (var i = 0; i < len; ++i) if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (0 === buffer.length) return -1;
        if ("string" === typeof byteOffset) {
          encoding = byteOffset;
          byteOffset = 0;
        } else byteOffset > 2147483647 ? byteOffset = 2147483647 : byteOffset < -2147483648 && (byteOffset = -2147483648);
        byteOffset = +byteOffset;
        isNaN(byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1);
        byteOffset < 0 && (byteOffset = buffer.length + byteOffset);
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (!dir) return -1;
          byteOffset = 0;
        }
        "string" === typeof val && (val = Buffer.from(val, encoding));
        if (Buffer.isBuffer(val)) {
          if (0 === val.length) return -1;
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        }
        if ("number" === typeof val) {
          val &= 255;
          if (Buffer.TYPED_ARRAY_SUPPORT && "function" === typeof Uint8Array.prototype.indexOf) return dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;
        if (void 0 !== encoding) {
          encoding = String(encoding).toLowerCase();
          if ("ucs2" === encoding || "ucs-2" === encoding || "utf16le" === encoding || "utf-16le" === encoding) {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i) {
          return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
        }
        var i;
        if (dir) {
          var foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
            -1 === foundIndex && (foundIndex = i);
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            -1 !== foundIndex && (i -= i - foundIndex);
            foundIndex = -1;
          }
        } else {
          byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength);
          for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return -1 !== this.indexOf(val, byteOffset, encoding);
      };
      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (length) {
          length = Number(length);
          length > remaining && (length = remaining);
        } else length = remaining;
        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");
        length > strLen / 2 && (length = strLen / 2);
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(2 * i, 2), 16);
          if (isNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer.prototype.write = function write(string, offset, length, encoding) {
        if (void 0 === offset) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (void 0 === length && "string" === typeof offset) {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else {
          if (!isFinite(offset)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          offset |= 0;
          if (isFinite(length)) {
            length |= 0;
            void 0 === encoding && (encoding = "utf8");
          } else {
            encoding = length;
            length = void 0;
          }
        }
        var remaining = this.length - offset;
        (void 0 === length || length > remaining) && (length = remaining);
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        encoding || (encoding = "utf8");
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "hex":
          return hexWrite(this, string, offset, length);

         case "utf8":
         case "utf-8":
          return utf8Write(this, string, offset, length);

         case "ascii":
          return asciiWrite(this, string, offset, length);

         case "latin1":
         case "binary":
          return latin1Write(this, string, offset, length);

         case "base64":
          return base64Write(this, string, offset, length);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return ucs2Write(this, string, offset, length);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      };
      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end));
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i = start;
        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
             case 1:
              firstByte < 128 && (codePoint = firstByte);
              break;

             case 2:
              secondByte = buf[i + 1];
              if (128 === (192 & secondByte)) {
                tempCodePoint = (31 & firstByte) << 6 | 63 & secondByte;
                tempCodePoint > 127 && (codePoint = tempCodePoint);
              }
              break;

             case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte)) {
                tempCodePoint = (15 & firstByte) << 12 | (63 & secondByte) << 6 | 63 & thirdByte;
                tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343) && (codePoint = tempCodePoint);
              }
              break;

             case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte) && 128 === (192 & fourthByte)) {
                tempCodePoint = (15 & firstByte) << 18 | (63 & secondByte) << 12 | (63 & thirdByte) << 6 | 63 & fourthByte;
                tempCodePoint > 65535 && tempCodePoint < 1114112 && (codePoint = tempCodePoint);
              }
            }
          }
          if (null === codePoint) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | 1023 & codePoint;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
        var res = "";
        var i = 0;
        while (i < len) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        return res;
      }
      function asciiSlice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(127 & buf[i]);
        return ret;
      }
      function latin1Slice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(buf[i]);
        return ret;
      }
      function hexSlice(buf, start, end) {
        var len = buf.length;
        (!start || start < 0) && (start = 0);
        (!end || end < 0 || end > len) && (end = len);
        var out = "";
        for (var i = start; i < end; ++i) out += toHex(buf[i]);
        return out;
      }
      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = "";
        for (var i = 0; i < bytes.length; i += 2) res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
        return res;
      }
      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = void 0 === end ? len : ~~end;
        if (start < 0) {
          start += len;
          start < 0 && (start = 0);
        } else start > len && (start = len);
        if (end < 0) {
          end += len;
          end < 0 && (end = 0);
        } else end > len && (end = len);
        end < start && (end = start);
        var newBuf;
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end);
          newBuf.__proto__ = Buffer.prototype;
        } else {
          var sliceLen = end - start;
          newBuf = new Buffer(sliceLen, void 0);
          for (var i = 0; i < sliceLen; ++i) newBuf[i] = this[i + start];
        }
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        return val;
      };
      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset + --byteLength];
        var mul = 1;
        while (byteLength > 0 && (mul *= 256)) val += this[offset + --byteLength] * mul;
        return val;
      };
      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 16777216 * this[offset + 3];
      };
      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return 16777216 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];
        while (i > 0 && (mul *= 256)) val += this[offset + --i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        if (!(128 & this[offset])) return this[offset];
        return -1 * (255 - this[offset] + 1);
      };
      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var mul = 1;
        var i = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 255, 0);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        this[offset] = 255 & value;
        return offset + 1;
      };
      function objectWriteUInt16(buf, value, offset, littleEndian) {
        value < 0 && (value = 65535 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> 8 * (littleEndian ? i : 1 - i);
      }
      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      function objectWriteUInt32(buf, value, offset, littleEndian) {
        value < 0 && (value = 4294967295 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) buf[offset + i] = value >>> 8 * (littleEndian ? i : 3 - i) & 255;
      }
      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = 255 & value;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 127, -128);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        value < 0 && (value = 255 + value + 1);
        this[offset] = 255 & value;
        return offset + 1;
      };
      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        value < 0 && (value = 4294967295 + value + 1);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        start || (start = 0);
        end || 0 === end || (end = this.length);
        targetStart >= target.length && (targetStart = target.length);
        targetStart || (targetStart = 0);
        end > 0 && end < start && (end = start);
        if (end === start) return 0;
        if (0 === target.length || 0 === this.length) return 0;
        if (targetStart < 0) throw new RangeError("targetStart out of bounds");
        if (start < 0 || start >= this.length) throw new RangeError("sourceStart out of bounds");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        end > this.length && (end = this.length);
        target.length - targetStart < end - start && (end = target.length - targetStart + start);
        var len = end - start;
        var i;
        if (this === target && start < targetStart && targetStart < end) for (i = len - 1; i >= 0; --i) target[i + targetStart] = this[i + start]; else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) for (i = 0; i < len; ++i) target[i + targetStart] = this[i + start]; else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        return len;
      };
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        if ("string" === typeof val) {
          if ("string" === typeof start) {
            encoding = start;
            start = 0;
            end = this.length;
          } else if ("string" === typeof end) {
            encoding = end;
            end = this.length;
          }
          if (1 === val.length) {
            var code = val.charCodeAt(0);
            code < 256 && (val = code);
          }
          if (void 0 !== encoding && "string" !== typeof encoding) throw new TypeError("encoding must be a string");
          if ("string" === typeof encoding && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
        } else "number" === typeof val && (val &= 255);
        if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
        if (end <= start) return this;
        start >>>= 0;
        end = void 0 === end ? this.length : end >>> 0;
        val || (val = 0);
        var i;
        if ("number" === typeof val) for (i = start; i < end; ++i) this[i] = val; else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
          var len = bytes.length;
          for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len];
        }
        return this;
      };
      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = stringtrim(str).replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) str += "=";
        return str;
      }
      function stringtrim(str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, "");
      }
      function toHex(n) {
        if (n < 16) return "0" + n.toString(16);
        return n.toString(16);
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];
        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              if (i + 1 === length) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              (units -= 3) > -1 && bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = 65536 + (leadSurrogate - 55296 << 10 | codePoint - 56320);
          } else leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 6 | 192, 63 & codePoint | 128);
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          } else {
            if (!(codePoint < 1114112)) throw new Error("Invalid code point");
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) byteArray.push(255 & str.charCodeAt(i));
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isnan(val) {
        return val !== val;
      }
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "base64-js": 15,
    ieee754: 99,
    isarray: 48
  } ],
  48: [ function(require, module, exports) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return "[object Array]" == toString.call(arr);
    };
  }, {} ],
  49: [ function(require, module, exports) {
    var Buffer = require("safe-buffer").Buffer;
    var Transform = require("stream").Transform;
    var StringDecoder = require("string_decoder").StringDecoder;
    var inherits = require("inherits");
    function CipherBase(hashMode) {
      Transform.call(this);
      this.hashMode = "string" === typeof hashMode;
      this.hashMode ? this[hashMode] = this._finalOrDigest : this.final = this._finalOrDigest;
      if (this._final) {
        this.__final = this._final;
        this._final = null;
      }
      this._decoder = null;
      this._encoding = null;
    }
    inherits(CipherBase, Transform);
    CipherBase.prototype.update = function(data, inputEnc, outputEnc) {
      "string" === typeof data && (data = Buffer.from(data, inputEnc));
      var outData = this._update(data);
      if (this.hashMode) return this;
      outputEnc && (outData = this._toString(outData, outputEnc));
      return outData;
    };
    CipherBase.prototype.setAutoPadding = function() {};
    CipherBase.prototype.getAuthTag = function() {
      throw new Error("trying to get auth tag in unsupported state");
    };
    CipherBase.prototype.setAuthTag = function() {
      throw new Error("trying to set auth tag in unsupported state");
    };
    CipherBase.prototype.setAAD = function() {
      throw new Error("trying to set aad in unsupported state");
    };
    CipherBase.prototype._transform = function(data, _, next) {
      var err;
      try {
        this.hashMode ? this._update(data) : this.push(this._update(data));
      } catch (e) {
        err = e;
      } finally {
        next(err);
      }
    };
    CipherBase.prototype._flush = function(done) {
      var err;
      try {
        this.push(this.__final());
      } catch (e) {
        err = e;
      }
      done(err);
    };
    CipherBase.prototype._finalOrDigest = function(outputEnc) {
      var outData = this.__final() || Buffer.alloc(0);
      outputEnc && (outData = this._toString(outData, outputEnc, true));
      return outData;
    };
    CipherBase.prototype._toString = function(value, enc, fin) {
      if (!this._decoder) {
        this._decoder = new StringDecoder(enc);
        this._encoding = enc;
      }
      if (this._encoding !== enc) throw new Error("can't switch encodings");
      var out = this._decoder.write(value);
      fin && (out += this._decoder.end());
      return out;
    };
    module.exports = CipherBase;
  }, {
    inherits: 101,
    "safe-buffer": 143,
    stream: 152,
    string_decoder: 153
  } ],
  50: [ function(require, module, exports) {
    (function(Buffer) {
      function isArray(arg) {
        if (Array.isArray) return Array.isArray(arg);
        return "[object Array]" === objectToString(arg);
      }
      exports.isArray = isArray;
      function isBoolean(arg) {
        return "boolean" === typeof arg;
      }
      exports.isBoolean = isBoolean;
      function isNull(arg) {
        return null === arg;
      }
      exports.isNull = isNull;
      function isNullOrUndefined(arg) {
        return null == arg;
      }
      exports.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return "number" === typeof arg;
      }
      exports.isNumber = isNumber;
      function isString(arg) {
        return "string" === typeof arg;
      }
      exports.isString = isString;
      function isSymbol(arg) {
        return "symbol" === typeof arg;
      }
      exports.isSymbol = isSymbol;
      function isUndefined(arg) {
        return void 0 === arg;
      }
      exports.isUndefined = isUndefined;
      function isRegExp(re) {
        return "[object RegExp]" === objectToString(re);
      }
      exports.isRegExp = isRegExp;
      function isObject(arg) {
        return "object" === typeof arg && null !== arg;
      }
      exports.isObject = isObject;
      function isDate(d) {
        return "[object Date]" === objectToString(d);
      }
      exports.isDate = isDate;
      function isError(e) {
        return "[object Error]" === objectToString(e) || e instanceof Error;
      }
      exports.isError = isError;
      function isFunction(arg) {
        return "function" === typeof arg;
      }
      exports.isFunction = isFunction;
      function isPrimitive(arg) {
        return null === arg || "boolean" === typeof arg || "number" === typeof arg || "string" === typeof arg || "symbol" === typeof arg || "undefined" === typeof arg;
      }
      exports.isPrimitive = isPrimitive;
      exports.isBuffer = Buffer.isBuffer;
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
    }).call(this, {
      isBuffer: require("../../is-buffer/index.js")
    });
  }, {
    "../../is-buffer/index.js": 102
  } ],
  51: [ function(require, module, exports) {
    (function(Buffer) {
      var elliptic = require("elliptic");
      var BN = require("bn.js");
      module.exports = function createECDH(curve) {
        return new ECDH(curve);
      };
      var aliases = {
        secp256k1: {
          name: "secp256k1",
          byteLength: 32
        },
        secp224r1: {
          name: "p224",
          byteLength: 28
        },
        prime256v1: {
          name: "p256",
          byteLength: 32
        },
        prime192v1: {
          name: "p192",
          byteLength: 24
        },
        ed25519: {
          name: "ed25519",
          byteLength: 32
        },
        secp384r1: {
          name: "p384",
          byteLength: 48
        },
        secp521r1: {
          name: "p521",
          byteLength: 66
        }
      };
      aliases.p224 = aliases.secp224r1;
      aliases.p256 = aliases.secp256r1 = aliases.prime256v1;
      aliases.p192 = aliases.secp192r1 = aliases.prime192v1;
      aliases.p384 = aliases.secp384r1;
      aliases.p521 = aliases.secp521r1;
      function ECDH(curve) {
        this.curveType = aliases[curve];
        this.curveType || (this.curveType = {
          name: curve
        });
        this.curve = new elliptic.ec(this.curveType.name);
        this.keys = void 0;
      }
      ECDH.prototype.generateKeys = function(enc, format) {
        this.keys = this.curve.genKeyPair();
        return this.getPublicKey(enc, format);
      };
      ECDH.prototype.computeSecret = function(other, inenc, enc) {
        inenc = inenc || "utf8";
        Buffer.isBuffer(other) || (other = new Buffer(other, inenc));
        var otherPub = this.curve.keyFromPublic(other).getPublic();
        var out = otherPub.mul(this.keys.getPrivate()).getX();
        return formatReturnValue(out, enc, this.curveType.byteLength);
      };
      ECDH.prototype.getPublicKey = function(enc, format) {
        var key = this.keys.getPublic("compressed" === format, true);
        "hybrid" === format && (key[key.length - 1] % 2 ? key[0] = 7 : key[0] = 6);
        return formatReturnValue(key, enc);
      };
      ECDH.prototype.getPrivateKey = function(enc) {
        return formatReturnValue(this.keys.getPrivate(), enc);
      };
      ECDH.prototype.setPublicKey = function(pub, enc) {
        enc = enc || "utf8";
        Buffer.isBuffer(pub) || (pub = new Buffer(pub, enc));
        this.keys._importPublic(pub);
        return this;
      };
      ECDH.prototype.setPrivateKey = function(priv, enc) {
        enc = enc || "utf8";
        Buffer.isBuffer(priv) || (priv = new Buffer(priv, enc));
        var _priv = new BN(priv);
        _priv = _priv.toString(16);
        this.keys = this.curve.genKeyPair();
        this.keys._importPrivate(_priv);
        return this;
      };
      function formatReturnValue(bn, enc, len) {
        Array.isArray(bn) || (bn = bn.toArray());
        var buf = new Buffer(bn);
        if (len && buf.length < len) {
          var zeros = new Buffer(len - buf.length);
          zeros.fill(0);
          buf = Buffer.concat([ zeros, buf ]);
        }
        return enc ? buf.toString(enc) : buf;
      }
    }).call(this, require("buffer").Buffer);
  }, {
    "bn.js": 16,
    buffer: 47,
    elliptic: 67
  } ],
  52: [ function(require, module, exports) {
    "use strict";
    var inherits = require("inherits");
    var MD5 = require("md5.js");
    var RIPEMD160 = require("ripemd160");
    var sha = require("sha.js");
    var Base = require("cipher-base");
    function Hash(hash) {
      Base.call(this, "digest");
      this._hash = hash;
    }
    inherits(Hash, Base);
    Hash.prototype._update = function(data) {
      this._hash.update(data);
    };
    Hash.prototype._final = function() {
      return this._hash.digest();
    };
    module.exports = function createHash(alg) {
      alg = alg.toLowerCase();
      if ("md5" === alg) return new MD5();
      if ("rmd160" === alg || "ripemd160" === alg) return new RIPEMD160();
      return new Hash(sha(alg));
    };
  }, {
    "cipher-base": 49,
    inherits: 101,
    "md5.js": 103,
    ripemd160: 142,
    "sha.js": 145
  } ],
  53: [ function(require, module, exports) {
    var MD5 = require("md5.js");
    module.exports = function(buffer) {
      return new MD5().update(buffer).digest();
    };
  }, {
    "md5.js": 103
  } ],
  54: [ function(require, module, exports) {
    "use strict";
    var inherits = require("inherits");
    var Legacy = require("./legacy");
    var Base = require("cipher-base");
    var Buffer = require("safe-buffer").Buffer;
    var md5 = require("create-hash/md5");
    var RIPEMD160 = require("ripemd160");
    var sha = require("sha.js");
    var ZEROS = Buffer.alloc(128);
    function Hmac(alg, key) {
      Base.call(this, "digest");
      "string" === typeof key && (key = Buffer.from(key));
      var blocksize = "sha512" === alg || "sha384" === alg ? 128 : 64;
      this._alg = alg;
      this._key = key;
      if (key.length > blocksize) {
        var hash = "rmd160" === alg ? new RIPEMD160() : sha(alg);
        key = hash.update(key).digest();
      } else key.length < blocksize && (key = Buffer.concat([ key, ZEROS ], blocksize));
      var ipad = this._ipad = Buffer.allocUnsafe(blocksize);
      var opad = this._opad = Buffer.allocUnsafe(blocksize);
      for (var i = 0; i < blocksize; i++) {
        ipad[i] = 54 ^ key[i];
        opad[i] = 92 ^ key[i];
      }
      this._hash = "rmd160" === alg ? new RIPEMD160() : sha(alg);
      this._hash.update(ipad);
    }
    inherits(Hmac, Base);
    Hmac.prototype._update = function(data) {
      this._hash.update(data);
    };
    Hmac.prototype._final = function() {
      var h = this._hash.digest();
      var hash = "rmd160" === this._alg ? new RIPEMD160() : sha(this._alg);
      return hash.update(this._opad).update(h).digest();
    };
    module.exports = function createHmac(alg, key) {
      alg = alg.toLowerCase();
      if ("rmd160" === alg || "ripemd160" === alg) return new Hmac("rmd160", key);
      if ("md5" === alg) return new Legacy(md5, key);
      return new Hmac(alg, key);
    };
  }, {
    "./legacy": 55,
    "cipher-base": 49,
    "create-hash/md5": 53,
    inherits: 101,
    ripemd160: 142,
    "safe-buffer": 143,
    "sha.js": 145
  } ],
  55: [ function(require, module, exports) {
    "use strict";
    var inherits = require("inherits");
    var Buffer = require("safe-buffer").Buffer;
    var Base = require("cipher-base");
    var ZEROS = Buffer.alloc(128);
    var blocksize = 64;
    function Hmac(alg, key) {
      Base.call(this, "digest");
      "string" === typeof key && (key = Buffer.from(key));
      this._alg = alg;
      this._key = key;
      key.length > blocksize ? key = alg(key) : key.length < blocksize && (key = Buffer.concat([ key, ZEROS ], blocksize));
      var ipad = this._ipad = Buffer.allocUnsafe(blocksize);
      var opad = this._opad = Buffer.allocUnsafe(blocksize);
      for (var i = 0; i < blocksize; i++) {
        ipad[i] = 54 ^ key[i];
        opad[i] = 92 ^ key[i];
      }
      this._hash = [ ipad ];
    }
    inherits(Hmac, Base);
    Hmac.prototype._update = function(data) {
      this._hash.push(data);
    };
    Hmac.prototype._final = function() {
      var h = this._alg(Buffer.concat(this._hash));
      return this._alg(Buffer.concat([ this._opad, h ]));
    };
    module.exports = Hmac;
  }, {
    "cipher-base": 49,
    inherits: 101,
    "safe-buffer": 143
  } ],
  56: [ function(require, module, exports) {
    "use strict";
    exports.randomBytes = exports.rng = exports.pseudoRandomBytes = exports.prng = require("randombytes");
    exports.createHash = exports.Hash = require("create-hash");
    exports.createHmac = exports.Hmac = require("create-hmac");
    var algos = require("browserify-sign/algos");
    var algoKeys = Object.keys(algos);
    var hashes = [ "sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160" ].concat(algoKeys);
    exports.getHashes = function() {
      return hashes;
    };
    var p = require("pbkdf2");
    exports.pbkdf2 = p.pbkdf2;
    exports.pbkdf2Sync = p.pbkdf2Sync;
    var aes = require("browserify-cipher");
    exports.Cipher = aes.Cipher;
    exports.createCipher = aes.createCipher;
    exports.Cipheriv = aes.Cipheriv;
    exports.createCipheriv = aes.createCipheriv;
    exports.Decipher = aes.Decipher;
    exports.createDecipher = aes.createDecipher;
    exports.Decipheriv = aes.Decipheriv;
    exports.createDecipheriv = aes.createDecipheriv;
    exports.getCiphers = aes.getCiphers;
    exports.listCiphers = aes.listCiphers;
    var dh = require("diffie-hellman");
    exports.DiffieHellmanGroup = dh.DiffieHellmanGroup;
    exports.createDiffieHellmanGroup = dh.createDiffieHellmanGroup;
    exports.getDiffieHellman = dh.getDiffieHellman;
    exports.createDiffieHellman = dh.createDiffieHellman;
    exports.DiffieHellman = dh.DiffieHellman;
    var sign = require("browserify-sign");
    exports.createSign = sign.createSign;
    exports.Sign = sign.Sign;
    exports.createVerify = sign.createVerify;
    exports.Verify = sign.Verify;
    exports.createECDH = require("create-ecdh");
    var publicEncrypt = require("public-encrypt");
    exports.publicEncrypt = publicEncrypt.publicEncrypt;
    exports.privateEncrypt = publicEncrypt.privateEncrypt;
    exports.publicDecrypt = publicEncrypt.publicDecrypt;
    exports.privateDecrypt = publicEncrypt.privateDecrypt;
    var rf = require("randomfill");
    exports.randomFill = rf.randomFill;
    exports.randomFillSync = rf.randomFillSync;
    exports.createCredentials = function() {
      throw new Error([ "sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify" ].join("\n"));
    };
    exports.constants = {
      DH_CHECK_P_NOT_SAFE_PRIME: 2,
      DH_CHECK_P_NOT_PRIME: 1,
      DH_UNABLE_TO_CHECK_GENERATOR: 4,
      DH_NOT_SUITABLE_GENERATOR: 8,
      NPN_ENABLED: 1,
      ALPN_ENABLED: 1,
      RSA_PKCS1_PADDING: 1,
      RSA_SSLV23_PADDING: 2,
      RSA_NO_PADDING: 3,
      RSA_PKCS1_OAEP_PADDING: 4,
      RSA_X931_PADDING: 5,
      RSA_PKCS1_PSS_PADDING: 6,
      POINT_CONVERSION_COMPRESSED: 2,
      POINT_CONVERSION_UNCOMPRESSED: 4,
      POINT_CONVERSION_HYBRID: 6
    };
  }, {
    "browserify-cipher": 36,
    "browserify-sign": 43,
    "browserify-sign/algos": 40,
    "create-ecdh": 51,
    "create-hash": 52,
    "create-hmac": 54,
    "diffie-hellman": 63,
    pbkdf2: 112,
    "public-encrypt": 119,
    randombytes: 125,
    randomfill: 126
  } ],
  57: [ function(require, module, exports) {
    "use strict";
    exports.utils = require("./des/utils");
    exports.Cipher = require("./des/cipher");
    exports.DES = require("./des/des");
    exports.CBC = require("./des/cbc");
    exports.EDE = require("./des/ede");
  }, {
    "./des/cbc": 58,
    "./des/cipher": 59,
    "./des/des": 60,
    "./des/ede": 61,
    "./des/utils": 62
  } ],
  58: [ function(require, module, exports) {
    "use strict";
    var assert = require("minimalistic-assert");
    var inherits = require("inherits");
    var proto = {};
    function CBCState(iv) {
      assert.equal(iv.length, 8, "Invalid IV length");
      this.iv = new Array(8);
      for (var i = 0; i < this.iv.length; i++) this.iv[i] = iv[i];
    }
    function instantiate(Base) {
      function CBC(options) {
        Base.call(this, options);
        this._cbcInit();
      }
      inherits(CBC, Base);
      var keys = Object.keys(proto);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        CBC.prototype[key] = proto[key];
      }
      CBC.create = function create(options) {
        return new CBC(options);
      };
      return CBC;
    }
    exports.instantiate = instantiate;
    proto._cbcInit = function _cbcInit() {
      var state = new CBCState(this.options.iv);
      this._cbcState = state;
    };
    proto._update = function _update(inp, inOff, out, outOff) {
      var state = this._cbcState;
      var superProto = this.constructor.super_.prototype;
      var iv = state.iv;
      if ("encrypt" === this.type) {
        for (var i = 0; i < this.blockSize; i++) iv[i] ^= inp[inOff + i];
        superProto._update.call(this, iv, 0, out, outOff);
        for (var i = 0; i < this.blockSize; i++) iv[i] = out[outOff + i];
      } else {
        superProto._update.call(this, inp, inOff, out, outOff);
        for (var i = 0; i < this.blockSize; i++) out[outOff + i] ^= iv[i];
        for (var i = 0; i < this.blockSize; i++) iv[i] = inp[inOff + i];
      }
    };
  }, {
    inherits: 101,
    "minimalistic-assert": 105
  } ],
  59: [ function(require, module, exports) {
    "use strict";
    var assert = require("minimalistic-assert");
    function Cipher(options) {
      this.options = options;
      this.type = this.options.type;
      this.blockSize = 8;
      this._init();
      this.buffer = new Array(this.blockSize);
      this.bufferOff = 0;
    }
    module.exports = Cipher;
    Cipher.prototype._init = function _init() {};
    Cipher.prototype.update = function update(data) {
      if (0 === data.length) return [];
      return "decrypt" === this.type ? this._updateDecrypt(data) : this._updateEncrypt(data);
    };
    Cipher.prototype._buffer = function _buffer(data, off) {
      var min = Math.min(this.buffer.length - this.bufferOff, data.length - off);
      for (var i = 0; i < min; i++) this.buffer[this.bufferOff + i] = data[off + i];
      this.bufferOff += min;
      return min;
    };
    Cipher.prototype._flushBuffer = function _flushBuffer(out, off) {
      this._update(this.buffer, 0, out, off);
      this.bufferOff = 0;
      return this.blockSize;
    };
    Cipher.prototype._updateEncrypt = function _updateEncrypt(data) {
      var inputOff = 0;
      var outputOff = 0;
      var count = (this.bufferOff + data.length) / this.blockSize | 0;
      var out = new Array(count * this.blockSize);
      if (0 !== this.bufferOff) {
        inputOff += this._buffer(data, inputOff);
        this.bufferOff === this.buffer.length && (outputOff += this._flushBuffer(out, outputOff));
      }
      var max = data.length - (data.length - inputOff) % this.blockSize;
      for (;inputOff < max; inputOff += this.blockSize) {
        this._update(data, inputOff, out, outputOff);
        outputOff += this.blockSize;
      }
      for (;inputOff < data.length; inputOff++, this.bufferOff++) this.buffer[this.bufferOff] = data[inputOff];
      return out;
    };
    Cipher.prototype._updateDecrypt = function _updateDecrypt(data) {
      var inputOff = 0;
      var outputOff = 0;
      var count = Math.ceil((this.bufferOff + data.length) / this.blockSize) - 1;
      var out = new Array(count * this.blockSize);
      for (;count > 0; count--) {
        inputOff += this._buffer(data, inputOff);
        outputOff += this._flushBuffer(out, outputOff);
      }
      inputOff += this._buffer(data, inputOff);
      return out;
    };
    Cipher.prototype.final = function final(buffer) {
      var first;
      buffer && (first = this.update(buffer));
      var last;
      last = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt();
      return first ? first.concat(last) : last;
    };
    Cipher.prototype._pad = function _pad(buffer, off) {
      if (0 === off) return false;
      while (off < buffer.length) buffer[off++] = 0;
      return true;
    };
    Cipher.prototype._finalEncrypt = function _finalEncrypt() {
      if (!this._pad(this.buffer, this.bufferOff)) return [];
      var out = new Array(this.blockSize);
      this._update(this.buffer, 0, out, 0);
      return out;
    };
    Cipher.prototype._unpad = function _unpad(buffer) {
      return buffer;
    };
    Cipher.prototype._finalDecrypt = function _finalDecrypt() {
      assert.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
      var out = new Array(this.blockSize);
      this._flushBuffer(out, 0);
      return this._unpad(out);
    };
  }, {
    "minimalistic-assert": 105
  } ],
  60: [ function(require, module, exports) {
    "use strict";
    var assert = require("minimalistic-assert");
    var inherits = require("inherits");
    var des = require("../des");
    var utils = des.utils;
    var Cipher = des.Cipher;
    function DESState() {
      this.tmp = new Array(2);
      this.keys = null;
    }
    function DES(options) {
      Cipher.call(this, options);
      var state = new DESState();
      this._desState = state;
      this.deriveKeys(state, options.key);
    }
    inherits(DES, Cipher);
    module.exports = DES;
    DES.create = function create(options) {
      return new DES(options);
    };
    var shiftTable = [ 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1 ];
    DES.prototype.deriveKeys = function deriveKeys(state, key) {
      state.keys = new Array(32);
      assert.equal(key.length, this.blockSize, "Invalid key length");
      var kL = utils.readUInt32BE(key, 0);
      var kR = utils.readUInt32BE(key, 4);
      utils.pc1(kL, kR, state.tmp, 0);
      kL = state.tmp[0];
      kR = state.tmp[1];
      for (var i = 0; i < state.keys.length; i += 2) {
        var shift = shiftTable[i >>> 1];
        kL = utils.r28shl(kL, shift);
        kR = utils.r28shl(kR, shift);
        utils.pc2(kL, kR, state.keys, i);
      }
    };
    DES.prototype._update = function _update(inp, inOff, out, outOff) {
      var state = this._desState;
      var l = utils.readUInt32BE(inp, inOff);
      var r = utils.readUInt32BE(inp, inOff + 4);
      utils.ip(l, r, state.tmp, 0);
      l = state.tmp[0];
      r = state.tmp[1];
      "encrypt" === this.type ? this._encrypt(state, l, r, state.tmp, 0) : this._decrypt(state, l, r, state.tmp, 0);
      l = state.tmp[0];
      r = state.tmp[1];
      utils.writeUInt32BE(out, l, outOff);
      utils.writeUInt32BE(out, r, outOff + 4);
    };
    DES.prototype._pad = function _pad(buffer, off) {
      var value = buffer.length - off;
      for (var i = off; i < buffer.length; i++) buffer[i] = value;
      return true;
    };
    DES.prototype._unpad = function _unpad(buffer) {
      var pad = buffer[buffer.length - 1];
      for (var i = buffer.length - pad; i < buffer.length; i++) assert.equal(buffer[i], pad);
      return buffer.slice(0, buffer.length - pad);
    };
    DES.prototype._encrypt = function _encrypt(state, lStart, rStart, out, off) {
      var l = lStart;
      var r = rStart;
      for (var i = 0; i < state.keys.length; i += 2) {
        var keyL = state.keys[i];
        var keyR = state.keys[i + 1];
        utils.expand(r, state.tmp, 0);
        keyL ^= state.tmp[0];
        keyR ^= state.tmp[1];
        var s = utils.substitute(keyL, keyR);
        var f = utils.permute(s);
        var t = r;
        r = (l ^ f) >>> 0;
        l = t;
      }
      utils.rip(r, l, out, off);
    };
    DES.prototype._decrypt = function _decrypt(state, lStart, rStart, out, off) {
      var l = rStart;
      var r = lStart;
      for (var i = state.keys.length - 2; i >= 0; i -= 2) {
        var keyL = state.keys[i];
        var keyR = state.keys[i + 1];
        utils.expand(l, state.tmp, 0);
        keyL ^= state.tmp[0];
        keyR ^= state.tmp[1];
        var s = utils.substitute(keyL, keyR);
        var f = utils.permute(s);
        var t = l;
        l = (r ^ f) >>> 0;
        r = t;
      }
      utils.rip(l, r, out, off);
    };
  }, {
    "../des": 57,
    inherits: 101,
    "minimalistic-assert": 105
  } ],
  61: [ function(require, module, exports) {
    "use strict";
    var assert = require("minimalistic-assert");
    var inherits = require("inherits");
    var des = require("../des");
    var Cipher = des.Cipher;
    var DES = des.DES;
    function EDEState(type, key) {
      assert.equal(key.length, 24, "Invalid key length");
      var k1 = key.slice(0, 8);
      var k2 = key.slice(8, 16);
      var k3 = key.slice(16, 24);
      this.ciphers = "encrypt" === type ? [ DES.create({
        type: "encrypt",
        key: k1
      }), DES.create({
        type: "decrypt",
        key: k2
      }), DES.create({
        type: "encrypt",
        key: k3
      }) ] : [ DES.create({
        type: "decrypt",
        key: k3
      }), DES.create({
        type: "encrypt",
        key: k2
      }), DES.create({
        type: "decrypt",
        key: k1
      }) ];
    }
    function EDE(options) {
      Cipher.call(this, options);
      var state = new EDEState(this.type, this.options.key);
      this._edeState = state;
    }
    inherits(EDE, Cipher);
    module.exports = EDE;
    EDE.create = function create(options) {
      return new EDE(options);
    };
    EDE.prototype._update = function _update(inp, inOff, out, outOff) {
      var state = this._edeState;
      state.ciphers[0]._update(inp, inOff, out, outOff);
      state.ciphers[1]._update(out, outOff, out, outOff);
      state.ciphers[2]._update(out, outOff, out, outOff);
    };
    EDE.prototype._pad = DES.prototype._pad;
    EDE.prototype._unpad = DES.prototype._unpad;
  }, {
    "../des": 57,
    inherits: 101,
    "minimalistic-assert": 105
  } ],
  62: [ function(require, module, exports) {
    "use strict";
    exports.readUInt32BE = function readUInt32BE(bytes, off) {
      var res = bytes[0 + off] << 24 | bytes[1 + off] << 16 | bytes[2 + off] << 8 | bytes[3 + off];
      return res >>> 0;
    };
    exports.writeUInt32BE = function writeUInt32BE(bytes, value, off) {
      bytes[0 + off] = value >>> 24;
      bytes[1 + off] = value >>> 16 & 255;
      bytes[2 + off] = value >>> 8 & 255;
      bytes[3 + off] = 255 & value;
    };
    exports.ip = function ip(inL, inR, out, off) {
      var outL = 0;
      var outR = 0;
      for (var i = 6; i >= 0; i -= 2) {
        for (var j = 0; j <= 24; j += 8) {
          outL <<= 1;
          outL |= inR >>> j + i & 1;
        }
        for (var j = 0; j <= 24; j += 8) {
          outL <<= 1;
          outL |= inL >>> j + i & 1;
        }
      }
      for (var i = 6; i >= 0; i -= 2) {
        for (var j = 1; j <= 25; j += 8) {
          outR <<= 1;
          outR |= inR >>> j + i & 1;
        }
        for (var j = 1; j <= 25; j += 8) {
          outR <<= 1;
          outR |= inL >>> j + i & 1;
        }
      }
      out[off + 0] = outL >>> 0;
      out[off + 1] = outR >>> 0;
    };
    exports.rip = function rip(inL, inR, out, off) {
      var outL = 0;
      var outR = 0;
      for (var i = 0; i < 4; i++) for (var j = 24; j >= 0; j -= 8) {
        outL <<= 1;
        outL |= inR >>> j + i & 1;
        outL <<= 1;
        outL |= inL >>> j + i & 1;
      }
      for (var i = 4; i < 8; i++) for (var j = 24; j >= 0; j -= 8) {
        outR <<= 1;
        outR |= inR >>> j + i & 1;
        outR <<= 1;
        outR |= inL >>> j + i & 1;
      }
      out[off + 0] = outL >>> 0;
      out[off + 1] = outR >>> 0;
    };
    exports.pc1 = function pc1(inL, inR, out, off) {
      var outL = 0;
      var outR = 0;
      for (var i = 7; i >= 5; i--) {
        for (var j = 0; j <= 24; j += 8) {
          outL <<= 1;
          outL |= inR >> j + i & 1;
        }
        for (var j = 0; j <= 24; j += 8) {
          outL <<= 1;
          outL |= inL >> j + i & 1;
        }
      }
      for (var j = 0; j <= 24; j += 8) {
        outL <<= 1;
        outL |= inR >> j + i & 1;
      }
      for (var i = 1; i <= 3; i++) {
        for (var j = 0; j <= 24; j += 8) {
          outR <<= 1;
          outR |= inR >> j + i & 1;
        }
        for (var j = 0; j <= 24; j += 8) {
          outR <<= 1;
          outR |= inL >> j + i & 1;
        }
      }
      for (var j = 0; j <= 24; j += 8) {
        outR <<= 1;
        outR |= inL >> j + i & 1;
      }
      out[off + 0] = outL >>> 0;
      out[off + 1] = outR >>> 0;
    };
    exports.r28shl = function r28shl(num, shift) {
      return num << shift & 268435455 | num >>> 28 - shift;
    };
    var pc2table = [ 14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24 ];
    exports.pc2 = function pc2(inL, inR, out, off) {
      var outL = 0;
      var outR = 0;
      var len = pc2table.length >>> 1;
      for (var i = 0; i < len; i++) {
        outL <<= 1;
        outL |= inL >>> pc2table[i] & 1;
      }
      for (var i = len; i < pc2table.length; i++) {
        outR <<= 1;
        outR |= inR >>> pc2table[i] & 1;
      }
      out[off + 0] = outL >>> 0;
      out[off + 1] = outR >>> 0;
    };
    exports.expand = function expand(r, out, off) {
      var outL = 0;
      var outR = 0;
      outL = (1 & r) << 5 | r >>> 27;
      for (var i = 23; i >= 15; i -= 4) {
        outL <<= 6;
        outL |= r >>> i & 63;
      }
      for (var i = 11; i >= 3; i -= 4) {
        outR |= r >>> i & 63;
        outR <<= 6;
      }
      outR |= (31 & r) << 1 | r >>> 31;
      out[off + 0] = outL >>> 0;
      out[off + 1] = outR >>> 0;
    };
    var sTable = [ 14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11 ];
    exports.substitute = function substitute(inL, inR) {
      var out = 0;
      for (var i = 0; i < 4; i++) {
        var b = inL >>> 18 - 6 * i & 63;
        var sb = sTable[64 * i + b];
        out <<= 4;
        out |= sb;
      }
      for (var i = 0; i < 4; i++) {
        var b = inR >>> 18 - 6 * i & 63;
        var sb = sTable[256 + 64 * i + b];
        out <<= 4;
        out |= sb;
      }
      return out >>> 0;
    };
    var permuteTable = [ 16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7 ];
    exports.permute = function permute(num) {
      var out = 0;
      for (var i = 0; i < permuteTable.length; i++) {
        out <<= 1;
        out |= num >>> permuteTable[i] & 1;
      }
      return out >>> 0;
    };
    exports.padSplit = function padSplit(num, size, group) {
      var str = num.toString(2);
      while (str.length < size) str = "0" + str;
      var out = [];
      for (var i = 0; i < size; i += group) out.push(str.slice(i, i + group));
      return out.join(" ");
    };
  }, {} ],
  63: [ function(require, module, exports) {
    (function(Buffer) {
      var generatePrime = require("./lib/generatePrime");
      var primes = require("./lib/primes.json");
      var DH = require("./lib/dh");
      function getDiffieHellman(mod) {
        var prime = new Buffer(primes[mod].prime, "hex");
        var gen = new Buffer(primes[mod].gen, "hex");
        return new DH(prime, gen);
      }
      var ENCODINGS = {
        binary: true,
        hex: true,
        base64: true
      };
      function createDiffieHellman(prime, enc, generator, genc) {
        if (Buffer.isBuffer(enc) || void 0 === ENCODINGS[enc]) return createDiffieHellman(prime, "binary", enc, generator);
        enc = enc || "binary";
        genc = genc || "binary";
        generator = generator || new Buffer([ 2 ]);
        Buffer.isBuffer(generator) || (generator = new Buffer(generator, genc));
        if ("number" === typeof prime) return new DH(generatePrime(prime, generator), generator, true);
        Buffer.isBuffer(prime) || (prime = new Buffer(prime, enc));
        return new DH(prime, generator, true);
      }
      exports.DiffieHellmanGroup = exports.createDiffieHellmanGroup = exports.getDiffieHellman = getDiffieHellman;
      exports.createDiffieHellman = exports.DiffieHellman = createDiffieHellman;
    }).call(this, require("buffer").Buffer);
  }, {
    "./lib/dh": 64,
    "./lib/generatePrime": 65,
    "./lib/primes.json": 66,
    buffer: 47
  } ],
  64: [ function(require, module, exports) {
    (function(Buffer) {
      var BN = require("bn.js");
      var MillerRabin = require("miller-rabin");
      var millerRabin = new MillerRabin();
      var TWENTYFOUR = new BN(24);
      var ELEVEN = new BN(11);
      var TEN = new BN(10);
      var THREE = new BN(3);
      var SEVEN = new BN(7);
      var primes = require("./generatePrime");
      var randomBytes = require("randombytes");
      module.exports = DH;
      function setPublicKey(pub, enc) {
        enc = enc || "utf8";
        Buffer.isBuffer(pub) || (pub = new Buffer(pub, enc));
        this._pub = new BN(pub);
        return this;
      }
      function setPrivateKey(priv, enc) {
        enc = enc || "utf8";
        Buffer.isBuffer(priv) || (priv = new Buffer(priv, enc));
        this._priv = new BN(priv);
        return this;
      }
      var primeCache = {};
      function checkPrime(prime, generator) {
        var gen = generator.toString("hex");
        var hex = [ gen, prime.toString(16) ].join("_");
        if (hex in primeCache) return primeCache[hex];
        var error = 0;
        if (prime.isEven() || !primes.simpleSieve || !primes.fermatTest(prime) || !millerRabin.test(prime)) {
          error += 1;
          error += "02" === gen || "05" === gen ? 8 : 4;
          primeCache[hex] = error;
          return error;
        }
        millerRabin.test(prime.shrn(1)) || (error += 2);
        var rem;
        switch (gen) {
         case "02":
          prime.mod(TWENTYFOUR).cmp(ELEVEN) && (error += 8);
          break;

         case "05":
          rem = prime.mod(TEN);
          rem.cmp(THREE) && rem.cmp(SEVEN) && (error += 8);
          break;

         default:
          error += 4;
        }
        primeCache[hex] = error;
        return error;
      }
      function DH(prime, generator, malleable) {
        this.setGenerator(generator);
        this.__prime = new BN(prime);
        this._prime = BN.mont(this.__prime);
        this._primeLen = prime.length;
        this._pub = void 0;
        this._priv = void 0;
        this._primeCode = void 0;
        if (malleable) {
          this.setPublicKey = setPublicKey;
          this.setPrivateKey = setPrivateKey;
        } else this._primeCode = 8;
      }
      Object.defineProperty(DH.prototype, "verifyError", {
        enumerable: true,
        get: function() {
          "number" !== typeof this._primeCode && (this._primeCode = checkPrime(this.__prime, this.__gen));
          return this._primeCode;
        }
      });
      DH.prototype.generateKeys = function() {
        this._priv || (this._priv = new BN(randomBytes(this._primeLen)));
        this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
        return this.getPublicKey();
      };
      DH.prototype.computeSecret = function(other) {
        other = new BN(other);
        other = other.toRed(this._prime);
        var secret = other.redPow(this._priv).fromRed();
        var out = new Buffer(secret.toArray());
        var prime = this.getPrime();
        if (out.length < prime.length) {
          var front = new Buffer(prime.length - out.length);
          front.fill(0);
          out = Buffer.concat([ front, out ]);
        }
        return out;
      };
      DH.prototype.getPublicKey = function getPublicKey(enc) {
        return formatReturnValue(this._pub, enc);
      };
      DH.prototype.getPrivateKey = function getPrivateKey(enc) {
        return formatReturnValue(this._priv, enc);
      };
      DH.prototype.getPrime = function(enc) {
        return formatReturnValue(this.__prime, enc);
      };
      DH.prototype.getGenerator = function(enc) {
        return formatReturnValue(this._gen, enc);
      };
      DH.prototype.setGenerator = function(gen, enc) {
        enc = enc || "utf8";
        Buffer.isBuffer(gen) || (gen = new Buffer(gen, enc));
        this.__gen = gen;
        this._gen = new BN(gen);
        return this;
      };
      function formatReturnValue(bn, enc) {
        var buf = new Buffer(bn.toArray());
        return enc ? buf.toString(enc) : buf;
      }
    }).call(this, require("buffer").Buffer);
  }, {
    "./generatePrime": 65,
    "bn.js": 16,
    buffer: 47,
    "miller-rabin": 104,
    randombytes: 125
  } ],
  65: [ function(require, module, exports) {
    var randomBytes = require("randombytes");
    module.exports = findPrime;
    findPrime.simpleSieve = simpleSieve;
    findPrime.fermatTest = fermatTest;
    var BN = require("bn.js");
    var TWENTYFOUR = new BN(24);
    var MillerRabin = require("miller-rabin");
    var millerRabin = new MillerRabin();
    var ONE = new BN(1);
    var TWO = new BN(2);
    var FIVE = new BN(5);
    var SIXTEEN = new BN(16);
    var EIGHT = new BN(8);
    var TEN = new BN(10);
    var THREE = new BN(3);
    var SEVEN = new BN(7);
    var ELEVEN = new BN(11);
    var FOUR = new BN(4);
    var TWELVE = new BN(12);
    var primes = null;
    function _getPrimes() {
      if (null !== primes) return primes;
      var limit = 1048576;
      var res = [];
      res[0] = 2;
      for (var i = 1, k = 3; k < limit; k += 2) {
        var sqrt = Math.ceil(Math.sqrt(k));
        for (var j = 0; j < i && res[j] <= sqrt; j++) if (k % res[j] === 0) break;
        if (i !== j && res[j] <= sqrt) continue;
        res[i++] = k;
      }
      primes = res;
      return res;
    }
    function simpleSieve(p) {
      var primes = _getPrimes();
      for (var i = 0; i < primes.length; i++) if (0 === p.modn(primes[i])) return 0 === p.cmpn(primes[i]);
      return true;
    }
    function fermatTest(p) {
      var red = BN.mont(p);
      return 0 === TWO.toRed(red).redPow(p.subn(1)).fromRed().cmpn(1);
    }
    function findPrime(bits, gen) {
      if (bits < 16) return new BN(2 === gen || 5 === gen ? [ 140, 123 ] : [ 140, 39 ]);
      gen = new BN(gen);
      var num, n2;
      while (true) {
        num = new BN(randomBytes(Math.ceil(bits / 8)));
        while (num.bitLength() > bits) num.ishrn(1);
        num.isEven() && num.iadd(ONE);
        num.testn(1) || num.iadd(TWO);
        if (gen.cmp(TWO)) {
          if (!gen.cmp(FIVE)) while (num.mod(TEN).cmp(THREE)) num.iadd(FOUR);
        } else while (num.mod(TWENTYFOUR).cmp(ELEVEN)) num.iadd(FOUR);
        n2 = num.shrn(1);
        if (simpleSieve(n2) && simpleSieve(num) && fermatTest(n2) && fermatTest(num) && millerRabin.test(n2) && millerRabin.test(num)) return num;
      }
    }
  }, {
    "bn.js": 16,
    "miller-rabin": 104,
    randombytes: 125
  } ],
  66: [ function(require, module, exports) {
    module.exports = {
      modp1: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
      },
      modp2: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
      },
      modp5: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
      },
      modp14: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
      },
      modp15: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
      },
      modp16: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
      },
      modp17: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
      },
      modp18: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
      }
    };
  }, {} ],
  67: [ function(require, module, exports) {
    "use strict";
    var elliptic = exports;
    elliptic.version = require("../package.json").version;
    elliptic.utils = require("./elliptic/utils");
    elliptic.rand = require("brorand");
    elliptic.curve = require("./elliptic/curve");
    elliptic.curves = require("./elliptic/curves");
    elliptic.ec = require("./elliptic/ec");
    elliptic.eddsa = require("./elliptic/eddsa");
  }, {
    "../package.json": 82,
    "./elliptic/curve": 70,
    "./elliptic/curves": 73,
    "./elliptic/ec": 74,
    "./elliptic/eddsa": 77,
    "./elliptic/utils": 81,
    brorand: 17
  } ],
  68: [ function(require, module, exports) {
    "use strict";
    var BN = require("bn.js");
    var elliptic = require("../../elliptic");
    var utils = elliptic.utils;
    var getNAF = utils.getNAF;
    var getJSF = utils.getJSF;
    var assert = utils.assert;
    function BaseCurve(type, conf) {
      this.type = type;
      this.p = new BN(conf.p, 16);
      this.red = conf.prime ? BN.red(conf.prime) : BN.mont(this.p);
      this.zero = new BN(0).toRed(this.red);
      this.one = new BN(1).toRed(this.red);
      this.two = new BN(2).toRed(this.red);
      this.n = conf.n && new BN(conf.n, 16);
      this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);
      this._wnafT1 = new Array(4);
      this._wnafT2 = new Array(4);
      this._wnafT3 = new Array(4);
      this._wnafT4 = new Array(4);
      var adjustCount = this.n && this.p.div(this.n);
      if (!adjustCount || adjustCount.cmpn(100) > 0) this.redN = null; else {
        this._maxwellTrick = true;
        this.redN = this.n.toRed(this.red);
      }
    }
    module.exports = BaseCurve;
    BaseCurve.prototype.point = function point() {
      throw new Error("Not implemented");
    };
    BaseCurve.prototype.validate = function validate() {
      throw new Error("Not implemented");
    };
    BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
      assert(p.precomputed);
      var doubles = p._getDoubles();
      var naf = getNAF(k, 1);
      var I = (1 << doubles.step + 1) - (doubles.step % 2 === 0 ? 2 : 1);
      I /= 3;
      var repr = [];
      for (var j = 0; j < naf.length; j += doubles.step) {
        var nafW = 0;
        for (var k = j + doubles.step - 1; k >= j; k--) nafW = (nafW << 1) + naf[k];
        repr.push(nafW);
      }
      var a = this.jpoint(null, null, null);
      var b = this.jpoint(null, null, null);
      for (var i = I; i > 0; i--) {
        for (var j = 0; j < repr.length; j++) {
          var nafW = repr[j];
          nafW === i ? b = b.mixedAdd(doubles.points[j]) : nafW === -i && (b = b.mixedAdd(doubles.points[j].neg()));
        }
        a = a.add(b);
      }
      return a.toP();
    };
    BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
      var w = 4;
      var nafPoints = p._getNAFPoints(w);
      w = nafPoints.wnd;
      var wnd = nafPoints.points;
      var naf = getNAF(k, w);
      var acc = this.jpoint(null, null, null);
      for (var i = naf.length - 1; i >= 0; i--) {
        for (var k = 0; i >= 0 && 0 === naf[i]; i--) k++;
        i >= 0 && k++;
        acc = acc.dblp(k);
        if (i < 0) break;
        var z = naf[i];
        assert(0 !== z);
        acc = "affine" === p.type ? z > 0 ? acc.mixedAdd(wnd[z - 1 >> 1]) : acc.mixedAdd(wnd[-z - 1 >> 1].neg()) : z > 0 ? acc.add(wnd[z - 1 >> 1]) : acc.add(wnd[-z - 1 >> 1].neg());
      }
      return "affine" === p.type ? acc.toP() : acc;
    };
    BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW, points, coeffs, len, jacobianResult) {
      var wndWidth = this._wnafT1;
      var wnd = this._wnafT2;
      var naf = this._wnafT3;
      var max = 0;
      for (var i = 0; i < len; i++) {
        var p = points[i];
        var nafPoints = p._getNAFPoints(defW);
        wndWidth[i] = nafPoints.wnd;
        wnd[i] = nafPoints.points;
      }
      for (var i = len - 1; i >= 1; i -= 2) {
        var a = i - 1;
        var b = i;
        if (1 !== wndWidth[a] || 1 !== wndWidth[b]) {
          naf[a] = getNAF(coeffs[a], wndWidth[a]);
          naf[b] = getNAF(coeffs[b], wndWidth[b]);
          max = Math.max(naf[a].length, max);
          max = Math.max(naf[b].length, max);
          continue;
        }
        var comb = [ points[a], null, null, points[b] ];
        if (0 === points[a].y.cmp(points[b].y)) {
          comb[1] = points[a].add(points[b]);
          comb[2] = points[a].toJ().mixedAdd(points[b].neg());
        } else if (0 === points[a].y.cmp(points[b].y.redNeg())) {
          comb[1] = points[a].toJ().mixedAdd(points[b]);
          comb[2] = points[a].add(points[b].neg());
        } else {
          comb[1] = points[a].toJ().mixedAdd(points[b]);
          comb[2] = points[a].toJ().mixedAdd(points[b].neg());
        }
        var index = [ -3, -1, -5, -7, 0, 7, 5, 1, 3 ];
        var jsf = getJSF(coeffs[a], coeffs[b]);
        max = Math.max(jsf[0].length, max);
        naf[a] = new Array(max);
        naf[b] = new Array(max);
        for (var j = 0; j < max; j++) {
          var ja = 0 | jsf[0][j];
          var jb = 0 | jsf[1][j];
          naf[a][j] = index[3 * (ja + 1) + (jb + 1)];
          naf[b][j] = 0;
          wnd[a] = comb;
        }
      }
      var acc = this.jpoint(null, null, null);
      var tmp = this._wnafT4;
      for (var i = max; i >= 0; i--) {
        var k = 0;
        while (i >= 0) {
          var zero = true;
          for (var j = 0; j < len; j++) {
            tmp[j] = 0 | naf[j][i];
            0 !== tmp[j] && (zero = false);
          }
          if (!zero) break;
          k++;
          i--;
        }
        i >= 0 && k++;
        acc = acc.dblp(k);
        if (i < 0) break;
        for (var j = 0; j < len; j++) {
          var z = tmp[j];
          var p;
          if (0 === z) continue;
          z > 0 ? p = wnd[j][z - 1 >> 1] : z < 0 && (p = wnd[j][-z - 1 >> 1].neg());
          acc = "affine" === p.type ? acc.mixedAdd(p) : acc.add(p);
        }
      }
      for (var i = 0; i < len; i++) wnd[i] = null;
      return jacobianResult ? acc : acc.toP();
    };
    function BasePoint(curve, type) {
      this.curve = curve;
      this.type = type;
      this.precomputed = null;
    }
    BaseCurve.BasePoint = BasePoint;
    BasePoint.prototype.eq = function eq() {
      throw new Error("Not implemented");
    };
    BasePoint.prototype.validate = function validate() {
      return this.curve.validate(this);
    };
    BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
      bytes = utils.toArray(bytes, enc);
      var len = this.p.byteLength();
      if ((4 === bytes[0] || 6 === bytes[0] || 7 === bytes[0]) && bytes.length - 1 === 2 * len) {
        6 === bytes[0] ? assert(bytes[bytes.length - 1] % 2 === 0) : 7 === bytes[0] && assert(bytes[bytes.length - 1] % 2 === 1);
        var res = this.point(bytes.slice(1, 1 + len), bytes.slice(1 + len, 1 + 2 * len));
        return res;
      }
      if ((2 === bytes[0] || 3 === bytes[0]) && bytes.length - 1 === len) return this.pointFromX(bytes.slice(1, 1 + len), 3 === bytes[0]);
      throw new Error("Unknown point format");
    };
    BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
      return this.encode(enc, true);
    };
    BasePoint.prototype._encode = function _encode(compact) {
      var len = this.curve.p.byteLength();
      var x = this.getX().toArray("be", len);
      if (compact) return [ this.getY().isEven() ? 2 : 3 ].concat(x);
      return [ 4 ].concat(x, this.getY().toArray("be", len));
    };
    BasePoint.prototype.encode = function encode(enc, compact) {
      return utils.encode(this._encode(compact), enc);
    };
    BasePoint.prototype.precompute = function precompute(power) {
      if (this.precomputed) return this;
      var precomputed = {
        doubles: null,
        naf: null,
        beta: null
      };
      precomputed.naf = this._getNAFPoints(8);
      precomputed.doubles = this._getDoubles(4, power);
      precomputed.beta = this._getBeta();
      this.precomputed = precomputed;
      return this;
    };
    BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
      if (!this.precomputed) return false;
      var doubles = this.precomputed.doubles;
      if (!doubles) return false;
      return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
    };
    BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
      if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
      var doubles = [ this ];
      var acc = this;
      for (var i = 0; i < power; i += step) {
        for (var j = 0; j < step; j++) acc = acc.dbl();
        doubles.push(acc);
      }
      return {
        step: step,
        points: doubles
      };
    };
    BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
      if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
      var res = [ this ];
      var max = (1 << wnd) - 1;
      var dbl = 1 === max ? null : this.dbl();
      for (var i = 1; i < max; i++) res[i] = res[i - 1].add(dbl);
      return {
        wnd: wnd,
        points: res
      };
    };
    BasePoint.prototype._getBeta = function _getBeta() {
      return null;
    };
    BasePoint.prototype.dblp = function dblp(k) {
      var r = this;
      for (var i = 0; i < k; i++) r = r.dbl();
      return r;
    };
  }, {
    "../../elliptic": 67,
    "bn.js": 16
  } ],
  69: [ function(require, module, exports) {
    "use strict";
    var curve = require("../curve");
    var elliptic = require("../../elliptic");
    var BN = require("bn.js");
    var inherits = require("inherits");
    var Base = curve.base;
    var assert = elliptic.utils.assert;
    function EdwardsCurve(conf) {
      this.twisted = 1 !== (0 | conf.a);
      this.mOneA = this.twisted && -1 === (0 | conf.a);
      this.extended = this.mOneA;
      Base.call(this, "edwards", conf);
      this.a = new BN(conf.a, 16).umod(this.red.m);
      this.a = this.a.toRed(this.red);
      this.c = new BN(conf.c, 16).toRed(this.red);
      this.c2 = this.c.redSqr();
      this.d = new BN(conf.d, 16).toRed(this.red);
      this.dd = this.d.redAdd(this.d);
      assert(!this.twisted || 0 === this.c.fromRed().cmpn(1));
      this.oneC = 1 === (0 | conf.c);
    }
    inherits(EdwardsCurve, Base);
    module.exports = EdwardsCurve;
    EdwardsCurve.prototype._mulA = function _mulA(num) {
      return this.mOneA ? num.redNeg() : this.a.redMul(num);
    };
    EdwardsCurve.prototype._mulC = function _mulC(num) {
      return this.oneC ? num : this.c.redMul(num);
    };
    EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
      return this.point(x, y, z, t);
    };
    EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
      x = new BN(x, 16);
      x.red || (x = x.toRed(this.red));
      var x2 = x.redSqr();
      var rhs = this.c2.redSub(this.a.redMul(x2));
      var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));
      var y2 = rhs.redMul(lhs.redInvm());
      var y = y2.redSqrt();
      if (0 !== y.redSqr().redSub(y2).cmp(this.zero)) throw new Error("invalid point");
      var isOdd = y.fromRed().isOdd();
      (odd && !isOdd || !odd && isOdd) && (y = y.redNeg());
      return this.point(x, y);
    };
    EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
      y = new BN(y, 16);
      y.red || (y = y.toRed(this.red));
      var y2 = y.redSqr();
      var lhs = y2.redSub(this.one);
      var rhs = y2.redMul(this.d).redAdd(this.one);
      var x2 = lhs.redMul(rhs.redInvm());
      if (0 === x2.cmp(this.zero)) {
        if (odd) throw new Error("invalid point");
        return this.point(this.zero, y);
      }
      var x = x2.redSqrt();
      if (0 !== x.redSqr().redSub(x2).cmp(this.zero)) throw new Error("invalid point");
      x.isOdd() !== odd && (x = x.redNeg());
      return this.point(x, y);
    };
    EdwardsCurve.prototype.validate = function validate(point) {
      if (point.isInfinity()) return true;
      point.normalize();
      var x2 = point.x.redSqr();
      var y2 = point.y.redSqr();
      var lhs = x2.redMul(this.a).redAdd(y2);
      var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));
      return 0 === lhs.cmp(rhs);
    };
    function Point(curve, x, y, z, t) {
      Base.BasePoint.call(this, curve, "projective");
      if (null === x && null === y && null === z) {
        this.x = this.curve.zero;
        this.y = this.curve.one;
        this.z = this.curve.one;
        this.t = this.curve.zero;
        this.zOne = true;
      } else {
        this.x = new BN(x, 16);
        this.y = new BN(y, 16);
        this.z = z ? new BN(z, 16) : this.curve.one;
        this.t = t && new BN(t, 16);
        this.x.red || (this.x = this.x.toRed(this.curve.red));
        this.y.red || (this.y = this.y.toRed(this.curve.red));
        this.z.red || (this.z = this.z.toRed(this.curve.red));
        this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red));
        this.zOne = this.z === this.curve.one;
        if (this.curve.extended && !this.t) {
          this.t = this.x.redMul(this.y);
          this.zOne || (this.t = this.t.redMul(this.z.redInvm()));
        }
      }
    }
    inherits(Point, Base.BasePoint);
    EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
      return Point.fromJSON(this, obj);
    };
    EdwardsCurve.prototype.point = function point(x, y, z, t) {
      return new Point(this, x, y, z, t);
    };
    Point.fromJSON = function fromJSON(curve, obj) {
      return new Point(curve, obj[0], obj[1], obj[2]);
    };
    Point.prototype.inspect = function inspect() {
      if (this.isInfinity()) return "<EC Point Infinity>";
      return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    };
    Point.prototype.isInfinity = function isInfinity() {
      return 0 === this.x.cmpn(0) && 0 === this.y.cmp(this.z);
    };
    Point.prototype._extDbl = function _extDbl() {
      var a = this.x.redSqr();
      var b = this.y.redSqr();
      var c = this.z.redSqr();
      c = c.redIAdd(c);
      var d = this.curve._mulA(a);
      var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
      var g = d.redAdd(b);
      var f = g.redSub(c);
      var h = d.redSub(b);
      var nx = e.redMul(f);
      var ny = g.redMul(h);
      var nt = e.redMul(h);
      var nz = f.redMul(g);
      return this.curve.point(nx, ny, nz, nt);
    };
    Point.prototype._projDbl = function _projDbl() {
      var b = this.x.redAdd(this.y).redSqr();
      var c = this.x.redSqr();
      var d = this.y.redSqr();
      var nx;
      var ny;
      var nz;
      if (this.curve.twisted) {
        var e = this.curve._mulA(c);
        var f = e.redAdd(d);
        if (this.zOne) {
          nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
          ny = f.redMul(e.redSub(d));
          nz = f.redSqr().redSub(f).redSub(f);
        } else {
          var h = this.z.redSqr();
          var j = f.redSub(h).redISub(h);
          nx = b.redSub(c).redISub(d).redMul(j);
          ny = f.redMul(e.redSub(d));
          nz = f.redMul(j);
        }
      } else {
        var e = c.redAdd(d);
        var h = this.curve._mulC(this.c.redMul(this.z)).redSqr();
        var j = e.redSub(h).redSub(h);
        nx = this.curve._mulC(b.redISub(e)).redMul(j);
        ny = this.curve._mulC(e).redMul(c.redISub(d));
        nz = e.redMul(j);
      }
      return this.curve.point(nx, ny, nz);
    };
    Point.prototype.dbl = function dbl() {
      if (this.isInfinity()) return this;
      return this.curve.extended ? this._extDbl() : this._projDbl();
    };
    Point.prototype._extAdd = function _extAdd(p) {
      var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
      var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
      var c = this.t.redMul(this.curve.dd).redMul(p.t);
      var d = this.z.redMul(p.z.redAdd(p.z));
      var e = b.redSub(a);
      var f = d.redSub(c);
      var g = d.redAdd(c);
      var h = b.redAdd(a);
      var nx = e.redMul(f);
      var ny = g.redMul(h);
      var nt = e.redMul(h);
      var nz = f.redMul(g);
      return this.curve.point(nx, ny, nz, nt);
    };
    Point.prototype._projAdd = function _projAdd(p) {
      var a = this.z.redMul(p.z);
      var b = a.redSqr();
      var c = this.x.redMul(p.x);
      var d = this.y.redMul(p.y);
      var e = this.curve.d.redMul(c).redMul(d);
      var f = b.redSub(e);
      var g = b.redAdd(e);
      var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
      var nx = a.redMul(f).redMul(tmp);
      var ny;
      var nz;
      if (this.curve.twisted) {
        ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
        nz = f.redMul(g);
      } else {
        ny = a.redMul(g).redMul(d.redSub(c));
        nz = this.curve._mulC(f).redMul(g);
      }
      return this.curve.point(nx, ny, nz);
    };
    Point.prototype.add = function add(p) {
      if (this.isInfinity()) return p;
      if (p.isInfinity()) return this;
      return this.curve.extended ? this._extAdd(p) : this._projAdd(p);
    };
    Point.prototype.mul = function mul(k) {
      return this._hasDoubles(k) ? this.curve._fixedNafMul(this, k) : this.curve._wnafMul(this, k);
    };
    Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
      return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, false);
    };
    Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
      return this.curve._wnafMulAdd(1, [ this, p ], [ k1, k2 ], 2, true);
    };
    Point.prototype.normalize = function normalize() {
      if (this.zOne) return this;
      var zi = this.z.redInvm();
      this.x = this.x.redMul(zi);
      this.y = this.y.redMul(zi);
      this.t && (this.t = this.t.redMul(zi));
      this.z = this.curve.one;
      this.zOne = true;
      return this;
    };
    Point.prototype.neg = function neg() {
      return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
    };
    Point.prototype.getX = function getX() {
      this.normalize();
      return this.x.fromRed();
    };
    Point.prototype.getY = function getY() {
      this.normalize();
      return this.y.fromRed();
    };
    Point.prototype.eq = function eq(other) {
      return this === other || 0 === this.getX().cmp(other.getX()) && 0 === this.getY().cmp(other.getY());
    };
    Point.prototype.eqXToP = function eqXToP(x) {
      var rx = x.toRed(this.curve.red).redMul(this.z);
      if (0 === this.x.cmp(rx)) return true;
      var xc = x.clone();
      var t = this.curve.redN.redMul(this.z);
      for (;;) {
        xc.iadd(this.curve.n);
        if (xc.cmp(this.curve.p) >= 0) return false;
        rx.redIAdd(t);
        if (0 === this.x.cmp(rx)) return true;
      }
      return false;
    };
    Point.prototype.toP = Point.prototype.normalize;
    Point.prototype.mixedAdd = Point.prototype.add;
  }, {
    "../../elliptic": 67,
    "../curve": 70,
    "bn.js": 16,
    inherits: 101
  } ],
  70: [ function(require, module, exports) {
    "use strict";
    var curve = exports;
    curve.base = require("./base");
    curve.short = require("./short");
    curve.mont = require("./mont");
    curve.edwards = require("./edwards");
  }, {
    "./base": 68,
    "./edwards": 69,
    "./mont": 71,
    "./short": 72
  } ],
  71: [ function(require, module, exports) {
    "use strict";
    var curve = require("../curve");
    var BN = require("bn.js");
    var inherits = require("inherits");
    var Base = curve.base;
    var elliptic = require("../../elliptic");
    var utils = elliptic.utils;
    function MontCurve(conf) {
      Base.call(this, "mont", conf);
      this.a = new BN(conf.a, 16).toRed(this.red);
      this.b = new BN(conf.b, 16).toRed(this.red);
      this.i4 = new BN(4).toRed(this.red).redInvm();
      this.two = new BN(2).toRed(this.red);
      this.a24 = this.i4.redMul(this.a.redAdd(this.two));
    }
    inherits(MontCurve, Base);
    module.exports = MontCurve;
    MontCurve.prototype.validate = function validate(point) {
      var x = point.normalize().x;
      var x2 = x.redSqr();
      var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
      var y = rhs.redSqrt();
      return 0 === y.redSqr().cmp(rhs);
    };
    function Point(curve, x, z) {
      Base.BasePoint.call(this, curve, "projective");
      if (null === x && null === z) {
        this.x = this.curve.one;
        this.z = this.curve.zero;
      } else {
        this.x = new BN(x, 16);
        this.z = new BN(z, 16);
        this.x.red || (this.x = this.x.toRed(this.curve.red));
        this.z.red || (this.z = this.z.toRed(this.curve.red));
      }
    }
    inherits(Point, Base.BasePoint);
    MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
      return this.point(utils.toArray(bytes, enc), 1);
    };
    MontCurve.prototype.point = function point(x, z) {
      return new Point(this, x, z);
    };
    MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
      return Point.fromJSON(this, obj);
    };
    Point.prototype.precompute = function precompute() {};
    Point.prototype._encode = function _encode() {
      return this.getX().toArray("be", this.curve.p.byteLength());
    };
    Point.fromJSON = function fromJSON(curve, obj) {
      return new Point(curve, obj[0], obj[1] || curve.one);
    };
    Point.prototype.inspect = function inspect() {
      if (this.isInfinity()) return "<EC Point Infinity>";
      return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    };
    Point.prototype.isInfinity = function isInfinity() {
      return 0 === this.z.cmpn(0);
    };
    Point.prototype.dbl = function dbl() {
      var a = this.x.redAdd(this.z);
      var aa = a.redSqr();
      var b = this.x.redSub(this.z);
      var bb = b.redSqr();
      var c = aa.redSub(bb);
      var nx = aa.redMul(bb);
      var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
      return this.curve.point(nx, nz);
    };
    Point.prototype.add = function add() {
      throw new Error("Not supported on Montgomery curve");
    };
    Point.prototype.diffAdd = function diffAdd(p, diff) {
      var a = this.x.redAdd(this.z);
      var b = this.x.redSub(this.z);
      var c = p.x.redAdd(p.z);
      var d = p.x.redSub(p.z);
      var da = d.redMul(a);
      var cb = c.redMul(b);
      var nx = diff.z.redMul(da.redAdd(cb).redSqr());
      var nz = diff.x.redMul(da.redISub(cb).redSqr());
      return this.curve.point(nx, nz);
    };
    Point.prototype.mul = function mul(k) {
      var t = k.clone();
      var a = this;
      var b = this.curve.point(null, null);
      var c = this;
      for (var bits = []; 0 !== t.cmpn(0); t.iushrn(1)) bits.push(t.andln(1));
      for (var i = bits.length - 1; i >= 0; i--) if (0 === bits[i]) {
        a = a.diffAdd(b, c);
        b = b.dbl();
      } else {
        b = a.diffAdd(b, c);
        a = a.dbl();
      }
      return b;
    };
    Point.prototype.mulAdd = function mulAdd() {
      throw new Error("Not supported on Montgomery curve");
    };
    Point.prototype.jumlAdd = function jumlAdd() {
      throw new Error("Not supported on Montgomery curve");
    };
    Point.prototype.eq = function eq(other) {
      return 0 === this.getX().cmp(other.getX());
    };
    Point.prototype.normalize = function normalize() {
      this.x = this.x.redMul(this.z.redInvm());
      this.z = this.curve.one;
      return this;
    };
    Point.prototype.getX = function getX() {
      this.normalize();
      return this.x.fromRed();
    };
  }, {
    "../../elliptic": 67,
    "../curve": 70,
    "bn.js": 16,
    inherits: 101
  } ],
  72: [ function(require, module, exports) {
    "use strict";
    var curve = require("../curve");
    var elliptic = require("../../elliptic");
    var BN = require("bn.js");
    var inherits = require("inherits");
    var Base = curve.base;
    var assert = elliptic.utils.assert;
    function ShortCurve(conf) {
      Base.call(this, "short", conf);
      this.a = new BN(conf.a, 16).toRed(this.red);
      this.b = new BN(conf.b, 16).toRed(this.red);
      this.tinv = this.two.redInvm();
      this.zeroA = 0 === this.a.fromRed().cmpn(0);
      this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3);
      this.endo = this._getEndomorphism(conf);
      this._endoWnafT1 = new Array(4);
      this._endoWnafT2 = new Array(4);
    }
    inherits(ShortCurve, Base);
    module.exports = ShortCurve;
    ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
      if (!this.zeroA || !this.g || !this.n || 1 !== this.p.modn(3)) return;
      var beta;
      var lambda;
      if (conf.beta) beta = new BN(conf.beta, 16).toRed(this.red); else {
        var betas = this._getEndoRoots(this.p);
        beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
        beta = beta.toRed(this.red);
      }
      if (conf.lambda) lambda = new BN(conf.lambda, 16); else {
        var lambdas = this._getEndoRoots(this.n);
        if (0 === this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta))) lambda = lambdas[0]; else {
          lambda = lambdas[1];
          assert(0 === this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)));
        }
      }
      var basis;
      basis = conf.basis ? conf.basis.map(function(vec) {
        return {
          a: new BN(vec.a, 16),
          b: new BN(vec.b, 16)
        };
      }) : this._getEndoBasis(lambda);
      return {
        beta: beta,
        lambda: lambda,
        basis: basis
      };
    };
    ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
      var red = num === this.p ? this.red : BN.mont(num);
      var tinv = new BN(2).toRed(red).redInvm();
      var ntinv = tinv.redNeg();
      var s = new BN(3).toRed(red).redNeg().redSqrt().redMul(tinv);
      var l1 = ntinv.redAdd(s).fromRed();
      var l2 = ntinv.redSub(s).fromRed();
      return [ l1, l2 ];
    };
    ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
      var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));
      var u = lambda;
      var v = this.n.clone();
      var x1 = new BN(1);
      var y1 = new BN(0);
      var x2 = new BN(0);
      var y2 = new BN(1);
      var a0;
      var b0;
      var a1;
      var b1;
      var a2;
      var b2;
      var prevR;
      var i = 0;
      var r;
      var x;
      while (0 !== u.cmpn(0)) {
        var q = v.div(u);
        r = v.sub(q.mul(u));
        x = x2.sub(q.mul(x1));
        var y = y2.sub(q.mul(y1));
        if (!a1 && r.cmp(aprxSqrt) < 0) {
          a0 = prevR.neg();
          b0 = x1;
          a1 = r.neg();
          b1 = x;
        } else if (a1 && 2 === ++i) break;
        prevR = r;
        v = u;
        u = r;
        x2 = x1;
        x1 = x;
        y2 = y1;
        y1 = y;
      }
      a2 = r.neg();
      b2 = x;
      var len1 = a1.sqr().add(b1.sqr());
      var len2 = a2.sqr().add(b2.sqr());
      if (len2.cmp(len1) >= 0) {
        a2 = a0;
        b2 = b0;
      }
      if (a1.negative) {
        a1 = a1.neg();
        b1 = b1.neg();
      }
      if (a2.negative) {
        a2 = a2.neg();
        b2 = b2.neg();
      }
      return [ {
        a: a1,
        b: b1
      }, {
        a: a2,
        b: b2
      } ];
    };
    ShortCurve.prototype._endoSplit = function _endoSplit(k) {
      var basis = this.endo.basis;
      var v1 = basis[0];
      var v2 = basis[1];
      var c1 = v2.b.mul(k).divRound(this.n);
      var c2 = v1.b.neg().mul(k).divRound(this.n);
      var p1 = c1.mul(v1.a);
      var p2 = c2.mul(v2.a);
      var q1 = c1.mul(v1.b);
      var q2 = c2.mul(v2.b);
      var k1 = k.sub(p1).sub(p2);
      var k2 = q1.add(q2).neg();
      return {
        k1: k1,
        k2: k2
      };
    };
    ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
      x = new BN(x, 16);
      x.red || (x = x.toRed(this.red));
      var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
      var y = y2.redSqrt();
      if (0 !== y.redSqr().redSub(y2).cmp(this.zero)) throw new Error("invalid point");
      var isOdd = y.fromRed().isOdd();
      (odd && !isOdd || !odd && isOdd) && (y = y.redNeg());
      return this.point(x, y);
    };
    ShortCurve.prototype.validate = function validate(point) {
      if (point.inf) return true;
      var x = point.x;
      var y = point.y;
      var ax = this.a.redMul(x);
      var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
      return 0 === y.redSqr().redISub(rhs).cmpn(0);
    };
    ShortCurve.prototype._endoWnafMulAdd = function _endoWnafMulAdd(points, coeffs, jacobianResult) {
      var npoints = this._endoWnafT1;
      var ncoeffs = this._endoWnafT2;
      for (var i = 0; i < points.length; i++) {
        var split = this._endoSplit(coeffs[i]);
        var p = points[i];
        var beta = p._getBeta();
        if (split.k1.negative) {
          split.k1.ineg();
          p = p.neg(true);
        }
        if (split.k2.negative) {
          split.k2.ineg();
          beta = beta.neg(true);
        }
        npoints[2 * i] = p;
        npoints[2 * i + 1] = beta;
        ncoeffs[2 * i] = split.k1;
        ncoeffs[2 * i + 1] = split.k2;
      }
      var res = this._wnafMulAdd(1, npoints, ncoeffs, 2 * i, jacobianResult);
      for (var j = 0; j < 2 * i; j++) {
        npoints[j] = null;
        ncoeffs[j] = null;
      }
      return res;
    };
    function Point(curve, x, y, isRed) {
      Base.BasePoint.call(this, curve, "affine");
      if (null === x && null === y) {
        this.x = null;
        this.y = null;
        this.inf = true;
      } else {
        this.x = new BN(x, 16);
        this.y = new BN(y, 16);
        if (isRed) {
          this.x.forceRed(this.curve.red);
          this.y.forceRed(this.curve.red);
        }
        this.x.red || (this.x = this.x.toRed(this.curve.red));
        this.y.red || (this.y = this.y.toRed(this.curve.red));
        this.inf = false;
      }
    }
    inherits(Point, Base.BasePoint);
    ShortCurve.prototype.point = function point(x, y, isRed) {
      return new Point(this, x, y, isRed);
    };
    ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
      return Point.fromJSON(this, obj, red);
    };
    Point.prototype._getBeta = function _getBeta() {
      if (!this.curve.endo) return;
      var pre = this.precomputed;
      if (pre && pre.beta) return pre.beta;
      var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
      if (pre) {
        var curve = this.curve;
        var endoMul = function(p) {
          return curve.point(p.x.redMul(curve.endo.beta), p.y);
        };
        pre.beta = beta;
        beta.precomputed = {
          beta: null,
          naf: pre.naf && {
            wnd: pre.naf.wnd,
            points: pre.naf.points.map(endoMul)
          },
          doubles: pre.doubles && {
            step: pre.doubles.step,
            points: pre.doubles.points.map(endoMul)
          }
        };
      }
      return beta;
    };
    Point.prototype.toJSON = function toJSON() {
      if (!this.precomputed) return [ this.x, this.y ];
      return [ this.x, this.y, this.precomputed && {
        doubles: this.precomputed.doubles && {
          step: this.precomputed.doubles.step,
          points: this.precomputed.doubles.points.slice(1)
        },
        naf: this.precomputed.naf && {
          wnd: this.precomputed.naf.wnd,
          points: this.precomputed.naf.points.slice(1)
        }
      } ];
    };
    Point.fromJSON = function fromJSON(curve, obj, red) {
      "string" === typeof obj && (obj = JSON.parse(obj));
      var res = curve.point(obj[0], obj[1], red);
      if (!obj[2]) return res;
      function obj2point(obj) {
        return curve.point(obj[0], obj[1], red);
      }
      var pre = obj[2];
      res.precomputed = {
        beta: null,
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: [ res ].concat(pre.doubles.points.map(obj2point))
        },
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: [ res ].concat(pre.naf.points.map(obj2point))
        }
      };
      return res;
    };
    Point.prototype.inspect = function inspect() {
      if (this.isInfinity()) return "<EC Point Infinity>";
      return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
    };
    Point.prototype.isInfinity = function isInfinity() {
      return this.inf;
    };
    Point.prototype.add = function add(p) {
      if (this.inf) return p;
      if (p.inf) return this;
      if (this.eq(p)) return this.dbl();
      if (this.neg().eq(p)) return this.curve.point(null, null);
      if (0 === this.x.cmp(p.x)) return this.curve.point(null, null);
      var c = this.y.redSub(p.y);
      0 !== c.cmpn(0) && (c = c.redMul(this.x.redSub(p.x).redInvm()));
      var nx = c.redSqr().redISub(this.x).redISub(p.x);
      var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
      return this.curve.point(nx, ny);
    };
    Point.prototype.dbl = function dbl() {
      if (this.inf) return this;
      var ys1 = this.y.redAdd(this.y);
      if (0 === ys1.cmpn(0)) return this.curve.point(null, null);
      var a = this.curve.a;
      var x2 = this.x.redSqr();
      var dyinv = ys1.redInvm();
      var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);
      var nx = c.redSqr().redISub(this.x.redAdd(this.x));
      var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
      return this.curve.point(nx, ny);
    };
    Point.prototype.getX = function getX() {
      return this.x.fromRed();
    };
    Point.prototype.getY = function getY() {
      return this.y.fromRed();
    };
    Point.prototype.mul = function mul(k) {
      k = new BN(k, 16);
      return this._hasDoubles(k) ? this.curve._fixedNafMul(this, k) : this.curve.endo ? this.curve._endoWnafMulAdd([ this ], [ k ]) : this.curve._wnafMul(this, k);
    };
    Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
      var points = [ this, p2 ];
      var coeffs = [ k1, k2 ];
      return this.curve.endo ? this.curve._endoWnafMulAdd(points, coeffs) : this.curve._wnafMulAdd(1, points, coeffs, 2);
    };
    Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
      var points = [ this, p2 ];
      var coeffs = [ k1, k2 ];
      return this.curve.endo ? this.curve._endoWnafMulAdd(points, coeffs, true) : this.curve._wnafMulAdd(1, points, coeffs, 2, true);
    };
    Point.prototype.eq = function eq(p) {
      return this === p || this.inf === p.inf && (this.inf || 0 === this.x.cmp(p.x) && 0 === this.y.cmp(p.y));
    };
    Point.prototype.neg = function neg(_precompute) {
      if (this.inf) return this;
      var res = this.curve.point(this.x, this.y.redNeg());
      if (_precompute && this.precomputed) {
        var pre = this.precomputed;
        var negate = function(p) {
          return p.neg();
        };
        res.precomputed = {
          naf: pre.naf && {
            wnd: pre.naf.wnd,
            points: pre.naf.points.map(negate)
          },
          doubles: pre.doubles && {
            step: pre.doubles.step,
            points: pre.doubles.points.map(negate)
          }
        };
      }
      return res;
    };
    Point.prototype.toJ = function toJ() {
      if (this.inf) return this.curve.jpoint(null, null, null);
      var res = this.curve.jpoint(this.x, this.y, this.curve.one);
      return res;
    };
    function JPoint(curve, x, y, z) {
      Base.BasePoint.call(this, curve, "jacobian");
      if (null === x && null === y && null === z) {
        this.x = this.curve.one;
        this.y = this.curve.one;
        this.z = new BN(0);
      } else {
        this.x = new BN(x, 16);
        this.y = new BN(y, 16);
        this.z = new BN(z, 16);
      }
      this.x.red || (this.x = this.x.toRed(this.curve.red));
      this.y.red || (this.y = this.y.toRed(this.curve.red));
      this.z.red || (this.z = this.z.toRed(this.curve.red));
      this.zOne = this.z === this.curve.one;
    }
    inherits(JPoint, Base.BasePoint);
    ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
      return new JPoint(this, x, y, z);
    };
    JPoint.prototype.toP = function toP() {
      if (this.isInfinity()) return this.curve.point(null, null);
      var zinv = this.z.redInvm();
      var zinv2 = zinv.redSqr();
      var ax = this.x.redMul(zinv2);
      var ay = this.y.redMul(zinv2).redMul(zinv);
      return this.curve.point(ax, ay);
    };
    JPoint.prototype.neg = function neg() {
      return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
    };
    JPoint.prototype.add = function add(p) {
      if (this.isInfinity()) return p;
      if (p.isInfinity()) return this;
      var pz2 = p.z.redSqr();
      var z2 = this.z.redSqr();
      var u1 = this.x.redMul(pz2);
      var u2 = p.x.redMul(z2);
      var s1 = this.y.redMul(pz2.redMul(p.z));
      var s2 = p.y.redMul(z2.redMul(this.z));
      var h = u1.redSub(u2);
      var r = s1.redSub(s2);
      if (0 === h.cmpn(0)) return 0 !== r.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
      var h2 = h.redSqr();
      var h3 = h2.redMul(h);
      var v = u1.redMul(h2);
      var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
      var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
      var nz = this.z.redMul(p.z).redMul(h);
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype.mixedAdd = function mixedAdd(p) {
      if (this.isInfinity()) return p.toJ();
      if (p.isInfinity()) return this;
      var z2 = this.z.redSqr();
      var u1 = this.x;
      var u2 = p.x.redMul(z2);
      var s1 = this.y;
      var s2 = p.y.redMul(z2).redMul(this.z);
      var h = u1.redSub(u2);
      var r = s1.redSub(s2);
      if (0 === h.cmpn(0)) return 0 !== r.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
      var h2 = h.redSqr();
      var h3 = h2.redMul(h);
      var v = u1.redMul(h2);
      var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
      var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
      var nz = this.z.redMul(h);
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype.dblp = function dblp(pow) {
      if (0 === pow) return this;
      if (this.isInfinity()) return this;
      if (!pow) return this.dbl();
      if (this.curve.zeroA || this.curve.threeA) {
        var r = this;
        for (var i = 0; i < pow; i++) r = r.dbl();
        return r;
      }
      var a = this.curve.a;
      var tinv = this.curve.tinv;
      var jx = this.x;
      var jy = this.y;
      var jz = this.z;
      var jz4 = jz.redSqr().redSqr();
      var jyd = jy.redAdd(jy);
      for (var i = 0; i < pow; i++) {
        var jx2 = jx.redSqr();
        var jyd2 = jyd.redSqr();
        var jyd4 = jyd2.redSqr();
        var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
        var t1 = jx.redMul(jyd2);
        var nx = c.redSqr().redISub(t1.redAdd(t1));
        var t2 = t1.redISub(nx);
        var dny = c.redMul(t2);
        dny = dny.redIAdd(dny).redISub(jyd4);
        var nz = jyd.redMul(jz);
        i + 1 < pow && (jz4 = jz4.redMul(jyd4));
        jx = nx;
        jz = nz;
        jyd = dny;
      }
      return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
    };
    JPoint.prototype.dbl = function dbl() {
      if (this.isInfinity()) return this;
      return this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
    };
    JPoint.prototype._zeroDbl = function _zeroDbl() {
      var nx;
      var ny;
      var nz;
      if (this.zOne) {
        var xx = this.x.redSqr();
        var yy = this.y.redSqr();
        var yyyy = yy.redSqr();
        var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        s = s.redIAdd(s);
        var m = xx.redAdd(xx).redIAdd(xx);
        var t = m.redSqr().redISub(s).redISub(s);
        var yyyy8 = yyyy.redIAdd(yyyy);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        nx = t;
        ny = m.redMul(s.redISub(t)).redISub(yyyy8);
        nz = this.y.redAdd(this.y);
      } else {
        var a = this.x.redSqr();
        var b = this.y.redSqr();
        var c = b.redSqr();
        var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
        d = d.redIAdd(d);
        var e = a.redAdd(a).redIAdd(a);
        var f = e.redSqr();
        var c8 = c.redIAdd(c);
        c8 = c8.redIAdd(c8);
        c8 = c8.redIAdd(c8);
        nx = f.redISub(d).redISub(d);
        ny = e.redMul(d.redISub(nx)).redISub(c8);
        nz = this.y.redMul(this.z);
        nz = nz.redIAdd(nz);
      }
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype._threeDbl = function _threeDbl() {
      var nx;
      var ny;
      var nz;
      if (this.zOne) {
        var xx = this.x.redSqr();
        var yy = this.y.redSqr();
        var yyyy = yy.redSqr();
        var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        s = s.redIAdd(s);
        var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
        var t = m.redSqr().redISub(s).redISub(s);
        nx = t;
        var yyyy8 = yyyy.redIAdd(yyyy);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        ny = m.redMul(s.redISub(t)).redISub(yyyy8);
        nz = this.y.redAdd(this.y);
      } else {
        var delta = this.z.redSqr();
        var gamma = this.y.redSqr();
        var beta = this.x.redMul(gamma);
        var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
        alpha = alpha.redAdd(alpha).redIAdd(alpha);
        var beta4 = beta.redIAdd(beta);
        beta4 = beta4.redIAdd(beta4);
        var beta8 = beta4.redAdd(beta4);
        nx = alpha.redSqr().redISub(beta8);
        nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
        var ggamma8 = gamma.redSqr();
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
      }
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype._dbl = function _dbl() {
      var a = this.curve.a;
      var jx = this.x;
      var jy = this.y;
      var jz = this.z;
      var jz4 = jz.redSqr().redSqr();
      var jx2 = jx.redSqr();
      var jy2 = jy.redSqr();
      var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
      var jxd4 = jx.redAdd(jx);
      jxd4 = jxd4.redIAdd(jxd4);
      var t1 = jxd4.redMul(jy2);
      var nx = c.redSqr().redISub(t1.redAdd(t1));
      var t2 = t1.redISub(nx);
      var jyd8 = jy2.redSqr();
      jyd8 = jyd8.redIAdd(jyd8);
      jyd8 = jyd8.redIAdd(jyd8);
      jyd8 = jyd8.redIAdd(jyd8);
      var ny = c.redMul(t2).redISub(jyd8);
      var nz = jy.redAdd(jy).redMul(jz);
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype.trpl = function trpl() {
      if (!this.curve.zeroA) return this.dbl().add(this);
      var xx = this.x.redSqr();
      var yy = this.y.redSqr();
      var zz = this.z.redSqr();
      var yyyy = yy.redSqr();
      var m = xx.redAdd(xx).redIAdd(xx);
      var mm = m.redSqr();
      var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      e = e.redIAdd(e);
      e = e.redAdd(e).redIAdd(e);
      e = e.redISub(mm);
      var ee = e.redSqr();
      var t = yyyy.redIAdd(yyyy);
      t = t.redIAdd(t);
      t = t.redIAdd(t);
      t = t.redIAdd(t);
      var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
      var yyu4 = yy.redMul(u);
      yyu4 = yyu4.redIAdd(yyu4);
      yyu4 = yyu4.redIAdd(yyu4);
      var nx = this.x.redMul(ee).redISub(yyu4);
      nx = nx.redIAdd(nx);
      nx = nx.redIAdd(nx);
      var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
      ny = ny.redIAdd(ny);
      ny = ny.redIAdd(ny);
      ny = ny.redIAdd(ny);
      var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype.mul = function mul(k, kbase) {
      k = new BN(k, kbase);
      return this.curve._wnafMul(this, k);
    };
    JPoint.prototype.eq = function eq(p) {
      if ("affine" === p.type) return this.eq(p.toJ());
      if (this === p) return true;
      var z2 = this.z.redSqr();
      var pz2 = p.z.redSqr();
      if (0 !== this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0)) return false;
      var z3 = z2.redMul(this.z);
      var pz3 = pz2.redMul(p.z);
      return 0 === this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0);
    };
    JPoint.prototype.eqXToP = function eqXToP(x) {
      var zs = this.z.redSqr();
      var rx = x.toRed(this.curve.red).redMul(zs);
      if (0 === this.x.cmp(rx)) return true;
      var xc = x.clone();
      var t = this.curve.redN.redMul(zs);
      for (;;) {
        xc.iadd(this.curve.n);
        if (xc.cmp(this.curve.p) >= 0) return false;
        rx.redIAdd(t);
        if (0 === this.x.cmp(rx)) return true;
      }
      return false;
    };
    JPoint.prototype.inspect = function inspect() {
      if (this.isInfinity()) return "<EC JPoint Infinity>";
      return "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
    };
    JPoint.prototype.isInfinity = function isInfinity() {
      return 0 === this.z.cmpn(0);
    };
  }, {
    "../../elliptic": 67,
    "../curve": 70,
    "bn.js": 16,
    inherits: 101
  } ],
  73: [ function(require, module, exports) {
    "use strict";
    var curves = exports;
    var hash = require("hash.js");
    var elliptic = require("../elliptic");
    var assert = elliptic.utils.assert;
    function PresetCurve(options) {
      "short" === options.type ? this.curve = new elliptic.curve.short(options) : "edwards" === options.type ? this.curve = new elliptic.curve.edwards(options) : this.curve = new elliptic.curve.mont(options);
      this.g = this.curve.g;
      this.n = this.curve.n;
      this.hash = options.hash;
      assert(this.g.validate(), "Invalid curve");
      assert(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }
    curves.PresetCurve = PresetCurve;
    function defineCurve(name, options) {
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        get: function() {
          var curve = new PresetCurve(options);
          Object.defineProperty(curves, name, {
            configurable: true,
            enumerable: true,
            value: curve
          });
          return curve;
        }
      });
    }
    defineCurve("p192", {
      type: "short",
      prime: "p192",
      p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
      b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
      n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
      hash: hash.sha256,
      gRed: false,
      g: [ "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811" ]
    });
    defineCurve("p224", {
      type: "short",
      prime: "p224",
      p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
      b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
      n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
      hash: hash.sha256,
      gRed: false,
      g: [ "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34" ]
    });
    defineCurve("p256", {
      type: "short",
      prime: null,
      p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
      a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
      b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
      n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
      hash: hash.sha256,
      gRed: false,
      g: [ "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5" ]
    });
    defineCurve("p384", {
      type: "short",
      prime: null,
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
      a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
      b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
      n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
      hash: hash.sha384,
      gRed: false,
      g: [ "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f" ]
    });
    defineCurve("p521", {
      type: "short",
      prime: null,
      p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
      a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
      b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
      n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
      hash: hash.sha512,
      gRed: false,
      g: [ "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650" ]
    });
    defineCurve("curve25519", {
      type: "mont",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "76d06",
      b: "1",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: hash.sha256,
      gRed: false,
      g: [ "9" ]
    });
    defineCurve("ed25519", {
      type: "edwards",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "-1",
      c: "1",
      d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: hash.sha256,
      gRed: false,
      g: [ "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658" ]
    });
    var pre;
    try {
      pre = require("./precomputed/secp256k1");
    } catch (e) {
      pre = void 0;
    }
    defineCurve("secp256k1", {
      type: "short",
      prime: "k256",
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
      a: "0",
      b: "7",
      n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
      h: "1",
      hash: hash.sha256,
      beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
      lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
      basis: [ {
        a: "3086d221a7d46bcde86c90e49284eb15",
        b: "-e4437ed6010e88286f547fa90abfe4c3"
      }, {
        a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
        b: "3086d221a7d46bcde86c90e49284eb15"
      } ],
      gRed: false,
      g: [ "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", pre ]
    });
  }, {
    "../elliptic": 67,
    "./precomputed/secp256k1": 80,
    "hash.js": 86
  } ],
  74: [ function(require, module, exports) {
    "use strict";
    var BN = require("bn.js");
    var HmacDRBG = require("hmac-drbg");
    var elliptic = require("../../elliptic");
    var utils = elliptic.utils;
    var assert = utils.assert;
    var KeyPair = require("./key");
    var Signature = require("./signature");
    function EC(options) {
      if (!(this instanceof EC)) return new EC(options);
      if ("string" === typeof options) {
        assert(elliptic.curves.hasOwnProperty(options), "Unknown curve " + options);
        options = elliptic.curves[options];
      }
      options instanceof elliptic.curves.PresetCurve && (options = {
        curve: options
      });
      this.curve = options.curve.curve;
      this.n = this.curve.n;
      this.nh = this.n.ushrn(1);
      this.g = this.curve.g;
      this.g = options.curve.g;
      this.g.precompute(options.curve.n.bitLength() + 1);
      this.hash = options.hash || options.curve.hash;
    }
    module.exports = EC;
    EC.prototype.keyPair = function keyPair(options) {
      return new KeyPair(this, options);
    };
    EC.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
      return KeyPair.fromPrivate(this, priv, enc);
    };
    EC.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
      return KeyPair.fromPublic(this, pub, enc);
    };
    EC.prototype.genKeyPair = function genKeyPair(options) {
      options || (options = {});
      var drbg = new HmacDRBG({
        hash: this.hash,
        pers: options.pers,
        persEnc: options.persEnc || "utf8",
        entropy: options.entropy || elliptic.rand(this.hash.hmacStrength),
        entropyEnc: options.entropy && options.entropyEnc || "utf8",
        nonce: this.n.toArray()
      });
      var bytes = this.n.byteLength();
      var ns2 = this.n.sub(new BN(2));
      do {
        var priv = new BN(drbg.generate(bytes));
        if (priv.cmp(ns2) > 0) continue;
        priv.iaddn(1);
        return this.keyFromPrivate(priv);
      } while (true);
    };
    EC.prototype._truncateToN = function truncateToN(msg, truncOnly) {
      var delta = 8 * msg.byteLength() - this.n.bitLength();
      delta > 0 && (msg = msg.ushrn(delta));
      return !truncOnly && msg.cmp(this.n) >= 0 ? msg.sub(this.n) : msg;
    };
    EC.prototype.sign = function sign(msg, key, enc, options) {
      if ("object" === typeof enc) {
        options = enc;
        enc = null;
      }
      options || (options = {});
      key = this.keyFromPrivate(key, enc);
      msg = this._truncateToN(new BN(msg, 16));
      var bytes = this.n.byteLength();
      var bkey = key.getPrivate().toArray("be", bytes);
      var nonce = msg.toArray("be", bytes);
      var drbg = new HmacDRBG({
        hash: this.hash,
        entropy: bkey,
        nonce: nonce,
        pers: options.pers,
        persEnc: options.persEnc || "utf8"
      });
      var ns1 = this.n.sub(new BN(1));
      for (var iter = 0; true; iter++) {
        var k = options.k ? options.k(iter) : new BN(drbg.generate(this.n.byteLength()));
        k = this._truncateToN(k, true);
        if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0) continue;
        var kp = this.g.mul(k);
        if (kp.isInfinity()) continue;
        var kpX = kp.getX();
        var r = kpX.umod(this.n);
        if (0 === r.cmpn(0)) continue;
        var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
        s = s.umod(this.n);
        if (0 === s.cmpn(0)) continue;
        var recoveryParam = (kp.getY().isOdd() ? 1 : 0) | (0 !== kpX.cmp(r) ? 2 : 0);
        if (options.canonical && s.cmp(this.nh) > 0) {
          s = this.n.sub(s);
          recoveryParam ^= 1;
        }
        return new Signature({
          r: r,
          s: s,
          recoveryParam: recoveryParam
        });
      }
    };
    EC.prototype.verify = function verify(msg, signature, key, enc) {
      msg = this._truncateToN(new BN(msg, 16));
      key = this.keyFromPublic(key, enc);
      signature = new Signature(signature, "hex");
      var r = signature.r;
      var s = signature.s;
      if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0) return false;
      if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return false;
      var sinv = s.invm(this.n);
      var u1 = sinv.mul(msg).umod(this.n);
      var u2 = sinv.mul(r).umod(this.n);
      if (!this.curve._maxwellTrick) {
        var p = this.g.mulAdd(u1, key.getPublic(), u2);
        if (p.isInfinity()) return false;
        return 0 === p.getX().umod(this.n).cmp(r);
      }
      var p = this.g.jmulAdd(u1, key.getPublic(), u2);
      if (p.isInfinity()) return false;
      return p.eqXToP(r);
    };
    EC.prototype.recoverPubKey = function(msg, signature, j, enc) {
      assert((3 & j) === j, "The recovery param is more than two bits");
      signature = new Signature(signature, enc);
      var n = this.n;
      var e = new BN(msg);
      var r = signature.r;
      var s = signature.s;
      var isYOdd = 1 & j;
      var isSecondKey = j >> 1;
      if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey) throw new Error("Unable to find sencond key candinate");
      r = isSecondKey ? this.curve.pointFromX(r.add(this.curve.n), isYOdd) : this.curve.pointFromX(r, isYOdd);
      var rInv = signature.r.invm(n);
      var s1 = n.sub(e).mul(rInv).umod(n);
      var s2 = s.mul(rInv).umod(n);
      return this.g.mulAdd(s1, r, s2);
    };
    EC.prototype.getKeyRecoveryParam = function(e, signature, Q, enc) {
      signature = new Signature(signature, enc);
      if (null !== signature.recoveryParam) return signature.recoveryParam;
      for (var i = 0; i < 4; i++) {
        var Qprime;
        try {
          Qprime = this.recoverPubKey(e, signature, i);
        } catch (e) {
          continue;
        }
        if (Qprime.eq(Q)) return i;
      }
      throw new Error("Unable to find valid recovery factor");
    };
  }, {
    "../../elliptic": 67,
    "./key": 75,
    "./signature": 76,
    "bn.js": 16,
    "hmac-drbg": 98
  } ],
  75: [ function(require, module, exports) {
    "use strict";
    var BN = require("bn.js");
    var elliptic = require("../../elliptic");
    var utils = elliptic.utils;
    var assert = utils.assert;
    function KeyPair(ec, options) {
      this.ec = ec;
      this.priv = null;
      this.pub = null;
      options.priv && this._importPrivate(options.priv, options.privEnc);
      options.pub && this._importPublic(options.pub, options.pubEnc);
    }
    module.exports = KeyPair;
    KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
      if (pub instanceof KeyPair) return pub;
      return new KeyPair(ec, {
        pub: pub,
        pubEnc: enc
      });
    };
    KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
      if (priv instanceof KeyPair) return priv;
      return new KeyPair(ec, {
        priv: priv,
        privEnc: enc
      });
    };
    KeyPair.prototype.validate = function validate() {
      var pub = this.getPublic();
      if (pub.isInfinity()) return {
        result: false,
        reason: "Invalid public key"
      };
      if (!pub.validate()) return {
        result: false,
        reason: "Public key is not a point"
      };
      if (!pub.mul(this.ec.curve.n).isInfinity()) return {
        result: false,
        reason: "Public key * N != O"
      };
      return {
        result: true,
        reason: null
      };
    };
    KeyPair.prototype.getPublic = function getPublic(compact, enc) {
      if ("string" === typeof compact) {
        enc = compact;
        compact = null;
      }
      this.pub || (this.pub = this.ec.g.mul(this.priv));
      if (!enc) return this.pub;
      return this.pub.encode(enc, compact);
    };
    KeyPair.prototype.getPrivate = function getPrivate(enc) {
      return "hex" === enc ? this.priv.toString(16, 2) : this.priv;
    };
    KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
      this.priv = new BN(key, enc || 16);
      this.priv = this.priv.umod(this.ec.curve.n);
    };
    KeyPair.prototype._importPublic = function _importPublic(key, enc) {
      if (key.x || key.y) {
        "mont" === this.ec.curve.type ? assert(key.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || assert(key.x && key.y, "Need both x and y coordinate");
        this.pub = this.ec.curve.point(key.x, key.y);
        return;
      }
      this.pub = this.ec.curve.decodePoint(key, enc);
    };
    KeyPair.prototype.derive = function derive(pub) {
      return pub.mul(this.priv).getX();
    };
    KeyPair.prototype.sign = function sign(msg, enc, options) {
      return this.ec.sign(msg, this, enc, options);
    };
    KeyPair.prototype.verify = function verify(msg, signature) {
      return this.ec.verify(msg, signature, this);
    };
    KeyPair.prototype.inspect = function inspect() {
      return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
    };
  }, {
    "../../elliptic": 67,
    "bn.js": 16
  } ],
  76: [ function(require, module, exports) {
    "use strict";
    var BN = require("bn.js");
    var elliptic = require("../../elliptic");
    var utils = elliptic.utils;
    var assert = utils.assert;
    function Signature(options, enc) {
      if (options instanceof Signature) return options;
      if (this._importDER(options, enc)) return;
      assert(options.r && options.s, "Signature without r or s");
      this.r = new BN(options.r, 16);
      this.s = new BN(options.s, 16);
      void 0 === options.recoveryParam ? this.recoveryParam = null : this.recoveryParam = options.recoveryParam;
    }
    module.exports = Signature;
    function Position() {
      this.place = 0;
    }
    function getLength(buf, p) {
      var initial = buf[p.place++];
      if (!(128 & initial)) return initial;
      var octetLen = 15 & initial;
      var val = 0;
      for (var i = 0, off = p.place; i < octetLen; i++, off++) {
        val <<= 8;
        val |= buf[off];
      }
      p.place = off;
      return val;
    }
    function rmPadding(buf) {
      var i = 0;
      var len = buf.length - 1;
      while (!buf[i] && !(128 & buf[i + 1]) && i < len) i++;
      if (0 === i) return buf;
      return buf.slice(i);
    }
    Signature.prototype._importDER = function _importDER(data, enc) {
      data = utils.toArray(data, enc);
      var p = new Position();
      if (48 !== data[p.place++]) return false;
      var len = getLength(data, p);
      if (len + p.place !== data.length) return false;
      if (2 !== data[p.place++]) return false;
      var rlen = getLength(data, p);
      var r = data.slice(p.place, rlen + p.place);
      p.place += rlen;
      if (2 !== data[p.place++]) return false;
      var slen = getLength(data, p);
      if (data.length !== slen + p.place) return false;
      var s = data.slice(p.place, slen + p.place);
      0 === r[0] && 128 & r[1] && (r = r.slice(1));
      0 === s[0] && 128 & s[1] && (s = s.slice(1));
      this.r = new BN(r);
      this.s = new BN(s);
      this.recoveryParam = null;
      return true;
    };
    function constructLength(arr, len) {
      if (len < 128) {
        arr.push(len);
        return;
      }
      var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
      arr.push(128 | octets);
      while (--octets) arr.push(len >>> (octets << 3) & 255);
      arr.push(len);
    }
    Signature.prototype.toDER = function toDER(enc) {
      var r = this.r.toArray();
      var s = this.s.toArray();
      128 & r[0] && (r = [ 0 ].concat(r));
      128 & s[0] && (s = [ 0 ].concat(s));
      r = rmPadding(r);
      s = rmPadding(s);
      while (!s[0] && !(128 & s[1])) s = s.slice(1);
      var arr = [ 2 ];
      constructLength(arr, r.length);
      arr = arr.concat(r);
      arr.push(2);
      constructLength(arr, s.length);
      var backHalf = arr.concat(s);
      var res = [ 48 ];
      constructLength(res, backHalf.length);
      res = res.concat(backHalf);
      return utils.encode(res, enc);
    };
  }, {
    "../../elliptic": 67,
    "bn.js": 16
  } ],
  77: [ function(require, module, exports) {
    "use strict";
    var hash = require("hash.js");
    var elliptic = require("../../elliptic");
    var utils = elliptic.utils;
    var assert = utils.assert;
    var parseBytes = utils.parseBytes;
    var KeyPair = require("./key");
    var Signature = require("./signature");
    function EDDSA(curve) {
      assert("ed25519" === curve, "only tested with ed25519 so far");
      if (!(this instanceof EDDSA)) return new EDDSA(curve);
      var curve = elliptic.curves[curve].curve;
      this.curve = curve;
      this.g = curve.g;
      this.g.precompute(curve.n.bitLength() + 1);
      this.pointClass = curve.point().constructor;
      this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
      this.hash = hash.sha512;
    }
    module.exports = EDDSA;
    EDDSA.prototype.sign = function sign(message, secret) {
      message = parseBytes(message);
      var key = this.keyFromSecret(secret);
      var r = this.hashInt(key.messagePrefix(), message);
      var R = this.g.mul(r);
      var Rencoded = this.encodePoint(R);
      var s_ = this.hashInt(Rencoded, key.pubBytes(), message).mul(key.priv());
      var S = r.add(s_).umod(this.curve.n);
      return this.makeSignature({
        R: R,
        S: S,
        Rencoded: Rencoded
      });
    };
    EDDSA.prototype.verify = function verify(message, sig, pub) {
      message = parseBytes(message);
      sig = this.makeSignature(sig);
      var key = this.keyFromPublic(pub);
      var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
      var SG = this.g.mul(sig.S());
      var RplusAh = sig.R().add(key.pub().mul(h));
      return RplusAh.eq(SG);
    };
    EDDSA.prototype.hashInt = function hashInt() {
      var hash = this.hash();
      for (var i = 0; i < arguments.length; i++) hash.update(arguments[i]);
      return utils.intFromLE(hash.digest()).umod(this.curve.n);
    };
    EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
      return KeyPair.fromPublic(this, pub);
    };
    EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
      return KeyPair.fromSecret(this, secret);
    };
    EDDSA.prototype.makeSignature = function makeSignature(sig) {
      if (sig instanceof Signature) return sig;
      return new Signature(this, sig);
    };
    EDDSA.prototype.encodePoint = function encodePoint(point) {
      var enc = point.getY().toArray("le", this.encodingLength);
      enc[this.encodingLength - 1] |= point.getX().isOdd() ? 128 : 0;
      return enc;
    };
    EDDSA.prototype.decodePoint = function decodePoint(bytes) {
      bytes = utils.parseBytes(bytes);
      var lastIx = bytes.length - 1;
      var normed = bytes.slice(0, lastIx).concat(-129 & bytes[lastIx]);
      var xIsOdd = 0 !== (128 & bytes[lastIx]);
      var y = utils.intFromLE(normed);
      return this.curve.pointFromY(y, xIsOdd);
    };
    EDDSA.prototype.encodeInt = function encodeInt(num) {
      return num.toArray("le", this.encodingLength);
    };
    EDDSA.prototype.decodeInt = function decodeInt(bytes) {
      return utils.intFromLE(bytes);
    };
    EDDSA.prototype.isPoint = function isPoint(val) {
      return val instanceof this.pointClass;
    };
  }, {
    "../../elliptic": 67,
    "./key": 78,
    "./signature": 79,
    "hash.js": 86
  } ],
  78: [ function(require, module, exports) {
    "use strict";
    var elliptic = require("../../elliptic");
    var utils = elliptic.utils;
    var assert = utils.assert;
    var parseBytes = utils.parseBytes;
    var cachedProperty = utils.cachedProperty;
    function KeyPair(eddsa, params) {
      this.eddsa = eddsa;
      this._secret = parseBytes(params.secret);
      eddsa.isPoint(params.pub) ? this._pub = params.pub : this._pubBytes = parseBytes(params.pub);
    }
    KeyPair.fromPublic = function fromPublic(eddsa, pub) {
      if (pub instanceof KeyPair) return pub;
      return new KeyPair(eddsa, {
        pub: pub
      });
    };
    KeyPair.fromSecret = function fromSecret(eddsa, secret) {
      if (secret instanceof KeyPair) return secret;
      return new KeyPair(eddsa, {
        secret: secret
      });
    };
    KeyPair.prototype.secret = function secret() {
      return this._secret;
    };
    cachedProperty(KeyPair, "pubBytes", function pubBytes() {
      return this.eddsa.encodePoint(this.pub());
    });
    cachedProperty(KeyPair, "pub", function pub() {
      if (this._pubBytes) return this.eddsa.decodePoint(this._pubBytes);
      return this.eddsa.g.mul(this.priv());
    });
    cachedProperty(KeyPair, "privBytes", function privBytes() {
      var eddsa = this.eddsa;
      var hash = this.hash();
      var lastIx = eddsa.encodingLength - 1;
      var a = hash.slice(0, eddsa.encodingLength);
      a[0] &= 248;
      a[lastIx] &= 127;
      a[lastIx] |= 64;
      return a;
    });
    cachedProperty(KeyPair, "priv", function priv() {
      return this.eddsa.decodeInt(this.privBytes());
    });
    cachedProperty(KeyPair, "hash", function hash() {
      return this.eddsa.hash().update(this.secret()).digest();
    });
    cachedProperty(KeyPair, "messagePrefix", function messagePrefix() {
      return this.hash().slice(this.eddsa.encodingLength);
    });
    KeyPair.prototype.sign = function sign(message) {
      assert(this._secret, "KeyPair can only verify");
      return this.eddsa.sign(message, this);
    };
    KeyPair.prototype.verify = function verify(message, sig) {
      return this.eddsa.verify(message, sig, this);
    };
    KeyPair.prototype.getSecret = function getSecret(enc) {
      assert(this._secret, "KeyPair is public only");
      return utils.encode(this.secret(), enc);
    };
    KeyPair.prototype.getPublic = function getPublic(enc) {
      return utils.encode(this.pubBytes(), enc);
    };
    module.exports = KeyPair;
  }, {
    "../../elliptic": 67
  } ],
  79: [ function(require, module, exports) {
    "use strict";
    var BN = require("bn.js");
    var elliptic = require("../../elliptic");
    var utils = elliptic.utils;
    var assert = utils.assert;
    var cachedProperty = utils.cachedProperty;
    var parseBytes = utils.parseBytes;
    function Signature(eddsa, sig) {
      this.eddsa = eddsa;
      "object" !== typeof sig && (sig = parseBytes(sig));
      Array.isArray(sig) && (sig = {
        R: sig.slice(0, eddsa.encodingLength),
        S: sig.slice(eddsa.encodingLength)
      });
      assert(sig.R && sig.S, "Signature without R or S");
      eddsa.isPoint(sig.R) && (this._R = sig.R);
      sig.S instanceof BN && (this._S = sig.S);
      this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
      this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
    }
    cachedProperty(Signature, "S", function S() {
      return this.eddsa.decodeInt(this.Sencoded());
    });
    cachedProperty(Signature, "R", function R() {
      return this.eddsa.decodePoint(this.Rencoded());
    });
    cachedProperty(Signature, "Rencoded", function Rencoded() {
      return this.eddsa.encodePoint(this.R());
    });
    cachedProperty(Signature, "Sencoded", function Sencoded() {
      return this.eddsa.encodeInt(this.S());
    });
    Signature.prototype.toBytes = function toBytes() {
      return this.Rencoded().concat(this.Sencoded());
    };
    Signature.prototype.toHex = function toHex() {
      return utils.encode(this.toBytes(), "hex").toUpperCase();
    };
    module.exports = Signature;
  }, {
    "../../elliptic": 67,
    "bn.js": 16
  } ],
  80: [ function(require, module, exports) {
    module.exports = {
      doubles: {
        step: 4,
        points: [ [ "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821" ], [ "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf" ], [ "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695" ], [ "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9" ], [ "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36" ], [ "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f" ], [ "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999" ], [ "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09" ], [ "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d" ], [ "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088" ], [ "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d" ], [ "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8" ], [ "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a" ], [ "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453" ], [ "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160" ], [ "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0" ], [ "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6" ], [ "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589" ], [ "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17" ], [ "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda" ], [ "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd" ], [ "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2" ], [ "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6" ], [ "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f" ], [ "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01" ], [ "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3" ], [ "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f" ], [ "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7" ], [ "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78" ], [ "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1" ], [ "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150" ], [ "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82" ], [ "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc" ], [ "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b" ], [ "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51" ], [ "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45" ], [ "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120" ], [ "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84" ], [ "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d" ], [ "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d" ], [ "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8" ], [ "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8" ], [ "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac" ], [ "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f" ], [ "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962" ], [ "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907" ], [ "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec" ], [ "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d" ], [ "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414" ], [ "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd" ], [ "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0" ], [ "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811" ], [ "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1" ], [ "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c" ], [ "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73" ], [ "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd" ], [ "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405" ], [ "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589" ], [ "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e" ], [ "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27" ], [ "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1" ], [ "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482" ], [ "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945" ], [ "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573" ], [ "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82" ] ]
      },
      naf: {
        wnd: 7,
        points: [ [ "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672" ], [ "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6" ], [ "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da" ], [ "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37" ], [ "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b" ], [ "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81" ], [ "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58" ], [ "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77" ], [ "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a" ], [ "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c" ], [ "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67" ], [ "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402" ], [ "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55" ], [ "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482" ], [ "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82" ], [ "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396" ], [ "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49" ], [ "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf" ], [ "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a" ], [ "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7" ], [ "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933" ], [ "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a" ], [ "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6" ], [ "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37" ], [ "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e" ], [ "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6" ], [ "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476" ], [ "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40" ], [ "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61" ], [ "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683" ], [ "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5" ], [ "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b" ], [ "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417" ], [ "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868" ], [ "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a" ], [ "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6" ], [ "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996" ], [ "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e" ], [ "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d" ], [ "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2" ], [ "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e" ], [ "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437" ], [ "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311" ], [ "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4" ], [ "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575" ], [ "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d" ], [ "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d" ], [ "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629" ], [ "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06" ], [ "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374" ], [ "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee" ], [ "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1" ], [ "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b" ], [ "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661" ], [ "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6" ], [ "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e" ], [ "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d" ], [ "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc" ], [ "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4" ], [ "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c" ], [ "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b" ], [ "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913" ], [ "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154" ], [ "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865" ], [ "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc" ], [ "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224" ], [ "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e" ], [ "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6" ], [ "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511" ], [ "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b" ], [ "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2" ], [ "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c" ], [ "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3" ], [ "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d" ], [ "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700" ], [ "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4" ], [ "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196" ], [ "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4" ], [ "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257" ], [ "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13" ], [ "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096" ], [ "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38" ], [ "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f" ], [ "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448" ], [ "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a" ], [ "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4" ], [ "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437" ], [ "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7" ], [ "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d" ], [ "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a" ], [ "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54" ], [ "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77" ], [ "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517" ], [ "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10" ], [ "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125" ], [ "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e" ], [ "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1" ], [ "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2" ], [ "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423" ], [ "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8" ], [ "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758" ], [ "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375" ], [ "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d" ], [ "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec" ], [ "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0" ], [ "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c" ], [ "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4" ], [ "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f" ], [ "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649" ], [ "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826" ], [ "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5" ], [ "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87" ], [ "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b" ], [ "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc" ], [ "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c" ], [ "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f" ], [ "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a" ], [ "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46" ], [ "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f" ], [ "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03" ], [ "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08" ], [ "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8" ], [ "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373" ], [ "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3" ], [ "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8" ], [ "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1" ], [ "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9" ] ]
      }
    };
  }, {} ],
  81: [ function(require, module, exports) {
    "use strict";
    var utils = exports;
    var BN = require("bn.js");
    var minAssert = require("minimalistic-assert");
    var minUtils = require("minimalistic-crypto-utils");
    utils.assert = minAssert;
    utils.toArray = minUtils.toArray;
    utils.zero2 = minUtils.zero2;
    utils.toHex = minUtils.toHex;
    utils.encode = minUtils.encode;
    function getNAF(num, w) {
      var naf = [];
      var ws = 1 << w + 1;
      var k = num.clone();
      while (k.cmpn(1) >= 0) {
        var z;
        if (k.isOdd()) {
          var mod = k.andln(ws - 1);
          z = mod > (ws >> 1) - 1 ? (ws >> 1) - mod : mod;
          k.isubn(z);
        } else z = 0;
        naf.push(z);
        var shift = 0 !== k.cmpn(0) && 0 === k.andln(ws - 1) ? w + 1 : 1;
        for (var i = 1; i < shift; i++) naf.push(0);
        k.iushrn(shift);
      }
      return naf;
    }
    utils.getNAF = getNAF;
    function getJSF(k1, k2) {
      var jsf = [ [], [] ];
      k1 = k1.clone();
      k2 = k2.clone();
      var d1 = 0;
      var d2 = 0;
      while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
        var m14 = k1.andln(3) + d1 & 3;
        var m24 = k2.andln(3) + d2 & 3;
        3 === m14 && (m14 = -1);
        3 === m24 && (m24 = -1);
        var u1;
        if (0 === (1 & m14)) u1 = 0; else {
          var m8 = k1.andln(7) + d1 & 7;
          u1 = 3 !== m8 && 5 !== m8 || 2 !== m24 ? m14 : -m14;
        }
        jsf[0].push(u1);
        var u2;
        if (0 === (1 & m24)) u2 = 0; else {
          var m8 = k2.andln(7) + d2 & 7;
          u2 = 3 !== m8 && 5 !== m8 || 2 !== m14 ? m24 : -m24;
        }
        jsf[1].push(u2);
        2 * d1 === u1 + 1 && (d1 = 1 - d1);
        2 * d2 === u2 + 1 && (d2 = 1 - d2);
        k1.iushrn(1);
        k2.iushrn(1);
      }
      return jsf;
    }
    utils.getJSF = getJSF;
    function cachedProperty(obj, name, computer) {
      var key = "_" + name;
      obj.prototype[name] = function cachedProperty() {
        return void 0 !== this[key] ? this[key] : this[key] = computer.call(this);
      };
    }
    utils.cachedProperty = cachedProperty;
    function parseBytes(bytes) {
      return "string" === typeof bytes ? utils.toArray(bytes, "hex") : bytes;
    }
    utils.parseBytes = parseBytes;
    function intFromLE(bytes) {
      return new BN(bytes, "hex", "le");
    }
    utils.intFromLE = intFromLE;
  }, {
    "bn.js": 16,
    "minimalistic-assert": 105,
    "minimalistic-crypto-utils": 106
  } ],
  82: [ function(require, module, exports) {
    module.exports = {
      _args: [ [ {
        raw: "elliptic@^6.0.0",
        scope: null,
        escapedName: "elliptic",
        name: "elliptic",
        rawSpec: "^6.0.0",
        spec: ">=6.0.0 <7.0.0",
        type: "range"
      }, "/Users/nantas/fireball-x/fireball_1.9-release/dist/CocosCreator.app/Contents/Resources/app/node_modules/browserify-sign" ] ],
      _cnpm_publish_time: 1487798867116,
      _from: "elliptic@^6.0.0",
      _hasShrinkwrap: false,
      _id: "elliptic@6.4.0",
      _location: "/elliptic",
      _nodeVersion: "7.0.0",
      _npmOperationalInternal: {
        host: "packages-18-east.internal.npmjs.com",
        tmp: "tmp/elliptic-6.4.0.tgz_1487798866428_0.30510620190761983"
      },
      _npmUser: {
        name: "indutny",
        email: "fedor@indutny.com"
      },
      _npmVersion: "3.10.8",
      _phantomChildren: {},
      _requested: {
        raw: "elliptic@^6.0.0",
        scope: null,
        escapedName: "elliptic",
        name: "elliptic",
        rawSpec: "^6.0.0",
        spec: ">=6.0.0 <7.0.0",
        type: "range"
      },
      _requiredBy: [ "/browserify-sign", "/create-ecdh" ],
      _resolved: "http://registry.npm.taobao.org/elliptic/download/elliptic-6.4.0.tgz",
      _shasum: "cac9af8762c85836187003c8dfe193e5e2eae5df",
      _shrinkwrap: null,
      _spec: "elliptic@^6.0.0",
      _where: "/Users/nantas/fireball-x/fireball_1.9-release/dist/CocosCreator.app/Contents/Resources/app/node_modules/browserify-sign",
      author: {
        name: "Fedor Indutny",
        email: "fedor@indutny.com"
      },
      bugs: {
        url: "https://github.com/indutny/elliptic/issues"
      },
      dependencies: {
        "bn.js": "^4.4.0",
        brorand: "^1.0.1",
        "hash.js": "^1.0.0",
        "hmac-drbg": "^1.0.0",
        inherits: "^2.0.1",
        "minimalistic-assert": "^1.0.0",
        "minimalistic-crypto-utils": "^1.0.0"
      },
      description: "EC cryptography",
      devDependencies: {
        brfs: "^1.4.3",
        coveralls: "^2.11.3",
        grunt: "^0.4.5",
        "grunt-browserify": "^5.0.0",
        "grunt-cli": "^1.2.0",
        "grunt-contrib-connect": "^1.0.0",
        "grunt-contrib-copy": "^1.0.0",
        "grunt-contrib-uglify": "^1.0.1",
        "grunt-mocha-istanbul": "^3.0.1",
        "grunt-saucelabs": "^8.6.2",
        istanbul: "^0.4.2",
        jscs: "^2.9.0",
        jshint: "^2.6.0",
        mocha: "^2.1.0"
      },
      directories: {},
      dist: {
        shasum: "cac9af8762c85836187003c8dfe193e5e2eae5df",
        size: 41164,
        noattachment: false,
        tarball: "http://registry.npm.taobao.org/elliptic/download/elliptic-6.4.0.tgz"
      },
      files: [ "lib" ],
      gitHead: "6b0d2b76caae91471649c8e21f0b1d3ba0f96090",
      homepage: "https://github.com/indutny/elliptic",
      keywords: [ "EC", "Elliptic", "curve", "Cryptography" ],
      license: "MIT",
      main: "lib/elliptic.js",
      maintainers: [ {
        name: "indutny",
        email: "fedor@indutny.com"
      } ],
      name: "elliptic",
      optionalDependencies: {},
      publish_time: 1487798867116,
      readme: "# Elliptic [![Build Status](https://secure.travis-ci.org/indutny/elliptic.png)](http://travis-ci.org/indutny/elliptic) [![Coverage Status](https://coveralls.io/repos/indutny/elliptic/badge.svg?branch=master&service=github)](https://coveralls.io/github/indutny/elliptic?branch=master) [![Code Climate](https://codeclimate.com/github/indutny/elliptic/badges/gpa.svg)](https://codeclimate.com/github/indutny/elliptic)\n\n[![Saucelabs Test Status](https://saucelabs.com/browser-matrix/gh-indutny-elliptic.svg)](https://saucelabs.com/u/gh-indutny-elliptic)\n\nFast elliptic-curve cryptography in a plain javascript implementation.\n\nNOTE: Please take a look at http://safecurves.cr.yp.to/ before choosing a curve\nfor your cryptography operations.\n\n## Incentive\n\nECC is much slower than regular RSA cryptography, the JS implementations are\neven more slower.\n\n## Benchmarks\n\n```bash\n$ node benchmarks/index.js\nBenchmarking: sign\nelliptic#sign x 262 ops/sec ±0.51% (177 runs sampled)\neccjs#sign x 55.91 ops/sec ±0.90% (144 runs sampled)\n------------------------\nFastest is elliptic#sign\n========================\nBenchmarking: verify\nelliptic#verify x 113 ops/sec ±0.50% (166 runs sampled)\neccjs#verify x 48.56 ops/sec ±0.36% (125 runs sampled)\n------------------------\nFastest is elliptic#verify\n========================\nBenchmarking: gen\nelliptic#gen x 294 ops/sec ±0.43% (176 runs sampled)\neccjs#gen x 62.25 ops/sec ±0.63% (129 runs sampled)\n------------------------\nFastest is elliptic#gen\n========================\nBenchmarking: ecdh\nelliptic#ecdh x 136 ops/sec ±0.85% (156 runs sampled)\n------------------------\nFastest is elliptic#ecdh\n========================\n```\n\n## API\n\n### ECDSA\n\n```javascript\nvar EC = require('elliptic').ec;\n\n// Create and initialize EC context\n// (better do it once and reuse it)\nvar ec = new EC('secp256k1');\n\n// Generate keys\nvar key = ec.genKeyPair();\n\n// Sign message (must be an array, or it'll be treated as a hex sequence)\nvar msg = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];\nvar signature = key.sign(msg);\n\n// Export DER encoded signature in Array\nvar derSign = signature.toDER();\n\n// Verify signature\nconsole.log(key.verify(msg, derSign));\n\n// CHECK WITH NO PRIVATE KEY\n\n// Public key as '04 + x + y'\nvar pub = '04bb1fa3...';\n\n// Signature MUST be either:\n// 1) hex-string of DER-encoded signature; or\n// 2) DER-encoded signature as buffer; or\n// 3) object with two hex-string properties (r and s)\n\nvar signature = 'b102ac...'; // case 1\nvar signature = new Buffer('...'); // case 2\nvar signature = { r: 'b1fc...', s: '9c42...' }; // case 3\n\n// Import public key\nvar key = ec.keyFromPublic(pub, 'hex');\n\n// Verify signature\nconsole.log(key.verify(msg, signature));\n```\n\n### EdDSA\n\n```javascript\nvar EdDSA = require('elliptic').eddsa;\n\n// Create and initialize EdDSA context\n// (better do it once and reuse it)\nvar ec = new EdDSA('ed25519');\n\n// Create key pair from secret\nvar key = ec.keyFromSecret('693e3c...'); // hex string, array or Buffer\n\n// Sign message (must be an array, or it'll be treated as a hex sequence)\nvar msg = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];\nvar signature = key.sign(msg).toHex();\n\n// Verify signature\nconsole.log(key.verify(msg, signature));\n\n// CHECK WITH NO PRIVATE KEY\n\n// Import public key\nvar pub = '0a1af638...';\nvar key = ec.keyFromPublic(pub, 'hex');\n\n// Verify signature\nvar signature = '70bed1...';\nconsole.log(key.verify(msg, signature));\n```\n\n### ECDH\n\n```javascript\nvar EC = require('elliptic').ec;\nvar ec = new EC('curve25519');\n\n// Generate keys\nvar key1 = ec.genKeyPair();\nvar key2 = ec.genKeyPair();\n\nvar shared1 = key1.derive(key2.getPublic());\nvar shared2 = key2.derive(key1.getPublic());\n\nconsole.log('Both shared secrets are BN instances');\nconsole.log(shared1.toString(16));\nconsole.log(shared2.toString(16));\n```\n\nthree and more members:\n```javascript\nvar EC = require('elliptic').ec;\nvar ec = new EC('curve25519');\n\nvar A = ec.genKeyPair();\nvar B = ec.genKeyPair();\nvar C = ec.genKeyPair();\n\nvar AB = A.getPublic().mul(B.getPrivate())\nvar BC = B.getPublic().mul(C.getPrivate())\nvar CA = C.getPublic().mul(A.getPrivate())\n\nvar ABC = AB.mul(C.getPrivate())\nvar BCA = BC.mul(A.getPrivate())\nvar CAB = CA.mul(B.getPrivate())\n\nconsole.log(ABC.getX().toString(16))\nconsole.log(BCA.getX().toString(16))\nconsole.log(CAB.getX().toString(16))\n```\n\nNOTE: `.derive()` returns a [BN][1] instance.\n\n## Supported curves\n\nElliptic.js support following curve types:\n\n* Short Weierstrass\n* Montgomery\n* Edwards\n* Twisted Edwards\n\nFollowing curve 'presets' are embedded into the library:\n\n* `secp256k1`\n* `p192`\n* `p224`\n* `p256`\n* `p384`\n* `p521`\n* `curve25519`\n* `ed25519`\n\nNOTE: That `curve25519` could not be used for ECDSA, use `ed25519` instead.\n\n### Implementation details\n\nECDSA is using deterministic `k` value generation as per [RFC6979][0]. Most of\nthe curve operations are performed on non-affine coordinates (either projective\nor extended), various windowing techniques are used for different cases.\n\nAll operations are performed in reduction context using [bn.js][1], hashing is\nprovided by [hash.js][2]\n\n### Related projects\n\n* [eccrypto][3]: isomorphic implementation of ECDSA, ECDH and ECIES for both\n  browserify and node (uses `elliptic` for browser and [secp256k1-node][4] for\n  node)\n\n#### LICENSE\n\nThis software is licensed under the MIT License.\n\nCopyright Fedor Indutny, 2014.\n\nPermission is hereby granted, free of charge, to any person obtaining a\ncopy of this software and associated documentation files (the\n\"Software\"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to permit\npersons to whom the Software is furnished to do so, subject to the\nfollowing conditions:\n\nThe above copyright notice and this permission notice shall be included\nin all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\nOR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\nNO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\nDAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\nOTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\nUSE OR OTHER DEALINGS IN THE SOFTWARE.\n\n[0]: http://tools.ietf.org/html/rfc6979\n[1]: https://github.com/indutny/bn.js\n[2]: https://github.com/indutny/hash.js\n[3]: https://github.com/bitchan/eccrypto\n[4]: https://github.com/wanderer/secp256k1-node\n",
      readmeFilename: "README.md",
      repository: {
        type: "git",
        url: "git+ssh://git@github.com/indutny/elliptic.git"
      },
      scripts: {
        jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
        jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
        lint: "npm run jscs && npm run jshint",
        test: "npm run lint && npm run unit",
        unit: "istanbul test _mocha --reporter=spec test/index.js",
        version: "grunt dist && git add dist/"
      },
      version: "6.4.0"
    };
  }, {} ],
  83: [ function(require, module, exports) {
    function EventEmitter() {
      this._events = this._events || {};
      this._maxListeners = this._maxListeners || void 0;
    }
    module.exports = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.prototype.setMaxListeners = function(n) {
      if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.emit = function(type) {
      var er, handler, len, args, i, listeners;
      this._events || (this._events = {});
      if ("error" === type && (!this._events.error || isObject(this._events.error) && !this._events.error.length)) {
        er = arguments[1];
        if (er instanceof Error) throw er;
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
        err.context = er;
        throw err;
      }
      handler = this._events[type];
      if (isUndefined(handler)) return false;
      if (isFunction(handler)) switch (arguments.length) {
       case 1:
        handler.call(this);
        break;

       case 2:
        handler.call(this, arguments[1]);
        break;

       case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

       default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
      } else if (isObject(handler)) {
        args = Array.prototype.slice.call(arguments, 1);
        listeners = handler.slice();
        len = listeners.length;
        for (i = 0; i < len; i++) listeners[i].apply(this, args);
      }
      return true;
    };
    EventEmitter.prototype.addListener = function(type, listener) {
      var m;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      this._events || (this._events = {});
      this._events.newListener && this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);
      this._events[type] ? isObject(this._events[type]) ? this._events[type].push(listener) : this._events[type] = [ this._events[type], listener ] : this._events[type] = listener;
      if (isObject(this._events[type]) && !this._events[type].warned) {
        m = isUndefined(this._maxListeners) ? EventEmitter.defaultMaxListeners : this._maxListeners;
        if (m && m > 0 && this._events[type].length > m) {
          this._events[type].warned = true;
          console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[type].length);
          "function" === typeof console.trace && console.trace();
        }
      }
      return this;
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.once = function(type, listener) {
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      var fired = false;
      function g() {
        this.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(this, arguments);
        }
      }
      g.listener = listener;
      this.on(type, g);
      return this;
    };
    EventEmitter.prototype.removeListener = function(type, listener) {
      var list, position, length, i;
      if (!isFunction(listener)) throw TypeError("listener must be a function");
      if (!this._events || !this._events[type]) return this;
      list = this._events[type];
      length = list.length;
      position = -1;
      if (list === listener || isFunction(list.listener) && list.listener === listener) {
        delete this._events[type];
        this._events.removeListener && this.emit("removeListener", type, listener);
      } else if (isObject(list)) {
        for (i = length; i-- > 0; ) if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          position = i;
          break;
        }
        if (position < 0) return this;
        if (1 === list.length) {
          list.length = 0;
          delete this._events[type];
        } else list.splice(position, 1);
        this._events.removeListener && this.emit("removeListener", type, listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function(type) {
      var key, listeners;
      if (!this._events) return this;
      if (!this._events.removeListener) {
        0 === arguments.length ? this._events = {} : this._events[type] && delete this._events[type];
        return this;
      }
      if (0 === arguments.length) {
        for (key in this._events) {
          if ("removeListener" === key) continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = {};
        return this;
      }
      listeners = this._events[type];
      if (isFunction(listeners)) this.removeListener(type, listeners); else if (listeners) while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
      delete this._events[type];
      return this;
    };
    EventEmitter.prototype.listeners = function(type) {
      var ret;
      ret = this._events && this._events[type] ? isFunction(this._events[type]) ? [ this._events[type] ] : this._events[type].slice() : [];
      return ret;
    };
    EventEmitter.prototype.listenerCount = function(type) {
      if (this._events) {
        var evlistener = this._events[type];
        if (isFunction(evlistener)) return 1;
        if (evlistener) return evlistener.length;
      }
      return 0;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      return emitter.listenerCount(type);
    };
    function isFunction(arg) {
      return "function" === typeof arg;
    }
    function isNumber(arg) {
      return "number" === typeof arg;
    }
    function isObject(arg) {
      return "object" === typeof arg && null !== arg;
    }
    function isUndefined(arg) {
      return void 0 === arg;
    }
  }, {} ],
  84: [ function(require, module, exports) {
    var Buffer = require("safe-buffer").Buffer;
    var MD5 = require("md5.js");
    function EVP_BytesToKey(password, salt, keyBits, ivLen) {
      Buffer.isBuffer(password) || (password = Buffer.from(password, "binary"));
      if (salt) {
        Buffer.isBuffer(salt) || (salt = Buffer.from(salt, "binary"));
        if (8 !== salt.length) throw new RangeError("salt should be Buffer with 8 byte length");
      }
      var keyLen = keyBits / 8;
      var key = Buffer.alloc(keyLen);
      var iv = Buffer.alloc(ivLen || 0);
      var tmp = Buffer.alloc(0);
      while (keyLen > 0 || ivLen > 0) {
        var hash = new MD5();
        hash.update(tmp);
        hash.update(password);
        salt && hash.update(salt);
        tmp = hash.digest();
        var used = 0;
        if (keyLen > 0) {
          var keyStart = key.length - keyLen;
          used = Math.min(keyLen, tmp.length);
          tmp.copy(key, keyStart, 0, used);
          keyLen -= used;
        }
        if (used < tmp.length && ivLen > 0) {
          var ivStart = iv.length - ivLen;
          var length = Math.min(ivLen, tmp.length - used);
          tmp.copy(iv, ivStart, used, used + length);
          ivLen -= length;
        }
      }
      tmp.fill(0);
      return {
        key: key,
        iv: iv
      };
    }
    module.exports = EVP_BytesToKey;
  }, {
    "md5.js": 103,
    "safe-buffer": 143
  } ],
  85: [ function(require, module, exports) {
    "use strict";
    var Buffer = require("safe-buffer").Buffer;
    var Transform = require("stream").Transform;
    var inherits = require("inherits");
    function throwIfNotStringOrBuffer(val, prefix) {
      if (!Buffer.isBuffer(val) && "string" !== typeof val) throw new TypeError(prefix + " must be a string or a buffer");
    }
    function HashBase(blockSize) {
      Transform.call(this);
      this._block = Buffer.allocUnsafe(blockSize);
      this._blockSize = blockSize;
      this._blockOffset = 0;
      this._length = [ 0, 0, 0, 0 ];
      this._finalized = false;
    }
    inherits(HashBase, Transform);
    HashBase.prototype._transform = function(chunk, encoding, callback) {
      var error = null;
      try {
        this.update(chunk, encoding);
      } catch (err) {
        error = err;
      }
      callback(error);
    };
    HashBase.prototype._flush = function(callback) {
      var error = null;
      try {
        this.push(this.digest());
      } catch (err) {
        error = err;
      }
      callback(error);
    };
    HashBase.prototype.update = function(data, encoding) {
      throwIfNotStringOrBuffer(data, "Data");
      if (this._finalized) throw new Error("Digest already called");
      Buffer.isBuffer(data) || (data = Buffer.from(data, encoding));
      var block = this._block;
      var offset = 0;
      while (this._blockOffset + data.length - offset >= this._blockSize) {
        for (var i = this._blockOffset; i < this._blockSize; ) block[i++] = data[offset++];
        this._update();
        this._blockOffset = 0;
      }
      while (offset < data.length) block[this._blockOffset++] = data[offset++];
      for (var j = 0, carry = 8 * data.length; carry > 0; ++j) {
        this._length[j] += carry;
        carry = this._length[j] / 4294967296 | 0;
        carry > 0 && (this._length[j] -= 4294967296 * carry);
      }
      return this;
    };
    HashBase.prototype._update = function() {
      throw new Error("_update is not implemented");
    };
    HashBase.prototype.digest = function(encoding) {
      if (this._finalized) throw new Error("Digest already called");
      this._finalized = true;
      var digest = this._digest();
      void 0 !== encoding && (digest = digest.toString(encoding));
      this._block.fill(0);
      this._blockOffset = 0;
      for (var i = 0; i < 4; ++i) this._length[i] = 0;
      return digest;
    };
    HashBase.prototype._digest = function() {
      throw new Error("_digest is not implemented");
    };
    module.exports = HashBase;
  }, {
    inherits: 101,
    "safe-buffer": 143,
    stream: 152
  } ],
  86: [ function(require, module, exports) {
    var hash = exports;
    hash.utils = require("./hash/utils");
    hash.common = require("./hash/common");
    hash.sha = require("./hash/sha");
    hash.ripemd = require("./hash/ripemd");
    hash.hmac = require("./hash/hmac");
    hash.sha1 = hash.sha.sha1;
    hash.sha256 = hash.sha.sha256;
    hash.sha224 = hash.sha.sha224;
    hash.sha384 = hash.sha.sha384;
    hash.sha512 = hash.sha.sha512;
    hash.ripemd160 = hash.ripemd.ripemd160;
  }, {
    "./hash/common": 87,
    "./hash/hmac": 88,
    "./hash/ripemd": 89,
    "./hash/sha": 90,
    "./hash/utils": 97
  } ],
  87: [ function(require, module, exports) {
    "use strict";
    var utils = require("./utils");
    var assert = require("minimalistic-assert");
    function BlockHash() {
      this.pending = null;
      this.pendingTotal = 0;
      this.blockSize = this.constructor.blockSize;
      this.outSize = this.constructor.outSize;
      this.hmacStrength = this.constructor.hmacStrength;
      this.padLength = this.constructor.padLength / 8;
      this.endian = "big";
      this._delta8 = this.blockSize / 8;
      this._delta32 = this.blockSize / 32;
    }
    exports.BlockHash = BlockHash;
    BlockHash.prototype.update = function update(msg, enc) {
      msg = utils.toArray(msg, enc);
      this.pending ? this.pending = this.pending.concat(msg) : this.pending = msg;
      this.pendingTotal += msg.length;
      if (this.pending.length >= this._delta8) {
        msg = this.pending;
        var r = msg.length % this._delta8;
        this.pending = msg.slice(msg.length - r, msg.length);
        0 === this.pending.length && (this.pending = null);
        msg = utils.join32(msg, 0, msg.length - r, this.endian);
        for (var i = 0; i < msg.length; i += this._delta32) this._update(msg, i, i + this._delta32);
      }
      return this;
    };
    BlockHash.prototype.digest = function digest(enc) {
      this.update(this._pad());
      assert(null === this.pending);
      return this._digest(enc);
    };
    BlockHash.prototype._pad = function pad() {
      var len = this.pendingTotal;
      var bytes = this._delta8;
      var k = bytes - (len + this.padLength) % bytes;
      var res = new Array(k + this.padLength);
      res[0] = 128;
      for (var i = 1; i < k; i++) res[i] = 0;
      len <<= 3;
      if ("big" === this.endian) {
        for (var t = 8; t < this.padLength; t++) res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = len >>> 24 & 255;
        res[i++] = len >>> 16 & 255;
        res[i++] = len >>> 8 & 255;
        res[i++] = 255 & len;
      } else {
        res[i++] = 255 & len;
        res[i++] = len >>> 8 & 255;
        res[i++] = len >>> 16 & 255;
        res[i++] = len >>> 24 & 255;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        for (t = 8; t < this.padLength; t++) res[i++] = 0;
      }
      return res;
    };
  }, {
    "./utils": 97,
    "minimalistic-assert": 105
  } ],
  88: [ function(require, module, exports) {
    "use strict";
    var utils = require("./utils");
    var assert = require("minimalistic-assert");
    function Hmac(hash, key, enc) {
      if (!(this instanceof Hmac)) return new Hmac(hash, key, enc);
      this.Hash = hash;
      this.blockSize = hash.blockSize / 8;
      this.outSize = hash.outSize / 8;
      this.inner = null;
      this.outer = null;
      this._init(utils.toArray(key, enc));
    }
    module.exports = Hmac;
    Hmac.prototype._init = function init(key) {
      key.length > this.blockSize && (key = new this.Hash().update(key).digest());
      assert(key.length <= this.blockSize);
      for (var i = key.length; i < this.blockSize; i++) key.push(0);
      for (i = 0; i < key.length; i++) key[i] ^= 54;
      this.inner = new this.Hash().update(key);
      for (i = 0; i < key.length; i++) key[i] ^= 106;
      this.outer = new this.Hash().update(key);
    };
    Hmac.prototype.update = function update(msg, enc) {
      this.inner.update(msg, enc);
      return this;
    };
    Hmac.prototype.digest = function digest(enc) {
      this.outer.update(this.inner.digest());
      return this.outer.digest(enc);
    };
  }, {
    "./utils": 97,
    "minimalistic-assert": 105
  } ],
  89: [ function(require, module, exports) {
    "use strict";
    var utils = require("./utils");
    var common = require("./common");
    var rotl32 = utils.rotl32;
    var sum32 = utils.sum32;
    var sum32_3 = utils.sum32_3;
    var sum32_4 = utils.sum32_4;
    var BlockHash = common.BlockHash;
    function RIPEMD160() {
      if (!(this instanceof RIPEMD160)) return new RIPEMD160();
      BlockHash.call(this);
      this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
      this.endian = "little";
    }
    utils.inherits(RIPEMD160, BlockHash);
    exports.ripemd160 = RIPEMD160;
    RIPEMD160.blockSize = 512;
    RIPEMD160.outSize = 160;
    RIPEMD160.hmacStrength = 192;
    RIPEMD160.padLength = 64;
    RIPEMD160.prototype._update = function update(msg, start) {
      var A = this.h[0];
      var B = this.h[1];
      var C = this.h[2];
      var D = this.h[3];
      var E = this.h[4];
      var Ah = A;
      var Bh = B;
      var Ch = C;
      var Dh = D;
      var Eh = E;
      for (var j = 0; j < 80; j++) {
        var T = sum32(rotl32(sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)), s[j]), E);
        A = E;
        E = D;
        D = rotl32(C, 10);
        C = B;
        B = T;
        T = sum32(rotl32(sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)), sh[j]), Eh);
        Ah = Eh;
        Eh = Dh;
        Dh = rotl32(Ch, 10);
        Ch = Bh;
        Bh = T;
      }
      T = sum32_3(this.h[1], C, Dh);
      this.h[1] = sum32_3(this.h[2], D, Eh);
      this.h[2] = sum32_3(this.h[3], E, Ah);
      this.h[3] = sum32_3(this.h[4], A, Bh);
      this.h[4] = sum32_3(this.h[0], B, Ch);
      this.h[0] = T;
    };
    RIPEMD160.prototype._digest = function digest(enc) {
      return "hex" === enc ? utils.toHex32(this.h, "little") : utils.split32(this.h, "little");
    };
    function f(j, x, y, z) {
      return j <= 15 ? x ^ y ^ z : j <= 31 ? x & y | ~x & z : j <= 47 ? (x | ~y) ^ z : j <= 63 ? x & z | y & ~z : x ^ (y | ~z);
    }
    function K(j) {
      return j <= 15 ? 0 : j <= 31 ? 1518500249 : j <= 47 ? 1859775393 : j <= 63 ? 2400959708 : 2840853838;
    }
    function Kh(j) {
      return j <= 15 ? 1352829926 : j <= 31 ? 1548603684 : j <= 47 ? 1836072691 : j <= 63 ? 2053994217 : 0;
    }
    var r = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ];
    var rh = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ];
    var s = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ];
    var sh = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ];
  }, {
    "./common": 87,
    "./utils": 97
  } ],
  90: [ function(require, module, exports) {
    "use strict";
    exports.sha1 = require("./sha/1");
    exports.sha224 = require("./sha/224");
    exports.sha256 = require("./sha/256");
    exports.sha384 = require("./sha/384");
    exports.sha512 = require("./sha/512");
  }, {
    "./sha/1": 91,
    "./sha/224": 92,
    "./sha/256": 93,
    "./sha/384": 94,
    "./sha/512": 95
  } ],
  91: [ function(require, module, exports) {
    "use strict";
    var utils = require("../utils");
    var common = require("../common");
    var shaCommon = require("./common");
    var rotl32 = utils.rotl32;
    var sum32 = utils.sum32;
    var sum32_5 = utils.sum32_5;
    var ft_1 = shaCommon.ft_1;
    var BlockHash = common.BlockHash;
    var sha1_K = [ 1518500249, 1859775393, 2400959708, 3395469782 ];
    function SHA1() {
      if (!(this instanceof SHA1)) return new SHA1();
      BlockHash.call(this);
      this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
      this.W = new Array(80);
    }
    utils.inherits(SHA1, BlockHash);
    module.exports = SHA1;
    SHA1.blockSize = 512;
    SHA1.outSize = 160;
    SHA1.hmacStrength = 80;
    SHA1.padLength = 64;
    SHA1.prototype._update = function _update(msg, start) {
      var W = this.W;
      for (var i = 0; i < 16; i++) W[i] = msg[start + i];
      for (;i < W.length; i++) W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
      var a = this.h[0];
      var b = this.h[1];
      var c = this.h[2];
      var d = this.h[3];
      var e = this.h[4];
      for (i = 0; i < W.length; i++) {
        var s = ~~(i / 20);
        var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
        e = d;
        d = c;
        c = rotl32(b, 30);
        b = a;
        a = t;
      }
      this.h[0] = sum32(this.h[0], a);
      this.h[1] = sum32(this.h[1], b);
      this.h[2] = sum32(this.h[2], c);
      this.h[3] = sum32(this.h[3], d);
      this.h[4] = sum32(this.h[4], e);
    };
    SHA1.prototype._digest = function digest(enc) {
      return "hex" === enc ? utils.toHex32(this.h, "big") : utils.split32(this.h, "big");
    };
  }, {
    "../common": 87,
    "../utils": 97,
    "./common": 96
  } ],
  92: [ function(require, module, exports) {
    "use strict";
    var utils = require("../utils");
    var SHA256 = require("./256");
    function SHA224() {
      if (!(this instanceof SHA224)) return new SHA224();
      SHA256.call(this);
      this.h = [ 3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428 ];
    }
    utils.inherits(SHA224, SHA256);
    module.exports = SHA224;
    SHA224.blockSize = 512;
    SHA224.outSize = 224;
    SHA224.hmacStrength = 192;
    SHA224.padLength = 64;
    SHA224.prototype._digest = function digest(enc) {
      return "hex" === enc ? utils.toHex32(this.h.slice(0, 7), "big") : utils.split32(this.h.slice(0, 7), "big");
    };
  }, {
    "../utils": 97,
    "./256": 93
  } ],
  93: [ function(require, module, exports) {
    "use strict";
    var utils = require("../utils");
    var common = require("../common");
    var shaCommon = require("./common");
    var assert = require("minimalistic-assert");
    var sum32 = utils.sum32;
    var sum32_4 = utils.sum32_4;
    var sum32_5 = utils.sum32_5;
    var ch32 = shaCommon.ch32;
    var maj32 = shaCommon.maj32;
    var s0_256 = shaCommon.s0_256;
    var s1_256 = shaCommon.s1_256;
    var g0_256 = shaCommon.g0_256;
    var g1_256 = shaCommon.g1_256;
    var BlockHash = common.BlockHash;
    var sha256_K = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
    function SHA256() {
      if (!(this instanceof SHA256)) return new SHA256();
      BlockHash.call(this);
      this.h = [ 1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225 ];
      this.k = sha256_K;
      this.W = new Array(64);
    }
    utils.inherits(SHA256, BlockHash);
    module.exports = SHA256;
    SHA256.blockSize = 512;
    SHA256.outSize = 256;
    SHA256.hmacStrength = 192;
    SHA256.padLength = 64;
    SHA256.prototype._update = function _update(msg, start) {
      var W = this.W;
      for (var i = 0; i < 16; i++) W[i] = msg[start + i];
      for (;i < W.length; i++) W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);
      var a = this.h[0];
      var b = this.h[1];
      var c = this.h[2];
      var d = this.h[3];
      var e = this.h[4];
      var f = this.h[5];
      var g = this.h[6];
      var h = this.h[7];
      assert(this.k.length === W.length);
      for (i = 0; i < W.length; i++) {
        var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
        var T2 = sum32(s0_256(a), maj32(a, b, c));
        h = g;
        g = f;
        f = e;
        e = sum32(d, T1);
        d = c;
        c = b;
        b = a;
        a = sum32(T1, T2);
      }
      this.h[0] = sum32(this.h[0], a);
      this.h[1] = sum32(this.h[1], b);
      this.h[2] = sum32(this.h[2], c);
      this.h[3] = sum32(this.h[3], d);
      this.h[4] = sum32(this.h[4], e);
      this.h[5] = sum32(this.h[5], f);
      this.h[6] = sum32(this.h[6], g);
      this.h[7] = sum32(this.h[7], h);
    };
    SHA256.prototype._digest = function digest(enc) {
      return "hex" === enc ? utils.toHex32(this.h, "big") : utils.split32(this.h, "big");
    };
  }, {
    "../common": 87,
    "../utils": 97,
    "./common": 96,
    "minimalistic-assert": 105
  } ],
  94: [ function(require, module, exports) {
    "use strict";
    var utils = require("../utils");
    var SHA512 = require("./512");
    function SHA384() {
      if (!(this instanceof SHA384)) return new SHA384();
      SHA512.call(this);
      this.h = [ 3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428 ];
    }
    utils.inherits(SHA384, SHA512);
    module.exports = SHA384;
    SHA384.blockSize = 1024;
    SHA384.outSize = 384;
    SHA384.hmacStrength = 192;
    SHA384.padLength = 128;
    SHA384.prototype._digest = function digest(enc) {
      return "hex" === enc ? utils.toHex32(this.h.slice(0, 12), "big") : utils.split32(this.h.slice(0, 12), "big");
    };
  }, {
    "../utils": 97,
    "./512": 95
  } ],
  95: [ function(require, module, exports) {
    "use strict";
    var utils = require("../utils");
    var common = require("../common");
    var assert = require("minimalistic-assert");
    var rotr64_hi = utils.rotr64_hi;
    var rotr64_lo = utils.rotr64_lo;
    var shr64_hi = utils.shr64_hi;
    var shr64_lo = utils.shr64_lo;
    var sum64 = utils.sum64;
    var sum64_hi = utils.sum64_hi;
    var sum64_lo = utils.sum64_lo;
    var sum64_4_hi = utils.sum64_4_hi;
    var sum64_4_lo = utils.sum64_4_lo;
    var sum64_5_hi = utils.sum64_5_hi;
    var sum64_5_lo = utils.sum64_5_lo;
    var BlockHash = common.BlockHash;
    var sha512_K = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ];
    function SHA512() {
      if (!(this instanceof SHA512)) return new SHA512();
      BlockHash.call(this);
      this.h = [ 1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209 ];
      this.k = sha512_K;
      this.W = new Array(160);
    }
    utils.inherits(SHA512, BlockHash);
    module.exports = SHA512;
    SHA512.blockSize = 1024;
    SHA512.outSize = 512;
    SHA512.hmacStrength = 192;
    SHA512.padLength = 128;
    SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
      var W = this.W;
      for (var i = 0; i < 32; i++) W[i] = msg[start + i];
      for (;i < W.length; i += 2) {
        var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);
        var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
        var c1_hi = W[i - 14];
        var c1_lo = W[i - 13];
        var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);
        var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
        var c3_hi = W[i - 32];
        var c3_lo = W[i - 31];
        W[i] = sum64_4_hi(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
        W[i + 1] = sum64_4_lo(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
      }
    };
    SHA512.prototype._update = function _update(msg, start) {
      this._prepareBlock(msg, start);
      var W = this.W;
      var ah = this.h[0];
      var al = this.h[1];
      var bh = this.h[2];
      var bl = this.h[3];
      var ch = this.h[4];
      var cl = this.h[5];
      var dh = this.h[6];
      var dl = this.h[7];
      var eh = this.h[8];
      var el = this.h[9];
      var fh = this.h[10];
      var fl = this.h[11];
      var gh = this.h[12];
      var gl = this.h[13];
      var hh = this.h[14];
      var hl = this.h[15];
      assert(this.k.length === W.length);
      for (var i = 0; i < W.length; i += 2) {
        var c0_hi = hh;
        var c0_lo = hl;
        var c1_hi = s1_512_hi(eh, el);
        var c1_lo = s1_512_lo(eh, el);
        var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
        var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
        var c3_hi = this.k[i];
        var c3_lo = this.k[i + 1];
        var c4_hi = W[i];
        var c4_lo = W[i + 1];
        var T1_hi = sum64_5_hi(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo, c4_hi, c4_lo);
        var T1_lo = sum64_5_lo(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo, c4_hi, c4_lo);
        c0_hi = s0_512_hi(ah, al);
        c0_lo = s0_512_lo(ah, al);
        c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
        c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);
        var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
        var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);
        hh = gh;
        hl = gl;
        gh = fh;
        gl = fl;
        fh = eh;
        fl = el;
        eh = sum64_hi(dh, dl, T1_hi, T1_lo);
        el = sum64_lo(dl, dl, T1_hi, T1_lo);
        dh = ch;
        dl = cl;
        ch = bh;
        cl = bl;
        bh = ah;
        bl = al;
        ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
        al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
      }
      sum64(this.h, 0, ah, al);
      sum64(this.h, 2, bh, bl);
      sum64(this.h, 4, ch, cl);
      sum64(this.h, 6, dh, dl);
      sum64(this.h, 8, eh, el);
      sum64(this.h, 10, fh, fl);
      sum64(this.h, 12, gh, gl);
      sum64(this.h, 14, hh, hl);
    };
    SHA512.prototype._digest = function digest(enc) {
      return "hex" === enc ? utils.toHex32(this.h, "big") : utils.split32(this.h, "big");
    };
    function ch64_hi(xh, xl, yh, yl, zh) {
      var r = xh & yh ^ ~xh & zh;
      r < 0 && (r += 4294967296);
      return r;
    }
    function ch64_lo(xh, xl, yh, yl, zh, zl) {
      var r = xl & yl ^ ~xl & zl;
      r < 0 && (r += 4294967296);
      return r;
    }
    function maj64_hi(xh, xl, yh, yl, zh) {
      var r = xh & yh ^ xh & zh ^ yh & zh;
      r < 0 && (r += 4294967296);
      return r;
    }
    function maj64_lo(xh, xl, yh, yl, zh, zl) {
      var r = xl & yl ^ xl & zl ^ yl & zl;
      r < 0 && (r += 4294967296);
      return r;
    }
    function s0_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 28);
      var c1_hi = rotr64_hi(xl, xh, 2);
      var c2_hi = rotr64_hi(xl, xh, 7);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      r < 0 && (r += 4294967296);
      return r;
    }
    function s0_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 28);
      var c1_lo = rotr64_lo(xl, xh, 2);
      var c2_lo = rotr64_lo(xl, xh, 7);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      r < 0 && (r += 4294967296);
      return r;
    }
    function s1_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 14);
      var c1_hi = rotr64_hi(xh, xl, 18);
      var c2_hi = rotr64_hi(xl, xh, 9);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      r < 0 && (r += 4294967296);
      return r;
    }
    function s1_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 14);
      var c1_lo = rotr64_lo(xh, xl, 18);
      var c2_lo = rotr64_lo(xl, xh, 9);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      r < 0 && (r += 4294967296);
      return r;
    }
    function g0_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 1);
      var c1_hi = rotr64_hi(xh, xl, 8);
      var c2_hi = shr64_hi(xh, xl, 7);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      r < 0 && (r += 4294967296);
      return r;
    }
    function g0_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 1);
      var c1_lo = rotr64_lo(xh, xl, 8);
      var c2_lo = shr64_lo(xh, xl, 7);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      r < 0 && (r += 4294967296);
      return r;
    }
    function g1_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 19);
      var c1_hi = rotr64_hi(xl, xh, 29);
      var c2_hi = shr64_hi(xh, xl, 6);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      r < 0 && (r += 4294967296);
      return r;
    }
    function g1_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 19);
      var c1_lo = rotr64_lo(xl, xh, 29);
      var c2_lo = shr64_lo(xh, xl, 6);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      r < 0 && (r += 4294967296);
      return r;
    }
  }, {
    "../common": 87,
    "../utils": 97,
    "minimalistic-assert": 105
  } ],
  96: [ function(require, module, exports) {
    "use strict";
    var utils = require("../utils");
    var rotr32 = utils.rotr32;
    function ft_1(s, x, y, z) {
      if (0 === s) return ch32(x, y, z);
      if (1 === s || 3 === s) return p32(x, y, z);
      if (2 === s) return maj32(x, y, z);
    }
    exports.ft_1 = ft_1;
    function ch32(x, y, z) {
      return x & y ^ ~x & z;
    }
    exports.ch32 = ch32;
    function maj32(x, y, z) {
      return x & y ^ x & z ^ y & z;
    }
    exports.maj32 = maj32;
    function p32(x, y, z) {
      return x ^ y ^ z;
    }
    exports.p32 = p32;
    function s0_256(x) {
      return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
    }
    exports.s0_256 = s0_256;
    function s1_256(x) {
      return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
    }
    exports.s1_256 = s1_256;
    function g0_256(x) {
      return rotr32(x, 7) ^ rotr32(x, 18) ^ x >>> 3;
    }
    exports.g0_256 = g0_256;
    function g1_256(x) {
      return rotr32(x, 17) ^ rotr32(x, 19) ^ x >>> 10;
    }
    exports.g1_256 = g1_256;
  }, {
    "../utils": 97
  } ],
  97: [ function(require, module, exports) {
    "use strict";
    var assert = require("minimalistic-assert");
    var inherits = require("inherits");
    exports.inherits = inherits;
    function toArray(msg, enc) {
      if (Array.isArray(msg)) return msg.slice();
      if (!msg) return [];
      var res = [];
      if ("string" === typeof msg) if (enc) {
        if ("hex" === enc) {
          msg = msg.replace(/[^a-z0-9]+/gi, "");
          msg.length % 2 !== 0 && (msg = "0" + msg);
          for (i = 0; i < msg.length; i += 2) res.push(parseInt(msg[i] + msg[i + 1], 16));
        }
      } else for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        var hi = c >> 8;
        var lo = 255 & c;
        hi ? res.push(hi, lo) : res.push(lo);
      } else for (i = 0; i < msg.length; i++) res[i] = 0 | msg[i];
      return res;
    }
    exports.toArray = toArray;
    function toHex(msg) {
      var res = "";
      for (var i = 0; i < msg.length; i++) res += zero2(msg[i].toString(16));
      return res;
    }
    exports.toHex = toHex;
    function htonl(w) {
      var res = w >>> 24 | w >>> 8 & 65280 | w << 8 & 16711680 | (255 & w) << 24;
      return res >>> 0;
    }
    exports.htonl = htonl;
    function toHex32(msg, endian) {
      var res = "";
      for (var i = 0; i < msg.length; i++) {
        var w = msg[i];
        "little" === endian && (w = htonl(w));
        res += zero8(w.toString(16));
      }
      return res;
    }
    exports.toHex32 = toHex32;
    function zero2(word) {
      return 1 === word.length ? "0" + word : word;
    }
    exports.zero2 = zero2;
    function zero8(word) {
      return 7 === word.length ? "0" + word : 6 === word.length ? "00" + word : 5 === word.length ? "000" + word : 4 === word.length ? "0000" + word : 3 === word.length ? "00000" + word : 2 === word.length ? "000000" + word : 1 === word.length ? "0000000" + word : word;
    }
    exports.zero8 = zero8;
    function join32(msg, start, end, endian) {
      var len = end - start;
      assert(len % 4 === 0);
      var res = new Array(len / 4);
      for (var i = 0, k = start; i < res.length; i++, k += 4) {
        var w;
        w = "big" === endian ? msg[k] << 24 | msg[k + 1] << 16 | msg[k + 2] << 8 | msg[k + 3] : msg[k + 3] << 24 | msg[k + 2] << 16 | msg[k + 1] << 8 | msg[k];
        res[i] = w >>> 0;
      }
      return res;
    }
    exports.join32 = join32;
    function split32(msg, endian) {
      var res = new Array(4 * msg.length);
      for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
        var m = msg[i];
        if ("big" === endian) {
          res[k] = m >>> 24;
          res[k + 1] = m >>> 16 & 255;
          res[k + 2] = m >>> 8 & 255;
          res[k + 3] = 255 & m;
        } else {
          res[k + 3] = m >>> 24;
          res[k + 2] = m >>> 16 & 255;
          res[k + 1] = m >>> 8 & 255;
          res[k] = 255 & m;
        }
      }
      return res;
    }
    exports.split32 = split32;
    function rotr32(w, b) {
      return w >>> b | w << 32 - b;
    }
    exports.rotr32 = rotr32;
    function rotl32(w, b) {
      return w << b | w >>> 32 - b;
    }
    exports.rotl32 = rotl32;
    function sum32(a, b) {
      return a + b >>> 0;
    }
    exports.sum32 = sum32;
    function sum32_3(a, b, c) {
      return a + b + c >>> 0;
    }
    exports.sum32_3 = sum32_3;
    function sum32_4(a, b, c, d) {
      return a + b + c + d >>> 0;
    }
    exports.sum32_4 = sum32_4;
    function sum32_5(a, b, c, d, e) {
      return a + b + c + d + e >>> 0;
    }
    exports.sum32_5 = sum32_5;
    function sum64(buf, pos, ah, al) {
      var bh = buf[pos];
      var bl = buf[pos + 1];
      var lo = al + bl >>> 0;
      var hi = (lo < al ? 1 : 0) + ah + bh;
      buf[pos] = hi >>> 0;
      buf[pos + 1] = lo;
    }
    exports.sum64 = sum64;
    function sum64_hi(ah, al, bh, bl) {
      var lo = al + bl >>> 0;
      var hi = (lo < al ? 1 : 0) + ah + bh;
      return hi >>> 0;
    }
    exports.sum64_hi = sum64_hi;
    function sum64_lo(ah, al, bh, bl) {
      var lo = al + bl;
      return lo >>> 0;
    }
    exports.sum64_lo = sum64_lo;
    function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
      var carry = 0;
      var lo = al;
      lo = lo + bl >>> 0;
      carry += lo < al ? 1 : 0;
      lo = lo + cl >>> 0;
      carry += lo < cl ? 1 : 0;
      lo = lo + dl >>> 0;
      carry += lo < dl ? 1 : 0;
      var hi = ah + bh + ch + dh + carry;
      return hi >>> 0;
    }
    exports.sum64_4_hi = sum64_4_hi;
    function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
      var lo = al + bl + cl + dl;
      return lo >>> 0;
    }
    exports.sum64_4_lo = sum64_4_lo;
    function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
      var carry = 0;
      var lo = al;
      lo = lo + bl >>> 0;
      carry += lo < al ? 1 : 0;
      lo = lo + cl >>> 0;
      carry += lo < cl ? 1 : 0;
      lo = lo + dl >>> 0;
      carry += lo < dl ? 1 : 0;
      lo = lo + el >>> 0;
      carry += lo < el ? 1 : 0;
      var hi = ah + bh + ch + dh + eh + carry;
      return hi >>> 0;
    }
    exports.sum64_5_hi = sum64_5_hi;
    function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
      var lo = al + bl + cl + dl + el;
      return lo >>> 0;
    }
    exports.sum64_5_lo = sum64_5_lo;
    function rotr64_hi(ah, al, num) {
      var r = al << 32 - num | ah >>> num;
      return r >>> 0;
    }
    exports.rotr64_hi = rotr64_hi;
    function rotr64_lo(ah, al, num) {
      var r = ah << 32 - num | al >>> num;
      return r >>> 0;
    }
    exports.rotr64_lo = rotr64_lo;
    function shr64_hi(ah, al, num) {
      return ah >>> num;
    }
    exports.shr64_hi = shr64_hi;
    function shr64_lo(ah, al, num) {
      var r = ah << 32 - num | al >>> num;
      return r >>> 0;
    }
    exports.shr64_lo = shr64_lo;
  }, {
    inherits: 101,
    "minimalistic-assert": 105
  } ],
  98: [ function(require, module, exports) {
    "use strict";
    var hash = require("hash.js");
    var utils = require("minimalistic-crypto-utils");
    var assert = require("minimalistic-assert");
    function HmacDRBG(options) {
      if (!(this instanceof HmacDRBG)) return new HmacDRBG(options);
      this.hash = options.hash;
      this.predResist = !!options.predResist;
      this.outLen = this.hash.outSize;
      this.minEntropy = options.minEntropy || this.hash.hmacStrength;
      this._reseed = null;
      this.reseedInterval = null;
      this.K = null;
      this.V = null;
      var entropy = utils.toArray(options.entropy, options.entropyEnc || "hex");
      var nonce = utils.toArray(options.nonce, options.nonceEnc || "hex");
      var pers = utils.toArray(options.pers, options.persEnc || "hex");
      assert(entropy.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits");
      this._init(entropy, nonce, pers);
    }
    module.exports = HmacDRBG;
    HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
      var seed = entropy.concat(nonce).concat(pers);
      this.K = new Array(this.outLen / 8);
      this.V = new Array(this.outLen / 8);
      for (var i = 0; i < this.V.length; i++) {
        this.K[i] = 0;
        this.V[i] = 1;
      }
      this._update(seed);
      this._reseed = 1;
      this.reseedInterval = 281474976710656;
    };
    HmacDRBG.prototype._hmac = function hmac() {
      return new hash.hmac(this.hash, this.K);
    };
    HmacDRBG.prototype._update = function update(seed) {
      var kmac = this._hmac().update(this.V).update([ 0 ]);
      seed && (kmac = kmac.update(seed));
      this.K = kmac.digest();
      this.V = this._hmac().update(this.V).digest();
      if (!seed) return;
      this.K = this._hmac().update(this.V).update([ 1 ]).update(seed).digest();
      this.V = this._hmac().update(this.V).digest();
    };
    HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
      if ("string" !== typeof entropyEnc) {
        addEnc = add;
        add = entropyEnc;
        entropyEnc = null;
      }
      entropy = utils.toArray(entropy, entropyEnc);
      add = utils.toArray(add, addEnc);
      assert(entropy.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits");
      this._update(entropy.concat(add || []));
      this._reseed = 1;
    };
    HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
      if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
      if ("string" !== typeof enc) {
        addEnc = add;
        add = enc;
        enc = null;
      }
      if (add) {
        add = utils.toArray(add, addEnc || "hex");
        this._update(add);
      }
      var temp = [];
      while (temp.length < len) {
        this.V = this._hmac().update(this.V).digest();
        temp = temp.concat(this.V);
      }
      var res = temp.slice(0, len);
      this._update(add);
      this._reseed++;
      return utils.encode(res, enc);
    };
  }, {
    "hash.js": 86,
    "minimalistic-assert": 105,
    "minimalistic-crypto-utils": 106
  } ],
  99: [ function(require, module, exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (;nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8) ;
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (;nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8) ;
      if (0 === e) e = 1 - eBias; else {
        if (e === eMax) return m ? NaN : Infinity * (s ? -1 : 1);
        m += Math.pow(2, mLen);
        e -= eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || Infinity === value) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e += eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (;mLen >= 8; buffer[offset + i] = 255 & m, i += d, m /= 256, mLen -= 8) ;
      e = e << mLen | m;
      eLen += mLen;
      for (;eLen > 0; buffer[offset + i] = 255 & e, i += d, e /= 256, eLen -= 8) ;
      buffer[offset + i - d] |= 128 * s;
    };
  }, {} ],
  100: [ function(require, module, exports) {
    var indexOf = [].indexOf;
    module.exports = function(arr, obj) {
      if (indexOf) return arr.indexOf(obj);
      for (var i = 0; i < arr.length; ++i) if (arr[i] === obj) return i;
      return -1;
    };
  }, {} ],
  101: [ function(require, module, exports) {
    "function" === typeof Object.create ? module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    } : module.exports = function inherits(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
  }, {} ],
  102: [ function(require, module, exports) {
    module.exports = function(obj) {
      return null != obj && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
    };
    function isBuffer(obj) {
      return !!obj.constructor && "function" === typeof obj.constructor.isBuffer && obj.constructor.isBuffer(obj);
    }
    function isSlowBuffer(obj) {
      return "function" === typeof obj.readFloatLE && "function" === typeof obj.slice && isBuffer(obj.slice(0, 0));
    }
  }, {} ],
  103: [ function(require, module, exports) {
    (function(Buffer) {
      "use strict";
      var inherits = require("inherits");
      var HashBase = require("hash-base");
      var ARRAY16 = new Array(16);
      function MD5() {
        HashBase.call(this, 64);
        this._a = 1732584193;
        this._b = 4023233417;
        this._c = 2562383102;
        this._d = 271733878;
      }
      inherits(MD5, HashBase);
      MD5.prototype._update = function() {
        var M = ARRAY16;
        for (var i = 0; i < 16; ++i) M[i] = this._block.readInt32LE(4 * i);
        var a = this._a;
        var b = this._b;
        var c = this._c;
        var d = this._d;
        a = fnF(a, b, c, d, M[0], 3614090360, 7);
        d = fnF(d, a, b, c, M[1], 3905402710, 12);
        c = fnF(c, d, a, b, M[2], 606105819, 17);
        b = fnF(b, c, d, a, M[3], 3250441966, 22);
        a = fnF(a, b, c, d, M[4], 4118548399, 7);
        d = fnF(d, a, b, c, M[5], 1200080426, 12);
        c = fnF(c, d, a, b, M[6], 2821735955, 17);
        b = fnF(b, c, d, a, M[7], 4249261313, 22);
        a = fnF(a, b, c, d, M[8], 1770035416, 7);
        d = fnF(d, a, b, c, M[9], 2336552879, 12);
        c = fnF(c, d, a, b, M[10], 4294925233, 17);
        b = fnF(b, c, d, a, M[11], 2304563134, 22);
        a = fnF(a, b, c, d, M[12], 1804603682, 7);
        d = fnF(d, a, b, c, M[13], 4254626195, 12);
        c = fnF(c, d, a, b, M[14], 2792965006, 17);
        b = fnF(b, c, d, a, M[15], 1236535329, 22);
        a = fnG(a, b, c, d, M[1], 4129170786, 5);
        d = fnG(d, a, b, c, M[6], 3225465664, 9);
        c = fnG(c, d, a, b, M[11], 643717713, 14);
        b = fnG(b, c, d, a, M[0], 3921069994, 20);
        a = fnG(a, b, c, d, M[5], 3593408605, 5);
        d = fnG(d, a, b, c, M[10], 38016083, 9);
        c = fnG(c, d, a, b, M[15], 3634488961, 14);
        b = fnG(b, c, d, a, M[4], 3889429448, 20);
        a = fnG(a, b, c, d, M[9], 568446438, 5);
        d = fnG(d, a, b, c, M[14], 3275163606, 9);
        c = fnG(c, d, a, b, M[3], 4107603335, 14);
        b = fnG(b, c, d, a, M[8], 1163531501, 20);
        a = fnG(a, b, c, d, M[13], 2850285829, 5);
        d = fnG(d, a, b, c, M[2], 4243563512, 9);
        c = fnG(c, d, a, b, M[7], 1735328473, 14);
        b = fnG(b, c, d, a, M[12], 2368359562, 20);
        a = fnH(a, b, c, d, M[5], 4294588738, 4);
        d = fnH(d, a, b, c, M[8], 2272392833, 11);
        c = fnH(c, d, a, b, M[11], 1839030562, 16);
        b = fnH(b, c, d, a, M[14], 4259657740, 23);
        a = fnH(a, b, c, d, M[1], 2763975236, 4);
        d = fnH(d, a, b, c, M[4], 1272893353, 11);
        c = fnH(c, d, a, b, M[7], 4139469664, 16);
        b = fnH(b, c, d, a, M[10], 3200236656, 23);
        a = fnH(a, b, c, d, M[13], 681279174, 4);
        d = fnH(d, a, b, c, M[0], 3936430074, 11);
        c = fnH(c, d, a, b, M[3], 3572445317, 16);
        b = fnH(b, c, d, a, M[6], 76029189, 23);
        a = fnH(a, b, c, d, M[9], 3654602809, 4);
        d = fnH(d, a, b, c, M[12], 3873151461, 11);
        c = fnH(c, d, a, b, M[15], 530742520, 16);
        b = fnH(b, c, d, a, M[2], 3299628645, 23);
        a = fnI(a, b, c, d, M[0], 4096336452, 6);
        d = fnI(d, a, b, c, M[7], 1126891415, 10);
        c = fnI(c, d, a, b, M[14], 2878612391, 15);
        b = fnI(b, c, d, a, M[5], 4237533241, 21);
        a = fnI(a, b, c, d, M[12], 1700485571, 6);
        d = fnI(d, a, b, c, M[3], 2399980690, 10);
        c = fnI(c, d, a, b, M[10], 4293915773, 15);
        b = fnI(b, c, d, a, M[1], 2240044497, 21);
        a = fnI(a, b, c, d, M[8], 1873313359, 6);
        d = fnI(d, a, b, c, M[15], 4264355552, 10);
        c = fnI(c, d, a, b, M[6], 2734768916, 15);
        b = fnI(b, c, d, a, M[13], 1309151649, 21);
        a = fnI(a, b, c, d, M[4], 4149444226, 6);
        d = fnI(d, a, b, c, M[11], 3174756917, 10);
        c = fnI(c, d, a, b, M[2], 718787259, 15);
        b = fnI(b, c, d, a, M[9], 3951481745, 21);
        this._a = this._a + a | 0;
        this._b = this._b + b | 0;
        this._c = this._c + c | 0;
        this._d = this._d + d | 0;
      };
      MD5.prototype._digest = function() {
        this._block[this._blockOffset++] = 128;
        if (this._blockOffset > 56) {
          this._block.fill(0, this._blockOffset, 64);
          this._update();
          this._blockOffset = 0;
        }
        this._block.fill(0, this._blockOffset, 56);
        this._block.writeUInt32LE(this._length[0], 56);
        this._block.writeUInt32LE(this._length[1], 60);
        this._update();
        var buffer = new Buffer(16);
        buffer.writeInt32LE(this._a, 0);
        buffer.writeInt32LE(this._b, 4);
        buffer.writeInt32LE(this._c, 8);
        buffer.writeInt32LE(this._d, 12);
        return buffer;
      };
      function rotl(x, n) {
        return x << n | x >>> 32 - n;
      }
      function fnF(a, b, c, d, m, k, s) {
        return rotl(a + (b & c | ~b & d) + m + k | 0, s) + b | 0;
      }
      function fnG(a, b, c, d, m, k, s) {
        return rotl(a + (b & d | c & ~d) + m + k | 0, s) + b | 0;
      }
      function fnH(a, b, c, d, m, k, s) {
        return rotl(a + (b ^ c ^ d) + m + k | 0, s) + b | 0;
      }
      function fnI(a, b, c, d, m, k, s) {
        return rotl(a + (c ^ (b | ~d)) + m + k | 0, s) + b | 0;
      }
      module.exports = MD5;
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 47,
    "hash-base": 85,
    inherits: 101
  } ],
  104: [ function(require, module, exports) {
    var bn = require("bn.js");
    var brorand = require("brorand");
    function MillerRabin(rand) {
      this.rand = rand || new brorand.Rand();
    }
    module.exports = MillerRabin;
    MillerRabin.create = function create(rand) {
      return new MillerRabin(rand);
    };
    MillerRabin.prototype._randbelow = function _randbelow(n) {
      var len = n.bitLength();
      var min_bytes = Math.ceil(len / 8);
      do {
        var a = new bn(this.rand.generate(min_bytes));
      } while (a.cmp(n) >= 0);
      return a;
    };
    MillerRabin.prototype._randrange = function _randrange(start, stop) {
      var size = stop.sub(start);
      return start.add(this._randbelow(size));
    };
    MillerRabin.prototype.test = function test(n, k, cb) {
      var len = n.bitLength();
      var red = bn.mont(n);
      var rone = new bn(1).toRed(red);
      k || (k = Math.max(1, len / 48 | 0));
      var n1 = n.subn(1);
      for (var s = 0; !n1.testn(s); s++) ;
      var d = n.shrn(s);
      var rn1 = n1.toRed(red);
      var prime = true;
      for (;k > 0; k--) {
        var a = this._randrange(new bn(2), n1);
        cb && cb(a);
        var x = a.toRed(red).redPow(d);
        if (0 === x.cmp(rone) || 0 === x.cmp(rn1)) continue;
        for (var i = 1; i < s; i++) {
          x = x.redSqr();
          if (0 === x.cmp(rone)) return false;
          if (0 === x.cmp(rn1)) break;
        }
        if (i === s) return false;
      }
      return prime;
    };
    MillerRabin.prototype.getDivisor = function getDivisor(n, k) {
      var len = n.bitLength();
      var red = bn.mont(n);
      var rone = new bn(1).toRed(red);
      k || (k = Math.max(1, len / 48 | 0));
      var n1 = n.subn(1);
      for (var s = 0; !n1.testn(s); s++) ;
      var d = n.shrn(s);
      var rn1 = n1.toRed(red);
      for (;k > 0; k--) {
        var a = this._randrange(new bn(2), n1);
        var g = n.gcd(a);
        if (0 !== g.cmpn(1)) return g;
        var x = a.toRed(red).redPow(d);
        if (0 === x.cmp(rone) || 0 === x.cmp(rn1)) continue;
        for (var i = 1; i < s; i++) {
          x = x.redSqr();
          if (0 === x.cmp(rone)) return x.fromRed().subn(1).gcd(n);
          if (0 === x.cmp(rn1)) break;
        }
        if (i === s) {
          x = x.redSqr();
          return x.fromRed().subn(1).gcd(n);
        }
      }
      return false;
    };
  }, {
    "bn.js": 16,
    brorand: 17
  } ],
  105: [ function(require, module, exports) {
    module.exports = assert;
    function assert(val, msg) {
      if (!val) throw new Error(msg || "Assertion failed");
    }
    assert.equal = function assertEqual(l, r, msg) {
      if (l != r) throw new Error(msg || "Assertion failed: " + l + " != " + r);
    };
  }, {} ],
  106: [ function(require, module, exports) {
    "use strict";
    var utils = exports;
    function toArray(msg, enc) {
      if (Array.isArray(msg)) return msg.slice();
      if (!msg) return [];
      var res = [];
      if ("string" !== typeof msg) {
        for (var i = 0; i < msg.length; i++) res[i] = 0 | msg[i];
        return res;
      }
      if ("hex" === enc) {
        msg = msg.replace(/[^a-z0-9]+/gi, "");
        msg.length % 2 !== 0 && (msg = "0" + msg);
        for (var i = 0; i < msg.length; i += 2) res.push(parseInt(msg[i] + msg[i + 1], 16));
      } else for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        var hi = c >> 8;
        var lo = 255 & c;
        hi ? res.push(hi, lo) : res.push(lo);
      }
      return res;
    }
    utils.toArray = toArray;
    function zero2(word) {
      return 1 === word.length ? "0" + word : word;
    }
    utils.zero2 = zero2;
    function toHex(msg) {
      var res = "";
      for (var i = 0; i < msg.length; i++) res += zero2(msg[i].toString(16));
      return res;
    }
    utils.toHex = toHex;
    utils.encode = function encode(arr, enc) {
      return "hex" === enc ? toHex(arr) : arr;
    };
  }, {} ],
  107: [ function(require, module, exports) {
    module.exports = {
      "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
      "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
      "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
      "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
      "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
      "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
      "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
      "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
      "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
      "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
      "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
      "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
    };
  }, {} ],
  108: [ function(require, module, exports) {
    "use strict";
    var asn1 = require("asn1.js");
    exports.certificate = require("./certificate");
    var RSAPrivateKey = asn1.define("RSAPrivateKey", function() {
      this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int());
    });
    exports.RSAPrivateKey = RSAPrivateKey;
    var RSAPublicKey = asn1.define("RSAPublicKey", function() {
      this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int());
    });
    exports.RSAPublicKey = RSAPublicKey;
    var PublicKey = asn1.define("SubjectPublicKeyInfo", function() {
      this.seq().obj(this.key("algorithm").use(AlgorithmIdentifier), this.key("subjectPublicKey").bitstr());
    });
    exports.PublicKey = PublicKey;
    var AlgorithmIdentifier = asn1.define("AlgorithmIdentifier", function() {
      this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional());
    });
    var PrivateKeyInfo = asn1.define("PrivateKeyInfo", function() {
      this.seq().obj(this.key("version").int(), this.key("algorithm").use(AlgorithmIdentifier), this.key("subjectPrivateKey").octstr());
    });
    exports.PrivateKey = PrivateKeyInfo;
    var EncryptedPrivateKeyInfo = asn1.define("EncryptedPrivateKeyInfo", function() {
      this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
    });
    exports.EncryptedPrivateKey = EncryptedPrivateKeyInfo;
    var DSAPrivateKey = asn1.define("DSAPrivateKey", function() {
      this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int());
    });
    exports.DSAPrivateKey = DSAPrivateKey;
    exports.DSAparam = asn1.define("DSAparam", function() {
      this.int();
    });
    var ECPrivateKey = asn1.define("ECPrivateKey", function() {
      this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(ECParameters), this.key("publicKey").optional().explicit(1).bitstr());
    });
    exports.ECPrivateKey = ECPrivateKey;
    var ECParameters = asn1.define("ECParameters", function() {
      this.choice({
        namedCurve: this.objid()
      });
    });
    exports.signature = asn1.define("signature", function() {
      this.seq().obj(this.key("r").int(), this.key("s").int());
    });
  }, {
    "./certificate": 109,
    "asn1.js": 1
  } ],
  109: [ function(require, module, exports) {
    "use strict";
    var asn = require("asn1.js");
    var Time = asn.define("Time", function() {
      this.choice({
        utcTime: this.utctime(),
        generalTime: this.gentime()
      });
    });
    var AttributeTypeValue = asn.define("AttributeTypeValue", function() {
      this.seq().obj(this.key("type").objid(), this.key("value").any());
    });
    var AlgorithmIdentifier = asn.define("AlgorithmIdentifier", function() {
      this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional());
    });
    var SubjectPublicKeyInfo = asn.define("SubjectPublicKeyInfo", function() {
      this.seq().obj(this.key("algorithm").use(AlgorithmIdentifier), this.key("subjectPublicKey").bitstr());
    });
    var RelativeDistinguishedName = asn.define("RelativeDistinguishedName", function() {
      this.setof(AttributeTypeValue);
    });
    var RDNSequence = asn.define("RDNSequence", function() {
      this.seqof(RelativeDistinguishedName);
    });
    var Name = asn.define("Name", function() {
      this.choice({
        rdnSequence: this.use(RDNSequence)
      });
    });
    var Validity = asn.define("Validity", function() {
      this.seq().obj(this.key("notBefore").use(Time), this.key("notAfter").use(Time));
    });
    var Extension = asn.define("Extension", function() {
      this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(false), this.key("extnValue").octstr());
    });
    var TBSCertificate = asn.define("TBSCertificate", function() {
      this.seq().obj(this.key("version").explicit(0).int(), this.key("serialNumber").int(), this.key("signature").use(AlgorithmIdentifier), this.key("issuer").use(Name), this.key("validity").use(Validity), this.key("subject").use(Name), this.key("subjectPublicKeyInfo").use(SubjectPublicKeyInfo), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(Extension).optional());
    });
    var X509Certificate = asn.define("X509Certificate", function() {
      this.seq().obj(this.key("tbsCertificate").use(TBSCertificate), this.key("signatureAlgorithm").use(AlgorithmIdentifier), this.key("signatureValue").bitstr());
    });
    module.exports = X509Certificate;
  }, {
    "asn1.js": 1
  } ],
  110: [ function(require, module, exports) {
    (function(Buffer) {
      var findProc = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m;
      var startRegex = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----/m;
      var fullRegex = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m;
      var evp = require("evp_bytestokey");
      var ciphers = require("browserify-aes");
      module.exports = function(okey, password) {
        var key = okey.toString();
        var match = key.match(findProc);
        var decrypted;
        if (match) {
          var suite = "aes" + match[1];
          var iv = new Buffer(match[2], "hex");
          var cipherText = new Buffer(match[3].replace(/[\r\n]/g, ""), "base64");
          var cipherKey = evp(password, iv.slice(0, 8), parseInt(match[1], 10)).key;
          var out = [];
          var cipher = ciphers.createDecipheriv(suite, cipherKey, iv);
          out.push(cipher.update(cipherText));
          out.push(cipher.final());
          decrypted = Buffer.concat(out);
        } else {
          var match2 = key.match(fullRegex);
          decrypted = new Buffer(match2[2].replace(/[\r\n]/g, ""), "base64");
        }
        var tag = key.match(startRegex)[1];
        return {
          tag: tag,
          data: decrypted
        };
      };
    }).call(this, require("buffer").Buffer);
  }, {
    "browserify-aes": 21,
    buffer: 47,
    evp_bytestokey: 84
  } ],
  111: [ function(require, module, exports) {
    (function(Buffer) {
      var asn1 = require("./asn1");
      var aesid = require("./aesid.json");
      var fixProc = require("./fixProc");
      var ciphers = require("browserify-aes");
      var compat = require("pbkdf2");
      module.exports = parseKeys;
      function parseKeys(buffer) {
        var password;
        if ("object" === typeof buffer && !Buffer.isBuffer(buffer)) {
          password = buffer.passphrase;
          buffer = buffer.key;
        }
        "string" === typeof buffer && (buffer = new Buffer(buffer));
        var stripped = fixProc(buffer, password);
        var type = stripped.tag;
        var data = stripped.data;
        var subtype, ndata;
        switch (type) {
         case "CERTIFICATE":
          ndata = asn1.certificate.decode(data, "der").tbsCertificate.subjectPublicKeyInfo;

         case "PUBLIC KEY":
          ndata || (ndata = asn1.PublicKey.decode(data, "der"));
          subtype = ndata.algorithm.algorithm.join(".");
          switch (subtype) {
           case "1.2.840.113549.1.1.1":
            return asn1.RSAPublicKey.decode(ndata.subjectPublicKey.data, "der");

           case "1.2.840.10045.2.1":
            ndata.subjectPrivateKey = ndata.subjectPublicKey;
            return {
              type: "ec",
              data: ndata
            };

           case "1.2.840.10040.4.1":
            ndata.algorithm.params.pub_key = asn1.DSAparam.decode(ndata.subjectPublicKey.data, "der");
            return {
              type: "dsa",
              data: ndata.algorithm.params
            };

           default:
            throw new Error("unknown key id " + subtype);
          }
          throw new Error("unknown key type " + type);

         case "ENCRYPTED PRIVATE KEY":
          data = asn1.EncryptedPrivateKey.decode(data, "der");
          data = decrypt(data, password);

         case "PRIVATE KEY":
          ndata = asn1.PrivateKey.decode(data, "der");
          subtype = ndata.algorithm.algorithm.join(".");
          switch (subtype) {
           case "1.2.840.113549.1.1.1":
            return asn1.RSAPrivateKey.decode(ndata.subjectPrivateKey, "der");

           case "1.2.840.10045.2.1":
            return {
              curve: ndata.algorithm.curve,
              privateKey: asn1.ECPrivateKey.decode(ndata.subjectPrivateKey, "der").privateKey
            };

           case "1.2.840.10040.4.1":
            ndata.algorithm.params.priv_key = asn1.DSAparam.decode(ndata.subjectPrivateKey, "der");
            return {
              type: "dsa",
              params: ndata.algorithm.params
            };

           default:
            throw new Error("unknown key id " + subtype);
          }
          throw new Error("unknown key type " + type);

         case "RSA PUBLIC KEY":
          return asn1.RSAPublicKey.decode(data, "der");

         case "RSA PRIVATE KEY":
          return asn1.RSAPrivateKey.decode(data, "der");

         case "DSA PRIVATE KEY":
          return {
            type: "dsa",
            params: asn1.DSAPrivateKey.decode(data, "der")
          };

         case "EC PRIVATE KEY":
          data = asn1.ECPrivateKey.decode(data, "der");
          return {
            curve: data.parameters.value,
            privateKey: data.privateKey
          };

         default:
          throw new Error("unknown key type " + type);
        }
      }
      parseKeys.signature = asn1.signature;
      function decrypt(data, password) {
        var salt = data.algorithm.decrypt.kde.kdeparams.salt;
        var iters = parseInt(data.algorithm.decrypt.kde.kdeparams.iters.toString(), 10);
        var algo = aesid[data.algorithm.decrypt.cipher.algo.join(".")];
        var iv = data.algorithm.decrypt.cipher.iv;
        var cipherText = data.subjectPrivateKey;
        var keylen = parseInt(algo.split("-")[1], 10) / 8;
        var key = compat.pbkdf2Sync(password, salt, iters, keylen);
        var cipher = ciphers.createDecipheriv(algo, key, iv);
        var out = [];
        out.push(cipher.update(cipherText));
        out.push(cipher.final());
        return Buffer.concat(out);
      }
    }).call(this, require("buffer").Buffer);
  }, {
    "./aesid.json": 107,
    "./asn1": 108,
    "./fixProc": 110,
    "browserify-aes": 21,
    buffer: 47,
    pbkdf2: 112
  } ],
  112: [ function(require, module, exports) {
    exports.pbkdf2 = require("./lib/async");
    exports.pbkdf2Sync = require("./lib/sync");
  }, {
    "./lib/async": 113,
    "./lib/sync": 116
  } ],
  113: [ function(require, module, exports) {
    (function(process, global) {
      var checkParameters = require("./precondition");
      var defaultEncoding = require("./default-encoding");
      var sync = require("./sync");
      var Buffer = require("safe-buffer").Buffer;
      var ZERO_BUF;
      var subtle = global.crypto && global.crypto.subtle;
      var toBrowser = {
        sha: "SHA-1",
        "sha-1": "SHA-1",
        sha1: "SHA-1",
        sha256: "SHA-256",
        "sha-256": "SHA-256",
        sha384: "SHA-384",
        "sha-384": "SHA-384",
        "sha-512": "SHA-512",
        sha512: "SHA-512"
      };
      var checks = [];
      function checkNative(algo) {
        if (global.process && !global.process.browser) return Promise.resolve(false);
        if (!subtle || !subtle.importKey || !subtle.deriveBits) return Promise.resolve(false);
        if (void 0 !== checks[algo]) return checks[algo];
        ZERO_BUF = ZERO_BUF || Buffer.alloc(8);
        var prom = browserPbkdf2(ZERO_BUF, ZERO_BUF, 10, 128, algo).then(function() {
          return true;
        }).catch(function() {
          return false;
        });
        checks[algo] = prom;
        return prom;
      }
      function browserPbkdf2(password, salt, iterations, length, algo) {
        return subtle.importKey("raw", password, {
          name: "PBKDF2"
        }, false, [ "deriveBits" ]).then(function(key) {
          return subtle.deriveBits({
            name: "PBKDF2",
            salt: salt,
            iterations: iterations,
            hash: {
              name: algo
            }
          }, key, length << 3);
        }).then(function(res) {
          return Buffer.from(res);
        });
      }
      function resolvePromise(promise, callback) {
        promise.then(function(out) {
          process.nextTick(function() {
            callback(null, out);
          });
        }, function(e) {
          process.nextTick(function() {
            callback(e);
          });
        });
      }
      module.exports = function(password, salt, iterations, keylen, digest, callback) {
        if ("function" === typeof digest) {
          callback = digest;
          digest = void 0;
        }
        digest = digest || "sha1";
        var algo = toBrowser[digest.toLowerCase()];
        if (!algo || "function" !== typeof global.Promise) return process.nextTick(function() {
          var out;
          try {
            out = sync(password, salt, iterations, keylen, digest);
          } catch (e) {
            return callback(e);
          }
          callback(null, out);
        });
        checkParameters(password, salt, iterations, keylen);
        if ("function" !== typeof callback) throw new Error("No callback provided to pbkdf2");
        Buffer.isBuffer(password) || (password = Buffer.from(password, defaultEncoding));
        Buffer.isBuffer(salt) || (salt = Buffer.from(salt, defaultEncoding));
        resolvePromise(checkNative(algo).then(function(resp) {
          if (resp) return browserPbkdf2(password, salt, iterations, keylen, algo);
          return sync(password, salt, iterations, keylen, digest);
        }), callback);
      };
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "./default-encoding": 114,
    "./precondition": 115,
    "./sync": 116,
    _process: 118,
    "safe-buffer": 143
  } ],
  114: [ function(require, module, exports) {
    (function(process) {
      var defaultEncoding;
      if (process.browser) defaultEncoding = "utf-8"; else {
        var pVersionMajor = parseInt(process.version.split(".")[0].slice(1), 10);
        defaultEncoding = pVersionMajor >= 6 ? "utf-8" : "binary";
      }
      module.exports = defaultEncoding;
    }).call(this, require("_process"));
  }, {
    _process: 118
  } ],
  115: [ function(require, module, exports) {
    (function(Buffer) {
      var MAX_ALLOC = Math.pow(2, 30) - 1;
      function checkBuffer(buf, name) {
        if ("string" !== typeof buf && !Buffer.isBuffer(buf)) throw new TypeError(name + " must be a buffer or string");
      }
      module.exports = function(password, salt, iterations, keylen) {
        checkBuffer(password, "Password");
        checkBuffer(salt, "Salt");
        if ("number" !== typeof iterations) throw new TypeError("Iterations not a number");
        if (iterations < 0) throw new TypeError("Bad iterations");
        if ("number" !== typeof keylen) throw new TypeError("Key length not a number");
        if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) throw new TypeError("Bad key length");
      };
    }).call(this, {
      isBuffer: require("../../is-buffer/index.js")
    });
  }, {
    "../../is-buffer/index.js": 102
  } ],
  116: [ function(require, module, exports) {
    var md5 = require("create-hash/md5");
    var rmd160 = require("ripemd160");
    var sha = require("sha.js");
    var checkParameters = require("./precondition");
    var defaultEncoding = require("./default-encoding");
    var Buffer = require("safe-buffer").Buffer;
    var ZEROS = Buffer.alloc(128);
    var sizes = {
      md5: 16,
      sha1: 20,
      sha224: 28,
      sha256: 32,
      sha384: 48,
      sha512: 64,
      rmd160: 20,
      ripemd160: 20
    };
    function Hmac(alg, key, saltLen) {
      var hash = getDigest(alg);
      var blocksize = "sha512" === alg || "sha384" === alg ? 128 : 64;
      key.length > blocksize ? key = hash(key) : key.length < blocksize && (key = Buffer.concat([ key, ZEROS ], blocksize));
      var ipad = Buffer.allocUnsafe(blocksize + sizes[alg]);
      var opad = Buffer.allocUnsafe(blocksize + sizes[alg]);
      for (var i = 0; i < blocksize; i++) {
        ipad[i] = 54 ^ key[i];
        opad[i] = 92 ^ key[i];
      }
      var ipad1 = Buffer.allocUnsafe(blocksize + saltLen + 4);
      ipad.copy(ipad1, 0, 0, blocksize);
      this.ipad1 = ipad1;
      this.ipad2 = ipad;
      this.opad = opad;
      this.alg = alg;
      this.blocksize = blocksize;
      this.hash = hash;
      this.size = sizes[alg];
    }
    Hmac.prototype.run = function(data, ipad) {
      data.copy(ipad, this.blocksize);
      var h = this.hash(ipad);
      h.copy(this.opad, this.blocksize);
      return this.hash(this.opad);
    };
    function getDigest(alg) {
      function shaFunc(data) {
        return sha(alg).update(data).digest();
      }
      if ("rmd160" === alg || "ripemd160" === alg) return rmd160;
      if ("md5" === alg) return md5;
      return shaFunc;
    }
    function pbkdf2(password, salt, iterations, keylen, digest) {
      checkParameters(password, salt, iterations, keylen);
      Buffer.isBuffer(password) || (password = Buffer.from(password, defaultEncoding));
      Buffer.isBuffer(salt) || (salt = Buffer.from(salt, defaultEncoding));
      digest = digest || "sha1";
      var hmac = new Hmac(digest, password, salt.length);
      var DK = Buffer.allocUnsafe(keylen);
      var block1 = Buffer.allocUnsafe(salt.length + 4);
      salt.copy(block1, 0, 0, salt.length);
      var destPos = 0;
      var hLen = sizes[digest];
      var l = Math.ceil(keylen / hLen);
      for (var i = 1; i <= l; i++) {
        block1.writeUInt32BE(i, salt.length);
        var T = hmac.run(block1, hmac.ipad1);
        var U = T;
        for (var j = 1; j < iterations; j++) {
          U = hmac.run(U, hmac.ipad2);
          for (var k = 0; k < hLen; k++) T[k] ^= U[k];
        }
        T.copy(DK, destPos);
        destPos += hLen;
      }
      return DK;
    }
    module.exports = pbkdf2;
  }, {
    "./default-encoding": 114,
    "./precondition": 115,
    "create-hash/md5": 53,
    ripemd160: 142,
    "safe-buffer": 143,
    "sha.js": 145
  } ],
  117: [ function(require, module, exports) {
    (function(process) {
      "use strict";
      !process.version || 0 === process.version.indexOf("v0.") || 0 === process.version.indexOf("v1.") && 0 !== process.version.indexOf("v1.8.") ? module.exports = {
        nextTick: nextTick
      } : module.exports = process;
      function nextTick(fn, arg1, arg2, arg3) {
        if ("function" !== typeof fn) throw new TypeError('"callback" argument must be a function');
        var len = arguments.length;
        var args, i;
        switch (len) {
         case 0:
         case 1:
          return process.nextTick(fn);

         case 2:
          return process.nextTick(function afterTickOne() {
            fn.call(null, arg1);
          });

         case 3:
          return process.nextTick(function afterTickTwo() {
            fn.call(null, arg1, arg2);
          });

         case 4:
          return process.nextTick(function afterTickThree() {
            fn.call(null, arg1, arg2, arg3);
          });

         default:
          args = new Array(len - 1);
          i = 0;
          while (i < args.length) args[i++] = arguments[i];
          return process.nextTick(function afterTick() {
            fn.apply(null, args);
          });
        }
      }
    }).call(this, require("_process"));
  }, {
    _process: 118
  } ],
  118: [ function(require, module, exports) {
    var process = module.exports = {};
    var cachedSetTimeout;
    var cachedClearTimeout;
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        cachedSetTimeout = "function" === typeof setTimeout ? setTimeout : defaultSetTimout;
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        cachedClearTimeout = "function" === typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    function cleanUpNextTick() {
      if (!draining || !currentQueue) return;
      draining = false;
      currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1;
      queue.length && drainQueue();
    }
    function drainQueue() {
      if (draining) return;
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) currentQueue && currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }
    process.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
      queue.push(new Item(fun, args));
      1 !== queue.length || draining || runTimeout(drainQueue);
    };
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process.title = "browser";
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = "";
    process.versions = {};
    function noop() {}
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    process.listeners = function(name) {
      return [];
    };
    process.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process.cwd = function() {
      return "/";
    };
    process.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process.umask = function() {
      return 0;
    };
  }, {} ],
  119: [ function(require, module, exports) {
    exports.publicEncrypt = require("./publicEncrypt");
    exports.privateDecrypt = require("./privateDecrypt");
    exports.privateEncrypt = function privateEncrypt(key, buf) {
      return exports.publicEncrypt(key, buf, true);
    };
    exports.publicDecrypt = function publicDecrypt(key, buf) {
      return exports.privateDecrypt(key, buf, true);
    };
  }, {
    "./privateDecrypt": 121,
    "./publicEncrypt": 122
  } ],
  120: [ function(require, module, exports) {
    (function(Buffer) {
      var createHash = require("create-hash");
      module.exports = function(seed, len) {
        var t = new Buffer("");
        var i = 0, c;
        while (t.length < len) {
          c = i2ops(i++);
          t = Buffer.concat([ t, createHash("sha1").update(seed).update(c).digest() ]);
        }
        return t.slice(0, len);
      };
      function i2ops(c) {
        var out = new Buffer(4);
        out.writeUInt32BE(c, 0);
        return out;
      }
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 47,
    "create-hash": 52
  } ],
  121: [ function(require, module, exports) {
    (function(Buffer) {
      var parseKeys = require("parse-asn1");
      var mgf = require("./mgf");
      var xor = require("./xor");
      var bn = require("bn.js");
      var crt = require("browserify-rsa");
      var createHash = require("create-hash");
      var withPublic = require("./withPublic");
      module.exports = function privateDecrypt(private_key, enc, reverse) {
        var padding;
        padding = private_key.padding ? private_key.padding : reverse ? 1 : 4;
        var key = parseKeys(private_key);
        var k = key.modulus.byteLength();
        if (enc.length > k || new bn(enc).cmp(key.modulus) >= 0) throw new Error("decryption error");
        var msg;
        msg = reverse ? withPublic(new bn(enc), key) : crt(enc, key);
        var zBuffer = new Buffer(k - msg.length);
        zBuffer.fill(0);
        msg = Buffer.concat([ zBuffer, msg ], k);
        if (4 === padding) return oaep(key, msg);
        if (1 === padding) return pkcs1(key, msg, reverse);
        if (3 === padding) return msg;
        throw new Error("unknown padding");
      };
      function oaep(key, msg) {
        var n = key.modulus;
        var k = key.modulus.byteLength();
        var mLen = msg.length;
        var iHash = createHash("sha1").update(new Buffer("")).digest();
        var hLen = iHash.length;
        var hLen2 = 2 * hLen;
        if (0 !== msg[0]) throw new Error("decryption error");
        var maskedSeed = msg.slice(1, hLen + 1);
        var maskedDb = msg.slice(hLen + 1);
        var seed = xor(maskedSeed, mgf(maskedDb, hLen));
        var db = xor(maskedDb, mgf(seed, k - hLen - 1));
        if (compare(iHash, db.slice(0, hLen))) throw new Error("decryption error");
        var i = hLen;
        while (0 === db[i]) i++;
        if (1 !== db[i++]) throw new Error("decryption error");
        return db.slice(i);
      }
      function pkcs1(key, msg, reverse) {
        var p1 = msg.slice(0, 2);
        var i = 2;
        var status = 0;
        while (0 !== msg[i++]) if (i >= msg.length) {
          status++;
          break;
        }
        var ps = msg.slice(2, i - 1);
        var p2 = msg.slice(i - 1, i);
        ("0002" !== p1.toString("hex") && !reverse || "0001" !== p1.toString("hex") && reverse) && status++;
        ps.length < 8 && status++;
        if (status) throw new Error("decryption error");
        return msg.slice(i);
      }
      function compare(a, b) {
        a = new Buffer(a);
        b = new Buffer(b);
        var dif = 0;
        var len = a.length;
        if (a.length !== b.length) {
          dif++;
          len = Math.min(a.length, b.length);
        }
        var i = -1;
        while (++i < len) dif += a[i] ^ b[i];
        return dif;
      }
    }).call(this, require("buffer").Buffer);
  }, {
    "./mgf": 120,
    "./withPublic": 123,
    "./xor": 124,
    "bn.js": 16,
    "browserify-rsa": 39,
    buffer: 47,
    "create-hash": 52,
    "parse-asn1": 111
  } ],
  122: [ function(require, module, exports) {
    (function(Buffer) {
      var parseKeys = require("parse-asn1");
      var randomBytes = require("randombytes");
      var createHash = require("create-hash");
      var mgf = require("./mgf");
      var xor = require("./xor");
      var bn = require("bn.js");
      var withPublic = require("./withPublic");
      var crt = require("browserify-rsa");
      var constants = {
        RSA_PKCS1_OAEP_PADDING: 4,
        RSA_PKCS1_PADDIN: 1,
        RSA_NO_PADDING: 3
      };
      module.exports = function publicEncrypt(public_key, msg, reverse) {
        var padding;
        padding = public_key.padding ? public_key.padding : reverse ? 1 : 4;
        var key = parseKeys(public_key);
        var paddedMsg;
        if (4 === padding) paddedMsg = oaep(key, msg); else if (1 === padding) paddedMsg = pkcs1(key, msg, reverse); else {
          if (3 !== padding) throw new Error("unknown padding");
          paddedMsg = new bn(msg);
          if (paddedMsg.cmp(key.modulus) >= 0) throw new Error("data too long for modulus");
        }
        return reverse ? crt(paddedMsg, key) : withPublic(paddedMsg, key);
      };
      function oaep(key, msg) {
        var k = key.modulus.byteLength();
        var mLen = msg.length;
        var iHash = createHash("sha1").update(new Buffer("")).digest();
        var hLen = iHash.length;
        var hLen2 = 2 * hLen;
        if (mLen > k - hLen2 - 2) throw new Error("message too long");
        var ps = new Buffer(k - mLen - hLen2 - 2);
        ps.fill(0);
        var dblen = k - hLen - 1;
        var seed = randomBytes(hLen);
        var maskedDb = xor(Buffer.concat([ iHash, ps, new Buffer([ 1 ]), msg ], dblen), mgf(seed, dblen));
        var maskedSeed = xor(seed, mgf(maskedDb, hLen));
        return new bn(Buffer.concat([ new Buffer([ 0 ]), maskedSeed, maskedDb ], k));
      }
      function pkcs1(key, msg, reverse) {
        var mLen = msg.length;
        var k = key.modulus.byteLength();
        if (mLen > k - 11) throw new Error("message too long");
        var ps;
        if (reverse) {
          ps = new Buffer(k - mLen - 3);
          ps.fill(255);
        } else ps = nonZero(k - mLen - 3);
        return new bn(Buffer.concat([ new Buffer([ 0, reverse ? 1 : 2 ]), ps, new Buffer([ 0 ]), msg ], k));
      }
      function nonZero(len, crypto) {
        var out = new Buffer(len);
        var i = 0;
        var cache = randomBytes(2 * len);
        var cur = 0;
        var num;
        while (i < len) {
          if (cur === cache.length) {
            cache = randomBytes(2 * len);
            cur = 0;
          }
          num = cache[cur++];
          num && (out[i++] = num);
        }
        return out;
      }
    }).call(this, require("buffer").Buffer);
  }, {
    "./mgf": 120,
    "./withPublic": 123,
    "./xor": 124,
    "bn.js": 16,
    "browserify-rsa": 39,
    buffer: 47,
    "create-hash": 52,
    "parse-asn1": 111,
    randombytes: 125
  } ],
  123: [ function(require, module, exports) {
    (function(Buffer) {
      var bn = require("bn.js");
      function withPublic(paddedMsg, key) {
        return new Buffer(paddedMsg.toRed(bn.mont(key.modulus)).redPow(new bn(key.publicExponent)).fromRed().toArray());
      }
      module.exports = withPublic;
    }).call(this, require("buffer").Buffer);
  }, {
    "bn.js": 16,
    buffer: 47
  } ],
  124: [ function(require, module, exports) {
    module.exports = function xor(a, b) {
      var len = a.length;
      var i = -1;
      while (++i < len) a[i] ^= b[i];
      return a;
    };
  }, {} ],
  125: [ function(require, module, exports) {
    (function(process, global) {
      "use strict";
      function oldBrowser() {
        throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
      }
      var Buffer = require("safe-buffer").Buffer;
      var crypto = global.crypto || global.msCrypto;
      crypto && crypto.getRandomValues ? module.exports = randomBytes : module.exports = oldBrowser;
      function randomBytes(size, cb) {
        if (size > 65536) throw new Error("requested too many random bytes");
        var rawBytes = new global.Uint8Array(size);
        size > 0 && crypto.getRandomValues(rawBytes);
        var bytes = Buffer.from(rawBytes.buffer);
        if ("function" === typeof cb) return process.nextTick(function() {
          cb(null, bytes);
        });
        return bytes;
      }
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    _process: 118,
    "safe-buffer": 143
  } ],
  126: [ function(require, module, exports) {
    (function(process, global) {
      "use strict";
      function oldBrowser() {
        throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
      }
      var safeBuffer = require("safe-buffer");
      var randombytes = require("randombytes");
      var Buffer = safeBuffer.Buffer;
      var kBufferMaxLength = safeBuffer.kMaxLength;
      var crypto = global.crypto || global.msCrypto;
      var kMaxUint32 = Math.pow(2, 32) - 1;
      function assertOffset(offset, length) {
        if ("number" !== typeof offset || offset !== offset) throw new TypeError("offset must be a number");
        if (offset > kMaxUint32 || offset < 0) throw new TypeError("offset must be a uint32");
        if (offset > kBufferMaxLength || offset > length) throw new RangeError("offset out of range");
      }
      function assertSize(size, offset, length) {
        if ("number" !== typeof size || size !== size) throw new TypeError("size must be a number");
        if (size > kMaxUint32 || size < 0) throw new TypeError("size must be a uint32");
        if (size + offset > length || size > kBufferMaxLength) throw new RangeError("buffer too small");
      }
      if (crypto && crypto.getRandomValues || !process.browser) {
        exports.randomFill = randomFill;
        exports.randomFillSync = randomFillSync;
      } else {
        exports.randomFill = oldBrowser;
        exports.randomFillSync = oldBrowser;
      }
      function randomFill(buf, offset, size, cb) {
        if (!Buffer.isBuffer(buf) && !(buf instanceof global.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
        if ("function" === typeof offset) {
          cb = offset;
          offset = 0;
          size = buf.length;
        } else if ("function" === typeof size) {
          cb = size;
          size = buf.length - offset;
        } else if ("function" !== typeof cb) throw new TypeError('"cb" argument must be a function');
        assertOffset(offset, buf.length);
        assertSize(size, offset, buf.length);
        return actualFill(buf, offset, size, cb);
      }
      function actualFill(buf, offset, size, cb) {
        if (process.browser) {
          var ourBuf = buf.buffer;
          var uint = new Uint8Array(ourBuf, offset, size);
          crypto.getRandomValues(uint);
          if (cb) {
            process.nextTick(function() {
              cb(null, buf);
            });
            return;
          }
          return buf;
        }
        if (cb) {
          randombytes(size, function(err, bytes) {
            if (err) return cb(err);
            bytes.copy(buf, offset);
            cb(null, buf);
          });
          return;
        }
        var bytes = randombytes(size);
        bytes.copy(buf, offset);
        return buf;
      }
      function randomFillSync(buf, offset, size) {
        "undefined" === typeof offset && (offset = 0);
        if (!Buffer.isBuffer(buf) && !(buf instanceof global.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
        assertOffset(offset, buf.length);
        void 0 === size && (size = buf.length - offset);
        assertSize(size, offset, buf.length);
        return actualFill(buf, offset, size);
      }
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    _process: 118,
    randombytes: 125,
    "safe-buffer": 143
  } ],
  127: [ function(require, module, exports) {
    module.exports = require("./lib/_stream_duplex.js");
  }, {
    "./lib/_stream_duplex.js": 128
  } ],
  128: [ function(require, module, exports) {
    "use strict";
    var pna = require("process-nextick-args");
    var objectKeys = Object.keys || function(obj) {
      var keys = [];
      for (var key in obj) keys.push(key);
      return keys;
    };
    module.exports = Duplex;
    var util = require("core-util-is");
    util.inherits = require("inherits");
    var Readable = require("./_stream_readable");
    var Writable = require("./_stream_writable");
    util.inherits(Duplex, Readable);
    var keys = objectKeys(Writable.prototype);
    for (var v = 0; v < keys.length; v++) {
      var method = keys[v];
      Duplex.prototype[method] || (Duplex.prototype[method] = Writable.prototype[method]);
    }
    function Duplex(options) {
      if (!(this instanceof Duplex)) return new Duplex(options);
      Readable.call(this, options);
      Writable.call(this, options);
      options && false === options.readable && (this.readable = false);
      options && false === options.writable && (this.writable = false);
      this.allowHalfOpen = true;
      options && false === options.allowHalfOpen && (this.allowHalfOpen = false);
      this.once("end", onend);
    }
    Object.defineProperty(Duplex.prototype, "writableHighWaterMark", {
      enumerable: false,
      get: function() {
        return this._writableState.highWaterMark;
      }
    });
    function onend() {
      if (this.allowHalfOpen || this._writableState.ended) return;
      pna.nextTick(onEndNT, this);
    }
    function onEndNT(self) {
      self.end();
    }
    Object.defineProperty(Duplex.prototype, "destroyed", {
      get: function() {
        if (void 0 === this._readableState || void 0 === this._writableState) return false;
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function(value) {
        if (void 0 === this._readableState || void 0 === this._writableState) return;
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
    Duplex.prototype._destroy = function(err, cb) {
      this.push(null);
      this.end();
      pna.nextTick(cb, err);
    };
  }, {
    "./_stream_readable": 130,
    "./_stream_writable": 132,
    "core-util-is": 50,
    inherits: 101,
    "process-nextick-args": 117
  } ],
  129: [ function(require, module, exports) {
    "use strict";
    module.exports = PassThrough;
    var Transform = require("./_stream_transform");
    var util = require("core-util-is");
    util.inherits = require("inherits");
    util.inherits(PassThrough, Transform);
    function PassThrough(options) {
      if (!(this instanceof PassThrough)) return new PassThrough(options);
      Transform.call(this, options);
    }
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }, {
    "./_stream_transform": 131,
    "core-util-is": 50,
    inherits: 101
  } ],
  130: [ function(require, module, exports) {
    (function(process, global) {
      "use strict";
      var pna = require("process-nextick-args");
      module.exports = Readable;
      var isArray = require("isarray");
      var Duplex;
      Readable.ReadableState = ReadableState;
      var EE = require("events").EventEmitter;
      var EElistenerCount = function(emitter, type) {
        return emitter.listeners(type).length;
      };
      var Stream = require("./internal/streams/stream");
      var Buffer = require("safe-buffer").Buffer;
      var OurUint8Array = global.Uint8Array || function() {};
      function _uint8ArrayToBuffer(chunk) {
        return Buffer.from(chunk);
      }
      function _isUint8Array(obj) {
        return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
      }
      var util = require("core-util-is");
      util.inherits = require("inherits");
      var debugUtil = require("util");
      var debug = void 0;
      debug = debugUtil && debugUtil.debuglog ? debugUtil.debuglog("stream") : function() {};
      var BufferList = require("./internal/streams/BufferList");
      var destroyImpl = require("./internal/streams/destroy");
      var StringDecoder;
      util.inherits(Readable, Stream);
      var kProxyEvents = [ "error", "close", "destroy", "pause", "resume" ];
      function prependListener(emitter, event, fn) {
        if ("function" === typeof emitter.prependListener) return emitter.prependListener(event, fn);
        emitter._events && emitter._events[event] ? isArray(emitter._events[event]) ? emitter._events[event].unshift(fn) : emitter._events[event] = [ fn, emitter._events[event] ] : emitter.on(event, fn);
      }
      function ReadableState(options, stream) {
        Duplex = Duplex || require("./_stream_duplex");
        options = options || {};
        var isDuplex = stream instanceof Duplex;
        this.objectMode = !!options.objectMode;
        isDuplex && (this.objectMode = this.objectMode || !!options.readableObjectMode);
        var hwm = options.highWaterMark;
        var readableHwm = options.readableHighWaterMark;
        var defaultHwm = this.objectMode ? 16 : 16384;
        this.highWaterMark = hwm || 0 === hwm ? hwm : isDuplex && (readableHwm || 0 === readableHwm) ? readableHwm : defaultHwm;
        this.highWaterMark = Math.floor(this.highWaterMark);
        this.buffer = new BufferList();
        this.length = 0;
        this.pipes = null;
        this.pipesCount = 0;
        this.flowing = null;
        this.ended = false;
        this.endEmitted = false;
        this.reading = false;
        this.sync = true;
        this.needReadable = false;
        this.emittedReadable = false;
        this.readableListening = false;
        this.resumeScheduled = false;
        this.destroyed = false;
        this.defaultEncoding = options.defaultEncoding || "utf8";
        this.awaitDrain = 0;
        this.readingMore = false;
        this.decoder = null;
        this.encoding = null;
        if (options.encoding) {
          StringDecoder || (StringDecoder = require("string_decoder/").StringDecoder);
          this.decoder = new StringDecoder(options.encoding);
          this.encoding = options.encoding;
        }
      }
      function Readable(options) {
        Duplex = Duplex || require("./_stream_duplex");
        if (!(this instanceof Readable)) return new Readable(options);
        this._readableState = new ReadableState(options, this);
        this.readable = true;
        if (options) {
          "function" === typeof options.read && (this._read = options.read);
          "function" === typeof options.destroy && (this._destroy = options.destroy);
        }
        Stream.call(this);
      }
      Object.defineProperty(Readable.prototype, "destroyed", {
        get: function() {
          if (void 0 === this._readableState) return false;
          return this._readableState.destroyed;
        },
        set: function(value) {
          if (!this._readableState) return;
          this._readableState.destroyed = value;
        }
      });
      Readable.prototype.destroy = destroyImpl.destroy;
      Readable.prototype._undestroy = destroyImpl.undestroy;
      Readable.prototype._destroy = function(err, cb) {
        this.push(null);
        cb(err);
      };
      Readable.prototype.push = function(chunk, encoding) {
        var state = this._readableState;
        var skipChunkCheck;
        if (state.objectMode) skipChunkCheck = true; else if ("string" === typeof chunk) {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
        return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
      };
      Readable.prototype.unshift = function(chunk) {
        return readableAddChunk(this, chunk, null, true, false);
      };
      function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
        var state = stream._readableState;
        if (null === chunk) {
          state.reading = false;
          onEofChunk(stream, state);
        } else {
          var er;
          skipChunkCheck || (er = chunkInvalid(state, chunk));
          if (er) stream.emit("error", er); else if (state.objectMode || chunk && chunk.length > 0) {
            "string" === typeof chunk || state.objectMode || Object.getPrototypeOf(chunk) === Buffer.prototype || (chunk = _uint8ArrayToBuffer(chunk));
            if (addToFront) state.endEmitted ? stream.emit("error", new Error("stream.unshift() after end event")) : addChunk(stream, state, chunk, true); else if (state.ended) stream.emit("error", new Error("stream.push() after EOF")); else {
              state.reading = false;
              if (state.decoder && !encoding) {
                chunk = state.decoder.write(chunk);
                state.objectMode || 0 !== chunk.length ? addChunk(stream, state, chunk, false) : maybeReadMore(stream, state);
              } else addChunk(stream, state, chunk, false);
            }
          } else addToFront || (state.reading = false);
        }
        return needMoreData(state);
      }
      function addChunk(stream, state, chunk, addToFront) {
        if (state.flowing && 0 === state.length && !state.sync) {
          stream.emit("data", chunk);
          stream.read(0);
        } else {
          state.length += state.objectMode ? 1 : chunk.length;
          addToFront ? state.buffer.unshift(chunk) : state.buffer.push(chunk);
          state.needReadable && emitReadable(stream);
        }
        maybeReadMore(stream, state);
      }
      function chunkInvalid(state, chunk) {
        var er;
        _isUint8Array(chunk) || "string" === typeof chunk || void 0 === chunk || state.objectMode || (er = new TypeError("Invalid non-string/buffer chunk"));
        return er;
      }
      function needMoreData(state) {
        return !state.ended && (state.needReadable || state.length < state.highWaterMark || 0 === state.length);
      }
      Readable.prototype.isPaused = function() {
        return false === this._readableState.flowing;
      };
      Readable.prototype.setEncoding = function(enc) {
        StringDecoder || (StringDecoder = require("string_decoder/").StringDecoder);
        this._readableState.decoder = new StringDecoder(enc);
        this._readableState.encoding = enc;
        return this;
      };
      var MAX_HWM = 8388608;
      function computeNewHighWaterMark(n) {
        if (n >= MAX_HWM) n = MAX_HWM; else {
          n--;
          n |= n >>> 1;
          n |= n >>> 2;
          n |= n >>> 4;
          n |= n >>> 8;
          n |= n >>> 16;
          n++;
        }
        return n;
      }
      function howMuchToRead(n, state) {
        if (n <= 0 || 0 === state.length && state.ended) return 0;
        if (state.objectMode) return 1;
        if (n !== n) return state.flowing && state.length ? state.buffer.head.data.length : state.length;
        n > state.highWaterMark && (state.highWaterMark = computeNewHighWaterMark(n));
        if (n <= state.length) return n;
        if (!state.ended) {
          state.needReadable = true;
          return 0;
        }
        return state.length;
      }
      Readable.prototype.read = function(n) {
        debug("read", n);
        n = parseInt(n, 10);
        var state = this._readableState;
        var nOrig = n;
        0 !== n && (state.emittedReadable = false);
        if (0 === n && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
          debug("read: emitReadable", state.length, state.ended);
          0 === state.length && state.ended ? endReadable(this) : emitReadable(this);
          return null;
        }
        n = howMuchToRead(n, state);
        if (0 === n && state.ended) {
          0 === state.length && endReadable(this);
          return null;
        }
        var doRead = state.needReadable;
        debug("need readable", doRead);
        if (0 === state.length || state.length - n < state.highWaterMark) {
          doRead = true;
          debug("length less than watermark", doRead);
        }
        if (state.ended || state.reading) {
          doRead = false;
          debug("reading or ended", doRead);
        } else if (doRead) {
          debug("do read");
          state.reading = true;
          state.sync = true;
          0 === state.length && (state.needReadable = true);
          this._read(state.highWaterMark);
          state.sync = false;
          state.reading || (n = howMuchToRead(nOrig, state));
        }
        var ret;
        ret = n > 0 ? fromList(n, state) : null;
        if (null === ret) {
          state.needReadable = true;
          n = 0;
        } else state.length -= n;
        if (0 === state.length) {
          state.ended || (state.needReadable = true);
          nOrig !== n && state.ended && endReadable(this);
        }
        null !== ret && this.emit("data", ret);
        return ret;
      };
      function onEofChunk(stream, state) {
        if (state.ended) return;
        if (state.decoder) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length) {
            state.buffer.push(chunk);
            state.length += state.objectMode ? 1 : chunk.length;
          }
        }
        state.ended = true;
        emitReadable(stream);
      }
      function emitReadable(stream) {
        var state = stream._readableState;
        state.needReadable = false;
        if (!state.emittedReadable) {
          debug("emitReadable", state.flowing);
          state.emittedReadable = true;
          state.sync ? pna.nextTick(emitReadable_, stream) : emitReadable_(stream);
        }
      }
      function emitReadable_(stream) {
        debug("emit readable");
        stream.emit("readable");
        flow(stream);
      }
      function maybeReadMore(stream, state) {
        if (!state.readingMore) {
          state.readingMore = true;
          pna.nextTick(maybeReadMore_, stream, state);
        }
      }
      function maybeReadMore_(stream, state) {
        var len = state.length;
        while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
          debug("maybeReadMore read 0");
          stream.read(0);
          if (len === state.length) break;
          len = state.length;
        }
        state.readingMore = false;
      }
      Readable.prototype._read = function(n) {
        this.emit("error", new Error("_read() is not implemented"));
      };
      Readable.prototype.pipe = function(dest, pipeOpts) {
        var src = this;
        var state = this._readableState;
        switch (state.pipesCount) {
         case 0:
          state.pipes = dest;
          break;

         case 1:
          state.pipes = [ state.pipes, dest ];
          break;

         default:
          state.pipes.push(dest);
        }
        state.pipesCount += 1;
        debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
        var doEnd = (!pipeOpts || false !== pipeOpts.end) && dest !== process.stdout && dest !== process.stderr;
        var endFn = doEnd ? onend : unpipe;
        state.endEmitted ? pna.nextTick(endFn) : src.once("end", endFn);
        dest.on("unpipe", onunpipe);
        function onunpipe(readable, unpipeInfo) {
          debug("onunpipe");
          if (readable === src && unpipeInfo && false === unpipeInfo.hasUnpiped) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
        function onend() {
          debug("onend");
          dest.end();
        }
        var ondrain = pipeOnDrain(src);
        dest.on("drain", ondrain);
        var cleanedUp = false;
        function cleanup() {
          debug("cleanup");
          dest.removeListener("close", onclose);
          dest.removeListener("finish", onfinish);
          dest.removeListener("drain", ondrain);
          dest.removeListener("error", onerror);
          dest.removeListener("unpipe", onunpipe);
          src.removeListener("end", onend);
          src.removeListener("end", unpipe);
          src.removeListener("data", ondata);
          cleanedUp = true;
          !state.awaitDrain || dest._writableState && !dest._writableState.needDrain || ondrain();
        }
        var increasedAwaitDrain = false;
        src.on("data", ondata);
        function ondata(chunk) {
          debug("ondata");
          increasedAwaitDrain = false;
          var ret = dest.write(chunk);
          if (false === ret && !increasedAwaitDrain) {
            if ((1 === state.pipesCount && state.pipes === dest || state.pipesCount > 1 && -1 !== indexOf(state.pipes, dest)) && !cleanedUp) {
              debug("false write response, pause", src._readableState.awaitDrain);
              src._readableState.awaitDrain++;
              increasedAwaitDrain = true;
            }
            src.pause();
          }
        }
        function onerror(er) {
          debug("onerror", er);
          unpipe();
          dest.removeListener("error", onerror);
          0 === EElistenerCount(dest, "error") && dest.emit("error", er);
        }
        prependListener(dest, "error", onerror);
        function onclose() {
          dest.removeListener("finish", onfinish);
          unpipe();
        }
        dest.once("close", onclose);
        function onfinish() {
          debug("onfinish");
          dest.removeListener("close", onclose);
          unpipe();
        }
        dest.once("finish", onfinish);
        function unpipe() {
          debug("unpipe");
          src.unpipe(dest);
        }
        dest.emit("pipe", src);
        if (!state.flowing) {
          debug("pipe resume");
          src.resume();
        }
        return dest;
      };
      function pipeOnDrain(src) {
        return function() {
          var state = src._readableState;
          debug("pipeOnDrain", state.awaitDrain);
          state.awaitDrain && state.awaitDrain--;
          if (0 === state.awaitDrain && EElistenerCount(src, "data")) {
            state.flowing = true;
            flow(src);
          }
        };
      }
      Readable.prototype.unpipe = function(dest) {
        var state = this._readableState;
        var unpipeInfo = {
          hasUnpiped: false
        };
        if (0 === state.pipesCount) return this;
        if (1 === state.pipesCount) {
          if (dest && dest !== state.pipes) return this;
          dest || (dest = state.pipes);
          state.pipes = null;
          state.pipesCount = 0;
          state.flowing = false;
          dest && dest.emit("unpipe", this, unpipeInfo);
          return this;
        }
        if (!dest) {
          var dests = state.pipes;
          var len = state.pipesCount;
          state.pipes = null;
          state.pipesCount = 0;
          state.flowing = false;
          for (var i = 0; i < len; i++) dests[i].emit("unpipe", this, unpipeInfo);
          return this;
        }
        var index = indexOf(state.pipes, dest);
        if (-1 === index) return this;
        state.pipes.splice(index, 1);
        state.pipesCount -= 1;
        1 === state.pipesCount && (state.pipes = state.pipes[0]);
        dest.emit("unpipe", this, unpipeInfo);
        return this;
      };
      Readable.prototype.on = function(ev, fn) {
        var res = Stream.prototype.on.call(this, ev, fn);
        if ("data" === ev) false !== this._readableState.flowing && this.resume(); else if ("readable" === ev) {
          var state = this._readableState;
          if (!state.endEmitted && !state.readableListening) {
            state.readableListening = state.needReadable = true;
            state.emittedReadable = false;
            state.reading ? state.length && emitReadable(this) : pna.nextTick(nReadingNextTick, this);
          }
        }
        return res;
      };
      Readable.prototype.addListener = Readable.prototype.on;
      function nReadingNextTick(self) {
        debug("readable nexttick read 0");
        self.read(0);
      }
      Readable.prototype.resume = function() {
        var state = this._readableState;
        if (!state.flowing) {
          debug("resume");
          state.flowing = true;
          resume(this, state);
        }
        return this;
      };
      function resume(stream, state) {
        if (!state.resumeScheduled) {
          state.resumeScheduled = true;
          pna.nextTick(resume_, stream, state);
        }
      }
      function resume_(stream, state) {
        if (!state.reading) {
          debug("resume read 0");
          stream.read(0);
        }
        state.resumeScheduled = false;
        state.awaitDrain = 0;
        stream.emit("resume");
        flow(stream);
        state.flowing && !state.reading && stream.read(0);
      }
      Readable.prototype.pause = function() {
        debug("call pause flowing=%j", this._readableState.flowing);
        if (false !== this._readableState.flowing) {
          debug("pause");
          this._readableState.flowing = false;
          this.emit("pause");
        }
        return this;
      };
      function flow(stream) {
        var state = stream._readableState;
        debug("flow", state.flowing);
        while (state.flowing && null !== stream.read()) ;
      }
      Readable.prototype.wrap = function(stream) {
        var _this = this;
        var state = this._readableState;
        var paused = false;
        stream.on("end", function() {
          debug("wrapped end");
          if (state.decoder && !state.ended) {
            var chunk = state.decoder.end();
            chunk && chunk.length && _this.push(chunk);
          }
          _this.push(null);
        });
        stream.on("data", function(chunk) {
          debug("wrapped data");
          state.decoder && (chunk = state.decoder.write(chunk));
          if (state.objectMode && (null === chunk || void 0 === chunk)) return;
          if (!state.objectMode && (!chunk || !chunk.length)) return;
          var ret = _this.push(chunk);
          if (!ret) {
            paused = true;
            stream.pause();
          }
        });
        for (var i in stream) void 0 === this[i] && "function" === typeof stream[i] && (this[i] = function(method) {
          return function() {
            return stream[method].apply(stream, arguments);
          };
        }(i));
        for (var n = 0; n < kProxyEvents.length; n++) stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
        this._read = function(n) {
          debug("wrapped _read", n);
          if (paused) {
            paused = false;
            stream.resume();
          }
        };
        return this;
      };
      Object.defineProperty(Readable.prototype, "readableHighWaterMark", {
        enumerable: false,
        get: function() {
          return this._readableState.highWaterMark;
        }
      });
      Readable._fromList = fromList;
      function fromList(n, state) {
        if (0 === state.length) return null;
        var ret;
        if (state.objectMode) ret = state.buffer.shift(); else if (!n || n >= state.length) {
          ret = state.decoder ? state.buffer.join("") : 1 === state.buffer.length ? state.buffer.head.data : state.buffer.concat(state.length);
          state.buffer.clear();
        } else ret = fromListPartial(n, state.buffer, state.decoder);
        return ret;
      }
      function fromListPartial(n, list, hasStrings) {
        var ret;
        if (n < list.head.data.length) {
          ret = list.head.data.slice(0, n);
          list.head.data = list.head.data.slice(n);
        } else ret = n === list.head.data.length ? list.shift() : hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
        return ret;
      }
      function copyFromBufferString(n, list) {
        var p = list.head;
        var c = 1;
        var ret = p.data;
        n -= ret.length;
        while (p = p.next) {
          var str = p.data;
          var nb = n > str.length ? str.length : n;
          nb === str.length ? ret += str : ret += str.slice(0, n);
          n -= nb;
          if (0 === n) {
            if (nb === str.length) {
              ++c;
              p.next ? list.head = p.next : list.head = list.tail = null;
            } else {
              list.head = p;
              p.data = str.slice(nb);
            }
            break;
          }
          ++c;
        }
        list.length -= c;
        return ret;
      }
      function copyFromBuffer(n, list) {
        var ret = Buffer.allocUnsafe(n);
        var p = list.head;
        var c = 1;
        p.data.copy(ret);
        n -= p.data.length;
        while (p = p.next) {
          var buf = p.data;
          var nb = n > buf.length ? buf.length : n;
          buf.copy(ret, ret.length - n, 0, nb);
          n -= nb;
          if (0 === n) {
            if (nb === buf.length) {
              ++c;
              p.next ? list.head = p.next : list.head = list.tail = null;
            } else {
              list.head = p;
              p.data = buf.slice(nb);
            }
            break;
          }
          ++c;
        }
        list.length -= c;
        return ret;
      }
      function endReadable(stream) {
        var state = stream._readableState;
        if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');
        if (!state.endEmitted) {
          state.ended = true;
          pna.nextTick(endReadableNT, state, stream);
        }
      }
      function endReadableNT(state, stream) {
        if (!state.endEmitted && 0 === state.length) {
          state.endEmitted = true;
          stream.readable = false;
          stream.emit("end");
        }
      }
      function indexOf(xs, x) {
        for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
        return -1;
      }
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "./_stream_duplex": 128,
    "./internal/streams/BufferList": 133,
    "./internal/streams/destroy": 134,
    "./internal/streams/stream": 135,
    _process: 118,
    "core-util-is": 50,
    events: 83,
    inherits: 101,
    isarray: 136,
    "process-nextick-args": 117,
    "safe-buffer": 143,
    "string_decoder/": 137,
    util: 18
  } ],
  131: [ function(require, module, exports) {
    "use strict";
    module.exports = Transform;
    var Duplex = require("./_stream_duplex");
    var util = require("core-util-is");
    util.inherits = require("inherits");
    util.inherits(Transform, Duplex);
    function afterTransform(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (!cb) return this.emit("error", new Error("write callback called multiple times"));
      ts.writechunk = null;
      ts.writecb = null;
      null != data && this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      (rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark);
    }
    function Transform(options) {
      if (!(this instanceof Transform)) return new Transform(options);
      Duplex.call(this, options);
      this._transformState = {
        afterTransform: afterTransform.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        "function" === typeof options.transform && (this._transform = options.transform);
        "function" === typeof options.flush && (this._flush = options.flush);
      }
      this.on("prefinish", prefinish);
    }
    function prefinish() {
      var _this = this;
      "function" === typeof this._flush ? this._flush(function(er, data) {
        done(_this, er, data);
      }) : done(this, null, null);
    }
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("_transform() is not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) && this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (null !== ts.writechunk && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else ts.needTransform = true;
    };
    Transform.prototype._destroy = function(err, cb) {
      var _this2 = this;
      Duplex.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
        _this2.emit("close");
      });
    };
    function done(stream, er, data) {
      if (er) return stream.emit("error", er);
      null != data && stream.push(data);
      if (stream._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (stream._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return stream.push(null);
    }
  }, {
    "./_stream_duplex": 128,
    "core-util-is": 50,
    inherits: 101
  } ],
  132: [ function(require, module, exports) {
    (function(process, global) {
      "use strict";
      var pna = require("process-nextick-args");
      module.exports = Writable;
      function WriteReq(chunk, encoding, cb) {
        this.chunk = chunk;
        this.encoding = encoding;
        this.callback = cb;
        this.next = null;
      }
      function CorkedRequest(state) {
        var _this = this;
        this.next = null;
        this.entry = null;
        this.finish = function() {
          onCorkedFinish(_this, state);
        };
      }
      var asyncWrite = !process.browser && [ "v0.10", "v0.9." ].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
      var Duplex;
      Writable.WritableState = WritableState;
      var util = require("core-util-is");
      util.inherits = require("inherits");
      var internalUtil = {
        deprecate: require("util-deprecate")
      };
      var Stream = require("./internal/streams/stream");
      var Buffer = require("safe-buffer").Buffer;
      var OurUint8Array = global.Uint8Array || function() {};
      function _uint8ArrayToBuffer(chunk) {
        return Buffer.from(chunk);
      }
      function _isUint8Array(obj) {
        return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
      }
      var destroyImpl = require("./internal/streams/destroy");
      util.inherits(Writable, Stream);
      function nop() {}
      function WritableState(options, stream) {
        Duplex = Duplex || require("./_stream_duplex");
        options = options || {};
        var isDuplex = stream instanceof Duplex;
        this.objectMode = !!options.objectMode;
        isDuplex && (this.objectMode = this.objectMode || !!options.writableObjectMode);
        var hwm = options.highWaterMark;
        var writableHwm = options.writableHighWaterMark;
        var defaultHwm = this.objectMode ? 16 : 16384;
        this.highWaterMark = hwm || 0 === hwm ? hwm : isDuplex && (writableHwm || 0 === writableHwm) ? writableHwm : defaultHwm;
        this.highWaterMark = Math.floor(this.highWaterMark);
        this.finalCalled = false;
        this.needDrain = false;
        this.ending = false;
        this.ended = false;
        this.finished = false;
        this.destroyed = false;
        var noDecode = false === options.decodeStrings;
        this.decodeStrings = !noDecode;
        this.defaultEncoding = options.defaultEncoding || "utf8";
        this.length = 0;
        this.writing = false;
        this.corked = 0;
        this.sync = true;
        this.bufferProcessing = false;
        this.onwrite = function(er) {
          onwrite(stream, er);
        };
        this.writecb = null;
        this.writelen = 0;
        this.bufferedRequest = null;
        this.lastBufferedRequest = null;
        this.pendingcb = 0;
        this.prefinished = false;
        this.errorEmitted = false;
        this.bufferedRequestCount = 0;
        this.corkedRequestsFree = new CorkedRequest(this);
      }
      WritableState.prototype.getBuffer = function getBuffer() {
        var current = this.bufferedRequest;
        var out = [];
        while (current) {
          out.push(current);
          current = current.next;
        }
        return out;
      };
      (function() {
        try {
          Object.defineProperty(WritableState.prototype, "buffer", {
            get: internalUtil.deprecate(function() {
              return this.getBuffer();
            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
          });
        } catch (_) {}
      })();
      var realHasInstance;
      if ("function" === typeof Symbol && Symbol.hasInstance && "function" === typeof Function.prototype[Symbol.hasInstance]) {
        realHasInstance = Function.prototype[Symbol.hasInstance];
        Object.defineProperty(Writable, Symbol.hasInstance, {
          value: function(object) {
            if (realHasInstance.call(this, object)) return true;
            if (this !== Writable) return false;
            return object && object._writableState instanceof WritableState;
          }
        });
      } else realHasInstance = function(object) {
        return object instanceof this;
      };
      function Writable(options) {
        Duplex = Duplex || require("./_stream_duplex");
        if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) return new Writable(options);
        this._writableState = new WritableState(options, this);
        this.writable = true;
        if (options) {
          "function" === typeof options.write && (this._write = options.write);
          "function" === typeof options.writev && (this._writev = options.writev);
          "function" === typeof options.destroy && (this._destroy = options.destroy);
          "function" === typeof options.final && (this._final = options.final);
        }
        Stream.call(this);
      }
      Writable.prototype.pipe = function() {
        this.emit("error", new Error("Cannot pipe, not readable"));
      };
      function writeAfterEnd(stream, cb) {
        var er = new Error("write after end");
        stream.emit("error", er);
        pna.nextTick(cb, er);
      }
      function validChunk(stream, state, chunk, cb) {
        var valid = true;
        var er = false;
        null === chunk ? er = new TypeError("May not write null values to stream") : "string" === typeof chunk || void 0 === chunk || state.objectMode || (er = new TypeError("Invalid non-string/buffer chunk"));
        if (er) {
          stream.emit("error", er);
          pna.nextTick(cb, er);
          valid = false;
        }
        return valid;
      }
      Writable.prototype.write = function(chunk, encoding, cb) {
        var state = this._writableState;
        var ret = false;
        var isBuf = !state.objectMode && _isUint8Array(chunk);
        isBuf && !Buffer.isBuffer(chunk) && (chunk = _uint8ArrayToBuffer(chunk));
        if ("function" === typeof encoding) {
          cb = encoding;
          encoding = null;
        }
        isBuf ? encoding = "buffer" : encoding || (encoding = state.defaultEncoding);
        "function" !== typeof cb && (cb = nop);
        if (state.ended) writeAfterEnd(this, cb); else if (isBuf || validChunk(this, state, chunk, cb)) {
          state.pendingcb++;
          ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
        }
        return ret;
      };
      Writable.prototype.cork = function() {
        var state = this._writableState;
        state.corked++;
      };
      Writable.prototype.uncork = function() {
        var state = this._writableState;
        if (state.corked) {
          state.corked--;
          state.writing || state.corked || state.finished || state.bufferProcessing || !state.bufferedRequest || clearBuffer(this, state);
        }
      };
      Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
        "string" === typeof encoding && (encoding = encoding.toLowerCase());
        if (!([ "hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw" ].indexOf((encoding + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + encoding);
        this._writableState.defaultEncoding = encoding;
        return this;
      };
      function decodeChunk(state, chunk, encoding) {
        state.objectMode || false === state.decodeStrings || "string" !== typeof chunk || (chunk = Buffer.from(chunk, encoding));
        return chunk;
      }
      Object.defineProperty(Writable.prototype, "writableHighWaterMark", {
        enumerable: false,
        get: function() {
          return this._writableState.highWaterMark;
        }
      });
      function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
        if (!isBuf) {
          var newChunk = decodeChunk(state, chunk, encoding);
          if (chunk !== newChunk) {
            isBuf = true;
            encoding = "buffer";
            chunk = newChunk;
          }
        }
        var len = state.objectMode ? 1 : chunk.length;
        state.length += len;
        var ret = state.length < state.highWaterMark;
        ret || (state.needDrain = true);
        if (state.writing || state.corked) {
          var last = state.lastBufferedRequest;
          state.lastBufferedRequest = {
            chunk: chunk,
            encoding: encoding,
            isBuf: isBuf,
            callback: cb,
            next: null
          };
          last ? last.next = state.lastBufferedRequest : state.bufferedRequest = state.lastBufferedRequest;
          state.bufferedRequestCount += 1;
        } else doWrite(stream, state, false, len, chunk, encoding, cb);
        return ret;
      }
      function doWrite(stream, state, writev, len, chunk, encoding, cb) {
        state.writelen = len;
        state.writecb = cb;
        state.writing = true;
        state.sync = true;
        writev ? stream._writev(chunk, state.onwrite) : stream._write(chunk, encoding, state.onwrite);
        state.sync = false;
      }
      function onwriteError(stream, state, sync, er, cb) {
        --state.pendingcb;
        if (sync) {
          pna.nextTick(cb, er);
          pna.nextTick(finishMaybe, stream, state);
          stream._writableState.errorEmitted = true;
          stream.emit("error", er);
        } else {
          cb(er);
          stream._writableState.errorEmitted = true;
          stream.emit("error", er);
          finishMaybe(stream, state);
        }
      }
      function onwriteStateUpdate(state) {
        state.writing = false;
        state.writecb = null;
        state.length -= state.writelen;
        state.writelen = 0;
      }
      function onwrite(stream, er) {
        var state = stream._writableState;
        var sync = state.sync;
        var cb = state.writecb;
        onwriteStateUpdate(state);
        if (er) onwriteError(stream, state, sync, er, cb); else {
          var finished = needFinish(state);
          finished || state.corked || state.bufferProcessing || !state.bufferedRequest || clearBuffer(stream, state);
          sync ? asyncWrite(afterWrite, stream, state, finished, cb) : afterWrite(stream, state, finished, cb);
        }
      }
      function afterWrite(stream, state, finished, cb) {
        finished || onwriteDrain(stream, state);
        state.pendingcb--;
        cb();
        finishMaybe(stream, state);
      }
      function onwriteDrain(stream, state) {
        if (0 === state.length && state.needDrain) {
          state.needDrain = false;
          stream.emit("drain");
        }
      }
      function clearBuffer(stream, state) {
        state.bufferProcessing = true;
        var entry = state.bufferedRequest;
        if (stream._writev && entry && entry.next) {
          var l = state.bufferedRequestCount;
          var buffer = new Array(l);
          var holder = state.corkedRequestsFree;
          holder.entry = entry;
          var count = 0;
          var allBuffers = true;
          while (entry) {
            buffer[count] = entry;
            entry.isBuf || (allBuffers = false);
            entry = entry.next;
            count += 1;
          }
          buffer.allBuffers = allBuffers;
          doWrite(stream, state, true, state.length, buffer, "", holder.finish);
          state.pendingcb++;
          state.lastBufferedRequest = null;
          if (holder.next) {
            state.corkedRequestsFree = holder.next;
            holder.next = null;
          } else state.corkedRequestsFree = new CorkedRequest(state);
          state.bufferedRequestCount = 0;
        } else {
          while (entry) {
            var chunk = entry.chunk;
            var encoding = entry.encoding;
            var cb = entry.callback;
            var len = state.objectMode ? 1 : chunk.length;
            doWrite(stream, state, false, len, chunk, encoding, cb);
            entry = entry.next;
            state.bufferedRequestCount--;
            if (state.writing) break;
          }
          null === entry && (state.lastBufferedRequest = null);
        }
        state.bufferedRequest = entry;
        state.bufferProcessing = false;
      }
      Writable.prototype._write = function(chunk, encoding, cb) {
        cb(new Error("_write() is not implemented"));
      };
      Writable.prototype._writev = null;
      Writable.prototype.end = function(chunk, encoding, cb) {
        var state = this._writableState;
        if ("function" === typeof chunk) {
          cb = chunk;
          chunk = null;
          encoding = null;
        } else if ("function" === typeof encoding) {
          cb = encoding;
          encoding = null;
        }
        null !== chunk && void 0 !== chunk && this.write(chunk, encoding);
        if (state.corked) {
          state.corked = 1;
          this.uncork();
        }
        state.ending || state.finished || endWritable(this, state, cb);
      };
      function needFinish(state) {
        return state.ending && 0 === state.length && null === state.bufferedRequest && !state.finished && !state.writing;
      }
      function callFinal(stream, state) {
        stream._final(function(err) {
          state.pendingcb--;
          err && stream.emit("error", err);
          state.prefinished = true;
          stream.emit("prefinish");
          finishMaybe(stream, state);
        });
      }
      function prefinish(stream, state) {
        if (!state.prefinished && !state.finalCalled) if ("function" === typeof stream._final) {
          state.pendingcb++;
          state.finalCalled = true;
          pna.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
      function finishMaybe(stream, state) {
        var need = needFinish(state);
        if (need) {
          prefinish(stream, state);
          if (0 === state.pendingcb) {
            state.finished = true;
            stream.emit("finish");
          }
        }
        return need;
      }
      function endWritable(stream, state, cb) {
        state.ending = true;
        finishMaybe(stream, state);
        cb && (state.finished ? pna.nextTick(cb) : stream.once("finish", cb));
        state.ended = true;
        stream.writable = false;
      }
      function onCorkedFinish(corkReq, state, err) {
        var entry = corkReq.entry;
        corkReq.entry = null;
        while (entry) {
          var cb = entry.callback;
          state.pendingcb--;
          cb(err);
          entry = entry.next;
        }
        state.corkedRequestsFree ? state.corkedRequestsFree.next = corkReq : state.corkedRequestsFree = corkReq;
      }
      Object.defineProperty(Writable.prototype, "destroyed", {
        get: function() {
          if (void 0 === this._writableState) return false;
          return this._writableState.destroyed;
        },
        set: function(value) {
          if (!this._writableState) return;
          this._writableState.destroyed = value;
        }
      });
      Writable.prototype.destroy = destroyImpl.destroy;
      Writable.prototype._undestroy = destroyImpl.undestroy;
      Writable.prototype._destroy = function(err, cb) {
        this.end();
        cb(err);
      };
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "./_stream_duplex": 128,
    "./internal/streams/destroy": 134,
    "./internal/streams/stream": 135,
    _process: 118,
    "core-util-is": 50,
    inherits: 101,
    "process-nextick-args": 117,
    "safe-buffer": 143,
    "util-deprecate": 154
  } ],
  133: [ function(require, module, exports) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }
    var Buffer = require("safe-buffer").Buffer;
    var util = require("util");
    function copyBuffer(src, target, offset) {
      src.copy(target, offset);
    }
    module.exports = function() {
      function BufferList() {
        _classCallCheck(this, BufferList);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      BufferList.prototype.push = function push(v) {
        var entry = {
          data: v,
          next: null
        };
        this.length > 0 ? this.tail.next = entry : this.head = entry;
        this.tail = entry;
        ++this.length;
      };
      BufferList.prototype.unshift = function unshift(v) {
        var entry = {
          data: v,
          next: this.head
        };
        0 === this.length && (this.tail = entry);
        this.head = entry;
        ++this.length;
      };
      BufferList.prototype.shift = function shift() {
        if (0 === this.length) return;
        var ret = this.head.data;
        1 === this.length ? this.head = this.tail = null : this.head = this.head.next;
        --this.length;
        return ret;
      };
      BufferList.prototype.clear = function clear() {
        this.head = this.tail = null;
        this.length = 0;
      };
      BufferList.prototype.join = function join(s) {
        if (0 === this.length) return "";
        var p = this.head;
        var ret = "" + p.data;
        while (p = p.next) ret += s + p.data;
        return ret;
      };
      BufferList.prototype.concat = function concat(n) {
        if (0 === this.length) return Buffer.alloc(0);
        if (1 === this.length) return this.head.data;
        var ret = Buffer.allocUnsafe(n >>> 0);
        var p = this.head;
        var i = 0;
        while (p) {
          copyBuffer(p.data, ret, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      };
      return BufferList;
    }();
    util && util.inspect && util.inspect.custom && (module.exports.prototype[util.inspect.custom] = function() {
      var obj = util.inspect({
        length: this.length
      });
      return this.constructor.name + " " + obj;
    });
  }, {
    "safe-buffer": 143,
    util: 18
  } ],
  134: [ function(require, module, exports) {
    "use strict";
    var pna = require("process-nextick-args");
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        cb ? cb(err) : !err || this._writableState && this._writableState.errorEmitted || pna.nextTick(emitErrorNT, this, err);
        return this;
      }
      this._readableState && (this._readableState.destroyed = true);
      this._writableState && (this._writableState.destroyed = true);
      this._destroy(err || null, function(err) {
        if (!cb && err) {
          pna.nextTick(emitErrorNT, _this, err);
          _this._writableState && (_this._writableState.errorEmitted = true);
        } else cb && cb(err);
      });
      return this;
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self, err) {
      self.emit("error", err);
    }
    module.exports = {
      destroy: destroy,
      undestroy: undestroy
    };
  }, {
    "process-nextick-args": 117
  } ],
  135: [ function(require, module, exports) {
    module.exports = require("events").EventEmitter;
  }, {
    events: 83
  } ],
  136: [ function(require, module, exports) {
    arguments[4][48][0].apply(exports, arguments);
  }, {
    dup: 48
  } ],
  137: [ function(require, module, exports) {
    "use strict";
    var Buffer = require("safe-buffer").Buffer;
    var isEncoding = Buffer.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
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
        return true;

       default:
        return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc) return "utf8";
      var retried;
      while (true) switch (enc) {
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
        return enc;

       default:
        if (retried) return;
        enc = ("" + enc).toLowerCase();
        retried = true;
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if ("string" !== typeof nenc && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder;
    function StringDecoder(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
       case "utf16le":
        this.text = utf16Text;
        this.end = utf16End;
        nb = 4;
        break;

       case "utf8":
        this.fillLast = utf8FillLast;
        nb = 4;
        break;

       case "base64":
        this.text = base64Text;
        this.end = base64End;
        nb = 3;
        break;

       default:
        this.write = simpleWrite;
        this.end = simpleEnd;
        return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer.allocUnsafe(nb);
    }
    StringDecoder.prototype.write = function(buf) {
      if (0 === buf.length) return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (void 0 === r) return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else i = 0;
      if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder.prototype.end = utf8End;
    StringDecoder.prototype.text = utf8Text;
    StringDecoder.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127) return 0;
      if (byte >> 5 === 6) return 2;
      if (byte >> 4 === 14) return 3;
      if (byte >> 3 === 30) return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self, buf, i) {
      var j = buf.length - 1;
      if (j < i) return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        nb > 0 && (self.lastNeed = nb - 1);
        return nb;
      }
      if (--j < i || -2 === nb) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        nb > 0 && (self.lastNeed = nb - 2);
        return nb;
      }
      if (--j < i || -2 === nb) return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        nb > 0 && (2 === nb ? nb = 0 : self.lastNeed = nb - 3);
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self, buf, p) {
      if (128 !== (192 & buf[0])) {
        self.lastNeed = 0;
        return "�";
      }
      if (self.lastNeed > 1 && buf.length > 1) {
        if (128 !== (192 & buf[1])) {
          self.lastNeed = 1;
          return "�";
        }
        if (self.lastNeed > 2 && buf.length > 2 && 128 !== (192 & buf[2])) {
          self.lastNeed = 2;
          return "�";
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (void 0 !== r) return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed) return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + "�";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (0 === n) return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (1 === n) this.lastChar[0] = buf[buf.length - 1]; else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }, {
    "safe-buffer": 143
  } ],
  138: [ function(require, module, exports) {
    module.exports = require("./readable").PassThrough;
  }, {
    "./readable": 139
  } ],
  139: [ function(require, module, exports) {
    exports = module.exports = require("./lib/_stream_readable.js");
    exports.Stream = exports;
    exports.Readable = exports;
    exports.Writable = require("./lib/_stream_writable.js");
    exports.Duplex = require("./lib/_stream_duplex.js");
    exports.Transform = require("./lib/_stream_transform.js");
    exports.PassThrough = require("./lib/_stream_passthrough.js");
  }, {
    "./lib/_stream_duplex.js": 128,
    "./lib/_stream_passthrough.js": 129,
    "./lib/_stream_readable.js": 130,
    "./lib/_stream_transform.js": 131,
    "./lib/_stream_writable.js": 132
  } ],
  140: [ function(require, module, exports) {
    module.exports = require("./readable").Transform;
  }, {
    "./readable": 139
  } ],
  141: [ function(require, module, exports) {
    module.exports = require("./lib/_stream_writable.js");
  }, {
    "./lib/_stream_writable.js": 132
  } ],
  142: [ function(require, module, exports) {
    "use strict";
    var Buffer = require("buffer").Buffer;
    var inherits = require("inherits");
    var HashBase = require("hash-base");
    var ARRAY16 = new Array(16);
    var zl = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ];
    var zr = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ];
    var sl = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ];
    var sr = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ];
    var hl = [ 0, 1518500249, 1859775393, 2400959708, 2840853838 ];
    var hr = [ 1352829926, 1548603684, 1836072691, 2053994217, 0 ];
    function RIPEMD160() {
      HashBase.call(this, 64);
      this._a = 1732584193;
      this._b = 4023233417;
      this._c = 2562383102;
      this._d = 271733878;
      this._e = 3285377520;
    }
    inherits(RIPEMD160, HashBase);
    RIPEMD160.prototype._update = function() {
      var words = ARRAY16;
      for (var j = 0; j < 16; ++j) words[j] = this._block.readInt32LE(4 * j);
      var al = 0 | this._a;
      var bl = 0 | this._b;
      var cl = 0 | this._c;
      var dl = 0 | this._d;
      var el = 0 | this._e;
      var ar = 0 | this._a;
      var br = 0 | this._b;
      var cr = 0 | this._c;
      var dr = 0 | this._d;
      var er = 0 | this._e;
      for (var i = 0; i < 80; i += 1) {
        var tl;
        var tr;
        if (i < 16) {
          tl = fn1(al, bl, cl, dl, el, words[zl[i]], hl[0], sl[i]);
          tr = fn5(ar, br, cr, dr, er, words[zr[i]], hr[0], sr[i]);
        } else if (i < 32) {
          tl = fn2(al, bl, cl, dl, el, words[zl[i]], hl[1], sl[i]);
          tr = fn4(ar, br, cr, dr, er, words[zr[i]], hr[1], sr[i]);
        } else if (i < 48) {
          tl = fn3(al, bl, cl, dl, el, words[zl[i]], hl[2], sl[i]);
          tr = fn3(ar, br, cr, dr, er, words[zr[i]], hr[2], sr[i]);
        } else if (i < 64) {
          tl = fn4(al, bl, cl, dl, el, words[zl[i]], hl[3], sl[i]);
          tr = fn2(ar, br, cr, dr, er, words[zr[i]], hr[3], sr[i]);
        } else {
          tl = fn5(al, bl, cl, dl, el, words[zl[i]], hl[4], sl[i]);
          tr = fn1(ar, br, cr, dr, er, words[zr[i]], hr[4], sr[i]);
        }
        al = el;
        el = dl;
        dl = rotl(cl, 10);
        cl = bl;
        bl = tl;
        ar = er;
        er = dr;
        dr = rotl(cr, 10);
        cr = br;
        br = tr;
      }
      var t = this._b + cl + dr | 0;
      this._b = this._c + dl + er | 0;
      this._c = this._d + el + ar | 0;
      this._d = this._e + al + br | 0;
      this._e = this._a + bl + cr | 0;
      this._a = t;
    };
    RIPEMD160.prototype._digest = function() {
      this._block[this._blockOffset++] = 128;
      if (this._blockOffset > 56) {
        this._block.fill(0, this._blockOffset, 64);
        this._update();
        this._blockOffset = 0;
      }
      this._block.fill(0, this._blockOffset, 56);
      this._block.writeUInt32LE(this._length[0], 56);
      this._block.writeUInt32LE(this._length[1], 60);
      this._update();
      var buffer = Buffer.alloc ? Buffer.alloc(20) : new Buffer(20);
      buffer.writeInt32LE(this._a, 0);
      buffer.writeInt32LE(this._b, 4);
      buffer.writeInt32LE(this._c, 8);
      buffer.writeInt32LE(this._d, 12);
      buffer.writeInt32LE(this._e, 16);
      return buffer;
    };
    function rotl(x, n) {
      return x << n | x >>> 32 - n;
    }
    function fn1(a, b, c, d, e, m, k, s) {
      return rotl(a + (b ^ c ^ d) + m + k | 0, s) + e | 0;
    }
    function fn2(a, b, c, d, e, m, k, s) {
      return rotl(a + (b & c | ~b & d) + m + k | 0, s) + e | 0;
    }
    function fn3(a, b, c, d, e, m, k, s) {
      return rotl(a + ((b | ~c) ^ d) + m + k | 0, s) + e | 0;
    }
    function fn4(a, b, c, d, e, m, k, s) {
      return rotl(a + (b & d | c & ~d) + m + k | 0, s) + e | 0;
    }
    function fn5(a, b, c, d, e, m, k, s) {
      return rotl(a + (b ^ (c | ~d)) + m + k | 0, s) + e | 0;
    }
    module.exports = RIPEMD160;
  }, {
    buffer: 47,
    "hash-base": 85,
    inherits: 101
  } ],
  143: [ function(require, module, exports) {
    var buffer = require("buffer");
    var Buffer = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) dst[key] = src[key];
    }
    if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) module.exports = buffer; else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer(arg, encodingOrOffset, length);
    }
    copyProps(Buffer, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if ("number" === typeof arg) throw new TypeError("Argument must not be a number");
      return Buffer(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if ("number" !== typeof size) throw new TypeError("Argument must be a number");
      var buf = Buffer(size);
      void 0 !== fill ? "string" === typeof encoding ? buf.fill(fill, encoding) : buf.fill(fill) : buf.fill(0);
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if ("number" !== typeof size) throw new TypeError("Argument must be a number");
      return Buffer(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if ("number" !== typeof size) throw new TypeError("Argument must be a number");
      return buffer.SlowBuffer(size);
    };
  }, {
    buffer: 47
  } ],
  144: [ function(require, module, exports) {
    var Buffer = require("safe-buffer").Buffer;
    function Hash(blockSize, finalSize) {
      this._block = Buffer.alloc(blockSize);
      this._finalSize = finalSize;
      this._blockSize = blockSize;
      this._len = 0;
    }
    Hash.prototype.update = function(data, enc) {
      if ("string" === typeof data) {
        enc = enc || "utf8";
        data = Buffer.from(data, enc);
      }
      var block = this._block;
      var blockSize = this._blockSize;
      var length = data.length;
      var accum = this._len;
      for (var offset = 0; offset < length; ) {
        var assigned = accum % blockSize;
        var remainder = Math.min(length - offset, blockSize - assigned);
        for (var i = 0; i < remainder; i++) block[assigned + i] = data[offset + i];
        accum += remainder;
        offset += remainder;
        accum % blockSize === 0 && this._update(block);
      }
      this._len += length;
      return this;
    };
    Hash.prototype.digest = function(enc) {
      var rem = this._len % this._blockSize;
      this._block[rem] = 128;
      this._block.fill(0, rem + 1);
      if (rem >= this._finalSize) {
        this._update(this._block);
        this._block.fill(0);
      }
      var bits = 8 * this._len;
      if (bits <= 4294967295) this._block.writeUInt32BE(bits, this._blockSize - 4); else {
        var lowBits = (4294967295 & bits) >>> 0;
        var highBits = (bits - lowBits) / 4294967296;
        this._block.writeUInt32BE(highBits, this._blockSize - 8);
        this._block.writeUInt32BE(lowBits, this._blockSize - 4);
      }
      this._update(this._block);
      var hash = this._hash();
      return enc ? hash.toString(enc) : hash;
    };
    Hash.prototype._update = function() {
      throw new Error("_update must be implemented by subclass");
    };
    module.exports = Hash;
  }, {
    "safe-buffer": 143
  } ],
  145: [ function(require, module, exports) {
    var exports = module.exports = function SHA(algorithm) {
      algorithm = algorithm.toLowerCase();
      var Algorithm = exports[algorithm];
      if (!Algorithm) throw new Error(algorithm + " is not supported (we accept pull requests)");
      return new Algorithm();
    };
    exports.sha = require("./sha");
    exports.sha1 = require("./sha1");
    exports.sha224 = require("./sha224");
    exports.sha256 = require("./sha256");
    exports.sha384 = require("./sha384");
    exports.sha512 = require("./sha512");
  }, {
    "./sha": 146,
    "./sha1": 147,
    "./sha224": 148,
    "./sha256": 149,
    "./sha384": 150,
    "./sha512": 151
  } ],
  146: [ function(require, module, exports) {
    var inherits = require("inherits");
    var Hash = require("./hash");
    var Buffer = require("safe-buffer").Buffer;
    var K = [ 1518500249, 1859775393, -1894007588, -899497514 ];
    var W = new Array(80);
    function Sha() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits(Sha, Hash);
    Sha.prototype.init = function() {
      this._a = 1732584193;
      this._b = 4023233417;
      this._c = 2562383102;
      this._d = 271733878;
      this._e = 3285377520;
      return this;
    };
    function rotl5(num) {
      return num << 5 | num >>> 27;
    }
    function rotl30(num) {
      return num << 30 | num >>> 2;
    }
    function ft(s, b, c, d) {
      if (0 === s) return b & c | ~b & d;
      if (2 === s) return b & c | b & d | c & d;
      return b ^ c ^ d;
    }
    Sha.prototype._update = function(M) {
      var W = this._w;
      var a = 0 | this._a;
      var b = 0 | this._b;
      var c = 0 | this._c;
      var d = 0 | this._d;
      var e = 0 | this._e;
      for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(4 * i);
      for (;i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
      for (var j = 0; j < 80; ++j) {
        var s = ~~(j / 20);
        var t = rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s] | 0;
        e = d;
        d = c;
        c = rotl30(b);
        b = a;
        a = t;
      }
      this._a = a + this._a | 0;
      this._b = b + this._b | 0;
      this._c = c + this._c | 0;
      this._d = d + this._d | 0;
      this._e = e + this._e | 0;
    };
    Sha.prototype._hash = function() {
      var H = Buffer.allocUnsafe(20);
      H.writeInt32BE(0 | this._a, 0);
      H.writeInt32BE(0 | this._b, 4);
      H.writeInt32BE(0 | this._c, 8);
      H.writeInt32BE(0 | this._d, 12);
      H.writeInt32BE(0 | this._e, 16);
      return H;
    };
    module.exports = Sha;
  }, {
    "./hash": 144,
    inherits: 101,
    "safe-buffer": 143
  } ],
  147: [ function(require, module, exports) {
    var inherits = require("inherits");
    var Hash = require("./hash");
    var Buffer = require("safe-buffer").Buffer;
    var K = [ 1518500249, 1859775393, -1894007588, -899497514 ];
    var W = new Array(80);
    function Sha1() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits(Sha1, Hash);
    Sha1.prototype.init = function() {
      this._a = 1732584193;
      this._b = 4023233417;
      this._c = 2562383102;
      this._d = 271733878;
      this._e = 3285377520;
      return this;
    };
    function rotl1(num) {
      return num << 1 | num >>> 31;
    }
    function rotl5(num) {
      return num << 5 | num >>> 27;
    }
    function rotl30(num) {
      return num << 30 | num >>> 2;
    }
    function ft(s, b, c, d) {
      if (0 === s) return b & c | ~b & d;
      if (2 === s) return b & c | b & d | c & d;
      return b ^ c ^ d;
    }
    Sha1.prototype._update = function(M) {
      var W = this._w;
      var a = 0 | this._a;
      var b = 0 | this._b;
      var c = 0 | this._c;
      var d = 0 | this._d;
      var e = 0 | this._e;
      for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(4 * i);
      for (;i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);
      for (var j = 0; j < 80; ++j) {
        var s = ~~(j / 20);
        var t = rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s] | 0;
        e = d;
        d = c;
        c = rotl30(b);
        b = a;
        a = t;
      }
      this._a = a + this._a | 0;
      this._b = b + this._b | 0;
      this._c = c + this._c | 0;
      this._d = d + this._d | 0;
      this._e = e + this._e | 0;
    };
    Sha1.prototype._hash = function() {
      var H = Buffer.allocUnsafe(20);
      H.writeInt32BE(0 | this._a, 0);
      H.writeInt32BE(0 | this._b, 4);
      H.writeInt32BE(0 | this._c, 8);
      H.writeInt32BE(0 | this._d, 12);
      H.writeInt32BE(0 | this._e, 16);
      return H;
    };
    module.exports = Sha1;
  }, {
    "./hash": 144,
    inherits: 101,
    "safe-buffer": 143
  } ],
  148: [ function(require, module, exports) {
    var inherits = require("inherits");
    var Sha256 = require("./sha256");
    var Hash = require("./hash");
    var Buffer = require("safe-buffer").Buffer;
    var W = new Array(64);
    function Sha224() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits(Sha224, Sha256);
    Sha224.prototype.init = function() {
      this._a = 3238371032;
      this._b = 914150663;
      this._c = 812702999;
      this._d = 4144912697;
      this._e = 4290775857;
      this._f = 1750603025;
      this._g = 1694076839;
      this._h = 3204075428;
      return this;
    };
    Sha224.prototype._hash = function() {
      var H = Buffer.allocUnsafe(28);
      H.writeInt32BE(this._a, 0);
      H.writeInt32BE(this._b, 4);
      H.writeInt32BE(this._c, 8);
      H.writeInt32BE(this._d, 12);
      H.writeInt32BE(this._e, 16);
      H.writeInt32BE(this._f, 20);
      H.writeInt32BE(this._g, 24);
      return H;
    };
    module.exports = Sha224;
  }, {
    "./hash": 144,
    "./sha256": 149,
    inherits: 101,
    "safe-buffer": 143
  } ],
  149: [ function(require, module, exports) {
    var inherits = require("inherits");
    var Hash = require("./hash");
    var Buffer = require("safe-buffer").Buffer;
    var K = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
    var W = new Array(64);
    function Sha256() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits(Sha256, Hash);
    Sha256.prototype.init = function() {
      this._a = 1779033703;
      this._b = 3144134277;
      this._c = 1013904242;
      this._d = 2773480762;
      this._e = 1359893119;
      this._f = 2600822924;
      this._g = 528734635;
      this._h = 1541459225;
      return this;
    };
    function ch(x, y, z) {
      return z ^ x & (y ^ z);
    }
    function maj(x, y, z) {
      return x & y | z & (x | y);
    }
    function sigma0(x) {
      return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10);
    }
    function sigma1(x) {
      return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7);
    }
    function gamma0(x) {
      return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
    }
    function gamma1(x) {
      return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ x >>> 10;
    }
    Sha256.prototype._update = function(M) {
      var W = this._w;
      var a = 0 | this._a;
      var b = 0 | this._b;
      var c = 0 | this._c;
      var d = 0 | this._d;
      var e = 0 | this._e;
      var f = 0 | this._f;
      var g = 0 | this._g;
      var h = 0 | this._h;
      for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(4 * i);
      for (;i < 64; ++i) W[i] = gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16] | 0;
      for (var j = 0; j < 64; ++j) {
        var T1 = h + sigma1(e) + ch(e, f, g) + K[j] + W[j] | 0;
        var T2 = sigma0(a) + maj(a, b, c) | 0;
        h = g;
        g = f;
        f = e;
        e = d + T1 | 0;
        d = c;
        c = b;
        b = a;
        a = T1 + T2 | 0;
      }
      this._a = a + this._a | 0;
      this._b = b + this._b | 0;
      this._c = c + this._c | 0;
      this._d = d + this._d | 0;
      this._e = e + this._e | 0;
      this._f = f + this._f | 0;
      this._g = g + this._g | 0;
      this._h = h + this._h | 0;
    };
    Sha256.prototype._hash = function() {
      var H = Buffer.allocUnsafe(32);
      H.writeInt32BE(this._a, 0);
      H.writeInt32BE(this._b, 4);
      H.writeInt32BE(this._c, 8);
      H.writeInt32BE(this._d, 12);
      H.writeInt32BE(this._e, 16);
      H.writeInt32BE(this._f, 20);
      H.writeInt32BE(this._g, 24);
      H.writeInt32BE(this._h, 28);
      return H;
    };
    module.exports = Sha256;
  }, {
    "./hash": 144,
    inherits: 101,
    "safe-buffer": 143
  } ],
  150: [ function(require, module, exports) {
    var inherits = require("inherits");
    var SHA512 = require("./sha512");
    var Hash = require("./hash");
    var Buffer = require("safe-buffer").Buffer;
    var W = new Array(160);
    function Sha384() {
      this.init();
      this._w = W;
      Hash.call(this, 128, 112);
    }
    inherits(Sha384, SHA512);
    Sha384.prototype.init = function() {
      this._ah = 3418070365;
      this._bh = 1654270250;
      this._ch = 2438529370;
      this._dh = 355462360;
      this._eh = 1731405415;
      this._fh = 2394180231;
      this._gh = 3675008525;
      this._hh = 1203062813;
      this._al = 3238371032;
      this._bl = 914150663;
      this._cl = 812702999;
      this._dl = 4144912697;
      this._el = 4290775857;
      this._fl = 1750603025;
      this._gl = 1694076839;
      this._hl = 3204075428;
      return this;
    };
    Sha384.prototype._hash = function() {
      var H = Buffer.allocUnsafe(48);
      function writeInt64BE(h, l, offset) {
        H.writeInt32BE(h, offset);
        H.writeInt32BE(l, offset + 4);
      }
      writeInt64BE(this._ah, this._al, 0);
      writeInt64BE(this._bh, this._bl, 8);
      writeInt64BE(this._ch, this._cl, 16);
      writeInt64BE(this._dh, this._dl, 24);
      writeInt64BE(this._eh, this._el, 32);
      writeInt64BE(this._fh, this._fl, 40);
      return H;
    };
    module.exports = Sha384;
  }, {
    "./hash": 144,
    "./sha512": 151,
    inherits: 101,
    "safe-buffer": 143
  } ],
  151: [ function(require, module, exports) {
    var inherits = require("inherits");
    var Hash = require("./hash");
    var Buffer = require("safe-buffer").Buffer;
    var K = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ];
    var W = new Array(160);
    function Sha512() {
      this.init();
      this._w = W;
      Hash.call(this, 128, 112);
    }
    inherits(Sha512, Hash);
    Sha512.prototype.init = function() {
      this._ah = 1779033703;
      this._bh = 3144134277;
      this._ch = 1013904242;
      this._dh = 2773480762;
      this._eh = 1359893119;
      this._fh = 2600822924;
      this._gh = 528734635;
      this._hh = 1541459225;
      this._al = 4089235720;
      this._bl = 2227873595;
      this._cl = 4271175723;
      this._dl = 1595750129;
      this._el = 2917565137;
      this._fl = 725511199;
      this._gl = 4215389547;
      this._hl = 327033209;
      return this;
    };
    function Ch(x, y, z) {
      return z ^ x & (y ^ z);
    }
    function maj(x, y, z) {
      return x & y | z & (x | y);
    }
    function sigma0(x, xl) {
      return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25);
    }
    function sigma1(x, xl) {
      return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23);
    }
    function Gamma0(x, xl) {
      return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ x >>> 7;
    }
    function Gamma0l(x, xl) {
      return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25);
    }
    function Gamma1(x, xl) {
      return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ x >>> 6;
    }
    function Gamma1l(x, xl) {
      return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26);
    }
    function getCarry(a, b) {
      return a >>> 0 < b >>> 0 ? 1 : 0;
    }
    Sha512.prototype._update = function(M) {
      var W = this._w;
      var ah = 0 | this._ah;
      var bh = 0 | this._bh;
      var ch = 0 | this._ch;
      var dh = 0 | this._dh;
      var eh = 0 | this._eh;
      var fh = 0 | this._fh;
      var gh = 0 | this._gh;
      var hh = 0 | this._hh;
      var al = 0 | this._al;
      var bl = 0 | this._bl;
      var cl = 0 | this._cl;
      var dl = 0 | this._dl;
      var el = 0 | this._el;
      var fl = 0 | this._fl;
      var gl = 0 | this._gl;
      var hl = 0 | this._hl;
      for (var i = 0; i < 32; i += 2) {
        W[i] = M.readInt32BE(4 * i);
        W[i + 1] = M.readInt32BE(4 * i + 4);
      }
      for (;i < 160; i += 2) {
        var xh = W[i - 30];
        var xl = W[i - 30 + 1];
        var gamma0 = Gamma0(xh, xl);
        var gamma0l = Gamma0l(xl, xh);
        xh = W[i - 4];
        xl = W[i - 4 + 1];
        var gamma1 = Gamma1(xh, xl);
        var gamma1l = Gamma1l(xl, xh);
        var Wi7h = W[i - 14];
        var Wi7l = W[i - 14 + 1];
        var Wi16h = W[i - 32];
        var Wi16l = W[i - 32 + 1];
        var Wil = gamma0l + Wi7l | 0;
        var Wih = gamma0 + Wi7h + getCarry(Wil, gamma0l) | 0;
        Wil = Wil + gamma1l | 0;
        Wih = Wih + gamma1 + getCarry(Wil, gamma1l) | 0;
        Wil = Wil + Wi16l | 0;
        Wih = Wih + Wi16h + getCarry(Wil, Wi16l) | 0;
        W[i] = Wih;
        W[i + 1] = Wil;
      }
      for (var j = 0; j < 160; j += 2) {
        Wih = W[j];
        Wil = W[j + 1];
        var majh = maj(ah, bh, ch);
        var majl = maj(al, bl, cl);
        var sigma0h = sigma0(ah, al);
        var sigma0l = sigma0(al, ah);
        var sigma1h = sigma1(eh, el);
        var sigma1l = sigma1(el, eh);
        var Kih = K[j];
        var Kil = K[j + 1];
        var chh = Ch(eh, fh, gh);
        var chl = Ch(el, fl, gl);
        var t1l = hl + sigma1l | 0;
        var t1h = hh + sigma1h + getCarry(t1l, hl) | 0;
        t1l = t1l + chl | 0;
        t1h = t1h + chh + getCarry(t1l, chl) | 0;
        t1l = t1l + Kil | 0;
        t1h = t1h + Kih + getCarry(t1l, Kil) | 0;
        t1l = t1l + Wil | 0;
        t1h = t1h + Wih + getCarry(t1l, Wil) | 0;
        var t2l = sigma0l + majl | 0;
        var t2h = sigma0h + majh + getCarry(t2l, sigma0l) | 0;
        hh = gh;
        hl = gl;
        gh = fh;
        gl = fl;
        fh = eh;
        fl = el;
        el = dl + t1l | 0;
        eh = dh + t1h + getCarry(el, dl) | 0;
        dh = ch;
        dl = cl;
        ch = bh;
        cl = bl;
        bh = ah;
        bl = al;
        al = t1l + t2l | 0;
        ah = t1h + t2h + getCarry(al, t1l) | 0;
      }
      this._al = this._al + al | 0;
      this._bl = this._bl + bl | 0;
      this._cl = this._cl + cl | 0;
      this._dl = this._dl + dl | 0;
      this._el = this._el + el | 0;
      this._fl = this._fl + fl | 0;
      this._gl = this._gl + gl | 0;
      this._hl = this._hl + hl | 0;
      this._ah = this._ah + ah + getCarry(this._al, al) | 0;
      this._bh = this._bh + bh + getCarry(this._bl, bl) | 0;
      this._ch = this._ch + ch + getCarry(this._cl, cl) | 0;
      this._dh = this._dh + dh + getCarry(this._dl, dl) | 0;
      this._eh = this._eh + eh + getCarry(this._el, el) | 0;
      this._fh = this._fh + fh + getCarry(this._fl, fl) | 0;
      this._gh = this._gh + gh + getCarry(this._gl, gl) | 0;
      this._hh = this._hh + hh + getCarry(this._hl, hl) | 0;
    };
    Sha512.prototype._hash = function() {
      var H = Buffer.allocUnsafe(64);
      function writeInt64BE(h, l, offset) {
        H.writeInt32BE(h, offset);
        H.writeInt32BE(l, offset + 4);
      }
      writeInt64BE(this._ah, this._al, 0);
      writeInt64BE(this._bh, this._bl, 8);
      writeInt64BE(this._ch, this._cl, 16);
      writeInt64BE(this._dh, this._dl, 24);
      writeInt64BE(this._eh, this._el, 32);
      writeInt64BE(this._fh, this._fl, 40);
      writeInt64BE(this._gh, this._gl, 48);
      writeInt64BE(this._hh, this._hl, 56);
      return H;
    };
    module.exports = Sha512;
  }, {
    "./hash": 144,
    inherits: 101,
    "safe-buffer": 143
  } ],
  152: [ function(require, module, exports) {
    module.exports = Stream;
    var EE = require("events").EventEmitter;
    var inherits = require("inherits");
    inherits(Stream, EE);
    Stream.Readable = require("readable-stream/readable.js");
    Stream.Writable = require("readable-stream/writable.js");
    Stream.Duplex = require("readable-stream/duplex.js");
    Stream.Transform = require("readable-stream/transform.js");
    Stream.PassThrough = require("readable-stream/passthrough.js");
    Stream.Stream = Stream;
    function Stream() {
      EE.call(this);
    }
    Stream.prototype.pipe = function(dest, options) {
      var source = this;
      function ondata(chunk) {
        dest.writable && false === dest.write(chunk) && source.pause && source.pause();
      }
      source.on("data", ondata);
      function ondrain() {
        source.readable && source.resume && source.resume();
      }
      dest.on("drain", ondrain);
      if (!dest._isStdio && (!options || false !== options.end)) {
        source.on("end", onend);
        source.on("close", onclose);
      }
      var didOnEnd = false;
      function onend() {
        if (didOnEnd) return;
        didOnEnd = true;
        dest.end();
      }
      function onclose() {
        if (didOnEnd) return;
        didOnEnd = true;
        "function" === typeof dest.destroy && dest.destroy();
      }
      function onerror(er) {
        cleanup();
        if (0 === EE.listenerCount(this, "error")) throw er;
      }
      source.on("error", onerror);
      dest.on("error", onerror);
      function cleanup() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        dest.removeListener("close", cleanup);
      }
      source.on("end", cleanup);
      source.on("close", cleanup);
      dest.on("close", cleanup);
      dest.emit("pipe", source);
      return dest;
    };
  }, {
    events: 83,
    inherits: 101,
    "readable-stream/duplex.js": 127,
    "readable-stream/passthrough.js": 138,
    "readable-stream/readable.js": 139,
    "readable-stream/transform.js": 140,
    "readable-stream/writable.js": 141
  } ],
  153: [ function(require, module, exports) {
    var Buffer = require("buffer").Buffer;
    var isBufferEncoding = Buffer.isEncoding || function(encoding) {
      switch (encoding && encoding.toLowerCase()) {
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
        return true;

       default:
        return false;
      }
    };
    function assertEncoding(encoding) {
      if (encoding && !isBufferEncoding(encoding)) throw new Error("Unknown encoding: " + encoding);
    }
    var StringDecoder = exports.StringDecoder = function(encoding) {
      this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, "");
      assertEncoding(encoding);
      switch (this.encoding) {
       case "utf8":
        this.surrogateSize = 3;
        break;

       case "ucs2":
       case "utf16le":
        this.surrogateSize = 2;
        this.detectIncompleteChar = utf16DetectIncompleteChar;
        break;

       case "base64":
        this.surrogateSize = 3;
        this.detectIncompleteChar = base64DetectIncompleteChar;
        break;

       default:
        this.write = passThroughWrite;
        return;
      }
      this.charBuffer = new Buffer(6);
      this.charReceived = 0;
      this.charLength = 0;
    };
    StringDecoder.prototype.write = function(buffer) {
      var charStr = "";
      while (this.charLength) {
        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
        buffer.copy(this.charBuffer, this.charReceived, 0, available);
        this.charReceived += available;
        if (this.charReceived < this.charLength) return "";
        buffer = buffer.slice(available, buffer.length);
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 55296 && charCode <= 56319) {
          this.charLength += this.surrogateSize;
          charStr = "";
          continue;
        }
        this.charReceived = this.charLength = 0;
        if (0 === buffer.length) return charStr;
        break;
      }
      this.detectIncompleteChar(buffer);
      var end = buffer.length;
      if (this.charLength) {
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
        end -= this.charReceived;
      }
      charStr += buffer.toString(this.encoding, 0, end);
      var end = charStr.length - 1;
      var charCode = charStr.charCodeAt(end);
      if (charCode >= 55296 && charCode <= 56319) {
        var size = this.surrogateSize;
        this.charLength += size;
        this.charReceived += size;
        this.charBuffer.copy(this.charBuffer, size, 0, size);
        buffer.copy(this.charBuffer, 0, 0, size);
        return charStr.substring(0, end);
      }
      return charStr;
    };
    StringDecoder.prototype.detectIncompleteChar = function(buffer) {
      var i = buffer.length >= 3 ? 3 : buffer.length;
      for (;i > 0; i--) {
        var c = buffer[buffer.length - i];
        if (1 == i && c >> 5 == 6) {
          this.charLength = 2;
          break;
        }
        if (i <= 2 && c >> 4 == 14) {
          this.charLength = 3;
          break;
        }
        if (i <= 3 && c >> 3 == 30) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i;
    };
    StringDecoder.prototype.end = function(buffer) {
      var res = "";
      buffer && buffer.length && (res = this.write(buffer));
      if (this.charReceived) {
        var cr = this.charReceived;
        var buf = this.charBuffer;
        var enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }
      return res;
    };
    function passThroughWrite(buffer) {
      return buffer.toString(this.encoding);
    }
    function utf16DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 2;
      this.charLength = this.charReceived ? 2 : 0;
    }
    function base64DetectIncompleteChar(buffer) {
      this.charReceived = buffer.length % 3;
      this.charLength = this.charReceived ? 3 : 0;
    }
  }, {
    buffer: 47
  } ],
  154: [ function(require, module, exports) {
    (function(global) {
      module.exports = deprecate;
      function deprecate(fn, msg) {
        if (config("noDeprecation")) return fn;
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (config("throwDeprecation")) throw new Error(msg);
            config("traceDeprecation") ? console.trace(msg) : console.warn(msg);
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      }
      function config(name) {
        try {
          if (!global.localStorage) return false;
        } catch (_) {
          return false;
        }
        var val = global.localStorage[name];
        if (null == val) return false;
        return "true" === String(val).toLowerCase();
      }
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {} ],
  155: [ function(require, module, exports) {
    var indexOf = require("indexof");
    var Object_keys = function(obj) {
      if (Object.keys) return Object.keys(obj);
      var res = [];
      for (var key in obj) res.push(key);
      return res;
    };
    var forEach = function(xs, fn) {
      if (xs.forEach) return xs.forEach(fn);
      for (var i = 0; i < xs.length; i++) fn(xs[i], i, xs);
    };
    var defineProp = function() {
      try {
        Object.defineProperty({}, "_", {});
        return function(obj, name, value) {
          Object.defineProperty(obj, name, {
            writable: true,
            enumerable: false,
            configurable: true,
            value: value
          });
        };
      } catch (e) {
        return function(obj, name, value) {
          obj[name] = value;
        };
      }
    }();
    var globals = [ "Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape" ];
    function Context() {}
    Context.prototype = {};
    var Script = exports.Script = function NodeScript(code) {
      if (!(this instanceof Script)) return new Script(code);
      this.code = code;
    };
    Script.prototype.runInContext = function(context) {
      if (!(context instanceof Context)) throw new TypeError("needs a 'context' argument.");
      var iframe = document.createElement("iframe");
      iframe.style || (iframe.style = {});
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      var win = iframe.contentWindow;
      var wEval = win.eval, wExecScript = win.execScript;
      if (!wEval && wExecScript) {
        wExecScript.call(win, "null");
        wEval = win.eval;
      }
      forEach(Object_keys(context), function(key) {
        win[key] = context[key];
      });
      forEach(globals, function(key) {
        context[key] && (win[key] = context[key]);
      });
      var winKeys = Object_keys(win);
      var res = wEval.call(win, this.code);
      forEach(Object_keys(win), function(key) {
        (key in context || -1 === indexOf(winKeys, key)) && (context[key] = win[key]);
      });
      forEach(globals, function(key) {
        key in context || defineProp(context, key, win[key]);
      });
      document.body.removeChild(iframe);
      return res;
    };
    Script.prototype.runInThisContext = function() {
      return eval(this.code);
    };
    Script.prototype.runInNewContext = function(context) {
      var ctx = Script.createContext(context);
      var res = this.runInContext(ctx);
      forEach(Object_keys(ctx), function(key) {
        context[key] = ctx[key];
      });
      return res;
    };
    forEach(Object_keys(Script.prototype), function(name) {
      exports[name] = Script[name] = function(code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
      };
    });
    exports.createScript = function(code) {
      return exports.Script(code);
    };
    exports.createContext = Script.createContext = function(context) {
      var copy = new Context();
      "object" === typeof context && forEach(Object_keys(context), function(key) {
        copy[key] = context[key];
      });
      return copy;
    };
  }, {
    indexof: 100
  } ],
  AdManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b97bdQnYlF/4OO9kyIkgFS", "AdManager");
    "use strict";
    hall.adManager = {
      videoAdId: "adunit-547bbb5117a6e8ae",
      rewardedVideoType: "",
      videoAdManager: null,
      checkVideoTime: 3e5,
      retryCrossTimes: 3,
      retryBannerTimes: 3,
      AnimType: {
        STATIC: 1,
        SHAKE: 2,
        FRAME: 3
      },
      adNodeList: [],
      bannerNodeList: [],
      allAdInfoList: [],
      allBannerInfoList: [],
      rawAdInfoList: [],
      rawBannerInfoList: [],
      showRewardedVideo: function showRewardedVideo(type) {
        this.rewardedVideoType = type;
        if (!wx.hasOwnProperty("createRewardedVideoAd")) {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, [ "no_support", type ]);
          hall.LOGW(null, "玩家基础库,不支持激励广告视频!");
          ty.NotificationCenter.trigger(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR, "您的微信版本过低,请升级至6.6.6以上");
          return;
        }
        this.destroyBannerAd();
        var onvVdClose = function onvVdClose(res) {
          shot.LOGD(null, "广告播放完毕!");
          var playEnded = !res || res && res.isEnded;
          playEnded ? ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, [ "success", type ]) : ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, [ "noComplete", type ]);
          ty.NotificationCenter.trigger(shot.EventType.REWARD_VIDEO_COMPLETE, playEnded);
          hall.adManager.videoAdManager.offClose(onvVdClose);
          hall.adManager.canPlay = false;
          hall.adManager.checkVideoAd();
        };
        if (hall.adManager.canPlay) {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, [ "begin", type ]);
          hall.adManager.videoAdManager.show();
          this.destroyBannerAd();
          hall.adManager.videoAdManager.onClose(onvVdClose);
        } else {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, [ "fail", type ]);
          ty.NotificationCenter.trigger(shot.EventType.REWARD_VIDEO_COMPLETE, true);
        }
      },
      checkVideoAd: function checkVideoAd() {
        if (!wx.hasOwnProperty("createRewardedVideoAd")) {
          hall.adManager.canPlay = false;
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWatchVideo, [ "not support" ]);
          hall.LOGW(null, "玩家基础库,不支持激励广告视频!");
          return;
        }
        this.videoAdManager || (this.videoAdManager = wx.createRewardedVideoAd({
          adUnitId: hall.adManager.videoAdId
        }));
        this.videoAdManager.load().then(function() {
          hall.LOGW("====== 成功获取广告");
          hall.adManager.canPlay = true;
        }).catch(function(err) {
          hall.LOGW("====== 获取广告失败,继续获取", JSON.stringify(err));
          hall.adManager.canPlay = false;
          setTimeout(function() {
            hall.adManager.checkVideoAd();
          }, hall.adManager.checkVideoTime);
        });
      },
      getSysInfo: function getSysInfo() {
        this.sysInfo || (this.sysInfo = wx.getSystemInfoSync());
        return this.sysInfo;
      },
      canShowBanner: function canShowBanner() {
        return wx.hasOwnProperty("createBannerAd");
      },
      showBannerAd: function showBannerAd(adid, refresh) {
        if (!shot.GameWorld.gunnerShareSchemeConfig || !shot.GameWorld.gunnerShareSchemeConfig.showBanner) return;
        if (!this.canShowBanner) {
          hall.LOGW(null, "玩家基础库,不支持banner!");
          return;
        }
        var sysInfo = this.getSysInfo();
        var screenWidth = sysInfo.screenWidth;
        var screenHeight = sysInfo.screenHeight;
        hall.LOGW("showBannerAd", "当前屏幕宽度:" + screenWidth + "; screenHeight:" + screenHeight);
        var top = 0;
        if (shot.curBannerAd) {
          if (refresh) {
            this.destroyBannerAd();
            shot.curBannerAd = wx.createBannerAd({
              adUnitId: adid,
              style: {
                left: 0,
                top: top,
                width: screenWidth
              }
            });
          }
        } else shot.curBannerAd = wx.createBannerAd({
          adUnitId: adid,
          style: {
            left: 0,
            top: top,
            width: screenWidth
          }
        });
        shot.curBannerAd.onResize(function(res) {
          hall.LOGW("showBannerAd", "当前banner,width:" + res.width + "; height:" + res.height);
          if (shot.curBannerAd) {
            shot.curBannerAd.style.left = 0;
            top = res.height;
            ty.UserInfo.systemType == ty.UserInfo.SYSTEMTYPE.iPhoneXType ? shot.curBannerAd.style.top = screenHeight - top - 30 : shot.curBannerAd.style.top = screenHeight - top;
          }
        });
        shot.curBannerAd.show();
      },
      hideBannerAd: function hideBannerAd() {
        shot.curBannerAd && shot.curBannerAd.hide();
      },
      destroyBannerAd: function destroyBannerAd() {
        if (shot.curBannerAd) {
          shot.curBannerAd.destroy();
          shot.curBannerAd = null;
        }
      },
      showAd: function showAd(position, tag) {
        var _adnode = new hall.adManager.adNodeClass();
        _adnode.adInfoList = JSON.parse(JSON.stringify(hall.adManager.allAdInfoList));
        _adnode.adType = 1;
        _adnode.adTag = tag;
        _adnode.createAdNode(position);
        hall.adManager.adNodeList.push(_adnode);
      },
      showBanner: function showBanner(position, tag) {
        var _adnode = new hall.adManager.adNodeClass();
        _adnode.adInfoList = JSON.parse(JSON.stringify(hall.adManager.allBannerInfoList));
        _adnode.adType = 2;
        _adnode.adTag = tag;
        _adnode.createAdNode(position);
        hall.adManager.bannerNodeList.push(_adnode);
      },
      getAdNodeList: function getAdNodeList() {
        return this.adNodeList;
      },
      getAdNodeByTag: function getAdNodeByTag(tag) {
        if (!tag) return null;
        for (var n in this.adNodeList) if (this.adNodeList[n].adTag.toString() == tag.toString()) return this.adNodeList[n];
        return null;
      },
      getBannerNodeList: function getBannerNodeList() {
        return this.bannerNodeList;
      },
      getBannerNodeByTag: function getBannerNodeByTag(tag) {
        if (!tag) return null;
        for (var n in this.bannerNodeList) if (this.bannerNodeList[n].adTag.toString() == tag.toString()) return this.bannerNodeList[n];
        return null;
      },
      getAdInfoList: function getAdInfoList() {
        return this.allAdInfoList;
      },
      getBannerInfoList: function getBannerInfoList() {
        return this.allBannerInfoList;
      },
      adNodeClass: function adNodeClass() {
        this.adType = 0;
        this.adIconBtn = null;
        this.currentAdInfo = null;
        this.currentWebPage = null;
        this.adInfoList = [];
        this.adTag = "";
      },
      adNodeObj: {
        createAdNode: function createAdNode(pos) {
          this.genRandomFirstAdInfo();
          if (!this.currentAdInfo) return;
          if (this.adIconBtn) this.adIconBtn.active = true; else {
            var that = this;
            cc.loader.loadRes("shot_prefabs/adNode", function(err, prefab) {
              var preFabNode = cc.instantiate(prefab);
              var _pos = pos || {
                x: 0,
                y: 0
              };
              preFabNode.position = cc.p(_pos.x, _pos.y);
              that.adIconBtn = preFabNode;
              cc.game.addPersistRootNode(preFabNode);
              that.adIconNode();
              var adButton = that.adIconBtn.getChildByName("adButton");
              adButton.on("click", function() {
                that.onClickAdIconBtn();
              });
            });
          }
        },
        genRandomFirstAdInfo: function genRandomFirstAdInfo() {
          var that = this;
          if (0 == this.adInfoList.length) return;
          var weight_list = [ {
            weight: 0,
            id: "000"
          } ];
          for (var i in this.adInfoList) {
            var _randomObj = {
              weight: parseInt(that.adInfoList[i].icon_weight),
              id: that.adInfoList[i].icon_id
            };
            weight_list.push(_randomObj);
          }
          weight_list.sort(function(a, b) {
            return a.weight > b.weight;
          });
          var _total = 0;
          weight_list.forEach(function(element) {
            _total += element.weight;
          });
          var _randomIndex = parseInt(1e4 * Math.random()) % (_total + 1);
          var _tTotal = 0;
          var _selectIndex = 0;
          for (var i = 0; i < weight_list.length - 1; i++) {
            _tTotal += weight_list[i].weight;
            if (_tTotal < _randomIndex && _tTotal + weight_list[i + 1].weight >= _randomIndex) {
              _selectIndex = i + 1;
              break;
            }
          }
          var _selectObj = weight_list[_selectIndex];
          this.adInfoList.forEach(function(element) {
            element.icon_id == _selectObj.id && (that.currentAdInfo = element);
          });
        },
        genRandomSecondAdInfo: function genRandomSecondAdInfo() {
          var that = this;
          var _webPages = this.currentAdInfo.webpages;
          if ("undefined" === typeof _webPages || 0 == _webPages.length) return;
          var weight_list = [ {
            weight: 0,
            id: "000"
          } ];
          for (var i in _webPages) {
            var _randomObj = {
              weight: parseInt(_webPages[i].webpage_weight),
              id: _webPages[i].config_id
            };
            weight_list.push(_randomObj);
          }
          weight_list.sort(function(a, b) {
            return a.weight > b.weight;
          });
          var _total = 0;
          weight_list.forEach(function(element) {
            _total += element.weight;
          });
          var _randomIndex = parseInt(1e4 * Math.random()) % (_total + 1);
          var _tTotal = 0;
          var _selectIndex = 0;
          for (var i = 0; i < weight_list.length - 1; i++) {
            _tTotal += weight_list[i].weight;
            if (_tTotal < _randomIndex && _tTotal + weight_list[i + 1].weight >= _randomIndex) {
              _selectIndex = i + 1;
              break;
            }
          }
          var _selectObj = weight_list[_selectIndex];
          _webPages.forEach(function(element) {
            element.config_id == _selectObj.id && (that.currentWebPage = element);
          });
        },
        adIconNode: function adIconNode() {
          if (!this.currentAdInfo || !this.adIconBtn) return;
          var _animaType = this.currentAdInfo.icon_type;
          var that = this;
          var spriteIco = this.adIconBtn.getChildByName("adIconNode").getChildByName("adIcon");
          var adButton = this.adIconBtn.getChildByName("adButton");
          spriteIco.stopAllActions();
          spriteIco.removeComponent(cc.Animation);
          spriteIco.setRotation(0);
          switch (_animaType) {
           case hall.adManager.AnimType.STATIC:
            cc.loader.load({
              url: that.currentAdInfo.icon_url[0]
            }, function(err, texture) {
              if (!err) {
                spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                if (texture && texture.width && texture.height) {
                  spriteIco.setContentSize(cc.size(texture.width, texture.height));
                  adButton.setContentSize(cc.size(texture.width, texture.height));
                }
              }
            });
            break;

           case hall.adManager.AnimType.SHAKE:
            cc.loader.load({
              url: that.currentAdInfo.icon_url[0]
            }, function(error, texture) {
              spriteIco.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
              if (texture && texture.width && texture.height) {
                spriteIco.setContentSize(cc.size(texture.width, texture.height));
                adButton.setContentSize(cc.size(texture.width, texture.height));
              }
              spriteIco.anchorX = .5;
              spriteIco.anchorY = .5;
              var _act1 = cc.rotateBy(.06, -20);
              var _act2 = cc.rotateBy(.12, 40);
              var _act3 = cc.rotateBy(.12, -40);
              var _act4 = cc.rotateBy(.06, 20);
              var _delay = cc.delayTime(1);
              spriteIco.runAction(cc.repeatForever(cc.sequence(_act1, cc.repeat(cc.sequence(_act2, _act3), 4), _act4, _delay)));
            });
            break;

           case hall.adManager.AnimType.FRAME:
            var allFrames = [];
            var playFrameAction = function playFrameAction() {
              spriteIco.stopAllActions();
              spriteIco.removeComponent(cc.Animation);
              var _firstFrameIcon = allFrames[0].getTexture();
              if (_firstFrameIcon && _firstFrameIcon.width && _firstFrameIcon.height) {
                spriteIco.setContentSize(cc.size(_firstFrameIcon.width, _firstFrameIcon.height));
                adButton.setContentSize(cc.size(_firstFrameIcon.width, _firstFrameIcon.height));
              }
              var _time_interval = that.currentAdInfo.time_interval;
              var _frameRate = _time_interval && _time_interval > 0 ? 1e3 / _time_interval : 10;
              var animation = spriteIco.addComponent(cc.Animation);
              var clip = cc.AnimationClip.createWithSpriteFrames(allFrames, _frameRate);
              clip.name = "anim_frame";
              clip.wrapMode = cc.WrapMode.Loop;
              animation.addClip(clip);
              animation.play("anim_frame");
            };
            cc.loader.load(that.currentAdInfo.icon_url, function(err, results) {
              if (err) for (var i = 0; i < err.length; i++) cc.log("Error url [" + err[i] + "]: " + results.getError(err[i]));
              for (var i = 0; i < that.currentAdInfo.icon_url.length; i++) if (results.getContent(that.currentAdInfo.icon_url[i])) {
                var _frame = new cc.SpriteFrame(results.getContent(that.currentAdInfo.icon_url[i]));
                allFrames.push(_frame);
              }
              playFrameAction();
            });
          }
        },
        onClickAdIconBtn: function onClickAdIconBtn() {
          try {
            this.genRandomSecondAdInfo();
            var skip_type = this.currentAdInfo.icon_skip_type;
            var toappid = this.currentAdInfo.toappid;
            var togame = this.currentAdInfo.togame;
            var topath = this.currentAdInfo.path;
            var second_toappid = this.currentAdInfo.second_toappid;
            hall.LOGW("topath ====>" + topath);
            var that = this;
            var icon_id = this.currentAdInfo.icon_id;
            var config_id = "0";
            var webpage_url = "";
            var webpage_id = "0";
            if (this.currentWebPage && 1 == this.adType) {
              webpage_url = this.currentWebPage.webpage_url;
              config_id = this.currentWebPage.config_id;
              webpage_id = this.currentWebPage.webpage_id;
            }
            var bi_paramlist = [ icon_id, config_id, webpage_url, toappid, togame, webpage_id, that.adType ];
            hall.LOGW("bi_paramlist ====> " + JSON.stringify(bi_paramlist));
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickAdBtn, bi_paramlist);
            if (wx && wx.navigateToMiniProgram) {
              if (1 == skip_type) {
                wx.navigateToMiniProgram({
                  appId: toappid,
                  path: topath || "?from=adcross",
                  envVersion: "release",
                  extraData: {
                    from: topath || "?from=adcross"
                  },
                  success: function success(res) {
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                    hall.LOGW("wx.navigateToMiniProgram success");
                    hall.LOGW(res);
                  },
                  fail: function fail(res) {
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                    hall.LOGW("wx.navigateToMiniProgram fail");
                    hall.LOGW(res);
                  },
                  complete: function complete(res) {
                    hall.LOGW("navigateToMiniProgram ==== complete");
                    that.resetBtnIcon();
                  }
                });
                return;
              }
              2 == skip_type ? wx.navigateToMiniProgram({
                appId: second_toappid,
                path: topath || "?from=adcross",
                envVersion: "release",
                extraData: {
                  from: topath || "?from=adcross"
                },
                success: function success(res) {
                  ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameSuccess, bi_paramlist);
                  hall.LOGW("wx.navigateToMiniProgram success");
                  hall.LOGW(res);
                },
                fail: function fail(res) {
                  ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickDirectToMiniGameFail, bi_paramlist);
                  hall.LOGW("wx.navigateToMiniProgram fail");
                  hall.LOGW(res);
                },
                complete: function complete(res) {
                  that.resetBtnIcon();
                  hall.LOGW("navigateToMiniProgram ==== complete");
                }
              }) : console.error("Unsupported skip type! Please Check!");
              return;
            }
            if (!that.currentWebPage || !that.currentWebPage.webpage_url) {
              that.resetBtnIcon();
              return;
            }
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeClickShowQRCode, bi_paramlist);
            wx.previewImage({
              current: [ that.currentWebPage.webpage_url ],
              urls: [ that.currentWebPage.webpage_url ],
              success: function success(res) {
                hall.LOGD(null, "预览图片成功！");
              },
              fail: function fail(res) {
                hall.LOGD(null, "预览图片失败！");
              },
              complete: function complete(res) {
                hall.LOGW("预览图片完成");
                that.resetBtnIcon();
              }
            });
          } catch (err) {
            hall.LOGW("error:", "tywx.AdManager.onClickAdIconBtn——" + JSON.stringify(err));
          }
        },
        resetBtnIcon: function resetBtnIcon() {
          if (!this.adIconBtn) return;
          this.genRandomFirstAdInfo();
          this.adIconNode();
        },
        onForeGround: function onForeGround() {
          this.adIconNode();
        },
        showAdNode: function showAdNode() {
          this.adIconBtn && this.adIconBtn && (this.adIconBtn.active = true);
        },
        hideAdNode: function hideAdNode() {
          this.adIconBtn && this.adIconBtn && (this.adIconBtn.active = false);
        }
      },
      freshAdIconByTime: function freshAdIconByTime() {
        hall.adManager.adNodeList.forEach(function(_adNode) {
          _adNode && _adNode.resetBtnIcon && _adNode.resetBtnIcon();
        });
      },
      freshAdBannerByTime: function freshAdBannerByTime() {
        hall.adManager.bannerNodeList.forEach(function(_adNode) {
          _adNode && _adNode.resetBtnIcon && _adNode.resetBtnIcon();
        });
      },
      startFreshAdIcon: function startFreshAdIcon() {
        var icon_interval = 10;
        for (var i = 0; i < this.allAdInfoList.length; i++) {
          var _icon_interval = this.allAdInfoList[i].icon_interval;
          if (_icon_interval) {
            icon_interval = parseInt(_icon_interval) > 0 ? parseInt(_icon_interval) : icon_interval;
            break;
          }
        }
        ty.Timer.cancelTimer(cc.director, hall.adManager.freshAdIconByTime);
        ty.Timer.setTimer(cc.director, hall.adManager.freshAdIconByTime, icon_interval, cc.macro.REPEAT_FOREVER, icon_interval);
        var banner_interval = 10;
        for (var i = 0; i < this.allBannerInfoList.length; i++) {
          var _icon_interval = this.allBannerInfoList[i].icon_interval;
          if (_icon_interval) {
            banner_interval = parseInt(_icon_interval) > 0 ? parseInt(_icon_interval) : banner_interval;
            break;
          }
        }
        ty.Timer.cancelTimer(cc.director, hall.adManager.freshAdBannerByTime);
        ty.Timer.setTimer(cc.director, hall.adManager.freshAdBannerByTime, banner_interval, cc.macro.REPEAT_FOREVER, banner_interval);
      },
      onForeGround: function onForeGround() {
        this.freshAdIconByTime();
        this.freshAdBannerByTime();
        this.startFreshAdIcon();
      },
      getConfigSignStr: function getConfigSignStr(reqObj) {
        var sortedKeys = Object.keys(reqObj).sort();
        var signStr = "";
        for (var i = 0; i < sortedKeys.length; i++) {
          var key = sortedKeys[i];
          if ("act" == key || "sign" == key) continue;
          signStr += key + "=" + reqObj[key];
        }
        var finalSign = hall.hex_md5("market.tuyoo.com-api-" + signStr + "-market.tuyoo-api") || "";
        return finalSign;
      },
      requestADInfo: function requestADInfo() {
        try {
          this.retryCrossTimes--;
          var reqObj = {};
          var timeStamp = new Date().getTime();
          reqObj.act = "api.getCrossConfig";
          reqObj.time = timeStamp;
          reqObj.game_mark = ty.SystemInfo.cloudid + "-" + ty.SystemInfo.gameId;
          var signStr = this.getConfigSignStr(reqObj);
          var paramStrList = [];
          for (var key in reqObj) paramStrList.push(key + "=" + reqObj[key]);
          paramStrList.push("sign=" + signStr);
          var finalUrl = ty.SystemInfo.shareManagerUrl + "?" + paramStrList.join("&");
          var that = this;
          wx.request({
            url: finalUrl,
            method: "GET",
            success: function success(res) {
              if (200 == res.statusCode) {
                var ret = res.data;
                that.allAdInfoList = [];
                if (ret.retmsg) {
                  that.rawAdInfoList = ret.retmsg;
                  that.processRawConfigInfo();
                }
                that.retryCrossTimes = 3;
              } else that.retryCrossTimes > 0 ? that.requestADInfo() : that.retryCrossTimes = 3;
            },
            fail: function fail(res) {
              that.retryCrossTimes > 0 ? that.requestADInfo() : that.retryCrossTimes = 3;
            }
          });
        } catch (err) {
          hall.LOGE("error:", "tywx.AdManager.requestADInfo——" + JSON.stringify(err));
        }
      },
      requestBannerInfo: function requestBannerInfo() {
        try {
          this.retryBannerTimes--;
          var reqObj = {};
          var timeStamp = new Date().getTime();
          reqObj.act = "api.getBannerConfig";
          reqObj.time = timeStamp;
          reqObj.game_mark = ty.SystemInfo.cloudid + "-" + ty.SystemInfo.gameId;
          var signStr = this.getConfigSignStr(reqObj);
          var paramStrList = [];
          for (var key in reqObj) paramStrList.push(key + "=" + reqObj[key]);
          paramStrList.push("sign=" + signStr);
          var finalUrl = ty.SystemInfo.shareManagerUrl + "?" + paramStrList.join("&");
          var that = this;
          wx.request({
            url: finalUrl,
            method: "GET",
            success: function success(res) {
              if (200 == res.statusCode) {
                var ret = res.data;
                that.allBannerInfoList = [];
                if (ret.retmsg) {
                  that.rawBannerInfoList = ret.retmsg;
                  that.processRawConfigInfo();
                }
                that.retryBannerTimes = 3;
              } else that.retryBannerTimes > 0 ? that.requestBannerInfo() : that.retryBannerTimes = 3;
            },
            fail: function fail(res) {
              that.retryBannerTimes > 0 ? that.requestBannerInfo() : that.retryBannerTimes = 3;
            }
          });
        } catch (err) {
          hall.LOGE("error:", "tywx.AdManager.requestADInfo——" + JSON.stringify(err));
        }
      },
      requestLocalIPInfo: function requestLocalIPInfo() {
        var that = this;
        var _url = "https://iploc.ywdier.com/api/iploc5/search/city";
        wx.request({
          url: _url,
          success: function success(res) {
            if (200 == res.statusCode) {
              res.data && res.data.loc && (that.ipLocInfo = res.data);
              that.processRawConfigInfo();
            }
          },
          fail: function fail(res) {}
        });
      },
      processRawConfigInfo: function processRawConfigInfo() {
        var that = this;
        this.allBannerInfoList = [];
        this.allAdInfoList = [];
        if (this.ipLocInfo && this.ipLocInfo.loc && this.ipLocInfo.loc[1]) {
          var _locProvince = this.ipLocInfo.loc[1];
          this.rawAdInfoList.forEach(function(v) {
            (void 0 == v.icon_weight || Math.floor(v.icon_weight) <= .1) && (v.icon_weight = 0);
            v.icon_weight = 10;
            var isForbidden = true;
            if (v.province && v.province instanceof Array) if (0 == v.province.length) isForbidden = false; else for (var i in v.province) {
              var _iProvince = v.province[i];
              if (_iProvince.indexOf(_locProvince) > -1) {
                isForbidden = false;
                break;
              }
            } else isForbidden = false;
            isForbidden || that.allAdInfoList.push(v);
          });
          this.rawBannerInfoList.forEach(function(v) {
            (void 0 == v.icon_weight || Math.floor(v.icon_weight) <= .1) && (v.icon_weight = 0);
            v.icon_weight = 10;
            var isForbidden = true;
            if (v.province && v.province instanceof Array) if (0 == v.province.length) isForbidden = false; else for (var i in v.province) {
              var _iProvince = v.province[i];
              if (_iProvince.indexOf(_locProvince) > -1) {
                isForbidden = false;
                break;
              }
            } else isForbidden = false;
            isForbidden || that.allBannerInfoList.push(v);
          });
        } else {
          this.rawAdInfoList.forEach(function(v) {
            (void 0 == v.icon_weight || Math.floor(v.icon_weight) <= .1) && (v.icon_weight = 0);
            (!v.province || v.province instanceof Array && 0 == v.province.length) && that.allAdInfoList.push(v);
          });
          this.rawBannerInfoList.forEach(function(v) {
            (void 0 == v.icon_weight || Math.floor(v.icon_weight) <= .1) && (v.icon_weight = 0);
            (!v.province || v.province instanceof Array && 0 == v.province.length) && that.allBannerInfoList.push(v);
          });
        }
      },
      init: function init() {
        this.requestLocalIPInfo();
        this.requestADInfo();
        this.requestBannerInfo();
      }
    };
    hall.adManager.adNodeClass.prototype = hall.adManager.adNodeObj;
    hall.adManager.requestADInfo();
    cc._RF.pop();
  }, {} ],
  BiLog: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9f4f3T4pqRIsIZ/qfJZD5Q0", "BiLog");
    "use strict";
    ty.BiLog = {
      uploadLogTimely: function uploadLogTimely(logtxt) {
        if (!hall.netIsConnected) {
          hall.LOGD("ty.BiLog", "net error!");
          return;
        }
        if (logtxt) {
          var header = [ "Content-Type:text/plain" ];
          var postData = {
            uid: ty.UserInfo.userId,
            time: hall.GlobalTimer.getCurTime(),
            baseVersion: ty.SystemInfo.deviceInfo.SDKVersion,
            wxVersion: ty.SystemInfo.deviceInfo.version,
            clientVersion: ty.SystemInfo.version,
            errMsg: logtxt
          };
          var configObj = {
            url: "https://clienterr.touch4.me/api/bilog5/clientlog?cloudname=" + ty.SystemInfo.cloudid + "." + ty.SystemInfo.clientIdInt,
            header: header,
            postData: postData,
            callback: null
          };
          ty.HttpUtil.httpPost(configObj, "POST");
        }
      },
      getSystemInfo: function getSystemInfo() {
        this.cloud_id = ty.SystemInfo.cloudid;
        this.rec_type = "1";
        this.rec_id = "0";
        this.receive_time = "0";
        this.user_id = ty.UserInfo.userId;
        this.game_id = ty.SystemInfo.gameId;
        this.client_id = ty.SystemInfo.clientId;
        this.device_id = hall.GlobalFuncs.getLocalUuid();
        this.ip_addr = "#IP";
        this.nettype = "0";
        this.phone_maker = "0";
        this.phone_model = ty.UserInfo.model;
        this.phone_carrier = "0";
        this.reserved = "0";
      },
      uploadClickStatLogTimely: function uploadClickStatLogTimely(logtxt) {
        var callbackObj = this;
        if (void 0 != logtxt && "" != logtxt) {
          var header = [ "Content-Type:text/plain" ];
          var configObj = {
            url: ty.SystemInfo.m_server_ip,
            headers: header,
            postData: logtxt,
            obj: callbackObj,
            tag: null,
            callback: null
          };
        }
        ty.HttpUtil.httpPost(configObj, "POST");
      },
      clickStat: function clickStat(eventId, ParamsList) {
        if (debugMode) return;
        null == ParamsList && (ParamsList = []);
        var dyeparams = [];
        if (ParamsList.length < 10) for (var i = 0; i < 9; i++) i < ParamsList.length ? dyeparams.push(ParamsList[i]) : dyeparams.push(0); else dyeparams = ParamsList;
        hall.LOGD("实时日志", "eventid= " + eventId + " 描述 = " + JSON.stringify(dyeparams));
        var bilog = this.assemblelog(eventId, dyeparams);
        this.uploadClickStatLogTimely(bilog + "\n");
      },
      assemblelog: function assemblelog(eventid, paramsarr) {
        var time = new Date().getTime();
        if (time - this._timetag > 6e4) {
          this._timetag = time;
          this.nettype = 0;
        }
        var paramstr = paramsarr.join("\t");
        this.getSystemInfo();
        var logStr = this.cloud_id + "\t" + this.rec_type + "\t" + time + "\t" + this.rec_id + "\t" + this.receive_time + "\t" + eventid + "\t" + this.user_id + "\t" + this.game_id + "\t" + this.client_id + "\t" + this.device_id + "\t" + this.ip_addr + "\t" + this.nettype + "\t" + this.phone_maker + "\t" + this.phone_model + "\t" + this.phone_carrier + "\t" + paramstr + "\t" + this.reserved;
        var str = this.trimTab0(logStr);
        return str;
      },
      trimTab0: function trimTab0(str) {
        if (null == str || void 0 == str) return "";
        var txt = str.replace(/(\t0)*$/, "");
        return txt;
      }
    };
    cc._RF.pop();
  }, {} ],
  EventType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c2bc81HIvFA6rW9Zu6WZZhH", "EventType");
    "use strict";
    console.log("EventType loaded");
    ty.EventType = {
      TCP_ERROR: "tcp_error",
      TCP_CLOSE: "tcp_close",
      TCP_OPENED: "tcp_opened",
      TCP_RECONNECT: "tcp_reconnect",
      TCP_RECEIVE: "tcp_receive",
      HEART_BEAT_LOGIC: "heart_beat_logic",
      HEART_BEAT: "heart_beat",
      MSG_LOG_OUT: "logout",
      CMD_USER_INFO: "user_info",
      CMD_BIND_USER: "bind_user",
      GET_AD_MSG_SUCCESS: "GET_AD_MSG_SUCCESS"
    };
    cc._RF.pop();
  }, {} ],
  GameModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "87fe9za18tLxb5fRGuLY/sv", "GameModel");
    "use strict";
    shot.gameModel = {
      IS_NEW_USER: "IS_NEW_USER",
      IS_NEW_CRAZY: "IS_NEW_CRAZY",
      LAST_VIDEO_DAY: "LAST_VIDEO_DAY",
      DAY_VIDEO_TIME: "DAY_VIDEO_TIME",
      OPEN_BOX_CLOSE_DAY: "OPEN_BOX_CLOSE_DAY",
      OPEN_BOX_CLOSE_TIME: "OPEN_BOX_CLOSE_TIME",
      OPEN_BOX_CLOSE_STATE: "OPEN_BOX_CLOSE_STATE",
      OPEN_BOX_CLOSE_TIME_CHECK: "OPEN_BOX_CLOSE_TIME_CHECK",
      OPEN_BOX_CLOSE_STATE_CHECK: "OPEN_BOX_CLOSE_STATE_CHECK",
      DEBUG_MODE: "DEBUG_MODE",
      rankWindow: null,
      totalScore: 0,
      getNormalConfig: function getNormalConfig() {
        var params = {
          cmd: "game",
          params: {
            action: "common_config",
            gameId: ty.SystemInfo.gameId,
            configKey: "normalConfig"
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      getShareConfig: function getShareConfig() {
        var params = {
          cmd: "game",
          params: {
            action: "common_config",
            gameId: ty.SystemInfo.gameId,
            configKey: "shareConfig"
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      getGunnerShareSchemeConfig: function getGunnerShareSchemeConfig() {
        var params = {
          cmd: "game",
          params: {
            action: "common_config",
            gameId: ty.SystemInfo.gameId,
            configKey: "gunnerShareScheme"
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      saveScore: function saveScore() {
        var params = {
          cmd: "game",
          params: {
            action: "save_score",
            gameId: ty.SystemInfo.gameId,
            score: shot.GameWorld.totalScore,
            itemId: "item:1373",
            propertyName: "fhk"
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      saveLevelScore: function saveLevelScore() {
        var params = {
          cmd: "game",
          params: {
            action: "save_level_score",
            gameId: ty.SystemInfo.gameId,
            score: shot.GameWorld.totalScore
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      getUserInfoForShot: function getUserInfoForShot() {
        var params = {
          cmd: "game",
          params: {
            action: "get_user_info",
            gameId: ty.SystemInfo.gameId
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      consumeAssets: function consumeAssets(count, item) {
        var params = {
          cmd: "game",
          params: {
            action: "consume_assets",
            itemId: item,
            count: count,
            gameId: ty.SystemInfo.gameId
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      bindMutualInviterId: function bindMutualInviterId(inviteId) {
        var params = {
          cmd: "game",
          params: {
            action: "bind_mutual_inviter_id",
            gameId: ty.SystemInfo.gameId,
            inviterId: inviteId
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      getUniqueBoxId: function getUniqueBoxId(itemId, type) {
        var params = {
          cmd: "game",
          params: {
            action: "get_unique_box_id",
            gameId: ty.SystemInfo.gameId,
            itemId: itemId,
            propertyName: type
          }
        };
        hall.MsgFactory._sendCmd(params);
      },
      getBoxReward: function getBoxReward(boxUserId, boxId, groupId) {
        if (!boxUserId || "" == boxUserId) return;
        if (!boxId || "" == boxId) return;
        var pars = {
          cmd: "game",
          params: {
            action: "get_box_reward",
            gameId: ty.SystemInfo.gameId,
            boxUserId: boxUserId,
            boxId: boxId
          }
        };
        groupId && (pars.params.groupId = groupId);
        hall.MsgFactory._sendCmd(pars);
      },
      shareToGetreward: function shareToGetreward(sharePoint) {
        if (!sharePoint || 0 == sharePoint) return;
        var pars = {
          cmd: shot.EventType.HALL_SHARE2,
          params: {
            action: "get_reward",
            gameId: ty.SystemInfo.gameId,
            pointId: sharePoint || 106e5
          }
        };
        hall.MsgFactory._sendCmd(pars);
      },
      checkRewardWithSharePoint: function checkRewardWithSharePoint(sharePoint) {
        if (!sharePoint || 0 == sharePoint) return;
        var pars = {
          cmd: shot.EventType.HALL_SHARE2,
          params: {
            action: shot.EventType.CHECK_REWARD,
            gameId: ty.SystemInfo.gameId,
            pointId: sharePoint
          }
        };
        hall.MsgFactory._sendCmd(pars);
      },
      parseGame: function parseGame(value) {
        switch (value.result.action) {
         case "common_config":
          this.parseCommonConfig(value.result);
          break;

         case "save_score":
          this.saveScoreResult(value.result);
          break;

         case "query_mutual_invite_assets":
          value.result && (shot.gameModel.assetsCounts = value.result.assetsCounts);
          break;

         case "get_user_info":
          value.result && ty.NotificationCenter.trigger(shot.EventType.UPDATE_USERINFO, value.result);
          break;

         case "bind_mutual_inviter_id":
          1 == value.result.success && shot.GlobalFuncs.showDiamondGift(1, value.result);
          break;

         case "consume_assets":
          value.result && ty.NotificationCenter.trigger(shot.EventType.RESURGENCE_RESULT, value.result);
          break;

         case "update_assets":
          value.result && (value.result.itemId && "item:1371" == value.result.itemId ? hall.MsgBoxManager.showToast({
            title: "成功获得1个无限子弹道具"
          }) : value.result.itemId && "item:1372" == value.result.itemId ? hall.MsgBoxManager.showToast({
            title: "成功获得1个瞄准器道具"
          }) : value.result.itemId && "item:1373" == value.result.itemId ? hall.MsgBoxManager.showToast({
            title: "成功获得1颗钻石"
          }) : value.result.itemId && "item:1390" == value.result.itemId && hall.MsgBoxManager.showToast({
            title: "成功获得1个手榴弹道具"
          }));
          break;

         case "get_unique_box_id":
          value.result && shot.GlobalFuncs.showPropBox(value.result);
          break;

         case "get_box_reward":
          if (value.result.rewardMsg) {
            var _rewardMsg = value.result.rewardMsg;
            _rewardMsg.indexOf("无限子弹") > 0 ? shot.GlobalFuncs.playGetPropBoxAni(0) : _rewardMsg.indexOf("激光") > 0 ? shot.GlobalFuncs.playGetPropBoxAni(1) : _rewardMsg.indexOf("手榴弹") > 0 ? shot.GlobalFuncs.playGetPropBoxAni(2) : hall.MsgBoxManager.showToast({
              title: _rewardMsg
            });
          }
        }
      },
      parseCommonConfig: function parseCommonConfig(value) {
        switch (value.configKey) {
         case "normalConfig":
          this.saveNormalConfigJson(value.config);
          break;

         case "shareConfig":
          this.saveShareConfigJson(value.config);
          break;

         case "gunnerShareScheme":
          this.saveGunnerShareSchemeJson(value.config);
        }
      },
      saveNormalConfigJson: function saveNormalConfigJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) return;
        shot.GameWorld.bottleConfig = value.bottleConfig;
        shot.GameWorld.propertyConfig = value.propertyConfig;
        shot.GameWorld.rotationTimeConfig = value.rotationTimeConfig;
        shot.GameWorld.scoreLevelConfig = value.scoreLevelConfig;
        shot.GameWorld.bulletAddConfig = value.bulletAddConfig;
        value.toolUserTimeConfig && (shot.GameWorld.toolUserTimeConfig = value.toolUserTimeConfig);
        value.bulletConfig && (shot.GameWorld.bulletConfig = value.bulletConfig);
        value.treasureConfig && (shot.GameWorld.treasureConfig = value.treasureConfig);
        value.crazyMomentConfig && (shot.GameWorld.crazyMomentConfig = value.crazyMomentConfig);
        value.jugglingSchemaConfig && (shot.GameWorld.jugglingSchemaConfig = value.jugglingSchemaConfig);
        ty.NotificationCenter.trigger(shot.EventType.GUNNER_SHARE_SCHEME);
      },
      saveShareConfigJson: function saveShareConfigJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) return;
        shot.GameWorld.shareConfig = value;
      },
      saveGunnerShareSchemeJson: function saveGunnerShareSchemeJson(value) {
        if (hall.GlobalFuncs.isEmptyObject(value)) return;
        value.allCheckVersion && (ty.SystemInfo.isCheckVersion = value.allCheckVersion == ty.SystemInfo.version);
        shot.GameWorld.gunnerShareSchemeConfig = value;
        if (ty.SystemInfo.isCheckVersion) {
          shot.GameWorld.gunnerShareSchemeConfig.resurgenceShare = value.allCheckConfig;
          shot.GameWorld.gunnerShareSchemeConfig.boxShareGetProp = value.allCheckConfig;
          shot.GameWorld.gunnerShareSchemeConfig.giftBagShareGetDiamond = value.allCheckConfig;
        }
        ty.NotificationCenter.trigger(shot.EventType.GUNNER_SHARE_SCHEME);
        ty.NotificationCenter.trigger(ty.EventType.GET_AD_MSG_SUCCESS);
      },
      getAllCheckConfig: function getAllCheckConfig() {
        return ty.SystemInfo.isCheckVersion && (!shot.GameWorld.gunnerShareSchemeConfig || !shot.GameWorld.gunnerShareSchemeConfig.allCheckConfig);
      },
      saveScoreResult: function saveScoreResult(result) {
        shot.Share.shareKeywordReplace.mysteryGiftBagBoxId = result.boxId;
      }
    };
    cc._RF.pop();
  }, {} ],
  GlobalFuncs: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "29193iArVxFZ6A646OmpNEB", "GlobalFuncs");
    "use strict";
    hall.GlobalFuncs = {};
    hall.SceneGather = [];
    hall.GlobalFuncs.sliceStringToLength = function(str, length) {
      if (!str) return str;
      var len = 0;
      var tmp = 0;
      var s;
      for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        tmp += charCode >= 0 && charCode <= 128 ? 1 : 2;
        tmp <= length - 2 && len++;
      }
      if (tmp <= length) s = str.slice(0); else {
        s = str.slice(0, len);
        s += "..";
      }
      return s;
    };
    hall.GlobalFuncs.formatGold = function(score) {
      if (!score) return "0";
      var tar = "";
      if (score < 0) {
        tar = "-";
        score = -score;
      }
      var scoreText = "";
      var arr;
      var endStr;
      var sp;
      var isInteger = false;
      if (score < 1e4) scoreText = score + ""; else if (score >= 1e4 && score < 1e8) {
        scoreText = score / 1e4 + "";
        if (-1 == scoreText.indexOf(".")) {
          isInteger = true;
          scoreText += ".000";
        } else {
          isInteger = false;
          scoreText += "000";
        }
        arr = scoreText.split(".");
        var wanStr = arr[0];
        sp = 1;
        1 == wanStr.length ? sp = 2 : 2 == wanStr.length ? sp = 1 : 3 == wanStr.length ? sp = 0 : 4 == wanStr.length && (sp = 0);
        endStr = arr[1].substr(0, sp);
        scoreText = wanStr + "." + endStr + "万";
        (0 == sp || isInteger) && (scoreText = wanStr + "万");
      } else {
        scoreText = score / 1e8 + "";
        if (-1 == scoreText.indexOf(".")) {
          isInteger = true;
          scoreText += ".000";
        } else {
          isInteger = false;
          scoreText += "000";
        }
        arr = scoreText.split(".");
        var yiStr = arr[0];
        sp = 1;
        sp = 1 == yiStr.length ? 2 : 2 == yiStr.length ? 1 : (3 == yiStr.length, 0);
        endStr = arr[1].substr(0, sp);
        scoreText = yiStr + "." + endStr + "亿";
        (0 == sp || isInteger) && (scoreText = yiStr + "亿");
      }
      return tar + scoreText;
    };
    hall.GlobalFuncs.PrintArray = function(arr) {
      var s = "";
      for (var index = 0; index < arr.length; index++) {
        s += arr[index];
        s += " ";
      }
      hall.LOGD(null, "global", s);
    };
    hall.GlobalFuncs.FindInArray = function(arr, obj) {
      var len = arr.length;
      for (var index = 0; index < len; index++) if (arr[index] === obj) return index;
      return -1;
    };
    hall.GlobalFuncs.FindInArrayBuFun = function(array, func) {
      for (var i = 0, len = array.length; i < len; i++) {
        var element = array[i];
        if (func(element)) return element;
      }
      return null;
    };
    hall.GlobalFuncs.GetSubArrayExceptIndex = function(arr, indexs) {
      var newarr = arr.slice(0);
      indexs.sort(hall.GlobalFuncs.SortNumberFunc);
      for (var i = indexs.length - 1; i >= 0; i--) newarr.splice(indexs[i], 1);
      return newarr;
    };
    hall.GlobalFuncs.SortNumberFunc = function(c1, c2) {
      return c1 - c2;
    };
    hall.GlobalFuncs.GetLevelByExp = function(exp) {
      var level = 0;
      while (exp > 0) {
        exp -= parseInt(5 * Math.pow(level, 3.5) + 3 * Math.pow(level, 1.5) + 50);
        level++;
      }
      return level - 1;
    };
    hall.GlobalFuncs.GetExpByLevel = function(level) {
      var exp = 0;
      for (var i = 0; i < level; i++) exp += parseInt(5 * Math.pow(i - 1, 3.5) + 3 * Math.pow(i - 1, 1.5) + 50);
      return exp;
    };
    hall.GlobalFuncs.ChangeSpriteTexure = function(sprite, texureName) {
      var frme = cc.spriteFrameCache.getSpriteFrame(texureName);
      frme && sprite.setSpriteFrame(frme);
    };
    hall.GlobalFuncs.ChangeSpriteTexureWithSize = function(sprite, texureName, size) {
      var frme = cc.spriteFrameCache.getSpriteFrame(texureName);
      var f_size = frme.getOriginalSize();
      sprite.setScaleX(size.width / f_size.width);
      sprite.setScaleY(size.height / f_size.height);
      sprite.setSpriteFrame(frme);
    };
    hall.GlobalFuncs.ReadBoolFromLocalStorage = function(key, def_value) {
      if (!cc.sys.localStorage.getItem) return def_value;
      var tmp = cc.sys.localStorage.getItem(key);
      if (!tmp) return def_value;
      var bv = "true" === tmp;
      return bv;
    };
    hall.GlobalFuncs.ReadNumFromLocalStorage = function(key, def_value) {
      if (!cc.sys.localStorage.getItem) return def_value;
      var tmp = cc.sys.localStorage.getItem(key);
      if (!tmp) return def_value;
      return Number(tmp);
    };
    hall.GlobalFuncs.ReadStringFromLocalStorage = function(key, def_value) {
      if (!cc.sys.localStorage.getItem) return def_value;
      var tmp = cc.sys.localStorage.getItem(key);
      if (!tmp) return def_value;
      return String(tmp);
    };
    hall.GlobalFuncs.ReadValueFromLocalStorage = function(key, def_value) {
      if (!cc.sys.localStorage.getItem) return def_value;
      var tmp = cc.sys.localStorage.getItem(key);
      if (!tmp) return def_value;
      return Array(tmp);
    };
    hall.GlobalFuncs.setInLocalStorage = function(key, value) {
      try {
        cc.sys.localStorage.setItem(key, value + "");
      } catch (e) {}
    };
    hall.GlobalFuncs.DownloadImg = function(url, filePath, cobj, callback, params) {
      if (url.indexOf("http") < 0) {
        hall.LOGE("global", "Invalid url to download, return!!!!!!");
        return;
      }
      var configObj = {
        imageUrl: url
      };
      ty.Http.httpGet("proxyImage", configObj, function(retObj) {
        var result = JSON.parse(retObj);
        "200" == result["statusCode"] && 1 != result["openErr"] && 1 != result["writeErr"] && callback.call(cobj, result["path"], params);
      }, "");
    };
    hall.GlobalFuncs.formatSeconds = function(value) {
      var theTime = parseInt(value);
      var theTime1 = 0;
      var theTime2 = 0;
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = "";
      result = theTime > 9 ? "" + parseInt(theTime) : "0" + parseInt(theTime);
      theTime1 >= 0 && (result = theTime1 > 9 ? parseInt(theTime1) + ":" + result : "0" + parseInt(theTime1) + ":" + result);
      theTime2 >= 0 && (result = theTime2 > 9 ? parseInt(theTime2) + ":" + result : "0" + parseInt(theTime2) + ":" + result);
      return result;
    };
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    hall.GlobalFuncs.base64encode = function(input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = hall.GlobalFuncs._utf8_encode(input);
      var len = input.length;
      while (i < len) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = (3 & chr1) << 4 | chr2 >> 4;
        enc3 = (15 & chr2) << 2 | chr3 >> 6;
        enc4 = 63 & chr3;
        isNaN(chr2) ? enc3 = enc4 = 64 : isNaN(chr3) && (enc4 = 64);
        output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
      }
      return output;
    };
    hall.GlobalFuncs.base64decode = function(input) {
      var output = hall.GlobalFuncs.base64decodeRaw(input);
      return hall.GlobalFuncs._utf8_decode(output);
    };
    hall.GlobalFuncs.base64decodeRaw = function(input) {
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      var len = input.length;
      var output = [];
      while (i < len) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (15 & enc2) << 4 | enc3 >> 2;
        chr3 = (3 & enc3) << 6 | enc4;
        output.push(chr1);
        64 != enc3 && output.push(chr2);
        64 != enc4 && output.push(chr3);
      }
      return output;
    };
    hall.GlobalFuncs._utf8_encode = function(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0, len = string.length; n < len; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) utftext += String.fromCharCode(c); else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode(c >> 6 | 192);
          utftext += String.fromCharCode(63 & c | 128);
        } else {
          utftext += String.fromCharCode(c >> 12 | 224);
          utftext += String.fromCharCode(c >> 6 & 63 | 128);
          utftext += String.fromCharCode(63 & c | 128);
        }
      }
      return utftext;
    };
    hall.GlobalFuncs._utf8_decode = function(array) {
      var string = "";
      var i = 0, c1, c2;
      var c = c1 = c2 = 0;
      var len = array.length;
      while (i < len) {
        c = array[i];
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = array[i + 1];
          string += String.fromCharCode((31 & c) << 6 | 63 & c2);
          i += 2;
        } else {
          c2 = array[i + 1];
          c3 = array[i + 2];
          string += String.fromCharCode((15 & c) << 12 | (63 & c2) << 6 | 63 & c3);
          i += 3;
        }
      }
      return string;
    };
    hall.GlobalFuncs.checkMsgWithGameId = function(param, gameId) {
      var pgameId = param["result"]["gameId"];
      if (pgameId == gameId) {
        hall.LOGE("global", "EQUAL!!!!!!");
        return true;
      }
      return false;
    };
    hall.GlobalFuncs.CreateUuid = function() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) s[i] = hexDigits.substr(Math.floor(16 * Math.random()), 1);
      s[14] = "4";
      s[19] = hexDigits.substr(3 & s[19] | 8, 1);
      s[8] = s[13] = s[18] = s[23] = "";
      var uuid = s.join("");
      return uuid;
    };
    hall.GlobalFuncs.getLocalUuid = function() {
      var local_uuid = hall.GlobalFuncs.ReadStringFromLocalStorage(hall.LOCAL_UUID_KEY, "");
      if (!local_uuid) {
        local_uuid = hall.GlobalFuncs.CreateUuid();
        hall.GlobalFuncs.setInLocalStorage(hall.LOCAL_UUID_KEY, local_uuid);
      }
      return local_uuid;
    };
    hall.GlobalFuncs.checkLocalUUID = function() {
      var local_uuid = hall.GlobalFuncs.ReadStringFromLocalStorage(hall.LOCAL_UUID_KEY, "");
      return "" != local_uuid;
    };
    hall.GlobalFuncs.getRandomNumberBefore = function(number) {
      return Math.floor(1e4 * Math.random()) % number;
    };
    hall.GlobalFuncs.getShareRandomNumberWithShareList = function(shareList) {
      var returnRandom = hall.GlobalFuncs.getRandomNumberBefore(100);
      var nowIndex = 0;
      if (shareList && shareList.length && shareList.length > 0) while (returnRandom > shareList[nowIndex].weight) {
        returnRandom -= shareList[nowIndex].weight;
        nowIndex++;
        nowIndex >= shareList.length && (nowIndex = 0);
      }
      return nowIndex;
    };
    hall.GlobalFuncs.replaceKeyWordInString = function(string) {
      var repString = "".concat(string);
      var replaceMap = shot.Share.shareKeywordReplace;
      for (var key in replaceMap) {
        var reg = new RegExp(key, "g");
        repString = repString.replace(reg, replaceMap[key]);
      }
      return repString;
    };
    hall.GlobalFuncs.replaceToStringWithDic = function(dic) {
      return "query:" + JSON.stringify(dic);
    };
    hall.GlobalFuncs.getMoneyStringWithCoupons = function(couponCount) {
      var money = (couponCount / 100).toFixed(2) + "";
      return money;
    };
    hall.GlobalFuncs.isEmptyObject = function(obj) {
      for (var name in obj) return false;
      return true;
    };
    hall.GlobalFuncs.showPopWinByPreFab = function(preFabPath, func) {
      cc.loader.loadRes(preFabPath, function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
        func(preFabNode);
      });
    };
    hall.GlobalFuncs.checkBSGS = function(cityName) {
      if (!cityName) return true;
      var keyWord;
      for (var key in ty.SystemInfo.bsgsCitys) {
        keyWord = ty.SystemInfo.bsgsCitys[key];
        if (cityName.indexOf(keyWord) > -1) return true;
      }
      return false;
    };
    hall.GlobalFuncs.btnScaleEffect = function(node, scale) {
      node.stopAllActions();
      var scale_1 = cc.scaleTo(.2, scale, scale);
      var scale_2 = cc.scaleTo(.2, 1, 1);
      var delay = cc.delayTime(1.3);
      var seq1 = cc.sequence(scale_1, scale_2, scale_1, scale_2, delay);
      node.runAction(seq1.repeatForever());
    };
    hall.GlobalFuncs.btnScaleEffectOnce = function(node, scale) {
      node.node.stopAllActions();
      var scale_1 = cc.scaleTo(.2, scale, scale);
      var scale_2 = cc.scaleTo(.2, 1, 1);
      var seq1 = cc.sequence(scale_1, scale_2);
      node.node.runAction(seq1);
    };
    hall.GlobalFuncs._TAG = "hall.GlobalFuncs";
    cc._RF.pop();
  }, {} ],
  GlobalTimer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e4a29ReuyBGgLaFcT8rfhtT", "GlobalTimer");
    "use strict";
    hall.GlobalTimer = {
      boot: function boot() {
        this.MAX_COUNT = 30;
        this._curCounter = 0;
        this._curTime = new Date().getTime() / 1e3;
        ty.NotificationCenter.listen(shot.EventType.GET_TIMESTAMP, this.updateTime, this);
        var that = this;
        hall.MsgFactory.getTimeStamp();
        ty.Timer.setTimer(cc.director, function() {
          that._curCounter++;
          that._curTime += 1;
          if (that._curCounter >= that.MAX_COUNT) {
            that._curCounter = 0;
            hall.MsgFactory.getTimeStamp();
          }
        }, 1);
      },
      getCurTime: function getCurTime() {
        return this._curTime;
      },
      getCurDay: function getCurDay() {
        var date = new Date(1e3 * this._curTime);
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var dataStr = fullYear + "-" + month + "-" + day;
        shot.LOGD(hall.GlobalTimer, "今天是:" + dataStr);
        return dataStr;
      },
      getCurHours: function getCurHours() {
        var date = new Date(1e3 * this._curTime);
        var hour = date.getHours();
        var dataStr = hour + "";
        shot.LOGD(hall.GlobalTimer, "现在是:" + dataStr + "点");
        return dataStr;
      },
      getCurLastSecond: function getCurLastSecond() {
        var toDaySecond = parseInt((this._curTime - 1523203200) % 86400);
        return 86400 - toDaySecond;
      },
      updateTime: function updateTime(timeObj) {
        shot.LOGD(hall.GlobalTimer, "时间校准。。。");
        this._curTime = timeObj.current_ts;
      },
      getCurWeek: function getCurWeek() {
        var week = parseInt((this._curTime - 1523203200) / 604800);
        shot.GlobalFuncs.upDateRankDataWeek(week + "");
        return week;
      }
    };
    cc._RF.pop();
  }, {} ],
  HallGameWorld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1153b9geatAu6bAfKHD8JGu", "HallGameWorld");
    "use strict";
    var TodoTaskVec = require("TodoTaskVec");
    cc.Class({
      ctor: function ctor() {
        this._TAG = "hall.GameWorld";
        this.model = {};
        this.normal = {};
      },
      destroy: function destroy() {
        this.model = null;
        this.normal = null;
        hall.LOGD(this._TAG, "destroy in hall._GameWorld");
      }
    });
    cc._RF.pop();
  }, {
    TodoTaskVec: "TodoTaskVec"
  } ],
  HallNetWorkCenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "891972keVtA/6P9fPXo/Dg6", "HallNetWorkCenter");
    "use strict";
    require("JumpEventType");
    hall.hallNetWorkCenter = {
      _TAG: "hall.hallNetWorkCenter",
      boot: function boot() {
        hall.LOGD(this._TAG, "boot!");
        this.cmdMap = {};
        ty.NotificationCenter.listen(ty.EventType.TCP_OPENED, this.onTCP_Open, this);
        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);
        this.cmdMap[shot.EventType.MSG_GAME_DATA] = this.onReceiveGameData;
        this.cmdMap[shot.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
        this.cmdMap[shot.EventType.MSG_BAG_INFO] = this.onReceiveBagInfo;
        this.cmdMap[shot.EventType.MSG_DATA_CHANGED] = this.onUpdateChangedData;
        ty.NotificationCenter.listen(shot.EventType.GET_USER_FEATURE_SUCCESS, this._userFeature, this);
      },
      onReceiveGameData: function onReceiveGameData(value) {
        hall.LOGW(null, "file = [HallNetWorkCenter] fun = [onReceiveGameData] ");
        this.onGameData(value);
      },
      shut: function shut() {
        this.cmdMap = {};
        ty.NotificationCenter.ignoreScope(this);
      },
      onTCP_Open: function onTCP_Open() {
        hall.MsgFactory.bindUser();
      },
      onReceiveTCP_Msg: function onReceiveTCP_Msg(value) {
        var msgCmd = value.cmd;
        var result = value.result;
        if (result) {
          var gameId = result.gameId;
          if (gameId === ty.SystemInfo.hallId) {
            var func = this.cmdMap[msgCmd];
            func ? func.call(this, value) : hall.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
          }
        } else if (msgCmd == ty.EventType.MSG_LOG_OUT) {
          var errMsg = value.error ? value.error.info : null;
          errMsg && hall.MsgBoxManager.showToast({
            title: errMsg
          });
        }
      },
      onGameData: function onGameData(argument) {
        hall.LOGD(this._TAG, "onGameData");
        if ("undefined" != typeof argument) {
          if (!hall.GlobalFuncs.checkMsgWithGameId(argument, shot.GameId)) return;
          hall.MsgFactory.getUserInfo(shot.GameId);
        }
      },
      _userFeature: function _userFeature(val) {
        hall.LOGE("===val.retmsg=====", "====val.retmsg===" + JSON.stringify(val.retmsg));
        ty.UserInfo.isInBSGS = true;
        debugMode && (ty.UserInfo.isInBSGS = !debugMode);
        if (!val.retmsg) return;
        ty.UserInfo.featureInfo = val.retmsg;
        ty.UserInfo.isInBSGS = hall.GlobalFuncs.checkBSGS(ty.UserInfo.featureInfo.last_login_city);
        ty.UserInfo.ip = ty.UserInfo.featureInfo.last_login_ip;
        ty.NotificationCenter.trigger(shot.EventType.BSGS_CHECK_RESULT);
      },
      onReceiveUserInfo: function onReceiveUserInfo(value) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeTCP_Success, [ JSON.stringify(value) ]);
        shot.gameModel.getNormalConfig();
        shot.gameModel.getUserInfoForShot();
        shot.gameModel.getShareConfig();
        shot.gameModel.getGunnerShareSchemeConfig();
        hall.MsgFactory.getBagInfo();
        shot.gameModel.checkRewardWithSharePoint(shot.Share.SharePointType.getFreeTool);
        var sceneInfo = ty.UserInfo.onShowParam || wx.getLaunchOptionsSync();
        var scene = ty.UserInfo.scene_id || sceneInfo.scene;
        var query = sceneInfo.query;
        var shareTicket = sceneInfo.shareTicket;
        if (shot.qrCodeOption.withQrCode(scene)) {
          var par = "";
          query.hasOwnProperty("scene") ? par = query.scene : sceneInfo.hasOwnProperty("path") && (par = sceneInfo.path);
          shot.qrCodeOption.runOption(par, scene);
        }
        if (query && query.sourceCode) {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom, [ scene, query.inviteCode, shot.Share.clickStatShareType[query.sourceCode], query.imageType, "GameStart", JSON.stringify(sceneInfo) ]);
          query.inviteCode && shot.gameModel.bindMutualInviterId(parseInt(query.inviteCode));
          if (query.inviteCode && shareTicket) {
            var _boxUserId = query.inviteCode;
            hall.LOGW("", "file = [HallNetWrokCenter] fun = [onReceiveUserInfo] ty.SystemInfo.boxId = " + JSON.stringify(ty.SystemInfo.boxId));
            shot.Share.getOpenGid(shareTicket, _boxUserId);
          }
        } else ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom, [ scene, query.from, query.appid, "GameStart", JSON.stringify(sceneInfo) ]);
        1103 != scene && 1104 != scene || shot.gameModel.shareToGetreward(shot.Share.SharePointType.getFreeTool);
        shot.Share.isOnShare && shot.Share.playAnimationAfterShareWithType();
        shot.Share.isOnShare = false;
      },
      onReceiveBagInfo: function onReceiveBagInfo(value) {
        if ("undefined" == typeof value) return;
        hall.ME.parseBagInfo(value);
      },
      onUpdateChangedData: function onUpdateChangedData(argument) {
        if ("undefined" != typeof argument) {
          var result = argument["result"];
          if ("undefined" != typeof result && "undefined" != typeof result["changes"]) {
            var gameId = result.gameId;
            hall.LOGD(this._TAG, "gameid = " + gameId);
            for (var i = 0; i < result["changes"].length; i++) {
              var curValue = result["changes"][i];
              if ("undefined" == typeof curValue) continue;
              if ("gdata" == curValue) {
                hall.LOGD(this._TAG, "update_notify,更新gdata");
                hall.MsgFactory.getGameData(gameId);
              } else if ("item" == curValue) {
                hall.LOGD(this._TAG, "update_notify,更新道具");
                hall.MsgFactory.getBagInfo();
              } else if ("udata" == curValue) {
                hall.LOGD(this._TAG, "update_notify,更新钻石金币");
                hall.MsgFactory.getUserInfo(gameId);
              }
            }
          }
        }
      }
    };
    hall.hallNetWorkCenter.boot();
    cc._RF.pop();
  }, {
    JumpEventType: "JumpEventType"
  } ],
  HallUserInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8354fRA1n1C7au90hcQKocD", "HallUserInfo");
    "use strict";
    require("UserInfoUData");
    hall.HallUserInfo = cc.Class({
      ctor: function ctor() {
        this.udataInfo = new hall.UserInfoUData();
      },
      parseUserInfo: function parseUserInfo(json) {
        if (json) {
          var result = json["result"];
          this.udataInfo.parse(result["udata"]);
        }
      },
      parseBagInfo: function parseBagInfo(json) {
        if (json) {
          var result = json["result"];
          var bagList = result["normal_list"];
          if (!bagList || "undefined" == typeof bagList) return;
          this.udataInfo.infiniteBulletCount = 0;
          this.udataInfo.laserAimingCount = 0;
          this.udataInfo.diamondCount = 0;
          this.udataInfo.grenadeCount = 0;
          for (var i = 0; i < bagList.length; i++) {
            var bagInfo = bagList[i];
            var bagID = bagInfo["id"];
            if (1371 == bagID) {
              this.udataInfo.infiniteBulletInfo = bagInfo;
              this.udataInfo.infiniteBulletCount = bagInfo["num"];
            } else 1372 == bagID ? this.udataInfo.laserAimingCount = bagInfo["num"] : 1373 == bagID ? this.udataInfo.diamondCount = bagInfo["num"] : 1390 == bagID && (this.udataInfo.grenadeCount = bagInfo["num"]);
          }
          ty.NotificationCenter.trigger(shot.EventType.UPDATE_INFINITEBULLET_NUMBER);
          ty.NotificationCenter.trigger(shot.EventType.UPDATE_LASERAIMING_NUMBER);
          ty.NotificationCenter.trigger(shot.EventType.UPDATE_DIAMOND_NUMBER);
          ty.NotificationCenter.trigger(shot.EventType.UPDATE_GRENADE_NUMBER);
        }
      },
      _sortByTime: function _sortByTime(o1, o2) {
        return o2["medal_getmedaltime"] - o1["medal_getmedaltime"];
      },
      clean: function clean() {
        this.udataInfo.m_vip = 0;
        this.udataInfo.m_sex = 0;
        this.udataInfo.m_name = "";
        this.udataInfo.m_purl = "";
        this.udataInfo.m_isBeauty = false;
      }
    });
    cc._RF.pop();
  }, {
    UserInfoUData: "UserInfoUData"
  } ],
  HttpUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "682c0SNxc9Oh5jrL+yL0yCT", "HttpUtil");
    "use strict";
    ty.HttpUtil = {
      httpPost: function httpPost(cfgObj, httpType, successCallBack, failCallBack) {
        try {
          wx.request({
            url: cfgObj.url,
            data: cfgObj.postData,
            header: cfgObj.header,
            method: httpType,
            dataType: "json",
            success: function success(res) {
              if (200 == res.statusCode) {
                res.data && res.data.hasOwnProperty("/api/bilog5/clientlog") && "ok" == res.data["/api/bilog5/clientlog"] && hall.LOGD("ty.HttpUtil.httpPost", "post success! ");
                successCallBack && successCallBack(res);
              } else hall.LOGD("ty.HttpUtil.httpPost", "statusCode:" + res.statusCode);
            },
            fail: function fail(res) {
              hall.LOGD("ty.HttpUtil.httpPost", "post error! " + cfgObj.url);
              failCallBack && failCallBack(res);
            },
            complete: function complete(res) {}
          });
        } catch (err) {
          hall.LOGE("error:", "httpPost——" + JSON.stringify(err));
        }
      },
      httpGet: function httpGet(cfgObj, successcb, failcb) {
        hall.LOGD("ty.HttpUtil.httpGet", "url:" + cfgObj.url);
        try {
          wx.request({
            url: cfgObj.url,
            method: "GET",
            success: function success(res) {
              if (200 == res.statusCode) {
                hall.LOGD("ty.HttpUtil.httpGet", "res:" + JSON.stringify(res.data));
                successcb && successcb(res.data);
              } else hall.LOGD("ty.HttpUtil.httpGet", "statusCode:" + res.statusCode);
            },
            fail: function fail(res) {
              hall.LOGD("ty.HttpUtil.httpGet", "post error! " + cfgObj.url);
              failcb && failcb(res);
            }
          });
        } catch (err) {
          hall.LOGE("error:", "httpGet——" + JSON.stringify(err));
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  JumpEventType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3bb7b17QLxGB5f0wf9cLyoA", "JumpEventType");
    "use strict";
    console.log("shot_EventType loaded");
    shot.EventType = {
      CMD_BIND_USER: "bind_user",
      CMD_USER: "user",
      UPDATE_SHARE_STATE: "UPDATE_SHARE_STATE",
      CMD_USER_INFO: "user_info",
      MSG_USER_INFO: "user_info",
      CMD_GAME_DATA: "game_data",
      MSG_GAME_DATA: "game_data",
      MSG_GAME: "game",
      GET_TIMESTAMP: "GET_TIMESTAMP",
      START_AUTHORIZATION_FAILED: "START_AUTHORIZATION_FAILED",
      REWARD_VIDEO_COMPLETE: "REWARD_VIDEO_COMPLETE",
      REWARD_VIDEO_COMPLETE_ERROR: "REWARD_VIDEO_COMPLETE_ERROR",
      CMD_BAG_INFO: "bag",
      MSG_BAG_INFO: "bag",
      UPDATE_INFINITEBULLET_NUMBER: "UPDATE_INFINITEBULLET_NUMBER",
      UPDATE_LASERAIMING_NUMBER: "UPDATE_LASERAIMING_NUMBER",
      UPDATE_GRENADE_NUMBER: "UPDATE_GRENADE_NUMBER",
      GET_REWARD: "get_reward",
      CHECK_REWARD: "check_reward",
      GET_CHECK_REWARD: "GET_CHECK_REWARD",
      HALL_SHARE2: "hall_share2",
      CMD_DATA_CHANGED: "update_notify",
      MSG_DATA_CHANGED: "update_notify",
      MSG_UPDATE_ASSETS: "update_assets",
      GAME_START: "GAME_START",
      GAME_LEVEL_UP: "GAME_LEVEL_UP",
      REPLACE_GUN: "REPLACE_GUN",
      UPDATE_RESULT_RANK: "UPDATE_RESULT_RANK",
      STOP_DOUBLEHIT_COUNTDOWN: "STOP_DOUBLEHIT_COUNTDOWN",
      UPDATE_DIAMOND_NUMBER: "UPDATE_DIAMOND_NUMBER",
      UPDATE_USERINFO: "UPDATE_USERINFO",
      RESURGENCE_RESULT: "RESURGENCE_RESULT",
      GUNNER_SHARE_SCHEME: "GUNNER_SHARE_SCHEME",
      BSGS_CHECK_RESULT: "BSGS_CHECK_RESULT",
      GET_USER_FEATURE_SUCCESS: "GET_USER_FEATURE_SUCCESS",
      GET_USER_FEATURE_FAIL: "GET_USER_FEATURE_FAIL",
      GET_SHARE_CONFIG_SUCCESS: "GET_SHARE_CONFIG_SUCCESS",
      GET_SHARE_CONFIG_FAIL: "GET_SHARE_CONFIG_FAIL",
      REPLAY_BG_MUSIC: "REPLAY_BG_MUSIC"
    };
    cc._RF.pop();
  }, {} ],
  MsgBoxManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cdd50Rmz4lP96uTPu+uP/nZ", "MsgBoxManager");
    "use strict";
    hall.MsgBoxManager = {
      showToast: function showToast(msg) {
        var that = this;
        if (shot.msgBoxNode) {
          shot.msgBoxNode.closeAction();
          shot.msgBoxNode = null;
        }
        var preFabPath = "shot_prefabs/shot_toast_tips";
        cc.loader.loadRes(preFabPath, function(err, prefab) {
          var prefabNode = cc.instantiate(prefab);
          cc.director.getScene().addChild(prefabNode);
          shot.GlobalFuncs.setToCenter(prefabNode);
          msg.hasOwnProperty("icon") || (msg.icon = "none");
          shot.msgBoxNode = prefabNode.getComponent("shot_toast_tips");
          shot.msgBoxNode.setTitleWithString(msg.title);
        });
      }
    };
    cc._RF.pop();
  }, {} ],
  MsgCache: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "65876RAw9ZGMbVmklXunhoc", "MsgCache");
    "use strict";
    shot.msgCache = {
      needCacheMsg: {
        "table_call:ready": null,
        "table_call:game_ready": null,
        "table_call:next": null,
        "table_call:smilies": null,
        "table_call:call": null,
        "table_call:game_start": null,
        "table_call:card": null,
        "table_call:rb": null,
        "table_call:game_win": null,
        "table_call:wild_card": null
      },
      blocked: true,
      msgQueue: [],
      pushMsg: function pushMsg(msg) {
        var msgKey = msg.cmd;
        msg.result && msg.result.action && (msgKey = msgKey + ":" + msg.result.action);
        this.needCacheMsg.hasOwnProperty(msgKey) ? this.msgQueue.push(msg) : ty.TCP.triggerMsg(msg);
      },
      dump: function dump() {
        while (this.msgQueue.length > 0) {
          var msg = this.msgQueue.shift();
          ty.TCP.triggerMsg(msg);
        }
        this.blocked = false;
      }
    };
    cc._RF.pop();
  }, {} ],
  MsgFactory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab6baeQ1/xA3am5FsSBZ3kK", "MsgFactory");
    "use strict";
    hall.MsgFactory = {
      _TAG: "hall.MsgFactory",
      _sendCmd: function _sendCmd(json) {
        json.params || (json.params = {});
        json.params.userId = json.params.userId || ty.UserInfo.userId;
        json.params.gameId = json.params.gameId || ty.SystemInfo.hallId;
        json.params.clientId = ty.SystemInfo.clientId;
        ty.TCP.sendMsg(json);
      },
      bindUser: function bindUser() {
        var cmd = {
          cmd: ty.EventType.CMD_BIND_USER,
          params: {
            authorCode: ty.UserInfo.authorCode
          }
        };
        this._sendCmd(cmd);
      },
      getUserInfo: function getUserInfo(gameId) {
        hall.LOGD(this._TAG, "getUserInfo");
        null != gameId && "undefined" != typeof gameId || (gameId = ty.SystemInfo.hallId);
        hall.LOGD(this._TAG, "getUserInfo gameId = " + gameId);
        var params = {
          cmd: ty.EventType.CMD_USER_INFO,
          params: {
            gameId: gameId
          }
        };
        this._sendCmd(params);
      },
      sendHeartBeat: function sendHeartBeat(argument) {
        var cmd = {
          cmd: ty.EventType.HEART_BEAT,
          params: {
            deviceId: ty.SystemInfo.deviceId
          }
        };
        this._sendCmd(cmd);
      },
      getTimeStamp: function getTimeStamp() {
        hall.LOGD(this._TAG, "getTimeStamp");
        var params = {
          cmd: shot.EventType.CMD_USER,
          params: {
            action: "sync_timestamp"
          }
        };
        this._sendCmd(params);
      },
      getBagInfo: function getBagInfo() {
        var params = {
          cmd: shot.EventType.CMD_BAG_INFO,
          params: {
            action: "update"
          }
        };
        this._sendCmd(params);
      },
      getGameData: function getGameData(gameId) {
        var params = {
          cmd: shot.EventType.CMD_GAME_DATA,
          params: {
            gameId: gameId
          }
        };
        this._sendCmd(params);
      }
    };
    cc._RF.pop();
  }, {} ],
  NotificationCenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "539b5C/lGhFBpFstePDwTFW", "NotificationCenter");
    "use strict";
    console.log("NotificationCenter loaded");
    ty.NotificationCenter = {
      events: {},
      listen: function listen(eName, handler, scope) {
        this.events[eName] = this.events[eName] || [];
        this.events[eName].push({
          scope: scope || this,
          handler: handler
        });
      },
      ignore: function ignore(eName, handler, scope) {
        scope = scope || this;
        var fns = this.events[eName];
        if (!fns) return;
        this.events[eName] = fns.filter(function(fn) {
          return fn.scope != scope || fn.handler != handler;
        });
      },
      ignoreScope: function ignoreScope(scope) {
        for (var msg in this.events) {
          var obs = this.events[msg];
          obs && (this.events[msg] = obs.filter(function(fn) {
            if (fn.scope != scope) return true;
            hall.LOGD(null, "ty.NotificationCenter : remove listener by Scope: " + msg);
            return false;
          }));
        }
      },
      trigger: function trigger(eventName, params) {
        var fns = this.events[eventName];
        if (!fns) return;
        var fn;
        for (var i = 0; i < fns.length; i++) {
          fn = fns[i];
          fn.handler.call(fn.scope, params);
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  PropagateInterface: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "81fd90I3LVLp5cj1hSCBeHx", "PropagateInterface");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    ty.PropagateInterface = {
      getShareConfigInfo: function getShareConfigInfo(reqObj) {
        "object" != ("undefined" === typeof reqObj ? "undefined" : _typeof(reqObj)) && (reqObj = {});
        var timeStamp = new Date().getTime();
        reqObj.act = "api.getShareConfig";
        reqObj.time = timeStamp;
        reqObj.game_mark = ty.SystemInfo.cloudid + "-" + ty.SystemInfo.gameId;
        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for (var key in reqObj) paramStrList.push(key + "=" + reqObj[key]);
        paramStrList.push("sign=" + signStr);
        var finalUrl = ty.SystemInfo.shareManagerUrlShare + "?" + paramStrList.join("&");
        var successcb = function successcb(ret) {
          shot.gameModel.saveShareConfigFromHttp(ret.retmsg);
          ty.NotificationCenter.trigger(shot.EventType.GET_SHARE_CONFIG_SUCCESS, ret);
        };
        var failcb = function failcb(ret) {
          ty.NotificationCenter.trigger(shot.EventType.GET_SHARE_CONFIG_FAIL, ret);
        };
        ty.HttpUtil.httpGet({
          url: finalUrl
        }, successcb, failcb);
      },
      getSingleShareConfigInfo: function getSingleShareConfigInfo(reqObj) {
        "object" != ("undefined" === typeof reqObj ? "undefined" : _typeof(reqObj)) && (reqObj = {});
        var timeStamp = new Date().getTime();
        reqObj.act = "api.getShareConfig";
        reqObj.time = timeStamp;
        reqObj.game_mark = ty.SystemInfo.cloudid + "-" + ty.SystemInfo.gameId;
        debugMode && (reqObj.ext_type = "test");
        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for (var key in reqObj) paramStrList.push(key + "=" + reqObj[key]);
        paramStrList.push("sign=" + signStr);
        var finalUrl = ty.SystemInfo.shareManagerUrlShare + "?" + paramStrList.join("&");
        var successcb = function successcb(ret) {
          var shareObj = ret.retmsg;
          delete shareObj["shareExt"];
        };
        var failcb = function failcb(ret) {};
        ty.HttpUtil.httpGet({
          url: finalUrl
        }, successcb, failcb);
      },
      getUserFeatureInfo: function getUserFeatureInfo() {
        var reqObj = {};
        var timeStamp = new Date().getTime();
        reqObj.act = "api.getUserFeature";
        reqObj.cloud_id = ty.SystemInfo.cloudid;
        reqObj.game_id = ty.SystemInfo.gameId;
        reqObj.user_id = ty.UserInfo.userId;
        reqObj.time = timeStamp;
        var signStr = this.getConfigSignStr(reqObj);
        var paramStrList = [];
        for (var key in reqObj) paramStrList.push(key + "=" + reqObj[key]);
        paramStrList.push("sign=" + signStr);
        var finalUrl = ty.SystemInfo.shareManagerUrl + "?" + paramStrList.join("&");
        var successcb = function successcb(ret) {
          ty.NotificationCenter.trigger(shot.EventType.GET_USER_FEATURE_SUCCESS, ret);
        };
        var failcb = function failcb(ret) {
          ty.NotificationCenter.trigger(shot.EventType.GET_USER_FEATURE_FAIL, ret);
        };
        ty.HttpUtil.httpGet({
          url: finalUrl
        }, successcb, failcb);
      },
      getConfigSignStr: function getConfigSignStr(reqObj) {
        var sortedKeys = Object.keys(reqObj).sort();
        var signStr = "";
        for (var i = 0; i < sortedKeys.length; i++) {
          var key = sortedKeys[i];
          if ("act" == key || "sign" == key) continue;
          signStr += key + "=" + reqObj[key];
        }
        var finalSign = hall.hex_md5("market.tuyoo.com-api-" + signStr + "-market.tuyoo-api") || "";
        return finalSign;
      }
    };
    cc._RF.pop();
  }, {} ],
  QrOption: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "288b7UlCzhIsIhjWi5kL3mY", "QrOption");
    "use strict";
    shot.QrOption = cc.Class({
      ctor: function ctor() {
        this.OP_TYPE = {
          BIND_INVITE: 1,
          BIND_QUDAO: 2
        };
        this.quDaoMap = [];
      },
      withQrCode: function withQrCode(scene) {
        var sa = [ 1047, 1048, 1049 ];
        return sa.indexOf(scene) > -1;
      },
      runOption: function runOption(parStr, scene) {
        if (!parStr) return;
        var val = parStr.replace(".html", "");
        val = decodeURIComponent(val);
        var pars = val.split(",");
        var op = parseInt(pars.shift());
        switch (op) {
         case this.OP_TYPE.BIND_INVITE:
          this.bindInvite(pars, scene);
          break;

         case this.OP_TYPE.BIND_QUDAO:
          this.bindQuDao(pars, scene);
        }
      },
      setQuDao: function setQuDao(arr) {
        this.quDaoMap = arr;
      },
      bindInvite: function bindInvite(pars, scene) {
        var from = parseInt(pars[0]);
        from && ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom, [ scene, from ]);
      },
      bindQuDao: function bindQuDao(pars, scene) {
        var from = parseInt(pars[0]);
        from && ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom, [ scene, from ]);
      }
    });
    cc._RF.pop();
  }, {} ],
  ServerManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "acea0gHxyZLrZX5g7fGsDhL", "ServerManager");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        txtServer: cc.EditBox,
        btnChange: cc.Button,
        btnReset: cc.Button,
        txtFTID: {
          default: null,
          type: cc.EditBox
        },
        userIdlabel: cc.Label,
        onLaunchParamsLabel: cc.Label,
        onShowParamsLabel: cc.Label,
        qrSprite: cc.Sprite
      },
      onLoad: function onLoad() {
        var that = this;
        var serPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "");
        this.btnChange.node.on("click", function(evet) {
          hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, that.txtServer.string);
          ty.TuyooSDK.wechatLogin();
        });
        this.btnReset.node.on("click", function(evet) {
          that.txtServer.string = "";
          hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "");
          hall.MsgBoxManager.showToast({
            title: "服务器地址已重置"
          });
        });
        shot.LOGD(null, "当前的SDK地址:" + serPath);
        this.txtServer.string = serPath;
      },
      testWithString: function testWithString() {
        this.userIdlabel.string = "userId  :   " + ty.UserInfo.userId;
        var sceneInfo = wx.getLaunchOptionsSync();
        this.onLaunchParamsLabel.string = "Launch：  " + JSON.stringify(sceneInfo);
        var onShowString = hall.GlobalFuncs.ReadStringFromLocalStorage(shot.gameModel.ONSHOW_PARAMS, "");
        this.onShowParamsLabel.string = "onShow :  " + onShowString;
      },
      onBtnQRCode: function onBtnQRCode() {
        var sdkPath = ty.SystemInfo.loginUrl;
        debugMode && (sdkPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, ty.SystemInfo.loginUrl));
        var local_uuid = hall.GlobalFuncs.getLocalUuid();
        var val = this.txtFTID.string;
        var parsArr = val.split("|");
        var pars = {
          appId: ty.SystemInfo.appId,
          wxAppId: ty.SystemInfo.wxAppId,
          clientId: ty.SystemInfo.clientId,
          imei: "null",
          uuid: local_uuid,
          width: parseInt(parsArr[0]),
          b64: "true",
          path: parsArr[1]
        };
        var serPath = sdkPath + "open/v6/user/Getwxacode";
        hall.LOGD(null, "qrcode,params:" + JSON.stringify(pars));
        hall.LOGD(null, "qrcode,serverPath:" + serPath);
        var that = this;
        wx.request({
          url: serPath,
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: pars,
          method: "POST",
          success: function success(params) {
            hall.LOGD(null, "qrcode success, params:" + JSON.stringify(params));
            var b64Str = params.data.result.img;
            var fs = wx.getFileSystemManager();
            var filePath = wx.env.USER_DATA_PATH + "/qr.png";
            fs.writeFileSync(filePath, b64Str, "base64");
            cc.loader.load({
              url: filePath,
              type: "png"
            }, function(err, texture) {
              err || (that.qrSprite.spriteFrame = new cc.SpriteFrame(texture));
            });
          },
          fail: function fail(params) {},
          complete: function complete(params) {}
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  ServerStateManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf961bsO0pGS6LvN9bAejyh", "ServerStateManager");
    "use strict";
    require("HttpUtil");
    ty.ServerStateManager = {
      checkServerState: function checkServerState(callBack) {
        var header = {
          "content-type": "application/x-www-form-urlencoded"
        };
        var configObj = {
          url: ty.SystemInfo.loginUrl + "open/v4/sdk/util/gameserver/status/query",
          header: header,
          postData: {
            appId: ty.SystemInfo.appId
          }
        };
        ty.HttpUtil.httpPost(configObj, "POST", function(res) {
          1 == res.data.result.code ? hall.GlobalFuncs.showPopWinByPreFab("prefabs/withdrawalMaintain", function(preFabNode) {
            var lbl = preFabNode.getChildByName("label");
            lbl.getComponent(cc.Label).string = res.data.result.info;
          }) : callBack();
        }, function(res) {
          callBack();
        });
      }
    };
    cc._RF.pop();
  }, {
    HttpUtil: "HttpUtil"
  } ],
  Share: [ function(require, module, exports) {
    (function(Buffer) {
      "use strict";
      cc._RF.push(module, "7b903pBVc5J8K+O9PygiZuz", "Share");
      "use strict";
      var crypto = require("crypto");
      shot.Share = {
        LAST_SHARE_TIME: "LAST_SHARE_TIME",
        SHARETICKETS_LIST: "SHARETICKETS_LIST",
        shareQuery: "",
        unSensitivePersonage: 0,
        sharePoint: 0,
        shareType: "",
        isOnShare: false,
        shareTicket: "",
        resultType: 0,
        shareWithType: function shareWithType(type, successCallBackFun, failCallBackFun, testCfg) {
          var shareMap = shot.GameWorld.shareConfig;
          if (!shareMap) {
            hall.LoginToyoo();
            return;
          }
          var shareDetail = shareMap[type];
          var shareCfg = shareDetail.list[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail.list)];
          testCfg && (shareCfg = testCfg);
          var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);
          var query = "inviteCode=" + ty.UserInfo.userId + "&sourceCode=" + type + "&imageType=" + shareCfg.shareSchemeId + "&inviteName=" + ty.UserInfo.userName;
          if (shareDetail.query) {
            shot.Share.shareQuery = shareDetail.query;
            var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
            query = query + "&" + queryString;
          } else shot.Share.shareQuery = "";
          shareDetail.unSensitivePersonage ? shot.Share.unSensitivePersonage = shareDetail.unSensitivePersonage : shot.Share.unSensitivePersonage = 0;
          var shareImage = shareCfg.sharePicUrl;
          if (shareCfg.extraAdd && shareCfg.extraAdd.length && shareCfg.extraAdd.length > 0) {
            var callBackF = function callBackF(imageUrl) {
              shot.Share.shareImformation(type, shareCfg, shareTitle, imageUrl, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
            };
            shot.Share.getShareImageWithShareMap(0, shareCfg.extraAdd, shareImage, callBackF);
          } else shot.Share.shareImformation(type, shareCfg, shareTitle, shareImage, query, shareDetail.sharePoint, successCallBackFun, failCallBackFun);
        },
        getShareImageWithShareMap: function getShareImageWithShareMap(nowIndex, extraAdd, imageUrl, callBackF) {
          shot.Share.isOnShare = true;
          var tempCavas = wx.createCanvas();
          tempCavas.width = 360;
          tempCavas.height = 288;
          var context = tempCavas.getContext("2d");
          var image = wx.createImage();
          image.src = imageUrl;
          image.onload = function(event) {
            var ima = event.target;
            context.drawImage(ima, 0, 0);
            var preTextWidth = 0;
            var preTextHeight = 0;
            var preX = 0;
            var preY = 0;
            while (nowIndex < extraAdd.length) {
              var extraMap = extraAdd[nowIndex];
              if ("text" == extraMap.type) {
                var textInformation = extraMap.textInformation;
                var text = hall.GlobalFuncs.replaceKeyWordInString(textInformation.textformatString);
                context.font = textInformation.fontSize + "px Arial";
                -1 == textInformation.textColorRGB.indexOf("#") && (textInformation.textColorRGB = "#" + textInformation.textColorRGB);
                context.fillStyle = textInformation.textColorRGB;
                context.textAlign = textInformation.textAlign.replace("middle", "center");
                var textX = parseInt(textInformation.originPointX);
                textX < 0 && (-1 == textX ? textX = preX - preTextWidth / 2 : -2 == textX && (textX = preX + preTextWidth / 2));
                var textY = parseInt(textInformation.originPointY);
                if (textY < 0) {
                  -1 == textY && (textY = preY - preTextHeight / 2);
                  -2 == textY && (textY = preY + preTextHeight / 2);
                }
                context.fillText(text, textX, textY);
                preTextWidth = context.measureText(text).width;
                preTextHeight = context.measureText(text).height;
                preX = textX;
                preY = textY;
                nowIndex++;
              } else if ("image" == extraMap.type) {
                var imageInformation = extraMap.imageInformation;
                var sunImage = wx.createImage();
                "avatar" == imageInformation.addImageUrl ? sunImage.src = ty.UserInfo.userPic : sunImage.src = imageInformation.addImageUrl;
                sunImage.originPointX = parseInt(imageInformation.originPointX);
                sunImage.originPointY = parseInt(imageInformation.originPointY);
                sunImage.sizeWidth = parseInt(imageInformation.sizeWidth);
                sunImage.sizeHeight = parseInt(imageInformation.sizeHeight);
                if (imageInformation.shape && 2 == imageInformation.shape) {
                  context.beginPath();
                  context.arc(sunImage.originPointX + sunImage.sizeWidth / 2, sunImage.originPointY + sunImage.sizeHeight / 2, sunImage.sizeWidth / 2, 0, 2 * Math.PI);
                  context.stroke();
                  context.clip();
                }
                sunImage.onload = function(event) {
                  var img = event.target;
                  context.drawImage(img, img.originPointX, img.originPointY, img.sizeWidth, img.sizeHeight);
                  var tempFilePath = tempCavas.toTempFilePathSync({
                    x: 0,
                    y: 0,
                    width: tempCavas.width,
                    height: tempCavas.height,
                    destWidth: tempCavas.width,
                    destHeight: tempCavas.height
                  });
                  callBackF && callBackF(tempFilePath);
                };
                sunImage.onerror = function(event) {
                  var img = event.target;
                  var tempFilePath = tempCavas.toTempFilePathSync({
                    x: 0,
                    y: 0,
                    width: tempCavas.width,
                    height: tempCavas.height,
                    destWidth: tempCavas.width,
                    destHeight: tempCavas.height
                  });
                  callBackF && callBackF(tempFilePath);
                };
                return;
              }
            }
            var tempFilePath = tempCavas.toTempFilePathSync({
              x: 0,
              y: 0,
              width: tempCavas.width,
              height: tempCavas.height,
              destWidth: tempCavas.width,
              destHeight: tempCavas.height
            });
            callBackF && callBackF(tempFilePath);
          };
          image.onerror = function(event) {
            var img = event.target;
          };
        },
        shareImformation: function shareImformation(type, shareCfg, titleString, imageUrl, query, sharePoint, successCallBackFun, failCallBackFun) {
          shot.Share.shareType = type;
          shot.Share.sharePoint = sharePoint;
          shot.Share.isOnShare = true;
          shot.Share.resultType = 0;
          shot.Share.shareTicket = "";
          var sharePointId = shot.Share.clickStatShareType[type];
          var shareSchemeId = shareCfg.shareSchemeId;
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [ sharePointId, 1, shareSchemeId ]);
          wx.shareAppMessage({
            title: titleString,
            imageUrl: imageUrl,
            query: query,
            success: function success(result) {
              hall.LOGE("shareAppMessage", "===shareAppMessage==success==" + JSON.stringify(arguments) + "===" + query);
              ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [ sharePointId, 2, shareSchemeId ]);
              successCallBackFun && successCallBackFun(result);
              if (!result.shareTickets || !result.shareTickets[0]) {
                shot.Share.resultType = shot.Share.ShareState.isNotAGroupChat;
                shot.Share.shareTicket = "";
                return;
              }
              shot.Share.shareTicket = result.shareTickets[0];
            },
            fail: function fail() {
              hall.LOGE("shareAppMessage", "===shareAppMessage==fail==" + JSON.stringify(arguments) + "===" + query);
              failCallBackFun && failCallBackFun();
              shot.Share.isMatchShare = false;
              shot.Share.resultType = shot.Share.ShareState.failToShare;
              hall.LOGD(null, JSON.stringify(arguments));
            },
            complete: function complete() {}
          });
        },
        playAnimationAfterShareWithType: function playAnimationAfterShareWithType() {
          hall.LOGE("===", "playAnimationAfterShareWithType==" + shot.Share.sharePoint);
          if (shot.Share.resultType == shot.Share.ShareState.failToShare) {
            ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE, shot.Share.shareType);
            return;
          }
          if (shot.Share.shareType == shot.Share.onShareType.clickStatShareTypeRankList && shot.Share.shareTicket && "" != shot.Share.shareTicket) {
            shot.GlobalFuncs.showRankList(shot.Share.shareTicket);
            shot.Share.shareType = "";
            shot.Share.resultType = 0;
            return;
          }
          if (!shot.Share.unSensitivePersonage || 1 == shot.Share.unSensitivePersonage) {
            this.endWithSuccessShare();
            return;
          }
          if (!shot.GameWorld.gunnerShareSchemeConfig) {
            shot.Share.shareType = shot.Share.ShareState.shareError;
            ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE, shot.Share.shareType);
            return;
          }
          if (!shot.Share.shareTicket || "" == shot.Share.shareTicket) {
            shot.Share.resultType = shot.Share.ShareState.isNotAGroupChat;
            ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE, shot.Share.shareType);
            return;
          }
          if (2 == shot.Share.unSensitivePersonage) try {
            wx.getShareInfo({
              shareTicket: shot.Share.shareTicket,
              success: function success(result) {
                var shareKey;
                if (shot.Share.shareType == shot.Share.onShareType.clickStatShareTypeRevial) {
                  shareKey = "resurgence";
                  shot.Share.getShareResultWithKey(result, shareKey);
                } else {
                  shareKey = shot.Share.sharePoint + "";
                  shot.Share.getShareResultWithKey(result, shareKey);
                }
              },
              fail: function fail() {
                shot.Share.resultType = shot.Share.ShareState.failToGetShareTicket;
                ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE, shot.Share.shareType);
              },
              complete: function complete() {}
            });
          } catch (err) {
            hall.LOGE("error:", "shot.Share.unSensitivePersonage——" + JSON.stringify(err));
          }
        },
        getShareResultWithKey: function getShareResultWithKey(result, shareKey) {
          hall.LOGW("", "file = [Share] fun = [getShareResultWithKey]  " + result.toString() + "===" + shareKey);
          var iv = result.iv;
          var encryptedData = result.encryptedData;
          var reultString = shot.Share.decrypt(ty.UserInfo.wxgame_session_key, iv, encryptedData);
          var informationMap = JSON.parse(reultString);
          var openGId = informationMap.openGId;
          var toDay = hall.GlobalTimer.getCurDay();
          var lastShareTime = hall.GlobalFuncs.ReadStringFromLocalStorage(shot.Share.LAST_SHARE_TIME, "");
          var shareTicketsDic = {};
          if (toDay != lastShareTime) {
            shareTicketsDic[shareKey] = [ openGId ];
            hall.GlobalFuncs.setInLocalStorage(shot.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            hall.GlobalFuncs.setInLocalStorage(shot.Share.LAST_SHARE_TIME, toDay);
          } else {
            var shareTickets = hall.GlobalFuncs.ReadStringFromLocalStorage(shot.Share.SHARETICKETS_LIST, "");
            shareTicketsDic = JSON.parse(shareTickets);
            if (shareTicketsDic && shareTicketsDic[shareKey] && shareTicketsDic[shareKey].length) {
              var shareList = shareTicketsDic[shareKey];
              if (shareList.indexOf(openGId) > -1) {
                shot.Share.resultType = shot.Share.ShareState.repetitionGroupChat;
                ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE, shot.Share.shareType);
                hall.LOGW("getShareResultWithKey", "UPDATE_SHARE_STATE  ===" + shot.Share.shareType);
                shot.Share.shareTicket = "";
                return;
              }
              shareList.push(openGId);
              hall.GlobalFuncs.setInLocalStorage(shot.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            } else {
              shareTicketsDic[shareKey] = [ openGId ];
              hall.GlobalFuncs.setInLocalStorage(shot.Share.SHARETICKETS_LIST, JSON.stringify(shareTicketsDic));
            }
          }
          this.endWithSuccessShare();
        },
        endWithSuccessShare: function endWithSuccessShare() {
          hall.LOGW("", "file = [Share] fun = [endWithSuccessShare] shot.Share.sharePoint = " + shot.Share.sharePoint);
          shot.Share.resultType = shot.Share.ShareState.suscessShare;
          shot.Share.shareType != shot.Share.onShareType.clickStatShareTypeRevial && shot.Share.sharePoint > 1e4 && shot.gameModel.shareToGetreward(shot.Share.sharePoint);
          ty.NotificationCenter.trigger(shot.EventType.UPDATE_SHARE_STATE, shot.Share.shareType);
        },
        getOpenGid: function getOpenGid(shareTicket, _boxUserId) {
          var _openGid = "";
          var encryFunc = function encryFunc(result) {
            var iv = result.iv;
            var encryptedData = result.encryptedData;
            var reultString = shot.Share.decrypt(ty.UserInfo.wxgame_session_key, iv, encryptedData);
            var informationMap = JSON.parse(reultString);
            var openGId = informationMap.openGId;
            _openGid = openGId;
            var _boxID = "";
            ty.SystemInfo.boxId && "" != ty.SystemInfo.boxId ? _boxID = ty.SystemInfo.boxId : ty.SystemInfo.mysteryGiftBagBoxId && "" != ty.SystemInfo.mysteryGiftBagBoxId && (_boxID = ty.SystemInfo.mysteryGiftBagBoxId);
            shot.gameModel.getBoxReward(parseInt(_boxUserId), _boxID, _openGid);
            hall.LOGW("", "file = [Share] fun = [getOpenGid] ty.SystemInfo.boxId = " + JSON.stringify(ty.SystemInfo.boxId));
            hall.LOGW("", "file = [Share] fun = [getOpenGid] _openGid = " + JSON.stringify(_openGid));
            hall.LOGW("", "file = [Share] fun = [getOpenGid] _boxID = " + JSON.stringify(_boxID));
          };
          wx.getShareInfo({
            shareTicket: shareTicket,
            success: function success(result) {
              encryFunc(result);
            },
            fail: function fail() {
              var _boxID = "";
              ty.SystemInfo.boxId && "" != ty.SystemInfo.boxId ? _boxID = ty.SystemInfo.boxId : ty.SystemInfo.mysteryGiftBagBoxId && "" != ty.SystemInfo.mysteryGiftBagBoxId && (_boxID = ty.SystemInfo.mysteryGiftBagBoxId);
              shot.gameModel.getBoxReward(parseInt(_boxUserId), _boxID, _openGid);
              hall.LOGW("", "file = [Share] fun = [getOpenGid] fail  _boxID = " + _boxID);
            },
            complete: function complete() {}
          });
        },
        decrypt: function decrypt(key, iv, crypted) {
          crypted = new Buffer(crypted, "base64");
          iv = new Buffer(iv, "base64");
          key = new Buffer(key, "base64");
          var decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
          var decoded = decipher.update(crypted, "binary", "utf8");
          decoded += decipher.final("utf8");
          return decoded;
        },
        onShareType: {
          clickStatShareTypeMysteryGiftBag: "clickStatShareTypeMysteryGiftBag",
          clickStatShareTypeScore: "clickStatShareTypeScore",
          clickStatShareTypeLight: "clickStatShareTypeLight",
          clickStatShareTypeBullet: "clickStatShareTypeBullet",
          clickStatShareTypeGrenade: "clickStatShareTypeGrenade",
          clickStatShareTypeShareButton: "clickStatShareTypeShareButton",
          clickStatShareTypeDiamond: "clickStatShareTypeDiamond",
          clickStatShareTypeRankList: "clickStatShareTypeRankList",
          clickStatShareTypeRevial: "clickStatShareTypeRevial",
          clickStatShareTypeBulletGetReward: "clickStatShareTypeBulletGetReward",
          clickStatShareTypeLightGetReward: "clickStatShareTypeLightGetReward",
          clickStatShareTypeGrenadeGetReward: "clickStatShareTypeGrenadeGetReward",
          clickStatShareTypeMysteryGiftBagGetReward: "clickStatShareTypeMysteryGiftBagGetReward",
          clickStatShareTypeAddBullet: "clickStatShareTypeAddBullet",
          clickStatShareTypeOpenSecretBoxB: "clickStatShareTypeOpenSecretBoxB",
          clickStatShareTypeOpenSecretBoxN: "clickStatShareTypeOpenSecretBoxN",
          clickStatShareTypeComboContinue: "clickStatShareTypeComboContinue"
        },
        clickStatShareType: {
          clickStatShareTypeMysteryGiftBag: "214",
          clickStatShareTypeScore: "213",
          clickStatShareTypeLight: "212",
          clickStatShareTypeBullet: "211",
          clickStatShareTypeGrenade: "217",
          clickStatShareTypeShareButton: "208",
          clickStatShareTypeDiamond: "210",
          clickStatShareTypeRankList: "209",
          clickStatShareTypeRevial: "207",
          clickStatShareTypeBulletGetReward: "206",
          clickStatShareTypeLightGetReward: "205",
          clickStatShareTypeGrenadeGetReward: "216",
          clickStatShareTypeMysteryGiftBagGetReward: "204",
          clickStatShareTypeAddBullet: "203",
          clickStatShareTypeOpenSecretBoxB: "202",
          clickStatShareTypeOpenSecretBoxN: "201",
          clickStatShareTypeComboContinue: "215"
        },
        SharePointType: {
          getBullet: 10600001,
          getLaser: 10600002,
          getDiamond: 10600003,
          shareResurgence: 10600004,
          getGrenade: 10600005,
          getFreeTool: 10600006
        },
        shareKeywordReplace: {
          boxId: "",
          mysteryGiftBagBoxId: "",
          theScoreForNow: "",
          bestRank: "",
          bestScoreForSelf: 0,
          nickName: ""
        },
        ShareState: {
          isNotAGroupChat: 1,
          repetitionGroupChat: 2,
          suscessShare: 3,
          exShare: 4,
          failToGetShareTicket: 5,
          failToShare: 6,
          userInfoError: 7,
          shareError: 8
        }
      };
      wx.onShareAppMessage(function(result) {
        var type = shot.Share.onShareType.clickStatShareTypeShareButton;
        var shareMap = shot.GameWorld.shareConfig;
        if (!shareMap) return;
        var shareDetail = shareMap[type];
        var shareCfg = shareDetail.list[hall.GlobalFuncs.getShareRandomNumberWithShareList(shareDetail.list)];
        var shareTitle = hall.GlobalFuncs.replaceKeyWordInString(shareCfg.shareContent);
        var imageUrl = shareCfg.sharePicUrl;
        var sharePointId = shareCfg.sharePointId;
        var shareSchemeId = shareCfg.shareSchemeId;
        var query;
        if (shareDetail.query) {
          var queryString = hall.GlobalFuncs.replaceKeyWordInString(shareDetail.query);
          query = "inviteCode=" + ty.UserInfo.userId + "&sourceCode=" + type + "&imageType=" + shareSchemeId + "&inviteName=" + ty.UserInfo.userName + "&" + queryString;
        } else query = "inviteCode=" + ty.UserInfo.userId + "&sourceCode=" + type + "&imageType=" + shareSchemeId + "&inviteName=" + ty.UserInfo.userName;
        shot.Share.shareType = type;
        shot.Share.sharePoint = shareDetail.sharePoint;
        shot.Share.isOnShare = true;
        shot.Share.resultType = 0;
        shot.Share.shareTicket = "";
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [ sharePointId, 1, shareSchemeId ]);
        return {
          title: shareTitle,
          imageUrl: imageUrl,
          query: query,
          success: function success(shareTickets, groupMsgInfos) {
            hall.LOGE("onShareAppMessage", "===onShareAppMessage==success==" + JSON.stringify(arguments) + "===" + query);
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShareAction, [ sharePointId, 2, shareSchemeId ]);
          },
          fail: function fail() {
            hall.LOGE("onShareAppMessage", "===onShareAppMessage==fail==" + JSON.stringify(arguments) + "===" + query);
          },
          complete: function complete() {}
        };
      });
      wx.showShareMenu({
        withShareTicket: true
      });
      cc._RF.pop();
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 47,
    crypto: 56
  } ],
  ShotNetWorkCenter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e42abORGrJHA4ELaUbtnFDM", "ShotNetWorkCenter");
    "use strict";
    console.log("JumpMsgFactory.js loaded");
    require("JumpEventType");
    shot.NetWorkCenter = {
      canNotLeave: false,
      boot: function boot() {
        this._TAG = "shot_NetWorkCenter";
        shot.LOGD(this._TAG, "boot");
        this.cmdMap = {};
        this.cmdMap[shot.EventType.MSG_GAME] = this.onGame;
        this.cmdMap[shot.EventType.MSG_USER_INFO] = this.onReceiveUserInfo;
        this.cmdMap[shot.EventType.MSG_DATA_CHANGED] = this.onUpdateChangedData;
        this.cmdMap[shot.EventType.HALL_SHARE2] = this.onShare2;
        ty.NotificationCenter.listen(ty.EventType.TCP_RECEIVE, this.onReceiveTCP_Msg, this);
      },
      onReceiveUserInfo: function onReceiveUserInfo(value) {
        if ("undefined" == typeof value) return;
        hall.ME.parseUserInfo(value);
      },
      onUpdateChangedData: function onUpdateChangedData(argument) {
        if ("undefined" != typeof argument) {
          var result = argument["result"];
          if ("undefined" != typeof result && "undefined" != typeof result["changes"]) {
            var gameId = result.gameId;
            hall.LOGD(this._TAG, "gameid = " + gameId);
            for (var i = 0; i < result["changes"].length; i++) {
              var curValue = result["changes"][i];
              if ("undefined" == typeof curValue) continue;
              if ("gdata" == curValue) {
                hall.LOGD(this._TAG, "update_notify,更新gdata");
                hall.MsgFactory.getGameData(gameId);
              } else if ("item" == curValue) {
                hall.LOGD(this._TAG, "update_notify,更新道具");
                hall.MsgFactory.getBagInfo();
              } else if ("udata" == curValue) {
                hall.LOGD(this._TAG, "update_notify,更新钻石金币");
                hall.MsgFactory.getUserInfo(gameId);
              }
            }
          }
        }
      },
      shut: function shut() {
        this.cmdMap = {};
        ty.NotificationCenter.ignoreScope(this);
      },
      onTodoTask: function onTodoTask(value) {
        value && value["result"];
      },
      onShare2: function onShare2(msg) {
        hall.LOGW("", "file = [shotNetWrokCenter] fun = [onShare2] msg = " + JSON.stringify(msg));
        if (msg.result.action == shot.EventType.GET_REWARD) {
          if (shot.waitGetRevial && "waitRecive" == shot.waitGetRevial.type && msg.result.rewards.length > 0) {
            shot.gameModel.consumeAssets(1, "item:1373");
            shot.waitGetRevial = null;
          } else if (msg.result.rewards.length > 0) {
            var _count = 1;
            if (msg.result.rewards[0].count) {
              _count = msg.result.rewards[0].count;
              if ("item:1371" == msg.result.rewards[0].itemId) shot.GlobalFuncs.playGetPropBoxAni(0, _count); else if ("item:1372" == msg.result.rewards[0].itemId) shot.GlobalFuncs.playGetPropBoxAni(1, _count); else if ("item:1390" == msg.result.rewards[0].itemId) {
                shot.GlobalFuncs.playGetPropBoxAni(2, _count);
                shot.gameModel.checkRewardWithSharePoint(shot.Share.SharePointType.getFreeTool);
              } else "item:1373" == msg.result.rewards[0].itemId && hall.MsgBoxManager.showToast({
                title: "成功获得1颗钻石"
              });
            }
          }
        } else msg.result.action == shot.EventType.CHECK_REWARD && ty.NotificationCenter.trigger(shot.EventType.GET_CHECK_REWARD, msg.result);
      },
      onReceiveTCP_Msg: function onReceiveTCP_Msg(value) {
        var msgCmd = value.cmd;
        var result = value.result;
        if (result) {
          var gameId = result.gameId;
          if (gameId === ty.SystemInfo.gameId) {
            var func = this.cmdMap[msgCmd];
            if (func) func.call(this, value); else {
              ty.NotificationCenter.trigger(msgCmd, value);
              shot.LOGD(this._TAG, "未注册关于消息 ： " + msgCmd + " 的监听！");
            }
          }
        }
      },
      onGame: function onGame(argument) {
        hall.LOGD("hello", "parseGame");
        shot.gameModel.parseGame(argument);
      }
    };
    shot.NetWorkCenter.boot();
    cc._RF.pop();
  }, {
    JumpEventType: "JumpEventType"
  } ],
  SystemInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "37426RJxQJGX66dBgD7kBaq", "SystemInfo");
    "use strict";
    console.log("SystemInfo loaded");
    ty.SystemInfo = {
      DEBUG_SER_KEY: "DEBUG_SER_KEY",
      clientId: "H5_2.0_weixin.weixin.0-hall110.weixin.chaojzj",
      clientIdInt: 24377,
      cloudid: 24,
      version: 1,
      isCheckVersion: true,
      loginUrl: "http://192.168.20.108:8000/",
      deviceId: "wechatGame",
      wxAppId: "wxca71cd422b7fa67c",
      appId: 9999,
      hallId: 9999,
      gameId: 110,
      tableBgMusicVolume: .4,
      cdnPath: "https://richqn.nalrer.cn/nsly/",
      cdnPath_shareMoment: "https://richqn.nalrer.cn/nsly/crazygun/shareMoment/",
      m_server_ip: "https://cbi.touch4.me/api/bilog5/text",
      shareManagerUrlShare: "https://market.touch4.me/",
      shareManagerUrl: "https://market.touch4.me/",
      shareImagePath: "",
      shareImageType: "",
      boxId: "",
      mysteryGiftBagBoxId: "",
      mostImgCount: 40,
      imageDicArray: [],
      imageDic: {},
      bsgsCitys: [ "北京", "上海", "广州", "深圳", "杭州", "成都", "天津" ],
      getImageWithURL: function getImageWithURL(urlStringO, nowSprite) {
        if (!urlStringO || !nowSprite) return;
        var urlString = hall.hex_md5(urlStringO);
        var setOldSize = function setOldSize(nowSprite, texture) {
          var oldSize = cc.size(nowSprite.node.width, nowSprite.node.height);
          nowSprite.spriteFrame = texture;
          nowSprite.node.setContentSize(oldSize);
        };
        if (ty.SystemInfo.imageDic[urlString]) if (ty.SystemInfo.imageDic[urlString].texture) setOldSize(nowSprite, ty.SystemInfo.imageDic[urlString].texture); else if (ty.SystemInfo.imageDic[urlString].textureArray) ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite); else {
          ty.SystemInfo.imageDic[urlString].textureArray = [];
          ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
        } else {
          ty.SystemInfo.imageDic[urlString] = {};
          ty.SystemInfo.imageDic[urlString].textureArray = [];
          ty.SystemInfo.imageDic[urlString].textureArray.push(nowSprite);
          if (ty.SystemInfo.imageDicArray.length >= ty.SystemInfo.mostImgCount) {
            var tempURL = ty.SystemInfo.imageDicArray[0];
            ty.SystemInfo.imageDic[tempURL] = null;
            delete ty.SystemInfo.imageDic[tempURL];
            ty.SystemInfo.imageDicArray.splice(0, 1);
          }
          ty.SystemInfo.imageDicArray.push(urlString);
          cc.loader.load({
            url: urlStringO,
            type: "jpg"
          }, function(err, texture) {
            if (err) {
              ty.SystemInfo.imageDic[urlString] = null;
              delete ty.SystemInfo.imageDic[urlString];
            } else {
              ty.SystemInfo.imageDic[urlString].texture = new cc.SpriteFrame(texture);
              var tempA = ty.SystemInfo.imageDic[urlString].textureArray;
              for (var i = 0; i < tempA.length; i++) {
                var sprit = tempA[i];
                sprit && setOldSize(sprit, ty.SystemInfo.imageDic[urlString].texture);
              }
            }
          }.bind(this));
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  TCP: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d1c17saRAlJT4XXed0juQNv", "TCP");
    "use strict";
    console.log("TCP loaded");
    var noShowLogMsgs = [ "room_online_info", "heart_beat" ];
    var setTCP_FAIL = function setTCP_FAIL() {
      ty.TCP.connectStatus = ty.TCP.CONNECT_STATUS_FAIL;
    };
    ty.TCP = {
      CONNECT_STATUS_OK: 1,
      CONNECT_STATUS_OPENING: 2,
      CONNECT_STATUS_CLOSING: 3,
      CONNECT_STATUS_FAIL: 0,
      connectStatus: 0,
      isTimerInited: false,
      tickCount: 0,
      connect: function connect(url) {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeTCP_Start, [ url ]);
        var self = this;
        if (ty.TCP.connectStatus == ty.TCP.CONNECT_STATUS_OK) return;
        if (ty.TCP.connectStatus == ty.TCP.CONNECT_STATUS_OPENING) return;
        ty.TCP.connectStatus = ty.TCP.CONNECT_STATUS_OPENING;
        wx.connectSocket({
          url: url
        });
        wx.onSocketOpen(function(res) {
          hall.LOGD(null, "TCP webSocket opened...");
          ty.TCP.connectStatus = ty.TCP.CONNECT_STATUS_OK;
          ty.NotificationCenter.trigger(ty.EventType.TCP_OPENED);
          ty.TCP.isTimerInited || (ty.TCP.isTimerInited = true);
          ty.Timer.setTimer(cc.director, self.timerSchedule, 1);
        });
        wx.onSocketError(function(res) {
          hall.LOGD(null, "TCP webSocket error...");
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeTCP_Failed, [ url ]);
          setTCP_FAIL();
          ty.NotificationCenter.trigger(ty.EventType.TCP_ERROR);
        });
        wx.onSocketClose(function(res) {
          hall.LOGD(null, "WebSocket 已关闭！");
          setTCP_FAIL();
          ty.NotificationCenter.trigger(ty.EventType.TCP_CLOSE);
        });
        wx.onSocketMessage(function(res) {
          if (hall.onHide) return;
          var content = self.decodeMessage(res["data"]);
          if (null == content || "0000" == content) return;
          var time = new Date();
          var msgStr = time + "[Receive TCP Msg]: " + unescape(content.replace(/\\u/gi, "%u"));
          var strJson = content.substr(0, content.length - 0);
          if (null != strJson && strJson.length > 0) {
            var _json = JSON.parse(strJson);
            -1 == noShowLogMsgs.indexOf(_json.cmd) && hall.LOGD(null, msgStr);
            shot.msgCache.blocked ? shot.msgCache.pushMsg(_json) : self.triggerMsg(_json);
          }
        });
      },
      triggerMsg: function triggerMsg(msg) {
        ty.NotificationCenter.trigger(ty.EventType.TCP_RECEIVE, msg);
      },
      decodeMessage: function decodeMessage(data) {
        if ("undefined" != typeof ArrayBuffer && data instanceof ArrayBuffer) {
          var databytes = new Uint8Array(data);
          var content = "";
          for (var i = 0, len = databytes.length; i < len; i++) {
            var tmpc = String.fromCharCode(databytes[i]);
            content += tmpc;
          }
          return content;
        }
        var data = hall.GlobalFuncs.base64decodeRaw(data);
        var mask = data.slice(0, 4);
        data = data.slice(4);
        for (var i = 0, len = data.length; i < len; i++) {
          var charcode = data[i];
          charcode ^= mask[i % 4];
          data[i] = charcode;
        }
        var result = hall.GlobalFuncs._utf8_decode(data);
        return result;
      },
      timerSchedule: function timerSchedule() {
        ty.TCP.tickCount = (ty.TCP.tickCount + 1) % 3;
        2 == ty.TCP.tickCount && hall.MsgFactory.sendHeartBeat();
        ty.TCP.reConnet();
      },
      reConnet: function reConnet() {
        if (hall.onHide) return;
        if (ty.TCP.connectStatus == ty.TCP.CONNECT_STATUS_FAIL) {
          ty.NotificationCenter.trigger(ty.EventType.TCP_RECONNECT);
          ty.TCP.connect(ty.SystemInfo.webSocketUrl);
        }
      },
      sendMsg: function sendMsg(data) {
        if (ty.TCP.connectStatus != ty.TCP.CONNECT_STATUS_OK) return;
        var msgStr = JSON.stringify(data);
        if (-1 == noShowLogMsgs.indexOf(data.cmd)) {
          var time = new Date();
          hall.LOGD(time, "TCP sendMsg:" + msgStr);
        }
        wx.sendSocketMessage({
          data: msgStr,
          success: function success(params) {},
          fail: function fail(params) {
            var errMsg = arguments[0];
            if (errMsg && "sendSocketMessage:fail taskID not exist" === errMsg["errMsg"]) {
              wx.closeSocket();
              setTCP_FAIL();
            }
            hall.LOGD(null, "TCP sendMsg fail:" + JSON.stringify(arguments));
          },
          complete: function complete(params) {}
        });
      },
      close: function close() {
        ty.TCP.connectStatus = ty.TCP.CONNECT_STATUS_CLOSING;
        wx.closeSocket();
        setTCP_FAIL();
        hall.LOGD(null, "TCP close..............");
      }
    };
    cc._RF.pop();
  }, {} ],
  Timer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6a87fGWowZMxIpHwDyIvXP9", "Timer");
    "use strict";
    ty.Timer = {
      setTimer: function setTimer(obj, callback, interval, repeatNum, delay) {
        obj && obj._TAG && hall.LOGD("ty.Timer", "----------in setTimer----------" + (obj._TAG ? obj._TAG : ""));
        var scheduler = cc.director.getScheduler();
        var paused = false;
        var times = null != repeatNum ? repeatNum : cc.macro.REPEAT_FOREVER;
        scheduler.schedule(callback, obj, interval, repeatNum, delay, paused);
      },
      cancelTimer: function cancelTimer(obj, callback) {
        obj && obj._TAG && hall.LOGD("ty.Timer", "----------in cancelTimer ---------" + (obj._TAG ? obj._TAG : ""));
        var scheduler = cc.director.getScheduler();
        scheduler.unschedule(callback, obj);
      },
      isScheduledTimer: function isScheduledTimer(obj, callback) {
        obj && obj._TAG && hall.LOGD("ty.Timer", "----------in isScheduledTimer ---------" + (obj._TAG ? obj._TAG : ""));
        var scheduler = cc.director.getScheduler();
        return scheduler.isScheduled(callback, obj);
      }
    };
    cc._RF.pop();
  }, {} ],
  ToDoTasks: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "83ffeusBF1DR6zqyYfY5hsj", "ToDoTasks");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    cc.Class({
      ctor: function ctor() {
        this._TAG = "hall.ToDoTasks";
        hall.LOGD(this._TAG, " in ctor");
        this._taskStatk = null;
        this._currentTask = null;
        this.actionMap = {};
        this._taskStatk = [];
      },
      destroy: function destroy() {},
      runTasks: function runTasks() {
        if (!this._currentTask) {
          this._taskStatk = hall.gameWorld.model.m_todoTask.taskVec;
          this.runNextTask();
        }
      },
      runNextTask: function runNextTask() {
        this._currentTask && (this._currentTask = null);
        if (0 == this._taskStatk.length) return;
        var nextTask = this._taskStatk.shift();
        this._currentTask = nextTask;
        this.runOneTask(nextTask);
      },
      runOneTask: function runOneTask(oneTask) {
        hall.LOGD(this._TAG, "runOneTask");
        if (null != oneTask && "undefined" != typeof oneTask && "undefined" != typeof oneTask["action"] && "undefined" != typeof oneTask["params"]) {
          hall.LOGD(this._TAG, " run runOneTask-------------------------action:" + oneTask["action"] + "====" + _typeof(this.actionMap[oneTask["action"]]));
          if ("undefined" != typeof this.actionMap[oneTask["action"]]) {
            this.curActinFun = this.actionMap[oneTask["action"]];
            this.curActinFun(oneTask["params"]);
            this.curActinFun = null;
          } else {
            hall.LOGD(this._TAG, "This action is undefined! action:" + oneTask["action"]);
            hall.ToDoTask.runNextTask();
          }
        } else {
          hall.LOGD(this._TAG, "This action is undefined or cmd is error!");
          hall.ToDoTask.runNextTask();
        }
      },
      runReplaceSceneToActivity: function runReplaceSceneToActivity(params) {
        hall.LOGD(this._TAG, " run runReplaceSceneToActivity-----------------------");
        hall.ToDoTask.runNextTask();
      },
      runSetExitWndInf: function runSetExitWndInf(params) {},
      showerweima: function showerweima() {}
    });
    cc._RF.pop();
  }, {} ],
  TodoTaskVec: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e29a4QLBqFOSYwbxEdRKp+N", "TodoTaskVec");
    "use strict";
    cc.Class({
      ctor: function ctor() {
        this.gameId = 0;
        this.userId = 0;
        this.exitPopWndType = 0;
        this.taskVec = [];
      },
      destroy: function destroy() {},
      parseTodoTask: function parseTodoTask(result) {
        if ("undefined" != typeof result) {
          this.gameId = result["gameId"];
          this.userId = result["userId"];
          var vec = this.taskVec;
          var tasks = result["tasks"];
          for (var i = 0, len = tasks.length; i < len; i++) {
            var task = new hall.TodoTask();
            task.parseTask(tasks[i]);
            vec.push(task);
          }
          hall.ToDoTask.runTasks();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  TodoTask: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d0c02tCHAxFF5GGRaAxZO+P", "TodoTask");
    "use strict";
    hall.TodoTask = cc.Class({
      ctor: function ctor() {
        this["action"] = "";
        this["params"] = {};
      },
      destroy: function destroy() {},
      parseTask: function parseTask(json) {
        "undefined" != typeof json["action"] && (this["action"] = json["action"]);
        "undefined" != typeof json["params"] && (this["params"] = json["params"]);
      }
    });
    cc._RF.pop();
  }, {} ],
  TuyooSDK: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe9d5KmHL5HV7w2nqABykWN", "TuyooSDK");
    "use strict";
    console.log("TuyooSDK loaded");
    ty.TuyooSDK = {
      SESSION_KEY: "TU_SESSION_STORAGE",
      wechatLoginNormal: function wechatLoginNormal(code, with_fail_guide) {
        wx.getUserInfo({
          withCredentials: true,
          success: function success(res) {
            ty.TuyooSDK.loginTuyooWithCode(code, res.userInfo, res.iv, res.encryptedData);
          },
          fail: function fail() {
            if (with_fail_guide) {
              wx.showModal({
                title: "提示",
                content: "授权失败,点击确定手动进行授权!",
                showCancel: true,
                cancelText: "取消",
                confirmText: "确定",
                success: function success(res) {
                  res.confirm && wx.openSetting();
                }
              });
              shot.needReLogin = true;
            }
          }
        });
      },
      wechatLoginDirect: function wechatLoginDirect(loginCode) {
        ty.ServerStateManager.checkServerState(function() {
          loginCode ? ty.TuyooSDK.loginTuyooWithCode(loginCode) : wx.login({
            success: function success(params) {
              hall.LOGD(null, "wx login success, params:" + JSON.stringify(params));
              params.code && ty.TuyooSDK.loginTuyooWithCode(params.code);
            },
            fail: function fail(params) {
              hall.LOGD(null, "wx login fail, params:" + JSON.stringify(params));
            },
            complete: function complete(params) {}
          });
        });
      },
      loginTuyooWithCode: function loginTuyooWithCode(code, userInfo, iv, encryptedData) {
        hall.LOGD("loginTuyooWithCode:", code);
        var gender = 0;
        userInfo && (gender = userInfo.gender);
        var local_uuid = hall.GlobalFuncs.getLocalUuid();
        hall.LOGD("local_uuid:", local_uuid);
        var sdkPath = ty.SystemInfo.loginUrl;
        debugMode = hall.GlobalFuncs.ReadBoolFromLocalStorage(shot.gameModel.DEBUG_MODE, debugMode);
        debugMode && (sdkPath = hall.GlobalFuncs.ReadStringFromLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, ty.SystemInfo.loginUrl));
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeLoginSDKStart, [ code, local_uuid ]);
        var avatarUrl = "";
        userInfo && (avatarUrl = userInfo.avatarUrl);
        var postData = {
          appId: ty.SystemInfo.appId,
          wxAppId: ty.SystemInfo.wxAppId,
          clientId: ty.SystemInfo.clientId,
          snsId: "wxapp:" + code,
          uuid: local_uuid,
          avatarUrl: avatarUrl,
          gender: gender,
          scene_id: ty.UserInfo.scene_id || 0,
          scene_param: ty.UserInfo.scene_param || "",
          invite_id: ty.UserInfo.invite_id || 0
        };
        userInfo && userInfo.avatarUrl && (postData.avatarUrl = userInfo.avatarUrl);
        userInfo && userInfo.nickName && (postData.nickName = userInfo.nickName);
        iv && (postData.iv = iv);
        encryptedData && (postData.encryptedData = encryptedData);
        hall.LOGW("==Login===", "====tempData===== URL = " + JSON.stringify(sdkPath + "open/v6/user/LoginBySnsIdNoVerify"));
        try {
          wx.request({
            url: sdkPath + "open/v6/user/LoginBySnsIdNoVerify",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: postData,
            method: "POST",
            success: function success(params) {
              hall.LOGD(null, "tuyoo login success, params:" + JSON.stringify(params));
              var checkData = params.data;
              if (checkData.error && 1 == checkData.error.code) {
                console.log("tuyoo login fail...");
                return;
              }
              var result = checkData.result;
              ty.UserInfo.userId = result.userId;
              ty.UserInfo.userName = result.userName;
              shot.Share.shareKeywordReplace.nickName = hall.GlobalFuncs.sliceStringToLength(ty.UserInfo.userName, 10);
              ty.UserInfo.userPic = result.purl;
              ty.UserInfo.authorCode = result.authorCode;
              ty.UserInfo.wxgame_session_key = result.wxgame_session_key;
              hall.LOGD(null, "userId:" + ty.UserInfo.userId + " userName:" + ty.UserInfo.userName + " userPic:" + ty.UserInfo.userPic);
              ty.PropagateInterface.getUserFeatureInfo();
              hall.adManager.init();
              var token = result.token;
              hall.LOGD(null, "token:" + token);
              wx.setStorage({
                key: ty.TuyooSDK.SESSION_KEY,
                data: token
              });
              ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeLoginSDKSuccess, [ code, local_uuid, "name", result.userId ]);
              var ip = result.tcpsrv.ip;
              var port = result.tcpsrv.wsport || result.tcpsrv.port;
              var webSocketUrl;
              webSocketUrl = sdkPath.indexOf("170") > -1 || sdkPath.indexOf("https://") > -1 ? "wss://" + ip + "/" : "ws://" + ip + ":" + port.toString() + "/";
              hall.LOGD(null, "webSocketUrl:" + webSocketUrl);
              ty.SystemInfo.webSocketUrl = webSocketUrl;
              ty.TCP.connect(ty.SystemInfo.webSocketUrl);
            },
            fail: function fail(params) {
              ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeLoginSDKFailed, [ code, local_uuid, "name" ]);
              hall.LOGD(null, "tuyoo login fail, params:" + JSON.stringify(params));
            },
            complete: function complete(params) {}
          });
        } catch (err) {
          hall.LOGE("error:", "tywx.TuyooSDK.wechatLogin——" + JSON.stringify(err));
        }
      },
      getSystemType: function getSystemType(fun) {
        wx.getSystemInfo({
          success: function success(result) {
            ty.SystemInfo.deviceInfo = result;
            var model = result.model;
            var isiPhone = model.indexOf("iPhone") >= 0;
            var windowHeight = result.windowHeight;
            var resultType = 0;
            if (isiPhone) resultType = 812 == windowHeight ? ty.UserInfo.SYSTEMTYPE.iPhoneXType : 736 == windowHeight ? ty.UserInfo.SYSTEMTYPE.iPhone7P8PType : ty.UserInfo.SYSTEMTYPE.iphoneOtherType; else {
              var isvivo85 = model.indexOf("vivo Y85A") >= 0;
              resultType = isvivo85 ? ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 : ty.UserInfo.SYSTEMTYPE.ANDROIDOther;
            }
            ty.UserInfo.systemType = resultType;
            ty.UserInfo.wechatType = result.version;
            ty.UserInfo.model = result.model;
            ty.UserInfo.system = result.system;
            fun && fun(result);
          },
          fail: function fail() {},
          complete: function complete() {}
        });
      }
    };
    wx.onShow(function(result) {
      hall.LOGW("", "+++++++++++++++++onShow+++++++++++++++++" + JSON.stringify(result));
      hall.onHide = false;
      ty.UserInfo.onShowParam = result;
      ty.UserInfo.onShowParam.isFirstOpen = true;
      ty.SystemInfo.boxId = "";
      ty.SystemInfo.mysteryGiftBagBoxId = "";
      var scene = result.scene;
      var query = result.query;
      ty.UserInfo.scene_id = scene || 0;
      ty.UserInfo.scene_param = query.from || "";
      ty.UserInfo.invite_id = query.inviteCode || 0;
      var hasUUID = hall.GlobalFuncs.checkLocalUUID();
      var newUserFlag = hasUUID ? 1 : 0;
      if (query && query.gdt_vid && query.weixinadinfo) {
        var from = "gdt." + query.weixinadinfo;
        ty.UserInfo.scene_param = from;
        ty.BiLog.clickStat(ty.clickStatEventType.clickStatEventTypeUserFrom, [ scene, from, newUserFlag ]);
      } else query && query.sourceCode ? ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom, [ scene, query.inviteCode, shot.Share.clickStatShareType[query.sourceCode], query.imageType, "CardActive", JSON.stringify(result) ]) : ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeUserFrom, [ scene, query.from, query.appid, "CardActive", JSON.stringify(result) ]);
      if (query && query.sourceCode) {
        if (query.sourceCode == shot.Share.onShareType.clickStatShareTypeRankList && 1044 == scene) {
          var shareTicket = result.shareTicket;
          shareTicket && shot.GlobalFuncs.showRankList(shareTicket);
        }
        if (query && query.propBoxID) {
          shot.Share.shareKeywordReplace.boxId = query.propBoxID;
          ty.SystemInfo.boxId = query.propBoxID;
        }
        if (query && query.giftBagBoxId) {
          shot.Share.shareKeywordReplace.mysteryGiftBagBoxId = query.giftBagBoxId;
          ty.SystemInfo.mysteryGiftBagBoxId = query.giftBagBoxId;
        }
      }
      if (shot.needReLogin) {
        hall.LoginToyoo();
        shot.needReLogin = null;
      }
      ty.NotificationCenter.trigger(shot.EventType.REPLAY_BG_MUSIC);
      hall.adManager && hall.adManager.onForeGround && hall.adManager.onForeGround();
    });
    wx.onHide(function() {
      ty.UserInfo.scene_id = 0;
      ty.UserInfo.onShowParam = null;
      hall.onHide = true;
      hall.LOGW("", "+++++++++++++++++onHide+++++++++++++++++");
      ty.TCP.close();
    });
    var getNetSuccess = function getNetSuccess(res) {
      res.hasOwnProperty("isConnected") ? hall.netIsConnected = res.isConnected : res.hasOwnProperty("errMsg") ? hall.netIsConnected = "getNetworkType:ok" == res.errMsg : hall.netIsConnected = "none" != res.networkType;
      hall.networkType = res.networkType;
      hall.LOGD("onNetworkStatusChange", "hall.netIsConnected:" + hall.netIsConnected + ";hall.networkType:" + hall.networkType);
    };
    wx.getNetworkType({
      success: getNetSuccess
    });
    wx.onNetworkStatusChange(getNetSuccess);
    wx.onError(function(res) {
      var d = new Date();
      var errMsg = res.message;
      ty.BiLog.uploadLogTimely(errMsg);
    });
    cc._RF.pop();
  }, {} ],
  UserInfoUData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dae44RNRUBMqbjMnH3UtEKP", "UserInfoUData");
    "use strict";
    hall.UserInfoUData = cc.Class({
      ctor: function ctor() {
        this._TAG = "hall.UserInfoUData";
        this.m_name = "";
        this.m_vip = 0;
        this.m_sex = 0;
        this.m_state = 0;
        this.m_purl = "";
        this.m_isBeauty = false;
        this.m_chip = 0;
        this.infiniteBulletCount = 0;
        this.laserAimingCount = 0;
        this.diamondCount = 0;
        this.grenadeCount = 0;
        hall.LOGD(this._TAG, "in ctor");
      },
      parse: function parse(json) {
        hall.LOGD(this._TAG, "=======udata begin========" + JSON.stringify(json));
        this.m_name = json["name"];
        this.m_vip = json["vip"];
        this.m_sex = json["sex"];
        this.m_state = json["state"];
        this.m_purl = json["purl"];
        this.m_isBeauty = json["isBeauty"];
        "" == this.m_purl && (this.m_purl = "http://ddz.image.tuyoo.com/avatar/head_360_08.png");
        hall.LOGD(this._TAG, "UDATA purl is " + this.m_purl);
        this.m_chip = json["chip"];
      }
    });
    cc._RF.pop();
  }, {} ],
  UserInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4f2c9Wv4EtGdKoqDLQMFAjp", "UserInfo");
    "use strict";
    console.log("UserInfo loaded");
    ty.UserInfo = {
      userId: 0,
      userName: "TuWechatGame",
      userPic: "",
      authorCode: "",
      systemType: 0,
      wechatType: "6.6.1",
      model: "未知设备",
      system: "iOS 10.0.1",
      loc: "",
      scene_id: 0,
      scene_param: "",
      invite_id: 0,
      onShowParam: null,
      featureInfo: null,
      isInBSGS: true,
      ip: "",
      SYSTEMTYPE: {
        iphoneOtherType: 1,
        iPhoneXType: 2,
        ANDROIDOther: 3,
        iPhone7P8PType: 4,
        ANDROIDVIVO85: 5
      },
      clickStatEventType: {
        clickStatEventTypeUserFrom: 99990001,
        clickStatEventTypeShareAction: 99990002,
        clickStatEventTypeShowAdBtn: 99990003,
        clickStatEventTypeClickShowQRCode: 99990004,
        clickStatEventTypeClickAdBtn: 99990007,
        clickStatEventTypeClickDirectToMiniGameSuccess: 99990005,
        clickStatEventTypeClickDirectToMiniGameFail: 99990006,
        clickStatEventTypeShowWindow: 67890031,
        clickStatEventTypeButtonClick: 67890032,
        clickStatEventTypeWxLoginStart: 10001,
        clickStatEventTypeWxLoginSuccess: 10002,
        clickStatEventTypeWxLoginFailed: 10003,
        clickStatEventTypeAuthorizationStart: 10004,
        clickStatEventTypeAuthorizationSuccess: 10005,
        clickStatEventTypeAuthorizationFailed: 10006,
        clickStatEventTypeLoginSDKStart: 10007,
        clickStatEventTypeLoginSDKSuccess: 10008,
        clickStatEventTypeLoginSDKFailed: 10009,
        clickStatEventTypeTCP_Start: 10010,
        clickStatEventTypeTCP_Success: 10011,
        clickStatEventTypeTCP_Failed: 10012,
        clickStatEventTypeWatchVideo: 67890036
      }
    };
    cc._RF.pop();
  }, {} ],
  boot: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ad1445t4nhM67aUyFLNGpQs", "boot");
    "use strict";
    var ToDoTasks = require("ToDoTasks");
    var HallGameWorld = require("HallGameWorld");
    var UserInfo = require("HallUserInfo");
    require("shotAudioHelper");
    require("GlobalTimer");
    require("JumpEventType");
    hall.ME = new UserInfo();
    hall.gameWorld = new HallGameWorld();
    hall.staticSystemInfo = {
      version: 1
    };
    hall.ToDoTask = new ToDoTasks();
    hall.GlobalTimer.boot();
    hall.LOCAL_UUID_KEY = "LOCAL_UUID_KEY";
    hall.LoginToyoo = function() {
      if (wx.hasOwnProperty("getUpdateManager")) {
        var updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          shot.LOGD(null, res.hasUpdate);
        });
        updateManager.onUpdateReady(function() {
          updateManager.applyUpdate();
        });
        updateManager.onUpdateFailed(function() {});
      }
      try {
        wx.login({
          success: function success(params) {
            hall.LOGD(null, "wx login success, params:" + JSON.stringify(params));
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginSuccess, [ params.code ]);
            if (params.code) {
              ty.wxLoginCode = params.code;
              wx.getSetting({
                success: function success(res) {
                  if (res.authSetting["scope.userInfo"]) {
                    ty.TuyooSDK.wechatLoginNormal(params.code);
                    hall.LOGD(null, "已授权,正常登录" + JSON.stringify(params));
                  } else {
                    ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeAuthorizationStart, [ params.code ]);
                    var openData = shot.GlobalFuncs.getOpenData();
                    if (openData) {
                      ty.TuyooSDK.wechatLoginDirect(params.code);
                      hall.LOGD(null, "wechatLoginDirect" + JSON.stringify(params));
                    } else {
                      ty.TuyooSDK.wechatLoginNormal(params.code, true);
                      hall.LOGD(null, "弹窗,请求授权" + JSON.stringify(params));
                    }
                  }
                }
              });
            }
          },
          fail: function fail(params) {
            ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeWxLoginFailed, []);
            hall.LOGD(null, "wx login fail, params:" + JSON.stringify(params));
          },
          complete: function complete(params) {}
        });
      } catch (err) {
        hall.LOGE("error:", "wx.login——" + JSON.stringify(err));
      }
    };
    hall.LoginToyoo();
    wx.showShareMenu({
      withShareTicket: true
    });
    cc._RF.pop();
  }, {
    GlobalTimer: "GlobalTimer",
    HallGameWorld: "HallGameWorld",
    HallUserInfo: "HallUserInfo",
    JumpEventType: "JumpEventType",
    ToDoTasks: "ToDoTasks",
    shotAudioHelper: "shotAudioHelper"
  } ],
  countDown: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf422bCsrlGaKgLY7CCCNty", "countDown");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        countSprite: {
          default: null,
          type: cc.Sprite
        },
        countSpriteFramelist: [ cc.SpriteFrame ],
        count: 3
      },
      onLoad: function onLoad() {
        ty.Timer.setTimer(this, this.countDown, 1, 4);
      },
      onBlack: function onBlack() {},
      countDown: function countDown() {
        this.count--;
        if (this.count > 0) this.countSprite.spriteFrame = this.countSpriteFramelist[this.count - 1]; else {
          ty.Timer.cancelTimer(this, this.countDown);
          this.node.destroy();
        }
      },
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  dead: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd3f9HvLUpAUYe53Fw74C6x", "dead");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        sprite1: {
          default: null,
          type: cc.Sprite
        },
        sprite2: {
          default: null,
          type: cc.Sprite
        },
        sprite3: {
          default: null,
          type: cc.Sprite
        }
      },
      setPositionYForDead: function setPositionYForDead(height) {
        this.sprite1.node.y = height;
        this.sprite2.node.y = height + 9.7;
        this.sprite3.node.y = height + 5.9;
      }
    });
    cc._RF.pop();
  }, {} ],
  debugNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f60e1RQK7pLR7FlinqUnCjJ", "debugNode");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        numberEditBox: {
          default: null,
          type: cc.EditBox
        },
        txtShareType: cc.EditBox,
        txtShareSchemeId: cc.EditBox,
        userIdlabel: cc.Label
      },
      onBlack: function onBlack() {},
      onLoad: function onLoad() {
        hall.GlobalFuncs.setInLocalStorage(shot.gameModel.DEBUG_MODE, true);
        this.numberEditBox.node.on("text-changed", this.numberEditChange, this);
        this.numberEditBox.node.on("editing-did-ended", this.numberEditEnd, this);
        this.numberEditBox.string = "0";
        this.userIdlabel.string = "userId  :   " + ty.UserInfo.userId;
      },
      numberEditChange: function numberEditChange(event) {
        this.numberEditBox.string = event.detail.string;
      },
      numberEditEnd: function numberEditEnd(event) {
        var changedString = event.detail.string;
        this.numberEditBox.string = changedString;
        if ("20180706" == changedString) {
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.DEBUG_MODE, false);
          this.node.destroy();
          return;
        }
        "20180707" == changedString && this.node.destroy();
      },
      updateScoreCloud: function updateScoreCloud() {
        shot.GameWorld.totalScore = this.numberEditBox.string;
        shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
      },
      changeInitScore: function changeInitScore() {
        shot.GameWorld.initGameLevel = parseInt(this.numberEditBox.string);
      },
      changeServerUrl: function changeServerUrl() {
        var type = parseInt(this.numberEditBox.string);
        switch (type) {
         case 1:
          hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "http://192.168.20.108:8000/");
          break;

         case 2:
          hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "https://fz.nalrer.cn/");
          break;

         case 3:
          hall.GlobalFuncs.setInLocalStorage(ty.SystemInfo.DEBUG_SER_KEY, "https://openrich.nalrer.cn/");
        }
      },
      onUserLaser: function onUserLaser() {
        shot.GameWorld.canUserLaser = true;
      },
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
      }
    });
    cc._RF.pop();
  }, {} ],
  game_world: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3c5941QAZBAGbYQXjZ+4grs", "game_world");
    "use strict";
    shot.GameWorld = {
      gameOver: true,
      gamePause: false,
      gameGetBox: false,
      crazyMoment: false,
      crazyBonus: 0,
      crazyBottleCount: {
        green: 0,
        purple: 0,
        orange: 0,
        red: 0
      },
      crazyBottleHitCount: 0,
      crazyBottleScore: 0,
      jugglingSchema: false,
      jugglingBottleCount: {
        green: 0,
        purple: 0,
        orange: 0,
        red: 0
      },
      jugglingBonus: 0,
      jugglingBonusPer: 0,
      verticalAccelerate: 0,
      jugglingOriginBottleCount: 0,
      jugglingMissBottleCount: 0,
      jugglingBottleHitCount: 0,
      jugglingBottleScore: 0,
      jugglingBulletCount: 0,
      initGameLevel: 1,
      canUserLaser: false,
      bottleNameList: [ "green", "purple", "orange", "red", "treasureBox", "treasureBox1" ],
      treasureBoxTypeList: [ "laserGun", "infiniteBullet", "grenade", "doubleGun", "shotGun", "Kar98k", "win94", "M16", "Thompson", "Gatling", "Barrett" ],
      bulletTypeList: [ "bulletType0", "bulletType1", "bulletType2", "bulletType3", "bulletType4", "bulletType5", "bulletType6", "bulletType7", "bulletType8" ],
      bulletType: "",
      bulletBlood: "",
      bulletPenetrate: "",
      doubleGunUseTimeCan: 0,
      bulletRange: 0,
      bulletRunningTimeCan: 0,
      bulletRunningInterval: 0,
      gunFireInterval: 0,
      gunFireIntervalNow: 0,
      nowBulletPenetrate: 0,
      doubleGunUseTime: -1,
      bulletRunningTimeBottom: 0,
      bulletRunningTimeTop: 0,
      resurgenceTime: 0,
      infiniteBulletTime: 0,
      addBulletTime: 0,
      laserTime: 0,
      grenadeTime: 0,
      grenadeRunning: false,
      gameLevel: 1,
      lastTreasureLevel: 0,
      bucketCount: 0,
      bottleCount: 0,
      bulletCount: 0,
      bulletInfinite: false,
      totalScore: 0,
      doubleHitCount: 0,
      doubleHitCountBest: 0,
      doubleHitCountDownTime: false,
      bottleConfig: {
        green: {
          type: "green",
          sectionR: 12,
          lifeCount: 1,
          crazyBottleScore: 10
        },
        purple: {
          type: "purple",
          sectionR: 12,
          lifeCount: 2,
          crazyBottleScore: 20
        },
        orange: {
          type: "orange",
          sectionR: 11,
          lifeCount: 3,
          crazyBottleScore: 30
        },
        red: {
          type: "red",
          sectionR: 18,
          lifeCount: 5,
          crazyBottleScore: 50
        },
        treasureBox: {
          type: "treasureBox",
          sectionR: 18,
          lifeCount: 2,
          shareType: true
        },
        treasureBox1: {
          type: "treasureBox1",
          sectionR: 18,
          lifeCount: 2,
          shareType: false
        }
      },
      bulletConfig: {
        bulletType0: {
          penetrate: 1,
          blood: 1,
          range: 0
        },
        bulletType1: {
          penetrate: 1,
          blood: 3,
          range: 0
        },
        bulletType2: {
          penetrate: 9,
          blood: 1,
          range: 15
        },
        bulletType3: {
          penetrate: 1,
          blood: 2,
          range: 0
        },
        bulletType4: {
          penetrate: 3,
          blood: 1,
          range: 0
        },
        bulletType5: {
          penetrate: 1,
          blood: 1,
          range: 0,
          runningFireTime: 3,
          runningInterval: 6
        },
        bulletType6: {
          penetrate: 1,
          blood: 1,
          range: 0,
          gunFireInterval: 5
        },
        bulletType7: {
          penetrate: 1,
          blood: 1,
          range: 0,
          gunFireInterval: 4
        },
        bulletType8: {
          penetrate: 1,
          blood: 5,
          range: 0
        }
      },
      propertyConfig: {
        laserGun: {
          function: "laserGun",
          time: 5,
          limitCount: 5
        },
        infiniteBullet: {
          function: "infiniteBullet",
          time: 5,
          limitCount: 5
        },
        grenade: {
          function: "grenade",
          time: 5,
          limitCount: 5
        },
        doubleGun: {
          bulletType: "bulletType1",
          time: 3,
          name: "AWM狙击枪",
          desc: "武器效果: 攻击力×3"
        },
        shotGun: {
          bulletType: "bulletType2",
          time: 3,
          name: "霰弹枪",
          desc: "武器效果: 攻击范围大幅增加"
        },
        Kar98k: {
          bulletType: "bulletType3",
          time: 3,
          name: "98k狙击枪",
          desc: "武器效果: 攻击力×2"
        },
        win94: {
          bulletType: "bulletType4",
          time: 3,
          name: "温彻斯特步枪",
          desc: "武器效果：可穿透重叠的瓶子"
        },
        M16: {
          bulletType: "bulletType5",
          time: 3,
          name: "M16步枪",
          desc: "武器效果：可进行三连发点射"
        },
        Thompson: {
          bulletType: "bulletType6",
          time: 3,
          name: "汤姆逊冲锋枪",
          desc: "武器效果：按住屏幕可连发射击"
        },
        Gatling: {
          bulletType: "bulletType7",
          time: 3,
          name: "加特林机枪",
          desc: "武器效果：按住屏幕可连发射击"
        },
        Barrett: {
          bulletType: "bulletType8",
          time: 3,
          name: "巴雷特狙击枪",
          desc: "武器效果：攻击力×5"
        }
      },
      treasureConfig: {
        onlyConfig: [ {
          minLevel: 3,
          maxLevel: 3
        }, {
          minLevel: 13,
          maxLevel: 15
        }, {
          minLevel: 19,
          maxLevel: 19
        }, {
          minLevel: 23,
          maxLevel: 25
        }, {
          minLevel: 29,
          maxLevel: 30
        } ],
        probabilityConfig: [ {
          minLevel: 3,
          maxLevel: 3,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: 1
          } ]
        }, {
          minLevel: 13,
          maxLevel: 15,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .6
          } ]
        }, {
          minLevel: 19,
          maxLevel: 19,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .7
          } ]
        }, {
          minLevel: 23,
          maxLevel: 25,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .5
          } ]
        }, {
          minLevel: 29,
          maxLevel: 30,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .4
          } ]
        }, {
          minLevel: 31,
          maxLevel: 38,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .1
          } ]
        }, {
          minLevel: 39,
          maxLevel: 39,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .5
          } ]
        }, {
          minLevel: 41,
          maxLevel: 47,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .1
          } ]
        }, {
          minLevel: 48,
          maxLevel: 48,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .5
          } ]
        }, {
          minLevel: 51,
          maxLevel: 58,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .1
          } ]
        }, {
          minLevel: 59,
          maxLevel: 59,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .4
          } ]
        }, {
          minLevel: 61,
          maxLevel: 66,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .1
          } ]
        }, {
          minLevel: 67,
          maxLevel: 67,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .4
          } ]
        }, {
          minLevel: 71,
          maxLevel: 77,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .1
          } ]
        }, {
          minLevel: 78,
          maxLevel: 78,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .4
          } ]
        }, {
          minLevel: 81,
          maxLevel: 88,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .1
          } ]
        }, {
          minLevel: 89,
          maxLevel: 89,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .3
          } ]
        }, {
          minLevel: 91,
          maxLevel: 99,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .1
          } ]
        }, {
          minLevel: 100,
          maxLevel: 100,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .7
          } ]
        }, {
          minLevel: 101,
          maxLevel: 1e4,
          boxList: [ {
            treasureBoxType: "treasureBox",
            probability: .1
          } ]
        } ],
        rewardConfig: {
          treasureBox: {
            laserGun: 0,
            infiniteBullet: 0,
            grenade: 0,
            doubleGun: 0,
            shotGun: 0,
            Kar98k: 0,
            win94: 0,
            M16: 0,
            Thompson: .5,
            Gatling: .5,
            Barrett: 0
          },
          treasureBox1: {
            laserGun: 0,
            infiniteBullet: .4,
            grenade: .6,
            doubleGun: 0,
            shotGun: 0,
            Kar98k: 0,
            win94: 0,
            M16: 0,
            Thompson: 0,
            Gatling: .2,
            Barrett: .2
          }
        },
        showAtWindow: {
          bsgs: {
            text: "炫耀一下并开启",
            share: true,
            openType: [ "ad", "direct" ],
            shareProbability: 100
          },
          nBsgs: {
            text: "炫耀一下并开启",
            share: true,
            openType: [ "ad", "direct" ],
            shareProbability: 100
          },
          tishen: {
            openType: [ "ad", "direct" ],
            shareProbability: 100
          }
        }
      },
      scoreLevelConfig: {
        specificLevel12: 12,
        initialScore: 8,
        decreaseScore: 4,
        limitScore: 24
      },
      rotationTimeConfig: {
        onlyBucket: {
          oneToFour: 4,
          fiveToNine: 3.6,
          ten: 3.3
        },
        bottomBucket: {
          initialTime: 3.3,
          decreaseTimeList: [ {
            minLevel: 11,
            maxLevel: 24,
            decreaseTime: .3
          }, {
            minLevel: 25,
            maxLevel: 39,
            decreaseTime: .2
          }, {
            minLevel: 40,
            maxLevel: 1e4,
            decreaseTime: .1
          } ],
          limitTime: .8
        },
        topBucket: {
          initialTime: 4.5,
          decreaseTimeList: [ {
            minLevel: 11,
            maxLevel: 24,
            decreaseTime: .4
          }, {
            minLevel: 25,
            maxLevel: 39,
            decreaseTime: .3
          }, {
            minLevel: 40,
            maxLevel: 54,
            decreaseTime: .2
          }, {
            minLevel: 55,
            maxLevel: 1e4,
            decreaseTime: .1
          } ],
          limitTime: 1
        }
      },
      bulletAddConfig: [ {
        minLevel: 3,
        maxLevel: 5,
        bulletAddCount: 12
      }, {
        minLevel: 6,
        maxLevel: 10,
        bulletAddCount: 12
      }, {
        minLevel: 11,
        maxLevel: 12,
        bulletAddCount: 14
      }, {
        minLevel: 13,
        maxLevel: 16,
        bulletAddCount: 20
      }, {
        minLevel: 17,
        maxLevel: 19,
        bulletAddCount: 18
      }, {
        minLevel: 19,
        maxLevel: 1e4,
        bulletAddCount: 22
      } ],
      toolUserTimeConfig: {
        resurgenceTime: 2,
        resurgenceType: {
          bsgs: [ "ad", "omit" ],
          nBsgs: [ "ad", "omit" ],
          shareProbabilityB: 100,
          shareProbabilityN: 100
        },
        diamondShow: {
          bsgs: false,
          nBsgs: false
        },
        mysteryShow: {
          bsgs: false,
          nBsgs: false
        },
        infiniteBulletTime: 3,
        laserTime: 3,
        grenadeTime: 3,
        comboContinue: 50,
        comboContinueTime: 3,
        propType: {
          getItem: {
            bsgs: [ "ad", "shareClick" ],
            nBsgs: [ "ad", "shareClick" ]
          },
          combo: {
            bsgs: [ "ad", "direct" ],
            nBsgs: [ "ad", "direct" ]
          }
        },
        closeBoxTime: 2,
        addBullet: {
          time: 3,
          addCount: 12,
          showType: {
            bsgsch: {
              show: 0,
              showText: "分享到群",
              type: "share"
            },
            nBsgsch: {
              show: 1,
              showText: "分享到群",
              type: "share"
            }
          }
        }
      },
      crazyMomentConfig: {
        crazyLevelList: [ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120 ],
        crazyLevelConfig: [ {
          crazyLevel: 10,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 1e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              green: 30
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              green: 30
            }
          } ]
        }, {
          crazyLevel: 20,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 2e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              purple: 24
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              green: 24
            }
          } ]
        }, {
          crazyLevel: 30,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 3e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              purple: 20
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              orange: 18
            }
          } ]
        }, {
          crazyLevel: 40,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 4e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              green: 40
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              orange: 24
            }
          } ]
        }, {
          crazyLevel: 50,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 6e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              orange: 20
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              red: 15
            }
          } ]
        }, {
          crazyLevel: 60,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 8e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              orange: 24
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              red: 18
            }
          } ]
        }, {
          crazyLevel: 70,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 1e4,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              orange: 30
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              orange: 30
            }
          } ]
        }, {
          crazyLevel: 80,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 12e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              purple: 40
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              red: 24
            }
          } ]
        }, {
          crazyLevel: 90,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 14e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              red: 24
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              orange: 36
            }
          } ]
        }, {
          crazyLevel: 100,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 16e3,
          crazyBucketList: [ {
            crazyRotationTime: 3,
            bottleConfig: {
              orange: 40
            }
          }, {
            crazyRotationTime: 5,
            bottleConfig: {
              orange: 40
            }
          } ]
        }, {
          crazyLevel: 110,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 18e3,
          crazyBucketList: [ {
            crazyRotationTime: 2,
            bottleConfig: {
              orange: 40
            }
          }, {
            crazyRotationTime: 4,
            bottleConfig: {
              red: 30
            }
          } ]
        }, {
          crazyLevel: 120,
          crazyTime: 20,
          propertyUse: "handGun",
          bonusScore: 2e4,
          crazyBucketList: [ {
            crazyRotationTime: 2,
            bottleConfig: {
              red: 36
            }
          }, {
            crazyRotationTime: 4,
            bottleConfig: {
              red: 24
            }
          } ]
        } ]
      },
      jugglingSchemaConfig: {
        jugglingLevelList: [ 5, 15, 25, 35, 45, 55, 65, 75, 85, 95 ],
        jugglingLevelConfig: [ {
          jugglingLevel: 5,
          jugglingAccelerated: 1e3,
          bonus: 10,
          bottleCount: 20,
          bulletCount: 120,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 10,
            minSecondGap: 1,
            maxSecondGap: 2,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 700
              }
            }
          }, {
            minBottleCount: 11,
            maxBottleCount: 20,
            minSecondGap: 1,
            maxSecondGap: 1.8,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 700
              }
            }
          } ]
        }, {
          jugglingLevel: 15,
          jugglingAccelerated: 1100,
          bonus: 10,
          bottleCount: 30,
          bulletCount: 130,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 20,
            minSecondGap: .8,
            maxSecondGap: 1.6,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 20,
                minRadius: 40,
                maxRadius: 60,
                speed: 750
              }
            }
          }, {
            minBottleCount: 21,
            maxBottleCount: 30,
            minSecondGap: .6,
            maxSecondGap: 1.4,
            minRotation: 2,
            maxRotation: 6,
            bottleConfig: {
              green: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 750
              }
            }
          } ]
        }, {
          jugglingLevel: 25,
          jugglingAccelerated: 1200,
          bonus: 10,
          bottleCount: 40,
          bulletCount: 140,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 30,
            minSecondGap: .6,
            maxSecondGap: 1.2,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 30,
                minRadius: 40,
                maxRadius: 60,
                speed: 800
              }
            }
          }, {
            minBottleCount: 31,
            maxBottleCount: 40,
            minSecondGap: .6,
            maxSecondGap: 1,
            minRotation: 2,
            maxRotation: 6,
            bottleConfig: {
              green: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 800
              }
            }
          } ]
        }, {
          jugglingLevel: 35,
          jugglingAccelerated: 1200,
          bonus: 10,
          bottleCount: 50,
          bulletCount: 150,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 30,
            minSecondGap: .6,
            maxSecondGap: .9,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 30,
                minRadius: 40,
                maxRadius: 60,
                speed: 850
              }
            }
          }, {
            minBottleCount: 31,
            maxBottleCount: 50,
            minSecondGap: .5,
            maxSecondGap: .8,
            minRotation: 2,
            maxRotation: 6,
            bottleConfig: {
              green: {
                bottleCount: 20,
                minRadius: 40,
                maxRadius: 60,
                speed: 850
              }
            }
          } ]
        }, {
          jugglingLevel: 45,
          jugglingAccelerated: 1450,
          bonus: 10,
          bottleCount: 50,
          bulletCount: 150,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 30,
            minSecondGap: .5,
            maxSecondGap: .6,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 30,
                minRadius: 40,
                maxRadius: 60,
                speed: 950
              }
            }
          }, {
            minBottleCount: 31,
            maxBottleCount: 50,
            minSecondGap: .4,
            maxSecondGap: .6,
            minRotation: 2,
            maxRotation: 6,
            bottleConfig: {
              green: {
                bottleCount: 20,
                minRadius: 40,
                maxRadius: 60,
                speed: 950
              }
            }
          } ]
        }, {
          jugglingLevel: 55,
          jugglingAccelerated: 1e3,
          bonus: 10,
          bottleCount: 20,
          bulletCount: 130,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 10,
            minSecondGap: 1,
            maxSecondGap: 2,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 5,
                minRadius: 40,
                maxRadius: 60,
                speed: 700
              },
              purple: {
                bottleCount: 5,
                minRadius: 40,
                maxRadius: 60,
                speed: 700
              }
            }
          }, {
            minBottleCount: 11,
            maxBottleCount: 20,
            minSecondGap: 1,
            maxSecondGap: 1.8,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 5,
                minRadius: 40,
                maxRadius: 60,
                speed: 700
              },
              purple: {
                bottleCount: 5,
                minRadius: 40,
                maxRadius: 60,
                speed: 700
              }
            }
          } ]
        }, {
          jugglingLevel: 65,
          jugglingAccelerated: 1100,
          bonus: 10,
          bottleCount: 30,
          bulletCount: 145,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 20,
            minSecondGap: .8,
            maxSecondGap: 1.6,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 750
              },
              purple: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 750
              }
            }
          }, {
            minBottleCount: 21,
            maxBottleCount: 30,
            minSecondGap: .6,
            maxSecondGap: 1.4,
            minRotation: 2,
            maxRotation: 6,
            bottleConfig: {
              green: {
                bottleCount: 5,
                minRadius: 40,
                maxRadius: 60,
                speed: 750
              },
              purple: {
                bottleCount: 5,
                minRadius: 40,
                maxRadius: 60,
                speed: 750
              }
            }
          } ]
        }, {
          jugglingLevel: 75,
          jugglingAccelerated: 1200,
          bonus: 10,
          bottleCount: 40,
          bulletCount: 160,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 30,
            minSecondGap: .6,
            maxSecondGap: 1.2,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 15,
                minRadius: 40,
                maxRadius: 60,
                speed: 800
              },
              purple: {
                bottleCount: 15,
                minRadius: 40,
                maxRadius: 60,
                speed: 800
              }
            }
          }, {
            minBottleCount: 31,
            maxBottleCount: 40,
            minSecondGap: .6,
            maxSecondGap: 1,
            minRotation: 2,
            maxRotation: 6,
            bottleConfig: {
              green: {
                bottleCount: 5,
                minRadius: 40,
                maxRadius: 60,
                speed: 800
              },
              purple: {
                bottleCount: 5,
                minRadius: 40,
                maxRadius: 60,
                speed: 800
              }
            }
          } ]
        }, {
          jugglingLevel: 85,
          jugglingAccelerated: 1200,
          bonus: 10,
          bottleCount: 50,
          bulletCount: 175,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 30,
            minSecondGap: .6,
            maxSecondGap: .9,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 15,
                minRadius: 40,
                maxRadius: 60,
                speed: 850
              },
              purple: {
                bottleCount: 15,
                minRadius: 40,
                maxRadius: 60,
                speed: 850
              }
            }
          }, {
            minBottleCount: 31,
            maxBottleCount: 50,
            minSecondGap: .5,
            maxSecondGap: .8,
            minRotation: 2,
            maxRotation: 6,
            bottleConfig: {
              green: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 850
              },
              purple: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 850
              }
            }
          } ]
        }, {
          jugglingLevel: 95,
          jugglingAccelerated: 1450,
          bonus: 10,
          bottleCount: 50,
          bulletCount: 150,
          jugglingList: [ {
            minBottleCount: 0,
            maxBottleCount: 30,
            minSecondGap: .5,
            maxSecondGap: .6,
            minRotation: 2,
            maxRotation: 8,
            bottleConfig: {
              green: {
                bottleCount: 15,
                minRadius: 40,
                maxRadius: 60,
                speed: 950
              },
              purple: {
                bottleCount: 15,
                minRadius: 40,
                maxRadius: 60,
                speed: 950
              }
            }
          }, {
            minBottleCount: 31,
            maxBottleCount: 50,
            minSecondGap: .4,
            maxSecondGap: .6,
            minRotation: 2,
            maxRotation: 6,
            bottleConfig: {
              green: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 950
              },
              purple: {
                bottleCount: 10,
                minRadius: 40,
                maxRadius: 60,
                speed: 950
              }
            }
          } ]
        } ]
      },
      gunnerShareSchemeConfig: null,
      shareConfig: null
    };
    cc._RF.pop();
  }, {} ],
  jump_boot: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8db15UjX0tJCpg4uzGmlEqz", "jump_boot");
    "use strict";
    require("QrOption");
    shot.LOGD = function(tag, msg) {
      if (!debugMode) return;
      var logStr = "shot_: " + msg;
      tag && (logStr = tag + "shot_: " + msg);
      console.log(logStr);
    };
    shot.LOGW = function(tag, msg) {
      if (!debugMode) return;
      var logStr = "shot_: " + msg;
      tag && (logStr = tag + "shot_: " + msg);
      console.warn(logStr);
    };
    shot.qrCodeOption = new shot.QrOption();
    ty.TuyooSDK.getSystemType();
    shot.GameId = 6;
    shot.recordFileType = "mp3";
    shot.SETTING_MUTE_KEY = "setting_mute";
    shot.SETTING_MUSIC_KEY = "setting_music";
    shot.SETTING_EFFECT_KEY = "setting_effect";
    shot.LOCAL_VERSION_KEY = "LOCAL_VERSION_KEY";
    cc._RF.pop();
  }, {
    QrOption: "QrOption"
  } ],
  jump_noDiamond_toastTip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "08787TasxZL7oVDYtXQpx/Z", "jump_noDiamond_toastTip");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        tanIconSprite: {
          default: null,
          type: cc.Sprite
        },
        okIconSprite: {
          default: null,
          type: cc.Sprite
        },
        noDiamondLabel: {
          default: null,
          type: cc.Label
        },
        normalLabel: {
          default: null,
          type: cc.Label
        }
      },
      onLoad: function onLoad() {
        ty.Timer.setTimer(this, this.closeAction, 2.5);
      },
      changeTitle: function changeTitle(titleString) {
        this.noDiamondLabel.node.active = false;
        this.normalLabel.node.active = true;
        this.normalLabel.string = titleString;
        if ("需要分享到群" != titleString) {
          this.tanIconSprite.node.active = false;
          this.okIconSprite.node.active = true;
        }
      },
      onBlack: function onBlack() {},
      closeAction: function closeAction() {
        this.node.destroy();
      },
      onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
        ty.NotificationCenter.ignoreScope(this);
      }
    });
    cc._RF.pop();
  }, {} ],
  jump_pause: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "92089Zp+I5McIkokCwSFBJn", "jump_pause");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onContinue: function onContinue() {
        shot.gameModel.isPause = false;
        this.node.destroy();
      },
      onBlack: function onBlack() {},
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  jump_userInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6bcb2gow+VPwKEBvY4zyCPn", "jump_userInfo");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {}
    });
    cc._RF.pop();
  }, {} ],
  main_toast: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "594824kjYFCVYQgpNiZU900", "main_toast");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        avatarSprite: {
          default: null,
          type: cc.Sprite
        },
        nameLabel: {
          default: null,
          type: cc.Label
        },
        countLabel: {
          default: null,
          type: cc.Label
        }
      },
      changeName: function changeName(userName, count, picUrl) {
        var showName;
        userName && (showName = hall.GlobalFuncs.sliceStringToLength(userName, 10));
        this.nameLabel.string = " " + showName || "好友";
        var showCount = count || 1;
        this.countLabel.string = " x" + showCount;
        ty.Timer.setTimer(this, this.closeAction, 2.5);
        ty.SystemInfo.getImageWithURL(picUrl, this.avatarSprite);
      },
      onLoad: function onLoad() {},
      closeAction: function closeAction() {
        this.node.destroy();
      },
      onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
        ty.NotificationCenter.ignoreScope(this);
      }
    });
    cc._RF.pop();
  }, {} ],
  newerNode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "454e7/M5UhAipxw/2lx77Li", "newerNode");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      iKnowAction: function iKnowAction() {
        hall.GlobalFuncs.setInLocalStorage(shot.gameModel.IS_NEW_USER, false);
        ty.NotificationCenter.trigger(shot.EventType.GAME_START, "start");
        this.node.destroy();
      },
      onPictureAction: function onPictureAction() {}
    });
    cc._RF.pop();
  }, {} ],
  shotAudioHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bb86dJbZZhDeLm0Dqb/r2iW", "shotAudioHelper");
    "use strict";
    shot.AudioHelper = {
      getMusicPlayManager: function getMusicPlayManager() {
        this.stopMusic();
        this.musicPlayManager = wx.createInnerAudioContext();
        this.musicPlayManager.obeyMuteSwitch = true;
        return this.musicPlayManager;
      },
      playMusic: function playMusic(file, isloop, volume) {
        this.musicPlayManager && this.musicPlayManager.stop();
        this._curMusicFile = file;
        var playManager = this.getMusicPlayManager();
        3 == arguments.length && (playManager.volume = volume);
        playManager.autoplay = true;
        playManager.loop = isloop;
        playManager.src = ty.SystemInfo.cdnPath + file;
      },
      rePlayMusic: function rePlayMusic() {
        this.musicPlayManager && this.musicPlayManager.loop && this.musicPlayManager.play();
      },
      stopMusic: function stopMusic() {
        if (this.musicPlayManager) {
          this.musicPlayManager.stop();
          this.musicPlayManager.destroy();
          this.musicPlayManager = null;
        }
      },
      playEffect: function playEffect(file, isloop, volume) {
        var playManager = wx.createInnerAudioContext();
        playManager.obeyMuteSwitch = true;
        3 == arguments.length ? playManager.volume = volume : playManager.volume = 1;
        playManager.autoplay = true;
        playManager.loop = isloop;
        playManager.src = ty.SystemInfo.cdnPath + file;
        "/resources/sound/gunshot.mp3" == file && (playManager.src = file);
        playManager.onStop(function() {
          playManager.destroy();
          playManager = null;
        });
        return playManager;
      },
      stopEffectWithInnerAudioContext: function stopEffectWithInnerAudioContext(innerAudioContext) {
        if (!innerAudioContext) return;
        innerAudioContext.stop();
        innerAudioContext.destroy();
        innerAudioContext = null;
      },
      stopEffect: function stopEffect(effectId) {
        if (effectId < 0) return;
        cc.audioEngine.stopEffect(effectId);
      },
      stopAllEffects: function stopAllEffects() {
        cc.audioEngine.stopAllEffects();
      },
      unloadAll: function unloadAll() {
        cc.audioEngine.uncacheAll();
      },
      setEffectsVolume: function setEffectsVolume(val) {
        hall.GlobalFuncs.setInLocalStorage(shot.SETTING_EFFECT_KEY, val);
        cc.audioEngine.setEffectsVolume(val);
      },
      setMusicVolume: function setMusicVolume(val) {
        hall.GlobalFuncs.setInLocalStorage(shot.SETTING_MUSIC_KEY, val);
        cc.audioEngine.setMusicVolume(val);
      },
      getMusicVolume: function getMusicVolume() {
        return hall.GlobalFuncs.ReadNumFromLocalStorage(shot.SETTING_MUSIC_KEY, cc.audioEngine.getMusicVolume());
      },
      getEffectsVolume: function getEffectsVolume() {
        return hall.GlobalFuncs.ReadNumFromLocalStorage(shot.SETTING_EFFECT_KEY, cc.audioEngine.getEffectsVolume());
      }
    };
    cc._RF.pop();
  }, {} ],
  shotGlobalFuncs: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0f720dPBlZKYrEaV4o8sy1S", "shotGlobalFuncs");
    "use strict";
    shot.GlobalFuncs = {};
    shot.GlobalFuncs.formatTime = function(value) {
      var h = Math.floor(value / 3600);
      var m = Math.floor(value % 3600 / 60);
      var s = parseInt(value % 60);
      var mh = h < 10 ? "0" + h : "" + h;
      var ms = m < 10 ? "0" + m : "" + m;
      var ss = s < 10 ? "0" + s : "" + s;
      return mh + ":" + ms + ":" + ss;
    };
    shot.GlobalFuncs.drawGameCanvas = function() {
      var webC = cc._renderContext;
      webC.clearColor(183 / 255, 220 / 255, 181 / 255, 1);
      webC.clear(webC.COLOR_BUFFER_BIT | webC.DEPTH_BUFFER_BIT);
    };
    shot.GlobalFuncs.getBackButtonPositionY = function() {
      var systemTy = ty.UserInfo.systemType;
      var sceneSize = cc.director.getWinSize();
      var reultHeight = 0;
      systemTy == ty.UserInfo.SYSTEMTYPE.iphoneOtherType ? reultHeight = sceneSize.height / 2 - 49 : systemTy == ty.UserInfo.SYSTEMTYPE.iPhoneXType ? reultHeight = sceneSize.height / 2 - 102 : systemTy == ty.UserInfo.SYSTEMTYPE.ANDROIDOther ? reultHeight = sceneSize.height / 2 - 54 : systemTy == ty.UserInfo.SYSTEMTYPE.iPhone7P8PType ? reultHeight = sceneSize.height / 2 - 46 : systemTy == ty.UserInfo.SYSTEMTYPE.ANDROIDVIVO85 && (reultHeight = sceneSize.height / 2 - 104);
      return reultHeight;
    };
    shot.GlobalFuncs.getOpenData = function(withOutMsg) {
      if (!wx.hasOwnProperty("getOpenDataContext")) {
        withOutMsg || hall.MsgBoxManager.showToast({
          title: "您当前版本,不支持排行榜,请升级微信!"
        });
        return null;
      }
      var openDataContext = wx.getOpenDataContext();
      if (openDataContext) return openDataContext;
      return null;
    };
    shot.GlobalFuncs.upDateRankData = function(val) {
      if (!ty.UserInfo.userId) return;
      var openDataContext = shot.GlobalFuncs.getOpenData(true);
      if (!openDataContext) return;
      openDataContext.postMessage({
        method: "updateRank",
        sumScore: val,
        userId: ty.UserInfo.userId
      });
    };
    shot.GlobalFuncs.upDateRankDataWeek = function(val) {
      var openDataContext = shot.GlobalFuncs.getOpenData(true);
      if (!openDataContext) return;
      openDataContext.postMessage({
        method: "updateRankWeek",
        week: val
      });
    };
    shot.GlobalFuncs.getUserInfo = function() {
      var openDataContext = shot.GlobalFuncs.getOpenData(true);
      if (!openDataContext) return;
      openDataContext.postMessage({
        method: "getUserInfo"
      });
    };
    shot.GlobalFuncs.getFriendInfo = function() {
      var openDataContext = shot.GlobalFuncs.getOpenData(true);
      if (!openDataContext) return;
      var week = hall.GlobalTimer.getCurWeek();
      openDataContext.postMessage({
        method: "getFriendInfo",
        week: week,
        userId: ty.UserInfo.userId,
        sumScore: shot.GameWorld.totalScore
      });
    };
    shot.GlobalFuncs.getThirdRankInfo = function() {
      var openDataContext = shot.GlobalFuncs.getOpenData(true);
      if (!openDataContext) return;
      var week = hall.GlobalTimer.getCurWeek();
      openDataContext.postMessage({
        method: "getResultRank",
        week: week,
        userId: ty.UserInfo.userId,
        sumScore: shot.GameWorld.totalScore
      });
    };
    shot.GlobalFuncs.showGroupRank = function(val) {
      var openDataContext = shot.GlobalFuncs.getOpenData();
      if (!openDataContext) return;
      var week = hall.GlobalTimer.getCurWeek();
      openDataContext.postMessage({
        method: "showGroupRank",
        shareTicket: val,
        userId: ty.UserInfo.userId,
        rankType: "sumScore",
        week: week
      });
    };
    shot.GlobalFuncs.showFriendRank = function() {
      var openDataContext = shot.GlobalFuncs.getOpenData();
      if (!openDataContext) return;
      var week = hall.GlobalTimer.getCurWeek();
      openDataContext.postMessage({
        method: "showFriendRank",
        userId: ty.UserInfo.userId,
        rankType: "sumScore",
        week: week
      });
    };
    shot.GlobalFuncs.showOrigin = function() {
      var openDataContext = shot.GlobalFuncs.getOpenData();
      if (!openDataContext) return;
      openDataContext.postMessage({
        method: "showOrigin"
      });
    };
    shot.GlobalFuncs.setCrazyProperty = function(type) {
      var bulletType;
      bulletType = "handGun" != type ? shot.GameWorld.propertyConfig[type].bulletType : "bulletType0";
      shot.GameWorld.bulletBlood = shot.GameWorld.bulletConfig[bulletType].blood;
      shot.GameWorld.bulletPenetrate = shot.GameWorld.bulletConfig[bulletType].penetrate;
      shot.GameWorld.bulletRange = "bulletType2" == bulletType ? shot.GameWorld.bulletConfig[bulletType].range : 0;
      shot.GlobalFuncs.changeBulletSoundAndSprite(bulletType);
    };
    shot.GlobalFuncs.restoreFromCrazyMoment = function() {
      shot.GameWorld.bulletBlood = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].blood;
      shot.GameWorld.bulletPenetrate = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].penetrate;
      "bulletType2" == shot.GameWorld.bulletType ? shot.GameWorld.bulletRange = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].range : shot.GameWorld.bulletRange = 0;
      "bulletType0" != shot.GameWorld.bulletType && (shot.GameWorld.doubleGunUseTime -= 1);
      shot.GlobalFuncs.changeBulletSoundAndSprite(shot.GameWorld.bulletType);
    };
    shot.GlobalFuncs.setBulletType = function(type) {
      shot.GameWorld.bulletType = type;
      shot.GameWorld.bulletBlood = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].blood;
      shot.GameWorld.bulletPenetrate = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].penetrate;
      shot.GameWorld.bulletRange = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].range;
      shot.GameWorld.doubleGunUseTime = 1;
      var index = shot.GameWorld.bulletTypeList.indexOf(type);
      var gunType = shot.GameWorld.treasureBoxTypeList[index + 2];
      shot.GameWorld.doubleGunUseTimeCan = shot.GameWorld.propertyConfig[gunType].time;
      shot.GameWorld.bulletRunningTimeCan = 0;
      shot.GameWorld.bulletRunningInterval = 0;
      shot.GameWorld.gunFireInterval = 0;
      if ("bulletType0" == type) {
        shot.GameWorld.doubleGunUseTime = -1;
        shot.GameWorld.doubleGunUseTimeCan = 0;
      } else if ("bulletType5" == type) {
        shot.GameWorld.bulletRunningTimeCan = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].runningFireTime;
        shot.GameWorld.bulletRunningInterval = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].runningInterval;
      } else "bulletType6" != type && "bulletType7" != type || (shot.GameWorld.gunFireInterval = shot.GameWorld.bulletConfig[shot.GameWorld.bulletType].gunFireInterval);
      shot.GlobalFuncs.changeBulletSoundAndSprite(type);
    };
    shot.GlobalFuncs.changeBulletSoundAndSprite = function(type) {
      var index = shot.GameWorld.bulletTypeList.indexOf(type);
      shot.EffectPath_mp3.gunHits = shot.EffectPath_mp3["gunHits" + index];
      ty.NotificationCenter.trigger(shot.EventType.REPLACE_GUN, index);
    };
    shot.GlobalFuncs.showDropEffect = function(baseScale, pNode) {
      pNode.scale = 1.15 * baseScale;
      var seq = cc.sequence(cc.scaleTo(.1, .93 * baseScale), cc.scaleTo(.015, baseScale));
      pNode.runAction(seq);
    };
    shot.GlobalFuncs.setToCenter = function(node) {
      var winSize = cc.director.getWinSize();
      node.x = winSize.width / 2;
      node.y = winSize.height / 2;
    };
    shot.GlobalFuncs.showDiamondGift = function(state, result) {
      cc.loader.loadRes("shot_prefabs/shot_diamond", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
        var com = preFabNode.getComponent("shot_diamond");
        com.changeStateWithInfo(state, result);
      }.bind(this));
    };
    shot.GlobalFuncs.showRankList = function(shareTicket) {
      shot.gameModel.rankWindow ? shot.gameModel.rankWindow.changeButtonToRank(shareTicket) : cc.loader.loadRes("shot_prefabs/shot_rank", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        var curScene = cc.director.getScene();
        if (curScene) {
          curScene.addChild(preFabNode);
          shot.GlobalFuncs.setToCenter(preFabNode);
          var com = preFabNode.getComponent("shot_rank");
          shot.gameModel.rankWindow = com;
          com.changeButtonToRank(shareTicket);
        }
      }.bind(this));
    };
    shot.GlobalFuncs.showNewTipsPanel = function() {
      cc.loader.loadRes("shot_prefabs/newerNode", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
      }.bind(this));
    };
    shot.GlobalFuncs.showFreeTool = function() {
      cc.loader.loadRes("shot_prefabs/shot_freeTool", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
      }.bind(this));
    };
    shot.GlobalFuncs.showResurgence = function() {
      cc.loader.loadRes("shot_prefabs/shot_resurgence", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
      }.bind(this));
    };
    shot.GlobalFuncs.showGameOverWithMyScore = function() {
      cc.loader.loadRes("shot_prefabs/shot_result", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
      }.bind(this));
    };
    shot.GlobalFuncs.showShareResult = function() {
      cc.loader.loadRes("shot_prefabs/shot_shareResult", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
      }.bind(this));
    };
    shot.GlobalFuncs.showMysteryGifgBag = function(result) {
      cc.loader.loadRes("shot_prefabs/shot_mystery_giftBag", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
      }.bind(this));
    };
    shot.GlobalFuncs.showPropBox = function(result, doubleHit) {
      cc.loader.loadRes("shot_prefabs/shot_prop", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
        var com = preFabNode.getComponent("shot_prop");
        doubleHit ? com.updateToDoubleHitContinue() : com.updateInfo(result);
      }.bind(this));
    };
    shot.GlobalFuncs.showSecretBox = function(boxType, delegate) {
      ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeShowWindow, [ "secretBox" ]);
      cc.loader.loadRes("shot_prefabs/shot_secret_box", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
        var com = preFabNode.getComponent("shot_secret_box");
        com.setBoxTypeWithType(boxType, delegate);
      }.bind(this));
    };
    shot.GlobalFuncs.playGetPropBoxAni = function(state, count) {
      cc.loader.loadRes("shot_prefabs/shot_getProp", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
        var com = preFabNode.getComponent("zidandaoju");
        com.updateProp(state, count);
      }.bind(this));
    };
    shot.GlobalFuncs.showDebugPanel = function() {
      cc.loader.loadRes("shot_prefabs/debugNode", function(err, prefab) {
        var preFabNode = cc.instantiate(prefab);
        cc.director.getScene().addChild(preFabNode);
        shot.GlobalFuncs.setToCenter(preFabNode);
      }.bind(this));
    };
    cc._RF.pop();
  }, {} ],
  shot_addScoreAni: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "79ecff30gtA062ONiSPI4nd", "shot_addScoreAni");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        addScoreLabel: {
          default: null,
          type: cc.Label
        }
      },
      setAddScore: function setAddScore(score) {
        this.addScoreLabel.string = "+" + score;
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_begin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "40f1fwOvnBKBbO37+jJ+lIQ", "shot_begin");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        aniSpriteNode: {
          default: null,
          type: cc.Node
        },
        bestScoreLabel: {
          default: null,
          type: cc.Label
        },
        diamondNode: {
          default: null,
          type: cc.Node
        },
        freeToolNode: {
          default: null,
          type: cc.Node
        }
      },
      onGetGift: function onGetGift() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "getDiamond" ]);
        shot.GlobalFuncs.showDiamondGift(0);
      },
      onFreeTool: function onFreeTool() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "freeTool" ]);
        shot.GlobalFuncs.showFreeTool();
      },
      startGame: function startGame() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "startGame" ]);
        var sceneName = "shot_main";
        var onLaunched = function onLaunched() {};
        cc.director.loadScene(sceneName, onLaunched);
      },
      friendRank: function friendRank() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "friendRank" ]);
        shot.GlobalFuncs.showRankList("");
      },
      onLoad: function onLoad() {
        ty.NotificationCenter.listen(shot.EventType.UPDATE_USERINFO, this.updateUserInfo, this);
        this.bestScoreLabel.string = "最佳得分:" + shot.Share.shareKeywordReplace.bestScoreForSelf;
        shot.gameModel.getUserInfoForShot();
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicStart, true);
        ty.NotificationCenter.listen(shot.EventType.REPLAY_BG_MUSIC, this.rePlayBgMusic, this);
        hall.adManager.checkVideoAd();
        hall.GlobalTimer.getCurWeek();
        this.changeDiamondNodeActive();
        this.changeGameClubButtonActive();
        ty.NotificationCenter.listen(shot.EventType.GUNNER_SHARE_SCHEME, this.changeDiamondNodeActive, this);
        ty.NotificationCenter.listen(shot.EventType.BSGS_CHECK_RESULT, this.changeDiamondNodeActive, this);
        ty.NotificationCenter.listen(shot.EventType.GUNNER_SHARE_SCHEME, this.changeGameClubButtonActive, this);
        this.getAdMsg();
        ty.NotificationCenter.listen(ty.EventType.GET_AD_MSG_SUCCESS, this.getAdMsg, this);
        shot.gameModel.checkRewardWithSharePoint(shot.Share.SharePointType.getFreeTool);
        ty.NotificationCenter.listen(shot.EventType.GET_CHECK_REWARD, this.changeFreeToolNodeActive, this);
        var result = ty.UserInfo.onShowParam;
        if (!result) return;
        var scene = result.scene;
        var query = result.query;
        var shareTicket;
        if (query && query.sourceCode && result.isFirstOpen && query.sourceCode == shot.Share.onShareType.clickStatShareTypeRankList && 1044 == scene) {
          shareTicket = result.shareTicket;
          shareTicket && shot.GlobalFuncs.showRankList(shareTicket);
        }
        ty.UserInfo.onShowParam.isFirstOpen = false;
      },
      getAdMsg: function getAdMsg() {
        if (!shot.gameModel.getAllCheckConfig()) if (hall.adManager.getAdNodeList().length < 1) {
          var sceneSize = cc.director.getWinSize();
          hall.adManager.showAd({
            x: 72,
            y: sceneSize.height / 2 + 50
          });
        } else hall.adManager.getAdNodeList()[0].showAdNode();
      },
      changeDiamondNodeActive: function changeDiamondNodeActive() {
        shot.gameModel.getAllCheckConfig() ? this.diamondNode.active = false : ty.UserInfo.isInBSGS ? this.diamondNode.active = shot.GameWorld.toolUserTimeConfig.diamondShow.bsgs : this.diamondNode.active = shot.GameWorld.toolUserTimeConfig.diamondShow.nBsgs;
      },
      changeFreeToolNodeActive: function changeFreeToolNodeActive(result) {
        this.freeToolNode.active = result.leftCount;
      },
      changeGameClubButtonActive: function changeGameClubButtonActive() {
        if (shot.GameWorld.gunnerShareSchemeConfig && shot.GameWorld.gunnerShareSchemeConfig.showGameClubButton) {
          if (!shot.gameClubButton) {
            var sysInfo = hall.adManager.getSysInfo();
            var screenHeight = sysInfo.screenHeight;
            hall.LOGD("===", "===screenHeight===" + screenHeight);
            shot.gameClubButton = wx.createGameClubButton({
              type: "image",
              image: "https://nslyqn.nalrer.cn/nsly/crazygun/icon/game.png",
              icon: "green",
              style: {
                left: 10,
                top: screenHeight - 68,
                width: 42,
                height: 42
              }
            });
          }
          shot.gameClubButton.show();
        }
      },
      rePlayBgMusic: function rePlayBgMusic() {
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicStart, true);
      },
      updateUserInfo: function updateUserInfo(result) {
        if (result.playinfo.max_score) {
          shot.Share.shareKeywordReplace.bestScoreForSelf = result.playinfo.max_score;
          shot.GlobalFuncs.upDateRankData(result.playinfo.max_score);
        }
        result.playinfo.history_score && (this.bestScoreLabel.string = "历史最佳:" + result.playinfo.history_score);
      },
      update: function update(dt) {
        this.aniSpriteNode.rotation += 1;
      },
      onDestroy: function onDestroy() {
        shot.gameClubButton && shot.gameClubButton.destroy();
        if (hall.adManager.getAdNodeList().length >= 1) for (var i = 0; i < hall.adManager.getAdNodeList().length; i++) hall.adManager.getAdNodeList()[i].hideAdNode();
        shot.gameClubButton = null;
        ty.NotificationCenter.ignoreScope(this);
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_bottle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "685few5gpFK0q1Scy5e/fey", "shot_bottle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      ctor: function ctor() {
        this.bottleInfoDictionary = {};
      },
      properties: {
        windowWidth: 0,
        bottleSprite: {
          default: null,
          type: cc.Sprite
        },
        bottleSpriteList: [ cc.SpriteFrame ],
        bottleSpriteList1: [ cc.SpriteFrame ],
        bottleSpriteList2: [ cc.SpriteFrame ],
        bottleSpriteList3: [ cc.SpriteFrame ],
        bottleSpriteList4: [ cc.SpriteFrame ],
        type: "",
        bucket: {
          default: null
        },
        isAction: false,
        lifeCount: 0,
        sitNumber: 0,
        jugglingNodeX: 0,
        byRotation: 0,
        verticalJugglingSpeed: 0,
        horizontalJugglingSpeed: 0,
        fromRight: false
      },
      onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        this.windowWidth = winSize.width / 2;
        this.bottleInfoDictionary = {};
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        this.bottleInfoDictionary.type = this.type;
        this.bottleInfoDictionary.sitNumber = this.sitNumber;
      },
      getJugglingNodeX: function getJugglingNodeX() {
        return this.jugglingNodeX;
      },
      getJugglingNodeY: function getJugglingNodeY() {
        return this.node.y;
      },
      setBottleOriginInformationForJuggling: function setBottleOriginInformationForJuggling(bucket, jugglingNodeX) {
        this.bucket = bucket;
        this.jugglingNodeX = jugglingNodeX;
        this.node.x = this.jugglingNodeX;
        this.verticalJugglingSpeed = 0;
        this.horizontalJugglingSpeed = 0;
      },
      setBottleTypeForJuggling: function setBottleTypeForJuggling(type, typeConfig, originX, originY, originRotation, byRotation, fromRight) {
        this.type = type;
        this.lifeCount = shot.GameWorld.bottleConfig[type].lifeCount;
        this.bottleInfoDictionary.type = this.type;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        this.bottleSprite.spriteFrame = this.bottleSpriteList[shot.GameWorld.bottleNameList.indexOf(type)];
        this.bottleSprite.node.active = true;
        this.node.active = true;
        this.jugglingNodeX = originX;
        this.node.x = this.jugglingNodeX;
        this.node.y = originY;
        this.node.rotation = originRotation;
        this.byRotation = byRotation;
        var radius = 2 * (hall.GlobalFuncs.getRandomNumberBefore(typeConfig.maxRadius - typeConfig.minRadius + 1) + typeConfig.minRadius) * Math.PI / 360;
        this.verticalJugglingSpeed = Math.sin(radius) * typeConfig.speed;
        this.horizontalJugglingSpeed = Math.cos(radius) * typeConfig.speed;
        this.fromRight = fromRight;
      },
      changeNodeStateForJuggling: function changeNodeStateForJuggling() {
        this.bottleSprite.node.active = true;
      },
      setBottleType: function setBottleType(type, bucket, height, sitNumber) {
        this.bucket = bucket;
        this.type = type;
        this.sitNumber = sitNumber;
        this.lifeCount = shot.GameWorld.bottleConfig[type].lifeCount;
        this.bottleInfoDictionary.type = this.type;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        this.bottleInfoDictionary.sitNumber = this.sitNumber;
        this.bottleSprite.spriteFrame = this.bottleSpriteList[shot.GameWorld.bottleNameList.indexOf(type)];
        this.bottleSprite.node.active = true;
        this.bottleSprite.node.y = height;
      },
      bottleHit: function bottleHit(direction) {
        if (shot.GameWorld.nowBulletPenetrate <= 0) return false;
        if (this.lifeCount <= 0) return false;
        shot.GameWorld.nowBulletPenetrate--;
        this.lifeCount -= shot.GameWorld.bulletBlood;
        this.lifeCount = this.lifeCount < 0 ? 0 : this.lifeCount;
        this.bottleInfoDictionary.lifeCount = this.lifeCount;
        direction && (this.bottleInfoDictionary.direction = direction);
        this.bucket.receiveBottleLifeCount(this.bottleInfoDictionary, this);
        if (0 == this.lifeCount) {
          shot.AudioHelper.playEffect(shot.EffectPath_mp3.endSmash, false);
          this.node.active = false;
        } else {
          shot.GameWorld.bottleConfig[this.type].lifeCount == this.lifeCount + 1 ? shot.AudioHelper.playEffect(shot.EffectPath_mp3.headSmash, false) : shot.AudioHelper.playEffect(shot.EffectPath_mp3.centerSmash, false);
          this.bottleSprite.spriteFrame = this["bottleSpriteList" + this.lifeCount][shot.GameWorld.bottleNameList.indexOf(this.type)];
        }
        return true;
      },
      update: function update(dt) {
        if (0 != this.horizontalJugglingSpeed) {
          if (this.fromRight) {
            this.jugglingNodeX -= this.horizontalJugglingSpeed * dt;
            this.node.x = this.jugglingNodeX;
            this.node.x < -this.windowWidth && this.bucket.missBottleOne(this, this.fromRight);
          } else {
            this.jugglingNodeX += this.horizontalJugglingSpeed * dt;
            this.node.x = this.jugglingNodeX;
            this.node.x > this.windowWidth && this.bucket.missBottleOne(this, this.fromRight);
          }
          this.verticalJugglingSpeed -= shot.GameWorld.verticalAccelerate * dt;
          this.node.y += this.verticalJugglingSpeed * dt;
          this.node.rotation += this.byRotation;
        }
      },
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_bucket: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a3cd9qFdoZP+6ELk1WDe6i0", "shot_bucket");
    "use strict";
    cc.Class({
      extends: cc.Component,
      ctor: function ctor() {
        this.bottlePool0 = null;
        this.bottlePool1 = null;
        this.bottlePool2 = null;
        this.bottlePool3 = null;
        this.bottlePool4 = null;
        this.bottlePool5 = null;
        this.bottlePool6 = null;
        this.bottlePool7 = null;
        this.bottlePool8 = null;
        this.bottlePool9 = null;
        this.deadPool = null;
        this.rotationForBattleArray = [];
      },
      properties: {
        rotationNode: {
          default: null,
          type: cc.Node
        },
        bottleNode: {
          default: null,
          type: cc.Node
        },
        aniNodeForSection: {
          default: null,
          type: cc.Node
        },
        deadPrefab: {
          default: null,
          type: cc.Prefab
        },
        bottleAniNode: {
          default: null,
          type: cc.Node
        },
        bottleAniNodeLeft: {
          default: null,
          type: cc.Node
        },
        bottleAniNodeRight: {
          default: null,
          type: cc.Node
        },
        prefabList: [ cc.Prefab ],
        bottlePrefab: {
          default: null,
          type: cc.Prefab
        },
        bgType: "none",
        radius: 139,
        roundSpeed: 0,
        roundRotation: 180,
        roundRotationKey: 0,
        aniScale: false,
        isOnShotAction: false,
        haveHitBottle: false,
        receiveBulletIntervalCount: 0,
        bottleList: [ "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none" ],
        bottlePrefabList: [ cc.Node ],
        parentScene: {
          default: null,
          serializable: false
        }
      },
      onLoad: function onLoad() {
        for (var i = 0; i < 10; i++) {
          this["bottlePool" + i] = new cc.NodePool();
          for (var j = 0; j < 5; j++) this["bottlePool" + i].put(cc.instantiate(this.prefabList[i]));
        }
        var winSize = cc.director.getWinSize();
        this.radius = this.radius * winSize.width / 640;
        this.bottleAniNode.y = -this.radius;
        this.deadPool = new cc.NodePool();
        for (var k = 0; k < 8; k++) {
          var deadNode = cc.instantiate(this.deadPrefab);
          var deadW = deadNode.getComponent("dead");
          deadW.setPositionYForDead(this.radius);
          this.deadPool.put(deadNode);
        }
      },
      setRotateTimeWithType: function setRotateTimeWithType(type) {
        this.bgType = type;
        if ("none" == type) return;
        var level = shot.GameWorld.gameLevel;
        var timeConfig;
        var timeLong;
        if ("bottom" == type || "top" == type) {
          "bottom" == type ? timeConfig = shot.GameWorld.rotationTimeConfig.bottomBucket : "top" == type && (timeConfig = shot.GameWorld.rotationTimeConfig.topBucket);
          timeLong = timeConfig.initialTime;
          var subTimeList = timeConfig.decreaseTimeList;
          for (var k = 11; k < level; k++) if (k % 5 == 0) for (var i = 0; i < subTimeList.length; i++) {
            var subTimeConfig = subTimeList[i];
            if (subTimeConfig.minLevel <= k && subTimeConfig.maxLevel >= k) {
              timeLong -= subTimeConfig.decreaseTime;
              break;
            }
          }
        } else {
          timeConfig = shot.GameWorld.rotationTimeConfig.onlyBucket;
          var levelL = parseInt(level / 5);
          timeLong = 0 == levelL ? timeConfig.oneToFour : 1 == levelL ? timeConfig.fiveToNine : timeConfig.ten;
        }
        this.roundSpeed = 360 / timeLong;
      },
      removeAllBottles: function removeAllBottles() {
        for (var i = 0; i < this.bottlePrefabList.length; i++) {
          var bottle = this.bottlePrefabList[i];
          bottle.active = false;
        }
      },
      cleanRotationToBattleArray: function cleanRotationToBattleArray() {
        for (var i = 0; i < 360; i++) this.rotationForBattleArray[i] = [];
      },
      setBottlesWithListNew: function setBottlesWithListNew(bottleList) {
        this.cleanRotationToBattleArray();
        this.bottleList = bottleList;
        var sectionR;
        var j;
        for (var i = 0; i < this.bottleList.length; i++) {
          var bottle = this.bottlePrefabList[i];
          if ("none" != this.bottleList[i]) {
            bottle.active = true;
            var bottleWindow = bottle.getComponent("shot_bottle");
            bottleWindow.setBottleType(this.bottleList[i], this, this.radius, i);
            bottle.rotation = 30 * i;
            var rotation = 30 * i;
            sectionR = shot.GameWorld.bottleConfig[this.bottleList[i]].sectionR;
            for (j = rotation - sectionR; j < rotation + sectionR; j++) {
              var setIndex = j >= 0 ? j : j + 360;
              setIndex >= 360 && (setIndex -= 360);
              this.rotationForBattleArray[setIndex].push(bottle);
            }
          } else bottle.active = false;
        }
      },
      receiveBulletNew: function receiveBulletNew(runningFire) {
        if ("none" == this.bgType) return;
        this.roundRotationKey = 540 - this.roundRotation >> 0;
        this.playShotBucketAnimation();
        var bottle;
        var bottleW;
        if (runningFire) {
          this.parentScene.openFireGunAction();
          shot.GameWorld.gunFireInterval && this.parentScene.openFireBulletAction();
        } else this.haveHitBottle = false;
        var nowRotationBottleList = this.rotationForBattleArray[this.roundRotationKey];
        if (0 != nowRotationBottleList.length) for (var i = 0; i < nowRotationBottleList.length; i++) {
          bottle = nowRotationBottleList[i];
          if (bottle.active) {
            bottleW = bottle.getComponent("shot_bottle");
            var bottleCanHit = bottleW.bottleHit();
            this.haveHitBottle = bottleCanHit || this.haveHitBottle;
          }
        }
        if (shot.GameWorld.bulletRange) {
          this.bottleAniNodeLeft.rotation = 180 - shot.GameWorld.bulletRange;
          this.bottleAniNodeRight.rotation = 180 + shot.GameWorld.bulletRange;
          var tempBottles = [];
          bottle && tempBottles.push(this.bottlePrefabList.indexOf(bottle));
          var rotation;
          for (var j = 0; j < 2; j++) {
            rotation = 0 == j ? 540 - this.roundRotation - shot.GameWorld.bulletRange : 540 - this.roundRotation + shot.GameWorld.bulletRange;
            rotation < 0 ? rotation += 360 : rotation > 360 && (rotation -= 360);
            this.roundRotationKey = rotation >> 0;
            nowRotationBottleList = this.rotationForBattleArray[this.roundRotationKey];
            if (0 != nowRotationBottleList.length) for (i = 0; i < nowRotationBottleList.length; i++) {
              bottle = nowRotationBottleList[i];
              if (bottle.active && -1 == tempBottles.indexOf(this.bottlePrefabList.indexOf(bottle))) {
                bottleW = bottle.getComponent("shot_bottle");
                bottleCanHit = 0 == j ? bottleW.bottleHit("left") : bottleW.bottleHit("right");
                tempBottles.push(this.bottlePrefabList.indexOf(bottle));
                this.haveHitBottle = bottleCanHit || this.haveHitBottle;
              }
            }
          }
        }
        this.endReceiveBulletPlayDeadAnimation();
        if ("only" == this.bgType || "bottom" == this.bgType) {
          if (shot.GameWorld.bulletRunningTimeBottom) {
            shot.GameWorld.bulletRunningTimeBottom--;
            if (shot.GameWorld.bulletRunningTimeBottom) {
              this.receiveBulletIntervalCount = shot.GameWorld.bulletRunningInterval;
              return;
            }
          }
        } else if ("top" == this.bgType && shot.GameWorld.bulletRunningTimeTop) {
          shot.GameWorld.bulletRunningTimeTop--;
          if (shot.GameWorld.bulletRunningTimeTop) {
            this.receiveBulletIntervalCount = shot.GameWorld.bulletRunningInterval;
            return;
          }
        }
        if (shot.GameWorld.gunFireInterval) return;
        this.stopRunningCount();
      },
      receiveGrenade: function receiveGrenade() {
        for (var i = 0; i < this.bottlePrefabList.length; i++) {
          var bottle = this.bottlePrefabList[i];
          if (bottle.active) {
            var bottleW = bottle.getComponent("shot_bottle");
            bottleW.bottleHit();
          }
        }
      },
      stopRunningCount: function stopRunningCount() {
        this.haveHitBottle || this.parentScene.emptyGunAction();
      },
      endReceiveBulletPlayDeadAnimation: function endReceiveBulletPlayDeadAnimation() {
        "only" == this.bgType && this.playDeadAnimation();
        "top" == this.bgType && (this.haveHitBottle ? this.playDeadAnimation() : this.parentScene.playBottomDeadAnimation());
      },
      stopShotAni: function stopShotAni() {
        if (this.isOnShotAction) {
          var ani = this.node.getComponent(cc.Animation);
          var anim = ani.getAnimationState("shot_bucket_new");
          anim.stop();
        }
      },
      playShotBucketAnimation: function playShotBucketAnimation() {
        var that = this;
        this.stopShotAni();
        this.isOnShotAction = true;
        var ani = this.node.getComponent(cc.Animation);
        var anim = ani.getAnimationState("shot_bucket_new");
        anim.once("finished", function() {
          that.isOnShotAction = false;
        });
        anim.play();
      },
      playDeadAnimation: function playDeadAnimation(range) {
        if ("none" == this.bgType) return;
        var that = this;
        var nowRotation;
        if (range) nowRotation = range; else {
          nowRotation = 540 - this.roundRotation;
          if (shot.GameWorld.bulletRange) {
            this.playDeadAnimation(nowRotation - shot.GameWorld.bulletRange);
            this.playDeadAnimation(nowRotation + shot.GameWorld.bulletRange);
          }
        }
        var aniNode;
        if (this.deadPool.size() > 0) aniNode = this.deadPool.get(); else {
          aniNode = cc.instantiate(this.deadPrefab);
          var deadW = aniNode.getComponent("dead");
          deadW.setPositionYForDead(this.radius);
        }
        aniNode.rotation = nowRotation;
        this.aniScale ? aniNode.scaleX = -1 : aniNode.scaleX = 1;
        this.aniScale = !this.aniScale;
        this.aniNodeForSection.addChild(aniNode);
        var ani2 = aniNode.getComponent(cc.Animation);
        var anim2 = ani2.getAnimationState("dead");
        anim2.once("finished", function() {
          that.deadPool.put(aniNode);
          aniNode.removeFromParent();
        });
        anim2.play();
      },
      receiveBottleLifeCount: function receiveBottleLifeCount(bottleInfo) {
        this.parentScene.bottleHit(bottleInfo);
        if (0 == bottleInfo.lifeCount) {
          if (bottleInfo.type.indexOf("treasureBox") > -1) {
            shot.GameWorld.gamePause = true;
            shot.GameWorld.gameGetBox = true;
            shot.GameWorld.gunFireIntervalNow = 0;
            shot.GlobalFuncs.showSecretBox(bottleInfo.type, this.parentScene);
          }
          shot.GameWorld.crazyMoment ? shot.GameWorld.crazyBottleCount[bottleInfo.type]++ : this.bottleList[bottleInfo.sitNumber] = "none";
          shot.GameWorld.bottleCount--;
          shot.GameWorld.bottleCount <= 0 && this.parentScene.levelUp();
        }
        if (shot.GameWorld.grenadeRunning) return;
        var aniIndex = shot.GameWorld.bottleNameList.indexOf(bottleInfo.type);
        var bottleAniPool = this["bottlePool" + aniIndex];
        var bottleAniNodeAdd;
        bottleAniNodeAdd = bottleAniPool.size() > 0 ? bottleAniPool.get() : cc.instantiate(this.prefabList[aniIndex]);
        var ani = bottleAniNodeAdd.getComponent(cc.Animation);
        var clipName = ani.getClips()[bottleInfo.lifeCount].name;
        var animation = ani.getAnimationState(clipName);
        bottleInfo.direction ? "left" == bottleInfo.direction ? this.bottleAniNodeLeft.addChild(bottleAniNodeAdd) : this.bottleAniNodeRight.addChild(bottleAniNodeAdd) : this.bottleAniNode.addChild(bottleAniNodeAdd);
        animation.once("finished", function() {
          bottleAniPool.put(bottleAniNodeAdd);
          bottleAniNodeAdd.removeFromParent();
        });
        animation.play();
      },
      setCrazyRotateTimeWithType: function setCrazyRotateTimeWithType(type, bucketConfig) {
        this.bgType = type;
        if ("none" == type) return;
        this.roundSpeed = 360 / bucketConfig.crazyRotationTime;
        var bottleConfig = bucketConfig.bottleConfig;
        this.cleanRotationToBattleArray();
        var sectionR, j;
        for (var key in bottleConfig) {
          var count = bottleConfig[key];
          var percenR = 360 / count;
          for (var i = 0; i < count; i++) {
            var bottle = cc.instantiate(this.bottlePrefab);
            bottle.rotation = percenR * i;
            var bottleWindow = bottle.getComponent("shot_bottle");
            bottleWindow.setBottleType(key, this, this.radius, i);
            var rotation = percenR * i;
            sectionR = shot.GameWorld.bottleConfig[key].sectionR;
            for (j = rotation - sectionR; j < rotation + sectionR; j++) {
              var setIndex = j >= 0 ? j : j + 360;
              setIndex >= 360 && (setIndex -= 360);
              this.rotationForBattleArray[setIndex].push(bottle);
            }
            this.bottleNode.addChild(bottle);
          }
          shot.GameWorld.bottleCount += count;
        }
      },
      removeAllCrazyBottles: function removeAllCrazyBottles() {
        if ("none" == this.bgType) return;
        var bottle;
        var j;
        for (var i = 0; i < 360; i++) {
          var nowRotationBottleList = this.rotationForBattleArray[i];
          if (0 != nowRotationBottleList.length) for (j = 0; j < nowRotationBottleList.length; j++) {
            bottle = nowRotationBottleList[j];
            if (bottle) {
              bottle.removeFromParent(true);
              bottle.destroy();
            }
          }
          this.rotationForBattleArray[i] = [];
        }
      },
      getRoundSpeed: function getRoundSpeed() {
        return this.roundSpeed;
      },
      update: function update(dt) {
        if (this.receiveBulletIntervalCount) {
          this.receiveBulletIntervalCount--;
          0 == this.receiveBulletIntervalCount && this.receiveBulletNew(true);
        }
        if (shot.GameWorld.gameOver || shot.GameWorld.gamePause || "none" == this.bgType) return;
        this.roundRotation += dt * this.roundSpeed;
        this.roundRotation > 540 && (this.roundRotation -= 360);
        this.rotationNode.rotation = this.roundRotation;
      },
      onDestroy: function onDestroy() {
        this.bottlePool0.clear();
        this.bottlePool1.clear();
        this.bottlePool2.clear();
        this.bottlePool3.clear();
        this.bottlePool4.clear();
        this.bottlePool5.clear();
        this.bottlePool6.clear();
        this.bottlePool7.clear();
        this.bottlePool8.clear();
        this.bottlePool9.clear();
        this.deadPool.clear();
        this.rotationForBattleArray = [];
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_crazyTime: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a300ela5c1PAaWXqyLFNx7g", "shot_crazyTime");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        titleNode: {
          default: null,
          type: cc.Node
        },
        titleSprite: {
          default: null,
          type: cc.Sprite
        },
        desNode: {
          default: null,
          type: cc.Node
        },
        countDownNode: {
          default: null,
          type: cc.Node
        },
        countDownSprite: {
          default: null,
          type: cc.Sprite
        },
        countDownSpriteFrameList: [ cc.SpriteFrame ],
        resultNode: {
          default: null,
          type: cc.Node
        },
        hitLabel: {
          default: null,
          type: cc.Label
        },
        lastLabel: {
          default: null,
          type: cc.Label
        },
        scoreLabel: {
          default: null,
          type: cc.Label
        },
        addScoreLabel: {
          default: null,
          type: cc.Label
        },
        isStartCrazyTimeAction: false,
        countDown: 0,
        addScoreCountDown: 0,
        overCountDown: 0,
        afterResultCount: 0,
        titleNodeOpacity: 0,
        isAction: false,
        timeEnd: 0,
        parentScene: {
          default: null,
          serializable: false
        }
      },
      onLoad: function onLoad() {
        var ani = this.titleNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function() {
          that.changeToDes();
        });
        animation.play();
        shot.GameWorld.crazyBottleCount.green = 0;
        shot.GameWorld.crazyBottleCount.purple = 0;
        shot.GameWorld.crazyBottleCount.orange = 0;
        shot.GameWorld.crazyBottleCount.red = 0;
        shot.GameWorld.crazyBottleHitCount = 0;
        shot.GameWorld.crazyBottleScore = 0;
      },
      changeToDes: function changeToDes() {
        shot.AudioHelper.stopMusic();
        var isNew = hall.GlobalFuncs.ReadBoolFromLocalStorage(shot.gameModel.IS_NEW_CRAZY, true);
        this.titleNode.active = false;
        isNew ? this.desNode.active = true : this.startCrazyTimeFirst();
      },
      startCrazyTimeFirst: function startCrazyTimeFirst() {
        if (!this.isStartCrazyTimeAction) {
          this.isStartCrazyTimeAction = true;
          this.parentScene.setCrazyTimeBucket();
        }
      },
      startCrazyTime: function startCrazyTime() {
        hall.GlobalFuncs.setInLocalStorage(shot.gameModel.IS_NEW_CRAZY, false);
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicCrazy, false);
        this.countDown = 180;
        hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite, 1.5);
        this.desNode.active = false;
        this.countDownNode.active = true;
      },
      countDownOut: function countDownOut() {
        shot.GameWorld.gamePause = false;
        this.countDownNode.active = false;
        this.parentScene.startCrazyTime();
      },
      setCountDownEnd: function setCountDownEnd(time) {
        if (time <= 5 && 0 != time && this.timeEnd != time) {
          this.timeEnd = time;
          this.countDownNode.active = true;
          this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[time - 1];
          hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite, 1.5);
        }
      },
      crazyTimeOut: function crazyTimeOut() {
        shot.GameWorld.gamePause = true;
        this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[6];
        this.crazyTimeEnd();
      },
      crazyTimeGood: function crazyTimeGood() {
        shot.AudioHelper.playEffect(shot.EffectPath_mp3.crazyCheer, false);
        shot.GameWorld.gamePause = true;
        this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[5];
        this.crazyTimeEnd();
      },
      crazyTimeEnd: function crazyTimeEnd() {
        this.countDownNode.active = true;
        this.addScoreCountDown = 60;
        for (var key in shot.GameWorld.crazyBottleCount) {
          shot.GameWorld.crazyBottleHitCount += shot.GameWorld.crazyBottleCount[key];
          shot.GameWorld.crazyBottleScore += shot.GameWorld.crazyBottleCount[key] * shot.GameWorld.bottleConfig[key].crazyBottleScore;
        }
      },
      crazyTimeAddScoreFirst: function crazyTimeAddScoreFirst() {
        this.parentScene.removeCrazyWhenEnd();
      },
      crazyTimeAddScore: function crazyTimeAddScore() {
        this.resultNode.active = true;
        this.setResult();
      },
      setResult: function setResult() {
        this.hitLabel.string = shot.GameWorld.crazyBottleScore + "";
        this.lastLabel.string = (shot.GameWorld.crazyBottleHitCount / (shot.GameWorld.crazyBottleHitCount + shot.GameWorld.bottleCount) * 100 >> 0) + "%";
        0 == shot.GameWorld.bottleCount ? this.scoreLabel.string = shot.GameWorld.crazyBonus : this.scoreLabel.string = "0";
        this.addScoreLabel.string = "+" + shot.GameWorld.crazyBottleScore;
        var ani = this.resultNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function() {
          if (0 == shot.GameWorld.bottleCount) {
            that.addScoreLabel.node.active = true;
            that.countDownSprite.node.active = false;
            that.overCountDown = 90;
            return;
          }
          that.afterResultCount = 90;
        });
        animation.play();
      },
      starCrazyTimeOverCountDown: function starCrazyTimeOverCountDown() {
        if (this.isAction) return;
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicGame, true);
        this.countDownNode.active = false;
        this.resultNode.active = false;
        this.parentScene.crazyTimeEndEnter();
      },
      crazyTimeOver: function crazyTimeOver() {
        this.parentScene.addCrazyTimeScore();
        this.parentScene.levelUp();
        this.node.destroy();
      },
      update: function update(dt) {
        if (!shot.GameWorld.crazyMoment) return;
        if (this.countDown) {
          this.countDown--;
          if (120 == this.countDown) {
            this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[1];
            hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite, 1.5);
          } else if (60 == this.countDown) {
            this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[0];
            hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite, 1.5);
          } else 0 == this.countDown && this.countDownOut();
          return;
        }
        if (this.addScoreCountDown) {
          this.addScoreCountDown--;
          0 == this.addScoreCountDown && this.crazyTimeAddScoreFirst();
          return;
        }
        if (this.overCountDown) {
          this.overCountDown--;
          this.addScoreLabel.string = (shot.GameWorld.crazyBottleScore + (90 - this.overCountDown) * shot.GameWorld.crazyBonus / 90 >> 0) + "";
          if (0 == this.overCountDown) {
            shot.GameWorld.crazyBottleScore += shot.GameWorld.crazyBonus;
            this.addScoreLabel.string = shot.GameWorld.crazyBottleScore + "";
            this.afterResultCount = 90;
          }
        }
        if (this.afterResultCount) {
          this.afterResultCount--;
          if (0 == this.afterResultCount) {
            this.isAction = false;
            this.starCrazyTimeOverCountDown();
          }
        }
      },
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_diamond: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fdf3fcHWMVJBInktu/G9jDv", "shot_diamond");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        diamondContentNode: cc.Node,
        haveFriendNode: cc.Node,
        nameLabel: {
          default: null,
          type: cc.Label
        },
        countLabel: {
          default: null,
          type: cc.Label
        },
        descLabel: cc.Label,
        buttonTitleLabel: {
          default: null,
          type: cc.RichText
        },
        state: 0,
        inviteButton: cc.Button
      },
      onCloseButton: function onCloseButton() {
        this.inviteButton.node.stopAllActions();
        this.node.destroy();
      },
      onInviteAction: function onInviteAction() {
        if (0 == this.state) {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "diamondInvitation" ]);
          shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeDiamond);
        } else this.onCloseButton();
      },
      onBlack: function onBlack() {},
      onLoad: function onLoad() {
        hall.GlobalFuncs.btnScaleEffect(this.inviteButton.node, 1.13);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_DIAMOND_NUMBER, this.updateDiamond, this);
        this.updateDiamond();
        this.state = 0;
      },
      changeStateWithInfo: function changeStateWithInfo(state, result) {
        this.state = state;
        if (0 == state) {
          ty.NotificationCenter.listen(shot.EventType.UPDATE_ASSETS_COUNT, this.getAsstsCount, this);
          this.diamondContentNode.active = true;
          this.haveFriendNode.active = false;
          this.buttonTitleLabel.string = "<color=#ffffff><b>邀请群友</b></color>";
          this.descLabel.string = "已有";
        } else {
          this.diamondContentNode.active = false;
          this.haveFriendNode.active = true;
          result && null != result.counts && (this.countLabel.string = " x" + result.counts);
          this.descLabel.string = "获得";
          result && result.name && (this.nameLabel.string = hall.GlobalFuncs.sliceStringToLength(result.name, 10));
          this.buttonTitleLabel.string = "<color=#ffffff><b>确 定</b></color>";
        }
      },
      updateDiamond: function updateDiamond() {
        0 == this.state && (this.countLabel.string = "x" + hall.ME.udataInfo.diamondCount);
      },
      getAsstsCount: function getAsstsCount(result) {
        this.countLabel.string = " x" + shot.gameModel.assetsCounts;
        this.diamondContentNode.active = true;
        this.haveFriendNode.active = false;
        this.buttonTitleLabel.string = "<color=#ffffff><b>邀请群友</b></color>";
      },
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_freeTool: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "013f3/6vUdFroCHOCCtIC9q", "shot_freeTool");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onBlack: function onBlack() {},
      backAction: function backAction() {
        this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_gun: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b8ef1toopNAH50dcAtW1UBH", "shot_gun");
    "use strict";
    cc.Class({
      extends: cc.Component,
      ctor: function ctor() {
        this.bulletAniNodePool = null;
      },
      properties: {
        gunSprite: {
          default: null,
          type: cc.Sprite
        },
        gunSpriteList: [ cc.SpriteFrame ],
        gunAniNode: {
          default: null,
          type: cc.Node
        },
        gatlingAniNode: {
          default: null,
          type: cc.Node
        },
        gatlingQiangkouNode: {
          default: null,
          type: cc.Node
        },
        bulletAniNode: {
          default: null,
          type: cc.Node
        },
        bulletAniPrefab: {
          default: null,
          type: cc.Prefab
        },
        grenadeFromNode: {
          default: null,
          type: cc.Node
        },
        grenadeAniNode: {
          default: null,
          type: cc.Node
        },
        grenadeAnimationNode: {
          default: null,
          type: cc.Node
        },
        grenadeNode: {
          default: null,
          type: cc.Node
        },
        grenadePrefab: {
          default: null,
          type: cc.Prefab
        },
        isAction: false,
        animation: {
          default: null,
          type: cc.AnimationState
        },
        gatlingAnimation: {
          default: null,
          type: cc.AnimationState
        },
        parentScene: {
          default: null,
          serializable: false
        }
      },
      onLoad: function onLoad() {
        this.bulletAniNodePool = new cc.NodePool();
        for (var i = 0; i < 15; i++) this.bulletAniNodePool.put(cc.instantiate(this.bulletAniPrefab));
        this.animation = this.gunAniNode.getComponent(cc.Animation).getAnimationState("qiang");
        var that = this;
        this.animation.once("finished", function() {
          that.isAction = false;
        });
        this.gatlingAnimation = this.gatlingAniNode.getComponent(cc.Animation).getAnimationState("jiatelin");
        this.gatlingAnimation.once("finished", function() {
          that.isAction = false;
          that.gatlingQiangkouNode.active = false;
        });
        this.grenadeFromNode.y = -cc.director.getWinSize().height / 2;
        !shot.GameWorld.gunnerShareSchemeConfig || shot.GameWorld.gunnerShareSchemeConfig.showBanner ? this.grenadeAniNode.y = 188 : this.grenadeAniNode.y = 228;
        ty.NotificationCenter.listen(shot.EventType.REPLACE_GUN, this.replaceGunAction, this);
      },
      replaceGunAction: function replaceGunAction(index) {
        if (7 == index) {
          this.gatlingAniNode.active = true;
          this.gunAniNode.active = false;
        } else {
          this.gatlingAniNode.active = false;
          this.gunAniNode.active = true;
          this.gunSprite.spriteFrame = this.gunSpriteList[index];
        }
      },
      openFire: function openFire() {
        shot.GameWorld.nowBulletPenetrate = shot.GameWorld.bulletPenetrate;
        shot.GameWorld.grenadeRunning = false;
        shot.AudioHelper.playEffect(shot.EffectPath_mp3.gunHits, false);
        this.playGunAni();
      },
      stopGunAni: function stopGunAni() {
        if (this.isAction) if (this.gatlingAniNode.active) {
          this.gatlingAnimation.stop();
          this.gatlingQiangkouNode.active = false;
        } else this.animation.stop();
      },
      playGunAni: function playGunAni() {
        this.stopGunAni();
        this.isAction = true;
        if (this.gatlingAniNode.active) {
          this.gatlingAnimation.play();
          this.gatlingQiangkouNode.active = true;
        } else {
          this.animation.play();
          this.gatlingQiangkouNode.active = false;
        }
        var that = this;
        var bulletAni;
        bulletAni = this.bulletAniNodePool.size() > 0 ? this.bulletAniNodePool.get() : cc.instantiate(this.bulletAniPrefab);
        var bulletAnima = bulletAni.getComponent(cc.Animation);
        var animation = bulletAnima.getAnimationState("zidan");
        this.bulletAniNode.addChild(bulletAni);
        animation.once("finished", function(target) {
          that.bulletAniNodePool.put(bulletAni);
          bulletAni.removeFromParent();
        });
        animation.play();
      },
      onActionGrenade: function onActionGrenade(callFunc) {
        var to_pos = this.node.convertToNodeSpace(this.grenadeAniNode.convertToWorldSpace(cc.p(0, 0)));
        var from_pos = this.node.convertToNodeSpace(this.grenadeFromNode.convertToWorldSpace(cc.p(0, 0)));
        var that = this;
        var startFunc = function startFunc(_preFabNode) {
          _preFabNode.x = to_pos.x;
          _preFabNode.y = to_pos.y;
        };
        var gStartFunc = function gStartFunc(_preFabNode, _callFunc) {
          _preFabNode.x = from_pos.x;
          _preFabNode.y = from_pos.y;
          _preFabNode.active = true;
          var midy;
          var midx;
          if (Math.abs(to_pos.x - from_pos.x) < 100) {
            midx = to_pos.x + 200;
            midy = from_pos.y + (to_pos.y - from_pos.y) / 2;
          } else if (Math.abs(to_pos.y - from_pos.y) < 100) {
            midx = (to_pos.x - from_pos.x) / 2;
            midy = from_pos.y;
          } else {
            midx = -200;
            midy = from_pos.y + (to_pos.y - from_pos.y) / 2 + 100;
          }
          hall.LOGD("", "曲线运动中间点 midx = " + midx + "  midy = " + midy);
          var midPoint = cc.p(midx, midy);
          var controlPoints1 = [ from_pos, midPoint, to_pos ];
          var bezierToDst1 = cc.bezierTo(.7, controlPoints1);
          var rotationAct = cc.rotateBy(.7, 180);
          var rotationR = .18 * that.parentScene.getBucketRoundSpeedIn();
          var rotationAct2 = cc.rotateBy(.18, rotationR);
          var strikeSound = cc.callFunc(function() {
            shot.AudioHelper.playEffect(shot.EffectPath_mp3.grenadeStrike);
          });
          _preFabNode.rotation = hall.GlobalFuncs.getRandomNumberBefore(360);
          _preFabNode.runAction(cc.sequence(cc.spawn(rotationAct, bezierToDst1), cc.spawn(rotationAct2, strikeSound), cc.callFunc(function() {
            startFunc(_preFabNode);
            _preFabNode.active = false;
            shot.AudioHelper.playEffect(shot.EffectPath_mp3.grenadeBoom);
            that.grenadeAniNode.active = true;
            that.grenadeAniNode.rotation = _preFabNode.rotation;
            var ani2 = that.grenadeAnimationNode.getComponent(cc.Animation);
            var anim2 = ani2.getAnimationState("shouleibaozha_01");
            anim2.once("finished", function() {
              that.grenadeAniNode.active = false;
              shot.GameWorld.grenadeRunning = false;
            });
            anim2.play();
            _callFunc && _callFunc();
          }, that)));
        };
        gStartFunc(this.grenadeNode, callFunc);
      },
      onDestroy: function onDestroy() {
        this.bulletAniNodePool.clear();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3eb8eqH5FVOAr8m5UpMRL3V", "shot_main");
    "use strict";
    cc.Class({
      extends: cc.Component,
      ctor: function ctor() {
        this.crazyTimePanel = null;
        this.jugglingSchemaPanel = null;
        this.addScoreAniPool = null;
      },
      properties: {
        windowWidth: 0,
        bgSprite: {
          default: null,
          type: cc.Sprite
        },
        bottomBucket: {
          default: null,
          type: cc.Node
        },
        topBucket: {
          default: null,
          type: cc.Node
        },
        gunNode: {
          default: null,
          type: cc.Node
        },
        bottomBucketWin: {
          default: null,
          serializable: false
        },
        topBucketWin: {
          default: null,
          serializable: false
        },
        gunNodeWin: {
          default: null,
          serializable: false
        },
        openFireButton: {
          default: null,
          type: cc.Button
        },
        emptyGunCount: 0,
        laserSprite: {
          default: null,
          type: cc.Sprite
        },
        gameInfoNode: {
          default: null,
          type: cc.Node
        },
        toolNode: {
          default: null,
          type: cc.Node
        },
        levelLabel: {
          default: null,
          type: cc.Label
        },
        nowScoreLabel: {
          default: null,
          type: cc.Label
        },
        bestScoreLabel: {
          default: null,
          type: cc.Label
        },
        bulletCountNode: {
          default: null,
          type: cc.Node
        },
        bulletCountLabel: {
          default: null,
          type: cc.Label
        },
        infiniteBulletSprite: {
          default: null,
          type: cc.Sprite
        },
        infiniteBulletButton: {
          default: null,
          type: cc.Button
        },
        infiniteBulletCountLabel: {
          default: null,
          type: cc.Label
        },
        laserButton: {
          default: null,
          type: cc.Button
        },
        laserCountLabel: {
          default: null,
          type: cc.Label
        },
        infiniteBulletTimeNode: {
          default: null,
          type: cc.Node
        },
        infiniteBulletTimeSprite: {
          default: null,
          type: cc.Sprite
        },
        countDownLabel: {
          default: null,
          type: cc.Label
        },
        surpassNode: {
          default: null,
          type: cc.Node
        },
        surpassTexture: cc.Texture2D,
        surpassSpriteFrame: cc.SpriteFrame,
        surpassSprite: cc.Sprite,
        surpassCount: 0,
        addBulletButton: {
          default: null,
          type: cc.Button
        },
        addBulletButtonLabel: {
          default: null,
          type: cc.Label
        },
        addBulletButtonNumberLabel: {
          default: null,
          type: cc.Label
        },
        addBulletSprite: {
          default: null,
          type: cc.Sprite
        },
        addBulletSpriteList: [ cc.SpriteFrame ],
        levelAniNode: {
          default: null,
          type: cc.Node
        },
        levelChangeLabel: {
          default: null,
          type: cc.Label
        },
        doubleHitAniNode: {
          default: null,
          type: cc.Node
        },
        doubleHit1: {
          default: null,
          type: cc.Label
        },
        doubleHitLayout: {
          default: null,
          type: cc.Layout
        },
        doubleHit: {
          default: null,
          type: cc.Label
        },
        infoAniNode: {
          default: null,
          type: cc.Node
        },
        addScoreAniPrefab: {
          default: null,
          type: cc.Prefab
        },
        bulletAniNode: {
          default: null,
          type: cc.Node
        },
        addBulletLabel: {
          default: null,
          type: cc.Label
        },
        addBulletType: "",
        addBannerCount: 0,
        infiniteFullTime: 0,
        infiniteTime: 0,
        doubleHitContinueNode: {
          default: null,
          type: cc.Node
        },
        doubleHitContinueLabel: {
          default: null,
          type: cc.Label
        },
        doubleHitContinueCount: 0,
        crazyTimeStartCount: 0,
        crazyTimeInCount: 0,
        crazyTimeOutCount: 0,
        crazyTimeEndCount: 0,
        rightDistance: 0,
        crazyTimeFullTime: 0,
        crazyTimeCountDown: 0,
        debugCount: 0,
        doubleHitAniAction0: false,
        doubleHitAniAction1: false,
        isOnTouch: false,
        gameOverCount: 0
      },
      onLoad: function onLoad() {
        this.setSurpassNodeInit();
        var winSize = cc.director.getWinSize();
        this.windowWidth = winSize.width;
        var bucketWindow = this.bottomBucket.getComponent("shot_bucket");
        bucketWindow.parentScene = this;
        this.bottomBucketWin = bucketWindow;
        var bucketWindow2 = this.topBucket.getComponent("shot_bucket");
        bucketWindow2.parentScene = this;
        this.topBucketWin = bucketWindow2;
        this.gunNodeWin = this.gunNode.getComponent("shot_gun");
        this.gunNodeWin.parentScene = this;
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_START, this.openFireButtonTouchStart, this, true);
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_CANCEL, this.openFireButtonTouchCancel, this, true);
        this.openFireButton.node.on(cc.Node.EventType.TOUCH_END, this.openFireButtonTouchEnded, this, true);
        ty.NotificationCenter.listen(shot.EventType.GAME_START, this.gameStart, this);
        ty.NotificationCenter.listen(shot.EventType.GAME_LEVEL_UP, this.levelUp, this);
        shot.GlobalFuncs.setBulletType("bulletType0");
        var toDay = hall.GlobalTimer.getCurDay();
        if (toDay != hall.GlobalFuncs.ReadStringFromLocalStorage(shot.gameModel.LAST_VIDEO_DAY, "")) {
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.LAST_VIDEO_DAY, toDay);
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.DAY_VIDEO_TIME, 0);
        }
        if (toDay != hall.GlobalFuncs.ReadStringFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_DAY, "")) {
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_DAY, toDay);
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME, 0);
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE, 0);
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME_CHECK, 0);
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE_CHECK, 0);
        }
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE, this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR, this.rewardVideoCompleteError, this);
        this.updateInfiniteByllet();
        this.updateGrenadeAiming();
        ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER, this.updateInfiniteByllet, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_GRENADE_NUMBER, this.updateGrenadeAiming, this);
        ty.NotificationCenter.listen(shot.EventType.RESURGENCE_RESULT, this.useToolResult, this);
        ty.NotificationCenter.listen(shot.EventType.STOP_DOUBLEHIT_COUNTDOWN, this.stopDoubleHitCountDown, this);
        ty.NotificationCenter.listen(shot.EventType.REPLAY_BG_MUSIC, this.rePlayBgMusic, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        this.bestScoreLabel.string = "最佳:" + shot.Share.shareKeywordReplace.bestScoreForSelf;
        var isNew = hall.GlobalFuncs.ReadBoolFromLocalStorage(shot.gameModel.IS_NEW_USER, true);
        isNew ? shot.GlobalFuncs.showNewTipsPanel() : this.gameStart("start", true);
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicGame, true);
        this.addScoreAniPool = new cc.NodePool();
        for (var k = 0; k < 8; k++) {
          var addAniNode = cc.instantiate(this.addScoreAniPrefab);
          this.addScoreAniPool.put(addAniNode);
        }
        if (!shot.GameWorld.gunnerShareSchemeConfig || shot.GameWorld.gunnerShareSchemeConfig.showBanner) {
          this.gameInfoNode.y = 60;
          this.toolNode.y = 60;
          this.gunNode.y = 110;
          this.addBannerCount = 120;
        }
        if (hall.adManager.getAdNodeList().length >= 1) for (var i = 0; i < hall.adManager.getAdNodeList().length; i++) hall.adManager.getAdNodeList()[i].hideAdNode();
      },
      setSurpassNodeInit: function setSurpassNodeInit() {
        var openDataContext = shot.GlobalFuncs.getOpenData();
        if (!openDataContext) return;
        this.sharedCanvas = openDataContext.canvas;
        this.sharedCanvas.width = 300;
        this.sharedCanvas.height = 60;
        this.surpassTexture || (this.surpassTexture = new cc.Texture2D());
        this.surpassSpriteFrame || (this.surpassSpriteFrame = new cc.SpriteFrame(this.surpassTexture));
        this.surpassSprite.spriteFrame = this.surpassSpriteFrame;
      },
      setSurpassNode: function setSurpassNode() {
        this.surpassTexture.initWithElement(this.sharedCanvas);
        this.surpassTexture.handleLoadedTexture();
        this.surpassSprite.spriteFrame._refreshTexture(this.surpassTexture);
      },
      changeTheBestScore: function changeTheBestScore() {
        if (shot.Share.shareKeywordReplace.bestScoreForSelf < shot.GameWorld.totalScore) {
          shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore;
          shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
          shot.gameModel.saveLevelScore();
        }
        this.bestScoreLabel.string = "最佳:" + shot.Share.shareKeywordReplace.bestScoreForSelf;
      },
      updateInfiniteByllet: function updateInfiniteByllet() {
        this.infiniteBulletCountLabel.string = "无限子弹 x" + hall.ME.udataInfo.infiniteBulletCount;
      },
      updateGrenadeAiming: function updateGrenadeAiming() {
        this.laserCountLabel.string = "手榴弹 x" + hall.ME.udataInfo.grenadeCount;
      },
      onBullet: function onBullet() {
        if (debugMode && shot.GameWorld.canUserLaser) {
          shot.GameWorld.bulletCount += 50;
          return;
        }
        if (shot.GameWorld.gameLevel <= 2) {
          hall.MsgBoxManager.showToast({
            title: "当前关卡已使用无限子弹道具"
          });
          return;
        }
        if (shot.GameWorld.bulletInfinite) {
          hall.MsgBoxManager.showToast({
            title: "当前关卡已使用无限子弹道具"
          });
          return;
        }
        if (shot.GameWorld.infiniteBulletTime >= shot.GameWorld.toolUserTimeConfig.infiniteBulletTime) {
          hall.MsgBoxManager.showToast({
            title: "一关只能使用" + shot.GameWorld.toolUserTimeConfig.infiniteBulletTime + "次哦~"
          });
          return;
        }
        if (!hall.ME.udataInfo.infiniteBulletCount) {
          shot.gameModel.getUniqueBoxId("item:1371", "wxzd");
          return;
        }
        shot.gameModel.consumeAssets(1, "item:1371");
      },
      onGrenade: function onGrenade() {
        if (shot.GameWorld.grenadeRunning) {
          hall.MsgBoxManager.showToast({
            title: "正在使用手榴弹"
          });
          return;
        }
        if (shot.GameWorld.grenadeTime >= shot.GameWorld.toolUserTimeConfig.grenadeTime) {
          hall.MsgBoxManager.showToast({
            title: "已经超过使用次数"
          });
          return;
        }
        if (!hall.ME.udataInfo.grenadeCount) {
          shot.gameModel.getUniqueBoxId("item:1390", "sld");
          return;
        }
        shot.gameModel.consumeAssets(1, "item:1390");
      },
      onDoubleHitContinue: function onDoubleHitContinue() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "ComboContinue" ]);
        shot.GlobalFuncs.showPropBox(null, true);
        shot.GameWorld.doubleHitCountDownTime = false;
      },
      stopDoubleHitCountDown: function stopDoubleHitCountDown() {
        this.doubleHitContinueNode.active = false;
        this.doubleHitContinueCount = 0;
        shot.GameWorld.doubleHitCountDownTime = false;
      },
      useToolResult: function useToolResult(result) {
        if (1 == result.success) if ("item:1371" == result.itemId) {
          shot.GameWorld.bulletInfinite = true;
          this.bulletCountLabel.string = "";
          this.infiniteBulletSprite.node.active = true;
          this.infiniteBulletCountLabel.string = "无限子弹 x" + hall.ME.udataInfo.infiniteBulletCount;
          this.infiniteTime = 60 * shot.GameWorld.propertyConfig.infiniteBullet.time;
          this.infiniteFullTime = 60 * shot.GameWorld.propertyConfig.infiniteBullet.time;
          this.infiniteBulletTimeNode.active = true;
          this.countDownLabel.string = shot.GameWorld.propertyConfig.infiniteBullet.time;
          shot.GameWorld.infiniteBulletTime++;
        } else if ("item:1390" == result.itemId) {
          this.laserCountLabel.string = "手榴弹 x" + hall.ME.udataInfo.grenadeCount;
          shot.GameWorld.grenadeRunning = true;
          shot.GameWorld.grenadeTime++;
          shot.AudioHelper.playEffect(shot.EffectPath_mp3.grenadeBegin);
          this.gunNodeWin.onActionGrenade(this.afterGrenadeAction.bind(this));
        } else {
          this.laserSprite.node.active = true;
          this.laserCountLabel.string = "瞄准器 x" + hall.ME.udataInfo.laserAimingCount;
          shot.GameWorld.laserTime++;
        } else hall.MsgBoxManager.showToast({
          title: "使用道具失败"
        });
      },
      afterGrenadeAction: function afterGrenadeAction() {
        shot.GameWorld.nowBulletPenetrate = 24;
        this.bottomBucketWin.receiveGrenade();
        2 == shot.GameWorld.bucketCount && this.topBucketWin.receiveGrenade();
        this._shakeScreen();
      },
      _shakeScreen: function _shakeScreen() {
        var initPos = this.topBucket.getPosition();
        var initPos2 = this.bgSprite.node.getPosition();
        var length = hall.GlobalFuncs.getRandomNumberBefore(5) + 4;
        length *= 2;
        var actions = [];
        var actions2 = [];
        var maxInShake = 18;
        var minInShake = 7;
        for (var i = 0; i < length; i += 2) {
          var moveInX = hall.GlobalFuncs.getRandomNumberBefore(maxInShake - minInShake + 1) + minInShake;
          hall.GlobalFuncs.getRandomNumberBefore(4) + 1 <= 2 && (moveInX *= -1);
          var moveInY = hall.GlobalFuncs.getRandomNumberBefore(maxInShake - minInShake + 1) + minInShake;
          hall.GlobalFuncs.getRandomNumberBefore(4) + 1 <= 2 && (moveInY *= -1);
          actions[i] = cc.moveTo(.07, cc.p(initPos.x + moveInX, initPos.y + moveInY));
          actions[i + 1] = cc.moveTo(.07, initPos);
          actions2[i] = cc.moveTo(.07, cc.p(initPos2.x + moveInX, initPos2.y + moveInY));
          actions2[i + 1] = cc.moveTo(.07, initPos2);
        }
        var dstAction = cc.sequence(actions);
        var dstAction2 = cc.sequence(actions2);
        this.topBucket.runAction(dstAction);
        this.bottomBucket.runAction(dstAction);
        this.bgSprite.node.runAction(dstAction2);
      },
      getBucketRoundSpeedIn: function getBucketRoundSpeedIn() {
        if (2 == shot.GameWorld.bucketCount) return this.topBucketWin.getRoundSpeed();
        return this.bottomBucketWin.getRoundSpeed();
      },
      setAddBulletButton: function setAddBulletButton() {
        if (shot.gameModel.getAllCheckConfig()) {
          this.addBulletButton.node.active = false;
          return;
        }
        this.addBulletButtonNumberLabel.string = "子弹+" + shot.GameWorld.toolUserTimeConfig.addBullet.addCount;
        if (hall.adManager.canPlay) {
          if (shot.GameWorld.addBulletTime >= shot.GameWorld.toolUserTimeConfig.addBullet.time) {
            this.addBulletButton.node.active = false;
            return;
          }
          var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.DAY_VIDEO_TIME, 0);
          if (dayCount >= 9) {
            if (ty.UserInfo.isInBSGS) {
              this.addBulletButton.node.active = false;
              return;
            }
            this.addBulletType = "share";
            this.addBulletButton.node.active = true;
            this.addBulletButtonLabel.string = "分享到群";
          } else {
            this.addBulletType = "ad";
            this.addBulletButton.node.active = true;
            this.addBulletButtonLabel.string = "看视频";
          }
        } else {
          if (ty.UserInfo.isInBSGS) {
            this.addBulletButton.node.active = false;
            return;
          }
          this.addBulletType = "share";
          this.addBulletButton.node.active = true;
          this.addBulletButtonLabel.string = "分享到群";
        }
        "share" == this.addBulletType ? this.addBulletSprite.spriteFrame = this.addBulletSpriteList[0] : this.addBulletSprite.spriteFrame = this.addBulletSpriteList[1];
      },
      onAddBullet: function onAddBullet() {
        if (1 == shot.GameWorld.gameLevel || 2 == shot.GameWorld.gameLevel) return;
        if (shot.GameWorld.addBulletTime >= shot.GameWorld.toolUserTimeConfig.addBullet.time) return;
        if ("share" == this.addBulletType) {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "shareAddBullet" ]);
          shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeAddBullet);
        } else if ("ad" == this.addBulletType) {
          var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.DAY_VIDEO_TIME, 0);
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.DAY_VIDEO_TIME, dayCount + 1);
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "adAddBullet" ]);
          hall.adManager.showRewardedVideo("addBullet");
        }
      },
      rewardVideoComplete: function rewardVideoComplete(isEnd) {
        if ("addBullet" != hall.adManager.rewardedVideoType) return;
        if (isEnd) {
          shot.GameWorld.addBulletTime++;
          shot.GameWorld.bulletCount += shot.GameWorld.toolUserTimeConfig.addBullet.addCount;
          this.bulletCountLabel.string = "" + shot.GameWorld.bulletCount;
          shot.GameWorld.addBulletTime == shot.GameWorld.toolUserTimeConfig.addBullet.time && (this.addBulletButton.node.active = false);
        } else hall.MsgBoxManager.showToast({
          title: "视频播放未完成"
        });
        this.showBanner();
        this.setAddBulletButton();
      },
      rewardVideoCompleteError: function rewardVideoCompleteError(errorMsg) {
        if ("addBullet" != hall.adManager.rewardedVideoType) return;
        hall.MsgBoxManager.showToast({
          title: errorMsg
        });
        this.showBanner();
        this.setAddBulletButton();
      },
      playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeAddBullet) {
          this.showBanner();
          this.setAddBulletButton();
          shot.GameWorld.addBulletTime++;
          shot.GameWorld.bulletCount += shot.GameWorld.toolUserTimeConfig.addBullet.addCount;
          this.bulletCountLabel.string = "" + shot.GameWorld.bulletCount;
          shot.GameWorld.addBulletTime == shot.GameWorld.toolUserTimeConfig.addBullet.time && (this.addBulletButton.node.active = false);
        }
      },
      gameStart: function gameStart(type, isFirst) {
        this.bestScoreLabel.string = "最佳:" + shot.Share.shareKeywordReplace.bestScoreForSelf;
        this.debugCount = 0;
        shot.GameWorld.gameOver = false;
        this.isOnTouch = false;
        shot.GlobalFuncs.showOrigin();
        this.setSurpassNodeInit();
        if ("start" == type) {
          this.bottomBucketWin.removeAllBottles();
          this.topBucketWin.removeAllBottles();
          shot.GameWorld.gameLevel = 1;
          shot.GameWorld.lastTreasureLevel = 0;
          shot.GameWorld.bottleCount = 0;
          shot.GameWorld.bucketCount = 0;
          shot.GameWorld.doubleHitCount = 0;
          shot.GameWorld.totalScore = 0;
          shot.GameWorld.resurgenceTime = 0;
          shot.GameWorld.infiniteBulletTime = 0;
          shot.GameWorld.doubleHitContinueTime = 0;
          this.addBulletButton.node.active = false;
          shot.GameWorld.bulletInfinite = true;
          if (debugMode) {
            shot.GameWorld.gameLevel = shot.GameWorld.initGameLevel;
            shot.GameWorld.initGameLevel > 1 && (shot.GameWorld.bulletCount += 50);
          }
          this.bulletCountLabel.string = "";
          this.infiniteBulletSprite.node.active = true;
          this.gameStartWithLevel();
          isFirst || this.showBanner();
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME, 0);
        } else {
          shot.GameWorld.bulletCount += 12;
          shot.GameWorld.resurgenceTime++;
          this.bulletCountLabel.string = "" + shot.GameWorld.bulletCount;
          this.infiniteBulletSprite.node.active = false;
          this.showBanner();
        }
        this.nowScoreLabel.string = shot.GameWorld.totalScore;
      },
      gameStartWithLevel: function gameStartWithLevel() {
        shot.GameWorld.infiniteBulletTime = 0;
        shot.GameWorld.grenadeTime = 0;
        var level = shot.GameWorld.gameLevel;
        (1 == level || 2 == level || this.infiniteTime) && (shot.GameWorld.bulletInfinite = true);
        this.laserSprite.node.active = level <= 5;
        var that = this;
        var bulletConfig = shot.GameWorld.bulletAddConfig;
        for (var i = 0; i < bulletConfig.length; i++) if (bulletConfig[i].minLevel <= level && bulletConfig[i].maxLevel >= level) {
          shot.GameWorld.bulletCount += bulletConfig[i].bulletAddCount;
          this.bulletAniNode.active = true;
          this.addBulletLabel.string = "+" + bulletConfig[i].bulletAddCount;
          break;
        }
        this.levelChangeLabel.node.x = 320;
        this.levelChangeLabel.node.active = true;
        this.levelChangeLabel.string = level % 5 == 0 ? "BOSS关" : "第" + level + "关";
        var levelAni = this.levelAniNode.getComponent(cc.Animation);
        var levelAniClipName = levelAni.getClips()[0].name;
        var levelAnimation = levelAni.getAnimationState(levelAniClipName);
        levelAnimation.once("finished", function() {
          that.levelLabel.string = "第" + level + "关";
          that.levelChangeLabel.node.active = false;
          that.changeBucketWithLevel(level);
          if (shot.GameWorld.bulletInfinite) {
            that.bulletCountLabel.string = "";
            that.infiniteBulletSprite.node.active = true;
          } else {
            that.bulletCountLabel.string = "" + shot.GameWorld.bulletCount;
            that.infiniteBulletSprite.node.active = false;
          }
          that.bulletAniNode.active = false;
          shot.GameWorld.bulletRunningTimeBottom = 0;
          shot.GameWorld.bulletRunningTimeTop = 0;
          if ("bulletType0" != shot.GameWorld.bulletType) if (shot.GameWorld.doubleGunUseTime < shot.GameWorld.doubleGunUseTimeCan) shot.GameWorld.doubleGunUseTime++; else {
            hall.MsgBoxManager.showToast({
              title: "武器已失效"
            });
            shot.GlobalFuncs.setBulletType("bulletType0");
          }
        });
        levelAnimation.play();
      },
      changeBucketWithLevel: function changeBucketWithLevel(level) {
        shot.GameWorld.gamePause = false;
        this.isOnTouch = false;
        shot.GameWorld.gunFireIntervalNow = 0;
        var levelScore = 0;
        if (1 == level || 2 == level) levelScore = shot.GameWorld.scoreLevelConfig.specificLevel12; else {
          var gapScore = shot.GameWorld.scoreLevelConfig.decreaseScore * parseInt((level - 1) / 5);
          var addScore = shot.GameWorld.scoreLevelConfig.initialScore + gapScore;
          levelScore = addScore > shot.GameWorld.scoreLevelConfig.limitScore ? shot.GameWorld.scoreLevelConfig.limitScore : addScore;
        }
        var bottleLifeCount = shot.GameWorld.bottleConfig;
        var bottleList = [];
        var chooseBottleList = [ "green", "purple" ];
        if (level % 5 == 0) {
          bottleList.push("red");
          chooseBottleList.push("orange");
          levelScore -= bottleLifeCount["red"].lifeCount;
        }
        var i;
        var canHaveTreasure = true;
        if (shot.GameWorld.treasureConfig && shot.GameWorld.treasureConfig.onlyConfig.length) {
          var onlyConfig;
          for (i = 0; i < shot.GameWorld.treasureConfig.onlyConfig.length; i++) {
            onlyConfig = shot.GameWorld.treasureConfig.onlyConfig[i];
            if (onlyConfig.minLevel > shot.GameWorld.lastTreasureLevel) break;
            if (shot.GameWorld.lastTreasureLevel <= onlyConfig.maxLevel) {
              level <= onlyConfig.maxLevel && (canHaveTreasure = false);
              break;
            }
          }
        }
        if (canHaveTreasure && shot.GameWorld.treasureConfig && shot.GameWorld.treasureConfig.probabilityConfig.length) {
          var levelConfig;
          var boxConfig;
          for (i = 0; i < shot.GameWorld.treasureConfig.probabilityConfig.length; i++) {
            levelConfig = shot.GameWorld.treasureConfig.probabilityConfig[i];
            if (levelConfig.minLevel <= level && levelConfig.maxLevel >= level) {
              boxConfig = levelConfig.boxList;
              for (var j = 0; j < boxConfig.length; j++) {
                var boxBottle = boxConfig[j];
                if (Math.random() < boxBottle.probability && shot.GameWorld.bottleNameList.indexOf(boxBottle.treasureBoxType) > -1) {
                  shot.GameWorld.lastTreasureLevel = level;
                  bottleList.push(boxBottle.treasureBoxType);
                  levelScore -= bottleLifeCount[boxBottle.treasureBoxType].lifeCount;
                  break;
                }
              }
              break;
            }
          }
        }
        1 == level ? chooseBottleList = [ "green" ] : 2 == level && (chooseBottleList = [ "purple" ]);
        while (levelScore > 0) {
          var type = chooseBottleList[hall.GlobalFuncs.getRandomNumberBefore(chooseBottleList.length)];
          var decScore = bottleLifeCount[type].lifeCount;
          if (levelScore >= decScore) {
            bottleList.push(type);
            levelScore -= decScore;
          }
          if (1 == levelScore && 2 == level) break;
        }
        var bucketCount = level > 10 ? 2 : 1;
        shot.GameWorld.bucketCount = bucketCount;
        shot.GameWorld.bottleCount = bottleList.length;
        var changeIndex;
        if (1 == bucketCount) {
          this.topBucket.active = false;
          this.topBucketWin.setRotateTimeWithType("none");
          this.bottomBucketWin.setRotateTimeWithType("only");
          var onlyList = [];
          for (i = 0; i < 12; i++) if (i < bottleList.length) onlyList.push(bottleList[i]); else {
            changeIndex = hall.GlobalFuncs.getRandomNumberBefore(i);
            onlyList[i] = onlyList[changeIndex];
            onlyList[changeIndex] = "none";
          }
          this.bottomBucketWin.setBottlesWithListNew(onlyList);
        } else {
          this.topBucket.active = true;
          this.topBucketWin.setRotateTimeWithType("top");
          this.bottomBucketWin.setRotateTimeWithType("bottom");
          var twoList = [];
          for (i = 0; i < 24; i++) if (i < bottleList.length) twoList.push(bottleList[i]); else {
            changeIndex = hall.GlobalFuncs.getRandomNumberBefore(i);
            twoList[i] = twoList[changeIndex];
            twoList[changeIndex] = "none";
          }
          this.topBucketWin.setBottlesWithListNew(twoList.slice(0, 12));
          this.bottomBucketWin.setBottlesWithListNew(twoList.slice(12));
        }
      },
      openFireButtonTouchStart: function openFireButtonTouchStart() {
        if (this.isOnTouch) return;
        this.isOnTouch = true;
        if (shot.GameWorld.gunFireInterval && !shot.GameWorld.gamePause && !shot.GameWorld.gameOver) {
          shot.GameWorld.gunFireIntervalNow = shot.GameWorld.gunFireInterval;
          this.openFireAction();
        }
      },
      openFireButtonTouchCancel: function openFireButtonTouchCancel() {
        this.isOnTouch = false;
        this.stopThompsonRunning();
      },
      openFireButtonTouchEnded: function openFireButtonTouchEnded() {
        if (!this.isOnTouch) return;
        this.isOnTouch = false;
        this.stopThompsonRunning();
        if (shot.GameWorld.bulletRunningTimeBottom || shot.GameWorld.gunFireInterval) return;
        if (shot.GameWorld.gameOver || shot.GameWorld.gamePause) return;
        this.openFireAction();
      },
      openFireAction: function openFireAction() {
        this.emptyGunCount = 0;
        shot.GameWorld.bulletRunningTimeBottom = shot.GameWorld.bulletRunningTimeCan;
        shot.GameWorld.bulletRunningTimeTop = shot.GameWorld.bulletRunningTimeCan;
        this.openFireBulletAction();
        this.openFireGunAction();
        if (shot.GameWorld.jugglingSchema) this.jugglingSchemaPanel.receiveBullet(); else {
          this.bottomBucketWin.receiveBulletNew();
          this.topBucketWin.receiveBulletNew();
        }
      },
      openFireBulletAction: function openFireBulletAction() {
        if (shot.GameWorld.gameOver || shot.GameWorld.gamePause) return;
        if (shot.GameWorld.jugglingSchema) {
          this.jugglingSchemaPanel.changeBulletCountLabel();
          return;
        }
        if (!shot.GameWorld.bulletInfinite && !shot.GameWorld.crazyMoment) {
          shot.GameWorld.bulletCount--;
          if (shot.GameWorld.bulletCount < 0) {
            this.stopThompsonRunning();
            this.gameOver();
            return;
          }
          this.bulletCountLabel.string = shot.GameWorld.bulletCount + "";
          this.infiniteBulletSprite.node.active = false;
          shot.GameWorld.bulletCount <= 3 && hall.GlobalFuncs.btnScaleEffectOnce(this.bulletCountLabel, 1.7);
        }
      },
      openFireGunAction: function openFireGunAction() {
        try {
          wx.vibrateShort({
            success: function success() {},
            fail: function fail() {},
            complete: function complete() {}
          });
        } catch (err) {
          hall.LOGE("error:", "openFireGunAction——" + JSON.stringify(err));
        }
        this.gunNodeWin.openFire();
      },
      stopThompsonRunning: function stopThompsonRunning() {
        shot.GameWorld.gunFireIntervalNow = 0;
        if (shot.GameWorld.gunFireInterval) {
          this.bottomBucketWin.stopRunningCount();
          2 == shot.GameWorld.bucketCount && this.topBucketWin.stopRunningCount();
        }
      },
      emptyGunAction: function emptyGunAction() {
        if (shot.GameWorld.crazyMoment || shot.GameWorld.gameOver) return;
        this.emptyGunCount++;
        if (this.emptyGunCount == shot.GameWorld.bucketCount) {
          if (shot.GameWorld.doubleHitCount >= shot.GameWorld.toolUserTimeConfig.comboContinue && !shot.gameModel.getAllCheckConfig() && shot.GameWorld.doubleHitContinueTime < shot.GameWorld.toolUserTimeConfig.comboContinueTime) {
            shot.GameWorld.doubleHitCountBest = shot.GameWorld.doubleHitCount;
            this.doubleHitContinueNode.active = true;
            this.doubleHitContinueLabel.string = "9";
            this.doubleHitContinueCount = 600;
            shot.GameWorld.doubleHitCountDownTime = true;
          }
          shot.GameWorld.doubleHitCount = 0;
          this.emptyGunCount = 0;
          if (0 == shot.GameWorld.bulletCount && !shot.GameWorld.bulletInfinite) {
            shot.GameWorld.gunFireIntervalNow = 0;
            this.gameOver();
          }
        }
      },
      stopDoubleHitAnimation: function stopDoubleHitAnimation(aniIndex) {
        if (this["doubleHitAniAction" + aniIndex]) {
          var ani = this.doubleHitAniNode.getComponent(cc.Animation);
          var clipName = ani.getClips()[aniIndex].name;
          var animation = ani.getAnimationState(clipName);
          animation.stop();
        }
      },
      bottleHit: function bottleHit(bottleInfo) {
        if (shot.GameWorld.crazyMoment) {
          0 == bottleInfo.lifeCount && this.addScoreWithAnimation(shot.GameWorld.bottleConfig[bottleInfo.type].crazyBottleScore);
          return;
        }
        shot.GameWorld.doubleHitCount += 1;
        var aniIndex = 0;
        if (1 == shot.GameWorld.doubleHitCount) {
          this.doubleHit1.node.active = true;
          this.doubleHitLayout.node.active = false;
        } else {
          this.doubleHit1.node.active = false;
          this.doubleHitLayout.node.active = true;
          this.doubleHit.string = "+" + shot.GameWorld.doubleHitCount;
          aniIndex = 1;
        }
        this.stopDoubleHitAnimation(aniIndex);
        this["doubleHitAniAction" + aniIndex] = true;
        var ani = this.doubleHitAniNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[aniIndex].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function() {
          that["doubleHitAniAction" + aniIndex] = false;
        });
        animation.play();
        shot.GameWorld.totalScore += shot.GameWorld.doubleHitCount;
        shot.GlobalFuncs.getFriendInfo();
        this.nowScoreLabel.string = shot.GameWorld.totalScore;
        shot.GameWorld.bulletCount <= 0 && !shot.GameWorld.bulletInfinite && (shot.GameWorld.bottleCount > 1 || 1 == shot.GameWorld.bottleCount && bottleInfo.lifeCount > 0) && this.gameOver();
      },
      playBottomDeadAnimation: function playBottomDeadAnimation() {
        this.bottomBucketWin.playDeadAnimation();
      },
      addScoreWithAnimation: function addScoreWithAnimation(score) {
        shot.GameWorld.totalScore += score;
        var aniNode;
        aniNode = this.addScoreAniPool.size() > 0 ? this.addScoreAniPool.get() : cc.instantiate(this.addScoreAniPrefab);
        var addAniW = aniNode.getComponent("shot_addScoreAni");
        addAniW.setAddScore(score);
        this.infoAniNode.addChild(aniNode);
        var ani2 = aniNode.getComponent(cc.Animation);
        var anim2 = ani2.getAnimationState("addScore");
        var that = this;
        anim2.once("finished", function() {
          that.nowScoreLabel.string = shot.GameWorld.totalScore;
          that.addScoreAniPool.put(aniNode);
          aniNode.removeFromParent();
        });
        anim2.play();
      },
      levelUp: function levelUp() {
        this.isOnTouch = false;
        shot.GameWorld.gunFireIntervalNow && this.stopThompsonRunning();
        shot.GameWorld.gunFireIntervalNow = 0;
        if (shot.GameWorld.gameGetBox) return;
        if (shot.GameWorld.crazyMoment) {
          if (0 == shot.GameWorld.bottleCount && !shot.GameWorld.gamePause) {
            this.crazyTimePanel.crazyTimeGood();
            return;
          }
          shot.GameWorld.gamePause = true;
          shot.GameWorld.bottleCount = 0;
          this.infiniteBulletTimeNode.active = false;
          shot.GameWorld.crazyMoment = false;
          this.crazyTimePanel = null;
        } else if (shot.GameWorld.jugglingSchema) {
          shot.GameWorld.gamePause = true;
          shot.GameWorld.bottleCount = 0;
          this.infiniteBulletTimeNode.active = false;
          shot.GameWorld.jugglingSchema = false;
          this.jugglingSchemaPanel = null;
        } else {
          1 != shot.GameWorld.gameLevel && 2 != shot.GameWorld.gameLevel && (shot.GameWorld.bulletInfinite || this.addScoreWithAnimation(shot.GameWorld.bulletCount));
          shot.GameWorld.gamePause = true;
          if (shot.GameWorld.crazyMomentConfig.crazyLevelList.indexOf(shot.GameWorld.gameLevel) > -1) {
            shot.GameWorld.crazyMoment = true;
            this.removeAllNodeForCrazy();
            return;
          }
          if (shot.GameWorld.jugglingSchemaConfig.jugglingLevelList.indexOf(shot.GameWorld.gameLevel) > -1) {
            shot.GameWorld.jugglingSchema = true;
            this.removeAllNodeForJuggling();
            return;
          }
        }
        if (1 == shot.GameWorld.gameLevel) {
          shot.GameWorld.bulletCount = 0;
          this.bulletCountLabel.string = "";
          this.infiniteBulletSprite.node.active = true;
        } else if (2 == shot.GameWorld.gameLevel) {
          shot.GameWorld.bulletCount = 0;
          this.setAddBulletButton();
        }
        shot.GameWorld.bulletInfinite = false;
        shot.GameWorld.gameLevel++;
        this.gameStartWithLevel();
        this.changeTheBestScore();
      },
      gameOver: function gameOver() {
        hall.LOGW("=====", "======gameOver======");
        shot.GameWorld.gameOver = true;
        shot.GameWorld.bulletInfinite = false;
        shot.GameWorld.bulletCount = 0;
        this.gameOverCount = 60;
        this.isOnTouch = false;
        shot.GameWorld.gunFireIntervalNow = 0;
      },
      showGameOver: function showGameOver() {
        hall.adManager.hideBannerAd();
        if (shot.GameWorld.gameGetBox) return;
        var reTypeList;
        reTypeList = ty.UserInfo.isInBSGS ? shot.GameWorld.toolUserTimeConfig.resurgenceType.bsgs : shot.GameWorld.toolUserTimeConfig.resurgenceType.nBsgs;
        if ("ad" == reTypeList[0] && !hall.adManager.canPlay) {
          shot.GlobalFuncs.showGameOverWithMyScore();
          return;
        }
        shot.GameWorld.resurgenceTime >= shot.GameWorld.toolUserTimeConfig.resurgenceTime || shot.gameModel.getAllCheckConfig() ? shot.GlobalFuncs.showGameOverWithMyScore() : shot.GlobalFuncs.showResurgence();
      },
      removeAllNodeForCrazy: function removeAllNodeForCrazy() {
        this.bulletCountLabel.string = "";
        this.infiniteBulletSprite.node.active = true;
        this.crazyTimeStartCount = 120;
        hall.adManager.hideBannerAd();
        this.infiniteTime = 0;
        this.infiniteBulletTimeNode.active = false;
        this.doubleHitContinueNode.active = false;
        shot.GameWorld.doubleHitCountDownTime = false;
      },
      showCrazyTime: function showCrazyTime() {
        cc.loader.loadRes("shot_prefabs/shot_crazyTime", function(err, prefab) {
          var preFabNode = cc.instantiate(prefab);
          cc.director.getScene().addChild(preFabNode);
          shot.GlobalFuncs.setToCenter(preFabNode);
          var com = preFabNode.getComponent("shot_crazyTime");
          com.parentScene = this;
          this.crazyTimePanel = com;
        }.bind(this));
      },
      setCrazyTimeBucket: function setCrazyTimeBucket() {
        this.crazyTimeInCount = 60;
        var crazyBucketCon = shot.GameWorld.crazyMomentConfig.crazyLevelConfig;
        var bucketCon;
        for (var i = 0; i < crazyBucketCon.length; i++) crazyBucketCon[i].crazyLevel == shot.GameWorld.gameLevel && (bucketCon = crazyBucketCon[i]);
        this.crazyTimeFullTime = bucketCon.crazyTime;
        shot.GameWorld.crazyBonus = bucketCon.bonusScore;
        shot.GameWorld.bucketCount = bucketCon.crazyBucketList.length;
        if (1 == bucketCon.crazyBucketList.length) {
          this.topBucket.active = false;
          this.topBucketWin.setCrazyRotateTimeWithType("none");
          this.bottomBucketWin.setCrazyRotateTimeWithType("bottom", bucketCon.crazyBucketList[0]);
        } else {
          this.topBucket.active = true;
          this.bottomBucketWin.setCrazyRotateTimeWithType("bottom", bucketCon.crazyBucketList[0]);
          this.topBucketWin.setCrazyRotateTimeWithType("top", bucketCon.crazyBucketList[1]);
        }
      },
      startCrazyTime: function startCrazyTime() {
        this.infiniteBulletTimeNode.active = true;
        this.crazyTimeCountDown = this.crazyTimeFullTime;
        this.countDownLabel.string = this.crazyTimeCountDown;
      },
      removeCrazyWhenEnd: function removeCrazyWhenEnd() {
        this.crazyTimeOutCount = 60;
      },
      crazyTimeEndEnter: function crazyTimeEndEnter() {
        this.crazyTimeEndCount = 60;
        if (!shot.GameWorld.bulletInfinite) {
          this.bulletCountLabel.string = shot.GameWorld.bulletCount + "";
          this.infiniteBulletSprite.node.active = false;
        }
      },
      addCrazyTimeScore: function addCrazyTimeScore() {
        this.crazyTimeCountDown = 0;
        this.infiniteBulletTimeNode.active = false;
        0 == shot.GameWorld.bottleCount && this.addScoreWithAnimation(shot.GameWorld.crazyBonus);
        this.bottomBucketWin.removeAllCrazyBottles();
        this.topBucketWin.removeAllCrazyBottles();
        shot.GlobalFuncs.getFriendInfo();
        if (this.doubleHitContinueCount) {
          shot.GameWorld.doubleHitCountDownTime = true;
          this.doubleHitContinueNode.active = true;
        }
        this.showBanner();
      },
      crazyMomentAnimation: function crazyMomentAnimation() {
        if (this.crazyTimeStartCount) {
          this.crazyTimeStartCount--;
          if (this.crazyTimeStartCount < 60) {
            this.rightDistance = 4 * (60 - this.crazyTimeStartCount);
            this.removeCrazyNode();
          }
          0 == this.crazyTimeStartCount && this.showCrazyTime();
        }
        if (this.crazyTimeInCount) {
          this.crazyTimeInCount--;
          this.rightDistance = 4 * this.crazyTimeInCount;
          this.removeCrazyNode2();
          0 == this.crazyTimeInCount && this.crazyTimePanel.startCrazyTime();
        }
        if (this.crazyTimeOutCount) {
          this.crazyTimeOutCount--;
          this.rightDistance = 4 * (60 - this.crazyTimeOutCount);
          this.removeCrazyNode3();
          0 == this.crazyTimeOutCount && this.crazyTimePanel.crazyTimeAddScore();
        }
        if (this.crazyTimeEndCount) {
          this.crazyTimeEndCount--;
          this.rightDistance = 4 * this.crazyTimeEndCount;
          this.removeCrazyNode4();
          0 == this.crazyTimeEndCount && this.crazyTimePanel.crazyTimeOver();
        }
      },
      removeCrazyNode: function removeCrazyNode() {
        this.levelLabel.node.x = -300 - this.rightDistance;
        this.nowScoreLabel.node.x = -300 - this.rightDistance;
        this.bestScoreLabel.node.x = -300 - this.rightDistance;
        this.surpassNode.x = -300 - this.rightDistance;
        this.addBulletButton.node.x = -264 - this.rightDistance;
        this.infiniteBulletTimeNode.x = 220 + this.rightDistance;
        this.bulletCountNode.x = 220 + this.rightDistance;
        this.infiniteBulletButton.node.x = 238 + this.rightDistance;
        this.laserButton.node.x = 238 + this.rightDistance;
        this.bottomBucket.y = 293 + 5 * this.rightDistance;
        this.topBucket.y = 293 + 5 * this.rightDistance;
      },
      removeCrazyNode2: function removeCrazyNode2() {
        this.bottomBucket.y = 293 + 5 * this.rightDistance;
        this.topBucket.y = 293 + 5 * this.rightDistance;
        this.nowScoreLabel.node.x = -300 - this.rightDistance;
        this.infiniteBulletTimeNode.x = 220 + this.rightDistance;
        this.bulletCountNode.x = 220 + this.rightDistance;
      },
      removeCrazyNode3: function removeCrazyNode3() {
        this.nowScoreLabel.node.x = -300 - this.rightDistance;
        this.infiniteBulletTimeNode.x = 220 + this.rightDistance;
        this.bulletCountNode.x = 220 + this.rightDistance;
        this.bottomBucket.y = 293 + 5 * this.rightDistance;
        this.topBucket.y = 293 + 5 * this.rightDistance;
      },
      removeCrazyNode4: function removeCrazyNode4() {
        this.levelLabel.node.x = -300 - this.rightDistance;
        this.nowScoreLabel.node.x = -300 - this.rightDistance;
        this.bestScoreLabel.node.x = -300 - this.rightDistance;
        this.surpassNode.x = -300 - this.rightDistance;
        this.addBulletButton.node.x = -264 - this.rightDistance;
        this.infiniteBulletTimeNode.x = 220 + this.rightDistance;
        this.bulletCountNode.x = 220 + this.rightDistance;
        this.infiniteBulletButton.node.x = 238 + this.rightDistance;
        this.laserButton.node.x = 238 + this.rightDistance;
        this.bottomBucket.y = 293 + 5 * this.rightDistance;
        this.topBucket.y = 293 + 5 * this.rightDistance;
      },
      removeAllNodeForJuggling: function removeAllNodeForJuggling() {
        this.crazyTimeStartCount = 120;
        hall.adManager.hideBannerAd();
        this.infiniteTime = 0;
        this.infiniteBulletTimeNode.active = false;
        this.doubleHitContinueNode.active = false;
        shot.GameWorld.doubleHitCountDownTime = false;
      },
      addJugglingSchemaNode: function addJugglingSchemaNode() {
        cc.loader.loadRes("shot_prefabs/shot_throw", function(err, prefab) {
          var preFabNode = cc.instantiate(prefab);
          cc.director.getScene().addChild(preFabNode);
          shot.GlobalFuncs.setToCenter(preFabNode);
          var com = preFabNode.getComponent("shot_throw");
          com.parentScene = this;
          this.jugglingSchemaPanel = com;
        }.bind(this));
      },
      addJugglingSchemaScore: function addJugglingSchemaScore() {
        this.infiniteBulletTimeNode.active = false;
        this.addScoreWithAnimation(shot.GameWorld.jugglingBottleScore);
        shot.GlobalFuncs.getFriendInfo();
        if (this.doubleHitContinueCount) {
          shot.GameWorld.doubleHitCountDownTime = true;
          this.doubleHitContinueNode.active = true;
        }
        this.showBanner();
      },
      endJugglingSchema: function endJugglingSchema() {
        this.crazyTimeEndCount = 120;
      },
      jugglingSchemaAnimation: function jugglingSchemaAnimation() {
        if (this.crazyTimeStartCount) {
          this.crazyTimeStartCount--;
          if (this.crazyTimeStartCount < 60) {
            this.rightDistance = 4 * (60 - this.crazyTimeStartCount);
            this.removeCrazyNode();
          }
          0 == this.crazyTimeStartCount && this.addJugglingSchemaNode();
        }
        if (this.crazyTimeEndCount) {
          this.crazyTimeEndCount--;
          this.rightDistance = 4 * this.crazyTimeEndCount;
          this.removeCrazyNode();
          if (0 == this.crazyTimeEndCount) {
            this.addJugglingSchemaScore();
            this.levelUp();
          }
        }
      },
      showBanner: function showBanner(refresh) {
        hall.adManager.showBannerAd("adunit-53ba999759aa14de", refresh);
      },
      update: function update(dt) {
        this.surpassCount++;
        if (this.surpassCount >= 10) {
          this.surpassCount = 0;
          this.setSurpassNode();
        }
        if (this.addBannerCount) {
          this.addBannerCount--;
          0 == this.addBannerCount && this.showBanner();
        }
        if (shot.GameWorld.gunFireIntervalNow && !shot.GameWorld.gamePause && !shot.GameWorld.gameOver && !shot.GameWorld.jugglingSchema) {
          shot.GameWorld.gunFireIntervalNow--;
          if (1 == shot.GameWorld.gunFireIntervalNow) {
            shot.GameWorld.gunFireIntervalNow = shot.GameWorld.gunFireInterval;
            this.openFireAction();
          }
        }
        if (shot.GameWorld.gameOver) {
          if (this.gameOverCount > 0) {
            this.gameOverCount--;
            0 == this.gameOverCount && this.showGameOver();
          }
          return;
        }
        if (this.doubleHitContinueCount && shot.GameWorld.doubleHitCountDownTime) {
          this.doubleHitContinueCount--;
          this.doubleHitContinueCount % 60 == 40 && (this.doubleHitContinueLabel.string = this.doubleHitContinueCount / 60 >> 0);
          this.doubleHitContinueCount >= 570 && (this.doubleHitContinueNode.x = 4 * -(this.doubleHitContinueCount - 570) - this.windowWidth / 2);
          this.doubleHitContinueCount <= 30 && (this.doubleHitContinueNode.x = 4 * -(30 - this.doubleHitContinueCount) - this.windowWidth / 2);
          if (this.doubleHitContinueCount <= 0) {
            this.doubleHitContinueNode.active = false;
            shot.GameWorld.doubleHitCountDownTime = false;
          }
        }
        if (shot.GameWorld.crazyMoment && !shot.GameWorld.gamePause) {
          if (0 != this.crazyTimeCountDown) {
            this.crazyTimeCountDown -= dt;
            this.infiniteBulletTimeSprite.fillRange = this.crazyTimeCountDown / this.crazyTimeFullTime;
            if (this.crazyTimeCountDown % 1 < .15) {
              this.countDownLabel.string = this.crazyTimeCountDown >> 0;
              this.crazyTimePanel.setCountDownEnd(this.countDownLabel.string);
            }
            if (this.crazyTimeCountDown <= 0) {
              this.crazyTimeCountDown = 0;
              this.crazyTimePanel.crazyTimeOut();
              this.infiniteBulletTimeNode.active = false;
            }
          }
          return;
        }
        shot.GameWorld.crazyMoment && this.crazyMomentAnimation();
        shot.GameWorld.jugglingSchema && this.jugglingSchemaAnimation();
        if (this.infiniteTime) {
          this.infiniteTime--;
          if (0 == this.infiniteTime) {
            this.infiniteBulletTimeNode.active = false;
            if (shot.GameWorld.bulletInfinite) {
              shot.GameWorld.bulletInfinite = false;
              this.bulletCountLabel.string = "" + shot.GameWorld.bulletCount;
              this.infiniteBulletSprite.node.active = false;
            }
          } else {
            this.infiniteTime % 60 == 0 && (this.countDownLabel.string = "" + (this.infiniteTime / 60 >> 0));
            this.infiniteBulletTimeSprite.fillRange = this.infiniteTime / this.infiniteFullTime;
          }
        }
      },
      rePlayBgMusic: function rePlayBgMusic() {
        hall.LOGW("==rePlayBgMusic===", "=====rePlayBgMusicrePlayBgMusic=====");
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicGame, true);
      },
      onDebug: function onDebug() {
        this.debugCount++;
        if (10 == this.debugCount) {
          debugMode = true;
          shot.GlobalFuncs.showDebugPanel();
          this.debugCount = 0;
        }
      },
      onDestroy: function onDestroy() {
        this.crazyTimePanel = null;
        this.addScoreAniPool.clear();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_mystery_giftBag: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "baf4253o7JO549V4jcM5e5g", "shot_mystery_giftBag");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        centerBtn: cc.Button,
        aniSpriteNode: cc.Node,
        tips: cc.Label,
        tipsRich: cc.RichText,
        btnText: cc.RichText
      },
      onLoad: function onLoad() {
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node, 1.13);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        this.updateTips();
      },
      playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeMysteryGiftBag || shareType == shot.Share.onShareType.clickStatShareTypeMysteryGiftBagGetReward) {
          var _config = shot.GameWorld.gunnerShareSchemeConfig;
          if (_config && _config.giftBagShareGetDiamond && !ty.UserInfo.isInBSGS) {
            var reultType = shot.Share.resultType;
            switch (reultType) {
             case 1:
              hall.MsgBoxManager.showToast({
                title: "分享到群才有效哦~"
              });
              break;

             case 2:
              hall.MsgBoxManager.showToast({
                title: "这个群今天已经打扰过了哦~"
              });
            }
          } else hall.MsgBoxManager.showToast({
            title: "快进群抢礼包吧~"
          });
          shot.Share.resultType = 0;
        }
      },
      updateTips: function updateTips() {
        this.btnText.string = "<color=#ffffff><b><size=44>分享礼包</b></color>";
        this.tipsRich.string = "<color=#622508>分享到群里可以和朋友一起抢</c><img src='shot_gift_diamond'/><color=#622508>哦</c>";
      },
      updateInfo: function updateInfo(result) {},
      onClickCenterButton: function onClickCenterButton() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "mysteryGifgBag" ]);
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        _config && _config.giftBagShareGetDiamond && !ty.UserInfo.isInBSGS ? shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeMysteryGiftBagGetReward) : shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeMysteryGiftBag);
      },
      onClose: function onClose() {
        this.centerBtn.node.stopAllActions();
        this.node.destroy();
      },
      onBlack: function onBlack() {},
      update: function update(dt) {},
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_prop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8f104Z7APxNoolLm+I6RRXk", "shot_prop");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        titleLabel: {
          default: null,
          type: cc.RichText
        },
        doubleHitNode: {
          default: null,
          type: cc.Node
        },
        doubleHitLabel: {
          default: null,
          type: cc.Label
        },
        propName: cc.RichText,
        descText: cc.Label,
        centerBtn: cc.Button,
        propSprite: cc.Sprite,
        propSpriteList: [ cc.SpriteFrame ],
        boxId: "",
        getType: "",
        btnText: cc.RichText,
        tips: cc.Label
      },
      onLoad: function onLoad() {
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node, 1.13);
        this.state = 0;
        ty.NotificationCenter.listen(shot.EventType.UPDATE_INFINITEBULLET_NUMBER, this.updateInfiniteByllet, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_LASERAIMING_NUMBER, this.updateLaserAiming, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_GRENADE_NUMBER, this.updateGrenadeAiming, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE, this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR, this.rewardVideoCompleteError, this);
      },
      playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        hall.LOGW("", "file = [shot_prop] fun = [playAnimationAfterShareWithType]  ===" + shareType);
        var reultType = shot.Share.resultType;
        if (shareType && (shareType == shot.Share.onShareType.clickStatShareTypeLight || shareType == shot.Share.onShareType.clickStatShareTypeBullet || shareType == shot.Share.onShareType.clickStatShareTypeBulletGetReward || shareType == shot.Share.onShareType.clickStatShareTypeLightGetReward || shareType == shot.Share.onShareType.clickStatShareTypeGrenade || shareType == shot.Share.onShareType.clickStatShareTypeGrenadeGetReward)) {
          var _config = shot.GameWorld.gunnerShareSchemeConfig;
          if (_config && _config.boxShareGetProp && !ty.UserInfo.isInBSGS) switch (reultType) {
           case 1:
            hall.MsgBoxManager.showToast({
              title: "分享到群才有效哦~"
            });
            break;

           case 2:
            hall.MsgBoxManager.showToast({
              title: "这个群今天已经打扰过了哦~"
            });
            break;

           case 3:
            hall.MsgBoxManager.showToast({
              title: "分享成功"
            });
            break;

           default:
            hall.MsgBoxManager.showToast({
              title: "分享失败"
            });
          } else switch (reultType) {
           case 0:
            hall.MsgBoxManager.showToast({
              title: "快进群点击分享卡片抢道具吧~"
            });
            break;

           case 1:
            hall.MsgBoxManager.showToast({
              title: "进群抢才有效哦~"
            });
            break;

           case 2:
            hall.MsgBoxManager.showToast({
              title: "进入不同群可以抢更多道具哦~"
            });
            break;

           case 3:
            hall.MsgBoxManager.showToast({
              title: "快进群点击分享卡片抢道具吧~"
            });
            break;

           default:
            hall.MsgBoxManager.showToast({
              title: "分享失败"
            });
          }
          shot.Share.resultType = 0;
        }
        if (shareType == shot.Share.onShareType.clickStatShareTypeComboContinue) {
          switch (reultType) {
           case 1:
           case 2:
            hall.MsgBoxManager.showToast({
              title: "分享到不同群才有效哦"
            });
            break;

           case 3:
            this.comboContinue();
            break;

           default:
            hall.MsgBoxManager.showToast({
              title: "分享失败"
            });
          }
          shot.Share.resultType = 0;
        }
        this.onClose();
      },
      comboContinue: function comboContinue() {
        shot.GameWorld.doubleHitCount = shot.GameWorld.doubleHitCountBest;
        hall.MsgBoxManager.showToast({
          title: "成功恢复至" + shot.GameWorld.doubleHitCount + "连击!"
        });
        shot.GameWorld.doubleHitContinueTime++;
        shot.GameWorld.doubleHitCountDownTime = false;
        ty.NotificationCenter.trigger(shot.EventType.STOP_DOUBLEHIT_COUNTDOWN);
      },
      updateInfiniteByllet: function updateInfiniteByllet() {
        0 == this.state && (this.propName.string = "<color=#622508>无限子弹</c><color=#FF3333> x" + hall.ME.udataInfo.infiniteBulletCount + "</color>");
      },
      updateLaserAiming: function updateLaserAiming() {
        1 == this.state && (this.propName.string = "<color=#622508>激光道具</c><color=#FF3333> x" + hall.ME.udataInfo.laserAimingCount + "</color>");
      },
      updateGrenadeAiming: function updateGrenadeAiming() {
        1 == this.state && (this.propName.string = "<color=#622508>手榴弹</c><color=#FF3333> x" + hall.ME.udataInfo.grenadeCount + "</color>");
      },
      updateToDoubleHitContinue: function updateToDoubleHitContinue() {
        this.state = 2;
        this.titleLabel.string = "<color=#F1A955><b>恢复连击</b></c>";
        this.doubleHitNode.active = true;
        this.propSprite.node.active = false;
        this.doubleHitLabel.string = "+" + shot.GameWorld.doubleHitCountBest;
        this.propName.string = "";
        this.descText.string = "可恢复刚刚中断的连击";
        this.tips.string = "剩余次数:" + (shot.GameWorld.toolUserTimeConfig.comboContinueTime - shot.GameWorld.doubleHitContinueTime);
        this.tips.node.active = true;
        this.changeGetType();
      },
      updateInfo: function updateInfo(result) {
        this.titleLabel.string = "<color=#F1A955><b>道 具</b></c>";
        this.propSprite.node.active = true;
        this.doubleHitNode.active = false;
        if (result.itemId && "item:1371" == result.itemId) {
          this.state = 0;
          this.propSprite.spriteFrame = this.propSpriteList[0];
          this.propName.string = "<color=#622508>无限子弹</c><color=#FF3333> x" + hall.ME.udataInfo.infiniteBulletCount + "</color>";
          this.descText.string = "使用后持续" + shot.GameWorld.propertyConfig.infiniteBullet.time + "秒子弹无限";
        } else if (result.itemId && "item:1390" == result.itemId) {
          this.state = 1;
          this.propSprite.spriteFrame = this.propSpriteList[1];
          this.propName.string = "<color=#622508>手榴弹</c><color=#FF3333> x" + hall.ME.udataInfo.grenadeCount + "</color>";
          this.descText.string = "使用后对所有酒瓶造成伤害";
        }
        result.boxId && "" != result.boxId && (shot.Share.shareKeywordReplace.boxId = result.boxId);
        this.changeGetType();
      },
      changeGetType: function changeGetType() {
        var getTypeConfig;
        getTypeConfig = 2 == this.state ? shot.GameWorld.toolUserTimeConfig.propType.combo : shot.GameWorld.toolUserTimeConfig.propType.getItem;
        var typeList;
        typeList = ty.UserInfo.isInBSGS ? getTypeConfig.bsgs : getTypeConfig.nBsgs;
        2 != this.state && shot.gameModel.getAllCheckConfig() && (typeList = [ "ad", "shareClick" ]);
        typeList && "ad" == typeList[0] ? hall.adManager.canPlay ? this.getType = "getPropAd" : typeList.length > 1 && "share" == typeList[1] ? this.getType = "getPropShare" : typeList.length > 1 && "shareClick" == typeList[1] ? this.getType = "getPropShareClick" : this.getType = "getProp" : "share" == typeList[0] ? this.getType = "getPropShare" : "shareClick" == typeList[0] ? this.getType = "getPropShareClick" : this.getType = "getProp";
        this.tips.node.active = false;
        if (2 == this.state) "getPropShare" == this.getType ? this.btnText.string = "<color=#ffffff><b>免费恢复</b></color>" : "getPropAd" == this.getType ? this.btnText.string = "<color=#ffffff><b>看视频恢复</b></color>" : this.btnText.string = "<color=#ffffff><b>恢复</b></color>"; else if ("getPropShareClick" == this.getType) {
          this.tips.node.active = true;
          this.tips.string = "自己也可以进群抢道具哦";
          this.btnText.string = "<color=#ffffff><b>赠 送</b></color>";
        } else "getPropAd" == this.getType ? this.btnText.string = "<color=#ffffff><b><size=44>看视频领取</b></color>" : "getPropShare" == this.getType ? this.btnText.string = "<color=#ffffff><b><size=44>免费领道具</b></color>" : this.btnText.string = "<color=#ffffff><b>领取</b></color>";
      },
      onClickCenterBtn: function onClickCenterBtn() {
        if (2 == this.state) if ("getPropShare" == this.getType) shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeComboContinue); else if ("getPropAd" == this.getType) hall.adManager.showRewardedVideo("combo"); else {
          this.comboContinue();
          this.onClose();
        } else if ("getPropShareClick" == this.getType) 1 == this.state ? shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeGrenade) : shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeBullet); else if ("getPropAd" == this.getType) hall.adManager.showRewardedVideo("getProp"); else if ("getPropShare" == this.getType) 1 == this.state ? shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeGrenadeGetReward) : shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeBulletGetReward); else {
          1 == this.state ? shot.gameModel.shareToGetreward(shot.Share.SharePointType.getGrenade) : shot.gameModel.shareToGetreward(shot.Share.SharePointType.getBullet);
          this.onClose();
        }
      },
      rewardVideoComplete: function rewardVideoComplete(isEnd) {
        if ("combo" != hall.adManager.rewardedVideoType && "getProp" != hall.adManager.rewardedVideoType) return;
        isEnd ? "combo" == hall.adManager.rewardedVideoType ? this.comboContinue() : 1 == this.state ? shot.gameModel.shareToGetreward(shot.Share.SharePointType.getGrenade) : shot.gameModel.shareToGetreward(shot.Share.SharePointType.getBullet) : hall.MsgBoxManager.showToast({
          title: "视频播放未完成"
        });
        this.onClose();
      },
      rewardVideoCompleteError: function rewardVideoCompleteError(errorMsg) {
        if ("combo" != hall.adManager.rewardedVideoType && "getProp" != hall.adManager.rewardedVideoType) return;
        hall.MsgBoxManager.showToast({
          title: errorMsg
        });
        "combo" == hall.adManager.rewardedVideoType ? this.comboContinue() : 1 == this.state ? shot.gameModel.shareToGetreward(shot.Share.SharePointType.getGrenade) : shot.gameModel.shareToGetreward(shot.Share.SharePointType.getBullet);
        this.onClose();
      },
      onClose: function onClose() {
        2 == this.state && (shot.GameWorld.doubleHitCountDownTime = true);
        this.centerBtn.node.stopAllActions();
        this.node.destroy();
      },
      onBlack: function onBlack() {},
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_rank: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6f3bePyovBA7L8v+8b9sGVr", "shot_rank");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        backButton: {
          default: null,
          type: cc.Button
        },
        seeHolkButton: {
          default: null,
          type: cc.Button
        },
        startGameButton: {
          default: null,
          type: cc.Button
        },
        titleLabel: cc.RichText,
        rankSprite: cc.Sprite,
        texture: cc.Texture2D,
        spriteFrame: {
          default: null,
          type: cc.SpriteFrame
        },
        shareTicket: ""
      },
      backAction: function backAction() {
        ty.NotificationCenter.trigger(shot.EventType.UPDATE_RESULT_RANK);
        shot.LOGD(null, "backAction");
        this.node.destroy();
      },
      onBlack: function onBlack() {},
      useModel: function useModel() {},
      ctor: function ctor() {},
      onLoad: function onLoad() {
        shot.GlobalFuncs.drawGameCanvas();
        var backButtonH = shot.GlobalFuncs.getBackButtonPositionY();
        backButtonH && (this.backButton.node.y = backButtonH);
        var openDataContext = shot.GlobalFuncs.getOpenData();
        if (!openDataContext) return;
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width = 566;
        sharedCanvas.height = 1890;
        shot.GlobalFuncs.showOrigin();
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        var texture = this.texture;
        var spriteFrame = this.spriteFrame;
        var sprite = this.rankSprite;
        var main = function main() {
          texture.initWithElement(sharedCanvas);
          texture.handleLoadedTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.spriteFrame._refreshTexture(texture);
        };
        main();
        ty.Timer.setTimer(this, main, .1, 1e3);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
      },
      playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType != shot.Share.onShareType.clickStatShareTypeRankList) return;
        var _config = shot.GameWorld.gunnerShareSchemeConfig;
        if (_config) {
          var reultType = shot.Share.resultType;
          switch (reultType) {
           case 1:
            hall.MsgBoxManager.showToast({
              title: "分享到群才有效哦~"
            });
          }
        } else hall.MsgBoxManager.showToast({
          title: "可入群查看自己的排行哦~"
        });
        shot.Share.resultType = 0;
      },
      showRankListForShare: function showRankListForShare() {
        this.unscheduleAllCallbacks();
        var openDataContext = shot.GlobalFuncs.getOpenData();
        if (!openDataContext) return;
        var sharedCanvas = openDataContext.canvas;
        this.shareTicket && "" != this.shareTicket ? shot.GlobalFuncs.showGroupRank(this.shareTicket) : shot.GlobalFuncs.showFriendRank();
        var texture = this.texture;
        var spriteFrame = this.spriteFrame;
        var sprite = this.rankSprite;
        var main = function main() {
          texture.initWithElement(sharedCanvas);
          texture.handleLoadedTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.spriteFrame._refreshTexture(texture);
        };
        ty.Timer.setTimer(this, main, .1, 1e3);
      },
      changeButtonToRank: function changeButtonToRank(shareTicket) {
        this.shareTicket = shareTicket;
        this.showRankListForShare();
        if (shareTicket && "" != shareTicket) {
          this.titleLabel.string = "<color=#F1A955><b>群排行</b></c>";
          this.seeHolkButton.node.active = false;
          this.startGameButton.node.active = true;
        } else {
          this.titleLabel.string = "<color=#F1A955><b>好友排行</b></c>";
          this.seeHolkButton.node.active = true;
          this.startGameButton.node.active = false;
        }
      },
      onRankButton: function onRankButton() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "groupRankAtRank" ]);
        var shareType = shot.Share.onShareType.clickStatShareTypeRankList;
        shot.Share.shareWithType(shareType);
      },
      onStartButton: function onStartButton() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "startGameAtRank" ]);
        this.hideBackButton();
        var curScene = cc.director.getScene();
        if ("shot_main" == curScene.name) ty.NotificationCenter.trigger(shot.EventType.GAME_START, "start"); else {
          var sceneName = "shot_main";
          var onLaunched = function onLaunched() {};
          cc.director.loadScene(sceneName, onLaunched);
        }
        this.node.destroy();
      },
      start: function start() {},
      onDestroy: function onDestroy() {
        shot.gameModel.rankWindow = null;
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      },
      hideBackButton: function hideBackButton() {
        this.backButton.node.active = false;
      },
      showBackButton: function showBackButton() {
        this.backButton.node.active = true;
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_result: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4a0933lzqxH2qJ4aOzHvqJH", "shot_result");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        nowScoreLabel: {
          default: null,
          type: cc.Label
        },
        bestScoreLabel: {
          default: null,
          type: cc.Label
        },
        rankTexture: cc.Texture2D,
        rankSpriteFrame: cc.SpriteFrame,
        rankSprite: cc.Sprite,
        shotButton: {
          default: null,
          type: cc.Button
        }
      },
      onBlack: function onBlack() {},
      onBackButton: function onBackButton() {
        this.shotButton.node.stopAllActions();
        var sceneName = "shot_begin";
        var onLaunched = function onLaunched() {};
        cc.director.loadScene(sceneName, onLaunched);
        this.node.destroy();
      },
      showAllRank: function showAllRank() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "showAllRank" ]);
        shot.GlobalFuncs.showRankList("");
      },
      showBestToOthers: function showBestToOthers() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "showBest" ]);
        shot.GlobalFuncs.showShareResult();
      },
      playAgain: function playAgain() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "playAgain" ]);
        ty.NotificationCenter.trigger(shot.EventType.GAME_START, "start");
        this.shotButton.node.stopAllActions();
        this.node.destroy();
      },
      onLoad: function onLoad() {
        ty.NotificationCenter.listen(shot.EventType.UPDATE_RESULT_RANK, this.setRankInfo, this);
        shot.Share.shareKeywordReplace.theScoreForNow = shot.GameWorld.totalScore;
        if (shot.GameWorld.totalScore >= shot.Share.shareKeywordReplace.bestScoreForSelf) {
          shot.GlobalFuncs.upDateRankData(shot.GameWorld.totalScore);
          shot.Share.shareKeywordReplace.bestScoreForSelf = shot.GameWorld.totalScore;
        }
        shot.gameModel.saveScore();
        hall.GlobalFuncs.btnScaleEffect(this.shotButton.node, 1.13);
        this.nowScoreLabel.string = shot.Share.shareKeywordReplace.theScoreForNow + "";
        this.bestScoreLabel.string = "本周最佳:" + shot.Share.shareKeywordReplace.bestScoreForSelf;
        this.setRankInfo();
      },
      setRankInfo: function setRankInfo() {
        var openDataContext = shot.GlobalFuncs.getOpenData();
        if (!openDataContext) return;
        var sharedCanvas = openDataContext.canvas;
        sharedCanvas.width = 550;
        sharedCanvas.height = 280;
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame(this.rankTexture);
        var texture = this.rankTexture;
        var spriteFrame = this.rankSpriteFrame;
        var sprite = this.rankSprite;
        var main = function main() {
          texture.initWithElement(sharedCanvas);
          texture.handleLoadedTexture();
          sprite.spriteFrame = spriteFrame;
          sprite.spriteFrame._refreshTexture(texture);
        };
        main();
        ty.Timer.setTimer(this, main, .1, 5e3);
        shot.GlobalFuncs.getThirdRankInfo();
      },
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_res: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c638LVZgNPs6iv+ZCCjrY9", "shot_res");
    "use strict";
    shot.EffectPath_mp3 = {
      centerSmash: "crazygun/sound/centreSmash_new.mp3",
      endSmash: "crazygun/sound/endSmash_new.mp3",
      headSmash: "crazygun/sound/headSmash_new.mp3",
      gunHits: "/resources/sound/gunshot.mp3",
      gunHits0: "crazygun/sound/gunshot.mp3",
      gunHits1: "crazygun/sound/gunshot1.mp3",
      gunHits2: "crazygun/sound/gunshot2.mp3",
      gunHits3: "crazygun/sound/Kar98k.mp3",
      gunHits4: "crazygun/sound/win94.mp3",
      gunHits5: "crazygun/sound/M16_3.mp3",
      gunHits6: "crazygun/sound/Thompson.mp3",
      gunHits7: "crazygun/sound/Gatling1.mp3",
      gunHits8: "crazygun/sound/Barrett.mp3",
      crazyCheer: "crazygun/sound/musicGamecheer1.mp3",
      jugglingTrack: "crazygun/sound/jugglingTrack.mp3",
      jugglingFragmentation: "crazygun/sound/jugglingFragmentation.mp3",
      grenadeBegin: "crazygun/sound/grenade_begin.mp3",
      grenadeBoom: "crazygun/sound/grenade_boom.mp3",
      grenadeStrike: "crazygun/sound/grenade_strike.mp3",
      musicStart: "supersnipe/sound/musicStart.mp3",
      musicGame: "supersnipe/sound/musicGame.mp3",
      musicCrazy: "supersnipe/sound/musicGamecrazyTime.mp3",
      jugglingMusic: "supersnipe/sound/BGM_Juggling2.mp3"
    };
    cc._RF.pop();
  }, {} ],
  shot_resurgence: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c75f2eahOhJ6ZPOieCiSREA", "shot_resurgence");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        scoreLabel: cc.Label,
        diamondLabel: cc.RichText,
        centerBtn: cc.Button,
        centerBtnText: cc.RichText,
        nextNode: cc.Node,
        nextAvatar: cc.Sprite,
        nextScoreLabel: cc.Label,
        useDiamondTips: cc.Node,
        aniSpriteNode: {
          default: null,
          type: cc.Node
        },
        diamondNode: {
          default: null,
          type: cc.Button
        }
      },
      onLoad: function onLoad() {
        hall.GlobalFuncs.btnScaleEffect(this.centerBtn.node, 1.13);
        this.scoreLabel.string = shot.GameWorld.totalScore;
        shot.Share.shareKeywordReplace.theScoreForNow = shot.GameWorld.totalScore;
        this.nextNode.active = false;
        ty.UserInfo.wxgame_session_key || hall.LoginToyoo();
        var count = hall.ME.udataInfo.diamondCount || 0;
        this.diamondLabel.string = "<color=#622508>已有 </color><img src='shot_gift_diamond'/><color=#FF3333> x" + count + "</color>";
        if (0 == count) {
          this.centerBtnText.string = "没有钻石";
          this.state = 1;
        } else {
          this.centerBtnText.string = "复活";
          this.state = 0;
        }
        ty.NotificationCenter.listen(shot.EventType.RESURGENCE_RESULT, this.getResurgenceResult, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_DIAMOND_NUMBER, this.updateDiamond, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE, this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR, this.rewardVideoCompleteError, this);
        this.updateTips();
        this.changeDiamondNodeActive();
        hall.adManager.showBannerAd("adunit-53ba999759aa14de");
      },
      changeDiamondNodeActive: function changeDiamondNodeActive() {
        shot.gameModel.getAllCheckConfig() ? this.diamondNode.node.active = false : ty.UserInfo.isInBSGS ? this.diamondNode.node.active = shot.GameWorld.toolUserTimeConfig.mysteryShow.bsgs : this.diamondNode.node.active = shot.GameWorld.toolUserTimeConfig.mysteryShow.nBsgs;
      },
      updateTips: function updateTips() {
        var reTypeList;
        reTypeList = ty.UserInfo.isInBSGS ? shot.GameWorld.toolUserTimeConfig.resurgenceType.bsgs : shot.GameWorld.toolUserTimeConfig.resurgenceType.nBsgs;
        if ("ad" == reTypeList[0]) if (hall.adManager.canPlay) {
          this.useDiamondTips.active = false;
          this.centerBtnText.string = "<color=#ffffff><b>观看视频复活</b></color>";
          this.scoreLabel.node.y = 57;
          this.state = 3;
        } else if (reTypeList.length > 1 && "share" == reTypeList[1]) {
          this.useDiamondTips.active = false;
          this.centerBtnText.string = "<color=#ffffff><b>免费复活</b></color>";
          this.scoreLabel.node.y = 57;
          this.state = 2;
        } else {
          this.useDiamondTips.active = true;
          this.scoreLabel.node.y = 130;
        } else if ("share" == reTypeList[0]) {
          var number = hall.GlobalFuncs.getRandomNumberBefore(100);
          var tempNumber;
          tempNumber = ty.UserInfo.isInBSGS ? shot.GameWorld.toolUserTimeConfig.resurgenceType.shareProbabilityB : shot.GameWorld.toolUserTimeConfig.resurgenceType.shareProbabilityN;
          if (number < tempNumber) {
            this.useDiamondTips.active = false;
            this.centerBtnText.string = "<color=#ffffff><b>免费复活</b></color>";
            this.scoreLabel.node.y = 57;
            this.state = 2;
          } else if (hall.adManager.canPlay) {
            this.useDiamondTips.active = false;
            this.centerBtnText.string = "<color=#ffffff><b>观看视频复活</b></color>";
            this.scoreLabel.node.y = 57;
            this.state = 3;
          } else {
            this.useDiamondTips.active = true;
            this.scoreLabel.node.y = 130;
          }
        } else {
          this.useDiamondTips.active = true;
          this.scoreLabel.node.y = 130;
        }
      },
      playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && shareType == shot.Share.onShareType.clickStatShareTypeRevial) {
          var _config = shot.GameWorld.gunnerShareSchemeConfig;
          if (_config && _config.resurgenceShare && !ty.UserInfo.isInBSGS) {
            var reultType = shot.Share.resultType;
            switch (reultType) {
             case 1:
              hall.MsgBoxManager.showToast({
                title: "分享到群才有效哦~"
              });
              break;

             case 2:
              hall.MsgBoxManager.showToast({
                title: "这个群今天已经打扰过了哦~"
              });
              break;

             case 3:
              shot.waitGetRevial = {
                type: "waitRecive"
              };
              shot.gameModel.shareToGetreward(shot.waitGetRevial.sharePoint || shot.Share.SharePointType.shareResurgence);
            }
          } else hall.MsgBoxManager.showToast({
            title: "快进群抢礼包吧~"
          });
          shot.Share.resultType = 0;
        }
      },
      updateDiamond: function updateDiamond() {
        if (3 == this.state || 2 == this.state) return;
        var count = hall.ME.udataInfo.diamondCount || 0;
        this.diamondLabel.string = "<color=#622508>已有 </color><img src='shot_gift_diamond'/><color=#FF3333> x" + count + "</color>";
        if (0 == count) {
          this.centerBtnText.string = "没有钻石";
          this.state = 1;
        } else {
          this.centerBtnText.string = "复活";
          this.state = 0;
        }
      },
      onBlack: function onBlack() {},
      getResurgenceResult: function getResurgenceResult(resurt) {
        if (1 == resurt.success && "item:1373" == resurt.itemId) {
          hall.adManager.hideBannerAd();
          this.onClose();
          ty.NotificationCenter.trigger(shot.EventType.GAME_START);
          hall.MsgBoxManager.showToast({
            title: "复活成功!"
          });
        }
      },
      rewardVideoComplete: function rewardVideoComplete(isEnd) {
        if ("resurgence" != hall.adManager.rewardedVideoType) return;
        if (isEnd) {
          hall.adManager.hideBannerAd();
          this.onClose();
          ty.NotificationCenter.trigger(shot.EventType.GAME_START);
          hall.MsgBoxManager.showToast({
            title: "复活成功!"
          });
        } else hall.MsgBoxManager.showToast({
          title: "视频播放未完成"
        });
      },
      rewardVideoCompleteError: function rewardVideoCompleteError(errorMsg) {
        if ("resurgence" != hall.adManager.rewardedVideoType) return;
        hall.MsgBoxManager.showToast({
          title: errorMsg
        });
      },
      onClickCenterButton: function onClickCenterButton() {
        if (2 == this.state) {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "resurgenceShare" ]);
          shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeRevial);
          return;
        }
        if (1 == this.state) {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "noDiamond" ]);
          hall.MsgBoxManager.showToast({
            title: "邀请好友进入游戏可得钻石!"
          });
          return;
        }
        if (3 == this.state) {
          ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "resurgenceAd" ]);
          hall.adManager.showRewardedVideo("resurgence");
          return;
        }
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "useDiamond" ]);
        shot.gameModel.consumeAssets(1, "item:1373");
      },
      onClose: function onClose() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "onCloseResurgence" ]);
        this.centerBtn.node.stopAllActions();
        this.node.destroy();
      },
      onClickSkip: function onClickSkip() {
        hall.adManager.hideBannerAd();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "onClickSkip" ]);
        this.onClose();
        shot.GlobalFuncs.showGameOverWithMyScore();
      },
      secretGift: function secretGift() {
        hall.adManager.hideBannerAd();
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "secretGift" ]);
        shot.GlobalFuncs.showMysteryGifgBag();
      },
      update: function update(dt) {
        this.aniSpriteNode.rotation += 1;
      },
      onDestroy: function onDestroy() {
        hall.adManager.hideBannerAd();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_secret_box: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cfd20p3wbJPDYJsa+IK3R7O", "shot_secret_box");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        textRich: {
          default: null,
          type: cc.RichText
        },
        boxSprite: {
          default: null,
          type: cc.Sprite
        },
        boxSpriteFrameList: [ cc.SpriteFrame ],
        checkBoxButton: {
          default: null,
          type: cc.Button
        },
        checkBoxSprite: {
          default: null,
          type: cc.Sprite
        },
        boxType: "",
        openType: "",
        parentScene: {
          default: null,
          serializable: false
        }
      },
      onLoad: function onLoad() {
        var openConfig;
        openConfig = shot.gameModel.getAllCheckConfig() ? shot.GameWorld.treasureConfig.showAtWindow.tishen : ty.UserInfo.isInBSGS ? shot.GameWorld.treasureConfig.showAtWindow.bsgs : shot.GameWorld.treasureConfig.showAtWindow.nBsgs;
        var openTypeList = openConfig.openType;
        var shareProbability = openConfig.shareProbability;
        this.checkBoxButton.node.active = false;
        this.chooseOpenTypeWithTypeListAndIndex(openTypeList, 0, shareProbability);
        ty.NotificationCenter.listen(shot.EventType.UPDATE_SHARE_STATE, this.playAnimationAfterShareWithType, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE, this.rewardVideoComplete, this);
        ty.NotificationCenter.listen(shot.EventType.REWARD_VIDEO_COMPLETE_ERROR, this.rewardVideoCompleteError, this);
      },
      chooseOpenTypeWithTypeListAndIndex: function chooseOpenTypeWithTypeListAndIndex(openTypeList, index, shareProbability) {
        if (index > 3) return;
        this.checkBoxButton.node.active = false;
        var type = openTypeList[index];
        switch (type) {
         case "ad":
          if (hall.adManager.canPlay) {
            this.openType = "openAd";
            this.textRich.string = "<color=#ffffff><b>看视频开启</b></color>";
          } else this.chooseOpenTypeWithTypeListAndIndex(openTypeList, index + 1, shareProbability);
          break;

         case "share":
          var number = hall.GlobalFuncs.getRandomNumberBefore(100);
          if (number < shareProbability) if (hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE, 0)) this.chooseOpenTypeWithTypeListAndIndex(openTypeList, index + 1, shareProbability); else {
            ty.UserInfo.isInBSGS ? this.textRich.string = "<color=#ffffff><b>免费开启</b></color>" : this.textRich.string = "<color=#ffffff><b>炫耀一下并开启</b></color>";
            this.openType = "openShare";
          } else if (hall.adManager.canPlay) {
            this.openType = "openAd";
            this.textRich.string = "<color=#ffffff><b>看视频开启</b></color>";
          } else this.chooseOpenTypeWithTypeListAndIndex(openTypeList, index + 1, shareProbability);
          break;

         case "checkbox":
          if (hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE_CHECK, 0)) this.chooseOpenTypeWithTypeListAndIndex(openTypeList, index + 1, shareProbability); else {
            this.textRich.string = "<color=#ffffff><b>开启</b></color>";
            this.openType = "openShare";
            this.checkBoxButton.node.active = true;
          }
          break;

         case "direct":
          this.textRich.string = "<color=#ffffff><b>开启</b></color>";
          this.openType = "open";
        }
      },
      setBoxTypeWithType: function setBoxTypeWithType(boxType, delegate) {
        this.boxType = boxType;
        this.parentScene = delegate;
        if ("treasureBox1" == this.boxType) {
          this.checkBoxButton.node.active = false;
          this.textRich.string = "<color=#ffffff><b>开启</b></color>";
          this.openType = "open";
        }
        var spriteIndex = shot.GameWorld.bottleNameList.indexOf(this.boxType);
        this.boxSprite.spriteFrame = this.boxSpriteFrameList[spriteIndex - 4];
      },
      onCheckBoxChange: function onCheckBoxChange() {
        if ("openShare" == this.openType) {
          this.textRich.string = "<color=#ffffff><b>开启</b></color>";
          this.openType = "open";
        } else {
          this.textRich.string = "<color=#ffffff><b>开启</b></color>";
          this.openType = "openShare";
        }
        this.checkBoxSprite.node.active = "openShare" == this.openType;
      },
      onClose: function onClose() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "closeBox", this.openType, this.boxType ]);
        if ("treasureBox" == this.boxType && "openShare" == this.openType) {
          var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME, 0);
          hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME, dayCount + 1);
          dayCount + 1 >= shot.GameWorld.toolUserTimeConfig.closeBoxTime && hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE, 1);
        }
        if (shot.GameWorld.gameOver) {
          this.afterGameOver();
          return;
        }
        shot.GameWorld.gamePause = false;
        shot.GameWorld.gameGetBox = false;
        shot.GameWorld.bottleCount <= 0 && this.parentScene.levelUp();
        this.node.destroy();
      },
      onOpenBox: function onOpenBox() {
        "treasureBox" == this.boxType && "openShare" == this.openType && hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME, 0);
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "openBox", this.openType, this.boxType ]);
        if (shot.GameWorld.gameOver) {
          this.afterGameOver();
          return;
        }
        switch (this.openType) {
         case "open":
          if (this.checkBoxButton.node.active) {
            var dayCount = hall.GlobalFuncs.ReadNumFromLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME_CHECK, 0);
            hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME_CHECK, dayCount + 1);
            dayCount + 1 >= shot.GameWorld.toolUserTimeConfig.closeBoxTime && hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_STATE_CHECK, 1);
          }
          this.changeStateToGet();
          break;

         case "openShare":
          this.checkBoxButton.node.active && hall.GlobalFuncs.setInLocalStorage(shot.gameModel.OPEN_BOX_CLOSE_TIME_CHECK, 0);
          ty.UserInfo.isInBSGS ? shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeOpenSecretBoxB) : shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeOpenSecretBoxN);
          break;

         case "openAd":
          hall.adManager.showRewardedVideo("openBox");
        }
      },
      rewardVideoComplete: function rewardVideoComplete(isEnd) {
        if ("openBox" != hall.adManager.rewardedVideoType) return;
        isEnd ? this.changeStateToGet() : hall.MsgBoxManager.showToast({
          title: "视频播放未完成"
        });
      },
      rewardVideoCompleteError: function rewardVideoCompleteError(errorMsg) {
        if ("openBox" != hall.adManager.rewardedVideoType) return;
        hall.MsgBoxManager.showToast({
          title: errorMsg
        });
        this.changeStateToGet();
      },
      afterGameOver: function afterGameOver() {
        shot.GameWorld.gameGetBox = false;
        hall.MsgBoxManager.showToast({
          title: "游戏已结束"
        });
        var isCheck = shot.gameModel.getAllCheckConfig();
        shot.GameWorld.resurgenceTime >= shot.GameWorld.toolUserTimeConfig.resurgenceTime || isCheck ? shot.GlobalFuncs.showGameOverWithMyScore() : shot.GlobalFuncs.showResurgence();
        this.node.destroy();
      },
      playAnimationAfterShareWithType: function playAnimationAfterShareWithType(shareType) {
        if (shareType && (shareType == shot.Share.onShareType.clickStatShareTypeOpenSecretBoxB || shareType == shot.Share.onShareType.clickStatShareTypeOpenSecretBoxN)) {
          var resultType = shot.Share.resultType;
          switch (resultType) {
           case 1:
            hall.MsgBoxManager.showToast({
              title: "分享到群才有效哦~"
            });
            break;

           case 2:
            hall.MsgBoxManager.showToast({
              title: "这个群今天已经打扰过了哦~"
            });
            break;

           case 3:
            this.changeStateToGet();
            break;

           case 6:
            hall.MsgBoxManager.showToast({
              title: "分享失败"
            });
            break;

           default:
            hall.MsgBoxManager.showToast({
              title: "分享失败了"
            });
          }
        }
        shot.Share.resultType = 0;
      },
      changeStateToGet: function changeStateToGet() {
        var rewardConfig = shot.GameWorld.treasureConfig.rewardConfig[this.boxType];
        var rand = Math.random();
        var rewardType;
        var rewardIndex;
        var nowPercent = 0;
        var haveReward = false;
        for (var i = 0; i < shot.GameWorld.treasureBoxTypeList.length; i++) {
          rewardIndex = i;
          rewardType = shot.GameWorld.treasureBoxTypeList[i];
          nowPercent += rewardConfig[rewardType];
          if (rand <= nowPercent) {
            haveReward = true;
            break;
          }
        }
        if (!haveReward) {
          rewardIndex = hall.GlobalFuncs.getRandomNumberBefore(shot.GameWorld.treasureBoxTypeList.length);
          rewardType = shot.GameWorld.treasureBoxTypeList[rewardIndex];
        }
        if ("laserGun" == rewardType) shot.gameModel.shareToGetreward(10600002); else if ("infiniteBullet" == rewardType) shot.gameModel.shareToGetreward(10600001); else if ("grenade" == rewardType) shot.gameModel.shareToGetreward(10600005); else {
          shot.GlobalFuncs.playGetPropBoxAni(rewardIndex);
          shot.GlobalFuncs.setBulletType(shot.GameWorld.propertyConfig[rewardType].bulletType);
        }
        this.node.destroy();
      },
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_shareResult: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d89c4qBZlpANIFVE03n2+lV", "shot_shareResult");
    "use strict";
    cc.Class({
      extends: cc.Component,
      ctor: function ctor() {
        this.tempCanvas = null;
        this.context = null;
      },
      properties: {
        shareMomentSprite: {
          default: null,
          type: cc.Sprite
        },
        texture: cc.Texture2D,
        spriteFrame: {
          default: null,
          type: cc.SpriteFrame
        },
        aniSprite: {
          default: null,
          type: cc.Sprite
        },
        aniSpriteFrame: cc.SpriteFrame,
        aniSpriteNode: {
          default: null,
          type: cc.Node
        },
        countDown: 0,
        saveImageUrl: null,
        windowHeight: 1136
      },
      onShareToFriend: function onShareToFriend() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "showToFriend" ]);
        shot.Share.shareWithType(shot.Share.onShareType.clickStatShareTypeScore);
      },
      onShareMoments: function onShareMoments() {
        ty.BiLog.clickStat(ty.UserInfo.clickStatEventType.clickStatEventTypeButtonClick, [ "shareMoments" ]);
        if (this.saveImageUrl) {
          this.saveImageToPhoneWithUrl(this.saveImageUrl);
          this.shareMomentSprite.node.active = true;
          this.aniSprite.spriteFrame = this.aniSpriteFrame;
          var animation = this.aniSpriteNode.getComponent(cc.Animation).getAnimationState("share_bg_ani");
          var that = this;
          animation.once("finished", function() {
            that.changeAniSprite();
          });
          animation.play();
        }
      },
      shareBackAction: function shareBackAction() {
        this.shareMomentSprite.node.active = false;
      },
      backAction: function backAction() {
        this.node.destroy();
      },
      onBlack: function onBlack() {},
      onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        winSize.height / 1136 > winSize.width / 640 && (this.windowHeight = winSize.height);
        this.windowHeight = winSize.height;
        this.shareMomentSprite.node.active = false;
        var that = this;
        var levelNameList = [ "见习枪手", "初级枪手", "高级枪手", "资深枪手", "精英枪手", "宗师枪手", "神枪手" ];
        var tempCanvas = wx.createCanvas();
        tempCanvas.width = 640;
        tempCanvas.height = this.windowHeight;
        var context = tempCanvas.getContext("2d");
        this.tempCanvas = tempCanvas;
        this.context = context;
        var image1 = wx.createImage();
        image1.onload = function(event) {
          var img1 = event.target;
          context.drawImage(img1, 0, 0, 640, that.windowHeight);
          context.font = "bold 60px arial";
          context.fillStyle = "#4a0707";
          context.textAlign = "center";
          context.fillText(shot.Share.shareKeywordReplace.bestScoreForSelf + "", 320, 203);
          var level = that.judgeScoreLevel();
          if (level < 5) {
            context.font = "bold 92px arial";
            context.fillText(levelNameList[level - 1], 320, 350);
            that.changeShowSprite(tempCanvas, context);
          } else {
            var image3 = wx.createImage();
            image3.onload = function(event) {
              var img3 = event.target;
              context.drawImage(img3, (640 - img3.width) / 2, that.windowHeight - img3.height, img3.width, img3.height);
              that.changeShowSprite(tempCanvas, context);
            };
            image3.src = ty.SystemInfo.cdnPath_shareMoment + "shot_shareMoment_level" + level + ".png";
          }
        };
        image1.src = ty.SystemInfo.cdnPath_shareMoment + "shot_shareMoment_bg_2.png";
      },
      changeShowSprite: function changeShowSprite(tempCanvas, context) {
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        this.texture.initWithElement(tempCanvas);
        this.texture.handleLoadedTexture();
        this.shareMomentSprite.spriteFrame = this.spriteFrame;
        this.shareMomentSprite.spriteFrame._refreshTexture(this.texture);
        this.shareMomentSprite.node.height = this.windowHeight;
        this.getSaveImageUrl(context, tempCanvas);
      },
      changeAniSprite: function changeAniSprite() {
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame(this.texture);
        this.texture.initWithElement(this.tempCanvas);
        this.texture.handleLoadedTexture();
        this.aniSprite.spriteFrame = this.spriteFrame;
        this.aniSprite.spriteFrame._refreshTexture(this.texture);
        this.aniSprite.node.height = this.windowHeight;
        this.aniSprite.node.active = true;
        this.countDown = 120;
      },
      update: function update(dt) {
        if (this.countDown) {
          this.countDown--;
          0 == this.countDown && (this.aniSprite.node.active = false);
          this.countDown < 60 && (this.aniSprite.node.x -= 3);
        }
      },
      getSaveImageUrl: function getSaveImageUrl(context, tempCanvas) {
        var image3 = wx.createImage();
        var that = this;
        image3.onload = function(event) {
          var img3 = event.target;
          context.drawImage(img3, 0, that.windowHeight - 269, 640, 269);
          that.saveImageUrl = tempCanvas.toTempFilePathSync({
            x: 0,
            y: 0,
            width: 640,
            height: that.windowHeight,
            destWidth: 640,
            destHeight: that.windowHeight
          });
        };
        image3.src = ty.SystemInfo.cdnPath_shareMoment + "shot_shareMoment_bottom_2.png";
      },
      judgeScoreLevel: function judgeScoreLevel() {
        var score = shot.Share.shareKeywordReplace.bestScoreForSelf;
        var level = 0;
        level = score < 2e3 ? 1 : score < 1e4 ? 2 : score < 2e4 ? 3 : score < 5e4 ? 4 : score < 1e5 ? 5 : score < 5e5 ? 6 : 7;
        return level;
      },
      saveImageToPhoneWithUrl: function saveImageToPhoneWithUrl(tempFilePath) {
        var saveImageToPhone = function saveImageToPhone() {
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function success(res) {
              hall.MsgBoxManager.showToast({
                title: "图片已保存到手机相册\n请到朋友圈分享",
                time: 3
              });
            },
            fail: function fail(params) {
              hall.LOGW("========", "=======fail========" + JSON.stringify(params));
            },
            complete: function complete(params) {}
          });
        };
        wx.getSetting({
          success: function success(res) {
            res.authSetting["scope.writePhotosAlbum"] ? saveImageToPhone() : wx.authorize({
              scope: "scope.writePhotosAlbum",
              success: function success() {
                saveImageToPhone();
              },
              fail: function fail() {
                hall.LOGW(null, "授权使用相册失败!");
                wx.showModal({
                  title: "提示",
                  content: "保存图片,需要您授权使用相册,点击确定手动进行授权!",
                  showCancel: true,
                  cancelText: "取消",
                  confirmText: "确定",
                  success: function success(res) {
                    res.confirm && wx.openSetting();
                  }
                });
              },
              complete: function complete() {}
            });
          }
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_throw: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "380bfx6+TpBAJ8gJXoqXe60", "shot_throw");
    "use strict";
    cc.Class({
      extends: cc.Component,
      ctor: function ctor() {
        this.bottlePool = null;
        this.bottlePool0 = null;
        this.bottlePool1 = null;
        this.bottlePool2 = null;
        this.bottlePool3 = null;
        this.deadPool = null;
        this.bottleWinList = [];
        this.jugglingList = [];
        this.jugglingListDetail = {};
        this.bottleConfig = {};
      },
      properties: {
        widthScale: 0,
        heightScale: 0,
        titleNode: {
          default: null,
          type: cc.Node
        },
        missNode: {
          default: null,
          type: cc.Node
        },
        missNodeList: [ cc.Sprite ],
        missSpriteFrameList: [ cc.SpriteFrame ],
        countDownSprite: {
          default: null,
          type: cc.Sprite
        },
        countDownSpriteFrameList: [ cc.SpriteFrame ],
        bulletNode: {
          default: null,
          type: cc.Node
        },
        bulletCountLabel: {
          default: null,
          type: cc.Label
        },
        infiniteSprite: {
          default: null,
          type: cc.Sprite
        },
        countDownLabel: {
          default: null,
          type: cc.Label
        },
        infiniteBulletTimeSprite: {
          default: null,
          type: cc.Sprite
        },
        infiniteBulletTimeNode: {
          default: null,
          type: cc.Node
        },
        infiniteTime: 0,
        infiniteFullTime: 0,
        bottleNode: {
          default: null,
          type: cc.Node
        },
        bottleAniNode: {
          default: null,
          type: cc.Node
        },
        bottlePrefab: {
          default: null,
          type: cc.Prefab
        },
        prefabList: [ cc.Prefab ],
        bucketNode: {
          default: null,
          type: cc.Node
        },
        mutongNode: {
          default: null,
          type: cc.Node
        },
        mutongAnimation: {
          default: null,
          type: cc.AnimationState
        },
        mutongRaiceCount: 0,
        mutongDesSpeed: 0,
        mutongPosuiNode: {
          default: null,
          type: cc.Node
        },
        deadPrefab: {
          default: null,
          type: cc.Prefab
        },
        deadAniNode: {
          default: null,
          type: cc.Node
        },
        bonusLabel: {
          default: null,
          type: cc.Label
        },
        bonusSprite: {
          default: null,
          type: cc.Sprite
        },
        resultNode: {
          default: null,
          type: cc.Node
        },
        hitLabel: {
          default: null,
          type: cc.Label
        },
        lastLabel: {
          default: null,
          type: cc.Label
        },
        scoreLabel: {
          default: null,
          type: cc.Label
        },
        addScoreLabel: {
          default: null,
          type: cc.Label
        },
        countDown: 0,
        bucketRaiseCount: 0,
        bucketHitTime: false,
        throwBottleCountDown: 0,
        startBucketInfoCount: 0,
        crazyCheerCount: 0,
        afterResultCount: 0,
        addScoreCountDown: 0,
        overCountDown: 0,
        missShowCount: 0,
        nowBottleIndex: 0,
        nowBottleType: "",
        bottleTypeList: [ cc.String ],
        haveHitBottle: false,
        receiveBulletIntervalCount: 0,
        gunFireIntervalCount: 0
      },
      onLoad: function onLoad() {
        var winSize = cc.director.getWinSize();
        this.widthScale = winSize.width / 640;
        this.heightScale = winSize.height / 1136;
        this.bucketNode.active = false;
        this.infiniteBulletTimeNode.active = false;
        var j;
        for (var i = 0; i < 4; i++) {
          this["bottlePool" + i] = new cc.NodePool();
          for (j = 0; j < 5; j++) this["bottlePool" + i].put(cc.instantiate(this.prefabList[i]));
        }
        this.bottlePool = new cc.NodePool();
        for (j = 0; j < 20; j++) {
          var bottleNode = cc.instantiate(this.bottlePrefab);
          var bottleWin = bottleNode.getComponent("shot_bottle");
          bottleWin.setBottleOriginInformationForJuggling(this, 320 * this.widthScale + 50);
          this.bottlePool.put(bottleNode);
          this.bottleWinList.push(bottleWin);
        }
        this.deadPool = new cc.NodePool();
        for (j = 0; j < 8; j++) {
          var deadNode = cc.instantiate(this.deadPrefab);
          var deadW = deadNode.getComponent("dead");
          deadW.setPositionYForDead(0);
          this.deadPool.put(deadNode);
        }
        shot.GameWorld.jugglingBottleCount.green = 0;
        shot.GameWorld.jugglingBottleCount.purple = 0;
        shot.GameWorld.jugglingBottleCount.orange = 0;
        shot.GameWorld.jugglingBottleCount.red = 0;
        shot.GameWorld.jugglingBottleHitCount = 0;
        shot.GameWorld.jugglingBottleScore = 0;
        shot.GameWorld.jugglingMissBottleCount = 0;
        shot.GameWorld.jugglingBonus = 0;
        shot.GameWorld.gamePause = false;
        var ani = this.titleNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function() {
          that.titleNode.active = false;
          that.missNode.active = true;
          that.bulletNode.active = true;
          that.countDown = 180;
          shot.AudioHelper.playMusic(shot.EffectPath_mp3.jugglingMusic, true);
          hall.GlobalFuncs.btnScaleEffectOnce(that.countDownSprite, 1.5);
        });
        animation.play();
        this.changeOriginData();
      },
      countDownOut: function countDownOut() {
        this.countDownSprite.node.active = false;
        this.throwNextBottle();
      },
      changeOriginData: function changeOriginData() {
        var jugglingConfig = shot.GameWorld.jugglingSchemaConfig.jugglingLevelConfig;
        var jugglingLevelConfig;
        for (var i = 0; i < jugglingConfig.length; i++) jugglingConfig[i].jugglingLevel == shot.GameWorld.gameLevel && (jugglingLevelConfig = jugglingConfig[i]);
        shot.GameWorld.verticalAccelerate = jugglingLevelConfig.jugglingAccelerated;
        shot.GameWorld.jugglingOriginBottleCount = jugglingLevelConfig.bottleCount;
        shot.GameWorld.jugglingBulletCount = jugglingLevelConfig.bulletCount;
        shot.GameWorld.jugglingBonusPer = jugglingLevelConfig.bonus;
        this.jugglingList = jugglingLevelConfig.jugglingList;
        this.nowBottleIndex = 1;
        this.changeBottleConfig();
        this.changeBulletCountLabel();
      },
      changeBottleConfig: function changeBottleConfig() {
        var jugglingTemp;
        var randomNumber;
        var lastIndex = 0;
        for (var i = 0; i < this.jugglingList.length; i++) {
          jugglingTemp = this.jugglingList[i];
          if (this.nowBottleIndex >= jugglingTemp.minBottleCount && this.nowBottleIndex <= jugglingTemp.maxBottleCount) {
            this.jugglingListDetail = jugglingTemp;
            this.bottleConfig = this.jugglingListDetail.bottleConfig;
            var notFirstKey = false;
            for (var key in this.jugglingListDetail.bottleConfig) {
              for (var j = 0; j < this.jugglingListDetail.bottleConfig[key].bottleCount; j++) if (notFirstKey) {
                lastIndex = this.bottleTypeList.length;
                randomNumber = hall.GlobalFuncs.getRandomNumberBefore(this.bottleTypeList.length);
                this.bottleTypeList[lastIndex] = this.bottleTypeList[randomNumber];
                this.bottleTypeList[randomNumber] = key;
              } else this.bottleTypeList.push(key);
              notFirstKey = true;
            }
            this.nowBottleIndex > 1 && this.throwNextBottle();
            break;
          }
        }
      },
      changeBulletCountLabel: function changeBulletCountLabel() {
        if (shot.GameWorld.jugglingBulletCount <= 0) return;
        if (this.bucketHitTime) return;
        if (this.bucketNode.active) return;
        1 != this.nowBottleIndex && shot.GameWorld.jugglingBulletCount--;
        this.bulletCountLabel.string = shot.GameWorld.jugglingBulletCount;
      },
      throwNextBottle: function throwNextBottle() {
        if (shot.GameWorld.gamePause) return;
        if (0 == this.bottleTypeList.length) {
          if (shot.GameWorld.jugglingOriginBottleCount <= this.nowBottleIndex) return;
          this.changeBottleConfig();
          return;
        }
        var bottleNode;
        var bottleWin;
        if (this.bottlePool.size() > 0) {
          bottleNode = this.bottlePool.get();
          bottleWin = bottleNode.getComponent("shot_bottle");
        } else {
          bottleNode = cc.instantiate(this.bottlePrefab);
          bottleWin = bottleNode.getComponent("shot_bottle");
          bottleWin.setBottleOriginInformationForJuggling(this, 320 * this.widthScale + 50);
        }
        this.bottleNode.addChild(bottleNode);
        this.nowBottleType = this.bottleTypeList[0];
        var fromRight = this.nowBottleIndex % 2 == 0;
        var originX = fromRight ? 320 * this.widthScale : 320 * -this.widthScale;
        var originRotation = hall.GlobalFuncs.getRandomNumberBefore(360);
        var byRotation = hall.GlobalFuncs.getRandomNumberBefore(this.jugglingListDetail.maxRotation - this.jugglingListDetail.minRotation + 1) + this.jugglingListDetail.minRotation;
        var originY = hall.GlobalFuncs.getRandomNumberBefore(5 * (90 - byRotation)) - 200;
        bottleWin.setBottleTypeForJuggling(this.nowBottleType, this.bottleConfig[this.nowBottleType], originX, originY, originRotation, byRotation, fromRight);
        this.bottleTypeList.shift();
        this.nowBottleIndex++;
        this.throwBottleCountDown = hall.GlobalFuncs.getRandomNumberBefore(60 * this.jugglingListDetail.maxSecondGap - 60 * this.jugglingListDetail.minSecondGap + 1) + 60 * this.jugglingListDetail.minSecondGap;
      },
      receiveBullet: function receiveBullet(runningFire) {
        if (this.bucketNode.active) {
          if (this.bucketHitTime) this.playDeadAnimation(runningFire); else {
            shot.GameWorld.bulletRunningTimeBottom = 0;
            shot.GameWorld.bulletRunningTimeTop = 0;
          }
          return;
        }
        var bottleWindow;
        var bottleNodeX;
        if (runningFire) {
          this.parentScene.openFireGunAction();
          shot.GameWorld.gunFireInterval && this.parentScene.openFireBulletAction();
        } else this.haveHitBottle = false;
        var bulletRange = 75;
        shot.GameWorld.bulletRange && (bulletRange += shot.GameWorld.bulletRange);
        for (var i = 0; i < this.bottleWinList.length; i++) {
          bottleWindow = this.bottleWinList[i];
          bottleNodeX = bottleWindow.getJugglingNodeX();
          if (bottleNodeX >= -bulletRange && bottleNodeX <= bulletRange) {
            var canHit = bottleWindow.bottleHit();
            this.haveHitBottle = canHit || this.haveHitBottle;
          }
        }
        if (shot.GameWorld.bulletRunningTimeBottom) {
          shot.GameWorld.bulletRunningTimeBottom--;
          if (shot.GameWorld.bulletRunningTimeBottom) {
            this.receiveBulletIntervalCount = shot.GameWorld.bulletRunningInterval;
            return;
          }
        }
        if (shot.GameWorld.gunFireInterval) return;
        this.stopRunningCount();
      },
      stopRunningCount: function stopRunningCount() {
        this.haveHitBottle || this.emptyGunActionForJuggling();
      },
      emptyGunActionForJuggling: function emptyGunActionForJuggling() {
        0 != shot.GameWorld.jugglingBulletCount || shot.GameWorld.gamePause || this.jugglingSchemaTimeOut();
      },
      startBucketInfo: function startBucketInfo() {
        this.bucketNode.active = true;
        this.infiniteBulletTimeNode.active = true;
        this.bucketRaiseCount = 55;
        this.bonusLabel.string = "+0";
        var ani = this.mutongNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        this.mutongAnimation = ani.getAnimationState(clipName);
        this.mutongAnimation.play();
        this.mutongAnimation.speed = .5;
      },
      startBucketAnimation: function startBucketAnimation() {
        this.infiniteTime = 180;
        this.infiniteFullTime = 180;
        this.bucketHitTime = true;
        this.infiniteSprite.node.active = true;
        this.bulletCountLabel.node.active = false;
      },
      playDeadAnimation: function playDeadAnimation(runningFire) {
        this.bonusSprite.node.active = true;
        shot.AudioHelper.playEffect(shot.EffectPath_mp3.jugglingTrack);
        shot.GameWorld.jugglingBonus += shot.GameWorld.jugglingBonusPer * shot.GameWorld.bulletBlood;
        shot.GameWorld.bulletRange && (shot.GameWorld.jugglingBonus += 2 * shot.GameWorld.jugglingBonusPer);
        this.bonusLabel.string = "+" + shot.GameWorld.jugglingBonus;
        this.mutongAnimation.speed = 1;
        this.mutongRaiceCount = 5;
        if (runningFire) {
          this.parentScene.openFireGunAction();
          shot.GameWorld.gunFireInterval && this.parentScene.openFireBulletAction();
        }
        if (shot.GameWorld.bulletRunningTimeBottom) {
          shot.GameWorld.bulletRunningTimeBottom--;
          if (shot.GameWorld.bulletRunningTimeBottom) {
            this.receiveBulletIntervalCount = shot.GameWorld.bulletRunningInterval;
            return;
          }
        }
        var aniNode;
        if (this.deadPool.size() > 0) aniNode = this.deadPool.get(); else {
          aniNode = cc.instantiate(this.deadPrefab);
          var deadW = aniNode.getComponent("dead");
          deadW.setPositionYForDead(0);
        }
        this.deadAniNode.addChild(aniNode);
        var ani2 = aniNode.getComponent(cc.Animation);
        var anim2 = ani2.getAnimationState("dead");
        var that = this;
        anim2.once("finished", function() {
          that.deadPool.put(aniNode);
          aniNode.removeFromParent();
        });
        anim2.play();
      },
      missBottle: function missBottle(bottle) {
        bottle.node.removeFromParent();
        this.bottlePool.put(bottle.node);
      },
      missBottleOne: function missBottleOne(bottle, fromRight) {
        if (shot.GameWorld.jugglingMissBottleCount >= 3) return;
        if (shot.GameWorld.gamePause) return;
        this.missNodeList[shot.GameWorld.jugglingMissBottleCount].spriteFrame = this.missSpriteFrameList[1];
        shot.GameWorld.jugglingMissBottleCount++;
        fromRight ? this.missNodeList[3].node.active = true : this.missNodeList[4].node.active = true;
        this.missShowCount = 60;
        this.missBottle(bottle);
        if (shot.GameWorld.jugglingMissBottleCount >= 3) {
          this.jugglingSchemaTimeOut();
          return;
        }
        if (shot.GameWorld.jugglingMissBottleCount + shot.GameWorld.jugglingBottleHitCount == shot.GameWorld.jugglingOriginBottleCount) {
          this.startBucketInfo();
          return;
        }
        0 == shot.GameWorld.jugglingBulletCount && this.startBucketInfo();
      },
      receiveBottleLifeCount: function receiveBottleLifeCount(bottleInfo, bottle) {
        if (0 == bottleInfo.lifeCount) {
          shot.GameWorld.jugglingBottleCount[bottleInfo.type]++;
          shot.GameWorld.jugglingBottleHitCount++;
          shot.GameWorld.jugglingBottleHitCount + shot.GameWorld.jugglingMissBottleCount == shot.GameWorld.jugglingOriginBottleCount ? this.startBucketInfoCount = 60 : 0 == shot.GameWorld.jugglingBulletCount && this.jugglingSchemaTimeOut();
          this.missBottle(bottle);
        } else 0 == shot.GameWorld.jugglingBulletCount && this.jugglingSchemaTimeOut();
        var aniIndex = shot.GameWorld.bottleNameList.indexOf(bottleInfo.type);
        var bottleAniPool = this["bottlePool" + aniIndex];
        var bottleAniNodeAdd;
        bottleAniNodeAdd = bottleAniPool.size() > 0 ? bottleAniPool.get() : cc.instantiate(this.prefabList[aniIndex]);
        bottleAniNodeAdd.x = 0;
        bottleAniNodeAdd.y = bottle.getComponent("shot_bottle").getJugglingNodeY();
        var ani = bottleAniNodeAdd.getComponent(cc.Animation);
        var clipName = ani.getClips()[bottleInfo.lifeCount].name;
        var animation = ani.getAnimationState(clipName);
        bottleInfo.direction ? "left" == bottleInfo.direction ? this.bottleAniNodeLeft.addChild(bottleAniNodeAdd) : this.bottleAniNodeRight.addChild(bottleAniNodeAdd) : this.bottleAniNode.addChild(bottleAniNodeAdd);
        animation.once("finished", function() {
          bottleAniPool.put(bottleAniNodeAdd);
          bottleAniNodeAdd.removeFromParent();
        });
        animation.play();
      },
      jugglingSchemaTimeOut: function jugglingSchemaTimeOut() {
        shot.GameWorld.gamePause = true;
        this.jugglingSchemaTimeEnd();
      },
      jugglingSchemaTimeGood: function jugglingSchemaTimeGood(havePosui) {
        this.bucketHitTime = false;
        shot.GameWorld.gamePause = true;
        this.mutongAnimation.stop();
        this.mutongNode.stopAllActions();
        this.mutongNode.active = false;
        this.infiniteSprite.node.active = false;
        this.bulletCountLabel.node.active = true;
        if (havePosui) {
          this.mutongPosuiNode.active = true;
          this.mutongPosuiNode.y = this.mutongNode.y;
          var ani2 = this.mutongPosuiNode.getComponent(cc.Animation);
          var clipName2 = ani2.getClips()[0].name;
          var animation2 = ani2.getAnimationState(clipName2);
          var that = this;
          animation2.once("finished", function() {
            that.jugglingSchemaTimeEnd();
          });
          animation2.play();
          this.crazyCheerCount = 18;
          shot.AudioHelper.playEffect(shot.EffectPath_mp3.jugglingFragmentation);
        } else this.jugglingSchemaTimeEnd();
      },
      jugglingSchemaTimeEnd: function jugglingSchemaTimeEnd() {
        this.addScoreCountDown = 60;
        for (var key in shot.GameWorld.jugglingBottleCount) shot.GameWorld.jugglingBottleScore += shot.GameWorld.jugglingBottleCount[key] * shot.GameWorld.bottleConfig[key].crazyBottleScore;
      },
      setResult: function setResult() {
        this.missNode.active = false;
        shot.GameWorld.gamePause = true;
        this.bucketNode.active = false;
        this.resultNode.active = true;
        this.hitLabel.string = shot.GameWorld.jugglingBottleScore + "";
        this.scoreLabel.string = shot.GameWorld.jugglingBonus;
        this.addScoreLabel.string = shot.GameWorld.jugglingBottleScore;
        if (shot.GameWorld.jugglingMissBottleCount >= 3) this.lastLabel.string = 0; else {
          this.lastLabel.string = 10 * shot.GameWorld.jugglingBulletCount;
          shot.GameWorld.jugglingBonus += 10 * shot.GameWorld.jugglingBulletCount;
        }
        var ani = this.resultNode.getComponent(cc.Animation);
        var clipName = ani.getClips()[0].name;
        var animation = ani.getAnimationState(clipName);
        var that = this;
        animation.once("finished", function() {
          if (shot.GameWorld.jugglingBonus) {
            that.overCountDown = 90;
            return;
          }
          that.afterResultCount = 90;
        });
        animation.play();
      },
      jugglingOver: function jugglingOver() {
        shot.AudioHelper.playMusic(shot.EffectPath_mp3.musicGame, true);
        this.parentScene.endJugglingSchema();
        this.node.destroy();
      },
      update: function update(dt) {
        if (this.receiveBulletIntervalCount) {
          this.receiveBulletIntervalCount--;
          0 == this.receiveBulletIntervalCount && this.receiveBullet(true);
        }
        if (shot.GameWorld.gunFireIntervalNow && !shot.GameWorld.gamePause && !shot.GameWorld.gameOver) {
          shot.GameWorld.gunFireIntervalNow--;
          if (1 == shot.GameWorld.gunFireIntervalNow) {
            shot.GameWorld.gunFireIntervalNow = shot.GameWorld.gunFireInterval;
            this.receiveBullet(true);
          }
        }
        if (this.countDown) {
          this.countDown--;
          if (120 == this.countDown) {
            this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[1];
            hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite, 1.5);
          } else if (60 == this.countDown) {
            this.countDownSprite.spriteFrame = this.countDownSpriteFrameList[0];
            hall.GlobalFuncs.btnScaleEffectOnce(this.countDownSprite, 1.5);
          } else 0 == this.countDown && this.countDownOut();
          return;
        }
        if (this.throwBottleCountDown) {
          this.throwBottleCountDown--;
          0 == this.throwBottleCountDown && this.throwNextBottle();
        }
        if (this.missShowCount) {
          this.missShowCount--;
          if (0 == this.missShowCount) {
            this.missNodeList[4].node.active = false;
            this.missNodeList[3].node.active = false;
          }
        }
        if (this.startBucketInfoCount) {
          this.startBucketInfoCount--;
          0 == this.startBucketInfoCount && this.startBucketInfo();
        }
        if (this.bucketRaiseCount) {
          this.bucketRaiseCount--;
          this.mutongNode.y += this.heightScale * this.bucketRaiseCount / 2;
          0 == this.bucketRaiseCount && this.startBucketAnimation();
        }
        if (this.infiniteTime && this.bucketHitTime) {
          this.infiniteTime--;
          if (0 == this.infiniteTime) {
            this.jugglingSchemaTimeGood(true);
            this.countDownLabel.string = "0";
          } else {
            this.infiniteTime % 60 == 0 && (this.countDownLabel.string = "" + (this.infiniteTime / 60 >> 0));
            this.infiniteBulletTimeSprite.fillRange = this.infiniteTime / this.infiniteFullTime;
          }
        }
        if (this.bucketHitTime) {
          if (this.mutongRaiceCount) {
            this.mutongDesSpeed = 0;
            this.mutongNode.y < 230 * this.heightScale && (this.mutongNode.y += 5 * this.mutongRaiceCount * this.heightScale);
            this.mutongAnimation.speed = this.mutongRaiceCount / 5;
            this.mutongRaiceCount--;
          } else {
            this.mutongDesSpeed += .5;
            this.mutongNode.y -= this.mutongDesSpeed * this.heightScale;
          }
          this.mutongNode.y < -200 * this.heightScale && this.jugglingSchemaTimeGood(false);
        }
        if (this.crazyCheerCount) {
          this.crazyCheerCount--;
          0 == this.crazyCheerCount && shot.AudioHelper.playEffect(shot.EffectPath_mp3.crazyCheer, false);
        }
        if (this.addScoreCountDown) {
          this.addScoreCountDown--;
          0 == this.addScoreCountDown && this.setResult();
        }
        if (this.overCountDown) {
          this.overCountDown--;
          if (0 == this.overCountDown) {
            shot.GameWorld.jugglingBottleScore += shot.GameWorld.jugglingBonus;
            this.addScoreLabel.string = shot.GameWorld.jugglingBottleScore;
            this.afterResultCount = 60;
          } else this.addScoreLabel.string = (90 - this.overCountDown) * shot.GameWorld.jugglingBonus / 90 + shot.GameWorld.jugglingBottleScore >> 0;
        }
        if (this.afterResultCount) {
          this.afterResultCount--;
          0 == this.afterResultCount && this.jugglingOver();
        }
      },
      onDestroy: function onDestroy() {
        this.bottlePool0.clear();
        this.bottlePool1.clear();
        this.bottlePool2.clear();
        this.bottlePool3.clear();
        this.bottlePool.clear();
        this.deadPool.clear();
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  shot_toast_tips: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "38b1emJqsVAnI/2zTrUiguE", "shot_toast_tips");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        titleLabel: {
          default: null,
          type: cc.Label
        }
      },
      setTitleWithString: function setTitleWithString(titleString) {
        this.titleLabel.string = titleString;
        ty.Timer.setTimer(this, this.closeAction, 1.5);
      },
      closeAction: function closeAction() {
        this.node.destroy();
        shot.msgBoxNode = null;
      },
      onDestroy: function onDestroy() {
        this.unscheduleAllCallbacks();
      }
    });
    cc._RF.pop();
  }, {} ],
  zidandaoju: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1c824Eo4NBOoW7e7wlZwtT", "zidandaoju");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        propNode: cc.Node,
        propSprite: cc.Sprite,
        propSpriteList: [ cc.SpriteFrame ],
        propTips: cc.Label,
        lightNode: cc.Node,
        gunNode: cc.Node,
        gunSprite: cc.Sprite,
        gunNameLabel: cc.Label,
        gunDescLabel: cc.Label,
        state: -1
      },
      onLoad: function onLoad() {},
      onBlack: function onBlack() {},
      updateProp: function updateProp(state, count) {
        count || (count = 1);
        this.state = state;
        if (1 == state) {
          this.propNode.active = true;
          this.gunNode.active = false;
          this.propSprite.spriteFrame = this.propSpriteList[state];
          this.propTips.string = "瞄准器x" + count;
        } else if (0 == state) {
          this.propNode.active = true;
          this.gunNode.active = false;
          this.propSprite.spriteFrame = this.propSpriteList[state];
          this.propTips.string = "无限子弹x" + count;
        } else if (2 == state) {
          this.propNode.active = true;
          this.gunNode.active = false;
          this.propSprite.spriteFrame = this.propSpriteList[state];
          this.propTips.string = "手榴弹x" + count;
        } else {
          var type = shot.GameWorld.treasureBoxTypeList[state];
          this.propNode.active = false;
          this.gunNode.active = true;
          this.gunSprite.spriteFrame = this.propSpriteList[state];
          this.gunNameLabel.string = shot.GameWorld.propertyConfig[type].name;
          this.gunDescLabel.string = shot.GameWorld.propertyConfig[type].desc;
        }
        this.playLoopAni(state);
      },
      stopLoopAni: function stopLoopAni(state) {
        var ani;
        var anim2;
        if (this.state <= 1) {
          ani = this.propNode.getComponent(cc.Animation);
          anim2 = ani.getAnimationState("ndwa_0");
        } else {
          ani = this.gunNode.getComponent(cc.Animation);
          anim2 = ani.getAnimationState("daoju_qiang1");
          var anim3 = ani.getAnimationState("daoju_qiang2");
          anim3.stop();
        }
        anim2.stop();
      },
      playLoopAni: function playLoopAni(state) {
        var ani;
        var anim2;
        if (state <= 1) {
          ani = this.propNode.getComponent(cc.Animation);
          anim2 = ani.getAnimationState("ndwa_0");
        } else {
          ani = this.gunNode.getComponent(cc.Animation);
          anim2 = ani.getAnimationState("daoju_qiang1");
          anim2.once("finished", function() {
            var nextAni = ani.getAnimationState("daoju_qiang2");
            nextAni.play();
          });
        }
        anim2.play();
      },
      onGetReward: function onGetReward() {
        if (shot.GameWorld.gameGetBox) {
          shot.GameWorld.gamePause = false;
          shot.GameWorld.gameGetBox = false;
          shot.GameWorld.bottleCount <= 0 && ty.NotificationCenter.trigger(shot.EventType.GAME_LEVEL_UP);
        }
        this.stopLoopAni();
        this.node.destroy();
      },
      onDestroy: function onDestroy() {
        ty.NotificationCenter.ignoreScope(this);
        this.unscheduleAllCallbacks();
      },
      update: function update(dt) {
        this.lightNode.rotation += .5;
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "shot_begin", "shot_main", "countDown", "dead", "jump_pause", "main_toast", "shot_addScoreAni", "shot_bottle", "shot_bucket", "shot_gun", "shot_rank", "shot_toast_tips", "debugNode", "jump_noDiamond_toastTip", "newerNode", "shot_crazyTime", "shot_diamond", "shot_freeTool", "shot_mystery_giftBag", "shot_prop", "shot_result", "shot_resurgence", "shot_secret_box", "shot_shareResult", "shot_throw", "zidandaoju", "BiLog", "EventType", "HttpUtil", "MsgCache", "NotificationCenter", "ServerStateManager", "Share", "SystemInfo", "TCP", "Timer", "TuyooSDK", "UserInfo", "GlobalFuncs", "HallGameWorld", "HallNetWorkCenter", "MsgFactory", "PropagateInterface", "boot", "HallUserInfo", "TodoTask", "TodoTaskVec", "UserInfoUData", "AdManager", "GlobalTimer", "MsgBoxManager", "ToDoTasks", "JumpEventType", "QrOption", "ServerManager", "game_world", "jump_boot", "GameModel", "jump_userInfo", "ShotNetWorkCenter", "shotAudioHelper", "shotGlobalFuncs", "shot_res" ]);