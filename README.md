AWS-SecretManager

1. First you must have RDS instance and EC2 instance running as application server
- Create SecretManager
- Apply it with RDS Instance

2. Create IAM user or role and attached with EC2 instance (Application)
- Install Dependencies 
- sudo yum update
- dnf module install nodejs:18/common
- npm install aws-sdk
- npm install @aws-sdk/client-secrets-manager pg
- npm init -y

3. Then create nodejs file to test
