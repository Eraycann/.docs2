import {React, useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import UserActivity from "../UserActivity/UserActivity";
import { makeStyles } from '@material-ui/core/styles';
import { GetWithAuth } from "../../Services/HttpService";
const useStyles = makeStyles({
    root: {
      display: "flex",
    },
  });

function User() {
    // kısmı, React Router DOM kütüphanesinde kullanılan useParams hook'unu kullanarak,
//  URL parametrelerinden userId adındaki parametreyi alır.

// Örneğin, bir URL şu şekilde olabilir: http://example.com/users/123.
//  Bu durumda, userId değeri 123 olacaktır.
//  useParams hook'u URL'deki dinamik parametreleri okur ve bir obje olarak döndürür.
//  { userId } şeklinde objeden çıkarım yapılarak,
//  userId parametresi User bileşeni içinde kullanılabilir hale gelir.
    const { userId} = useParams();
    const classes = useStyles();
    const [user, setUser] = useState();
    
    const getUser = () => {
        GetWithAuth("/users/"+userId)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                setUser(result);
            },
            (error) => {
                console.log(error)
            }
        )
        }

        useEffect(() => {
            getUser()
        }, [])

    return(
        <div className={classes.root}>
            {/* Avatar içine userId yollandı ki içerde login olmuş userId ile kıyaslanacak */}
            {/* Bu sayede başka biri diğerinin avatarını değiştiremeycek ve aktivitelerini değiştiremeyecek */}
            {user? <Avatar avatarId={user.avatarId} userId={userId} userName={user.userName}/> : "" }
            {localStorage.getItem("currentUser") == userId ?<UserActivity userId={userId} /> : ""}
        </div>
    )
}

export default User;