import React, { useEffect, useState } from "react";

const CLIENT_ID = "Ov23li6ZqMBNQxKqlgsV";

function Login() {
    const [userData, setUserData] = useState({});
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");

       // console.log("Authorization Code:", codeParam);


        if (codeParam && !accessToken) {
            async function getAccessToken() {
                try {
                    const response = await fetch(`http://localhost:4000/getAccessToken?code=${codeParam}`, {
                        method: "GET"
                    });
                    const data = await response.json();
                    if (data.access_token) {
                        console.log("Access Token:", data.access_token);
                        localStorage.setItem("accessToken", data.access_token);
                        setAccessToken(data.access_token);
                        // Clear the code from URL
                        window.history.replaceState({}, document.title, "/");
                    } else {
                        console.error("Error fetching access token:", data);
                    }
                } catch (error) {
                    console.error("Error fetching access token:", error);
                }
            }
            getAccessToken();
        }
    }, [accessToken]);

    async function getUserData() {
        if (!accessToken) return;
        try {
            const response = await fetch("http://localhost:4000/getUserData", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}` 
                }
            });
            const data = await response.json();
            console.log("User Data:", data);
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    function loginWithGithub() {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`);
    }

    function logout() {
        localStorage.removeItem("accessToken");
        setAccessToken("");
        setUserData({});
    }

    return (
        <div>
            {accessToken ? (
                <>
                    <h1>We have the access token</h1>
                    <button onClick={logout}>Log out</button>

                    <h3>Get User Data from Github API</h3>
                    <button onClick={getUserData}>Get Data</button>

                    {Object.keys(userData).length > 0 && (
                        <h4>Hey there, {userData.login}</h4>
                    )}
                </>
            ) : (
                <>
                    <h3>User is not logged in</h3>
                    <button onClick={loginWithGithub}>Login with Github</button>
                </>
            )}
        </div>
    );
}

export default Login;
