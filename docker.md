# Docker Basics — Beginner Notes

## 1. Check Docker Version

```powershell
docker --version
```

Shows the installed Docker CLI version.

Example:

```text
Docker version 29.8.0
```

---

## 2. Check Docker Engine

```powershell
docker info
```

This checks whether the **Docker Engine/Server is running** and shows Docker configuration.

Important parts:

```text
Client:
  Version: 29.8.0

Server:
  Containers: 0
  Running: 0
  Stopped: 0
  Images: 0
  Server Version: 29.8.0
```

### Your current status

Your Docker is working correctly because you have both:

```text
Client
Server
```

and:

```text
Server Version: 29.8.0
```

---

# 3. WSL

Docker Desktop on Windows uses **WSL 2** for its Linux environment.

### Check WSL status

```powershell
wsl --status
```

Example:

```text
Default Distribution: docker-desktop
Default Version: 2
```

### Check WSL distributions

```powershell
wsl -l -v
```

Example:

```text
NAME              STATE      VERSION
docker-desktop    Running    2
```

---

## 4. Stop WSL

```powershell
wsl --shutdown
```

This shuts down all running WSL distributions.

You may use this when Docker Desktop/WSL gets stuck.

After that, start Docker Desktop again.

---

# Docker Concepts

## 5. What is an Image?

A **Docker image** is a template/package used to create containers.

Examples:

```text
nginx
mysql
python
node
ubuntu
```

Think:

```text
IMAGE = Template
```

For example:

```text
nginx image
      ↓
creates
      ↓
nginx container
```

---

# 6. What is a Container?

A **container** is an instance created from an image.

For example:

```powershell
docker run nginx
```

Docker uses the `nginx` image to create and start a container.

Think:

```text
Image
  ↓
Container
```

---

# 7. Run a Container

```powershell
docker run nginx
```

This means:

```text
docker run = create + start a new container
nginx      = image
```

---

# 8. Give a Container a Name

```powershell
docker run --name vikas-singh nginx
```

Here:

```text
Container name = vikas-singh
Image          = nginx
```

### Important

Do not confuse the two.

```powershell
docker run --name vikas-singh nginx
```

means:

```text
--name vikas-singh → container name
nginx              → image
```

---

# 9. Run Container in Background

Use `-d`:

```powershell
docker run -d nginx
```

`-d` means:

> Detached mode — run the container in the background.

---

# 10. Run Container with Name + Background

```powershell
docker run -d --name my-nginx nginx
```

This creates and starts a container called:

```text
my-nginx
```

from the:

```text
nginx
```

image.

---

# 11. Port Mapping

To access an application running inside a container from your browser:

```powershell
docker run -d --name my-nginx -p 8080:80 nginx
```

The important part is:

```text
-p 8080:80
```

Meaning:

```text
Your computer       Docker container
localhost:8080  →   port 80
```

So open:

```text
http://localhost:8080
```

in your browser.

---

# Container Commands

## 12. See Running Containers

```powershell
docker ps
```

This shows **currently running containers only**.

Example:

```text
CONTAINER ID   IMAGE   STATUS       PORTS       NAMES
abc123         nginx   Up 2 minutes  0.0.0.0:8080->80/tcp   my-nginx
```

---

# 13. See All Containers

```powershell
docker ps -a
```

This shows:

* Running containers
* Stopped containers
* Exited containers

Example:

```text
CONTAINER ID   IMAGE   STATUS          NAMES
abc123         nginx   Up 2 minutes    my-nginx
def456         nginx   Exited (0)      old-nginx
```

---

# 14. Start a Container

If a container already exists but is stopped:

```powershell
docker start my-nginx
```

You can also use the container ID:

```powershell
docker start CONTAINER_ID
```

### Important

`docker start` does **not create a new container**.

It starts an **existing stopped container**.

---

# 15. Stop a Container

```powershell
docker stop my-nginx
```

Or:

```powershell
docker stop CONTAINER_ID
```

This stops the container but **does not delete it**.

You can verify:

```powershell
docker ps -a
```

You should see:

```text
my-nginx    Exited (0)
```

---

# 16. Delete a Container

First stop it:

```powershell
docker stop my-nginx
```

Then delete it:

```powershell
docker rm my-nginx
```

Check:

```powershell
docker ps -a
```

The container should be gone.

---

## 17. Force Delete a Running Container

If the container is currently running:

```powershell
docker rm -f my-nginx
```

`-f` means force.

It effectively does:

```text
Stop + Delete
```

---

# 18. View Docker Images

```powershell
docker images
```

or:

```powershell
docker image ls
```

This shows images stored on your computer.

Example:

```text
REPOSITORY   TAG       IMAGE ID       SIZE
nginx        latest    abc123         192MB
```

---

# 19. Download an Image

```powershell
docker pull nginx
```

This downloads the image from Docker Hub.

You can then check:

```powershell
docker images
```

---

# 20. Delete an Image

```powershell
docker rmi nginx
```

or:

```powershell
docker image rm nginx
```

### Important

You generally cannot remove an image if a container still depends on it.

Remove the container first:

```powershell
docker rm my-nginx
```

Then:

```powershell
docker rmi nginx
```

---

# 21. View Container Logs

```powershell
docker logs my-nginx
```

This shows logs produced by the container.

To continuously watch logs:

```powershell
docker logs -f my-nginx
```

`-f` means follow.

Press:

```text
Ctrl + C
```

to stop watching the logs.

---

# 22. Open a Shell Inside a Container

```powershell
docker exec -it my-nginx sh
```

Meaning:

```text
docker exec → execute a command inside container
-it         → interactive terminal
my-nginx    → container
sh          → shell
```

Exit the container shell:

```bash
exit
```

---

# 23. Inspect a Container

```powershell
docker inspect my-nginx
```

This displays detailed information about the container, such as:

* IP address
* Network
* Mounts
* Environment
* Container configuration
* Ports

---

# 24. Docker Networks

List networks:

```powershell
docker network ls
```

Docker containers can communicate with each other through Docker networks.

This becomes especially important when you have:

```text
Frontend
   ↓
Backend
   ↓
MySQL
```

---

# 25. Docker Volumes

List volumes:

```powershell
docker volume ls
```

Volumes are commonly used to keep data even when a container is deleted.

For example, databases such as MySQL need persistent storage.

---

# Docker Command Summary

| Command                        | Purpose                        |
| ------------------------------ | ------------------------------ |
| `docker --version`             | Check Docker version           |
| `docker info`                  | Check Docker Engine            |
| `docker ps`                    | Show running containers        |
| `docker ps -a`                 | Show all containers            |
| `docker run IMAGE`             | Create + start container       |
| `docker run -d IMAGE`          | Run in background              |
| `docker run --name NAME IMAGE` | Give container a name          |
| `docker start NAME`            | Start existing container       |
| `docker stop NAME`             | Stop container                 |
| `docker rm NAME`               | Delete container               |
| `docker rm -f NAME`            | Force delete container         |
| `docker images`                | Show images                    |
| `docker pull IMAGE`            | Download image                 |
| `docker rmi IMAGE`             | Delete image                   |
| `docker logs NAME`             | Show container logs            |
| `docker exec -it NAME sh`      | Enter container                |
| `docker inspect NAME`          | Detailed container information |
| `docker network ls`            | Show networks                  |
| `docker volume ls`             | Show volumes                   |

---

# Most Important Difference

Remember these four commands:

```text
docker run
```

**Create + start a NEW container**

```text
docker start
```

**Start an EXISTING stopped container**

```text
docker stop
```

**Stop an existing running container**

```text
docker rm
```

**Delete an existing container**

### Simple flow

```text
                 docker run
                    ↓
              NEW CONTAINER
                    ↓
               docker stop
                    ↓
             STOPPED CONTAINER
                    ↓
               docker start
                    ↓
             RUNNING CONTAINER
                    ↓
                docker rm
                    ↓
              DELETED CONTAINER
```

---

# Your Current Docker Status

Right now, based on your output:

```text
Containers: 0
Running:    0
Stopped:    0
Images:     0
```

So your Docker environment is **clean** — you currently have **no containers and no images**.

Your Docker Engine itself is working correctly.
