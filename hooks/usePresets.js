import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'presets_v1';

export default function usePresets() {
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setPresets(JSON.parse(raw));
        } catch (e) {
          // Corrupted data — reset
          setPresets([]);
        }
      }
    });
  }, []);

  async function persist(next) {
    setPresets(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const savePreset = useCallback(async (name, options, isClass) => {
    const id = Date.now().toString();
    const next = [...presets, { id, name, options, isClass: !!isClass }];
    await persist(next);
  }, [presets]);

  const deletePreset = useCallback(async (id) => {
    const next = presets.filter((p) => p.id !== id);
    await persist(next);
  }, [presets]);

  return { presets, savePreset, deletePreset };
}
