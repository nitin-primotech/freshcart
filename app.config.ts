// @ts-ignore
import { withDangerousMod } from '@expo/config-plugins';
import type { ConfigContext, ExpoConfig } from 'expo/config';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';

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

  // Automatically inject use_modular_headers! into the generated Podfile
  plugins.push(((config: any) => {
    return withDangerousMod(config, [
      'ios',
      async (config: any) => {
        const podfilePath = path.join(
          config.modRequest.platformProjectRoot,
          'Podfile',
        );
        let podfileContent = await fs.promises.readFile(podfilePath, 'utf-8');

        if (!podfileContent.includes('use_modular_headers!')) {
          podfileContent = podfileContent.replace(
            /(platform :ios, .*)/,
            '$1\nuse_modular_headers!',
          );
          await fs.promises.writeFile(podfilePath, podfileContent, 'utf-8');
        }
        return config;
      },
    ]);
  }) as any);

  return {
    ...config,
    ...base,
    plugins,
  };
};
