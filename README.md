# Grabbit: Your Market for Preloved Treasures

Grabbit is a secure, user-friendly web-based marketplace for buying and selling preloved items. Our platform enables users to list items for sale, search for listings, and complete transactions safely and efficiently.

## Core Concept

Grabbit connects buyers and sellers by providing a streamlined experience to:
- List items with images, detailed descriptions, and pricing.
- Search and filter listings by name, category, price range, location, and quality.
- Coordinate in-person pickups through an integrated messaging system.
- Process secure transactions using the Stripe API.

## Key Features

- **Search Functionality:** Quickly find items by name.
- **Filter Options:** Sort listings based on category, price, location, and quality.
- **User Authentication:** Secure registration and login.
- **In-App Notifications:** Receive real-time alerts for purchase updates.
- **Messaging:** Direct communication to arrange in-person pickups.
- **Secure Payment:** Transactions processed via Stripe API.
- **Account Management:** View recently viewed, watched, and purchased items.

## Technology Stack

- **Frontend:** React, JavaScript, HTML, CSS
- **Backend:** Node.js
- **Database:** MongoDB (NoSQL)
- **Authentication:** JSON Web Tokens
- **Additional Tools:** Stripe API (Payment)

## How to Run (Locally)

First, download the repo and get it configured in whichever code editor is most appropriate for you!

Then open your terminal in the main ```Grabbit``` folder, you will need to install dependancies here. Alongside installing dependancies in the ```item-service```, ```payment-service```, ```react-grabbit```, and ```user-service``` folders.

This can be done through the terminal going into each folder and using ```npm install``` .

Second, download MongoDB Community Edition (If you don't already have it)

Here is a link: ```https://www.mongodb.com/try/download/community-kubernetes-operator```<br/>
Note: The version we are using is 8.0.5 though any version at this one or higher should work!

We also recommend MongoDB compass, for easier viewing of the data in the database!
Here is a link: ```https://www.mongodb.com/try/download/compass```

Lastly, to run the project naviagte your terminal to the main ```Grabbit``` folder. Then enter ```npm start```. This will start up each of those folders, individually hosting each.

To make sure the project is running properly there should be a couple database confirmations on proper connection and hosting. These will be printed out into the console when first started.
Here is a list of what each service should provide when functioning properly.

Payment Service:
* Payment service listening on port 5004...

Item Service:
* Item service running on port 5003
* MongoDB connected for item service

User Service:
* User service running on port 5002
* MongoDB connected

React Grabbit:
* Compiled successfully!

## Trouble Shooting

### MongoDB
If there is an issue with the MondoDB connections not appearing in the console, it is most likely due to an issue with how MongoDB is set up on your machine. 
Plent of Youtube videos cover this issue and possilbe solutions, please take a look into those since there are too many to list here.

### Node.js Hosting
If there is an issue with your hosting on the different ports more than likely you have something else running on the port that needs closing.

## Demo Video
Here is a quick demo on the project: https://www.youtube.com/watch?v=rR0rE0_wH7E
