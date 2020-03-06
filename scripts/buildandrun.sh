#!/bin/bash

#dorun after docker build -t <username>/lkapi .

docker build -t michaelpeterswa/PlantWateringFrontend .

docker run -d --name PlantWateringFrontend -p 6975:6975 --restart always michaelpeterswa/PlantWateringFrontend
echo "running michaelpeterswa/PlantWateringFrontend docker image on port 6975"
echo "check \"docker logs PlantWateringFrontend\" for more info" 