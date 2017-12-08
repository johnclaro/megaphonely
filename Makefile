-include .env.test
export

release:
	make test 
	make build
	make push
	make deploy

test:
	cd megaphone/app && npm i && npm i --only=dev && npm test
	cd megaphone/publisher && npm i && npm i --only=dev && npm test

build:
	cd megaphone/app && docker build -t megaphone/app .
	cd megaphone/publisher && docker build -t megaphone/publisher .

push:
	@eval $(shell aws ecr get-login --no-include-email --region eu-west-1)
	docker tag megaphone/app ${ECR_URI}:app
	docker push ${ECR_URI}:app
	docker tag megaphone/publisher ${ECR_URI}:publisher
	docker push ${ECR_URI}:publisher

deploy:
	eb setenv $(shell cat .env.prod)
	eb deploy --debug
