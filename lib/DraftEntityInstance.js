/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 * @legacyServerCallableInstance
 * @oncall draft_js
 */

'use strict';

function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var Immutable = require("immutable");
var Record = Immutable.Record;
var DraftEntityInstanceRecord = Record({
  type: 'TOKEN',
  mutability: 'IMMUTABLE',
  data: Object
});

/**
 * An instance of a document entity, consisting of a `type` and relevant
 * `data`, metadata about the entity.
 *
 * For instance, a "link" entity might provide a URI, and a "mention"
 * entity might provide the mentioned user's ID. These pieces of data
 * may be used when rendering the entity as part of a ContentBlock DOM
 * representation. For a link, the data would be used as an href for
 * the rendered anchor. For a mention, the ID could be used to retrieve
 * a hovercard.
 */
var DraftEntityInstance = /*#__PURE__*/function (_DraftEntityInstanceR) {
  function DraftEntityInstance() {
    return _DraftEntityInstanceR.apply(this, arguments) || this;
  }
  _inheritsLoose(DraftEntityInstance, _DraftEntityInstanceR);
  var _proto = DraftEntityInstance.prototype;
  _proto.getType = function getType() {
    return this.get('type');
  };
  _proto.getMutability = function getMutability() {
    return this.get('mutability');
  };
  _proto.getData = function getData() {
    return this.get('data');
  };
  return DraftEntityInstance;
}(DraftEntityInstanceRecord);
module.exports = DraftEntityInstance;