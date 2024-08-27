
import axios from "axios";
import App from '../../app/App';
require("dotenv").config();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const USERS_URL = BACKEND_URL + "/users";

export async function getStaticPaths() {
    const users = await axios.get(USERS_URL+"/names");
    return {
        paths: users.data.map(u=>{
          return {
            params:{
              user: u
            }
          }
        }),
        fallback: false,
    }
}

export async function login(username){
  try{
    const res = await axios.get(USERS_URL, {
      params:{
        username
      }
    });
    return res.data;
  }
  catch(error){
    return (await axios.post(USERS_URL, {username: username})).data;
  }
}

export async function getStaticProps({ params }) {
    const { user } = params;

    const user_data = await login(user);

    return {
      props: {
        user_id: user_data._id,
        initGrades: user_data.grades,
      },
    };
  }

  export default function LegalPage({ initGrades, user_id }) {
    return <App initGrades={initGrades} user_id={user_id}/>;
  }