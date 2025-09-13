FROM docker.elastic.co/beats/filebeat:8.15.0

# Copy config file
COPY filebeat.yml /usr/share/filebeat/filebeat.yml

# Entrypoint untuk set permission dan run filebeat
USER root
RUN chmod 644 /usr/share/filebeat/filebeat.yml
USER filebeat

ENTRYPOINT ["sh", "-c", "chmod 640 /usr/share/filebeat/filebeat.yml && exec filebeat -e"]