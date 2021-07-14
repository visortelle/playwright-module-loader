import { useEffect, useState } from 'react';

/** Just a regular button, but uses React hooks.
 * It's a special case that doesn't work out of the box due to React should be only in a single bundle.
 */
export default () => {
  const [counter, setCounter] = useState(42);

  useEffect(() => {
    setTimeout(() => setCounter(counter + 1), 100);
  }, [counter]);

  return (<button id="test-button">Test button {counter}</button>);
}
