(function () {
  'use strict'

  var ACCOUNTS = [
    {
      username: 'shubhransh-gupta',
      profileId: 'github-profile-primary',
      reposId: 'repos-primary',
      statPrefix: 'primary'
    },
    {
      username: 'ShubhranshGupta',
      profileId: 'github-profile-secondary',
      reposId: 'repos-secondary',
      statPrefix: 'secondary'
    }
  ]

  var NEW_REPO_DAYS = 45

  var LANG_COLORS = {
    Swift: '#F05138',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    'Jupyter Notebook': '#DA5B0B',
    Dart: '#00B4AB',
    C: '#555555',
    'C++': '#f34b7d',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Kotlin: '#A97BFF',
    Shell: '#89e051',
    Makefile: '#427819'
  }

  function langColor (language) {
    return LANG_COLORS[language] || '#5266eb'
  }

  function formatUpdated (isoDate) {
    return 'Updated ' + new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  function isRecentRepo (isoDate) {
    var pushed = new Date(isoDate).getTime()
    var cutoff = Date.now() - NEW_REPO_DAYS * 24 * 60 * 60 * 1000
    return pushed >= cutoff
  }

  function escapeHtml (value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  async function fetchJson (url) {
    var response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' }
    })
    if (!response.ok) {
      throw new Error('GitHub API request failed: ' + response.status)
    }
    return response.json()
  }

  async function fetchUser (username) {
    return fetchJson('https://api.github.com/users/' + encodeURIComponent(username))
  }

  async function fetchAllRepos (username) {
    var repos = []
    var page = 1

    while (true) {
      var batch = await fetchJson(
        'https://api.github.com/users/' + encodeURIComponent(username) +
        '/repos?per_page=100&sort=pushed&direction=desc&page=' + page
      )
      if (!batch.length) break
      repos = repos.concat(batch)
      if (batch.length < 100) break
      page += 1
    }

    return repos.sort(function (a, b) {
      return new Date(b.pushed_at) - new Date(a.pushed_at)
    })
  }

  function setStat (prefix, key, value) {
    document.querySelectorAll('[data-stat="' + prefix + '-' + key + '"]').forEach(function (el) {
      el.textContent = value
    })
  }

  function renderRepoCard (repo) {
    var isNew = isRecentRepo(repo.pushed_at)
    var language = repo.language
    var description = repo.description || 'Open source project on GitHub.'
    var cardClass = 'repo-card reveal visible' + (isNew ? ' repo-card-new' : '')
    var nameHtml = escapeHtml(repo.name)
    if (isNew) {
      nameHtml += ' <span class="promo-badge promo-badge--new">New</span>'
    }

    var langHtml = language
      ? '<span class="repo-lang"><span class="repo-lang-dot" style="background:' + langColor(language) + '"></span>' + escapeHtml(language) + '</span>'
      : ''

    return (
      '<a href="' + escapeHtml(repo.html_url) + '" target="_blank" rel="noopener" class="' + cardClass + '">' +
        '<div class="repo-name">' + nameHtml + '</div>' +
        '<p class="repo-desc">' + escapeHtml(description) + '</p>' +
        '<div class="repo-meta">' +
          langHtml +
          '<span>★ ' + (repo.stargazers_count || 0) + '</span>' +
          '<span>' + escapeHtml(formatUpdated(repo.pushed_at)) + '</span>' +
        '</div>' +
      '</a>'
    )
  }

  function renderReposGrid (container, repos, username) {
    if (!repos.length) {
      container.innerHTML = '<p class="repos-empty">No public repositories found for @' + escapeHtml(username) + '.</p>'
      return
    }

    container.innerHTML = repos.map(renderRepoCard).join('')
    container.setAttribute('data-repo-count', String(repos.length))
  }

  function renderError (container, username) {
    container.innerHTML =
      '<div class="repos-error">' +
        '<p>Could not load repositories for @' + escapeHtml(username) + ' right now.</p>' +
        '<a href="https://github.com/' + escapeHtml(username) + '" target="_blank" rel="noopener" class="project-badge">View on GitHub →</a>' +
      '</div>'
  }

  function renderLoading (container) {
    container.innerHTML = '<div class="repos-loading" aria-live="polite">Loading repositories…</div>'
  }

  async function loadAccount (account) {
    var reposContainer = document.getElementById(account.reposId)
    if (!reposContainer) return

    renderLoading(reposContainer)

    try {
      var user = await fetchUser(account.username)
      var repos = await fetchAllRepos(account.username)

      setStat(account.statPrefix, 'repos', user.public_repos)
      setStat(account.statPrefix, 'followers', user.followers)
      setStat(account.statPrefix, 'following', user.following)

      var countEl = document.querySelector('[data-repo-total="' + account.username + '"]')
      if (countEl) {
        countEl.textContent = repos.length + ' public repositories'
      }

      renderReposGrid(reposContainer, repos, account.username)
    } catch (error) {
      console.warn('Contributions fetch failed for ' + account.username, error)
      renderError(reposContainer, account.username)
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    ACCOUNTS.forEach(loadAccount)
  })
})()
