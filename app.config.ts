import type { ConfigContext, ExpoConfig } from 'expo/config';

import appJson from './app.json';

const base = appJson.expo as ExpoConfig;

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosUrlScheme =
    process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME?.trim() || undefined;

  const plugins = [...(base.plugins ?? [])];

  if (iosUrlScheme) {
    plugins.push([
      '@react-native-google-signin/google-signin',
      { iosUrlScheme },
    ]);
  } else {
    plugins.push('@react-native-google-signin/google-signin');
  }

  return {
    ...config,
    ...base,
    plugins,
  };
};
