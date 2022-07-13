export:
	docker-compose up mongo -d
	docker-compose exec mongo mongoexport --uri="mongodb://root:root@mongo:27017/calendly?authSource=admin&readPreference=primary" --collection=users --out=users.json
	docker-compose exec mongo mongoexport --uri="mongodb://root:root@mongo:27017/calendly?authSource=admin&readPreference=primary" --collection=schedules --out=schedules.json
	rm -rf dataset/users.json
	rm -rf dataset/schedules.json
	docker-compose cp mongo:./users.json ./dataset/users.json
	docker-compose cp mongo:./schedules.json ./dataset/schedules.json

import:
	docker-compose up mongo -d
	docker-compose cp ./dataset/users.json mongo:./users.json
	docker-compose exec mongo mongoimport --uri="mongodb://root:root@mongo:27017/calendly?authSource=admin&readPreference=primary" --collection=users --drop --file=users.json
	docker-compose cp ./dataset/schedules.json mongo:./schedules.json
	docker-compose exec mongo mongoimport --uri="mongodb://root:root@mongo:27017/calendly?authSource=admin&readPreference=primary" --collection=schedules --drop --file=schedules.json
