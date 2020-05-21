package im.uchain.wallet;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.beefe.picker.PickerViewPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.remobile.qrcodeLocalImage.RCTQRCodeLocalImagePackage;
import com.rnfs.RNFSPackage;
import com.zmxv.RNSound.RNSoundPackage;

import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.List;

import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import im.uchain.wallet.components.YCAppInfo.YCAppInfoPackage;
import im.uchain.wallet.components.YCProgressHUD.YCProgressHUDReactPackage;

/**
 * Created by greason on 2019/4/9.
 */

public class MainApplication extends Application implements ReactApplication {

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new SvgPackage(),
                    new AndroidKeyboardAdjustPackage(),
                    new RCTQRCodeLocalImagePackage(),
                    new BlurViewPackage(),
                    new FastImageViewPackage(),
                    new RNViewShotPackage(),
                    new RNCameraPackage(),
                    new SplashScreenReactPackage(),
                    new RNFSPackage(),
                    new PickerPackage(),
                    new PickerViewPackage(),
                    new RNI18nPackage(),
                    new RNSoundPackage(),
                    new YCAppInfoPackage(),
                    new YCProgressHUDReactPackage(),
                    new LottiePackage(),
                    new LinearGradientPackage(),
                    new RandomBytesPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        SoLoader.init(this, /* native exopackage */ false);
    }

}
