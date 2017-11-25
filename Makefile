
test:
	make test-app
	make test-scheduler

test-app:
	cd megaphone/app && npm test

test-scheduler:
	echo 'Scheduler!'
