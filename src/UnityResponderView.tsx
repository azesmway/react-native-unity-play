// @ts-ignore
import * as React from 'react';
// @ts-ignore
import { requireNativeComponent, NativeModules } from 'react-native';

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
        // @ts-ignore
        const { ...props } = this.props;

        return (
            <ResponderView {...props} />
        );
    }
}

// @ts-ignore
const ResponderView = requireNativeComponent('UnityResponderView', UnityResponderView);
