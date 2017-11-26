# Megaphone [![CircleCI](https://circleci.com/gh/jkrclaro/megaphone/tree/master.svg?style=svg&circle-token=08d741d0a59a7704053acdfd6be5fdb6591784c5)](https://circleci.com/gh/jkrclaro/megaphone/tree/master)
Social media management tool

# Usage
```
docker-compose up
```

# Makefile
Export ECR_URI if you want to push images to AWS ECR
```
export ECR_URI=123456789.dkr.ecr.eu-west-1.amazonaws.com
make push
```

```
make release
```
