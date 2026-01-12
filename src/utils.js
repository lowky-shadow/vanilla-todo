export const debounce = (fn,delay) =>{
  let timerId = null;

  return (...args) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};