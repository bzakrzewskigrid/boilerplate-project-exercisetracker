# Exercise Tracker

This is the boilerplate for the Exercise Tracker project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker

# Starting the project locally:

Run `npm run dev` to start the server.
You can test API using the main html page or use Postman with `postman_collection.json`

# Requirements

- The API should return data in JSON format. Errors should be returned in JSON format as well, with an appropriate status code

- You can POST to /api/users with form data username to create a new user. The returned response will be an object with username and id properties.

- You can make a GET request to /api/users to get an array of all users (User[]). Each element in the array is an object containing user’s username and id. If the user does not exist, a 404 error should be returned.

- You can POST to /api/users/:\_id/exercises with form data description (required, string), duration (required, integer), and date (optional, YYYY-MM-DD). The user id is passed in the route so it should not be passed in separately as a parameter. If no date is supplied, the current date will be used. The response returned will be the object that contains user id and newly added exercise fields (id, duration, description and the date). If a required parameter is missing or incorrect, the expected response would be an error with code 400 and an explanation what exactly is wrong.

- You can make a GET request to /api/users/:\_id/logs to retrieve a full exercise log of any user. The returned response will be the user object with a log array of all the exercises that belong to the user. Each log item has the id, description, duration, and date properties.

- A request to a user’s log (/api/users/:\_id/logs) includes the count property representing the total number of exercises without limits. For example, this might be needed for pagination where we display a number of exercises on the page but want to know how many items there are overall. So we need to count not only the results returned but everything that matches the date filters.

- You can add from, to and limit query parameters to a /api/users/:\_id/logs request to retrieve part of the log of any user. from and to are dates in YYYY-MM-DD format. limit is an integer of how many logs to send back.
