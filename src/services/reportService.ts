import { ParsedTransformerData } from '../types/TransformerData';

export interface ReportRow {
  timestamp: string;
  temp: string;
  efficiency: string;
  copperLoss: string;
  voltageReg: string;
}

export function buildReportRows(data: ParsedTransformerData[]): ReportRow[] {
  return data.slice(0, 50).map((d) => {
    const pf = 0.9;
    const output = d.voltage * d.current * pf;
    const input = output * 1.05;
    const efficiency = (output / input) * 100;
    const resistance = 0.01;
    const copperLoss = d.current * d.current * resistance;
    const vNoLoad = d.voltage * 1.03;
    const vFullLoad = d.voltage;
    const voltageReg = ((vNoLoad - vFullLoad) / vFullLoad) * 100;
    return {
      timestamp: d.timestamp.toLocaleString(),
      temp: d.temp.toFixed(2),
      efficiency: efficiency.toFixed(2),
      copperLoss: copperLoss.toFixed(2),
      voltageReg: voltageReg.toFixed(2),
    };
  });
}

export function buildHtmlReport(period: 'daily' | 'weekly' | 'monthly', rows: ReportRow[]): string {
  const header = `T-WATCH Report - ${period.toUpperCase()}`;
  const rowsHtml = rows.map((r) => `
    <tr>
      <td>${r.timestamp}</td>
      <td>${r.temp}</td>
      <td>${r.efficiency}</td>
      <td>${r.copperLoss}</td>
      <td>${r.voltageReg}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${header}</title>
    <style>
      body { font-family: Inter, Arial, sans-serif; padding: 16px; background: #f7f7f7; color: #1a1a1a; }
      h2 { color: #1a1a1a; }
      table { border-collapse: collapse; width: 100%; background: #ffffff; border-radius: 6px; }
      th, td { border: 1px solid #d4d4d4; padding: 8px 12px; font-size: 12px; }
      th { background-color: #262626; color: #f7f7f7; }
      tr:nth-child(even) { background-color: #f0f0f0; }
    </style>
  </head>
  <body>
    <h2>${header}</h2>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Temp (C)</th>
          <th>Efficiency (%)</th>
          <th>Copper Loss (W)</th>
          <th>Vreg (%)</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </body>
</html>`;
}