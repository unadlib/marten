import puppeteer from 'puppeteer';
import Flow from '../../src/lib/flow';
import config from './config';
import entry from './basic/entry';

const options = {
  entry,
  program: puppeteer
};

const flow = new Flow(config, options);

export {
  flow as default,
};