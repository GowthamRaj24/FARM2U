import Link from "next/link";
import axios from "axios";
import Footer from "../../components/footer";
import Nav from "../../components/nav";
import styles from "@/styles/signup.module.css";
import Image from "next/image";
import React from "react";
import successlogo from "@/resources/successicon.png";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import buyer from '@/resources/buyer.png'
import seller from '@/resources/seller_.png'
import sigup_farm from '@/resources/sigup_farm.jpg'
import form2u_logo from '@/resources/form2u_logo.jpg'
import { NextSeo } from "next-seo";
const Signup = () => {
  const { data: session, status } = useSession();
  const [changeLoad, setChangeLoad] = useState(false);
  const router = useRouter();
  const [roleSelection,setRoleSelection]=useState(false)
  const [showpass, setShowpass] = useState("password");
  const [redirection_login, setRedirection_login]: any = useState("");
  const [responseerr, setResponseerr]: any = useState({
    emailerr: "",
    passerr: "",
  });
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role:""
  });
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);
  const handlechange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const redirect_now = () => {
    router.push({
      pathname: "/login",
    });
  };
  const userSubmit = async (e: any) => {
    e.preventDefault();
    console.log(user);
    if (user.password.length < 8) {
      setResponseerr({
        passerr: (
          <p>
            <span>&#9888;</span>Password should contain atleast 8 characters{" "}
          </p>
        ),
      });
      return;
    }
    setChangeLoad(true);
    await axios
      .post("../api/User", user)
      .then((res) => {
        console.log(res.data.token);
        setRedirection_login(
          <div className={styles.loginalert}>
            <div className={styles.login_redirection}>
              <Image src={successlogo} alt="" />
              <p>Your account has been created successfully!</p>
              <button onClick={redirect_now}>Next →</button>
            </div>
          </div>
        );
        setChangeLoad(false);
      })
      .catch((err) => {
        let errresponse = err.response.data;
        if (errresponse === "emailerror") {
          setResponseerr({
            emailerr: (
              <p>
                <span>&#9888;</span>Email already exist!{" "}
              </p>
            ),
          });
        }
        else{
          setResponseerr({
            emailerr: (
              <p>
                <span>&#9888;</span>Something gone wrong!{" "}
              </p>
            ),
          });
        }
      })
      .finally(async() => {
      await axios
      .post("../api/notifyemails", { email: user.email })
      .then((res) => {
        console.log("Successfully registered!");
      })
      .catch((err) => {
        console.log("Already registered!");
      })
        setChangeLoad(false);
      });
  };
  return (
    <>
    <NextSeo
      title="Signup"
      nofollow={true}
      noindex={true}
    />
      <Loader time={500} />
      {roleSelection?<></>:<div className={styles.role_selection}>
        <h2>Select your role</h2>
      <div className={styles.role_question}>
        <button className={styles.role_question_divs} onClick={()=>{
          setUser({ ...user, role:"seller" });
          setRoleSelection(true);
        }}>
          <Image className={styles.role_question_divs_img} src={seller} alt=""/>
          <h3>Sales Man</h3>
        </button>
        <button className={styles.role_question_divs} onClick={()=>{
          setUser({ ...user, role:"user" });
          setRoleSelection(true);
        }}>
          <Image className={styles.role_question_divs_img}src={buyer} alt=""/>
          <h3>Buyer</h3>
        </button>
      </div>
      </div>}
      <div className={styles.signuppage}>
      <Image src={sigup_farm} alt=""/>
      <form className={styles.signupform} onSubmit={userSubmit}>
        <Image className={styles.signup_logo} src={form2u_logo} alt=""/>
        <h3>Welcome to Farm2U where we sell directly from farms.</h3>
        <p>First Name</p>
        <input
          type="text"
          name="firstname"
          placeholder="eg. Ravi"
          value={user.firstname}
          onChange={handlechange}
          required
        />
        <p>Last Name</p>
        <input
          type="text"
          name="lastname"
          placeholder="eg. Kumar"
          value={user.lastname}
          onChange={handlechange}
          required
        />
        <p>Email</p>
        <input
          type="email"
          name="email"
          placeholder="eg. Ravikumar@gmail.com"
          value={user.email}
          onChange={handlechange}
          required
        />
        <p className="responseerr">{responseerr.emailerr}</p>
        <p>Password</p>
        <input
          type={`${showpass}`}
          name="password"
          placeholder="eg. Ravi@1456"
          value={user.password}
          onChange={handlechange}
          required
        />
        <p className="responseerr">{responseerr.passerr}</p>
        <div className={styles.show_pass_signup}>
          <input
            type="checkbox"
            onChange={() => {
              if (showpass == "password") {
                setShowpass("text");
              } else {
                setShowpass("password");
              }
            }}
          />
          <p>Show password</p>
        </div>
        <button type="submit">
          {changeLoad ? (
            <FontAwesomeIcon width={14} icon={faSpinner} className="fa-spin" />
          ) : (
            <>Submit</>
          )}
        </button>
        <p className={styles.loginredirection}>
          Already have an account ? <Link href="/login">Log in</Link>
        </p>
      </form>
      {redirection_login}
      </div>
    </>
  );
};
export default Signup;
