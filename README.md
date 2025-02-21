<p align="center">
  <a href="https://www.jeevaverse.com">
    <img alt="Jeevaverse logo" src="https://your-logo-url-here.svg">
  </a>
</p>
<h1 align="center">
  Jeevaverse
</h1>

<h4 align="center">
  <a href="https://docs.jeevaverse.com">Documentation</a> |
  <a href="https://www.jeevaverse.com">Website</a>
</h4>

<p align="center">
  Your premier marketplace for exotic pets
</p>
<p align="center">
  <a href="https://github.com/jeevaverse/jeevaverse/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/jeevaverse">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=jeevaverse">
    <img src="https://img.shields.io/twitter/follow/jeevaverse.svg?label=Follow%20@jeevaverse" alt="Follow @jeevaverse" />
  </a>
</p>

## Getting Started

Visit our [Documentation](https://docs.jeevaverse.com) to learn how to set up your exotic pet store.

## What is Jeevaverse

Jeevaverse is a comprehensive ecommerce platform designed specifically for exotic pet sellers. Our platform provides all the tools you need to manage inventory, process orders, and deliver exceptional customer experiences.

With Jeevaverse, you can:
- Create detailed listings for your exotic pets with custom attributes
- Manage complex inventory systems including breeding status and medical history
- Process payments and handle shipping logistics for live animals
- Comply with regional regulations for exotic pet sales
- Analyze sales data with comprehensive reporting tools

## Deployment Instructions

Follow these steps to deploy your Jeevaverse site:

1. Run the build command:

```
npx medusa build
```

This command creates a standalone build of the Jeevaverse application that doesn't rely on source TypeScript files and can be reliably copied to a production server.

2. The build output will be in the `.medusa` directory, with the admin dashboard build in the `.medusa/admin` directory.

3. To start the built Jeevaverse application:
   * Change to the `.medusa/server` directory and install dependencies:

```
cd .medusa/server && npm install
```

   * Copy the `.env` file from the root project directory to `.env.production` in the `.medusa/server` directory (for local running only).
   * Set the `NODE_ENV` environment variable to `production`.
   * Start the Jeevaverse application from the `.medusa/server` directory:

```
npm run start
```

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/jeevaverse/jeevaverse/discussions), where you can ask for support, discuss features, and share ideas.

Join our [Discord server](https://discord.com/invite/jeevaverse) to meet other exotic pet enthusiasts and sellers.

## Other channels

- [GitHub Issues](https://github.com/jeevaverse/jeevaverse/issues)
- [Twitter](https://twitter.com/jeevaverse)
- [LinkedIn](https://www.linkedin.com/company/jeevaverse)
- [Jeevaverse Blog](https://jeevaverse.com/blog/)