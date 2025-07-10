import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const EmptyList: React.FC = () => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={styles.emptyContainer}
    >
      <Text style={styles.emptyText}>No tasks yet, add one!</Text>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
});

export default EmptyList;
