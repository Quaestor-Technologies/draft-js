/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @oncall draft_js
 */

'use strict';
import type ContentState from 'ContentState';

const BlockMapBuilder = require('BlockMapBuilder');
const ContentBlockNode = require('ContentBlockNode');
const EditorState = require('EditorState');
const SelectionState = require('SelectionState');
const UnicodeUtils = require('UnicodeUtils');

const getSampleStateForTesting = require('getSampleStateForTesting');
const Immutable = require('immutable');
const moveSelectionForward = require('moveSelectionForward');
const removeTextWithStrategy = require('removeTextWithStrategy');

jest.mock('generateRandomKey');
const toggleExperimentalTreeDataSupport = (enabled: boolean) => {
  jest.doMock('gkx', () => name => {
    return name === 'draft_tree_data_support' ? enabled : false;
  });
};
// Seems to be important to put this at the top
toggleExperimentalTreeDataSupport(true);

const {List} = Immutable;

const {contentState} = getSampleStateForTesting();

const contentBlockNodes = [
  new ContentBlockNode({
    key: 'A',
    nextSibling: 'B',
    text: 'Alpha',
    type: 'blockquote',
  }),
  new ContentBlockNode({
    key: 'B',
    prevSibling: 'A',
    nextSibling: 'G',
    type: 'ordered-list-item',
    children: List(['C', 'F']),
  }),
  new ContentBlockNode({
    parent: 'B',
    key: 'C',
    nextSibling: 'F',
    type: 'blockquote',
    children: List(['D', 'E']),
  }),
  new ContentBlockNode({
    parent: 'C',
    key: 'D',
    nextSibling: 'E',
    type: 'header-two',
    text: 'Delta',
  }),
  new ContentBlockNode({
    parent: 'C',
    key: 'E',
    prevSibling: 'D',
    type: 'unstyled',
    text: 'Elephant',
  }),
  new ContentBlockNode({
    parent: 'B',
    key: 'F',
    prevSibling: 'C',
    type: 'code-block',
    text: 'Fire',
  }),
  new ContentBlockNode({
    key: 'G',
    prevSibling: 'B',
    nextSibling: 'H',
    type: 'ordered-list-item',
    text: 'Gorila',
  }),
  new ContentBlockNode({
    key: 'H',
    prevSibling: 'G',
    nextSibling: 'I',
    text: ' ',
    type: 'atomic',
  }),
  new ContentBlockNode({
    key: 'I',
    prevSibling: 'H',
    text: 'last',
    type: 'unstyled',
  }),
];

const createEditorState = (
  anchorKey: string,
  anchorOffset: number,
  focusKey: string = anchorKey,
  focusOffset: number = anchorOffset,
): EditorState =>
  EditorState.forceSelection(
    EditorState.createWithContent(
      contentState.setBlockMap(
        BlockMapBuilder.createFromArray(contentBlockNodes),
      ),
    ),
    SelectionState.createEmpty(anchorKey).merge({
      anchorKey,
      anchorOffset,
      focusKey,
      focusOffset,
    }),
  );

const removeTextForward = (editorState: EditorState): ContentState =>
  removeTextWithStrategy(
    editorState,
    strategyState => {
      const selection = strategyState.getSelection();
      const content = strategyState.getCurrentContent();
      const key = selection.getAnchorKey();
      const offset = selection.getAnchorOffset();
      const charAhead = content.getBlockForKey(key).getText()[offset];
      return moveSelectionForward(
        strategyState,
        charAhead ? UnicodeUtils.getUTF16Length(charAhead, 0) : 1,
      );
    },
    'forward',
  );

test(`at end of a leaf block and sibling is another leaf block forward delete concatenates`, () => {
  const editorState = createEditorState('D', contentBlockNodes[3].getLength());
  const result = removeTextForward(editorState);

  expect(result.getBlockForKey('D').getText()).toBe('DeltaElephant');
  expect(result.getBlockMap().has('E')).toBe(false);
  expect(
    result
      .getBlockForKey('C')
      .getChildKeys()
      .toArray(),
  ).toEqual(['D']);
  expect(result.getBlockForKey('D').getNextSiblingKey()).toBe(null);
});

test(`at end of a leaf block with no next sibling forward delete is no-op`, () => {
  const editorState = createEditorState('E', contentBlockNodes[4].getLength());

  expect(removeTextForward(editorState)).toBe(editorState.getCurrentContent());
});

test(`at end of a leaf block with a non-leaf next sibling forward delete is no-op`, () => {
  const editorState = createEditorState('A', contentBlockNodes[0].getLength());

  expect(removeTextForward(editorState)).toBe(editorState.getCurrentContent());
});

test(`across blocks with forward delete is a no-op`, () => {
  const editorState = createEditorState(
    'D',
    contentBlockNodes[3].getLength(),
    'E',
    contentBlockNodes[4].getLength(),
  );

  expect(removeTextForward(editorState)).toBe(editorState.getCurrentContent());
});
