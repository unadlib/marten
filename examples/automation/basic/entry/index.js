import salesforce from './salesforce';

export default {
  salesforce,
}

// async function getEntry(name) {
//   const entry = entries[name];
//   if (typeof entry !== 'function') {
//     throw new Error(`Entry: '${name}.js' must be created first`);
//   }
//   const { prepare } = entry;
//   if (typeof prepare !== 'function') {
//     throw new Error(`'prepare' function in entry file '${name}.js' must be set first`);
//   }
//   await prepare.call(this);
// }
//
// export {
//   getEntry as default,
// };