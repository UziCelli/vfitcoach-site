// Chrome headless do Puppeteer (npx puppeteer browsers install chrome-headless-shell).
// O Edge local não sobe em headless nesta máquina; CHROME_PATH permite apontar outro binário.
import puppeteer from 'puppeteer';

export const launch = (opts = {}) =>
  puppeteer.launch({ headless: 'shell', executablePath: process.env.CHROME_PATH || undefined, ...opts });
