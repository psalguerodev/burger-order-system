#!/bin/bash

# Variables
REGION="us-east-1"  # Cambia esto según tu región

# Crear la tabla ErrorLogTable
aws dynamodb create-table \
    --region "$REGION" \
    --table-name ErrorLogTable \
    --attribute-definitions \
        AttributeName=OrderId,AttributeType=S \
    --key-schema \
        AttributeName=OrderId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --output table \
    --query 'TableDescription.TableName' \
    --no-cli-pager

# Crear la tabla InventoryTable
aws dynamodb create-table \
    --region "$REGION" \
    --table-name InventoryTable \
    --attribute-definitions \
        AttributeName=ItemId,AttributeType=S \
    --key-schema \
        AttributeName=ItemId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --output table \
    --query 'TableDescription.TableName' \
    --no-cli-pager

# Crear la tabla ShippingTable
aws dynamodb create-table \
    --region "$REGION" \
    --table-name ShippingTable \
    --attribute-definitions \
        AttributeName=OrderId,AttributeType=S \
    --key-schema \
        AttributeName=OrderId,KeyType=HASH \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --output table \
    --query 'TableDescription.TableName' \
    --no-cli-pager

# Añadir datos iniciales a InventoryTable
aws dynamodb put-item \
    --region "$REGION" \
    --table-name InventoryTable \
    --item \
        '{"ItemId": {"S": "item1"}, "Quantity": {"N": "100"}, "Price": {"N": "5.00"}}'

aws dynamodb put-item \
    --region "$REGION" \
    --table-name InventoryTable \
    --item \
        '{"ItemId": {"S": "item2"}, "Quantity": {"N": "50"}, "Price": {"N": "7.50"}}'

aws dynamodb put-item \
    --region "$REGION" \
    --table-name InventoryTable \
    --item \
        '{"ItemId": {"S": "item3"}, "Quantity": {"N": "200"}, "Price": {"N": "3.00"}}'

echo "Tables created and initial data added to InventoryTable."
