export function fetcher(args) {
  fetch(args).then((res) => res.json());
}

export function getTeamMembers(teamId: string) {
  return fetch(`http://52.64.24.209/api/teams/${teamId}/members`).then((data) =>
    data.json()
  );
}
