import { useState } from 'react'

import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { AppTopbar } from '../components/layout/AppTopbar'
import { getGitHubUser } from '../services/api/github'
import { getErrorMessage, isRequestCanceled } from '../utils/httpErrors'

export function GitHubExplorerPage() {
  const [username, setUsername] = useState('')
  const [searchedUsername, setSearchedUsername] = useState('')
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextUsername = username.trim()

    if (!nextUsername) {
      setSearchedUsername('')
      setProfile(null)
      setStatus('empty')
      setErrorMessage('')
      return
    }

    setStatus('loading')
    setErrorMessage('')
    setSearchedUsername(nextUsername)

    try {
      const response = await getGitHubUser(nextUsername)
      setProfile(response)
      setStatus('success')
    } catch (error) {
      if (isRequestCanceled(error)) {
        return
      }

      if (error.response?.status === 404) {
        setProfile(null)
        setStatus('not-found')
        return
      }

      setProfile(null)
      setStatus('error')
      setErrorMessage(getErrorMessage(error, 'Unable to fetch GitHub profile right now.'))
    }
  }

  return (
    <main className="app-shell">
      <AppTopbar activePage="github-explorer" />

      <section id="github-explorer" className="hero panel">
        <div className="hero__content">
          <span className="eyebrow">Public API</span>
          <h1>GitHub Explorer</h1>
          <p>Search for any public GitHub profile by username.</p>
        </div>
      </section>

      <section className="panel github-search-panel">
        <div className="filters-panel__header">
          <div>
            <span className="eyebrow">Search</span>
            <h2>Find a GitHub user</h2>
          </div>
        </div>

        <form className="github-search-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>GitHub username</span>
            <input
              className="input"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="octocat"
            />
          </label>
          <Button type="submit" className="github-search-form__button">
            Search
          </Button>
        </form>
      </section>

      {status === 'loading' ? (
        <section className="github-profile-card github-profile-card--loading panel" aria-label="Loading GitHub profile" />
      ) : null}

      {status === 'idle' || status === 'empty' ? (
        <EmptyState
          title="Search for a GitHub profile"
          description="Enter a GitHub username to view public profile details, follower counts, and repository activity."
        />
      ) : null}

      {status === 'not-found' ? (
        <EmptyState
          title="GitHub user not found"
          description={`No public GitHub profile was found for "${searchedUsername}". Please check the username and try again.`}
        />
      ) : null}

      {status === 'error' ? (
        <EmptyState
          title="Unable to load GitHub profile"
          description={errorMessage}
        />
      ) : null}

      {status === 'success' && profile ? (
        <>
          <section className="github-summary-grid">
            <article className="summary-card">
              <span>Public Repositories</span>
              <strong>{profile.public_repos}</strong>
            </article>
            <article className="summary-card">
              <span>Followers</span>
              <strong>{profile.followers}</strong>
            </article>
            <article className="summary-card">
              <span>Following</span>
              <strong>{profile.following}</strong>
            </article>
          </section>

          <section className="github-profile-card panel">
            <div className="github-profile-card__header">
              <img
                className="github-profile-card__avatar"
                src={profile.avatar_url}
                alt={`${profile.login} avatar`}
              />
              <div className="github-profile-card__identity">
                <span className="eyebrow">GitHub profile</span>
                <h2>{profile.name || 'Name not available'}</h2>
                <p>@{profile.login}</p>
              </div>
            </div>

            <div className="github-profile-card__body">
              <div className="github-profile-card__row">
                <span>Bio</span>
                <p>{profile.bio || 'This user has not added a public bio yet.'}</p>
              </div>
              <div className="github-profile-card__row">
                <span>Profile URL</span>
                <a href={profile.html_url} target="_blank" rel="noreferrer">
                  {profile.html_url}
                </a>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </main>
  )
}
