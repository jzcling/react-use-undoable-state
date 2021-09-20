import { useMemo, useState } from "react";
import _ from "lodash";

export default function useUndoableState(init) {
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState([init]);

  const state = useMemo(() => states[index], [states, index]);

  const setState = (value) => {
    if (_.isEqual(state, value)) {
      return;
    }
    const copy = _.cloneDeep(states);
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
    setIndex(Math.max(0, Number(index) - (Number(steps) || 1)));
  };

  const goForward = (steps = 1) => {
    setIndex(Math.min(states.length - 1, Number(index) + (Number(steps) || 1)));
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
