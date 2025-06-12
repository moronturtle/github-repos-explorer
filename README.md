# GitHub Repositories Explorer

[![Live](https://img.shields.io/badge/Live-Demo-blue?logo=githubpages)](https://moronturtle.github.io/github-repos-explorer/)

**🌐 [Live Demo Here](https://moronturtle.github.io/github-repos-explorer/)**

A simple React + TypeScript application that allows you to search for GitHub users and view their repositories.

## Features

- Search GitHub users (infinite scroll)
- View all repositories of selected user
- responsive UI
- Error handling and loading states
- Mobile-friendly design

## 🚀 Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind]
- [DaisyUi]
- [Zustand]
- [ReactHookForm]
- [react-intersection-observe]
- [vitest]

## 🔧 Setup

```bash
# Clone the repo
git clone https://github.com/moronturtle/github-repos-explorer
cd github-repos-explorer

# Install dependencies
npm install

# Run locally
npm run dev


## ⚠️ GitHub API Rate Limits

This app uses a custom `User-Agent` header to ensure that requests to the GitHub API are accepted.
**However, using a custom User-Agent alone does NOT increase the default rate limit.**

- **Without authentication (only User-Agent):**
  The GitHub API allows **60 requests per hour per IP address**.
- **With authentication (Personal Access Token):**
  The rate limit increases to **5000 requests per hour per user**.

If you plan to use this app intensively, or for multiple users, you should add your own [GitHub Personal Access Token](https://github.com/settings/tokens) in the API configuration to avoid hitting the low unauthenticated rate limit.

> For more information, see [GitHub API documentation](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting).

```
