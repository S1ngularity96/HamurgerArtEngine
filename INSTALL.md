# Installation Guide

## Introduction

This guide is intended to help you set up the Image-Minter and Molly-Preview software.

Requirements:

- Windows or Linux/Mac
- On Windows WSL2 and Ubuntu 20 [Microsoft Guide](https://docs.microsoft.com/en-US/windows/wsl/install), [Ubuntu](https://www.microsoft.com/de-de/p/ubuntu/9nblggh4msv6#activetab=pivot:overviewtab)
- Docker & Docker Compose [Download Link](https://www.docker.com/products/docker-desktop)
- git, nodejs

## Clone Projects

Type the following commands in the terminal of your choice:

```bash
# Clone Frontend
git clone https://github.com/WickedMolley/MollyPreview.git
# Clone Backend
git clone https://github.com/WickedMolley/ImageMinter.git
```

Once downloaded run `npm install` or `yarn install` in both directories.

## Setup Database

Install Docker & Docker Compose before continue:

```bash
# Go to the directory of ImageMinter and turn the mongodb database on
docker-compose up -d
```

## Configure Host

You might need to adjust the IP address for the correct connection settings. Use `ifconfig` to find out the correct address of your host machine and enter it in the `.env` file in the MollyPreview folder. Replace the address from the line `VUE_APP_HOST`.

# Start Server and Frontend

```bash
# Type in both directories ImageMinter and MollyPreview following command:
npm run serve
```
