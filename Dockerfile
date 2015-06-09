FROM ubuntu:14.04
MAINTAINER TheVisionTeam "https://github.com/TheVisionTeam"

RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get -y install gcc g++ make ruby-1.9.3 automake autoconf mongodb redis-server openssh-server curl wget nginx git-core
WORKDIR /tmp
RUN wget http://nodejs.org/dist/v0.12.4/node-v0.12.4.tar.gz
RUN tar -zxvf node-v0.12.4.tar.gz
WORKDIR /tmp/node-v0.12.4
RUN ["./configure"]
RUN make -j4
RUN make install -j4
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


CMD ["node /var/data/vision/bin/www"]


