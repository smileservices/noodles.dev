!function(e){var t={};function r(n){if(t[n])return t[n].exports;var a=t[n]={i:n,l:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(n,a,function(t){return e[t]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=84)}({0:function(e,t){e.exports=React},2:function(e,t,r){var n=r(31),a=r(32),o=r(25),c=r(33);e.exports=function(e,t){return n(e)||a(e,t)||o(e,t)||c()}},25:function(e,t,r){var n=r(26);e.exports=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}},26:function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}},31:function(e,t){e.exports=function(e){if(Array.isArray(e))return e}},32:function(e,t){e.exports=function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var r=[],n=!0,a=!1,o=void 0;try{for(var c,u=e[Symbol.iterator]();!(n=(c=u.next()).done)&&(r.push(c.value),!t||r.length!==t);n=!0);}catch(e){a=!0,o=e}finally{try{n||null==u.return||u.return()}finally{if(a)throw o}}return r}}},33:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},5:function(e,t,r){"use strict";r.d(t,"e",(function(){return o})),r.d(t,"d",(function(){return c})),r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return i})),r.d(t,"f",(function(){return s})),r.d(t,"c",(function(){return l}));var n=r(2),a=r.n(n),o=function(e){for(var t="",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=r.length,a=0;a<e;a++)t+=r.charAt(Math.floor(Math.random()*n));return t};function c(){return function(e){var t=("; "+document.cookie).split("; "+e+"=");if(2===t.length)return t.pop().split(";").shift()}("csrftoken")}function u(e,t){switch(r=t,Object.prototype.toString.call(r).slice(8,-1).toLowerCase()){case"object":return Object.keys(t).map((function(r){return e.append(r,t[r])}));case"array":return t.map((function(t){e.append(Object.keys(t)[0],Object.values(t)[0])}))}var r}function i(){var e,t={},r={},n=["resultsPerPage","current","offset"],o=new URLSearchParams(document.location.search);return o.delete("search"),o.delete("tab"),e=o.get("sort"),o.delete("sort"),Array.from(o,(function(e){var o=a()(e,2),c=o[0],u=o[1];n.indexOf(c)>-1?r[c]=Number(u):t[c]=u})),[t,e,r]}function s(e,t){var r=new URLSearchParams;""!==t.tab&&(r.set("tab",t.tab),t.filters&&Object.keys(t.filters).length>0&&u(r,t.filters)),t.search&&r.set("search",t.search),t.sort&&r.set("sort",t.sort),history.pushState(null,"Search",e+r.toString())}function l(e,t,r){return e?{label:t,type:r,options:Object.keys(e).map((function(t){return[t,t+"("+e[t]+")"]}))}:{}}},58:function(e,t,r){"use strict";r.d(t,"a",(function(){return u}));var n=r(2),a=r.n(n),o=r(0),c=r.n(o);function u(e){var t=e.setSearchTerm,r=e.searchTerm,n=e.placeholder,u=Object(o.useState)(r),i=a()(u,2),s=i[0],l=i[1],f=Object(o.useState)([]),m=a()(f,2),p=m[0],d=m[1],h=Object(o.useState)(!1),b=a()(h,2),y=b[0],v=b[1],g=Object(o.useState)(""),S=a()(g,2),j=S[0],O=S[1],x=new AbortController;function E(e){var t=e.suggestions;return c.a.createElement("div",{className:"suggestions-list card"},c.a.createElement("header",null,"Live Results:"),t.map((function(e){return c.a.createElement("a",{key:e.url,href:e.url},e.name)})))}return Object(o.useEffect)((function(e){if(s.length>1&&r!==s)return fetch("/search/api/autocomplete/"+s+"/",{method:"GET",signal:x.signal}).then((function(e){if(O(""),e.ok)return e.json();alert("Could not read data: "+e.statusText)})).then((function(e){e&&e.items.length>0?(v(!0),d(e.items)):v(!1)})).catch((function(e){"AbortError"===e.name&&console.log("Fetch was aborted")})),function(e){return x.abort()};v(!1)}),[s]),c.a.createElement("div",{className:"search-bar-big"},c.a.createElement("form",{onSubmit:function(e){e.preventDefault(),t(s),v(!1)}},c.a.createElement("input",{type:"text",className:"form-control",placeholder:n,value:s,onChange:function(e){l(e.target.value)}}),c.a.createElement("span",{className:"search-overlay"},function(e,r){return r||(e?c.a.createElement("span",{className:"clear",onClick:function(e){l(""),t("")}},"Clear Search ",c.a.createElement("span",{className:"icon-cancel"})):void 0)}(s,j)),y?c.a.createElement(E,{suggestions:p}):""))}},84:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),o=r(9),c=r.n(o),u=r(58),i=r(5);function s(){return a.a.createElement(u.a,{search:function(e){var t=new URLSearchParams;if(t.set("tab","resources"),!e)return alert("Please Write Something!"),!1;t.set("search",e),Object(i.a)(t),window.location="/search/?"+t.toString()},state:{placeholder:"Search For Something Specific",q:""}})}c.a.render(a.a.createElement(s,null),document.getElementById("minimal-search-app"))},9:function(e,t){e.exports=ReactDOM}});