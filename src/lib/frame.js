import sleep from '../utils/sleep';

async function findFrame(page, url, wait = 500) {
  await sleep(wait);
  const urls = page.frames().map(frame => frame.url());
  const index = urls.indexOf(url);
  const isExist = index > -1;
  return isExist ?
    page.frames()[index] :
    await findFrame(page, url, wait);
}

export {
  findFrame,
}
