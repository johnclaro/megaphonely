release:
	make build
	make test
	make push
	make deploy

build:
	cd megaphone/app && npm i
	cd megaphone/scheduler && npm i

test:
	cd megaphone/app && npm test
	cd megaphone/scheduler && npm test

push:
	docker-compose build
	@eval $(shell aws ecr get-login --no-include-email --region eu-west-1)
	docker tag megaphone/app 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:app
	docker push 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:app
	docker tag megaphone/scheduler 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:scheduler
	docker push 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:scheduler

deploy:
	cd megaphone/app && eb deploy
