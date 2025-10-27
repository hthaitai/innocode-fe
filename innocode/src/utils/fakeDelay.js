// utils/fakeDelay.js
export const delay = (value, time = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(value), time))
