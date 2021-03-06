var mqtt = require('mqtt');
var manuhLocal = require('manuh');
var debug = require('debug')('debug');
var info = require('debug')('mqttClient');

class _MqttClient {

    constructor(config){
        this.config = config;
        this.topics = [];
        this.subscriptions = [];
        this.connected = false;
        this.config.clientId = 'mqtt2manuh_' + Math.random().toString(16).substr(2, 8);
        this.id = 0;
    }

    connect(ready) {
        info(`Connection config: `, this.config)
        
        const brokerURL = `${this.config.protocol}://${this.config.host}${this.config.port ? ":"+this.config.port : ""}/${this.config.context}`
        info(`==> Connecting to ${brokerURL} (client ID ${this.config.clientId})`);
        var client = this.client  = mqtt.connect(brokerURL);

        client.on('connect', () => {

            debug("Connected. Now subscribing to topics")
            this.topics.forEach(t => {
                if (this.subscriptions.indexOf(t) !== -1) { //prevent duplication overhead
                    debug(`Topic ${t} already subscribed. Ignoring...`)
                }
                info(`Subscribe to ${t}`)
                client.subscribe(t)
                this.subscriptions.push(t)
            });
            if (!this.connected) {
                this.connected = true; 
                info('Connected ==> ');
                return ready()
            }
            return info('Connected ==> ');
        });
        
        client.on('reconnect', (e) => {
            debug('Try to reconnect', e);
        });

        client.on('offline', (e) => {
            info('Broker is offline', e);
        });

        client.on('error', (e) => {
            info('error', e);
        });

        client.on('message', (topic, message) => {
            this.id++;
            info(`Message ${this.id} '${topic}'`, message.toString());

            var msg = { topic: topic, message: message.toString() };
            manuhLocal.publish('__message/mqtt/manuh', msg, { retained: false } );
        });
    }

    publish(topic, message) {
        if (this.connected == false) {
            return;
        }
        info(`Publish message ${topic} '${message}'`);
        this.client.publish(topic.toString(), message.toString(), {qos: 0, retain: false});
    }

    subscribe(topic) {
        this.topics.push(topic);
        if (!!this.connected) {
            this.client.subscribe(topic);
            this.subscriptions.push(topic)
        }
    }

}

exports._MqttClient = _MqttClient;