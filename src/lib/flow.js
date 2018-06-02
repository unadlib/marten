function Flow(globalConfig) {
  const globalTargets = Object.entries(globalConfig.project).reduce(
    (_targets, [project, ways]) => [..._targets, [project,
      Object.entries(ways).reduce((_ways, [way, paths]) => {
        return {
          ..._ways,
          [way]: Array.isArray(paths) ? paths : Object.keys(paths),
        };
      }, {})
    ]], []);
  return function (fn, config = {}) {
    let targets = globalTargets;
    if (config.targets) {
      targets = config.targets.map(
        (target) => {
          if (typeof target === 'string') {
            return  globalTargets.find(([globalTarget]) => globalTarget === target);
          }
          const [project, ways = {}] = target;
          return [
            project,
            Object.entries(
              globalTargets.find(([globalTarget]) => globalTarget === project)[1]
            ).reduce((
              _ways,
              [type, way]
            ) => ({
              ..._ways,
              [type]: ways[type] || way,
            }), {})
          ]
        }
      )
    }
    // TODO CMD arguments set it.
    // console.log(process.argv);
    const options = config.options || [];
    for (const [project, ways] of targets) {
      const ways = Object.entries(ways)
        .map(([name, ways]) => ways.map(way => `${name}-${way}`));
      let groups = [], group = [];
      const getGroups = (ways, depth = 0) => {
        for (let i = 0; i < ways[depth].length; i++) {
          group[depth] = ways[depth][i];
          if (depth !== ways.length - 1) {
            getGroups(ways, depth + 1);
          } else {
            groups.push([...group]);
          }
        }
      };
      getGroups(ways);
      for (const group of groups) {
        for (const option of options) {
          const sign = statements => `${statements}(${project} in ${group.join(' & ')})`;
          fn(sign, {
            global: globalConfig,
            params: option,
            group: group.reduce((_group, name) => {
              const [key, value] = name.split('-');
              return {
                ..._group,
                [key]: value,
              }
            }, {}),
            project,
          });
        }
      }
    }
  };
}

export {
  Flow as default,
};