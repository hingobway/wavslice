import { readFile } from '@tauri-apps/plugin-fs';
import { fetch } from '@tauri-apps/plugin-http';

import * as cheerio from 'cheerio';
import { parse as CSVparse } from 'csv-parse/browser/esm/sync';

import { getPathProps } from '@/ctx/fileDrop';

export async function getSessionMarkers(filepath: string, SR: number = 0) {
  const fp = getPathProps(filepath);
  if (!fp) throw new Error('BAD_PATH');

  const sessionFile = await readFile(filepath);

  // prepare timestamps.me request
  const formdata = new FormData();
  formdata.append('file', new Blob([sessionFile]), fp.name);

  // fetch timestamps
  const resp = await fetch('https://timestamps.me/results', {
    method: 'POST',
    redirect: 'follow',
    headers: crawlHeaders(),
    body: formdata,
  })
    .then((response) => response.text())
    .catch((error) => console.log(error));
  if (!resp) throw new Error('UPLOAD_FAILED');

  // get link to csv
  const $ = cheerio.load(resp);
  let csvpath = null;
  for (const el of $('a')) {
    const m = el.attribs.href?.match(/\/mix\/.+precise/);
    if (!m) continue;
    csvpath = el.attribs.href;
    break;
  }
  if (!csvpath?.length) throw new Error('MIXURL_CRAWL_FAILED');
  const url = `https://timestamps.me${csvpath}`;

  // download csv

  const csvdata = await fetch(url)
    .then((r) => r.text())
    .catch(() => {});
  if (!csvdata) throw new Error('CSV_REQUEST_FAILED');
  const csv = CSVparse(csvdata);

  // parse csv

  const times: number[] = [];
  for await (const row_ of csv) {
    const row: string[] = row_;
    if (row?.length >= 3) {
      const match = row[2].match(/^(\d+):(\d{2}):(\d{1,2}\.\d+)$/);
      if (!match) throw new Error('INVALID_CSV');

      const h = parseInt(match[1]);
      const m = parseInt(match[2]);
      const s = parseFloat(match[3]);

      if (!(Number.isFinite(h) && Number.isFinite(m) && Number.isFinite(s)))
        throw new Error('INVALID_CSV');

      times.push((h * 3600 + m * 60 + s) * SR);
    }
  }

  return times;
}

function crawlHeaders() {
  const headers = new Headers();
  headers.append(
    'accept',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  );
  headers.append('accept-language', 'en-US,en;q=0.9,es;q=0.8');
  headers.append('cache-control', 'max-age=0');
  headers.append('origin', 'https://timestamps.me');
  headers.append('referer', 'https://timestamps.me/');
  headers.append('priority', 'u=0, i');
  headers.append('sec-fetch-dest', 'document');
  headers.append('sec-fetch-mode', 'navigate');
  headers.append('sec-fetch-site', 'same-origin');
  headers.append('sec-fetch-user', '?1');
  headers.append('upgrade-insecure-requests', '1');

  return headers;
}
