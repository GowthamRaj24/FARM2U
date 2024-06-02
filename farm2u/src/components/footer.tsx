import Image from "next/image";
import styles from "@/styles/footer.module.css";
import logo from "@/resources/genmatrixwhitelogo.png";
import React from "react";
import Link from "next/link";
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.footer_container}>
      <div className={styles.footer_top}>
        <h1 className={styles.heading_logo}>FORM2U</h1>
        <div className={styles.quicklinks}>
          <p className={styles.heading}>Quick Pages</p>
          <ul>
            <li>
              <Link href={"/"}>HOME</Link>
            </li>
            <li>
              <Link href={"/contactus"}>CONTACT US</Link>
            </li>
            <li>
              <Link href={"/login"}>SIGNUP</Link>
            </li>
            <li>
              <Link href={"/signup"}>LOGIN</Link>
            </li>
          </ul>
        </div>
        <div className={`${styles.quicklinks} ${styles.contactus}`}>
          <p className={styles.heading}>Contact us</p>
          <p>
            GITAM UNIVERSITY. NH 207, Nagadenehalli Doddaballapur, taluk, Bengaluru, Karnataka 561203
          </p>
          <p>
            For any consumer complaints, queries and feedback, contact our
            customer care executive on above manufacturer's address or{" "}
            <a href="tel:9999999999">9999999999</a> |{" "}
            <a href="mailto:farm2uwebapp@gmail.com">farm2uwebapp@gmail.com</a>
          </p>
        </div>
        <div className={styles.quicklinks}>
          <iframe
            className={styles.contactusmap}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248656.72720345494!2d77.41768331094438!3d13.145906951428493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3df04c9efe91%3A0x74ef0f7e2f81d564!2sGitam%20University%20Bengaluru!5e0!3m2!1sen!2sin!4v1695906688724!5m2!1sen!2sin"
            width="600"
            height="450"
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <div className={styles.footer_btm}>
        <p>© 2023 , FARM2U</p>
        <p className={styles.gototop} onClick={scrollToTop}>
          Go to Top
        </p>
      </div>
    </div>
  );
};
export default Footer;
