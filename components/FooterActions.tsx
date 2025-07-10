import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FooterActionsProps {
  onClear: () => void;
}

const FooterActions: React.FC<FooterActionsProps> = ({ onClear }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={styles.footer}
    >
      <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <Text style={styles.clearButtonText}>Clear Completed</Text>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#f8fafc',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FooterActions;
