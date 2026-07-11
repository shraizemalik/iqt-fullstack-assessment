import axios from 'axios'

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
  },
  timeout: 10000,
})

export async function getGitHubUser(username) {
  const response = await githubClient.get(`/users/${username}`)
  return response.data
}
