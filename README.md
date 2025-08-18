You will need a .env that would look like that : 
PORT : <port for API>
HOST : <host for API>

EMAIL_USER : <username for emailService>
EMAIL_PASS <password for emailService>

JWT_SECRET: <secret key to sign JWTs>

1/ Git clone the project

2/

  a/ Production build :  ./build_script that will run the "docker-compose.yml" file
  
  b/ Dev environnement : ./dev_script that will run the "docker-compose.dev.yml" file (it bind repo volumes to the docker for live editing and set tailwind / node to --watch for changes)
  
<img width="1140" height="968" alt="image" src="https://github.com/user-attachments/assets/2d0f7b44-a8a6-418f-ad97-1f46e1a39be7" />

Preview of the app design : 

<img width="800" height="696" alt="image" src="https://github.com/user-attachments/assets/9e7db9b0-9e80-44f2-83e3-32d7e9632bf4" />

Current handling of register process : 

<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/9d7a8ab8-02b0-4896-9edf-193f2052dfaa" />
