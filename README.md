# Research OrientDB Perfomance

## Algorithm of one node

1. Make a node user pool. User pool is 1/Number_of_Nodes part of all Users.
2. Start workers.
4. Every workers emulate at one moment Numbers_of_User_at_one_Worker from the pool.
5. Check with timeout every worker and restart one of them.

### Parameters the algorithm
- Numbers of nodes.
- Current node id.
- Amount of workers.
- Numbers of User at one Worker.
- Numbers of Users at Database (calculating at start of Node).

# Algorithm of user behavior

## Steps
1. Get feed.
2. For every feed item add like with the chance.
3. For every feed item read with the chance.
4. For every feed item add comment with the chane.
5. Check activity timeout. Check type of activity. Make the activity.

### Parameters the algorithm
- Number of items at the feed.
- Chance set like.
- Chance of read the item.
- Chance write comment.
- Timeout for new activity.
- Activity chances (sum is 100%): deleting friendship, make new friendship, write a post, nothing.

## Parameters

### IN

- Numbers of Nodes
- Users in Database
- Parameters of every node
- Parameters of OreintDB environment

### Result parameters 

- CPU usage
- Memory usage
- Request per second
- Average time for one request
