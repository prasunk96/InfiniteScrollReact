export const fetchData = async (startAt) => {
  const url = `http://jsonplaceholder.typicode.com/posts?_start=${startAt}&_limit=10`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    },
  })
  return response.json();
};
