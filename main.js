import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, FacebookAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDzK5vAPCGBe-eAyC-DDJrdSm1aMMVZh70",
    authDomain: "content-28013.firebaseapp.com",
    projectId: "content-28013",
    storageBucket: "content-28013.appspot.com",
    messagingSenderId: "519137190518",
    appId: "1:519137190518:web:e8a8e4db798146b4f23557",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
    const googleLogin = document.getElementById("google-login-btn");
    if (googleLogin) {
        googleLogin.addEventListener("click", () => {
            signInWithPopup(auth, googleProvider)
                .then((result) => {
                    const user = result.user;
                    sessionStorage.setItem('userDisplayName', user.displayName || 'No Name');
                    sessionStorage.setItem('userEmail', user.email || 'No Email');
                    sessionStorage.setItem('userPhotoURL', user.photoURL || 'iamges/default-profile.png');
                    window.location.href = "location.html";
                })
                .catch((error) => {
                    console.error('Login Error:', error);
                });
        });
    }
    const facebookLogin = document.getElementById("facebook-login-btn");
    if (facebookLogin){
    facebookLogin.addEventListener("click", function(event){
    //event.preventDefault();
    signInWithPopup(auth, facebookProvider)
    .then((result) => {
        // The signed-in user info.
        const user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        sessionStorage.setItem('userDisplayName', user.displayName || 'No Name');
        sessionStorage.setItem('userEmail', user.email || 'No Email');
        sessionStorage.setItem('userPhotoURL', user.photoURL || 'images/default-profile.png');
        console.log(sessionStorage.getItem('userPhotoURL'));
        console.log('Google User Photo URL:', user.photoURL); // Add this line
        window.location.href = "location.html";
    })
    
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        alert(errorMessage)
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
    });
        })
    }
    const emailLoginBtn = document.getElementById("email-login-btn");
    if (emailLoginBtn) {
        emailLoginBtn.addEventListener("click", () => {
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    sessionStorage.setItem('userDisplayName', user.displayName || 'No Name');
                    sessionStorage.setItem('userEmail', user.email || 'No Email');
                    sessionStorage.setItem('userPhotoURL', user.photoURL || 'images/default-profile.png');
                    window.location.href = "location.html";
                })
                .catch((error) => {
                    alert('Login Error: ' + error.message);
                });
        });
    }

    const emailSignupBtn = document.getElementById("email-signup-btn");
    if (emailSignupBtn) {
        emailSignupBtn.addEventListener("click", () => {
            const username = document.getElementById("signup-username").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return updateProfile(user, {
                    displayName: username // Set displayName
                });
            })
            .then(() => {
                const user = auth.currentUser;
                sessionStorage.setItem('userDisplayName', user.displayName || 'No Name');
                sessionStorage.setItem('userEmail', user.email || 'No Email');
                sessionStorage.setItem('userPhotoURL', user.photoURL || 'images/default-profile.png');
                window.location.href = "location.html";
            })
            .catch((error) => {
                alert('Sign Up Error: ' + error.message);
            });
    });
    }



    onAuthStateChanged(auth, (user) => {
        if (user) {
            const usernameElem = document.getElementById('username');
            const emailElem = document.getElementById('email');
            const userPhotoElem = document.getElementById('userPhoto');
            const signOutBtn = document.getElementById('sign-out-btn')

            if (usernameElem && emailElem && userPhotoElem && signOutBtn) {
                usernameElem.textContent = `Hello, ${user.displayName || 'No Name'}`;
                emailElem.textContent = `Email: ${user.email || 'No Email'}`;
                userPhotoElem.src = user.photoURL || 'images/default-profile.png';
                console.log('User Photo Element SRC:', userPhotoElem.src);
                userPhotoElem.addEventListener('load', () => {
                console.log('Image loaded successfully:', user.photoURL);
            });

            userPhotoElem.addEventListener('error', (error) => {
                console.error('Image load error:', error);
                userPhotoElem.src = 'images/default-profile.png';
            });

                document.getElementById('userInfo').style.display = 'block';
                document.getElementById('getLocation').style.display = 'block';
                signOutBtn.style.display = 'block';

                signOutBtn.addEventListener('click', () => {
                    signOut(auth).then(() => {
                        sessionStorage.clear();
                        window.location.href = "index.html";
                    }).catch((error) => {
                        console.error('Sign Out Error:', error);
                    });
                });

            } else {
                console.error('User info elements not found.');
            }
        } else {
            const userInfoElem = document.getElementById('userInfo');
            const getLocationBtn = document.getElementById('getLocation');
            if (userInfoElem) userInfoElem.style.display = 'none';
            if (getLocationBtn) getLocationBtn.style.display = 'none';
        }
    });

    const copyAddressBtn = document.getElementById('copy-address-btn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const addressText = document.getElementById('address').textContent;
            navigator.clipboard.writeText(addressText)
                .then(() => {
                    alert('Address copied to clipboard');
                })
                .catch((error) => {
                    console.error('Copy failed', error);
                });
        });
    }



//Geolocation
const getLocationBtn = document.getElementById('getLocation');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        });
    }
});

function successCallback(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    document.getElementById('address').textContent = `Latitude: ${lat}, Longitude: ${lng}`;
    initMap(lat, lng);
    //show the copy button
    document.getElementById('copy-address-btn').style.display = 'inline-block';
}

function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function initMap(lat, lng) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom: 15
    });

    new google.maps.Marker({
        position: { lat, lng },
        map: map
    });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK') {
            if (results[0]) {
                document.getElementById('address').textContent = results[0].formatted_address;
            } else {
                document.getElementById('address').textContent = 'No results found';
            }
        } else {
            document.getElementById('address').textContent = `Geocoder failed due to: ${status}`;
        }
    });
}
