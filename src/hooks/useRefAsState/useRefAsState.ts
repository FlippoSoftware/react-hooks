import { useState } from 'react';

export type RefAsState<Value> = {
    (node: Value): void;
    current: Value;
    state?: Value;
};

export function createRefState<Value>(initialValue: Value | undefined, setState: (value: Value) => void) {
    let temp = initialValue;
    function ref(value: Value) {
        if (temp === value) return;
        temp = value;
        setState(temp);
    }

    Object.defineProperty(ref, 'current', {
        get() {
            return temp;
        },
        set(value: Value) {
            if (temp === value) return;
            temp = value;
            setState(temp);
        },
        configurable: true,
        enumerable: true
    });

    return ref as RefAsState<Value>;
}

/**
 * Hook that returns the state reference of the value
 *
 * @typeParam Value - The type of the value
 * @param initialValue - The initial value
 * @returns The current value
 *
 * @example
 * ```ts
 * const internalRefState = useRefState();
 * ```
 */
export function useRefAsState<Value>(initialValue?: Value) {
    const [state, setState] = useState<Value | undefined>(initialValue);
    const [ref] = useState(() => createRefState<Value>(initialValue, setState));
    ref.state = state;
    return ref;
}
