# Contributing to SyncEditor

First off, thank you for considering contributing to SyncEditor! It's people like you that make SyncEditor such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **A clear and descriptive title**
- **A detailed description of the proposed functionality**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the code style** of the project
3. **Add tests** if you've added code that should be tested
4. **Ensure the test suite passes**
5. **Make sure your code lints**
6. **Write a clear commit message**

## Development Setup

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x

### Setup Steps

1. Fork and clone the repository
```bash
git clone https://github.com/your-username/synceditor.git
cd synceditor
```

2. Install dependencies for both frontend and backend
```bash
# Frontend
cd synceditor
npm install

# Backend (in a new terminal)
cd ../Server
npm install
```

3. Create environment files
```bash
# Copy example env files
cp .env.example .env
# Edit with your configuration
```

4. Start development servers
```bash
# Frontend
npm run dev

# Backend (in another terminal)
npm run dev
```

## Code Style Guidelines

### JavaScript/React

- Use **functional components** with hooks
- Use **arrow functions** for component definitions
- Follow **Airbnb JavaScript Style Guide**
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions
- Use **PropTypes** for component props

### Example:

```javascript
/**
 * User avatar component with color coding
 * @param {Object} props - Component props
 * @param {string} props.username - Username to display
 * @param {number} props.size - Avatar size in pixels
 */
const UserAvatar = ({ username, size = 32 }) => {
  const color = getUserColor(username);
  const initials = getUserInitials(username);
  
  return (
    <div 
      className="rounded-full flex items-center justify-center"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

UserAvatar.propTypes = {
  username: PropTypes.string.isRequired,
  size: PropTypes.number
};
```

### CSS/Tailwind

- Use **Tailwind utility classes** when possible
- Keep custom CSS to a minimum
- Use **responsive modifiers** (`sm:`, `md:`, `lg:`)
- Follow **mobile-first** approach

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests after the first line

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat: Add user color coding system

- Implement hash-based color assignment
- Create getUserColor utility function
- Update UserList component with avatar display
- Add user initials generation

Closes #123
```

## Testing Guidelines

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage
- Test both success and error cases

### Running Tests

```bash
# Frontend tests
cd synceditor
npm test

# Backend tests
cd Server
npm test
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments to new functions
- Update API documentation for new endpoints
- Include examples in documentation

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## Recognition

Contributors will be recognized in our README.md file. Thank you for your contributions!
