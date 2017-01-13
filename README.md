# Third Backend API project for freeCodeCamp

## URL shortener

### __Usage__

To shorten a url pass it as a parameter to the apps url as follows ```[appUrl]/new/[urlToShorten]```
* ```[appUrl]``` is the url of the application
* ```[urlToShorten]``` is the url you wish to shorten

The API will return a JSON object as follows: ```{"original_url": [urlToShorten], "short_url": [shortUrl]}```

Or an error if something went wrong: ```{"error": [error message]}```


---

### __Shortening Method__

I chose to use Bijective functions to encode the database entries auto incrementing ID.

__Pros__

* This method provides the shortest url's
* This method is the most efficient, no possible collisions (as with hashing), no required db lookups to insert, new links are always added to the end of the db

__Cons__

* Users can easily browse all links that have been shortened
* Users are unable to choose their own url path for shortened links