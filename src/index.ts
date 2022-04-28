import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import React from "react";

export default function useUndoableState<T>(init: T) {
  const [index, setIndex] = React.useState(0);
  const [states, setStates] = React.useState([init]);

  const state = React.useMemo(() => states[index], [states, index]);

  const setState = (value: T): void => {
    if (isEqual(state, value)) {
      return;
    }
    const copy = cloneDeep(states);
    copy.length = index + 1;
    copy.push(value);
    setStates(copy);
    setIndex(copy.length - 1);
  };

  const resetState = (init: T): void => {
    setIndex(0);
    setStates([init]);
  };

  const goBack = (steps: number = 1): void => {
    setIndex(Math.max(0, Number(index) - (Number(steps) || 1)));
  };

  const goForward = (steps: number = 1): void => {
    setIndex(Math.min(states.length - 1, Number(index) + (Number(steps) || 1)));
  };

  return {
    state,
    setState,
    resetState,
    index,
    lastIndex: states.length - 1,
    goBack,
    goForward,
  };
}
