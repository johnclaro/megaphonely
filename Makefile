
test:
	make test-app
	make test-scheduler

test-app:
	cd megaphone/app && npm test

test-scheduler:
	cd megaphone/scheduler && npm test
