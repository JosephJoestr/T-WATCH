import mqtt, { MqttClient } from 'mqtt';
import { ParsedTransformerData, parseTransformerJson } from '../types/TransformerData';

export interface MqttSettings {
  brokerUrl: string;
  username: string;
  password?: string;
}

type Listener = (data: ParsedTransformerData) => void;

class MqttService {
  private client: MqttClient | null = null;
  private listeners = new Set<Listener>();

  constructor(private readonly settings: MqttSettings) {}

  connect() {
    if (this.client) return;
    if (!this.settings.brokerUrl) return;

    this.client = mqtt.connect(this.settings.brokerUrl, {
      username: this.settings.username,
      password: this.settings.password,
      reconnectPeriod: 5000,
    });

    this.client.on('connect', () => {
      this.client?.subscribe('transformer/T-WATCH-01/data');
    });

    this.client.on('message', (_topic, message) => {
      try {
        const json = JSON.parse(message.toString());
        const parsed = parseTransformerJson(json);
        if (parsed) this.listeners.forEach((l) => l(parsed));
      } catch {}
    });
  }

  onData(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  publishUntrip() {
    if (!this.client) return;
    this.client.publish('transformer/T-WATCH-01/control', JSON.stringify({ command: 'untrip', relay: 0 }));
  }

  disconnect() {
    this.client?.end(true);
    this.client = null;
    this.listeners.clear();
  }
}

export function createMqttService(settings: MqttSettings) {
  return new MqttService(settings);
}
