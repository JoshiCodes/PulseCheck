# PulseCheck
### Modern, Open-Source Platform to monitor your systems.

## Status
Currently under development.
This project is in very early stages, 
while the main monitoring is working, no advanced options like Notifications or the like are currently implemented.

### Roadmap
- [x] Initial Setup
- [x] User Login/Signup
- [x] OIDC Authentication
- [x] OIDC Initial Setup (via .env)
- [ ] Full Admin Dashboard
- [x] Adding/Removing monitors
- [x] Monitoring (not full)
  - [ ] Pull Monitoring from something like Grafana
  - [ ] "Push" like monitoring (ping an API endpoint to update status)
  - [ ] Manual Monitoring (Just setting the status manual)
- [x] Monitoring Visualization
- [ ] Notifications
  - [ ] SMTP Mail
  - [ ] Webhooks (outgoing, PulseCheck -> external app)
- [ ] Custom Status Updates (Incidents)
  - [ ] Full History of Incidents
  - [ ] Incident Status (Investigating, Identified, Monitoring, Resolved)
- [ ] API
  - [ ] Change status for manual monitors
  - [ ] Create & Update Incidents
  - [ ] Bearer Token Auth
- [x] Docker Image
- [x] Docker-compose setup (example file)
- [ ] Better Documentation


## Deploy
To deploy Pulse-Check, copy the [docker-compose](https://github.com/JoshiCodes/PulseCheck/blob/master/docker/docker-compose.yml) to your server.
Make sure to configure your environment variables (best as a .env) like shown in the [.docker.env](https://github.com/JoshiCodes/PulseCheck/blob/master/docker/.docker.env)
After you made your changes, run:
```bash
docker-compose --env-file .docker.env up -d
```

> [!Note]
> You may need to add github to your docker registry.
