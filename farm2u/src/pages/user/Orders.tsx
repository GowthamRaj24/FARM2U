import axios from "axios";
import { Usercheck } from "../../../helpers/check";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Nav from "../../components/nav";
import Usernav from "./Usernav";
import Footer from "../../components/footer";
import styles from "@/styles/user/user.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Loader_colorring from "../../components/Loader_colorring";
import nodatafound from "@/resources/no_data_found.png";
import React from "react";
import { useRouter } from "next/router";
import { Order } from "@/Interfaces/user/orders";
const Orders = () => {
  Usercheck();
  const router = useRouter();
  const { data: session, status }: any = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loader, setLoader] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<boolean[]>([]);
  const fetchData=()=>{
    setLoader(true);
    axios
      .get(`/api/Orders/${session?.user?._id}`)
      .then((res) => {
        console.log(res.data)
        setOrders(res.data.data.reverse());
        setExpandedOrders(new Array(orders.length).fill(false));
        setTimeout(()=>{
          setLoader(false);
        },1000);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [status, router]);
  const toggleExtendedDiv = (index: any) => {
    const expandedCopy = [...expandedOrders];
    expandedCopy[index] = !expandedCopy[index];
    setExpandedOrders(expandedCopy);
  };
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.block}>
          <Usernav />
          <div className={styles.right_block}>
            <div className={styles.orders}>
              <h5>Orders</h5>
              {!loader ? (
                orders.length !== 0 ? (
                  orders.map((item: Order, index: any) => {
                    return (
                      <div className={styles.orders_div} key={item._id}>
                        <p className={styles.order_id}>Order ID : {item._id}</p>
                        <div className={styles.orders_blocks}>
                          <p className={styles.order_date}>
                            Date : {item.createdAt.split("T")[0]}
                          </p>
                          {item.products.map((i: any, index: number) => {
                            return (
                              <div
                                className={styles.order_block_products}
                                key={i._id}
                              >
                                <div className={styles.order_block_products_image}><Image
                                  src={i.productId.image1}
                                  alt="image"
                                  width={100}
                                  height={100}
                                />
                                </div>
                                <div className={styles.order_block_product}>
                                  <h6>{i.productId.heading}</h6>
                                  <p>Qty : {i.quantity}</p>
                                  <p>Price (1pc) : {i.price}</p>
                                </div>
                              </div>
                            );
                          })}
                          <p className={styles.statusbar}>
                            Status :{" "}
                            <span>
                              {item.status === "pending" ? (
                                <>Processing</>
                              ) : item.status === "cancelled" ? (
                                <>Cancelled</>
                              ) : (
                                <>Confirmed</>
                              )}
                            </span>
                          </p>
                          <button onClick={() => toggleExtendedDiv(index)}>
                            {!expandedOrders[index] ? (
                              <>
                                Show details{" "}
                                <FontAwesomeIcon icon={faChevronDown} />
                              </>
                            ) : (
                              <>
                                Show less <FontAwesomeIcon icon={faChevronUp} />
                              </>
                            )}
                          </button>
                          {expandedOrders[index] && (
                            <div className={styles.extendeddiv}>
                              <div className={styles.extended_blocks}>
                                <h5>Address : </h5>
                                <p>
                                  {item.address.firstName}{" "}
                                  {item.address.lastName},{" "}
                                  {item.address.address}, {item.address.pincode}
                                  , {item.address.city}, {item.address.state},{" "}
                                  {item.address.country}
                                </p>
                              </div>
                              <div className={styles.extended_blocks}>
                                <h5>Contact : </h5>
                                <p>{item.address.phoneNumber}</p>
                              </div>
                              <div className={styles.extended_blocks}>
                                <h5>Total Amount : </h5>
                                <p>{item.totalAmount}</p>
                              </div>
                              <div className={styles.extended_blocks}>
                                <h5>Payment Status : </h5>
                                <p>{item.paymentStatus}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.orders_datanotfound}>
                    <Image src={nodatafound} alt="No orders" />
                  </div>
                )
              ) : (
                <div className={styles.orders_loader}>
                  <Loader_colorring />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Orders;
