import sleep from './sleep';

export default async function waitFor(fn, timeout = 300) {
  if (await fn()) {
    return true
  } else {
    await sleep(timeout);
    return await waitFor(fn, timeout);
  }
}