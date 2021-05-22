
# react-native-unity-play

## Thanks to two projects [react-native-unity](https://github.com/@wowmaking/react-native-unity) and [react-native-unity-view](https://github.com/f111fei/react-native-unity-view)

### I collected and modified the code that allows you to embed a UNITY project into the react native as a full-fledged component

## Getting started

`$ npm install react-native-unity-play --save`

### Installation

1. Install package via `npm`
2. Move your Unity project to `unity` folder at project root

#### Unity (Setup your Unity project first)
1. Add following line at your `unity/Packages/manifest.json`
    ```json
    {
        ...
        "com.azesmway.react-native-unity": "file:../../node_modules/react-native-unity-play/unity"
    }
    ```
    
##### iOS simulator settings
If you want to test your app at xcode simulator, you need following next steps:
1. Go to `Menu` -> `Edit` -> `Project setings...` -> `Player` -> `iOS` -> `Other Settings`
2. Find `Target SDK` setting and select `Simulator SDK`

You ready to debug your app at simulator!

#### iOS

1. Run `pod install`
2. Build Unity app to `[project_root]/unity/builds/ios`
3. Add `Unity-iPhone.xcodeproj` to your workspace: `Menu` -> `File` -> `Add Files to [workspace_name]...` -> `[project_root]/unity/builds/ios/Unity-iPhone.xcodeproj`
4. Add `UnityFramework.framework` to `Embedded Binaries`: 
    - select `your_app` target in workspace
    - in `General` / `Embedded Binaries` press `+`
    - select `Unity-iPhone/Products/UnityFramework.framework`
    - remove `UnityFramework.framework` from `Linked Frameworks and Libraries` ( select it and press `-` )
    - in `Build Phases` move `Embedded Binaries` before `Compile Sources` ( drag and drop )
    ![Example](https://forum.unity.com/attachments/image1-png.427024/)
5.
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

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   +++ [RNUnity launchWithOptions:launchOptions]; // IMPORTANT to add this before react view creation
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  ...
}

+++ - (void)applicationWillResignActive:(UIApplication *)application { [[[RNUnity ufw] appController] applicationWillResignActive: application]; }
+++ - (void)applicationDidEnterBackground:(UIApplication *)application { [[[RNUnity ufw] appController] applicationDidEnterBackground: application]; }
+++ - (void)applicationWillEnterForeground:(UIApplication *)application { [[[RNUnity ufw] appController] applicationWillEnterForeground: application]; }
+++ - (void)applicationDidBecomeActive:(UIApplication *)application { [[[RNUnity ufw] appController] applicationDidBecomeActive: application]; }
+++ - (void)applicationWillTerminate:(UIApplication *)application { [[[RNUnity ufw] appController] applicationWillTerminate: application]; }

@end
```

6. In `AppDelegate.m` file make background color of React root view transparent
```objectivec
rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:0];
```

#### Android

1. Add ndk support into `android/app/build.gradle`
    ```gradle
    defaultConfig {
        ...
        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a"
        }
    }
    ```
2. Append the following lines to `android/settings.gradle`:
  	```gradle
  	include ':unityLibrary'
    project(':unityLibrary').projectDir=new File('..\\unity\\builds\\android\\unityLibrary')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```gradle
      implementation project(':unityLibrary')
      implementation files("${project(':unityLibrary').projectDir}/libs/unity-classes.jar")
  	```
4. Change parent activity in `MainActivity.java` from `ReactActivity` to `UnityReactActivity`
    ```java
    import com.wowmaking.rnunity.UnityReactActivity;

    public class MainActivity extends UnityReactActivity {
        ...
    }
    ```
5. Add strings to `res/values/strings.xml`
    ```xml
    <string name="game_view_content_description">Game view</string>
    <string name="unity_root">unity_root</string>
    ```
6. Update `.MainActivity` into `AndroidManifest.xml`
    ```xml
    <activity
      android:name=".MainActivity"
      ...
      android:configChanges="mcc|mnc|locale|touchscreen|keyboard|keyboardHidden|navigation|orientation|screenLayout|uiMode|screenSize|smallestScreenSize|fontScale|layoutDirection|density"
      android:hardwareAccelerated="true"
      android:launchMode="singleTask"
    >
    ```
7. Setup `minSdkVersion` greater than or equal to `19`
8. Remove `<intent-filter>...</intent-filter>` from AndroidManifest.xml at unityLibrary to leave only integrated version. 

## Usage
```javascript
import { Unity, UnityResponderView } from '@wowmaking/react-native-unity';

Unity.init();

const App = () => {
  return (
    <View>
      <!-- UnityResponderView provide all touch events to Unity -->
      <UnityResponderView />
      <Touchable onPress={()=>Unity.execCommand('command_name', { /* any specific command data */ })}>Press ME!</Touchable>
    </View>
  );
};
```

## JavaScript API

##### **`Unity`** - main module object
###### Methods:
1. `init` - initialize `react-native-unity` lib
    
    Usage:
    ```javascript
    Unity.init(;
    ```
2. `execCommand` - send command to Unity
    Params: 
    - `name` (`string`) - Unity command name
    - `data` (`Object`, optional) - Unity command data
    
    Return `Promise`
    Usage:
    ```javascript
    Unity.execCommand('command_name', { a: 1, b: 'b', })
    ```
3. `addEventListener` - add listener of Unity events
    Params:
        - `type` (`string`) - type of Unity event
        - `listener` (`function`) - function, that's calling on Unity event receiving
        
    Usage:
    ```javascript
    Unity.addEventListener('event_type', (e) => { console.warn(e); });
    ```
4. `removeEventListener` - remove Unity event listener
   Params:
        - `type` (`string`) - type of Unity event
        - `listener` (`function`) - specific listener to remove
        
    Usage:
    ```javascript
    Unity.addEventListener('event_type', { listener });
    ```
    
##### **`UnityResponderView`** - React-component, that provide all touch events to Unity

## Unity API
##### **Package namespace is `Wowmaking.RNU`**
#
##### **`interface IRNCommandsReceiver`** - interface to receive commands from JaveScript
###### Methods:
1. `void HandleCommand(RNCommand command)` - method, that calls from JavaScript
    Params:
    - `command` (`RNCommand`) - command object, received from JavaScript
    
##### **`RNCommand`** - class of reciving JavaScript commands
###### Properties
1. `name` (`string`) - name of received command
2. `data` (`object`) - data of received command
###### Methods
1. `Resolve` - invoke on successful command execution
    Params:
    - `data` (`object`, optional) - object, that will receive JavaScript
        
    Usage:
    ```c
    command.Resolve(new { text = "test", });
    ```
2. `Reject` - invoke on unsuccessful command execution
    Params:
    - `data` (`object`, optional) - object, that will receive JavaScript
        
    Usage:
    ```c
    command.Reject(new { text = "test", });
    ```
##### **`static RNBridge`**
###### Methods
1. `RegisterCommandsReceiver` - add commands reveiver to bridge
    Params:
    - `cReceiver` (`IRNCommandsReceiver`) - game object, that implements IRNCommandsReceiver interface
        
    Usage:
    ```c
    private void Awake()
    {
        RNBridge.RegisterCommandsReceiver(this);
    }
    ```
2. `SendEvent` - send event to JavaScript
    Params:
    - `name` (`string`) - event name, that receive JavaScript
    - `data` (`object`) - data object, that receive JavaScript listeners
