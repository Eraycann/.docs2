import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function Post() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);    // Data geldiğine, sayfa yüklenmede kalmadığına dair
    const [postList, setPostList] = useState([]);       // Gelen data aktarılacak
    
    useEffect(() => {
        fetch("/posts", {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('user:4b06ab86-27dd-477c-a699-1d67d04fa52c'),
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(
            (result) => {
                setIsLoaded(true);
                setPostList(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        );
    }, []);

    if (error) {                          // Error durumu
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {               // Loading durumu
        return <div>Loading...</div>;
    } else {
        return (
            <ul>
                {postList.map(post => (
                    <li key={post.id}>
                        {post.title} {post.text}
                    </li>
                ))}
            </ul>
        );
    }
}

export default Post;
