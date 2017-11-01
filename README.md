# OpenRoads Vietnam Analytics
[![Build Status](https://travis-ci.org/orma/openroads-vn-analytics.svg?branch=develop)](https://travis-ci.org/orma/openroads-vn-analytics)

## Development environment
To set up the development environment for this website, you'll need to install the following on your system:

- Node (v6.11) & Npm ([nvm](https://github.com/creationix/nvm) usage is advised)

> The versions mentioned are the ones used during development. It could work with newer ones.
  Run `nvm use` to activate the correct version.

After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install
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

![orma-vn-architecture](https://user-images.githubusercontent.com/4959135/28737988-0d3e5e1c-73bf-11e7-91c3-0c3e645b3566.jpg)

## Uploading data to the platform

### Uploading RoadLabPro data

Follow the instructions in the `orma/roadlabpro-clean` repository, to process your directory of raw RoadLabPro files into standardized, cleaned shapefiles and GeoJSON.

Once the RLP data have gone through this cleaning process, use the `ogr2osm` utility in the `orma/openroads-data` repository to generate an OSM changeset, and then submit that changeset to the ORMA–VN database; this entails uploading the geometry of these roads, and their attached summary properties:

```bash
python ../openroads-data/bin/ogr2osm/ogr2osm.py data/output/OutputLines_n.geojson --add-user="openroads" --create-changeset
# You'll need to update the changeset ID, to a number that hasn't been used yet
curl -d @OutputLines_n.osm https://openroads-vn-api.herokuapp.com/upload/3
```

The point property data (ie, IRI), will be used for analytics and a separate OpenRoads map; upload the point file that came out of the RLP cleaning, to Amazon S3. Upload using the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html):

```bash
export AWS_ACCESS_KEY_ID=(get this value from Development Seed)
export AWS_SECRET_ACCESS_KEY=(get this value from Development Seed)
aws s3 cp \
	./data/output/OutputLines_n.geojson \
	"s3://openroads-vn-properties/points/points-$(date +"%y-%m-%dT%T").geojson"
```

In order to archive the raw RLP data that you just ingested, ZIP the directory of raw RLP data, run an AWS CLI command similar to this one:

```bash
aws s3 cp \
	./data/input/ThachThanhSamples.zip \
	s3://openroads-vn-properties/roadlabpro/ThachThanhSamples.zip
```

### Uploading RouteShoot data

A standard process for ingesting RouteShoot geometries and properties is forthcoming in the next phase of work.

### Uploading arbitrary road geometry data

Using the steps documented above for uploading (cleaned) RoadLabPro data, you can upload other road geometries. That is, take your arbitrary road geometry, create an OSM changeset of it, and upload the changeset to the API at `https://openroads-vn-api.herokuapp.com/upload/${your changeset number here}`.

Keep in mind that, per the VPRoMMS road ID specification, these should have ten-character road IDs. The ID value should be in the field `or_vpromms`. Without a VPRoMMS road ID, these geometries will not be matched with any of the point-property data.

### Uploading arbitrary road property data, as points

Similarly, you can upload point-property data, following steps like in the RoadLabPro point upload to Amazon S3.

Make sure your point data is in a GeoJSON format containing only `Point` features. Each feature's properties should include `time`, `or_vpromms`, and one or more of the key OpenRoads properties:

- `iri`
- `or_condition`
- `or_surface`
- `or_width`

Then, upload this GeoJSON file to the Amazon S3 bucket, using essentially the same command as above:

```bash
export AWS_ACCESS_KEY_ID=(get this value from Development Seed)
export AWS_SECRET_ACCESS_KEY=(get this value from Development Seed)
aws s3 cp \
	(my file to upload) \
	"s3://openroads-vn-properties/points/points-$(date +"%y-%m-%dT%T").geojson"
```

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
