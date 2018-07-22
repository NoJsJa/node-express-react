#!/bin/bash
dbpath="mongodb/data"
echo "--------- going to shutdown mongodb ---------"
mongod --shutdown --dbpath "$dbpath"
