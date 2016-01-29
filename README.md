# Research OrientDB Perfomance

We have this type of query
```
    'createPost',
    'updatePost',
    'getUserInfo',
    'getUserPosts',
    'getUserFriends',
    'getUserFriendPosts',
```        
Make query string with chances
`?chance[updatePost]=1&chance[getUserPosts]=1`

Run on 52.26.42.104
1) `npm start`
2) `ab -n 100000000 -c 50 http://localhost:8000/?chance[updatePost]=1&chance[getUserPosts]=1`
