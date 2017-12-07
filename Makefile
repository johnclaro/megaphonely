-include .env.test
export

release:
	make test 
	make build
	make push
	make deploy

test:
	cd megaphone/app && npm i && npm i --only=dev && npm test
	cd megaphone/scheduler && npm i && npm i --only=dev && npm test

build:
	cd megaphone/app && docker build -t megaphone/app .
	cd megaphone/scheduler && docker build -t megaphone/scheduler .

push:
	@eval $(shell aws ecr get-login --no-include-email --region eu-west-1)
	docker tag megaphone/app ${ECR_URI}:app
	docker push ${ECR_URI}:app
	docker tag megaphone/scheduler ${ECR_URI}:scheduler
	docker push ${ECR_URI}:scheduler

deploy:
	eb setenv $(shell cat .env.prod)
	eb deploy --debug
