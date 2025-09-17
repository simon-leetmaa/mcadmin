# Contributing to MCAdmin

Thank you for your interest in contributing to MCAdmin! This guide outlines our development workflow and standards.

## Branch Naming

Use the following naming conventions for branches:

### Feature Branches
- `feature/description` - New features
- `feature/user-authentication`
- `feature/dashboard-metrics`

### Bug Fixes
- `fix/description` - Bug fixes
- `fix/login-redirect-issue`
- `fix/memory-leak-cleanup`

### Hotfixes
- `hotfix/description` - Critical production fixes
- `hotfix/security-patch`
- `hotfix/crash-on-startup`

### Maintenance
- `chore/description` - Maintenance tasks
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## Commit Message Format

Follow the conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring without adding features or fixing bugs
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependency updates
- `perf` - Performance improvements
- `ci` - CI/CD changes

### Scope (optional)
- `auth` - Authentication related
- `dashboard` - Dashboard components
- `api` - API related
- `ui` - UI components
- `config` - Configuration files

### Examples
```bash
feat(auth): add user login functionality
fix(dashboard): resolve metrics loading issue
docs: update installation instructions
chore(deps): bump next from 14.0.0 to 14.1.0
refactor(ui): extract common button component
```

## Pull Request Guidelines

### PR Title Format
Use the same format as commit messages:
```
<type>(<scope>): <description>
```

### PR Description Template
```markdown
## Summary
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactor
- [ ] Performance improvement

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All existing tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if applicable)
- [ ] No console.log statements left in code
- [ ] TypeScript types are properly defined
- [ ] Responsive design tested (if UI changes)

## Screenshots (if applicable)
Add screenshots for UI changes.

## Related Issues
Closes #[issue_number]
```

### Review Process
1. Ensure all checks pass (linting, type checking, tests)
2. Request review from at least one team member
3. Address all review feedback
4. Squash commits before merging (if multiple commits)
5. Use "Squash and merge" for feature branches
6. Use "Merge commit" for hotfixes to preserve history

## Development Workflow

1. **Create a branch** from `main` using the naming convention
2. **Make your changes** following our coding standards
3. **Write tests** for new functionality
4. **Run linting and type checking**:
   ```bash
   npm run lint
   npm run type-check
   ```
5. **Test your changes** locally
6. **Commit** using conventional commit format
7. **Push** your branch and create a pull request
8. **Address review feedback** and update your PR
9. **Merge** once approved

## Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write descriptive variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use modern ES6+ features

## Testing

- Write unit tests for utilities and helpers
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for good test coverage on new code
- Mock external dependencies in tests

## Documentation

- Update README.md if adding new features
- Add JSDoc comments for complex functions
- Update API documentation for backend changes
- Include examples in documentation where helpful

## Getting Help

- Check existing issues and discussions
- Ask questions in pull request comments
- Reach out to maintainers for guidance

Thank you for contributing to MCAdmin! 🎉