// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    domCache: true,
});


$$(document).on('pageInit', function (e) {
	
	//messages must be initialized here
  
});
// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
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

 myApp.onPageInit('index', function(page) {




// Conversation flag
var conversationStarted = false;

try{
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
}catch(err1){
	alert(err1.message);
}

 var myMessagebar = myApp.messagebar('.messagebar', {
    maxHeight: 150
});  

// Do something here when page loaded and initialized
	//var scrolled = 0;
			  // CREATE A REFERENCE TO FIREBASE
			  var messagesRef = new Firebase('https://doctordial.firebaseio.com/');

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
				 
				  // Random message type
				  //var messageType = (['sent', 'received'])[Math.round(Math.random())];
				  var messageType = 'sent';
				  
				 var name = nameField.val(); 
				 //SAVE DATA TO FIREBASE AND EMPTY FIELD
			     // messagesRef.push({name:name, text:messageText});
				  // Avatar and name for received message
				 // var avatar;
				  if(messageType === 'received') {
				    avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
				    name = 'Kate';
				  }
				  
			
			  
				
				  // Add message
				  messagesRef.push({
				  	
				    // Message text
				    text: messageText,
				    // Random message type
				    type: messageType,
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


			  // Add a callback that is triggered for each chat message.
			  messagesRef.limitToLast(10).on('child_added', function (snapshot) {
			    //GET DATA
			    var data = snapshot.val();
			    var username = data.name || "anonymous";
			    var message = data.text;
			    var messageType = data.messageType;
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
					alert(err);
				}
				  
				  
				  
				  
			  });





















}).trigger();

