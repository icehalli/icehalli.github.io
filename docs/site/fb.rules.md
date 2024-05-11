# Firbase rules

https://firebase.google.com/docs/rules/rules-and-auth#realtime-database

## all open
{
  "rules": {
    ".read": "now < 1716595200000",  // 2024-5-25
    ".write": "now < 1716595200000",  // 2024-5-25
  }
}

## example 1

{
  "rules": {
    "users": {
      "$userId": {
        // grants write access to the owner of this user account
        // whose uid must exactly match the key ($userId)
        ".write": "$userId === auth.uid"
      }
    }
  }
}

## tryouts
{
    "rules": {
        "mytodo": {
            "$mytodo": {
                ".read": "data.child('user').val() = request.auth.email",
                ".write": request.auth != null"
            }
        }
    }
}


{
  "rules": {
    "mytodo": {
      ".write": "auth !== null",
        "$uid":{
          ".read": "auth !== null && auth.uid === $uid"
        }
    },
    "todo":{
      ".read": true
    }
  }
}