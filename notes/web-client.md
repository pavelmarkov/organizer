# 2025-06-22

## Frondend library

`primeng` library was chosen instead of `ag grid`
`ag grid` has enterprise fearures such as tree tables and data grouping. These features, however, are open source and free to use in `primeng` library

`Angular` version was downgraded to 19.2.14 to be compatible with the latest `primeng` release

# 2025-08-12

## Folder structure scanner

According to [this article](https://web.dev/articles/read-files) browsers don't allow you to scan a full directory structure as it will introduce a vulnarability issue

There are two options remaining:

- import directory structure from file
- use different client (mobile app or Electron.js)
