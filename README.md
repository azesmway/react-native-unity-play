
# react-native-unity-play

## Thanks to two projects [react-native-unity](https://github.com/@wowmaking/react-native-unity) and [react-native-unity-view](https://github.com/f111fei/react-native-unity-view)

### I collected and modified the code that allows you to embed a UNITY project into the react native as a full-fledged component

### EXAMPLE
[GOOGLE DRIVE LINK](https://drive.google.com/file/d/1D3oaHstzlmIAvIqzbwfSTwlonxJev7Yh/view?usp=sharing)

## Getting started

`$ npm install react-native-unity-play --save`


### Before build project in Unity 

### [UNITY VERSION >= 2020.x](https://unity3d.com/ru/get-unity/download/archive) 

#### iOS
UNITY PLAYER SETTINGS

1. `Multitasking` -> `Requires Fullscreen` -> no selection set !
2. `Status Bar` -> `Status Bar Hidden` -> no selection set !

#### Android

BUILD SETTINGS
1. `Export project` -> selection set !

UNITY PLAYER SETTINGS
1. `Resolution and Presentation` -> `Start in fullscreen mode` -> no selection set !
2. `Resolution and Presentation` -> `Render outside safe area` -> no selection set !

### Installation

1. Install package via `npm`
2. Move your Unity project to `unity` folder at project root

### iOS

1. Run `pod install`
2. Build Unity app to `[project_root]/unity/builds/ios`
3. Add `Unity-iPhone.xcodeproj` to your workspace: `Menu` -> `File` -> `Add Files to [workspace_name]...` -> `[project_root]/unity/builds/ios/Unity-iPhone.xcodeproj`
4. Add `UnityFramework.framework` to `Frameworks, Libraries, and Embedded Content`: 
    - select `your_app` target in workspace
    - in `General` / `Frameworks, Libraries, and Embedded Content` press `+`
    - select `Unity-iPhone/Products/UnityFramework.framework`
    - in `Build Phases` remove `UnityFramework.framework` from `Linked Frameworks and Libraries` ( select it and press `-` )
    - in `Build Phases` move `Embedded Frameworks` before `Compile Sources` ( drag and drop )
   
Add following lines to your project `main.m` file (located at same folder with `AppDelegate`)
```objectivec
#import <UIKit/UIKit.h>
+++ #import <RNUnity/RNUnity.h>

#import "AppDelegate.h"

int main(int argc, char * argv[]) {
  @autoreleasepool {
    +++ [RNUnity setArgc:argc];
    +++ [RNUnity setArgv:argv];
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
```

Add following lines to your project `AppDelegate.m` file
```objectivec
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
+++ #import <RNUnity/RNUnity.h>

+++ - (void)applicationWillResignActive:(UIApplication *)application { [[[RNUnity ufw] appController] applicationWillResignActive: application]; }
+++ - (void)applicationDidEnterBackground:(UIApplication *)application { [[[RNUnity ufw] appController] applicationDidEnterBackground: application]; }
+++ - (void)applicationWillEnterForeground:(UIApplication *)application { [[[RNUnity ufw] appController] applicationWillEnterForeground: application]; }
+++ - (void)applicationDidBecomeActive:(UIApplication *)application { [[[RNUnity ufw] appController] applicationDidBecomeActive: application]; }
+++ - (void)applicationWillTerminate:(UIApplication *)application { [[[RNUnity ufw] appController] applicationWillTerminate: application]; }

@end
```

### Android

1. Create directory into ``android/app/libs``

2. Copy libs from ``<project_name>/unity/builds/android/unityLibrary/libs/*`` to ``android/app/libs``
3. Add ndk support into `android/app/build.gradle`
    ```gradle
    defaultConfig {
        ...
        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a"
        }
    }
    ```
4. Append the following lines to `android/settings.gradle`:
  	```gradle
  	include ':unityLibrary'
    project(':unityLibrary').projectDir=new File('..\\unity\\builds\\android\\unityLibrary')
  	```
5. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```gradle
      implementation project(':unityLibrary')
      implementation files("${project(':unityLibrary').projectDir}/libs/unity-classes.jar")
  	```
6. Add strings to ``res/values/strings.xml`` 
    
    ```javascript
    <string name="game_view_content_description">Game view</string>
    <string name="unity_root">unity_root</string>
    ```

6. Update `.MainActivity` into `AndroidManifest.xml`
    ```xml
   <application
      ...
      android:extractNativeLibs="true" 
   
   <activity
      android:name=".MainActivity"
      ...
      android:configChanges="mcc|mnc|locale|touchscreen|keyboard|keyboardHidden|navigation|orientation|screenLayout|uiMode|screenSize|smallestScreenSize|fontScale|layoutDirection|density"
      android:hardwareAccelerated="true"
    >
    ```
7. Setup `minSdkVersion` greater than or equal to `21`
   
8. Remove `<intent-filter>...</intent-filter>` from ``<project_name>/unity/builds/android/unityLibrary/src/main/AndroidManifest.xml`` at unityLibrary to leave only integrated version.

9. Add to ``android/gradle.properties`` 
    ```javascript
    unityStreamingAssets=.unity3d
    ```

10. Add to ``build.gradle``
    ```javascript
    allprojects {
        repositories {
            flatDir {
                dirs "$rootDir/app/libs"
            }
    ```

11. ``<project_name>/unity/builds/android/unityLibrary/src/main/AndroidManifest.xml`` 
delete ``android:icon="@mipmap/app_icon"`` and ``android:theme="@style/UnityThemeSelector"`` if they are installed

## Usage

```javascript
import { StyleSheet, View, Dimensions, Button, } from 'react-native';
import UnityView, {
  UnityModule,
  UnityResponderView,
} from 'react-native-unity-play';

const {width, height} = Dimensions.get('window');

const App: () => Node = () => {
  const [isVisible, setVisible] = useState(false);
  let unityElement

  if (Platform.OS === 'android') {
    unityElement = (
      <UnityView style={{flex: 1}} />
    );
  } else {
    unityElement = (
      <UnityResponderView
        fullScreen={true}
        style={{width: width, height: height}}
      />
    );
  }

  return (
    <View>
        {!isVisible && (
          <Button title={'Start'} onPress={() => setVisible(true)} />
        )}
        {isVisible && (
          <>
            {unityElement}
            <View
              style={{
                position: 'absolute',
                top: 45,
                left: 20,
                zIndex: 2,
              }}>
              <Button
                title={'Close'}
                onPress={() => {
                  if (Platform.OS === 'android') {
                    UnityModule.quit();
                  }
                  setVisible(false);
                }}
                style={{color: '#fff'}}
              />
            </View>
          </>
        )}
    </View>
  );
};
```
