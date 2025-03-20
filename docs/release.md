# Release Guide

This guide explains how to set up your NPM account and create releases for the `@kotaicodegmbh/k8s-resources` package.

## Prerequisites

1. Node.js and npm installed on your system
2. Git installed and configured
3. A GitHub account with access to the repository
4. An NPM account

## Setting Up NPM

### 1. Create an NPM Account

If you don't have an NPM account:

1. Visit [npmjs.com](https://npmjs.com)
2. Click "Sign Up"
3. Follow the registration process
4. Verify your email address

### 2. Create an NPM Organization

1. Log in to your NPM account
2. Go to [npmjs.com/org/create](https://npmjs.com/org/create)
3. Create an organization named "kotaicodegmbh"
4. Choose the "Free" plan
5. Add your account as an owner

### 3. Generate an NPM Access Token

1. Log in to your NPM account
2. Click on your profile picture → "Access Tokens"
3. Click "Generate New Token"
4. Select "Automation" token type
5. Copy the generated token (you won't be able to see it again)

### 4. Add NPM Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and Variables → Actions
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your NPM access token
6. Click "Add secret"

## Creating a Release

### 1. Update Version

Update the version in `package.json`:

```bash
npm version patch  # for bug fixes (0.0.X)
npm version minor  # for new features (0.X.0)
npm version major  # for breaking changes (X.0.0)
```

This will:
- Update the version in `package.json`
- Create a git commit
- Create a git tag

### 2. Push Changes

Push your changes and the new tag to GitHub:

```bash
git push origin main
git push origin --tags
```

### 3. Release Process

The GitHub Actions workflow will automatically:

1. Run tests
2. Build the package
3. Create a GitHub release with auto-generated notes
4. Publish to NPM as `@kotaicodegmbh/k8s-resources`

You can monitor the release progress in:
- GitHub Actions tab
- GitHub Releases page
- NPM package page

## Verifying the Release

### 1. Check GitHub Release

1. Go to your repository's "Releases" page
2. Verify the new release is listed
3. Check the release notes are accurate

### 2. Check NPM Package

1. Visit [npmjs.com/package/@kotaicodegmbh/k8s-resources](https://npmjs.com/package/@kotaicodegmbh/k8s-resources)
2. Verify the new version is listed
3. Check the package details

### 3. Test Installation

Test the package installation in a new project:

```bash
npm install @kotaicodegmbh/k8s-resources
```

## Troubleshooting

### Common Issues

1. **NPM Authentication Failed**
   - Verify your NPM token is correctly set in GitHub secrets
   - Check if your NPM account has access to the organization

2. **Release Failed**
   - Check GitHub Actions logs for error messages
   - Verify all tests pass locally
   - Ensure the version number is unique

3. **Package Not Published**
   - Verify the NPM token has publish permissions
   - Check if the package name is available
   - Ensure the organization exists and you have access

### Getting Help

If you encounter issues:

1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review the [NPM documentation](https://docs.npmjs.com/)
3. Open an issue in the repository 