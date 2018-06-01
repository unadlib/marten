function Flow(globalConfig) {
  return function (fn, config = {}) {
    const targets = config.target || Object.entries(globalConfig).reduce(
      (_targets, [key, { brand = {} } = {}]) => [..._targets, [key, Object.keys(brand)]]
      , []);
    // TODO CMD arguments set it.
    // console.log(process.argv);
    const options = config.options || [];
    for (const [project, brands] of targets) {
      for (const brand of brands) {
        for (const option of options) {
          const sign = statements => `${statements}(${project} in ${brand})`;
          fn(sign, {
            ...option,
            brand,
            project,
          });
        }
      }
    }
  };
}

export {
  Flow as
    default,
};