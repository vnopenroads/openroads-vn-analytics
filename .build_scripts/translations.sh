#!/usr/bin/env bash

# create then source a virtual environemnt

echo "---\nSetting up python environment for transifex client\n---\n"

pip install virtualenv
virtualenv ~/env
source ~/env/bin/activate

# download transifex client
echo "\n---\nDownloading Transifex Client\n---\n"

pip install transifex-client

# generate .transifexrc
echo "\n---\nLinking repo with Transifex Project\n---\n"

sudo echo $'[https://www.transifex.com]\nhostname = https://www.transifex.com\nusername = '"$TRANSIFEX_USER"$'\npassword = '"$TRANSIFEX_PASSWORD"$'\ntoken = \n' > ~/.transifexrc

echo "repo linked to project!"

# push any new changes from translation source
echo "\n---\nPushing any changes to translation source file\n---\n"

tx push -s

# map most recent translations from transifex to translation files
echo "\n---\nPulling any new translations from into project\n---\n"

tx pull

