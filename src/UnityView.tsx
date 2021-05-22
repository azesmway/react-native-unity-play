import * as React from "react";
import { requireNativeComponent, ViewProperties, findNodeHandle, NativeModules, NativeSyntheticEvent, View } from 'react-native';
import * as PropTypes from "prop-types";
const { ViewPropTypes } = require('react-native');
import MessageHandler from "./MessageHandler";
import { UnityModule, UnityViewMessage } from "./UnityModule";

const { UIManager } = NativeModules;

export interface UnityViewProps extends ViewProperties {
    /**
     * Receive string message from unity.
     */
    onMessage?: (message: string) => void;
    /**
     * Receive unity message from unity.
     */
    onUnityMessage?: (handler: MessageHandler) => void;
}

export default class UnityView extends React.Component<UnityViewProps> {
    public static propTypes = {
        ...ViewPropTypes,
        onMessage: PropTypes.func
    }

    private handle: number;

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        this.handle = UnityModule.addMessageListener(message => {
            if (this.props.onUnityMessage && message instanceof MessageHandler) {
                this.props.onUnityMessage(message);
            }
            if (this.props.onMessage && typeof message === 'string') {
                this.props.onMessage(message);
            }
        });
    }

    public componentWillUnmount() {
        UnityModule.removeMessageListener(this.handle);
    }

    /**
     * [Deprecated] Use `UnityModule.pause` instead.
     */
    public pause() {
        UnityModule.pause();
    };

    /**
     * [Deprecated] Use `UnityModule.resume` instead.
     */
    public resume() {
        UnityModule.resume();
    };

    /**
     * [Deprecated] Use `UnityModule.postMessage` instead.
     */
    public postMessage(gameObject: string, methodName: string, message: string) {
        UnityModule.postMessage(gameObject, methodName, message);
    };

    /**
     * [Deprecated] Use `UnityModule.postMessageToUnityManager` instead.
     */
    public postMessageToUnityManager(message: string | UnityViewMessage) {
        UnityModule.postMessageToUnityManager(message);
    };

    public render() {
        const { onUnityMessage, onMessage, ...props } = this.props;
        return (
            <View {...props}>
                <NativeUnityView
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                    onUnityMessage={onUnityMessage}
                    onMessage={onMessage}
                >
                </NativeUnityView>
                {this.props.children}
            </View>
        );
    }
}

// @ts-ignore
const NativeUnityView = requireNativeComponent<UnityViewProps>('UnityView', UnityView);
