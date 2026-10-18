import React from 'react';

function transformValue(text: string) {
    // Manually replace all &nbsp; to avoid get different unicode characters;
    return text.replace(/\u00A0/g, ' ');
}

/**
 * Copies text to the clipboard and remembers for a while that it did.
 *
 * @param params - `timeout`: how long `copied` stays `true`, in milliseconds (2000 by default).
 * @returns `copy(text)`, `copied`, `error` (the last failure) and `reset()`.
 */
export function useClipboard(params: UseClipboard.Params) {
    const { timeout = 2000 } = params;

    const [error, setError] = React.useState<Error | null>(null);
    const [copied, setCopied] = React.useState(false);
    const [copyTimeout, setCopyTimeout] = React.useState<ReturnType<typeof setTimeout> | null>(null);

    const onClearTimeout = React.useCallback(() => {
        if (copyTimeout) {
            clearTimeout(copyTimeout);
        }
    }, [copyTimeout]);

    const handleCopyResult = React.useCallback(
        (value: boolean) => {
            onClearTimeout();
            setCopyTimeout(setTimeout(() => setCopied(false), timeout));
            setCopied(value);
        },
        [onClearTimeout, timeout]
    );

    const copy = React.useCallback(
        (valueToCopy: any) => {
            if ('clipboard' in navigator) {
                const transformedValue = typeof valueToCopy === 'string' ? transformValue(valueToCopy) : valueToCopy;

                navigator.clipboard
                    .writeText(transformedValue)
                    .then(() => handleCopyResult(true))
                    .catch((err) => setError(err));
            } else {
                setError(new Error('useClipboard: navigator.clipboard is not supported'));
            }
        },
        [handleCopyResult]
    );

    const reset = React.useCallback(() => {
        setCopied(false);
        setError(null);
        onClearTimeout();
    }, [onClearTimeout]);

    return {
        copy,
        reset,
        error,
        copied
    };
}

export namespace UseClipboard {
    export type Params = {
        /**
         * The time in milliseconds to wait before resetting the clipboard.
         * @default 2000
         */
        timeout?: number;
    };

    export type Return = ReturnType<typeof useClipboard>;
}
