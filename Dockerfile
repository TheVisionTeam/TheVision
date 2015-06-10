FROM ubuntu:14.04
MAINTAINER TheVisionTeam "https://github.com/TheVisionTeam"

RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get -y install gcc g++ make ruby automake autoconf mongodb redis-server openssh-server curl wget nginx git-core
WORKDIR /var
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y nodejs build-essential
EXPOSE 22
EXPOSE 80
EXPOSE 3000
EXPOSE 3001

RUN mkdir -pv /var/data
WORKDIR /var/data
RUN mkdir -pv log
ADD ./ /var/data/vision
ADD nginx.conf /etc/nginx/conf.d/vision.conf
WORKDIR /var/data/vision
RUN gem install bundler
RUN bundle install -V
RUN npm install --verbose
RUN service nginx restart
RUN chmod 777 -R bin/