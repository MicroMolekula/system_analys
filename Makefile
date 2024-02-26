build:
	docker-compose -f docker/docker-compose.yml build $(c)
up:
	docker-compose -f docker/docker-compose.yml up $(c)
down:
	docker-compose -f docker/docker-compose.yml down $(c)
stop:
	docker-compose -f docker/docker-compose.yml stop $(c)
ps:
	docker-compose -f docker/docker-compose.yml ps $(c)
php-shell:
	docker-compose -f docker/docker-compose.yml exec -it php bash $(c)
nginx-shell:
	docker-compose -f docker/docker-compose.yml exec -it nginx bash $(c)