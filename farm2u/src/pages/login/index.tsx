import Link from "next/link";
import React from "react";
import axios, { AxiosError } from "axios";
import styles from "@/styles/signup.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { loginUser } from "../../../helpers";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { NextSeo } from "next-seo";
import sigup_farm from '@/resources/sigup_farm.jpg'
import form2u_logo from '@/resources/form2u_logo.jpg'
const Login = () => {
  const router = useRouter();
  const [changeLoad, setChangeLoad] = useState(false);
  const { data: session, status } = useSession();
  const [showpass, setShowpass] = useState("password");
  const [user, setUser]: any = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);
  const [errmsg, setErrmsg]: any = useState({
    email_error: "",
    username_and_password_error: "",
  });
  const handlechange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setChangeLoad(true);
      const email = user.email;
      const password = user.password;
      const loginRes = await loginUser({ email, password });
      if (loginRes && !loginRes.ok) {
        setChangeLoad(false);
        setErrmsg({
          usernameerr: "",
          username_and_password_error: (
            <p>
              <span>&#9888;</span>
              {`${" " + "Email or Password Incorrect"}`}
            </p>
          ),
        });
      } else {
        router.push("/");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setChangeLoad(false);
        const errorMsg = err.response?.data?.error;
        setErrmsg({
          usernameerr: "",
          username_and_password_error: (
            <p>
              <span>&#9888;</span>
              {`${" " + "Something went wrong!"}`}
            </p>
          ),
        });
      }
    }
  };
  return (
    <>
     <NextSeo
      title="Login"
    />
      <Loader time={500} />
      <div className={styles.signuppage}>
      <Image src={sigup_farm} alt=""/>
      <form className={styles.signupform} onSubmit={handleSubmit}>
        <Image className={styles.signup_logo} src={form2u_logo} alt=""/>
        <h3>Welcome back, Sign in</h3>
        <p>Email</p>
        <input
          type="email"
          name="email"
          placeholder="eg. Ravikumar@gmail.com"
          value={user.email}
          onChange={handlechange}
          required
        />
        <p>{errmsg.email_error}</p>
        <p>Password</p>
        <input
          type={`${showpass}`}
          name="password"
          placeholder="eg. Ravi@1456"
          value={user.password}
          onChange={handlechange}
          required
        />
        <p>{errmsg.username_and_password_error}</p>
        <div className={styles.show_pass_signup}>
          <input
            type="checkbox"
            onChange={() => {
              if (showpass === "password") {
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
        <p>
          <Link href="/forgotpassword">forgot password?</Link>
        </p>
        <p className={styles.loginredirection}>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </p>
      </form>
      </div>
    </>
  );
};
export default Login;
