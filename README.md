# Babysitter App

## Technology Used

### Mobile App (Ionic Cordova)
- **Framework:** Ionic Cordova
- **Integration:** Angular Type

## Prerequisites for Mobile App Development (MacOS)
- Node / NPM
- Apache Cordova: 
- Ionic Framework: npm install -g @ionic/cli (> 7)
- brew: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
- cocoapods: brew install cocoapods
- Xcode

## Prerequisites for Mobile App Development
- Node / NPM
- Gradle
- Zipalign
- Apache Cordova:
- Ionic Framework: npm install -g @ionic/cli (> 7)
- Open JDK 11
- cURL
- Android Studio

## Installing the Project

To set up and run the project, follow these steps after completing all installations:

1. Place your project folder in the desired location.
2. Open a terminal or command prompt.
3. Navigate to your project directory. You should find files like `src`, `package.json`, `angular.json`.
4. Run `npm install` to install the necessary dependencies for your project.

After the installation is complete, you can proceed with further configurations or run your application.

- **Command to run application:** `ionic serve`

**Note:** Ensure that you have all the required dependencies and tools installed before running the installation command.

## Create a new version of the app

### First Android build
1. `ionic cordova platform add android`
2. Place `google-services.json` in the Android platforms folder
   1. Download the `google-services.json` file from Firebase console
   2. Select your project > Click on the gear icon next to Project Overview to go to Project settings.
   3. In the Your apps card, select the Android app to download the google-services.json for.
   4. Place the `google-services.json` file in the correct location: `platforms\android\app\src\google-services.json`
3. Set `BABYSITTER_APP_KEYSTORE_PASS` environment variable

### First iOS build
1. `ionic cordova platform add ios`
2. Check if iOS Devloyment Target (CorodvaLib -> Project -> Build Settings -> Basic) has value 12.0
3. Add/overwrite GoogleService-Info.plist under Resources from Firebase console (check Android setup)
4. Configure your account in XCode Settings
5. Add Account in Signing Options (Targets -> Signing & Capabilities)
6. Replace $REVERSED_CLIENT_ID in Babysitter-App-Info with the value from GoogleServices.plist
7. Check if the Privacy - Calendars Usage Description is set in Babysitter-App-Info
8. Check if App Uses Non-Exept Encryption is set and if not set it to "NO"

### Googleplus
1. Install Version ^8.5.2 (add version in package.json) `cordova plugin add cordova-plugin-googleplus`
2. Then change version to "github:booleanbetrayal/cordova-plugin-googleplus#feat/upgrade-sdk-support"
3. Run `npm install`
4. Copy `cordova-plugin-googleplus` directory from `node_modules` to `plugins`

### General

Releasing a new version of an Ionic app on both iOS and Android involves several steps. Here's a general overview of the process:

1. **Prepare your code**: Ensure that your Ionic app code is updated and stable. Implement new features, fix bugs, and perform necessary testing.
2. **Update version number**: Increment the version number of your app in the config.xml file for Cordova projects or app.json for Capacitor projects. You typically update the version number following semantic versioning conventions (e.g., MAJOR.MINOR.PATCH).
3. **Build your app**: Use the Ionic CLI to build your app for both iOS and Android platforms.

### Android

1. Run the following commands in your terminal or command prompt: `ionic cordova build android --prod --release`

### iOS

If you're releasing the iOS version, make sure you have a valid provisioning profile and certificate for distribution.

1. Stash the acutal changes, before pull (workaround, because of googleplus)
2. Run the following commands in your terminal or command prompt: `ionic cordova build ios --prod --release`
3. Open your Ionic project in Xcode.
4. Add a message in "Calendar Permission Message" in Babysitter-App-Info
5. Remove all entries in URL Schema beyond the first three
6. Archive your app by selecting "Product" > "Archive" from the Xcode menu. 
7. Once the archive is complete, distribute the app using the App Store Connect dashboard.
#   b a b y s i t t e r  
 #   b i b a  
 