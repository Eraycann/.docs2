import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";

function Post(){
    const [error, Error] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);    // data geldiğine, sayfa yüklenmede kalmadığına dair
    const [postList, setPostList] = useState([]);       // gelen data aktarılacak
    
    useEffect(() => {
        fetch("/posts")    // uzun tanımlamaktansa, package.json altında proxy tanımladık http..' faslını oraya yazdık.
        // fetch ettikten sonra gelen response'yi parse et
        .then(res => res.json())    
        .then(
            (result) => {
                setIsLoaded(true)
                setPostList(result)
            },
            (error) => {
                setIsLoaded(true)
                setError(error)
            }
        )
    }, [])

    if(error){                          // error durumu
        return <div>Errorr!!</div>
    } else if(isLoaded) {               // loading durumu
        return <div> Loading... </div>;
    } else {
        return(
            <ul>
                {postList.map(post => (
                    <li>
                        {post.title} {post.text}
                    </li>
                ))}
            </ul>
        );
    }
}

export default Post;