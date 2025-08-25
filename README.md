For the moment im only working on the authentication part of the app.<br/>
Preview :

<img width="761" height="854" alt="image" src="https://github.com/user-attachments/assets/0afac1ab-6122-458e-a70f-5892cee0bb21" />

1/ Create a ".env" in "./back/.env", otherwhise API will crash.

PORT : "port for API"<br/>
HOST : "host for API"<br/>

EMAIL_HOST: "mail service your using"<br/>
EMAIL_PORT: "port your service will use if it use one"<br/>
EMAIL_USER : "username for emailService"<br/>
EMAIL_PASS "password for emailService"<br/>

JWT_SECRET: "secret key to sign JWTs"

2/

  a/ Production build :  ./build_script that will run the "docker-compose.yml" file
  
  b/ Dev environnement : ./dev_script that will run the "docker-compose.dev.yml" file (it bind repo volumes to the docker for live editing and set tailwind / node to --watch for changes)
  
<img width="1140" height="968" alt="image" src="https://github.com/user-attachments/assets/2d0f7b44-a8a6-418f-ad97-1f46e1a39be7" />

Preview of the app design : 

<img width="800" height="696" alt="image" src="https://github.com/user-attachments/assets/9e7db9b0-9e80-44f2-83e3-32d7e9632bf4" />

Current handling of register process : 

<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/9d7a8ab8-02b0-4896-9edf-193f2052dfaa" />


