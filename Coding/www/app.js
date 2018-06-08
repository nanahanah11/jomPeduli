var db = firebase.firestore();
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

function login()
{
    var userEmail=document.getElementById("email_field").value;
    var userPass=document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail,userPass)
    .then(function() 
    {
    	//console.log("Document successfully written!");
        window.location.href = 'index.html#menu_page';
    })
    .catch(function(error)
    {
        var errorCode=error.code;
        var errorMessage=error.message;
        window.alert("Error: "+errorMessage);
    });
}

function validate()
{
    var inputPassword=document.getElementById("password").value;
    var inputPhone=document.getElementById("phoneNumber").value;

    if (inputPassword.length >= 6 && inputPassword.length<=10) 
    {
        if (!isNaN(parseFloat(inputPhone)) && inputPhone.toString().indexOf(".") == -1)
        {
            register();
        } 
        else 
        {
            alert("Phone number must be 0-9");
        }
    }
    else
    {
        window.alert("Password must 6-10 characters");
    }
}

function register()
{
    var inputEmail=document.getElementById("username").value;
    var inputPassword=document.getElementById("password").value;
    var inputPhone=document.getElementById("phoneNumber").value;

    db.collection("Users").doc("resident").set(
    {
        email: inputEmail,
        password: inputPassword,
        phone: inputPhone,
        address: " "
    })
    .then(function() 
    {
        console.log("Document successfully written!");
        window.alert("Successfully register! Continue log in");
    })
    .catch(function(error) 
    {
        console.error("Error writing document: ", error);
    });

    var userEmail=document.getElementById("username").value;
    var userPass=document.getElementById("password").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) 
    {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error: "+errorMessage);
    });
   
}

function logout()
{
    firebase.auth().signOut().then(function() 
    {
        // Sign-out successful.
        window.location.href = 'index.html#login_page';
    })
    .catch(function(error) 
    {
        // An error happened.
        window.alert("Error: "+errorMessage);
    });
}

//camera
window.onload=function()
{
    document.getElementById('btnTakePicture').addEventListener('click', takePic);
    document.getElementById('btnClear').addEventListener
    ('click',function()
        {
            document.getElementById('imgArea').src=""; 
        }
    );
}
        
function takePic(e)
{
    var options = 
    {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        targetWidth: 1200,
        targetHeight: 800
    }
    navigator.camera.getPicture(success,fail, options);
}
            
function success(thePicture)
{
    var image = document.getElementById('imgArea');
    //alert(thePicture);
    image.src = thePicture;
}
            
function fail(e)
{
    alert("Image failed: " + e.message);
}

//create
function sendReport()
{
    var inputCategory=document.getElementById("category").value;
    var inputLocation=document.getElementById("location").value;
    //var inputImage=document.getElementById("imgArea").value;
    var inputInfo=document.getElementById("details").value;

    // Add a new document in collection "cities"
    db.collection("Reports").doc("001").set(
    {
        category: inputCategory,
        location: inputLocation,
        //image: inputImage,
        details: inputInfo,
        status: "Submitted"
    })
    .then(function() 
    {
        console.log("Report submitted");
        window.alert("Successfully submit report!");
    })
    .catch(function(error) 
    {
        console.error("Error writing document: ", error);
    });

    // Add a new document in collection rewards
    db.collection("Rewards").doc("001").set(
    {
        points: "10",
        items_redeemed: " "
    });
}

const userInput=document.querySelector("#user");
const phoneInput=document.querySelector("#phone");
const addInput=document.querySelector("#address");
const pointsInput=document.querySelector("#points");

var docRef = db.collection("Users").doc("resident");
docRef.get().then(function(doc)
{
    if(doc.exists)
    {
        //console.log("Document data:", doc.data());
        const myProfile=doc.data();
        userInput.innerText="Username: "+myProfile.email;
        phoneInput.innerText="Phone Number: "+myProfile.phone;
        addInput.innerText="Address: "+myProfile.address;
    }
    else 
    {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
})	
.catch(function(error)
{
    console.log("Got an error: ",error);
});

var docRef = db.collection("Rewards").doc("001");
docRef.get().then(function(doc)
{
    if(doc.exists)
    {
        //console.log("Document data:", doc.data());
        const myPoints=doc.data();
        pointsInput.innerText="Collected Points: "+myPoints.points;
    }
    else 
    {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
});

function update()
{
	var inputAddress=document.getElementById("address").value;

    db.collection("Users").doc("resident").update(
	{
    	"address": inputAddress
	})
	.then(function() 
	{
    	console.log("Document successfully written!");
    	window.alert("Successfully update profile!");
	})
	.catch(function(error) 
	{
    	console.error("Error writing document: ", error);
	});
}

//maps
var options;
window.onload=function()
{
	//document.addEventListener('deviceready',init,false);
	init();
}
function init()
{
	document.getElementById('btnLocation').styledisplay="block";
	options={maximumAge:3000, timeout:5000, enableHighAccuracy:true};
}
function getLocation()
{
	navigator.geolocation.getCurrentPosition(success,failure,options);
}
function success(position)
{
	var latitude=position.coords.latitude;
	var long=position.coords.longitude;
	var out="<strong>Latitude:</strong>"+latitude;
	out+="<br/><strong>Longitude:</strong>"+long;
	document.getElementById('result').innerHTML=out;

	var mapOptions=
	{
		center:{lat:latitude,lng:long},
		zoom:15
	};
	var map=new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	/*db.collection("Reports").doc("001").update(
    {
        latitude: latitude,
        longitude: long
    })
    .then(function() 
    {
        console.log("Latitude and longitude submitted");
    })
    .catch(function(error) 
    {
        console.error("Error writing document: ", error);
    });*/
}
function failure(message)
{
	alert("Error: "+message.message);
}
function clearScreen()
{
	document.getElementById('map-canvas').innerHTML="";
	document.getElementById('map-canvas').style.backgroundColor="white";
	document.getElementById('result').innerHTML="";
}

//view report
const list_div=document.querySelector("#list_div");
db.collection("Reports").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        list_div.innerHTML+="<div class='list-item'><h5>"+doc.data().category+"</h5><p>Location: "+doc.data().location+
        "</p><p>Details: "+doc.data().details+"</p><p>Report status: "+
        doc.data().status+"</p></div>"
    });
});

function claimed()
{
	var change = document.getElementById("claimBtn");
    if (change.innerHTML == "Claim Now")
    {
        db.collection("Reports").doc("001").update(
		{
    		reward: "Claimed"
		})
		.then(function() 
		{
    		window.alert("Claim is now processing");
    		change.innerHTML = "Claimed";
		})
		.catch(function(error) 
		{
    		console.error("Error writing document: ", error);
		});
    }
    else 
    {
    	change.innerHTML = "Claimed";
    }    
}

