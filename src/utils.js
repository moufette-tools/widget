const DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]+\.[a-z.]{2,6}$/i;

var win;
if (typeof (window) === 'undefined') {
   var loc = {
      hostname: ''
   };
   win = {
      navigator: { userAgent: '' },
      document: {
         location: loc,
         referrer: ''
      },
      screen: { width: 0, height: 0 },
      location: loc
   };
} else {
   win = window;
}

var ArrayProto = Array.prototype,
   // FuncProto = Function.prototype,
   // ObjProto = Object.prototype,
   // slice = ArrayProto.slice,
   // toString = ObjProto.toString,
   // hasOwnProperty = ObjProto.hasOwnProperty,
   // windowConsole = win.console,
   navigator = win.navigator,
   document = win.document,
   // windowOpera = win.opera,
   screen = win.screen,
   userAgent = navigator.userAgent;

// var nativeBind = FuncProto.bind,
//    nativeForEach = ArrayProto.forEach,
//    nativeIndexOf = ArrayProto.indexOf,
//    nativeIsArray = Array.isArray,
//    breaker = {};

const _ = {
   trim: function (str) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
      return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
   }
};


_.UUID = (function () {

   // Time/ticks information
   // 1*new Date() is a cross browser version of Date.now()
   var T = function () {
      var d = 1 * new Date(),
         i = 0;

      // this while loop figures how many browser ticks go by
      // before 1*new Date() returns a new number, ie the amount
      // of ticks that go by per millisecond
      while (d == 1 * new Date()) {
         i++;
      }

      return d.toString(16) + i.toString(16);
   };

   // Math.Random entropy
   var R = function () {
      return Math.random().toString(16).replace('.', '');
   };

   // User agent entropy
   // This function takes the user agent string, and then xors
   // together each sequence of 8 bytes.  This produces a final
   // sequence of 8 bytes which it returns as hex.
   var UA = function () {
      var ua = userAgent,
         i, ch, buffer = [],
         ret = 0;

      function xor(result, byte_array) {
         var j, tmp = 0;
         for (j = 0; j < byte_array.length; j++) {
            tmp |= (buffer[j] << j * 8);
         }
         return result ^ tmp;
      }

      for (i = 0; i < ua.length; i++) {
         ch = ua.charCodeAt(i);
         buffer.unshift(ch & 0xFF);
         if (buffer.length >= 4) {
            ret = xor(ret, buffer);
            buffer = [];
         }
      }

      if (buffer.length > 0) {
         ret = xor(ret, buffer);
      }

      return ret.toString(16);
   };

   return function () {
      var se = (screen.height * screen.width).toString(16);
      return (T() + '-' + R() + '-' + UA() + '-' + se + '-' + T());
   };
})();


// _.cookie
// Methods partially borrowed from quirksmode.org/js/cookies.html
_.cookie = {
   get: function (name) {
      try {
         var nameEQ = name + '=';
         var ca = document.cookie.split(';');
         for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
               c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
               return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
         }
      } catch (err) { }
      return null;
   },

   parse: function (name) {
      var cookie;
      try {
         cookie = _.JSONDecode(_.cookie.get(name)) || {};
      } catch (err) {
         // noop
      }
      return cookie;
   },

   set_seconds: function (name, value, seconds, cross_subdomain, is_secure) {
      try {
         var cdomain = '',
            expires = '',
            secure = '';

         if (cross_subdomain) {
            var matches = document.location.hostname.match(DOMAIN_MATCH_REGEX),
               domain = matches ? matches[0] : '';

            cdomain = ((domain) ? '; domain=.' + domain : '');
         }

         if (seconds) {
            var date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            expires = '; expires=' + date.toGMTString();
         }

         if (is_secure) {
            secure = '; secure';
         }

         document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
      } catch (err) { return }
   },

   set: function (name, value, days, cross_subdomain, is_secure) {
      try {
         var cdomain = '', expires = '', secure = '';

         console.log(document.location.hostname)
         if (cross_subdomain) {
            var matches = document.location.hostname.match(DOMAIN_MATCH_REGEX),
               domain = matches ? matches[0] : '';

            cdomain = ((domain) ? '; domain=.' + domain : '');
         }

         if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
         }

         if (is_secure && cdomain) {
            secure = '; secure;';
         }

         var new_cookie_val = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
         console.log({ new_cookie_val })

         document.cookie = new_cookie_val;
         return new_cookie_val;
      } catch (err) { console.log({ err }); return }
   },

   remove: function (name, cross_subdomain) {
      try {
         _.cookie.set(name, '', -1, cross_subdomain);
      } catch (err) { return }
   }
};


export {
   _
}