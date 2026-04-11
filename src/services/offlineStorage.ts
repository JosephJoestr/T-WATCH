import * as SQLite from 'expo-sqlite';
import { ParsedTransformerData } from '../types/TransformerData';

let db: SQLite.SQLiteDatabase | null = null;

export async function initOfflineDb() {
  db = await SQLite.openDatabaseAsync('transformer_watch.db');
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS readings (' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'device_id TEXT,' +
    'temp REAL,' +
    'status TEXT,' +
    'relay INTEGER,' +
    'buzzer INTEGER,' +
    'timestamp TEXT,' +
    'current REAL,' +
    'voltage REAL' +
    ');'
  );
}

export async function cacheReading(data: ParsedTransformerData) {
  if (!db) return;
  await db.runAsync(
    'INSERT INTO readings (device_id, temp, status, relay, buzzer, timestamp, current, voltage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [data.deviceId, data.temp, data.status, data.relay, data.buzzer ? 1 : 0, data.timestamp.toISOString(), data.current, data.voltage]
  );
  await db.runAsync(
    'DELETE FROM readings WHERE id NOT IN (SELECT id FROM readings ORDER BY id DESC LIMIT 100);'
  );
}
