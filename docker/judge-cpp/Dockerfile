FROM gcc:12.2.0

RUN apt-get update && \
    apt-get install -y dos2unix bc && \
    rm -rf /var/lib/apt/lists/*

COPY runner.sh /usr/local/bin/judge-runner.sh
RUN dos2unix /usr/local/bin/judge-runner.sh && chmod +x /usr/local/bin/judge-runner.sh

ENTRYPOINT ["/usr/local/bin/judge-runner.sh"]
