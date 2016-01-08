# faveFlick

#TUM && ANA MOVIE DATABASE PROJECT PROPOSAL:
* USERS: 
  - Movie enthusiasts, critics, general public, etc. 
  - This app serves the purpose of tracking movies that the user wants to watch, and/or has watched (along with the rating if the user chooses to provide one).  
  - This app helps the user prioritize their movie viewing preferences. It should allow the user to put movies on either a  “watch” or “seen it” list. If a movie is added to the users’ “seen it” list, they can also specify ratings for the movie. To be clear, the user cannot watch movies on this app. It is only for tracking purposes. 
  - The ratings are standard 1-5 (1 meaning the user hated it, 5 meaning they loved it and would watch again)
* OUTPUTS:
  - The user needs to be able to:
  - Sign up with their email as the username and create a password
  - Log in with that username and password 
  - Click to log in
  - Search for movie titles, genres, and other user profiles (by username)
  - Access the “suggested” page which features new releases and popular movies (based on user ratings)
  - Click to add movies to their “watch” list
  - Click to add movies to their “seen it” list
  - Rate the movies they have seen
  - View their own profile with the two lists and their corresponding info
  - View other user profiles 
  - Remove movies from either list
  - Log out
* INPUTS:
  - Home page with movies across the top 
  - Sign up/log in form
  - Navigation bar with buttons to available pages
  - Log in/ sign up box
  - Submit button
  - Search box 
  - Submit button when using search
  - Add to “watch” list button 
  - Add to “seen it” list button 
  - Remove from list button
  - Home button (if user is logged in, this takes them to their profile page)
  - Rating buttons
  - Log out

* TECHNOLOGIES:
  - CRUD 
    - Using knex or express
  - HTML
  - CSS/bootstrap
  - JavaScript
  - API
    - OMDB 
    - Authentication methods including signing up, logging in, and handling of cookies
    - PostGres Database
  - DATABASE:
    3 tables:
    - Movie table
      - ID
      - Title
      - Genre
      - Date
      - Avg. Rating
      - Number of users that have watched
      - Number of users that want to watch
    - Genre table
      - ID
      - Genre
    - User table
      - ID
      - Name
      - Email
      - Number of movies watched
      - Number of movies they want to watch
- MAYBE IN THE FUTURE: This app should also be able to run reports for the user so that they can calibrate data based on what they have categorized/watched. 
