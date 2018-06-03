function findContains(nodes, text) {
  return Array.from(nodes)
    .filter(elem => (elem.textContent || elem.innerText || '').indexOf(text) > -1);
}

function findContain(...args) {
  return findContains(...args)[0];
}

export {
  findContains,
  findContain,
}
