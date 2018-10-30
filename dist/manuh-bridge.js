"use strict";var _createClass=function(){function i(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,n,t){return n&&i(e.prototype,n),t&&i(e,t),e}}();function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var __manuhClient,__mqttClient,manuhLocal=require("manuh"),MqttClient=require("./modules/mqtt.js")._MqttClient,ManuhClient=require("./modules/manuh.js")._ManuhClient,ManuhBridge=function(){function t(e,n){_classCallCheck(this,t),__manuhClient=new ManuhClient(e),__mqttClient=new MqttClient(n),manuhLocal.subscribe("__message/manuh/mqtt","id",function(e,n){__mqttClient.publish(e.topic,e.message)}),manuhLocal.subscribe("__message/mqtt/manuh","id",function(e,n){__manuhClient.publish(e.topic,e.message)}),__manuhClient.connect(),__mqttClient.connect()}return _createClass(t,[{key:"subscribeBridge",value:function(e){for(var n in e)__mqttClient.subscribe(e[n]),__manuhClient.subscribe(e[n])}},{key:"subscribeRemote2LocalTopics",value:function(e){for(var n in e)__mqttClient.subscribe(e[n])}},{key:"subscribeLocal2RemoteTopics",value:function(e){for(var n in e)__manuhClient.subscribe(e[n])}}]),t}();exports.ManuhBridge=ManuhBridge;