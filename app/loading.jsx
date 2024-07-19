import React from "react";
import styles from "./components/styles/loading.module.css";

const Loading = () => {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingBar}></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
