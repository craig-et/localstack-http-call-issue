
.PHONY: test
test:
	npm install
	@make up
	npm run deploy
	npm test
	@make down

.PHONY: up
up:
	docker-compose -p bugtest up --detach

.PHONY: down
down:
	docker-compose -p bugtest down
