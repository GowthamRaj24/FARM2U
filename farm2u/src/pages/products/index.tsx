import { useEffect, useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactStars from "react-stars";
import axios from "axios";
import Image from "next/image";
import styles from "@/styles/products.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { products } from "@/Interfaces/Products";
import { NextSeo } from "next-seo";
import banner from '@/resources/fandv.png'
import Head from "next/head";
const Products = () => {
  const [search, setSearch] = useState("");
  const [dataload, setDataLoad] = useState(false);
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const [productsData, setProductData] = useState<products[]>([]);
  const [category,setCategory]=useState("all");
  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        setProductData(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleCategory=async(e:any)=>{
    console.log(e.target.value)
    setCategory(e.target.value)
  }
  useEffect(()=>{
    if(category==="all"){
      axios
      .get("/api/products")
      .then((res) => {
        setProductData(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
    }
    else{
    axios
      .get(`/api/products/category/${category}`)
      .then((res) => {
        setProductData(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
    }
  },[category])
  const addToCart = async (productId: any) => {
    if (session) {
      setLoading((prevLoading) => ({
        ...prevLoading,
        [productId]: true,
      }));

      try {
        await axios.post("../api/cart/addToCart", {
          userId: session?.user?._id,
          productId,
        });
        console.log("Successfully added!");
        router.push("/Cart");
      } catch (err) {
        console.log("Something went wrong!");
      } finally {
        setLoading((prevLoading) => ({
          ...prevLoading,
          [productId]: false,
        }));
      }
    } else {
      router.push("/signup");
    }
  };const handleSearch = async (e:any) => {
    setSearch(e.target.value);
    console.log(e.target.value);
    const len = e.target.value.length;
    if (len > 0) {
      setDataLoad(true);
      await axios
        .get(`/api/products/search/${e.target.value}`)
        .then((res) => {
          setProductData(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setDataLoad(false);
        });
    } else {
      setDataLoad(true);
      axios
        .get(`/api/products`)
        .then((res) => {
          setDataLoad(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setDataLoad(false);
        });
    }
  };
  return (
    <>
    <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
      title="FORM2U - Products"
    />
      <div className={styles.products_container}>
      <div className={styles.search_under_gradient_div}>
        <div className={styles.banner_mainpage}>
          <Image src={banner} alt=""/>
        </div>
            <input
              type="text"
              placeholder="🔍 search"
              name="search"
              value={search}
              onChange={handleSearch}
              autoComplete="off"
            />
            <select name="category" onChange={handleCategory}>
              <option value="all">Shop by Category</option>
              <option value="all">All</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="dryfruits">Dryfruits</option>
              <option value="leafygreens">Leafygreens</option>
              <option value="spices">Spices</option>
            </select>
          </div>
        <div className={styles.products_page}>
          {productsData.length === 0
            ? [0, 1, 2, 3].map((item: any, Index: Number) => {
                return (
                  <div
                    className={styles.products_list_item_grid}
                    key={item._id}
                  >
                    <div className={styles.products_list_item_empty}>
                      <div
                        className={styles.products_list_item_image_empty}
                      ></div>
                      <div className={styles.products_list_items_content}>
                        <div className={styles.p_empty}></div>
                        <div className={styles.h_empty}></div>
                        <div className={styles.hs_empty}></div>
                        <div className={styles.p_empty}></div>
                        <button
                          className={styles.addtocart_products_empty}
                        ></button>
                      </div>
                      <p
                        className={styles.products_page_item_discounttag_empty}
                      ></p>
                    </div>
                  </div>
                );
              })
            : productsData.map((item: any, index: number) => {
                const reviews = item.comments;
                let ratingAddition = 0;
                reviews.forEach((comment: any) => {
                  ratingAddition += comment.rating;
                });
                let averageRating = 5;
                averageRating = ratingAddition / reviews.length;
                return (
                  <div
                    className={styles.products_list_item_grid}
                    key={item._id}
                  >
                    <div className={styles.products_list_item}>
                      <div className={styles.products_list_item_image}>
                        <Image
                          src={item.image1}
                          alt=""
                          width={5000}
                          height={5000}
                        />
                      </div>
                      <div className={styles.products_list_items_content}>
                        <p>{item.sellerName}</p>
                        <Link href={`/products/${item._id}`}>
                          <h3>{item.heading}</h3>
                        </Link>
                        <ReactStars
                          count={5}
                          size={24}
                          edit={false}
                          value={averageRating}
                          color2={"#ffd700"}
                        />
                        <h4>
                          <del>Rs. {item.price}</del> Rs.{" "}
                          {Math.floor(
                            item.price - (item.discount * item.price) / 100
                          )}
                        </h4>
                        {item?.qty < 1 ? (
                          <button className={styles.addtocart_products}>
                            OUT OF STOCK
                          </button>
                        ) : (
                          <button
                            className={styles.addtocart_products}
                            onClick={() => addToCart(item._id)}
                            disabled={loading[item._id]}
                          >
                            {loading[item._id] ? (
                              <FontAwesomeIcon
                              width={12}
                                icon={faSpinner}
                                className="fa-spin"
                              />
                            ) : (
                              "ADD TO CART"
                            )}
                          </button>
                        )}
                      </div>
                      <p className={styles.products_page_item_discounttag}>
                        -{item.discount}%
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};
export default Products;