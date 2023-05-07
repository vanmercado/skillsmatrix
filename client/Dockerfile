# STAGE 1 - Build the react app
# Set the base image to build from
# This is the application image from which all other subsequent
# Applications run. Alpine Linux is a security-oriented, lightweight #(~5Mb) Linux distribution.
FROM node:alpine as build

# Set working directory
# This is the working folder in the container from which the app will be running from
WORKDIR /client

# Add the node_modules folder to $PATH
ENV PATH /client/node_modules/.bin:$PATH

# Copy package.json file to /app directory for installation prep
COPY ./package.json /client/

# Install dependencies
RUN yarn --silent

# Copy everything to /client directory
COPY . /client

# Build the client
RUN yarn --network-timeout 600000 build

# STAGE 2 - Build the final image using a nginx web server
# Distribution and copy the react build files
FROM nginx:alpine
COPY --from=build /client/build /usr/share/nginx/html

# Overwrite default configurations on nginx server
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80

# Start nginx web server
CMD ["nginx", "-g", "daemon off;"]