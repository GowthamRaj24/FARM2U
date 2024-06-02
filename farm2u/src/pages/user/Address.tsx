import Footer from "../../components/footer";
import Nav from "../../components/nav";
import styles from "@/styles/user/user.module.css";
import Usernav from "./Usernav";
import { useEffect, useState } from "react";
import { Usercheck } from "../../../helpers/check";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
const Addresses = () => {
  Usercheck();
  const router = useRouter();
  const { data: session, status }: any = useSession();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [addressData, setAddressData] = useState([]);
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post(`/api/users/${session?.user?._id}/addresses`, formData)
      .then((res) => {
        console.log("Address added successfully:", res.data);
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          address: "",
          landmark: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        });
        setShowForm(false);
        fetchAddressData();
        router.reload();
      })
      .catch((err) => {
        console.log("Failed to add address:", err);
      });
  };
  const fetchAddressData = () => {
    axios
      .get(`/api/users/${session?.user?._id}/addresses`)
      .then((res) => {
        setAddressData(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchAddressData();
  }, [router, status]);
  const handleDelete = (id: any) => {
    axios
      .delete(`/api/users/${session?.user?._id}/addresses/${id}`)
      .then((res) => {
        fetchAddressData();
      })
      .catch((err) => {
        console.log("Failed to delete address:", err);
      });
  };
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.block}>
          <Usernav />
          <div className={styles.right_block}>
            <div className={styles.dashboard}>
              <h5>ADDRESSES</h5>
              <button
                className={styles.add_address}
                onClick={() => {
                  setShowForm(true);
                }}
              >
                ADD A NEW ADDRESS
              </button>
              {showForm ? (
                <form className={styles.checkout_form} onSubmit={handleSubmit}>
                  <div className={styles.f_l_names}>
                    <div className={styles.form_group}>
                      <label htmlFor="firstName">First Name</label>
                      <input
                        className={`${styles.input} ${styles.fname}`}
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={styles.form_group}>
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        className={`${styles.input} ${styles.lname}`}
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      className={styles.input}
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="address">Address</label>
                    <input
                      className={styles.input}
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="landmark">Landmark</label>
                    <input
                      className={styles.input}
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.c_s_p_div}>
                    <div className={`${styles.form_group}`}>
                      <label htmlFor="city">City</label>
                      <input
                        className={styles.input_}
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className={`${styles.form_group}`}>
                      <label htmlFor="state">State</label>
                      <select
                        className={`${styles.input_} ${styles.state}`}
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">
                          Arunachal Pradesh
                        </option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">
                          Himachal Pradesh
                        </option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Andaman and Nicobar Islands">
                          Andaman and Nicobar Islands
                        </option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli">
                          Dadra and Nagar Haveli
                        </option>
                        <option value="Daman and Diu">Daman and Diu</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Puducherry">Puducherry</option>
                      </select>
                    </div>
                    <div className={`${styles.form_group}`}>
                      <label htmlFor="pincode">Pincode</label>
                      <input
                        className={styles.input_}
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="country">Country / Region</label>
                    <select
                      className={styles.input}
                      id="country"
                      name="country"
                      value={formData.country}
                      disabled
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                  <div className={styles.info_form_back_submit}>
                    <button
                      className={styles.close}
                      onClick={() => {
                        setShowForm(false);
                      }}
                    >
                      Close
                    </button>
                    <button className={styles.info_submit} type="submit">
                      Submit
                    </button>
                  </div>
                </form>
              ) : (
                <></>
              )}
              <h5>ADDRESS BOOK</h5>
              <div className={styles.address_blocks}>
                {addressData.length === 0 ? (
                  <p>Address not found ! Add New.</p>
                ) : (
                  addressData.map((item: any, index: number) => {
                    return (
                      <div className={styles.address_block} key={index}>
                        <button
                          className={styles.closebtn}
                          onClick={() => handleDelete(item._id)}
                        >
                          &times;
                        </button>
                        <p>
                          {item.firstName} {item.lastName}
                        </p>
                        <p>{item.phoneNumber}</p>
                        <p>{item.address}</p>
                        <p>Near {item.landmark}</p>
                        <p>
                          {item.city}, {item.state}, {item.pincode}
                        </p>
                        <p>{item.country}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Addresses;
