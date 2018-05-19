import sleep from '../utils/sleep';

const DEFAULT_TTL = 300;

async function getNode(page, selector, wait = DEFAULT_TTL) {
  await sleep(wait);
  const node = await page.$(selector);
  if (!node) {
    return await getNode(page, selector, wait);
  }
  return node;
}

async function click(page, selector) {
  const node = await getNode(page, selector);
  node.click();
}

export {
  click,
  getNode,
}
