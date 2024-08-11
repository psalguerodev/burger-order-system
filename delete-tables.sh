#!/bin/bash

# Variables
REGION="us-east-1"  # Cambia esto según tu región

# Eliminar la tabla ErrorLogTable
aws dynamodb delete-table \
    --region "$REGION" \
    --table-name ErrorLogTable \
    --output table \
    --query 'TableDescription.TableName' \
    --no-cli-pager

# Eliminar la tabla InventoryTable
aws dynamodb delete-table \
    --region "$REGION" \
    --table-name InventoryTable \
    --output table \
    --query 'TableDescription.TableName' \
    --no-cli-pager

# Eliminar la tabla ShippingTable
aws dynamodb delete-table \
    --region "$REGION" \
    --table-name ShippingTable \
    --output table \
    --query 'TableDescription.TableName' \
    --no-cli-pager

echo "Tables deleted."
