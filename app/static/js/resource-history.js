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
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/history/src/ResourceHistoryApp.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/history/src/ResourceHistoryApp.js":
/*!***********************************************!*\
  !*** ./app/history/src/ResourceHistoryApp.js ***!
  \***********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ \"./node_modules/@babel/runtime/helpers/slicedToArray.js\");\n/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _src_components_skeleton_SkeletonLoadingResults__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/components/skeleton/SkeletonLoadingResults */ \"./app/src/components/skeleton/SkeletonLoadingResults.js\");\n/* harmony import */ var _src_components_PaginatedLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../src/components/PaginatedLayout */ \"./app/src/components/PaginatedLayout.js\");\n/* harmony import */ var _ResourceHistoryListing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ResourceHistoryListing */ \"./app/history/src/ResourceHistoryListing.js\");\n\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\n\n\n\n\nvar FETCH_INIT = 'FETCH_INIT';\nvar SET_PAGINATION = 'SET_PAGINATION';\nvar SUCCESS = 'SUCCESS';\nvar ERROR = 'ERROR';\nvar initialTabState = {\n  pagination: {\n    resultsPerPage: 10,\n    current: 1,\n    offset: 0 //this can be left 0 as we don't need it on the backend\n\n  },\n  results: [],\n  waiting: true,\n  errors: false\n};\n\nvar reducer = function reducer(state, _ref) {\n  var type = _ref.type,\n      payload = _ref.payload;\n\n  switch (type) {\n    case FETCH_INIT:\n      return _objectSpread(_objectSpread({}, state), {}, {\n        waiting: true\n      });\n\n    case SUCCESS:\n      return _objectSpread(_objectSpread({}, state), {}, {\n        results: payload,\n        waiting: false,\n        errors: false\n      });\n\n    case ERROR:\n      return _objectSpread(_objectSpread({}, state), {}, {\n        errors: payload\n      });\n\n    case SET_PAGINATION:\n      return _objectSpread(_objectSpread({}, state), {}, {\n        pagination: payload\n      });\n\n    default:\n      throw new Error(\"Action type \".concat(type, \" unknown\"));\n  }\n};\n\nvar NoResultsElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"div\", {\n  className: \"no-results\"\n}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"h2\", null, \"There are no edits to this resource yet!\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"p\", null, \"Be the first to improve it!\"));\n\nfunction ResourceHistoryApp() {\n  var _useReducer = Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useReducer\"])(reducer, initialTabState),\n      _useReducer2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useReducer, 2),\n      state = _useReducer2[0],\n      dispatch = _useReducer2[1];\n\n  Object(react__WEBPACK_IMPORTED_MODULE_2__[\"useEffect\"])(function (e) {\n    dispatch({\n      type: FETCH_INIT\n    });\n    fetch(URLS.history + '?resultsPerPage=' + state.pagination.resultsPerPage + '&currentPage=' + state.pagination.current, {\n      method: 'GET'\n    }).then(function (result) {\n      if (result.ok) {\n        return result.json();\n      } else {\n        dispatch({\n          type: ERROR,\n          payload: ['Encountered an error while retrieving history: ' + result.statusText]\n        });\n      }\n    }).then(function (data) {\n      dispatch({\n        type: SUCCESS,\n        payload: data\n      });\n    });\n  }, [state.pagination]);\n  if (state.waiting) return _src_components_skeleton_SkeletonLoadingResults__WEBPACK_IMPORTED_MODULE_4__[\"SkeletonLoadingResults\"];\n  if (!state.results.items || state.results.items.length === 0) return NoResultsElement;\n  if (state.errors) return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"div\", {\n    className: \"no-results\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"h2\", null, \"Encountered errors :(\"), state.errors.map(function (e) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(\"p\", null, \"e\");\n  }));\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_src_components_PaginatedLayout__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n    pagination: state.pagination,\n    resultsCount: state.results.stats.total,\n    data: state.results.items,\n    resultsContainerClass: \"results\",\n    setPagination: function setPagination(pagination) {\n      dispatch({\n        type: SET_PAGINATION,\n        payload: pagination\n      });\n    },\n    mapFunction: function mapFunction(item, idx) {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_ResourceHistoryListing__WEBPACK_IMPORTED_MODULE_6__[\"default\"], {\n        key: item.pk,\n        data: item\n      });\n    }\n  });\n}\n\nreact_dom__WEBPACK_IMPORTED_MODULE_3___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(ResourceHistoryApp, null), document.getElementById('resource-history-app'));\n\n//# sourceURL=webpack:///./app/history/src/ResourceHistoryApp.js?");

/***/ }),

/***/ "./app/history/src/ResourceHistoryListing.js":
/*!***************************************************!*\
  !*** ./app/history/src/ResourceHistoryListing.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ResourceHistoryListing; });\n/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ \"./node_modules/@babel/runtime/helpers/typeof.js\");\n/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _users_src_UserListing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../users/src/UserListing */ \"./app/users/src/UserListing.js\");\n/* harmony import */ var _src_vanilla_date__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../src/vanilla/date */ \"./app/src/vanilla/date.js\");\n/* harmony import */ var _src_components_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../src/components/utils */ \"./app/src/components/utils.js\");\n\n\n\n\n\n\nfunction formatChange(field, content) {\n  if (field === 'image_file') {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: \"images-diff\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: \"image\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n      className: \"image-overlay\"\n    }, \"Old\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"img\", {\n      src: content.old.small,\n      alt: \"\"\n    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: \"image\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n      className: \"image-overlay\"\n    }, \"New\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"img\", {\n      src: content[\"new\"].small,\n      alt: \"\"\n    })));\n  }\n\n  if (_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0___default()(content) === 'object') return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n    dangerouslySetInnerHTML: {\n      __html: content.label\n    }\n  });\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"span\", {\n    dangerouslySetInnerHTML: {\n      __html: content\n    }\n  });\n}\n\nfunction ResourceHistoryListing(_ref) {\n  var data = _ref.data;\n\n  var updated_meta = function () {\n    if (data.operation_type_label !== 'update') return '';\n    if (data.operation_source_label === 'direct') return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: \"updated_meta\"\n    }, \"Edited by \", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_users_src_UserListing__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      data: data.author\n    }), \" on \", Object(_src_vanilla_date__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(data.created, 'datetime'));\n    if (data.operation_source_label === 'edit_suggestion') return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: \"updated_meta\"\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_users_src_UserListing__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      data: data.edit_published_by\n    }), \" published on \", Object(_src_vanilla_date__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(data.created, 'datetime'), \" Edit Suggestion of \", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_users_src_UserListing__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n      data: data.author\n    }));\n    if (data.operation_source_label === 'automatic') return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: \"updated_meta\"\n    }, \"Automatic Edited on \", Object(_src_vanilla_date__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(data.created, 'datetime'));\n  }();\n\n  var formatted_changes = function () {\n    var changes_obj = JSON.parse(data.changes);\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n      className: \"changes\"\n    }, Object.keys(changes_obj).map(function (field) {\n      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n        key: Object(_src_components_utils__WEBPACK_IMPORTED_MODULE_4__[\"makeId\"])(4),\n        className: \"change\"\n      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n        className: \"field\"\n      }, field), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n        className: \"diff\"\n      }, formatChange(field, changes_obj[field])));\n    }));\n  }();\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n    className: \"card result history-result\"\n  }, updated_meta, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h4\", null, \"Changes\"), formatted_changes, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n    className: \"reason\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"h4\", null, \"Reason\"), data.edit_reason ? data.edit_reason : 'No specified reason'));\n}\n\n//# sourceURL=webpack:///./app/history/src/ResourceHistoryListing.js?");

/***/ }),

/***/ "./app/src/components/PaginatedLayout.js":
/*!***********************************************!*\
  !*** ./app/src/components/PaginatedLayout.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return PaginatedLayout; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./app/src/components/utils.js\");\n/* harmony import */ var _SortComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SortComponent */ \"./app/src/components/SortComponent.js\");\n/* harmony import */ var _pagination__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pagination */ \"./app/src/components/pagination.js\");\n\n\n\n\nfunction PaginatedLayout(_ref) {\n  var data = _ref.data,\n      mapFunction = _ref.mapFunction,\n      pagination = _ref.pagination,\n      resultsCount = _ref.resultsCount,\n      setPagination = _ref.setPagination,\n      resultsContainerClass = _ref.resultsContainerClass;\n  if (!data) return '';\n  if (data.length === 0) return '';\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: resultsContainerClass\n  }, data.map(function (item, idx) {\n    return mapFunction(item, idx);\n  })), resultsCount > pagination.resultsPerPage ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_pagination__WEBPACK_IMPORTED_MODULE_3__[\"PaginationElement\"], {\n    pagination: pagination,\n    resultsCount: resultsCount,\n    setPagination: setPagination\n  }) : '');\n}\n\n//# sourceURL=webpack:///./app/src/components/PaginatedLayout.js?");

/***/ }),

/***/ "./app/src/components/SortComponent.js":
/*!*********************************************!*\
  !*** ./app/src/components/SortComponent.js ***!
  \*********************************************/
/*! exports provided: SortComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SortComponent\", function() { return SortComponent; });\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ \"./app/src/components/utils.js\");\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\n\nfunction SortComponent(_ref) {\n  var name = _ref.name,\n      querySort = _ref.querySort,\n      setQuerySort = _ref.setQuerySort;\n  var isSortAsc = querySort[name] === '+';\n  var isSortDesc = querySort[name] === '-';\n  var isSorted = (name in querySort);\n\n  function updateSorting(e, val) {\n    e.preventDefault();\n\n    var clonedQuery = _objectSpread({}, querySort);\n\n    if (val) {\n      clonedQuery[name] = val;\n    } else {\n      delete clonedQuery[name];\n    }\n\n    setQuerySort(clonedQuery);\n  }\n\n  var SortAsc = function SortAsc() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"a\", {\n      className: \"btn btn-icon-toggle btn-refresh\",\n      href: \"\",\n      onClick: function onClick(e) {\n        return updateSorting(e, '+');\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"i\", {\n      className: \"fa fa-sort-asc\"\n    }, \" \"));\n  };\n\n  var SortDesc = function SortDesc() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"a\", {\n      className: \"btn btn-icon-toggle btn-refresh\",\n      href: \"\",\n      onClick: function onClick(e) {\n        return updateSorting(e, '-');\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"i\", {\n      className: \"fa fa-sort-desc\"\n    }, \" \"));\n  };\n\n  var SortRemove = function SortRemove() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"a\", {\n      className: \"btn btn-icon-toggle btn-refresh\",\n      href: \"\",\n      onClick: function onClick(e) {\n        return updateSorting(e, false);\n      }\n    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"i\", {\n      className: \"fa fa-close\"\n    }, \" \"));\n  };\n\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(\"div\", {\n    className: \"tools sorting\"\n  }, !isSorted || isSortDesc ? SortAsc() : false, !isSorted || isSortAsc ? SortDesc() : false, isSorted ? SortRemove() : false);\n}\n\n//# sourceURL=webpack:///./app/src/components/SortComponent.js?");

/***/ }),

/***/ "./app/src/components/pagination.js":
/*!******************************************!*\
  !*** ./app/src/components/pagination.js ***!
  \******************************************/
/*! exports provided: PaginationDropdown, PaginationElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PaginationDropdown\", function() { return PaginationDropdown; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"PaginationElement\", function() { return PaginationElement; });\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ \"./node_modules/@babel/runtime/helpers/defineProperty.js\");\n/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./app/src/components/utils.js\");\n\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\nvar PaginationDropdown = function PaginationDropdown(_ref) {\n  var pagination = _ref.pagination,\n      setPagination = _ref.setPagination;\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"btn-group pagination\"\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    type: \"button\",\n    className: \"btn ink-reaction btn-flat dropdown-toggle\",\n    \"data-toggle\": \"dropdown\",\n    \"aria-expanded\": \"false\"\n  }, pagination.resultsPerPage, \" results per page \", /*#__PURE__*/React.createElement(\"i\", {\n    className: \"fa fa-caret-down text-default-light\"\n  }, \" \")), /*#__PURE__*/React.createElement(\"ul\", {\n    className: \"dropdown-menu animation-expand\",\n    role: \"menu\"\n  }, pagination.options.map(function (no) {\n    return /*#__PURE__*/React.createElement(\"li\", {\n      key: \"pagination\" + no,\n      className: no === pagination.resultsPerPage ? 'selected' : ''\n    }, /*#__PURE__*/React.createElement(\"a\", {\n      onClick: function onClick(e) {\n        e.preventDefault();\n        setPagination(_objectSpread(_objectSpread({}, pagination), {}, {\n          current: 1,\n          resultsPerPage: no,\n          offset: 0\n        }));\n      }\n    }, no));\n  })));\n};\nvar PaginationElement = function PaginationElement(_ref2) {\n  var pagination = _ref2.pagination,\n      resultsCount = _ref2.resultsCount,\n      setPagination = _ref2.setPagination;\n  var totalPages = Math.ceil(resultsCount / pagination.resultsPerPage);\n\n  var handlePrevPage = function handlePrevPage(e) {\n    e.preventDefault();\n    setPagination(_objectSpread(_objectSpread({}, pagination), {}, {\n      offset: pagination.offset - pagination.resultsPerPage,\n      current: pagination.current - 1\n    }));\n  };\n\n  var handleNextPage = function handleNextPage(e) {\n    e.preventDefault();\n    setPagination(_objectSpread(_objectSpread({}, pagination), {}, {\n      offset: pagination.offset + pagination.resultsPerPage,\n      current: pagination.current + 1\n    }));\n  };\n\n  var handlePageClick = function handlePageClick(e, page) {\n    e.preventDefault();\n    setPagination(_objectSpread(_objectSpread({}, pagination), {}, {\n      offset: pagination.resultsPerPage * (page - 1),\n      current: page\n    }));\n  };\n\n  if (resultsCount === 0) return '';\n  return /*#__PURE__*/React.createElement(\"ul\", {\n    className: \"pagination\"\n  }, pagination.current > 1 ? /*#__PURE__*/React.createElement(\"li\", {\n    key: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(4)\n  }, /*#__PURE__*/React.createElement(\"a\", {\n    onClick: function onClick(e) {\n      return handlePrevPage(e);\n    }\n  }, \"\\xAB\")) : '', Array.from({\n    length: totalPages\n  }).map(function (_, i) {\n    var pageNo = i + 1;\n    var pageActive = pageNo === pagination.current;\n    return /*#__PURE__*/React.createElement(\"li\", {\n      key: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(4),\n      className: pageActive ? \"active\" : \"\"\n    }, pageActive ? /*#__PURE__*/React.createElement(\"span\", null, pageNo) : /*#__PURE__*/React.createElement(\"a\", {\n      onClick: function onClick(e) {\n        return handlePageClick(e, pageNo);\n      }\n    }, pageNo));\n  }), pagination.current < totalPages ? /*#__PURE__*/React.createElement(\"li\", {\n    key: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(4)\n  }, /*#__PURE__*/React.createElement(\"a\", {\n    onClick: function onClick(e) {\n      return handleNextPage(e);\n    }\n  }, \"\\xBB\")) : '');\n};\n\n//# sourceURL=webpack:///./app/src/components/pagination.js?");

/***/ }),

/***/ "./app/src/components/skeleton/SkeletonLoadingComponent.js":
/*!*****************************************************************!*\
  !*** ./app/src/components/skeleton/SkeletonLoadingComponent.js ***!
  \*****************************************************************/
/*! exports provided: SkeletonChildrenFactory, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SkeletonChildrenFactory\", function() { return SkeletonChildrenFactory; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return SkeletonLoadingComponent; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ \"./app/src/components/utils.js\");\n\n\n\nvar SkeletonHeader = function SkeletonHeader(_ref) {\n  var size = _ref.size;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: 'skeleton header ' + size\n  });\n};\n\nfunction SkeletonChildrenFactory(name, count) {\n  var Element = '';\n\n  switch (name) {\n    case 'filter':\n      Element = function Element() {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n          className: \"skeleton filter-select\"\n        });\n      };\n\n      break;\n\n    case 'result':\n      Element = function Element() {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n          className: \"skeleton result\"\n        });\n      };\n\n      break;\n\n    case 'review':\n      Element = function Element() {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n          className: \"skeleton review\"\n        });\n      };\n\n      break;\n\n    case 'tag':\n      Element = function Element() {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n          className: \"skeleton tag\"\n        });\n      };\n\n      break;\n\n    case 'header':\n      // count this time is string\n      return [/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SkeletonHeader, {\n        key: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(4),\n        size: count\n      })];\n\n    case 'sidebar-tech':\n      Element = function Element() {\n        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n          className: \"result-minimal skeleton\"\n        });\n      };\n\n      break;\n\n    default:\n      alert('Cannot find Skeleton Element of name ' + name);\n  }\n\n  var resultList = [];\n  var i = 0;\n\n  do {\n    resultList.push( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Element, {\n      key: Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"makeId\"])(4)\n    }));\n    i += 1;\n  } while (i < count);\n\n  return resultList;\n}\nfunction SkeletonLoadingComponent(_ref2) {\n  var element = _ref2.element;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"skeleton-loading-container\"\n  }, element);\n}\n\n//# sourceURL=webpack:///./app/src/components/skeleton/SkeletonLoadingComponent.js?");

/***/ }),

/***/ "./app/src/components/skeleton/SkeletonLoadingResults.js":
/*!***************************************************************!*\
  !*** ./app/src/components/skeleton/SkeletonLoadingResults.js ***!
  \***************************************************************/
/*! exports provided: SkeletonLoadingResults */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SkeletonLoadingResults\", function() { return SkeletonLoadingResults; });\n/* harmony import */ var _SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SkeletonLoadingComponent */ \"./app/src/components/skeleton/SkeletonLoadingComponent.js\");\n\nvar SkeletonLoadingResults = /*#__PURE__*/React.createElement(\"div\", {\n  className: \"resources\"\n}, /*#__PURE__*/React.createElement(\"div\", {\n  className: \"filters\"\n}, Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_0__[\"SkeletonChildrenFactory\"])('filter', 3)), /*#__PURE__*/React.createElement(\"div\", {\n  className: \"most-voted\"\n}, Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_0__[\"SkeletonChildrenFactory\"])('header', 'md'), /*#__PURE__*/React.createElement(\"div\", {\n  className: \"results\"\n}, Object(_SkeletonLoadingComponent__WEBPACK_IMPORTED_MODULE_0__[\"SkeletonChildrenFactory\"])('result', 5))));\n\n//# sourceURL=webpack:///./app/src/components/skeleton/SkeletonLoadingResults.js?");

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

/***/ "./app/src/vanilla/date.js":
/*!*********************************!*\
  !*** ./app/src/vanilla/date.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return FormatDate; });\nfunction FormatDate(dateStr, type) {\n  // type: date/datetime\n  var dateObj = new Date(dateStr);\n  var locale = navigator.languages != undefined ? navigator.languages[0] : navigator.language;\n  var fullMonth = dateObj.toLocaleDateString(locale, {\n    month: 'long'\n  });\n\n  function getDate() {\n    return dateObj.getUTCDate() + ' ' + fullMonth + ' ' + dateObj.getUTCFullYear();\n  }\n\n  function getTime() {\n    return dateObj.getUTCHours() + ':' + dateObj.getUTCMinutes();\n  }\n\n  switch (type) {\n    case 'date':\n      return getDate();\n\n    case 'datetime':\n      return getDate() + ', ' + getTime();\n\n    case 'html-date':\n      return dateObj.toISOString().split('T')[0];\n  }\n}\n\n//# sourceURL=webpack:///./app/src/vanilla/date.js?");

/***/ }),

/***/ "./app/users/src/UserListing.js":
/*!**************************************!*\
  !*** ./app/users/src/UserListing.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return UserListing; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction UserListing(_ref) {\n  var data = _ref.data;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    className: \"user-listing\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"span\", {\n    className: \"username\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"a\", {\n    href: \"/users/profile/\" + data.username\n  }, data.username)));\n}\n\n//# sourceURL=webpack:///./app/users/src/UserListing.js?");

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

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _typeof(obj) {\n  \"@babel/helpers - typeof\";\n\n  if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") {\n    module.exports = _typeof = function _typeof(obj) {\n      return typeof obj;\n    };\n  } else {\n    module.exports = _typeof = function _typeof(obj) {\n      return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj;\n    };\n  }\n\n  return _typeof(obj);\n}\n\nmodule.exports = _typeof;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/typeof.js?");

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