import Head from "next/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import Loader from "../components/loader";
import styles from "@/styles/home.module.css";
import Image from "next/image";
import img_use1 from '@/resources/img_use1.png'
import img_use2 from '@/resources/img_use2.png'
import vegetables from '@/resources/vegetables.png'
import fruits from '@/resources/fruits.png'
import spices from '@/resources/spices.png'
import leafygreens from '@/resources/leafygreens.png'
import dryfruits from '@/resources/dryfruits.png'
import scroll from '@/resources/scroll_.gif'
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Products from "./products";
import Link from "next/link";
import { useSession } from "next-auth/react";
export default function Home() {
  const [user,setuser]=useState(false);
  const { data: session }: any = useSession();
  const router: any = useRouter();
  useEffect(()=>{
    console.log(session)
    if(session)setuser(true);
  },[session])
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title="FORM2U"
      />
      <main>
        <Loader time={1000} />
        <div className={styles.entire_landing_page}>
          <Nav />
          <div className={styles.landing_scene}>
            <div className={styles.categories_divs}>
              <div className={styles.categories_div}>
                <Image src={vegetables} alt="" />
                <p>Vegetables</p>
              </div>
              <div className={styles.categories_div}><Image src={fruits} alt="" />
                <p>Fruits</p>
              </div>
              <div className={styles.categories_div}><Image src={dryfruits} alt="" />
                <p>Dryfruits</p></div>
              <div className={styles.categories_div}><Image src={spices} alt="" />
                <p>Spices</p></div>
              <div className={styles.categories_div}><Image src={leafygreens} alt="" />
                <p>Leafygreens</p></div>
            </div>
            <div className={styles.landing_scene_heading}>
              <h3>WELCOME TO FRESH <span className={styles.landing_scene_span}>&</span> PURE</h3>
              <h1>FARM TO YOU <span className={styles.landing_scene_span}>MARKET</span></h1>
              {!user ? (<div className={styles.landing_scene_buttons}>
                <button className={styles.landing_scene_button1} onClick={()=>{router.push('/login')}}>LOGIN</button>
                <button className={styles.landing_scene_button2} onClick={()=>{router.push('/signup')}}>SIGNUP</button>
              </div>) :
                <div className={styles.landing_scene_buttons}>
                  <button className={styles.landing_scene_button1} onClick={()=>{router.push('/user')}}>DASHBOARD</button>
                </div>}
            </div>
            <Image className={styles.landing_scene_img2} src={scroll} alt="" />
            <Image className={styles.landing_scene_img} src={img_use1} alt="" />
            <Image className={styles.landing_scene_img1} src={img_use2} alt="" />
          </div>
          <Products />
          <div className={styles.contact_us_banner}>
            <div className={styles.contact_us_banner_block}>
              <h3>We'd love to hear from you</h3>
              <p>
                whether you had a question about product, pricing, or anything
                else, we are ready to answer all your questions.
              </p>
              <Link href="/contactus">
                <button>Contact us</button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
