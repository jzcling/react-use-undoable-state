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

## Concept

As with useState, useUndoableState accepts only 1 argument, the initial value. Behind the scenes, the hook uses two main variables to determine state - `index` (number) and `states` (array). `states` store the historical values of the state while `index` determines current state by indicating the current position in the array.

You may navigate through historical states by using the `goBack` and `goForward` functions emitted by the hook. However, if you make a call to `setState` and `index` is not at the end of the `states` array, all states after `index` is erased and `index` will go back the the end of the `states` array.

The following table attempts to provide a more detailed explanation of the object returned by the hook:

| Prop       | Type     | Usage             | Description                                                     |
| ---------- | -------- | ----------------- | --------------------------------------------------------------- |
| state      | `any`    |                   | Current state, initialised with argument passed                 |
| setState   | `func`   | setState(value)   | Sets state to value. All values after current `index` is erased |
| resetState | `func`   | resetState(value) | Deletes historical states and resets to value                   |
| index      | `number` |                   | The current index in the `states` array                         |
| goBack     | `func`   | goBack(2)         | Goes back the number of steps passed                            |
| goForward  | `func`   | goForward(3)      | Goes forward the number of steps passed                         |

```js
import React from "react";

export default function Document() {
  const {
    state: doc,
    setState: setDoc,
    resetState: resetDoc,
    index: docStateIndex,
    goBack: undoDoc,
    goForward: redoDoc,
  } = useUndoableState({ text: "The quick brown fox jumps over the lazy dog" });
}
```
