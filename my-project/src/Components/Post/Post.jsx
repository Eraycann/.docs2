import React, {useState, useRef, useEffect} from "react";
import {Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';
import Comment from "../Comment/Comment";
import CommentForm from "../Comment/CommentForm";
import { PostWithAuth, DeleteWithAuth } from "../../services/HttpService";

const useStyles = makeStyles((theme) => ({
    root: {
      width: 800,
      textAlign : "left",
      margin : 20
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    avatar: {
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    },
    link: {
        textDecoration : "none",
        boxShadow : "none",
        color : "white"
    }
  }));

function Post(props) {  // propsdan gelen verileri postun sahibinin verileridir.
   const {title, text, userId, userName, postId, likes} = props;
   const classes = useStyles();
   const [expanded, setExpanded] = useState(false);
   const [error, setError] = useState(null);
   const [isLoaded, setIsLoaded] = useState(false);
   const [commentList, setCommentList] = useState([]);
   const [isLiked, setIsLiked] = useState(false);
   const isInitialMount = useRef(true);   // sayfa ilk defa mı load ediliyor yoksa biri tıklayıpta commentleri açtı mı onu söyleyecektir.
//    useState: Durum değeri tutar ve bu değer değiştiğinde bileşeni yeniden render eder.
// useRef: Sabit bir referans veya değer tutar ve değiştiğinde bileşeni yeniden render etmez. Genellikle DOM referansları veya değerlerin saklanması için kullanılır.
  // currentUser'ın id'si elimizdeki likes listesinde varsa, çoktan beğenmişiz demektir, kalbi kırmızı yapcaz.   
   const [likeCount, setLikeCount] = useState(likes.length);
   const [likeId, setLikeId] = useState(null);
   const [refresh, setRefresh] = useState(false);
   // Bir user Login ise disabled True, değilse False
   // Post'ları listeleyen kişi Login olmadıysa, işlevini kesmek için lazım.
   // Login olduğumuzda Post, Comment, Like atma fonksiyonlarını getiriyoruz.
   let disabled = localStorage.getItem("currentUser") == null ? true:false;
   
   const setCommentRefresh = () => {
     setRefresh(true);
   }
   const handleExpandClick = () => {
     setExpanded(!expanded);
     refreshComments(); // ilgili yere tıklandığında handleExpandClick fonksiyonu refreshComments fonksiyonunu çağırsın istiyoruz.
     console.log(commentList);
   };

   // handleLike fonksiyonunu biz tanımladık
   const handleLike = () => {
    setIsLiked(!isLiked);
    if(!isLiked){
      saveLike();
      setLikeCount(likeCount + 1)
    }
    else{
      deleteLike();
      setLikeCount(likeCount - 1)
    }
      
   }
   
   // Çok benzediği için Home.jsx içerisindeki refreshPosts metodundan kopyaladık.
   // Like sayıları direkt yüklendiğinde gelecekken, comments'ler önden yüklenmeyecek.
   // tıklanıldığında databaseye istek atılacaktır.
   const refreshComments = () => {
    fetch("/api/comments?postId="+postId)
    .then(res => res.json())
    .then(
        (result) => {
            setIsLoaded(true);
            setCommentList(result)
        },
        (error) => {
            console.log(error)
            setIsLoaded(true);
            setError(error);
        }
    )

    setRefresh(false)
  }

  const saveLike = () => {
    PostWithAuth("/likes",{
      postId: postId, 
      userId : localStorage.getItem("currentUser"),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))

      /*
      fetch("/likes", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization" : localStorage.getItem("tokenKey")  // paketin headerına token ekledik.
        },
        body : JSON.stringify({
          postId : postId,
          userId  : userId,
        }),
      })
      .then(res) => res.json())
      .catch((err) => console.log(err))
      */
  }

  const deleteLike = () => {
/**
 * fetch("/likes/" + likedId, {
 * method: DELETE,
 *  headers: {
          "Content-Type" : "application/json",
          "Authorization" : localStorage.getItem("tokenKey")  // paketin headerına token ekledik.
        },
 * })
 *  // .then(res) => res.json())  // burayı kaldırdık çünkü Delete metodu void dönecektir ve void'i JSON'a çevirmediği için hata olacak.
 *  .catch(err) => console.log(err)
 */

    DeleteWithAuth("/likes/"+likeId)
      .catch((err) => console.log(err))
  }

  // Aktarılan PostResponse DTO içerisinde
  // postId, post>userId, post>userName, postTitle, postText, likes(likeId, like>userId, like>postId) mevcut.
  // checkLikes() metodu, likes listesini tarayıp, post>userId == likes>like>userId var mı bakcacaktır.
  
  // checkLikes fonksiyonu, likes listesinde localStorage içindeki mevcut kullanıcıya ait bir like olup olmadığını kontrol eder.
  // Eğer varsa, bu kullanıcının daha önce bu gönderiyi beğenip beğenmediğini belirler ve buna göre durumu günceller.
  const checkLikes = () => {
    // likes dizisinde, currentUser'ın id'si ile eşleşen bir like olup olmadığını kontrol eder
    var likeControl = likes.find((like =>  ""+like.userId === localStorage.getItem("currentUser")));
    
    // Eğer böyle bir like bulunursa
    if(likeControl != null){
        // Like'ın id'sini state'e set eder
        setLikeId(likeControl.id);
        // Kullanıcının bu post'u beğenip beğenmediğini belirtmek için state'i günceller
        setIsLiked(true);
    }
}


  // Like sayıları direkt yüklendiğinde gelecekken, comments'ler önden yüklenmeyecek.
  // tıklanıldığında databaseye istek atılacaktır.
  useEffect(() => {
    // Postların commentleri bir defaya mahsus refleshlenmesini istediğimiz için, if else mekanizması kullandık.
    if(isInitialMount.current)
      isInitialMount.current = false;
    else
      refreshComments();
  }, [refresh])

  useEffect(() => {checkLikes()},[])

   return(
           <Card className={classes.root}>
                <CardHeader
                    avatar={
                    <Link  className={classes.link} to={{pathname : '/users/' + userId}}>
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    </Link>
                    }
                    title={title}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                    {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  {
                  disabled 
                  ?             
// bir buton olduğu için onClick eventine handleLike diye bir fonksiyon tanımlayabiliyoruz       
                    <IconButton disabled  onClick={handleLike}  aria-label="add to favorites">
                    <FavoriteIcon style={isLiked? { color: "red" } : null} />
                    </IconButton> 
                  :
                    <IconButton onClick={handleLike} aria-label="add to favorites">
                    <FavoriteIcon style={isLiked? { color: "red" } : null} />
                    </IconButton>
                  }
                    {likeCount}
                    <IconButton className={clsx(classes.expand, { [classes.expandOpen]: expanded, })} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                      <CommentIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                {/* fixed prop'u, <Container> bileşeninin genişliğini sabitler, böylece içerik genişliği ekranın genişliğinden bağımsız olarak ayarlanır. */}
                    <Container fixed className = {classes.container}>
                    {
                    error
                    ? 
                      "error"
                    :
                      isLoaded
                      ? 
                        commentList.map(comment => (
                          <Comment userId = {comment.userId} userName = {comment.userName} text = {comment.text}></Comment>
                        )) 
                      : 
                        "Loading"
                    }
                    {
                    disabled
                    ?
                      ""
                      :
                      <CommentForm userId = {localStorage.getItem("currentUser")} userName = {localStorage.getItem("userName")} postId = {postId} setCommentRefresh={setCommentRefresh}></CommentForm>
                    }
                    </Container>
                </Collapse>
                </Card>
   )
}

export default Post;