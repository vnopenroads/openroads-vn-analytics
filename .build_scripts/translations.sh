#!/usr/bin/env bash

echo ""
echo "---Setup Virtual Environment for Transifex Client"
apt-get update && \
	apt-get install -y \
		python-setuptools \
		python-dev \
		python-pip \
		build-essential

# download transifex client
echo ""
echo "---Downloading Transifex Client---"

pip install transifex-client==0.13.4

# generate .transifexrc
echo ""
echo "---Linking repo with Transifex Project---"

echo $'[https://www.transifex.com]\nhostname = https://www.transifex.com\nusername = '"$TRANSIFEX_USER"$'\npassword = '"$TRANSIFEX_PASSWORD"$'\ntoken = \n' > ~/.transifexrc
echo ""
echo "repo linked to project!"

# map most recent translations from transifex to translation files
echo ""
echo "---Pulling any new translations from project into repo---"

tx pull

# push any new changes from translation source
echo ""
echo "---Pushing any changes to translation from source file---"

tx push -s


