import Footer from "../../components/footer";
import Nav from "../../components/nav";
import styles from "@/styles/user/user.module.css";
import Usernav from "./Usernav";
import { Usercheck } from "../../../helpers/check";
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { changePassword } from "@/Interfaces/user/changePassword";
const ChangePassword = () => {
  Usercheck();
  const { data: session }: any = useSession();
  const [checkConfirmPassword, setCheckConfirmPassword] = useState("text");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<changePassword>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errmsg, setErrmsg]: any = useState({
    oldPassErr: "",
    notMatchErr: "",
  });
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setErrmsg({
        oldPassErr: "",
        notMatchErr: (
          <p>
            <span>&#9888;</span>
            {`${" " + "Passwords doesn't match!"}`}
          </p>
        ),
      });
      return;
    }
    try {
      setLoading(true);
      axios
        .post(`/api/changePassword/${session?.user?._id}`, {
          oldPassword: formData.oldPassword,
        })
        .then((res) => {
          if (res.data.success) {
            setErrmsg({
              oldPassErr: "",
              notMatchErr: "",
            });
            axios
              .patch(`/api/changePassword/${session?.user?._id}`, {
                newPassword: formData.newPassword,
              })
              .then((res) => {
                if (res.data.success) {
                  setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setErrmsg({
                    oldPassErr: "",
                    notMatchErr: (
                      <p>
                        <span>&#10004;</span>
                        {`${" " + "Password changed succesfully"}`}
                      </p>
                    ),
                  });
                } else {
                  setErrmsg({
                    oldPassErr: "",
                    notMatchErr: (
                      <p>
                        <span>&#9888;</span>
                        {`${" " + "Something wen't wrong!"}`}
                      </p>
                    ),
                  });
                }
              })
              .catch((err) => {
                setErrmsg({
                  oldPassErr: "",
                  notMatchErr: (
                    <p>
                      <span>&#9888;</span>
                      {`${" " + "Something wen't wrong!"}`}
                    </p>
                  ),
                });
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            setErrmsg({
              oldPassErr: (
                <p>
                  <span>&#9888;</span>
                  {`${" " + "Old password doesn't match!"}`}
                </p>
              ),
              notMatchErr: "",
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      setErrmsg({
        oldPassErr: "",
        notMatchErr: (
          <p>
            <span>&#9888;</span>
            {`${" " + "Something wen't wrong!"}`}
          </p>
        ),
      });
    }
    console.log(formData);
  };

  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.block}>
          <Usernav />
          <div className={styles.right_block}>
            <div className={styles.changePassword}>
              <h5>CHANGE PASSWORD</h5>
              <form
                className={styles.changePasswordForm}
                onSubmit={handleSubmit}
              >
                <label className={styles.changePasswordlabel}>
                  Old password:
                  <input
                    type="text"
                    className={styles.input}
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    required
                  />
                </label>
                {errmsg.oldPassErr}
                <label className={styles.changePasswordlabel}>
                  New password:
                  <input
                    type={checkConfirmPassword}
                    className={styles.input}
                    name="newPassword"
                    value={formData.newPassword}
                    onFocus={() => {
                      setCheckConfirmPassword("text");
                    }}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label className={styles.changePasswordlabel}>
                  Confirm password:
                  <input
                    type="password"
                    className={styles.input}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onFocus={() => {
                      setCheckConfirmPassword("password");
                    }}
                    onChange={handleChange}
                    required
                  />
                </label>
                <p>{errmsg.notMatchErr}</p>
                <button type="submit" className={styles.changePasswordsubmit}>
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                  ) : (
                    "Change Password"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;
