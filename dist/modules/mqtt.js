"use strict";var _createClass=function(){function e(t,n){for(var i=0;i<n.length;i++){var e=n[i];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();function _classCallCheck(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var mqtt=require("mqtt"),manuhLocal=require("manuh"),debug=require("debug")("debug"),info=require("debug")("mqttClient"),_MqttClient=function(){function n(t){_classCallCheck(this,n),this.config=t,this.topics=[],this.connected=!1,this.config.clientId="mqtt2manuh_"+Math.random().toString(16).substr(2,8),this.id=0}return _createClass(n,[{key:"connect",value:function(){var e=this;info("==> Connecting to "+this.config.protocol+"://"+this.config.host+":"+this.config.port+"/"+(this.config.context||"")+" (client ID "+this.config.clientId+")");var t=this.config.protocol+"://"+this.config.host+":"+this.config.port+"/"+(this.config.context||""),n=this.client=mqtt.connect(t);n.on("connect",function(){info("Connected ==> "),e.topics.forEach(function(t){info("Subscribe to "+t),n.subscribe(t)}),e.connected=!0}),n.on("reconnect",function(t){debug("Try to reconnect",t)}),n.on("offline",function(t){info("Broker is offline",t)}),n.on("error",function(t){info("error",t)}),n.on("message",function(t,n){e.id++,info("Message "+e.id+" '"+t+"'",n.toString());var i={topic:t,message:n.toString()};manuhLocal.publish("__message/mqtt/manuh",i,{retained:!1})})}},{key:"publish",value:function(t,n){0!=this.connected&&(info("Publish message "+t+" '"+n+"'"),this.client.publish(t.toString(),n.toString(),{qos:0,retain:!1}))}},{key:"subscribe",value:function(t){this.topics.push(t),this.connected&&this.client.subscribe(t)}}]),n}();exports._MqttClient=_MqttClient;