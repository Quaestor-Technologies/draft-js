/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 * @oncall draft_js
 */

'use strict';

var _excluded = ["editorState"],
  _excluded2 = ["editorState"];
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var cx = require("fbjs/lib/cx");
var React = require("react");
var shallowEqual = require("fbjs/lib/shallowEqual");
/**
 * This component is responsible for rendering placeholder text for the
 * `DraftEditor` component.
 *
 * Override placeholder style via CSS.
 */
var DraftEditorPlaceholder = /*#__PURE__*/function (_React$Component) {
  function DraftEditorPlaceholder() {
    return _React$Component.apply(this, arguments) || this;
  }
  _inheritsLoose(DraftEditorPlaceholder, _React$Component);
  var _proto = DraftEditorPlaceholder.prototype;
  _proto.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
    var _this$props = this.props,
      editorState = _this$props.editorState,
      otherProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
    var nextEditorState = nextProps.editorState,
      nextOtherProps = _objectWithoutPropertiesLoose(nextProps, _excluded2);
    return editorState.getSelection().getHasFocus() !== nextEditorState.getSelection().getHasFocus() || !shallowEqual(otherProps, nextOtherProps);
  };
  _proto.render = function render() {
    var innerClassName =
    // We can't use joinClasses since the fbjs flow definition is wrong. Using
    // cx to concatenate is rising issues with haste internally.
    // eslint-disable-next-line fb-www/cx-concat
    cx('public/DraftEditorPlaceholder/inner') + (this.props.className != null ? " ".concat(this.props.className) : '');
    return /*#__PURE__*/React.createElement("div", {
      "aria-hidden": this.props.ariaHidden,
      className: cx({
        'public/DraftEditorPlaceholder/root': true,
        'public/DraftEditorPlaceholder/hasFocus': this.props.editorState.getSelection().getHasFocus()
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: innerClassName,
      id: this.props.accessibilityID,
      style: {
        whiteSpace: 'pre-wrap'
      }
    }, this.props.text));
  };
  return DraftEditorPlaceholder;
}(React.Component);
module.exports = DraftEditorPlaceholder;