package com.azesmway.rnunity;

import android.content.Context;
import android.content.res.Configuration;
import android.view.MotionEvent;
import android.widget.FrameLayout;

import com.unity3d.player.UnityPlayer;

public class UnityResponderView extends FrameLayout {

    private UnityPlayer view;

    public UnityResponderView(Context context) {
        super(context);
    }

    public void setUnityPlayer(UnityPlayer player) {
        this.view = player;
        UnityUtils.addUnityViewToGroup(this);
    }

    @Override
    public void onWindowFocusChanged(boolean hasWindowFocus) {
        super.onWindowFocusChanged(hasWindowFocus);
        if (view != null) {
            view.windowFocusChanged(hasWindowFocus);
        }
    }

    @Override
    protected void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (view != null) {
            view.configurationChanged(newConfig);
        }
    }

    @Override
    protected void onDetachedFromWindow() {
        // todo: fix more than one unity view, don't add to background.
        // UnityUtils.addUnityViewToBackground();
        super.onDetachedFromWindow();
    }
}
