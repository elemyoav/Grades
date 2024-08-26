
import axios from "axios";
import App from './App';
// const BACKEND_URL = process.env.BACKEND_URL || "http://backend:3001";
const GRADES_URL = "http://backend:3001" + "/grades";

export async function getStaticPaths() {
    return {
        paths: [
          {
            params: {
              user: 'elem',
            },
          }, // See the "paths" section below
        ],
        fallback: false,
    }
}

export async function getStaticProps({ params }) {
    const { user } = params;

    const grades = (await axios.get(GRADES_URL)).data

    return {
      props: {
        user,
        grades,
      },
    };
  }

  export default function LegalPage({ user, grades }) {
    return <App initGrades={grades} user={user}/>;
  }