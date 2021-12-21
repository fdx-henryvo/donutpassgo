export function fetcher(args) {
  fetch(args).then((res) => res.json());
}

export function getTeamMembers(teamId: string) {
  return fetch(`http://localhost:8000/teams/${teamId}/members`).then((data) =>
    data.json()
  );
}
