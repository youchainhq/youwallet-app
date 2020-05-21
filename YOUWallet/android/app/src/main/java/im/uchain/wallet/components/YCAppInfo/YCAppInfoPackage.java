package im.uchain.wallet.components.YCAppInfo;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by kaixin on 21/02/2018.
 */

public class YCAppInfoPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.<NativeModule>singletonList(new YCAppInfoModule(reactContext));
    }

    // Deprecated in RN 0.47 - facebook/react-native@ce6fb33
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
