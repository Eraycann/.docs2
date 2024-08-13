import React, {useState} from "react";
import {Link} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import MuiAlert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { PostWithAuth } from "../../services/HttpService";
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

function PostForm(props) {
    // Home componentden gelen userId userName birer değişkenken, refreshPost bir metottur 
   const {userId, userName, refreshPosts} = props;
   const classes = useStyles();
   const [text, setText] = useState("");
   const [title, setTitle] = useState("");
   const [isSent, setIsSent] = useState(false);

   const savePost = () => {
    PostWithAuth("/posts", {
      title: title, 
      userId : userId,
      text : text,
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
    }

//     savePost metonunun önceki hali
// const savePost = () => {
//     fetch("/posts",
//     {
//         method: "POST",
//         headers: {
//          // Karşı tarafa json göndereceğimizi belirttik.
//             "Content-Type": "application/json",
//         },
//             body: JSON.stringify({
//                 title: title,
//                 userId: userId,
//                 text: text,
//             }),
//         })
//         .then((res) => res.json())
//         .catch((err) => console.log(err))
//     }

   const handleSubmit = () => {
        savePost();
        setIsSent(true);
        setTitle("");   // submit ettiğimizde title ve text içeriğini siliyoruzki input alanları temizlensin.
        setText("");
        refreshPosts(); // Home.jsx altındaki refreshPost metodunu çağırdık. böylece postları tekrar çekebildik.
   }

   const handleTitle = (value) => {
    // Bu metot her çalıştığında Title güncellenir ve en son bu değerleri object halinde sunucuya post edicez.
       setTitle(value);
       setIsSent(false);
   }
   
   const handleText = (value) => {
    // Bu metot her çalıştığında Text güncellenir ve en son bu değerleri object halinde sunucuya post edicez.
       setText(value);
       setIsSent(false);
   }

   const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsSent(false);
  };

   return(
       <div>
        {/* post ettiğinde çıkçak kutucuk için  */}
       <Snackbar open={isSent} autoHideDuration={1200} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Your post is sent!
        </Alert>
      </Snackbar>
      <Card className={classes.root}>
                <CardHeader
                    avatar={
                    <Link  className={classes.link} to={{pathname : '/users/' + userId}}>
                    <Avatar aria-label="recipe" className={classes.avatar}>
                        {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    </Link>
                    }
                    // OutlinedInput etrafı kapalı içerisine text alabilen bir input
                    // id ise MaterialUL'nin default style'sını kullanmak için lazım
                    // multiline ile çok satırlı olabilir
                    // inputProps, bir form bileşenine (örneğin, bir metin kutusu) ekstra özellikler (props) eklemek için kullanılır.
                    // maxLength max krkter uzunluğu
                    // fullWidth, genellikle UI bileşenlerinin tüm genişliği kaplamasını sağlamak için kullanılır.
                    title= {<OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    placeholder = "Title"
                    inputProps = {{maxLength : 25}}
                    fullWidth
                    value = {title} // submit ettiğimizde title ve text içeriği temizleneceği için değerlerini title ve text den aldıkk.
                    /* Her tuş vuruşunda, Kullanıcının girdisini alır ve handleTitle metodu içerisine atar */
                    onChange = { (i) => handleTitle(i.target.value)}
                    >    
                    </OutlinedInput>}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                    <OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    placeholder = "Text"
                    inputProps = {{maxLength : 250}}
                    fullWidth
                    value = {text}
                    /* Her tuş vuruşunda, Kullanıcının girdisini alır ve handleText metodu içerisine atar */
                    onChange = { (i) => handleText(i.target.value)}
                   // 'endAdornment' prop'u ile input alanının sağ tarafına bir bileşen ekleniyor
                    endAdornment = {
                        // 'InputAdornment' bileşeni, input'un içine dekoratif bir öğe eklemek için kullanılıyor
                        <InputAdornment position="end">
                            {/* Bu 'Button' bileşeni, input alanının sağ tarafında görünecek bir buton oluşturuyor */}
                            <Button
                                // 'variant' prop'u butonun dolu stil almasını sağlıyor
                                variant="contained"
                                // Butonun arka planına linear gradient stil uygulanıyor, metin rengi beyaz yapılıyor
                                style={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    color: 'white'
                                }}
                                // Butona tıklandığında 'handleSubmit' fonksiyonu çağrılıyor
                                onClick={handleSubmit}
                            >
                                {/* Butonun üzerinde 'Post' metni gösteriliyor */}
                                Post
                            </Button>
                        </InputAdornment>
                    }
                    >    
                    </OutlinedInput>
                    </Typography>
                </CardContent>
                </Card>
       </div>
   )
}

export default PostForm;