# PulseCheck
### Modern, Open-Source Platform to monitor your systems.

## Status
Currently under development.
This project is in very early stages, 
the main feature to monitor services is not yet implemented.
### Roadmap
- [x] Initial Setup
- [x] User Login/Signup
- [x] OIDC Authentication
- [x] OIDC Initial Setup (via .env)
- [ ] Full Admin Dashboard
- [x] Adding/Removing monitors
- [x] Monitoring (not full)
- [x] Monitoring Visualization
- [ ] Notifications
- [ ] Custom Status Updates
- [x] Docker Image
- [x] Docker-compose setup (example file)
- [ ] Better Documentation


## Deploy
To deploy Pulse-Check, copy the [docker-compose](https://github.com/JoshiCodes/PulseCheck/blob/master/docker/docker-compose.yml) to your server.
Make sure to configure your environment variables (best as a .env) like shown in the [.docker.env](https://github.com/JoshiCodes/PulseCheck/blob/master/docker/.docker.env)
After you made your changes, run:
```bash
docker-compose up -d
```

> [!Note]
> You may need to add github to your docker registry.
