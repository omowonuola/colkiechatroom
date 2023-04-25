FROM node:alpine

# Set the working directory

ENV APP_PATH=/usr/src/app

WORKDIR $APP_PATH
COPY . $APP_PATH


# Install dependencies
RUN yarn install


# Set the environment variables
ENV NODE_ENV=production

# Expose the port that the application will run on
EXPOSE 8081 3000

# Start the application
CMD [ "yarn", "run", "start:dev" ]
