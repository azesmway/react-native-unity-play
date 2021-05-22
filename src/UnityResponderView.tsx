import * as React from "react";
import { requireNativeComponent, ViewProperties, findNodeHandle, NativeModules, NativeSyntheticEvent, View } from 'react-native';
import * as PropTypes from "prop-types";
import UnityView, {UnityViewProps} from "./UnityView";
import {UnityModule} from "./UnityModule";
import MessageHandler from "./MessageHandler";
const { ViewPropTypes } = require('react-native');

const { RNUnity } = NativeModules;

export default class UnityResponderView extends React.Component {
    constructor(props: any) {
        super(props);
    }

    public componentDidMount() {
        RNUnity.initialize();
    }

    public componentWillUnmount() {
        RNUnity.unloadUnity();
    }

    public render() {
        const { ...props } = this.props;

        return (
            <ResponderView {...props}></ResponderView>
        );
    }
}

// @ts-ignore
const ResponderView = requireNativeComponent('UnityResponderView', UnityResponderView);
