import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { THEME } from '../constants/colors';

export default function PresetsModal({ visible, onClose, presets, currentOptions, onLoad, onSave, onDelete }) {
  const [saveName, setSaveName] = useState('');
  const [isClass, setIsClass] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    const name = saveName.trim();
    if (!name) return;
    setSaving(true);
    onSave(name, currentOptions, isClass);
    setSaveName('');
    setIsClass(false);
    setSaving(false);
  }

  function handleLoad(preset) {
    onLoad(preset.options, preset.isClass);
    onClose();
  }

  function handleDelete(preset) {
    Alert.alert('Delete Preset', `Delete "${preset.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(preset.id) },
    ]);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Presets</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.closeX}>✕</Text>
            </Pressable>
          </View>

          {/* Save current list */}
          <View style={styles.saveSection}>
            <Text style={styles.sectionLabel}>Save current list</Text>
            <View style={styles.saveRow}>
              <TextInput
                style={styles.nameInput}
                placeholder="List name (e.g. Lunch Options)"
                placeholderTextColor={THEME.placeholder}
                value={saveName}
                onChangeText={setSaveName}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
              <Pressable
                style={[styles.saveBtn, (!saveName.trim() || saving) && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={!saveName.trim() || saving}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
            <View style={styles.classRow}>
              <Text style={styles.classLabel}>🎓 Class list (Teacher Mode)</Text>
              <Switch
                value={isClass}
                onValueChange={setIsClass}
                trackColor={{ true: THEME.accent }}
                thumbColor={THEME.white}
              />
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Saved presets */}
          {presets.length === 0 ? (
            <Text style={styles.emptyText}>No saved presets yet.</Text>
          ) : (
            <FlatList
              data={presets}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <View style={styles.presetRow}>
                  <Pressable style={styles.presetInfo} onPress={() => handleLoad(item)}>
                    <Text style={styles.presetName}>
                      {item.isClass ? '🎓 ' : ''}{item.name}
                    </Text>
                    <Text style={styles.presetMeta}>{item.options.length} options</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDelete(item)} hitSlop={12}>
                    <Text style={styles.deleteBtn}>🗑</Text>
                  </Pressable>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: THEME.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text,
  },
  closeX: {
    fontSize: 18,
    color: '#999',
  },
  saveSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  saveRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: THEME.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: THEME.text,
  },
  saveBtn: {
    backgroundColor: THEME.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: THEME.white,
    fontWeight: '600',
    fontSize: 15,
  },
  classRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  classLabel: {
    fontSize: 14,
    color: THEME.text,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.inputBorder,
    marginBottom: 16,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
  list: {
    flexGrow: 0,
  },
  presetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.inputBorder,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  presetMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deleteBtn: {
    fontSize: 18,
    paddingLeft: 12,
  },
});
