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
  const [validationMessage, setValidationMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextUsername = username.trim()
    setUsername(nextUsername)

    if (!nextUsername) {
      setSearchedUsername('')
      setProfile(null)
      setStatus('idle')
      setErrorMessage('')
      setValidationMessage('Enter a GitHub username to start your search.')
      return
    }

    setValidationMessage('')
    setStatus('loading')
    setErrorMessage('')
    setProfile(null)
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
        setErrorMessage('')
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

      <section id="github-explorer" className="hero hero--compact panel">
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
          <label className="field" htmlFor="github-username">
            <span>GitHub username</span>
            <input
              id="github-username"
              className="input"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="octocat"
              aria-invalid={validationMessage ? 'true' : 'false'}
              aria-describedby={validationMessage ? 'github-username-error' : undefined}
            />
          </label>
          <Button
            type="submit"
            className="github-search-form__button"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Searching...' : 'Search'}
          </Button>
        </form>
        {validationMessage ? (
          <p id="github-username-error" className="field-error github-search-panel__message">
            {validationMessage}
          </p>
        ) : null}
      </section>

      {status === 'loading' ? (
        <section className="github-profile-card github-profile-card--loading panel" aria-label="Loading GitHub profile" />
      ) : null}

      {status === 'idle' ? (
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
          description={errorMessage || 'There was a problem reaching GitHub. Please try again in a moment.'}
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
                alt={`GitHub profile avatar for ${profile.login}`}
              />
              <div className="github-profile-card__identity">
                <span className="eyebrow">GitHub profile</span>
                <h2>{profile.name || 'GitHub user'}</h2>
                <p>
                  <a href={profile.html_url} target="_blank" rel="noreferrer noopener">
                    @{profile.login}
                  </a>
                </p>
              </div>
            </div>

            <div className="github-profile-card__body">
              <div className="github-profile-card__row">
                <span>Bio</span>
                <p>{profile.bio || 'No public bio available for this user.'}</p>
              </div>
              <div className="github-profile-card__row">
                <span>Profile URL</span>
                <a href={profile.html_url} target="_blank" rel="noreferrer noopener">
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
