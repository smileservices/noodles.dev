!function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=80)}({0:function(e,t){e.exports=React},2:function(e,t,n){var a=n(34),r=n(35),c=n(28),i=n(36);e.exports=function(e,t){return a(e)||r(e,t)||c(e,t)||i()}},24:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var a=n(0),r=n.n(a),c=n(5),i=function(e){var t=e.size;return r.a.createElement("div",{className:"skeleton header "+t})};function l(e,t){var n="";switch(e){case"filter":n=function(){return r.a.createElement("div",{className:"skeleton filter-select"})};break;case"result":n=function(){return r.a.createElement("div",{className:"skeleton result"})};break;case"review":n=function(){return r.a.createElement("div",{className:"skeleton review"})};break;case"tag":n=function(){return r.a.createElement("span",{className:"skeleton tag"})};break;case"header":return[r.a.createElement(i,{key:Object(c.e)(4),size:t})];case"sidebar-tech":n=function(){return r.a.createElement("span",null)};break;default:alert("Cannot find Skeleton Element of name "+e)}var a=[],l=0;do{a.push(r.a.createElement(n,{key:Object(c.e)(4)})),l+=1}while(l<t);return a}},28:function(e,t,n){var a=n(29);e.exports=function(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}},29:function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}},34:function(e,t){e.exports=function(e){if(Array.isArray(e))return e}},35:function(e,t){e.exports=function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],a=!0,r=!1,c=void 0;try{for(var i,l=e[Symbol.iterator]();!(a=(i=l.next()).done)&&(n.push(i.value),!t||n.length!==t);a=!0);}catch(e){r=!0,c=e}finally{try{a||null==l.return||l.return()}finally{if(r)throw c}}return n}}},36:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},38:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var a=n(2),r=n.n(a),c=n(0),i=n.n(c);function l(e){var t=e.fullText,n=e.charLimit,a=e.action,l=Object(c.useState)(!1),o=r()(l,2),s=o[0],u=o[1];return t.length<=n?t:s?i.a.createElement(c.Fragment,null,t,i.a.createElement("span",{className:"read-more",onClick:function(e){return u(!1)}},"hide")):i.a.createElement(c.Fragment,null,t.substring(0,n),"...",i.a.createElement("span",{className:"read-more",onClick:function(e){return a||u(!0)}},"show more"))}},43:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var a=n(0),r=n.n(a);function c(e){for(var t=e.rating,n=e.maxRating,c=e.ratingChange,i=e.isDisabled,l=[],o=function(e){var n=e<=t?"icon-star-full":"icon-star-empty";l.push(r.a.createElement("span",{key:"rating-star"+e,className:n,onClick:c&&!i?function(t){return c(e)}:null}))},s=1;s<=n;s++)o(s);return r.a.createElement(a.Fragment,null,l.map((function(e){return e})))}},5:function(e,t,n){"use strict";n.d(t,"e",(function(){return c})),n.d(t,"d",(function(){return i})),n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return o})),n.d(t,"f",(function(){return s})),n.d(t,"c",(function(){return u}));var a=n(2),r=n.n(a),c=function(e){for(var t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=n.length,r=0;r<e;r++)t+=n.charAt(Math.floor(Math.random()*a));return t};function i(){return function(e){var t=("; "+document.cookie).split("; "+e+"=");if(2===t.length)return t.pop().split(";").shift()}("csrftoken")}function l(e,t){switch(n=t,Object.prototype.toString.call(n).slice(8,-1).toLowerCase()){case"object":return Object.keys(t).map((function(n){return e.append(n,t[n])}));case"array":return t.map((function(t){e.append(Object.keys(t)[0],Object.values(t)[0])}))}var n}function o(){var e,t={},n={},a=["resultsPerPage","current","offset"],c=new URLSearchParams(document.location.search);return c.delete("search"),c.delete("tab"),e=c.get("sort_by"),c.delete("sort_by"),Array.from(c,(function(e){var c=r()(e,2),i=c[0],l=c[1];a.indexOf(i)>-1?n[i]=Number(l):t[i]=l})),[t,e,n]}function s(e,t){var n=new URLSearchParams;""!==t.tab&&(n.set("tab",t.tab),Object.keys(t.filters).length>0&&l(n,t.filters)),""!==t.search&&n.set("search",t.search),history.pushState(null,"Search",e+n.toString())}function u(e,t,n){return e?{label:t,type:n,options:Object.keys(e).map((function(t){return[t,t+"("+e[t]+")"]}))}:{}}},52:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var a=n(0),r=n.n(a),c=n(43);function i(e){var t=e.data,n=e.maxRating;return t.rating?r.a.createElement("div",{className:"rating"},r.a.createElement("span",{className:"stars"},r.a.createElement(c.a,{maxRating:n,rating:t.rating})),r.a.createElement("span",{itemProp:"ratingCount"},t.reviews_count," Reviews")):r.a.createElement("div",{className:"rating"},r.a.createElement("span",{itemProp:"ratingCount"},"No Reviews Yet. ",r.a.createElement("a",{href:t.url},"Contribute")))}},53:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var a=n(0),r=n.n(a),c=n(52),i=n(38),l=r.a.createElement("svg",{viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("path",{d:"M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z",fill:"black"}));function o(e){var t=e.data,n=e.addFilter;return r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"result resource"},r.a.createElement("div",{className:"left"},r.a.createElement("div",{className:"tags"},t.technologies.map((function(e){return r.a.createElement("a",{key:e.url,href:e.url,className:"tech"},l," ",e.name," ",e.version)})),r.a.createElement("span",{onClick:function(e){n("category",t.category)}},t.category),r.a.createElement("span",{onClick:function(e){return n("experience_level",t.experience_level)}},t.experience_level)),r.a.createElement("div",{className:"listing-title"},r.a.createElement("h4",{className:"title",itemProp:"name"},r.a.createElement("a",{href:t.url},t.name)),r.a.createElement("span",{className:"published"},t.publication_date," By ",t.published_by),r.a.createElement("div",{className:"tags"},r.a.createElement("span",{onClick:function(e){return n("media",t.media)}},t.media))),r.a.createElement("div",{className:"description"},r.a.createElement(i.a,{fullText:t.summary,charLimit:250})),r.a.createElement("div",{className:"tags"},t.tags.map((function(e){return r.a.createElement("span",{key:"tag"+e,onClick:function(t){return n("tags",e)},className:"tag"},"#",e)}))),r.a.createElement(c.a,{data:t,maxRating:5})),t.image?r.a.createElement("div",{className:"right"},r.a.createElement("div",{className:"image"},r.a.createElement("a",{itemProp:"name",href:t.url},r.a.createElement("img",{className:"primary-image",src:t.image.small,alt:""})))):""))}},61:function(e,t,n){"use strict";n.d(t,"a",(function(){return m}));var a=n(2),r=n.n(a),c=n(0),i=n.n(c),l=n(53),o=n(24),s=React.createElement(c.Fragment,null,Object(o.a)("header","sm"),React.createElement("div",{className:"tags"},Object(o.a)("tag",3)),Object(o.a)("header","sm"),React.createElement("div",{className:"tags"},Object(o.a)("tag",3)),Object(o.a)("header","sm"),Object(o.a)("result",4)),u=i.a.createElement("svg",{viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},i.a.createElement("path",{d:"M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z",fill:"black"}));function m(e){var t=e.addFilter,n=Object(c.useState)({}),a=r()(n,2),o=a[0],m=a[1],f=Object(c.useState)(!0),d=r()(f,2),g=d[0],p=d[1];Object(c.useEffect)((function(e){fetch("/search/api/related/",{method:"GET"}).then((function(e){if(p(!1),e.ok)return e.json()})).then((function(e){m(e)}))}),[]);var v=t?function(e){return t("tech_v",e)}:function(e){return window.location="/search/?tab=resources&tech_v="+e},h=t?function(e){return t("tags",e)}:function(e,t){return window.location="/search/?tab="+t+"&tags="+e},b=t||function(e,t){return window.location="/search/?tab=resources&"+e+"="+t};return g||0===Object.keys(o).length?s:i.a.createElement(c.Fragment,null,Object.keys(o.aggregations.technologies).length?i.a.createElement(c.Fragment,null,i.a.createElement("h4",null,"Popular Technologies"),i.a.createElement("div",{className:"tags"},Object.keys(o.aggregations.technologies).map((function(e){return i.a.createElement("span",{key:"popular-tech-"+e,className:"tech",onClick:function(t){return v(e)}},u," ",e," (",o.aggregations.technologies[e],")")})))):"",Object.keys(o.aggregations.tags).length?i.a.createElement(c.Fragment,null,i.a.createElement("h4",null,"Tags to follow"),i.a.createElement("div",{className:"tags"},Object.keys(o.aggregations.tags).map((function(e){return i.a.createElement("span",{key:"popular-tag-"+e,onClick:function(t){return h(e,"resources")}},"# ",e," (",o.aggregations.tags[e],")")})))):"",i.a.createElement("h4",null,"Latest Added Resources"),o.resources.items.map((function(e){return i.a.createElement(l.a,{key:"latest-resource-"+e.pk,data:e,addFilter:b})})))}},80:function(e,t,n){"use strict";n.r(t);var a=n(9),r=n.n(a),c=n(61);function i(){return React.createElement(c.a,{addFilter:(e="resources",function(t,n){return window.location="/search/?tab="+e+"&"+t+"="+n})});var e}r.a.render(React.createElement(i,null),document.getElementById("related-app"))},9:function(e,t){e.exports=ReactDOM}});