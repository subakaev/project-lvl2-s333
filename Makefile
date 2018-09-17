install:
	npm install

start:
	npm run babel-node -- src/bin/brain-games.js

build:
	rm -rf dist
	npm run build

publish:
	npm publish

lint:
	npm run eslint .