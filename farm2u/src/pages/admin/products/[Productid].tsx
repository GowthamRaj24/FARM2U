import { useEffect, useReducer, useState } from "react";
import styles from "@/styles/publish.module.css";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Image from "next/image";
import successlogo from "@/resources/successicon.png";
import axios from "axios";
import { useRouter } from "next/router";
import AdminRoute from "@/pages/admin/AdminRoute";
import Admin from "../index";
import SellerNav from "../../../components/sellerNav";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import errorlogo from "@/resources/error.png";
import { ProductData } from "@/Interfaces/Products";
const Editblog = () => {
  const router = useRouter();
  let Productid = router.query.Productid;
  const [formData, setFormData] = useState<ProductData>({
    heading: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    qty: 0,
    price: 0,
    discount: 0,
    description: "",
    comments: [],
    _id: "",
  });

  const [successLoader, setSuccessLoader] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [proceedMessage, setProceedMessage] = useState<boolean>(false);
  const { quill, quillRef }: any = useQuill();
  const [initialContent, setInitialContent] = useState("");
  const [limitexceed, setLimitexceed] = useState(false);
  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
        setFormData((prevState: any) => ({
          ...prevState,
          description: quillRef.current.firstChild.innerHTML,
        }));
      });
    }
  }, [quill]);
  const fetchData = () => {
    if (Productid) {
      axios
        .get(`../../api/products/${Productid}`)
        .then((res) => {
          setFormData(res.data);
          setInitialContent(res.data.description);
          const delta = quill.clipboard.convert(res.data.description);
          quill.setContents(delta);
          console.log(formData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    fetchData();
  }, [Productid, initialContent, quill]);
  const handleInputChange = async (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSuccess = (e: any) => {
    setSuccessLoader(true);
    axios
      .patch(`../../api/products/${Productid}`, formData)
      .then(() => {
        console.log("posted successfully!");
        setSuccessMessage(true);
        setProceedMessage(false);
      })
      .catch((err) => {
        console.log("Something went wrong!");
        setErrorMessage(true);
        setProceedMessage(false);
      })
      .finally(() => {
        setSuccessLoader(false);
      });
  };
  const handlePublish = (e: any) => {
    e.preventDefault();
    if (formData.qty < 0) {
      setFormData((prevState: any) => ({
        ...prevState,
        qty: 0,
      }));
      return;
    }
    const sizeof = require("sizeof");
    const objectSizeBytes = sizeof.sizeof(formData);
    const objectSizeMB = objectSizeBytes / (1024 * 1024);
    if (objectSizeMB <= 100) {
      setLimitexceed(false);
      setProceedMessage(true);
    } else {
      console.log("Limit exceeded");
      setLimitexceed(true);
    }
  };
  return (
    <AdminRoute>
      <Admin />
      <div className={"admin_nav_adjustment"}>
        <SellerNav />
        <div>
          {proceedMessage ? (
            <div className={styles.publishalert}>
              <div className={styles.publish_conformation}>
                <p>Are you sure you want to publish this post ?</p>
                <div className={styles.publish_alert_buttons}>
                  <button
                    className={styles.publish_alert_button1}
                    onClick={() => {
                      setProceedMessage(false);
                    }}
                  >
                    No
                  </button>
                  {successLoader ? (
                    <button className={styles.publish_alert_button2}>
                      Wait{" "}
                      <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                    </button>
                  ) : (
                    <button
                      className={styles.publish_alert_button2}
                      onClick={handleSuccess}
                    >
                      Yes
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {successMessage ? (
            <div className={styles.publish_confirm_alert}>
              <div className={styles.publish_confirm_redirection}>
                <Image src={successlogo} alt="" />
                <p>This product has been posted successfully!</p>
                <button
                  onClick={() => {
                    document.location.href = "/admin/products/Inventory";
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          {errorMessage ? (
            <div className={styles.publish_confirm_alert}>
              <div className={styles.publish_confirm_redirection}>
                <Image src={errorlogo} alt="" />
                <p>Something gone wrong! Try again later.</p>
                <button
                  onClick={() => {
                    document.location.href = "/admin/products/Inventory";
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className={styles.publish_post_form_container}>
            <form onSubmit={handlePublish}>
              <div className={styles.publish_post_form_container_leftbox}>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Heading:
                  <div>
                    <input
                      className={styles.publish_blog_input}
                      type="text"
                      name="heading"
                      value={formData.heading}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Image1:
                  <div>
                    <input
                      className={styles.publish_blog_input}
                      type="text"
                      name="image1"
                      value={formData.image1}
                      accept="image/*"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Image2:
                  <div>
                    <input
                      className={styles.publish_blog_input}
                      type="text"
                      name="image2"
                      accept="image/*"
                      value={formData.image2}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Image3:
                  <div>
                    <input
                      className={styles.publish_blog_input}
                      type="text"
                      name="image3"
                      accept="image/*"
                      value={formData.image3}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Image4:
                  <div>
                    <input
                      className={styles.publish_blog_input}
                      type="text"
                      name="image4"
                      accept="image/*"
                      value={formData.image4}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Price:
                  <div>
                    <input
                      className={styles.publish_blog_input}
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Discount (In percentage %):
                  <div>
                    <input
                      className={styles.publish_blog_input}
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Quantity:
                  <div>
                    <input
                      className={styles.publish_blog_input}
                      type="number"
                      name="qty"
                      value={formData.qty}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {limitexceed ? (
                  <p>Exceeded the maximum upload limit i.e 100MB</p>
                ) : (
                  <></>
                )}
                <div className={styles.publish_post_form_container_leftbox_div}>
                  <button type="submit" className={styles.publish_blog_submit}>
                    Publish
                  </button>
                </div>
              </div>
            </form>
            <div className={styles.quilljs}>
              <div ref={quillRef} />
            </div>
          </div>
          {formData.comments.length !== 0 ? (
            <div className={styles.comments_edit}>
              <h5
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  margin: "15px",
                }}
              >
                Comments
              </h5>
              <table>
                <thead>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Options</th>
                </thead>
                <tbody>
                  {formData.comments.map((item: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td>{item._id}</td>
                        <td>{item.name}</td>
                        <td>{item.publishDate.split("@")[0]}</td>
                        <td>{item.rating}/5</td>
                        <td>{item.comment}</td>
                        <td>
                          <button
                            onClick={() => {
                              try {
                                axios
                                  .delete(
                                    `/api/products/${Productid}/comments/${item._id}`
                                  )
                                  .then((res) => {
                                    console.log("Successfully deleted");
                                    fetchData();
                                  })
                                  .catch((err) => {
                                    console.log("Something went wrong!");
                                  });
                              } catch (err) {
                                if (window) {
                                  window.alert("Something went wrong");
                                }
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: "center" }}>No comments!</p>
          )}
        </div>
      </div>
    </AdminRoute>
  );
};
export default Editblog;
