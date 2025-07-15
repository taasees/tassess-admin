// loadingEvents.js
const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener); // unsubscribe function
}

export function emit(isLoading) {
  listeners.forEach((listener) => listener(isLoading));
}
