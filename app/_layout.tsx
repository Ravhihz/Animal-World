import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import '../src/locales/i18n';
import { useAppStore } from '../src/store/useAppStore';
import { colors } from '../src/theme/colors';

// Jangan hide splash sampai font siap
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const resetParentLock = useAppStore((s) => s.resetParentLock);
  const musicVolume = useAppStore((s) => s.musicVolume);

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      resetParentLock();

      // Lazy import AudioManager agar native module tidak diload sebelum waktunya
      import('../src/services/AudioManager').then(({ audioManager }) => {
        audioManager.setMusicVolume(musicVolume);
        audioManager.playBgMusic();
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="animals/index"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="animals/[id]"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="games/matching/index"
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="games/puzzle/index"
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="games/coloring/index"
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
});
