import styles from "@/styles/loader_colorring.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import React from "react";
const Loader_colorring = () => {
  return (
    <div className={styles.loading}>
      <p>
        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
      </p>
    </div>
  );
};
export default Loader_colorring;
