//
//  YCAppInfo.m
//  YouChainWallet
//
//  Created by Stephen Zhang on 21/02/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "YCAppInfo.h"

@implementation YCAppInfo

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (NSString *)userAgent
{
  static NSString *userAgent = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    
    UIWebView *webView = [[UIWebView alloc] init];
    [webView loadHTMLString:@"<html></html>" baseURL:nil];
    userAgent = [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
  });
  
  return userAgent;
}

RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
  NSUserDefaults *prefs = [NSUserDefaults standardUserDefaults];
  NSString *deviceToken = [prefs stringForKey:@"yc_device_token"];
  if (deviceToken.length == 0) {
    deviceToken = [NSUUID UUID].UUIDString;
    [prefs setObject:deviceToken forKey:@"yc_device_token"];
    [prefs synchronize];
  }
  
  return @{@"appVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"],
           @"buildVersion": [[NSBundle mainBundle] objectForInfoDictionaryKey:(NSString *)kCFBundleVersionKey],
           @"bundleIdentifier": [[NSBundle mainBundle] bundleIdentifier],
           @"deviceToken": deviceToken,
           @"hash":@"jsn7LkY0G66Wyw5C",
           @"shellType":[[NSBundle mainBundle] objectForInfoDictionaryKey:@"CurrentConfiguration"],
           @"appChannel":[[NSBundle mainBundle] objectForInfoDictionaryKey:@"AppChannel"],
           @"userAgent":[self userAgent],
           };
}

RCT_EXPORT_METHOD(registerUserAgent:(NSString *)userAgent append:(BOOL)append)
{
  NSString *customUserAgent = nil;
  if (append) {
    customUserAgent = [self userAgent];
  }
  
  if (append && customUserAgent) {
    userAgent = [NSString stringWithFormat:@"%@ %@", customUserAgent, userAgent];
  }
  
  NSDictionary* dictionary = [NSDictionary dictionaryWithObjectsAndKeys:userAgent, @"UserAgent", nil];
  [[NSUserDefaults standardUserDefaults] registerDefaults:dictionary];
}

RCT_EXPORT_METHOD(exitApp)
{
  exit(0);
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
