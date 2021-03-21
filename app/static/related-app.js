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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/frontend/src/RelatedApp.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/frontend/src/RelatedApp.js":
/*!****************************************!*\
  !*** ./app/frontend/src/RelatedApp.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _search_src_RelatedComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../search/src/RelatedComponent */ \"./app/search/src/RelatedComponent.js\");\n\n\n\nfunction RelatedApp() {\n  function addFilterFactory(tab) {\n    return function (name, value) {\n      return window.location = '/search/?tab=' + tab + '&' + name + '=' + value;\n    };\n  }\n\n  return /*#__PURE__*/React.createElement(_search_src_RelatedComponent__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n    addFilter: addFilterFactory('resources')\n  });\n}\n\nreact_dom__WEBPACK_IMPORTED_MODULE_0___default.a.render( /*#__PURE__*/React.createElement(RelatedApp, null), document.getElementById('related-app'));\n\n//# sourceURL=webpack:///./app/frontend/src/RelatedApp.js?");

/***/ }),

/***/ "./app/search/src/RelatedComponent.js":
/*!********************************************!*\
  !*** ./app/search/src/RelatedComponent.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return RelatedComponent; });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _study_resource_src_StudyResourceSearchListing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../study_resource/src/StudyResourceSearchListing */ \"./app/study_resource/src/StudyResourceSearchListing.js\");\n/* harmony import */ var _src_components_skeleton_SkeletonLoadingRelatedSection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/components/skeleton/SkeletonLoadingRelatedSection */ \"./app/src/components/skeleton/SkeletonLoadingRelatedSection.js\");\n\n\n\n\nvar flagIcon = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"svg\", {\n  viewBox: \"0 0 12 12\",\n  fill: \"none\",\n  xmlns: \"http://www.w3.org/2000/svg\"\n}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"path\", {\n  d: \"M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z\",\n  fill: \"black\"\n}));\nfunction RelatedComponent(_ref) {\n  var addFilter = _ref.addFilter;\n\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])({}),\n      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),\n      data = _useState2[0],\n      setData = _useState2[1];\n\n  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(true),\n      _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState3, 2),\n      waiting = _useState4[0],\n      setWaiting = _useState4[1];\n\n  Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useEffect\"])(function (e) {\n    fetch('/search/api/related/', {\n      method: 'GET'\n    }).then(function (result) {\n      setWaiting(false);\n\n      if (result.ok) {\n        return result.json();\n      }\n    }).then(function (data) {\n      setData(data);\n    });\n  }, []);\n  var clickTechTag = addFilter ? function (tech) {\n    return addFilter('tech_v', tech);\n  } : function (tech) {\n    return window.location = '/search/?tab=resources&tech_v=' + tech;\n  };\n  var clickTag = addFilter ? function (tag) {\n    return addFilter('tags', tag);\n  } : function (tag, tab) {\n    return window.location = '/search/?tab=' + tab + '&tags=' + tag;\n  };\n  var resourceFilter = addFilter ? addFilter : function (name, value) {\n    return window.location = '/search/?tab=resources&' + name + '=' + value;\n  };\n  if (waiting || Object.keys(data).length === 0) return _src_components_skeleton_SkeletonLoadingRelatedSection__WEBPACK_IMPORTED_MODULE_3__[\"SkeletonLoadingRelatedSection\"];\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, Object.keys(data.aggregations.technologies).length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h4\", null, \"Popular Technologies\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, Object.keys(data.aggregations.technologies).map(function (tech) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n      key: 'popular-tech-' + tech,\n      className: \"tech\",\n      onClick: function onClick(e) {\n        return clickTechTag(tech);\n      }\n    }, flagIcon, \" \", tech, \" (\", data.aggregations.technologies[tech], \")\");\n  }))) : '', Object.keys(data.aggregations.tags).length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h4\", null, \"Tags to follow\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, Object.keys(data.aggregations.tags).map(function (tag) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n      key: 'popular-tag-' + tag,\n      onClick: function onClick(e) {\n        return clickTag(tag, 'resources');\n      }\n    }, \"# \", tag, \" (\", data.aggregations.tags[tag], \")\");\n  }))) : '', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h4\", null, \"Latest Added Resources\"), data.resources.items.map(function (resource) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_study_resource_src_StudyResourceSearchListing__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      key: 'latest-resource-' + resource.pk,\n      data: resource,\n      addFilter: resourceFilter\n    });\n  }));\n}\n\n//# sourceURL=webpack:///./app/search/src/RelatedComponent.js?");

/***/ }),

/***/ "./app/src/components/StarRating.js":
/*!******************************************!*\
  !*** ./app/src/components/StarRating.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return StarRating; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction StarRating(_ref) {\n  var rating = _ref.rating,\n      maxRating = _ref.maxRating,\n      ratingChange = _ref.ratingChange,\n      isDisabled = _ref.isDisabled;\n  var starsArr = [];\n\n  var _loop = function _loop(r) {\n    var className = r <= rating ? 'icon-star-full' : 'icon-star-empty';\n    starsArr.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n      key: 'rating-star' + r,\n      className: className,\n      onClick: ratingChange && !isDisabled ? function (e) {\n        return ratingChange(r);\n      } : null\n    }));\n  };\n\n  for (var r = 1; r <= maxRating; r++) {\n    _loop(r);\n  }\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, starsArr.map(function (starEl) {\n    return starEl;\n  }));\n}\n\n//# sourceURL=webpack:///./app/src/components/StarRating.js?");

/***/ }),

/***/ "./app/src/components/TruncatedTextComponent.js":
/*!******************************************************!*\
  !*** ./app/src/components/TruncatedTextComponent.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return TruncatedTextComponent; });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction TruncatedTextComponent(_ref) {\n  var fullText = _ref.fullText,\n      charLimit = _ref.charLimit,\n      action = _ref.action;\n\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])(false),\n      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),\n      showAll = _useState2[0],\n      setShowAll = _useState2[1];\n\n  if (fullText.length <= charLimit) return fullText;\n\n  if (showAll) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, fullText, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n      className: \"read-more\",\n      onClick: function onClick(e) {\n        return setShowAll(false);\n      }\n    }, \"hide\"));\n  } else {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, fullText.substring(0, charLimit), \"...\", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n      className: \"read-more\",\n      onClick: function onClick(e) {\n        return action ? action : setShowAll(true);\n      }\n    }, \"show more\"));\n  }\n}\n\n//# sourceURL=webpack:///./app/src/components/TruncatedTextComponent.js?");

/***/ }),

/***/ "./app/src/components/skeleton/SkeletonLoadingComponent.js":
/*!*****************************************************************!*\
  !*** ./app/src/components/skeleton/SkeletonLoadingComponent.js ***!
  \*****************************************************************/
/*! exports provided: SkeletonChildrenFactory, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SkeletonChildrenFactory\", function() { return SkeletonChildrenFactory; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SkeletonLoadingComponent; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ \"./app/src/components/utils.js\");\n\n\n\nvar SkeletonFilter = function SkeletonFilter() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"skeleton filter-select\"\n  });\n};\n\nvar SkeletonResult = function SkeletonResult() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"skeleton result\"\n  });\n};\n\nvar SkeletonTag = function SkeletonTag() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    className: \"skeleton tag\"\n  });\n};\n\nvar SkeletonSidebarTech = function SkeletonSidebarTech() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    className: \"skeleton sidebar-link\"\n  });\n};\n\nvar SkeletonHeader = function SkeletonHeader(_ref) {\n  var size = _ref.size;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: 'skeleton header ' + size\n  });\n};\n\nfunction SkeletonChildrenFactory(name, count) {\n  var Element = '';\n\n  switch (name) {\n    case 'filter':\n      Element = SkeletonFilter;\n      break;\n\n    case 'result':\n      Element = SkeletonResult;\n      break;\n\n    case 'tag':\n      Element = SkeletonTag;\n      break;\n\n    case 'header':\n      // count this time is string\n      return [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SkeletonHeader, {\n        key: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(4),\n        size: count\n      })];\n\n    case 'sidebar-tech':\n      Element = SkeletonSidebarTech;\n      break;\n\n    default:\n      alert('Cannot find Skeleton Element of name ' + name);\n  }\n\n  var resultList = [];\n  var i = 0;\n\n  do {\n    resultList.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Element, {\n      key: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(4)\n    }));\n    i += 1;\n  } while (i < count);\n\n  return resultList;\n}\nfunction SkeletonLoadingComponent(_ref2) {\n  var element = _ref2.element;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"skeleton-loading-container\"\n  }, element);\n}\n\n//# sourceURL=webpack:///./app/src/components/skeleton/SkeletonLoadingComponent.js?");

/***/ }),

/***/ "./app/src/components/skeleton/SkeletonLoadingRelatedSection.js":
/*!**********************************************************************!*\
  !*** ./app/src/components/skeleton/SkeletonLoadingRelatedSection.js ***!
  \**********************************************************************/
/*! exports provided: SkeletonLoadingRelatedSection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SkeletonLoadingRelatedSection\", function() { return SkeletonLoadingRelatedSection; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SkeletonLoadingComponent */ \"./app/src/components/skeleton/SkeletonLoadingComponent.js\");\n\n\nvar SkeletonLoadingRelatedSection = /*#__PURE__*/React.createElement(react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_1__[\"SkeletonChildrenFactory\"])('header', 'sm'), /*#__PURE__*/React.createElement(\"div\", {\n  className: \"tags\"\n}, Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_1__[\"SkeletonChildrenFactory\"])('tag', 5)), Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_1__[\"SkeletonChildrenFactory\"])('header', 'sm'), /*#__PURE__*/React.createElement(\"div\", {\n  className: \"tags\"\n}, Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_1__[\"SkeletonChildrenFactory\"])('tag', 4)), Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_1__[\"SkeletonChildrenFactory\"])('header', 'sm'), Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_1__[\"SkeletonChildrenFactory\"])('result', 4));\n\n//# sourceURL=webpack:///./app/src/components/skeleton/SkeletonLoadingRelatedSection.js?");

/***/ }),

/***/ "./app/src/components/utils.js":
/*!*************************************!*\
  !*** ./app/src/components/utils.js ***!
  \*************************************/
/*! exports provided: makeId, debounce, getCookie, getCsrfToken, extractURLParams, whatType, codeParamsToUrl, decodeParamsFromUrl, updateUrl, getAvailableFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"makeId\", function() { return makeId; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCookie\", function() { return getCookie; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCsrfToken\", function() { return getCsrfToken; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"extractURLParams\", function() { return extractURLParams; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"whatType\", function() { return whatType; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"codeParamsToUrl\", function() { return codeParamsToUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"decodeParamsFromUrl\", function() { return decodeParamsFromUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateUrl\", function() { return updateUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAvailableFilters\", function() { return getAvailableFilters; });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n\nvar makeId = function makeId(length) {\n  var result = '';\n  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';\n  var charactersLength = characters.length;\n\n  for (var i = 0; i < length; i++) {\n    result += characters.charAt(Math.floor(Math.random() * charactersLength));\n  }\n\n  return result;\n};\nfunction debounce(func, wait, immediate) {\n  var timeout;\n  return function () {\n    var context = this,\n        args = arguments;\n\n    var later = function later() {\n      timeout = null;\n      if (!immediate) func.apply(context, args);\n    };\n\n    var callNow = immediate && !timeout;\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n    if (callNow) func.apply(context, args);\n  };\n}\nfunction getCookie(name) {\n  var value = \"; \" + document.cookie;\n  var parts = value.split(\"; \" + name + \"=\");\n  if (parts.length === 2) return parts.pop().split(\";\").shift();\n}\nfunction getCsrfToken() {\n  return getCookie('csrftoken');\n}\nfunction extractURLParams(str) {\n  if (str === '') return false;\n  var params = {};\n  var unparsed_params = str.split(\"?\").pop().split(\"&\");\n  unparsed_params.map(function (p) {\n    var p_arr = p.split('=');\n    if (p_arr[1] !== '') params[p_arr[0]] = p_arr[1];\n  });\n  return params;\n}\nfunction whatType(item) {\n  var typeStr = Object.prototype.toString.call(item).slice(8, -1);\n  return typeStr.toLowerCase();\n}\nfunction codeParamsToUrl(params, data) {\n  switch (whatType(data)) {\n    case 'object':\n      return Object.keys(data).map(function (name) {\n        return params.append(name, data[name]);\n      });\n\n    case 'array':\n      return data.map(function (f) {\n        params.append(Object.keys(f)[0], Object.values(f)[0]);\n      });\n  }\n}\nfunction decodeParamsFromUrl() {\n  var filters = {};\n  var sorting = '';\n  var pagination = {};\n  var paginationParamNames = ['resultsPerPage', 'current', 'offset'];\n  var urlParams = new URLSearchParams(document.location.search);\n  urlParams[\"delete\"]('search');\n  urlParams[\"delete\"]('tab');\n  sorting = urlParams.get('sort_by');\n  urlParams[\"delete\"]('sort_by');\n  Array.from(urlParams, function (_ref) {\n    var _ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 2),\n        key = _ref2[0],\n        value = _ref2[1];\n\n    var f = {};\n\n    if (paginationParamNames.indexOf(key) > -1) {\n      pagination[key] = Number(value);\n    } else {\n      filters[key] = value;\n    }\n  });\n  return [filters, sorting, pagination];\n}\nfunction updateUrl(url, params) {\n  /*\n  * url = string;\n  * params = {search: searchTerm, tab: tabName, filters: filters,...}\n  * */\n  var paramsObj = new URLSearchParams(); // this is to be populated from scratch\n\n  if (params['tab'] !== '') {\n    paramsObj.set('tab', params['tab']); // process filters per tab only!\n\n    if (Object.keys(params['filters']).length > 0) {\n      codeParamsToUrl(paramsObj, params['filters']);\n    }\n  }\n\n  if (params['search'] !== '') {\n    paramsObj.set('search', params['search']);\n  }\n\n  history.pushState(null, 'Search', url + paramsObj.toString());\n}\nfunction getAvailableFilters(aggregated, label, type) {\n  if (!aggregated) return {};\n  /*\n  * filtername: string\n  * aggregated: [{value: itemsCount}, ...]\n  *\n  * returns {label: string, type: string, options: [[value, text],...]}, ...}\n  * */\n\n  return {\n    label: label,\n    type: type,\n    options: Object.keys(aggregated).map(function (value) {\n      return [value, value + '(' + aggregated[value] + ')'];\n    })\n  };\n}\n\n//# sourceURL=webpack:///./app/src/components/utils.js?");

/***/ }),

/***/ "./app/study_resource/src/ResourceRating.js":
/*!**************************************************!*\
  !*** ./app/study_resource/src/ResourceRating.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ResourceRating; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _src_components_StarRating__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../src/components/StarRating */ \"./app/src/components/StarRating.js\");\n\n\nfunction ResourceRating(_ref) {\n  var data = _ref.data,\n      maxRating = _ref.maxRating;\n  if (data.rating) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"rating\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    className: \"stars\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_StarRating__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n    maxRating: maxRating,\n    rating: data.rating\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    itemProp: \"ratingCount\"\n  }, data.reviews_count, \" Reviews\"));\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"rating\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    itemProp: \"ratingCount\"\n  }, \"No Reviews Yet. \", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: data.url\n  }, \"Contribute\")));\n}\n\n//# sourceURL=webpack:///./app/study_resource/src/ResourceRating.js?");

/***/ }),

/***/ "./app/study_resource/src/StudyResourceSearchListing.js":
/*!**************************************************************!*\
  !*** ./app/study_resource/src/StudyResourceSearchListing.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return StudyResourceSearchListing; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ResourceRating__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResourceRating */ \"./app/study_resource/src/ResourceRating.js\");\n/* harmony import */ var _src_components_TruncatedTextComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/components/TruncatedTextComponent */ \"./app/src/components/TruncatedTextComponent.js\");\n\n\n\nvar flagIcon = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"svg\", {\n  viewBox: \"0 0 12 12\",\n  fill: \"none\",\n  xmlns: \"http://www.w3.org/2000/svg\"\n}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"path\", {\n  d: \"M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z\",\n  fill: \"black\"\n}));\nfunction StudyResourceSearchListing(_ref) {\n  var data = _ref.data,\n      addFilter = _ref.addFilter;\n  var MAX_RATING = 5;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"card\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"result resource\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"left\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, data.technologies.map(function (t) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n      key: t.url,\n      href: t.url,\n      className: \"tech\"\n    }, flagIcon, \" \", t.name, \" \", t.version);\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    onClick: function onClick(e) {\n      addFilter('category', data.category);\n    }\n  }, data.category), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    onClick: function onClick(e) {\n      return addFilter('experience_level', data.experience_level);\n    }\n  }, data.experience_level)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"listing-title\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h4\", {\n    className: \"title\",\n    itemProp: \"name\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: data.url\n  }, data.name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    className: \"published\"\n  }, data.publication_date, \" By \", data.published_by), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    onClick: function onClick(e) {\n      return addFilter('media', data.media);\n    }\n  }, data.media))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"description\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_TruncatedTextComponent__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    fullText: data.summary,\n    charLimit: 250\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, data.tags.map(function (t) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n      key: 'tag' + t,\n      onClick: function onClick(e) {\n        return addFilter('tags', t);\n      },\n      className: \"tag\"\n    }, \"#\", t);\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ResourceRating__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n    data: data,\n    maxRating: MAX_RATING\n  })), data.image ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"right\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"image\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    itemProp: \"name\",\n    href: data.url\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"img\", {\n    className: \"primary-image\",\n    src: data.image.small,\n    alt: \"\"\n  })))) : ''));\n}\n\n//# sourceURL=webpack:///./app/study_resource/src/StudyResourceSearchListing.js?");

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