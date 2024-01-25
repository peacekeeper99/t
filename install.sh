#!/bin/sh

# Check if the "ws" package is installed using npm
if npm list -g | grep -q ws; then
    echo "Dependencies have been already installed!"
else
    echo "Dependencies aren't installed, installing!"

    # Install the "ws" package using npm
    npm install -g ws
    
    # Check if the installation was successful
    if [ $? -eq 0 ]; then
        echo "Installation successful!"
    else
        echo "Error occurred during installation."
    fi
fi
