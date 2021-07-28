# OpenRoads Vietnam Analytics

This repo contains the static assets that constitute the OpenRoads Vietnam website. This repository is also where Development Seed stores all GitHub tickets and planning for the ORMA–VN project. The other repos in this project include:

- [API](https://github.com/vnopenroads/openroads-vn-api/)
- [various workers](https://github.com/vnopenroads/openroads-vn-tiler)
- [iD editor](https://github.com/vnopenroads/openroads-vn-iD)
- [admin boundary generation](https://github.com/vnopenroads/openroads-vn-boundaries)
- [raster tile generation](https://github.com/vnopenroads/openroads-vn-tilemap)

ORMA–VN is a deployment of the ORMA platform, originally built by Development Seed and the World Bank for use in the Philippines; several more repos may be found in the `vnopenroads` GitHub organization, pertaining to that or other deployments.

## Platform functionality

View and edit a tabular inventory of all roads, their lengths and properties, and the presence or absence of field data.

![assets-page](https://user-images.githubusercontent.com/371666/48693935-f044dc80-ec00-11e8-83c3-ae6c6d03464a.gif)

Visually explore the road network, leveraging field data to color-code by road condition or other properties.

![explore-page](https://user-images.githubusercontent.com/371666/48694453-5b42e300-ec02-11e8-9499-5d15322ac81b.gif)

Make manual corrections to the road paths.

![](https://user-images.githubusercontent.com/4959135/34585247-f372799c-f16c-11e7-8429-8b0b29cd8cd1.gif)

Discover algorithmically-detected issues with the road network, and implement quick fixes.

![tasks-page](https://user-images.githubusercontent.com/371666/48696032-c8f10e00-ec06-11e8-90d3-df8255d57054.gif)

View the platform in either English or Vietnamese.

![](https://user-images.githubusercontent.com/4959135/34584981-e81cef6a-f16b-11e7-8cb5-1f3cbf94d515.gif)

## Running locally

### Environment setup

To set up the development environment for this website, you'll need to install the following on your system:

- Node, see version in `.nvmrc` file
- [yarn](https://yarnpkg.com/en/docs/install)

After these basic requirements are met, install dependencies by running `yarn install`.

By default, the local deployment will use the production API. If you run a local instance of the API (using repo `orma/openroads-vn-api`), then you can change the `api` value in this repo's configuration files (`app/assets/scripts/config/*`).

### Getting started

`yarn run serve` compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`. The system will watch files and execute tasks whenever one of them changes. The site will automatically refresh since it is bundled with livereload.

### Building for deployment

Run `yarn run build` to compile all site resources into a `dist` folder. This folder can be deployed on a remote host, and act as the full production website.

## Continuous integration

A CI server takes care of deployment to production; any merge to the `master` branch will deploy.

## Architecture

![](https://user-images.githubusercontent.com/4959135/33675125-8936e5da-da7f-11e7-8853-1f3552f1c2b5.png)

(This architecture diagram is also available [on Google Drawings](https://docs.google.com/drawings/d/1wuHYpjMYsshBaVNj6mykR42ln7ApLrY-OM6jsHiuZA8).)

## Website user guide

A bi-lingual user guide is available for the front-end of the ORMA platform; for now, please request it from Duc Cong Phan <dphan2@worldbank.org>. In the future it will be available within this repo.

## Processes

### Internationalization

#### Managing translations with transifex

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

#### Setting up transifex

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

#### Managing translators && approving translations on transifex's website


in addition to adding and pulling new translations into the site, so too will translations need to be approved using the [transifex web editor](https://docs.transifex.com/translation/translating-with-the-web-editor). Documentation on how to do so is [here](https://docs.transifex.com/translation/reviewing-strings).

Also, if a manager needs to add new translators, [here](https://docs.transifex.com/translation/translating-with-the-web-editor) is the documentation, and if a new translator needs guidance for translating, [here](https://docs.transifex.com/translation/translating-with-the-web-editor) is the documentation

### Adding new questions to FAQ
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
