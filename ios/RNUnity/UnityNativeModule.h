//
//  UnityNativeModule.h
//  RNUnity
//
//  Created by Chance Eakin on 12/27/21.
//

#import <React/RCTEventDispatcher.h>
#import <React/RCTBridgeModule.h>
#import "UnityUtils.h"

@interface UnityNativeModule : NSObject <RCTBridgeModule, UnityEventListener>
@end
