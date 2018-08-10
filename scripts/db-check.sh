#!/bin/bash
dbpath='./mongodb/data'
dblogpath='./mongodb/logs/mongod.log'
dbhost='0.0.0.0'
port=27017

# 01 make dbpath
if [ ! -d "$dbpath" ]
then
  mkdir "$dbpath" -p
fi

echo "--------- checking mongodb status ---------"
# 02 start mongodb
echo "check mongodb $port"
grep_port=`netstat -tlpn | grep "\b$port\b"`

if [ -n "$grep_port" ]
then
  echo "----- $grep_port -----"
  echo "mongodb already started in port:$port"
else
  echo "trying to start mongodb service."

  mongod \
  --dbpath="$dbpath" \
  --logpath="$dblogpath" \
  --bind_ip="$dbhost" --logappend --quiet --journal --fork
fi

# 03 dbinit
mongo ./scripts/db-init\(mongo-shell\).js
