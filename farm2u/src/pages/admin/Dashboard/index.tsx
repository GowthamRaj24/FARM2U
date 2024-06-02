import React, { useEffect, useState } from "react";
import Admin from "..";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faSpinner,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/admin/orders.module.css";
import Image from "next/image";
import Loader_colorring from "../../../components/Loader_colorring";
import nodatafound from "@/resources/no_data_found.png";
import AdminRoute from "../AdminRoute";
import SellerNav from "../../../components/sellerNav";
import { useRouter } from "next/router";
const Dashboard = () => {
  const [view, setView] = useState("all");
  return (
    <AdminRoute>
      <div className={styles.admin_orders_page}>
        <Admin />
        <div className={"admin_nav_adjustment"}>
          <SellerNav />
          <div className={styles.nav_orders}>
            <ul>
              <li
                className={view === "all" ? styles.active : styles.notactive}
                onClick={() => {
                  setView("all");
                }}
              >
                All Orders
              </li>
              <li
                className={
                  view === "Pending" ? styles.active : styles.notactive
                }
                onClick={() => {
                  setView("Pending");
                }}
              >
                Pending
              </li>
              <li
                className={
                  view === "Completed" ? styles.active : styles.notactive
                }
                onClick={() => {
                  setView("Completed");
                }}
              >
                Completed
              </li>
              <li
                className={
                  view === "Cancelled" ? styles.active : styles.notactive
                }
                onClick={() => {
                  setView("Cancelled");
                }}
              >
                Cancelled
              </li>
            </ul>
          </div>
          {view === "all" ? (
            <AllOrders key="all" />
          ) : view === "Pending" ? (
            <Custom key="pending" element="Pending" />
          ) : view === "Completed" ? (
            <Custom key="completed" element="Completed" />
          ) : (
            <Custom key="cancelled" element="Cancelled" />
          )}
        </div>
      </div>
    </AdminRoute>
  );
};

export default Dashboard;

const AllOrders = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [checkedit, setCheckedit] = useState<boolean[]>([]);
  const [checkedit2, setCheckedit2] = useState<boolean[]>([]);
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState<boolean[]>([]);
  const router=useRouter();
  const fetchData = () => {
    try {
      setLoader(true);
      axios
        .get("/api/Orders")
        .then((res) => {
          setOrders(res.data.data.reverse());
          setExpandedRows(new Array(res.data.data.length).fill(false));
          setCheckedit(new Array(res.data.data.length).fill(false));
          setCheckedit2(new Array(res.data.data.length).fill(false));
        })
        .catch((err) => {
          console.log("Something went wrong!");
        })
        .finally(() => {
          setLoader(false);
        });
    } catch (err) {
      console.log("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [router]);
  const toggleRow = (index: any) => {
    const newExpandedRows = [...expandedRows];
    newExpandedRows[index] = !newExpandedRows[index];
    setExpandedRows(newExpandedRows);
  };

  const toggleEdit1 = (index: any) => {
    const newPaymentStatus = [...checkedit];
    newPaymentStatus[index] = !newPaymentStatus[index];
    setCheckedit(newPaymentStatus);
  };

  const toggleEdit2 = (index: any) => {
    const newStatus = [...checkedit2];
    newStatus[index] = !newStatus[index];
    setCheckedit2(newStatus);
  };

  const handleSave = (index: any) => {
    const item: any = orders[index];

    axios
      .patch(`/api/Orders/Edit/${item._id}`, orders[index])
      .then((res) => {
        fetchData();
      })
      .catch((err) => {
        console.log("Something went wrong!");
      });
  };

  return (
    <div className={styles.invetory_entire}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.first_table_th}>SNO</th>
            <th className={styles.first_table_th}>NAME</th>
            <th className={styles.first_table_th}>ADDRESS</th>
            <th className={styles.first_table_th}>DATE</th>
            <th className={styles.first_table_th}>AMOUNT</th>
            <th className={styles.first_table_th}>PAYMENT STATUS</th>
            <th className={styles.first_table_th}>STATUS</th>
            <th className={styles.first_table_th}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {!loader && orders.length !== 0 ? (
            orders.map((item: any, index) => {
              const isExpanded = expandedRows[index];
              const edit1 = checkedit[index];
              const edit2 = checkedit2[index];
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td className={styles.first_table_td}>{index + 1}</td>
                    <td className={styles.first_table_td}>
                      {item.address.firstName} {item.address.lastName}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.address.address} {item.address.city},{" "}
                      {item.address.state}, {item.address.pincode}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.createdAt.split("T")[0]}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.totalAmount}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.paymentStatus === "paid" ? (
                        <p className={styles.paid}>
                          <FontAwesomeIcon icon={faCheck} />{" "}
                          {item.paymentStatus}
                        </p>
                      ) : (
                        <p className={styles.unpaid}>
                          <FontAwesomeIcon icon={faTimes} />{" "}
                          {item.paymentStatus}
                        </p>
                      )}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.status === "completed" ? (
                        <p className={styles.completed}>
                          <FontAwesomeIcon icon={faCheck} /> {item.status}
                        </p>
                      ) : item.status === "pending" ? (
                        <p className={styles.pending}>
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className="fa-spin"
                          />{" "}
                          {item.status}
                        </p>
                      ) : (
                        <p className={styles.cancelled}>
                          <FontAwesomeIcon icon={faTimes} /> {item.status}
                        </p>
                      )}
                    </td>
                    <td className={styles.first_table_td}>
                      <div
                        className={styles.down_arrow}
                        onClick={() => toggleRow(index)}
                      >
                        <FontAwesomeIcon
                          icon={isExpanded ? faChevronUp : faChevronDown}
                        />
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8}>
                        <div className={styles.collapsed_div}>
                          <div>
                            <div className={styles.collapsed_div_products}>
                              <p style={{ margin: "10px 0px", color: "grey" }}>
                                Ordered Id: {item._id}
                              </p>
                              <h6 style={{ textAlign: "center" }}>PRODUCTS</h6>
                              <table className={styles.table2}>
                                <thead>
                                  <tr>
                                    <th className={styles.second_table_th}>
                                      PRODUCT
                                    </th>
                                    <th className={styles.second_table_th}>
                                      QUANTITY
                                    </th>
                                    <th className={styles.second_table_th}>
                                      PRICE
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.products.map(
                                    (i: any, index: number) => {
                                      console.log(i.productId);
                                      return (
                                        <tr key={index}>
                                          <td
                                            className={`${styles.second_product_td} ${styles.second_p_td}`}
                                          >
                                            <Image
                                              src={i.productId.image1}
                                              alt="image"
                                              width={100}
                                              height={100}
                                            />
                                            <p>{i.productId.heading}</p>
                                          </td>
                                          <td className={styles.second_p_td}>
                                            <p>Qty : {i.quantity}</p>
                                          </td>
                                          <td className={styles.second_p_td}>
                                            <p>{i.price}</p>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className={styles.collapsed_div_address}>
                              <h6 style={{ textAlign: "center" }}>ADDRESS</h6>
                              <table className={styles.table3}>
                                <thead>
                                  <th className={styles.table3_th}>Name</th>
                                  <th className={styles.table3_th}>Contact</th>
                                  <th className={styles.table3_th}>Email</th>
                                  <th className={styles.table3_th}>Address</th>
                                  <th className={styles.table3_th}>City</th>
                                  <th className={styles.table3_th}>Pincode</th>
                                  <th className={styles.table3_th}>State</th>
                                  <th className={styles.table3_th}>Country</th>
                                </thead>
                                <tbody>
                                  <td className={styles.table3_td}>
                                    {item.address.firstName}{" "}
                                    {item.address.lastName}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.phoneNumber}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.email}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.address}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.city}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.pincode}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.state}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.country}
                                  </td>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div>
                            <table className={styles.table4}>
                              <thead>
                                <tr>
                                  <th className={styles.table4_th}>
                                    TOTAL PRICE
                                  </th>
                                  <td className={styles.table4_td}>
                                    Rs. {item.totalAmount}
                                  </td>
                                  <td className={styles.table4_td}></td>
                                </tr>
                                <tr>
                                  <th className={styles.table4_th}>
                                    PAYMENT STATUS
                                  </th>
                                  <td className={styles.table4_td}>
                                    {edit1 ? (
                                      <select
                                        className={styles.table4_inp}
                                        value={item.paymentStatus}
                                        onChange={(e) => {
                                          const updatedOrders: any = [
                                            ...orders,
                                          ];
                                          updatedOrders[index].paymentStatus =
                                            e.target.value;
                                          setOrders(updatedOrders);
                                        }}
                                      >
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">UnPaid</option>
                                      </select>
                                    ) : (
                                      item.paymentStatus
                                    )}
                                  </td>
                                  <td className={styles.table4_td}>
                                    {item.paymentStatus === "paid" && !edit1 ? (
                                      <button
                                        className={styles.table4_td_dsb}
                                        disabled
                                      >
                                        Disabled
                                      </button>
                                    ) : edit1 ? (
                                      <button
                                        className={styles.table4_td_btn_save}
                                        onClick={() => handleSave(index)}
                                      >
                                        Save
                                      </button>
                                    ) : (
                                      <button
                                        className={styles.table4_td_btn}
                                        onClick={() => toggleEdit1(index)}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </td>
                                  <td className={styles.table4_td}>
                                    {edit1 ? (
                                      <button
                                        className={styles.table4_td_btn_close}
                                        onClick={() => toggleEdit1(index)}
                                      >
                                        Close
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th className={styles.table4_th}>
                                    ORDER STATUS
                                  </th>
                                  <td className={styles.table4_td}>
                                    {edit2 ? (
                                      <select
                                        className={styles.table4_inp}
                                        value={item.status}
                                        onChange={(e) => {
                                          const updatedOrders: any = [
                                            ...orders,
                                          ];
                                          updatedOrders[index].status =
                                            e.target.value;
                                          setOrders(updatedOrders);
                                        }}
                                      >
                                        <option value="completed">
                                          Completed
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">
                                          Cancel
                                        </option>
                                      </select>
                                    ) : (
                                      item.status
                                    )}
                                  </td>
                                  <td className={styles.table4_td}>
                                    {item.status === "completed" && !edit2 ? (
                                      <button
                                        className={styles.table4_td_dsb}
                                        disabled
                                      >
                                        Disabled
                                      </button>
                                    ) : edit2 ? (
                                      <button
                                        className={styles.table4_td_btn_save}
                                        onClick={() => handleSave(index)}
                                      >
                                        Save
                                      </button>
                                    ) : (
                                      <button
                                        className={styles.table4_td_btn}
                                        onClick={() => toggleEdit2(index)}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </td>
                                  <td className={styles.table4_td}>
                                    {edit2 ? (
                                      <button
                                        className={styles.table4_td_btn_close}
                                        onClick={() => toggleEdit2(index)}
                                      >
                                        Close
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                </tr>
                              </thead>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : loader && orders.length === 0 ? (
            <div className={styles.loader}>
              <Loader_colorring />
            </div>
          ) : (
            <tr>
              <td colSpan={8}>
                <div className={styles.nodatafound}>
                  <Image src={nodatafound} alt="Nothing found" />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
const Custom = ({ element }: any) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [checkedit, setCheckedit] = useState<boolean[]>([]);
  const [checkedit2, setCheckedit2] = useState<boolean[]>([]);
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState<boolean[]>([]);
  const router=useRouter();
  const fetchData = () => {
    try {
      setLoader(true);
      axios
        .get(`/api/Orders/${element}`)
        .then((res) => {
          setOrders(res.data.data.reverse());
          setExpandedRows(new Array(res.data.data.length).fill(false));
          setCheckedit(new Array(res.data.data.length).fill(false));
          setCheckedit2(new Array(res.data.data.length).fill(false));
          setLoader(false);
        })
        .catch((err) => {
          console.log("Something went wrong!");
        })
        .finally(() => {
          setLoader(false);
        });
    } catch (err) {
      console.log("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [router]);
  const toggleRow = (index: any) => {
    const newExpandedRows = [...expandedRows];
    newExpandedRows[index] = !newExpandedRows[index];
    setExpandedRows(newExpandedRows);
  };

  const toggleEdit1 = (index: any) => {
    const newPaymentStatus = [...checkedit];
    newPaymentStatus[index] = !newPaymentStatus[index];
    setCheckedit(newPaymentStatus);
  };

  const toggleEdit2 = (index: any) => {
    const newStatus = [...checkedit2];
    newStatus[index] = !newStatus[index];
    setCheckedit2(newStatus);
  };

  const handleSave = (index: any) => {
    const item: any = orders[index];

    axios
      .patch(`/api/Orders/Edit/${item._id}`, orders[index])
      .then((res) => {
        fetchData();
      })
      .catch((err) => {
        console.log("Something went wrong!");
      });
  };

  return (
    <div className={styles.invetory_entire}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.first_table_th}>SNO</th>
            <th className={styles.first_table_th}>NAME</th>
            <th className={styles.first_table_th}>ADDRESS</th>
            <th className={styles.first_table_th}>DATE</th>
            <th className={styles.first_table_th}>AMOUNT</th>
            <th className={styles.first_table_th}>PAYMENT STATUS</th>
            <th className={styles.first_table_th}>STATUS</th>
            <th className={styles.first_table_th}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {!loader && orders.length !== 0 ? (
            orders.map((item: any, index) => {
              const isExpanded = expandedRows[index];
              const edit1 = checkedit[index];
              const edit2 = checkedit2[index];
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td className={styles.first_table_td}>{index + 1}</td>
                    <td className={styles.first_table_td}>
                      {item.address.firstName} {item.address.lastName}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.address.address} {item.address.city},{" "}
                      {item.address.state}, {item.address.pincode}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.createdAt.split("T")[0]}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.totalAmount}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.paymentStatus === "paid" ? (
                        <p className={styles.paid}>
                          <FontAwesomeIcon icon={faCheck} />{" "}
                          {item.paymentStatus}
                        </p>
                      ) : (
                        <p className={styles.unpaid}>
                          <FontAwesomeIcon icon={faTimes} />{" "}
                          {item.paymentStatus}
                        </p>
                      )}
                    </td>
                    <td className={styles.first_table_td}>
                      {item.status === "completed" ? (
                        <p className={styles.completed}>
                          <FontAwesomeIcon icon={faCheck} /> {item.status}
                        </p>
                      ) : item.status === "pending" ? (
                        <p className={styles.pending}>
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className="fa-spin"
                          />{" "}
                          {item.status}
                        </p>
                      ) : (
                        <p className={styles.cancelled}>
                          <FontAwesomeIcon icon={faTimes} /> {item.status}
                        </p>
                      )}
                    </td>
                    <td className={styles.first_table_td}>
                      <div
                        className={styles.down_arrow}
                        onClick={() => toggleRow(index)}
                      >
                        <FontAwesomeIcon
                          icon={isExpanded ? faChevronUp : faChevronDown}
                        />
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8}>
                        <div className={styles.collapsed_div}>
                          <div>
                            <div className={styles.collapsed_div_products}>
                              <p style={{ margin: "10px 0px", color: "grey" }}>
                                Ordered Id: {item._id}
                              </p>
                              <h6 style={{ textAlign: "center" }}>PRODUCTS</h6>
                              <table className={styles.table2}>
                                <thead>
                                  <tr>
                                    <th className={styles.second_table_th}>
                                      PRODUCT
                                    </th>
                                    <th className={styles.second_table_th}>
                                      QUANTITY
                                    </th>
                                    <th className={styles.second_table_th}>
                                      PRICE
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.products.map(
                                    (i: any, index: number) => {
                                      return (
                                        <tr key={index}>
                                          <td
                                            className={`${styles.second_product_td} ${styles.second_p_td}`}
                                          >
                                            <Image
                                              src={i.productId.image1}
                                              alt="image"
                                              width={100}
                                              height={100}
                                            />
                                            <p>{i.productId.heading}</p>
                                          </td>
                                          <td className={styles.second_p_td}>
                                            <p>Qty : {i.quantity}</p>
                                          </td>
                                          <td className={styles.second_p_td}>
                                            <p>{i.price}</p>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className={styles.collapsed_div_address}>
                              <h6 style={{ textAlign: "center" }}>ADDRESS</h6>
                              <table className={styles.table3}>
                                <thead>
                                  <th className={styles.table3_th}>Name</th>
                                  <th className={styles.table3_th}>Contact</th>
                                  <th className={styles.table3_th}>Email</th>
                                  <th className={styles.table3_th}>Address</th>
                                  <th className={styles.table3_th}>City</th>
                                  <th className={styles.table3_th}>Pincode</th>
                                  <th className={styles.table3_th}>State</th>
                                  <th className={styles.table3_th}>Country</th>
                                </thead>
                                <tbody>
                                  <td className={styles.table3_td}>
                                    {item.address.firstName}{" "}
                                    {item.address.lastName}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.phoneNumber}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.email}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.address}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.city}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.pincode}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.state}
                                  </td>
                                  <td className={styles.table3_td}>
                                    {item.address.country}
                                  </td>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div>
                            <table className={styles.table4}>
                              <thead>
                                <tr>
                                  <th className={styles.table4_th}>
                                    TOTAL PRICE
                                  </th>
                                  <td className={styles.table4_td}>
                                    Rs. {item.totalAmount}
                                  </td>
                                  <td className={styles.table4_td}></td>
                                </tr>
                                <tr>
                                  <th className={styles.table4_th}>
                                    PAYMENT STATUS
                                  </th>
                                  <td className={styles.table4_td}>
                                    {edit1 ? (
                                      <select
                                        className={styles.table4_inp}
                                        value={item.paymentStatus}
                                        onChange={(e) => {
                                          const updatedOrders: any = [
                                            ...orders,
                                          ];
                                          updatedOrders[index].paymentStatus =
                                            e.target.value;
                                          setOrders(updatedOrders);
                                        }}
                                      >
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">UnPaid</option>
                                      </select>
                                    ) : (
                                      item.paymentStatus
                                    )}
                                  </td>
                                  <td className={styles.table4_td}>
                                    {item.paymentStatus === "paid" && !edit1 ? (
                                      <button
                                        className={styles.table4_td_dsb}
                                        disabled
                                      >
                                        Disabled
                                      </button>
                                    ) : edit1 ? (
                                      <button
                                        className={styles.table4_td_btn_save}
                                        onClick={() => handleSave(index)}
                                      >
                                        Save
                                      </button>
                                    ) : (
                                      <button
                                        className={styles.table4_td_btn}
                                        onClick={() => toggleEdit1(index)}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </td>
                                  <td className={styles.table4_td}>
                                    {edit1 ? (
                                      <button
                                        className={styles.table4_td_btn_close}
                                        onClick={() => toggleEdit1(index)}
                                      >
                                        Close
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                </tr>
                                <tr>
                                  <th className={styles.table4_th}>
                                    ORDER STATUS
                                  </th>
                                  <td className={styles.table4_td}>
                                    {edit2 ? (
                                      <select
                                        className={styles.table4_inp}
                                        value={item.status}
                                        onChange={(e) => {
                                          const updatedOrders: any = [
                                            ...orders,
                                          ];
                                          updatedOrders[index].status =
                                            e.target.value;
                                          setOrders(updatedOrders);
                                        }}
                                      >
                                        <option value="completed">
                                          Completed
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">
                                          Cancel
                                        </option>
                                      </select>
                                    ) : (
                                      item.status
                                    )}
                                  </td>
                                  <td className={styles.table4_td}>
                                    {item.status === "completed" && !edit2 ? (
                                      <button
                                        className={styles.table4_td_dsb}
                                        disabled
                                      >
                                        Disabled
                                      </button>
                                    ) : edit2 ? (
                                      <button
                                        className={styles.table4_td_btn_save}
                                        onClick={() => handleSave(index)}
                                      >
                                        Save
                                      </button>
                                    ) : (
                                      <button
                                        className={styles.table4_td_btn}
                                        onClick={() => toggleEdit2(index)}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </td>
                                  <td className={styles.table4_td}>
                                    {edit2 ? (
                                      <button
                                        className={styles.table4_td_btn_close}
                                        onClick={() => toggleEdit2(index)}
                                      >
                                        Close
                                      </button>
                                    ) : (
                                      <></>
                                    )}
                                  </td>
                                </tr>
                              </thead>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          ) : loader && orders.length === 0 ? (
            <div className={styles.loader}>
              <Loader_colorring />
            </div>
          ) : (
            <tr>
              <td colSpan={8}>
                <div className={styles.nodatafound}>
                  <Image src={nodatafound} alt="Nothing found" />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
