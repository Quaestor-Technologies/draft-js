/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This file is a fork of DraftEditorBlock.react.js and DraftEditorContents.react.js
 *
 * This is unstable and not part of the public API and should not be used by
 * production systems. This file may be update/removed without notice.
 *
 * 
 * @format
 * @oncall draft_js
 */

'use strict';

var _assign = require("object-assign");
function _extends() { return _extends = _assign ? _assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var DraftEditorNode = require("./DraftEditorNode.react");
var DraftOffsetKey = require("./DraftOffsetKey");
var Scroll = require("fbjs/lib/Scroll");
var Style = require("fbjs/lib/Style");
var getElementPosition = require("fbjs/lib/getElementPosition");
var getScrollPosition = require("fbjs/lib/getScrollPosition");
var getViewportDimensions = require("fbjs/lib/getViewportDimensions");
var Immutable = require("immutable");
var invariant = require("fbjs/lib/invariant");
var isHTMLElement = require("./isHTMLElement");
var React = require("react");
var SCROLL_BUFFER = 10;
var List = Immutable.List;

// we should harden up the below flow types to make them more strict

/**
 * Return whether a block overlaps with either edge of the `SelectionState`.
 */
var isBlockOnSelectionEdge = function isBlockOnSelectionEdge(selection, key) {
  return selection.getAnchorKey() === key || selection.getFocusKey() === key;
};

/**
 * We will use this helper to identify blocks that need to be wrapped but have siblings that
 * also share the same wrapper element, this way we can do the wrapping once the last sibling
 * is added.
 */
var shouldNotAddWrapperElement = function shouldNotAddWrapperElement(block, contentState) {
  var nextSiblingKey = block.getNextSiblingKey();
  return nextSiblingKey ? contentState.getBlockForKey(nextSiblingKey).getType() === block.getType() : false;
};
var applyWrapperElementToSiblings = function applyWrapperElementToSiblings(wrapperTemplate, Element, nodes) {
  var wrappedSiblings = [];

  // we check back until we find a sibling that does not have same wrapper
  var _iterator = _createForOfIteratorHelper(nodes.reverse()),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var sibling = _step.value;
      if (sibling.type !== Element) {
        break;
      }
      wrappedSiblings.push(sibling);
    }

    // we now should remove from acc the wrappedSiblings and add them back under same wrap
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  nodes.splice(nodes.indexOf(wrappedSiblings[0]), wrappedSiblings.length + 1);
  var childrenIs = wrappedSiblings.reverse();
  var key = childrenIs[0].key;
  nodes.push(React.cloneElement(wrapperTemplate, {
    key: "".concat(key, "-wrap"),
    'data-offset-key': DraftOffsetKey.encode(key, 0, 0)
  }, childrenIs));
  return nodes;
};
var getDraftRenderConfig = function getDraftRenderConfig(block, blockRenderMap) {
  var configForType = blockRenderMap.get(block.getType()) || blockRenderMap.get('unstyled');
  var wrapperTemplate = configForType.wrapper;
  var Element = configForType.element || blockRenderMap.get('unstyled').element;
  return {
    Element: Element,
    wrapperTemplate: wrapperTemplate
  };
};
var getCustomRenderConfig = function getCustomRenderConfig(block, blockRendererFn) {
  var customRenderer = blockRendererFn(block);
  if (!customRenderer) {
    return {};
  }
  var CustomComponent = customRenderer.component,
    customProps = customRenderer.props,
    customEditable = customRenderer.editable;
  return {
    CustomComponent: CustomComponent,
    customProps: customProps,
    customEditable: customEditable
  };
};
var getElementPropsConfig = function getElementPropsConfig(block, editorKey, offsetKey, blockStyleFn, customConfig, ref) {
  var elementProps = {
    'data-block': true,
    'data-editor': editorKey,
    'data-offset-key': offsetKey,
    key: block.getKey(),
    ref: ref
  };
  var customClass = blockStyleFn(block);
  if (customClass) {
    elementProps.className = customClass;
  }
  if (customConfig.customEditable !== undefined) {
    elementProps = _objectSpread(_objectSpread({}, elementProps), {}, {
      contentEditable: customConfig.customEditable,
      suppressContentEditableWarning: true
    });
  }
  return elementProps;
};
var DraftEditorBlockNode = /*#__PURE__*/function (_React$Component) {
  function DraftEditorBlockNode() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _defineProperty(_this, "wrapperRef", React.createRef());
    return _this;
  }
  _inheritsLoose(DraftEditorBlockNode, _React$Component);
  var _proto = DraftEditorBlockNode.prototype;
  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var _this$props = this.props,
      block = _this$props.block,
      direction = _this$props.direction,
      tree = _this$props.tree;
    var isContainerNode = !block.getChildKeys().isEmpty();
    var blockHasChanged = block !== nextProps.block || tree !== nextProps.tree || direction !== nextProps.direction || isBlockOnSelectionEdge(nextProps.selection, nextProps.block.getKey()) && nextProps.forceSelection;

    // if we have children at this stage we always re-render container nodes
    // else if its a root node we avoid re-rendering by checking for block updates
    return isContainerNode || blockHasChanged;
  }

  /**
   * When a block is mounted and overlaps the selection state, we need to make
   * sure that the cursor is visible to match native behavior. This may not
   * be the case if the user has pressed `RETURN` or pasted some content, since
   * programatically creating these new blocks and setting the DOM selection
   * will miss out on the browser natively scrolling to that position.
   *
   * To replicate native behavior, if the block overlaps the selection state
   * on mount, force the scroll position. Check the scroll state of the scroll
   * parent, and adjust it to align the entire block to the bottom of the
   * scroll parent.
   */;
  _proto.componentDidMount = function componentDidMount() {
    var selection = this.props.selection;
    var endKey = selection.getEndKey();
    if (!selection.getHasFocus() || endKey !== this.props.block.getKey()) {
      return;
    }
    var blockNode = this.wrapperRef.current;
    if (!blockNode) {
      // This Block Node was rendered without a wrapper element.
      return;
    }
    var scrollParent = Style.getScrollParent(blockNode);
    var scrollPosition = getScrollPosition(scrollParent);
    var scrollDelta;
    if (scrollParent === window) {
      var nodePosition = getElementPosition(blockNode);
      var nodeBottom = nodePosition.y + nodePosition.height;
      var viewportHeight = getViewportDimensions().height;
      scrollDelta = nodeBottom - viewportHeight;
      if (scrollDelta > 0) {
        window.scrollTo(scrollPosition.x, scrollPosition.y + scrollDelta + SCROLL_BUFFER);
      }
    } else {
      !isHTMLElement(blockNode) ? process.env.NODE_ENV !== "production" ? invariant(false, 'blockNode is not an HTMLElement') : invariant(false) : void 0;
      var htmlBlockNode = blockNode;
      var blockBottom = htmlBlockNode.offsetHeight + htmlBlockNode.offsetTop;
      var scrollBottom = scrollParent.offsetHeight + scrollPosition.y;
      scrollDelta = blockBottom - scrollBottom;
      if (scrollDelta > 0) {
        Scroll.setTop(scrollParent, Scroll.getTop(scrollParent) + scrollDelta + SCROLL_BUFFER);
      }
    }
  };
  _proto.render = function render() {
    var _this2 = this;
    var _this$props2 = this.props,
      block = _this$props2.block,
      blockRenderMap = _this$props2.blockRenderMap,
      blockRendererFn = _this$props2.blockRendererFn,
      blockStyleFn = _this$props2.blockStyleFn,
      contentState = _this$props2.contentState,
      decorator = _this$props2.decorator,
      editorKey = _this$props2.editorKey,
      editorState = _this$props2.editorState,
      customStyleFn = _this$props2.customStyleFn,
      customStyleMap = _this$props2.customStyleMap,
      direction = _this$props2.direction,
      forceSelection = _this$props2.forceSelection,
      selection = _this$props2.selection,
      tree = _this$props2.tree;
    var children = null;
    if (block.children.size) {
      children = block.children.reduce(function (acc, key) {
        var offsetKey = DraftOffsetKey.encode(key, 0, 0);
        var child = contentState.getBlockForKey(key);
        var customConfig = getCustomRenderConfig(child, blockRendererFn);
        var Component = customConfig.CustomComponent || DraftEditorBlockNode;
        var _getDraftRenderConfig = getDraftRenderConfig(child, blockRenderMap),
          Element = _getDraftRenderConfig.Element,
          wrapperTemplate = _getDraftRenderConfig.wrapperTemplate;
        var elementProps = getElementPropsConfig(child, editorKey, offsetKey, blockStyleFn, customConfig, null);
        var childProps = _objectSpread(_objectSpread({}, _this2.props), {}, {
          tree: editorState.getBlockTree(key),
          blockProps: customConfig.customProps,
          offsetKey: offsetKey,
          block: child
        });
        acc.push(React.createElement(Element, elementProps, /*#__PURE__*/React.createElement(Component, childProps)));
        if (!wrapperTemplate || shouldNotAddWrapperElement(child, contentState)) {
          return acc;
        }

        // if we are here it means we are the last block
        // that has a wrapperTemplate so we should wrap itself
        // and all other previous siblings that share the same wrapper
        applyWrapperElementToSiblings(wrapperTemplate, Element, acc);
        return acc;
      }, []);
    }
    var blockKey = block.getKey();
    var offsetKey = DraftOffsetKey.encode(blockKey, 0, 0);
    var customConfig = getCustomRenderConfig(block, blockRendererFn);
    var Component = customConfig.CustomComponent;
    var blockNode = Component != null ? /*#__PURE__*/React.createElement(Component, _extends({}, this.props, {
      tree: editorState.getBlockTree(blockKey),
      blockProps: customConfig.customProps,
      offsetKey: offsetKey,
      block: block
    })) : /*#__PURE__*/React.createElement(DraftEditorNode, {
      block: block,
      children: children,
      contentState: contentState,
      customStyleFn: customStyleFn,
      customStyleMap: customStyleMap,
      decorator: decorator,
      direction: direction,
      forceSelection: forceSelection,
      hasSelection: isBlockOnSelectionEdge(selection, blockKey),
      selection: selection,
      tree: tree
    });
    if (block.getParentKey()) {
      return blockNode;
    }
    var _getDraftRenderConfig2 = getDraftRenderConfig(block, blockRenderMap),
      Element = _getDraftRenderConfig2.Element;
    var elementProps = getElementPropsConfig(block, editorKey, offsetKey, blockStyleFn, customConfig, this.wrapperRef);

    // root block nodes needs to be wrapped
    return React.createElement(Element, elementProps, blockNode);
  };
  return DraftEditorBlockNode;
}(React.Component);
module.exports = DraftEditorBlockNode;