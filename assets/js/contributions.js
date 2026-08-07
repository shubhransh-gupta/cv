(function () {
  'use strict'

  var TOP_REPOS = 5

  var ACCOUNTS = [
    {
      username: 'shubhransh-gupta',
      reposId: 'repos-primary',
      statPrefix: 'primary',
      showRepos: true
    },
    {
      username: 'ShubhranshGupta',
      statPrefix: 'secondary',
      showRepos: false
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
    Makefile: '#427819'
  }

  function langColor (language) {
    return LANG_COLORS[language] || '#34a853'
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

  async function fetchRecentRepos (username, limit) {
    var batch = await fetchJson(
      'https://api.github.com/users/' + encodeURIComponent(username) +
      '/repos?per_page=' + limit + '&sort=pushed&direction=desc'
    )

    return batch.sort(function (a, b) {
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

  function renderReposSection (container, repos, username, totalRepos) {
    if (!repos.length) {
      container.innerHTML = '<p class="repos-empty">No public repositories found for @' + escapeHtml(username) + '.</p>'
      return
    }

    var footer =
      '<div class="repos-more reveal visible">' +
        '<p>Showing ' + repos.length + ' of ' + totalRepos + ' public repositories.</p>' +
        '<a href="https://github.com/' + escapeHtml(username) + '?tab=repositories" target="_blank" rel="noopener" class="btn btn-secondary">View all on GitHub →</a>' +
      '</div>'

    container.innerHTML = repos.map(renderRepoCard).join('') + footer
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
    var reposContainer = account.reposId ? document.getElementById(account.reposId) : null

    if (reposContainer) {
      renderLoading(reposContainer)
    }

    try {
      var user = await fetchUser(account.username)

      setStat(account.statPrefix, 'repos', user.public_repos)
      setStat(account.statPrefix, 'followers', user.followers)
      setStat(account.statPrefix, 'following', user.following)

      if (!account.showRepos || !reposContainer) return

      var repos = await fetchRecentRepos(account.username, TOP_REPOS)

      var countEl = document.querySelector('[data-repo-total="' + account.username + '"]')
      if (countEl) {
        countEl.textContent = 'Top ' + TOP_REPOS + ' · ' + user.public_repos + ' total'
      }

      renderReposSection(reposContainer, repos, account.username, user.public_repos)
    } catch (error) {
      console.warn('Contributions fetch failed for ' + account.username, error)
      if (reposContainer) {
        renderError(reposContainer, account.username)
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible')
    })
    ACCOUNTS.forEach(loadAccount)
  })
})()
