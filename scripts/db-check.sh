#!/bin/bash
dbpath='$FrontEndDir/mongodb/data'
dblogpath='$FrontEndDir/mongodb/logs/mongod.log'
dbhost='0.0.0.0'
port=27017

# 01 make dbpath
if [ ! -d "$dbpath" ]
then
  mkdir "$dbpath" -p
fi

# 02 start mongodb
echo ">>> now check mongodb $port"
grep_port=`netstat -tlpn | grep "\b$port\b"`

if [ -n "$grep_port" ]
then
  echo "   mongodb already started in port:$port"
else
  echo "   trying to start mongodb service."

  mongod \
  --dbpath="$dbpath" \
  --logpath="$dblogpath" \
  --bind_ip="$dbhost" --logappend --quiet --journal --fork
fi

# 03 dbinit
mongo $FrontEndDir/scripts/db-init\(mongo-shell\).js
