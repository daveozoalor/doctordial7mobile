// Initialize your app
var myApp = new Framework7(
{
	  template7Pages: true ,
	pushState: 0,
	swipeBackPage: true,
   // Hide and show indicator during ajax requests
    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    },
    
    preroute: function (mainView, options) {
    	
    },
  
     
 });

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    //domCache: true,
});




//function to create anything
function createAnything(formData, childVar){
	var postsRef = new Firebase("https://doctordial.firebaseio.com/");
    
     ref = postsRef.child(childVar);
     
// we can also chain the two calls together
    //postsRef.push(formData);
    
     // we can also chain the two calls together
  ref.push().set(formData,
   function(error) {
  if (error) {
    alert("Data could not be saved. :" + error);
  } else {
    //alert("Data saved successfully.");
  }
}
  );
}

//function to create anything
function updateAnything(formData, childVar){
	var postsRef = new Firebase("https://doctordial.firebaseio.com/");
     ref = postsRef.child(childVar);
     ref.update(formData,   function(error) {
  if (error) {
    myApp.alert("Data could not be saved. :" + error);
  } else {
    myApp.alert("Update successful.","Updated");
  }
});
}


  

//create account
function createUserAccount(formData){
	var ref = new Firebase("https://doctordial.firebaseio.com/users");
	ref.once("value", function(data) {
            // do some stuff once
    });
	
ref.createUser(formData,
 function(error, userData) {
  if (error) {
    myApp.alert("Error creating account:"+error.message, error);
  } else {
    //alert("Successfully created user account with uid:", userData.uid);
    //log user in and create user profile at  /users
       loginFire(formData.email, formData.password);
    		
    		//create user profile
			// we would probably save a profile when we register new users on our site
			// we could also read the profile to see if it's null
			// here we will just simulate this with an isNewUser boolean
			var isNewUser = true;
			ref.onAuth(function(authData) {
			  if (authData && isNewUser) {
			    // save the user's profile into the database so we can list users,
			    // use them in Security and Firebase Rules, and show profiles
			    ref.child("users").child(authData.uid).set({
			      provider: authData.provider,
			      name: getName(authData) //the first part of the users email
			    });
			    
			    //update the user's data to carry the rest of the data
			    var hopperRef = ref.child(authData.uid);
				hopperRef.update(formData);
			  }
			});
			// find a suitable name based on the meta info given by each provider
			function getName(authData) {
			  switch(authData.provider) {
			     case 'password':
			       return authData.password.email.replace(/@.*/, '');
			     case 'twitter':
			       return authData.twitter.displayName;
			     case 'facebook':
			       return authData.facebook.displayName;
			  }
			}
    
    
    myApp.alert("Successfully created account. Please login");
    localStorage.setItem(formData);
    myApp.closeModal('.login-screen'); // open Login Screen//load another page with auth form
  }
});

}

//handle login
function loginFire(sentEmail,sentPassword){ //get this login from database 
	var ref = new Firebase("https://doctordial.firebaseio.com");
ref.authWithPassword({
  email    : sentEmail,
  password : sentPassword
}, function(error, authData) {
  if (error) {
  	switch (error.code) {
      case "INVALID_EMAIL":
        myApp.alert("The specified user account email is invalid.");
        break;
      case "INVALID_PASSWORD":
        myApp.alert("The specified user account password is incorrect.");
        break;
      case "INVALID_USER":
        myApp.alert("The specified user account does not exist.");
        break;
      default:
        myApp.alert("Error logging user in:", error);
    }
    return false; //required to prevent default router action
  } else {
  	//save data in local storage
  	localStorage.user_id = authData.uid;
  	
     myApp.alert("Login successful ", 'Success!');
       myApp.closeModal('.login-screen'); //closelogin screen
  }
});

}

function changeEmail(){
	var ref = new Firebase("https://doctordial.firebaseio.com");
ref.changeEmail({
  oldEmail : "bobtony@firebase.com",
  newEmail : "bobtony@google.com",
  password : "correcthorsebatterystaple"
}, function(error) {
  if (error === null) {
    console.log("Email changed successfully");
  } else {
    console.log("Error changing email:", error);
  }
});
}

function changePassword(){
	var ref = new Firebase("https://doctordial.firebaseio.com");
ref.changePassword({
  email       : "bobtony@firebase.com",
  oldPassword : "correcthorsebatterystaple",
  newPassword : "neatsupersecurenewpassword"
}, function(error) {
  if (error === null) {
    console.log("Password changed successfully");
  } else {
    console.log("Error changing password:", error);
  }
});
}

function sendPasswordResetEmail(recoveryEmail){ 
//You can edit the content of the password reset email from the Login & Auth tab of your App Dashboard.
	var ref = new Firebase("https://doctordial.firebaseio.com");
ref.resetPassword({
  email : recoveryEmail
}, function(error) {
  if (error === null) {
    myApp.alert("Password reset email sent successfully");
  } else {
  	myApp.alert("Error sending password reset email:", error);
  }
});


}

function deleteUser(){
	var ref = new Firebase("https://doctordial.firebaseio.com");
ref.removeUser({
  email    : "bobtony@firebase.com",
  password : "correcthorsebatterystaple"
}, function(error) {
  if (error === null) {
    console.log("User removed successfully");
  } else {
    console.log("Error removing user:", error);
  }
});
}

// Create a callback which logs the current auth state
function checkLoggedIn(authData) {
  if (localStorage.user_id != null) {
    
       myApp.closeModal(); //closelogin screen
  } else {
			myApp.loginScreen(); // open Login Screen if user is not logged in
  }
}
// Register the callback to be fired every time auth state changes
var ref = new Firebase("https://doctordial.firebaseio.com");
ref.onAuth(checkLoggedIn);



 
  //recover email
  $$('.recovery-button').on('click', function () {
  	var email = $$('input[name="recoveryEmail"]').val();
  	sendPasswordResetEmail(email);
  	});
  	
  	
  $$('.open-3-modal').on('click', function () {
  	
  myApp.modal({
    title:  'Type your health complaint below',
    text: '<div class="list-block"><ul><li class="align-top"><div class="item-content"><div class="item-inner"><div class="item-input"> <textarea></textarea></div> </div> </div> </li> </ul> </div>',
    buttons: [
      {
        text: 'submit',
        onClick: function() {
          myApp.alert('Complaint succeffuly submitted','Success!')
        }
      },
      {
        text: 'call',
        onClick: function() {
          myApp.alert('You clicked second button!')
        }
      },
      {
        text: 'cancel',
        bold: true,
        onClick: function() {
        //  myApp.alert('You clicked third button!')
        }
      },
    ]
  })
});
  
  

	$$('.list-button').on('click', function () {
   // var email = pageContainer.find('input[name="email"]').val();
    var formData = myApp.formToJSON('#signupForm'); //convert submitted form to json.
  
  createUserAccount(formData); //do the registration and report errors if found
  
 
  });
    	
       //run login function
	//messages must be initialized here
  $$('.login-button').on('click', function () {
  	var email = $$('input[name="email"]').val();
  	var password = $$('input[name="password"]').val();
  loginFire(email, password);
  });
  
  

 $$('.logout').on('click', function () {
 	 var ref = new Firebase("https://doctordial.firebaseio.com");
          	myApp.alert("You are loging out", "Logout");
          	  ref.unauth(); //logout
          	  localStorage.removeItem("user_id");
          	 myApp.loginScreen(); // open Login Screen if user is not logged in 
 });


// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}

	// Callbacks to run specific code for specific pages, for example for About page:


myApp.onPageInit('specializations_list', function (page) {
  
var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
}); 

//dummy function I used to create new category of doctors
  $("#addAccount").on('click', function () {
   // var email = pageContainer.find('input[name="email"]').val();
    var formData = myApp.formToJSON('#addNew'); //convert submitted form to json.
  
  createAnything(formData, "specializations"); //do the registration and report errors if found
 
  });
  
  
  //get the list from database
	   var ref = new Firebase("https://doctordial.firebaseio.com/specializations");
		// Attach an asynchronous callback to read the data at our posts reference
		var specializations;
		var messageList = $$('.specialization-list-block');
		ref.limitToLast(50).on("child_added", function(snapshot) {
		   var data = snapshot.val();
		   //specializations = JSON.stringify(snapshot.val());
					//doctors list
					
			    var name = data.name || "anonymous";
			    var message = data.text;
			    var specs_id = snapshot.key(); //get the id

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
             // myApp.alert(JSON.stringify(snapshot.val()));
			    //ADD MESSAGE
			    messageList.append('<li>'+
		      '<a href="doctors_list.html?id='+specs_id+'&categoryname='+name+'" class="item-link item-content" data-context-name="languages">'+
		          '<!--<div class="item-media"><i class="fa fa-plus-square" aria-hidden="true"></i></div>-->' +
		          '<div class="item-inner">'+
		            '<div class="item-title"><i class="fa fa-plus-square" aria-hidden="true"></i> '+name+'</div>'+
		          '</div>'+
		      '</a>'+
		    '</li>');
					
					
		
		
			
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		
		
 
});
         

myApp.onPageInit('index', function (page) {
	$$('.personal-doctor').on('click', function () {
		
		if(localStorage.personal_doctor_id != null){
			myApp.router.loadPage("doctors_view.html?personal_doctor_id="+localStorage.personal_doctor_id);
		}else{
			
			//redirect to doctor categories
			  myApp.confirm('You have not added a personal doctor yet. Would you like to add one now?','Add doctor', 
			      function () {
			       myApp.router.loadPage("doctors_list.html");
			      },
			      function () {
			       
			       // updateAnything();
			      }
			    );
		}
		
		});
	});
	
	
	
	
myApp.onPageInit('doctors_view', function (page) {
	
	var ref = new Firebase("https://doctordial.firebaseio.com/users"+localStorage.user_id);
		ref.orderByChild("personal_doctor_id").equalTo(page.query.id).on("child_added", function(snapshot) {
		  
		  if(snapshot.key() != null){ //if user
		  	
		  	 $$('.personal-doctor').hide();
		  }else{
					  	//show button
				$$('.personal-doctor').on('click', function () {
					
			    myApp.confirm('Are you sure you want to make this doctor your personal doctor?','Please Confirm', 
			      function () {
			       
			       var personalDoc = {
				   	personal_doctor_id: page.query.id
				   }
			        updateAnything(personalDoc, "users/"+localStorage.user_id+"/");
			        
			        localStorage.personal_doctor_id = page.query.id; // save it
			        
			       $$('.personal-doctor').hide(); //hide the button 
			      },
			      function () {
			       
			       // updateAnything();
			      }
			    );
			});
		  	
		  }
		  
		  
		});



	
	});
	
myApp.onPageInit('doctors_list', function (page) {
   //var page = e.detail.page;
  // alert(page.query.categoryname);
var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
}); 

//dummy function I used to create new category of doctors
  $("#addAccountDoctor").on('click', function () {
   // var email = pageContainer.find('input[name="email"]').val();
   alert("John");
    var formData = myApp.formToJSON('#addNewDoctor'); //convert submitted form to json.
  
  updateAnything(formData, "users/"+formData.user_id+"/doctors"); //do the registration and report errors if found
 
  });
  
  
  //get the list from database
	   var ref = new Firebase("https://doctordial.firebaseio.com/users");
		// Attach an asynchronous callback to read the data at our posts reference
		var specializations;
		var messageList = $$('.doctors-list-block');
		
		
		  //find list of doctors in this specialization . page.query.id is the query received from the incoming page GET request
		 // myApp.alert("Dave");
			ref.orderByChild("doctors").on("child_added", function(snapshot) {
			  //myApp.alert("Dave"+snapshot.val().doctors.specialization_id);
			
		//ref.limitToLast(50).on("child_added", function(snapshot) {
		        var data = snapshot.val();
			    var email = data.email || "anonymous";
			    var message = data.specialization_id;
			    var specs_id = snapshot.key(); //get the id
			    var about = snapshot.val().about || '';
			    var title = snapshot.val().doctors.title || '';
			    var firstname = snapshot.val().firstname || '';
			    var middlename = snapshot.val().middlename || '';
			    var lastname = snapshot.val().lastname || '';
			    var fullname = title+' '+firstname+' '+middlename+' '+lastname;

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			    if(data.doctors.specialization_id == page.query.id){
					   messageList.append('<li>'+
					      '<a href="doctors_view.html?id='+snapshot.key()+'&about='+about+'&gender='+data.gender+'&fullname='+fullname+'" class="item-link item-content" data-context-name="doctor-card">'+
					          '<!--<div class="item-media"><i class="fa fa-plus-square" aria-hidden="true"></i></div>-->' +
					          '<div class="item-inner">'+
					            '<div class="item-title"><i class="fa fa-plus-square" aria-hidden="true"></i> '+snapshot.val().doctors.title+' '+firstname+' '+middlename+' '+lastname+'</div>'+
					          '</div>'+
					      '</a>'+
					    '</li>');
					
				}
			 
					
		
		
			
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
			
			
		
		
 
});
         

   



 myApp.onPageInit('messages_view', function(page) {




// Conversation flag
var conversationStarted = false;

try{
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
}catch(err1){
	alert("As you can see: "+err1.message);
}

 var myMessagebar = myApp.messagebar('.messagebar', {
    maxHeight: 150
});  

// Do something here when page loaded and initialized
	//var scrolled = 0;
			  // CREATE A REFERENCE TO FIREBASE
			  var messagesRef = new Firebase('https://doctordial.firebaseio.com/messages');

			  // REGISTER DOM ELEMENTS
			  var messageField = $$('#messageInput');
			  var nameField = $$('#nameInput');
			  var messageList = $$('.messages');
			  var sendMessageButton = $$('#sendMessageButton');

			  // LISTEN FOR KEYPRESS EVENT
			/*  sendMessageButton.click(function (e) {
			      //FIELD VALUES
			      var username = nameField.val();
			      var message = messageField.val();
                  messageField.val('');
			      if(message != ''){
			      	 
			      //SAVE DATA TO FIREBASE AND EMPTY FIELD
			      messagesRef.push({name:username, text:message});
			      
			      }
			     
			   
			  });*/
			  
			  
							  
				// Init Messagebar
				var myMessagebar = myApp.messagebar('.messagebar');
				 
				// Handle message
				$$('.messagebar .link').on('click', function () {
					
				  // Message text
				  var messageText = myMessagebar.value().trim();
				  // Exit if empy message
				  if (messageText.length === 0) return;
				 
				  // Empty messagebar
				  myMessagebar.clear()
				 
				  
				 var name = nameField.val(); 
				 //SAVE DATA TO FIREBASE AND EMPTY FIELD
			     // messagesRef.push({name:name, text:messageText});
				  // Avatar and name for received message
				 // var avatar;
				  
			
			  
				
				  // Add message
				  messagesRef.push({
				  	//userid
				  	user_id: localStorage.user_id, 
				  	receiver_user_id: page.query.id,
				    // Message text
				    text: messageText,
				    // Random message type
				    // Avatar and name:
				    //avatar: avatar,
				    name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  })
				  
				
				  // Update conversation flag
				  conversationStarted = true;
				});                


			  // Add a callback that is triggered for each chat message. .child("receiver_user_id")equalTo(page.query.id)
			  messagesRef.limitToLast(10).on('child_added', function (snapshot) {
			    //GET DATA
			    var data = snapshot.val();
			    var username = data.name || "anonymous";
			    var message = data.text;
			    
			    if(localStorage.user_id == data.user_id){ //if this is the sender
					 var messageType = 'sent';
			   }else{
			   	     var messageType = 'received';
			   }
			    var day = data.day;
			    var time = data.time;
			    
			    

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			   // var messageElement = $$('<div class="message message-'+messageType+'"><div class="message-text">');
			   // var nameElement = $$("<strong class='example-chat-username'></strong>");
			    
			    var newMessageContent =     '<div class="message message-sent">'+
									        '<div class="message-text">'+message+'</div>'+
									        '</div>';
			    //$$(newMessageContent ).insertAfter( ".message" );
			    
			   // nameElement.text(username+" ");
			   // messageElement.text(message).prepend(nameElement);
          

			    //SCROLL TO BOTTOM OF MESSAGE LIST
			   // messageList[0].scrollTop = messageList[0].scrollHeight;
			      // Add message
			     
				try{
					myMessages.addMessage({
				  	
				    // Message text
				    text: message,
				    // Random message type
				    type: messageType,
				    // Avatar and name:
				    //avatar: avatar,
				    name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  });
				}catch(err){
					//alert("got the error"+err);
				}
				  
				  
				  
				  
			  });

}).trigger();

