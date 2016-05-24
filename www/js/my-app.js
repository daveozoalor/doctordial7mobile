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

//for date and time
var currentdate = new Date(); 
var todaysdate = "Now: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear();
var currenttime =    currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

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
    myApp.closeModal(); // open Login Screen//load another page with auth form
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
        myApp.alert("The specified user account email is invalid.","Error");
        break;
      case "INVALID_PASSWORD":
        myApp.alert("The specified user account password is incorrect.","Error");
        break;
      case "INVALID_USER":
        myApp.alert("The specified user account does not exist.","Error");
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
       myApp.closeModal();
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
  	
  

	$$('.list-button').on('click', function () {
   // var email = pageContainer.find('input[name="email"]').val();
    var formData = myApp.formToJSON('#signupForm'); //convert submitted form to json.
  
  createUserAccount(formData); //do the registration and report errors if found
  
 
  });
    	
       //run login function
	//messages must be initialized here
  $$('.login-button').on('click', function () {
  	var email = $$('input[name="loginemail"]').val();
  	var password = $$('input[name="loginpassword"]').val();
  loginFire(email, password);
  
  });
  
  

 $$('.logout').on('click', function () {
 	
          	 
          	   myApp.modal({
    title:  'Are you sure you wish to logout?',
    text: '<div class="list-block"></div>',
    buttons: [
      {
        text: 'yes',
        onClick: function() {
           var ref = new Firebase("https://doctordial.firebaseio.com");
          	myApp.alert("You are loging out", "Logout");
          	  ref.unauth(); //logout
          	  localStorage.removeItem("user_id");
          	  localStorage.removeItem("personal_doctor_id");
          	 myApp.loginScreen(); // open Login Screen if user is not logged in 
          	 
        }
      },
      {
        text: 'cancel',
        bold: true,
        
      },
    ]
  })
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
		//var specializations;
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

			//if doctor is not 
	$$('.personal-doctor').on('click', function () {
	//if persnal doctor is being viewed
	
	//myApp.alert("Join go: "+localStorage.personal_doctor_id);
	
      if(localStorage.personal_doctor_id != null){ //if personal doctor is another doctor
     // myApp.alert("Local Storage: "+localStorage.personal_doctor_id);
			mainView.router.loadPage("doctors_view.html?id="+localStorage.personal_doctor_id);
		} else{
			
			//redirect to doctor categories
			  myApp.confirm('You have not added a personal doctor yet. Would you like to add one now?','Add doctor', 
			      function () {
			       mainView.router.loadPage("specializations_list.html");
			      },
			      function () {
			       
			       // updateAnything();
			      }
			    );
		}
		
		});
	
	
	
myApp.onPageInit('doctors_view', function (page) {
		
	 //dont show the add button if this is the viewer's personal doc
		if(localStorage.personal_doctor_id != null && localStorage.personal_doctor_id == page.query.id){
		 //hide button
		 //myApp.alert("Page Query: "+page.query.id+" . Local Storage: "+localStorage.personal_doctor_id + " . User id: " + localStorage.user_id);
		 $$('.add-personal-doctor').hide();
		}
		
         
//add doctor button on index page. 
$$('.add-personal-doctor').on('click', function () {
			//redirect to doctor categories
			  myApp.confirm('Would you like to set this doctor as your personal doctor? This will replace your current personal doctor','Add Peronsal Doctor', 
			      function () {
			      //yes
			      var formData = {personal_doctor_id: page.query.id};
			      
			      updateAnything(formData, "users/"+localStorage.user_id); //update this user's record and add personal doctor
			      
			      localStorage.personal_doctor_id = page.query.id;
			       $$('.add-personal-doctor').hide();
			      //myApp.alert("Doctor added successfully");
			      },
			      function () {
			       
			       // updateAnything();
			      }
			    );
			    
		});		
         
//add doctor button on index page. 
$$('.change-personal-doctor').on('click', function () {
			//redirect to doctor categories
			  myApp.confirm('Would you like choose another personal doctor? This will delete your current personal doctor setings','Add Peronsal Doctor', 
			      function () {
			      //yes
			      localStorage.removeItem("personal_doctor_id");
			       $$('.add-personal-doctor').show();
			       mainView.router.loadPage("specializations_list.html");
			      //myApp.alert("Doctor added successfully");
			      },
			      function () {
			       
			       // updateAnything();
			      }
			    );
			    
		});
	
	
	
	var ref = new Firebase("https://doctordial.firebaseio.com/users/"+localStorage.user_id);
	
	
		ref.orderByChild("personal_doctor_id").startAt(page.query.id).endAt(page.query.id).once("child_added", function(snapshot) {
			
			myApp.alert("Userid: "+localStorage.user_id +" <br/> Doctor ID: "+ page.query.id);
			
		  if(snapshot.key() != null){
		  	
		  	
		  	 
		  	 $$('.add-personal-doctor').hide();
		  	 
				$( ".add-personal-doctor" ).attr({
				  class: "color-gray"
				});
		  }else{
					  	//show button
				$$('.add-personal-doctor').on('click', function () {
				    myApp.confirm('Are you sure you want to make this doctor your personal doctor?','Please Confirm', 
				      function () {
				       
				       var personalDoc = {
					   	personal_doctor_id: page.query.id
					   }
				        updateAnything(personalDoc, "users/"+localStorage.user_id+"/");
				        
				        localStorage.personal_doctor_id = page.query.id; // save it
				        
				       $$('.add-personal-doctor').hide(); //hide the button 
				       
				      },
				      function () {
				       
				       // updateAnything();
					      }
					    );
					});
			      }
		});

	
	});
	
myApp.onPageInit('messages_list', function (page) {
   //var page = e.detail.page;
  // alert(page.query.categoryname);
var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
}); 

  //get the list from database
	   var ref = new Firebase("https://doctordial.firebaseio.com/messages");
		// Attach an asynchronous callback to read the data at our posts reference
		var specializations;
		var messageList = $$('.doctors-list-block');
		
		
		  //find list of doctors in this specialization . page.query.id is the query received from the incoming page GET request
		 // myApp.alert("Dave");
			ref.orderByChild("receiver_id").equalTo(localStorage.user_id).on("child_added", function(snapshot) {
			
		//ref.limitToLast(50).on("child_added", function(snapshot) {
		        var data = snapshot.val();
			    var text = data.text || "anonymous";
			    var message = data.name;
			    var time = data.time; //get the id
			    var time = data.receiver_id; //get the id

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			    if(data.doctors.specialization_id == page.query.id){
					   messageList.append('<li>'+
					      '<a href="doctors_view.html?id='+data+'" class="item-link item-content" data-context-name="doctor-card">'+
					          '<!--<div class="item-media"><i class="fa fa-plus-square" aria-hidden="true"></i></div>-->' +
					          '<div class="item-inner">'+
					            '<div class="item-title"><i class="fa fa-plus-square" aria-hidden="true"></i> '+data.text+'</div>'+
					          '</div>'+
					      '</a>'+
					    '</li>');
					
				}
			 
					
		
		
			
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
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
    var formData = myApp.formToJSON('#addNewDoctor'); //convert submitted form to json.
  if(formData != null){
  	  updateAnything(formData, "users/"+formData.user_id+"/doctors"); //do the registration and report errors if found
  }

 
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
         

	
  
myApp.onPageInit('complaints_list', function (page) {
  //create new coomplaint
  $$('.create-complaint-modal').on('click', function () {
  	
  myApp.modal({
    title:  'Type your health complaint below',
    text: '<div class="list-block" ><ul><li class="align-top"><form id="addComplaintForm"> <div class="item-content"><div class="item-inner"><div class="item-input">'+
    '<input type="text" name="title" placeholder="Title" style="border: 1px solid #9fa39a; border-radius: 3px; "/> <br/><textarea name="text" placeholder="Symptoms" style="border: 1px solid #9fa39a; border-radius: 3px;"></textarea>'+
    '<input type="hidden" value="'+currenttime+'" name="time" hidden />'+
    '<input type="hidden" value="'+todaysdate+'" name="date" hidden />'+
    '<input type="hidden" value="'+localStorage.user_id+'" name="user_id" hidden />'+
    '</div> </div> </div> </form> </li> </ul> </div>',
    buttons: [
      {
        text: 'submit',
        onClick: function() {
			   // var email = pageContainer.find('input[name="email"]').val();
			    var formData = myApp.formToJSON('#addComplaintForm'); //convert submitted form to json.
			    createAnything(formData, "complaints"); //do the registration and report errors if found
			 
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
  
  
var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
}); 

  //get the list from database
	   var ref = new Firebase("https://doctordial.firebaseio.com/complaints");
		// Attach an asynchronous callback to read the data at our posts reference
		var messageList = $$('.specialization-list-block');
		ref.orderByChild("user_id").startAt(localStorage.user_id).endAt(localStorage.user_id).limitToFirst(50).on("child_added", function(snapshot) {
		   var data = snapshot.val();
		   //specializations = JSON.stringify(snapshot.val());
					//doctors list
					
			    var title = data.title || "anonymous";
			    var message = data.text;
			    var specs_id = snapshot.key(); //get the id

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			    //ADD MESSAGE
			    
			    //shorten Text
			    function truncateString(str, length) {
				     return str.length > length ? str.substring(0, length - 3) + '...' : str
				  }
              
			    messageList.append('<li>'+
		      '<a href="complaints_view.html?id='+specs_id+'&title='+truncateString(title, 25)+'" class="item-link item-content" data-context-name="languages">'+
		          '<!--<div class="item-media"><i class="fa fa-user" aria-hidden="true"></i></div>-->' +
		          '<div class="item-inner">'+
		            '<div class="item-title"><i class="fa fa-plus-square" aria-hidden="true"></i> '+truncateString(title, 140)+'</div>'+
		          '</div>'+
		      '</a>'+
		    '</li>');
					
					
		
		
			
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
		
		
 
});
  



 myApp.onPageInit('complaints_view', function(page) {




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
			  var messagesRef = new Firebase('https://doctordial.firebaseio.com/complaints');
               
               
               //find this message, 
              var thismessage = messagesRef.child(page.query.id);
              thismessage.once("value", function(snapshot) {
				// attach it as the first message
				   //GET DATA
				 
			    var data = snapshot.val();
			    var username = data.name || "anonymous";
			    var message = "<b>"+data.title+"</b> <br/> "+data.text;
			    
			    if(localStorage.user_id == data.user_id){ //if this is the sender
					 var messageType = 'sent';
					   }else{
					   	     var messageType = 'received';
					   }
			    var day = data.day;
			    var time = data.time;
			    
			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
				try{
					myMessages.addMessage({
				    // Message text
				    text: message,
				    // Random message type
				    type: messageType,
				    // Avatar and name:
				    //avatar: avatar,
				    //name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  });
				}catch(err){
					//alert("got the error"+err);
				}
				  
				});
				
				
			  // REGISTER DOM ELEMENTS
			  var messageField = $$('#messageInput');
			  var nameField = $$('#nameInput');
			  var messageList = $$('.messages');
			  var sendMessageButton = $$('#sendMessageButton');
	  
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
				  
			
			  
				var complaintReply = messagesRef.child(page.query.id+"/complaint_replies");
				  // Add message
				  complaintReply.push({
				  	//userid
				  	user_id: localStorage.user_id, 
				  	receiver_user_id: page.query.id,
				    // Message text
				    text: messageText,
				    complaint_id: page.query.id,
				    // Random message type
				    // Avatar and name:
				    //avatar: avatar,
				   // name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  })
				  
				
				  // Update conversation flag
				  conversationStarted = true;
				});                


			  // Add a callback that is triggered for each chat message. .child("receiver_user_id")equalTo(page.query.id)
			  //messagesRef.orderByChild("personal_doctor_id").equalTo(page.query.id).limitToLast(20).on('child_added', function (snapshot) {
			  var replyMessage = messagesRef.child(page.query.id+"/complaint_replies");
			  replyMessage.on('child_added', function (snapshot) {
			    //GET DATA
			    var data = snapshot.val();
			    var username = data.title || "anonymous";
			    var message = data.text;
			    
			    if(localStorage.user_id == data.user_id){ //if this is the sender
					 var messageType = 'sent';
					   }else{
					   	     var messageType = 'received';
					   }
			    var day = data.day;
			    var time = data.time;
			    
			    

			    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
			 
			
				try{
					myMessages.addMessage({
				  	
				    // Message text
				    text: message,
				    // Random message type
				    type: messageType,
				    // Avatar and name:
				    //avatar: avatar,
				    //name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  });
				}catch(err){
					//alert("got the error"+err);
				}
				  
			  });

}).trigger();


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
				   // name: name,
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
			 
			
				try{
					myMessages.addMessage({
				  	
				    // Message text
				    text: message,
				    // Random message type
				    type: messageType,
				    // Avatar and name:
				    //avatar: avatar,
				    //name: name,
				    // Day
				    day: !conversationStarted ? 'Today' : false,
				    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
				  });
				}catch(err){
					//alert("got the error"+err);
				}
				  
			  });

}).trigger();



//sample code to prevent back button from existing the app
document.addEventListener('backbutton', function (e) {
            e.preventDefault();
            /* Check for open panels */
            if ($$('.panel.active').length > 0) {
                f7.closePanel();
                return;
            }
            /* Check for go back in history */
            var view = f7.getCurrentView();
            if (!view) return;
            if (view.history.length > 1) {
                view.router.back();
                return;
            }
            /* Quit app */
            navigator.notification.confirm(
                'Exit Application ?',              // message
                function (n) {
                    if (n == 1) navigator.app.exitApp(); 
                },
                'Exit',        // title
                ['OK', 'Cancel']      // button labels
            );
        }, false);




                
                