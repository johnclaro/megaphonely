# megaphone-web

Website platform

# Usage
```
docker-compose up
```

# Makefile
```
make release
```

# Infrastructure
- Add Custom TCP rule for Port 6379 to Anywhere on SG for ElasticCache
- Attach policy **AmazonEC2ContainerRegistryReadOnly** to **aws-elasticbeanstalk-ec2-role**
