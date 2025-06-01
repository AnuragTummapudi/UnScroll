# Building an APK for Your Expo React Native App

## 1. Prerequisites

- Install [Node.js](https://nodejs.org/)
- Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- Install [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```
  npm install -g expo-cli
  ```
- Log in to Expo:
  ```
  npx expo login
  ```

## 2. Build the APK

From your project root (`d:\Projects\HackVyuha 25`):

### For Expo Managed Workflow

1. **Start the build:**

   ```
   npx expo build:android
   ```

   or for EAS Build (recommended for new projects):

   ```
   npx expo install eas-cli
   npx eas build -p android --profile preview
   ```

2. **Follow the prompts** to log in and set up your Expo account if needed.

3. **Wait for the build to finish.**  
   You will get a link to download the APK (or AAB for Play Store).

### For Bare Workflow

If you have ejected, run:

```
cd android
./gradlew assembleRelease
```

The APK will be in `android/app/build/outputs/apk/release/app-release.apk`.

## 3. Install the APK on Your Device

- Download the APK to your device or use:
  ```
  adb install path/to/your.apk
  ```

## 4. References

- [Expo Build Docs](https://docs.expo.dev/classic/building-standalone-apps/)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
