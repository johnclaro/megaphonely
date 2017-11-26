release:
	make build && make test

build:
	cd megaphone/app && npm i
	cd megaphone/scheduler && npm i

test:
	cd megaphone/app && npm test
	cd megaphone/scheduler && npm test
