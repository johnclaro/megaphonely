
test:
	make test-app
	make test-scheduler

test-app:
	cd megaphone/app && npm i && npm test

test-scheduler:
	cd megaphone/scheduler && npm i && npm test
