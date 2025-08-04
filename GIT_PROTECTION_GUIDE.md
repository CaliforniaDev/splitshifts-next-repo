# Git Branch Protection Guide

This repository has built-in protections to prevent accidental commits to the `main` branch. This guide explains how the protections work and how to use them effectively.

## 🛡️ Protection Features

### 1. Pre-commit Hook
- **Automatically warns** when trying to commit directly to `main`
- **Allows merging** from `dev` to `main` without warnings
- **Asks for confirmation** before allowing direct commits to main
- **Provides helpful suggestions** for proper workflow

### 2. Safe Git Aliases
- `git switch-to-dev` - Quick switch to dev branch
- `git safe-push` - Push current branch (blocks main branch pushes)

## 🚀 Recommended Workflow

### For New Features:
```bash
# 1. Start from dev branch
git switch-to-dev

# 2. Create a new feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit normally
git add .
git commit -m "Add new feature"

# 4. Push your feature branch
git push origin feature/your-feature-name

# 5. Create a pull request to merge into dev
```

### For Merging to Main:
```bash
# 1. Switch to main
git checkout main

# 2. Merge from dev (this will NOT trigger warnings)
git merge dev

# 3. Push to main
git push origin main
```

## ⚠️ When You See the Warning

If you try to commit directly to main, you'll see:

```
🚨 WARNING: You are about to commit to the MAIN branch!
🚨 This is usually not what you want to do.

Current branch: main

To continue anyway, run: git commit --no-verify
To switch to dev branch, run: git checkout dev
To create a new feature branch, run: git checkout -b feature/your-feature-name

Are you ABSOLUTELY SURE you want to commit to main? (yes/no):
```

### Your Options:
1. **Type "no"** - Aborts the commit (recommended)
2. **Type "yes"** - Proceeds with the commit to main
3. **Use `git commit --no-verify`** - Bypasses the hook entirely

## 🔧 Emergency Override

For hotfixes or emergency commits to main:
```bash
git commit --no-verify -m "emergency hotfix"
```

## 📋 Quick Reference

| Command | Purpose |
|---------|---------|
| `git switch-to-dev` | Switch to dev branch |
| `git safe-push` | Push current branch safely |
| `git commit --no-verify` | Bypass pre-commit hook |
| `git status && git branch` | Check current branch |

## 🤔 Why These Protections?

- **Prevent accidents**: Easy to forget which branch you're on
- **Maintain clean history**: Keep main branch stable
- **Enforce workflow**: Encourage proper branching strategy
- **Reduce conflicts**: Less chance of merge conflicts
- **Better collaboration**: Clear development process

## 🛠️ Technical Details

### Pre-commit Hook Location:
`.git/hooks/pre-commit`

### Git Aliases Configuration:
```bash
git config --local --get-regexp alias
```

### Disable Protections (not recommended):
```bash
rm .git/hooks/pre-commit
```

## 🆘 Troubleshooting

### "Hook not working"
```bash
# Make sure hook is executable
chmod +x .git/hooks/pre-commit
```

### "Want to disable for one commit"
```bash
git commit --no-verify -m "your message"
```

### "Accidentally on wrong branch"
```bash
# Move your changes to the right branch
git stash
git switch-to-dev
git stash pop
```

