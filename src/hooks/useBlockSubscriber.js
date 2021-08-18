import { useEffect, useRef } from 'react';

export default function useBlockSubscriber(props) {

  const newBlockSubscription = useRef(null);
  const { web3, dispatch } = props;

  useEffect(() => {
    if (web3 !== null) {
      newBlockSubscription.current = web3.eth.subscribe('newBlockHeaders',
        (error, result) => {
          if (error) {
            console.error(error)
          } else if (result.number !== null) {
            dispatch({ type: 'setBlockNumber', blockNumber: result.number })
          }
        }).on("data", (result) => {
          if (result.number !== null) {
            dispatch({ type: 'setBlockNumber', blockNumber: result.number })
          }
        }).on("error", (error) => {
          console.error(error)
        });
    } else if (newBlockSubscription.current !== null) {
      newBlockSubscription.current = null;
    }

    return () => {
      if (newBlockSubscription.current !== null) {
        newBlockSubscription.current.unsubscribe((error, success) => {
          if (error) {
            console.error(error)
          } else if (success) {
            newBlockSubscription.current = null;
          }
        });
      }
    }
  }, [web3, dispatch]);

}
