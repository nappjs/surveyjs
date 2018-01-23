test:
	docker run --rm -p 8080:80 -v `pwd`/static:/usr/share/nginx/html nginx:alpine

build:
	docker build -t jakubknejzlik/surveyjs .