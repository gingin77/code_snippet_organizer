> db.sessions.find()
{
  "_id" : ObjectId("59a8314125d1e8327dd7b027"),
 "sid" : "ZojsXvm_hEcljBOkUpgpPTF-pNrAbrDd",
 "__v" : 0,
 "data" : {
   "passport" : {
     "user" : "59a8316e62f106994b2c7cce"
   },
   "lastAccess" : 1504289535403,
   "cookie" : {
     "path" : "/",
     "httpOnly" : true,
     "expires" : null,
     "originalMaxAge" : null
   },
   "flash" : {  }
 },
 "lastAccess" : ISODate("2017-09-01T18:12:15.403Z"), "expires" : null
}



> db.users.find()
{ "_id" : ObjectId("59a8316e62f106994b2c7cce"),
"username" : "ginniehench",
"passwordHash" : "$2a$08$bg9BsgL14fSJsCKLcbBnUO1X/85OstQNNu073nFnQ17X0WwBwzJYq", "__v" : 0 }
