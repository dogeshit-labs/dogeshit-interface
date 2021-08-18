import { useCallback } from 'react';

import useStickyState from '../hooks/useStickyState.js';

export default function useStorageState() {

  const [isLight, storeIsLight] = useStickyState(false, "isLightTheme");
  const [isShit, storeIsShit] = useStickyState(false, "isShitTheme");
  const [provider, storeProvider] = useStickyState(null, "lastProvider");
  const [useWeb3GP, storeUseWeb3GP] = useStickyState(true, "useWeb3GasPrice");
  const [gasPrice, storeGasPrice] = useStickyState(-1, "gasPrice");
  const [offlineAccount, storeOfflineAccount] = useStickyState(null, "offlineAccount");

  const getStoredValue = useCallback((key) => {
    switch(key) {
      case 'isLightTheme':
        return isLight;
      case 'isShitTheme':
        return isShit;
      case 'provider':
        return provider;
      case 'useWeb3GasPrice':
        return useWeb3GP;
      case 'customGasPrice':
        return gasPrice;
      case 'offlineAccount':
        return offlineAccount;
      default: {
        return undefined;
      }
    }
  }, [isLight, isShit, provider, useWeb3GP, gasPrice, offlineAccount]);

  const setStoredValue = useCallback((key, value) => {
   switch(key) {
      case 'isLightTheme':
        storeIsLight(value);
        break;
      case 'isShitTheme':
        storeIsShit(value);
        break;
      case 'provider':
        storeProvider(value);
        break;
      case 'useWeb3GasPrice':
        storeUseWeb3GP(value);
        break;
      case 'customGasPrice':
        storeGasPrice(value);
        break;
      case 'offlineAccount':
        storeOfflineAccount(value);
        break;
      default:
        break;
   }
  }, [storeIsLight, storeIsShit, storeProvider, storeUseWeb3GP, storeGasPrice, storeOfflineAccount]);

  return [getStoredValue, setStoredValue];
}
