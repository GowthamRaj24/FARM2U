import Link from "next/link";
import axios, { AxiosError } from "axios";
import Footer from "../../components/footer";
import Nav from "../../components/nav";
import styles from "@/styles/signup.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { NextSeo } from "next-seo";
const Forgotpassword = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checkConfirmPassword, setCheckConfirmPassword] = useState("text");
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [otpLoad, setOtpLoad] = useState(false);
  const [changeLoad, setChangeLoad] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [formData, setFormData]: any = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);
  const [errmsg, setErrmsg]: any = useState({
    emailerr: "",
    otperr: "",
    passerr: "",
  });
  const handlechange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const otpInputsRef = useRef<HTMLInputElement[]>([]);
  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOTP(updatedOTP);

    if (value.length > 0 && index < otp.length - 1) {
      const nextInput = otpInputsRef.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    } else if (value.length === 0 && index > 0) {
      const prevInput = otpInputsRef.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  const getOtp = async () => {
    try {
      setOtpLoad(true);
      await axios
        .post("/api/SMTP/ForgotPassword", { email: formData.email })
        .then((res) => {
          setOtpLoad(false);
          setErrmsg({
            emailerr: (
              <p>
                <span>✅</span>
                {`${" " + "Otp sent to your email"}`}
              </p>
            ),
            otperr: "",
            passerr: "",
          });
          setCheckEmail(true);
        })
        .catch((err) => {
          if (
            err.response.data &&
            err.response.data.emailerr === "Email does not exist."
          ) {
            setErrmsg({
              emailerr: (
                <p>
                  <span>&#9888;</span>
                  {`${" " + "Email does not exist! Create a account"}`}
                </p>
              ),
              otperr: "",
              passerr: "",
            });
          } else {
            setErrmsg({
              emailerr: (
                <p>
                  <span>&#9888;</span>
                  {`${" " + "Something gone wrong! Try again later"}`}
                </p>
              ),
              otperr: "",
              passerr: "",
            });
          }
        })
        .finally(() => {
          setOtpLoad(false);
        });
    } catch (err) {
      setErrmsg({
        emailerr: (
          <p>
            <span>&#9888;</span>
            {`${" " + "Something gone wrong! Try again later"}`}
          </p>
        ),
        otperr: "",
      });
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (formData.newPassword.length < 8) {
        setErrmsg({
          emailerr: "",
          otperr: "",
          passerr: (
            <p>
              <span>&#9888;</span>Password should contain atleast 8 characters{" "}
            </p>
          ),
        });
        return;
      }
      if (formData.newPassword === formData.confirmPassword) {
        const data = {
          email: formData.email,
          otp: otp.join(""),
          newPassword: formData.newPassword,
        };
        setChangeLoad(true);
        await axios
          .patch("/api/changePassword/Otp", data)
          .then((res) => {
            router.push("/login");
            setChangeLoad(false);
          })
          .catch((err) => {
            if (err.response.data && err.response.data.someerr === "otperr") {
              setErrmsg({
                emailerr: "",
                otperr: (
                  <p>
                    <span>&#9888;</span> Otp is wrong or expired!{" "}
                  </p>
                ),
                passerr: "",
              });
            } else {
              setErrmsg({
                emailerr: "",
                otperr: (
                  <p>
                    <span>&#9888;</span> Something gone wrong! Try again later{" "}
                  </p>
                ),
                passerr: "",
              });
            }
          })
          .finally(() => {
            setChangeLoad(false);
          });
      } else {
        setErrmsg({
          emailerr: "",
          otperr: "",
          passerr: (
            <p>
              <span>&#9888;</span>
              {`${" " + "Passwords doesn't match!"}`}
            </p>
          ),
        });
      }
    } catch (err) {
      setErrmsg({
        emailerr: "",
        otperr: "",
        passerr: (
          <p>
            <span>&#9888;</span>
            {`${" " + "Something gone wrong! Try again later"}`}
          </p>
        ),
      });
    }
  };
  return (
    <div>
      <NextSeo
      title="Forgot password"
      nofollow={true}
      noindex={true}
    />
      <Nav />
      <form className={styles.signupform} onSubmit={handleSubmit}>
        <h3>FORGOT PASSWORD</h3>
        <p>Email</p>
        <input
          type="email"
          name="email"
          placeholder="eg. Ravikumar@gmail.com"
          value={formData.email}
          onChange={handlechange}
        />
        <p>{errmsg.emailerr}</p>
        <button onClick={getOtp}>
          {otpLoad ? (
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
          ) : (
            <>Get otp</>
          )}
        </button>
        <p>Enter OTP:</p>
        <div className={styles.otp}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(e, index)}
              required
              ref={(el) => {
                otpInputsRef.current[index] = el!;
              }}
            />
          ))}
        </div>
        <p>{errmsg.otperr}</p>
        <p>New password:</p>
        <input
          type={checkConfirmPassword}
          className={styles.input}
          name="newPassword"
          value={formData.newPassword}
          onFocus={() => {
            setCheckConfirmPassword("text");
          }}
          onChange={handlechange}
          required
        />
        <p>Confirm password:</p>
        <input
          type="password"
          className={styles.input}
          name="confirmPassword"
          value={formData.confirmPassword}
          onFocus={() => {
            setCheckConfirmPassword("password");
          }}
          onChange={handlechange}
          required
        />
        <p>{errmsg.passerr}</p>
        <button type="submit" disabled={!checkEmail}>
          {changeLoad ? (
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
          ) : (
            <>Submit</>
          )}
        </button>
      </form>
      <Footer />
    </div>
  );
};
export default Forgotpassword;
