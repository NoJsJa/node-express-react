#!/bin/bash
dbpath="$FrontEndDir/mongodb/data"
echo ">>> going to shutdown mongodb ... "
mongod --shutdown --dbpath "$dbpath"
