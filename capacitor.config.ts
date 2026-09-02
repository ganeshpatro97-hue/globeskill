import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.globeskill.app',
  appName: 'GlobeSkill',
  webDir: 'public',
  server: {
    // Connects seamlessly to the live GlobeSkill Vercel server with instant auto-updates
    url: 'https://globeskill-ssqf-git-main-ganeshpatro97-hue.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  }
};

export default config;
