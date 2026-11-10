import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { shadows } from '../../src/theme/spacing';

function TabIcon({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.tabIconWrapper, focused && styles.tabIconActive]}>
      <Text style={[styles.tabEmoji, { fontSize: focused ? 26 : 22 }]}>{emoji}</Text>
      {focused && <Text style={styles.tabDot}>●</Text>}
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBg,
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 10,
          paddingTop: 6,
          ...shadows.lg,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.sizes.tiny,
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Beranda" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Koleksi',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🐾" label="Koleksi" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Pengaturan',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" label="Pengaturan" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 36,
  },
  tabIconActive: {
    backgroundColor: `${colors.primary}18`,
    borderRadius: 12,
  },
  tabEmoji: {
    textAlign: 'center',
  },
  tabDot: {
    fontSize: 6,
    color: colors.tabActive,
    marginTop: 1,
  },
});
