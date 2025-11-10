/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
var DraftOffsetKey = require("./DraftOffsetKey");
var UnicodeBidi = require("fbjs/lib/UnicodeBidi");
var UnicodeBidiDirection = require("fbjs/lib/UnicodeBidiDirection");
var React = require("react");
var DraftEditorDecoratedLeaves = /*#__PURE__*/function (_React$Component) {
  function DraftEditorDecoratedLeaves() {
    return _React$Component.apply(this, arguments) || this;
  }
  _inheritsLoose(DraftEditorDecoratedLeaves, _React$Component);
  var _proto = DraftEditorDecoratedLeaves.prototype;
  _proto.render = function render() {
    var _this$props = this.props,
      block = _this$props.block,
      children = _this$props.children,
      contentState = _this$props.contentState,
      decorator = _this$props.decorator,
      decoratorKey = _this$props.decoratorKey,
      direction = _this$props.direction,
      leafSet = _this$props.leafSet,
      text = _this$props.text;
    var blockKey = block.getKey();
    var leavesForLeafSet = leafSet.get('leaves');
    var DecoratorComponent = decorator.getComponentForKey(decoratorKey);
    var decoratorProps = decorator.getPropsForKey(decoratorKey);
    var decoratorOffsetKey = DraftOffsetKey.encode(blockKey, parseInt(decoratorKey, 10), 0);
    var decoratedText = text.slice(leavesForLeafSet.first().get('start'), leavesForLeafSet.last().get('end'));

    // Resetting dir to the same value on a child node makes Chrome/Firefox
    // confused on cursor movement. See http://jsfiddle.net/d157kLck/3/
    var dir = UnicodeBidiDirection.getHTMLDirIfDifferent(UnicodeBidi.getDirection(decoratedText), direction);
    return /*#__PURE__*/React.createElement(DecoratorComponent, _extends({}, decoratorProps, {
      contentState: contentState,
      decoratedText: decoratedText,
      dir: dir,
      key: decoratorOffsetKey,
      entityKey: block.getEntityAt(leafSet.get('start')),
      offsetKey: decoratorOffsetKey
    }), children);
  };
  return DraftEditorDecoratedLeaves;
}(React.Component);
module.exports = DraftEditorDecoratedLeaves;