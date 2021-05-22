import UnityView from "./src/UnityView";
import { UnityModule, UnityViewMessage } from "./src/UnityModule";
import MessageHandler from "./src/MessageHandler";
import UnityResponderView from './src/UnityResponderView';

import {
  NativeModules,
  requireNativeComponent,
  NativeEventEmitter,
} from 'react-native';

import { EventTarget, } from 'event-target-shim';


const { RNUnity } = NativeModules;
const RNUnityEventEmitter = new NativeEventEmitter(RNUnity);

let commandsIdIterator = 0;

class UnityManager extends EventTarget {

  /**
   * @private
   * @type {UnityCommand}
   */
  _handshake = null;

  /**
   * @private
   * @type {function}
   */
  _subscriber = null;

  /**
   * @private
   * @type {Object<number, UnityCommand>}
   */
  _commandsMap = {};

  /**
   *
   * Initialize unity
   *
   */
  init() {
    RNUnity.initialize();
    console.log('RNUnity.initialize')
    this._subscriber = RNUnityEventEmitter.addListener('UnityMessage', this._handleMessage.bind(this));

    if (!this._handshake) {
      this._handshake = new UnityCommand();

      this._handshake.promise
        .then((res) => {
          this._handshake.resolved = true;
          return res;
        });

      this.handshake();
    }

    return this._handshake.promise;
  }

  unload() {
    console.log('RNUnity.unloadUnity')
    RNUnity.unloadUnity();
  }

  handshake = () => {
    if (!this._handshake.resolved) {
      this._invokeHandshake();

      setTimeout(this.handshake, 300);
    }
  }

  /**
   *
   * Call unity command
   * @param {string} name command name
   * @param {Object=} data command data
   * @returns {Promise}
   */
  execCommand(name, data) {
    let id = ++commandsIdIterator;

    const command = new UnityCommand(id, name, data);
    this._commandsMap[id] = command;

    this._invokeCommand({
      message: command.getMessage(),
    });

    return command.promise;
  }

  /**
   *
   * invoke handshake method
   *
   */
  _invokeHandshake() {
    RNUnity.invokeHandshake();
  }

  /**
   *
   * invoke entity method
   * @private
   * @param {string=} options.message Unity entity script component function param
   */
  _invokeCommand({ message = '', }) {
    RNUnity.invokeCommand(message);
  }

  /**
   *
   * @private
   * @param {string} message
   */
  _handleMessage(message) {
    try {
      const messageData = JSON.parse(message);
      const { type, name, data, } = messageData;

      switch (type) {

        case 'handshake':
          this._handshake.resolve();
          break;

        case 'event':
          this.dispatchEvent({ type: name, data, });
          break;

        case 'result':
          const { id, resolved, result } = data;
          if (this._commandsMap[id]) {
            const command = this._commandsMap[id];

            if (resolved) {
              command.resolve(result);
            }
            else {
              command.reject(result);
            }

            delete this._commandsMap[id];
          }
          break;
      }

    }
    catch (e) {
      console.warn(e.message);
    }
  }

}

class UnityCommand {

  /** @type {number} */
  id = null;

  /** @type {string} */
  name = null;

  /** @type {Object} */
  data = null;

  /** @type {Promise} */
  promise = null;

  /** @type {function} */
  resolve = null;

  /** @type {function} */
  reject = null;

  /**
   *
   * @param {number} id
   * @param {string} name
   * @param {Object=} data
   */
  constructor(id, name, data) {
    this.id = id;
    this.name = name;
    this.data = data;
    this.promise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }

  /**
   *
   * @returns {string}
   */
  getMessage() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      data: this.data,
    });
  }

}

const Unity = new UnityManager();

export default UnityView;

export {
  UnityView,
  UnityModule,
  MessageHandler,
  UnityViewMessage,
  Unity,
  UnityResponderView
};
