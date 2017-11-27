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
	docker tag megaphone/app ${ECR_URI}:app
	docker push ${ECR_URI}:app
	docker tag megaphone/scheduler ${ECR_URI}:scheduler
	docker push ${ECR_URI}:scheduler

deploy:
	cd megaphone/app && eb deploy
