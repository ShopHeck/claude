import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InAppPurchases from 'expo-in-app-purchases';

const PRODUCT_ID = 'decision_maker_premium';
const STORAGE_KEY = 'premium_unlocked';

export default function useIAP() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Read cached unlock state instantly on mount, then verify with store
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'true') setIsPremium(true);
    });
    connect();
    return () => {
      InAppPurchases.disconnectAsync().catch(() => {});
    };
  }, []);

  async function connect() {
    try {
      await InAppPurchases.connectAsync();
      setConnected(true);
      InAppPurchases.setPurchaseListener(({ responseCode, results }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results.forEach((purchase) => {
            if (!purchase.acknowledged) {
              InAppPurchases.finishTransactionAsync(purchase, true);
            }
          });
          unlock();
        }
      });
    } catch (e) {
      // IAP not available in Expo Go or simulator — silently ignore
    }
  }

  function unlock() {
    setIsPremium(true);
    AsyncStorage.setItem(STORAGE_KEY, 'true');
  }

  const purchase = useCallback(async () => {
    if (!connected) return;
    setLoading(true);
    try {
      await InAppPurchases.getProductsAsync([PRODUCT_ID]);
      await InAppPurchases.purchaseItemAsync(PRODUCT_ID);
    } catch (e) {
      // User cancelled or error — do nothing
    } finally {
      setLoading(false);
    }
  }, [connected]);

  const restore = useCallback(async () => {
    if (!connected) return;
    setLoading(true);
    try {
      const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        const hasPremium = results.some((p) => p.productId === PRODUCT_ID);
        if (hasPremium) unlock();
      }
    } catch (e) {
      // Silently ignore
    } finally {
      setLoading(false);
    }
  }, [connected]);

  return { isPremium, purchase, restore, loading };
}
