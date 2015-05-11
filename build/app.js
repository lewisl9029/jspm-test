"format register";
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var util = forge.util = forge.util || {};
    if (typeof process === 'undefined' || !process.nextTick) {
      if (typeof setImmediate === 'function') {
        util.setImmediate = setImmediate;
        util.nextTick = function(callback) {
          return setImmediate(callback);
        };
      } else {
        util.setImmediate = function(callback) {
          setTimeout(callback, 0);
        };
        util.nextTick = util.setImmediate;
      }
    } else {
      util.nextTick = process.nextTick;
      if (typeof setImmediate === 'function') {
        util.setImmediate = setImmediate;
      } else {
        util.setImmediate = util.nextTick;
      }
    }
    util.isArray = Array.isArray || function(x) {
      return Object.prototype.toString.call(x) === '[object Array]';
    };
    util.isArrayBuffer = function(x) {
      return typeof ArrayBuffer !== 'undefined' && x instanceof ArrayBuffer;
    };
    var _arrayBufferViews = [];
    if (typeof DataView !== 'undefined') {
      _arrayBufferViews.push(DataView);
    }
    if (typeof Int8Array !== 'undefined') {
      _arrayBufferViews.push(Int8Array);
    }
    if (typeof Uint8Array !== 'undefined') {
      _arrayBufferViews.push(Uint8Array);
    }
    if (typeof Uint8ClampedArray !== 'undefined') {
      _arrayBufferViews.push(Uint8ClampedArray);
    }
    if (typeof Int16Array !== 'undefined') {
      _arrayBufferViews.push(Int16Array);
    }
    if (typeof Uint16Array !== 'undefined') {
      _arrayBufferViews.push(Uint16Array);
    }
    if (typeof Int32Array !== 'undefined') {
      _arrayBufferViews.push(Int32Array);
    }
    if (typeof Uint32Array !== 'undefined') {
      _arrayBufferViews.push(Uint32Array);
    }
    if (typeof Float32Array !== 'undefined') {
      _arrayBufferViews.push(Float32Array);
    }
    if (typeof Float64Array !== 'undefined') {
      _arrayBufferViews.push(Float64Array);
    }
    util.isArrayBufferView = function(x) {
      for (var i = 0; i < _arrayBufferViews.length; ++i) {
        if (x instanceof _arrayBufferViews[i]) {
          return true;
        }
      }
      return false;
    };
    util.ByteBuffer = ByteStringBuffer;
    function ByteStringBuffer(b) {
      this.data = '';
      this.read = 0;
      if (typeof b === 'string') {
        this.data = b;
      } else if (util.isArrayBuffer(b) || util.isArrayBufferView(b)) {
        var arr = new Uint8Array(b);
        try {
          this.data = String.fromCharCode.apply(null, arr);
        } catch (e) {
          for (var i = 0; i < arr.length; ++i) {
            this.putByte(arr[i]);
          }
        }
      } else if (b instanceof ByteStringBuffer || (typeof b === 'object' && typeof b.data === 'string' && typeof b.read === 'number')) {
        this.data = b.data;
        this.read = b.read;
      }
      this._constructedStringLength = 0;
    }
    util.ByteStringBuffer = ByteStringBuffer;
    var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
    util.ByteStringBuffer.prototype._optimizeConstructedString = function(x) {
      this._constructedStringLength += x;
      if (this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH) {
        this.data.substr(0, 1);
        this._constructedStringLength = 0;
      }
    };
    util.ByteStringBuffer.prototype.length = function() {
      return this.data.length - this.read;
    };
    util.ByteStringBuffer.prototype.isEmpty = function() {
      return this.length() <= 0;
    };
    util.ByteStringBuffer.prototype.putByte = function(b) {
      return this.putBytes(String.fromCharCode(b));
    };
    util.ByteStringBuffer.prototype.fillWithByte = function(b, n) {
      b = String.fromCharCode(b);
      var d = this.data;
      while (n > 0) {
        if (n & 1) {
          d += b;
        }
        n >>>= 1;
        if (n > 0) {
          b += b;
        }
      }
      this.data = d;
      this._optimizeConstructedString(n);
      return this;
    };
    util.ByteStringBuffer.prototype.putBytes = function(bytes) {
      this.data += bytes;
      this._optimizeConstructedString(bytes.length);
      return this;
    };
    util.ByteStringBuffer.prototype.putString = function(str) {
      return this.putBytes(util.encodeUtf8(str));
    };
    util.ByteStringBuffer.prototype.putInt16 = function(i) {
      return this.putBytes(String.fromCharCode(i >> 8 & 0xFF) + String.fromCharCode(i & 0xFF));
    };
    util.ByteStringBuffer.prototype.putInt24 = function(i) {
      return this.putBytes(String.fromCharCode(i >> 16 & 0xFF) + String.fromCharCode(i >> 8 & 0xFF) + String.fromCharCode(i & 0xFF));
    };
    util.ByteStringBuffer.prototype.putInt32 = function(i) {
      return this.putBytes(String.fromCharCode(i >> 24 & 0xFF) + String.fromCharCode(i >> 16 & 0xFF) + String.fromCharCode(i >> 8 & 0xFF) + String.fromCharCode(i & 0xFF));
    };
    util.ByteStringBuffer.prototype.putInt16Le = function(i) {
      return this.putBytes(String.fromCharCode(i & 0xFF) + String.fromCharCode(i >> 8 & 0xFF));
    };
    util.ByteStringBuffer.prototype.putInt24Le = function(i) {
      return this.putBytes(String.fromCharCode(i & 0xFF) + String.fromCharCode(i >> 8 & 0xFF) + String.fromCharCode(i >> 16 & 0xFF));
    };
    util.ByteStringBuffer.prototype.putInt32Le = function(i) {
      return this.putBytes(String.fromCharCode(i & 0xFF) + String.fromCharCode(i >> 8 & 0xFF) + String.fromCharCode(i >> 16 & 0xFF) + String.fromCharCode(i >> 24 & 0xFF));
    };
    util.ByteStringBuffer.prototype.putInt = function(i, n) {
      var bytes = '';
      do {
        n -= 8;
        bytes += String.fromCharCode((i >> n) & 0xFF);
      } while (n > 0);
      return this.putBytes(bytes);
    };
    util.ByteStringBuffer.prototype.putSignedInt = function(i, n) {
      if (i < 0) {
        i += 2 << (n - 1);
      }
      return this.putInt(i, n);
    };
    util.ByteStringBuffer.prototype.putBuffer = function(buffer) {
      return this.putBytes(buffer.getBytes());
    };
    util.ByteStringBuffer.prototype.getByte = function() {
      return this.data.charCodeAt(this.read++);
    };
    util.ByteStringBuffer.prototype.getInt16 = function() {
      var rval = (this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1));
      this.read += 2;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt24 = function() {
      var rval = (this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2));
      this.read += 3;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt32 = function() {
      var rval = (this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3));
      this.read += 4;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt16Le = function() {
      var rval = (this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8);
      this.read += 2;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt24Le = function() {
      var rval = (this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16);
      this.read += 3;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt32Le = function() {
      var rval = (this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24);
      this.read += 4;
      return rval;
    };
    util.ByteStringBuffer.prototype.getInt = function(n) {
      var rval = 0;
      do {
        rval = (rval << 8) + this.data.charCodeAt(this.read++);
        n -= 8;
      } while (n > 0);
      return rval;
    };
    util.ByteStringBuffer.prototype.getSignedInt = function(n) {
      var x = this.getInt(n);
      var max = 2 << (n - 2);
      if (x >= max) {
        x -= max << 1;
      }
      return x;
    };
    util.ByteStringBuffer.prototype.getBytes = function(count) {
      var rval;
      if (count) {
        count = Math.min(this.length(), count);
        rval = this.data.slice(this.read, this.read + count);
        this.read += count;
      } else if (count === 0) {
        rval = '';
      } else {
        rval = (this.read === 0) ? this.data : this.data.slice(this.read);
        this.clear();
      }
      return rval;
    };
    util.ByteStringBuffer.prototype.bytes = function(count) {
      return (typeof(count) === 'undefined' ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count));
    };
    util.ByteStringBuffer.prototype.at = function(i) {
      return this.data.charCodeAt(this.read + i);
    };
    util.ByteStringBuffer.prototype.setAt = function(i, b) {
      this.data = this.data.substr(0, this.read + i) + String.fromCharCode(b) + this.data.substr(this.read + i + 1);
      return this;
    };
    util.ByteStringBuffer.prototype.last = function() {
      return this.data.charCodeAt(this.data.length - 1);
    };
    util.ByteStringBuffer.prototype.copy = function() {
      var c = util.createBuffer(this.data);
      c.read = this.read;
      return c;
    };
    util.ByteStringBuffer.prototype.compact = function() {
      if (this.read > 0) {
        this.data = this.data.slice(this.read);
        this.read = 0;
      }
      return this;
    };
    util.ByteStringBuffer.prototype.clear = function() {
      this.data = '';
      this.read = 0;
      return this;
    };
    util.ByteStringBuffer.prototype.truncate = function(count) {
      var len = Math.max(0, this.length() - count);
      this.data = this.data.substr(this.read, len);
      this.read = 0;
      return this;
    };
    util.ByteStringBuffer.prototype.toHex = function() {
      var rval = '';
      for (var i = this.read; i < this.data.length; ++i) {
        var b = this.data.charCodeAt(i);
        if (b < 16) {
          rval += '0';
        }
        rval += b.toString(16);
      }
      return rval;
    };
    util.ByteStringBuffer.prototype.toString = function() {
      return util.decodeUtf8(this.bytes());
    };
    function DataBuffer(b, options) {
      options = options || {};
      this.read = options.readOffset || 0;
      this.growSize = options.growSize || 1024;
      var isArrayBuffer = util.isArrayBuffer(b);
      var isArrayBufferView = util.isArrayBufferView(b);
      if (isArrayBuffer || isArrayBufferView) {
        if (isArrayBuffer) {
          this.data = new DataView(b);
        } else {
          this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
        }
        this.write = ('writeOffset' in options ? options.writeOffset : this.data.byteLength);
        return ;
      }
      this.data = new DataView(new ArrayBuffer(0));
      this.write = 0;
      if (b !== null && b !== undefined) {
        this.putBytes(b);
      }
      if ('writeOffset' in options) {
        this.write = options.writeOffset;
      }
    }
    util.DataBuffer = DataBuffer;
    util.DataBuffer.prototype.length = function() {
      return this.write - this.read;
    };
    util.DataBuffer.prototype.isEmpty = function() {
      return this.length() <= 0;
    };
    util.DataBuffer.prototype.accommodate = function(amount, growSize) {
      if (this.length() >= amount) {
        return this;
      }
      growSize = Math.max(growSize || this.growSize, amount);
      var src = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
      var dst = new Uint8Array(this.length() + growSize);
      dst.set(src);
      this.data = new DataView(dst.buffer);
      return this;
    };
    util.DataBuffer.prototype.putByte = function(b) {
      this.accommodate(1);
      this.data.setUint8(this.write++, b);
      return this;
    };
    util.DataBuffer.prototype.fillWithByte = function(b, n) {
      this.accommodate(n);
      for (var i = 0; i < n; ++i) {
        this.data.setUint8(b);
      }
      return this;
    };
    util.DataBuffer.prototype.putBytes = function(bytes, encoding) {
      if (util.isArrayBufferView(bytes)) {
        var src = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        var len = src.byteLength - src.byteOffset;
        this.accommodate(len);
        var dst = new Uint8Array(this.data.buffer, this.write);
        dst.set(src);
        this.write += len;
        return this;
      }
      if (util.isArrayBuffer(bytes)) {
        var src = new Uint8Array(bytes);
        this.accommodate(src.byteLength);
        var dst = new Uint8Array(this.data.buffer);
        dst.set(src, this.write);
        this.write += src.byteLength;
        return this;
      }
      if (bytes instanceof util.DataBuffer || (typeof bytes === 'object' && typeof bytes.read === 'number' && typeof bytes.write === 'number' && util.isArrayBufferView(bytes.data))) {
        var src = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
        this.accommodate(src.byteLength);
        var dst = new Uint8Array(bytes.data.byteLength, this.write);
        dst.set(src);
        this.write += src.byteLength;
        return this;
      }
      if (bytes instanceof util.ByteStringBuffer) {
        bytes = bytes.data;
        encoding = 'binary';
      }
      encoding = encoding || 'binary';
      if (typeof bytes === 'string') {
        var view;
        if (encoding === 'hex') {
          this.accommodate(Math.ceil(bytes.length / 2));
          view = new Uint8Array(this.data.buffer, this.write);
          this.write += util.binary.hex.decode(bytes, view, this.write);
          return this;
        }
        if (encoding === 'base64') {
          this.accommodate(Math.ceil(bytes.length / 4) * 3);
          view = new Uint8Array(this.data.buffer, this.write);
          this.write += util.binary.base64.decode(bytes, view, this.write);
          return this;
        }
        if (encoding === 'utf8') {
          bytes = util.encodeUtf8(bytes);
          encoding = 'binary';
        }
        if (encoding === 'binary' || encoding === 'raw') {
          this.accommodate(bytes.length);
          view = new Uint8Array(this.data.buffer, this.write);
          this.write += util.binary.raw.decode(view);
          return this;
        }
        if (encoding === 'utf16') {
          this.accommodate(bytes.length * 2);
          view = new Uint16Array(this.data.buffer, this.write);
          this.write += util.text.utf16.encode(view);
          return this;
        }
        throw new Error('Invalid encoding: ' + encoding);
      }
      throw Error('Invalid parameter: ' + bytes);
    };
    util.DataBuffer.prototype.putBuffer = function(buffer) {
      this.putBytes(buffer);
      buffer.clear();
      return this;
    };
    util.DataBuffer.prototype.putString = function(str) {
      return this.putBytes(str, 'utf16');
    };
    util.DataBuffer.prototype.putInt16 = function(i) {
      this.accommodate(2);
      this.data.setInt16(this.write, i);
      this.write += 2;
      return this;
    };
    util.DataBuffer.prototype.putInt24 = function(i) {
      this.accommodate(3);
      this.data.setInt16(this.write, i >> 8 & 0xFFFF);
      this.data.setInt8(this.write, i >> 16 & 0xFF);
      this.write += 3;
      return this;
    };
    util.DataBuffer.prototype.putInt32 = function(i) {
      this.accommodate(4);
      this.data.setInt32(this.write, i);
      this.write += 4;
      return this;
    };
    util.DataBuffer.prototype.putInt16Le = function(i) {
      this.accommodate(2);
      this.data.setInt16(this.write, i, true);
      this.write += 2;
      return this;
    };
    util.DataBuffer.prototype.putInt24Le = function(i) {
      this.accommodate(3);
      this.data.setInt8(this.write, i >> 16 & 0xFF);
      this.data.setInt16(this.write, i >> 8 & 0xFFFF, true);
      this.write += 3;
      return this;
    };
    util.DataBuffer.prototype.putInt32Le = function(i) {
      this.accommodate(4);
      this.data.setInt32(this.write, i, true);
      this.write += 4;
      return this;
    };
    util.DataBuffer.prototype.putInt = function(i, n) {
      this.accommodate(n / 8);
      do {
        n -= 8;
        this.data.setInt8(this.write++, (i >> n) & 0xFF);
      } while (n > 0);
      return this;
    };
    util.DataBuffer.prototype.putSignedInt = function(i, n) {
      this.accommodate(n / 8);
      if (i < 0) {
        i += 2 << (n - 1);
      }
      return this.putInt(i, n);
    };
    util.DataBuffer.prototype.getByte = function() {
      return this.data.getInt8(this.read++);
    };
    util.DataBuffer.prototype.getInt16 = function() {
      var rval = this.data.getInt16(this.read);
      this.read += 2;
      return rval;
    };
    util.DataBuffer.prototype.getInt24 = function() {
      var rval = (this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2));
      this.read += 3;
      return rval;
    };
    util.DataBuffer.prototype.getInt32 = function() {
      var rval = this.data.getInt32(this.read);
      this.read += 4;
      return rval;
    };
    util.DataBuffer.prototype.getInt16Le = function() {
      var rval = this.data.getInt16(this.read, true);
      this.read += 2;
      return rval;
    };
    util.DataBuffer.prototype.getInt24Le = function() {
      var rval = (this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, true) << 8);
      this.read += 3;
      return rval;
    };
    util.DataBuffer.prototype.getInt32Le = function() {
      var rval = this.data.getInt32(this.read, true);
      this.read += 4;
      return rval;
    };
    util.DataBuffer.prototype.getInt = function(n) {
      var rval = 0;
      do {
        rval = (rval << 8) + this.data.getInt8(this.read++);
        n -= 8;
      } while (n > 0);
      return rval;
    };
    util.DataBuffer.prototype.getSignedInt = function(n) {
      var x = this.getInt(n);
      var max = 2 << (n - 2);
      if (x >= max) {
        x -= max << 1;
      }
      return x;
    };
    util.DataBuffer.prototype.getBytes = function(count) {
      var rval;
      if (count) {
        count = Math.min(this.length(), count);
        rval = this.data.slice(this.read, this.read + count);
        this.read += count;
      } else if (count === 0) {
        rval = '';
      } else {
        rval = (this.read === 0) ? this.data : this.data.slice(this.read);
        this.clear();
      }
      return rval;
    };
    util.DataBuffer.prototype.bytes = function(count) {
      return (typeof(count) === 'undefined' ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count));
    };
    util.DataBuffer.prototype.at = function(i) {
      return this.data.getUint8(this.read + i);
    };
    util.DataBuffer.prototype.setAt = function(i, b) {
      this.data.setUint8(i, b);
      return this;
    };
    util.DataBuffer.prototype.last = function() {
      return this.data.getUint8(this.write - 1);
    };
    util.DataBuffer.prototype.copy = function() {
      return new util.DataBuffer(this);
    };
    util.DataBuffer.prototype.compact = function() {
      if (this.read > 0) {
        var src = new Uint8Array(this.data.buffer, this.read);
        var dst = new Uint8Array(src.byteLength);
        dst.set(src);
        this.data = new DataView(dst);
        this.write -= this.read;
        this.read = 0;
      }
      return this;
    };
    util.DataBuffer.prototype.clear = function() {
      this.data = new DataView(new ArrayBuffer(0));
      this.read = this.write = 0;
      return this;
    };
    util.DataBuffer.prototype.truncate = function(count) {
      this.write = Math.max(0, this.length() - count);
      this.read = Math.min(this.read, this.write);
      return this;
    };
    util.DataBuffer.prototype.toHex = function() {
      var rval = '';
      for (var i = this.read; i < this.data.byteLength; ++i) {
        var b = this.data.getUint8(i);
        if (b < 16) {
          rval += '0';
        }
        rval += b.toString(16);
      }
      return rval;
    };
    util.DataBuffer.prototype.toString = function(encoding) {
      var view = new Uint8Array(this.data, this.read, this.length());
      encoding = encoding || 'utf8';
      if (encoding === 'binary' || encoding === 'raw') {
        return util.binary.raw.encode(view);
      }
      if (encoding === 'hex') {
        return util.binary.hex.encode(view);
      }
      if (encoding === 'base64') {
        return util.binary.base64.encode(view);
      }
      if (encoding === 'utf8') {
        return util.text.utf8.decode(view);
      }
      if (encoding === 'utf16') {
        return util.text.utf16.decode(view);
      }
      throw new Error('Invalid encoding: ' + encoding);
    };
    util.createBuffer = function(input, encoding) {
      encoding = encoding || 'raw';
      if (input !== undefined && encoding === 'utf8') {
        input = util.encodeUtf8(input);
      }
      return new util.ByteBuffer(input);
    };
    util.fillString = function(c, n) {
      var s = '';
      while (n > 0) {
        if (n & 1) {
          s += c;
        }
        n >>>= 1;
        if (n > 0) {
          c += c;
        }
      }
      return s;
    };
    util.xorBytes = function(s1, s2, n) {
      var s3 = '';
      var b = '';
      var t = '';
      var i = 0;
      var c = 0;
      for (; n > 0; --n, ++i) {
        b = s1.charCodeAt(i) ^ s2.charCodeAt(i);
        if (c >= 10) {
          s3 += t;
          t = '';
          c = 0;
        }
        t += String.fromCharCode(b);
        ++c;
      }
      s3 += t;
      return s3;
    };
    util.hexToBytes = function(hex) {
      var rval = '';
      var i = 0;
      if (hex.length & 1 == 1) {
        i = 1;
        rval += String.fromCharCode(parseInt(hex[0], 16));
      }
      for (; i < hex.length; i += 2) {
        rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return rval;
    };
    util.bytesToHex = function(bytes) {
      return util.createBuffer(bytes).toHex();
    };
    util.int32ToBytes = function(i) {
      return (String.fromCharCode(i >> 24 & 0xFF) + String.fromCharCode(i >> 16 & 0xFF) + String.fromCharCode(i >> 8 & 0xFF) + String.fromCharCode(i & 0xFF));
    };
    var _base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var _base64Idx = [62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
    util.encode64 = function(input, maxline) {
      var line = '';
      var output = '';
      var chr1,
          chr2,
          chr3;
      var i = 0;
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        line += _base64.charAt(chr1 >> 2);
        line += _base64.charAt(((chr1 & 3) << 4) | (chr2 >> 4));
        if (isNaN(chr2)) {
          line += '==';
        } else {
          line += _base64.charAt(((chr2 & 15) << 2) | (chr3 >> 6));
          line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
        }
        if (maxline && line.length > maxline) {
          output += line.substr(0, maxline) + '\r\n';
          line = line.substr(maxline);
        }
      }
      output += line;
      return output;
    };
    util.decode64 = function(input) {
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      var output = '';
      var enc1,
          enc2,
          enc3,
          enc4;
      var i = 0;
      while (i < input.length) {
        enc1 = _base64Idx[input.charCodeAt(i++) - 43];
        enc2 = _base64Idx[input.charCodeAt(i++) - 43];
        enc3 = _base64Idx[input.charCodeAt(i++) - 43];
        enc4 = _base64Idx[input.charCodeAt(i++) - 43];
        output += String.fromCharCode((enc1 << 2) | (enc2 >> 4));
        if (enc3 !== 64) {
          output += String.fromCharCode(((enc2 & 15) << 4) | (enc3 >> 2));
          if (enc4 !== 64) {
            output += String.fromCharCode(((enc3 & 3) << 6) | enc4);
          }
        }
      }
      return output;
    };
    util.encodeUtf8 = function(str) {
      return unescape(encodeURIComponent(str));
    };
    util.decodeUtf8 = function(str) {
      return decodeURIComponent(escape(str));
    };
    util.binary = {
      raw: {},
      hex: {},
      base64: {}
    };
    util.binary.raw.encode = function(bytes) {
      return String.fromCharCode.apply(null, bytes);
    };
    util.binary.raw.decode = function(str, output, offset) {
      var out = output;
      if (!out) {
        out = new Uint8Array(str.length);
      }
      offset = offset || 0;
      var j = offset;
      for (var i = 0; i < str.length; ++i) {
        out[j++] = str.charCodeAt(i);
      }
      return output ? (j - offset) : out;
    };
    util.binary.hex.encode = util.bytesToHex;
    util.binary.hex.decode = function(hex, output, offset) {
      var out = output;
      if (!out) {
        out = new Uint8Array(Math.ceil(hex.length / 2));
      }
      offset = offset || 0;
      var i = 0,
          j = offset;
      if (hex.length & 1) {
        i = 1;
        out[j++] = parseInt(hex[0], 16);
      }
      for (; i < hex.length; i += 2) {
        out[j++] = parseInt(hex.substr(i, 2), 16);
      }
      return output ? (j - offset) : out;
    };
    util.binary.base64.encode = function(input, maxline) {
      var line = '';
      var output = '';
      var chr1,
          chr2,
          chr3;
      var i = 0;
      while (i < input.byteLength) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        line += _base64.charAt(chr1 >> 2);
        line += _base64.charAt(((chr1 & 3) << 4) | (chr2 >> 4));
        if (isNaN(chr2)) {
          line += '==';
        } else {
          line += _base64.charAt(((chr2 & 15) << 2) | (chr3 >> 6));
          line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
        }
        if (maxline && line.length > maxline) {
          output += line.substr(0, maxline) + '\r\n';
          line = line.substr(maxline);
        }
      }
      output += line;
      return output;
    };
    util.binary.base64.decode = function(input, output, offset) {
      var out = output;
      if (!out) {
        out = new Uint8Array(Math.ceil(input.length / 4) * 3);
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      offset = offset || 0;
      var enc1,
          enc2,
          enc3,
          enc4;
      var i = 0,
          j = offset;
      while (i < input.length) {
        enc1 = _base64Idx[input.charCodeAt(i++) - 43];
        enc2 = _base64Idx[input.charCodeAt(i++) - 43];
        enc3 = _base64Idx[input.charCodeAt(i++) - 43];
        enc4 = _base64Idx[input.charCodeAt(i++) - 43];
        out[j++] = (enc1 << 2) | (enc2 >> 4);
        if (enc3 !== 64) {
          out[j++] = ((enc2 & 15) << 4) | (enc3 >> 2);
          if (enc4 !== 64) {
            out[j++] = ((enc3 & 3) << 6) | enc4;
          }
        }
      }
      return output ? (j - offset) : out.subarray(0, j);
    };
    util.text = {
      utf8: {},
      utf16: {}
    };
    util.text.utf8.encode = function(str, output, offset) {
      str = util.encodeUtf8(str);
      var out = output;
      if (!out) {
        out = new Uint8Array(str.length);
      }
      offset = offset || 0;
      var j = offset;
      for (var i = 0; i < str.length; ++i) {
        out[j++] = str.charCodeAt(i);
      }
      return output ? (j - offset) : out;
    };
    util.text.utf8.decode = function(bytes) {
      return util.decodeUtf8(String.fromCharCode.apply(null, bytes));
    };
    util.text.utf16.encode = function(str, output, offset) {
      var out = output;
      if (!out) {
        out = new Uint8Array(str.length);
      }
      var view = new Uint16Array(out);
      offset = offset || 0;
      var j = offset;
      var k = offset;
      for (var i = 0; i < str.length; ++i) {
        view[k++] = str.charCodeAt(i);
        j += 2;
      }
      return output ? (j - offset) : out;
    };
    util.text.utf16.decode = function(bytes) {
      return String.fromCharCode.apply(null, new Uint16Array(bytes));
    };
    util.deflate = function(api, bytes, raw) {
      bytes = util.decode64(api.deflate(util.encode64(bytes)).rval);
      if (raw) {
        var start = 2;
        var flg = bytes.charCodeAt(1);
        if (flg & 0x20) {
          start = 6;
        }
        bytes = bytes.substring(start, bytes.length - 4);
      }
      return bytes;
    };
    util.inflate = function(api, bytes, raw) {
      var rval = api.inflate(util.encode64(bytes)).rval;
      return (rval === null) ? null : util.decode64(rval);
    };
    var _setStorageObject = function(api, id, obj) {
      if (!api) {
        throw new Error('WebStorage not available.');
      }
      var rval;
      if (obj === null) {
        rval = api.removeItem(id);
      } else {
        obj = util.encode64(JSON.stringify(obj));
        rval = api.setItem(id, obj);
      }
      if (typeof(rval) !== 'undefined' && rval.rval !== true) {
        var error = new Error(rval.error.message);
        error.id = rval.error.id;
        error.name = rval.error.name;
        throw error;
      }
    };
    var _getStorageObject = function(api, id) {
      if (!api) {
        throw new Error('WebStorage not available.');
      }
      var rval = api.getItem(id);
      if (api.init) {
        if (rval.rval === null) {
          if (rval.error) {
            var error = new Error(rval.error.message);
            error.id = rval.error.id;
            error.name = rval.error.name;
            throw error;
          }
          rval = null;
        } else {
          rval = rval.rval;
        }
      }
      if (rval !== null) {
        rval = JSON.parse(util.decode64(rval));
      }
      return rval;
    };
    var _setItem = function(api, id, key, data) {
      var obj = _getStorageObject(api, id);
      if (obj === null) {
        obj = {};
      }
      obj[key] = data;
      _setStorageObject(api, id, obj);
    };
    var _getItem = function(api, id, key) {
      var rval = _getStorageObject(api, id);
      if (rval !== null) {
        rval = (key in rval) ? rval[key] : null;
      }
      return rval;
    };
    var _removeItem = function(api, id, key) {
      var obj = _getStorageObject(api, id);
      if (obj !== null && key in obj) {
        delete obj[key];
        var empty = true;
        for (var prop in obj) {
          empty = false;
          break;
        }
        if (empty) {
          obj = null;
        }
        _setStorageObject(api, id, obj);
      }
    };
    var _clearItems = function(api, id) {
      _setStorageObject(api, id, null);
    };
    var _callStorageFunction = function(func, args, location) {
      var rval = null;
      if (typeof(location) === 'undefined') {
        location = ['web', 'flash'];
      }
      var type;
      var done = false;
      var exception = null;
      for (var idx in location) {
        type = location[idx];
        try {
          if (type === 'flash' || type === 'both') {
            if (args[0] === null) {
              throw new Error('Flash local storage not available.');
            }
            rval = func.apply(this, args);
            done = (type === 'flash');
          }
          if (type === 'web' || type === 'both') {
            args[0] = localStorage;
            rval = func.apply(this, args);
            done = true;
          }
        } catch (ex) {
          exception = ex;
        }
        if (done) {
          break;
        }
      }
      if (!done) {
        throw exception;
      }
      return rval;
    };
    util.setItem = function(api, id, key, data, location) {
      _callStorageFunction(_setItem, arguments, location);
    };
    util.getItem = function(api, id, key, location) {
      return _callStorageFunction(_getItem, arguments, location);
    };
    util.removeItem = function(api, id, key, location) {
      _callStorageFunction(_removeItem, arguments, location);
    };
    util.clearItems = function(api, id, location) {
      _callStorageFunction(_clearItems, arguments, location);
    };
    util.parseUrl = function(str) {
      var regex = /^(https?):\/\/([^:&^\/]*):?(\d*)(.*)$/g;
      regex.lastIndex = 0;
      var m = regex.exec(str);
      var url = (m === null) ? null : {
        full: str,
        scheme: m[1],
        host: m[2],
        port: m[3],
        path: m[4]
      };
      if (url) {
        url.fullHost = url.host;
        if (url.port) {
          if (url.port !== 80 && url.scheme === 'http') {
            url.fullHost += ':' + url.port;
          } else if (url.port !== 443 && url.scheme === 'https') {
            url.fullHost += ':' + url.port;
          }
        } else if (url.scheme === 'http') {
          url.port = 80;
        } else if (url.scheme === 'https') {
          url.port = 443;
        }
        url.full = url.scheme + '://' + url.fullHost;
      }
      return url;
    };
    var _queryVariables = null;
    util.getQueryVariables = function(query) {
      var parse = function(q) {
        var rval = {};
        var kvpairs = q.split('&');
        for (var i = 0; i < kvpairs.length; i++) {
          var pos = kvpairs[i].indexOf('=');
          var key;
          var val;
          if (pos > 0) {
            key = kvpairs[i].substring(0, pos);
            val = kvpairs[i].substring(pos + 1);
          } else {
            key = kvpairs[i];
            val = null;
          }
          if (!(key in rval)) {
            rval[key] = [];
          }
          if (!(key in Object.prototype) && val !== null) {
            rval[key].push(unescape(val));
          }
        }
        return rval;
      };
      var rval;
      if (typeof(query) === 'undefined') {
        if (_queryVariables === null) {
          if (typeof(window) !== 'undefined' && window.location && window.location.search) {
            _queryVariables = parse(window.location.search.substring(1));
          } else {
            _queryVariables = {};
          }
        }
        rval = _queryVariables;
      } else {
        rval = parse(query);
      }
      return rval;
    };
    util.parseFragment = function(fragment) {
      var fp = fragment;
      var fq = '';
      var pos = fragment.indexOf('?');
      if (pos > 0) {
        fp = fragment.substring(0, pos);
        fq = fragment.substring(pos + 1);
      }
      var path = fp.split('/');
      if (path.length > 0 && path[0] === '') {
        path.shift();
      }
      var query = (fq === '') ? {} : util.getQueryVariables(fq);
      return {
        pathString: fp,
        queryString: fq,
        path: path,
        query: query
      };
    };
    util.makeRequest = function(reqString) {
      var frag = util.parseFragment(reqString);
      var req = {
        path: frag.pathString,
        query: frag.queryString,
        getPath: function(i) {
          return (typeof(i) === 'undefined') ? frag.path : frag.path[i];
        },
        getQuery: function(k, i) {
          var rval;
          if (typeof(k) === 'undefined') {
            rval = frag.query;
          } else {
            rval = frag.query[k];
            if (rval && typeof(i) !== 'undefined') {
              rval = rval[i];
            }
          }
          return rval;
        },
        getQueryLast: function(k, _default) {
          var rval;
          var vals = req.getQuery(k);
          if (vals) {
            rval = vals[vals.length - 1];
          } else {
            rval = _default;
          }
          return rval;
        }
      };
      return req;
    };
    util.makeLink = function(path, query, fragment) {
      path = jQuery.isArray(path) ? path.join('/') : path;
      var qstr = jQuery.param(query || {});
      fragment = fragment || '';
      return path + ((qstr.length > 0) ? ('?' + qstr) : '') + ((fragment.length > 0) ? ('#' + fragment) : '');
    };
    util.setPath = function(object, keys, value) {
      if (typeof(object) === 'object' && object !== null) {
        var i = 0;
        var len = keys.length;
        while (i < len) {
          var next = keys[i++];
          if (i == len) {
            object[next] = value;
          } else {
            var hasNext = (next in object);
            if (!hasNext || (hasNext && typeof(object[next]) !== 'object') || (hasNext && object[next] === null)) {
              object[next] = {};
            }
            object = object[next];
          }
        }
      }
    };
    util.getPath = function(object, keys, _default) {
      var i = 0;
      var len = keys.length;
      var hasNext = true;
      while (hasNext && i < len && typeof(object) === 'object' && object !== null) {
        var next = keys[i++];
        hasNext = next in object;
        if (hasNext) {
          object = object[next];
        }
      }
      return (hasNext ? object : _default);
    };
    util.deletePath = function(object, keys) {
      if (typeof(object) === 'object' && object !== null) {
        var i = 0;
        var len = keys.length;
        while (i < len) {
          var next = keys[i++];
          if (i == len) {
            delete object[next];
          } else {
            if (!(next in object) || (typeof(object[next]) !== 'object') || (object[next] === null)) {
              break;
            }
            object = object[next];
          }
        }
      }
    };
    util.isEmpty = function(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
      }
      return true;
    };
    util.format = function(format) {
      var re = /%./g;
      var match;
      var part;
      var argi = 0;
      var parts = [];
      var last = 0;
      while ((match = re.exec(format))) {
        part = format.substring(last, re.lastIndex - 2);
        if (part.length > 0) {
          parts.push(part);
        }
        last = re.lastIndex;
        var code = match[0][1];
        switch (code) {
          case 's':
          case 'o':
            if (argi < arguments.length) {
              parts.push(arguments[argi++ + 1]);
            } else {
              parts.push('<?>');
            }
            break;
          case '%':
            parts.push('%');
            break;
          default:
            parts.push('<%' + code + '?>');
        }
      }
      parts.push(format.substring(last));
      return parts.join('');
    };
    util.formatNumber = function(number, decimals, dec_point, thousands_sep) {
      var n = number,
          c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
      var d = dec_point === undefined ? ',' : dec_point;
      var t = thousands_sep === undefined ? '.' : thousands_sep,
          s = n < 0 ? '-' : '';
      var i = parseInt((n = Math.abs(+n || 0).toFixed(c)), 10) + '';
      var j = (i.length > 3) ? i.length % 3 : 0;
      return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
    };
    util.formatSize = function(size) {
      if (size >= 1073741824) {
        size = util.formatNumber(size / 1073741824, 2, '.', '') + ' GiB';
      } else if (size >= 1048576) {
        size = util.formatNumber(size / 1048576, 2, '.', '') + ' MiB';
      } else if (size >= 1024) {
        size = util.formatNumber(size / 1024, 0) + ' KiB';
      } else {
        size = util.formatNumber(size, 0) + ' bytes';
      }
      return size;
    };
    util.bytesFromIP = function(ip) {
      if (ip.indexOf('.') !== -1) {
        return util.bytesFromIPv4(ip);
      }
      if (ip.indexOf(':') !== -1) {
        return util.bytesFromIPv6(ip);
      }
      return null;
    };
    util.bytesFromIPv4 = function(ip) {
      ip = ip.split('.');
      if (ip.length !== 4) {
        return null;
      }
      var b = util.createBuffer();
      for (var i = 0; i < ip.length; ++i) {
        var num = parseInt(ip[i], 10);
        if (isNaN(num)) {
          return null;
        }
        b.putByte(num);
      }
      return b.getBytes();
    };
    util.bytesFromIPv6 = function(ip) {
      var blanks = 0;
      ip = ip.split(':').filter(function(e) {
        if (e.length === 0)
          ++blanks;
        return true;
      });
      var zeros = (8 - ip.length + blanks) * 2;
      var b = util.createBuffer();
      for (var i = 0; i < 8; ++i) {
        if (!ip[i] || ip[i].length === 0) {
          b.fillWithByte(0, zeros);
          zeros = 0;
          continue;
        }
        var bytes = util.hexToBytes(ip[i]);
        if (bytes.length < 2) {
          b.putByte(0);
        }
        b.putBytes(bytes);
      }
      return b.getBytes();
    };
    util.bytesToIP = function(bytes) {
      if (bytes.length === 4) {
        return util.bytesToIPv4(bytes);
      }
      if (bytes.length === 16) {
        return util.bytesToIPv6(bytes);
      }
      return null;
    };
    util.bytesToIPv4 = function(bytes) {
      if (bytes.length !== 4) {
        return null;
      }
      var ip = [];
      for (var i = 0; i < bytes.length; ++i) {
        ip.push(bytes.charCodeAt(i));
      }
      return ip.join('.');
    };
    util.bytesToIPv6 = function(bytes) {
      if (bytes.length !== 16) {
        return null;
      }
      var ip = [];
      var zeroGroups = [];
      var zeroMaxGroup = 0;
      for (var i = 0; i < bytes.length; i += 2) {
        var hex = util.bytesToHex(bytes[i] + bytes[i + 1]);
        while (hex[0] === '0' && hex !== '0') {
          hex = hex.substr(1);
        }
        if (hex === '0') {
          var last = zeroGroups[zeroGroups.length - 1];
          var idx = ip.length;
          if (!last || idx !== last.end + 1) {
            zeroGroups.push({
              start: idx,
              end: idx
            });
          } else {
            last.end = idx;
            if ((last.end - last.start) > (zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start)) {
              zeroMaxGroup = zeroGroups.length - 1;
            }
          }
        }
        ip.push(hex);
      }
      if (zeroGroups.length > 0) {
        var group = zeroGroups[zeroMaxGroup];
        if (group.end - group.start > 0) {
          ip.splice(group.start, group.end - group.start + 1, '');
          if (group.start === 0) {
            ip.unshift('');
          }
          if (group.end === 7) {
            ip.push('');
          }
        }
      }
      return ip.join(':');
    };
    util.estimateCores = function(options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};
      if ('cores' in util && !options.update) {
        return callback(null, util.cores);
      }
      if (typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency > 0) {
        util.cores = navigator.hardwareConcurrency;
        return callback(null, util.cores);
      }
      if (typeof Worker === 'undefined') {
        util.cores = 1;
        return callback(null, util.cores);
      }
      if (typeof Blob === 'undefined') {
        util.cores = 2;
        return callback(null, util.cores);
      }
      var blobUrl = URL.createObjectURL(new Blob(['(', function() {
        self.addEventListener('message', function(e) {
          var st = Date.now();
          var et = st + 4;
          while (Date.now() < et)
            ;
          self.postMessage({
            st: st,
            et: et
          });
        });
      }.toString(), ')()'], {type: 'application/javascript'}));
      sample([], 5, 16);
      function sample(max, samples, numWorkers) {
        if (samples === 0) {
          var avg = Math.floor(max.reduce(function(avg, x) {
            return avg + x;
          }, 0) / max.length);
          util.cores = Math.max(1, avg);
          URL.revokeObjectURL(blobUrl);
          return callback(null, util.cores);
        }
        map(numWorkers, function(err, results) {
          max.push(reduce(numWorkers, results));
          sample(max, samples - 1, numWorkers);
        });
      }
      function map(numWorkers, callback) {
        var workers = [];
        var results = [];
        for (var i = 0; i < numWorkers; ++i) {
          var worker = new Worker(blobUrl);
          worker.addEventListener('message', function(e) {
            results.push(e.data);
            if (results.length === numWorkers) {
              for (var i = 0; i < numWorkers; ++i) {
                workers[i].terminate();
              }
              callback(null, results);
            }
          });
          workers.push(worker);
        }
        for (var i = 0; i < numWorkers; ++i) {
          workers[i].postMessage(i);
        }
      }
      function reduce(numWorkers, results) {
        var overlaps = [];
        for (var n = 0; n < numWorkers; ++n) {
          var r1 = results[n];
          var overlap = overlaps[n] = [];
          for (var i = 0; i < numWorkers; ++i) {
            if (n === i) {
              continue;
            }
            var r2 = results[i];
            if ((r1.st > r2.st && r1.st < r2.et) || (r2.st > r1.st && r2.st < r1.et)) {
              overlap.push(i);
            }
          }
        }
        return overlaps.reduce(function(max, overlap) {
          return Math.max(max, overlap.length);
        }, 0);
      }
    };
  }
  var name = 'util';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/util", [], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module);
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.cipher = forge.cipher || {};
    var modes = forge.cipher.modes = forge.cipher.modes || {};
    modes.ecb = function(options) {
      options = options || {};
      this.name = 'ECB';
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = new Array(this._ints);
      this._outBlock = new Array(this._ints);
    };
    modes.ecb.prototype.start = function(options) {};
    modes.ecb.prototype.encrypt = function(input, output, finish) {
      if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
        return true;
      }
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = input.getInt32();
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i]);
      }
    };
    modes.ecb.prototype.decrypt = function(input, output, finish) {
      if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
        return true;
      }
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = input.getInt32();
      }
      this.cipher.decrypt(this._inBlock, this._outBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i]);
      }
    };
    modes.ecb.prototype.pad = function(input, options) {
      var padding = (input.length() === this.blockSize ? this.blockSize : (this.blockSize - input.length()));
      input.fillWithByte(padding, padding);
      return true;
    };
    modes.ecb.prototype.unpad = function(output, options) {
      if (options.overflow > 0) {
        return false;
      }
      var len = output.length();
      var count = output.at(len - 1);
      if (count > (this.blockSize << 2)) {
        return false;
      }
      output.truncate(count);
      return true;
    };
    modes.cbc = function(options) {
      options = options || {};
      this.name = 'CBC';
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = new Array(this._ints);
      this._outBlock = new Array(this._ints);
    };
    modes.cbc.prototype.start = function(options) {
      if (options.iv === null) {
        if (!this._prev) {
          throw new Error('Invalid IV parameter.');
        }
        this._iv = this._prev.slice(0);
      } else if (!('iv' in options)) {
        throw new Error('Invalid IV parameter.');
      } else {
        this._iv = transformIV(options.iv);
        this._prev = this._iv.slice(0);
      }
    };
    modes.cbc.prototype.encrypt = function(input, output, finish) {
      if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
        return true;
      }
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = this._prev[i] ^ input.getInt32();
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i]);
      }
      this._prev = this._outBlock;
    };
    modes.cbc.prototype.decrypt = function(input, output, finish) {
      if (input.length() < this.blockSize && !(finish && input.length() > 0)) {
        return true;
      }
      for (var i = 0; i < this._ints; ++i) {
        this._inBlock[i] = input.getInt32();
      }
      this.cipher.decrypt(this._inBlock, this._outBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._prev[i] ^ this._outBlock[i]);
      }
      this._prev = this._inBlock.slice(0);
    };
    modes.cbc.prototype.pad = function(input, options) {
      var padding = (input.length() === this.blockSize ? this.blockSize : (this.blockSize - input.length()));
      input.fillWithByte(padding, padding);
      return true;
    };
    modes.cbc.prototype.unpad = function(output, options) {
      if (options.overflow > 0) {
        return false;
      }
      var len = output.length();
      var count = output.at(len - 1);
      if (count > (this.blockSize << 2)) {
        return false;
      }
      output.truncate(count);
      return true;
    };
    modes.cfb = function(options) {
      options = options || {};
      this.name = 'CFB';
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = null;
      this._outBlock = new Array(this._ints);
      this._partialBlock = new Array(this._ints);
      this._partialOutput = forge.util.createBuffer();
      this._partialBytes = 0;
    };
    modes.cfb.prototype.start = function(options) {
      if (!('iv' in options)) {
        throw new Error('Invalid IV parameter.');
      }
      this._iv = transformIV(options.iv);
      this._inBlock = this._iv.slice(0);
      this._partialBytes = 0;
    };
    modes.cfb.prototype.encrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32() ^ this._outBlock[i];
          output.putInt32(this._inBlock[i]);
        }
        return ;
      }
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0; i < this._ints; ++i) {
        this._partialBlock[i] = input.getInt32() ^ this._outBlock[i];
        this._partialOutput.putInt32(this._partialBlock[i]);
      }
      if (partialBytes > 0) {
        input.read -= this.blockSize;
      } else {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = this._partialBlock[i];
        }
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
      this._partialBytes = 0;
    };
    modes.cfb.prototype.decrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = input.getInt32();
          output.putInt32(this._inBlock[i] ^ this._outBlock[i]);
        }
        return ;
      }
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0; i < this._ints; ++i) {
        this._partialBlock[i] = input.getInt32();
        this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]);
      }
      if (partialBytes > 0) {
        input.read -= this.blockSize;
      } else {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = this._partialBlock[i];
        }
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
      this._partialBytes = 0;
    };
    modes.ofb = function(options) {
      options = options || {};
      this.name = 'OFB';
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = null;
      this._outBlock = new Array(this._ints);
      this._partialOutput = forge.util.createBuffer();
      this._partialBytes = 0;
    };
    modes.ofb.prototype.start = function(options) {
      if (!('iv' in options)) {
        throw new Error('Invalid IV parameter.');
      }
      this._iv = transformIV(options.iv);
      this._inBlock = this._iv.slice(0);
      this._partialBytes = 0;
    };
    modes.ofb.prototype.encrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (input.length() === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(input.getInt32() ^ this._outBlock[i]);
          this._inBlock[i] = this._outBlock[i];
        }
        return ;
      }
      var partialBytes = (this.blockSize - inputLength) % this.blockSize;
      if (partialBytes > 0) {
        partialBytes = this.blockSize - partialBytes;
      }
      this._partialOutput.clear();
      for (var i = 0; i < this._ints; ++i) {
        this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
      }
      if (partialBytes > 0) {
        input.read -= this.blockSize;
      } else {
        for (var i = 0; i < this._ints; ++i) {
          this._inBlock[i] = this._outBlock[i];
        }
      }
      if (this._partialBytes > 0) {
        this._partialOutput.getBytes(this._partialBytes);
      }
      if (partialBytes > 0 && !finish) {
        output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
        this._partialBytes = partialBytes;
        return true;
      }
      output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
      this._partialBytes = 0;
    };
    modes.ofb.prototype.decrypt = modes.ofb.prototype.encrypt;
    modes.ctr = function(options) {
      options = options || {};
      this.name = 'CTR';
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = null;
      this._outBlock = new Array(this._ints);
      this._partialOutput = forge.util.createBuffer();
      this._partialBytes = 0;
    };
    modes.ctr.prototype.start = function(options) {
      if (!('iv' in options)) {
        throw new Error('Invalid IV parameter.');
      }
      this._iv = transformIV(options.iv);
      this._inBlock = this._iv.slice(0);
      this._partialBytes = 0;
    };
    modes.ctr.prototype.encrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(input.getInt32() ^ this._outBlock[i]);
        }
      } else {
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
        }
        if (partialBytes > 0) {
          input.read -= this.blockSize;
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
        this._partialBytes = 0;
      }
      inc32(this._inBlock);
    };
    modes.ctr.prototype.decrypt = modes.ctr.prototype.encrypt;
    modes.gcm = function(options) {
      options = options || {};
      this.name = 'GCM';
      this.cipher = options.cipher;
      this.blockSize = options.blockSize || 16;
      this._ints = this.blockSize / 4;
      this._inBlock = new Array(this._ints);
      this._outBlock = new Array(this._ints);
      this._partialOutput = forge.util.createBuffer();
      this._partialBytes = 0;
      this._R = 0xE1000000;
    };
    modes.gcm.prototype.start = function(options) {
      if (!('iv' in options)) {
        throw new Error('Invalid IV parameter.');
      }
      var iv = forge.util.createBuffer(options.iv);
      this._cipherLength = 0;
      var additionalData;
      if ('additionalData' in options) {
        additionalData = forge.util.createBuffer(options.additionalData);
      } else {
        additionalData = forge.util.createBuffer();
      }
      if ('tagLength' in options) {
        this._tagLength = options.tagLength;
      } else {
        this._tagLength = 128;
      }
      this._tag = null;
      if (options.decrypt) {
        this._tag = forge.util.createBuffer(options.tag).getBytes();
        if (this._tag.length !== (this._tagLength / 8)) {
          throw new Error('Authentication tag does not match tag length.');
        }
      }
      this._hashBlock = new Array(this._ints);
      this.tag = null;
      this._hashSubkey = new Array(this._ints);
      this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey);
      this.componentBits = 4;
      this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
      var ivLength = iv.length();
      if (ivLength === 12) {
        this._j0 = [iv.getInt32(), iv.getInt32(), iv.getInt32(), 1];
      } else {
        this._j0 = [0, 0, 0, 0];
        while (iv.length() > 0) {
          this._j0 = this.ghash(this._hashSubkey, this._j0, [iv.getInt32(), iv.getInt32(), iv.getInt32(), iv.getInt32()]);
        }
        this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(from64To32(ivLength * 8)));
      }
      this._inBlock = this._j0.slice(0);
      inc32(this._inBlock);
      this._partialBytes = 0;
      additionalData = forge.util.createBuffer(additionalData);
      this._aDataLength = from64To32(additionalData.length() * 8);
      var overflow = additionalData.length() % this.blockSize;
      if (overflow) {
        additionalData.fillWithByte(0, this.blockSize - overflow);
      }
      this._s = [0, 0, 0, 0];
      while (additionalData.length() > 0) {
        this._s = this.ghash(this._hashSubkey, this._s, [additionalData.getInt32(), additionalData.getInt32(), additionalData.getInt32(), additionalData.getInt32()]);
      }
    };
    modes.gcm.prototype.encrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength === 0) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      if (this._partialBytes === 0 && inputLength >= this.blockSize) {
        for (var i = 0; i < this._ints; ++i) {
          output.putInt32(this._outBlock[i] ^= input.getInt32());
        }
        this._cipherLength += this.blockSize;
      } else {
        var partialBytes = (this.blockSize - inputLength) % this.blockSize;
        if (partialBytes > 0) {
          partialBytes = this.blockSize - partialBytes;
        }
        this._partialOutput.clear();
        for (var i = 0; i < this._ints; ++i) {
          this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
        }
        if (partialBytes === 0 || finish) {
          if (finish) {
            var overflow = inputLength % this.blockSize;
            this._cipherLength += overflow;
            this._partialOutput.truncate(this.blockSize - overflow);
          } else {
            this._cipherLength += this.blockSize;
          }
          for (var i = 0; i < this._ints; ++i) {
            this._outBlock[i] = this._partialOutput.getInt32();
          }
          this._partialOutput.read -= this.blockSize;
        }
        if (this._partialBytes > 0) {
          this._partialOutput.getBytes(this._partialBytes);
        }
        if (partialBytes > 0 && !finish) {
          input.read -= this.blockSize;
          output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
          this._partialBytes = partialBytes;
          return true;
        }
        output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
        this._partialBytes = 0;
      }
      this._s = this.ghash(this._hashSubkey, this._s, this._outBlock);
      inc32(this._inBlock);
    };
    modes.gcm.prototype.decrypt = function(input, output, finish) {
      var inputLength = input.length();
      if (inputLength < this.blockSize && !(finish && inputLength > 0)) {
        return true;
      }
      this.cipher.encrypt(this._inBlock, this._outBlock);
      inc32(this._inBlock);
      this._hashBlock[0] = input.getInt32();
      this._hashBlock[1] = input.getInt32();
      this._hashBlock[2] = input.getInt32();
      this._hashBlock[3] = input.getInt32();
      this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
      for (var i = 0; i < this._ints; ++i) {
        output.putInt32(this._outBlock[i] ^ this._hashBlock[i]);
      }
      if (inputLength < this.blockSize) {
        this._cipherLength += inputLength % this.blockSize;
      } else {
        this._cipherLength += this.blockSize;
      }
    };
    modes.gcm.prototype.afterFinish = function(output, options) {
      var rval = true;
      if (options.decrypt && options.overflow) {
        output.truncate(this.blockSize - options.overflow);
      }
      this.tag = forge.util.createBuffer();
      var lengths = this._aDataLength.concat(from64To32(this._cipherLength * 8));
      this._s = this.ghash(this._hashSubkey, this._s, lengths);
      var tag = [];
      this.cipher.encrypt(this._j0, tag);
      for (var i = 0; i < this._ints; ++i) {
        this.tag.putInt32(this._s[i] ^ tag[i]);
      }
      this.tag.truncate(this.tag.length() % (this._tagLength / 8));
      if (options.decrypt && this.tag.bytes() !== this._tag) {
        rval = false;
      }
      return rval;
    };
    modes.gcm.prototype.multiply = function(x, y) {
      var z_i = [0, 0, 0, 0];
      var v_i = y.slice(0);
      for (var i = 0; i < 128; ++i) {
        var x_i = x[(i / 32) | 0] & (1 << (31 - i % 32));
        if (x_i) {
          z_i[0] ^= v_i[0];
          z_i[1] ^= v_i[1];
          z_i[2] ^= v_i[2];
          z_i[3] ^= v_i[3];
        }
        this.pow(v_i, v_i);
      }
      return z_i;
    };
    modes.gcm.prototype.pow = function(x, out) {
      var lsb = x[3] & 1;
      for (var i = 3; i > 0; --i) {
        out[i] = (x[i] >>> 1) | ((x[i - 1] & 1) << 31);
      }
      out[0] = x[0] >>> 1;
      if (lsb) {
        out[0] ^= this._R;
      }
    };
    modes.gcm.prototype.tableMultiply = function(x) {
      var z = [0, 0, 0, 0];
      for (var i = 0; i < 32; ++i) {
        var idx = (i / 8) | 0;
        var x_i = (x[idx] >>> ((7 - (i % 8)) * 4)) & 0xF;
        var ah = this._m[i][x_i];
        z[0] ^= ah[0];
        z[1] ^= ah[1];
        z[2] ^= ah[2];
        z[3] ^= ah[3];
      }
      return z;
    };
    modes.gcm.prototype.ghash = function(h, y, x) {
      y[0] ^= x[0];
      y[1] ^= x[1];
      y[2] ^= x[2];
      y[3] ^= x[3];
      return this.tableMultiply(y);
    };
    modes.gcm.prototype.generateHashTable = function(h, bits) {
      var multiplier = 8 / bits;
      var perInt = 4 * multiplier;
      var size = 16 * multiplier;
      var m = new Array(size);
      for (var i = 0; i < size; ++i) {
        var tmp = [0, 0, 0, 0];
        var idx = (i / perInt) | 0;
        var shft = ((perInt - 1 - (i % perInt)) * bits);
        tmp[idx] = (1 << (bits - 1)) << shft;
        m[i] = this.generateSubHashTable(this.multiply(tmp, h), bits);
      }
      return m;
    };
    modes.gcm.prototype.generateSubHashTable = function(mid, bits) {
      var size = 1 << bits;
      var half = size >>> 1;
      var m = new Array(size);
      m[half] = mid.slice(0);
      var i = half >>> 1;
      while (i > 0) {
        this.pow(m[2 * i], m[i] = []);
        i >>= 1;
      }
      i = 2;
      while (i < half) {
        for (var j = 1; j < i; ++j) {
          var m_i = m[i];
          var m_j = m[j];
          m[i + j] = [m_i[0] ^ m_j[0], m_i[1] ^ m_j[1], m_i[2] ^ m_j[2], m_i[3] ^ m_j[3]];
        }
        i *= 2;
      }
      m[0] = [0, 0, 0, 0];
      for (i = half + 1; i < size; ++i) {
        var c = m[i ^ half];
        m[i] = [mid[0] ^ c[0], mid[1] ^ c[1], mid[2] ^ c[2], mid[3] ^ c[3]];
      }
      return m;
    };
    function transformIV(iv) {
      if (typeof iv === 'string') {
        iv = forge.util.createBuffer(iv);
      }
      if (forge.util.isArray(iv) && iv.length > 4) {
        var tmp = iv;
        iv = forge.util.createBuffer();
        for (var i = 0; i < tmp.length; ++i) {
          iv.putByte(tmp[i]);
        }
      }
      if (!forge.util.isArray(iv)) {
        iv = [iv.getInt32(), iv.getInt32(), iv.getInt32(), iv.getInt32()];
      }
      return iv;
    }
    function inc32(block) {
      block[block.length - 1] = (block[block.length - 1] + 1) & 0xFFFFFFFF;
    }
    function from64To32(num) {
      return [(num / 0x100000000) | 0, num & 0xFFFFFFFF];
    }
  }
  var name = 'cipherModes';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/cipherModes", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.pki = forge.pki || {};
    var oids = forge.pki.oids = forge.oids = forge.oids || {};
    oids['1.2.840.113549.1.1.1'] = 'rsaEncryption';
    oids['rsaEncryption'] = '1.2.840.113549.1.1.1';
    oids['1.2.840.113549.1.1.4'] = 'md5WithRSAEncryption';
    oids['md5WithRSAEncryption'] = '1.2.840.113549.1.1.4';
    oids['1.2.840.113549.1.1.5'] = 'sha1WithRSAEncryption';
    oids['sha1WithRSAEncryption'] = '1.2.840.113549.1.1.5';
    oids['1.2.840.113549.1.1.7'] = 'RSAES-OAEP';
    oids['RSAES-OAEP'] = '1.2.840.113549.1.1.7';
    oids['1.2.840.113549.1.1.8'] = 'mgf1';
    oids['mgf1'] = '1.2.840.113549.1.1.8';
    oids['1.2.840.113549.1.1.9'] = 'pSpecified';
    oids['pSpecified'] = '1.2.840.113549.1.1.9';
    oids['1.2.840.113549.1.1.10'] = 'RSASSA-PSS';
    oids['RSASSA-PSS'] = '1.2.840.113549.1.1.10';
    oids['1.2.840.113549.1.1.11'] = 'sha256WithRSAEncryption';
    oids['sha256WithRSAEncryption'] = '1.2.840.113549.1.1.11';
    oids['1.2.840.113549.1.1.12'] = 'sha384WithRSAEncryption';
    oids['sha384WithRSAEncryption'] = '1.2.840.113549.1.1.12';
    oids['1.2.840.113549.1.1.13'] = 'sha512WithRSAEncryption';
    oids['sha512WithRSAEncryption'] = '1.2.840.113549.1.1.13';
    oids['1.3.14.3.2.7'] = 'desCBC';
    oids['desCBC'] = '1.3.14.3.2.7';
    oids['1.3.14.3.2.26'] = 'sha1';
    oids['sha1'] = '1.3.14.3.2.26';
    oids['2.16.840.1.101.3.4.2.1'] = 'sha256';
    oids['sha256'] = '2.16.840.1.101.3.4.2.1';
    oids['2.16.840.1.101.3.4.2.2'] = 'sha384';
    oids['sha384'] = '2.16.840.1.101.3.4.2.2';
    oids['2.16.840.1.101.3.4.2.3'] = 'sha512';
    oids['sha512'] = '2.16.840.1.101.3.4.2.3';
    oids['1.2.840.113549.2.5'] = 'md5';
    oids['md5'] = '1.2.840.113549.2.5';
    oids['1.2.840.113549.1.7.1'] = 'data';
    oids['data'] = '1.2.840.113549.1.7.1';
    oids['1.2.840.113549.1.7.2'] = 'signedData';
    oids['signedData'] = '1.2.840.113549.1.7.2';
    oids['1.2.840.113549.1.7.3'] = 'envelopedData';
    oids['envelopedData'] = '1.2.840.113549.1.7.3';
    oids['1.2.840.113549.1.7.4'] = 'signedAndEnvelopedData';
    oids['signedAndEnvelopedData'] = '1.2.840.113549.1.7.4';
    oids['1.2.840.113549.1.7.5'] = 'digestedData';
    oids['digestedData'] = '1.2.840.113549.1.7.5';
    oids['1.2.840.113549.1.7.6'] = 'encryptedData';
    oids['encryptedData'] = '1.2.840.113549.1.7.6';
    oids['1.2.840.113549.1.9.1'] = 'emailAddress';
    oids['emailAddress'] = '1.2.840.113549.1.9.1';
    oids['1.2.840.113549.1.9.2'] = 'unstructuredName';
    oids['unstructuredName'] = '1.2.840.113549.1.9.2';
    oids['1.2.840.113549.1.9.3'] = 'contentType';
    oids['contentType'] = '1.2.840.113549.1.9.3';
    oids['1.2.840.113549.1.9.4'] = 'messageDigest';
    oids['messageDigest'] = '1.2.840.113549.1.9.4';
    oids['1.2.840.113549.1.9.5'] = 'signingTime';
    oids['signingTime'] = '1.2.840.113549.1.9.5';
    oids['1.2.840.113549.1.9.6'] = 'counterSignature';
    oids['counterSignature'] = '1.2.840.113549.1.9.6';
    oids['1.2.840.113549.1.9.7'] = 'challengePassword';
    oids['challengePassword'] = '1.2.840.113549.1.9.7';
    oids['1.2.840.113549.1.9.8'] = 'unstructuredAddress';
    oids['unstructuredAddress'] = '1.2.840.113549.1.9.8';
    oids['1.2.840.113549.1.9.14'] = 'extensionRequest';
    oids['extensionRequest'] = '1.2.840.113549.1.9.14';
    oids['1.2.840.113549.1.9.20'] = 'friendlyName';
    oids['friendlyName'] = '1.2.840.113549.1.9.20';
    oids['1.2.840.113549.1.9.21'] = 'localKeyId';
    oids['localKeyId'] = '1.2.840.113549.1.9.21';
    oids['1.2.840.113549.1.9.22.1'] = 'x509Certificate';
    oids['x509Certificate'] = '1.2.840.113549.1.9.22.1';
    oids['1.2.840.113549.1.12.10.1.1'] = 'keyBag';
    oids['keyBag'] = '1.2.840.113549.1.12.10.1.1';
    oids['1.2.840.113549.1.12.10.1.2'] = 'pkcs8ShroudedKeyBag';
    oids['pkcs8ShroudedKeyBag'] = '1.2.840.113549.1.12.10.1.2';
    oids['1.2.840.113549.1.12.10.1.3'] = 'certBag';
    oids['certBag'] = '1.2.840.113549.1.12.10.1.3';
    oids['1.2.840.113549.1.12.10.1.4'] = 'crlBag';
    oids['crlBag'] = '1.2.840.113549.1.12.10.1.4';
    oids['1.2.840.113549.1.12.10.1.5'] = 'secretBag';
    oids['secretBag'] = '1.2.840.113549.1.12.10.1.5';
    oids['1.2.840.113549.1.12.10.1.6'] = 'safeContentsBag';
    oids['safeContentsBag'] = '1.2.840.113549.1.12.10.1.6';
    oids['1.2.840.113549.1.5.13'] = 'pkcs5PBES2';
    oids['pkcs5PBES2'] = '1.2.840.113549.1.5.13';
    oids['1.2.840.113549.1.5.12'] = 'pkcs5PBKDF2';
    oids['pkcs5PBKDF2'] = '1.2.840.113549.1.5.12';
    oids['1.2.840.113549.1.12.1.1'] = 'pbeWithSHAAnd128BitRC4';
    oids['pbeWithSHAAnd128BitRC4'] = '1.2.840.113549.1.12.1.1';
    oids['1.2.840.113549.1.12.1.2'] = 'pbeWithSHAAnd40BitRC4';
    oids['pbeWithSHAAnd40BitRC4'] = '1.2.840.113549.1.12.1.2';
    oids['1.2.840.113549.1.12.1.3'] = 'pbeWithSHAAnd3-KeyTripleDES-CBC';
    oids['pbeWithSHAAnd3-KeyTripleDES-CBC'] = '1.2.840.113549.1.12.1.3';
    oids['1.2.840.113549.1.12.1.4'] = 'pbeWithSHAAnd2-KeyTripleDES-CBC';
    oids['pbeWithSHAAnd2-KeyTripleDES-CBC'] = '1.2.840.113549.1.12.1.4';
    oids['1.2.840.113549.1.12.1.5'] = 'pbeWithSHAAnd128BitRC2-CBC';
    oids['pbeWithSHAAnd128BitRC2-CBC'] = '1.2.840.113549.1.12.1.5';
    oids['1.2.840.113549.1.12.1.6'] = 'pbewithSHAAnd40BitRC2-CBC';
    oids['pbewithSHAAnd40BitRC2-CBC'] = '1.2.840.113549.1.12.1.6';
    oids['1.2.840.113549.3.7'] = 'des-EDE3-CBC';
    oids['des-EDE3-CBC'] = '1.2.840.113549.3.7';
    oids['2.16.840.1.101.3.4.1.2'] = 'aes128-CBC';
    oids['aes128-CBC'] = '2.16.840.1.101.3.4.1.2';
    oids['2.16.840.1.101.3.4.1.22'] = 'aes192-CBC';
    oids['aes192-CBC'] = '2.16.840.1.101.3.4.1.22';
    oids['2.16.840.1.101.3.4.1.42'] = 'aes256-CBC';
    oids['aes256-CBC'] = '2.16.840.1.101.3.4.1.42';
    oids['2.5.4.3'] = 'commonName';
    oids['commonName'] = '2.5.4.3';
    oids['2.5.4.5'] = 'serialName';
    oids['serialName'] = '2.5.4.5';
    oids['2.5.4.6'] = 'countryName';
    oids['countryName'] = '2.5.4.6';
    oids['2.5.4.7'] = 'localityName';
    oids['localityName'] = '2.5.4.7';
    oids['2.5.4.8'] = 'stateOrProvinceName';
    oids['stateOrProvinceName'] = '2.5.4.8';
    oids['2.5.4.10'] = 'organizationName';
    oids['organizationName'] = '2.5.4.10';
    oids['2.5.4.11'] = 'organizationalUnitName';
    oids['organizationalUnitName'] = '2.5.4.11';
    oids['2.16.840.1.113730.1.1'] = 'nsCertType';
    oids['nsCertType'] = '2.16.840.1.113730.1.1';
    oids['2.5.29.1'] = 'authorityKeyIdentifier';
    oids['2.5.29.2'] = 'keyAttributes';
    oids['2.5.29.3'] = 'certificatePolicies';
    oids['2.5.29.4'] = 'keyUsageRestriction';
    oids['2.5.29.5'] = 'policyMapping';
    oids['2.5.29.6'] = 'subtreesConstraint';
    oids['2.5.29.7'] = 'subjectAltName';
    oids['2.5.29.8'] = 'issuerAltName';
    oids['2.5.29.9'] = 'subjectDirectoryAttributes';
    oids['2.5.29.10'] = 'basicConstraints';
    oids['2.5.29.11'] = 'nameConstraints';
    oids['2.5.29.12'] = 'policyConstraints';
    oids['2.5.29.13'] = 'basicConstraints';
    oids['2.5.29.14'] = 'subjectKeyIdentifier';
    oids['subjectKeyIdentifier'] = '2.5.29.14';
    oids['2.5.29.15'] = 'keyUsage';
    oids['keyUsage'] = '2.5.29.15';
    oids['2.5.29.16'] = 'privateKeyUsagePeriod';
    oids['2.5.29.17'] = 'subjectAltName';
    oids['subjectAltName'] = '2.5.29.17';
    oids['2.5.29.18'] = 'issuerAltName';
    oids['issuerAltName'] = '2.5.29.18';
    oids['2.5.29.19'] = 'basicConstraints';
    oids['basicConstraints'] = '2.5.29.19';
    oids['2.5.29.20'] = 'cRLNumber';
    oids['2.5.29.21'] = 'cRLReason';
    oids['2.5.29.22'] = 'expirationDate';
    oids['2.5.29.23'] = 'instructionCode';
    oids['2.5.29.24'] = 'invalidityDate';
    oids['2.5.29.25'] = 'cRLDistributionPoints';
    oids['2.5.29.26'] = 'issuingDistributionPoint';
    oids['2.5.29.27'] = 'deltaCRLIndicator';
    oids['2.5.29.28'] = 'issuingDistributionPoint';
    oids['2.5.29.29'] = 'certificateIssuer';
    oids['2.5.29.30'] = 'nameConstraints';
    oids['2.5.29.31'] = 'cRLDistributionPoints';
    oids['2.5.29.32'] = 'certificatePolicies';
    oids['2.5.29.33'] = 'policyMappings';
    oids['2.5.29.34'] = 'policyConstraints';
    oids['2.5.29.35'] = 'authorityKeyIdentifier';
    oids['2.5.29.36'] = 'policyConstraints';
    oids['2.5.29.37'] = 'extKeyUsage';
    oids['extKeyUsage'] = '2.5.29.37';
    oids['2.5.29.46'] = 'freshestCRL';
    oids['2.5.29.54'] = 'inhibitAnyPolicy';
    oids['1.3.6.1.5.5.7.3.1'] = 'serverAuth';
    oids['serverAuth'] = '1.3.6.1.5.5.7.3.1';
    oids['1.3.6.1.5.5.7.3.2'] = 'clientAuth';
    oids['clientAuth'] = '1.3.6.1.5.5.7.3.2';
    oids['1.3.6.1.5.5.7.3.3'] = 'codeSigning';
    oids['codeSigning'] = '1.3.6.1.5.5.7.3.3';
    oids['1.3.6.1.5.5.7.3.4'] = 'emailProtection';
    oids['emailProtection'] = '1.3.6.1.5.5.7.3.4';
    oids['1.3.6.1.5.5.7.3.8'] = 'timeStamping';
    oids['timeStamping'] = '1.3.6.1.5.5.7.3.8';
  }
  var name = 'oids';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/oids", [], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module);
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var md5 = forge.md5 = forge.md5 || {};
    forge.md = forge.md || {};
    forge.md.algorithms = forge.md.algorithms || {};
    forge.md.md5 = forge.md.algorithms.md5 = md5;
    md5.create = function() {
      if (!_initialized) {
        _init();
      }
      var _state = null;
      var _input = forge.util.createBuffer();
      var _w = new Array(16);
      var md = {
        algorithm: 'md5',
        blockLength: 64,
        digestLength: 16,
        messageLength: 0,
        messageLength64: [0, 0]
      };
      md.start = function() {
        md.messageLength = 0;
        md.messageLength64 = [0, 0];
        _input = forge.util.createBuffer();
        _state = {
          h0: 0x67452301,
          h1: 0xEFCDAB89,
          h2: 0x98BADCFE,
          h3: 0x10325476
        };
        return md;
      };
      md.start();
      md.update = function(msg, encoding) {
        if (encoding === 'utf8') {
          msg = forge.util.encodeUtf8(msg);
        }
        md.messageLength += msg.length;
        md.messageLength64[0] += (msg.length / 0x100000000) >>> 0;
        md.messageLength64[1] += msg.length >>> 0;
        _input.putBytes(msg);
        _update(_state, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
          _input.compact();
        }
        return md;
      };
      md.digest = function() {
        var padBytes = forge.util.createBuffer();
        padBytes.putBytes(_input.bytes());
        padBytes.putBytes(_padding.substr(0, 64 - ((md.messageLength64[1] + 8) & 0x3F)));
        padBytes.putInt32Le(md.messageLength64[1] << 3);
        padBytes.putInt32Le((md.messageLength64[0] << 3) | (md.messageLength64[0] >>> 28));
        var s2 = {
          h0: _state.h0,
          h1: _state.h1,
          h2: _state.h2,
          h3: _state.h3
        };
        _update(s2, _w, padBytes);
        var rval = forge.util.createBuffer();
        rval.putInt32Le(s2.h0);
        rval.putInt32Le(s2.h1);
        rval.putInt32Le(s2.h2);
        rval.putInt32Le(s2.h3);
        return rval;
      };
      return md;
    };
    var _padding = null;
    var _g = null;
    var _r = null;
    var _k = null;
    var _initialized = false;
    function _init() {
      _padding = String.fromCharCode(128);
      _padding += forge.util.fillString(String.fromCharCode(0x00), 64);
      _g = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 6, 11, 0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 5, 8, 11, 14, 1, 4, 7, 10, 13, 0, 3, 6, 9, 12, 15, 2, 0, 7, 14, 5, 12, 3, 10, 1, 8, 15, 6, 13, 4, 11, 2, 9];
      _r = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];
      _k = new Array(64);
      for (var i = 0; i < 64; ++i) {
        _k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
      }
      _initialized = true;
    }
    function _update(s, w, bytes) {
      var t,
          a,
          b,
          c,
          d,
          f,
          r,
          i;
      var len = bytes.length();
      while (len >= 64) {
        a = s.h0;
        b = s.h1;
        c = s.h2;
        d = s.h3;
        for (i = 0; i < 16; ++i) {
          w[i] = bytes.getInt32Le();
          f = d ^ (b & (c ^ d));
          t = (a + f + _k[i] + w[i]);
          r = _r[i];
          a = d;
          d = c;
          c = b;
          b += (t << r) | (t >>> (32 - r));
        }
        for (; i < 32; ++i) {
          f = c ^ (d & (b ^ c));
          t = (a + f + _k[i] + w[_g[i]]);
          r = _r[i];
          a = d;
          d = c;
          c = b;
          b += (t << r) | (t >>> (32 - r));
        }
        for (; i < 48; ++i) {
          f = b ^ c ^ d;
          t = (a + f + _k[i] + w[_g[i]]);
          r = _r[i];
          a = d;
          d = c;
          c = b;
          b += (t << r) | (t >>> (32 - r));
        }
        for (; i < 64; ++i) {
          f = c ^ (b | ~d);
          t = (a + f + _k[i] + w[_g[i]]);
          r = _r[i];
          a = d;
          d = c;
          c = b;
          b += (t << r) | (t >>> (32 - r));
        }
        s.h0 = (s.h0 + a) | 0;
        s.h1 = (s.h1 + b) | 0;
        s.h2 = (s.h2 + c) | 0;
        s.h3 = (s.h3 + d) | 0;
        len -= 64;
      }
    }
  }
  var name = 'md5';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/md5", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var sha1 = forge.sha1 = forge.sha1 || {};
    forge.md = forge.md || {};
    forge.md.algorithms = forge.md.algorithms || {};
    forge.md.sha1 = forge.md.algorithms.sha1 = sha1;
    sha1.create = function() {
      if (!_initialized) {
        _init();
      }
      var _state = null;
      var _input = forge.util.createBuffer();
      var _w = new Array(80);
      var md = {
        algorithm: 'sha1',
        blockLength: 64,
        digestLength: 20,
        messageLength: 0,
        messageLength64: [0, 0]
      };
      md.start = function() {
        md.messageLength = 0;
        md.messageLength64 = [0, 0];
        _input = forge.util.createBuffer();
        _state = {
          h0: 0x67452301,
          h1: 0xEFCDAB89,
          h2: 0x98BADCFE,
          h3: 0x10325476,
          h4: 0xC3D2E1F0
        };
        return md;
      };
      md.start();
      md.update = function(msg, encoding) {
        if (encoding === 'utf8') {
          msg = forge.util.encodeUtf8(msg);
        }
        md.messageLength += msg.length;
        md.messageLength64[0] += (msg.length / 0x100000000) >>> 0;
        md.messageLength64[1] += msg.length >>> 0;
        _input.putBytes(msg);
        _update(_state, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
          _input.compact();
        }
        return md;
      };
      md.digest = function() {
        var padBytes = forge.util.createBuffer();
        padBytes.putBytes(_input.bytes());
        padBytes.putBytes(_padding.substr(0, 64 - ((md.messageLength64[1] + 8) & 0x3F)));
        padBytes.putInt32((md.messageLength64[0] << 3) | (md.messageLength64[0] >>> 28));
        padBytes.putInt32(md.messageLength64[1] << 3);
        var s2 = {
          h0: _state.h0,
          h1: _state.h1,
          h2: _state.h2,
          h3: _state.h3,
          h4: _state.h4
        };
        _update(s2, _w, padBytes);
        var rval = forge.util.createBuffer();
        rval.putInt32(s2.h0);
        rval.putInt32(s2.h1);
        rval.putInt32(s2.h2);
        rval.putInt32(s2.h3);
        rval.putInt32(s2.h4);
        return rval;
      };
      return md;
    };
    var _padding = null;
    var _initialized = false;
    function _init() {
      _padding = String.fromCharCode(128);
      _padding += forge.util.fillString(String.fromCharCode(0x00), 64);
      _initialized = true;
    }
    function _update(s, w, bytes) {
      var t,
          a,
          b,
          c,
          d,
          e,
          f,
          i;
      var len = bytes.length();
      while (len >= 64) {
        a = s.h0;
        b = s.h1;
        c = s.h2;
        d = s.h3;
        e = s.h4;
        for (i = 0; i < 16; ++i) {
          t = bytes.getInt32();
          w[i] = t;
          f = d ^ (b & (c ^ d));
          t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + t;
          e = d;
          d = c;
          c = (b << 30) | (b >>> 2);
          b = a;
          a = t;
        }
        for (; i < 20; ++i) {
          t = (w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]);
          t = (t << 1) | (t >>> 31);
          w[i] = t;
          f = d ^ (b & (c ^ d));
          t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + t;
          e = d;
          d = c;
          c = (b << 30) | (b >>> 2);
          b = a;
          a = t;
        }
        for (; i < 32; ++i) {
          t = (w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]);
          t = (t << 1) | (t >>> 31);
          w[i] = t;
          f = b ^ c ^ d;
          t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
          e = d;
          d = c;
          c = (b << 30) | (b >>> 2);
          b = a;
          a = t;
        }
        for (; i < 40; ++i) {
          t = (w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32]);
          t = (t << 2) | (t >>> 30);
          w[i] = t;
          f = b ^ c ^ d;
          t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
          e = d;
          d = c;
          c = (b << 30) | (b >>> 2);
          b = a;
          a = t;
        }
        for (; i < 60; ++i) {
          t = (w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32]);
          t = (t << 2) | (t >>> 30);
          w[i] = t;
          f = (b & c) | (d & (b ^ c));
          t = ((a << 5) | (a >>> 27)) + f + e + 0x8F1BBCDC + t;
          e = d;
          d = c;
          c = (b << 30) | (b >>> 2);
          b = a;
          a = t;
        }
        for (; i < 80; ++i) {
          t = (w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32]);
          t = (t << 2) | (t >>> 30);
          w[i] = t;
          f = b ^ c ^ d;
          t = ((a << 5) | (a >>> 27)) + f + e + 0xCA62C1D6 + t;
          e = d;
          d = c;
          c = (b << 30) | (b >>> 2);
          b = a;
          a = t;
        }
        s.h0 = (s.h0 + a) | 0;
        s.h1 = (s.h1 + b) | 0;
        s.h2 = (s.h2 + c) | 0;
        s.h3 = (s.h3 + d) | 0;
        s.h4 = (s.h4 + e) | 0;
        len -= 64;
      }
    }
  }
  var name = 'sha1';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/sha1", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var sha256 = forge.sha256 = forge.sha256 || {};
    forge.md = forge.md || {};
    forge.md.algorithms = forge.md.algorithms || {};
    forge.md.sha256 = forge.md.algorithms.sha256 = sha256;
    sha256.create = function() {
      if (!_initialized) {
        _init();
      }
      var _state = null;
      var _input = forge.util.createBuffer();
      var _w = new Array(64);
      var md = {
        algorithm: 'sha256',
        blockLength: 64,
        digestLength: 32,
        messageLength: 0,
        messageLength64: [0, 0]
      };
      md.start = function() {
        md.messageLength = 0;
        md.messageLength64 = [0, 0];
        _input = forge.util.createBuffer();
        _state = {
          h0: 0x6A09E667,
          h1: 0xBB67AE85,
          h2: 0x3C6EF372,
          h3: 0xA54FF53A,
          h4: 0x510E527F,
          h5: 0x9B05688C,
          h6: 0x1F83D9AB,
          h7: 0x5BE0CD19
        };
        return md;
      };
      md.start();
      md.update = function(msg, encoding) {
        if (encoding === 'utf8') {
          msg = forge.util.encodeUtf8(msg);
        }
        md.messageLength += msg.length;
        md.messageLength64[0] += (msg.length / 0x100000000) >>> 0;
        md.messageLength64[1] += msg.length >>> 0;
        _input.putBytes(msg);
        _update(_state, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
          _input.compact();
        }
        return md;
      };
      md.digest = function() {
        var padBytes = forge.util.createBuffer();
        padBytes.putBytes(_input.bytes());
        padBytes.putBytes(_padding.substr(0, 64 - ((md.messageLength64[1] + 8) & 0x3F)));
        padBytes.putInt32((md.messageLength64[0] << 3) | (md.messageLength64[0] >>> 28));
        padBytes.putInt32(md.messageLength64[1] << 3);
        var s2 = {
          h0: _state.h0,
          h1: _state.h1,
          h2: _state.h2,
          h3: _state.h3,
          h4: _state.h4,
          h5: _state.h5,
          h6: _state.h6,
          h7: _state.h7
        };
        _update(s2, _w, padBytes);
        var rval = forge.util.createBuffer();
        rval.putInt32(s2.h0);
        rval.putInt32(s2.h1);
        rval.putInt32(s2.h2);
        rval.putInt32(s2.h3);
        rval.putInt32(s2.h4);
        rval.putInt32(s2.h5);
        rval.putInt32(s2.h6);
        rval.putInt32(s2.h7);
        return rval;
      };
      return md;
    };
    var _padding = null;
    var _initialized = false;
    var _k = null;
    function _init() {
      _padding = String.fromCharCode(128);
      _padding += forge.util.fillString(String.fromCharCode(0x00), 64);
      _k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
      _initialized = true;
    }
    function _update(s, w, bytes) {
      var t1,
          t2,
          s0,
          s1,
          ch,
          maj,
          i,
          a,
          b,
          c,
          d,
          e,
          f,
          g,
          h;
      var len = bytes.length();
      while (len >= 64) {
        for (i = 0; i < 16; ++i) {
          w[i] = bytes.getInt32();
        }
        for (; i < 64; ++i) {
          t1 = w[i - 2];
          t1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
          t2 = w[i - 15];
          t2 = ((t2 >>> 7) | (t2 << 25)) ^ ((t2 >>> 18) | (t2 << 14)) ^ (t2 >>> 3);
          w[i] = (t1 + w[i - 7] + t2 + w[i - 16]) | 0;
        }
        a = s.h0;
        b = s.h1;
        c = s.h2;
        d = s.h3;
        e = s.h4;
        f = s.h5;
        g = s.h6;
        h = s.h7;
        for (i = 0; i < 64; ++i) {
          s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
          ch = g ^ (e & (f ^ g));
          s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
          maj = (a & b) | (c & (a ^ b));
          t1 = h + s1 + ch + _k[i] + w[i];
          t2 = s0 + maj;
          h = g;
          g = f;
          f = e;
          e = (d + t1) | 0;
          d = c;
          c = b;
          b = a;
          a = (t1 + t2) | 0;
        }
        s.h0 = (s.h0 + a) | 0;
        s.h1 = (s.h1 + b) | 0;
        s.h2 = (s.h2 + c) | 0;
        s.h3 = (s.h3 + d) | 0;
        s.h4 = (s.h4 + e) | 0;
        s.h5 = (s.h5 + f) | 0;
        s.h6 = (s.h6 + g) | 0;
        s.h7 = (s.h7 + h) | 0;
        len -= 64;
      }
    }
  }
  var name = 'sha256';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/sha256", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var sha512 = forge.sha512 = forge.sha512 || {};
    forge.md = forge.md || {};
    forge.md.algorithms = forge.md.algorithms || {};
    forge.md.sha512 = forge.md.algorithms.sha512 = sha512;
    var sha384 = forge.sha384 = forge.sha512.sha384 = forge.sha512.sha384 || {};
    sha384.create = function() {
      return sha512.create('SHA-384');
    };
    forge.md.sha384 = forge.md.algorithms.sha384 = sha384;
    forge.sha512.sha256 = forge.sha512.sha256 || {create: function() {
        return sha512.create('SHA-512/256');
      }};
    forge.md['sha512/256'] = forge.md.algorithms['sha512/256'] = forge.sha512.sha256;
    forge.sha512.sha224 = forge.sha512.sha224 || {create: function() {
        return sha512.create('SHA-512/224');
      }};
    forge.md['sha512/224'] = forge.md.algorithms['sha512/224'] = forge.sha512.sha224;
    sha512.create = function(algorithm) {
      if (!_initialized) {
        _init();
      }
      if (typeof algorithm === 'undefined') {
        algorithm = 'SHA-512';
      }
      if (!(algorithm in _states)) {
        throw new Error('Invalid SHA-512 algorithm: ' + algorithm);
      }
      var _state = _states[algorithm];
      var _h = null;
      var _input = forge.util.createBuffer();
      var _w = new Array(80);
      for (var wi = 0; wi < 80; ++wi) {
        _w[wi] = new Array(2);
      }
      var md = {
        algorithm: algorithm.replace('-', '').toLowerCase(),
        blockLength: 128,
        digestLength: 64,
        messageLength: 0,
        messageLength128: [0, 0, 0, 0]
      };
      md.start = function() {
        md.messageLength = 0;
        md.messageLength128 = [0, 0, 0, 0];
        _input = forge.util.createBuffer();
        _h = new Array(_state.length);
        for (var i = 0; i < _state.length; ++i) {
          _h[i] = _state[i].slice(0);
        }
        return md;
      };
      md.start();
      md.update = function(msg, encoding) {
        if (encoding === 'utf8') {
          msg = forge.util.encodeUtf8(msg);
        }
        md.messageLength += msg.length;
        var len = msg.length;
        len = [(len / 0x100000000) >>> 0, len >>> 0];
        for (var i = 3; i >= 0; --i) {
          md.messageLength128[i] += len[1];
          len[1] = len[0] + ((md.messageLength128[i] / 0x100000000) >>> 0);
          md.messageLength128[i] = md.messageLength128[i] >>> 0;
          len[0] = ((len[1] / 0x100000000) >>> 0);
        }
        _input.putBytes(msg);
        _update(_h, _w, _input);
        if (_input.read > 2048 || _input.length() === 0) {
          _input.compact();
        }
        return md;
      };
      md.digest = function() {
        var padBytes = forge.util.createBuffer();
        padBytes.putBytes(_input.bytes());
        padBytes.putBytes(_padding.substr(0, 128 - ((md.messageLength128[3] + 16) & 0x7F)));
        var bitLength = [];
        for (var i = 0; i < 3; ++i) {
          bitLength[i] = ((md.messageLength128[i] << 3) | (md.messageLength128[i - 1] >>> 28));
        }
        bitLength[3] = md.messageLength128[3] << 3;
        padBytes.putInt32(bitLength[0]);
        padBytes.putInt32(bitLength[1]);
        padBytes.putInt32(bitLength[2]);
        padBytes.putInt32(bitLength[3]);
        var h = new Array(_h.length);
        for (var i = 0; i < _h.length; ++i) {
          h[i] = _h[i].slice(0);
        }
        _update(h, _w, padBytes);
        var rval = forge.util.createBuffer();
        var hlen;
        if (algorithm === 'SHA-512') {
          hlen = h.length;
        } else if (algorithm === 'SHA-384') {
          hlen = h.length - 2;
        } else {
          hlen = h.length - 4;
        }
        for (var i = 0; i < hlen; ++i) {
          rval.putInt32(h[i][0]);
          if (i !== hlen - 1 || algorithm !== 'SHA-512/224') {
            rval.putInt32(h[i][1]);
          }
        }
        return rval;
      };
      return md;
    };
    var _padding = null;
    var _initialized = false;
    var _k = null;
    var _states = null;
    function _init() {
      _padding = String.fromCharCode(128);
      _padding += forge.util.fillString(String.fromCharCode(0x00), 128);
      _k = [[0x428a2f98, 0xd728ae22], [0x71374491, 0x23ef65cd], [0xb5c0fbcf, 0xec4d3b2f], [0xe9b5dba5, 0x8189dbbc], [0x3956c25b, 0xf348b538], [0x59f111f1, 0xb605d019], [0x923f82a4, 0xaf194f9b], [0xab1c5ed5, 0xda6d8118], [0xd807aa98, 0xa3030242], [0x12835b01, 0x45706fbe], [0x243185be, 0x4ee4b28c], [0x550c7dc3, 0xd5ffb4e2], [0x72be5d74, 0xf27b896f], [0x80deb1fe, 0x3b1696b1], [0x9bdc06a7, 0x25c71235], [0xc19bf174, 0xcf692694], [0xe49b69c1, 0x9ef14ad2], [0xefbe4786, 0x384f25e3], [0x0fc19dc6, 0x8b8cd5b5], [0x240ca1cc, 0x77ac9c65], [0x2de92c6f, 0x592b0275], [0x4a7484aa, 0x6ea6e483], [0x5cb0a9dc, 0xbd41fbd4], [0x76f988da, 0x831153b5], [0x983e5152, 0xee66dfab], [0xa831c66d, 0x2db43210], [0xb00327c8, 0x98fb213f], [0xbf597fc7, 0xbeef0ee4], [0xc6e00bf3, 0x3da88fc2], [0xd5a79147, 0x930aa725], [0x06ca6351, 0xe003826f], [0x14292967, 0x0a0e6e70], [0x27b70a85, 0x46d22ffc], [0x2e1b2138, 0x5c26c926], [0x4d2c6dfc, 0x5ac42aed], [0x53380d13, 0x9d95b3df], [0x650a7354, 0x8baf63de], [0x766a0abb, 0x3c77b2a8], [0x81c2c92e, 0x47edaee6], [0x92722c85, 0x1482353b], [0xa2bfe8a1, 0x4cf10364], [0xa81a664b, 0xbc423001], [0xc24b8b70, 0xd0f89791], [0xc76c51a3, 0x0654be30], [0xd192e819, 0xd6ef5218], [0xd6990624, 0x5565a910], [0xf40e3585, 0x5771202a], [0x106aa070, 0x32bbd1b8], [0x19a4c116, 0xb8d2d0c8], [0x1e376c08, 0x5141ab53], [0x2748774c, 0xdf8eeb99], [0x34b0bcb5, 0xe19b48a8], [0x391c0cb3, 0xc5c95a63], [0x4ed8aa4a, 0xe3418acb], [0x5b9cca4f, 0x7763e373], [0x682e6ff3, 0xd6b2b8a3], [0x748f82ee, 0x5defb2fc], [0x78a5636f, 0x43172f60], [0x84c87814, 0xa1f0ab72], [0x8cc70208, 0x1a6439ec], [0x90befffa, 0x23631e28], [0xa4506ceb, 0xde82bde9], [0xbef9a3f7, 0xb2c67915], [0xc67178f2, 0xe372532b], [0xca273ece, 0xea26619c], [0xd186b8c7, 0x21c0c207], [0xeada7dd6, 0xcde0eb1e], [0xf57d4f7f, 0xee6ed178], [0x06f067aa, 0x72176fba], [0x0a637dc5, 0xa2c898a6], [0x113f9804, 0xbef90dae], [0x1b710b35, 0x131c471b], [0x28db77f5, 0x23047d84], [0x32caab7b, 0x40c72493], [0x3c9ebe0a, 0x15c9bebc], [0x431d67c4, 0x9c100d4c], [0x4cc5d4be, 0xcb3e42b6], [0x597f299c, 0xfc657e2a], [0x5fcb6fab, 0x3ad6faec], [0x6c44198c, 0x4a475817]];
      _states = {};
      _states['SHA-512'] = [[0x6a09e667, 0xf3bcc908], [0xbb67ae85, 0x84caa73b], [0x3c6ef372, 0xfe94f82b], [0xa54ff53a, 0x5f1d36f1], [0x510e527f, 0xade682d1], [0x9b05688c, 0x2b3e6c1f], [0x1f83d9ab, 0xfb41bd6b], [0x5be0cd19, 0x137e2179]];
      _states['SHA-384'] = [[0xcbbb9d5d, 0xc1059ed8], [0x629a292a, 0x367cd507], [0x9159015a, 0x3070dd17], [0x152fecd8, 0xf70e5939], [0x67332667, 0xffc00b31], [0x8eb44a87, 0x68581511], [0xdb0c2e0d, 0x64f98fa7], [0x47b5481d, 0xbefa4fa4]];
      _states['SHA-512/256'] = [[0x22312194, 0xFC2BF72C], [0x9F555FA3, 0xC84C64C2], [0x2393B86B, 0x6F53B151], [0x96387719, 0x5940EABD], [0x96283EE2, 0xA88EFFE3], [0xBE5E1E25, 0x53863992], [0x2B0199FC, 0x2C85B8AA], [0x0EB72DDC, 0x81C52CA2]];
      _states['SHA-512/224'] = [[0x8C3D37C8, 0x19544DA2], [0x73E19966, 0x89DCD4D6], [0x1DFAB7AE, 0x32FF9C82], [0x679DD514, 0x582F9FCF], [0x0F6D2B69, 0x7BD44DA8], [0x77E36F73, 0x04C48942], [0x3F9D85A8, 0x6A1D36C8], [0x1112E6AD, 0x91D692A1]];
      _initialized = true;
    }
    function _update(s, w, bytes) {
      var t1_hi,
          t1_lo;
      var t2_hi,
          t2_lo;
      var s0_hi,
          s0_lo;
      var s1_hi,
          s1_lo;
      var ch_hi,
          ch_lo;
      var maj_hi,
          maj_lo;
      var a_hi,
          a_lo;
      var b_hi,
          b_lo;
      var c_hi,
          c_lo;
      var d_hi,
          d_lo;
      var e_hi,
          e_lo;
      var f_hi,
          f_lo;
      var g_hi,
          g_lo;
      var h_hi,
          h_lo;
      var i,
          hi,
          lo,
          w2,
          w7,
          w15,
          w16;
      var len = bytes.length();
      while (len >= 128) {
        for (i = 0; i < 16; ++i) {
          w[i][0] = bytes.getInt32() >>> 0;
          w[i][1] = bytes.getInt32() >>> 0;
        }
        for (; i < 80; ++i) {
          w2 = w[i - 2];
          hi = w2[0];
          lo = w2[1];
          t1_hi = (((hi >>> 19) | (lo << 13)) ^ ((lo >>> 29) | (hi << 3)) ^ (hi >>> 6)) >>> 0;
          t1_lo = (((hi << 13) | (lo >>> 19)) ^ ((lo << 3) | (hi >>> 29)) ^ ((hi << 26) | (lo >>> 6))) >>> 0;
          w15 = w[i - 15];
          hi = w15[0];
          lo = w15[1];
          t2_hi = (((hi >>> 1) | (lo << 31)) ^ ((hi >>> 8) | (lo << 24)) ^ (hi >>> 7)) >>> 0;
          t2_lo = (((hi << 31) | (lo >>> 1)) ^ ((hi << 24) | (lo >>> 8)) ^ ((hi << 25) | (lo >>> 7))) >>> 0;
          w7 = w[i - 7];
          w16 = w[i - 16];
          lo = (t1_lo + w7[1] + t2_lo + w16[1]);
          w[i][0] = (t1_hi + w7[0] + t2_hi + w16[0] + ((lo / 0x100000000) >>> 0)) >>> 0;
          w[i][1] = lo >>> 0;
        }
        a_hi = s[0][0];
        a_lo = s[0][1];
        b_hi = s[1][0];
        b_lo = s[1][1];
        c_hi = s[2][0];
        c_lo = s[2][1];
        d_hi = s[3][0];
        d_lo = s[3][1];
        e_hi = s[4][0];
        e_lo = s[4][1];
        f_hi = s[5][0];
        f_lo = s[5][1];
        g_hi = s[6][0];
        g_lo = s[6][1];
        h_hi = s[7][0];
        h_lo = s[7][1];
        for (i = 0; i < 80; ++i) {
          s1_hi = (((e_hi >>> 14) | (e_lo << 18)) ^ ((e_hi >>> 18) | (e_lo << 14)) ^ ((e_lo >>> 9) | (e_hi << 23))) >>> 0;
          s1_lo = (((e_hi << 18) | (e_lo >>> 14)) ^ ((e_hi << 14) | (e_lo >>> 18)) ^ ((e_lo << 23) | (e_hi >>> 9))) >>> 0;
          ch_hi = (g_hi ^ (e_hi & (f_hi ^ g_hi))) >>> 0;
          ch_lo = (g_lo ^ (e_lo & (f_lo ^ g_lo))) >>> 0;
          s0_hi = (((a_hi >>> 28) | (a_lo << 4)) ^ ((a_lo >>> 2) | (a_hi << 30)) ^ ((a_lo >>> 7) | (a_hi << 25))) >>> 0;
          s0_lo = (((a_hi << 4) | (a_lo >>> 28)) ^ ((a_lo << 30) | (a_hi >>> 2)) ^ ((a_lo << 25) | (a_hi >>> 7))) >>> 0;
          maj_hi = ((a_hi & b_hi) | (c_hi & (a_hi ^ b_hi))) >>> 0;
          maj_lo = ((a_lo & b_lo) | (c_lo & (a_lo ^ b_lo))) >>> 0;
          lo = (h_lo + s1_lo + ch_lo + _k[i][1] + w[i][1]);
          t1_hi = (h_hi + s1_hi + ch_hi + _k[i][0] + w[i][0] + ((lo / 0x100000000) >>> 0)) >>> 0;
          t1_lo = lo >>> 0;
          lo = s0_lo + maj_lo;
          t2_hi = (s0_hi + maj_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
          t2_lo = lo >>> 0;
          h_hi = g_hi;
          h_lo = g_lo;
          g_hi = f_hi;
          g_lo = f_lo;
          f_hi = e_hi;
          f_lo = e_lo;
          lo = d_lo + t1_lo;
          e_hi = (d_hi + t1_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
          e_lo = lo >>> 0;
          d_hi = c_hi;
          d_lo = c_lo;
          c_hi = b_hi;
          c_lo = b_lo;
          b_hi = a_hi;
          b_lo = a_lo;
          lo = t1_lo + t2_lo;
          a_hi = (t1_hi + t2_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
          a_lo = lo >>> 0;
        }
        lo = s[0][1] + a_lo;
        s[0][0] = (s[0][0] + a_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
        s[0][1] = lo >>> 0;
        lo = s[1][1] + b_lo;
        s[1][0] = (s[1][0] + b_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
        s[1][1] = lo >>> 0;
        lo = s[2][1] + c_lo;
        s[2][0] = (s[2][0] + c_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
        s[2][1] = lo >>> 0;
        lo = s[3][1] + d_lo;
        s[3][0] = (s[3][0] + d_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
        s[3][1] = lo >>> 0;
        lo = s[4][1] + e_lo;
        s[4][0] = (s[4][0] + e_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
        s[4][1] = lo >>> 0;
        lo = s[5][1] + f_lo;
        s[5][0] = (s[5][0] + f_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
        s[5][1] = lo >>> 0;
        lo = s[6][1] + g_lo;
        s[6][0] = (s[6][0] + g_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
        s[6][1] = lo >>> 0;
        lo = s[7][1] + h_lo;
        s[7][0] = (s[7][0] + h_hi + ((lo / 0x100000000) >>> 0)) >>> 0;
        s[7][1] = lo >>> 0;
        len -= 128;
      }
    }
  }
  var name = 'sha512';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/sha512", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var pem = forge.pem = forge.pem || {};
    pem.encode = function(msg, options) {
      options = options || {};
      var rval = '-----BEGIN ' + msg.type + '-----\r\n';
      var header;
      if (msg.procType) {
        header = {
          name: 'Proc-Type',
          values: [String(msg.procType.version), msg.procType.type]
        };
        rval += foldHeader(header);
      }
      if (msg.contentDomain) {
        header = {
          name: 'Content-Domain',
          values: [msg.contentDomain]
        };
        rval += foldHeader(header);
      }
      if (msg.dekInfo) {
        header = {
          name: 'DEK-Info',
          values: [msg.dekInfo.algorithm]
        };
        if (msg.dekInfo.parameters) {
          header.values.push(msg.dekInfo.parameters);
        }
        rval += foldHeader(header);
      }
      if (msg.headers) {
        for (var i = 0; i < msg.headers.length; ++i) {
          rval += foldHeader(msg.headers[i]);
        }
      }
      if (msg.procType) {
        rval += '\r\n';
      }
      rval += forge.util.encode64(msg.body, options.maxline || 64) + '\r\n';
      rval += '-----END ' + msg.type + '-----\r\n';
      return rval;
    };
    pem.decode = function(str) {
      var rval = [];
      var rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
      var rHeader = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/;
      var rCRLF = /\r?\n/;
      var match;
      while (true) {
        match = rMessage.exec(str);
        if (!match) {
          break;
        }
        var msg = {
          type: match[1],
          procType: null,
          contentDomain: null,
          dekInfo: null,
          headers: [],
          body: forge.util.decode64(match[3])
        };
        rval.push(msg);
        if (!match[2]) {
          continue;
        }
        var lines = match[2].split(rCRLF);
        var li = 0;
        while (match && li < lines.length) {
          var line = lines[li].replace(/\s+$/, '');
          for (var nl = li + 1; nl < lines.length; ++nl) {
            var next = lines[nl];
            if (!/\s/.test(next[0])) {
              break;
            }
            line += next;
            li = nl;
          }
          match = line.match(rHeader);
          if (match) {
            var header = {
              name: match[1],
              values: []
            };
            var values = match[2].split(',');
            for (var vi = 0; vi < values.length; ++vi) {
              header.values.push(ltrim(values[vi]));
            }
            if (!msg.procType) {
              if (header.name !== 'Proc-Type') {
                throw new Error('Invalid PEM formatted message. The first ' + 'encapsulated header must be "Proc-Type".');
              } else if (header.values.length !== 2) {
                throw new Error('Invalid PEM formatted message. The "Proc-Type" ' + 'header must have two subfields.');
              }
              msg.procType = {
                version: values[0],
                type: values[1]
              };
            } else if (!msg.contentDomain && header.name === 'Content-Domain') {
              msg.contentDomain = values[0] || '';
            } else if (!msg.dekInfo && header.name === 'DEK-Info') {
              if (header.values.length === 0) {
                throw new Error('Invalid PEM formatted message. The "DEK-Info" ' + 'header must have at least one subfield.');
              }
              msg.dekInfo = {
                algorithm: values[0],
                parameters: values[1] || null
              };
            } else {
              msg.headers.push(header);
            }
          }
          ++li;
        }
        if (msg.procType === 'ENCRYPTED' && !msg.dekInfo) {
          throw new Error('Invalid PEM formatted message. The "DEK-Info" ' + 'header must be present if "Proc-Type" is "ENCRYPTED".');
        }
      }
      if (rval.length === 0) {
        throw new Error('Invalid PEM formatted message.');
      }
      return rval;
    };
    function foldHeader(header) {
      var rval = header.name + ': ';
      var values = [];
      var insertSpace = function(match, $1) {
        return ' ' + $1;
      };
      for (var i = 0; i < header.values.length; ++i) {
        values.push(header.values[i].replace(/^(\S+\r\n)/, insertSpace));
      }
      rval += values.join(',') + '\r\n';
      var length = 0;
      var candidate = -1;
      for (var i = 0; i < rval.length; ++i, ++length) {
        if (length > 65 && candidate !== -1) {
          var insert = rval[candidate];
          if (insert === ',') {
            ++candidate;
            rval = rval.substr(0, candidate) + '\r\n ' + rval.substr(candidate);
          } else {
            rval = rval.substr(0, candidate) + '\r\n' + insert + rval.substr(candidate + 1);
          }
          length = (i - candidate - 1);
          candidate = -1;
          ++i;
        } else if (rval[i] === ' ' || rval[i] === '\t' || rval[i] === ',') {
          candidate = i;
        }
      }
      return rval;
    }
    function ltrim(str) {
      return str.replace(/^\s+/, '');
    }
  }
  var name = 'pem';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pem", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.des = forge.des || {};
    forge.des.startEncrypting = function(key, iv, output, mode) {
      var cipher = _createCipher({
        key: key,
        output: output,
        decrypt: false,
        mode: mode || (iv === null ? 'ECB' : 'CBC')
      });
      cipher.start(iv);
      return cipher;
    };
    forge.des.createEncryptionCipher = function(key, mode) {
      return _createCipher({
        key: key,
        output: null,
        decrypt: false,
        mode: mode
      });
    };
    forge.des.startDecrypting = function(key, iv, output, mode) {
      var cipher = _createCipher({
        key: key,
        output: output,
        decrypt: true,
        mode: mode || (iv === null ? 'ECB' : 'CBC')
      });
      cipher.start(iv);
      return cipher;
    };
    forge.des.createDecryptionCipher = function(key, mode) {
      return _createCipher({
        key: key,
        output: null,
        decrypt: true,
        mode: mode
      });
    };
    forge.des.Algorithm = function(name, mode) {
      var self = this;
      self.name = name;
      self.mode = new mode({
        blockSize: 8,
        cipher: {
          encrypt: function(inBlock, outBlock) {
            return _updateBlock(self._keys, inBlock, outBlock, false);
          },
          decrypt: function(inBlock, outBlock) {
            return _updateBlock(self._keys, inBlock, outBlock, true);
          }
        }
      });
      self._init = false;
    };
    forge.des.Algorithm.prototype.initialize = function(options) {
      if (this._init) {
        return ;
      }
      var key = forge.util.createBuffer(options.key);
      if (this.name.indexOf('3DES') === 0) {
        if (key.length() !== 24) {
          throw new Error('Invalid Triple-DES key size: ' + key.length() * 8);
        }
      }
      this._keys = _createKeys(key);
      this._init = true;
    };
    registerAlgorithm('DES-ECB', forge.cipher.modes.ecb);
    registerAlgorithm('DES-CBC', forge.cipher.modes.cbc);
    registerAlgorithm('DES-CFB', forge.cipher.modes.cfb);
    registerAlgorithm('DES-OFB', forge.cipher.modes.ofb);
    registerAlgorithm('DES-CTR', forge.cipher.modes.ctr);
    registerAlgorithm('3DES-ECB', forge.cipher.modes.ecb);
    registerAlgorithm('3DES-CBC', forge.cipher.modes.cbc);
    registerAlgorithm('3DES-CFB', forge.cipher.modes.cfb);
    registerAlgorithm('3DES-OFB', forge.cipher.modes.ofb);
    registerAlgorithm('3DES-CTR', forge.cipher.modes.ctr);
    function registerAlgorithm(name, mode) {
      var factory = function() {
        return new forge.des.Algorithm(name, mode);
      };
      forge.cipher.registerAlgorithm(name, factory);
    }
    var spfunction1 = [0x1010400, 0, 0x10000, 0x1010404, 0x1010004, 0x10404, 0x4, 0x10000, 0x400, 0x1010400, 0x1010404, 0x400, 0x1000404, 0x1010004, 0x1000000, 0x4, 0x404, 0x1000400, 0x1000400, 0x10400, 0x10400, 0x1010000, 0x1010000, 0x1000404, 0x10004, 0x1000004, 0x1000004, 0x10004, 0, 0x404, 0x10404, 0x1000000, 0x10000, 0x1010404, 0x4, 0x1010000, 0x1010400, 0x1000000, 0x1000000, 0x400, 0x1010004, 0x10000, 0x10400, 0x1000004, 0x400, 0x4, 0x1000404, 0x10404, 0x1010404, 0x10004, 0x1010000, 0x1000404, 0x1000004, 0x404, 0x10404, 0x1010400, 0x404, 0x1000400, 0x1000400, 0, 0x10004, 0x10400, 0, 0x1010004];
    var spfunction2 = [-0x7fef7fe0, -0x7fff8000, 0x8000, 0x108020, 0x100000, 0x20, -0x7fefffe0, -0x7fff7fe0, -0x7fffffe0, -0x7fef7fe0, -0x7fef8000, -0x80000000, -0x7fff8000, 0x100000, 0x20, -0x7fefffe0, 0x108000, 0x100020, -0x7fff7fe0, 0, -0x80000000, 0x8000, 0x108020, -0x7ff00000, 0x100020, -0x7fffffe0, 0, 0x108000, 0x8020, -0x7fef8000, -0x7ff00000, 0x8020, 0, 0x108020, -0x7fefffe0, 0x100000, -0x7fff7fe0, -0x7ff00000, -0x7fef8000, 0x8000, -0x7ff00000, -0x7fff8000, 0x20, -0x7fef7fe0, 0x108020, 0x20, 0x8000, -0x80000000, 0x8020, -0x7fef8000, 0x100000, -0x7fffffe0, 0x100020, -0x7fff7fe0, -0x7fffffe0, 0x100020, 0x108000, 0, -0x7fff8000, 0x8020, -0x80000000, -0x7fefffe0, -0x7fef7fe0, 0x108000];
    var spfunction3 = [0x208, 0x8020200, 0, 0x8020008, 0x8000200, 0, 0x20208, 0x8000200, 0x20008, 0x8000008, 0x8000008, 0x20000, 0x8020208, 0x20008, 0x8020000, 0x208, 0x8000000, 0x8, 0x8020200, 0x200, 0x20200, 0x8020000, 0x8020008, 0x20208, 0x8000208, 0x20200, 0x20000, 0x8000208, 0x8, 0x8020208, 0x200, 0x8000000, 0x8020200, 0x8000000, 0x20008, 0x208, 0x20000, 0x8020200, 0x8000200, 0, 0x200, 0x20008, 0x8020208, 0x8000200, 0x8000008, 0x200, 0, 0x8020008, 0x8000208, 0x20000, 0x8000000, 0x8020208, 0x8, 0x20208, 0x20200, 0x8000008, 0x8020000, 0x8000208, 0x208, 0x8020000, 0x20208, 0x8, 0x8020008, 0x20200];
    var spfunction4 = [0x802001, 0x2081, 0x2081, 0x80, 0x802080, 0x800081, 0x800001, 0x2001, 0, 0x802000, 0x802000, 0x802081, 0x81, 0, 0x800080, 0x800001, 0x1, 0x2000, 0x800000, 0x802001, 0x80, 0x800000, 0x2001, 0x2080, 0x800081, 0x1, 0x2080, 0x800080, 0x2000, 0x802080, 0x802081, 0x81, 0x800080, 0x800001, 0x802000, 0x802081, 0x81, 0, 0, 0x802000, 0x2080, 0x800080, 0x800081, 0x1, 0x802001, 0x2081, 0x2081, 0x80, 0x802081, 0x81, 0x1, 0x2000, 0x800001, 0x2001, 0x802080, 0x800081, 0x2001, 0x2080, 0x800000, 0x802001, 0x80, 0x800000, 0x2000, 0x802080];
    var spfunction5 = [0x100, 0x2080100, 0x2080000, 0x42000100, 0x80000, 0x100, 0x40000000, 0x2080000, 0x40080100, 0x80000, 0x2000100, 0x40080100, 0x42000100, 0x42080000, 0x80100, 0x40000000, 0x2000000, 0x40080000, 0x40080000, 0, 0x40000100, 0x42080100, 0x42080100, 0x2000100, 0x42080000, 0x40000100, 0, 0x42000000, 0x2080100, 0x2000000, 0x42000000, 0x80100, 0x80000, 0x42000100, 0x100, 0x2000000, 0x40000000, 0x2080000, 0x42000100, 0x40080100, 0x2000100, 0x40000000, 0x42080000, 0x2080100, 0x40080100, 0x100, 0x2000000, 0x42080000, 0x42080100, 0x80100, 0x42000000, 0x42080100, 0x2080000, 0, 0x40080000, 0x42000000, 0x80100, 0x2000100, 0x40000100, 0x80000, 0, 0x40080000, 0x2080100, 0x40000100];
    var spfunction6 = [0x20000010, 0x20400000, 0x4000, 0x20404010, 0x20400000, 0x10, 0x20404010, 0x400000, 0x20004000, 0x404010, 0x400000, 0x20000010, 0x400010, 0x20004000, 0x20000000, 0x4010, 0, 0x400010, 0x20004010, 0x4000, 0x404000, 0x20004010, 0x10, 0x20400010, 0x20400010, 0, 0x404010, 0x20404000, 0x4010, 0x404000, 0x20404000, 0x20000000, 0x20004000, 0x10, 0x20400010, 0x404000, 0x20404010, 0x400000, 0x4010, 0x20000010, 0x400000, 0x20004000, 0x20000000, 0x4010, 0x20000010, 0x20404010, 0x404000, 0x20400000, 0x404010, 0x20404000, 0, 0x20400010, 0x10, 0x4000, 0x20400000, 0x404010, 0x4000, 0x400010, 0x20004010, 0, 0x20404000, 0x20000000, 0x400010, 0x20004010];
    var spfunction7 = [0x200000, 0x4200002, 0x4000802, 0, 0x800, 0x4000802, 0x200802, 0x4200800, 0x4200802, 0x200000, 0, 0x4000002, 0x2, 0x4000000, 0x4200002, 0x802, 0x4000800, 0x200802, 0x200002, 0x4000800, 0x4000002, 0x4200000, 0x4200800, 0x200002, 0x4200000, 0x800, 0x802, 0x4200802, 0x200800, 0x2, 0x4000000, 0x200800, 0x4000000, 0x200800, 0x200000, 0x4000802, 0x4000802, 0x4200002, 0x4200002, 0x2, 0x200002, 0x4000000, 0x4000800, 0x200000, 0x4200800, 0x802, 0x200802, 0x4200800, 0x802, 0x4000002, 0x4200802, 0x4200000, 0x200800, 0, 0x2, 0x4200802, 0, 0x200802, 0x4200000, 0x800, 0x4000002, 0x4000800, 0x800, 0x200002];
    var spfunction8 = [0x10001040, 0x1000, 0x40000, 0x10041040, 0x10000000, 0x10001040, 0x40, 0x10000000, 0x40040, 0x10040000, 0x10041040, 0x41000, 0x10041000, 0x41040, 0x1000, 0x40, 0x10040000, 0x10000040, 0x10001000, 0x1040, 0x41000, 0x40040, 0x10040040, 0x10041000, 0x1040, 0, 0, 0x10040040, 0x10000040, 0x10001000, 0x41040, 0x40000, 0x41040, 0x40000, 0x10041000, 0x1000, 0x40, 0x10040040, 0x1000, 0x41040, 0x10001000, 0x40, 0x10000040, 0x10040000, 0x10040040, 0x10000000, 0x40000, 0x10001040, 0, 0x10041040, 0x40040, 0x10000040, 0x10040000, 0x10001000, 0x10001040, 0, 0x10041040, 0x41000, 0x41000, 0x1040, 0x1040, 0x40040, 0x10000000, 0x10041000];
    function _createKeys(key) {
      var pc2bytes0 = [0, 0x4, 0x20000000, 0x20000004, 0x10000, 0x10004, 0x20010000, 0x20010004, 0x200, 0x204, 0x20000200, 0x20000204, 0x10200, 0x10204, 0x20010200, 0x20010204],
          pc2bytes1 = [0, 0x1, 0x100000, 0x100001, 0x4000000, 0x4000001, 0x4100000, 0x4100001, 0x100, 0x101, 0x100100, 0x100101, 0x4000100, 0x4000101, 0x4100100, 0x4100101],
          pc2bytes2 = [0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808, 0, 0x8, 0x800, 0x808, 0x1000000, 0x1000008, 0x1000800, 0x1000808],
          pc2bytes3 = [0, 0x200000, 0x8000000, 0x8200000, 0x2000, 0x202000, 0x8002000, 0x8202000, 0x20000, 0x220000, 0x8020000, 0x8220000, 0x22000, 0x222000, 0x8022000, 0x8222000],
          pc2bytes4 = [0, 0x40000, 0x10, 0x40010, 0, 0x40000, 0x10, 0x40010, 0x1000, 0x41000, 0x1010, 0x41010, 0x1000, 0x41000, 0x1010, 0x41010],
          pc2bytes5 = [0, 0x400, 0x20, 0x420, 0, 0x400, 0x20, 0x420, 0x2000000, 0x2000400, 0x2000020, 0x2000420, 0x2000000, 0x2000400, 0x2000020, 0x2000420],
          pc2bytes6 = [0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002, 0, 0x10000000, 0x80000, 0x10080000, 0x2, 0x10000002, 0x80002, 0x10080002],
          pc2bytes7 = [0, 0x10000, 0x800, 0x10800, 0x20000000, 0x20010000, 0x20000800, 0x20010800, 0x20000, 0x30000, 0x20800, 0x30800, 0x20020000, 0x20030000, 0x20020800, 0x20030800],
          pc2bytes8 = [0, 0x40000, 0, 0x40000, 0x2, 0x40002, 0x2, 0x40002, 0x2000000, 0x2040000, 0x2000000, 0x2040000, 0x2000002, 0x2040002, 0x2000002, 0x2040002],
          pc2bytes9 = [0, 0x10000000, 0x8, 0x10000008, 0, 0x10000000, 0x8, 0x10000008, 0x400, 0x10000400, 0x408, 0x10000408, 0x400, 0x10000400, 0x408, 0x10000408],
          pc2bytes10 = [0, 0x20, 0, 0x20, 0x100000, 0x100020, 0x100000, 0x100020, 0x2000, 0x2020, 0x2000, 0x2020, 0x102000, 0x102020, 0x102000, 0x102020],
          pc2bytes11 = [0, 0x1000000, 0x200, 0x1000200, 0x200000, 0x1200000, 0x200200, 0x1200200, 0x4000000, 0x5000000, 0x4000200, 0x5000200, 0x4200000, 0x5200000, 0x4200200, 0x5200200],
          pc2bytes12 = [0, 0x1000, 0x8000000, 0x8001000, 0x80000, 0x81000, 0x8080000, 0x8081000, 0x10, 0x1010, 0x8000010, 0x8001010, 0x80010, 0x81010, 0x8080010, 0x8081010],
          pc2bytes13 = [0, 0x4, 0x100, 0x104, 0, 0x4, 0x100, 0x104, 0x1, 0x5, 0x101, 0x105, 0x1, 0x5, 0x101, 0x105];
      var iterations = key.length() > 8 ? 3 : 1;
      var keys = [];
      var shifts = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0];
      var n = 0,
          tmp;
      for (var j = 0; j < iterations; j++) {
        var left = key.getInt32();
        var right = key.getInt32();
        tmp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
        right ^= tmp;
        left ^= (tmp << 4);
        tmp = ((right >>> -16) ^ left) & 0x0000ffff;
        left ^= tmp;
        right ^= (tmp << -16);
        tmp = ((left >>> 2) ^ right) & 0x33333333;
        right ^= tmp;
        left ^= (tmp << 2);
        tmp = ((right >>> -16) ^ left) & 0x0000ffff;
        left ^= tmp;
        right ^= (tmp << -16);
        tmp = ((left >>> 1) ^ right) & 0x55555555;
        right ^= tmp;
        left ^= (tmp << 1);
        tmp = ((right >>> 8) ^ left) & 0x00ff00ff;
        left ^= tmp;
        right ^= (tmp << 8);
        tmp = ((left >>> 1) ^ right) & 0x55555555;
        right ^= tmp;
        left ^= (tmp << 1);
        tmp = (left << 8) | ((right >>> 20) & 0x000000f0);
        left = ((right << 24) | ((right << 8) & 0xff0000) | ((right >>> 8) & 0xff00) | ((right >>> 24) & 0xf0));
        right = tmp;
        for (var i = 0; i < shifts.length; ++i) {
          if (shifts[i]) {
            left = (left << 2) | (left >>> 26);
            right = (right << 2) | (right >>> 26);
          } else {
            left = (left << 1) | (left >>> 27);
            right = (right << 1) | (right >>> 27);
          }
          left &= -0xf;
          right &= -0xf;
          var lefttmp = (pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf] | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf] | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf] | pc2bytes6[(left >>> 4) & 0xf]);
          var righttmp = (pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf] | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf] | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf] | pc2bytes13[(right >>> 4) & 0xf]);
          tmp = ((righttmp >>> 16) ^ lefttmp) & 0x0000ffff;
          keys[n++] = lefttmp ^ tmp;
          keys[n++] = righttmp ^ (tmp << 16);
        }
      }
      return keys;
    }
    function _updateBlock(keys, input, output, decrypt) {
      var iterations = keys.length === 32 ? 3 : 9;
      var looping;
      if (iterations === 3) {
        looping = decrypt ? [30, -2, -2] : [0, 32, 2];
      } else {
        looping = (decrypt ? [94, 62, -2, 32, 64, 2, 30, -2, -2] : [0, 32, 2, 62, 30, -2, 64, 96, 2]);
      }
      var tmp;
      var left = input[0];
      var right = input[1];
      tmp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
      right ^= tmp;
      left ^= (tmp << 4);
      tmp = ((left >>> 16) ^ right) & 0x0000ffff;
      right ^= tmp;
      left ^= (tmp << 16);
      tmp = ((right >>> 2) ^ left) & 0x33333333;
      left ^= tmp;
      right ^= (tmp << 2);
      tmp = ((right >>> 8) ^ left) & 0x00ff00ff;
      left ^= tmp;
      right ^= (tmp << 8);
      tmp = ((left >>> 1) ^ right) & 0x55555555;
      right ^= tmp;
      left ^= (tmp << 1);
      left = ((left << 1) | (left >>> 31));
      right = ((right << 1) | (right >>> 31));
      for (var j = 0; j < iterations; j += 3) {
        var endloop = looping[j + 1];
        var loopinc = looping[j + 2];
        for (var i = looping[j]; i != endloop; i += loopinc) {
          var right1 = right ^ keys[i];
          var right2 = ((right >>> 4) | (right << 28)) ^ keys[i + 1];
          tmp = left;
          left = right;
          right = tmp ^ (spfunction2[(right1 >>> 24) & 0x3f] | spfunction4[(right1 >>> 16) & 0x3f] | spfunction6[(right1 >>> 8) & 0x3f] | spfunction8[right1 & 0x3f] | spfunction1[(right2 >>> 24) & 0x3f] | spfunction3[(right2 >>> 16) & 0x3f] | spfunction5[(right2 >>> 8) & 0x3f] | spfunction7[right2 & 0x3f]);
        }
        tmp = left;
        left = right;
        right = tmp;
      }
      left = ((left >>> 1) | (left << 31));
      right = ((right >>> 1) | (right << 31));
      tmp = ((left >>> 1) ^ right) & 0x55555555;
      right ^= tmp;
      left ^= (tmp << 1);
      tmp = ((right >>> 8) ^ left) & 0x00ff00ff;
      left ^= tmp;
      right ^= (tmp << 8);
      tmp = ((right >>> 2) ^ left) & 0x33333333;
      left ^= tmp;
      right ^= (tmp << 2);
      tmp = ((left >>> 16) ^ right) & 0x0000ffff;
      right ^= tmp;
      left ^= (tmp << 16);
      tmp = ((left >>> 4) ^ right) & 0x0f0f0f0f;
      right ^= tmp;
      left ^= (tmp << 4);
      output[0] = left;
      output[1] = right;
    }
    function _createCipher(options) {
      options = options || {};
      var mode = (options.mode || 'CBC').toUpperCase();
      var algorithm = 'DES-' + mode;
      var cipher;
      if (options.decrypt) {
        cipher = forge.cipher.createDecipher(algorithm, options.key);
      } else {
        cipher = forge.cipher.createCipher(algorithm, options.key);
      }
      var start = cipher.start;
      cipher.start = function(iv, options) {
        var output = null;
        if (options instanceof forge.util.ByteBuffer) {
          output = options;
          options = {};
        }
        options = options || {};
        options.output = output;
        options.iv = iv;
        start.call(cipher, options);
      };
      return cipher;
    }
  }
  var name = 'des';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/des", ["npm:node-forge@0.6.26/js/cipher", "npm:node-forge@0.6.26/js/cipherModes", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/cipher'), __require('npm:node-forge@0.6.26/js/cipherModes'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var pkcs5 = forge.pkcs5 = forge.pkcs5 || {};
    forge.pbkdf2 = pkcs5.pbkdf2 = function(p, s, c, dkLen, md, callback) {
      if (typeof md === 'function') {
        callback = md;
        md = null;
      }
      if (typeof md === 'undefined' || md === null) {
        md = forge.md.sha1.create();
      }
      var hLen = md.digestLength;
      if (dkLen > (0xFFFFFFFF * hLen)) {
        var err = new Error('Derived key is too long.');
        if (callback) {
          return callback(err);
        }
        throw err;
      }
      var len = Math.ceil(dkLen / hLen);
      var r = dkLen - (len - 1) * hLen;
      var prf = forge.hmac.create();
      prf.start(md, p);
      var dk = '';
      var xor,
          u_c,
          u_c1;
      if (!callback) {
        for (var i = 1; i <= len; ++i) {
          prf.start(null, null);
          prf.update(s);
          prf.update(forge.util.int32ToBytes(i));
          xor = u_c1 = prf.digest().getBytes();
          for (var j = 2; j <= c; ++j) {
            prf.start(null, null);
            prf.update(u_c1);
            u_c = prf.digest().getBytes();
            xor = forge.util.xorBytes(xor, u_c, hLen);
            u_c1 = u_c;
          }
          dk += (i < len) ? xor : xor.substr(0, r);
        }
        return dk;
      }
      var i = 1,
          j;
      function outer() {
        if (i > len) {
          return callback(null, dk);
        }
        prf.start(null, null);
        prf.update(s);
        prf.update(forge.util.int32ToBytes(i));
        xor = u_c1 = prf.digest().getBytes();
        j = 2;
        inner();
      }
      function inner() {
        if (j <= c) {
          prf.start(null, null);
          prf.update(u_c1);
          u_c = prf.digest().getBytes();
          xor = forge.util.xorBytes(xor, u_c, hLen);
          u_c1 = u_c;
          ++j;
          return forge.util.setImmediate(inner);
        }
        dk += (i < len) ? xor : xor.substr(0, r);
        ++i;
        outer();
      }
      outer();
    };
  }
  var name = 'pbkdf2';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pbkdf2", ["npm:node-forge@0.6.26/js/hmac", "npm:node-forge@0.6.26/js/md", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/hmac'), __require('npm:node-forge@0.6.26/js/md'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var _nodejs = (typeof process !== 'undefined' && process.versions && process.versions.node);
    var _crypto = null;
    if (!forge.disableNativeCode && _nodejs && !process.versions['node-webkit']) {
      _crypto = require('crypto');
    }
    var prng = forge.prng = forge.prng || {};
    prng.create = function(plugin) {
      var ctx = {
        plugin: plugin,
        key: null,
        seed: null,
        time: null,
        reseeds: 0,
        generated: 0
      };
      var md = plugin.md;
      var pools = new Array(32);
      for (var i = 0; i < 32; ++i) {
        pools[i] = md.create();
      }
      ctx.pools = pools;
      ctx.pool = 0;
      ctx.generate = function(count, callback) {
        if (!callback) {
          return ctx.generateSync(count);
        }
        var cipher = ctx.plugin.cipher;
        var increment = ctx.plugin.increment;
        var formatKey = ctx.plugin.formatKey;
        var formatSeed = ctx.plugin.formatSeed;
        var b = forge.util.createBuffer();
        ctx.key = null;
        generate();
        function generate(err) {
          if (err) {
            return callback(err);
          }
          if (b.length() >= count) {
            return callback(null, b.getBytes(count));
          }
          if (ctx.generated > 0xfffff) {
            ctx.key = null;
          }
          if (ctx.key === null) {
            return forge.util.nextTick(function() {
              _reseed(generate);
            });
          }
          var bytes = cipher(ctx.key, ctx.seed);
          ctx.generated += bytes.length;
          b.putBytes(bytes);
          ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
          ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
          forge.util.setImmediate(generate);
        }
      };
      ctx.generateSync = function(count) {
        var cipher = ctx.plugin.cipher;
        var increment = ctx.plugin.increment;
        var formatKey = ctx.plugin.formatKey;
        var formatSeed = ctx.plugin.formatSeed;
        ctx.key = null;
        var b = forge.util.createBuffer();
        while (b.length() < count) {
          if (ctx.generated > 0xfffff) {
            ctx.key = null;
          }
          if (ctx.key === null) {
            _reseedSync();
          }
          var bytes = cipher(ctx.key, ctx.seed);
          ctx.generated += bytes.length;
          b.putBytes(bytes);
          ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
          ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
        }
        return b.getBytes(count);
      };
      function _reseed(callback) {
        if (ctx.pools[0].messageLength >= 32) {
          _seed();
          return callback();
        }
        var needed = (32 - ctx.pools[0].messageLength) << 5;
        ctx.seedFile(needed, function(err, bytes) {
          if (err) {
            return callback(err);
          }
          ctx.collect(bytes);
          _seed();
          callback();
        });
      }
      function _reseedSync() {
        if (ctx.pools[0].messageLength >= 32) {
          return _seed();
        }
        var needed = (32 - ctx.pools[0].messageLength) << 5;
        ctx.collect(ctx.seedFileSync(needed));
        _seed();
      }
      function _seed() {
        var md = ctx.plugin.md.create();
        md.update(ctx.pools[0].digest().getBytes());
        ctx.pools[0].start();
        var k = 1;
        for (var i = 1; i < 32; ++i) {
          k = (k === 31) ? 0x80000000 : (k << 2);
          if (k % ctx.reseeds === 0) {
            md.update(ctx.pools[i].digest().getBytes());
            ctx.pools[i].start();
          }
        }
        var keyBytes = md.digest().getBytes();
        md.start();
        md.update(keyBytes);
        var seedBytes = md.digest().getBytes();
        ctx.key = ctx.plugin.formatKey(keyBytes);
        ctx.seed = ctx.plugin.formatSeed(seedBytes);
        ctx.reseeds = (ctx.reseeds === 0xffffffff) ? 0 : ctx.reseeds + 1;
        ctx.generated = 0;
      }
      function defaultSeedFile(needed) {
        var getRandomValues = null;
        if (typeof window !== 'undefined') {
          var _crypto = window.crypto || window.msCrypto;
          if (_crypto && _crypto.getRandomValues) {
            getRandomValues = function(arr) {
              return _crypto.getRandomValues(arr);
            };
          }
        }
        var b = forge.util.createBuffer();
        if (getRandomValues) {
          while (b.length() < needed) {
            var count = Math.max(1, Math.min(needed - b.length(), 65536) / 4);
            var entropy = new Uint32Array(Math.floor(count));
            try {
              getRandomValues(entropy);
              for (var i = 0; i < entropy.length; ++i) {
                b.putInt32(entropy[i]);
              }
            } catch (e) {
              if (!(typeof QuotaExceededError !== 'undefined' && e instanceof QuotaExceededError)) {
                throw e;
              }
            }
          }
        }
        if (b.length() < needed) {
          var hi,
              lo,
              next;
          var seed = Math.floor(Math.random() * 0x010000);
          while (b.length() < needed) {
            lo = 16807 * (seed & 0xFFFF);
            hi = 16807 * (seed >> 16);
            lo += (hi & 0x7FFF) << 16;
            lo += hi >> 15;
            lo = (lo & 0x7FFFFFFF) + (lo >> 31);
            seed = lo & 0xFFFFFFFF;
            for (var i = 0; i < 3; ++i) {
              next = seed >>> (i << 3);
              next ^= Math.floor(Math.random() * 0x0100);
              b.putByte(String.fromCharCode(next & 0xFF));
            }
          }
        }
        return b.getBytes(needed);
      }
      if (_crypto) {
        ctx.seedFile = function(needed, callback) {
          _crypto.randomBytes(needed, function(err, bytes) {
            if (err) {
              return callback(err);
            }
            callback(null, bytes.toString());
          });
        };
        ctx.seedFileSync = function(needed) {
          return _crypto.randomBytes(needed).toString();
        };
      } else {
        ctx.seedFile = function(needed, callback) {
          try {
            callback(null, defaultSeedFile(needed));
          } catch (e) {
            callback(e);
          }
        };
        ctx.seedFileSync = defaultSeedFile;
      }
      ctx.collect = function(bytes) {
        var count = bytes.length;
        for (var i = 0; i < count; ++i) {
          ctx.pools[ctx.pool].update(bytes.substr(i, 1));
          ctx.pool = (ctx.pool === 31) ? 0 : ctx.pool + 1;
        }
      };
      ctx.collectInt = function(i, n) {
        var bytes = '';
        for (var x = 0; x < n; x += 8) {
          bytes += String.fromCharCode((i >> x) & 0xFF);
        }
        ctx.collect(bytes);
      };
      ctx.registerWorker = function(worker) {
        if (worker === self) {
          ctx.seedFile = function(needed, callback) {
            function listener(e) {
              var data = e.data;
              if (data.forge && data.forge.prng) {
                self.removeEventListener('message', listener);
                callback(data.forge.prng.err, data.forge.prng.bytes);
              }
            }
            self.addEventListener('message', listener);
            self.postMessage({forge: {prng: {needed: needed}}});
          };
        } else {
          var listener = function(e) {
            var data = e.data;
            if (data.forge && data.forge.prng) {
              ctx.seedFile(data.forge.prng.needed, function(err, bytes) {
                worker.postMessage({forge: {prng: {
                      err: err,
                      bytes: bytes
                    }}});
              });
            }
          };
          worker.addEventListener('message', listener);
        }
      };
      return ctx;
    };
  }
  var name = 'prng';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/prng", ["npm:node-forge@0.6.26/js/md", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/md'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var piTable = [0xd9, 0x78, 0xf9, 0xc4, 0x19, 0xdd, 0xb5, 0xed, 0x28, 0xe9, 0xfd, 0x79, 0x4a, 0xa0, 0xd8, 0x9d, 0xc6, 0x7e, 0x37, 0x83, 0x2b, 0x76, 0x53, 0x8e, 0x62, 0x4c, 0x64, 0x88, 0x44, 0x8b, 0xfb, 0xa2, 0x17, 0x9a, 0x59, 0xf5, 0x87, 0xb3, 0x4f, 0x13, 0x61, 0x45, 0x6d, 0x8d, 0x09, 0x81, 0x7d, 0x32, 0xbd, 0x8f, 0x40, 0xeb, 0x86, 0xb7, 0x7b, 0x0b, 0xf0, 0x95, 0x21, 0x22, 0x5c, 0x6b, 0x4e, 0x82, 0x54, 0xd6, 0x65, 0x93, 0xce, 0x60, 0xb2, 0x1c, 0x73, 0x56, 0xc0, 0x14, 0xa7, 0x8c, 0xf1, 0xdc, 0x12, 0x75, 0xca, 0x1f, 0x3b, 0xbe, 0xe4, 0xd1, 0x42, 0x3d, 0xd4, 0x30, 0xa3, 0x3c, 0xb6, 0x26, 0x6f, 0xbf, 0x0e, 0xda, 0x46, 0x69, 0x07, 0x57, 0x27, 0xf2, 0x1d, 0x9b, 0xbc, 0x94, 0x43, 0x03, 0xf8, 0x11, 0xc7, 0xf6, 0x90, 0xef, 0x3e, 0xe7, 0x06, 0xc3, 0xd5, 0x2f, 0xc8, 0x66, 0x1e, 0xd7, 0x08, 0xe8, 0xea, 0xde, 0x80, 0x52, 0xee, 0xf7, 0x84, 0xaa, 0x72, 0xac, 0x35, 0x4d, 0x6a, 0x2a, 0x96, 0x1a, 0xd2, 0x71, 0x5a, 0x15, 0x49, 0x74, 0x4b, 0x9f, 0xd0, 0x5e, 0x04, 0x18, 0xa4, 0xec, 0xc2, 0xe0, 0x41, 0x6e, 0x0f, 0x51, 0xcb, 0xcc, 0x24, 0x91, 0xaf, 0x50, 0xa1, 0xf4, 0x70, 0x39, 0x99, 0x7c, 0x3a, 0x85, 0x23, 0xb8, 0xb4, 0x7a, 0xfc, 0x02, 0x36, 0x5b, 0x25, 0x55, 0x97, 0x31, 0x2d, 0x5d, 0xfa, 0x98, 0xe3, 0x8a, 0x92, 0xae, 0x05, 0xdf, 0x29, 0x10, 0x67, 0x6c, 0xba, 0xc9, 0xd3, 0x00, 0xe6, 0xcf, 0xe1, 0x9e, 0xa8, 0x2c, 0x63, 0x16, 0x01, 0x3f, 0x58, 0xe2, 0x89, 0xa9, 0x0d, 0x38, 0x34, 0x1b, 0xab, 0x33, 0xff, 0xb0, 0xbb, 0x48, 0x0c, 0x5f, 0xb9, 0xb1, 0xcd, 0x2e, 0xc5, 0xf3, 0xdb, 0x47, 0xe5, 0xa5, 0x9c, 0x77, 0x0a, 0xa6, 0x20, 0x68, 0xfe, 0x7f, 0xc1, 0xad];
    var s = [1, 2, 3, 5];
    var rol = function(word, bits) {
      return ((word << bits) & 0xffff) | ((word & 0xffff) >> (16 - bits));
    };
    var ror = function(word, bits) {
      return ((word & 0xffff) >> bits) | ((word << (16 - bits)) & 0xffff);
    };
    forge.rc2 = forge.rc2 || {};
    forge.rc2.expandKey = function(key, effKeyBits) {
      if (typeof key === 'string') {
        key = forge.util.createBuffer(key);
      }
      effKeyBits = effKeyBits || 128;
      var L = key;
      var T = key.length();
      var T1 = effKeyBits;
      var T8 = Math.ceil(T1 / 8);
      var TM = 0xff >> (T1 & 0x07);
      var i;
      for (i = T; i < 128; i++) {
        L.putByte(piTable[(L.at(i - 1) + L.at(i - T)) & 0xff]);
      }
      L.setAt(128 - T8, piTable[L.at(128 - T8) & TM]);
      for (i = 127 - T8; i >= 0; i--) {
        L.setAt(i, piTable[L.at(i + 1) ^ L.at(i + T8)]);
      }
      return L;
    };
    var createCipher = function(key, bits, encrypt) {
      var _finish = false,
          _input = null,
          _output = null,
          _iv = null;
      var mixRound,
          mashRound;
      var i,
          j,
          K = [];
      key = forge.rc2.expandKey(key, bits);
      for (i = 0; i < 64; i++) {
        K.push(key.getInt16Le());
      }
      if (encrypt) {
        mixRound = function(R) {
          for (i = 0; i < 4; i++) {
            R[i] += K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + ((~R[(i + 3) % 4]) & R[(i + 1) % 4]);
            R[i] = rol(R[i], s[i]);
            j++;
          }
        };
        mashRound = function(R) {
          for (i = 0; i < 4; i++) {
            R[i] += K[R[(i + 3) % 4] & 63];
          }
        };
      } else {
        mixRound = function(R) {
          for (i = 3; i >= 0; i--) {
            R[i] = ror(R[i], s[i]);
            R[i] -= K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + ((~R[(i + 3) % 4]) & R[(i + 1) % 4]);
            j--;
          }
        };
        mashRound = function(R) {
          for (i = 3; i >= 0; i--) {
            R[i] -= K[R[(i + 3) % 4] & 63];
          }
        };
      }
      var runPlan = function(plan) {
        var R = [];
        for (i = 0; i < 4; i++) {
          var val = _input.getInt16Le();
          if (_iv !== null) {
            if (encrypt) {
              val ^= _iv.getInt16Le();
            } else {
              _iv.putInt16Le(val);
            }
          }
          R.push(val & 0xffff);
        }
        j = encrypt ? 0 : 63;
        for (var ptr = 0; ptr < plan.length; ptr++) {
          for (var ctr = 0; ctr < plan[ptr][0]; ctr++) {
            plan[ptr][1](R);
          }
        }
        for (i = 0; i < 4; i++) {
          if (_iv !== null) {
            if (encrypt) {
              _iv.putInt16Le(R[i]);
            } else {
              R[i] ^= _iv.getInt16Le();
            }
          }
          _output.putInt16Le(R[i]);
        }
      };
      var cipher = null;
      cipher = {
        start: function(iv, output) {
          if (iv) {
            if (typeof iv === 'string') {
              iv = forge.util.createBuffer(iv);
            }
          }
          _finish = false;
          _input = forge.util.createBuffer();
          _output = output || new forge.util.createBuffer();
          _iv = iv;
          cipher.output = _output;
        },
        update: function(input) {
          if (!_finish) {
            _input.putBuffer(input);
          }
          while (_input.length() >= 8) {
            runPlan([[5, mixRound], [1, mashRound], [6, mixRound], [1, mashRound], [5, mixRound]]);
          }
        },
        finish: function(pad) {
          var rval = true;
          if (encrypt) {
            if (pad) {
              rval = pad(8, _input, !encrypt);
            } else {
              var padding = (_input.length() === 8) ? 8 : (8 - _input.length());
              _input.fillWithByte(padding, padding);
            }
          }
          if (rval) {
            _finish = true;
            cipher.update();
          }
          if (!encrypt) {
            rval = (_input.length() === 0);
            if (rval) {
              if (pad) {
                rval = pad(8, _output, !encrypt);
              } else {
                var len = _output.length();
                var count = _output.at(len - 1);
                if (count > len) {
                  rval = false;
                } else {
                  _output.truncate(count);
                }
              }
            }
          }
          return rval;
        }
      };
      return cipher;
    };
    forge.rc2.startEncrypting = function(key, iv, output) {
      var cipher = forge.rc2.createEncryptionCipher(key, 128);
      cipher.start(iv, output);
      return cipher;
    };
    forge.rc2.createEncryptionCipher = function(key, bits) {
      return createCipher(key, bits, true);
    };
    forge.rc2.startDecrypting = function(key, iv, output) {
      var cipher = forge.rc2.createDecryptionCipher(key, 128);
      cipher.start(iv, output);
      return cipher;
    };
    forge.rc2.createDecryptionCipher = function(key, bits) {
      return createCipher(key, bits, false);
    };
  }
  var name = 'rc2';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/rc2", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var dbits;
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary & 0xffffff) == 0xefcafe);
    function BigInteger(a, b, c) {
      this.data = [];
      if (a != null)
        if ("number" == typeof a)
          this.fromNumber(a, b, c);
        else if (b == null && "string" != typeof a)
          this.fromString(a, 256);
        else
          this.fromString(a, b);
    }
    function nbi() {
      return new BigInteger(null);
    }
    function am1(i, x, w, j, c, n) {
      while (--n >= 0) {
        var v = x * this.data[i++] + w.data[j] + c;
        c = Math.floor(v / 0x4000000);
        w.data[j++] = v & 0x3ffffff;
      }
      return c;
    }
    function am2(i, x, w, j, c, n) {
      var xl = x & 0x7fff,
          xh = x >> 15;
      while (--n >= 0) {
        var l = this.data[i] & 0x7fff;
        var h = this.data[i++] >> 15;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x7fff) << 15) + w.data[j] + (c & 0x3fffffff);
        c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
        w.data[j++] = l & 0x3fffffff;
      }
      return c;
    }
    function am3(i, x, w, j, c, n) {
      var xl = x & 0x3fff,
          xh = x >> 14;
      while (--n >= 0) {
        var l = this.data[i] & 0x3fff;
        var h = this.data[i++] >> 14;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x3fff) << 14) + w.data[j] + c;
        c = (l >> 28) + (m >> 14) + xh * h;
        w.data[j++] = l & 0xfffffff;
      }
      return c;
    }
    if (typeof(navigator) === 'undefined') {
      BigInteger.prototype.am = am3;
      dbits = 28;
    } else if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
      BigInteger.prototype.am = am2;
      dbits = 30;
    } else if (j_lm && (navigator.appName != "Netscape")) {
      BigInteger.prototype.am = am1;
      dbits = 26;
    } else {
      BigInteger.prototype.am = am3;
      dbits = 28;
    }
    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1 << dbits) - 1);
    BigInteger.prototype.DV = (1 << dbits);
    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2, BI_FP);
    BigInteger.prototype.F1 = BI_FP - dbits;
    BigInteger.prototype.F2 = 2 * dbits - BI_FP;
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr,
        vv;
    rr = "0".charCodeAt(0);
    for (vv = 0; vv <= 9; ++vv)
      BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv)
      BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv)
      BI_RC[rr++] = vv;
    function int2char(n) {
      return BI_RM.charAt(n);
    }
    function intAt(s, i) {
      var c = BI_RC[s.charCodeAt(i)];
      return (c == null) ? -1 : c;
    }
    function bnpCopyTo(r) {
      for (var i = this.t - 1; i >= 0; --i)
        r.data[i] = this.data[i];
      r.t = this.t;
      r.s = this.s;
    }
    function bnpFromInt(x) {
      this.t = 1;
      this.s = (x < 0) ? -1 : 0;
      if (x > 0)
        this.data[0] = x;
      else if (x < -1)
        this.data[0] = x + this.DV;
      else
        this.t = 0;
    }
    function nbv(i) {
      var r = nbi();
      r.fromInt(i);
      return r;
    }
    function bnpFromString(s, b) {
      var k;
      if (b == 16)
        k = 4;
      else if (b == 8)
        k = 3;
      else if (b == 256)
        k = 8;
      else if (b == 2)
        k = 1;
      else if (b == 32)
        k = 5;
      else if (b == 4)
        k = 2;
      else {
        this.fromRadix(s, b);
        return ;
      }
      this.t = 0;
      this.s = 0;
      var i = s.length,
          mi = false,
          sh = 0;
      while (--i >= 0) {
        var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
        if (x < 0) {
          if (s.charAt(i) == "-")
            mi = true;
          continue;
        }
        mi = false;
        if (sh == 0)
          this.data[this.t++] = x;
        else if (sh + k > this.DB) {
          this.data[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
          this.data[this.t++] = (x >> (this.DB - sh));
        } else
          this.data[this.t - 1] |= x << sh;
        sh += k;
        if (sh >= this.DB)
          sh -= this.DB;
      }
      if (k == 8 && (s[0] & 0x80) != 0) {
        this.s = -1;
        if (sh > 0)
          this.data[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
      }
      this.clamp();
      if (mi)
        BigInteger.ZERO.subTo(this, this);
    }
    function bnpClamp() {
      var c = this.s & this.DM;
      while (this.t > 0 && this.data[this.t - 1] == c)
        --this.t;
    }
    function bnToString(b) {
      if (this.s < 0)
        return "-" + this.negate().toString(b);
      var k;
      if (b == 16)
        k = 4;
      else if (b == 8)
        k = 3;
      else if (b == 2)
        k = 1;
      else if (b == 32)
        k = 5;
      else if (b == 4)
        k = 2;
      else
        return this.toRadix(b);
      var km = (1 << k) - 1,
          d,
          m = false,
          r = "",
          i = this.t;
      var p = this.DB - (i * this.DB) % k;
      if (i-- > 0) {
        if (p < this.DB && (d = this.data[i] >> p) > 0) {
          m = true;
          r = int2char(d);
        }
        while (i >= 0) {
          if (p < k) {
            d = (this.data[i] & ((1 << p) - 1)) << (k - p);
            d |= this.data[--i] >> (p += this.DB - k);
          } else {
            d = (this.data[i] >> (p -= k)) & km;
            if (p <= 0) {
              p += this.DB;
              --i;
            }
          }
          if (d > 0)
            m = true;
          if (m)
            r += int2char(d);
        }
      }
      return m ? r : "0";
    }
    function bnNegate() {
      var r = nbi();
      BigInteger.ZERO.subTo(this, r);
      return r;
    }
    function bnAbs() {
      return (this.s < 0) ? this.negate() : this;
    }
    function bnCompareTo(a) {
      var r = this.s - a.s;
      if (r != 0)
        return r;
      var i = this.t;
      r = i - a.t;
      if (r != 0)
        return (this.s < 0) ? -r : r;
      while (--i >= 0)
        if ((r = this.data[i] - a.data[i]) != 0)
          return r;
      return 0;
    }
    function nbits(x) {
      var r = 1,
          t;
      if ((t = x >>> 16) != 0) {
        x = t;
        r += 16;
      }
      if ((t = x >> 8) != 0) {
        x = t;
        r += 8;
      }
      if ((t = x >> 4) != 0) {
        x = t;
        r += 4;
      }
      if ((t = x >> 2) != 0) {
        x = t;
        r += 2;
      }
      if ((t = x >> 1) != 0) {
        x = t;
        r += 1;
      }
      return r;
    }
    function bnBitLength() {
      if (this.t <= 0)
        return 0;
      return this.DB * (this.t - 1) + nbits(this.data[this.t - 1] ^ (this.s & this.DM));
    }
    function bnpDLShiftTo(n, r) {
      var i;
      for (i = this.t - 1; i >= 0; --i)
        r.data[i + n] = this.data[i];
      for (i = n - 1; i >= 0; --i)
        r.data[i] = 0;
      r.t = this.t + n;
      r.s = this.s;
    }
    function bnpDRShiftTo(n, r) {
      for (var i = n; i < this.t; ++i)
        r.data[i - n] = this.data[i];
      r.t = Math.max(this.t - n, 0);
      r.s = this.s;
    }
    function bnpLShiftTo(n, r) {
      var bs = n % this.DB;
      var cbs = this.DB - bs;
      var bm = (1 << cbs) - 1;
      var ds = Math.floor(n / this.DB),
          c = (this.s << bs) & this.DM,
          i;
      for (i = this.t - 1; i >= 0; --i) {
        r.data[i + ds + 1] = (this.data[i] >> cbs) | c;
        c = (this.data[i] & bm) << bs;
      }
      for (i = ds - 1; i >= 0; --i)
        r.data[i] = 0;
      r.data[ds] = c;
      r.t = this.t + ds + 1;
      r.s = this.s;
      r.clamp();
    }
    function bnpRShiftTo(n, r) {
      r.s = this.s;
      var ds = Math.floor(n / this.DB);
      if (ds >= this.t) {
        r.t = 0;
        return ;
      }
      var bs = n % this.DB;
      var cbs = this.DB - bs;
      var bm = (1 << bs) - 1;
      r.data[0] = this.data[ds] >> bs;
      for (var i = ds + 1; i < this.t; ++i) {
        r.data[i - ds - 1] |= (this.data[i] & bm) << cbs;
        r.data[i - ds] = this.data[i] >> bs;
      }
      if (bs > 0)
        r.data[this.t - ds - 1] |= (this.s & bm) << cbs;
      r.t = this.t - ds;
      r.clamp();
    }
    function bnpSubTo(a, r) {
      var i = 0,
          c = 0,
          m = Math.min(a.t, this.t);
      while (i < m) {
        c += this.data[i] - a.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      if (a.t < this.t) {
        c -= a.s;
        while (i < this.t) {
          c += this.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += this.s;
      } else {
        c += this.s;
        while (i < a.t) {
          c -= a.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        c -= a.s;
      }
      r.s = (c < 0) ? -1 : 0;
      if (c < -1)
        r.data[i++] = this.DV + c;
      else if (c > 0)
        r.data[i++] = c;
      r.t = i;
      r.clamp();
    }
    function bnpMultiplyTo(a, r) {
      var x = this.abs(),
          y = a.abs();
      var i = x.t;
      r.t = i + y.t;
      while (--i >= 0)
        r.data[i] = 0;
      for (i = 0; i < y.t; ++i)
        r.data[i + x.t] = x.am(0, y.data[i], r, i, 0, x.t);
      r.s = 0;
      r.clamp();
      if (this.s != a.s)
        BigInteger.ZERO.subTo(r, r);
    }
    function bnpSquareTo(r) {
      var x = this.abs();
      var i = r.t = 2 * x.t;
      while (--i >= 0)
        r.data[i] = 0;
      for (i = 0; i < x.t - 1; ++i) {
        var c = x.am(i, x.data[i], r, 2 * i, 0, 1);
        if ((r.data[i + x.t] += x.am(i + 1, 2 * x.data[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
          r.data[i + x.t] -= x.DV;
          r.data[i + x.t + 1] = 1;
        }
      }
      if (r.t > 0)
        r.data[r.t - 1] += x.am(i, x.data[i], r, 2 * i, 0, 1);
      r.s = 0;
      r.clamp();
    }
    function bnpDivRemTo(m, q, r) {
      var pm = m.abs();
      if (pm.t <= 0)
        return ;
      var pt = this.abs();
      if (pt.t < pm.t) {
        if (q != null)
          q.fromInt(0);
        if (r != null)
          this.copyTo(r);
        return ;
      }
      if (r == null)
        r = nbi();
      var y = nbi(),
          ts = this.s,
          ms = m.s;
      var nsh = this.DB - nbits(pm.data[pm.t - 1]);
      if (nsh > 0) {
        pm.lShiftTo(nsh, y);
        pt.lShiftTo(nsh, r);
      } else {
        pm.copyTo(y);
        pt.copyTo(r);
      }
      var ys = y.t;
      var y0 = y.data[ys - 1];
      if (y0 == 0)
        return ;
      var yt = y0 * (1 << this.F1) + ((ys > 1) ? y.data[ys - 2] >> this.F2 : 0);
      var d1 = this.FV / yt,
          d2 = (1 << this.F1) / yt,
          e = 1 << this.F2;
      var i = r.t,
          j = i - ys,
          t = (q == null) ? nbi() : q;
      y.dlShiftTo(j, t);
      if (r.compareTo(t) >= 0) {
        r.data[r.t++] = 1;
        r.subTo(t, r);
      }
      BigInteger.ONE.dlShiftTo(ys, t);
      t.subTo(y, y);
      while (y.t < ys)
        y.data[y.t++] = 0;
      while (--j >= 0) {
        var qd = (r.data[--i] == y0) ? this.DM : Math.floor(r.data[i] * d1 + (r.data[i - 1] + e) * d2);
        if ((r.data[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
          y.dlShiftTo(j, t);
          r.subTo(t, r);
          while (r.data[i] < --qd)
            r.subTo(t, r);
        }
      }
      if (q != null) {
        r.drShiftTo(ys, q);
        if (ts != ms)
          BigInteger.ZERO.subTo(q, q);
      }
      r.t = ys;
      r.clamp();
      if (nsh > 0)
        r.rShiftTo(nsh, r);
      if (ts < 0)
        BigInteger.ZERO.subTo(r, r);
    }
    function bnMod(a) {
      var r = nbi();
      this.abs().divRemTo(a, null, r);
      if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
        a.subTo(r, r);
      return r;
    }
    function Classic(m) {
      this.m = m;
    }
    function cConvert(x) {
      if (x.s < 0 || x.compareTo(this.m) >= 0)
        return x.mod(this.m);
      else
        return x;
    }
    function cRevert(x) {
      return x;
    }
    function cReduce(x) {
      x.divRemTo(this.m, null, x);
    }
    function cMulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    }
    function cSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;
    function bnpInvDigit() {
      if (this.t < 1)
        return 0;
      var x = this.data[0];
      if ((x & 1) == 0)
        return 0;
      var y = x & 3;
      y = (y * (2 - (x & 0xf) * y)) & 0xf;
      y = (y * (2 - (x & 0xff) * y)) & 0xff;
      y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
      y = (y * (2 - x * y % this.DV)) % this.DV;
      return (y > 0) ? this.DV - y : -y;
    }
    function Montgomery(m) {
      this.m = m;
      this.mp = m.invDigit();
      this.mpl = this.mp & 0x7fff;
      this.mph = this.mp >> 15;
      this.um = (1 << (m.DB - 15)) - 1;
      this.mt2 = 2 * m.t;
    }
    function montConvert(x) {
      var r = nbi();
      x.abs().dlShiftTo(this.m.t, r);
      r.divRemTo(this.m, null, r);
      if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
        this.m.subTo(r, r);
      return r;
    }
    function montRevert(x) {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
    function montReduce(x) {
      while (x.t <= this.mt2)
        x.data[x.t++] = 0;
      for (var i = 0; i < this.m.t; ++i) {
        var j = x.data[i] & 0x7fff;
        var u0 = (j * this.mpl + (((j * this.mph + (x.data[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
        j = i + this.m.t;
        x.data[j] += this.m.am(0, u0, x, i, 0, this.m.t);
        while (x.data[j] >= x.DV) {
          x.data[j] -= x.DV;
          x.data[++j]++;
        }
      }
      x.clamp();
      x.drShiftTo(this.m.t, x);
      if (x.compareTo(this.m) >= 0)
        x.subTo(this.m, x);
    }
    function montSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    function montMulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    }
    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;
    function bnpIsEven() {
      return ((this.t > 0) ? (this.data[0] & 1) : this.s) == 0;
    }
    function bnpExp(e, z) {
      if (e > 0xffffffff || e < 1)
        return BigInteger.ONE;
      var r = nbi(),
          r2 = nbi(),
          g = z.convert(this),
          i = nbits(e) - 1;
      g.copyTo(r);
      while (--i >= 0) {
        z.sqrTo(r, r2);
        if ((e & (1 << i)) > 0)
          z.mulTo(r2, g, r);
        else {
          var t = r;
          r = r2;
          r2 = t;
        }
      }
      return z.revert(r);
    }
    function bnModPowInt(e, m) {
      var z;
      if (e < 256 || m.isEven())
        z = new Classic(m);
      else
        z = new Montgomery(m);
      return this.exp(e, z);
    }
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);
    function bnClone() {
      var r = nbi();
      this.copyTo(r);
      return r;
    }
    function bnIntValue() {
      if (this.s < 0) {
        if (this.t == 1)
          return this.data[0] - this.DV;
        else if (this.t == 0)
          return -1;
      } else if (this.t == 1)
        return this.data[0];
      else if (this.t == 0)
        return 0;
      return ((this.data[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this.data[0];
    }
    function bnByteValue() {
      return (this.t == 0) ? this.s : (this.data[0] << 24) >> 24;
    }
    function bnShortValue() {
      return (this.t == 0) ? this.s : (this.data[0] << 16) >> 16;
    }
    function bnpChunkSize(r) {
      return Math.floor(Math.LN2 * this.DB / Math.log(r));
    }
    function bnSigNum() {
      if (this.s < 0)
        return -1;
      else if (this.t <= 0 || (this.t == 1 && this.data[0] <= 0))
        return 0;
      else
        return 1;
    }
    function bnpToRadix(b) {
      if (b == null)
        b = 10;
      if (this.signum() == 0 || b < 2 || b > 36)
        return "0";
      var cs = this.chunkSize(b);
      var a = Math.pow(b, cs);
      var d = nbv(a),
          y = nbi(),
          z = nbi(),
          r = "";
      this.divRemTo(d, y, z);
      while (y.signum() > 0) {
        r = (a + z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d, y, z);
      }
      return z.intValue().toString(b) + r;
    }
    function bnpFromRadix(s, b) {
      this.fromInt(0);
      if (b == null)
        b = 10;
      var cs = this.chunkSize(b);
      var d = Math.pow(b, cs),
          mi = false,
          j = 0,
          w = 0;
      for (var i = 0; i < s.length; ++i) {
        var x = intAt(s, i);
        if (x < 0) {
          if (s.charAt(i) == "-" && this.signum() == 0)
            mi = true;
          continue;
        }
        w = b * w + x;
        if (++j >= cs) {
          this.dMultiply(d);
          this.dAddOffset(w, 0);
          j = 0;
          w = 0;
        }
      }
      if (j > 0) {
        this.dMultiply(Math.pow(b, j));
        this.dAddOffset(w, 0);
      }
      if (mi)
        BigInteger.ZERO.subTo(this, this);
    }
    function bnpFromNumber(a, b, c) {
      if ("number" == typeof b) {
        if (a < 2)
          this.fromInt(1);
        else {
          this.fromNumber(a, c);
          if (!this.testBit(a - 1))
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
          if (this.isEven())
            this.dAddOffset(1, 0);
          while (!this.isProbablePrime(b)) {
            this.dAddOffset(2, 0);
            if (this.bitLength() > a)
              this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
          }
        }
      } else {
        var x = new Array(),
            t = a & 7;
        x.length = (a >> 3) + 1;
        b.nextBytes(x);
        if (t > 0)
          x[0] &= ((1 << t) - 1);
        else
          x[0] = 0;
        this.fromString(x, 256);
      }
    }
    function bnToByteArray() {
      var i = this.t,
          r = new Array();
      r[0] = this.s;
      var p = this.DB - (i * this.DB) % 8,
          d,
          k = 0;
      if (i-- > 0) {
        if (p < this.DB && (d = this.data[i] >> p) != (this.s & this.DM) >> p)
          r[k++] = d | (this.s << (this.DB - p));
        while (i >= 0) {
          if (p < 8) {
            d = (this.data[i] & ((1 << p) - 1)) << (8 - p);
            d |= this.data[--i] >> (p += this.DB - 8);
          } else {
            d = (this.data[i] >> (p -= 8)) & 0xff;
            if (p <= 0) {
              p += this.DB;
              --i;
            }
          }
          if ((d & 0x80) != 0)
            d |= -256;
          if (k == 0 && (this.s & 0x80) != (d & 0x80))
            ++k;
          if (k > 0 || d != this.s)
            r[k++] = d;
        }
      }
      return r;
    }
    function bnEquals(a) {
      return (this.compareTo(a) == 0);
    }
    function bnMin(a) {
      return (this.compareTo(a) < 0) ? this : a;
    }
    function bnMax(a) {
      return (this.compareTo(a) > 0) ? this : a;
    }
    function bnpBitwiseTo(a, op, r) {
      var i,
          f,
          m = Math.min(a.t, this.t);
      for (i = 0; i < m; ++i)
        r.data[i] = op(this.data[i], a.data[i]);
      if (a.t < this.t) {
        f = a.s & this.DM;
        for (i = m; i < this.t; ++i)
          r.data[i] = op(this.data[i], f);
        r.t = this.t;
      } else {
        f = this.s & this.DM;
        for (i = m; i < a.t; ++i)
          r.data[i] = op(f, a.data[i]);
        r.t = a.t;
      }
      r.s = op(this.s, a.s);
      r.clamp();
    }
    function op_and(x, y) {
      return x & y;
    }
    function bnAnd(a) {
      var r = nbi();
      this.bitwiseTo(a, op_and, r);
      return r;
    }
    function op_or(x, y) {
      return x | y;
    }
    function bnOr(a) {
      var r = nbi();
      this.bitwiseTo(a, op_or, r);
      return r;
    }
    function op_xor(x, y) {
      return x ^ y;
    }
    function bnXor(a) {
      var r = nbi();
      this.bitwiseTo(a, op_xor, r);
      return r;
    }
    function op_andnot(x, y) {
      return x & ~y;
    }
    function bnAndNot(a) {
      var r = nbi();
      this.bitwiseTo(a, op_andnot, r);
      return r;
    }
    function bnNot() {
      var r = nbi();
      for (var i = 0; i < this.t; ++i)
        r.data[i] = this.DM & ~this.data[i];
      r.t = this.t;
      r.s = ~this.s;
      return r;
    }
    function bnShiftLeft(n) {
      var r = nbi();
      if (n < 0)
        this.rShiftTo(-n, r);
      else
        this.lShiftTo(n, r);
      return r;
    }
    function bnShiftRight(n) {
      var r = nbi();
      if (n < 0)
        this.lShiftTo(-n, r);
      else
        this.rShiftTo(n, r);
      return r;
    }
    function lbit(x) {
      if (x == 0)
        return -1;
      var r = 0;
      if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16;
      }
      if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8;
      }
      if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4;
      }
      if ((x & 3) == 0) {
        x >>= 2;
        r += 2;
      }
      if ((x & 1) == 0)
        ++r;
      return r;
    }
    function bnGetLowestSetBit() {
      for (var i = 0; i < this.t; ++i)
        if (this.data[i] != 0)
          return i * this.DB + lbit(this.data[i]);
      if (this.s < 0)
        return this.t * this.DB;
      return -1;
    }
    function cbit(x) {
      var r = 0;
      while (x != 0) {
        x &= x - 1;
        ++r;
      }
      return r;
    }
    function bnBitCount() {
      var r = 0,
          x = this.s & this.DM;
      for (var i = 0; i < this.t; ++i)
        r += cbit(this.data[i] ^ x);
      return r;
    }
    function bnTestBit(n) {
      var j = Math.floor(n / this.DB);
      if (j >= this.t)
        return (this.s != 0);
      return ((this.data[j] & (1 << (n % this.DB))) != 0);
    }
    function bnpChangeBit(n, op) {
      var r = BigInteger.ONE.shiftLeft(n);
      this.bitwiseTo(r, op, r);
      return r;
    }
    function bnSetBit(n) {
      return this.changeBit(n, op_or);
    }
    function bnClearBit(n) {
      return this.changeBit(n, op_andnot);
    }
    function bnFlipBit(n) {
      return this.changeBit(n, op_xor);
    }
    function bnpAddTo(a, r) {
      var i = 0,
          c = 0,
          m = Math.min(a.t, this.t);
      while (i < m) {
        c += this.data[i] + a.data[i];
        r.data[i++] = c & this.DM;
        c >>= this.DB;
      }
      if (a.t < this.t) {
        c += a.s;
        while (i < this.t) {
          c += this.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += this.s;
      } else {
        c += this.s;
        while (i < a.t) {
          c += a.data[i];
          r.data[i++] = c & this.DM;
          c >>= this.DB;
        }
        c += a.s;
      }
      r.s = (c < 0) ? -1 : 0;
      if (c > 0)
        r.data[i++] = c;
      else if (c < -1)
        r.data[i++] = this.DV + c;
      r.t = i;
      r.clamp();
    }
    function bnAdd(a) {
      var r = nbi();
      this.addTo(a, r);
      return r;
    }
    function bnSubtract(a) {
      var r = nbi();
      this.subTo(a, r);
      return r;
    }
    function bnMultiply(a) {
      var r = nbi();
      this.multiplyTo(a, r);
      return r;
    }
    function bnDivide(a) {
      var r = nbi();
      this.divRemTo(a, r, null);
      return r;
    }
    function bnRemainder(a) {
      var r = nbi();
      this.divRemTo(a, null, r);
      return r;
    }
    function bnDivideAndRemainder(a) {
      var q = nbi(),
          r = nbi();
      this.divRemTo(a, q, r);
      return new Array(q, r);
    }
    function bnpDMultiply(n) {
      this.data[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
      ++this.t;
      this.clamp();
    }
    function bnpDAddOffset(n, w) {
      if (n == 0)
        return ;
      while (this.t <= w)
        this.data[this.t++] = 0;
      this.data[w] += n;
      while (this.data[w] >= this.DV) {
        this.data[w] -= this.DV;
        if (++w >= this.t)
          this.data[this.t++] = 0;
        ++this.data[w];
      }
    }
    function NullExp() {}
    function nNop(x) {
      return x;
    }
    function nMulTo(x, y, r) {
      x.multiplyTo(y, r);
    }
    function nSqrTo(x, r) {
      x.squareTo(r);
    }
    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;
    function bnPow(e) {
      return this.exp(e, new NullExp());
    }
    function bnpMultiplyLowerTo(a, n, r) {
      var i = Math.min(this.t + a.t, n);
      r.s = 0;
      r.t = i;
      while (i > 0)
        r.data[--i] = 0;
      var j;
      for (j = r.t - this.t; i < j; ++i)
        r.data[i + this.t] = this.am(0, a.data[i], r, i, 0, this.t);
      for (j = Math.min(a.t, n); i < j; ++i)
        this.am(0, a.data[i], r, i, 0, n - i);
      r.clamp();
    }
    function bnpMultiplyUpperTo(a, n, r) {
      --n;
      var i = r.t = this.t + a.t - n;
      r.s = 0;
      while (--i >= 0)
        r.data[i] = 0;
      for (i = Math.max(n - this.t, 0); i < a.t; ++i)
        r.data[this.t + i - n] = this.am(n - i, a.data[i], r, 0, 0, this.t + i - n);
      r.clamp();
      r.drShiftTo(1, r);
    }
    function Barrett(m) {
      this.r2 = nbi();
      this.q3 = nbi();
      BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
      this.mu = this.r2.divide(m);
      this.m = m;
    }
    function barrettConvert(x) {
      if (x.s < 0 || x.t > 2 * this.m.t)
        return x.mod(this.m);
      else if (x.compareTo(this.m) < 0)
        return x;
      else {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
      }
    }
    function barrettRevert(x) {
      return x;
    }
    function barrettReduce(x) {
      x.drShiftTo(this.m.t - 1, this.r2);
      if (x.t > this.m.t + 1) {
        x.t = this.m.t + 1;
        x.clamp();
      }
      this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
      this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
      while (x.compareTo(this.r2) < 0)
        x.dAddOffset(1, this.m.t + 1);
      x.subTo(this.r2, x);
      while (x.compareTo(this.m) >= 0)
        x.subTo(this.m, x);
    }
    function barrettSqrTo(x, r) {
      x.squareTo(r);
      this.reduce(r);
    }
    function barrettMulTo(x, y, r) {
      x.multiplyTo(y, r);
      this.reduce(r);
    }
    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;
    function bnModPow(e, m) {
      var i = e.bitLength(),
          k,
          r = nbv(1),
          z;
      if (i <= 0)
        return r;
      else if (i < 18)
        k = 1;
      else if (i < 48)
        k = 3;
      else if (i < 144)
        k = 4;
      else if (i < 768)
        k = 5;
      else
        k = 6;
      if (i < 8)
        z = new Classic(m);
      else if (m.isEven())
        z = new Barrett(m);
      else
        z = new Montgomery(m);
      var g = new Array(),
          n = 3,
          k1 = k - 1,
          km = (1 << k) - 1;
      g[1] = z.convert(this);
      if (k > 1) {
        var g2 = nbi();
        z.sqrTo(g[1], g2);
        while (n <= km) {
          g[n] = nbi();
          z.mulTo(g2, g[n - 2], g[n]);
          n += 2;
        }
      }
      var j = e.t - 1,
          w,
          is1 = true,
          r2 = nbi(),
          t;
      i = nbits(e.data[j]) - 1;
      while (j >= 0) {
        if (i >= k1)
          w = (e.data[j] >> (i - k1)) & km;
        else {
          w = (e.data[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
          if (j > 0)
            w |= e.data[j - 1] >> (this.DB + i - k1);
        }
        n = k;
        while ((w & 1) == 0) {
          w >>= 1;
          --n;
        }
        if ((i -= n) < 0) {
          i += this.DB;
          --j;
        }
        if (is1) {
          g[w].copyTo(r);
          is1 = false;
        } else {
          while (n > 1) {
            z.sqrTo(r, r2);
            z.sqrTo(r2, r);
            n -= 2;
          }
          if (n > 0)
            z.sqrTo(r, r2);
          else {
            t = r;
            r = r2;
            r2 = t;
          }
          z.mulTo(r2, g[w], r);
        }
        while (j >= 0 && (e.data[j] & (1 << i)) == 0) {
          z.sqrTo(r, r2);
          t = r;
          r = r2;
          r2 = t;
          if (--i < 0) {
            i = this.DB - 1;
            --j;
          }
        }
      }
      return z.revert(r);
    }
    function bnGCD(a) {
      var x = (this.s < 0) ? this.negate() : this.clone();
      var y = (a.s < 0) ? a.negate() : a.clone();
      if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t;
      }
      var i = x.getLowestSetBit(),
          g = y.getLowestSetBit();
      if (g < 0)
        return x;
      if (i < g)
        g = i;
      if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y);
      }
      while (x.signum() > 0) {
        if ((i = x.getLowestSetBit()) > 0)
          x.rShiftTo(i, x);
        if ((i = y.getLowestSetBit()) > 0)
          y.rShiftTo(i, y);
        if (x.compareTo(y) >= 0) {
          x.subTo(y, x);
          x.rShiftTo(1, x);
        } else {
          y.subTo(x, y);
          y.rShiftTo(1, y);
        }
      }
      if (g > 0)
        y.lShiftTo(g, y);
      return y;
    }
    function bnpModInt(n) {
      if (n <= 0)
        return 0;
      var d = this.DV % n,
          r = (this.s < 0) ? n - 1 : 0;
      if (this.t > 0)
        if (d == 0)
          r = this.data[0] % n;
        else
          for (var i = this.t - 1; i >= 0; --i)
            r = (d * r + this.data[i]) % n;
      return r;
    }
    function bnModInverse(m) {
      var ac = m.isEven();
      if ((this.isEven() && ac) || m.signum() == 0)
        return BigInteger.ZERO;
      var u = m.clone(),
          v = this.clone();
      var a = nbv(1),
          b = nbv(0),
          c = nbv(0),
          d = nbv(1);
      while (u.signum() != 0) {
        while (u.isEven()) {
          u.rShiftTo(1, u);
          if (ac) {
            if (!a.isEven() || !b.isEven()) {
              a.addTo(this, a);
              b.subTo(m, b);
            }
            a.rShiftTo(1, a);
          } else if (!b.isEven())
            b.subTo(m, b);
          b.rShiftTo(1, b);
        }
        while (v.isEven()) {
          v.rShiftTo(1, v);
          if (ac) {
            if (!c.isEven() || !d.isEven()) {
              c.addTo(this, c);
              d.subTo(m, d);
            }
            c.rShiftTo(1, c);
          } else if (!d.isEven())
            d.subTo(m, d);
          d.rShiftTo(1, d);
        }
        if (u.compareTo(v) >= 0) {
          u.subTo(v, u);
          if (ac)
            a.subTo(c, a);
          b.subTo(d, b);
        } else {
          v.subTo(u, v);
          if (ac)
            c.subTo(a, c);
          d.subTo(b, d);
        }
      }
      if (v.compareTo(BigInteger.ONE) != 0)
        return BigInteger.ZERO;
      if (d.compareTo(m) >= 0)
        return d.subtract(m);
      if (d.signum() < 0)
        d.addTo(m, d);
      else
        return d;
      if (d.signum() < 0)
        return d.add(m);
      else
        return d;
    }
    var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
    var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
    function bnIsProbablePrime(t) {
      var i,
          x = this.abs();
      if (x.t == 1 && x.data[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i)
          if (x.data[0] == lowprimes[i])
            return true;
        return false;
      }
      if (x.isEven())
        return false;
      i = 1;
      while (i < lowprimes.length) {
        var m = lowprimes[i],
            j = i + 1;
        while (j < lowprimes.length && m < lplim)
          m *= lowprimes[j++];
        m = x.modInt(m);
        while (i < j)
          if (m % lowprimes[i++] == 0)
            return false;
      }
      return x.millerRabin(t);
    }
    function bnpMillerRabin(t) {
      var n1 = this.subtract(BigInteger.ONE);
      var k = n1.getLowestSetBit();
      if (k <= 0)
        return false;
      var r = n1.shiftRight(k);
      var prng = bnGetPrng();
      var a;
      for (var i = 0; i < t; ++i) {
        do {
          a = new BigInteger(this.bitLength(), prng);
        } while (a.compareTo(BigInteger.ONE) <= 0 || a.compareTo(n1) >= 0);
        var y = a.modPow(r, this);
        if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
          var j = 1;
          while (j++ < k && y.compareTo(n1) != 0) {
            y = y.modPowInt(2, this);
            if (y.compareTo(BigInteger.ONE) == 0)
              return false;
          }
          if (y.compareTo(n1) != 0)
            return false;
        }
      }
      return true;
    }
    function bnGetPrng() {
      return {nextBytes: function(x) {
          for (var i = 0; i < x.length; ++i) {
            x[i] = Math.floor(Math.random() * 0x0100);
          }
        }};
    }
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.fromNumber = bnpFromNumber;
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    BigInteger.prototype.changeBit = bnpChangeBit;
    BigInteger.prototype.addTo = bnpAddTo;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    BigInteger.prototype.modInt = bnpModInt;
    BigInteger.prototype.millerRabin = bnpMillerRabin;
    BigInteger.prototype.clone = bnClone;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.byteValue = bnByteValue;
    BigInteger.prototype.shortValue = bnShortValue;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.toByteArray = bnToByteArray;
    BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.min = bnMin;
    BigInteger.prototype.max = bnMax;
    BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.or = bnOr;
    BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.not = bnNot;
    BigInteger.prototype.shiftLeft = bnShiftLeft;
    BigInteger.prototype.shiftRight = bnShiftRight;
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    BigInteger.prototype.bitCount = bnBitCount;
    BigInteger.prototype.testBit = bnTestBit;
    BigInteger.prototype.setBit = bnSetBit;
    BigInteger.prototype.clearBit = bnClearBit;
    BigInteger.prototype.flipBit = bnFlipBit;
    BigInteger.prototype.add = bnAdd;
    BigInteger.prototype.subtract = bnSubtract;
    BigInteger.prototype.multiply = bnMultiply;
    BigInteger.prototype.divide = bnDivide;
    BigInteger.prototype.remainder = bnRemainder;
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    BigInteger.prototype.modPow = bnModPow;
    BigInteger.prototype.modInverse = bnModInverse;
    BigInteger.prototype.pow = bnPow;
    BigInteger.prototype.gcd = bnGCD;
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
    forge.jsbn = forge.jsbn || {};
    forge.jsbn.BigInteger = BigInteger;
  }
  var name = 'jsbn';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/jsbn", [], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module);
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var pkcs1 = forge.pkcs1 = forge.pkcs1 || {};
    pkcs1.encode_rsa_oaep = function(key, message, options) {
      var label;
      var seed;
      var md;
      var mgf1Md;
      if (typeof options === 'string') {
        label = options;
        seed = arguments[3] || undefined;
        md = arguments[4] || undefined;
      } else if (options) {
        label = options.label || undefined;
        seed = options.seed || undefined;
        md = options.md || undefined;
        if (options.mgf1 && options.mgf1.md) {
          mgf1Md = options.mgf1.md;
        }
      }
      if (!md) {
        md = forge.md.sha1.create();
      } else {
        md.start();
      }
      if (!mgf1Md) {
        mgf1Md = md;
      }
      var keyLength = Math.ceil(key.n.bitLength() / 8);
      var maxLength = keyLength - 2 * md.digestLength - 2;
      if (message.length > maxLength) {
        var error = new Error('RSAES-OAEP input message length is too long.');
        error.length = message.length;
        error.maxLength = maxLength;
        throw error;
      }
      if (!label) {
        label = '';
      }
      md.update(label, 'raw');
      var lHash = md.digest();
      var PS = '';
      var PS_length = maxLength - message.length;
      for (var i = 0; i < PS_length; i++) {
        PS += '\x00';
      }
      var DB = lHash.getBytes() + PS + '\x01' + message;
      if (!seed) {
        seed = forge.random.getBytes(md.digestLength);
      } else if (seed.length !== md.digestLength) {
        var error = new Error('Invalid RSAES-OAEP seed. The seed length must ' + 'match the digest length.');
        error.seedLength = seed.length;
        error.digestLength = md.digestLength;
        throw error;
      }
      var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
      var maskedDB = forge.util.xorBytes(DB, dbMask, DB.length);
      var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
      var maskedSeed = forge.util.xorBytes(seed, seedMask, seed.length);
      return '\x00' + maskedSeed + maskedDB;
    };
    pkcs1.decode_rsa_oaep = function(key, em, options) {
      var label;
      var md;
      var mgf1Md;
      if (typeof options === 'string') {
        label = options;
        md = arguments[3] || undefined;
      } else if (options) {
        label = options.label || undefined;
        md = options.md || undefined;
        if (options.mgf1 && options.mgf1.md) {
          mgf1Md = options.mgf1.md;
        }
      }
      var keyLength = Math.ceil(key.n.bitLength() / 8);
      if (em.length !== keyLength) {
        var error = new Error('RSAES-OAEP encoded message length is invalid.');
        error.length = em.length;
        error.expectedLength = keyLength;
        throw error;
      }
      if (md === undefined) {
        md = forge.md.sha1.create();
      } else {
        md.start();
      }
      if (!mgf1Md) {
        mgf1Md = md;
      }
      if (keyLength < 2 * md.digestLength + 2) {
        throw new Error('RSAES-OAEP key is too short for the hash function.');
      }
      if (!label) {
        label = '';
      }
      md.update(label, 'raw');
      var lHash = md.digest().getBytes();
      var y = em.charAt(0);
      var maskedSeed = em.substring(1, md.digestLength + 1);
      var maskedDB = em.substring(1 + md.digestLength);
      var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
      var seed = forge.util.xorBytes(maskedSeed, seedMask, maskedSeed.length);
      var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
      var db = forge.util.xorBytes(maskedDB, dbMask, maskedDB.length);
      var lHashPrime = db.substring(0, md.digestLength);
      var error = (y !== '\x00');
      for (var i = 0; i < md.digestLength; ++i) {
        error |= (lHash.charAt(i) !== lHashPrime.charAt(i));
      }
      var in_ps = 1;
      var index = md.digestLength;
      for (var j = md.digestLength; j < db.length; j++) {
        var code = db.charCodeAt(j);
        var is_0 = (code & 0x1) ^ 0x1;
        var error_mask = in_ps ? 0xfffe : 0x0000;
        error |= (code & error_mask);
        in_ps = in_ps & is_0;
        index += in_ps;
      }
      if (error || db.charCodeAt(index) !== 0x1) {
        throw new Error('Invalid RSAES-OAEP padding.');
      }
      return db.substring(index + 1);
    };
    function rsa_mgf1(seed, maskLength, hash) {
      if (!hash) {
        hash = forge.md.sha1.create();
      }
      var t = '';
      var count = Math.ceil(maskLength / hash.digestLength);
      for (var i = 0; i < count; ++i) {
        var c = String.fromCharCode((i >> 24) & 0xFF, (i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF);
        hash.start();
        hash.update(seed + c);
        t += hash.digest().getBytes();
      }
      return t.substring(0, maskLength);
    }
  }
  var name = 'pkcs1';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pkcs1", ["npm:node-forge@0.6.26/js/util", "npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/sha1"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'), __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/sha1'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    if (forge.prime) {
      return ;
    }
    var prime = forge.prime = forge.prime || {};
    var BigInteger = forge.jsbn.BigInteger;
    var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
    var THIRTY = new BigInteger(null);
    THIRTY.fromInt(30);
    var op_or = function(x, y) {
      return x | y;
    };
    prime.generateProbablePrime = function(bits, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};
      var algorithm = options.algorithm || 'PRIMEINC';
      if (typeof algorithm === 'string') {
        algorithm = {name: algorithm};
      }
      algorithm.options = algorithm.options || {};
      var prng = options.prng || forge.random;
      var rng = {nextBytes: function(x) {
          var b = prng.getBytesSync(x.length);
          for (var i = 0; i < x.length; ++i) {
            x[i] = b.charCodeAt(i);
          }
        }};
      if (algorithm.name === 'PRIMEINC') {
        return primeincFindPrime(bits, rng, algorithm.options, callback);
      }
      throw new Error('Invalid prime generation algorithm: ' + algorithm.name);
    };
    function primeincFindPrime(bits, rng, options, callback) {
      if ('workers' in options) {
        return primeincFindPrimeWithWorkers(bits, rng, options, callback);
      }
      return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
    }
    function primeincFindPrimeWithoutWorkers(bits, rng, options, callback) {
      var num = generateRandom(bits, rng);
      var deltaIdx = 0;
      var mrTests = getMillerRabinTests(num.bitLength());
      if ('millerRabinTests' in options) {
        mrTests = options.millerRabinTests;
      }
      var maxBlockTime = 10;
      if ('maxBlockTime' in options) {
        maxBlockTime = options.maxBlockTime;
      }
      var start = +new Date();
      do {
        if (num.bitLength() > bits) {
          num = generateRandom(bits, rng);
        }
        if (num.isProbablePrime(mrTests)) {
          return callback(null, num);
        }
        num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
      } while (maxBlockTime < 0 || (+new Date() - start < maxBlockTime));
      forge.util.setImmediate(function() {
        primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
      });
    }
    function primeincFindPrimeWithWorkers(bits, rng, options, callback) {
      if (typeof Worker === 'undefined') {
        return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
      }
      var num = generateRandom(bits, rng);
      var numWorkers = options.workers;
      var workLoad = options.workLoad || 100;
      var range = workLoad * 30 / 8;
      var workerScript = options.workerScript || 'forge/prime.worker.js';
      if (numWorkers === -1) {
        return forge.util.estimateCores(function(err, cores) {
          if (err) {
            cores = 2;
          }
          numWorkers = cores - 1;
          generate();
        });
      }
      generate();
      function generate() {
        numWorkers = Math.max(1, numWorkers);
        var workers = [];
        for (var i = 0; i < numWorkers; ++i) {
          workers[i] = new Worker(workerScript);
        }
        var running = numWorkers;
        for (var i = 0; i < numWorkers; ++i) {
          workers[i].addEventListener('message', workerMessage);
        }
        var found = false;
        function workerMessage(e) {
          if (found) {
            return ;
          }
          --running;
          var data = e.data;
          if (data.found) {
            for (var i = 0; i < workers.length; ++i) {
              workers[i].terminate();
            }
            found = true;
            return callback(null, new BigInteger(data.prime, 16));
          }
          if (num.bitLength() > bits) {
            num = generateRandom(bits, rng);
          }
          var hex = num.toString(16);
          e.target.postMessage({
            hex: hex,
            workLoad: workLoad
          });
          num.dAddOffset(range, 0);
        }
      }
    }
    function generateRandom(bits, rng) {
      var num = new BigInteger(bits, rng);
      var bits1 = bits - 1;
      if (!num.testBit(bits1)) {
        num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, num);
      }
      num.dAddOffset(31 - num.mod(THIRTY).byteValue(), 0);
      return num;
    }
    function getMillerRabinTests(bits) {
      if (bits <= 100)
        return 27;
      if (bits <= 150)
        return 18;
      if (bits <= 200)
        return 15;
      if (bits <= 250)
        return 12;
      if (bits <= 300)
        return 9;
      if (bits <= 350)
        return 8;
      if (bits <= 400)
        return 7;
      if (bits <= 500)
        return 6;
      if (bits <= 600)
        return 5;
      if (bits <= 800)
        return 4;
      if (bits <= 1250)
        return 3;
      return 2;
    }
  }
  var name = 'prime';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/prime", ["npm:node-forge@0.6.26/js/util", "npm:node-forge@0.6.26/js/jsbn", "npm:node-forge@0.6.26/js/random"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'), __require('npm:node-forge@0.6.26/js/jsbn'), __require('npm:node-forge@0.6.26/js/random'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var asn1 = forge.asn1;
    var p7v = forge.pkcs7asn1 = forge.pkcs7asn1 || {};
    forge.pkcs7 = forge.pkcs7 || {};
    forge.pkcs7.asn1 = p7v;
    var contentInfoValidator = {
      name: 'ContentInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'ContentInfo.ContentType',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: 'contentType'
      }, {
        name: 'ContentInfo.content',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: true,
        optional: true,
        captureAsn1: 'content'
      }]
    };
    p7v.contentInfoValidator = contentInfoValidator;
    var encryptedContentInfoValidator = {
      name: 'EncryptedContentInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'EncryptedContentInfo.contentType',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: 'contentType'
      }, {
        name: 'EncryptedContentInfo.contentEncryptionAlgorithm',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'EncryptedContentInfo.contentEncryptionAlgorithm.algorithm',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'encAlgorithm'
        }, {
          name: 'EncryptedContentInfo.contentEncryptionAlgorithm.parameter',
          tagClass: asn1.Class.UNIVERSAL,
          captureAsn1: 'encParameter'
        }]
      }, {
        name: 'EncryptedContentInfo.encryptedContent',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        capture: 'encryptedContent',
        captureAsn1: 'encryptedContentAsn1'
      }]
    };
    p7v.envelopedDataValidator = {
      name: 'EnvelopedData',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'EnvelopedData.Version',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'version'
      }, {
        name: 'EnvelopedData.RecipientInfos',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        constructed: true,
        captureAsn1: 'recipientInfos'
      }].concat(encryptedContentInfoValidator)
    };
    p7v.encryptedDataValidator = {
      name: 'EncryptedData',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'EncryptedData.Version',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'version'
      }].concat(encryptedContentInfoValidator)
    };
    var signerValidator = {
      name: 'SignerInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'SignerInfo.Version',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false
      }, {
        name: 'SignerInfo.IssuerAndSerialNumber',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true
      }, {
        name: 'SignerInfo.DigestAlgorithm',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true
      }, {
        name: 'SignerInfo.AuthenticatedAttributes',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: true,
        optional: true,
        capture: 'authenticatedAttributes'
      }, {
        name: 'SignerInfo.DigestEncryptionAlgorithm',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true
      }, {
        name: 'SignerInfo.EncryptedDigest',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: 'signature'
      }, {
        name: 'SignerInfo.UnauthenticatedAttributes',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        constructed: true,
        optional: true
      }]
    };
    p7v.signedDataValidator = {
      name: 'SignedData',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'SignedData.Version',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'version'
      }, {
        name: 'SignedData.DigestAlgorithms',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        constructed: true,
        captureAsn1: 'digestAlgorithms'
      }, contentInfoValidator, {
        name: 'SignedData.Certificates',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        optional: true,
        captureAsn1: 'certificates'
      }, {
        name: 'SignedData.CertificateRevocationLists',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        optional: true,
        captureAsn1: 'crls'
      }, {
        name: 'SignedData.SignerInfos',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        capture: 'signerInfos',
        optional: true,
        value: [signerValidator]
      }]
    };
    p7v.recipientInfoValidator = {
      name: 'RecipientInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'RecipientInfo.version',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'version'
      }, {
        name: 'RecipientInfo.issuerAndSerial',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'RecipientInfo.issuerAndSerial.issuer',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: 'issuer'
        }, {
          name: 'RecipientInfo.issuerAndSerial.serialNumber',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: 'serial'
        }]
      }, {
        name: 'RecipientInfo.keyEncryptionAlgorithm',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'RecipientInfo.keyEncryptionAlgorithm.algorithm',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'encAlgorithm'
        }, {
          name: 'RecipientInfo.keyEncryptionAlgorithm.parameter',
          tagClass: asn1.Class.UNIVERSAL,
          constructed: false,
          captureAsn1: 'encParameter'
        }]
      }, {
        name: 'RecipientInfo.encryptedKey',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: 'encKey'
      }]
    };
  }
  var name = 'pkcs7asn1';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pkcs7asn1", ["npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.mgf = forge.mgf || {};
    var mgf1 = forge.mgf.mgf1 = forge.mgf1 = forge.mgf1 || {};
    mgf1.create = function(md) {
      var mgf = {generate: function(seed, maskLen) {
          var t = new forge.util.ByteBuffer();
          var len = Math.ceil(maskLen / md.digestLength);
          for (var i = 0; i < len; i++) {
            var c = new forge.util.ByteBuffer();
            c.putInt32(i);
            md.start();
            md.update(seed + c.getBytes());
            t.putBuffer(md.digest());
          }
          t.truncate(t.length() - maskLen);
          return t.getBytes();
        }};
      return mgf;
    };
  }
  var name = 'mgf1';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/mgf1", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var pss = forge.pss = forge.pss || {};
    pss.create = function(options) {
      if (arguments.length === 3) {
        options = {
          md: arguments[0],
          mgf: arguments[1],
          saltLength: arguments[2]
        };
      }
      var hash = options.md;
      var mgf = options.mgf;
      var hLen = hash.digestLength;
      var salt_ = options.salt || null;
      if (typeof salt_ === 'string') {
        salt_ = forge.util.createBuffer(salt_);
      }
      var sLen;
      if ('saltLength' in options) {
        sLen = options.saltLength;
      } else if (salt_ !== null) {
        sLen = salt_.length();
      } else {
        throw new Error('Salt length not specified or specific salt not given.');
      }
      if (salt_ !== null && salt_.length() !== sLen) {
        throw new Error('Given salt length does not match length of given salt.');
      }
      var prng = options.prng || forge.random;
      var pssobj = {};
      pssobj.encode = function(md, modBits) {
        var i;
        var emBits = modBits - 1;
        var emLen = Math.ceil(emBits / 8);
        var mHash = md.digest().getBytes();
        if (emLen < hLen + sLen + 2) {
          throw new Error('Message is too long to encrypt.');
        }
        var salt;
        if (salt_ === null) {
          salt = prng.getBytesSync(sLen);
        } else {
          salt = salt_.bytes();
        }
        var m_ = new forge.util.ByteBuffer();
        m_.fillWithByte(0, 8);
        m_.putBytes(mHash);
        m_.putBytes(salt);
        hash.start();
        hash.update(m_.getBytes());
        var h = hash.digest().getBytes();
        var ps = new forge.util.ByteBuffer();
        ps.fillWithByte(0, emLen - sLen - hLen - 2);
        ps.putByte(0x01);
        ps.putBytes(salt);
        var db = ps.getBytes();
        var maskLen = emLen - hLen - 1;
        var dbMask = mgf.generate(h, maskLen);
        var maskedDB = '';
        for (i = 0; i < maskLen; i++) {
          maskedDB += String.fromCharCode(db.charCodeAt(i) ^ dbMask.charCodeAt(i));
        }
        var mask = (0xFF00 >> (8 * emLen - emBits)) & 0xFF;
        maskedDB = String.fromCharCode(maskedDB.charCodeAt(0) & ~mask) + maskedDB.substr(1);
        return maskedDB + h + String.fromCharCode(0xbc);
      };
      pssobj.verify = function(mHash, em, modBits) {
        var i;
        var emBits = modBits - 1;
        var emLen = Math.ceil(emBits / 8);
        em = em.substr(-emLen);
        if (emLen < hLen + sLen + 2) {
          throw new Error('Inconsistent parameters to PSS signature verification.');
        }
        if (em.charCodeAt(emLen - 1) !== 0xbc) {
          throw new Error('Encoded message does not end in 0xBC.');
        }
        var maskLen = emLen - hLen - 1;
        var maskedDB = em.substr(0, maskLen);
        var h = em.substr(maskLen, hLen);
        var mask = (0xFF00 >> (8 * emLen - emBits)) & 0xFF;
        if ((maskedDB.charCodeAt(0) & mask) !== 0) {
          throw new Error('Bits beyond keysize not zero as expected.');
        }
        var dbMask = mgf.generate(h, maskLen);
        var db = '';
        for (i = 0; i < maskLen; i++) {
          db += String.fromCharCode(maskedDB.charCodeAt(i) ^ dbMask.charCodeAt(i));
        }
        db = String.fromCharCode(db.charCodeAt(0) & ~mask) + db.substr(1);
        var checkLen = emLen - hLen - sLen - 2;
        for (i = 0; i < checkLen; i++) {
          if (db.charCodeAt(i) !== 0x00) {
            throw new Error('Leftmost octets not zero as expected');
          }
        }
        if (db.charCodeAt(checkLen) !== 0x01) {
          throw new Error('Inconsistent PSS signature, 0x01 marker not found');
        }
        var salt = db.substr(-sLen);
        var m_ = new forge.util.ByteBuffer();
        m_.fillWithByte(0, 8);
        m_.putBytes(mHash);
        m_.putBytes(salt);
        hash.start();
        hash.update(m_.getBytes());
        var h_ = hash.digest().getBytes();
        return h === h_;
      };
      return pssobj;
    };
  }
  var name = 'pss';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pss", ["npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.debug = forge.debug || {};
    forge.debug.storage = {};
    forge.debug.get = function(cat, name) {
      var rval;
      if (typeof(cat) === 'undefined') {
        rval = forge.debug.storage;
      } else if (cat in forge.debug.storage) {
        if (typeof(name) === 'undefined') {
          rval = forge.debug.storage[cat];
        } else {
          rval = forge.debug.storage[cat][name];
        }
      }
      return rval;
    };
    forge.debug.set = function(cat, name, data) {
      if (!(cat in forge.debug.storage)) {
        forge.debug.storage[cat] = {};
      }
      forge.debug.storage[cat][name] = data;
    };
    forge.debug.clear = function(cat, name) {
      if (typeof(cat) === 'undefined') {
        forge.debug.storage = {};
      } else if (cat in forge.debug.storage) {
        if (typeof(name) === 'undefined') {
          delete forge.debug.storage[cat];
        } else {
          delete forge.debug.storage[cat][name];
        }
      }
    };
  }
  var name = 'debug';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/debug", [], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module);
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.kem = forge.kem || {};
    var BigInteger = forge.jsbn.BigInteger;
    forge.kem.rsa = {};
    forge.kem.rsa.create = function(kdf, options) {
      options = options || {};
      var prng = options.prng || forge.random;
      var kem = {};
      kem.encrypt = function(publicKey, keyLength) {
        var byteLength = Math.ceil(publicKey.n.bitLength() / 8);
        var r;
        do {
          r = new BigInteger(forge.util.bytesToHex(prng.getBytesSync(byteLength)), 16).mod(publicKey.n);
        } while (r.equals(BigInteger.ZERO));
        r = forge.util.hexToBytes(r.toString(16));
        var zeros = byteLength - r.length;
        if (zeros > 0) {
          r = forge.util.fillString(String.fromCharCode(0), zeros) + r;
        }
        var encapsulation = publicKey.encrypt(r, 'NONE');
        var key = kdf.generate(r, keyLength);
        return {
          encapsulation: encapsulation,
          key: key
        };
      };
      kem.decrypt = function(privateKey, encapsulation, keyLength) {
        var r = privateKey.decrypt(encapsulation, 'NONE');
        return kdf.generate(r, keyLength);
      };
      return kem;
    };
    forge.kem.kdf1 = function(md, digestLength) {
      _createKDF(this, md, 0, digestLength || md.digestLength);
    };
    forge.kem.kdf2 = function(md, digestLength) {
      _createKDF(this, md, 1, digestLength || md.digestLength);
    };
    function _createKDF(kdf, md, counterStart, digestLength) {
      kdf.generate = function(x, length) {
        var key = new forge.util.ByteBuffer();
        var k = Math.ceil(length / digestLength) + counterStart;
        var c = new forge.util.ByteBuffer();
        for (var i = counterStart; i < k; ++i) {
          c.putInt32(i);
          md.start();
          md.update(x + c.getBytes());
          var hash = md.digest();
          key.putBytes(hash.getBytes(digestLength));
        }
        key.truncate(key.length() - length);
        return key.getBytes();
      };
    }
  }
  var name = 'kem';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/kem", ["npm:node-forge@0.6.26/js/util", "npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/jsbn"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'), __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/jsbn'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.log = forge.log || {};
    forge.log.levels = ['none', 'error', 'warning', 'info', 'debug', 'verbose', 'max'];
    var sLevelInfo = {};
    var sLoggers = [];
    var sConsoleLogger = null;
    forge.log.LEVEL_LOCKED = (1 << 1);
    forge.log.NO_LEVEL_CHECK = (1 << 2);
    forge.log.INTERPOLATE = (1 << 3);
    for (var i = 0; i < forge.log.levels.length; ++i) {
      var level = forge.log.levels[i];
      sLevelInfo[level] = {
        index: i,
        name: level.toUpperCase()
      };
    }
    forge.log.logMessage = function(message) {
      var messageLevelIndex = sLevelInfo[message.level].index;
      for (var i = 0; i < sLoggers.length; ++i) {
        var logger = sLoggers[i];
        if (logger.flags & forge.log.NO_LEVEL_CHECK) {
          logger.f(message);
        } else {
          var loggerLevelIndex = sLevelInfo[logger.level].index;
          if (messageLevelIndex <= loggerLevelIndex) {
            logger.f(logger, message);
          }
        }
      }
    };
    forge.log.prepareStandard = function(message) {
      if (!('standard' in message)) {
        message.standard = sLevelInfo[message.level].name + ' [' + message.category + '] ' + message.message;
      }
    };
    forge.log.prepareFull = function(message) {
      if (!('full' in message)) {
        var args = [message.message];
        args = args.concat([] || message['arguments']);
        message.full = forge.util.format.apply(this, args);
      }
    };
    forge.log.prepareStandardFull = function(message) {
      if (!('standardFull' in message)) {
        forge.log.prepareStandard(message);
        message.standardFull = message.standard;
      }
    };
    if (true) {
      var levels = ['error', 'warning', 'info', 'debug', 'verbose'];
      for (var i = 0; i < levels.length; ++i) {
        (function(level) {
          forge.log[level] = function(category, message) {
            var args = Array.prototype.slice.call(arguments).slice(2);
            var msg = {
              timestamp: new Date(),
              level: level,
              category: category,
              message: message,
              'arguments': args
            };
            forge.log.logMessage(msg);
          };
        })(levels[i]);
      }
    }
    forge.log.makeLogger = function(logFunction) {
      var logger = {
        flags: 0,
        f: logFunction
      };
      forge.log.setLevel(logger, 'none');
      return logger;
    };
    forge.log.setLevel = function(logger, level) {
      var rval = false;
      if (logger && !(logger.flags & forge.log.LEVEL_LOCKED)) {
        for (var i = 0; i < forge.log.levels.length; ++i) {
          var aValidLevel = forge.log.levels[i];
          if (level == aValidLevel) {
            logger.level = level;
            rval = true;
            break;
          }
        }
      }
      return rval;
    };
    forge.log.lock = function(logger, lock) {
      if (typeof lock === 'undefined' || lock) {
        logger.flags |= forge.log.LEVEL_LOCKED;
      } else {
        logger.flags &= ~forge.log.LEVEL_LOCKED;
      }
    };
    forge.log.addLogger = function(logger) {
      sLoggers.push(logger);
    };
    if (typeof(console) !== 'undefined' && 'log' in console) {
      var logger;
      if (console.error && console.warn && console.info && console.debug) {
        var levelHandlers = {
          error: console.error,
          warning: console.warn,
          info: console.info,
          debug: console.debug,
          verbose: console.debug
        };
        var f = function(logger, message) {
          forge.log.prepareStandard(message);
          var handler = levelHandlers[message.level];
          var args = [message.standard];
          args = args.concat(message['arguments'].slice());
          handler.apply(console, args);
        };
        logger = forge.log.makeLogger(f);
      } else {
        var f = function(logger, message) {
          forge.log.prepareStandardFull(message);
          console.log(message.standardFull);
        };
        logger = forge.log.makeLogger(f);
      }
      forge.log.setLevel(logger, 'debug');
      forge.log.addLogger(logger);
      sConsoleLogger = logger;
    } else {
      console = {log: function() {}};
    }
    if (sConsoleLogger !== null) {
      var query = forge.util.getQueryVariables();
      if ('console.level' in query) {
        forge.log.setLevel(sConsoleLogger, query['console.level'].slice(-1)[0]);
      }
      if ('console.lock' in query) {
        var lock = query['console.lock'].slice(-1)[0];
        if (lock == 'true') {
          forge.log.lock(sConsoleLogger);
        }
      }
    }
    forge.log.consoleLogger = sConsoleLogger;
  }
  var name = 'log';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/log", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var asn1 = forge.asn1;
    var p7 = forge.pkcs7 = forge.pkcs7 || {};
    p7.messageFromPem = function(pem) {
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== 'PKCS7') {
        var error = new Error('Could not convert PKCS#7 message from PEM; PEM ' + 'header type is not "PKCS#7".');
        error.headerType = msg.type;
        throw error;
      }
      if (msg.procType && msg.procType.type === 'ENCRYPTED') {
        throw new Error('Could not convert PKCS#7 message from PEM; PEM is encrypted.');
      }
      var obj = asn1.fromDer(msg.body);
      return p7.messageFromAsn1(obj);
    };
    p7.messageToPem = function(msg, maxline) {
      var pemObj = {
        type: 'PKCS7',
        body: asn1.toDer(msg.toAsn1()).getBytes()
      };
      return forge.pem.encode(pemObj, {maxline: maxline});
    };
    p7.messageFromAsn1 = function(obj) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, p7.asn1.contentInfoValidator, capture, errors)) {
        var error = new Error('Cannot read PKCS#7 message. ' + 'ASN.1 object is not an PKCS#7 ContentInfo.');
        error.errors = errors;
        throw error;
      }
      var contentType = asn1.derToOid(capture.contentType);
      var msg;
      switch (contentType) {
        case forge.pki.oids.envelopedData:
          msg = p7.createEnvelopedData();
          break;
        case forge.pki.oids.encryptedData:
          msg = p7.createEncryptedData();
          break;
        case forge.pki.oids.signedData:
          msg = p7.createSignedData();
          break;
        default:
          throw new Error('Cannot read PKCS#7 message. ContentType with OID ' + contentType + ' is not (yet) supported.');
      }
      msg.fromAsn1(capture.content.value[0]);
      return msg;
    };
    var _recipientInfoFromAsn1 = function(obj) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, p7.asn1.recipientInfoValidator, capture, errors)) {
        var error = new Error('Cannot read PKCS#7 message. ' + 'ASN.1 object is not an PKCS#7 EnvelopedData.');
        error.errors = errors;
        throw error;
      }
      return {
        version: capture.version.charCodeAt(0),
        issuer: forge.pki.RDNAttributesAsArray(capture.issuer),
        serialNumber: forge.util.createBuffer(capture.serial).toHex(),
        encryptedContent: {
          algorithm: asn1.derToOid(capture.encAlgorithm),
          parameter: capture.encParameter.value,
          content: capture.encKey
        }
      };
    };
    var _recipientInfoToAsn1 = function(obj) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(obj.version).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [forge.pki.distinguishedNameToAsn1({attributes: obj.issuer}), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(obj.serialNumber))]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.encryptedContent.algorithm).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, obj.encryptedContent.content)]);
    };
    var _recipientInfosFromAsn1 = function(objArr) {
      var ret = [];
      for (var i = 0; i < objArr.length; i++) {
        ret.push(_recipientInfoFromAsn1(objArr[i]));
      }
      return ret;
    };
    var _recipientInfosToAsn1 = function(recipientsArr) {
      var ret = [];
      for (var i = 0; i < recipientsArr.length; i++) {
        ret.push(_recipientInfoToAsn1(recipientsArr[i]));
      }
      return ret;
    };
    var _encryptedContentToAsn1 = function(ec) {
      return [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge.pki.oids.data).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(ec.algorithm).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ec.parameter.getBytes())]), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ec.content.getBytes())])];
    };
    var _fromAsn1 = function(msg, obj, validator) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, validator, capture, errors)) {
        var error = new Error('Cannot read PKCS#7 message. ' + 'ASN.1 object is not a supported PKCS#7 message.');
        error.errors = error;
        throw error;
      }
      var contentType = asn1.derToOid(capture.contentType);
      if (contentType !== forge.pki.oids.data) {
        throw new Error('Unsupported PKCS#7 message. ' + 'Only wrapped ContentType Data supported.');
      }
      if (capture.encryptedContent) {
        var content = '';
        if (forge.util.isArray(capture.encryptedContent)) {
          for (var i = 0; i < capture.encryptedContent.length; ++i) {
            if (capture.encryptedContent[i].type !== asn1.Type.OCTETSTRING) {
              throw new Error('Malformed PKCS#7 message, expecting encrypted ' + 'content constructed of only OCTET STRING objects.');
            }
            content += capture.encryptedContent[i].value;
          }
        } else {
          content = capture.encryptedContent;
        }
        msg.encryptedContent = {
          algorithm: asn1.derToOid(capture.encAlgorithm),
          parameter: forge.util.createBuffer(capture.encParameter.value),
          content: forge.util.createBuffer(content)
        };
      }
      if (capture.content) {
        var content = '';
        if (forge.util.isArray(capture.content)) {
          for (var i = 0; i < capture.content.length; ++i) {
            if (capture.content[i].type !== asn1.Type.OCTETSTRING) {
              throw new Error('Malformed PKCS#7 message, expecting ' + 'content constructed of only OCTET STRING objects.');
            }
            content += capture.content[i].value;
          }
        } else {
          content = capture.content;
        }
        msg.content = forge.util.createBuffer(content);
      }
      msg.version = capture.version.charCodeAt(0);
      msg.rawCapture = capture;
      return capture;
    };
    var _decryptContent = function(msg) {
      if (msg.encryptedContent.key === undefined) {
        throw new Error('Symmetric key not available.');
      }
      if (msg.content === undefined) {
        var ciph;
        switch (msg.encryptedContent.algorithm) {
          case forge.pki.oids['aes128-CBC']:
          case forge.pki.oids['aes192-CBC']:
          case forge.pki.oids['aes256-CBC']:
            ciph = forge.aes.createDecryptionCipher(msg.encryptedContent.key);
            break;
          case forge.pki.oids['desCBC']:
          case forge.pki.oids['des-EDE3-CBC']:
            ciph = forge.des.createDecryptionCipher(msg.encryptedContent.key);
            break;
          default:
            throw new Error('Unsupported symmetric cipher, OID ' + msg.encryptedContent.algorithm);
        }
        ciph.start(msg.encryptedContent.parameter);
        ciph.update(msg.encryptedContent.content);
        if (!ciph.finish()) {
          throw new Error('Symmetric decryption failed.');
        }
        msg.content = ciph.output;
      }
    };
    p7.createSignedData = function() {
      var msg = null;
      msg = {
        type: forge.pki.oids.signedData,
        version: 1,
        certificates: [],
        crls: [],
        digestAlgorithmIdentifiers: [],
        contentInfo: null,
        signerInfos: [],
        fromAsn1: function(obj) {
          _fromAsn1(msg, obj, p7.asn1.signedDataValidator);
          msg.certificates = [];
          msg.crls = [];
          msg.digestAlgorithmIdentifiers = [];
          msg.contentInfo = null;
          msg.signerInfos = [];
          var certs = msg.rawCapture.certificates.value;
          for (var i = 0; i < certs.length; ++i) {
            msg.certificates.push(forge.pki.certificateFromAsn1(certs[i]));
          }
        },
        toAsn1: function() {
          if ('content' in msg) {
            throw new Error('Signing PKCS#7 content not yet implemented.');
          }
          if (!msg.contentInfo) {
            msg.sign();
          }
          var certs = [];
          for (var i = 0; i < msg.certificates.length; ++i) {
            certs.push(forge.pki.certificateToAsn1(msg.certificates[0]));
          }
          var crls = [];
          return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(msg.type).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(msg.version).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, msg.digestAlgorithmIdentifiers), msg.contentInfo, asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, certs), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, crls), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, msg.signerInfos)])])]);
        },
        sign: function(signer) {
          if ('content' in msg) {
            throw new Error('PKCS#7 signing not yet implemented.');
          }
          if (typeof msg.content !== 'object') {
            msg.contentInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge.pki.oids.data).getBytes())]);
            if ('content' in msg) {
              msg.contentInfo.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, msg.content)]));
            }
          }
        },
        verify: function() {
          throw new Error('PKCS#7 signature verification not yet implemented.');
        },
        addCertificate: function(cert) {
          if (typeof cert === 'string') {
            cert = forge.pki.certificateFromPem(cert);
          }
          msg.certificates.push(cert);
        },
        addCertificateRevokationList: function(crl) {
          throw new Error('PKCS#7 CRL support not yet implemented.');
        }
      };
      return msg;
    };
    p7.createEncryptedData = function() {
      var msg = null;
      msg = {
        type: forge.pki.oids.encryptedData,
        version: 0,
        encryptedContent: {algorithm: forge.pki.oids['aes256-CBC']},
        fromAsn1: function(obj) {
          _fromAsn1(msg, obj, p7.asn1.encryptedDataValidator);
        },
        decrypt: function(key) {
          if (key !== undefined) {
            msg.encryptedContent.key = key;
          }
          _decryptContent(msg);
        }
      };
      return msg;
    };
    p7.createEnvelopedData = function() {
      var msg = null;
      msg = {
        type: forge.pki.oids.envelopedData,
        version: 0,
        recipients: [],
        encryptedContent: {algorithm: forge.pki.oids['aes256-CBC']},
        fromAsn1: function(obj) {
          var capture = _fromAsn1(msg, obj, p7.asn1.envelopedDataValidator);
          msg.recipients = _recipientInfosFromAsn1(capture.recipientInfos.value);
        },
        toAsn1: function() {
          return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(msg.type).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(msg.version).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, _recipientInfosToAsn1(msg.recipients)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, _encryptedContentToAsn1(msg.encryptedContent))])])]);
        },
        findRecipient: function(cert) {
          var sAttr = cert.issuer.attributes;
          for (var i = 0; i < msg.recipients.length; ++i) {
            var r = msg.recipients[i];
            var rAttr = r.issuer;
            if (r.serialNumber !== cert.serialNumber) {
              continue;
            }
            if (rAttr.length !== sAttr.length) {
              continue;
            }
            var match = true;
            for (var j = 0; j < sAttr.length; ++j) {
              if (rAttr[j].type !== sAttr[j].type || rAttr[j].value !== sAttr[j].value) {
                match = false;
                break;
              }
            }
            if (match) {
              return r;
            }
          }
          return null;
        },
        decrypt: function(recipient, privKey) {
          if (msg.encryptedContent.key === undefined && recipient !== undefined && privKey !== undefined) {
            switch (recipient.encryptedContent.algorithm) {
              case forge.pki.oids.rsaEncryption:
              case forge.pki.oids.desCBC:
                var key = privKey.decrypt(recipient.encryptedContent.content);
                msg.encryptedContent.key = forge.util.createBuffer(key);
                break;
              default:
                throw new Error('Unsupported asymmetric cipher, ' + 'OID ' + recipient.encryptedContent.algorithm);
            }
          }
          _decryptContent(msg);
        },
        addRecipient: function(cert) {
          msg.recipients.push({
            version: 0,
            issuer: cert.issuer.attributes,
            serialNumber: cert.serialNumber,
            encryptedContent: {
              algorithm: forge.pki.oids.rsaEncryption,
              key: cert.publicKey
            }
          });
        },
        encrypt: function(key, cipher) {
          if (msg.encryptedContent.content === undefined) {
            cipher = cipher || msg.encryptedContent.algorithm;
            key = key || msg.encryptedContent.key;
            var keyLen,
                ivLen,
                ciphFn;
            switch (cipher) {
              case forge.pki.oids['aes128-CBC']:
                keyLen = 16;
                ivLen = 16;
                ciphFn = forge.aes.createEncryptionCipher;
                break;
              case forge.pki.oids['aes192-CBC']:
                keyLen = 24;
                ivLen = 16;
                ciphFn = forge.aes.createEncryptionCipher;
                break;
              case forge.pki.oids['aes256-CBC']:
                keyLen = 32;
                ivLen = 16;
                ciphFn = forge.aes.createEncryptionCipher;
                break;
              case forge.pki.oids['des-EDE3-CBC']:
                keyLen = 24;
                ivLen = 8;
                ciphFn = forge.des.createEncryptionCipher;
                break;
              default:
                throw new Error('Unsupported symmetric cipher, OID ' + cipher);
            }
            if (key === undefined) {
              key = forge.util.createBuffer(forge.random.getBytes(keyLen));
            } else if (key.length() != keyLen) {
              throw new Error('Symmetric key has wrong length; ' + 'got ' + key.length() + ' bytes, expected ' + keyLen + '.');
            }
            msg.encryptedContent.algorithm = cipher;
            msg.encryptedContent.key = key;
            msg.encryptedContent.parameter = forge.util.createBuffer(forge.random.getBytes(ivLen));
            var ciph = ciphFn(key);
            ciph.start(msg.encryptedContent.parameter.copy());
            ciph.update(msg.content);
            if (!ciph.finish()) {
              throw new Error('Symmetric encryption failed.');
            }
            msg.encryptedContent.content = ciph.output;
          }
          for (var i = 0; i < msg.recipients.length; i++) {
            var recipient = msg.recipients[i];
            if (recipient.encryptedContent.content !== undefined) {
              continue;
            }
            switch (recipient.encryptedContent.algorithm) {
              case forge.pki.oids.rsaEncryption:
                recipient.encryptedContent.content = recipient.encryptedContent.key.encrypt(msg.encryptedContent.key.data);
                break;
              default:
                throw new Error('Unsupported asymmetric cipher, OID ' + recipient.encryptedContent.algorithm);
            }
          }
        }
      };
      return msg;
    };
  }
  var name = 'pkcs7';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pkcs7", ["npm:node-forge@0.6.26/js/aes", "npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/des", "npm:node-forge@0.6.26/js/oids", "npm:node-forge@0.6.26/js/pem", "npm:node-forge@0.6.26/js/pkcs7asn1", "npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/util", "npm:node-forge@0.6.26/js/x509"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/aes'), __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/des'), __require('npm:node-forge@0.6.26/js/oids'), __require('npm:node-forge@0.6.26/js/pem'), __require('npm:node-forge@0.6.26/js/pkcs7asn1'), __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/util'), __require('npm:node-forge@0.6.26/js/x509'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var ssh = forge.ssh = forge.ssh || {};
    ssh.privateKeyToPutty = function(privateKey, passphrase, comment) {
      comment = comment || '';
      passphrase = passphrase || '';
      var algorithm = 'ssh-rsa';
      var encryptionAlgorithm = (passphrase === '') ? 'none' : 'aes256-cbc';
      var ppk = 'PuTTY-User-Key-File-2: ' + algorithm + '\r\n';
      ppk += 'Encryption: ' + encryptionAlgorithm + '\r\n';
      ppk += 'Comment: ' + comment + '\r\n';
      var pubbuffer = forge.util.createBuffer();
      _addStringToBuffer(pubbuffer, algorithm);
      _addBigIntegerToBuffer(pubbuffer, privateKey.e);
      _addBigIntegerToBuffer(pubbuffer, privateKey.n);
      var pub = forge.util.encode64(pubbuffer.bytes(), 64);
      var length = Math.floor(pub.length / 66) + 1;
      ppk += 'Public-Lines: ' + length + '\r\n';
      ppk += pub;
      var privbuffer = forge.util.createBuffer();
      _addBigIntegerToBuffer(privbuffer, privateKey.d);
      _addBigIntegerToBuffer(privbuffer, privateKey.p);
      _addBigIntegerToBuffer(privbuffer, privateKey.q);
      _addBigIntegerToBuffer(privbuffer, privateKey.qInv);
      var priv;
      if (!passphrase) {
        priv = forge.util.encode64(privbuffer.bytes(), 64);
      } else {
        var encLen = privbuffer.length() + 16 - 1;
        encLen -= encLen % 16;
        var padding = _sha1(privbuffer.bytes());
        padding.truncate(padding.length() - encLen + privbuffer.length());
        privbuffer.putBuffer(padding);
        var aeskey = forge.util.createBuffer();
        aeskey.putBuffer(_sha1('\x00\x00\x00\x00', passphrase));
        aeskey.putBuffer(_sha1('\x00\x00\x00\x01', passphrase));
        var cipher = forge.aes.createEncryptionCipher(aeskey.truncate(8), 'CBC');
        cipher.start(forge.util.createBuffer().fillWithByte(0, 16));
        cipher.update(privbuffer.copy());
        cipher.finish();
        var encrypted = cipher.output;
        encrypted.truncate(16);
        priv = forge.util.encode64(encrypted.bytes(), 64);
      }
      length = Math.floor(priv.length / 66) + 1;
      ppk += '\r\nPrivate-Lines: ' + length + '\r\n';
      ppk += priv;
      var mackey = _sha1('putty-private-key-file-mac-key', passphrase);
      var macbuffer = forge.util.createBuffer();
      _addStringToBuffer(macbuffer, algorithm);
      _addStringToBuffer(macbuffer, encryptionAlgorithm);
      _addStringToBuffer(macbuffer, comment);
      macbuffer.putInt32(pubbuffer.length());
      macbuffer.putBuffer(pubbuffer);
      macbuffer.putInt32(privbuffer.length());
      macbuffer.putBuffer(privbuffer);
      var hmac = forge.hmac.create();
      hmac.start('sha1', mackey);
      hmac.update(macbuffer.bytes());
      ppk += '\r\nPrivate-MAC: ' + hmac.digest().toHex() + '\r\n';
      return ppk;
    };
    ssh.publicKeyToOpenSSH = function(key, comment) {
      var type = 'ssh-rsa';
      comment = comment || '';
      var buffer = forge.util.createBuffer();
      _addStringToBuffer(buffer, type);
      _addBigIntegerToBuffer(buffer, key.e);
      _addBigIntegerToBuffer(buffer, key.n);
      return type + ' ' + forge.util.encode64(buffer.bytes()) + ' ' + comment;
    };
    ssh.privateKeyToOpenSSH = function(privateKey, passphrase) {
      if (!passphrase) {
        return forge.pki.privateKeyToPem(privateKey);
      }
      return forge.pki.encryptRsaPrivateKey(privateKey, passphrase, {
        legacy: true,
        algorithm: 'aes128'
      });
    };
    ssh.getPublicKeyFingerprint = function(key, options) {
      options = options || {};
      var md = options.md || forge.md.md5.create();
      var type = 'ssh-rsa';
      var buffer = forge.util.createBuffer();
      _addStringToBuffer(buffer, type);
      _addBigIntegerToBuffer(buffer, key.e);
      _addBigIntegerToBuffer(buffer, key.n);
      md.start();
      md.update(buffer.getBytes());
      var digest = md.digest();
      if (options.encoding === 'hex') {
        var hex = digest.toHex();
        if (options.delimiter) {
          return hex.match(/.{2}/g).join(options.delimiter);
        }
        return hex;
      } else if (options.encoding === 'binary') {
        return digest.getBytes();
      } else if (options.encoding) {
        throw new Error('Unknown encoding "' + options.encoding + '".');
      }
      return digest;
    };
    function _addBigIntegerToBuffer(buffer, val) {
      var hexVal = val.toString(16);
      if (hexVal[0] >= '8') {
        hexVal = '00' + hexVal;
      }
      var bytes = forge.util.hexToBytes(hexVal);
      buffer.putInt32(bytes.length);
      buffer.putBytes(bytes);
    }
    function _addStringToBuffer(buffer, val) {
      buffer.putInt32(val.length);
      buffer.putString(val);
    }
    function _sha1() {
      var sha = forge.md.sha1.create();
      var num = arguments.length;
      for (var i = 0; i < num; ++i) {
        sha.update(arguments[i]);
      }
      return sha.digest();
    }
  }
  var name = 'ssh';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/ssh", ["npm:node-forge@0.6.26/js/aes", "npm:node-forge@0.6.26/js/hmac", "npm:node-forge@0.6.26/js/md5", "npm:node-forge@0.6.26/js/sha1", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/aes'), __require('npm:node-forge@0.6.26/js/hmac'), __require('npm:node-forge@0.6.26/js/md5'), __require('npm:node-forge@0.6.26/js/sha1'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var cat = 'forge.task';
    var sVL = 0;
    var sTasks = {};
    var sNextTaskId = 0;
    forge.debug.set(cat, 'tasks', sTasks);
    var sTaskQueues = {};
    forge.debug.set(cat, 'queues', sTaskQueues);
    var sNoTaskName = '?';
    var sMaxRecursions = 30;
    var sTimeSlice = 20;
    var READY = 'ready';
    var RUNNING = 'running';
    var BLOCKED = 'blocked';
    var SLEEPING = 'sleeping';
    var DONE = 'done';
    var ERROR = 'error';
    var STOP = 'stop';
    var START = 'start';
    var BLOCK = 'block';
    var UNBLOCK = 'unblock';
    var SLEEP = 'sleep';
    var WAKEUP = 'wakeup';
    var CANCEL = 'cancel';
    var FAIL = 'fail';
    var sStateTable = {};
    sStateTable[READY] = {};
    sStateTable[READY][STOP] = READY;
    sStateTable[READY][START] = RUNNING;
    sStateTable[READY][CANCEL] = DONE;
    sStateTable[READY][FAIL] = ERROR;
    sStateTable[RUNNING] = {};
    sStateTable[RUNNING][STOP] = READY;
    sStateTable[RUNNING][START] = RUNNING;
    sStateTable[RUNNING][BLOCK] = BLOCKED;
    sStateTable[RUNNING][UNBLOCK] = RUNNING;
    sStateTable[RUNNING][SLEEP] = SLEEPING;
    sStateTable[RUNNING][WAKEUP] = RUNNING;
    sStateTable[RUNNING][CANCEL] = DONE;
    sStateTable[RUNNING][FAIL] = ERROR;
    sStateTable[BLOCKED] = {};
    sStateTable[BLOCKED][STOP] = BLOCKED;
    sStateTable[BLOCKED][START] = BLOCKED;
    sStateTable[BLOCKED][BLOCK] = BLOCKED;
    sStateTable[BLOCKED][UNBLOCK] = BLOCKED;
    sStateTable[BLOCKED][SLEEP] = BLOCKED;
    sStateTable[BLOCKED][WAKEUP] = BLOCKED;
    sStateTable[BLOCKED][CANCEL] = DONE;
    sStateTable[BLOCKED][FAIL] = ERROR;
    sStateTable[SLEEPING] = {};
    sStateTable[SLEEPING][STOP] = SLEEPING;
    sStateTable[SLEEPING][START] = SLEEPING;
    sStateTable[SLEEPING][BLOCK] = SLEEPING;
    sStateTable[SLEEPING][UNBLOCK] = SLEEPING;
    sStateTable[SLEEPING][SLEEP] = SLEEPING;
    sStateTable[SLEEPING][WAKEUP] = SLEEPING;
    sStateTable[SLEEPING][CANCEL] = DONE;
    sStateTable[SLEEPING][FAIL] = ERROR;
    sStateTable[DONE] = {};
    sStateTable[DONE][STOP] = DONE;
    sStateTable[DONE][START] = DONE;
    sStateTable[DONE][BLOCK] = DONE;
    sStateTable[DONE][UNBLOCK] = DONE;
    sStateTable[DONE][SLEEP] = DONE;
    sStateTable[DONE][WAKEUP] = DONE;
    sStateTable[DONE][CANCEL] = DONE;
    sStateTable[DONE][FAIL] = ERROR;
    sStateTable[ERROR] = {};
    sStateTable[ERROR][STOP] = ERROR;
    sStateTable[ERROR][START] = ERROR;
    sStateTable[ERROR][BLOCK] = ERROR;
    sStateTable[ERROR][UNBLOCK] = ERROR;
    sStateTable[ERROR][SLEEP] = ERROR;
    sStateTable[ERROR][WAKEUP] = ERROR;
    sStateTable[ERROR][CANCEL] = ERROR;
    sStateTable[ERROR][FAIL] = ERROR;
    var Task = function(options) {
      this.id = -1;
      this.name = options.name || sNoTaskName;
      this.parent = options.parent || null;
      this.run = options.run;
      this.subtasks = [];
      this.error = false;
      this.state = READY;
      this.blocks = 0;
      this.timeoutId = null;
      this.swapTime = null;
      this.userData = null;
      this.id = sNextTaskId++;
      sTasks[this.id] = this;
      if (sVL >= 1) {
        forge.log.verbose(cat, '[%s][%s] init', this.id, this.name, this);
      }
    };
    Task.prototype.debug = function(msg) {
      msg = msg || '';
      forge.log.debug(cat, msg, '[%s][%s] task:', this.id, this.name, this, 'subtasks:', this.subtasks.length, 'queue:', sTaskQueues);
    };
    Task.prototype.next = function(name, subrun) {
      if (typeof(name) === 'function') {
        subrun = name;
        name = this.name;
      }
      var subtask = new Task({
        run: subrun,
        name: name,
        parent: this
      });
      subtask.state = RUNNING;
      subtask.type = this.type;
      subtask.successCallback = this.successCallback || null;
      subtask.failureCallback = this.failureCallback || null;
      this.subtasks.push(subtask);
      return this;
    };
    Task.prototype.parallel = function(name, subrun) {
      if (forge.util.isArray(name)) {
        subrun = name;
        name = this.name;
      }
      return this.next(name, function(task) {
        var ptask = task;
        ptask.block(subrun.length);
        var startParallelTask = function(pname, pi) {
          forge.task.start({
            type: pname,
            run: function(task) {
              subrun[pi](task);
            },
            success: function(task) {
              ptask.unblock();
            },
            failure: function(task) {
              ptask.unblock();
            }
          });
        };
        for (var i = 0; i < subrun.length; i++) {
          var pname = name + '__parallel-' + task.id + '-' + i;
          var pi = i;
          startParallelTask(pname, pi);
        }
      });
    };
    Task.prototype.stop = function() {
      this.state = sStateTable[this.state][STOP];
    };
    Task.prototype.start = function() {
      this.error = false;
      this.state = sStateTable[this.state][START];
      if (this.state === RUNNING) {
        this.start = new Date();
        this.run(this);
        runNext(this, 0);
      }
    };
    Task.prototype.block = function(n) {
      n = typeof(n) === 'undefined' ? 1 : n;
      this.blocks += n;
      if (this.blocks > 0) {
        this.state = sStateTable[this.state][BLOCK];
      }
    };
    Task.prototype.unblock = function(n) {
      n = typeof(n) === 'undefined' ? 1 : n;
      this.blocks -= n;
      if (this.blocks === 0 && this.state !== DONE) {
        this.state = RUNNING;
        runNext(this, 0);
      }
      return this.blocks;
    };
    Task.prototype.sleep = function(n) {
      n = typeof(n) === 'undefined' ? 0 : n;
      this.state = sStateTable[this.state][SLEEP];
      var self = this;
      this.timeoutId = setTimeout(function() {
        self.timeoutId = null;
        self.state = RUNNING;
        runNext(self, 0);
      }, n);
    };
    Task.prototype.wait = function(cond) {
      cond.wait(this);
    };
    Task.prototype.wakeup = function() {
      if (this.state === SLEEPING) {
        cancelTimeout(this.timeoutId);
        this.timeoutId = null;
        this.state = RUNNING;
        runNext(this, 0);
      }
    };
    Task.prototype.cancel = function() {
      this.state = sStateTable[this.state][CANCEL];
      this.permitsNeeded = 0;
      if (this.timeoutId !== null) {
        cancelTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.subtasks = [];
    };
    Task.prototype.fail = function(next) {
      this.error = true;
      finish(this, true);
      if (next) {
        next.error = this.error;
        next.swapTime = this.swapTime;
        next.userData = this.userData;
        runNext(next, 0);
      } else {
        if (this.parent !== null) {
          var parent = this.parent;
          while (parent.parent !== null) {
            parent.error = this.error;
            parent.swapTime = this.swapTime;
            parent.userData = this.userData;
            parent = parent.parent;
          }
          finish(parent, true);
        }
        if (this.failureCallback) {
          this.failureCallback(this);
        }
      }
    };
    var start = function(task) {
      task.error = false;
      task.state = sStateTable[task.state][START];
      setTimeout(function() {
        if (task.state === RUNNING) {
          task.swapTime = +new Date();
          task.run(task);
          runNext(task, 0);
        }
      }, 0);
    };
    var runNext = function(task, recurse) {
      var swap = (recurse > sMaxRecursions) || (+new Date() - task.swapTime) > sTimeSlice;
      var doNext = function(recurse) {
        recurse++;
        if (task.state === RUNNING) {
          if (swap) {
            task.swapTime = +new Date();
          }
          if (task.subtasks.length > 0) {
            var subtask = task.subtasks.shift();
            subtask.error = task.error;
            subtask.swapTime = task.swapTime;
            subtask.userData = task.userData;
            subtask.run(subtask);
            if (!subtask.error) {
              runNext(subtask, recurse);
            }
          } else {
            finish(task);
            if (!task.error) {
              if (task.parent !== null) {
                task.parent.error = task.error;
                task.parent.swapTime = task.swapTime;
                task.parent.userData = task.userData;
                runNext(task.parent, recurse);
              }
            }
          }
        }
      };
      if (swap) {
        setTimeout(doNext, 0);
      } else {
        doNext(recurse);
      }
    };
    var finish = function(task, suppressCallbacks) {
      task.state = DONE;
      delete sTasks[task.id];
      if (sVL >= 1) {
        forge.log.verbose(cat, '[%s][%s] finish', task.id, task.name, task);
      }
      if (task.parent === null) {
        if (!(task.type in sTaskQueues)) {
          forge.log.error(cat, '[%s][%s] task queue missing [%s]', task.id, task.name, task.type);
        } else if (sTaskQueues[task.type].length === 0) {
          forge.log.error(cat, '[%s][%s] task queue empty [%s]', task.id, task.name, task.type);
        } else if (sTaskQueues[task.type][0] !== task) {
          forge.log.error(cat, '[%s][%s] task not first in queue [%s]', task.id, task.name, task.type);
        } else {
          sTaskQueues[task.type].shift();
          if (sTaskQueues[task.type].length === 0) {
            if (sVL >= 1) {
              forge.log.verbose(cat, '[%s][%s] delete queue [%s]', task.id, task.name, task.type);
            }
            delete sTaskQueues[task.type];
          } else {
            if (sVL >= 1) {
              forge.log.verbose(cat, '[%s][%s] queue start next [%s] remain:%s', task.id, task.name, task.type, sTaskQueues[task.type].length);
            }
            sTaskQueues[task.type][0].start();
          }
        }
        if (!suppressCallbacks) {
          if (task.error && task.failureCallback) {
            task.failureCallback(task);
          } else if (!task.error && task.successCallback) {
            task.successCallback(task);
          }
        }
      }
    };
    forge.task = forge.task || {};
    forge.task.start = function(options) {
      var task = new Task({
        run: options.run,
        name: options.name || sNoTaskName
      });
      task.type = options.type;
      task.successCallback = options.success || null;
      task.failureCallback = options.failure || null;
      if (!(task.type in sTaskQueues)) {
        if (sVL >= 1) {
          forge.log.verbose(cat, '[%s][%s] create queue [%s]', task.id, task.name, task.type);
        }
        sTaskQueues[task.type] = [task];
        start(task);
      } else {
        sTaskQueues[options.type].push(task);
      }
    };
    forge.task.cancel = function(type) {
      if (type in sTaskQueues) {
        sTaskQueues[type] = [sTaskQueues[type][0]];
      }
    };
    forge.task.createCondition = function() {
      var cond = {tasks: {}};
      cond.wait = function(task) {
        if (!(task.id in cond.tasks)) {
          task.block();
          cond.tasks[task.id] = task;
        }
      };
      cond.notify = function() {
        var tmp = cond.tasks;
        cond.tasks = {};
        for (var id in tmp) {
          tmp[id].unblock();
        }
      };
      return cond;
    };
  }
  var name = 'task';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/task", ["npm:node-forge@0.6.26/js/debug", "npm:node-forge@0.6.26/js/log", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/debug'), __require('npm:node-forge@0.6.26/js/log'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.cipher = forge.cipher || {};
    forge.cipher.algorithms = forge.cipher.algorithms || {};
    forge.cipher.createCipher = function(algorithm, key) {
      var api = algorithm;
      if (typeof api === 'string') {
        api = forge.cipher.getAlgorithm(api);
        if (api) {
          api = api();
        }
      }
      if (!api) {
        throw new Error('Unsupported algorithm: ' + algorithm);
      }
      return new forge.cipher.BlockCipher({
        algorithm: api,
        key: key,
        decrypt: false
      });
    };
    forge.cipher.createDecipher = function(algorithm, key) {
      var api = algorithm;
      if (typeof api === 'string') {
        api = forge.cipher.getAlgorithm(api);
        if (api) {
          api = api();
        }
      }
      if (!api) {
        throw new Error('Unsupported algorithm: ' + algorithm);
      }
      return new forge.cipher.BlockCipher({
        algorithm: api,
        key: key,
        decrypt: true
      });
    };
    forge.cipher.registerAlgorithm = function(name, algorithm) {
      name = name.toUpperCase();
      forge.cipher.algorithms[name] = algorithm;
    };
    forge.cipher.getAlgorithm = function(name) {
      name = name.toUpperCase();
      if (name in forge.cipher.algorithms) {
        return forge.cipher.algorithms[name];
      }
      return null;
    };
    var BlockCipher = forge.cipher.BlockCipher = function(options) {
      this.algorithm = options.algorithm;
      this.mode = this.algorithm.mode;
      this.blockSize = this.mode.blockSize;
      this._finish = false;
      this._input = null;
      this.output = null;
      this._op = options.decrypt ? this.mode.decrypt : this.mode.encrypt;
      this._decrypt = options.decrypt;
      this.algorithm.initialize(options);
    };
    BlockCipher.prototype.start = function(options) {
      options = options || {};
      var opts = {};
      for (var key in options) {
        opts[key] = options[key];
      }
      opts.decrypt = this._decrypt;
      this._finish = false;
      this._input = forge.util.createBuffer();
      this.output = options.output || forge.util.createBuffer();
      this.mode.start(opts);
    };
    BlockCipher.prototype.update = function(input) {
      if (input) {
        this._input.putBuffer(input);
      }
      while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish) {}
      this._input.compact();
    };
    BlockCipher.prototype.finish = function(pad) {
      if (pad && this.mode.name === 'CBC') {
        this.mode.pad = function(input) {
          return pad(this.blockSize, input, false);
        };
        this.mode.unpad = function(output) {
          return pad(this.blockSize, output, true);
        };
      }
      var options = {};
      options.decrypt = this._decrypt;
      options.overflow = this._input.length() % this.blockSize;
      if (!this._decrypt && this.mode.pad) {
        if (!this.mode.pad(this._input, options)) {
          return false;
        }
      }
      this._finish = true;
      this.update();
      if (this._decrypt && this.mode.unpad) {
        if (!this.mode.unpad(this.output, options)) {
          return false;
        }
      }
      if (this.mode.afterFinish) {
        if (!this.mode.afterFinish(this.output, options)) {
          return false;
        }
      }
      return true;
    };
  }
  var name = 'cipher';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/cipher", ["npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var asn1 = forge.asn1 = forge.asn1 || {};
    asn1.Class = {
      UNIVERSAL: 0x00,
      APPLICATION: 0x40,
      CONTEXT_SPECIFIC: 0x80,
      PRIVATE: 0xC0
    };
    asn1.Type = {
      NONE: 0,
      BOOLEAN: 1,
      INTEGER: 2,
      BITSTRING: 3,
      OCTETSTRING: 4,
      NULL: 5,
      OID: 6,
      ODESC: 7,
      EXTERNAL: 8,
      REAL: 9,
      ENUMERATED: 10,
      EMBEDDED: 11,
      UTF8: 12,
      ROID: 13,
      SEQUENCE: 16,
      SET: 17,
      PRINTABLESTRING: 19,
      IA5STRING: 22,
      UTCTIME: 23,
      GENERALIZEDTIME: 24,
      BMPSTRING: 30
    };
    asn1.create = function(tagClass, type, constructed, value) {
      if (forge.util.isArray(value)) {
        var tmp = [];
        for (var i = 0; i < value.length; ++i) {
          if (value[i] !== undefined) {
            tmp.push(value[i]);
          }
        }
        value = tmp;
      }
      return {
        tagClass: tagClass,
        type: type,
        constructed: constructed,
        composed: constructed || forge.util.isArray(value),
        value: value
      };
    };
    var _getValueLength = function(b) {
      var b2 = b.getByte();
      if (b2 === 0x80) {
        return undefined;
      }
      var length;
      var longForm = b2 & 0x80;
      if (!longForm) {
        length = b2;
      } else {
        length = b.getInt((b2 & 0x7F) << 3);
      }
      return length;
    };
    asn1.fromDer = function(bytes, strict) {
      if (strict === undefined) {
        strict = true;
      }
      if (typeof bytes === 'string') {
        bytes = forge.util.createBuffer(bytes);
      }
      if (bytes.length() < 2) {
        var error = new Error('Too few bytes to parse DER.');
        error.bytes = bytes.length();
        throw error;
      }
      var b1 = bytes.getByte();
      var tagClass = (b1 & 0xC0);
      var type = b1 & 0x1F;
      var length = _getValueLength(bytes);
      if (bytes.length() < length) {
        if (strict) {
          var error = new Error('Too few bytes to read ASN.1 value.');
          error.detail = bytes.length() + ' < ' + length;
          throw error;
        }
        length = bytes.length();
      }
      var value;
      var constructed = ((b1 & 0x20) === 0x20);
      var composed = constructed;
      if (!composed && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING && length > 1) {
        var read = bytes.read;
        var unused = bytes.getByte();
        if (unused === 0) {
          b1 = bytes.getByte();
          var tc = (b1 & 0xC0);
          if (tc === asn1.Class.UNIVERSAL || tc === asn1.Class.CONTEXT_SPECIFIC) {
            try {
              var len = _getValueLength(bytes);
              composed = (len === length - (bytes.read - read));
              if (composed) {
                ++read;
                --length;
              }
            } catch (ex) {}
          }
        }
        bytes.read = read;
      }
      if (composed) {
        value = [];
        if (length === undefined) {
          for (; ; ) {
            if (bytes.bytes(2) === String.fromCharCode(0, 0)) {
              bytes.getBytes(2);
              break;
            }
            value.push(asn1.fromDer(bytes, strict));
          }
        } else {
          var start = bytes.length();
          while (length > 0) {
            value.push(asn1.fromDer(bytes, strict));
            length -= start - bytes.length();
            start = bytes.length();
          }
        }
      } else {
        if (length === undefined) {
          if (strict) {
            throw new Error('Non-constructed ASN.1 object of indefinite length.');
          }
          length = bytes.length();
        }
        if (type === asn1.Type.BMPSTRING) {
          value = '';
          for (var i = 0; i < length; i += 2) {
            value += String.fromCharCode(bytes.getInt16());
          }
        } else {
          value = bytes.getBytes(length);
        }
      }
      return asn1.create(tagClass, type, constructed, value);
    };
    asn1.toDer = function(obj) {
      var bytes = forge.util.createBuffer();
      var b1 = obj.tagClass | obj.type;
      var value = forge.util.createBuffer();
      if (obj.composed) {
        if (obj.constructed) {
          b1 |= 0x20;
        } else {
          value.putByte(0x00);
        }
        for (var i = 0; i < obj.value.length; ++i) {
          if (obj.value[i] !== undefined) {
            value.putBuffer(asn1.toDer(obj.value[i]));
          }
        }
      } else {
        if (obj.type === asn1.Type.BMPSTRING) {
          for (var i = 0; i < obj.value.length; ++i) {
            value.putInt16(obj.value.charCodeAt(i));
          }
        } else {
          value.putBytes(obj.value);
        }
      }
      bytes.putByte(b1);
      if (value.length() <= 127) {
        bytes.putByte(value.length() & 0x7F);
      } else {
        var len = value.length();
        var lenBytes = '';
        do {
          lenBytes += String.fromCharCode(len & 0xFF);
          len = len >>> 8;
        } while (len > 0);
        bytes.putByte(lenBytes.length | 0x80);
        for (var i = lenBytes.length - 1; i >= 0; --i) {
          bytes.putByte(lenBytes.charCodeAt(i));
        }
      }
      bytes.putBuffer(value);
      return bytes;
    };
    asn1.oidToDer = function(oid) {
      var values = oid.split('.');
      var bytes = forge.util.createBuffer();
      bytes.putByte(40 * parseInt(values[0], 10) + parseInt(values[1], 10));
      var last,
          valueBytes,
          value,
          b;
      for (var i = 2; i < values.length; ++i) {
        last = true;
        valueBytes = [];
        value = parseInt(values[i], 10);
        do {
          b = value & 0x7F;
          value = value >>> 7;
          if (!last) {
            b |= 0x80;
          }
          valueBytes.push(b);
          last = false;
        } while (value > 0);
        for (var n = valueBytes.length - 1; n >= 0; --n) {
          bytes.putByte(valueBytes[n]);
        }
      }
      return bytes;
    };
    asn1.derToOid = function(bytes) {
      var oid;
      if (typeof bytes === 'string') {
        bytes = forge.util.createBuffer(bytes);
      }
      var b = bytes.getByte();
      oid = Math.floor(b / 40) + '.' + (b % 40);
      var value = 0;
      while (bytes.length() > 0) {
        b = bytes.getByte();
        value = value << 7;
        if (b & 0x80) {
          value += b & 0x7F;
        } else {
          oid += '.' + (value + b);
          value = 0;
        }
      }
      return oid;
    };
    asn1.utcTimeToDate = function(utc) {
      var date = new Date();
      var year = parseInt(utc.substr(0, 2), 10);
      year = (year >= 50) ? 1900 + year : 2000 + year;
      var MM = parseInt(utc.substr(2, 2), 10) - 1;
      var DD = parseInt(utc.substr(4, 2), 10);
      var hh = parseInt(utc.substr(6, 2), 10);
      var mm = parseInt(utc.substr(8, 2), 10);
      var ss = 0;
      if (utc.length > 11) {
        var c = utc.charAt(10);
        var end = 10;
        if (c !== '+' && c !== '-') {
          ss = parseInt(utc.substr(10, 2), 10);
          end += 2;
        }
      }
      date.setUTCFullYear(year, MM, DD);
      date.setUTCHours(hh, mm, ss, 0);
      if (end) {
        c = utc.charAt(end);
        if (c === '+' || c === '-') {
          var hhoffset = parseInt(utc.substr(end + 1, 2), 10);
          var mmoffset = parseInt(utc.substr(end + 4, 2), 10);
          var offset = hhoffset * 60 + mmoffset;
          offset *= 60000;
          if (c === '+') {
            date.setTime(+date - offset);
          } else {
            date.setTime(+date + offset);
          }
        }
      }
      return date;
    };
    asn1.generalizedTimeToDate = function(gentime) {
      var date = new Date();
      var YYYY = parseInt(gentime.substr(0, 4), 10);
      var MM = parseInt(gentime.substr(4, 2), 10) - 1;
      var DD = parseInt(gentime.substr(6, 2), 10);
      var hh = parseInt(gentime.substr(8, 2), 10);
      var mm = parseInt(gentime.substr(10, 2), 10);
      var ss = parseInt(gentime.substr(12, 2), 10);
      var fff = 0;
      var offset = 0;
      var isUTC = false;
      if (gentime.charAt(gentime.length - 1) === 'Z') {
        isUTC = true;
      }
      var end = gentime.length - 5,
          c = gentime.charAt(end);
      if (c === '+' || c === '-') {
        var hhoffset = parseInt(gentime.substr(end + 1, 2), 10);
        var mmoffset = parseInt(gentime.substr(end + 4, 2), 10);
        offset = hhoffset * 60 + mmoffset;
        offset *= 60000;
        if (c === '+') {
          offset *= -1;
        }
        isUTC = true;
      }
      if (gentime.charAt(14) === '.') {
        fff = parseFloat(gentime.substr(14), 10) * 1000;
      }
      if (isUTC) {
        date.setUTCFullYear(YYYY, MM, DD);
        date.setUTCHours(hh, mm, ss, fff);
        date.setTime(+date + offset);
      } else {
        date.setFullYear(YYYY, MM, DD);
        date.setHours(hh, mm, ss, fff);
      }
      return date;
    };
    asn1.dateToUtcTime = function(date) {
      var rval = '';
      var format = [];
      format.push(('' + date.getUTCFullYear()).substr(2));
      format.push('' + (date.getUTCMonth() + 1));
      format.push('' + date.getUTCDate());
      format.push('' + date.getUTCHours());
      format.push('' + date.getUTCMinutes());
      format.push('' + date.getUTCSeconds());
      for (var i = 0; i < format.length; ++i) {
        if (format[i].length < 2) {
          rval += '0';
        }
        rval += format[i];
      }
      rval += 'Z';
      return rval;
    };
    asn1.integerToDer = function(x) {
      var rval = forge.util.createBuffer();
      if (x >= -0x80 && x < 0x80) {
        return rval.putSignedInt(x, 8);
      }
      if (x >= -0x8000 && x < 0x8000) {
        return rval.putSignedInt(x, 16);
      }
      if (x >= -0x800000 && x < 0x800000) {
        return rval.putSignedInt(x, 24);
      }
      if (x >= -0x80000000 && x < 0x80000000) {
        return rval.putSignedInt(x, 32);
      }
      var error = new Error('Integer too large; max is 32-bits.');
      error.integer = x;
      throw error;
    };
    asn1.derToInteger = function(bytes) {
      if (typeof bytes === 'string') {
        bytes = forge.util.createBuffer(bytes);
      }
      var n = bytes.length() * 8;
      if (n > 32) {
        throw new Error('Integer too large; max is 32-bits.');
      }
      return bytes.getSignedInt(n);
    };
    asn1.validate = function(obj, v, capture, errors) {
      var rval = false;
      if ((obj.tagClass === v.tagClass || typeof(v.tagClass) === 'undefined') && (obj.type === v.type || typeof(v.type) === 'undefined')) {
        if (obj.constructed === v.constructed || typeof(v.constructed) === 'undefined') {
          rval = true;
          if (v.value && forge.util.isArray(v.value)) {
            var j = 0;
            for (var i = 0; rval && i < v.value.length; ++i) {
              rval = v.value[i].optional || false;
              if (obj.value[j]) {
                rval = asn1.validate(obj.value[j], v.value[i], capture, errors);
                if (rval) {
                  ++j;
                } else if (v.value[i].optional) {
                  rval = true;
                }
              }
              if (!rval && errors) {
                errors.push('[' + v.name + '] ' + 'Tag class "' + v.tagClass + '", type "' + v.type + '" expected value length "' + v.value.length + '", got "' + obj.value.length + '"');
              }
            }
          }
          if (rval && capture) {
            if (v.capture) {
              capture[v.capture] = obj.value;
            }
            if (v.captureAsn1) {
              capture[v.captureAsn1] = obj;
            }
          }
        } else if (errors) {
          errors.push('[' + v.name + '] ' + 'Expected constructed "' + v.constructed + '", got "' + obj.constructed + '"');
        }
      } else if (errors) {
        if (obj.tagClass !== v.tagClass) {
          errors.push('[' + v.name + '] ' + 'Expected tag class "' + v.tagClass + '", got "' + obj.tagClass + '"');
        }
        if (obj.type !== v.type) {
          errors.push('[' + v.name + '] ' + 'Expected type "' + v.type + '", got "' + obj.type + '"');
        }
      }
      return rval;
    };
    var _nonLatinRegex = /[^\\u0000-\\u00ff]/;
    asn1.prettyPrint = function(obj, level, indentation) {
      var rval = '';
      level = level || 0;
      indentation = indentation || 2;
      if (level > 0) {
        rval += '\n';
      }
      var indent = '';
      for (var i = 0; i < level * indentation; ++i) {
        indent += ' ';
      }
      rval += indent + 'Tag: ';
      switch (obj.tagClass) {
        case asn1.Class.UNIVERSAL:
          rval += 'Universal:';
          break;
        case asn1.Class.APPLICATION:
          rval += 'Application:';
          break;
        case asn1.Class.CONTEXT_SPECIFIC:
          rval += 'Context-Specific:';
          break;
        case asn1.Class.PRIVATE:
          rval += 'Private:';
          break;
      }
      if (obj.tagClass === asn1.Class.UNIVERSAL) {
        rval += obj.type;
        switch (obj.type) {
          case asn1.Type.NONE:
            rval += ' (None)';
            break;
          case asn1.Type.BOOLEAN:
            rval += ' (Boolean)';
            break;
          case asn1.Type.BITSTRING:
            rval += ' (Bit string)';
            break;
          case asn1.Type.INTEGER:
            rval += ' (Integer)';
            break;
          case asn1.Type.OCTETSTRING:
            rval += ' (Octet string)';
            break;
          case asn1.Type.NULL:
            rval += ' (Null)';
            break;
          case asn1.Type.OID:
            rval += ' (Object Identifier)';
            break;
          case asn1.Type.ODESC:
            rval += ' (Object Descriptor)';
            break;
          case asn1.Type.EXTERNAL:
            rval += ' (External or Instance of)';
            break;
          case asn1.Type.REAL:
            rval += ' (Real)';
            break;
          case asn1.Type.ENUMERATED:
            rval += ' (Enumerated)';
            break;
          case asn1.Type.EMBEDDED:
            rval += ' (Embedded PDV)';
            break;
          case asn1.Type.UTF8:
            rval += ' (UTF8)';
            break;
          case asn1.Type.ROID:
            rval += ' (Relative Object Identifier)';
            break;
          case asn1.Type.SEQUENCE:
            rval += ' (Sequence)';
            break;
          case asn1.Type.SET:
            rval += ' (Set)';
            break;
          case asn1.Type.PRINTABLESTRING:
            rval += ' (Printable String)';
            break;
          case asn1.Type.IA5String:
            rval += ' (IA5String (ASCII))';
            break;
          case asn1.Type.UTCTIME:
            rval += ' (UTC time)';
            break;
          case asn1.Type.GENERALIZEDTIME:
            rval += ' (Generalized time)';
            break;
          case asn1.Type.BMPSTRING:
            rval += ' (BMP String)';
            break;
        }
      } else {
        rval += obj.type;
      }
      rval += '\n';
      rval += indent + 'Constructed: ' + obj.constructed + '\n';
      if (obj.composed) {
        var subvalues = 0;
        var sub = '';
        for (var i = 0; i < obj.value.length; ++i) {
          if (obj.value[i] !== undefined) {
            subvalues += 1;
            sub += asn1.prettyPrint(obj.value[i], level + 1, indentation);
            if ((i + 1) < obj.value.length) {
              sub += ',';
            }
          }
        }
        rval += indent + 'Sub values: ' + subvalues + sub;
      } else {
        rval += indent + 'Value: ';
        if (obj.type === asn1.Type.OID) {
          var oid = asn1.derToOid(obj.value);
          rval += oid;
          if (forge.pki && forge.pki.oids) {
            if (oid in forge.pki.oids) {
              rval += ' (' + forge.pki.oids[oid] + ') ';
            }
          }
        }
        if (obj.type === asn1.Type.INTEGER) {
          try {
            rval += asn1.derToInteger(obj.value);
          } catch (ex) {
            rval += '0x' + forge.util.bytesToHex(obj.value);
          }
        } else if (obj.type === asn1.Type.OCTETSTRING) {
          if (!_nonLatinRegex.test(obj.value)) {
            rval += '(' + obj.value + ') ';
          }
          rval += '0x' + forge.util.bytesToHex(obj.value);
        } else if (obj.type === asn1.Type.UTF8) {
          rval += forge.util.decodeUtf8(obj.value);
        } else if (obj.type === asn1.Type.PRINTABLESTRING || obj.type === asn1.Type.IA5String) {
          rval += obj.value;
        } else if (_nonLatinRegex.test(obj.value)) {
          rval += '0x' + forge.util.bytesToHex(obj.value);
        } else if (obj.value.length === 0) {
          rval += '[null]';
        } else {
          rval += obj.value;
        }
      }
      return rval;
    };
  }
  var name = 'asn1';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/asn1", ["npm:node-forge@0.6.26/js/util", "npm:node-forge@0.6.26/js/oids"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/util'), __require('npm:node-forge@0.6.26/js/oids'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.md = forge.md || {};
    forge.md.algorithms = {
      md5: forge.md5,
      sha1: forge.sha1,
      sha256: forge.sha256
    };
    forge.md.md5 = forge.md5;
    forge.md.sha1 = forge.sha1;
    forge.md.sha256 = forge.sha256;
  }
  var name = 'md';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/md", ["npm:node-forge@0.6.26/js/md5", "npm:node-forge@0.6.26/js/sha1", "npm:node-forge@0.6.26/js/sha256", "npm:node-forge@0.6.26/js/sha512"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/md5'), __require('npm:node-forge@0.6.26/js/sha1'), __require('npm:node-forge@0.6.26/js/sha256'), __require('npm:node-forge@0.6.26/js/sha512'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    if (forge.random && forge.random.getBytes) {
      return ;
    }
    (function(jQuery) {
      var prng_aes = {};
      var _prng_aes_output = new Array(4);
      var _prng_aes_buffer = forge.util.createBuffer();
      prng_aes.formatKey = function(key) {
        var tmp = forge.util.createBuffer(key);
        key = new Array(4);
        key[0] = tmp.getInt32();
        key[1] = tmp.getInt32();
        key[2] = tmp.getInt32();
        key[3] = tmp.getInt32();
        return forge.aes._expandKey(key, false);
      };
      prng_aes.formatSeed = function(seed) {
        var tmp = forge.util.createBuffer(seed);
        seed = new Array(4);
        seed[0] = tmp.getInt32();
        seed[1] = tmp.getInt32();
        seed[2] = tmp.getInt32();
        seed[3] = tmp.getInt32();
        return seed;
      };
      prng_aes.cipher = function(key, seed) {
        forge.aes._updateBlock(key, seed, _prng_aes_output, false);
        _prng_aes_buffer.putInt32(_prng_aes_output[0]);
        _prng_aes_buffer.putInt32(_prng_aes_output[1]);
        _prng_aes_buffer.putInt32(_prng_aes_output[2]);
        _prng_aes_buffer.putInt32(_prng_aes_output[3]);
        return _prng_aes_buffer.getBytes();
      };
      prng_aes.increment = function(seed) {
        ++seed[3];
        return seed;
      };
      prng_aes.md = forge.md.sha256;
      function spawnPrng() {
        var ctx = forge.prng.create(prng_aes);
        ctx.getBytes = function(count, callback) {
          return ctx.generate(count, callback);
        };
        ctx.getBytesSync = function(count) {
          return ctx.generate(count);
        };
        return ctx;
      }
      var _ctx = spawnPrng();
      var _nodejs = (typeof process !== 'undefined' && process.versions && process.versions.node);
      var getRandomValues = null;
      if (typeof window !== 'undefined') {
        var _crypto = window.crypto || window.msCrypto;
        if (_crypto && _crypto.getRandomValues) {
          getRandomValues = function(arr) {
            return _crypto.getRandomValues(arr);
          };
        }
      }
      if (forge.disableNativeCode || (!_nodejs && !getRandomValues)) {
        if (typeof window === 'undefined' || window.document === undefined) {}
        _ctx.collectInt(+new Date(), 32);
        if (typeof(navigator) !== 'undefined') {
          var _navBytes = '';
          for (var key in navigator) {
            try {
              if (typeof(navigator[key]) == 'string') {
                _navBytes += navigator[key];
              }
            } catch (e) {}
          }
          _ctx.collect(_navBytes);
          _navBytes = null;
        }
        if (jQuery) {
          jQuery().mousemove(function(e) {
            _ctx.collectInt(e.clientX, 16);
            _ctx.collectInt(e.clientY, 16);
          });
          jQuery().keypress(function(e) {
            _ctx.collectInt(e.charCode, 8);
          });
        }
      }
      if (!forge.random) {
        forge.random = _ctx;
      } else {
        for (var key in _ctx) {
          forge.random[key] = _ctx[key];
        }
      }
      forge.random.createInstance = spawnPrng;
    })(typeof(jQuery) !== 'undefined' ? jQuery : null);
  }
  var name = 'random';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/random", ["npm:node-forge@0.6.26/js/aes", "npm:node-forge@0.6.26/js/md", "npm:node-forge@0.6.26/js/prng", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/aes'), __require('npm:node-forge@0.6.26/js/md'), __require('npm:node-forge@0.6.26/js/prng'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    if (typeof BigInteger === 'undefined') {
      var BigInteger = forge.jsbn.BigInteger;
    }
    var asn1 = forge.asn1;
    forge.pki = forge.pki || {};
    forge.pki.rsa = forge.rsa = forge.rsa || {};
    var pki = forge.pki;
    var GCD_30_DELTA = [6, 4, 2, 4, 2, 4, 6, 2];
    var privateKeyValidator = {
      name: 'PrivateKeyInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'PrivateKeyInfo.version',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyVersion'
      }, {
        name: 'PrivateKeyInfo.privateKeyAlgorithm',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'AlgorithmIdentifier.algorithm',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'privateKeyOid'
        }]
      }, {
        name: 'PrivateKeyInfo',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: 'privateKey'
      }]
    };
    var rsaPrivateKeyValidator = {
      name: 'RSAPrivateKey',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'RSAPrivateKey.version',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyVersion'
      }, {
        name: 'RSAPrivateKey.modulus',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyModulus'
      }, {
        name: 'RSAPrivateKey.publicExponent',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyPublicExponent'
      }, {
        name: 'RSAPrivateKey.privateExponent',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyPrivateExponent'
      }, {
        name: 'RSAPrivateKey.prime1',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyPrime1'
      }, {
        name: 'RSAPrivateKey.prime2',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyPrime2'
      }, {
        name: 'RSAPrivateKey.exponent1',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyExponent1'
      }, {
        name: 'RSAPrivateKey.exponent2',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyExponent2'
      }, {
        name: 'RSAPrivateKey.coefficient',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'privateKeyCoefficient'
      }]
    };
    var rsaPublicKeyValidator = {
      name: 'RSAPublicKey',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'RSAPublicKey.modulus',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'publicKeyModulus'
      }, {
        name: 'RSAPublicKey.exponent',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'publicKeyExponent'
      }]
    };
    var publicKeyValidator = forge.pki.rsa.publicKeyValidator = {
      name: 'SubjectPublicKeyInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      captureAsn1: 'subjectPublicKeyInfo',
      value: [{
        name: 'SubjectPublicKeyInfo.AlgorithmIdentifier',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'AlgorithmIdentifier.algorithm',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'publicKeyOid'
        }]
      }, {
        name: 'SubjectPublicKeyInfo.subjectPublicKey',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        value: [{
          name: 'SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          optional: true,
          captureAsn1: 'rsaPublicKey'
        }]
      }]
    };
    var emsaPkcs1v15encode = function(md) {
      var oid;
      if (md.algorithm in pki.oids) {
        oid = pki.oids[md.algorithm];
      } else {
        var error = new Error('Unknown message digest algorithm.');
        error.algorithm = md.algorithm;
        throw error;
      }
      var oidBytes = asn1.oidToDer(oid).getBytes();
      var digestInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var digestAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidBytes));
      digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, ''));
      var digest = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, md.digest().getBytes());
      digestInfo.value.push(digestAlgorithm);
      digestInfo.value.push(digest);
      return asn1.toDer(digestInfo).getBytes();
    };
    var _modPow = function(x, key, pub) {
      if (pub) {
        return x.modPow(key.e, key.n);
      }
      if (!key.p || !key.q) {
        return x.modPow(key.d, key.n);
      }
      if (!key.dP) {
        key.dP = key.d.mod(key.p.subtract(BigInteger.ONE));
      }
      if (!key.dQ) {
        key.dQ = key.d.mod(key.q.subtract(BigInteger.ONE));
      }
      if (!key.qInv) {
        key.qInv = key.q.modInverse(key.p);
      }
      var r;
      do {
        r = new BigInteger(forge.util.bytesToHex(forge.random.getBytes(key.n.bitLength() / 8)), 16).mod(key.n);
      } while (r.equals(BigInteger.ZERO));
      x = x.multiply(r.modPow(key.e, key.n)).mod(key.n);
      var xp = x.mod(key.p).modPow(key.dP, key.p);
      var xq = x.mod(key.q).modPow(key.dQ, key.q);
      while (xp.compareTo(xq) < 0) {
        xp = xp.add(key.p);
      }
      var y = xp.subtract(xq).multiply(key.qInv).mod(key.p).multiply(key.q).add(xq);
      y = y.multiply(r.modInverse(key.n)).mod(key.n);
      return y;
    };
    pki.rsa.encrypt = function(m, key, bt) {
      var pub = bt;
      var eb;
      var k = Math.ceil(key.n.bitLength() / 8);
      if (bt !== false && bt !== true) {
        pub = (bt === 0x02);
        eb = _encodePkcs1_v1_5(m, key, bt);
      } else {
        eb = forge.util.createBuffer();
        eb.putBytes(m);
      }
      var x = new BigInteger(eb.toHex(), 16);
      var y = _modPow(x, key, pub);
      var yhex = y.toString(16);
      var ed = forge.util.createBuffer();
      var zeros = k - Math.ceil(yhex.length / 2);
      while (zeros > 0) {
        ed.putByte(0x00);
        --zeros;
      }
      ed.putBytes(forge.util.hexToBytes(yhex));
      return ed.getBytes();
    };
    pki.rsa.decrypt = function(ed, key, pub, ml) {
      var k = Math.ceil(key.n.bitLength() / 8);
      if (ed.length !== k) {
        var error = new Error('Encrypted message length is invalid.');
        error.length = ed.length;
        error.expected = k;
        throw error;
      }
      var y = new BigInteger(forge.util.createBuffer(ed).toHex(), 16);
      if (y.compareTo(key.n) >= 0) {
        throw new Error('Encrypted message is invalid.');
      }
      var x = _modPow(y, key, pub);
      var xhex = x.toString(16);
      var eb = forge.util.createBuffer();
      var zeros = k - Math.ceil(xhex.length / 2);
      while (zeros > 0) {
        eb.putByte(0x00);
        --zeros;
      }
      eb.putBytes(forge.util.hexToBytes(xhex));
      if (ml !== false) {
        return _decodePkcs1_v1_5(eb.getBytes(), key, pub);
      }
      return eb.getBytes();
    };
    pki.rsa.createKeyPairGenerationState = function(bits, e, options) {
      if (typeof(bits) === 'string') {
        bits = parseInt(bits, 10);
      }
      bits = bits || 2048;
      options = options || {};
      var prng = options.prng || forge.random;
      var rng = {nextBytes: function(x) {
          var b = prng.getBytesSync(x.length);
          for (var i = 0; i < x.length; ++i) {
            x[i] = b.charCodeAt(i);
          }
        }};
      var algorithm = options.algorithm || 'PRIMEINC';
      var rval;
      if (algorithm === 'PRIMEINC') {
        rval = {
          algorithm: algorithm,
          state: 0,
          bits: bits,
          rng: rng,
          eInt: e || 65537,
          e: new BigInteger(null),
          p: null,
          q: null,
          qBits: bits >> 1,
          pBits: bits - (bits >> 1),
          pqState: 0,
          num: null,
          keys: null
        };
        rval.e.fromInt(rval.eInt);
      } else {
        throw new Error('Invalid key generation algorithm: ' + algorithm);
      }
      return rval;
    };
    pki.rsa.stepKeyPairGenerationState = function(state, n) {
      if (!('algorithm' in state)) {
        state.algorithm = 'PRIMEINC';
      }
      var THIRTY = new BigInteger(null);
      THIRTY.fromInt(30);
      var deltaIdx = 0;
      var op_or = function(x, y) {
        return x | y;
      };
      var t1 = +new Date();
      var t2;
      var total = 0;
      while (state.keys === null && (n <= 0 || total < n)) {
        if (state.state === 0) {
          var bits = (state.p === null) ? state.pBits : state.qBits;
          var bits1 = bits - 1;
          if (state.pqState === 0) {
            state.num = new BigInteger(bits, state.rng);
            if (!state.num.testBit(bits1)) {
              state.num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, state.num);
            }
            state.num.dAddOffset(31 - state.num.mod(THIRTY).byteValue(), 0);
            deltaIdx = 0;
            ++state.pqState;
          } else if (state.pqState === 1) {
            if (state.num.bitLength() > bits) {
              state.pqState = 0;
            } else if (state.num.isProbablePrime(_getMillerRabinTests(state.num.bitLength()))) {
              ++state.pqState;
            } else {
              state.num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
            }
          } else if (state.pqState === 2) {
            state.pqState = (state.num.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) === 0) ? 3 : 0;
          } else if (state.pqState === 3) {
            state.pqState = 0;
            if (state.p === null) {
              state.p = state.num;
            } else {
              state.q = state.num;
            }
            if (state.p !== null && state.q !== null) {
              ++state.state;
            }
            state.num = null;
          }
        } else if (state.state === 1) {
          if (state.p.compareTo(state.q) < 0) {
            state.num = state.p;
            state.p = state.q;
            state.q = state.num;
          }
          ++state.state;
        } else if (state.state === 2) {
          state.p1 = state.p.subtract(BigInteger.ONE);
          state.q1 = state.q.subtract(BigInteger.ONE);
          state.phi = state.p1.multiply(state.q1);
          ++state.state;
        } else if (state.state === 3) {
          if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) === 0) {
            ++state.state;
          } else {
            state.p = null;
            state.q = null;
            state.state = 0;
          }
        } else if (state.state === 4) {
          state.n = state.p.multiply(state.q);
          if (state.n.bitLength() === state.bits) {
            ++state.state;
          } else {
            state.q = null;
            state.state = 0;
          }
        } else if (state.state === 5) {
          var d = state.e.modInverse(state.phi);
          state.keys = {
            privateKey: pki.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
            publicKey: pki.rsa.setPublicKey(state.n, state.e)
          };
        }
        t2 = +new Date();
        total += t2 - t1;
        t1 = t2;
      }
      return state.keys !== null;
    };
    pki.rsa.generateKeyPair = function(bits, e, options, callback) {
      if (arguments.length === 1) {
        if (typeof bits === 'object') {
          options = bits;
          bits = undefined;
        } else if (typeof bits === 'function') {
          callback = bits;
          bits = undefined;
        }
      } else if (arguments.length === 2) {
        if (typeof bits === 'number') {
          if (typeof e === 'function') {
            callback = e;
            e = undefined;
          } else if (typeof e !== 'number') {
            options = e;
            e = undefined;
          }
        } else {
          options = bits;
          callback = e;
          bits = undefined;
          e = undefined;
        }
      } else if (arguments.length === 3) {
        if (typeof e === 'number') {
          if (typeof options === 'function') {
            callback = options;
            options = undefined;
          }
        } else {
          callback = options;
          options = e;
          e = undefined;
        }
      }
      options = options || {};
      if (bits === undefined) {
        bits = options.bits || 2048;
      }
      if (e === undefined) {
        e = options.e || 0x10001;
      }
      var state = pki.rsa.createKeyPairGenerationState(bits, e, options);
      if (!callback) {
        pki.rsa.stepKeyPairGenerationState(state, 0);
        return state.keys;
      }
      _generateKeyPair(state, options, callback);
    };
    pki.setRsaPublicKey = pki.rsa.setPublicKey = function(n, e) {
      var key = {
        n: n,
        e: e
      };
      key.encrypt = function(data, scheme, schemeOptions) {
        if (typeof scheme === 'string') {
          scheme = scheme.toUpperCase();
        } else if (scheme === undefined) {
          scheme = 'RSAES-PKCS1-V1_5';
        }
        if (scheme === 'RSAES-PKCS1-V1_5') {
          scheme = {encode: function(m, key, pub) {
              return _encodePkcs1_v1_5(m, key, 0x02).getBytes();
            }};
        } else if (scheme === 'RSA-OAEP' || scheme === 'RSAES-OAEP') {
          scheme = {encode: function(m, key) {
              return forge.pkcs1.encode_rsa_oaep(key, m, schemeOptions);
            }};
        } else if (['RAW', 'NONE', 'NULL', null].indexOf(scheme) !== -1) {
          scheme = {encode: function(e) {
              return e;
            }};
        } else if (typeof scheme === 'string') {
          throw new Error('Unsupported encryption scheme: "' + scheme + '".');
        }
        var e = scheme.encode(data, key, true);
        return pki.rsa.encrypt(e, key, true);
      };
      key.verify = function(digest, signature, scheme) {
        if (typeof scheme === 'string') {
          scheme = scheme.toUpperCase();
        } else if (scheme === undefined) {
          scheme = 'RSASSA-PKCS1-V1_5';
        }
        if (scheme === 'RSASSA-PKCS1-V1_5') {
          scheme = {verify: function(digest, d) {
              d = _decodePkcs1_v1_5(d, key, true);
              var obj = asn1.fromDer(d);
              return digest === obj.value[1].value;
            }};
        } else if (scheme === 'NONE' || scheme === 'NULL' || scheme === null) {
          scheme = {verify: function(digest, d) {
              d = _decodePkcs1_v1_5(d, key, true);
              return digest === d;
            }};
        }
        var d = pki.rsa.decrypt(signature, key, true, false);
        return scheme.verify(digest, d, key.n.bitLength());
      };
      return key;
    };
    pki.setRsaPrivateKey = pki.rsa.setPrivateKey = function(n, e, d, p, q, dP, dQ, qInv) {
      var key = {
        n: n,
        e: e,
        d: d,
        p: p,
        q: q,
        dP: dP,
        dQ: dQ,
        qInv: qInv
      };
      key.decrypt = function(data, scheme, schemeOptions) {
        if (typeof scheme === 'string') {
          scheme = scheme.toUpperCase();
        } else if (scheme === undefined) {
          scheme = 'RSAES-PKCS1-V1_5';
        }
        var d = pki.rsa.decrypt(data, key, false, false);
        if (scheme === 'RSAES-PKCS1-V1_5') {
          scheme = {decode: _decodePkcs1_v1_5};
        } else if (scheme === 'RSA-OAEP' || scheme === 'RSAES-OAEP') {
          scheme = {decode: function(d, key) {
              return forge.pkcs1.decode_rsa_oaep(key, d, schemeOptions);
            }};
        } else if (['RAW', 'NONE', 'NULL', null].indexOf(scheme) !== -1) {
          scheme = {decode: function(d) {
              return d;
            }};
        } else {
          throw new Error('Unsupported encryption scheme: "' + scheme + '".');
        }
        return scheme.decode(d, key, false);
      };
      key.sign = function(md, scheme) {
        var bt = false;
        if (typeof scheme === 'string') {
          scheme = scheme.toUpperCase();
        }
        if (scheme === undefined || scheme === 'RSASSA-PKCS1-V1_5') {
          scheme = {encode: emsaPkcs1v15encode};
          bt = 0x01;
        } else if (scheme === 'NONE' || scheme === 'NULL' || scheme === null) {
          scheme = {encode: function() {
              return md;
            }};
          bt = 0x01;
        }
        var d = scheme.encode(md, key.n.bitLength());
        return pki.rsa.encrypt(d, key, bt);
      };
      return key;
    };
    pki.wrapRsaPrivateKey = function(rsaKey) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(rsaKey).getBytes())]);
    };
    pki.privateKeyFromAsn1 = function(obj) {
      var capture = {};
      var errors = [];
      if (asn1.validate(obj, privateKeyValidator, capture, errors)) {
        obj = asn1.fromDer(forge.util.createBuffer(capture.privateKey));
      }
      capture = {};
      errors = [];
      if (!asn1.validate(obj, rsaPrivateKeyValidator, capture, errors)) {
        var error = new Error('Cannot read private key. ' + 'ASN.1 object does not contain an RSAPrivateKey.');
        error.errors = errors;
        throw error;
      }
      var n,
          e,
          d,
          p,
          q,
          dP,
          dQ,
          qInv;
      n = forge.util.createBuffer(capture.privateKeyModulus).toHex();
      e = forge.util.createBuffer(capture.privateKeyPublicExponent).toHex();
      d = forge.util.createBuffer(capture.privateKeyPrivateExponent).toHex();
      p = forge.util.createBuffer(capture.privateKeyPrime1).toHex();
      q = forge.util.createBuffer(capture.privateKeyPrime2).toHex();
      dP = forge.util.createBuffer(capture.privateKeyExponent1).toHex();
      dQ = forge.util.createBuffer(capture.privateKeyExponent2).toHex();
      qInv = forge.util.createBuffer(capture.privateKeyCoefficient).toHex();
      return pki.setRsaPrivateKey(new BigInteger(n, 16), new BigInteger(e, 16), new BigInteger(d, 16), new BigInteger(p, 16), new BigInteger(q, 16), new BigInteger(dP, 16), new BigInteger(dQ, 16), new BigInteger(qInv, 16));
    };
    pki.privateKeyToAsn1 = pki.privateKeyToRSAPrivateKey = function(key) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.d)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.p)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.q)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dP)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dQ)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.qInv))]);
    };
    pki.publicKeyFromAsn1 = function(obj) {
      var capture = {};
      var errors = [];
      if (asn1.validate(obj, publicKeyValidator, capture, errors)) {
        var oid = asn1.derToOid(capture.publicKeyOid);
        if (oid !== pki.oids.rsaEncryption) {
          var error = new Error('Cannot read public key. Unknown OID.');
          error.oid = oid;
          throw error;
        }
        obj = capture.rsaPublicKey;
      }
      errors = [];
      if (!asn1.validate(obj, rsaPublicKeyValidator, capture, errors)) {
        var error = new Error('Cannot read public key. ' + 'ASN.1 object does not contain an RSAPublicKey.');
        error.errors = errors;
        throw error;
      }
      var n = forge.util.createBuffer(capture.publicKeyModulus).toHex();
      var e = forge.util.createBuffer(capture.publicKeyExponent).toHex();
      return pki.setRsaPublicKey(new BigInteger(n, 16), new BigInteger(e, 16));
    };
    pki.publicKeyToAsn1 = pki.publicKeyToSubjectPublicKeyInfo = function(key) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, [pki.publicKeyToRSAPublicKey(key)])]);
    };
    pki.publicKeyToRSAPublicKey = function(key) {
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e))]);
    };
    function _encodePkcs1_v1_5(m, key, bt) {
      var eb = forge.util.createBuffer();
      var k = Math.ceil(key.n.bitLength() / 8);
      if (m.length > (k - 11)) {
        var error = new Error('Message is too long for PKCS#1 v1.5 padding.');
        error.length = m.length;
        error.max = k - 11;
        throw error;
      }
      eb.putByte(0x00);
      eb.putByte(bt);
      var padNum = k - 3 - m.length;
      var padByte;
      if (bt === 0x00 || bt === 0x01) {
        padByte = (bt === 0x00) ? 0x00 : 0xFF;
        for (var i = 0; i < padNum; ++i) {
          eb.putByte(padByte);
        }
      } else {
        while (padNum > 0) {
          var numZeros = 0;
          var padBytes = forge.random.getBytes(padNum);
          for (var i = 0; i < padNum; ++i) {
            padByte = padBytes.charCodeAt(i);
            if (padByte === 0) {
              ++numZeros;
            } else {
              eb.putByte(padByte);
            }
          }
          padNum = numZeros;
        }
      }
      eb.putByte(0x00);
      eb.putBytes(m);
      return eb;
    }
    function _decodePkcs1_v1_5(em, key, pub, ml) {
      var k = Math.ceil(key.n.bitLength() / 8);
      var eb = forge.util.createBuffer(em);
      var first = eb.getByte();
      var bt = eb.getByte();
      if (first !== 0x00 || (pub && bt !== 0x00 && bt !== 0x01) || (!pub && bt != 0x02) || (pub && bt === 0x00 && typeof(ml) === 'undefined')) {
        throw new Error('Encryption block is invalid.');
      }
      var padNum = 0;
      if (bt === 0x00) {
        padNum = k - 3 - ml;
        for (var i = 0; i < padNum; ++i) {
          if (eb.getByte() !== 0x00) {
            throw new Error('Encryption block is invalid.');
          }
        }
      } else if (bt === 0x01) {
        padNum = 0;
        while (eb.length() > 1) {
          if (eb.getByte() !== 0xFF) {
            --eb.read;
            break;
          }
          ++padNum;
        }
      } else if (bt === 0x02) {
        padNum = 0;
        while (eb.length() > 1) {
          if (eb.getByte() === 0x00) {
            --eb.read;
            break;
          }
          ++padNum;
        }
      }
      var zero = eb.getByte();
      if (zero !== 0x00 || padNum !== (k - 3 - eb.length())) {
        throw new Error('Encryption block is invalid.');
      }
      return eb.getBytes();
    }
    function _generateKeyPair(state, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};
      var opts = {algorithm: {
          name: options.algorithm || 'PRIMEINC',
          options: {
            workers: options.workers || 2,
            workLoad: options.workLoad || 100,
            workerScript: options.workerScript
          }
        }};
      if ('prng' in options) {
        opts.prng = options.prng;
      }
      generate();
      function generate() {
        getPrime(state.pBits, function(err, num) {
          if (err) {
            return callback(err);
          }
          state.p = num;
          if (state.q !== null) {
            return finish(err, state.q);
          }
          getPrime(state.qBits, finish);
        });
      }
      function getPrime(bits, callback) {
        forge.prime.generateProbablePrime(bits, opts, callback);
      }
      function finish(err, num) {
        if (err) {
          return callback(err);
        }
        state.q = num;
        if (state.p.compareTo(state.q) < 0) {
          var tmp = state.p;
          state.p = state.q;
          state.q = tmp;
        }
        if (state.p.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
          state.p = null;
          generate();
          return ;
        }
        if (state.q.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
          state.q = null;
          getPrime(state.qBits, finish);
          return ;
        }
        state.p1 = state.p.subtract(BigInteger.ONE);
        state.q1 = state.q.subtract(BigInteger.ONE);
        state.phi = state.p1.multiply(state.q1);
        if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
          state.p = state.q = null;
          generate();
          return ;
        }
        state.n = state.p.multiply(state.q);
        if (state.n.bitLength() !== state.bits) {
          state.q = null;
          getPrime(state.qBits, finish);
          return ;
        }
        var d = state.e.modInverse(state.phi);
        state.keys = {
          privateKey: pki.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
          publicKey: pki.rsa.setPublicKey(state.n, state.e)
        };
        callback(null, state.keys);
      }
    }
    function _bnToBytes(b) {
      var hex = b.toString(16);
      if (hex[0] >= '8') {
        hex = '00' + hex;
      }
      return forge.util.hexToBytes(hex);
    }
    function _getMillerRabinTests(bits) {
      if (bits <= 100)
        return 27;
      if (bits <= 150)
        return 18;
      if (bits <= 200)
        return 15;
      if (bits <= 250)
        return 12;
      if (bits <= 300)
        return 9;
      if (bits <= 350)
        return 8;
      if (bits <= 400)
        return 7;
      if (bits <= 500)
        return 6;
      if (bits <= 600)
        return 5;
      if (bits <= 800)
        return 4;
      if (bits <= 1250)
        return 3;
      return 2;
    }
  }
  var name = 'rsa';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/rsa", ["npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/jsbn", "npm:node-forge@0.6.26/js/oids", "npm:node-forge@0.6.26/js/pkcs1", "npm:node-forge@0.6.26/js/prime", "npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/jsbn'), __require('npm:node-forge@0.6.26/js/oids'), __require('npm:node-forge@0.6.26/js/pkcs1'), __require('npm:node-forge@0.6.26/js/prime'), __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.mgf = forge.mgf || {};
    forge.mgf.mgf1 = forge.mgf1;
  }
  var name = 'mgf';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/mgf", ["npm:node-forge@0.6.26/js/mgf1"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/mgf1'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    forge.aes = forge.aes || {};
    forge.aes.startEncrypting = function(key, iv, output, mode) {
      var cipher = _createCipher({
        key: key,
        output: output,
        decrypt: false,
        mode: mode
      });
      cipher.start(iv);
      return cipher;
    };
    forge.aes.createEncryptionCipher = function(key, mode) {
      return _createCipher({
        key: key,
        output: null,
        decrypt: false,
        mode: mode
      });
    };
    forge.aes.startDecrypting = function(key, iv, output, mode) {
      var cipher = _createCipher({
        key: key,
        output: output,
        decrypt: true,
        mode: mode
      });
      cipher.start(iv);
      return cipher;
    };
    forge.aes.createDecryptionCipher = function(key, mode) {
      return _createCipher({
        key: key,
        output: null,
        decrypt: true,
        mode: mode
      });
    };
    forge.aes.Algorithm = function(name, mode) {
      if (!init) {
        initialize();
      }
      var self = this;
      self.name = name;
      self.mode = new mode({
        blockSize: 16,
        cipher: {
          encrypt: function(inBlock, outBlock) {
            return _updateBlock(self._w, inBlock, outBlock, false);
          },
          decrypt: function(inBlock, outBlock) {
            return _updateBlock(self._w, inBlock, outBlock, true);
          }
        }
      });
      self._init = false;
    };
    forge.aes.Algorithm.prototype.initialize = function(options) {
      if (this._init) {
        return ;
      }
      var key = options.key;
      var tmp;
      if (typeof key === 'string' && (key.length === 16 || key.length === 24 || key.length === 32)) {
        key = forge.util.createBuffer(key);
      } else if (forge.util.isArray(key) && (key.length === 16 || key.length === 24 || key.length === 32)) {
        tmp = key;
        key = forge.util.createBuffer();
        for (var i = 0; i < tmp.length; ++i) {
          key.putByte(tmp[i]);
        }
      }
      if (!forge.util.isArray(key)) {
        tmp = key;
        key = [];
        var len = tmp.length();
        if (len === 16 || len === 24 || len === 32) {
          len = len >>> 2;
          for (var i = 0; i < len; ++i) {
            key.push(tmp.getInt32());
          }
        }
      }
      if (!forge.util.isArray(key) || !(key.length === 4 || key.length === 6 || key.length === 8)) {
        throw new Error('Invalid key parameter.');
      }
      var mode = this.mode.name;
      var encryptOp = (['CFB', 'OFB', 'CTR', 'GCM'].indexOf(mode) !== -1);
      this._w = _expandKey(key, options.decrypt && !encryptOp);
      this._init = true;
    };
    forge.aes._expandKey = function(key, decrypt) {
      if (!init) {
        initialize();
      }
      return _expandKey(key, decrypt);
    };
    forge.aes._updateBlock = _updateBlock;
    registerAlgorithm('AES-CBC', forge.cipher.modes.cbc);
    registerAlgorithm('AES-CFB', forge.cipher.modes.cfb);
    registerAlgorithm('AES-OFB', forge.cipher.modes.ofb);
    registerAlgorithm('AES-CTR', forge.cipher.modes.ctr);
    registerAlgorithm('AES-GCM', forge.cipher.modes.gcm);
    function registerAlgorithm(name, mode) {
      var factory = function() {
        return new forge.aes.Algorithm(name, mode);
      };
      forge.cipher.registerAlgorithm(name, factory);
    }
    var init = false;
    var Nb = 4;
    var sbox;
    var isbox;
    var rcon;
    var mix;
    var imix;
    function initialize() {
      init = true;
      rcon = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36];
      var xtime = new Array(256);
      for (var i = 0; i < 128; ++i) {
        xtime[i] = i << 1;
        xtime[i + 128] = (i + 128) << 1 ^ 0x11B;
      }
      sbox = new Array(256);
      isbox = new Array(256);
      mix = new Array(4);
      imix = new Array(4);
      for (var i = 0; i < 4; ++i) {
        mix[i] = new Array(256);
        imix[i] = new Array(256);
      }
      var e = 0,
          ei = 0,
          e2,
          e4,
          e8,
          sx,
          sx2,
          me,
          ime;
      for (var i = 0; i < 256; ++i) {
        sx = ei ^ (ei << 1) ^ (ei << 2) ^ (ei << 3) ^ (ei << 4);
        sx = (sx >> 8) ^ (sx & 255) ^ 0x63;
        sbox[e] = sx;
        isbox[sx] = e;
        sx2 = xtime[sx];
        e2 = xtime[e];
        e4 = xtime[e2];
        e8 = xtime[e4];
        me = (sx2 << 24) ^ (sx << 16) ^ (sx << 8) ^ (sx ^ sx2);
        ime = (e2 ^ e4 ^ e8) << 24 ^ (e ^ e8) << 16 ^ (e ^ e4 ^ e8) << 8 ^ (e ^ e2 ^ e8);
        for (var n = 0; n < 4; ++n) {
          mix[n][e] = me;
          imix[n][sx] = ime;
          me = me << 24 | me >>> 8;
          ime = ime << 24 | ime >>> 8;
        }
        if (e === 0) {
          e = ei = 1;
        } else {
          e = e2 ^ xtime[xtime[xtime[e2 ^ e8]]];
          ei ^= xtime[xtime[ei]];
        }
      }
    }
    function _expandKey(key, decrypt) {
      var w = key.slice(0);
      var temp,
          iNk = 1;
      var Nk = w.length;
      var Nr1 = Nk + 6 + 1;
      var end = Nb * Nr1;
      for (var i = Nk; i < end; ++i) {
        temp = w[i - 1];
        if (i % Nk === 0) {
          temp = sbox[temp >>> 16 & 255] << 24 ^ sbox[temp >>> 8 & 255] << 16 ^ sbox[temp & 255] << 8 ^ sbox[temp >>> 24] ^ (rcon[iNk] << 24);
          iNk++;
        } else if (Nk > 6 && (i % Nk === 4)) {
          temp = sbox[temp >>> 24] << 24 ^ sbox[temp >>> 16 & 255] << 16 ^ sbox[temp >>> 8 & 255] << 8 ^ sbox[temp & 255];
        }
        w[i] = w[i - Nk] ^ temp;
      }
      if (decrypt) {
        var tmp;
        var m0 = imix[0];
        var m1 = imix[1];
        var m2 = imix[2];
        var m3 = imix[3];
        var wnew = w.slice(0);
        end = w.length;
        for (var i = 0,
            wi = end - Nb; i < end; i += Nb, wi -= Nb) {
          if (i === 0 || i === (end - Nb)) {
            wnew[i] = w[wi];
            wnew[i + 1] = w[wi + 3];
            wnew[i + 2] = w[wi + 2];
            wnew[i + 3] = w[wi + 1];
          } else {
            for (var n = 0; n < Nb; ++n) {
              tmp = w[wi + n];
              wnew[i + (3 & -n)] = m0[sbox[tmp >>> 24]] ^ m1[sbox[tmp >>> 16 & 255]] ^ m2[sbox[tmp >>> 8 & 255]] ^ m3[sbox[tmp & 255]];
            }
          }
        }
        w = wnew;
      }
      return w;
    }
    function _updateBlock(w, input, output, decrypt) {
      var Nr = w.length / 4 - 1;
      var m0,
          m1,
          m2,
          m3,
          sub;
      if (decrypt) {
        m0 = imix[0];
        m1 = imix[1];
        m2 = imix[2];
        m3 = imix[3];
        sub = isbox;
      } else {
        m0 = mix[0];
        m1 = mix[1];
        m2 = mix[2];
        m3 = mix[3];
        sub = sbox;
      }
      var a,
          b,
          c,
          d,
          a2,
          b2,
          c2;
      a = input[0] ^ w[0];
      b = input[decrypt ? 3 : 1] ^ w[1];
      c = input[2] ^ w[2];
      d = input[decrypt ? 1 : 3] ^ w[3];
      var i = 3;
      for (var round = 1; round < Nr; ++round) {
        a2 = m0[a >>> 24] ^ m1[b >>> 16 & 255] ^ m2[c >>> 8 & 255] ^ m3[d & 255] ^ w[++i];
        b2 = m0[b >>> 24] ^ m1[c >>> 16 & 255] ^ m2[d >>> 8 & 255] ^ m3[a & 255] ^ w[++i];
        c2 = m0[c >>> 24] ^ m1[d >>> 16 & 255] ^ m2[a >>> 8 & 255] ^ m3[b & 255] ^ w[++i];
        d = m0[d >>> 24] ^ m1[a >>> 16 & 255] ^ m2[b >>> 8 & 255] ^ m3[c & 255] ^ w[++i];
        a = a2;
        b = b2;
        c = c2;
      }
      output[0] = (sub[a >>> 24] << 24) ^ (sub[b >>> 16 & 255] << 16) ^ (sub[c >>> 8 & 255] << 8) ^ (sub[d & 255]) ^ w[++i];
      output[decrypt ? 3 : 1] = (sub[b >>> 24] << 24) ^ (sub[c >>> 16 & 255] << 16) ^ (sub[d >>> 8 & 255] << 8) ^ (sub[a & 255]) ^ w[++i];
      output[2] = (sub[c >>> 24] << 24) ^ (sub[d >>> 16 & 255] << 16) ^ (sub[a >>> 8 & 255] << 8) ^ (sub[b & 255]) ^ w[++i];
      output[decrypt ? 1 : 3] = (sub[d >>> 24] << 24) ^ (sub[a >>> 16 & 255] << 16) ^ (sub[b >>> 8 & 255] << 8) ^ (sub[c & 255]) ^ w[++i];
    }
    function _createCipher(options) {
      options = options || {};
      var mode = (options.mode || 'CBC').toUpperCase();
      var algorithm = 'AES-' + mode;
      var cipher;
      if (options.decrypt) {
        cipher = forge.cipher.createDecipher(algorithm, options.key);
      } else {
        cipher = forge.cipher.createCipher(algorithm, options.key);
      }
      var start = cipher.start;
      cipher.start = function(iv, options) {
        var output = null;
        if (options instanceof forge.util.ByteBuffer) {
          output = options;
          options = {};
        }
        options = options || {};
        options.output = output;
        options.iv = iv;
        start.call(cipher, options);
      };
      return cipher;
    }
  }
  var name = 'aes';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/aes", ["npm:node-forge@0.6.26/js/cipher", "npm:node-forge@0.6.26/js/cipherModes", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/cipher'), __require('npm:node-forge@0.6.26/js/cipherModes'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var hmac = forge.hmac = forge.hmac || {};
    hmac.create = function() {
      var _key = null;
      var _md = null;
      var _ipadding = null;
      var _opadding = null;
      var ctx = {};
      ctx.start = function(md, key) {
        if (md !== null) {
          if (typeof md === 'string') {
            md = md.toLowerCase();
            if (md in forge.md.algorithms) {
              _md = forge.md.algorithms[md].create();
            } else {
              throw new Error('Unknown hash algorithm "' + md + '"');
            }
          } else {
            _md = md;
          }
        }
        if (key === null) {
          key = _key;
        } else {
          if (typeof key === 'string') {
            key = forge.util.createBuffer(key);
          } else if (forge.util.isArray(key)) {
            var tmp = key;
            key = forge.util.createBuffer();
            for (var i = 0; i < tmp.length; ++i) {
              key.putByte(tmp[i]);
            }
          }
          var keylen = key.length();
          if (keylen > _md.blockLength) {
            _md.start();
            _md.update(key.bytes());
            key = _md.digest();
          }
          _ipadding = forge.util.createBuffer();
          _opadding = forge.util.createBuffer();
          keylen = key.length();
          for (var i = 0; i < keylen; ++i) {
            var tmp = key.at(i);
            _ipadding.putByte(0x36 ^ tmp);
            _opadding.putByte(0x5C ^ tmp);
          }
          if (keylen < _md.blockLength) {
            var tmp = _md.blockLength - keylen;
            for (var i = 0; i < tmp; ++i) {
              _ipadding.putByte(0x36);
              _opadding.putByte(0x5C);
            }
          }
          _key = key;
          _ipadding = _ipadding.bytes();
          _opadding = _opadding.bytes();
        }
        _md.start();
        _md.update(_ipadding);
      };
      ctx.update = function(bytes) {
        _md.update(bytes);
      };
      ctx.getMac = function() {
        var inner = _md.digest().bytes();
        _md.start();
        _md.update(_opadding);
        _md.update(inner);
        return _md.digest();
      };
      ctx.digest = ctx.getMac;
      return ctx;
    };
  }
  var name = 'hmac';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/hmac", ["npm:node-forge@0.6.26/js/md", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/md'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    if (typeof BigInteger === 'undefined') {
      var BigInteger = forge.jsbn.BigInteger;
    }
    var asn1 = forge.asn1;
    var pki = forge.pki = forge.pki || {};
    pki.pbe = forge.pbe = forge.pbe || {};
    var oids = pki.oids;
    var encryptedPrivateKeyValidator = {
      name: 'EncryptedPrivateKeyInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'EncryptedPrivateKeyInfo.encryptionAlgorithm',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'AlgorithmIdentifier.algorithm',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'encryptionOid'
        }, {
          name: 'AlgorithmIdentifier.parameters',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: 'encryptionParams'
        }]
      }, {
        name: 'EncryptedPrivateKeyInfo.encryptedData',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: 'encryptedData'
      }]
    };
    var PBES2AlgorithmsValidator = {
      name: 'PBES2Algorithms',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'PBES2Algorithms.keyDerivationFunc',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'PBES2Algorithms.keyDerivationFunc.oid',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'kdfOid'
        }, {
          name: 'PBES2Algorithms.params',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: 'PBES2Algorithms.params.salt',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OCTETSTRING,
            constructed: false,
            capture: 'kdfSalt'
          }, {
            name: 'PBES2Algorithms.params.iterationCount',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            onstructed: true,
            capture: 'kdfIterationCount'
          }]
        }]
      }, {
        name: 'PBES2Algorithms.encryptionScheme',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'PBES2Algorithms.encryptionScheme.oid',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'encOid'
        }, {
          name: 'PBES2Algorithms.encryptionScheme.iv',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: 'encIv'
        }]
      }]
    };
    var pkcs12PbeParamsValidator = {
      name: 'pkcs-12PbeParams',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'pkcs-12PbeParams.salt',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OCTETSTRING,
        constructed: false,
        capture: 'salt'
      }, {
        name: 'pkcs-12PbeParams.iterations',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'iterations'
      }]
    };
    pki.encryptPrivateKeyInfo = function(obj, password, options) {
      options = options || {};
      options.saltSize = options.saltSize || 8;
      options.count = options.count || 2048;
      options.algorithm = options.algorithm || 'aes128';
      var salt = forge.random.getBytesSync(options.saltSize);
      var count = options.count;
      var countBytes = asn1.integerToDer(count);
      var dkLen;
      var encryptionAlgorithm;
      var encryptedData;
      if (options.algorithm.indexOf('aes') === 0 || options.algorithm === 'des') {
        var ivLen,
            encOid,
            cipherFn;
        switch (options.algorithm) {
          case 'aes128':
            dkLen = 16;
            ivLen = 16;
            encOid = oids['aes128-CBC'];
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case 'aes192':
            dkLen = 24;
            ivLen = 16;
            encOid = oids['aes192-CBC'];
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case 'aes256':
            dkLen = 32;
            ivLen = 16;
            encOid = oids['aes256-CBC'];
            cipherFn = forge.aes.createEncryptionCipher;
            break;
          case 'des':
            dkLen = 8;
            ivLen = 8;
            encOid = oids['desCBC'];
            cipherFn = forge.des.createEncryptionCipher;
            break;
          default:
            var error = new Error('Cannot encrypt private key. Unknown encryption algorithm.');
            error.algorithm = options.algorithm;
            throw error;
        }
        var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen);
        var iv = forge.random.getBytesSync(ivLen);
        var cipher = cipherFn(dk);
        cipher.start(iv);
        cipher.update(asn1.toDer(obj));
        cipher.finish();
        encryptedData = cipher.output.getBytes();
        encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids['pkcs5PBES2']).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids['pkcs5PBKDF2']).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())])]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(encOid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, iv)])])]);
      } else if (options.algorithm === '3des') {
        dkLen = 24;
        var saltBytes = new forge.util.ByteBuffer(salt);
        var dk = pki.pbe.generatePkcs12Key(password, saltBytes, 1, count, dkLen);
        var iv = pki.pbe.generatePkcs12Key(password, saltBytes, 2, count, dkLen);
        var cipher = forge.des.createEncryptionCipher(dk);
        cipher.start(iv);
        cipher.update(asn1.toDer(obj));
        cipher.finish();
        encryptedData = cipher.output.getBytes();
        encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids['pbeWithSHAAnd3-KeyTripleDES-CBC']).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())])]);
      } else {
        var error = new Error('Cannot encrypt private key. Unknown encryption algorithm.');
        error.algorithm = options.algorithm;
        throw error;
      }
      var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [encryptionAlgorithm, asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, encryptedData)]);
      return rval;
    };
    pki.decryptPrivateKeyInfo = function(obj, password) {
      var rval = null;
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors)) {
        var error = new Error('Cannot read encrypted private key. ' + 'ASN.1 object is not a supported EncryptedPrivateKeyInfo.');
        error.errors = errors;
        throw error;
      }
      var oid = asn1.derToOid(capture.encryptionOid);
      var cipher = pki.pbe.getCipher(oid, capture.encryptionParams, password);
      var encrypted = forge.util.createBuffer(capture.encryptedData);
      cipher.update(encrypted);
      if (cipher.finish()) {
        rval = asn1.fromDer(cipher.output);
      }
      return rval;
    };
    pki.encryptedPrivateKeyToPem = function(epki, maxline) {
      var msg = {
        type: 'ENCRYPTED PRIVATE KEY',
        body: asn1.toDer(epki).getBytes()
      };
      return forge.pem.encode(msg, {maxline: maxline});
    };
    pki.encryptedPrivateKeyFromPem = function(pem) {
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== 'ENCRYPTED PRIVATE KEY') {
        var error = new Error('Could not convert encrypted private key from PEM; ' + 'PEM header type is "ENCRYPTED PRIVATE KEY".');
        error.headerType = msg.type;
        throw error;
      }
      if (msg.procType && msg.procType.type === 'ENCRYPTED') {
        throw new Error('Could not convert encrypted private key from PEM; ' + 'PEM is encrypted.');
      }
      return asn1.fromDer(msg.body);
    };
    pki.encryptRsaPrivateKey = function(rsaKey, password, options) {
      options = options || {};
      if (!options.legacy) {
        var rval = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(rsaKey));
        rval = pki.encryptPrivateKeyInfo(rval, password, options);
        return pki.encryptedPrivateKeyToPem(rval);
      }
      var algorithm;
      var iv;
      var dkLen;
      var cipherFn;
      switch (options.algorithm) {
        case 'aes128':
          algorithm = 'AES-128-CBC';
          dkLen = 16;
          iv = forge.random.getBytesSync(16);
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case 'aes192':
          algorithm = 'AES-192-CBC';
          dkLen = 24;
          iv = forge.random.getBytesSync(16);
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case 'aes256':
          algorithm = 'AES-256-CBC';
          dkLen = 32;
          iv = forge.random.getBytesSync(16);
          cipherFn = forge.aes.createEncryptionCipher;
          break;
        case '3des':
          algorithm = 'DES-EDE3-CBC';
          dkLen = 24;
          iv = forge.random.getBytesSync(8);
          cipherFn = forge.des.createEncryptionCipher;
          break;
        case 'des':
          algorithm = 'DES-CBC';
          dkLen = 8;
          iv = forge.random.getBytesSync(8);
          cipherFn = forge.des.createEncryptionCipher;
          break;
        default:
          var error = new Error('Could not encrypt RSA private key; unsupported ' + 'encryption algorithm "' + options.algorithm + '".');
          error.algorithm = options.algorithm;
          throw error;
      }
      var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
      var cipher = cipherFn(dk);
      cipher.start(iv);
      cipher.update(asn1.toDer(pki.privateKeyToAsn1(rsaKey)));
      cipher.finish();
      var msg = {
        type: 'RSA PRIVATE KEY',
        procType: {
          version: '4',
          type: 'ENCRYPTED'
        },
        dekInfo: {
          algorithm: algorithm,
          parameters: forge.util.bytesToHex(iv).toUpperCase()
        },
        body: cipher.output.getBytes()
      };
      return forge.pem.encode(msg);
    };
    pki.decryptRsaPrivateKey = function(pem, password) {
      var rval = null;
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== 'ENCRYPTED PRIVATE KEY' && msg.type !== 'PRIVATE KEY' && msg.type !== 'RSA PRIVATE KEY') {
        var error = new Error('Could not convert private key from PEM; PEM header type ' + 'is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".');
        error.headerType = error;
        throw error;
      }
      if (msg.procType && msg.procType.type === 'ENCRYPTED') {
        var dkLen;
        var cipherFn;
        switch (msg.dekInfo.algorithm) {
          case 'DES-CBC':
            dkLen = 8;
            cipherFn = forge.des.createDecryptionCipher;
            break;
          case 'DES-EDE3-CBC':
            dkLen = 24;
            cipherFn = forge.des.createDecryptionCipher;
            break;
          case 'AES-128-CBC':
            dkLen = 16;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case 'AES-192-CBC':
            dkLen = 24;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case 'AES-256-CBC':
            dkLen = 32;
            cipherFn = forge.aes.createDecryptionCipher;
            break;
          case 'RC2-40-CBC':
            dkLen = 5;
            cipherFn = function(key) {
              return forge.rc2.createDecryptionCipher(key, 40);
            };
            break;
          case 'RC2-64-CBC':
            dkLen = 8;
            cipherFn = function(key) {
              return forge.rc2.createDecryptionCipher(key, 64);
            };
            break;
          case 'RC2-128-CBC':
            dkLen = 16;
            cipherFn = function(key) {
              return forge.rc2.createDecryptionCipher(key, 128);
            };
            break;
          default:
            var error = new Error('Could not decrypt private key; unsupported ' + 'encryption algorithm "' + msg.dekInfo.algorithm + '".');
            error.algorithm = msg.dekInfo.algorithm;
            throw error;
        }
        var iv = forge.util.hexToBytes(msg.dekInfo.parameters);
        var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
        var cipher = cipherFn(dk);
        cipher.start(iv);
        cipher.update(forge.util.createBuffer(msg.body));
        if (cipher.finish()) {
          rval = cipher.output.getBytes();
        } else {
          return rval;
        }
      } else {
        rval = msg.body;
      }
      if (msg.type === 'ENCRYPTED PRIVATE KEY') {
        rval = pki.decryptPrivateKeyInfo(asn1.fromDer(rval), password);
      } else {
        rval = asn1.fromDer(rval);
      }
      if (rval !== null) {
        rval = pki.privateKeyFromAsn1(rval);
      }
      return rval;
    };
    pki.pbe.generatePkcs12Key = function(password, salt, id, iter, n, md) {
      var j,
          l;
      if (typeof md === 'undefined' || md === null) {
        md = forge.md.sha1.create();
      }
      var u = md.digestLength;
      var v = md.blockLength;
      var result = new forge.util.ByteBuffer();
      var passBuf = new forge.util.ByteBuffer();
      if (password !== null && password !== undefined) {
        for (l = 0; l < password.length; l++) {
          passBuf.putInt16(password.charCodeAt(l));
        }
        passBuf.putInt16(0);
      }
      var p = passBuf.length();
      var s = salt.length();
      var D = new forge.util.ByteBuffer();
      D.fillWithByte(id, v);
      var Slen = v * Math.ceil(s / v);
      var S = new forge.util.ByteBuffer();
      for (l = 0; l < Slen; l++) {
        S.putByte(salt.at(l % s));
      }
      var Plen = v * Math.ceil(p / v);
      var P = new forge.util.ByteBuffer();
      for (l = 0; l < Plen; l++) {
        P.putByte(passBuf.at(l % p));
      }
      var I = S;
      I.putBuffer(P);
      var c = Math.ceil(n / u);
      for (var i = 1; i <= c; i++) {
        var buf = new forge.util.ByteBuffer();
        buf.putBytes(D.bytes());
        buf.putBytes(I.bytes());
        for (var round = 0; round < iter; round++) {
          md.start();
          md.update(buf.getBytes());
          buf = md.digest();
        }
        var B = new forge.util.ByteBuffer();
        for (l = 0; l < v; l++) {
          B.putByte(buf.at(l % u));
        }
        var k = Math.ceil(s / v) + Math.ceil(p / v);
        var Inew = new forge.util.ByteBuffer();
        for (j = 0; j < k; j++) {
          var chunk = new forge.util.ByteBuffer(I.getBytes(v));
          var x = 0x1ff;
          for (l = B.length() - 1; l >= 0; l--) {
            x = x >> 8;
            x += B.at(l) + chunk.at(l);
            chunk.setAt(l, x & 0xff);
          }
          Inew.putBuffer(chunk);
        }
        I = Inew;
        result.putBuffer(buf);
      }
      result.truncate(result.length() - n);
      return result;
    };
    pki.pbe.getCipher = function(oid, params, password) {
      switch (oid) {
        case pki.oids['pkcs5PBES2']:
          return pki.pbe.getCipherForPBES2(oid, params, password);
        case pki.oids['pbeWithSHAAnd3-KeyTripleDES-CBC']:
        case pki.oids['pbewithSHAAnd40BitRC2-CBC']:
          return pki.pbe.getCipherForPKCS12PBE(oid, params, password);
        default:
          var error = new Error('Cannot read encrypted PBE data block. Unsupported OID.');
          error.oid = oid;
          error.supportedOids = ['pkcs5PBES2', 'pbeWithSHAAnd3-KeyTripleDES-CBC', 'pbewithSHAAnd40BitRC2-CBC'];
          throw error;
      }
    };
    pki.pbe.getCipherForPBES2 = function(oid, params, password) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(params, PBES2AlgorithmsValidator, capture, errors)) {
        var error = new Error('Cannot read password-based-encryption algorithm ' + 'parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.');
        error.errors = errors;
        throw error;
      }
      oid = asn1.derToOid(capture.kdfOid);
      if (oid !== pki.oids['pkcs5PBKDF2']) {
        var error = new Error('Cannot read encrypted private key. ' + 'Unsupported key derivation function OID.');
        error.oid = oid;
        error.supportedOids = ['pkcs5PBKDF2'];
        throw error;
      }
      oid = asn1.derToOid(capture.encOid);
      if (oid !== pki.oids['aes128-CBC'] && oid !== pki.oids['aes192-CBC'] && oid !== pki.oids['aes256-CBC'] && oid !== pki.oids['des-EDE3-CBC'] && oid !== pki.oids['desCBC']) {
        var error = new Error('Cannot read encrypted private key. ' + 'Unsupported encryption scheme OID.');
        error.oid = oid;
        error.supportedOids = ['aes128-CBC', 'aes192-CBC', 'aes256-CBC', 'des-EDE3-CBC', 'desCBC'];
        throw error;
      }
      var salt = capture.kdfSalt;
      var count = forge.util.createBuffer(capture.kdfIterationCount);
      count = count.getInt(count.length() << 3);
      var dkLen;
      var cipherFn;
      switch (pki.oids[oid]) {
        case 'aes128-CBC':
          dkLen = 16;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case 'aes192-CBC':
          dkLen = 24;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case 'aes256-CBC':
          dkLen = 32;
          cipherFn = forge.aes.createDecryptionCipher;
          break;
        case 'des-EDE3-CBC':
          dkLen = 24;
          cipherFn = forge.des.createDecryptionCipher;
          break;
        case 'desCBC':
          dkLen = 8;
          cipherFn = forge.des.createDecryptionCipher;
          break;
      }
      var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen);
      var iv = capture.encIv;
      var cipher = cipherFn(dk);
      cipher.start(iv);
      return cipher;
    };
    pki.pbe.getCipherForPKCS12PBE = function(oid, params, password) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(params, pkcs12PbeParamsValidator, capture, errors)) {
        var error = new Error('Cannot read password-based-encryption algorithm ' + 'parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.');
        error.errors = errors;
        throw error;
      }
      var salt = forge.util.createBuffer(capture.salt);
      var count = forge.util.createBuffer(capture.iterations);
      count = count.getInt(count.length() << 3);
      var dkLen,
          dIvLen,
          cipherFn;
      switch (oid) {
        case pki.oids['pbeWithSHAAnd3-KeyTripleDES-CBC']:
          dkLen = 24;
          dIvLen = 8;
          cipherFn = forge.des.startDecrypting;
          break;
        case pki.oids['pbewithSHAAnd40BitRC2-CBC']:
          dkLen = 5;
          dIvLen = 8;
          cipherFn = function(key, iv) {
            var cipher = forge.rc2.createDecryptionCipher(key, 40);
            cipher.start(iv, null);
            return cipher;
          };
          break;
        default:
          var error = new Error('Cannot read PKCS #12 PBE data block. Unsupported OID.');
          error.oid = oid;
          throw error;
      }
      var key = pki.pbe.generatePkcs12Key(password, salt, 1, count, dkLen);
      var iv = pki.pbe.generatePkcs12Key(password, salt, 2, count, dIvLen);
      return cipherFn(key, iv);
    };
    pki.pbe.opensslDeriveBytes = function(password, salt, dkLen, md) {
      if (typeof md === 'undefined' || md === null) {
        md = forge.md.md5.create();
      }
      if (salt === null) {
        salt = '';
      }
      var digests = [hash(md, password + salt)];
      for (var length = 16,
          i = 1; length < dkLen; ++i, length += 16) {
        digests.push(hash(md, digests[i - 1] + password + salt));
      }
      return digests.join('').substr(0, dkLen);
    };
    function hash(md, bytes) {
      return md.start().update(bytes).digest().getBytes();
    }
  }
  var name = 'pbe';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pbe", ["npm:node-forge@0.6.26/js/aes", "npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/des", "npm:node-forge@0.6.26/js/md", "npm:node-forge@0.6.26/js/oids", "npm:node-forge@0.6.26/js/pem", "npm:node-forge@0.6.26/js/pbkdf2", "npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/rc2", "npm:node-forge@0.6.26/js/rsa", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/aes'), __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/des'), __require('npm:node-forge@0.6.26/js/md'), __require('npm:node-forge@0.6.26/js/oids'), __require('npm:node-forge@0.6.26/js/pem'), __require('npm:node-forge@0.6.26/js/pbkdf2'), __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/rc2'), __require('npm:node-forge@0.6.26/js/rsa'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var asn1 = forge.asn1;
    var pki = forge.pki = forge.pki || {};
    var oids = pki.oids;
    var _shortNames = {};
    _shortNames['CN'] = oids['commonName'];
    _shortNames['commonName'] = 'CN';
    _shortNames['C'] = oids['countryName'];
    _shortNames['countryName'] = 'C';
    _shortNames['L'] = oids['localityName'];
    _shortNames['localityName'] = 'L';
    _shortNames['ST'] = oids['stateOrProvinceName'];
    _shortNames['stateOrProvinceName'] = 'ST';
    _shortNames['O'] = oids['organizationName'];
    _shortNames['organizationName'] = 'O';
    _shortNames['OU'] = oids['organizationalUnitName'];
    _shortNames['organizationalUnitName'] = 'OU';
    _shortNames['E'] = oids['emailAddress'];
    _shortNames['emailAddress'] = 'E';
    var publicKeyValidator = forge.pki.rsa.publicKeyValidator;
    var x509CertificateValidator = {
      name: 'Certificate',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'Certificate.TBSCertificate',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: 'tbsCertificate',
        value: [{
          name: 'Certificate.TBSCertificate.version',
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 0,
          constructed: true,
          optional: true,
          value: [{
            name: 'Certificate.TBSCertificate.version.integer',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.INTEGER,
            constructed: false,
            capture: 'certVersion'
          }]
        }, {
          name: 'Certificate.TBSCertificate.serialNumber',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          capture: 'certSerialNumber'
        }, {
          name: 'Certificate.TBSCertificate.signature',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: 'Certificate.TBSCertificate.signature.algorithm',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: 'certinfoSignatureOid'
          }, {
            name: 'Certificate.TBSCertificate.signature.parameters',
            tagClass: asn1.Class.UNIVERSAL,
            optional: true,
            captureAsn1: 'certinfoSignatureParams'
          }]
        }, {
          name: 'Certificate.TBSCertificate.issuer',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: 'certIssuer'
        }, {
          name: 'Certificate.TBSCertificate.validity',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: 'Certificate.TBSCertificate.validity.notBefore (utc)',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.UTCTIME,
            constructed: false,
            optional: true,
            capture: 'certValidity1UTCTime'
          }, {
            name: 'Certificate.TBSCertificate.validity.notBefore (generalized)',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.GENERALIZEDTIME,
            constructed: false,
            optional: true,
            capture: 'certValidity2GeneralizedTime'
          }, {
            name: 'Certificate.TBSCertificate.validity.notAfter (utc)',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.UTCTIME,
            constructed: false,
            optional: true,
            capture: 'certValidity3UTCTime'
          }, {
            name: 'Certificate.TBSCertificate.validity.notAfter (generalized)',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.GENERALIZEDTIME,
            constructed: false,
            optional: true,
            capture: 'certValidity4GeneralizedTime'
          }]
        }, {
          name: 'Certificate.TBSCertificate.subject',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          captureAsn1: 'certSubject'
        }, publicKeyValidator, {
          name: 'Certificate.TBSCertificate.issuerUniqueID',
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 1,
          constructed: true,
          optional: true,
          value: [{
            name: 'Certificate.TBSCertificate.issuerUniqueID.id',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            capture: 'certIssuerUniqueId'
          }]
        }, {
          name: 'Certificate.TBSCertificate.subjectUniqueID',
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 2,
          constructed: true,
          optional: true,
          value: [{
            name: 'Certificate.TBSCertificate.subjectUniqueID.id',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.BITSTRING,
            constructed: false,
            capture: 'certSubjectUniqueId'
          }]
        }, {
          name: 'Certificate.TBSCertificate.extensions',
          tagClass: asn1.Class.CONTEXT_SPECIFIC,
          type: 3,
          constructed: true,
          captureAsn1: 'certExtensions',
          optional: true
        }]
      }, {
        name: 'Certificate.signatureAlgorithm',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'Certificate.signatureAlgorithm.algorithm',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'certSignatureOid'
        }, {
          name: 'Certificate.TBSCertificate.signature.parameters',
          tagClass: asn1.Class.UNIVERSAL,
          optional: true,
          captureAsn1: 'certSignatureParams'
        }]
      }, {
        name: 'Certificate.signatureValue',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        capture: 'certSignature'
      }]
    };
    var rsassaPssParameterValidator = {
      name: 'rsapss',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'rsapss.hashAlgorithm',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: true,
        value: [{
          name: 'rsapss.hashAlgorithm.AlgorithmIdentifier',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Class.SEQUENCE,
          constructed: true,
          optional: true,
          value: [{
            name: 'rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: 'hashOid'
          }]
        }]
      }, {
        name: 'rsapss.maskGenAlgorithm',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 1,
        constructed: true,
        value: [{
          name: 'rsapss.maskGenAlgorithm.AlgorithmIdentifier',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Class.SEQUENCE,
          constructed: true,
          optional: true,
          value: [{
            name: 'rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false,
            capture: 'maskGenOid'
          }, {
            name: 'rsapss.maskGenAlgorithm.AlgorithmIdentifier.params',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              name: 'rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm',
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: 'maskGenHashOid'
            }]
          }]
        }]
      }, {
        name: 'rsapss.saltLength',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 2,
        optional: true,
        value: [{
          name: 'rsapss.saltLength.saltLength',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Class.INTEGER,
          constructed: false,
          capture: 'saltLength'
        }]
      }, {
        name: 'rsapss.trailerField',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 3,
        optional: true,
        value: [{
          name: 'rsapss.trailer.trailer',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Class.INTEGER,
          constructed: false,
          capture: 'trailer'
        }]
      }]
    };
    var certificationRequestInfoValidator = {
      name: 'CertificationRequestInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      captureAsn1: 'certificationRequestInfo',
      value: [{
        name: 'CertificationRequestInfo.integer',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'certificationRequestInfoVersion'
      }, {
        name: 'CertificationRequestInfo.subject',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        captureAsn1: 'certificationRequestInfoSubject'
      }, publicKeyValidator, {
        name: 'CertificationRequestInfo.attributes',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        type: 0,
        constructed: true,
        optional: true,
        capture: 'certificationRequestInfoAttributes',
        value: [{
          name: 'CertificationRequestInfo.attributes',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: 'CertificationRequestInfo.attributes.type',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OID,
            constructed: false
          }, {
            name: 'CertificationRequestInfo.attributes.value',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SET,
            constructed: true
          }]
        }]
      }]
    };
    var certificationRequestValidator = {
      name: 'CertificationRequest',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      captureAsn1: 'csr',
      value: [certificationRequestInfoValidator, {
        name: 'CertificationRequest.signatureAlgorithm',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        value: [{
          name: 'CertificationRequest.signatureAlgorithm.algorithm',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OID,
          constructed: false,
          capture: 'csrSignatureOid'
        }, {
          name: 'CertificationRequest.signatureAlgorithm.parameters',
          tagClass: asn1.Class.UNIVERSAL,
          optional: true,
          captureAsn1: 'csrSignatureParams'
        }]
      }, {
        name: 'CertificationRequest.signature',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.BITSTRING,
        constructed: false,
        capture: 'csrSignature'
      }]
    };
    pki.RDNAttributesAsArray = function(rdn, md) {
      var rval = [];
      var set,
          attr,
          obj;
      for (var si = 0; si < rdn.value.length; ++si) {
        set = rdn.value[si];
        for (var i = 0; i < set.value.length; ++i) {
          obj = {};
          attr = set.value[i];
          obj.type = asn1.derToOid(attr.value[0].value);
          obj.value = attr.value[1].value;
          obj.valueTagClass = attr.value[1].type;
          if (obj.type in oids) {
            obj.name = oids[obj.type];
            if (obj.name in _shortNames) {
              obj.shortName = _shortNames[obj.name];
            }
          }
          if (md) {
            md.update(obj.type);
            md.update(obj.value);
          }
          rval.push(obj);
        }
      }
      return rval;
    };
    pki.CRIAttributesAsArray = function(attributes) {
      var rval = [];
      for (var si = 0; si < attributes.length; ++si) {
        var seq = attributes[si];
        var type = asn1.derToOid(seq.value[0].value);
        var values = seq.value[1].value;
        for (var vi = 0; vi < values.length; ++vi) {
          var obj = {};
          obj.type = type;
          obj.value = values[vi].value;
          obj.valueTagClass = values[vi].type;
          if (obj.type in oids) {
            obj.name = oids[obj.type];
            if (obj.name in _shortNames) {
              obj.shortName = _shortNames[obj.name];
            }
          }
          if (obj.type === oids.extensionRequest) {
            obj.extensions = [];
            for (var ei = 0; ei < obj.value.length; ++ei) {
              obj.extensions.push(pki.certificateExtensionFromAsn1(obj.value[ei]));
            }
          }
          rval.push(obj);
        }
      }
      return rval;
    };
    function _getAttribute(obj, options) {
      if (typeof options === 'string') {
        options = {shortName: options};
      }
      var rval = null;
      var attr;
      for (var i = 0; rval === null && i < obj.attributes.length; ++i) {
        attr = obj.attributes[i];
        if (options.type && options.type === attr.type) {
          rval = attr;
        } else if (options.name && options.name === attr.name) {
          rval = attr;
        } else if (options.shortName && options.shortName === attr.shortName) {
          rval = attr;
        }
      }
      return rval;
    }
    var _readSignatureParameters = function(oid, obj, fillDefaults) {
      var params = {};
      if (oid !== oids['RSASSA-PSS']) {
        return params;
      }
      if (fillDefaults) {
        params = {
          hash: {algorithmOid: oids['sha1']},
          mgf: {
            algorithmOid: oids['mgf1'],
            hash: {algorithmOid: oids['sha1']}
          },
          saltLength: 20
        };
      }
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, rsassaPssParameterValidator, capture, errors)) {
        var error = new Error('Cannot read RSASSA-PSS parameter block.');
        error.errors = errors;
        throw error;
      }
      if (capture.hashOid !== undefined) {
        params.hash = params.hash || {};
        params.hash.algorithmOid = asn1.derToOid(capture.hashOid);
      }
      if (capture.maskGenOid !== undefined) {
        params.mgf = params.mgf || {};
        params.mgf.algorithmOid = asn1.derToOid(capture.maskGenOid);
        params.mgf.hash = params.mgf.hash || {};
        params.mgf.hash.algorithmOid = asn1.derToOid(capture.maskGenHashOid);
      }
      if (capture.saltLength !== undefined) {
        params.saltLength = capture.saltLength.charCodeAt(0);
      }
      return params;
    };
    pki.certificateFromPem = function(pem, computeHash, strict) {
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== 'CERTIFICATE' && msg.type !== 'X509 CERTIFICATE' && msg.type !== 'TRUSTED CERTIFICATE') {
        var error = new Error('Could not convert certificate from PEM; PEM header type ' + 'is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
        error.headerType = msg.type;
        throw error;
      }
      if (msg.procType && msg.procType.type === 'ENCRYPTED') {
        throw new Error('Could not convert certificate from PEM; PEM is encrypted.');
      }
      var obj = asn1.fromDer(msg.body, strict);
      return pki.certificateFromAsn1(obj, computeHash);
    };
    pki.certificateToPem = function(cert, maxline) {
      var msg = {
        type: 'CERTIFICATE',
        body: asn1.toDer(pki.certificateToAsn1(cert)).getBytes()
      };
      return forge.pem.encode(msg, {maxline: maxline});
    };
    pki.publicKeyFromPem = function(pem) {
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== 'PUBLIC KEY' && msg.type !== 'RSA PUBLIC KEY') {
        var error = new Error('Could not convert public key from PEM; PEM header ' + 'type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
        error.headerType = msg.type;
        throw error;
      }
      if (msg.procType && msg.procType.type === 'ENCRYPTED') {
        throw new Error('Could not convert public key from PEM; PEM is encrypted.');
      }
      var obj = asn1.fromDer(msg.body);
      return pki.publicKeyFromAsn1(obj);
    };
    pki.publicKeyToPem = function(key, maxline) {
      var msg = {
        type: 'PUBLIC KEY',
        body: asn1.toDer(pki.publicKeyToAsn1(key)).getBytes()
      };
      return forge.pem.encode(msg, {maxline: maxline});
    };
    pki.publicKeyToRSAPublicKeyPem = function(key, maxline) {
      var msg = {
        type: 'RSA PUBLIC KEY',
        body: asn1.toDer(pki.publicKeyToRSAPublicKey(key)).getBytes()
      };
      return forge.pem.encode(msg, {maxline: maxline});
    };
    pki.getPublicKeyFingerprint = function(key, options) {
      options = options || {};
      var md = options.md || forge.md.sha1.create();
      var type = options.type || 'RSAPublicKey';
      var bytes;
      switch (type) {
        case 'RSAPublicKey':
          bytes = asn1.toDer(pki.publicKeyToRSAPublicKey(key)).getBytes();
          break;
        case 'SubjectPublicKeyInfo':
          bytes = asn1.toDer(pki.publicKeyToAsn1(key)).getBytes();
          break;
        default:
          throw new Error('Unknown fingerprint type "' + options.type + '".');
      }
      md.start();
      md.update(bytes);
      var digest = md.digest();
      if (options.encoding === 'hex') {
        var hex = digest.toHex();
        if (options.delimiter) {
          return hex.match(/.{2}/g).join(options.delimiter);
        }
        return hex;
      } else if (options.encoding === 'binary') {
        return digest.getBytes();
      } else if (options.encoding) {
        throw new Error('Unknown encoding "' + options.encoding + '".');
      }
      return digest;
    };
    pki.certificationRequestFromPem = function(pem, computeHash, strict) {
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== 'CERTIFICATE REQUEST') {
        var error = new Error('Could not convert certification request from PEM; ' + 'PEM header type is not "CERTIFICATE REQUEST".');
        error.headerType = msg.type;
        throw error;
      }
      if (msg.procType && msg.procType.type === 'ENCRYPTED') {
        throw new Error('Could not convert certification request from PEM; ' + 'PEM is encrypted.');
      }
      var obj = asn1.fromDer(msg.body, strict);
      return pki.certificationRequestFromAsn1(obj, computeHash);
    };
    pki.certificationRequestToPem = function(csr, maxline) {
      var msg = {
        type: 'CERTIFICATE REQUEST',
        body: asn1.toDer(pki.certificationRequestToAsn1(csr)).getBytes()
      };
      return forge.pem.encode(msg, {maxline: maxline});
    };
    pki.createCertificate = function() {
      var cert = {};
      cert.version = 0x02;
      cert.serialNumber = '00';
      cert.signatureOid = null;
      cert.signature = null;
      cert.siginfo = {};
      cert.siginfo.algorithmOid = null;
      cert.validity = {};
      cert.validity.notBefore = new Date();
      cert.validity.notAfter = new Date();
      cert.issuer = {};
      cert.issuer.getField = function(sn) {
        return _getAttribute(cert.issuer, sn);
      };
      cert.issuer.addField = function(attr) {
        _fillMissingFields([attr]);
        cert.issuer.attributes.push(attr);
      };
      cert.issuer.attributes = [];
      cert.issuer.hash = null;
      cert.subject = {};
      cert.subject.getField = function(sn) {
        return _getAttribute(cert.subject, sn);
      };
      cert.subject.addField = function(attr) {
        _fillMissingFields([attr]);
        cert.subject.attributes.push(attr);
      };
      cert.subject.attributes = [];
      cert.subject.hash = null;
      cert.extensions = [];
      cert.publicKey = null;
      cert.md = null;
      cert.setSubject = function(attrs, uniqueId) {
        _fillMissingFields(attrs);
        cert.subject.attributes = attrs;
        delete cert.subject.uniqueId;
        if (uniqueId) {
          cert.subject.uniqueId = uniqueId;
        }
        cert.subject.hash = null;
      };
      cert.setIssuer = function(attrs, uniqueId) {
        _fillMissingFields(attrs);
        cert.issuer.attributes = attrs;
        delete cert.issuer.uniqueId;
        if (uniqueId) {
          cert.issuer.uniqueId = uniqueId;
        }
        cert.issuer.hash = null;
      };
      cert.setExtensions = function(exts) {
        for (var i = 0; i < exts.length; ++i) {
          _fillMissingExtensionFields(exts[i], {cert: cert});
        }
        cert.extensions = exts;
      };
      cert.getExtension = function(options) {
        if (typeof options === 'string') {
          options = {name: options};
        }
        var rval = null;
        var ext;
        for (var i = 0; rval === null && i < cert.extensions.length; ++i) {
          ext = cert.extensions[i];
          if (options.id && ext.id === options.id) {
            rval = ext;
          } else if (options.name && ext.name === options.name) {
            rval = ext;
          }
        }
        return rval;
      };
      cert.sign = function(key, md) {
        cert.md = md || forge.md.sha1.create();
        var algorithmOid = oids[cert.md.algorithm + 'WithRSAEncryption'];
        if (!algorithmOid) {
          var error = new Error('Could not compute certificate digest. ' + 'Unknown message digest algorithm OID.');
          error.algorithm = cert.md.algorithm;
          throw error;
        }
        cert.signatureOid = cert.siginfo.algorithmOid = algorithmOid;
        cert.tbsCertificate = pki.getTBSCertificate(cert);
        var bytes = asn1.toDer(cert.tbsCertificate);
        cert.md.update(bytes.getBytes());
        cert.signature = key.sign(cert.md);
      };
      cert.verify = function(child) {
        var rval = false;
        if (!cert.issued(child)) {
          var issuer = child.issuer;
          var subject = cert.subject;
          var error = new Error('The parent certificate did not issue the given child ' + 'certificate; the child certificate\'s issuer does not match the ' + 'parent\'s subject.');
          error.expectedIssuer = issuer.attributes;
          error.actualIssuer = subject.attributes;
          throw error;
        }
        var md = child.md;
        if (md === null) {
          if (child.signatureOid in oids) {
            var oid = oids[child.signatureOid];
            switch (oid) {
              case 'sha1WithRSAEncryption':
                md = forge.md.sha1.create();
                break;
              case 'md5WithRSAEncryption':
                md = forge.md.md5.create();
                break;
              case 'sha256WithRSAEncryption':
                md = forge.md.sha256.create();
                break;
              case 'RSASSA-PSS':
                md = forge.md.sha256.create();
                break;
            }
          }
          if (md === null) {
            var error = new Error('Could not compute certificate digest. ' + 'Unknown signature OID.');
            error.signatureOid = child.signatureOid;
            throw error;
          }
          var tbsCertificate = child.tbsCertificate || pki.getTBSCertificate(child);
          var bytes = asn1.toDer(tbsCertificate);
          md.update(bytes.getBytes());
        }
        if (md !== null) {
          var scheme;
          switch (child.signatureOid) {
            case oids.sha1WithRSAEncryption:
              scheme = undefined;
              break;
            case oids['RSASSA-PSS']:
              var hash,
                  mgf;
              hash = oids[child.signatureParameters.mgf.hash.algorithmOid];
              if (hash === undefined || forge.md[hash] === undefined) {
                var error = new Error('Unsupported MGF hash function.');
                error.oid = child.signatureParameters.mgf.hash.algorithmOid;
                error.name = hash;
                throw error;
              }
              mgf = oids[child.signatureParameters.mgf.algorithmOid];
              if (mgf === undefined || forge.mgf[mgf] === undefined) {
                var error = new Error('Unsupported MGF function.');
                error.oid = child.signatureParameters.mgf.algorithmOid;
                error.name = mgf;
                throw error;
              }
              mgf = forge.mgf[mgf].create(forge.md[hash].create());
              hash = oids[child.signatureParameters.hash.algorithmOid];
              if (hash === undefined || forge.md[hash] === undefined) {
                throw {
                  message: 'Unsupported RSASSA-PSS hash function.',
                  oid: child.signatureParameters.hash.algorithmOid,
                  name: hash
                };
              }
              scheme = forge.pss.create(forge.md[hash].create(), mgf, child.signatureParameters.saltLength);
              break;
          }
          rval = cert.publicKey.verify(md.digest().getBytes(), child.signature, scheme);
        }
        return rval;
      };
      cert.isIssuer = function(parent) {
        var rval = false;
        var i = cert.issuer;
        var s = parent.subject;
        if (i.hash && s.hash) {
          rval = (i.hash === s.hash);
        } else if (i.attributes.length === s.attributes.length) {
          rval = true;
          var iattr,
              sattr;
          for (var n = 0; rval && n < i.attributes.length; ++n) {
            iattr = i.attributes[n];
            sattr = s.attributes[n];
            if (iattr.type !== sattr.type || iattr.value !== sattr.value) {
              rval = false;
            }
          }
        }
        return rval;
      };
      cert.issued = function(child) {
        return child.isIssuer(cert);
      };
      cert.generateSubjectKeyIdentifier = function() {
        return pki.getPublicKeyFingerprint(cert.publicKey, {type: 'RSAPublicKey'});
      };
      cert.verifySubjectKeyIdentifier = function() {
        var oid = oids['subjectKeyIdentifier'];
        for (var i = 0; i < cert.extensions.length; ++i) {
          var ext = cert.extensions[i];
          if (ext.id === oid) {
            var ski = cert.generateSubjectKeyIdentifier().getBytes();
            return (forge.util.hexToBytes(ext.subjectKeyIdentifier) === ski);
          }
        }
        return false;
      };
      return cert;
    };
    pki.certificateFromAsn1 = function(obj, computeHash) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, x509CertificateValidator, capture, errors)) {
        var error = new Error('Cannot read X.509 certificate. ' + 'ASN.1 object is not an X509v3 Certificate.');
        error.errors = errors;
        throw error;
      }
      if (typeof capture.certSignature !== 'string') {
        var certSignature = '\x00';
        for (var i = 0; i < capture.certSignature.length; ++i) {
          certSignature += asn1.toDer(capture.certSignature[i]).getBytes();
        }
        capture.certSignature = certSignature;
      }
      var oid = asn1.derToOid(capture.publicKeyOid);
      if (oid !== pki.oids['rsaEncryption']) {
        throw new Error('Cannot read public key. OID is not RSA.');
      }
      var cert = pki.createCertificate();
      cert.version = capture.certVersion ? capture.certVersion.charCodeAt(0) : 0;
      var serial = forge.util.createBuffer(capture.certSerialNumber);
      cert.serialNumber = serial.toHex();
      cert.signatureOid = forge.asn1.derToOid(capture.certSignatureOid);
      cert.signatureParameters = _readSignatureParameters(cert.signatureOid, capture.certSignatureParams, true);
      cert.siginfo.algorithmOid = forge.asn1.derToOid(capture.certinfoSignatureOid);
      cert.siginfo.parameters = _readSignatureParameters(cert.siginfo.algorithmOid, capture.certinfoSignatureParams, false);
      var signature = forge.util.createBuffer(capture.certSignature);
      ++signature.read;
      cert.signature = signature.getBytes();
      var validity = [];
      if (capture.certValidity1UTCTime !== undefined) {
        validity.push(asn1.utcTimeToDate(capture.certValidity1UTCTime));
      }
      if (capture.certValidity2GeneralizedTime !== undefined) {
        validity.push(asn1.generalizedTimeToDate(capture.certValidity2GeneralizedTime));
      }
      if (capture.certValidity3UTCTime !== undefined) {
        validity.push(asn1.utcTimeToDate(capture.certValidity3UTCTime));
      }
      if (capture.certValidity4GeneralizedTime !== undefined) {
        validity.push(asn1.generalizedTimeToDate(capture.certValidity4GeneralizedTime));
      }
      if (validity.length > 2) {
        throw new Error('Cannot read notBefore/notAfter validity times; more ' + 'than two times were provided in the certificate.');
      }
      if (validity.length < 2) {
        throw new Error('Cannot read notBefore/notAfter validity times; they ' + 'were not provided as either UTCTime or GeneralizedTime.');
      }
      cert.validity.notBefore = validity[0];
      cert.validity.notAfter = validity[1];
      cert.tbsCertificate = capture.tbsCertificate;
      if (computeHash) {
        cert.md = null;
        if (cert.signatureOid in oids) {
          var oid = oids[cert.signatureOid];
          switch (oid) {
            case 'sha1WithRSAEncryption':
              cert.md = forge.md.sha1.create();
              break;
            case 'md5WithRSAEncryption':
              cert.md = forge.md.md5.create();
              break;
            case 'sha256WithRSAEncryption':
              cert.md = forge.md.sha256.create();
              break;
            case 'RSASSA-PSS':
              cert.md = forge.md.sha256.create();
              break;
          }
        }
        if (cert.md === null) {
          var error = new Error('Could not compute certificate digest. ' + 'Unknown signature OID.');
          error.signatureOid = cert.signatureOid;
          throw error;
        }
        var bytes = asn1.toDer(cert.tbsCertificate);
        cert.md.update(bytes.getBytes());
      }
      var imd = forge.md.sha1.create();
      cert.issuer.getField = function(sn) {
        return _getAttribute(cert.issuer, sn);
      };
      cert.issuer.addField = function(attr) {
        _fillMissingFields([attr]);
        cert.issuer.attributes.push(attr);
      };
      cert.issuer.attributes = pki.RDNAttributesAsArray(capture.certIssuer, imd);
      if (capture.certIssuerUniqueId) {
        cert.issuer.uniqueId = capture.certIssuerUniqueId;
      }
      cert.issuer.hash = imd.digest().toHex();
      var smd = forge.md.sha1.create();
      cert.subject.getField = function(sn) {
        return _getAttribute(cert.subject, sn);
      };
      cert.subject.addField = function(attr) {
        _fillMissingFields([attr]);
        cert.subject.attributes.push(attr);
      };
      cert.subject.attributes = pki.RDNAttributesAsArray(capture.certSubject, smd);
      if (capture.certSubjectUniqueId) {
        cert.subject.uniqueId = capture.certSubjectUniqueId;
      }
      cert.subject.hash = smd.digest().toHex();
      if (capture.certExtensions) {
        cert.extensions = pki.certificateExtensionsFromAsn1(capture.certExtensions);
      } else {
        cert.extensions = [];
      }
      cert.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
      return cert;
    };
    pki.certificateExtensionsFromAsn1 = function(exts) {
      var rval = [];
      for (var i = 0; i < exts.value.length; ++i) {
        var extseq = exts.value[i];
        for (var ei = 0; ei < extseq.value.length; ++ei) {
          rval.push(pki.certificateExtensionFromAsn1(extseq.value[ei]));
        }
      }
      return rval;
    };
    pki.certificateExtensionFromAsn1 = function(ext) {
      var e = {};
      e.id = asn1.derToOid(ext.value[0].value);
      e.critical = false;
      if (ext.value[1].type === asn1.Type.BOOLEAN) {
        e.critical = (ext.value[1].value.charCodeAt(0) !== 0x00);
        e.value = ext.value[2].value;
      } else {
        e.value = ext.value[1].value;
      }
      if (e.id in oids) {
        e.name = oids[e.id];
        if (e.name === 'keyUsage') {
          var ev = asn1.fromDer(e.value);
          var b2 = 0x00;
          var b3 = 0x00;
          if (ev.value.length > 1) {
            b2 = ev.value.charCodeAt(1);
            b3 = ev.value.length > 2 ? ev.value.charCodeAt(2) : 0;
          }
          e.digitalSignature = (b2 & 0x80) === 0x80;
          e.nonRepudiation = (b2 & 0x40) === 0x40;
          e.keyEncipherment = (b2 & 0x20) === 0x20;
          e.dataEncipherment = (b2 & 0x10) === 0x10;
          e.keyAgreement = (b2 & 0x08) === 0x08;
          e.keyCertSign = (b2 & 0x04) === 0x04;
          e.cRLSign = (b2 & 0x02) === 0x02;
          e.encipherOnly = (b2 & 0x01) === 0x01;
          e.decipherOnly = (b3 & 0x80) === 0x80;
        } else if (e.name === 'basicConstraints') {
          var ev = asn1.fromDer(e.value);
          if (ev.value.length > 0 && ev.value[0].type === asn1.Type.BOOLEAN) {
            e.cA = (ev.value[0].value.charCodeAt(0) !== 0x00);
          } else {
            e.cA = false;
          }
          var value = null;
          if (ev.value.length > 0 && ev.value[0].type === asn1.Type.INTEGER) {
            value = ev.value[0].value;
          } else if (ev.value.length > 1) {
            value = ev.value[1].value;
          }
          if (value !== null) {
            e.pathLenConstraint = asn1.derToInteger(value);
          }
        } else if (e.name === 'extKeyUsage') {
          var ev = asn1.fromDer(e.value);
          for (var vi = 0; vi < ev.value.length; ++vi) {
            var oid = asn1.derToOid(ev.value[vi].value);
            if (oid in oids) {
              e[oids[oid]] = true;
            } else {
              e[oid] = true;
            }
          }
        } else if (e.name === 'nsCertType') {
          var ev = asn1.fromDer(e.value);
          var b2 = 0x00;
          if (ev.value.length > 1) {
            b2 = ev.value.charCodeAt(1);
          }
          e.client = (b2 & 0x80) === 0x80;
          e.server = (b2 & 0x40) === 0x40;
          e.email = (b2 & 0x20) === 0x20;
          e.objsign = (b2 & 0x10) === 0x10;
          e.reserved = (b2 & 0x08) === 0x08;
          e.sslCA = (b2 & 0x04) === 0x04;
          e.emailCA = (b2 & 0x02) === 0x02;
          e.objCA = (b2 & 0x01) === 0x01;
        } else if (e.name === 'subjectAltName' || e.name === 'issuerAltName') {
          e.altNames = [];
          var gn;
          var ev = asn1.fromDer(e.value);
          for (var n = 0; n < ev.value.length; ++n) {
            gn = ev.value[n];
            var altName = {
              type: gn.type,
              value: gn.value
            };
            e.altNames.push(altName);
            switch (gn.type) {
              case 1:
              case 2:
              case 6:
                break;
              case 7:
                altName.ip = forge.util.bytesToIP(gn.value);
                break;
              case 8:
                altName.oid = asn1.derToOid(gn.value);
                break;
              default:
            }
          }
        } else if (e.name === 'subjectKeyIdentifier') {
          var ev = asn1.fromDer(e.value);
          e.subjectKeyIdentifier = forge.util.bytesToHex(ev.value);
        }
      }
      return e;
    };
    pki.certificationRequestFromAsn1 = function(obj, computeHash) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, certificationRequestValidator, capture, errors)) {
        var error = new Error('Cannot read PKCS#10 certificate request. ' + 'ASN.1 object is not a PKCS#10 CertificationRequest.');
        error.errors = errors;
        throw error;
      }
      if (typeof capture.csrSignature !== 'string') {
        var csrSignature = '\x00';
        for (var i = 0; i < capture.csrSignature.length; ++i) {
          csrSignature += asn1.toDer(capture.csrSignature[i]).getBytes();
        }
        capture.csrSignature = csrSignature;
      }
      var oid = asn1.derToOid(capture.publicKeyOid);
      if (oid !== pki.oids.rsaEncryption) {
        throw new Error('Cannot read public key. OID is not RSA.');
      }
      var csr = pki.createCertificationRequest();
      csr.version = capture.csrVersion ? capture.csrVersion.charCodeAt(0) : 0;
      csr.signatureOid = forge.asn1.derToOid(capture.csrSignatureOid);
      csr.signatureParameters = _readSignatureParameters(csr.signatureOid, capture.csrSignatureParams, true);
      csr.siginfo.algorithmOid = forge.asn1.derToOid(capture.csrSignatureOid);
      csr.siginfo.parameters = _readSignatureParameters(csr.siginfo.algorithmOid, capture.csrSignatureParams, false);
      var signature = forge.util.createBuffer(capture.csrSignature);
      ++signature.read;
      csr.signature = signature.getBytes();
      csr.certificationRequestInfo = capture.certificationRequestInfo;
      if (computeHash) {
        csr.md = null;
        if (csr.signatureOid in oids) {
          var oid = oids[csr.signatureOid];
          switch (oid) {
            case 'sha1WithRSAEncryption':
              csr.md = forge.md.sha1.create();
              break;
            case 'md5WithRSAEncryption':
              csr.md = forge.md.md5.create();
              break;
            case 'sha256WithRSAEncryption':
              csr.md = forge.md.sha256.create();
              break;
            case 'RSASSA-PSS':
              csr.md = forge.md.sha256.create();
              break;
          }
        }
        if (csr.md === null) {
          var error = new Error('Could not compute certification request digest. ' + 'Unknown signature OID.');
          error.signatureOid = csr.signatureOid;
          throw error;
        }
        var bytes = asn1.toDer(csr.certificationRequestInfo);
        csr.md.update(bytes.getBytes());
      }
      var smd = forge.md.sha1.create();
      csr.subject.getField = function(sn) {
        return _getAttribute(csr.subject, sn);
      };
      csr.subject.addField = function(attr) {
        _fillMissingFields([attr]);
        csr.subject.attributes.push(attr);
      };
      csr.subject.attributes = pki.RDNAttributesAsArray(capture.certificationRequestInfoSubject, smd);
      csr.subject.hash = smd.digest().toHex();
      csr.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
      csr.getAttribute = function(sn) {
        return _getAttribute(csr, sn);
      };
      csr.addAttribute = function(attr) {
        _fillMissingFields([attr]);
        csr.attributes.push(attr);
      };
      csr.attributes = pki.CRIAttributesAsArray(capture.certificationRequestInfoAttributes || []);
      return csr;
    };
    pki.createCertificationRequest = function() {
      var csr = {};
      csr.version = 0x00;
      csr.signatureOid = null;
      csr.signature = null;
      csr.siginfo = {};
      csr.siginfo.algorithmOid = null;
      csr.subject = {};
      csr.subject.getField = function(sn) {
        return _getAttribute(csr.subject, sn);
      };
      csr.subject.addField = function(attr) {
        _fillMissingFields([attr]);
        csr.subject.attributes.push(attr);
      };
      csr.subject.attributes = [];
      csr.subject.hash = null;
      csr.publicKey = null;
      csr.attributes = [];
      csr.getAttribute = function(sn) {
        return _getAttribute(csr, sn);
      };
      csr.addAttribute = function(attr) {
        _fillMissingFields([attr]);
        csr.attributes.push(attr);
      };
      csr.md = null;
      csr.setSubject = function(attrs) {
        _fillMissingFields(attrs);
        csr.subject.attributes = attrs;
        csr.subject.hash = null;
      };
      csr.setAttributes = function(attrs) {
        _fillMissingFields(attrs);
        csr.attributes = attrs;
      };
      csr.sign = function(key, md) {
        csr.md = md || forge.md.sha1.create();
        var algorithmOid = oids[csr.md.algorithm + 'WithRSAEncryption'];
        if (!algorithmOid) {
          var error = new Error('Could not compute certification request digest. ' + 'Unknown message digest algorithm OID.');
          error.algorithm = csr.md.algorithm;
          throw error;
        }
        csr.signatureOid = csr.siginfo.algorithmOid = algorithmOid;
        csr.certificationRequestInfo = pki.getCertificationRequestInfo(csr);
        var bytes = asn1.toDer(csr.certificationRequestInfo);
        csr.md.update(bytes.getBytes());
        csr.signature = key.sign(csr.md);
      };
      csr.verify = function() {
        var rval = false;
        var md = csr.md;
        if (md === null) {
          if (csr.signatureOid in oids) {
            var oid = oids[csr.signatureOid];
            switch (oid) {
              case 'sha1WithRSAEncryption':
                md = forge.md.sha1.create();
                break;
              case 'md5WithRSAEncryption':
                md = forge.md.md5.create();
                break;
              case 'sha256WithRSAEncryption':
                md = forge.md.sha256.create();
                break;
              case 'RSASSA-PSS':
                md = forge.md.sha256.create();
                break;
            }
          }
          if (md === null) {
            var error = new Error('Could not compute certification request digest. ' + 'Unknown signature OID.');
            error.signatureOid = csr.signatureOid;
            throw error;
          }
          var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
          var bytes = asn1.toDer(cri);
          md.update(bytes.getBytes());
        }
        if (md !== null) {
          var scheme;
          switch (csr.signatureOid) {
            case oids.sha1WithRSAEncryption:
              break;
            case oids['RSASSA-PSS']:
              var hash,
                  mgf;
              hash = oids[csr.signatureParameters.mgf.hash.algorithmOid];
              if (hash === undefined || forge.md[hash] === undefined) {
                var error = new Error('Unsupported MGF hash function.');
                error.oid = csr.signatureParameters.mgf.hash.algorithmOid;
                error.name = hash;
                throw error;
              }
              mgf = oids[csr.signatureParameters.mgf.algorithmOid];
              if (mgf === undefined || forge.mgf[mgf] === undefined) {
                var error = new Error('Unsupported MGF function.');
                error.oid = csr.signatureParameters.mgf.algorithmOid;
                error.name = mgf;
                throw error;
              }
              mgf = forge.mgf[mgf].create(forge.md[hash].create());
              hash = oids[csr.signatureParameters.hash.algorithmOid];
              if (hash === undefined || forge.md[hash] === undefined) {
                var error = new Error('Unsupported RSASSA-PSS hash function.');
                error.oid = csr.signatureParameters.hash.algorithmOid;
                error.name = hash;
                throw error;
              }
              scheme = forge.pss.create(forge.md[hash].create(), mgf, csr.signatureParameters.saltLength);
              break;
          }
          rval = csr.publicKey.verify(md.digest().getBytes(), csr.signature, scheme);
        }
        return rval;
      };
      return csr;
    };
    function _dnToAsn1(obj) {
      var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      var attr,
          set;
      var attrs = obj.attributes;
      for (var i = 0; i < attrs.length; ++i) {
        attr = attrs[i];
        var value = attr.value;
        var valueTagClass = asn1.Type.PRINTABLESTRING;
        if ('valueTagClass' in attr) {
          valueTagClass = attr.valueTagClass;
          if (valueTagClass === asn1.Type.UTF8) {
            value = forge.util.encodeUtf8(value);
          }
        }
        set = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()), asn1.create(asn1.Class.UNIVERSAL, valueTagClass, false, value)])]);
        rval.value.push(set);
      }
      return rval;
    }
    function _getAttributesAsJson(attrs) {
      var rval = {};
      for (var i = 0; i < attrs.length; ++i) {
        var attr = attrs[i];
        if (attr.shortName && (attr.valueTagClass === asn1.Type.UTF8 || attr.valueTagClass === asn1.Type.PRINTABLESTRING || attr.valueTagClass === asn1.Type.IA5STRING)) {
          var value = attr.value;
          if (attr.valueTagClass === asn1.Type.UTF8) {
            value = forge.util.encodeUtf8(attr.value);
          }
          if (!(attr.shortName in rval)) {
            rval[attr.shortName] = value;
          } else if (forge.util.isArray(rval[attr.shortName])) {
            rval[attr.shortName].push(value);
          } else {
            rval[attr.shortName] = [rval[attr.shortName], value];
          }
        }
      }
      return rval;
    }
    function _fillMissingFields(attrs) {
      var attr;
      for (var i = 0; i < attrs.length; ++i) {
        attr = attrs[i];
        if (typeof attr.name === 'undefined') {
          if (attr.type && attr.type in pki.oids) {
            attr.name = pki.oids[attr.type];
          } else if (attr.shortName && attr.shortName in _shortNames) {
            attr.name = pki.oids[_shortNames[attr.shortName]];
          }
        }
        if (typeof attr.type === 'undefined') {
          if (attr.name && attr.name in pki.oids) {
            attr.type = pki.oids[attr.name];
          } else {
            var error = new Error('Attribute type not specified.');
            error.attribute = attr;
            throw error;
          }
        }
        if (typeof attr.shortName === 'undefined') {
          if (attr.name && attr.name in _shortNames) {
            attr.shortName = _shortNames[attr.name];
          }
        }
        if (attr.type === oids.extensionRequest) {
          attr.valueConstructed = true;
          attr.valueTagClass = asn1.Type.SEQUENCE;
          if (!attr.value && attr.extensions) {
            attr.value = [];
            for (var ei = 0; ei < attr.extensions.length; ++ei) {
              attr.value.push(pki.certificateExtensionToAsn1(_fillMissingExtensionFields(attr.extensions[ei])));
            }
          }
        }
        if (typeof attr.value === 'undefined') {
          var error = new Error('Attribute value not specified.');
          error.attribute = attr;
          throw error;
        }
      }
    }
    function _fillMissingExtensionFields(e, options) {
      options = options || {};
      if (typeof e.name === 'undefined') {
        if (e.id && e.id in pki.oids) {
          e.name = pki.oids[e.id];
        }
      }
      if (typeof e.id === 'undefined') {
        if (e.name && e.name in pki.oids) {
          e.id = pki.oids[e.name];
        } else {
          var error = new Error('Extension ID not specified.');
          error.extension = e;
          throw error;
        }
      }
      if (typeof e.value !== 'undefined') {
        return ;
      }
      if (e.name === 'keyUsage') {
        var unused = 0;
        var b2 = 0x00;
        var b3 = 0x00;
        if (e.digitalSignature) {
          b2 |= 0x80;
          unused = 7;
        }
        if (e.nonRepudiation) {
          b2 |= 0x40;
          unused = 6;
        }
        if (e.keyEncipherment) {
          b2 |= 0x20;
          unused = 5;
        }
        if (e.dataEncipherment) {
          b2 |= 0x10;
          unused = 4;
        }
        if (e.keyAgreement) {
          b2 |= 0x08;
          unused = 3;
        }
        if (e.keyCertSign) {
          b2 |= 0x04;
          unused = 2;
        }
        if (e.cRLSign) {
          b2 |= 0x02;
          unused = 1;
        }
        if (e.encipherOnly) {
          b2 |= 0x01;
          unused = 0;
        }
        if (e.decipherOnly) {
          b3 |= 0x80;
          unused = 7;
        }
        var value = String.fromCharCode(unused);
        if (b3 !== 0) {
          value += String.fromCharCode(b2) + String.fromCharCode(b3);
        } else if (b2 !== 0) {
          value += String.fromCharCode(b2);
        }
        e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, value);
      } else if (e.name === 'basicConstraints') {
        e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
        if (e.cA) {
          e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, false, String.fromCharCode(0xFF)));
        }
        if ('pathLenConstraint' in e) {
          e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(e.pathLenConstraint).getBytes()));
        }
      } else if (e.name === 'extKeyUsage') {
        e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
        var seq = e.value.value;
        for (var key in e) {
          if (e[key] !== true) {
            continue;
          }
          if (key in oids) {
            seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids[key]).getBytes()));
          } else if (key.indexOf('.') !== -1) {
            seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(key).getBytes()));
          }
        }
      } else if (e.name === 'nsCertType') {
        var unused = 0;
        var b2 = 0x00;
        if (e.client) {
          b2 |= 0x80;
          unused = 7;
        }
        if (e.server) {
          b2 |= 0x40;
          unused = 6;
        }
        if (e.email) {
          b2 |= 0x20;
          unused = 5;
        }
        if (e.objsign) {
          b2 |= 0x10;
          unused = 4;
        }
        if (e.reserved) {
          b2 |= 0x08;
          unused = 3;
        }
        if (e.sslCA) {
          b2 |= 0x04;
          unused = 2;
        }
        if (e.emailCA) {
          b2 |= 0x02;
          unused = 1;
        }
        if (e.objCA) {
          b2 |= 0x01;
          unused = 0;
        }
        var value = String.fromCharCode(unused);
        if (b2 !== 0) {
          value += String.fromCharCode(b2);
        }
        e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, value);
      } else if (e.name === 'subjectAltName' || e.name === 'issuerAltName') {
        e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
        var altName;
        for (var n = 0; n < e.altNames.length; ++n) {
          altName = e.altNames[n];
          var value = altName.value;
          if (altName.type === 7 && altName.ip) {
            value = forge.util.bytesFromIP(altName.ip);
            if (value === null) {
              var error = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.');
              error.extension = e;
              throw error;
            }
          } else if (altName.type === 8) {
            if (altName.oid) {
              value = asn1.oidToDer(asn1.oidToDer(altName.oid));
            } else {
              value = asn1.oidToDer(value);
            }
          }
          e.value.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, false, value));
        }
      } else if (e.name === 'subjectKeyIdentifier' && options.cert) {
        var ski = options.cert.generateSubjectKeyIdentifier();
        e.subjectKeyIdentifier = ski.toHex();
        e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ski.getBytes());
      }
      if (typeof e.value === 'undefined') {
        var error = new Error('Extension value not specified.');
        error.extension = e;
        throw error;
      }
      return e;
    }
    function _signatureParametersToAsn1(oid, params) {
      switch (oid) {
        case oids['RSASSA-PSS']:
          var parts = [];
          if (params.hash.algorithmOid !== undefined) {
            parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.hash.algorithmOid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')])]));
          }
          if (params.mgf.algorithmOid !== undefined) {
            parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.mgf.algorithmOid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.mgf.hash.algorithmOid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')])])]));
          }
          if (params.saltLength !== undefined) {
            parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(params.saltLength).getBytes())]));
          }
          return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, parts);
        default:
          return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '');
      }
    }
    function _CRIAttributesToAsn1(csr) {
      var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
      if (csr.attributes.length === 0) {
        return rval;
      }
      var attrs = csr.attributes;
      for (var i = 0; i < attrs.length; ++i) {
        var attr = attrs[i];
        var value = attr.value;
        var valueTagClass = asn1.Type.UTF8;
        if ('valueTagClass' in attr) {
          valueTagClass = attr.valueTagClass;
        }
        if (valueTagClass === asn1.Type.UTF8) {
          value = forge.util.encodeUtf8(value);
        }
        var valueConstructed = false;
        if ('valueConstructed' in attr) {
          valueConstructed = attr.valueConstructed;
        }
        var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [asn1.create(asn1.Class.UNIVERSAL, valueTagClass, valueConstructed, value)])]);
        rval.value.push(seq);
      }
      return rval;
    }
    pki.getTBSCertificate = function(cert) {
      var tbs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(cert.version).getBytes())]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(cert.serialNumber)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(cert.siginfo.algorithmOid).getBytes()), _signatureParametersToAsn1(cert.siginfo.algorithmOid, cert.siginfo.parameters)]), _dnToAsn1(cert.issuer), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false, asn1.dateToUtcTime(cert.validity.notBefore)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false, asn1.dateToUtcTime(cert.validity.notAfter))]), _dnToAsn1(cert.subject), pki.publicKeyToAsn1(cert.publicKey)]);
      if (cert.issuer.uniqueId) {
        tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0x00) + cert.issuer.uniqueId)]));
      }
      if (cert.subject.uniqueId) {
        tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0x00) + cert.subject.uniqueId)]));
      }
      if (cert.extensions.length > 0) {
        tbs.value.push(pki.certificateExtensionsToAsn1(cert.extensions));
      }
      return tbs;
    };
    pki.getCertificationRequestInfo = function(csr) {
      var cri = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(csr.version).getBytes()), _dnToAsn1(csr.subject), pki.publicKeyToAsn1(csr.publicKey), _CRIAttributesToAsn1(csr)]);
      return cri;
    };
    pki.distinguishedNameToAsn1 = function(dn) {
      return _dnToAsn1(dn);
    };
    pki.certificateToAsn1 = function(cert) {
      var tbsCertificate = cert.tbsCertificate || pki.getTBSCertificate(cert);
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [tbsCertificate, asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(cert.signatureOid).getBytes()), _signatureParametersToAsn1(cert.signatureOid, cert.signatureParameters)]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0x00) + cert.signature)]);
    };
    pki.certificateExtensionsToAsn1 = function(exts) {
      var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, true, []);
      var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      rval.value.push(seq);
      for (var i = 0; i < exts.length; ++i) {
        seq.value.push(pki.certificateExtensionToAsn1(exts[i]));
      }
      return rval;
    };
    pki.certificateExtensionToAsn1 = function(ext) {
      var extseq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
      extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(ext.id).getBytes()));
      if (ext.critical) {
        extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, false, String.fromCharCode(0xFF)));
      }
      var value = ext.value;
      if (typeof ext.value !== 'string') {
        value = asn1.toDer(value).getBytes();
      }
      extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, value));
      return extseq;
    };
    pki.certificationRequestToAsn1 = function(csr) {
      var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [cri, asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(csr.signatureOid).getBytes()), _signatureParametersToAsn1(csr.signatureOid, csr.signatureParameters)]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0x00) + csr.signature)]);
    };
    pki.createCaStore = function(certs) {
      var caStore = {certs: {}};
      caStore.getIssuer = function(cert) {
        var rval = getBySubject(cert.issuer);
        return rval;
      };
      caStore.addCertificate = function(cert) {
        if (typeof cert === 'string') {
          cert = forge.pki.certificateFromPem(cert);
        }
        if (!cert.subject.hash) {
          var md = forge.md.sha1.create();
          cert.subject.attributes = pki.RDNAttributesAsArray(_dnToAsn1(cert.subject), md);
          cert.subject.hash = md.digest().toHex();
        }
        if (cert.subject.hash in caStore.certs) {
          var tmp = caStore.certs[cert.subject.hash];
          if (!forge.util.isArray(tmp)) {
            tmp = [tmp];
          }
          tmp.push(cert);
        } else {
          caStore.certs[cert.subject.hash] = cert;
        }
      };
      caStore.hasCertificate = function(cert) {
        var match = getBySubject(cert.subject);
        if (!match) {
          return false;
        }
        if (!forge.util.isArray(match)) {
          match = [match];
        }
        var der1 = asn1.toDer(pki.certificateToAsn1(cert)).getBytes();
        for (var i = 0; i < match.length; ++i) {
          var der2 = asn1.toDer(pki.certificateToAsn1(match[i])).getBytes();
          if (der1 === der2) {
            return true;
          }
        }
        return false;
      };
      function getBySubject(subject) {
        if (!subject.hash) {
          var md = forge.md.sha1.create();
          subject.attributes = pki.RDNAttributesAsArray(_dnToAsn1(subject), md);
          subject.hash = md.digest().toHex();
        }
        return caStore.certs[subject.hash] || null;
      }
      if (certs) {
        for (var i = 0; i < certs.length; ++i) {
          var cert = certs[i];
          caStore.addCertificate(cert);
        }
      }
      return caStore;
    };
    pki.certificateError = {
      bad_certificate: 'forge.pki.BadCertificate',
      unsupported_certificate: 'forge.pki.UnsupportedCertificate',
      certificate_revoked: 'forge.pki.CertificateRevoked',
      certificate_expired: 'forge.pki.CertificateExpired',
      certificate_unknown: 'forge.pki.CertificateUnknown',
      unknown_ca: 'forge.pki.UnknownCertificateAuthority'
    };
    pki.verifyCertificateChain = function(caStore, chain, verify) {
      chain = chain.slice(0);
      var certs = chain.slice(0);
      var now = new Date();
      var first = true;
      var error = null;
      var depth = 0;
      do {
        var cert = chain.shift();
        var parent = null;
        var selfSigned = false;
        if (now < cert.validity.notBefore || now > cert.validity.notAfter) {
          error = {
            message: 'Certificate is not valid yet or has expired.',
            error: pki.certificateError.certificate_expired,
            notBefore: cert.validity.notBefore,
            notAfter: cert.validity.notAfter,
            now: now
          };
        }
        if (error === null) {
          parent = chain[0] || caStore.getIssuer(cert);
          if (parent === null) {
            if (cert.isIssuer(cert)) {
              selfSigned = true;
              parent = cert;
            }
          }
          if (parent) {
            var parents = parent;
            if (!forge.util.isArray(parents)) {
              parents = [parents];
            }
            var verified = false;
            while (!verified && parents.length > 0) {
              parent = parents.shift();
              try {
                verified = parent.verify(cert);
              } catch (ex) {}
            }
            if (!verified) {
              error = {
                message: 'Certificate signature is invalid.',
                error: pki.certificateError.bad_certificate
              };
            }
          }
          if (error === null && (!parent || selfSigned) && !caStore.hasCertificate(cert)) {
            error = {
              message: 'Certificate is not trusted.',
              error: pki.certificateError.unknown_ca
            };
          }
        }
        if (error === null && parent && !cert.isIssuer(parent)) {
          error = {
            message: 'Certificate issuer is invalid.',
            error: pki.certificateError.bad_certificate
          };
        }
        if (error === null) {
          var se = {
            keyUsage: true,
            basicConstraints: true
          };
          for (var i = 0; error === null && i < cert.extensions.length; ++i) {
            var ext = cert.extensions[i];
            if (ext.critical && !(ext.name in se)) {
              error = {
                message: 'Certificate has an unsupported critical extension.',
                error: pki.certificateError.unsupported_certificate
              };
            }
          }
        }
        if (error === null && (!first || (chain.length === 0 && (!parent || selfSigned)))) {
          var bcExt = cert.getExtension('basicConstraints');
          var keyUsageExt = cert.getExtension('keyUsage');
          if (keyUsageExt !== null) {
            if (!keyUsageExt.keyCertSign || bcExt === null) {
              error = {
                message: 'Certificate keyUsage or basicConstraints conflict ' + 'or indicate that the certificate is not a CA. ' + 'If the certificate is the only one in the chain or ' + 'isn\'t the first then the certificate must be a ' + 'valid CA.',
                error: pki.certificateError.bad_certificate
              };
            }
          }
          if (error === null && bcExt !== null && !bcExt.cA) {
            error = {
              message: 'Certificate basicConstraints indicates the certificate ' + 'is not a CA.',
              error: pki.certificateError.bad_certificate
            };
          }
          if (error === null && keyUsageExt !== null && 'pathLenConstraint' in bcExt) {
            var pathLen = depth - 1;
            if (pathLen > bcExt.pathLenConstraint) {
              error = {
                message: 'Certificate basicConstraints pathLenConstraint violated.',
                error: pki.certificateError.bad_certificate
              };
            }
          }
        }
        var vfd = (error === null) ? true : error.error;
        var ret = verify ? verify(vfd, depth, certs) : vfd;
        if (ret === true) {
          error = null;
        } else {
          if (vfd === true) {
            error = {
              message: 'The application rejected the certificate.',
              error: pki.certificateError.bad_certificate
            };
          }
          if (ret || ret === 0) {
            if (typeof ret === 'object' && !forge.util.isArray(ret)) {
              if (ret.message) {
                error.message = ret.message;
              }
              if (ret.error) {
                error.error = ret.error;
              }
            } else if (typeof ret === 'string') {
              error.error = ret;
            }
          }
          throw error;
        }
        first = false;
        ++depth;
      } while (chain.length > 0);
      return true;
    };
  }
  var name = 'x509';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge.pki;
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/x509", ["npm:node-forge@0.6.26/js/aes", "npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/des", "npm:node-forge@0.6.26/js/md", "npm:node-forge@0.6.26/js/mgf", "npm:node-forge@0.6.26/js/oids", "npm:node-forge@0.6.26/js/pem", "npm:node-forge@0.6.26/js/pss", "npm:node-forge@0.6.26/js/rsa", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/aes'), __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/des'), __require('npm:node-forge@0.6.26/js/md'), __require('npm:node-forge@0.6.26/js/mgf'), __require('npm:node-forge@0.6.26/js/oids'), __require('npm:node-forge@0.6.26/js/pem'), __require('npm:node-forge@0.6.26/js/pss'), __require('npm:node-forge@0.6.26/js/rsa'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var asn1 = forge.asn1;
    var pki = forge.pki;
    var p12 = forge.pkcs12 = forge.pkcs12 || {};
    var contentInfoValidator = {
      name: 'ContentInfo',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'ContentInfo.contentType',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: 'contentType'
      }, {
        name: 'ContentInfo.content',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        constructed: true,
        captureAsn1: 'content'
      }]
    };
    var pfxValidator = {
      name: 'PFX',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'PFX.version',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.INTEGER,
        constructed: false,
        capture: 'version'
      }, contentInfoValidator, {
        name: 'PFX.macData',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SEQUENCE,
        constructed: true,
        optional: true,
        captureAsn1: 'mac',
        value: [{
          name: 'PFX.macData.mac',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.SEQUENCE,
          constructed: true,
          value: [{
            name: 'PFX.macData.mac.digestAlgorithm',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.SEQUENCE,
            constructed: true,
            value: [{
              name: 'PFX.macData.mac.digestAlgorithm.algorithm',
              tagClass: asn1.Class.UNIVERSAL,
              type: asn1.Type.OID,
              constructed: false,
              capture: 'macAlgorithm'
            }, {
              name: 'PFX.macData.mac.digestAlgorithm.parameters',
              tagClass: asn1.Class.UNIVERSAL,
              captureAsn1: 'macAlgorithmParameters'
            }]
          }, {
            name: 'PFX.macData.mac.digest',
            tagClass: asn1.Class.UNIVERSAL,
            type: asn1.Type.OCTETSTRING,
            constructed: false,
            capture: 'macDigest'
          }]
        }, {
          name: 'PFX.macData.macSalt',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.OCTETSTRING,
          constructed: false,
          capture: 'macSalt'
        }, {
          name: 'PFX.macData.iterations',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Type.INTEGER,
          constructed: false,
          optional: true,
          capture: 'macIterations'
        }]
      }]
    };
    var safeBagValidator = {
      name: 'SafeBag',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'SafeBag.bagId',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: 'bagId'
      }, {
        name: 'SafeBag.bagValue',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        constructed: true,
        captureAsn1: 'bagValue'
      }, {
        name: 'SafeBag.bagAttributes',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        constructed: true,
        optional: true,
        capture: 'bagAttributes'
      }]
    };
    var attributeValidator = {
      name: 'Attribute',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'Attribute.attrId',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: 'oid'
      }, {
        name: 'Attribute.attrValues',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.SET,
        constructed: true,
        capture: 'values'
      }]
    };
    var certBagValidator = {
      name: 'CertBag',
      tagClass: asn1.Class.UNIVERSAL,
      type: asn1.Type.SEQUENCE,
      constructed: true,
      value: [{
        name: 'CertBag.certId',
        tagClass: asn1.Class.UNIVERSAL,
        type: asn1.Type.OID,
        constructed: false,
        capture: 'certId'
      }, {
        name: 'CertBag.certValue',
        tagClass: asn1.Class.CONTEXT_SPECIFIC,
        constructed: true,
        value: [{
          name: 'CertBag.certValue[0]',
          tagClass: asn1.Class.UNIVERSAL,
          type: asn1.Class.OCTETSTRING,
          constructed: false,
          capture: 'cert'
        }]
      }]
    };
    function _getBagsByAttribute(safeContents, attrName, attrValue, bagType) {
      var result = [];
      for (var i = 0; i < safeContents.length; i++) {
        for (var j = 0; j < safeContents[i].safeBags.length; j++) {
          var bag = safeContents[i].safeBags[j];
          if (bagType !== undefined && bag.type !== bagType) {
            continue;
          }
          if (attrName === null) {
            result.push(bag);
            continue;
          }
          if (bag.attributes[attrName] !== undefined && bag.attributes[attrName].indexOf(attrValue) >= 0) {
            result.push(bag);
          }
        }
      }
      return result;
    }
    p12.pkcs12FromAsn1 = function(obj, strict, password) {
      if (typeof strict === 'string') {
        password = strict;
        strict = true;
      } else if (strict === undefined) {
        strict = true;
      }
      var capture = {};
      var errors = [];
      if (!asn1.validate(obj, pfxValidator, capture, errors)) {
        var error = new Error('Cannot read PKCS#12 PFX. ' + 'ASN.1 object is not an PKCS#12 PFX.');
        error.errors = error;
        throw error;
      }
      var pfx = {
        version: capture.version.charCodeAt(0),
        safeContents: [],
        getBags: function(filter) {
          var rval = {};
          var localKeyId;
          if ('localKeyId' in filter) {
            localKeyId = filter.localKeyId;
          } else if ('localKeyIdHex' in filter) {
            localKeyId = forge.util.hexToBytes(filter.localKeyIdHex);
          }
          if (localKeyId === undefined && !('friendlyName' in filter) && 'bagType' in filter) {
            rval[filter.bagType] = _getBagsByAttribute(pfx.safeContents, null, null, filter.bagType);
          }
          if (localKeyId !== undefined) {
            rval.localKeyId = _getBagsByAttribute(pfx.safeContents, 'localKeyId', localKeyId, filter.bagType);
          }
          if ('friendlyName' in filter) {
            rval.friendlyName = _getBagsByAttribute(pfx.safeContents, 'friendlyName', filter.friendlyName, filter.bagType);
          }
          return rval;
        },
        getBagsByFriendlyName: function(friendlyName, bagType) {
          return _getBagsByAttribute(pfx.safeContents, 'friendlyName', friendlyName, bagType);
        },
        getBagsByLocalKeyId: function(localKeyId, bagType) {
          return _getBagsByAttribute(pfx.safeContents, 'localKeyId', localKeyId, bagType);
        }
      };
      if (capture.version.charCodeAt(0) !== 3) {
        var error = new Error('PKCS#12 PFX of version other than 3 not supported.');
        error.version = capture.version.charCodeAt(0);
        throw error;
      }
      if (asn1.derToOid(capture.contentType) !== pki.oids.data) {
        var error = new Error('Only PKCS#12 PFX in password integrity mode supported.');
        error.oid = asn1.derToOid(capture.contentType);
        throw error;
      }
      var data = capture.content.value[0];
      if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) {
        throw new Error('PKCS#12 authSafe content data is not an OCTET STRING.');
      }
      data = _decodePkcs7Data(data);
      if (capture.mac) {
        var md = null;
        var macKeyBytes = 0;
        var macAlgorithm = asn1.derToOid(capture.macAlgorithm);
        switch (macAlgorithm) {
          case pki.oids.sha1:
            md = forge.md.sha1.create();
            macKeyBytes = 20;
            break;
          case pki.oids.sha256:
            md = forge.md.sha256.create();
            macKeyBytes = 32;
            break;
          case pki.oids.sha384:
            md = forge.md.sha384.create();
            macKeyBytes = 48;
            break;
          case pki.oids.sha512:
            md = forge.md.sha512.create();
            macKeyBytes = 64;
            break;
          case pki.oids.md5:
            md = forge.md.md5.create();
            macKeyBytes = 16;
            break;
        }
        if (md === null) {
          throw new Error('PKCS#12 uses unsupported MAC algorithm: ' + macAlgorithm);
        }
        var macSalt = new forge.util.ByteBuffer(capture.macSalt);
        var macIterations = (('macIterations' in capture) ? parseInt(forge.util.bytesToHex(capture.macIterations), 16) : 1);
        var macKey = p12.generateKey(password, macSalt, 3, macIterations, macKeyBytes, md);
        var mac = forge.hmac.create();
        mac.start(md, macKey);
        mac.update(data.value);
        var macValue = mac.getMac();
        if (macValue.getBytes() !== capture.macDigest) {
          throw new Error('PKCS#12 MAC could not be verified. Invalid password?');
        }
      }
      _decodeAuthenticatedSafe(pfx, data.value, strict, password);
      return pfx;
    };
    function _decodePkcs7Data(data) {
      if (data.composed || data.constructed) {
        var value = forge.util.createBuffer();
        for (var i = 0; i < data.value.length; ++i) {
          value.putBytes(data.value[i].value);
        }
        data.composed = data.constructed = false;
        data.value = value.getBytes();
      }
      return data;
    }
    function _decodeAuthenticatedSafe(pfx, authSafe, strict, password) {
      authSafe = asn1.fromDer(authSafe, strict);
      if (authSafe.tagClass !== asn1.Class.UNIVERSAL || authSafe.type !== asn1.Type.SEQUENCE || authSafe.constructed !== true) {
        throw new Error('PKCS#12 AuthenticatedSafe expected to be a ' + 'SEQUENCE OF ContentInfo');
      }
      for (var i = 0; i < authSafe.value.length; i++) {
        var contentInfo = authSafe.value[i];
        var capture = {};
        var errors = [];
        if (!asn1.validate(contentInfo, contentInfoValidator, capture, errors)) {
          var error = new Error('Cannot read ContentInfo.');
          error.errors = errors;
          throw error;
        }
        var obj = {encrypted: false};
        var safeContents = null;
        var data = capture.content.value[0];
        switch (asn1.derToOid(capture.contentType)) {
          case pki.oids.data:
            if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) {
              throw new Error('PKCS#12 SafeContents Data is not an OCTET STRING.');
            }
            safeContents = _decodePkcs7Data(data).value;
            break;
          case pki.oids.encryptedData:
            safeContents = _decryptSafeContents(data, password);
            obj.encrypted = true;
            break;
          default:
            var error = new Error('Unsupported PKCS#12 contentType.');
            error.contentType = asn1.derToOid(capture.contentType);
            throw error;
        }
        obj.safeBags = _decodeSafeContents(safeContents, strict, password);
        pfx.safeContents.push(obj);
      }
    }
    function _decryptSafeContents(data, password) {
      var capture = {};
      var errors = [];
      if (!asn1.validate(data, forge.pkcs7.asn1.encryptedDataValidator, capture, errors)) {
        var error = new Error('Cannot read EncryptedContentInfo.');
        error.errors = errors;
        throw error;
      }
      var oid = asn1.derToOid(capture.contentType);
      if (oid !== pki.oids.data) {
        var error = new Error('PKCS#12 EncryptedContentInfo ContentType is not Data.');
        error.oid = oid;
        throw error;
      }
      oid = asn1.derToOid(capture.encAlgorithm);
      var cipher = pki.pbe.getCipher(oid, capture.encParameter, password);
      var encryptedContentAsn1 = _decodePkcs7Data(capture.encryptedContentAsn1);
      var encrypted = forge.util.createBuffer(encryptedContentAsn1.value);
      cipher.update(encrypted);
      if (!cipher.finish()) {
        throw new Error('Failed to decrypt PKCS#12 SafeContents.');
      }
      return cipher.output.getBytes();
    }
    function _decodeSafeContents(safeContents, strict, password) {
      if (!strict && safeContents.length === 0) {
        return [];
      }
      safeContents = asn1.fromDer(safeContents, strict);
      if (safeContents.tagClass !== asn1.Class.UNIVERSAL || safeContents.type !== asn1.Type.SEQUENCE || safeContents.constructed !== true) {
        throw new Error('PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.');
      }
      var res = [];
      for (var i = 0; i < safeContents.value.length; i++) {
        var safeBag = safeContents.value[i];
        var capture = {};
        var errors = [];
        if (!asn1.validate(safeBag, safeBagValidator, capture, errors)) {
          var error = new Error('Cannot read SafeBag.');
          error.errors = errors;
          throw error;
        }
        var bag = {
          type: asn1.derToOid(capture.bagId),
          attributes: _decodeBagAttributes(capture.bagAttributes)
        };
        res.push(bag);
        var validator,
            decoder;
        var bagAsn1 = capture.bagValue.value[0];
        switch (bag.type) {
          case pki.oids.pkcs8ShroudedKeyBag:
            bagAsn1 = pki.decryptPrivateKeyInfo(bagAsn1, password);
            if (bagAsn1 === null) {
              throw new Error('Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?');
            }
          case pki.oids.keyBag:
            try {
              bag.key = pki.privateKeyFromAsn1(bagAsn1);
            } catch (e) {
              bag.key = null;
              bag.asn1 = bagAsn1;
            }
            continue;
          case pki.oids.certBag:
            validator = certBagValidator;
            decoder = function() {
              if (asn1.derToOid(capture.certId) !== pki.oids.x509Certificate) {
                var error = new Error('Unsupported certificate type, only X.509 supported.');
                error.oid = asn1.derToOid(capture.certId);
                throw error;
              }
              var certAsn1 = asn1.fromDer(capture.cert, strict);
              try {
                bag.cert = pki.certificateFromAsn1(certAsn1, true);
              } catch (e) {
                bag.cert = null;
                bag.asn1 = certAsn1;
              }
            };
            break;
          default:
            var error = new Error('Unsupported PKCS#12 SafeBag type.');
            error.oid = bag.type;
            throw error;
        }
        if (validator !== undefined && !asn1.validate(bagAsn1, validator, capture, errors)) {
          var error = new Error('Cannot read PKCS#12 ' + validator.name);
          error.errors = errors;
          throw error;
        }
        decoder();
      }
      return res;
    }
    function _decodeBagAttributes(attributes) {
      var decodedAttrs = {};
      if (attributes !== undefined) {
        for (var i = 0; i < attributes.length; ++i) {
          var capture = {};
          var errors = [];
          if (!asn1.validate(attributes[i], attributeValidator, capture, errors)) {
            var error = new Error('Cannot read PKCS#12 BagAttribute.');
            error.errors = errors;
            throw error;
          }
          var oid = asn1.derToOid(capture.oid);
          if (pki.oids[oid] === undefined) {
            continue;
          }
          decodedAttrs[pki.oids[oid]] = [];
          for (var j = 0; j < capture.values.length; ++j) {
            decodedAttrs[pki.oids[oid]].push(capture.values[j].value);
          }
        }
      }
      return decodedAttrs;
    }
    p12.toPkcs12Asn1 = function(key, cert, password, options) {
      options = options || {};
      options.saltSize = options.saltSize || 8;
      options.count = options.count || 2048;
      options.algorithm = options.algorithm || options.encAlgorithm || 'aes128';
      if (!('useMac' in options)) {
        options.useMac = true;
      }
      if (!('localKeyId' in options)) {
        options.localKeyId = null;
      }
      if (!('generateLocalKeyId' in options)) {
        options.generateLocalKeyId = true;
      }
      var localKeyId = options.localKeyId;
      var bagAttrs;
      if (localKeyId !== null) {
        localKeyId = forge.util.hexToBytes(localKeyId);
      } else if (options.generateLocalKeyId) {
        if (cert) {
          var pairedCert = forge.util.isArray(cert) ? cert[0] : cert;
          if (typeof pairedCert === 'string') {
            pairedCert = pki.certificateFromPem(pairedCert);
          }
          var sha1 = forge.md.sha1.create();
          sha1.update(asn1.toDer(pki.certificateToAsn1(pairedCert)).getBytes());
          localKeyId = sha1.digest().getBytes();
        } else {
          localKeyId = forge.random.getBytes(20);
        }
      }
      var attrs = [];
      if (localKeyId !== null) {
        attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.localKeyId).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, localKeyId)])]));
      }
      if ('friendlyName' in options) {
        attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.friendlyName).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BMPSTRING, false, options.friendlyName)])]));
      }
      if (attrs.length > 0) {
        bagAttrs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, attrs);
      }
      var contents = [];
      var chain = [];
      if (cert !== null) {
        if (forge.util.isArray(cert)) {
          chain = cert;
        } else {
          chain = [cert];
        }
      }
      var certSafeBags = [];
      for (var i = 0; i < chain.length; ++i) {
        cert = chain[i];
        if (typeof cert === 'string') {
          cert = pki.certificateFromPem(cert);
        }
        var certBagAttrs = (i === 0) ? bagAttrs : undefined;
        var certAsn1 = pki.certificateToAsn1(cert);
        var certSafeBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.certBag).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.x509Certificate).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(certAsn1).getBytes())])])]), certBagAttrs]);
        certSafeBags.push(certSafeBag);
      }
      if (certSafeBags.length > 0) {
        var certSafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, certSafeBags);
        var certCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(certSafeContents).getBytes())])]);
        contents.push(certCI);
      }
      var keyBag = null;
      if (key !== null) {
        var pkAsn1 = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(key));
        if (password === null) {
          keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.keyBag).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [pkAsn1]), bagAttrs]);
        } else {
          keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.pkcs8ShroudedKeyBag).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [pki.encryptPrivateKeyInfo(pkAsn1, password, options)]), bagAttrs]);
        }
        var keySafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [keyBag]);
        var keyCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(keySafeContents).getBytes())])]);
        contents.push(keyCI);
      }
      var safe = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, contents);
      var macData;
      if (options.useMac) {
        var sha1 = forge.md.sha1.create();
        var macSalt = new forge.util.ByteBuffer(forge.random.getBytes(options.saltSize));
        var count = options.count;
        var key = p12.generateKey(password, macSalt, 3, count, 20);
        var mac = forge.hmac.create();
        mac.start(sha1, key);
        mac.update(asn1.toDer(safe).getBytes());
        var macValue = mac.getMac();
        macData = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.sha1).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, macValue.getBytes())]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, macSalt.getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(count).getBytes())]);
      }
      return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(3).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(safe).getBytes())])]), macData]);
    };
    p12.generateKey = forge.pbe.generatePkcs12Key;
  }
  var name = 'pkcs12';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pkcs12", ["npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/hmac", "npm:node-forge@0.6.26/js/oids", "npm:node-forge@0.6.26/js/pkcs7asn1", "npm:node-forge@0.6.26/js/pbe", "npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/rsa", "npm:node-forge@0.6.26/js/sha1", "npm:node-forge@0.6.26/js/util", "npm:node-forge@0.6.26/js/x509"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/hmac'), __require('npm:node-forge@0.6.26/js/oids'), __require('npm:node-forge@0.6.26/js/pkcs7asn1'), __require('npm:node-forge@0.6.26/js/pbe'), __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/rsa'), __require('npm:node-forge@0.6.26/js/sha1'), __require('npm:node-forge@0.6.26/js/util'), __require('npm:node-forge@0.6.26/js/x509'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var asn1 = forge.asn1;
    var pki = forge.pki = forge.pki || {};
    pki.pemToDer = function(pem) {
      var msg = forge.pem.decode(pem)[0];
      if (msg.procType && msg.procType.type === 'ENCRYPTED') {
        throw new Error('Could not convert PEM to DER; PEM is encrypted.');
      }
      return forge.util.createBuffer(msg.body);
    };
    pki.privateKeyFromPem = function(pem) {
      var msg = forge.pem.decode(pem)[0];
      if (msg.type !== 'PRIVATE KEY' && msg.type !== 'RSA PRIVATE KEY') {
        var error = new Error('Could not convert private key from PEM; PEM ' + 'header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".');
        error.headerType = msg.type;
        throw error;
      }
      if (msg.procType && msg.procType.type === 'ENCRYPTED') {
        throw new Error('Could not convert private key from PEM; PEM is encrypted.');
      }
      var obj = asn1.fromDer(msg.body);
      return pki.privateKeyFromAsn1(obj);
    };
    pki.privateKeyToPem = function(key, maxline) {
      var msg = {
        type: 'RSA PRIVATE KEY',
        body: asn1.toDer(pki.privateKeyToAsn1(key)).getBytes()
      };
      return forge.pem.encode(msg, {maxline: maxline});
    };
    pki.privateKeyInfoToPem = function(pki, maxline) {
      var msg = {
        type: 'PRIVATE KEY',
        body: asn1.toDer(pki).getBytes()
      };
      return forge.pem.encode(msg, {maxline: maxline});
    };
  }
  var name = 'pki';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/pki", ["npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/oids", "npm:node-forge@0.6.26/js/pbe", "npm:node-forge@0.6.26/js/pem", "npm:node-forge@0.6.26/js/pbkdf2", "npm:node-forge@0.6.26/js/pkcs12", "npm:node-forge@0.6.26/js/pss", "npm:node-forge@0.6.26/js/rsa", "npm:node-forge@0.6.26/js/util", "npm:node-forge@0.6.26/js/x509"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/oids'), __require('npm:node-forge@0.6.26/js/pbe'), __require('npm:node-forge@0.6.26/js/pem'), __require('npm:node-forge@0.6.26/js/pbkdf2'), __require('npm:node-forge@0.6.26/js/pkcs12'), __require('npm:node-forge@0.6.26/js/pss'), __require('npm:node-forge@0.6.26/js/rsa'), __require('npm:node-forge@0.6.26/js/util'), __require('npm:node-forge@0.6.26/js/x509'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var prf_TLS1 = function(secret, label, seed, length) {
      var rval = forge.util.createBuffer();
      var idx = (secret.length >> 1);
      var slen = idx + (secret.length & 1);
      var s1 = secret.substr(0, slen);
      var s2 = secret.substr(idx, slen);
      var ai = forge.util.createBuffer();
      var hmac = forge.hmac.create();
      seed = label + seed;
      var md5itr = Math.ceil(length / 16);
      var sha1itr = Math.ceil(length / 20);
      hmac.start('MD5', s1);
      var md5bytes = forge.util.createBuffer();
      ai.putBytes(seed);
      for (var i = 0; i < md5itr; ++i) {
        hmac.start(null, null);
        hmac.update(ai.getBytes());
        ai.putBuffer(hmac.digest());
        hmac.start(null, null);
        hmac.update(ai.bytes() + seed);
        md5bytes.putBuffer(hmac.digest());
      }
      hmac.start('SHA1', s2);
      var sha1bytes = forge.util.createBuffer();
      ai.clear();
      ai.putBytes(seed);
      for (var i = 0; i < sha1itr; ++i) {
        hmac.start(null, null);
        hmac.update(ai.getBytes());
        ai.putBuffer(hmac.digest());
        hmac.start(null, null);
        hmac.update(ai.bytes() + seed);
        sha1bytes.putBuffer(hmac.digest());
      }
      rval.putBytes(forge.util.xorBytes(md5bytes.getBytes(), sha1bytes.getBytes(), length));
      return rval;
    };
    var prf_sha256 = function(secret, label, seed, length) {};
    var hmac_sha1 = function(key, seqNum, record) {
      var hmac = forge.hmac.create();
      hmac.start('SHA1', key);
      var b = forge.util.createBuffer();
      b.putInt32(seqNum[0]);
      b.putInt32(seqNum[1]);
      b.putByte(record.type);
      b.putByte(record.version.major);
      b.putByte(record.version.minor);
      b.putInt16(record.length);
      b.putBytes(record.fragment.bytes());
      hmac.update(b.getBytes());
      return hmac.digest().getBytes();
    };
    var deflate = function(c, record, s) {
      var rval = false;
      try {
        var bytes = c.deflate(record.fragment.getBytes());
        record.fragment = forge.util.createBuffer(bytes);
        record.length = bytes.length;
        rval = true;
      } catch (ex) {}
      return rval;
    };
    var inflate = function(c, record, s) {
      var rval = false;
      try {
        var bytes = c.inflate(record.fragment.getBytes());
        record.fragment = forge.util.createBuffer(bytes);
        record.length = bytes.length;
        rval = true;
      } catch (ex) {}
      return rval;
    };
    var readVector = function(b, lenBytes) {
      var len = 0;
      switch (lenBytes) {
        case 1:
          len = b.getByte();
          break;
        case 2:
          len = b.getInt16();
          break;
        case 3:
          len = b.getInt24();
          break;
        case 4:
          len = b.getInt32();
          break;
      }
      return forge.util.createBuffer(b.getBytes(len));
    };
    var writeVector = function(b, lenBytes, v) {
      b.putInt(v.length(), lenBytes << 3);
      b.putBuffer(v);
    };
    var tls = {};
    tls.Versions = {
      TLS_1_0: {
        major: 3,
        minor: 1
      },
      TLS_1_1: {
        major: 3,
        minor: 2
      },
      TLS_1_2: {
        major: 3,
        minor: 3
      }
    };
    tls.SupportedVersions = [tls.Versions.TLS_1_1, tls.Versions.TLS_1_0];
    tls.Version = tls.SupportedVersions[0];
    tls.MaxFragment = 16384 - 1024;
    tls.ConnectionEnd = {
      server: 0,
      client: 1
    };
    tls.PRFAlgorithm = {tls_prf_sha256: 0};
    tls.BulkCipherAlgorithm = {
      none: null,
      rc4: 0,
      des3: 1,
      aes: 2
    };
    tls.CipherType = {
      stream: 0,
      block: 1,
      aead: 2
    };
    tls.MACAlgorithm = {
      none: null,
      hmac_md5: 0,
      hmac_sha1: 1,
      hmac_sha256: 2,
      hmac_sha384: 3,
      hmac_sha512: 4
    };
    tls.CompressionMethod = {
      none: 0,
      deflate: 1
    };
    tls.ContentType = {
      change_cipher_spec: 20,
      alert: 21,
      handshake: 22,
      application_data: 23,
      heartbeat: 24
    };
    tls.HandshakeType = {
      hello_request: 0,
      client_hello: 1,
      server_hello: 2,
      certificate: 11,
      server_key_exchange: 12,
      certificate_request: 13,
      server_hello_done: 14,
      certificate_verify: 15,
      client_key_exchange: 16,
      finished: 20
    };
    tls.Alert = {};
    tls.Alert.Level = {
      warning: 1,
      fatal: 2
    };
    tls.Alert.Description = {
      close_notify: 0,
      unexpected_message: 10,
      bad_record_mac: 20,
      decryption_failed: 21,
      record_overflow: 22,
      decompression_failure: 30,
      handshake_failure: 40,
      bad_certificate: 42,
      unsupported_certificate: 43,
      certificate_revoked: 44,
      certificate_expired: 45,
      certificate_unknown: 46,
      illegal_parameter: 47,
      unknown_ca: 48,
      access_denied: 49,
      decode_error: 50,
      decrypt_error: 51,
      export_restriction: 60,
      protocol_version: 70,
      insufficient_security: 71,
      internal_error: 80,
      user_canceled: 90,
      no_renegotiation: 100
    };
    tls.HeartbeatMessageType = {
      heartbeat_request: 1,
      heartbeat_response: 2
    };
    tls.CipherSuites = {};
    tls.getCipherSuite = function(twoBytes) {
      var rval = null;
      for (var key in tls.CipherSuites) {
        var cs = tls.CipherSuites[key];
        if (cs.id[0] === twoBytes.charCodeAt(0) && cs.id[1] === twoBytes.charCodeAt(1)) {
          rval = cs;
          break;
        }
      }
      return rval;
    };
    tls.handleUnexpected = function(c, record) {
      var ignore = (!c.open && c.entity === tls.ConnectionEnd.client);
      if (!ignore) {
        c.error(c, {
          message: 'Unexpected message. Received TLS record out of order.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.unexpected_message
          }
        });
      }
    };
    tls.handleHelloRequest = function(c, record, length) {
      if (!c.handshaking && c.handshakes > 0) {
        tls.queue(c, tls.createAlert(c, {
          level: tls.Alert.Level.warning,
          description: tls.Alert.Description.no_renegotiation
        }));
        tls.flush(c);
      }
      c.process();
    };
    tls.parseHelloMessage = function(c, record, length) {
      var msg = null;
      var client = (c.entity === tls.ConnectionEnd.client);
      if (length < 38) {
        c.error(c, {
          message: client ? 'Invalid ServerHello message. Message too short.' : 'Invalid ClientHello message. Message too short.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.illegal_parameter
          }
        });
      } else {
        var b = record.fragment;
        var remaining = b.length();
        msg = {
          version: {
            major: b.getByte(),
            minor: b.getByte()
          },
          random: forge.util.createBuffer(b.getBytes(32)),
          session_id: readVector(b, 1),
          extensions: []
        };
        if (client) {
          msg.cipher_suite = b.getBytes(2);
          msg.compression_method = b.getByte();
        } else {
          msg.cipher_suites = readVector(b, 2);
          msg.compression_methods = readVector(b, 1);
        }
        remaining = length - (remaining - b.length());
        if (remaining > 0) {
          var exts = readVector(b, 2);
          while (exts.length() > 0) {
            msg.extensions.push({
              type: [exts.getByte(), exts.getByte()],
              data: readVector(exts, 2)
            });
          }
          if (!client) {
            for (var i = 0; i < msg.extensions.length; ++i) {
              var ext = msg.extensions[i];
              if (ext.type[0] === 0x00 && ext.type[1] === 0x00) {
                var snl = readVector(ext.data, 2);
                while (snl.length() > 0) {
                  var snType = snl.getByte();
                  if (snType !== 0x00) {
                    break;
                  }
                  c.session.extensions.server_name.serverNameList.push(readVector(snl, 2).getBytes());
                }
              }
            }
          }
        }
        if (c.session.version) {
          if (msg.version.major !== c.session.version.major || msg.version.minor !== c.session.version.minor) {
            return c.error(c, {
              message: 'TLS version change is disallowed during renegotiation.',
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.protocol_version
              }
            });
          }
        }
        if (client) {
          c.session.cipherSuite = tls.getCipherSuite(msg.cipher_suite);
        } else {
          var tmp = forge.util.createBuffer(msg.cipher_suites.bytes());
          while (tmp.length() > 0) {
            c.session.cipherSuite = tls.getCipherSuite(tmp.getBytes(2));
            if (c.session.cipherSuite !== null) {
              break;
            }
          }
        }
        if (c.session.cipherSuite === null) {
          return c.error(c, {
            message: 'No cipher suites in common.',
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.handshake_failure
            },
            cipherSuite: forge.util.bytesToHex(msg.cipher_suite)
          });
        }
        if (client) {
          c.session.compressionMethod = msg.compression_method;
        } else {
          c.session.compressionMethod = tls.CompressionMethod.none;
        }
      }
      return msg;
    };
    tls.createSecurityParameters = function(c, msg) {
      var client = (c.entity === tls.ConnectionEnd.client);
      var msgRandom = msg.random.bytes();
      var cRandom = client ? c.session.sp.client_random : msgRandom;
      var sRandom = client ? msgRandom : tls.createRandom().getBytes();
      c.session.sp = {
        entity: c.entity,
        prf_algorithm: tls.PRFAlgorithm.tls_prf_sha256,
        bulk_cipher_algorithm: null,
        cipher_type: null,
        enc_key_length: null,
        block_length: null,
        fixed_iv_length: null,
        record_iv_length: null,
        mac_algorithm: null,
        mac_length: null,
        mac_key_length: null,
        compression_algorithm: c.session.compressionMethod,
        pre_master_secret: null,
        master_secret: null,
        client_random: cRandom,
        server_random: sRandom
      };
    };
    tls.handleServerHello = function(c, record, length) {
      var msg = tls.parseHelloMessage(c, record, length);
      if (c.fail) {
        return ;
      }
      if (msg.version.minor <= c.version.minor) {
        c.version.minor = msg.version.minor;
      } else {
        return c.error(c, {
          message: 'Incompatible TLS version.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.protocol_version
          }
        });
      }
      c.session.version = c.version;
      var sessionId = msg.session_id.bytes();
      if (sessionId.length > 0 && sessionId === c.session.id) {
        c.expect = SCC;
        c.session.resuming = true;
        c.session.sp.server_random = msg.random.bytes();
      } else {
        c.expect = SCE;
        c.session.resuming = false;
        tls.createSecurityParameters(c, msg);
      }
      c.session.id = sessionId;
      c.process();
    };
    tls.handleClientHello = function(c, record, length) {
      var msg = tls.parseHelloMessage(c, record, length);
      if (c.fail) {
        return ;
      }
      var sessionId = msg.session_id.bytes();
      var session = null;
      if (c.sessionCache) {
        session = c.sessionCache.getSession(sessionId);
        if (session === null) {
          sessionId = '';
        } else if (session.version.major !== msg.version.major || session.version.minor > msg.version.minor) {
          session = null;
          sessionId = '';
        }
      }
      if (sessionId.length === 0) {
        sessionId = forge.random.getBytes(32);
      }
      c.session.id = sessionId;
      c.session.clientHelloVersion = msg.version;
      c.session.sp = {};
      if (session) {
        c.version = c.session.version = session.version;
        c.session.sp = session.sp;
      } else {
        var version;
        for (var i = 1; i < tls.SupportedVersions.length; ++i) {
          version = tls.SupportedVersions[i];
          if (version.minor <= msg.version.minor) {
            break;
          }
        }
        c.version = {
          major: version.major,
          minor: version.minor
        };
        c.session.version = c.version;
      }
      if (session !== null) {
        c.expect = CCC;
        c.session.resuming = true;
        c.session.sp.client_random = msg.random.bytes();
      } else {
        c.expect = (c.verifyClient !== false) ? CCE : CKE;
        c.session.resuming = false;
        tls.createSecurityParameters(c, msg);
      }
      c.open = true;
      tls.queue(c, tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createServerHello(c)
      }));
      if (c.session.resuming) {
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.change_cipher_spec,
          data: tls.createChangeCipherSpec()
        }));
        c.state.pending = tls.createConnectionState(c);
        c.state.current.write = c.state.pending.write;
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createFinished(c)
        }));
      } else {
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createCertificate(c)
        }));
        if (!c.fail) {
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createServerKeyExchange(c)
          }));
          if (c.verifyClient !== false) {
            tls.queue(c, tls.createRecord(c, {
              type: tls.ContentType.handshake,
              data: tls.createCertificateRequest(c)
            }));
          }
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createServerHelloDone(c)
          }));
        }
      }
      tls.flush(c);
      c.process();
    };
    tls.handleCertificate = function(c, record, length) {
      if (length < 3) {
        return c.error(c, {
          message: 'Invalid Certificate message. Message too short.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.illegal_parameter
          }
        });
      }
      var b = record.fragment;
      var msg = {certificate_list: readVector(b, 3)};
      var cert,
          asn1;
      var certs = [];
      try {
        while (msg.certificate_list.length() > 0) {
          cert = readVector(msg.certificate_list, 3);
          asn1 = forge.asn1.fromDer(cert);
          cert = forge.pki.certificateFromAsn1(asn1, true);
          certs.push(cert);
        }
      } catch (ex) {
        return c.error(c, {
          message: 'Could not parse certificate list.',
          cause: ex,
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.bad_certificate
          }
        });
      }
      var client = (c.entity === tls.ConnectionEnd.client);
      if ((client || c.verifyClient === true) && certs.length === 0) {
        c.error(c, {
          message: client ? 'No server certificate provided.' : 'No client certificate provided.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.illegal_parameter
          }
        });
      } else if (certs.length === 0) {
        c.expect = client ? SKE : CKE;
      } else {
        if (client) {
          c.session.serverCertificate = certs[0];
        } else {
          c.session.clientCertificate = certs[0];
        }
        if (tls.verifyCertificateChain(c, certs)) {
          c.expect = client ? SKE : CKE;
        }
      }
      c.process();
    };
    tls.handleServerKeyExchange = function(c, record, length) {
      if (length > 0) {
        return c.error(c, {
          message: 'Invalid key parameters. Only RSA is supported.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.unsupported_certificate
          }
        });
      }
      c.expect = SCR;
      c.process();
    };
    tls.handleClientKeyExchange = function(c, record, length) {
      if (length < 48) {
        return c.error(c, {
          message: 'Invalid key parameters. Only RSA is supported.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.unsupported_certificate
          }
        });
      }
      var b = record.fragment;
      var msg = {enc_pre_master_secret: readVector(b, 2).getBytes()};
      var privateKey = null;
      if (c.getPrivateKey) {
        try {
          privateKey = c.getPrivateKey(c, c.session.serverCertificate);
          privateKey = forge.pki.privateKeyFromPem(privateKey);
        } catch (ex) {
          c.error(c, {
            message: 'Could not get private key.',
            cause: ex,
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.internal_error
            }
          });
        }
      }
      if (privateKey === null) {
        return c.error(c, {
          message: 'No private key set.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.internal_error
          }
        });
      }
      try {
        var sp = c.session.sp;
        sp.pre_master_secret = privateKey.decrypt(msg.enc_pre_master_secret);
        var version = c.session.clientHelloVersion;
        if (version.major !== sp.pre_master_secret.charCodeAt(0) || version.minor !== sp.pre_master_secret.charCodeAt(1)) {
          throw new Error('TLS version rollback attack detected.');
        }
      } catch (ex) {
        sp.pre_master_secret = forge.random.getBytes(48);
      }
      c.expect = CCC;
      if (c.session.clientCertificate !== null) {
        c.expect = CCV;
      }
      c.process();
    };
    tls.handleCertificateRequest = function(c, record, length) {
      if (length < 3) {
        return c.error(c, {
          message: 'Invalid CertificateRequest. Message too short.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.illegal_parameter
          }
        });
      }
      var b = record.fragment;
      var msg = {
        certificate_types: readVector(b, 1),
        certificate_authorities: readVector(b, 2)
      };
      c.session.certificateRequest = msg;
      c.expect = SHD;
      c.process();
    };
    tls.handleCertificateVerify = function(c, record, length) {
      if (length < 2) {
        return c.error(c, {
          message: 'Invalid CertificateVerify. Message too short.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.illegal_parameter
          }
        });
      }
      var b = record.fragment;
      b.read -= 4;
      var msgBytes = b.bytes();
      b.read += 4;
      var msg = {signature: readVector(b, 2).getBytes()};
      var verify = forge.util.createBuffer();
      verify.putBuffer(c.session.md5.digest());
      verify.putBuffer(c.session.sha1.digest());
      verify = verify.getBytes();
      try {
        var cert = c.session.clientCertificate;
        if (!cert.publicKey.verify(verify, msg.signature, 'NONE')) {
          throw new Error('CertificateVerify signature does not match.');
        }
        c.session.md5.update(msgBytes);
        c.session.sha1.update(msgBytes);
      } catch (ex) {
        return c.error(c, {
          message: 'Bad signature in CertificateVerify.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.handshake_failure
          }
        });
      }
      c.expect = CCC;
      c.process();
    };
    tls.handleServerHelloDone = function(c, record, length) {
      if (length > 0) {
        return c.error(c, {
          message: 'Invalid ServerHelloDone message. Invalid length.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.record_overflow
          }
        });
      }
      if (c.serverCertificate === null) {
        var error = {
          message: 'No server certificate provided. Not enough security.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.insufficient_security
          }
        };
        var depth = 0;
        var ret = c.verify(c, error.alert.description, depth, []);
        if (ret !== true) {
          if (ret || ret === 0) {
            if (typeof ret === 'object' && !forge.util.isArray(ret)) {
              if (ret.message) {
                error.message = ret.message;
              }
              if (ret.alert) {
                error.alert.description = ret.alert;
              }
            } else if (typeof ret === 'number') {
              error.alert.description = ret;
            }
          }
          return c.error(c, error);
        }
      }
      if (c.session.certificateRequest !== null) {
        record = tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createCertificate(c)
        });
        tls.queue(c, record);
      }
      record = tls.createRecord(c, {
        type: tls.ContentType.handshake,
        data: tls.createClientKeyExchange(c)
      });
      tls.queue(c, record);
      c.expect = SER;
      var callback = function(c, signature) {
        if (c.session.certificateRequest !== null && c.session.clientCertificate !== null) {
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createCertificateVerify(c, signature)
          }));
        }
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.change_cipher_spec,
          data: tls.createChangeCipherSpec()
        }));
        c.state.pending = tls.createConnectionState(c);
        c.state.current.write = c.state.pending.write;
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createFinished(c)
        }));
        c.expect = SCC;
        tls.flush(c);
        c.process();
      };
      if (c.session.certificateRequest === null || c.session.clientCertificate === null) {
        return callback(c, null);
      }
      tls.getClientSignature(c, callback);
    };
    tls.handleChangeCipherSpec = function(c, record) {
      if (record.fragment.getByte() !== 0x01) {
        return c.error(c, {
          message: 'Invalid ChangeCipherSpec message received.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.illegal_parameter
          }
        });
      }
      var client = (c.entity === tls.ConnectionEnd.client);
      if ((c.session.resuming && client) || (!c.session.resuming && !client)) {
        c.state.pending = tls.createConnectionState(c);
      }
      c.state.current.read = c.state.pending.read;
      if ((!c.session.resuming && client) || (c.session.resuming && !client)) {
        c.state.pending = null;
      }
      c.expect = client ? SFI : CFI;
      c.process();
    };
    tls.handleFinished = function(c, record, length) {
      var b = record.fragment;
      b.read -= 4;
      var msgBytes = b.bytes();
      b.read += 4;
      var vd = record.fragment.getBytes();
      b = forge.util.createBuffer();
      b.putBuffer(c.session.md5.digest());
      b.putBuffer(c.session.sha1.digest());
      var client = (c.entity === tls.ConnectionEnd.client);
      var label = client ? 'server finished' : 'client finished';
      var sp = c.session.sp;
      var vdl = 12;
      var prf = prf_TLS1;
      b = prf(sp.master_secret, label, b.getBytes(), vdl);
      if (b.getBytes() !== vd) {
        return c.error(c, {
          message: 'Invalid verify_data in Finished message.',
          send: true,
          alert: {
            level: tls.Alert.Level.fatal,
            description: tls.Alert.Description.decrypt_error
          }
        });
      }
      c.session.md5.update(msgBytes);
      c.session.sha1.update(msgBytes);
      if ((c.session.resuming && client) || (!c.session.resuming && !client)) {
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.change_cipher_spec,
          data: tls.createChangeCipherSpec()
        }));
        c.state.current.write = c.state.pending.write;
        c.state.pending = null;
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.handshake,
          data: tls.createFinished(c)
        }));
      }
      c.expect = client ? SAD : CAD;
      c.handshaking = false;
      ++c.handshakes;
      c.peerCertificate = client ? c.session.serverCertificate : c.session.clientCertificate;
      tls.flush(c);
      c.isConnected = true;
      c.connected(c);
      c.process();
    };
    tls.handleAlert = function(c, record) {
      var b = record.fragment;
      var alert = {
        level: b.getByte(),
        description: b.getByte()
      };
      var msg;
      switch (alert.description) {
        case tls.Alert.Description.close_notify:
          msg = 'Connection closed.';
          break;
        case tls.Alert.Description.unexpected_message:
          msg = 'Unexpected message.';
          break;
        case tls.Alert.Description.bad_record_mac:
          msg = 'Bad record MAC.';
          break;
        case tls.Alert.Description.decryption_failed:
          msg = 'Decryption failed.';
          break;
        case tls.Alert.Description.record_overflow:
          msg = 'Record overflow.';
          break;
        case tls.Alert.Description.decompression_failure:
          msg = 'Decompression failed.';
          break;
        case tls.Alert.Description.handshake_failure:
          msg = 'Handshake failure.';
          break;
        case tls.Alert.Description.bad_certificate:
          msg = 'Bad certificate.';
          break;
        case tls.Alert.Description.unsupported_certificate:
          msg = 'Unsupported certificate.';
          break;
        case tls.Alert.Description.certificate_revoked:
          msg = 'Certificate revoked.';
          break;
        case tls.Alert.Description.certificate_expired:
          msg = 'Certificate expired.';
          break;
        case tls.Alert.Description.certificate_unknown:
          msg = 'Certificate unknown.';
          break;
        case tls.Alert.Description.illegal_parameter:
          msg = 'Illegal parameter.';
          break;
        case tls.Alert.Description.unknown_ca:
          msg = 'Unknown certificate authority.';
          break;
        case tls.Alert.Description.access_denied:
          msg = 'Access denied.';
          break;
        case tls.Alert.Description.decode_error:
          msg = 'Decode error.';
          break;
        case tls.Alert.Description.decrypt_error:
          msg = 'Decrypt error.';
          break;
        case tls.Alert.Description.export_restriction:
          msg = 'Export restriction.';
          break;
        case tls.Alert.Description.protocol_version:
          msg = 'Unsupported protocol version.';
          break;
        case tls.Alert.Description.insufficient_security:
          msg = 'Insufficient security.';
          break;
        case tls.Alert.Description.internal_error:
          msg = 'Internal error.';
          break;
        case tls.Alert.Description.user_canceled:
          msg = 'User canceled.';
          break;
        case tls.Alert.Description.no_renegotiation:
          msg = 'Renegotiation not supported.';
          break;
        default:
          msg = 'Unknown error.';
          break;
      }
      if (alert.description === tls.Alert.Description.close_notify) {
        return c.close();
      }
      c.error(c, {
        message: msg,
        send: false,
        origin: (c.entity === tls.ConnectionEnd.client) ? 'server' : 'client',
        alert: alert
      });
      c.process();
    };
    tls.handleHandshake = function(c, record) {
      var b = record.fragment;
      var type = b.getByte();
      var length = b.getInt24();
      if (length > b.length()) {
        c.fragmented = record;
        record.fragment = forge.util.createBuffer();
        b.read -= 4;
        return c.process();
      }
      c.fragmented = null;
      b.read -= 4;
      var bytes = b.bytes(length + 4);
      b.read += 4;
      if (type in hsTable[c.entity][c.expect]) {
        if (c.entity === tls.ConnectionEnd.server && !c.open && !c.fail) {
          c.handshaking = true;
          c.session = {
            version: null,
            extensions: {server_name: {serverNameList: []}},
            cipherSuite: null,
            compressionMethod: null,
            serverCertificate: null,
            clientCertificate: null,
            md5: forge.md.md5.create(),
            sha1: forge.md.sha1.create()
          };
        }
        if (type !== tls.HandshakeType.hello_request && type !== tls.HandshakeType.certificate_verify && type !== tls.HandshakeType.finished) {
          c.session.md5.update(bytes);
          c.session.sha1.update(bytes);
        }
        hsTable[c.entity][c.expect][type](c, record, length);
      } else {
        tls.handleUnexpected(c, record);
      }
    };
    tls.handleApplicationData = function(c, record) {
      c.data.putBuffer(record.fragment);
      c.dataReady(c);
      c.process();
    };
    tls.handleHeartbeat = function(c, record) {
      var b = record.fragment;
      var type = b.getByte();
      var length = b.getInt16();
      var payload = b.getBytes(length);
      if (type === tls.HeartbeatMessageType.heartbeat_request) {
        if (c.handshaking || length > payload.length) {
          return c.process();
        }
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.heartbeat,
          data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_response, payload)
        }));
        tls.flush(c);
      } else if (type === tls.HeartbeatMessageType.heartbeat_response) {
        if (payload !== c.expectedHeartbeatPayload) {
          return c.process();
        }
        if (c.heartbeatReceived) {
          c.heartbeatReceived(c, forge.util.createBuffer(payload));
        }
      }
      c.process();
    };
    var SHE = 0;
    var SCE = 1;
    var SKE = 2;
    var SCR = 3;
    var SHD = 4;
    var SCC = 5;
    var SFI = 6;
    var SAD = 7;
    var SER = 8;
    var CHE = 0;
    var CCE = 1;
    var CKE = 2;
    var CCV = 3;
    var CCC = 4;
    var CFI = 5;
    var CAD = 6;
    var CER = 7;
    var __ = tls.handleUnexpected;
    var R0 = tls.handleChangeCipherSpec;
    var R1 = tls.handleAlert;
    var R2 = tls.handleHandshake;
    var R3 = tls.handleApplicationData;
    var R4 = tls.handleHeartbeat;
    var ctTable = [];
    ctTable[tls.ConnectionEnd.client] = [[__, R1, R2, __, R4], [__, R1, R2, __, R4], [__, R1, R2, __, R4], [__, R1, R2, __, R4], [__, R1, R2, __, R4], [R0, R1, __, __, R4], [__, R1, R2, __, R4], [__, R1, R2, R3, R4], [__, R1, R2, __, R4]];
    ctTable[tls.ConnectionEnd.server] = [[__, R1, R2, __, R4], [__, R1, R2, __, R4], [__, R1, R2, __, R4], [__, R1, R2, __, R4], [R0, R1, __, __, R4], [__, R1, R2, __, R4], [__, R1, R2, R3, R4], [__, R1, R2, __, R4]];
    var H0 = tls.handleHelloRequest;
    var H1 = tls.handleServerHello;
    var H2 = tls.handleCertificate;
    var H3 = tls.handleServerKeyExchange;
    var H4 = tls.handleCertificateRequest;
    var H5 = tls.handleServerHelloDone;
    var H6 = tls.handleFinished;
    var hsTable = [];
    hsTable[tls.ConnectionEnd.client] = [[__, __, H1, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __], [H0, __, __, __, __, __, __, __, __, __, __, H2, H3, H4, H5, __, __, __, __, __, __], [H0, __, __, __, __, __, __, __, __, __, __, __, H3, H4, H5, __, __, __, __, __, __], [H0, __, __, __, __, __, __, __, __, __, __, __, __, H4, H5, __, __, __, __, __, __], [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, H5, __, __, __, __, __, __], [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __], [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6], [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __], [H0, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]];
    var H7 = tls.handleClientHello;
    var H8 = tls.handleClientKeyExchange;
    var H9 = tls.handleCertificateVerify;
    hsTable[tls.ConnectionEnd.server] = [[__, H7, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __], [__, __, __, __, __, __, __, __, __, __, __, H2, __, __, __, __, __, __, __, __, __], [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H8, __, __, __, __], [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H9, __, __, __, __, __], [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __], [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, H6], [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __], [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __]];
    tls.generateKeys = function(c, sp) {
      var prf = prf_TLS1;
      var random = sp.client_random + sp.server_random;
      if (!c.session.resuming) {
        sp.master_secret = prf(sp.pre_master_secret, 'master secret', random, 48).bytes();
        sp.pre_master_secret = null;
      }
      random = sp.server_random + sp.client_random;
      var length = 2 * sp.mac_key_length + 2 * sp.enc_key_length;
      var tls10 = (c.version.major === tls.Versions.TLS_1_0.major && c.version.minor === tls.Versions.TLS_1_0.minor);
      if (tls10) {
        length += 2 * sp.fixed_iv_length;
      }
      var km = prf(sp.master_secret, 'key expansion', random, length);
      var rval = {
        client_write_MAC_key: km.getBytes(sp.mac_key_length),
        server_write_MAC_key: km.getBytes(sp.mac_key_length),
        client_write_key: km.getBytes(sp.enc_key_length),
        server_write_key: km.getBytes(sp.enc_key_length)
      };
      if (tls10) {
        rval.client_write_IV = km.getBytes(sp.fixed_iv_length);
        rval.server_write_IV = km.getBytes(sp.fixed_iv_length);
      }
      return rval;
    };
    tls.createConnectionState = function(c) {
      var client = (c.entity === tls.ConnectionEnd.client);
      var createMode = function() {
        var mode = {
          sequenceNumber: [0, 0],
          macKey: null,
          macLength: 0,
          macFunction: null,
          cipherState: null,
          cipherFunction: function(record) {
            return true;
          },
          compressionState: null,
          compressFunction: function(record) {
            return true;
          },
          updateSequenceNumber: function() {
            if (mode.sequenceNumber[1] === 0xFFFFFFFF) {
              mode.sequenceNumber[1] = 0;
              ++mode.sequenceNumber[0];
            } else {
              ++mode.sequenceNumber[1];
            }
          }
        };
        return mode;
      };
      var state = {
        read: createMode(),
        write: createMode()
      };
      state.read.update = function(c, record) {
        if (!state.read.cipherFunction(record, state.read)) {
          c.error(c, {
            message: 'Could not decrypt record or bad MAC.',
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.bad_record_mac
            }
          });
        } else if (!state.read.compressFunction(c, record, state.read)) {
          c.error(c, {
            message: 'Could not decompress record.',
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.decompression_failure
            }
          });
        }
        return !c.fail;
      };
      state.write.update = function(c, record) {
        if (!state.write.compressFunction(c, record, state.write)) {
          c.error(c, {
            message: 'Could not compress record.',
            send: false,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.internal_error
            }
          });
        } else if (!state.write.cipherFunction(record, state.write)) {
          c.error(c, {
            message: 'Could not encrypt record.',
            send: false,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.internal_error
            }
          });
        }
        return !c.fail;
      };
      if (c.session) {
        var sp = c.session.sp;
        c.session.cipherSuite.initSecurityParameters(sp);
        sp.keys = tls.generateKeys(c, sp);
        state.read.macKey = client ? sp.keys.server_write_MAC_key : sp.keys.client_write_MAC_key;
        state.write.macKey = client ? sp.keys.client_write_MAC_key : sp.keys.server_write_MAC_key;
        c.session.cipherSuite.initConnectionState(state, c, sp);
        switch (sp.compression_algorithm) {
          case tls.CompressionMethod.none:
            break;
          case tls.CompressionMethod.deflate:
            state.read.compressFunction = inflate;
            state.write.compressFunction = deflate;
            break;
          default:
            throw new Error('Unsupported compression algorithm.');
        }
      }
      return state;
    };
    tls.createRandom = function() {
      var d = new Date();
      var utc = +d + d.getTimezoneOffset() * 60000;
      var rval = forge.util.createBuffer();
      rval.putInt32(utc);
      rval.putBytes(forge.random.getBytes(28));
      return rval;
    };
    tls.createRecord = function(c, options) {
      if (!options.data) {
        return null;
      }
      var record = {
        type: options.type,
        version: {
          major: c.version.major,
          minor: c.version.minor
        },
        length: options.data.length(),
        fragment: options.data
      };
      return record;
    };
    tls.createAlert = function(c, alert) {
      var b = forge.util.createBuffer();
      b.putByte(alert.level);
      b.putByte(alert.description);
      return tls.createRecord(c, {
        type: tls.ContentType.alert,
        data: b
      });
    };
    tls.createClientHello = function(c) {
      c.session.clientHelloVersion = {
        major: c.version.major,
        minor: c.version.minor
      };
      var cipherSuites = forge.util.createBuffer();
      for (var i = 0; i < c.cipherSuites.length; ++i) {
        var cs = c.cipherSuites[i];
        cipherSuites.putByte(cs.id[0]);
        cipherSuites.putByte(cs.id[1]);
      }
      var cSuites = cipherSuites.length();
      var compressionMethods = forge.util.createBuffer();
      compressionMethods.putByte(tls.CompressionMethod.none);
      var cMethods = compressionMethods.length();
      var extensions = forge.util.createBuffer();
      if (c.virtualHost) {
        var ext = forge.util.createBuffer();
        ext.putByte(0x00);
        ext.putByte(0x00);
        var serverName = forge.util.createBuffer();
        serverName.putByte(0x00);
        writeVector(serverName, 2, forge.util.createBuffer(c.virtualHost));
        var snList = forge.util.createBuffer();
        writeVector(snList, 2, serverName);
        writeVector(ext, 2, snList);
        extensions.putBuffer(ext);
      }
      var extLength = extensions.length();
      if (extLength > 0) {
        extLength += 2;
      }
      var sessionId = c.session.id;
      var length = sessionId.length + 1 + 2 + 4 + 28 + 2 + cSuites + 1 + cMethods + extLength;
      var rval = forge.util.createBuffer();
      rval.putByte(tls.HandshakeType.client_hello);
      rval.putInt24(length);
      rval.putByte(c.version.major);
      rval.putByte(c.version.minor);
      rval.putBytes(c.session.sp.client_random);
      writeVector(rval, 1, forge.util.createBuffer(sessionId));
      writeVector(rval, 2, cipherSuites);
      writeVector(rval, 1, compressionMethods);
      if (extLength > 0) {
        writeVector(rval, 2, extensions);
      }
      return rval;
    };
    tls.createServerHello = function(c) {
      var sessionId = c.session.id;
      var length = sessionId.length + 1 + 2 + 4 + 28 + 2 + 1;
      var rval = forge.util.createBuffer();
      rval.putByte(tls.HandshakeType.server_hello);
      rval.putInt24(length);
      rval.putByte(c.version.major);
      rval.putByte(c.version.minor);
      rval.putBytes(c.session.sp.server_random);
      writeVector(rval, 1, forge.util.createBuffer(sessionId));
      rval.putByte(c.session.cipherSuite.id[0]);
      rval.putByte(c.session.cipherSuite.id[1]);
      rval.putByte(c.session.compressionMethod);
      return rval;
    };
    tls.createCertificate = function(c) {
      var client = (c.entity === tls.ConnectionEnd.client);
      var cert = null;
      if (c.getCertificate) {
        var hint;
        if (client) {
          hint = c.session.certificateRequest;
        } else {
          hint = c.session.extensions.server_name.serverNameList;
        }
        cert = c.getCertificate(c, hint);
      }
      var certList = forge.util.createBuffer();
      if (cert !== null) {
        try {
          if (!forge.util.isArray(cert)) {
            cert = [cert];
          }
          var asn1 = null;
          for (var i = 0; i < cert.length; ++i) {
            var msg = forge.pem.decode(cert[i])[0];
            if (msg.type !== 'CERTIFICATE' && msg.type !== 'X509 CERTIFICATE' && msg.type !== 'TRUSTED CERTIFICATE') {
              var error = new Error('Could not convert certificate from PEM; PEM ' + 'header type is not "CERTIFICATE", "X509 CERTIFICATE", or ' + '"TRUSTED CERTIFICATE".');
              error.headerType = msg.type;
              throw error;
            }
            if (msg.procType && msg.procType.type === 'ENCRYPTED') {
              throw new Error('Could not convert certificate from PEM; PEM is encrypted.');
            }
            var der = forge.util.createBuffer(msg.body);
            if (asn1 === null) {
              asn1 = forge.asn1.fromDer(der.bytes(), false);
            }
            var certBuffer = forge.util.createBuffer();
            writeVector(certBuffer, 3, der);
            certList.putBuffer(certBuffer);
          }
          cert = forge.pki.certificateFromAsn1(asn1);
          if (client) {
            c.session.clientCertificate = cert;
          } else {
            c.session.serverCertificate = cert;
          }
        } catch (ex) {
          return c.error(c, {
            message: 'Could not send certificate list.',
            cause: ex,
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.bad_certificate
            }
          });
        }
      }
      var length = 3 + certList.length();
      var rval = forge.util.createBuffer();
      rval.putByte(tls.HandshakeType.certificate);
      rval.putInt24(length);
      writeVector(rval, 3, certList);
      return rval;
    };
    tls.createClientKeyExchange = function(c) {
      var b = forge.util.createBuffer();
      b.putByte(c.session.clientHelloVersion.major);
      b.putByte(c.session.clientHelloVersion.minor);
      b.putBytes(forge.random.getBytes(46));
      var sp = c.session.sp;
      sp.pre_master_secret = b.getBytes();
      var key = c.session.serverCertificate.publicKey;
      b = key.encrypt(sp.pre_master_secret);
      var length = b.length + 2;
      var rval = forge.util.createBuffer();
      rval.putByte(tls.HandshakeType.client_key_exchange);
      rval.putInt24(length);
      rval.putInt16(b.length);
      rval.putBytes(b);
      return rval;
    };
    tls.createServerKeyExchange = function(c) {
      var length = 0;
      var rval = forge.util.createBuffer();
      if (length > 0) {
        rval.putByte(tls.HandshakeType.server_key_exchange);
        rval.putInt24(length);
      }
      return rval;
    };
    tls.getClientSignature = function(c, callback) {
      var b = forge.util.createBuffer();
      b.putBuffer(c.session.md5.digest());
      b.putBuffer(c.session.sha1.digest());
      b = b.getBytes();
      c.getSignature = c.getSignature || function(c, b, callback) {
        var privateKey = null;
        if (c.getPrivateKey) {
          try {
            privateKey = c.getPrivateKey(c, c.session.clientCertificate);
            privateKey = forge.pki.privateKeyFromPem(privateKey);
          } catch (ex) {
            c.error(c, {
              message: 'Could not get private key.',
              cause: ex,
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.internal_error
              }
            });
          }
        }
        if (privateKey === null) {
          c.error(c, {
            message: 'No private key set.',
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: tls.Alert.Description.internal_error
            }
          });
        } else {
          b = privateKey.sign(b, null);
        }
        callback(c, b);
      };
      c.getSignature(c, b, callback);
    };
    tls.createCertificateVerify = function(c, signature) {
      var length = signature.length + 2;
      var rval = forge.util.createBuffer();
      rval.putByte(tls.HandshakeType.certificate_verify);
      rval.putInt24(length);
      rval.putInt16(signature.length);
      rval.putBytes(signature);
      return rval;
    };
    tls.createCertificateRequest = function(c) {
      var certTypes = forge.util.createBuffer();
      certTypes.putByte(0x01);
      var cAs = forge.util.createBuffer();
      for (var key in c.caStore.certs) {
        var cert = c.caStore.certs[key];
        var dn = forge.pki.distinguishedNameToAsn1(cert.subject);
        cAs.putBuffer(forge.asn1.toDer(dn));
      }
      var length = 1 + certTypes.length() + 2 + cAs.length();
      var rval = forge.util.createBuffer();
      rval.putByte(tls.HandshakeType.certificate_request);
      rval.putInt24(length);
      writeVector(rval, 1, certTypes);
      writeVector(rval, 2, cAs);
      return rval;
    };
    tls.createServerHelloDone = function(c) {
      var rval = forge.util.createBuffer();
      rval.putByte(tls.HandshakeType.server_hello_done);
      rval.putInt24(0);
      return rval;
    };
    tls.createChangeCipherSpec = function() {
      var rval = forge.util.createBuffer();
      rval.putByte(0x01);
      return rval;
    };
    tls.createFinished = function(c) {
      var b = forge.util.createBuffer();
      b.putBuffer(c.session.md5.digest());
      b.putBuffer(c.session.sha1.digest());
      var client = (c.entity === tls.ConnectionEnd.client);
      var sp = c.session.sp;
      var vdl = 12;
      var prf = prf_TLS1;
      var label = client ? 'client finished' : 'server finished';
      b = prf(sp.master_secret, label, b.getBytes(), vdl);
      var rval = forge.util.createBuffer();
      rval.putByte(tls.HandshakeType.finished);
      rval.putInt24(b.length());
      rval.putBuffer(b);
      return rval;
    };
    tls.createHeartbeat = function(type, payload, payloadLength) {
      if (typeof payloadLength === 'undefined') {
        payloadLength = payload.length;
      }
      var rval = forge.util.createBuffer();
      rval.putByte(type);
      rval.putInt16(payloadLength);
      rval.putBytes(payload);
      var plaintextLength = rval.length();
      var paddingLength = Math.max(16, plaintextLength - payloadLength - 3);
      rval.putBytes(forge.random.getBytes(paddingLength));
      return rval;
    };
    tls.queue = function(c, record) {
      if (!record) {
        return ;
      }
      if (record.type === tls.ContentType.handshake) {
        var bytes = record.fragment.bytes();
        c.session.md5.update(bytes);
        c.session.sha1.update(bytes);
        bytes = null;
      }
      var records;
      if (record.fragment.length() <= tls.MaxFragment) {
        records = [record];
      } else {
        records = [];
        var data = record.fragment.bytes();
        while (data.length > tls.MaxFragment) {
          records.push(tls.createRecord(c, {
            type: record.type,
            data: forge.util.createBuffer(data.slice(0, tls.MaxFragment))
          }));
          data = data.slice(tls.MaxFragment);
        }
        if (data.length > 0) {
          records.push(tls.createRecord(c, {
            type: record.type,
            data: forge.util.createBuffer(data)
          }));
        }
      }
      for (var i = 0; i < records.length && !c.fail; ++i) {
        var rec = records[i];
        var s = c.state.current.write;
        if (s.update(c, rec)) {
          c.records.push(rec);
        }
      }
    };
    tls.flush = function(c) {
      for (var i = 0; i < c.records.length; ++i) {
        var record = c.records[i];
        c.tlsData.putByte(record.type);
        c.tlsData.putByte(record.version.major);
        c.tlsData.putByte(record.version.minor);
        c.tlsData.putInt16(record.fragment.length());
        c.tlsData.putBuffer(c.records[i].fragment);
      }
      c.records = [];
      return c.tlsDataReady(c);
    };
    var _certErrorToAlertDesc = function(error) {
      switch (error) {
        case true:
          return true;
        case forge.pki.certificateError.bad_certificate:
          return tls.Alert.Description.bad_certificate;
        case forge.pki.certificateError.unsupported_certificate:
          return tls.Alert.Description.unsupported_certificate;
        case forge.pki.certificateError.certificate_revoked:
          return tls.Alert.Description.certificate_revoked;
        case forge.pki.certificateError.certificate_expired:
          return tls.Alert.Description.certificate_expired;
        case forge.pki.certificateError.certificate_unknown:
          return tls.Alert.Description.certificate_unknown;
        case forge.pki.certificateError.unknown_ca:
          return tls.Alert.Description.unknown_ca;
        default:
          return tls.Alert.Description.bad_certificate;
      }
    };
    var _alertDescToCertError = function(desc) {
      switch (desc) {
        case true:
          return true;
        case tls.Alert.Description.bad_certificate:
          return forge.pki.certificateError.bad_certificate;
        case tls.Alert.Description.unsupported_certificate:
          return forge.pki.certificateError.unsupported_certificate;
        case tls.Alert.Description.certificate_revoked:
          return forge.pki.certificateError.certificate_revoked;
        case tls.Alert.Description.certificate_expired:
          return forge.pki.certificateError.certificate_expired;
        case tls.Alert.Description.certificate_unknown:
          return forge.pki.certificateError.certificate_unknown;
        case tls.Alert.Description.unknown_ca:
          return forge.pki.certificateError.unknown_ca;
        default:
          return forge.pki.certificateError.bad_certificate;
      }
    };
    tls.verifyCertificateChain = function(c, chain) {
      try {
        forge.pki.verifyCertificateChain(c.caStore, chain, function verify(vfd, depth, chain) {
          var desc = _certErrorToAlertDesc(vfd);
          var ret = c.verify(c, vfd, depth, chain);
          if (ret !== true) {
            if (typeof ret === 'object' && !forge.util.isArray(ret)) {
              var error = new Error('The application rejected the certificate.');
              error.send = true;
              error.alert = {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.bad_certificate
              };
              if (ret.message) {
                error.message = ret.message;
              }
              if (ret.alert) {
                error.alert.description = ret.alert;
              }
              throw error;
            }
            if (ret !== vfd) {
              ret = _alertDescToCertError(ret);
            }
          }
          return ret;
        });
      } catch (ex) {
        var err = ex;
        if (typeof err !== 'object' || forge.util.isArray(err)) {
          err = {
            send: true,
            alert: {
              level: tls.Alert.Level.fatal,
              description: _certErrorToAlertDesc(ex)
            }
          };
        }
        if (!('send' in err)) {
          err.send = true;
        }
        if (!('alert' in err)) {
          err.alert = {
            level: tls.Alert.Level.fatal,
            description: _certErrorToAlertDesc(err.error)
          };
        }
        c.error(c, err);
      }
      return !c.fail;
    };
    tls.createSessionCache = function(cache, capacity) {
      var rval = null;
      if (cache && cache.getSession && cache.setSession && cache.order) {
        rval = cache;
      } else {
        rval = {};
        rval.cache = cache || {};
        rval.capacity = Math.max(capacity || 100, 1);
        rval.order = [];
        for (var key in cache) {
          if (rval.order.length <= capacity) {
            rval.order.push(key);
          } else {
            delete cache[key];
          }
        }
        rval.getSession = function(sessionId) {
          var session = null;
          var key = null;
          if (sessionId) {
            key = forge.util.bytesToHex(sessionId);
          } else if (rval.order.length > 0) {
            key = rval.order[0];
          }
          if (key !== null && key in rval.cache) {
            session = rval.cache[key];
            delete rval.cache[key];
            for (var i in rval.order) {
              if (rval.order[i] === key) {
                rval.order.splice(i, 1);
                break;
              }
            }
          }
          return session;
        };
        rval.setSession = function(sessionId, session) {
          if (rval.order.length === rval.capacity) {
            var key = rval.order.shift();
            delete rval.cache[key];
          }
          var key = forge.util.bytesToHex(sessionId);
          rval.order.push(key);
          rval.cache[key] = session;
        };
      }
      return rval;
    };
    tls.createConnection = function(options) {
      var caStore = null;
      if (options.caStore) {
        if (forge.util.isArray(options.caStore)) {
          caStore = forge.pki.createCaStore(options.caStore);
        } else {
          caStore = options.caStore;
        }
      } else {
        caStore = forge.pki.createCaStore();
      }
      var cipherSuites = options.cipherSuites || null;
      if (cipherSuites === null) {
        cipherSuites = [];
        for (var key in tls.CipherSuites) {
          cipherSuites.push(tls.CipherSuites[key]);
        }
      }
      var entity = (options.server || false) ? tls.ConnectionEnd.server : tls.ConnectionEnd.client;
      var sessionCache = options.sessionCache ? tls.createSessionCache(options.sessionCache) : null;
      var c = {
        version: {
          major: tls.Version.major,
          minor: tls.Version.minor
        },
        entity: entity,
        sessionId: options.sessionId,
        caStore: caStore,
        sessionCache: sessionCache,
        cipherSuites: cipherSuites,
        connected: options.connected,
        virtualHost: options.virtualHost || null,
        verifyClient: options.verifyClient || false,
        verify: options.verify || function(cn, vfd, dpth, cts) {
          return vfd;
        },
        getCertificate: options.getCertificate || null,
        getPrivateKey: options.getPrivateKey || null,
        getSignature: options.getSignature || null,
        input: forge.util.createBuffer(),
        tlsData: forge.util.createBuffer(),
        data: forge.util.createBuffer(),
        tlsDataReady: options.tlsDataReady,
        dataReady: options.dataReady,
        heartbeatReceived: options.heartbeatReceived,
        closed: options.closed,
        error: function(c, ex) {
          ex.origin = ex.origin || ((c.entity === tls.ConnectionEnd.client) ? 'client' : 'server');
          if (ex.send) {
            tls.queue(c, tls.createAlert(c, ex.alert));
            tls.flush(c);
          }
          var fatal = (ex.fatal !== false);
          if (fatal) {
            c.fail = true;
          }
          options.error(c, ex);
          if (fatal) {
            c.close(false);
          }
        },
        deflate: options.deflate || null,
        inflate: options.inflate || null
      };
      c.reset = function(clearFail) {
        c.version = {
          major: tls.Version.major,
          minor: tls.Version.minor
        };
        c.record = null;
        c.session = null;
        c.peerCertificate = null;
        c.state = {
          pending: null,
          current: null
        };
        c.expect = (c.entity === tls.ConnectionEnd.client) ? SHE : CHE;
        c.fragmented = null;
        c.records = [];
        c.open = false;
        c.handshakes = 0;
        c.handshaking = false;
        c.isConnected = false;
        c.fail = !(clearFail || typeof(clearFail) === 'undefined');
        c.input.clear();
        c.tlsData.clear();
        c.data.clear();
        c.state.current = tls.createConnectionState(c);
      };
      c.reset();
      var _update = function(c, record) {
        var aligned = record.type - tls.ContentType.change_cipher_spec;
        var handlers = ctTable[c.entity][c.expect];
        if (aligned in handlers) {
          handlers[aligned](c, record);
        } else {
          tls.handleUnexpected(c, record);
        }
      };
      var _readRecordHeader = function(c) {
        var rval = 0;
        var b = c.input;
        var len = b.length();
        if (len < 5) {
          rval = 5 - len;
        } else {
          c.record = {
            type: b.getByte(),
            version: {
              major: b.getByte(),
              minor: b.getByte()
            },
            length: b.getInt16(),
            fragment: forge.util.createBuffer(),
            ready: false
          };
          var compatibleVersion = (c.record.version.major === c.version.major);
          if (compatibleVersion && c.session && c.session.version) {
            compatibleVersion = (c.record.version.minor === c.version.minor);
          }
          if (!compatibleVersion) {
            c.error(c, {
              message: 'Incompatible TLS version.',
              send: true,
              alert: {
                level: tls.Alert.Level.fatal,
                description: tls.Alert.Description.protocol_version
              }
            });
          }
        }
        return rval;
      };
      var _readRecord = function(c) {
        var rval = 0;
        var b = c.input;
        var len = b.length();
        if (len < c.record.length) {
          rval = c.record.length - len;
        } else {
          c.record.fragment.putBytes(b.getBytes(c.record.length));
          b.compact();
          var s = c.state.current.read;
          if (s.update(c, c.record)) {
            if (c.fragmented !== null) {
              if (c.fragmented.type === c.record.type) {
                c.fragmented.fragment.putBuffer(c.record.fragment);
                c.record = c.fragmented;
              } else {
                c.error(c, {
                  message: 'Invalid fragmented record.',
                  send: true,
                  alert: {
                    level: tls.Alert.Level.fatal,
                    description: tls.Alert.Description.unexpected_message
                  }
                });
              }
            }
            c.record.ready = true;
          }
        }
        return rval;
      };
      c.handshake = function(sessionId) {
        if (c.entity !== tls.ConnectionEnd.client) {
          c.error(c, {
            message: 'Cannot initiate handshake as a server.',
            fatal: false
          });
        } else if (c.handshaking) {
          c.error(c, {
            message: 'Handshake already in progress.',
            fatal: false
          });
        } else {
          if (c.fail && !c.open && c.handshakes === 0) {
            c.fail = false;
          }
          c.handshaking = true;
          sessionId = sessionId || '';
          var session = null;
          if (sessionId.length > 0) {
            if (c.sessionCache) {
              session = c.sessionCache.getSession(sessionId);
            }
            if (session === null) {
              sessionId = '';
            }
          }
          if (sessionId.length === 0 && c.sessionCache) {
            session = c.sessionCache.getSession();
            if (session !== null) {
              sessionId = session.id;
            }
          }
          c.session = {
            id: sessionId,
            version: null,
            cipherSuite: null,
            compressionMethod: null,
            serverCertificate: null,
            certificateRequest: null,
            clientCertificate: null,
            sp: {},
            md5: forge.md.md5.create(),
            sha1: forge.md.sha1.create()
          };
          if (session) {
            c.version = session.version;
            c.session.sp = session.sp;
          }
          c.session.sp.client_random = tls.createRandom().getBytes();
          c.open = true;
          tls.queue(c, tls.createRecord(c, {
            type: tls.ContentType.handshake,
            data: tls.createClientHello(c)
          }));
          tls.flush(c);
        }
      };
      c.process = function(data) {
        var rval = 0;
        if (data) {
          c.input.putBytes(data);
        }
        if (!c.fail) {
          if (c.record !== null && c.record.ready && c.record.fragment.isEmpty()) {
            c.record = null;
          }
          if (c.record === null) {
            rval = _readRecordHeader(c);
          }
          if (!c.fail && c.record !== null && !c.record.ready) {
            rval = _readRecord(c);
          }
          if (!c.fail && c.record !== null && c.record.ready) {
            _update(c, c.record);
          }
        }
        return rval;
      };
      c.prepare = function(data) {
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.application_data,
          data: forge.util.createBuffer(data)
        }));
        return tls.flush(c);
      };
      c.prepareHeartbeatRequest = function(payload, payloadLength) {
        if (payload instanceof forge.util.ByteBuffer) {
          payload = payload.bytes();
        }
        if (typeof payloadLength === 'undefined') {
          payloadLength = payload.length;
        }
        c.expectedHeartbeatPayload = payload;
        tls.queue(c, tls.createRecord(c, {
          type: tls.ContentType.heartbeat,
          data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_request, payload, payloadLength)
        }));
        return tls.flush(c);
      };
      c.close = function(clearFail) {
        if (!c.fail && c.sessionCache && c.session) {
          var session = {
            id: c.session.id,
            version: c.session.version,
            sp: c.session.sp
          };
          session.sp.keys = null;
          c.sessionCache.setSession(session.id, session);
        }
        if (c.open) {
          c.open = false;
          c.input.clear();
          if (c.isConnected || c.handshaking) {
            c.isConnected = c.handshaking = false;
            tls.queue(c, tls.createAlert(c, {
              level: tls.Alert.Level.warning,
              description: tls.Alert.Description.close_notify
            }));
            tls.flush(c);
          }
          c.closed(c);
        }
        c.reset(clearFail);
      };
      return c;
    };
    forge.tls = forge.tls || {};
    for (var key in tls) {
      if (typeof tls[key] !== 'function') {
        forge.tls[key] = tls[key];
      }
    }
    forge.tls.prf_tls1 = prf_TLS1;
    forge.tls.hmac_sha1 = hmac_sha1;
    forge.tls.createSessionCache = tls.createSessionCache;
    forge.tls.createConnection = tls.createConnection;
  }
  var name = 'tls';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/tls", ["npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/hmac", "npm:node-forge@0.6.26/js/md", "npm:node-forge@0.6.26/js/pem", "npm:node-forge@0.6.26/js/pki", "npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/hmac'), __require('npm:node-forge@0.6.26/js/md'), __require('npm:node-forge@0.6.26/js/pem'), __require('npm:node-forge@0.6.26/js/pki'), __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  function initModule(forge) {
    var tls = forge.tls;
    tls.CipherSuites['TLS_RSA_WITH_AES_128_CBC_SHA'] = {
      id: [0x00, 0x2f],
      name: 'TLS_RSA_WITH_AES_128_CBC_SHA',
      initSecurityParameters: function(sp) {
        sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
        sp.cipher_type = tls.CipherType.block;
        sp.enc_key_length = 16;
        sp.block_length = 16;
        sp.fixed_iv_length = 16;
        sp.record_iv_length = 16;
        sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
        sp.mac_length = 20;
        sp.mac_key_length = 20;
      },
      initConnectionState: initConnectionState
    };
    tls.CipherSuites['TLS_RSA_WITH_AES_256_CBC_SHA'] = {
      id: [0x00, 0x35],
      name: 'TLS_RSA_WITH_AES_256_CBC_SHA',
      initSecurityParameters: function(sp) {
        sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
        sp.cipher_type = tls.CipherType.block;
        sp.enc_key_length = 32;
        sp.block_length = 16;
        sp.fixed_iv_length = 16;
        sp.record_iv_length = 16;
        sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
        sp.mac_length = 20;
        sp.mac_key_length = 20;
      },
      initConnectionState: initConnectionState
    };
    function initConnectionState(state, c, sp) {
      var client = (c.entity === forge.tls.ConnectionEnd.client);
      state.read.cipherState = {
        init: false,
        cipher: forge.cipher.createDecipher('AES-CBC', client ? sp.keys.server_write_key : sp.keys.client_write_key),
        iv: client ? sp.keys.server_write_IV : sp.keys.client_write_IV
      };
      state.write.cipherState = {
        init: false,
        cipher: forge.cipher.createCipher('AES-CBC', client ? sp.keys.client_write_key : sp.keys.server_write_key),
        iv: client ? sp.keys.client_write_IV : sp.keys.server_write_IV
      };
      state.read.cipherFunction = decrypt_aes_cbc_sha1;
      state.write.cipherFunction = encrypt_aes_cbc_sha1;
      state.read.macLength = state.write.macLength = sp.mac_length;
      state.read.macFunction = state.write.macFunction = tls.hmac_sha1;
    }
    function encrypt_aes_cbc_sha1(record, s) {
      var rval = false;
      var mac = s.macFunction(s.macKey, s.sequenceNumber, record);
      record.fragment.putBytes(mac);
      s.updateSequenceNumber();
      var iv;
      if (record.version.minor === tls.Versions.TLS_1_0.minor) {
        iv = s.cipherState.init ? null : s.cipherState.iv;
      } else {
        iv = forge.random.getBytesSync(16);
      }
      s.cipherState.init = true;
      var cipher = s.cipherState.cipher;
      cipher.start({iv: iv});
      if (record.version.minor >= tls.Versions.TLS_1_1.minor) {
        cipher.output.putBytes(iv);
      }
      cipher.update(record.fragment);
      if (cipher.finish(encrypt_aes_cbc_sha1_padding)) {
        record.fragment = cipher.output;
        record.length = record.fragment.length();
        rval = true;
      }
      return rval;
    }
    function encrypt_aes_cbc_sha1_padding(blockSize, input, decrypt) {
      if (!decrypt) {
        var padding = blockSize - (input.length() % blockSize);
        input.fillWithByte(padding - 1, padding);
      }
      return true;
    }
    function decrypt_aes_cbc_sha1_padding(blockSize, output, decrypt) {
      var rval = true;
      if (decrypt) {
        var len = output.length();
        var paddingLength = output.last();
        for (var i = len - 1 - paddingLength; i < len - 1; ++i) {
          rval = rval && (output.at(i) == paddingLength);
        }
        if (rval) {
          output.truncate(paddingLength + 1);
        }
      }
      return rval;
    }
    var count = 0;
    function decrypt_aes_cbc_sha1(record, s) {
      var rval = false;
      ++count;
      var iv;
      if (record.version.minor === tls.Versions.TLS_1_0.minor) {
        iv = s.cipherState.init ? null : s.cipherState.iv;
      } else {
        iv = record.fragment.getBytes(16);
      }
      s.cipherState.init = true;
      var cipher = s.cipherState.cipher;
      cipher.start({iv: iv});
      cipher.update(record.fragment);
      rval = cipher.finish(decrypt_aes_cbc_sha1_padding);
      var macLen = s.macLength;
      var mac = '';
      for (var i = 0; i < macLen; ++i) {
        mac += String.fromCharCode(0);
      }
      var len = cipher.output.length();
      if (len >= macLen) {
        record.fragment = cipher.output.getBytes(len - macLen);
        mac = cipher.output.getBytes(macLen);
      } else {
        record.fragment = cipher.output.getBytes();
      }
      record.fragment = forge.util.createBuffer(record.fragment);
      record.length = record.fragment.length();
      var mac2 = s.macFunction(s.macKey, s.sequenceNumber, record);
      s.updateSequenceNumber();
      rval = (mac2 === mac) && rval;
      return rval;
    }
  }
  var name = 'aesCipherSuites';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {};
      }
      return initModule(forge);
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/aesCipherSuites", ["npm:node-forge@0.6.26/js/aes", "npm:node-forge@0.6.26/js/tls"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/aes'), __require('npm:node-forge@0.6.26/js/tls'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
(function() {
  var name = 'forge';
  if (typeof define !== 'function') {
    if (typeof module === 'object' && module.exports) {
      var nodeJS = true;
      define = function(ids, factory) {
        factory(require, module);
      };
    } else {
      if (typeof forge === 'undefined') {
        forge = {disableNativeCode: false};
      }
      return ;
    }
  }
  var deps;
  var defineFunc = function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      });
      forge = forge || {};
      forge.defined = forge.defined || {};
      if (forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for (var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge;
    };
    module.exports.disableNativeCode = false;
    module.exports(module.exports);
  };
  var tmpDefine = define;
  define = function(ids, factory) {
    deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
    if (nodeJS) {
      delete define;
      return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
    }
    define = tmpDefine;
    return define.apply(null, Array.prototype.slice.call(arguments, 0));
  };
  System.register("npm:node-forge@0.6.26/js/forge", ["npm:node-forge@0.6.26/js/aes", "npm:node-forge@0.6.26/js/aesCipherSuites", "npm:node-forge@0.6.26/js/asn1", "npm:node-forge@0.6.26/js/cipher", "npm:node-forge@0.6.26/js/cipherModes", "npm:node-forge@0.6.26/js/debug", "npm:node-forge@0.6.26/js/des", "npm:node-forge@0.6.26/js/hmac", "npm:node-forge@0.6.26/js/kem", "npm:node-forge@0.6.26/js/log", "npm:node-forge@0.6.26/js/md", "npm:node-forge@0.6.26/js/mgf1", "npm:node-forge@0.6.26/js/pbkdf2", "npm:node-forge@0.6.26/js/pem", "npm:node-forge@0.6.26/js/pkcs7", "npm:node-forge@0.6.26/js/pkcs1", "npm:node-forge@0.6.26/js/pkcs12", "npm:node-forge@0.6.26/js/pki", "npm:node-forge@0.6.26/js/prime", "npm:node-forge@0.6.26/js/prng", "npm:node-forge@0.6.26/js/pss", "npm:node-forge@0.6.26/js/random", "npm:node-forge@0.6.26/js/rc2", "npm:node-forge@0.6.26/js/ssh", "npm:node-forge@0.6.26/js/task", "npm:node-forge@0.6.26/js/tls", "npm:node-forge@0.6.26/js/util"], false, function(__require, __exports, __module) {
    return (function() {
      defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
    }).call(this, __require, __module, __require('npm:node-forge@0.6.26/js/aes'), __require('npm:node-forge@0.6.26/js/aesCipherSuites'), __require('npm:node-forge@0.6.26/js/asn1'), __require('npm:node-forge@0.6.26/js/cipher'), __require('npm:node-forge@0.6.26/js/cipherModes'), __require('npm:node-forge@0.6.26/js/debug'), __require('npm:node-forge@0.6.26/js/des'), __require('npm:node-forge@0.6.26/js/hmac'), __require('npm:node-forge@0.6.26/js/kem'), __require('npm:node-forge@0.6.26/js/log'), __require('npm:node-forge@0.6.26/js/md'), __require('npm:node-forge@0.6.26/js/mgf1'), __require('npm:node-forge@0.6.26/js/pbkdf2'), __require('npm:node-forge@0.6.26/js/pem'), __require('npm:node-forge@0.6.26/js/pkcs7'), __require('npm:node-forge@0.6.26/js/pkcs1'), __require('npm:node-forge@0.6.26/js/pkcs12'), __require('npm:node-forge@0.6.26/js/pki'), __require('npm:node-forge@0.6.26/js/prime'), __require('npm:node-forge@0.6.26/js/prng'), __require('npm:node-forge@0.6.26/js/pss'), __require('npm:node-forge@0.6.26/js/random'), __require('npm:node-forge@0.6.26/js/rc2'), __require('npm:node-forge@0.6.26/js/ssh'), __require('npm:node-forge@0.6.26/js/task'), __require('npm:node-forge@0.6.26/js/tls'), __require('npm:node-forge@0.6.26/js/util'));
  });
})();
})();
(function() {
function define(){};  define.amd = {};
System.register("npm:node-forge@0.6.26", ["npm:node-forge@0.6.26/js/forge"], false, function(__require, __exports, __module) {
  return (function(main) {
    return main;
  }).call(this, __require('npm:node-forge@0.6.26/js/forge'));
});
})();
System.register('app', ['npm:node-forge@0.6.26'], function (_export) {
  var forge, app;
  return {
    setters: [function (_npmNodeForge0626) {
      forge = _npmNodeForge0626['default'];
    }],
    execute: function () {
      'use strict';

      app = forge.util.createBuffer();

      _export('default', app);
    }
  };
});
//# sourceMappingURL=app.js.map