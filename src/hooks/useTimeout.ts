import { useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook to set a timeout
 * @param callback - Callback function to be called after timeout
 * @param milliseconds - Delay in milliseconds
 * @returns {reset, clear} - reset function to reset the timeout and clear function to clear the timeout
 */
export default function useTimeout(
	callback: () => void,
	milliseconds: number
): { reset: () => void; clear: () => void } {
	const callbackRef = useRef(callback);
	const timeoutRef = useRef<number | null>(null);

	// Sets the timeoutRef to a new timeout
	const set = useCallback(() => {
		timeoutRef.current = window.setTimeout(callbackRef.current, milliseconds);
	}, [milliseconds]);

	// Calls clearTimeout on the the timoutRef
	const clear = useCallback(() => {
		if (!timeoutRef.current) return;
		clearTimeout(timeoutRef.current);
	}, []);

	// Clears the timeout and sets it to a new one
	const reset = useCallback(() => {
		clear();
		set();
	}, [clear, set]);

	// Set callback ref
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	// Clear timeout if the component is unmounted or the delay changes
	useEffect(() => {
		set();
		return clear;
	}, [milliseconds, set, clear]);

	return {
		reset,
		clear
	};
}
