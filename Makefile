-include .env.test
export

release:
	make install
	make test
	make build
	make push
	make environment
	make deploy

install:
	cd megaphone/app && npm i && npm i --only=dev
	cd megaphone/pub && npm i && npm i --only=dev

test:
	cd megaphone/app && npm test
	cd megaphone/pub && npm test

build:
	cd megaphone/app && docker build -t megaphone/app .
	cd megaphone/pub && docker build -t megaphone/pub .

push:
	@eval $(shell aws ecr get-login --no-include-email --region eu-west-1)
	docker tag megaphone/app ${ECR_URI}:app
	docker push ${ECR_URI}:app
	docker tag megaphone/pub ${ECR_URI}:pub
	docker push ${ECR_URI}:pub

environment:
	eb setenv $(shell cat .env.prod)

deploy:
	eb deploy --debug
