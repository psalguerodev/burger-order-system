sam deploy \
    --template-file template.yaml \
    --stack-name burger-order-stack \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --region us-east-1 \
    --resolve-s3