// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB3WSHe5FS8yptLPr2IoK2fgdOQDDAexUg",
  authDomain: "adventure-2ab5b.firebaseapp.com",
  projectId: "adventure-2ab5b",
  storageBucket: "adventure-2ab5b.appspot.com",
  messagingSenderId: "396662475904",
  appId: "1:396662475904:web:3b564e7edb4c821d4b2a65"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()

// Set up our register function 
function register () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  username = document.getElementById('username').value
  

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return 
    // Don't continue running the code
  }
  
  
  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : email, 
      username : username,
      coins: 0,
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)

    // Done
    alert('User Created!!')
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

// Set up our login function
function login () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return 
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()


    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)

    // Done
    alert('User Logged In!!')
    document.getElementById('login').style.display = 'none';
    document.querySelector('canvas').style.display = 'block';
    animate()


  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}


// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password.lenght < 6) {
    return false
  } else {
    return true
  }
}


function get(field) {
  return new Promise((resolve, reject) => {
    var user = auth.currentUser;
    if (!user) {
      reject("User not found");
      return;
    }
    var uid = user.uid;
    var user_ref = database.ref('users/' + uid);

    user_ref.once('value')
      .then(function(snapshot) {
        var data = snapshot.val();
        if (data && data.hasOwnProperty(field)) {
          resolve(data[field]);
        } else {
          reject("Data field not found");
        }
      })
      .catch(function(error) {
        reject(error);
      });
  });
}


async function updateUser(field, value) {
  var user = auth.currentUser
  if (!user) {
    console.error("User not logged in")
    return
  }

  var uid = user.uid

  try {
    var fieldValue = await get(field)

    var updates = {}
    updates[field] = fieldValue + value

    database.ref('users/' + uid).update(updates)

  } catch (error) {
    console.error("Error updating: ", error);
  }
}



async function updateCoins() {
  var user = auth.currentUser
  if (!user) {
    console.error("User not logged in")
    return
  }

  var uid = user.uid

  try {
    var coins = await get('coins')

    var updates = {
      coins : coins + 1,
    }

    database.ref('users/' + uid).update(updates)

    alert('Coins updated')
  } catch (error) {
    console.error("Error updating coins: ", error);
  }
}



function remove() {
  var username = document.getElementById('username').value

  database.ref('users/' + username).remove()

  alert('deleted')
}
