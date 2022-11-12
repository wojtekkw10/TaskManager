FROM python:3.8-slim-buster
RUN mkdir /project
COPY . /project
WORKDIR /project
RUN pip install -r requirements
CMD python3 -m http.server 80
EXPOSE 80

