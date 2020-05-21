//
//  YCProgressHUD.m
//  YouChainWallet
//
//  Created by Stephen Zhang on 21/02/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "YCProgressHUD.h"
#import <SVProgressHUD.h>

@implementation YCProgressHUD

- (id)init
{
  if ((self = [super init])) {
    [[SVProgressHUD appearance] setMinimumSize:CGSizeMake(100, 100)];
    [[SVProgressHUD appearance] setDefaultStyle:SVProgressHUDStyleDark];
    [[SVProgressHUD appearance] setDefaultMaskType:SVProgressHUDMaskTypeClear];
    [SVProgressHUD setMinimumDismissTimeInterval:0.5];
  }
  return self;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(show)
{
  [SVProgressHUD show];
}

RCT_EXPORT_METHOD(showWithStatus:(NSString*)string)
{
  [SVProgressHUD showWithStatus:string];
}

RCT_EXPORT_METHOD(showDefaultProgress:(CGFloat)progress)
{
  [SVProgressHUD showProgress:progress];
}

RCT_EXPORT_METHOD(showProgress:(CGFloat)progress status:(NSString*)status)
{
  [SVProgressHUD showProgress:progress status:status];
}

RCT_EXPORT_METHOD(dismiss)
{
  [SVProgressHUD dismiss];
}

RCT_EXPORT_METHOD(dismissWithDelay:(NSTimeInterval)delay)
{
  [SVProgressHUD dismissWithDelay:delay];
}

RCT_EXPORT_METHOD(showInfoWithStatus:(NSString*)string)
{
  [SVProgressHUD showInfoWithStatus:string];
}

RCT_EXPORT_METHOD(showSuccessWithStatus:(NSString*)string)
{
  [SVProgressHUD showSuccessWithStatus:string];
}

RCT_EXPORT_METHOD(showErrorWithStatus:(NSString*)string)
{
  [SVProgressHUD showErrorWithStatus:string];
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
