import React, {useState, useEffect} from "react";
import Post from '../Post/Post';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PostForm from "../Post/PostForm";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent : "center",
        alignItems : "center",
        backgroundColor: '#f0f5ff',
    }
}));

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);
    const classes = useStyles();

    // PostForm.jsx'den bir post eklediğimiz zaman postların renderlenmesi için oluşturduk.
    const refreshPosts = () => {
        fetch("/api/posts")
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setPostList(result)
            },
            (error) => {
                console.log(error)
                setIsLoaded(true);
                setError(error);
            }
        )
    }

    // useEffect ikinci parametresi [] bağımlılık dizisidir. 
    // boş ise [] sayfa ilk yüklendiğinde çalışır ve dhaada çalışmaz. 
    // bağımlılık eklendiğinde o bağımlılık değiştiğinde çalışır.
    // kodun ilk hallerinde [postList] şeklindeydi.
    useEffect(() => {
        refreshPosts()
    }, [])

    if(error) {
        return <div> Error !!!</div>;
    } else if(!isLoaded) {
        return <div> Loading... </div>;
    } else {
        return(
            // localStorage de currentUser kayıtlı değilse, postForm renderlanmasın
            <div className = {classes.container}>
                {
                localStorage.getItem("currentUser") == null 
                ? 
                     "" 
                :
                    <PostForm userId = {localStorage.getItem("currentUser")} userName = {localStorage.getItem("userName")}  refreshPosts = {refreshPosts}/>}
                    {postList.map(post => (
                        <Post likes = {post.postLikes} postId = {post.id} userId = {post.userId} userName = {post.userName}  
                        title={post.title} text={post.text}></Post>
                    ))
                }
            </div>
        );
    }
}

export default Home;