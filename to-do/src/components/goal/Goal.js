import React from "react";
import styles from "./Goal.module.css";

const Goal = ({ id, status, msg, onCheckChange }) => {
  return (
    <div className={styles.goalWrap}>
      <label className={status ? styles.textDisabled : styles.text}>
        {status && <div className={styles.clean} />}
        <input
          type="checkbox"
          id={id}
          name={id}
          date-msg={msg}
          onChange={onCheckChange}
          checked={status}
        />
        {msg}
      </label>
    </div>
  );
};

export default Goal;
