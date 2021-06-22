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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/frontend/src/navbar/NavbarApp.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/frontend/src/navbar/NavbarApp.js":
/*!**********************************************!*\
  !*** ./app/frontend/src/navbar/NavbarApp.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\n\nvar WAITING = 'WAITING';\nvar AUTHENTICATED = 'AUTHENTICATED';\nvar UNAUTHENTICATED = 'UNAUTHENTICATED';\nvar AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';\nvar MENU_ACTION = 'MENU_ACTION';\nvar initialState = {\n  authenticated: false,\n  error: false\n};\n\nvar reducer = function reducer(state, _ref) {\n  var type = _ref.type,\n      payload = _ref.payload;\n\n  switch (type) {\n    case WAITING:\n      return {\n        waiting: true\n      };\n\n    case AUTHENTICATED:\n      return {\n        authenticated: true,\n        user_data: payload,\n        open_menu: ''\n      };\n\n    case UNAUTHENTICATED:\n      return {\n        authenticated: false,\n        error: false\n      };\n\n    case AUTHENTICATION_ERROR:\n      return {\n        authenticated: false,\n        error: payload\n      };\n\n    case MENU_ACTION:\n      if (state.open_menu === payload) {\n        return _objectSpread(_objectSpread({}, state), {}, {\n          open_menu: ''\n        });\n      } else {\n        return _objectSpread(_objectSpread({}, state), {}, {\n          open_menu: payload\n        });\n      }\n\n  }\n};\n\nvar USER_DATA_KEY = 'user_data';\nvar user_data = window.sessionStorage ? window.sessionStorage.getItem(USER_DATA_KEY) : null;\n\nfunction NavbarApp() {\n  /*\n  * Handle the Navbar App: login/logout, notifications\n  * == Login/Logout\n  * -- check cookie to see if user is authenticated\n  * -- if authenticated, show logout button, profile dropdown menu\n  * -- if logout/login, refresh page\n  * -- if click login, show login modal\n  * */\n  var _useReducer = Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useReducer\"])(reducer, _objectSpread({}, initialState)),\n      _useReducer2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useReducer, 2),\n      state = _useReducer2[0],\n      dispatch = _useReducer2[1];\n\n  Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useEffect\"])(function (e) {\n    //check for user_data in sessionStorage\n    if (user_data) {\n      if (user_data === 'unauthenticated') {\n        dispatch({\n          type: UNAUTHENTICATED\n        });\n      } else {\n        dispatch({\n          type: AUTHENTICATED,\n          payload: data\n        });\n      }\n    } else {\n      // if user_data does not exist, check server\n      dispatch({\n        type: WAITING\n      });\n      fetch(URL_ACCOUNT, {\n        method: 'GET'\n      }).then(function (response) {\n        if (response.ok) return response.json();\n\n        if (response.status === 403) {\n          dispatch({\n            type: UNAUTHENTICATED\n          });\n          window.sessionStorage.setItem(USER_DATA_KEY, 'unauthenticated');\n          return false;\n        } else {\n          dispatch({\n            type: AUTHENTICATION_ERROR,\n            payload: 'Server respondes with status code' + response.status + ': ' + response.statusText\n          });\n        }\n      }).then(function (data) {\n        if (!data) return false;\n        window.sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(data));\n        dispatch({\n          type: AUTHENTICATED,\n          payload: data\n        });\n      });\n    }\n  }, []);\n  if (state.waiting) return '';\n\n  if (!state.authenticated) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2__[\"Fragment\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      href: URL_LOGIN,\n      rel: \"nofollow noopener\",\n      className: \"btn secondary login-button\"\n    }, \"Login\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      href: URL_LOGIN,\n      rel: \"nofollow noopener\",\n      className: \"btn signup-button\"\n    }, \"Sign Up\"));\n  } else {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"div\", {\n      className: \"right-side\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"div\", {\n      className: \"dropdown\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"span\", {\n      className: \"dropdown-button\",\n      onClick: function onClick(e) {\n        return dispatch({\n          type: MENU_ACTION,\n          payload: 'user'\n        });\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"svg\", {\n      width: \"36\",\n      height: \"36\",\n      viewBox: \"0 0 36 36\",\n      fill: \"none\",\n      xmlns: \"http://www.w3.org/2000/svg\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"mask\", {\n      id: \"mask0\",\n      \"mask-type\": \"alpha\",\n      maskUnits: \"userSpaceOnUse\",\n      x: \"0\",\n      y: \"0\",\n      width: \"36\",\n      height: \"36\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"circle\", {\n      cx: \"18\",\n      cy: \"18\",\n      r: \"18\",\n      fill: \"#F9F8F8\"\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"g\", {\n      mask: \"url(#mask0)\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"circle\", {\n      cx: \"18\",\n      cy: \"18\",\n      r: \"18\",\n      fill: \"black\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"ellipse\", {\n      cx: \"17.5\",\n      cy: \"35\",\n      rx: \"18.5\",\n      ry: \"9\",\n      fill: \"#0348B0\"\n    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"circle\", {\n      cx: \"18\",\n      cy: \"16\",\n      r: \"9\",\n      fill: \"#0348B0\"\n    })))), state.open_menu === 'user' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"div\", {\n      className: \"dropdown-menu\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      rel: \"nofollow noopener\",\n      href: URL_LOGOUT,\n      id: \"signout_button\"\n    }, \"Sign Out\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      rel: \"nofollow noopener\",\n      href: URL_PROFILE_EDIT\n    }, \"Account\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      rel: \"nofollow noopener\",\n      href: URL_MY_PROFILE\n    }, \"My Profile\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      rel: \"nofollow noopener\",\n      href: URL_MY_RESOURCES\n    }, \"My Resources\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      rel: \"nofollow noopener\",\n      href: URL_MY_REVIEWS\n    }, \"My Reviews\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      rel: \"nofollow noopener\",\n      href: URL_MY_COLLECTIONS\n    }, \"My Collections\")) : ''), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"div\", {\n      className: \"dropdown\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"span\", {\n      className: \"btn create dropdown-button\",\n      onClick: function onClick(e) {\n        return dispatch({\n          type: MENU_ACTION,\n          payload: 'create'\n        });\n      }\n    }, \"Create\"), state.open_menu === 'create' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"div\", {\n      className: \"dropdown-menu\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      rel: \"nofollow noopener\",\n      href: URL_CREATE_RESOURCE\n    }, \"Learning Resource\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"a\", {\n      rel: \"nofollow noopener\",\n      href: URL_CREATE_TECHNOLOGY\n    }, \"Technology\")) : ''));\n  }\n}\n\nreact_dom__WEBPACK_IMPORTED_MODULE_3___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(NavbarApp, null), document.getElementById('navbar-app'));\n\n//# sourceURL=webpack:///./app/frontend/src/navbar/NavbarApp.js?");

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

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _defineProperty(obj, key, value) {\n  if (key in obj) {\n    Object.defineProperty(obj, key, {\n      value: value,\n      enumerable: true,\n      configurable: true,\n      writable: true\n    });\n  } else {\n    obj[key] = value;\n  }\n\n  return obj;\n}\n\nmodule.exports = _defineProperty;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/defineProperty.js?");

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