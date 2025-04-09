#!/bin/bash
# wait-for-it.sh script to wait until a service is available

TIMEOUT=120
HOST=$1
PORT=$2
shift 2

for i in $(seq $TIMEOUT); do
  echo "Waiting for $HOST:$PORT... $i/$TIMEOUT"
  nc -z $HOST $PORT && echo "$HOST:$PORT is available" && break
  sleep 1
done

if [ $i -eq $TIMEOUT ]; then
  echo "Timeout reached, $HOST:$PORT is not available"
  exit 1
fi

exec "$@"

