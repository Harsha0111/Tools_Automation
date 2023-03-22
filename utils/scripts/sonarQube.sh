sudo apt update
sudo apt install openjdk-11-jdk

sudo useradd -d /opt/sonaruser -s /bin/bash -r sonaruser
echo sonaruser:password | sudo chpasswd

curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/apt.postgresql.org.gpg >/dev/null
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl status postgresql

sudo -u postgres psql -c "CREATE ROLE sonaruser WITH LOGIN ENCRYPTED PASSWORD 'password';"
sudo -u postgres psql -c "CREATE DATABASE sonarqube;"

wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-9.6.1.59531.zip
sudo apt-get install zip unzip -y
unzip -q sonarqube-9.6.1.59531.zip
sudo mv sonarqube-9.6.1.59531 /opt/sonarqube
rm sonarqube-9.6.1.59531.zip
sudo adduser --system --no-create-home --group --disabled-login sonarqube
sudo chown sonarqube:sonarqube /opt/sonarqube -R

sudo sed -i 's/#sonar.jdbc.username=/sonar.jdbc.username=sonaruser/' /opt/sonarqube/conf/sonar.properties
sudo sed -i 's/#sonar.jdbc.password=/sonar.jdbc.passwordpassword/' /opt/sonarqube/conf/sonar.properties
sudo sed -i 's/#sonar.jdbc.url/sonar.jdbc.url/' /opt/sonarqube/conf/sonar.properties

sudo sed -i 's/\/\/localhost\/sonarqube?currentSchema=my_schema/\/\/localhost:5432\/sonarqube/' /opt/sonarqube/conf/sonar.properties
sudo sed -i 's/#sonar.web.javaAdditionalOpts=/sonar.web.javaAdditionalOpts=-server/' /opt/sonarqube/conf/sonar.properties
sudo sed -i 's/#sonar.web.host=0.0.0.0/sonar.web.host=127.0.0.1/' /opt/sonarqube/conf/sonar.properties

sudo sh -c 'echo "vm.max_map_count=524288" >> /etc/sysctl.conf'
sudo sh -c 'echo "fs.file-max=131072" >> /etc/sysctl.conf'

sudo sh -c 'cat > /etc/security/limits.d/99-sonarqube.conf << EOF
sonarqube   -   nofile   131072

sonarqube   -   nproc    8192
EOF'

sudo sh -c 'cat > /etc/systemd/system/sonarqube.service << EOF
[Unit]

Description=SonarQube service

After=syslog.target network.target



[Service]

Type=forking



ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start

ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop



User=sonarqube

Group=sonarqube

PermissionsStartOnly=true

Restart=always



StandardOutput=syslog

LimitNOFILE=131072

LimitNPROC=8192

TimeoutStartSec=5

SuccessExitStatus=143



[Install]

WantedBy=multi-user.target
EOF'

