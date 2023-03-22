sudo useradd -d /opt/nexus -s /bin/bash -r nexus
echo nexus:password | sudo chpasswd
ulimit -n 65536
sudo sh -c 'echo "nexus - nofile 65536" >> /etc/security/limits.d/nexus.conf'
wget https://download.sonatype.com/nexus/3/nexus-3.41.1-01-unix.tar.gz
tar xzf nexus-3.41.1-01-unix.tar.gz
rm nexus-3.41.1-01-unix.tar.gz

sudo mv nexus-3.41.1-01 /opt/nexus
sudo mv sonatype-work /opt/
sudo chown -R nexus:nexus /opt/nexus /opt/sonatype-work
sudo sed -i 's/#//' /opt/nexus/bin/nexus.rc
sudo sed -i 's/""/"nexus"/' /opt/nexus/bin/nexus.rc

sudo mv /opt/nexus/bin/nexus.vmoptions /opt/nexus/bin/nexus.vmoptions_$(date +"%d%b%Y")

sudo sh -c 'cat > /opt/nexus/bin/nexus.vmoptions << EOF
-Xms1024m
-Xmx1024m
-XX:MaxDirectMemorySize=1024m

-XX:LogFile=./sonatype-work/nexus3/log/jvm.log
-XX:-OmitStackTraceInFastThrow
-Djava.net.preferIPv4Stack=true
-Dkaraf.home=.
-Dkaraf.base=.
-Dkaraf.etc=etc/karaf
-Djava.util.logging.config.file=/etc/karaf/java.util.logging.properties
-Dkaraf.data=./sonatype-work/nexus3
-Dkaraf.log=./sonatype-work/nexus3/log
-Djava.io.tmpdir=./sonatype-work/nexus3/tmp
EOF'

sudo sh -c 'cat > /etc/systemd/system/nexus.service << EOF
[Unit]
Description=nexus service
After=network.target

[Service]
Type=forking
LimitNOFILE=65536
ExecStart=/opt/nexus/bin/nexus start
ExecStop=/opt/nexus/bin/nexus stop
User=nexus
Restart=on-abort

[Install]
WantedBy=multi-user.target
EOF'

sudo sed -i 's/0.0.0.0/127.0.0.1/' /opt/nexus/nexus-3.41.1-01/etc/nexus-default.properties

sudo systemctl stop nexus.service
sudo systemctl daemon-reload
sudo systemctl start nexus.service
sudo systemctl enable nexus.service
sudo systemctl status nexus.service