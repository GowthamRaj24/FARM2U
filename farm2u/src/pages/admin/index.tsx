import AdminRoute from "./AdminRoute";
import styles from "@/styles/admin/indexpage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faShoppingCart,
  faNewspaper,
  faSignOutAlt,
  faVideo,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import logo from "@/resources/form2u_logo.jpg";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { NextSeo } from "next-seo";
const Admin = () => {
  const router = useRouter();
  return (
    <AdminRoute>
      <NextSeo
      title="Admin"
      nofollow={true}
      noindex={true}
    />
      <div className={styles.adminContainer}>
        <div className={styles.nav_btm}>
          <Image className={styles.logo} src={logo} alt="" />
          <ul className={styles.nav_ul}>
            <li
              className={`${styles.nav_li}`}
              onClick={() => {
                router.push("/admin/Dashboard");
              }}
            >
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span>Dashboard</span>
            </li>
            <li
              className={`${styles.nav_li}`}
              onClick={() => {
                router.push("/admin/products/Inventory");
              }}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>Products</span>
            </li>
            <li
              className={`${styles.nav_li}`}
              onClick={() => {
                router.push("/admin/ChangePassword");
              }}
            >
              <FontAwesomeIcon icon={faKey} />
              <span>Change password</span>
            </li>
            <li
              className={styles.nav_li}
              onClick={() => {
                signOut();
              }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;
