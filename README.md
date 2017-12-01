# OpenRoads Vietnam Analytics
[![Build Status](https://travis-ci.org/orma/openroads-vn-analytics.svg?branch=develop)](https://travis-ci.org/orma/openroads-vn-analytics)

## Development environment
To set up the development environment for this website, you'll need to install the following on your system:

- Node (v6.11) & Npm ([nvm](https://github.com/creationix/nvm) usage is advised)
- [yarn](https://yarnpkg.com/en/docs/install)

> The versions mentioned are the ones used during development. It could work with newer ones.
  Run `nvm use` to activate the correct version.

After these basic requirements are met, run the following commands in the website's folder:
```
$ yarn install
```

### Getting started

```
$ npm run serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

### Other commands
Compile the sass files, javascript... Use this instead of `npm run serve` if you don't want to watch.
```
$ npm run build
```

## Architecture

_To be updated_

### Internationalization


##### Managing translations with transifex

Vietnamese - English translations are managed with transifex's `tx` cli and the `app/assets/locales/source/en.json` and `app/assets/locales/vn.json` files

To add new words to translate:

1. Add a new key/val pair in the source en.json file where key/val are equal and save the file.

```
...
'Roads': 'Roads',
...
```

2. `Pull` then push `Push` the update en.json file to transifex using the tx cli


```
$ tx pull && tx push -s
```

the reason to pull then push is so that translations on transifex aren't overwritten (the behavior of tx push) 

3. pull the new changes using tx pull once translations are complete on transifex


***note*** that step 2 is built into the current circleci build, so you should not have to follow these steps explicitly so long as you push changes to github

##### Setting up transifex

to install tx run `pip install transifex-client`

then add a .transifexrc in the root of the repo following the below configuration

```
[https://www.transifex.com]
hostname = https://www.transifex.com
password = your.password
token =
username = your.username

```

***note*** don't quote values in the .transifexrc

##### Managing translators && approving translations on transifex's website


in addition to adding and pulling new translations into the site, so too will translations need to be approved using the [transifex web editor](https://docs.transifex.com/translation/translating-with-the-web-editor). Documentation on how to do so is [here](https://docs.transifex.com/translation/reviewing-strings).

Also, if a manager needs to add new translators, [here](https://docs.transifex.com/translation/translating-with-the-web-editor) is the documentation, and if a new translator needs guidance for translating, [here](https://docs.transifex.com/translation/translating-with-the-web-editor) is the documentation

##### Adding new questions to FAQ
The site FAQ are defined in the file [`/app/assets/scripts/views/faq.js`](https://github.com/orma/openroads-vn-analytics/blob/develop/app/assets/scripts/views/faq.js).  To edit:

* sign in to github
* follow a link to the [faq file](https://github.com/orma/openroads-vn-analytics/blob/develop/app/assets/scripts/views/faq.js)
* click on the **edit** pencil button on the top right of the file
* copy and paste the following text below the list of existing questions, inserting the question and answer in english and vietnamese

```javascript
{
  language === 'en' ?
    <section className="question">
      <h3 className='inpage__title'>ADD ENGLISH QUESTION HERE</h3>
      <p>ADD ENGLISH ANSWER HERE</p>
    </section> :
    <section className="question">
      <h3 className='inpage__title'>ADD VIETNAMESE QUESTION HERE</h3>
      <p>ADD VIETNAMESE ANSWER HERE</p>
    </section>
}
```

* click **Commit changes** at the bottom of the page
* email Development Seed to deploy the site
