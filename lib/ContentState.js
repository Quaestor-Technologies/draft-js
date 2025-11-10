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

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var BlockMapBuilder = require("./BlockMapBuilder");
var CharacterMetadata = require("./CharacterMetadata");
var ContentBlock = require("./ContentBlock");
var ContentBlockNode = require("./ContentBlockNode");
var DraftEntity = require("./DraftEntity");
var SelectionState = require("./SelectionState");
var generateRandomKey = require("./generateRandomKey");
var getOwnObjectValues = require("./getOwnObjectValues");
var gkx = require("./gkx");
var Immutable = require("immutable");
var sanitizeDraftText = require("./sanitizeDraftText");
var List = Immutable.List,
  Record = Immutable.Record,
  Repeat = Immutable.Repeat,
  ImmutableMap = Immutable.Map,
  OrderedMap = Immutable.OrderedMap;
var defaultRecord = {
  entityMap: null,
  blockMap: null,
  selectionBefore: null,
  selectionAfter: null
};

// Immutable 3 typedefs are not good, so ContentState ends up
// subclassing `any`. Define a rudimentary type for the
// supercalss here instead.

var ContentStateRecord = Record(defaultRecord);

/* $FlowFixMe[signature-verification-failure] Supressing a `signature-
 * verification-failure` error here. TODO: T65949050 Clean up the branch for
 * this GK */
var ContentBlockNodeRecord = gkx('draft_tree_data_support') ? ContentBlockNode : ContentBlock;
var ContentState = /*#__PURE__*/function (_ContentStateRecord) {
  function ContentState() {
    return _ContentStateRecord.apply(this, arguments) || this;
  }
  _inheritsLoose(ContentState, _ContentStateRecord);
  var _proto = ContentState.prototype;
  _proto.getEntityMap = function getEntityMap() {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity;
  };
  _proto.getBlockMap = function getBlockMap() {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.get('blockMap');
  };
  _proto.getSelectionBefore = function getSelectionBefore() {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.get('selectionBefore');
  };
  _proto.getSelectionAfter = function getSelectionAfter() {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.get('selectionAfter');
  };
  _proto.getBlockForKey = function getBlockForKey(key) {
    var block = this.getBlockMap().get(key);
    return block;
  };
  _proto.getKeyBefore = function getKeyBefore(key) {
    return this.getBlockMap().reverse().keySeq().skipUntil(function (v) {
      return v === key;
    }).skip(1).first();
  };
  _proto.getKeyAfter = function getKeyAfter(key) {
    return this.getBlockMap().keySeq().skipUntil(function (v) {
      return v === key;
    }).skip(1).first();
  };
  _proto.getBlockAfter = function getBlockAfter(key) {
    return this.getBlockMap().skipUntil(function (_, k) {
      return k === key;
    }).skip(1).first();
  };
  _proto.getBlockBefore = function getBlockBefore(key) {
    return this.getBlockMap().reverse().skipUntil(function (_, k) {
      return k === key;
    }).skip(1).first();
  };
  _proto.getBlocksAsArray = function getBlocksAsArray() {
    return this.getBlockMap().toArray();
  };
  _proto.getFirstBlock = function getFirstBlock() {
    return this.getBlockMap().first();
  };
  _proto.getLastBlock = function getLastBlock() {
    return this.getBlockMap().last();
  };
  _proto.getPlainText = function getPlainText(delimiter) {
    return this.getBlockMap().map(function (block) {
      return block ? block.getText() : '';
    }).join(delimiter || '\n');
  };
  _proto.getLastCreatedEntityKey = function getLastCreatedEntityKey() {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity.__getLastCreatedEntityKey();
  };
  _proto.hasText = function hasText() {
    var blockMap = this.getBlockMap();
    return blockMap.size > 1 ||
    // make sure that there are no zero width space chars
    escape(blockMap.first().getText()).replace(/%u200B/g, '').length > 0;
  };
  _proto.createEntity = function createEntity(type, mutability, data) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__create(type, mutability, data);
    return this;
  };
  _proto.mergeEntityData = function mergeEntityData(key, toMerge) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__mergeData(key, toMerge);
    return this;
  };
  _proto.replaceEntityData = function replaceEntityData(key, newData) {
    // TODO: update this when we fully remove DraftEntity
    /* $FlowFixMe[class-object-subtyping] added when improving typing for this
     * parameters */
    DraftEntity.__replaceData(key, newData);
    return this;
  };
  _proto.addEntity = function addEntity(instance) {
    // TODO: update this when we fully remove DraftEntity
    DraftEntity.__add(instance);
    return this;
  };
  _proto.getEntity = function getEntity(key) {
    // TODO: update this when we fully remove DraftEntity
    return DraftEntity.__get(key);
  };
  _proto.getAllEntities = function getAllEntities() {
    return DraftEntity.__getAll();
  };
  _proto.setEntityMap = function setEntityMap(entityMap) {
    DraftEntity.__loadWithEntities(entityMap);
    return this;
  };
  ContentState.mergeEntityMaps = function mergeEntityMaps(to, from) {
    return to.merge(from.__getAll());
  }

  // TODO: when EntityMap is moved into content state this and `setEntityMap`
  // Will be the exact same. Merge them then.
  ;
  _proto.replaceEntityMap = function replaceEntityMap(entityMap) {
    return this.setEntityMap(entityMap.__getAll());
  };
  _proto.setSelectionBefore = function setSelectionBefore(selection) {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.set('selectionBefore', selection);
  };
  _proto.setSelectionAfter = function setSelectionAfter(selection) {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.set('selectionAfter', selection);
  };
  _proto.setBlockMap = function setBlockMap(blockMap) {
    // $FlowFixMe[prop-missing] found when removing casts of this to any
    return this.set('blockMap', blockMap);
  };
  ContentState.createFromBlockArray = function createFromBlockArray(
  // TODO: update flow type when we completely deprecate the old entity API
  blocks, entityMap) {
    // TODO: remove this when we completely deprecate the old entity API
    var theBlocks = Array.isArray(blocks) ? blocks : blocks.contentBlocks;
    var blockMap = BlockMapBuilder.createFromArray(theBlocks);
    var selectionState = blockMap.isEmpty() ? new SelectionState() : SelectionState.createEmpty(blockMap.first().getKey());
    return new ContentState({
      blockMap: blockMap,
      entityMap: entityMap || DraftEntity,
      selectionBefore: selectionState,
      selectionAfter: selectionState
    });
  };
  ContentState.createFromText = function createFromText(text) {
    var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /\r\n?|\n/g;
    var strings = text.split(delimiter);
    var blocks = strings.map(function (block) {
      block = sanitizeDraftText(block);
      return new ContentBlockNodeRecord({
        key: generateRandomKey(),
        text: block,
        type: 'unstyled',
        characterList: List(Repeat(CharacterMetadata.EMPTY, block.length))
      });
    });
    return ContentState.createFromBlockArray(blocks);
  };
  ContentState.fromJS = function fromJS(state) {
    return new ContentState(_objectSpread(_objectSpread({}, state), {}, {
      blockMap: OrderedMap(state.blockMap).map(
      // $FlowFixMe[method-unbinding]
      ContentState.createContentBlockFromJS),
      selectionBefore: new SelectionState(state.selectionBefore),
      selectionAfter: new SelectionState(state.selectionAfter)
    }));
  };
  ContentState.createContentBlockFromJS = function createContentBlockFromJS(block) {
    var characterList = block.characterList;
    return new ContentBlockNodeRecord(_objectSpread(_objectSpread({}, block), {}, {
      data: ImmutableMap(block.data),
      characterList: characterList != null ? List((Array.isArray(characterList) ? characterList : getOwnObjectValues(characterList)).map(function (c) {
        return CharacterMetadata.fromJS(c);
      })) : undefined
    }));
  };
  return ContentState;
}(ContentStateRecord);
module.exports = ContentState;