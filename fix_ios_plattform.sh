#!/bin/bash

PLIST_FILE="platforms/ios/Babysitter-App/Babysitter-App-Info.plist"

/usr/libexec/PlistBuddy -c "Set :NSCalendarsUsageDescription 'To save requests in calendar for which user has applied.'" "$PLIST_FILE"

ENTRY_COUNT=$(/usr/libexec/PlistBuddy -c "Print :CFBundleURLTypes" "$PLIST_FILE" | grep "Dict" | wc -l | xargs)

for ((i=ENTRY_COUNT; i > 3; i--)); do
    /usr/libexec/PlistBuddy -c "Delete :CFBundleURLTypes:$((i-1))" "$PLIST_FILE"
done

echo "Änderungen wurden erfolgreich durchgeführt."
