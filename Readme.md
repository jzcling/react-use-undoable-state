# React useUndoableState Hook

A lightweight module to store historical state and allow undo/redo, including multiple steps backward or forward.

## Installation

```
npm install --save @jeremyling/react-use-undoable-state
```

The following packages are peer dependencies and must be installed for this package to work.

```
react
lodash
```

## Usage Example

Here's a code sandbox for how this hook is used: https://codesandbox.io/s/use-undoable-state-2spts

```js
import React from "react";
import useUndoableState from "@jeremyling/react-use-undoable-state";

export default function Document() {
  const {
    state: doc,
    setState: setDoc,
    resetState: resetDoc,
    index: docStateIndex,
    lastIndex: docStateLastIndex,
    goBack: undoDoc,
    goForward: redoDoc,
  } = useUndoableState(
    { text: "The quick brown fox jumps over the lazy dog" }, // initial value
    500 // debounce timeout before states gets updated (optional - defaults to 500)
  );

  const canUndo = docStateIndex > 0;
  const canRedo = docStateIndex < docStateLastIndex;

  return ...
}
```

## Concept

As with useState, useUndoableState accepts only 1 argument, the initial value. Behind the scenes, the hook uses two main variables to determine state - `index` (number) and `states` (array). `states` stores the historical values of the state while `index` determines current state by indicating the current position in the array. `states` is only written to after a debounced period of `debouncePeriod` (passed as second param of hook, defaults to 500).

You may navigate through historical states by using the `goBack` and `goForward` functions emitted by the hook. However, if you make a call to `setState` and `index` is not at the end of the `states` array, all states after `index` is erased and `index` will go back to the end of the `states` array.

The following table attempts to provide a more detailed explanation of the object returned by the hook:

| Prop       | Type                      | Usage             | Description                                                           |
| ---------- | ------------------------- | ----------------- | --------------------------------------------------------------------- |
| state      | `T: any`                  |                   | Current state, initialised with argument passed                       |
| setState   | `(value: T) => void`      | setState(value)   | Sets state to value. All values after current `index` is erased       |
| resetState | `(init: T) => void`       | resetState(value) | Deletes historical states and resets to value                         |
| index      | `number`                  |                   | The current index in the `states` array                               |
| lastIndex  | `number`                  |                   | The last index in the `states` array. To determine if can `goForward` |
| goBack     | `(steps: number) => void` | goBack(2)         | Goes back the number of steps passed                                  |
| goForward  | `(steps: number) => void` | goForward(3)      | Goes forward the number of steps passed                               |
