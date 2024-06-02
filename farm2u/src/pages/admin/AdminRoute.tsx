import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import rotate from "@/resources/rotateyourscreenanimationblack.gif";
import styles from "@/styles/admin/indexpage.module.css";
import React from "react";
const AdminRoute = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const { data: session }: any = useSession();
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const session: any = await getSession();
      if (session && session.user && session.user.role === "seller") {
        setLoading(false);
      } else {
        router.push("/");
      }
    };

    checkSession();
  }, [router]);

  while (loading) {
    return <div></div>;
  }

  if (session && session.user && session.user.role === "seller") {
    return (
      <>
        <div className={styles.norotate}>{children}</div>
        <div className={styles.rotate}>
          <Image src={rotate} alt="" />
        </div>
      </>
    );
  }

  return null;
};

export default AdminRoute;
