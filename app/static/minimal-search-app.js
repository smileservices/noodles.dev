/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/search/src/MinimalSearchApp.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/search/src/MinimalSearchApp.js":
/*!********************************************!*\
  !*** ./app/search/src/MinimalSearchApp.js ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _search_src_SearchBarComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../search/src/SearchBarComponent */ \"./app/search/src/SearchBarComponent.js\");\n/* harmony import */ var _src_components_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/components/utils */ \"./app/src/components/utils.js\");\n\n\n\n\n\nfunction MinimalSearchApp() {\n  /*\n  *   Just a minimal searchbar\n  */\n  var SEARCH_URL = '/search/';\n\n  function setSearch(term) {\n    // this gets all search params (tab, term, filters) and redirects to the search page\n    var params = new URLSearchParams();\n    params.set('tab', 'resources');\n\n    if (term) {\n      params.set('search', term);\n    } else {\n      alert('Please Write Something!');\n      return false;\n    }\n\n    Object(_src_components_utils__WEBPACK_IMPORTED_MODULE_3__[\"codeParamsToUrl\"])(params);\n    window.location = SEARCH_URL + '?' + params.toString();\n  }\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_search_src_SearchBarComponent__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    search: setSearch,\n    state: {\n      placeholder: 'Search For Something Specific',\n      q: ''\n    }\n  });\n}\n\nreact_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(MinimalSearchApp, null), document.getElementById('minimal-search-app'));\n\n//# sourceURL=webpack:///./app/search/src/MinimalSearchApp.js?");

/***/ }),

/***/ "./app/search/src/SearchBarComponent.js":
/*!**********************************************!*\
  !*** ./app/search/src/SearchBarComponent.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SearchBarComponentWithInstantResults; });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction SearchBarComponentWithInstantResults(_ref) {\n  var setSearchTerm = _ref.setSearchTerm,\n      searchTerm = _ref.searchTerm,\n      placeholder = _ref.placeholder;\n\n  /*\n  * search - search function to be executed when submiting search\n  * state - {q: search term, placeholder: placeholder text}\n  *\n  * */\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(searchTerm),\n      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),\n      formData = _useState2[0],\n      setFormData = _useState2[1];\n\n  var searchInputRef = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useRef\"])(null);\n  Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useEffect\"])(function (e) {\n    searchInputRef.current.focus();\n  });\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n    className: \"search-bar-big\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"form\", {\n    onSubmit: function onSubmit(e) {\n      e.preventDefault();\n      setSearchTerm(formData);\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"input\", {\n    type: \"text\",\n    className: \"search-input\",\n    placeholder: placeholder,\n    value: formData,\n    onChange: function onChange(e) {\n      setFormData(e.target.value);\n    },\n    ref: searchInputRef\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n    className: \"search-overlay\"\n  }, formData ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n    className: \"clear\",\n    onClick: function onClick(e) {\n      setFormData('');\n      setSearchTerm('');\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n    className: \"icon-cancel\"\n  })) : '')));\n}\n\n//# sourceURL=webpack:///./app/search/src/SearchBarComponent.js?");

/***/ }),

/***/ "./app/src/components/utils.js":
/*!*************************************!*\
  !*** ./app/src/components/utils.js ***!
  \*************************************/
/*! exports provided: makeId, debounce, getCookie, getCsrfToken, extractURLParams, whatType, codeParamsToUrl, decodeParamsFromUrl, updateUrl, getAvailableFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"makeId\", function() { return makeId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCookie\", function() { return getCookie; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCsrfToken\", function() { return getCsrfToken; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"extractURLParams\", function() { return extractURLParams; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"whatType\", function() { return whatType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"codeParamsToUrl\", function() { return codeParamsToUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"decodeParamsFromUrl\", function() { return decodeParamsFromUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateUrl\", function() { return updateUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAvailableFilters\", function() { return getAvailableFilters; });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n\nvar makeId = function makeId(length) {\n  var result = '';\n  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';\n  var charactersLength = characters.length;\n\n  for (var i = 0; i < length; i++) {\n    result += characters.charAt(Math.floor(Math.random() * charactersLength));\n  }\n\n  return result;\n};\nfunction debounce(func, wait, immediate) {\n  var timeout;\n  return function () {\n    var context = this,\n        args = arguments;\n\n    var later = function later() {\n      timeout = null;\n      if (!immediate) func.apply(context, args);\n    };\n\n    var callNow = immediate && !timeout;\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n    if (callNow) func.apply(context, args);\n  };\n}\nfunction getCookie(name) {\n  var value = \"; \" + document.cookie;\n  var parts = value.split(\"; \" + name + \"=\");\n  if (parts.length === 2) return parts.pop().split(\";\").shift();\n}\nfunction getCsrfToken() {\n  return getCookie('csrftoken');\n}\nfunction extractURLParams(str) {\n  if (str === '') return false;\n  var params = {};\n  var unparsed_params = str.split(\"?\").pop().split(\"&\");\n  unparsed_params.map(function (p) {\n    var p_arr = p.split('=');\n    if (p_arr[1] !== '') params[p_arr[0]] = p_arr[1];\n  });\n  return params;\n}\nfunction whatType(item) {\n  var typeStr = Object.prototype.toString.call(item).slice(8, -1);\n  return typeStr.toLowerCase();\n}\nfunction codeParamsToUrl(params, data) {\n  switch (whatType(data)) {\n    case 'object':\n      return Object.keys(data).map(function (name) {\n        return params.append(name, data[name]);\n      });\n\n    case 'array':\n      return data.map(function (f) {\n        params.append(Object.keys(f)[0], Object.values(f)[0]);\n      });\n  }\n}\nfunction decodeParamsFromUrl() {\n  var filters = {};\n  var sorting = '';\n  var pagination = {};\n  var paginationParamNames = ['resultsPerPage', 'current', 'offset'];\n  var urlParams = new URLSearchParams(document.location.search);\n  urlParams[\"delete\"]('search');\n  urlParams[\"delete\"]('tab');\n  sorting = urlParams.get('sort');\n  urlParams[\"delete\"]('sort');\n  Array.from(urlParams, function (_ref) {\n    var _ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 2),\n        key = _ref2[0],\n        value = _ref2[1];\n\n    var f = {};\n\n    if (paginationParamNames.indexOf(key) > -1) {\n      pagination[key] = Number(value);\n    } else {\n      filters[key] = value;\n    }\n  });\n  return [filters, sorting, pagination];\n}\nfunction updateUrl(url, params) {\n  /*\n  * url = string;\n  * params = {search: searchTerm, tab: tabName, filters: filters,...}\n  * */\n  var paramsObj = new URLSearchParams(); // this is to be populated from scratch\n\n  if (params['tab'] !== '') {\n    paramsObj.set('tab', params['tab']); // process filters per tab only!\n\n    if (params['filters'] && Object.keys(params['filters']).length > 0) {\n      codeParamsToUrl(paramsObj, params['filters']);\n    }\n  }\n\n  if (params['search']) {\n    paramsObj.set('search', params['search']);\n  }\n\n  if (params['sort']) {\n    paramsObj.set('sort', params['sort']);\n  }\n\n  history.pushState(null, 'Search', url + paramsObj.toString());\n}\nfunction getAvailableFilters(aggregated, label, type) {\n  if (!aggregated) return {};\n  /*\n  * filtername: string\n  * aggregated: [{value: itemsCount}, ...]\n  *\n  * returns {label: string, type: string, options: [[value, text],...]}, ...}\n  * */\n\n  return {\n    label: label,\n    type: type,\n    options: Object.keys(aggregated).map(function (value) {\n      return [value, value + '(' + aggregated[value] + ')'];\n    })\n  };\n}\n\n//# sourceURL=webpack:///./app/src/components/utils.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _arrayLikeToArray(arr, len) {\n  if (len == null || len > arr.length) len = arr.length;\n\n  for (var i = 0, arr2 = new Array(len); i < len; i++) {\n    arr2[i] = arr[i];\n  }\n\n  return arr2;\n}\n\nmodule.exports = _arrayLikeToArray;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/arrayLikeToArray.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _arrayWithHoles(arr) {\n  if (Array.isArray(arr)) return arr;\n}\n\nmodule.exports = _arrayWithHoles;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/arrayWithHoles.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _iterableToArrayLimit(arr, i) {\n  if (typeof Symbol === \"undefined\" || !(Symbol.iterator in Object(arr))) return;\n  var _arr = [];\n  var _n = true;\n  var _d = false;\n  var _e = undefined;\n\n  try {\n    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {\n      _arr.push(_s.value);\n\n      if (i && _arr.length === i) break;\n    }\n  } catch (err) {\n    _d = true;\n    _e = err;\n  } finally {\n    try {\n      if (!_n && _i[\"return\"] != null) _i[\"return\"]();\n    } finally {\n      if (_d) throw _e;\n    }\n  }\n\n  return _arr;\n}\n\nmodule.exports = _iterableToArrayLimit;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _nonIterableRest() {\n  throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");\n}\n\nmodule.exports = _nonIterableRest;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/nonIterableRest.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles */ \"./node_modules/@babel/runtime/helpers/arrayWithHoles.js\");\n\nvar iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit */ \"./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js\");\n\nvar unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray */ \"./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js\");\n\nvar nonIterableRest = __webpack_require__(/*! ./nonIterableRest */ \"./node_modules/@babel/runtime/helpers/nonIterableRest.js\");\n\nfunction _slicedToArray(arr, i) {\n  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();\n}\n\nmodule.exports = _slicedToArray;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/slicedToArray.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray */ \"./node_modules/@babel/runtime/helpers/arrayLikeToArray.js\");\n\nfunction _unsupportedIterableToArray(o, minLen) {\n  if (!o) return;\n  if (typeof o === \"string\") return arrayLikeToArray(o, minLen);\n  var n = Object.prototype.toString.call(o).slice(8, -1);\n  if (n === \"Object\" && o.constructor) n = o.constructor.name;\n  if (n === \"Map\" || n === \"Set\") return Array.from(o);\n  if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);\n}\n\nmodule.exports = _unsupportedIterableToArray;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = React;\n\n//# sourceURL=webpack:///external_%22React%22?");

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = ReactDOM;\n\n//# sourceURL=webpack:///external_%22ReactDOM%22?");

/***/ })

/******/ });