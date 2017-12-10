# pub

# Setup ECS
```bash
ecs-cli configure --region=eu-west-1 --cfn-stack-name=megaphone-ecs --cluster=pub
ecs-cli up --instance-type=t2.micro --capability-iam --vpc=vpc-e1f89d84 --subnets=subnet-a97807de
```
