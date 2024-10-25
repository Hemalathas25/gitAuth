import React, { useEffect, useState } from "react";

const CLIENT_ID = "Ov23li6ZqMBNQxKqlgsV";

function Login() {

    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");

        if (codeParam && !localStorage.getItem("accessToken")) {
            async function getAccessToken() {
                await fetch(`http://localhost:4000/getAccessToken?code=${codeParam}`, {
                    method: "GET"
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        console.log("Access Token:", data.access_token);
                        localStorage.setItem("accessToken", data.access_token);
                        setRerender(!rerender);
                    }
                })
                .catch((error) => console.error("Error fetching access token:", error));
            }
            getAccessToken();
        }
    }, [rerender]);

    async function getUserData() {
        await fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}` // Corrected the Authorization header
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("User Data:", data);
            setUserData(data);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }

    function loginWithGithub() {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`);
    }

    return (
        <div >
            {localStorage.getItem("accessToken") ? (
                <>
                    <h1>We have the access token</h1>
                    <button onClick={() => { localStorage.removeItem("accessToken"); setRerender(!rerender); }}>
                        Log out
                    </button>

                    <h3>Get User Data from Github API</h3>
                    <button onClick={getUserData}>Get Data</button>

                    {Object.keys(userData).length !== 0 && (
                        <h4>Hey there {userData.login}</h4>
                        
                    )}
                </>
            ) : (
                <>
                    <h3>User is not logged in</h3>
                    <button onClick={loginWithGithub}>
                        Login with Github
                    </button>
                </>
            )}
        </div>
    );
}

export default Login;
