import { useEffect, useReducer, useState } from "react";
import styles from "@/styles/publish.module.css";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Image from "next/image";
import successlogo from "@/resources/successicon.png";
import axios from "axios";
import AdminRoute from "../AdminRoute";
import Admin from "..";
import SellerNav from "../../../components/sellerNav";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import errorlogo from "@/resources/error.png";
const PublishProduct = () => {
  const { quill, quillRef }: any = useQuill();
  const [limitexceed, setLimitexceed] = useState<boolean>(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [successLoader, setSuccessLoader] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [proceedMessage, setProceedMessage] = useState<boolean>(false);
  const [formData, setFormData]: any = useState({
    heading: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    qty: 0,
    price: 0,
    discount: 0,
    category:"",
    description: null,
  });
  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
        setFormData((prevState: any) => ({
          ...prevState,
          description: quillRef.current.firstChild.innerHTML,
        }));
      });
    } else {
      forceUpdate();
    }
  }, [quill, reducerValue]);
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
      .post("../../api/products", formData)
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
                      required
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
                      onChange={handleInputChange}
                      required
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
                      value={formData.image2}
                      onChange={handleInputChange}
                      required
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
                      value={formData.image3}
                      onChange={handleInputChange}
                      required
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
                      value={formData.image4}
                      onChange={handleInputChange}
                      required
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
                      required
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
                      required
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
                      required
                    />
                  </div>
                </div>
                <div className={styles.publish_post_form_container_leftbox_div}>
                  Category:
                  <div>
                    <select className={styles.publish_blog_input} name="category" onChange={handleInputChange}>
                      <option>Select a option</option>
                      <option value="fruits">Fruits</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="spices">Spices</option>
                      <option value="leafygreens">Leafygreens</option>
                      <option value="dryfruits">Dryfruits</option>
                    </select>
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
        </div>
      </div>
    </AdminRoute>
  );
};
export default PublishProduct;
