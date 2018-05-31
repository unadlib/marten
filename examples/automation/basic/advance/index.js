import salesforce from './salesforce';

const projects = {
    salesforce
}

async function advance(name) {
    const project = projects[name];
    if (typeof project !== 'function') {
        throw new Error(`'${name}.js' must be created first`);
    }
    const { prepare } = projects[name];
    if (typeof prepare !== 'function') {
        throw new Error(`'prepare' function in '${name}.js' must be set first`);
    }
    await prepare.call(this);
}

export {
    advance as
    default,
}