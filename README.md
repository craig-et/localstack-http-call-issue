# localstack-http-call-issue

It appears to be having slow http calls when localstack have the `HOSTNAME=localstack` env var.

It was first noticed with aws-sdk calls to localstack, and was also noticed in inter-app calls (same compose stack).

The change to use `nginx` was for poc purposes only.

This has only been observed on Alpine Linux v3.17 in our ci environment, I have not been able to replicate this on
Windows 10 or macOS 12.3.1 Monterey

## sample output

The `HOSTNAME=localstack` is set via the pipeline's job, see `.sample.gitlab-ci.yml`

**os version info**

```
$ tail -n +1 /etc/*elease*
==> /etc/alpine-release <==
3.17.3
==> /etc/os-release <==
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.17.3
PRETTY_NAME="Alpine Linux v3.17"
HOME_URL="https://alpinelinux.org/"
BUG_REPORT_URL="https://gitlab.alpinelinux.org/alpine/aports/-/issues"
```

**fast-without-hostname**

```
[invocation 1] took 3550 ms [
  "[http://host-one/health]: 25 ms, success [200]",
  "[http://host-one/health]: 1 ms, success [200]",
  "[http://host-one/2health2furious]: 1 ms, success [200]",
  "[http://host-two/health]: 11 ms, success [200]",
  "[http://host-three/health]: 11 ms, success [200]",
  "[http://host-two/health]: 1 ms, success [200]",
  "[http://host-two/2health2furious]: 0 ms, success [200]",
  "[http://host-two/health]: 1 ms, success [200]",
  "[http://host-one/health]: 1 ms, success [200]"
]
[invocation 2] took 693 ms [
  "[http://host-one/health]: 22 ms, success [200]",
  "[http://host-one/health]: 1 ms, success [200]",
  "[http://host-two/health]: 17 ms, success [200]",
  "[http://host-three/health]: 10 ms, success [200]",
  "[http://host-one/health]: 1 ms, success [200]",
  "[http://host-one/health]: 0 ms, success [200]",
  "[http://host-two/health]: 1 ms, success [200]",
  "[http://host-three/health]: 0 ms, success [200]",
  "[http://host-one/health]: 1 ms, success [200]",
  "[http://host-one/health]: 1 ms, success [200]",
  "[http://host-two/health]: 0 ms, success [200]",
  "[http://host-three/health]: 1 ms, success [200]"
]
```

**slow-with-hostname**

```
[invocation 1] took 53694 ms [
  "[http://host-one/health]: 10024 ms, success [200]",
  "[http://host-one/health]: 2 ms, success [200]",
  "[http://host-one/2health2furious]: 1 ms, success [200]",
  "[http://host-two/health]: 10009 ms, success [200]",
  "[http://host-three/health]: 10012 ms, success [200]",
  "[http://host-two/health]: 10012 ms, success [200]",
  "[http://host-two/2health2furious]: 1 ms, success [200]",
  "[http://host-two/health]: 0 ms, success [200]",
  "[http://host-one/health]: 10013 ms, success [200]"
]
[invocation 2] took 90759 ms [
  "[http://host-one/health]: 10019 ms, success [200]",
  "[http://host-one/health]: 2 ms, success [200]",
  "[http://host-two/health]: 10011 ms, success [200]",
  "[http://host-three/health]: 10012 ms, success [200]",
  "[http://host-one/health]: 10011 ms, success [200]",
  "[http://host-one/health]: 1 ms, success [200]",
  "[http://host-two/health]: 10012 ms, success [200]",
  "[http://host-three/health]: 10012 ms, success [200]",
  "[http://host-one/health]: 10012 ms, success [200]",
  "[http://host-one/health]: 1 ms, success [200]",
  "[http://host-two/health]: 10012 ms, success [200]",
  "[http://host-three/health]: 10012 ms, success [200]"
]
```
