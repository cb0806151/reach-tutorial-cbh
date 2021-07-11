REACH = ./reach

.PHONY: clean
clean:
	rm -rf build/*.main.mjs

build/%.main.mjs: %.rsh
	$(REACH) compile $^

.PHONY: build
build: build/index.main.mjs
	docker build -f Dockerfile --tag=reachsh/reach-app-scaffold:latest .

.PHONY: run
run:
	$(REACH) run index

.PHONY: run-target
run-target: build
	docker-compose -f "docker-compose.yml" run --rm reach-app-scaffold-$${REACH_CONNECTOR_MODE} $(ARGS)

.PHONY: down
down:
	docker-compose -f "docker-compose.yml" down --remove-orphans

docker-compose.CFX.yml: docker-compose.yml
	sed -e '34s/ &default-app//' -e '65s/:/: \&default-app/' $^ > $@

.PHONY: run-live
run-live:
	docker-compose run --rm reach-app-scaffold-ETH-live

.PHONY: run-alice
run-alice: 
	docker-compose run --rm alice