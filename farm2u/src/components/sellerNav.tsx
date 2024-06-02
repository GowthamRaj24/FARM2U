import { useSession } from "next-auth/react";
import styles from "@/styles/admin/adminnav.module.css";
import React from "react";
const SellerNav = () => {
  const { data: session } = useSession();
  return (
    <nav className={styles.adminnav}>
      <div className={styles.adminnav_div}>
        <h5>Hi seller &#128075;!</h5>
        <p>{session?.user?.email}</p>
      </div>
    </nav>
  );
};
export default SellerNav;
