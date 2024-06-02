import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import changePassstyles from "@/styles/user/user.module.css";
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import AdminRoute from "../AdminRoute";
import Admin from "..";
import styles from "@/styles/admin/admintable_managemnt.module.css";
import SellerNav from "../../../components/sellerNav";
import React from "react";
import { changePassword } from "@/Interfaces/user/changePassword";
const AdminPasswordChange = () => {
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
          <p><span>&#9888;</span>{`${" " + "Passwords doesn't match!"}`}</p>
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
                      <p><span>&#10004;</span>{`${" " + "Password changed succesfully"}`}</p>
                    ),
                  });
                } else {
                  setErrmsg({
                    oldPassErr: "",
                    notMatchErr: (
                      <p><span>&#9888;</span>{`${" " + "Something wen't wrong!"}`}</p>
                    ),
                  });
                }
              })
              .catch((err) => {
                setErrmsg({
                  oldPassErr: "",
                  notMatchErr: (
                    <p><span>&#9888;</span>{`${" " + "Something wen't wrong!"}`}</p>
                  ),
                });
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            setErrmsg({
              oldPassErr: (
                <p><span>&#9888;</span>{`${" " + "Old password doesn't match!"}`}</p>
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
          <p><span>&#9888;</span>{`${" " + "Something wen't wrong!"}`}</p>
        ),
      });
    }
    console.log(formData);
  };

  return (
    <AdminRoute>
      <Admin />
      <div className={"admin_nav_adjustment"}>
        <SellerNav />
        <div className={styles.changePassword}>
          <div className={changePassstyles.changePassword}>
            <h5>CHANGE PASSWORD</h5>
            <form
              className={changePassstyles.changePasswordForm}
              onSubmit={handleSubmit}
            >
              <label className={changePassstyles.changePasswordlabel}>
                Old password:
                <input
                  type="text"
                  className={changePassstyles.input}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  required
                />
              </label>
              {errmsg.oldPassErr}
              <label className={changePassstyles.changePasswordlabel}>
                New password:
                <input
                  type={checkConfirmPassword}
                  className={changePassstyles.input}
                  name="newPassword"
                  value={formData.newPassword}
                  onFocus={() => {
                    setCheckConfirmPassword("text");
                  }}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={changePassstyles.changePasswordlabel}>
                Confirm password:
                <input
                  type="password"
                  className={changePassstyles.input}
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
              <button
                type="submit"
                className={changePassstyles.changePasswordsubmit}
              >
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
    </AdminRoute>
  );
};
export default AdminPasswordChange;
