package im.uchain.wallet.components.YCProgressHUD;

import android.app.Activity;
import android.os.Handler;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.yc.svprogresshud.SVProgressHUD;

import java.lang.ref.WeakReference;

/**
 * Created by greason on 2019/4/9.
 */

public class YCProgressHUD extends ReactContextBaseJavaModule {
    private SVProgressHUD sVProgressHUD;
    private Handler handler;
    private WeakReference<Activity> activityWeak;

    public YCProgressHUD(ReactApplicationContext reactContext) {
        super(reactContext);
        this.activityWeak = new WeakReference<>(getCurrentActivity());
    }

    private void ensureExist() {

        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null && activityWeak.get() == getCurrentActivity()) {
                    return;
                }
                activityWeak = new WeakReference<>(getCurrentActivity());
                handler = new Handler();
                sVProgressHUD = new SVProgressHUD(getCurrentActivity());
            }
        });
    }

    private void ensureDismiss() {
        if (sVProgressHUD != null) {
            sVProgressHUD.dismissImmediately();
        }
    }

    @Override
    public String getName() {
        return "YCProgressHUD";
    }

    @ReactMethod
    public void show() {
        ensureExist();
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    sVProgressHUD.show();
                }
            }
        });
    }

    @ReactMethod
    public void showWithStatus(final String status) {
        ensureExist();
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    sVProgressHUD.showWithStatus(status);
                }
            }
        });
    }

    @ReactMethod
    public void showDefaultProgress(final float progress) {
        ensureExist();
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    sVProgressHUD.getProgressBar().setProgress((int) (progress * 100));
                    sVProgressHUD.showWithProgress(null, SVProgressHUD.SVProgressHUDMaskType.Gradient);
                }
            }
        });

    }

    @ReactMethod
    public void showProgress(final float progress, final String status) {
        ensureExist();
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    sVProgressHUD.getProgressBar().setProgress((int) (progress * 100));
                    sVProgressHUD.showWithProgress(status, SVProgressHUD.SVProgressHUDMaskType.Gradient);
                }
            }
        });
    }

    @ReactMethod
    public void dismiss() {
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    sVProgressHUD.dismiss();
                }
            }
        });
    }

    @ReactMethod
    public void dismissWithDelay(int delay) {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    sVProgressHUD.dismiss();
                }
            }
        }, delay * 1000);
    }

    @ReactMethod
    public void showInfoWithStatus(final String status) {
        ensureExist();
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    sVProgressHUD.showInfoWithStatus(status);
                }
            }
        });
    }

    @ReactMethod
    public void showSuccessWithStatus(final String status) {
        ensureExist();
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    sVProgressHUD.showSuccessWithStatus(status);
                }
            }
        });
    }

    @ReactMethod
    public void showErrorWithStatus(final String status) {
        ensureExist();
        getReactApplicationContext().runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                if (sVProgressHUD != null) {
                    try {
                        sVProgressHUD.showErrorWithStatus(status);
                    } catch (Exception e) {
                    }
                }
            }
        });
    }
}