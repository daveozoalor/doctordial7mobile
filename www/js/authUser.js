// Init QuickBlox application here
//

var QBApp = {
 appId: 43487,
    authKey: 'YBbj2eTUPBL8VJP',
    authSecret: 'X2kpWVMeK7bF3f6'
};




QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret);

//hide buttons
$('#signupTheUserRow').hide();
$('#updateTheUserDetailsRow').hide();





function checkUserUp(userEmail){

//if this user is logged in and has not quickblox account yet
if(typeof localStorage.email !== "undefined" && typeof localStorage.quickblox_id == "undefined"){

  // First of all create a session and obtain a session token
  // Then you will be able to run requests to Users
  //
  QB.createSession(function(err,result){
    console.log('Session create callback', err, result);
  });

  // Init Twitter Digits
  //


//hide the update users detail section
$('#updateTheUserDetailsRow').hide();
$('#signupTheUserRow').hide();

  // Get users
  //
  $('#get_by').on('click', function() {
     alert("working");
    var filter_value = localStorage.email;
    var filter_type = '3';

    var params;

    var request_for_many_user = false;

    switch (filter_type) {
      // all users, no filters<
      case "1":
        params = { page: '1', per_page: '100'};
        request_for_many_user = true;
        break;

      // by id
      case "2":
        params = parseInt(filter_value);
        break;

      // by login
      case "3":
        params = {login: filter_value};
        break;

      // by fullname
      case "4":
        params = {full_name: filter_value};
        break;

      // by facebook id
      case "5":
        params = {facebook_id: filter_value};
        break;

      // by twitter id
      case "6":
        params = {twitter_id: filter_value};
        break;

      // by email
      case "7":
        params = {email: filter_value};
        break;

      // by tags
      case "8":
        params = {tags: filter_value};
        break;

      // by external id
      case "9":
        params = {external: filter_value};
        break;

      // custom filters
      case "10":
        // More info about filters here
        // http://quickblox.com/developers/Users#Filters
        params = {filter: { field: 'login', param: 'in', value: ["sam33","ivan_gram"] }};
        request_for_many_user = true;
        break;
    }

    console.log("filter_value: " + filter_value);
   
    if(request_for_many_user){
      QB.users.listUsers(params, function(err, result){
        if (result) {
          $('#output_place').val(JSON.stringify(result));
        } else  {
          $('#output_place').val(JSON.stringify(err));
        }

        console.log("current_page: " + result.current_page);
        console.log("per_page: " + result.per_page);
        console.log("total_entries: " + result.total_entries);
        console.log("count: " + result.items.length);

        $("#progressModal").modal("hide");

        $("html, body").animate({ scrollTop: 0 }, "slow");
      });
    }else{
      QB.users.get(params, function(err, user){
        if (user) {
          alert(JSON.stringify(user));

          //signup save the contents of this user in localHost, and firebase
          $('#searchUserrow').hide();

          localStorage.quickblox_id = user.id;
          localStorage.quickblox_owner_id = user.owner_id;
          localStorage.quickblox_login = user.login;
          localStorage.quickblox_email = user.email;
          localStorage.quickblox_full_name = user.full_name;

        } else  {
          alert(JSON.stringify(err));

          //assuming user doesnt exist, signup this user
          //signUpUser(filter_value, "Doctordial1234");
           $('#searchUserrow').hide();

          $('#signupTheUserRow').show();
        }

      });
    }
  });





      $('#update').on('click', function() {
    var user_id = localStorage.quickblox_id;

var params = {
      full_name: localStorage.full_name,
      email: localStorage.email
    }
    QB.users.update(parseInt(user_id), params, function(err, user){
      if (user) {
        alert(JSON.stringify(user));
           $('#searchUserrow').hide();

          $('#signupTheUserRow').hide();

      } else  {
        alert(JSON.stringify(err));
        $('#updateTheUserDetailsRow').hide();
      }

    });
  });


 $('#signupButton').on('click', function() {
    var login = localStorage.email;
    var password = 'Doctordial1234';

    var params = { 'login': login, 'password': password};

    QB.users.create(params, function(err, user){
      if (user) {
      //if successful
        alert(JSON.stringify(user));
          localStorage.quickblox_id = user.id;
          localStorage.quickblox_login = user.login;
          localStorage.quickblox_email = user.email;

          //also update user's firebase account
         //function to create anything
        function updateAnything(formData, childVar){
          var postsRef = new Firebase("https://doctordial.firebaseio.com/");
             ref = postsRef.child(childVar);
             ref.update(formData,   function(error) {
          if (error) {
            //myApp.alert("Data could not be saved. :" + error,"Error");
          } else {
           // myApp.alert("Update successful.","Updated");
          }
        });
        }

        var formData = {
              quickblox_id : localStorage.quickblox_id,
              quickblox_login : localStorage.quickblox_login,
              quickblox_email : localStorage.quickblox_email,
        }
        updateAnything(formData, "users/"+doctordial_user_id);


         //hide the signup button
         $('#signupTheUserRow').hide();

        //show the update personal detail's button
        $('#updateTheUserDetailsRow').show();


      } else  {
 $('#signupTheUserRow').hide();
         $('#updateTheUserDetailsRow').show();
      }

      $("#progressModal").modal("hide");

      $("html, body").animate({ scrollTop: 0 }, "slow");
    });
  });

}
}



$(document).ready(function() {


userEmail = localStorage.email;

 checkUserUp(userEmail);



});