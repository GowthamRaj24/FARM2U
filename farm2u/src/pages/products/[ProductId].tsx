import React from "react";
import { useRouter } from "next/router";
import Footer from "../../components/footer";
import Nav from "../../components/nav";
import { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import emptyimage from "@/resources/emptyimage.png";
import styles from "@/styles/detailedproducts.module.css";
import ReactStars from "react-stars";
import axios from "axios";
import loaderimage from "@/resources/genmatrixlogo2.png";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ProductData, Comment } from "@/Interfaces/Products";
import Custom404 from "../404";
import { NextSeo } from "next-seo";
const DetailedProduct = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  let ProductId = router.query.ProductId;
  const [checkId, setCheckId] = useState(false);
  const [productData, setProductData] = useState<ProductData | undefined>();
  const [rating, setRating] = useState(5);
  const [imageSlideshow, setImageSlideshow]: any = useState({
    img1: emptyimage,
    img2: emptyimage,
    img3: emptyimage,
    img4: emptyimage,
  });
  const [mainImage, setMainImage] = useState(imageSlideshow.img1);
  const [pageComments, setPageComments] = useState<Comment[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };
    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.pageYOffset;
      const threshold = 400;
      if (scrollHeight > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const fetchData = async () => {
    if (ProductId) {
      await axios
        .get<ProductData>(`../api/products/${ProductId}`)
        .then((res) => {
          setProductData(res.data);
          setImageSlideshow({
            img1: res.data.image1,
            img2: res.data.image2,
            img3: res.data.image3,
            img4: res.data.image4,
          });
          setMainImage(res.data.image1);
          setPageComments(res.data.comments.reverse());
          const reviews = res.data.comments;
          if (reviews.length === 0) {
            setRating(0);
            return;
          }
          let ratingAddition = 0;
          reviews.forEach((comment: Comment) => {
            ratingAddition += comment.rating;
          });
          const averageRating = ratingAddition / reviews.length;
          setRating(averageRating);
        })
        .catch((err) => {
          console.log("Something went wrong!");
          if (err.response.data === "iderror") {
            setCheckId(true);
          }
        });
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
  useEffect(() => {
    fetchData();
  }, [ProductId, reducerValue]);
  const [commentingState, setCommentingState] = useState(true);
  const [newComment, setNewComment] = useState<Comment>({
    name: "",
    rating: 5,
    comment: "",
    publishDate: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  };
  const ratingChanged = (newRating: number) => {
    setNewComment({ ...newComment, rating: newRating });
  };
  const userSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .post(`../api/products/${ProductId}`, newComment)
      .then((res) => {
        forceUpdate();
        setCommentingState(false);
        setNewComment({ name: "", rating: 5, comment: "", publishDate: "" });
        axios.post("/api/SMTP/ProductComment", {
          name: newComment.name,
          comment: newComment.comment,
          Productid: ProductId,
          Producttitle: productData?.heading,
          rating: newComment.rating,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addToCart = async (productId: string) => {
    if (session) {
      await axios
        .post("../api/cart/addToCart", {
          userId: session.user?._id,
          productId: productId,
        })
        .then((res) => {
          console.log("Successfully added!");
        })
        .catch((err) => {
          console.log("Something went wrong!");
        });
    } else {
      router.push("/signup");
    }
  };
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextSeo
        title={productData?.heading}
      />
      {checkId ? <Custom404 /> : <></>}
      {isLoading && productData ? (
        <>
          {isVisible ? (
            <div className={styles.bottom_bar}>
              <div className={styles.bottom_bar_container}>
                <div className={styles.bottom_bar_container_left}>
                  <Image
                    src={imageSlideshow.img1}
                    onClick={() => {
                      setMainImage(imageSlideshow.img1);
                    }}
                    alt=""
                    width={1000}
                    height={1000}
                  />
                  <div>
                    <h6 className={styles.mobile_display}>
                      {productData?.heading}
                    </h6>
                    <h6 className={styles.desktop}>
                      {productData?.heading.slice(0, 20)}...
                    </h6>
                    <p>
                      M.R.P.: <del>Rs. {productData?.price}</del>
                      <span className={styles.showcasing_discountprice}>
                        Rs.{" "}
                        {productData?.price -
                          (productData?.discount * productData?.price) / 100}
                      </span>
                    </p>
                  </div>
                </div>
                {productData?.qty < 1 ? (
                  <button>Out of stock</button>
                ) : (
                  <button
                    onClick={() => {
                      addToCart(productData?._id);
                      router.push("/Cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                )}
              </div>
            </div>
          ) : null}
          <Nav />
          <div className={styles.detailed_product_page}>
            <div className={styles.detailedproduct_main_content}>
              <div className={styles.imageshow_block}>
                <div className={styles.imageshow_block_left}>
                  <div className={styles.imageshow_block_left_images}>
                    <Image
                      style={{ width: "100%", height: "auto" }}
                      src={`${imageSlideshow.img1}`}
                      onClick={() => {
                        setMainImage(imageSlideshow.img1);
                      }}
                      alt=""
                      width={5000}
                      height={5000}
                    />
                  </div>
                  <div className={styles.imageshow_block_left_images}>
                    <Image
                      style={{ width: "100%", height: "auto" }}
                      src={imageSlideshow.img2}
                      onClick={() => {
                        setMainImage(imageSlideshow.img2);
                      }}
                      alt=""
                      width={5000}
                      height={5000}
                    />
                  </div>
                  <div className={styles.imageshow_block_left_images}>
                    <Image
                      style={{ width: "100%", height: "auto" }}
                      src={imageSlideshow.img3}
                      onClick={() => {
                        setMainImage(imageSlideshow.img3);
                      }}
                      alt=""
                      width={5000}
                      height={5000}
                    />
                  </div>
                  <div className={styles.imageshow_block_left_images}>
                    <Image
                      style={{ width: "100%", height: "auto" }}
                      src={imageSlideshow.img4}
                      onClick={() => {
                        setMainImage(imageSlideshow.img4);
                      }}
                      alt=""
                      width={5000}
                      height={5000}
                    />
                  </div>
                </div>
                <div className={styles.imageshow_block_right}>
                  <Image src={mainImage} alt="" width={5000} height={5000} />
                </div>
              </div>
              <div className={styles.detailedproduct_main_details}>
                <h5>{productData?.heading}</h5>
                <h6>
                  M.R.P.: <del>Rs. {productData?.price}</del>{" "}
                  <span className={styles.showcasing_discountprice}>
                    Rs.{" "}
                    {productData?.price -
                      (productData?.discount * productData?.price) / 100}
                  </span>
                </h6>
                <p>(inclusive of all taxes)</p>
                <div className={styles.review_side_num}>
                  <ReactStars
                    count={5}
                    size={24}
                    edit={false}
                    value={rating}
                    color2={"#ffd700"}
                  />
                  <p>{Math.round(rating * 10) / 10}/5</p>
                </div>
                <p>
                  {" "}
                  &#128525; Yay! You saved Rs.{" "}
                  {(productData?.discount * productData?.price) / 100}
                </p>
                {productData?.qty < 1 ? (
                  <button>Out of stock</button>
                ) : (
                  <button
                    onClick={() => {
                      addToCart(productData?._id);
                      router.push("/Cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                )}
                <div className={styles.maufactured_and_marketed}>
                  <h6>Manufactured & Marketed by :</h6>
                  <p>
                   FARM2UNH 207, Nagadenehalli Doddaballapur, taluk, Bengaluru, Karnataka 561203
                  </p>
                  <p>
                    For any consumer complaints, queries and feedback, contact our
                    customer care executive on above manufacturer's address or{" "} 9999999999 |{" "} farm2uwebapp@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.description}>
              <h4>PRODUCT DESCRIPTION</h4>
              <p>
                <div
                  className={styles.detailedproduct_main_content_div}
                  dangerouslySetInnerHTML={{
                    __html: productData?.description || "",
                  }}
                />
              </p>
            </div>
            <div className={styles.blog_comment_section}>
              <h5 className={styles.comment_section_heading}>Reviews</h5>
              {commentingState ? (
                <></>
              ) : (
                <button
                  className={styles.comment_section_addacomment}
                  onClick={() => {
                    setCommentingState(!commentingState);
                  }}
                >
                  Add a comment
                </button>
              )}
              {commentingState ? (
                <form className={styles.blogcommentform} onSubmit={userSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newComment.name}
                    onChange={handleChange}
                    required
                  />
                  <ReactStars
                    count={5}
                    size={24}
                    onChange={ratingChanged}
                    value={newComment.rating}
                    color2={"#ffd700"}
                  />
                  <textarea
                    name="comment"
                    placeholder="Enter your review"
                    value={newComment.comment}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div>
                    <button
                      className={styles.comment_section_submit}
                      type="submit"
                    >
                      Submit
                    </button>
                    {commentingState ? (
                      <button
                        className={styles.comment_section_close}
                        onClick={() => {
                          setCommentingState(!commentingState);
                        }}
                      >
                        Close
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </form>
              ) : (
                <></>
              )}
              {pageComments.length !== 0 ? (
                pageComments.map((item: Comment, index: number) => {
                  return (
                    <div
                      className={styles.comment_block}
                      key={item.publishDate}
                    >
                      <div className={styles.comment_block_upper}>
                        <h5>{item.name}</h5>
                        <p>Date: {item.publishDate.split("T")[0]}</p>
                      </div>
                      <div className={styles.comment_block_lower}>
                        <ReactStars
                          count={5}
                          size={24}
                          value={item.rating}
                          edit={false}
                          color2={"#ffd700"}
                        />
                        <p>{item.comment}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className={styles.no_comments_block}>
                  No comments! Be the first to add a comment.
                </p>
              )}
            </div>
          </div>
          <Footer />
        </>
      ) : (
        <div className="loader_bg" style={{ visibility: "visible" }}>
          <div className="loader_block">
            <div className="loader"></div>
          </div>
          <div className="loader_block">
            <div className="loader1">
              <Image className="logo_preloader" src={loaderimage} alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailedProduct;
