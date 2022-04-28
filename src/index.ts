import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import React from "react";

export default function useUndoableState<T>(init: T, debouncePeriod?: number) {
  const [index, setIndex] = React.useState(0);
  const [state, setRawState] = React.useState(init);
  const [states, setStates] = React.useState([init]);

  const debouncedSetStates = React.useMemo(
    () =>
      debounce((value: T) => {
        const copy = [...states];
        copy.length = index + 1; // delete all history after index
        copy.push(value);
        setStates(copy);
        setIndex(copy.length - 1);
      }, debouncePeriod ?? 500),
    [states, index]
  );

  const setState = (value: T): void => {
    if (isEqual(state, value)) {
      return;
    }
    setRawState(value);
    debouncedSetStates(value);
  };

  const resetState = (init: T): void => {
    setIndex(0);
    setRawState(init);
    setStates([init]);
  };

  const goBack = (steps: number = 1): void => {
    const newIndex = Math.max(0, Number(index) - (Number(steps) || 1));
    setIndex(newIndex);
    setRawState(states[newIndex]);
  };

  const goForward = (steps: number = 1): void => {
    const newIndex = Math.min(
      states.length - 1,
      Number(index) + (Number(steps) || 1)
    );
    setIndex(newIndex);
    setRawState(states[newIndex]);
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
