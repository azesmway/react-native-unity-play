package com.azesmway.rnunity;

import android.os.Handler;
import android.view.View;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import javax.annotation.Nonnull;

public class RNUnityManager extends SimpleViewManager<UnityResponderView> implements LifecycleEventListener, View.OnAttachStateChangeListener {
    public static final String REACT_CLASS = "UnityView";

    public RNUnityManager(ReactApplicationContext reactContext) {
        super();
        reactContext.addLifecycleEventListener(this);
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Nonnull
    @Override
    protected UnityResponderView createViewInstance(@Nonnull ThemedReactContext reactContext) {
        final UnityResponderView view = new UnityResponderView(reactContext);
        view.addOnAttachStateChangeListener(this);

        if (UnityUtils.getPlayer() != null) {
            view.setUnityPlayer(UnityUtils.getPlayer());
        } else {
            UnityUtils.createPlayer(reactContext.getCurrentActivity(), new UnityUtils.CreateCallback() {
                @Override
                public void onReady() {
                    view.setUnityPlayer(UnityUtils.getPlayer());
                }
            });
        }
        return view;
    }

    @Override
    public void onDropViewInstance(UnityResponderView view) {
        view.removeOnAttachStateChangeListener(this);
        super.onDropViewInstance(view);
    }

    @Override
    public void onHostResume() {
        if (UnityUtils.isUnityReady()) {
            UnityUtils.getPlayer().resume();
            restoreUnityUserState();
        }
    }

    @Override
    public void onHostPause() {
        if (UnityUtils.isUnityReady()) {
            // Don't use UnityUtils.pause()
            UnityUtils.getPlayer().pause();
        }
    }

    @Override
    public void onHostDestroy() {
        if (UnityUtils.isUnityReady()) {
            UnityUtils.getPlayer().unload();
        }
    }

    private void restoreUnityUserState() {
        // restore the unity player state
        if (UnityUtils.isUnityPaused()) {
            Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    if (UnityUtils.getPlayer() != null) {
                        UnityUtils.getPlayer().pause();
                    }
                }
            }, 300); //TODO: 300 is the right one?
        }
    }

    @Override
    public void onViewAttachedToWindow(View v) {
        restoreUnityUserState();
    }

    @Override
    public void onViewDetachedFromWindow(View v) {
    }
}
