import { useEffect, useState } from 'react';

function useStickyState(defaultValue, key) {

  var stickyValue = null;
  const [value, setValue] = useState(() => {
  try {
      stickyValue = window.localStorage.getItem(key);
    } catch (error) {
     console.error(`Error on read from local storage for ${key}.`);
     console.error(error);
    }
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  useEffect(() => {
    console.log("Storing", key, value)
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error when writing ${JSON.stringify(value)} to ${key}.`)
      console.error(error);
    }
  }, [key, value]);
  return [value, setValue];
};

export default useStickyState;
