# Chatterly
Chatterly is a Discord clone made with Electron and Firestore. It is a messaging app that allows users to create servers, channels, and send messages to one another in real-time.

## Features
- Create and join servers
- Create and join channels within servers
- Real-time messaging
- User authentication
- User profiles -- Coming soon
- Server and channel management -- Coming soon

## Installation
To install Chatterly, follow these steps:

1. Clone this repository or download the ZIP file.
2. Install Node.js and npm.
3. Install dependencies by running the following command in the root directory of the project:
´´´ sh
npm install
´´´
4. Create a Firebase project and enable Firestore.
5. Copy the Firebase configuration keys to the src/firebase.js file.
6. Start the app by running the following command:
´´´ sql
npm start
´´´
## Usage
After starting the app, you will be prompted to sign in or create an account. Once you are logged in, you can create or join servers, create or join channels within servers, and send messages to other users in real-time.

To manage servers and channels, click on the server name in the sidebar and select "Server Settings" or "Channel Settings." From there, you can edit the server or channel name, description, and other settings.

To upload an avatar, click on your user profile picture in the top left corner of the app and select "Edit Profile." From there, you can upload a new avatar image.

## Contributing
If you would like to contribute to Chatterly, feel free to submit a pull request. Before doing so, please ensure that your code follows the established coding conventions and that any new features are thoroughly tested.

## License
Chatterly is licensed under the MIT license.