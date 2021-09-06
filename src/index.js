import { useMemo, useState } from "react";
import { cloneDeep, isEqual } from "lodash-es";

export default function useUndoableState(init) {
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState([init]);

  const state = useMemo(() => states[index], [states, index]);

  const setState = (value) => {
    if (isEqual(state, value)) {
      return;
    }
    const copy = cloneDeep(states);
    copy.length = index + 1;
    copy.push(value);
    setStates(copy);
    setIndex(copy.length - 1);
  };

  const resetState = (init) => {
    setIndex(0);
    setStates([init]);
  };

  const goBack = (steps = 1) => {
    setIndex(Math.max(0, index - steps));
  };

  const goForward = (steps = 1) => {
    setIndex(Math.min(states.length - 1, index + steps));
  };

  return {
    state: state,
    setState: setState,
    resetState: resetState,
    index: index,
    lastIndex: states.length - 1,
    goBack: goBack,
    goForward: goForward,
  };
}
