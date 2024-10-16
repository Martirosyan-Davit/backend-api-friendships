# Simple friendships App

In this simple application you can see a simple follower-following scheme you can sign in, send, accept or decline friend requests

## Getting started

```bash

# 1. Enter your newly-cloned folder.
cd backend-api-friendships 

# 2. Create Environment variables file.
cp .env.example .env

# 3. Install dependencies. (Make sure yarn is installed: https://yarnpkg.com/lang/en/docs/install)
yarn
```

### Development
```bash
# 4. Run development server and open http://localhost:3000
yarn start:dev

# 5. Read the documentation linked below for "Setup and development".
```

### Build

To build the App, run

```bash
yarn build:prod
```

And you will see the generated file in `dist` that ready to be served.

## Features

<dl>
  <!-- <dt><b>Quick scaffolding</b></dt>
  <dd>Create modules, services, controller - right from the CLI!</dd> -->

  <dt><b>JWT Authentication</b></dt>
  <dd>Installed and configured JWT authentication.</dd>

  <dt><b>Next generation Typescript</b></dt>
  <dd>Always up to date typescript version.</dd>

  <dt><b>Industry-standard routing</b></dt>
  <dd>It's natural to want to add pages (e.g. /about`) to your application, and routing makes this possible.</dd>

  <dt><b>Environment Configuration</b></dt>
  <dd>development, staging and production environment configurations</dd>

  <dt><b>Swagger Api Documentation</b></dt>
  <dd>Already integrated API documentation. To see all available endpoints visit http://localhost:3000/documentation</dd>

  <dt><b>Linter</b></dt>
  <dd>eslint + prettier = ❤️</dd>
</dl>

### Redis Installation
Redis is used to store sessions in the code. If you already have Redis installed, please do not forget to configure it. If Redis is not installed, you can install it using the following links:

For Linux:   [https://redis.io/docs/install/install-stack/linux/]
For macOS:   [https://redis.io/docs/install/install-stack/mac-os/]
For Windows: [https://redis.io/docs/install/install-stack/windows/]