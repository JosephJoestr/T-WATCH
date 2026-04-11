export type TransformerStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface TransformerData {
  device_id: string;
  temp: number;
  status: TransformerStatus;
  relay: number;
  buzzer: boolean;
  timestamp: string;
  current: number;
  voltage: number;
}

export interface ParsedTransformerData {
  deviceId: string;
  temp: number;
  status: TransformerStatus;
  relay: number;
  buzzer: boolean;
  timestamp: Date;
  current: number;
  voltage: number;
}

export function parseTransformerJson(payload: unknown): ParsedTransformerData | null {
  if (!payload || typeof payload !== 'object') return null;
  const data = payload as Record<string, unknown>;

  const deviceId = String(data.device_id ?? '');
  const temp = Number(data.temp ?? NaN);
  const statusRaw = String(data.status ?? '').toUpperCase() as TransformerStatus;
  const relay = Number(data.relay ?? 0);
  const buzzer = Boolean(data.buzzer);
  const timestampStr = String(data.timestamp ?? '');
  const current = Number(data.current ?? NaN);
  const voltage = Number(data.voltage ?? NaN);

  if (!deviceId || Number.isNaN(temp) || Number.isNaN(current) || Number.isNaN(voltage)) {
    return null;
  }

  const timestamp = new Date(timestampStr || Date.now());

  const status: TransformerStatus =
    statusRaw === 'CRITICAL' || statusRaw === 'WARNING' || statusRaw === 'NORMAL'
      ? statusRaw
      : 'NORMAL';

  return { deviceId, temp, status, relay, buzzer, timestamp, current, voltage };
}
