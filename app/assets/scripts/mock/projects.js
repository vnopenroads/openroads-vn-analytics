const type = ['TRIP', 'farm to market'];
const status = ['in-progress', 'done'];

export default function mockProjects (count) {
  let projects = [];
  for (let i = 0; i < count; ++i) {
    projects.push({
      name: `Project #${i + 1}`,
      type: type[Math.round(Math.random())],
      status: status[Math.floor(Math.random())]
    });
  }
  return projects;
}
