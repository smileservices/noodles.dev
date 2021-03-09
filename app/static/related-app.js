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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _search_src_RelatedComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../search/src/RelatedComponent */ \"./app/search/src/RelatedComponent.js\");\n\n\n\nfunction RelatedApp() {\n  function addFilterFactory() {\n    return function (name, value) {\n      return window.location = '/search/?tab=' + tab + '&' + name + '=' + value;\n    };\n  }\n\n  return /*#__PURE__*/React.createElement(_search_src_RelatedComponent__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n    addFilter: addFilterFactory('resources')\n  });\n}\n\nreact_dom__WEBPACK_IMPORTED_MODULE_0___default.a.render( /*#__PURE__*/React.createElement(RelatedApp, null), document.getElementById('related-app'));\n\n//# sourceURL=webpack:///./app/frontend/src/RelatedApp.js?");

/***/ }),

/***/ "./app/search/src/RelatedComponent.js":
/*!********************************************!*\
  !*** ./app/search/src/RelatedComponent.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return RelatedComponent; });\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _study_resource_src_StudyResourceSearchListing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../study_resource/src/StudyResourceSearchListing */ \"./app/study_resource/src/StudyResourceSearchListing.js\");\n\n\n\nvar flagIcon = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"svg\", {\n  viewBox: \"0 0 12 12\",\n  fill: \"none\",\n  xmlns: \"http://www.w3.org/2000/svg\"\n}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"path\", {\n  d: \"M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z\",\n  fill: \"black\"\n}));\nfunction RelatedComponent(_ref) {\n  var addFilter = _ref.addFilter;\n\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useState\"])({}),\n      _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),\n      data = _useState2[0],\n      setData = _useState2[1];\n\n  Object(react__WEBPACK_IMPORTED_MODULE_1__[\"useEffect\"])(function (e) {\n    fetch('/search/api/related/', {\n      method: 'GET'\n    }).then(function (result) {\n      if (result.ok) {\n        return result.json();\n      }\n    }).then(function (data) {\n      setData(data);\n    });\n  }, []);\n  if (!Object.keys(data).length) return 'waiting...';\n  var clickTechTag = addFilter ? function (tech) {\n    return addFilter('tech_v', tech);\n  } : function (tech) {\n    return window.location = '/search/?tab=resources&tech_v=' + tech;\n  };\n  var clickTag = addFilter ? function (tag) {\n    return addFilter('tags', tag);\n  } : function (tag, tab) {\n    return window.location = '/search/?tab=' + tab + '&tags=' + tag;\n  };\n  var resourceFilter = addFilter ? addFilter : function (name, value) {\n    return window.location = '/search/?tab=resources&' + name + '=' + value;\n  };\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, Object.keys(data.aggregations.technologies).length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h4\", null, \"Popular Technologies\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, Object.keys(data.aggregations.technologies).map(function (tech) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n      key: 'popular-tech-' + tech,\n      className: \"tech\",\n      onClick: function onClick(e) {\n        return clickTechTag(tech);\n      }\n    }, flagIcon, \" \", tech, \" (\", data.aggregations.technologies[tech], \")\");\n  }))) : '', Object.keys(data.aggregations.tags).length ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__[\"Fragment\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h4\", null, \"Tags to follow\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, Object.keys(data.aggregations.tags).map(function (tag) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n      key: 'popular-tag-' + tag,\n      onClick: function onClick(e) {\n        return clickTag(tag, 'resources');\n      }\n    }, \"# \", tag, \" (\", data.aggregations.tags[tag], \")\");\n  }))) : '', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h4\", null, \"Latest Added Resources\"), data.resources.items.map(function (resource) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_study_resource_src_StudyResourceSearchListing__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      key: 'latest-resource-' + resource.pk,\n      data: resource,\n      addFilter: resourceFilter\n    });\n  }));\n}\n\n//# sourceURL=webpack:///./app/search/src/RelatedComponent.js?");

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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return StudyResourceSearchListing; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _ResourceRating__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResourceRating */ \"./app/study_resource/src/ResourceRating.js\");\n/* harmony import */ var _src_components_TruncatedTextComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../src/components/TruncatedTextComponent */ \"./app/src/components/TruncatedTextComponent.js\");\n\n\n\nvar flagIcon = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"svg\", {\n  viewBox: \"0 0 12 12\",\n  fill: \"none\",\n  xmlns: \"http://www.w3.org/2000/svg\"\n}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"path\", {\n  d: \"M9.50198 4.5L11.002 1H2.00198V0.5C2.00198 0.224 1.77798 0 1.50198 0C1.22598 0 1.00198 0.224 1.00198 0.5V11.5C1.00198 11.776 1.22598 12 1.50198 12C1.77798 12 2.00198 11.776 2.00198 11.5V8H11.002L9.50198 4.5Z\",\n  fill: \"black\"\n}));\nfunction StudyResourceSearchListing(_ref) {\n  var data = _ref.data,\n      addFilter = _ref.addFilter;\n  var MAX_RATING = 5;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"card\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"result resource\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"left\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, data.technologies.map(function (t) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n      key: t.url,\n      onClick: function onClick(e) {\n        return addFilter('tech_v', t.name);\n      },\n      className: \"tech\"\n    }, flagIcon, \" \", t.name, \" \", t.version);\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    onClick: function onClick(e) {\n      return addFilter('category', data.category);\n    }\n  }, data.category), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    onClick: function onClick(e) {\n      return addFilter('experience_level', data.experience_level);\n    }\n  }, data.experience_level)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"listing-title\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"h4\", {\n    className: \"title\",\n    itemProp: \"name\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: data.url,\n    target: \"new\"\n  }, data.name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    className: \"published\"\n  }, data.publication_date, \" By \", data.published_by), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    onClick: function onClick(e) {\n      return addFilter('media', data.media);\n    }\n  }, data.media))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"description\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_components_TruncatedTextComponent__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n    fullText: data.summary,\n    charLimit: 250\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"tags\"\n  }, data.tags.map(function (t) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n      key: 'tag' + t,\n      onClick: function onClick(e) {\n        return addFilter('tags', t);\n      },\n      className: \"tag\"\n    }, \"#\", t);\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ResourceRating__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n    data: data,\n    maxRating: MAX_RATING\n  })), data.image ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"right\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"image\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    itemProp: \"name\",\n    href: data.url\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"img\", {\n    className: \"primary-image\",\n    src: data.image.small,\n    alt: \"\"\n  })))) : ''));\n}\n\n//# sourceURL=webpack:///./app/study_resource/src/StudyResourceSearchListing.js?");

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