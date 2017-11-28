release:
	make build
	make push
	make deploy

test:
	cd megaphone/app && npm i && npm test
	cd megaphone/scheduler && npm i && npm test

push:
	cd megaphone/app && docker build -t megaphone/app .
	cd megaphone/scheduler && docker build -t megaphone/scheduler .
	@eval $(shell aws ecr get-login --no-include-email --region eu-west-1)
	docker tag megaphone/app ${ECR_URI}:app
	docker push ${ECR_URI}:app
	docker tag megaphone/scheduler ${ECR_URI}:scheduler
	docker push ${ECR_URI}:scheduler

deploy:
	cd megaphone/app && rm -rf node_modules && eb deploy --debug
