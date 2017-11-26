release:
	make build && make test && make deploy

build:
	cd megaphone/app && npm i
	cd megaphone/scheduler && npm i

test:
	cd megaphone/app && npm test
	cd megaphone/scheduler && npm test

deploy:
	# docker-compose build
	@eval $(shell aws ecr get-login --no-include-email --region eu-west-1)
	docker tag megaphone_app 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:app
	docker push 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:app
	docker tag megaphone_twitter 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:twitter
	docker push 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:twitter
	docker tag megaphone_facebook 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:facebook
	docker push 775451337188.dkr.ecr.eu-west-1.amazonaws.com/megaphone:facebook
