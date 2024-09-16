#!/bin/bash
ionic cordova build android --prod --release
'C:\Program Files\Android\Android Studio\jbr\bin\jarsigner.exe' -sigalg SHA256withRSA -digestalg SHA-256 -keystore ~/.ssh/babby-sitter-release.jks -storepass $BABYSITTER_APP_KEYSTORE_PASS platforms/android/app/build/outputs/bundle/release/app-release.aab babbysitter
