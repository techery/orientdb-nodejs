# Research OrientDB Perfomance


## Info
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


## Some scripts

`npm run makeReport` - make csv report. 
`npm run createTimeboard` - make new databoard in datadog. use for new query type
`npm run makeChunk` - make user chunk. fill const in the file

## Loadrunner

Check bin folder
