# **Next.js \+ Cypress Project Documentation**

## **Table of Contents**

1. Project Setup and Installation  
2. Project Structure Overview  
3. Address Management System  
4. Cypress Testing Implementation  
5. Development Workflow  
6. Git Workflow: Develop to Master Merge with Pre-merge Testing  
7. GitHub Actions Workflow and Environment Management

---

## **1\. Project Setup and Installation**

This section covers the essential installation commands for setting up a Next.js project with Cypress testing, Tailwind CSS styling, and development tools.

### **Core Framework Installation**

\# Initialize Next.js project

npx create-next-app@latest my-project \--typescript \--tailwind \--eslint \--app

\# Install Next.js dependencies

npm install next react react-dom

### **Styling and UI Dependencies**

\# Install Tailwind CSS and PostCSS

npm install \-D tailwindcss postcss autoprefixer

npm install \-D @tailwindcss/postcss

\# Install additional styling utilities

npm install tailwind-styled-scrollbar

### **Testing Framework Setup**

\# Install Cypress for end-to-end testing

npm install \-D cypress

\# Install testing utilities

npm install \-D concurrently wait-on cross-env

### **Development Tools and Git Hooks**

\# Install Husky for Git hooks

npm install \-D husky

\# Install TypeScript and ESLint

npm install \-D typescript @types/node @types/react

npm install \-D eslint eslint-config-next

\# Install environment configuration

npm install \-D dotenv

### **Project-Specific Dependencies**

\# Database and API dependencies

npm install better-sqlite3 mysql2

\# UI and notification libraries

npm install react-hot-toast canvas-confetti

\# CMS integration

npm install @sanity/client @sanity/image-url next-sanity-image

### **Development Scripts Configuration**

The project includes the following npm scripts for development and testing:

{

  "scripts": {

    "dev": "next dev",

    "build": "next build", 

    "start": "next start",

    "lint": "next lint",

    "test:dev:open": "env-cmd -f .env.test concurrently \"npm run build && npm run start\" \"wait-on http://localhost:3000 && cypress open\"",

    "test:run": "env-cmd -f .env.test concurrently --kill-others --success first \"npm run build && npm run start\" \"wait-on http://localhost:3000 && cypress run --headless\"",
    
    "test:run:build": "env-cmd -f .env.test concurrently --kill-others --success first \"npm run build && npm run start\" \"wait-on http://localhost:3000 && cypress run --headless\"",

    "prepare": "husky"

  }

}

### **Key Features Verified**

✅ Address Management System: Complete CRUD operations for address management  
✅ Cypress Testing: Comprehensive end-to-end tests for address functionality  
✅ Next.js : App Router implementation with TypeScript  
✅ Tailwind CSS: Modern styling framework integration  
✅ Development Tools: Husky, ESLint, and concurrent development setup

---

## **2\. Project Structure Overview**

The project follows a modern Next.js 13+ App Router structure with comprehensive testing and development tools.

### **Directory Structure**

nextjs-cypress/

├── app/                    \# Next.js App Router

│   ├── address/           \# Address management pages

│   ├── api/               \# API routes

│   ├── product/           \# Product pages

│   └── success/           \# Success pages

├── comps/                 \# Reusable components

├── cypress/               \# Cypress testing files

│   ├── e2e/              \# End-to-end tests

│   ├── fixtures/         \# Test data

│   └── support/          \# Test utilities

├── lib/                   \# Utility libraries

│   ├── db.ts             \# Database abstraction layer

│   ├── db-sqlite.ts      \# SQLite implementation

│   └── utils.js          \# Helper functions

├── .husky/               \# Git hooks

└── .github/workflows/    \# GitHub Actions

### **Key Architecture Components**

* App Router: Modern Next.js routing with TypeScript  
* Component Library: Reusable UI components in /comps  
* API Layer: RESTful API endpoints in /app/api  
* Testing Suite: Comprehensive Cypress tests  
* Database Layer: Dual database architecture (SQLite/MySQL)

---

## **3\. Address Management System**

The project includes a complete address management system with full CRUD operations, form validation, and comprehensive testing coverage.

### **Address CRUD Operations**

#### **Create Address**

* Form validation for required fields  
* Real-time form state management  
* Success feedback and form reset

#### **Read Addresses**

* Dynamic address listing  
* Responsive grid layout  
* Empty state handling

#### **Update Address**

* Edit mode with pre-populated forms  
* Cancel functionality  
* Optimistic UI updates

#### **Delete Address**

* Confirmation-free deletion  
* Immediate UI updates  
* Data persistence

### **API Endpoints**

// GET /api/address \- Retrieve all addresses

// POST /api/address \- Create new address

// PUT /api/address/\[id\] \- Update existing address

// DELETE /api/address/\[id\] \- Delete address

### **Form Validation**

* Required Fields: Name, Address Line 1, City, Postal Code, Country  
* Optional Fields: Address Line 2, State, Phone  
* Real-time Validation: Client-side validation with server-side verification

---

## **4\. Cypress Testing Implementation**

This section explains how Cypress testing works in the project, covering the two main test commands and the innovative dual database approach for seamless testing across different environments.

### **Cypress Test Commands Overview**

The project includes two primary Cypress commands that serve different purposes in the development and testing workflow:

#### **1\. npm run test:dev:open \- Interactive Testing via browser**

npm run test:dev:open

What this command does:

* Starts Next.js development server in test mode (NODE\_ENV=test)  
* Waits for the server to be ready on http://localhost:3000  
* Opens Cypress Test Runner in interactive mode  
* Allows developers to run tests individually and debug interactively

Use cases:

* Development and debugging  
* Writing new tests  
* Investigating test failures  
* Interactive test execution

#### **2\. npm run test:run \- Automated Testing**

npm run test:run

What this command does:

* Starts Next.js development server in test mode  
* Waits for server readiness  
* Runs all Cypress tests in headless mode (no browser UI)  
* Automatically terminates after test completion  
* Used in CI/CD pipelines and pre-commit hooks

Use cases:

* Pre-commit hooks (Husky)  
* CI/CD pipeline testing  
* Automated quality gates  
* Production build verification

### **Dual Database Architecture**

The project implements an innovative dual database approach that automatically switches between databases based on the environment, ensuring tests can run in any environment without external dependencies.

#### **Database Selection Logic**

// Environment detection logic

const isTestEnv \= process.env.NODE\_ENV \=== 'test' || 

                 process.env.NEXT\_PUBLIC\_TEST\_MODE \=== 'true'

if (isTestEnv) {

  // Use SQLite for testing

  return getSqlitePool();

} else {

  // Use MySQL for development/production

  return getMySQLPool();

}

#### **SQLite Database (Testing)**

Location: cypress/test-db.sqlite

When used:

* During Cypress test execution  
* GitHub Actions pipeline  
* Local testing environment  
* Any environment without MySQL server

Benefits:

* ✅ No external database server required  
* ✅ Fast test execution  
* ✅ Isolated test data  
* ✅ Works in GitHub Actions without configuration  
* ✅ Automatic cleanup between tests

Implementation:

// SQLite wrapper that mimics MySQL behavior

export function getSqlitePool() {

  const db \= getSqliteDb();

  return {

    async query(sql: string, params?: any\[\]) {

      // Converts SQLite results to MySQL format

      const result \= db.prepare(sql).run(params);

      return \[{

        insertId: result.lastInsertRowid,

        affectedRows: result.changes

      }\];

    }

  };

}

#### **MySQL Database (Development/Production)**

When used:

* Local development  
* Production deployment  
* When MySQL server is available

Benefits:

* ✅ Production-like environment  
* ✅ Full SQL features  
* ✅ Scalable for production use  
* ✅ Team collaboration with shared data

### **Environment Configuration**

#### **Test Environment Variables**

\# Set by npm scripts automatically

NODE\_ENV=test

NEXT\_PUBLIC\_TEST\_MODE=true

#### **Database Environment Detection**

The system automatically detects the environment and switches databases:

// Automatic database selection

export function getPool() {

  const isTestEnv \=                 process.env.NEXT\_PUBLIC\_TEST\_MODE \=== 'true'

                   

  if (isTestEnv) {

    console.log('🔄 Using SQLite for testing');

    return getSqlitePool();

  } else {

    console.log('🔄 Using MySQL for development/production');

    return getMySQLPool();

  }

}

### **Test Data Management**

#### **Automatic Test Data Cleanup**

// Before each test, clear existing data

beforeEach(() \=\> {

  cy.request('GET', '/api/address').then((response) \=\> {

    if (response.body.data && response.body.data.length \> 0\) {

      response.body.data.forEach((address: any) \=\> {

        cy.request('DELETE', \`/api/address/${address.id}\`);

      });

    }

  });

});

#### **Isolated Test Environment**

* Each test starts with a clean database  
* No interference between test cases  
* Predictable test outcomes  
* Easy debugging and maintenance

### **GitHub Actions Pipeline Compatibility**

#### **Why This Approach Works in GitHub Actions**

1. No External Dependencies: SQLite doesn't require a database server  
2. Fast Setup: Database is created automatically  
3. No Configuration: Works out of the box  
4. Reliable: No network dependencies or connection issues  
5. Consistent: Same behavior across all environments

#### **Pipeline Test Flow**

\# GitHub Actions workflow (conceptual)

\- name: Run Tests

  run: |

    npm install

    npm run test:run  \# Uses SQLite automatically

### **Benefits of This Architecture**

#### **For Development**

* ✅ Local Testing: Works without MySQL setup  
* ✅ Fast Iteration: Quick test execution  
* ✅ Debugging: Easy to inspect test data  
* ✅ Isolation: Tests don't affect development data

#### **For CI/CD**

* ✅ No Infrastructure: No database server required  
* ✅ Reliable: No connection failures  
* ✅ Fast: Quick pipeline execution  
* ✅ Scalable: Works for any number of parallel jobs

#### **For Production**

* ✅ Real Database: Uses MySQL in production  
* ✅ Full Features: All database capabilities available  
* ✅ Performance: Optimized for production workloads  
* ✅ Monitoring: Full database monitoring and logging

### **Test Coverage Areas**

The Cypress tests cover comprehensive functionality:

* ✅ Address CRUD Operations: Create, Read, Update, Delete  
* ✅ Form Validation: Required field validation  
* ✅ Navigation: Route navigation testing  
* ✅ UI Interactions: Button clicks, form submissions  
* ✅ Data Persistence: Database operations  
* ✅ Error Handling: Edge cases and error scenarios

---

## **5\. Development Workflow**

### **Local Development Setup**

\# Clone the repository

git clone https://github.com/akhi-scalupally/nextjs-cypress.git

cd nextjs-cypress

\# Install dependencies

npm install

\# Set up Husky hooks

npm run prepare

\# Start development server

npm run dev

### **Testing Workflow**

\# Interactive testing (for development)

npm run test:dev:open

\# Automated testing (for CI/CD)

npm run test:run

\# Production build testing

npm run test:run:build

### **Code Quality Tools**

* ESLint: Code linting and style enforcement  
* TypeScript: Type safety and better development experience  
* Husky: Pre-commit hooks for quality gates  
* Cypress: End-to-end testing automation

---

## **6\. Git Workflow: Develop to Master Merge with Pre-merge Testing**

This project implements a robust Git workflow that ensures code quality through automated testing before merging from the develop branch to the master branch.

### **Branch Strategy**

* develop: Active development branch where all feature development occurs  
* master: Production-ready branch that receives tested code from develop  
* Feature branches: Individual feature development (merged into develop)

### **Pre-merge Testing Workflow**

The project uses Husky pre-commit hooks to ensure all tests pass before any code can be committed, providing an additional layer of quality assurance before merging to master.

#### **Husky Pre-commit Hook Setup**

\# Initial setup for new team members

npm install

npm run prepare

#### **What Happens During Pre-commit**

Before each commit, the following automated process occurs:

1. ✅ Build Verification: Next.js app builds in test mode  
2. ✅ Server Startup: App starts on localhost:3000  
3. ✅ Test Execution: Cypress tests run headlessly against the app  
4. ✅ Quality Gate:  
   * If tests pass → commit proceeds  
   * If tests fail → commit is blocked with error message

#### **Available Test Scripts**

\# Development testing with Cypress UI

npm run test:dev:open

\# Headless testing for CI/CD

npm run test:run

\# Production build testing

npm run test:run:build

### **Merge Process: Develop → Master**

#### **Step 1: Pre-merge Testing**

Before creating a pull request from develop to master:

\# Switch to develop branch

git checkout develop

\# Pull latest changes

git pull origin develop

\# Run full test suite

npm run test:run

\# Ensure all tests pass before proceeding

#### **Step 2: Create Pull Request**

1. Create a pull request from develop to master  
2. The pre-commit hooks ensure all tests have already passed  
3. Review process can focus on code quality and business logic

#### **Step 3: Merge Approval**

* All tests must pass (enforced by Husky hooks)  
* Code review approval required  
* No merge conflicts

#### **Step 4: Merge to Master**

\# After PR approval, merge to master

git checkout master

git pull origin master

git merge develop

git push origin master

### **Quality Assurance Features**

#### **Automated Testing Pipeline**

* Pre-commit: Husky runs tests before every commit  
* Pre-merge: Full test suite runs before develop → master merge  
* Address Management: Comprehensive CRUD testing for /address route

#### **Test Coverage Areas**

* ✅ Address CRUD Operations: Create, Read, Update, Delete addresses  
* ✅ Form Validation: Required field validation  
* ✅ Navigation: Route navigation testing  
* ✅ UI Interactions: Form submissions, button clicks, data display

#### **Bypass Options (Emergency Only)**

\# Temporarily bypass pre-commit hooks (use with caution)

git commit \--no-verify \-m "emergency fix"

\# Disable Husky entirely (not recommended)

HUSKY=0 git commit \-m "bypass message"

### **Team Collaboration**

#### **New Team Member Setup**

\# Clone repository

git clone https://github.com/akhi-scalupally/nextjs-cypress.git

cd nextjs-cypress

\# Install dependencies

npm install

\# Husky hooks automatically set up via prepare script

npm run prepare

\# Verify setup

npm run test:dev:open

#### **Configuration Files**

* .husky/pre-commit: Contains the pre-commit hook script  
* package.json: Test scripts and Husky prepare command  
* cypress/e2e/address.cy.ts: Comprehensive test suite  
* setup-husky.md: Documentation for Husky setup

### **Benefits of This Workflow**

1. Quality Assurance: No broken code reaches master branch  
2. Automated Testing: Reduces manual testing overhead  
3. Team Consistency: All team members follow the same process  
4. Risk Mitigation: Prevents production issues from untested code  
5. Developer Confidence: Clear process for safe code integration

---

## **7\. GitHub Actions Workflow and Environment Management**

This section explains how the project uses GitHub Actions for automated testing and how environment files are securely managed using repository secrets.

### **GitHub Actions Workflow**

The project includes a comprehensive GitHub Actions workflow that automatically runs Cypress tests on pull requests to the master branch.

#### **Workflow Configuration**

name: PR Checks • Cypress

on:

  pull\_request:

    branches: \[ master \]

    types: \[opened, synchronize, reopened, ready\_for\_review\]

concurrency:

  group: pr-${{ github.event.pull\_request.number }}

  cancel-in-progress: true

#### **Workflow Features**

* ✅ Automatic Triggering: Runs on PR creation, updates, and review requests  
* ✅ Concurrency Control: Cancels previous runs when new commits are pushed  
* ✅ Draft PR Protection: Skips testing for draft pull requests  
* ✅ Artifact Collection: Uploads test artifacts on failure for debugging

### **Environment File Management**

#### **Local Development**

The project uses two environment files locally:

* \*\*.env \- Development environment variables  
* \*\*.env.test \- Testing environment variables

These files are NOT committed to GitHub for security reasons and are listed in .gitignore.

#### **GitHub Repository Secrets**

For GitHub Actions, environment variables are stored as repository secrets:

* DOTENV\_DEV \- Contains the contents of your local .env file  
* DOTENV\_TEST \- Contains the contents of your local .env.test file

#### **Secret-to-File Generation**

The GitHub Actions workflow automatically generates environment files from secrets:

\- name: Create env files (from secrets, no log output)

  run: |

    printf "%s" "${{ secrets.DOTENV\_DEV }}" \> .env

    printf "%s" "${{ secrets.DOTENV\_TEST }}" \> .env.test

#### **Setting Up Repository Secrets**

1. Go to Repository Settings:  
   * Navigate to your GitHub repository  
   * Click on "Settings" tab  
   * Select "Secrets and variables" → "Actions"  
2. Add Environment Secrets:  
   * Click "New repository secret"  
   * Name: DOTENV\_DEV  
   * Value: Copy the entire contents of your local .env file  
   * Click "Add secret"  
3. Add Test Environment Secret:  
   * Click "New repository secret" again  
   * Name: DOTENV\_TEST  
   * Value: Copy the entire contents of your local .env.test file  
   * Click "Add secret"

#### **Security Benefits**

* ✅ No Sensitive Data in Code: Environment files never committed to repository  
* ✅ Secure Secret Storage: GitHub encrypts secrets at rest  
* ✅ Access Control: Only repository collaborators can view/edit secrets  
* ✅ Audit Trail: GitHub logs all secret access and modifications

### **Complete CI/CD Pipeline**

#### **Step 1: Code Push to PR**

\# Developer creates feature branch

git checkout \-b feature/new-feature

\# Makes changes and commits

git add .

git commit \-m "Add new feature"

\# Pushes to GitHub

git push origin feature/new-feature

\# Creates pull request to master

#### **Step 2: Automatic Testing**

The GitHub Actions workflow automatically:

1. Checks out code from the pull request  
2. Sets up Node.js environment (Node.js 20\)  
3. Caches npm dependencies for faster builds  
4. Generates environment files from repository secrets  
5. Installs dependencies with npm ci  
6. Runs Cypress tests in headless mode  
7. Uploads test artifacts if tests fail

#### **Step 3: Test Results**

* ✅ Success: PR shows green checkmark, ready for merge  
* ❌ Failure: PR shows red X, includes test artifacts for debugging  
* 🔄 In Progress: Shows yellow circle while tests are running

### **Environment Variables in GitHub Actions**

#### **Development Environment (.env)**

\# Example .env file contents (stored in DOTENV\_DEV secret)

MYSQL\_HOST=localhost

MYSQL\_PORT=3306

MYSQL\_USER=root

MYSQL\_PASSWORD=1234

MYSQL\_DATABASE=nextjs\_cypress

NEXT\_PUBLIC\_TEST\_MODE=false

#### **Test Environment (.env.test)**

\# Example .env.test file contents (stored in DOTENV\_TEST secret)

NEXT\_PUBLIC\_TEST\_MODE=true

\# Test-specific database configuration

\# Test-specific API keys

### **Dual Database in CI/CD**

The GitHub Actions workflow automatically uses the SQLite database for testing:

// Automatic database selection in CI/CD

const isTestEnv \= 

                 process.env.NEXT\_PUBLIC\_TEST\_MODE \=== 'true'

if (isTestEnv) {

  // Uses SQLite \- no external database server needed

  return getSqlitePool();

}

#### **Benefits in GitHub Actions**

* ✅ No Database Server Required: SQLite works out of the box  
* ✅ Fast Test Execution: No network dependencies  
* ✅ Reliable: No connection failures or timeouts  
* ✅ Scalable: Multiple parallel jobs can run simultaneously

### **Workflow Status Checks**

#### **Required Status Checks**

The workflow includes a status check job that ensures:

check-merge-status:

  needs: cypress   \# Only runs after Cypress tests complete

  runs-on: ubuntu-latest


  steps:

    \- name: Check if PR has passed all required checks

      run: |

        if \[\[ "${{ github.event.pull\_request.mergeable }}" \== "false" \]\]; then

          echo "This PR cannot be merged due to failing checks or merge conflicts."

          exit 1

        fi

        echo "PR is mergeable and all checks passed. Ready to merge\!"

#### **Branch Protection Rules**

To enforce the workflow, set up branch protection rules:

1. Go to Repository Settings → "Branches"  
2. Add rule for master branch  
3. Enable: "Require status checks to pass before merging"  
4. Select: "PR Checks • Cypress" and "check-merge-status"  
5. Enable: "Require branches to be up to date before merging"

![][image1]

![][image2]

### **Troubleshooting**

#### **Common Issues**

1. Secrets Not Found: Ensure repository secrets are properly configured  
2. Environment File Missing: Check that secrets contain complete file contents  
3. Test Failures: Review uploaded artifacts in GitHub Actions logs  
4. Database Issues: Verify SQLite database creation in test environment

#### **Debugging Failed Tests**

\# Download test artifacts from GitHub Actions

\# Check cypress/screenshots for visual debugging

\# Review cypress/videos for test execution flow

### **Benefits of This Setup**

1. Security: No sensitive data in repository  
2. Automation: Tests run automatically on every PR  
3. Quality Gates: Prevents broken code from merging  
4. Debugging: Test artifacts help identify issues  
5. Scalability: Works for any number of parallel PRs  
6. Reliability: No external dependencies required

---

## **Repository Information**

This project is available on GitHub at: [https://github.com/akhi-scalupally/nextjs-cypress](https://github.com/akhi-scalupally/nextjs-cypress)

### **Key Features of the Repository**

* ✅ Complete Next.js 13+ App Router Implementation  
* ✅ Dual Database Architecture (SQLite for testing, MySQL for production)  
* ✅ Comprehensive Cypress Testing Suite  
* ✅ Husky Pre-commit Hooks for quality assurance  
* ✅ GitHub Actions Workflow ready for CI/CD  
* ✅ Address Management System with full CRUD operations  
* ✅ Modern Development Stack (TypeScript, Tailwind CSS, ESLint)

### **Getting Started**

To get started with this project:

1. Clone the repository: git clone https://github.com/akhi-scalupally/nextjs-cypress.git  
2. Install dependencies: npm install  
3. Set up development environment: npm run prepare  
4. Start development server: npm run dev  
5. Run tests: npm run test:dev:open

The repository includes comprehensive documentation, test coverage, and a robust development workflow that ensures code quality and reliability.

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>