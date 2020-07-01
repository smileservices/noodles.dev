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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/dashboard/src/dashboard/App.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/dashboard/src/dashboard/App.js":
/*!********************************************!*\
  !*** ./app/dashboard/src/dashboard/App.js ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _layout_AppLayout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layout/AppLayout */ \"./app/dashboard/src/layout/AppLayout.js\");\n\n\n\n\nfunction Content() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"section\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"section-body contain-lg\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"col-md-8\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"card card-bordered style-primary\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"card-head\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"header\", null, \"Welcome to the dashboard\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"tools\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    className: \"btn btn-icon-toggle btn-close\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"i\", {\n    className: \"md md-close\"\n  }, \" \")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"card-body\"\n  }, \"The main dashboard view\")))));\n}\n\nvar wrapper = document.getElementById(\"app\");\nwrapper ? react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_layout_AppLayout__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n  content: Content\n}), wrapper) : null;\n\n//# sourceURL=webpack:///./app/dashboard/src/dashboard/App.js?");

/***/ }),

/***/ "./app/dashboard/src/layout/AppLayout.js":
/*!***********************************************!*\
  !*** ./app/dashboard/src/layout/AppLayout.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return AppLayout; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _src_components_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/components/utils */ \"./app/src/components/utils.js\");\n/* harmony import */ var _SideBarLayout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SideBarLayout */ \"./app/dashboard/src/layout/SideBarLayout.js\");\n/* harmony import */ var _TopBarLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TopBarLayout */ \"./app/dashboard/src/layout/TopBarLayout.js\");\n/* harmony import */ var _ContentLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ContentLayout */ \"./app/dashboard/src/layout/ContentLayout.js\");\n\n\n\n\n\nfunction AppLayout(props) {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    key: Object(_src_components_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(8)\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"header\", {\n    id: \"header\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TopBarLayout__WEBPACK_IMPORTED_MODULE_3__[\"default\"], null)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    id: \"base\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ContentLayout__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n    content: props.content\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SideBarLayout__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    links: SIDEBAR_LINKS\n  })));\n}\n\n//# sourceURL=webpack:///./app/dashboard/src/layout/AppLayout.js?");

/***/ }),

/***/ "./app/dashboard/src/layout/ContentLayout.js":
/*!***************************************************!*\
  !*** ./app/dashboard/src/layout/ContentLayout.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ContentLayout; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction ContentLayout(props) {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    id: \"content\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(props.content, null));\n}\n\n//# sourceURL=webpack:///./app/dashboard/src/layout/ContentLayout.js?");

/***/ }),

/***/ "./app/dashboard/src/layout/SideBarLayout.js":
/*!***************************************************!*\
  !*** ./app/dashboard/src/layout/SideBarLayout.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SideBarLayout; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _src_components_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/components/utils */ \"./app/src/components/utils.js\");\n\n\n\nfunction SideBarLink(_ref) {\n  var url = _ref.url,\n      text = _ref.text;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: url\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    className: \"title\"\n  }, gettext(text))));\n}\n\nfunction SideBarLayout(_ref2) {\n  var links = _ref2.links;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    id: \"menubar\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"menubar-fixed-panel\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    className: \"btn btn-icon-toggle menubar-toggle\",\n    \"data-toggle\": \"menubar\",\n    href: \"javascript:void(0);\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"i\", {\n    className: \"fa fa-bars\"\n  }, \" \"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"expanded\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    className: \"navbar-brand\",\n    href: ROUTES.homepage\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"img\", {\n    src: \"/static/imgs/rocket.svg\",\n    alt: \"\"\n  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"menubar-scroll-panel\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", {\n    id: \"main-menu\",\n    className: \"gui-controls\"\n  }, links.map(function (link) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SideBarLink, {\n      url: link.url,\n      text: link.text,\n      key: Object(_src_components_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(5)\n    });\n  }))));\n}\n\n//# sourceURL=webpack:///./app/dashboard/src/layout/SideBarLayout.js?");

/***/ }),

/***/ "./app/dashboard/src/layout/TopBarLayout.js":
/*!**************************************************!*\
  !*** ./app/dashboard/src/layout/TopBarLayout.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return TopBarLayout; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _src_components_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../src/components/utils */ \"./app/src/components/utils.js\");\n/* harmony import */ var _src_components_account__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../src/components/account */ \"./app/src/components/account.js\");\n/* harmony import */ var _src_components_SelectLanguageDropdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../src/components/SelectLanguageDropdown */ \"./app/src/components/SelectLanguageDropdown.js\");\n/* harmony import */ var _src_components_AccountDropdownMenu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../src/components/AccountDropdownMenu */ \"./app/src/components/AccountDropdownMenu.js\");\n\n\n\n\n\nfunction TopBarLayout(props) {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"headerbar\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"headerbar-left\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", {\n    className: \"header-nav header-nav-options\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", {\n    className: \"header-nav-brand\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"brand-holder\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    className: \"navbar-brand\",\n    href: ROUTES.homepage\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"img\", {\n    src: \"/static/imgs/rocket.svg\",\n    alt: \"\"\n  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    className: \"btn btn-icon-toggle menubar-toggle\",\n    \"data-toggle\": \"menubar\",\n    href: \"javascript:void(0);\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"i\", {\n    className: \"fa fa-bars\"\n  }, \" \"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"headerbar-right\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", {\n    className: \"header-nav header-nav-options\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_SelectLanguageDropdown__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n    key: Object(_src_components_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(7)\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", {\n    className: \"header-nav header-nav-profile\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_AccountDropdownMenu__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n    key: Object(_src_components_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(7),\n    logout: _src_components_account__WEBPACK_IMPORTED_MODULE_2__[\"logout\"]\n  }))));\n}\n\n//# sourceURL=webpack:///./app/dashboard/src/layout/TopBarLayout.js?");

/***/ }),

/***/ "./app/src/components/AccountDropdownMenu.js":
/*!***************************************************!*\
  !*** ./app/src/components/AccountDropdownMenu.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ \"./app/src/components/utils.js\");\n/* harmony import */ var react_onclickoutside__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-onclickoutside */ \"./node_modules/react-onclickoutside/dist/react-onclickoutside.es.js\");\n\n\n\n\n\nfunction AccountDropdownMenu(props) {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", {\n    className: \"dropdown\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: \"javascript:void(0);\",\n    className: \"dropdown-toggle ink-reaction\",\n    \"data-toggle\": \"dropdown\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"i\", {\n    className: \"fa fa-user\",\n    \"aria-hidden\": \"true\"\n  }, \" \"), \" \", gettext('Account')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", {\n    className: \"dropdown-menu animation-dock\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", {\n    className: \"dropdown-header\"\n  }, gettext('Account')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: ROUTES.account.settings\n  }, gettext('Settings'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: \"#\",\n    onClick: function onClick() {\n      return props.logout();\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"i\", {\n    className: \"fa fa-fw fa-power-off text-danger\"\n  }, \" \"), \" \", gettext('Logout')))));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (AccountDropdownMenu);\n\n//# sourceURL=webpack:///./app/src/components/AccountDropdownMenu.js?");

/***/ }),

/***/ "./app/src/components/SelectLanguageDropdown.js":
/*!******************************************************!*\
  !*** ./app/src/components/SelectLanguageDropdown.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./app/src/components/utils.js\");\n\n\n\nfunction SelectLanguageDropdown(props) {\n  var changeLanguage = function changeLanguage(languageId) {\n    document.cookie = \"django_language=\" + languageId + \";path=/;max-age=\" + 60 * 60 * 24 * 365;\n    document.location.reload();\n  };\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", {\n    className: \"dropdown\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: \"javascript:void(0);\",\n    className: \"dropdown-toggle ink-reaction\",\n    \"data-toggle\": \"dropdown\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"i\", {\n    className: \"fa fa-language\",\n    \"aria-hidden\": \"true\"\n  }, \" \"), \" \", gettext('Language')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"ul\", {\n    className: \"dropdown-menu animation-dock\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", {\n    className: \"dropdown-header\"\n  }, gettext('Select language')), LANGUAGES.map(function (language) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"li\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n      className: language.id === LANGUAGE_CODE ? \"selected\" : \"\",\n      onClick: function onClick(event) {\n        event.preventDefault();\n        changeLanguage(language.id);\n      },\n      key: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(7)\n    }, language.text));\n  })));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (SelectLanguageDropdown);\n\n//# sourceURL=webpack:///./app/src/components/SelectLanguageDropdown.js?");

/***/ }),

/***/ "./app/src/components/account.js":
/*!***************************************!*\
  !*** ./app/src/components/account.js ***!
  \***************************************/
/*! exports provided: logout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"logout\", function() { return logout; });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./app/src/components/utils.js\");\n\nfunction logout() {\n  fetch(ROUTES.account.logout, {\n    method: \"POST\",\n    headers: {\n      'X-CSRFToken': Object(_utils__WEBPACK_IMPORTED_MODULE_0__[\"getCsrfToken\"])()\n    }\n  }).then(function (res) {\n    console.log(res);\n\n    if (res.status === 200) {\n      if (res.redirected) {\n        window.location = res.url;\n      }\n    } else {\n      console.error('Cannot logout!');\n      console.error(res);\n    }\n  });\n}\n\n//# sourceURL=webpack:///./app/src/components/account.js?");

/***/ }),

/***/ "./app/src/components/utils.js":
/*!*************************************!*\
  !*** ./app/src/components/utils.js ***!
  \*************************************/
/*! exports provided: makeId, debounce, getCookie, getCsrfToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"makeId\", function() { return makeId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCookie\", function() { return getCookie; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCsrfToken\", function() { return getCsrfToken; });\nvar makeId = function makeId(length) {\n  var result = '';\n  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';\n  var charactersLength = characters.length;\n\n  for (var i = 0; i < length; i++) {\n    result += characters.charAt(Math.floor(Math.random() * charactersLength));\n  }\n\n  return result;\n};\nfunction debounce(func, wait, immediate) {\n  var timeout;\n  return function () {\n    var context = this,\n        args = arguments;\n\n    var later = function later() {\n      timeout = null;\n      if (!immediate) func.apply(context, args);\n    };\n\n    var callNow = immediate && !timeout;\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n    if (callNow) func.apply(context, args);\n  };\n}\nfunction getCookie(name) {\n  var value = \"; \" + document.cookie;\n  var parts = value.split(\"; \" + name + \"=\");\n  if (parts.length === 2) return parts.pop().split(\";\").shift();\n}\nfunction getCsrfToken() {\n  return getCookie('csrftoken');\n}\n\n//# sourceURL=webpack:///./app/src/components/utils.js?");

/***/ }),

/***/ "./node_modules/react-onclickoutside/dist/react-onclickoutside.es.js":
/*!***************************************************************************!*\
  !*** ./node_modules/react-onclickoutside/dist/react-onclickoutside.es.js ***!
  \***************************************************************************/
/*! exports provided: IGNORE_CLASS_NAME, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"IGNORE_CLASS_NAME\", function() { return IGNORE_CLASS_NAME; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nfunction _inheritsLoose(subClass, superClass) {\n  subClass.prototype = Object.create(superClass.prototype);\n  subClass.prototype.constructor = subClass;\n  subClass.__proto__ = superClass;\n}\n\nfunction _objectWithoutProperties(source, excluded) {\n  if (source == null) return {};\n  var target = {};\n  var sourceKeys = Object.keys(source);\n  var key, i;\n\n  for (i = 0; i < sourceKeys.length; i++) {\n    key = sourceKeys[i];\n    if (excluded.indexOf(key) >= 0) continue;\n    target[key] = source[key];\n  }\n\n  if (Object.getOwnPropertySymbols) {\n    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);\n\n    for (i = 0; i < sourceSymbolKeys.length; i++) {\n      key = sourceSymbolKeys[i];\n      if (excluded.indexOf(key) >= 0) continue;\n      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;\n      target[key] = source[key];\n    }\n  }\n\n  return target;\n}\n\n/**\n * Check whether some DOM node is our Component's node.\n */\nfunction isNodeFound(current, componentNode, ignoreClass) {\n  if (current === componentNode) {\n    return true;\n  } // SVG <use/> elements do not technically reside in the rendered DOM, so\n  // they do not have classList directly, but they offer a link to their\n  // corresponding element, which can have classList. This extra check is for\n  // that case.\n  // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement\n  // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17\n\n\n  if (current.correspondingElement) {\n    return current.correspondingElement.classList.contains(ignoreClass);\n  }\n\n  return current.classList.contains(ignoreClass);\n}\n/**\n * Try to find our node in a hierarchy of nodes, returning the document\n * node as highest node if our node is not found in the path up.\n */\n\nfunction findHighest(current, componentNode, ignoreClass) {\n  if (current === componentNode) {\n    return true;\n  } // If source=local then this event came from 'somewhere'\n  // inside and should be ignored. We could handle this with\n  // a layered approach, too, but that requires going back to\n  // thinking in terms of Dom node nesting, running counter\n  // to React's 'you shouldn't care about the DOM' philosophy.\n\n\n  while (current.parentNode) {\n    if (isNodeFound(current, componentNode, ignoreClass)) {\n      return true;\n    }\n\n    current = current.parentNode;\n  }\n\n  return current;\n}\n/**\n * Check if the browser scrollbar was clicked\n */\n\nfunction clickedScrollbar(evt) {\n  return document.documentElement.clientWidth <= evt.clientX || document.documentElement.clientHeight <= evt.clientY;\n}\n\n// ideally will get replaced with external dep\n// when rafrex/detect-passive-events#4 and rafrex/detect-passive-events#5 get merged in\nvar testPassiveEventSupport = function testPassiveEventSupport() {\n  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {\n    return;\n  }\n\n  var passive = false;\n  var options = Object.defineProperty({}, 'passive', {\n    get: function get() {\n      passive = true;\n    }\n  });\n\n  var noop = function noop() {};\n\n  window.addEventListener('testPassiveEventSupport', noop, options);\n  window.removeEventListener('testPassiveEventSupport', noop, options);\n  return passive;\n};\n\nfunction autoInc(seed) {\n  if (seed === void 0) {\n    seed = 0;\n  }\n\n  return function () {\n    return ++seed;\n  };\n}\n\nvar uid = autoInc();\n\nvar passiveEventSupport;\nvar handlersMap = {};\nvar enabledInstances = {};\nvar touchEvents = ['touchstart', 'touchmove'];\nvar IGNORE_CLASS_NAME = 'ignore-react-onclickoutside';\n/**\n * Options for addEventHandler and removeEventHandler\n */\n\nfunction getEventHandlerOptions(instance, eventName) {\n  var handlerOptions = null;\n  var isTouchEvent = touchEvents.indexOf(eventName) !== -1;\n\n  if (isTouchEvent && passiveEventSupport) {\n    handlerOptions = {\n      passive: !instance.props.preventDefault\n    };\n  }\n\n  return handlerOptions;\n}\n/**\n * This function generates the HOC function that you'll use\n * in order to impart onOutsideClick listening to an\n * arbitrary component. It gets called at the end of the\n * bootstrapping code to yield an instance of the\n * onClickOutsideHOC function defined inside setupHOC().\n */\n\n\nfunction onClickOutsideHOC(WrappedComponent, config) {\n  var _class, _temp;\n\n  var componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';\n  return _temp = _class =\n  /*#__PURE__*/\n  function (_Component) {\n    _inheritsLoose(onClickOutside, _Component);\n\n    function onClickOutside(props) {\n      var _this;\n\n      _this = _Component.call(this, props) || this;\n\n      _this.__outsideClickHandler = function (event) {\n        if (typeof _this.__clickOutsideHandlerProp === 'function') {\n          _this.__clickOutsideHandlerProp(event);\n\n          return;\n        }\n\n        var instance = _this.getInstance();\n\n        if (typeof instance.props.handleClickOutside === 'function') {\n          instance.props.handleClickOutside(event);\n          return;\n        }\n\n        if (typeof instance.handleClickOutside === 'function') {\n          instance.handleClickOutside(event);\n          return;\n        }\n\n        throw new Error(\"WrappedComponent: \" + componentName + \" lacks a handleClickOutside(event) function for processing outside click events.\");\n      };\n\n      _this.__getComponentNode = function () {\n        var instance = _this.getInstance();\n\n        if (config && typeof config.setClickOutsideRef === 'function') {\n          return config.setClickOutsideRef()(instance);\n        }\n\n        if (typeof instance.setClickOutsideRef === 'function') {\n          return instance.setClickOutsideRef();\n        }\n\n        return Object(react_dom__WEBPACK_IMPORTED_MODULE_1__[\"findDOMNode\"])(instance);\n      };\n\n      _this.enableOnClickOutside = function () {\n        if (typeof document === 'undefined' || enabledInstances[_this._uid]) {\n          return;\n        }\n\n        if (typeof passiveEventSupport === 'undefined') {\n          passiveEventSupport = testPassiveEventSupport();\n        }\n\n        enabledInstances[_this._uid] = true;\n        var events = _this.props.eventTypes;\n\n        if (!events.forEach) {\n          events = [events];\n        }\n\n        handlersMap[_this._uid] = function (event) {\n          if (_this.componentNode === null) return;\n\n          if (_this.props.preventDefault) {\n            event.preventDefault();\n          }\n\n          if (_this.props.stopPropagation) {\n            event.stopPropagation();\n          }\n\n          if (_this.props.excludeScrollbar && clickedScrollbar(event)) return;\n          var current = event.target;\n\n          if (findHighest(current, _this.componentNode, _this.props.outsideClickIgnoreClass) !== document) {\n            return;\n          }\n\n          _this.__outsideClickHandler(event);\n        };\n\n        events.forEach(function (eventName) {\n          document.addEventListener(eventName, handlersMap[_this._uid], getEventHandlerOptions(_this, eventName));\n        });\n      };\n\n      _this.disableOnClickOutside = function () {\n        delete enabledInstances[_this._uid];\n        var fn = handlersMap[_this._uid];\n\n        if (fn && typeof document !== 'undefined') {\n          var events = _this.props.eventTypes;\n\n          if (!events.forEach) {\n            events = [events];\n          }\n\n          events.forEach(function (eventName) {\n            return document.removeEventListener(eventName, fn, getEventHandlerOptions(_this, eventName));\n          });\n          delete handlersMap[_this._uid];\n        }\n      };\n\n      _this.getRef = function (ref) {\n        return _this.instanceRef = ref;\n      };\n\n      _this._uid = uid();\n      return _this;\n    }\n    /**\n     * Access the WrappedComponent's instance.\n     */\n\n\n    var _proto = onClickOutside.prototype;\n\n    _proto.getInstance = function getInstance() {\n      if (!WrappedComponent.prototype.isReactComponent) {\n        return this;\n      }\n\n      var ref = this.instanceRef;\n      return ref.getInstance ? ref.getInstance() : ref;\n    };\n\n    /**\n     * Add click listeners to the current document,\n     * linked to this component's state.\n     */\n    _proto.componentDidMount = function componentDidMount() {\n      // If we are in an environment without a DOM such\n      // as shallow rendering or snapshots then we exit\n      // early to prevent any unhandled errors being thrown.\n      if (typeof document === 'undefined' || !document.createElement) {\n        return;\n      }\n\n      var instance = this.getInstance();\n\n      if (config && typeof config.handleClickOutside === 'function') {\n        this.__clickOutsideHandlerProp = config.handleClickOutside(instance);\n\n        if (typeof this.__clickOutsideHandlerProp !== 'function') {\n          throw new Error(\"WrappedComponent: \" + componentName + \" lacks a function for processing outside click events specified by the handleClickOutside config option.\");\n        }\n      }\n\n      this.componentNode = this.__getComponentNode(); // return early so we dont initiate onClickOutside\n\n      if (this.props.disableOnClickOutside) return;\n      this.enableOnClickOutside();\n    };\n\n    _proto.componentDidUpdate = function componentDidUpdate() {\n      this.componentNode = this.__getComponentNode();\n    };\n    /**\n     * Remove all document's event listeners for this component\n     */\n\n\n    _proto.componentWillUnmount = function componentWillUnmount() {\n      this.disableOnClickOutside();\n    };\n    /**\n     * Can be called to explicitly enable event listening\n     * for clicks and touches outside of this element.\n     */\n\n\n    /**\n     * Pass-through render\n     */\n    _proto.render = function render() {\n      // eslint-disable-next-line no-unused-vars\n      var _props = this.props,\n          excludeScrollbar = _props.excludeScrollbar,\n          props = _objectWithoutProperties(_props, [\"excludeScrollbar\"]);\n\n      if (WrappedComponent.prototype.isReactComponent) {\n        props.ref = this.getRef;\n      } else {\n        props.wrappedRef = this.getRef;\n      }\n\n      props.disableOnClickOutside = this.disableOnClickOutside;\n      props.enableOnClickOutside = this.enableOnClickOutside;\n      return Object(react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"])(WrappedComponent, props);\n    };\n\n    return onClickOutside;\n  }(react__WEBPACK_IMPORTED_MODULE_0__[\"Component\"]), _class.displayName = \"OnClickOutside(\" + componentName + \")\", _class.defaultProps = {\n    eventTypes: ['mousedown', 'touchstart'],\n    excludeScrollbar: config && config.excludeScrollbar || false,\n    outsideClickIgnoreClass: IGNORE_CLASS_NAME,\n    preventDefault: false,\n    stopPropagation: false\n  }, _class.getClass = function () {\n    return WrappedComponent.getClass ? WrappedComponent.getClass() : WrappedComponent;\n  }, _temp;\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (onClickOutsideHOC);\n\n\n//# sourceURL=webpack:///./node_modules/react-onclickoutside/dist/react-onclickoutside.es.js?");

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