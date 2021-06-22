#import <Foundation/Foundation.h>

#import <UIKit/UIKit.h>

#include <mach-o/ldsyms.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#include <UnityFramework/UnityAppController.h>

@protocol RNUnityAppController <UIApplicationDelegate>

- (UIWindow *)window;
- (UIView *)rootView;
- (UnityView *)unityView;

@end


@protocol RNUnityFramework <NSObject>

+ (id<RNUnityFramework>)getInstance;
- (id<RNUnityAppController>)appController;

- (void)setExecuteHeader:(const typeof(_mh_execute_header)*)header;
- (void)setDataBundleId:(const char*)bundleId;

- (void)runEmbeddedWithArgc:(int)argc argv:(char*[])argv appLaunchOpts:(NSDictionary*)appLaunchOpts;

- (void)unloadApplication;

- (void)showUnityWindow;

- (void)quitApplication:(int)exitCode;

- (void)pause:(bool)pause;

- (void)sendMessageToGOWithName:(const char*)goName functionName:(const char*)name message:(const char*)msg;

@end


typedef void (*unity_receive_handshake)();
typedef void (*unity_receive_command)(const char *);


@interface RNUnity : RCTEventEmitter <RCTBridgeModule>

@property (atomic, class) int argc;
@property (atomic, class) char** argv;

@property (atomic, class) id<RNUnityFramework> ufw;

+ (id<RNUnityFramework>)launchWithOptions:(NSDictionary*)launchOptions;

+ (void)setReceiverHandshake:(unity_receive_handshake)receiverHandshake
			 receiverCommand:(unity_receive_command)receiverCommand;
+ (void)sendMessage:(const char *)message;

@end

