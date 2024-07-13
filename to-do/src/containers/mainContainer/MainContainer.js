import React, { useState } from "react";
import styles from "./MainCotainer.module.css";
import dayjs from "dayjs";
import { Input, Goal } from "../../components";
import { MdPlaylistAdd } from "react-icons/md";

const MainCotainer = () => {
  const [memoData, setMemoData] = useState(new Map());
  const [currentData, setCurrentData] = useState("");
  const [goalMsg, setGoalMsg] = useState("");

  //3 : onAddDateHandler() 는 화면에 + 버튼을 누르면 호출된다.
  const onAddDateHandler = () => {
    // tempCurrentDate를 dayjs()로 현재 날짜, 시각으로 설정한다.
    const tempCurrentDate = dayjs().format("YYYY.MM.DD HH:mm:ss");
    // 위 데이터를 이용해 Map 객체를 할당한다.(초기 데이터 값은 빈 배열)
    if (memoData.has(tempCurrentDate)) return;
    setCurrentData(tempCurrentDate);
    // setMemoDate()의 파라미터 값 prev를 확인할 수 있다. (리엑트는 useState함수 안에 함수를 정의하면 바로 전 상태값을 알 수 있는 prev파라미터를 제공한다.)
    setMemoData((prev) => new Map(prev).set(tempCurrentDate, []));
  };
  //4 : onDateClick()은 왼쪽에 있는 날짜를 선택하면 호출된다.
  const onDateClick = (e) => {
    const { id } = e.target.dataset;
    setCurrentData(id);
  };
  //5 : OnMsgClickHandler()는 목표를 작성 후 Add 버튼을 누르면 실행된다.
  const onMsgClickHandler = (e) => {
    e.preventDefault();
    // newGoalList에 현재 날짜에 해당하는 to-do 리스트를 가져온다.
    const newGoalList = memoData.get(currentData);
    // 불러온 to-do 리스트와 새로 작성한 to-do 리스트를 배열에 추가한 후 setMemoDate()를 업데이트한다.
    setMemoData((prev) =>
      new Map(prev).set(currentData, [
        ...newGoalList,
        // status: false는 체크박스에 체크했을 때 rue로 변환되어 글에 밑줄을 긋는 역할을 한다.
        { msg: goalMsg, status: false },
      ]),
    );
    setGoalMsg("");
  };

  //6 : onChangeMsgHandler()는 input 박스의 onChange 이벤트에 등록되고 to-do 목록을 작성할 때 호출된다.
  const onChangeMsgHandler = (e) => {
    setGoalMsg(e.target.value);
  };

  //7
  const onCheckChange = (e) => {
    // 파라미터로 전달받은 이벤트 객체 (e)에서 체크 유무와 메시지 내용을 확인할 수 있다.
    const checked = e.target.checked;
    const msg = e.target.dataset.msg;
    const currentGoalList = memoData.get(currentData);
    // 전달받은 to-do 항목과 가지고 있는 to-do 리스트의 값을 순회하며 비교한다.
    const newGoal = currentGoalList.map((v) => {
      let temp = { ...v };
      // 동일한 값이 있다면 status를 알맞게 변환한다.
      if (v.msg === msg) {
        temp = { msg: v.msg, status: checked };
      }
      return temp;
    });
    setMemoData((prev) => new Map(prev).set(currentData, [...newGoal]));
  };
  return (
    <div className={styles.memoContainer}>
      <div className={styles.memoWrap}>
        <nav className={styles.sidebar}>
          <ul className={styles.dataList}>
            {
              //8 : Map 객체를 배열로 변환하는 과정이다.
              // Array.from()을 이용해서 Map의 key()메소드를 이용해 배열로 변환한다.
              Array.from(memoData.keys()).map((v) => (
                <li
                  className={styles.li}
                  key={v}
                  data-id={v}
                  onClick={onDateClick}
                >
                  {v}
                </li>
              ))
            }
          </ul>
          <div className={styles.addWrap}>
            <MdPlaylistAdd
              size="30"
              color="#edd200"
              style={{ cursor: "pointer" }}
              onClick={onAddDateHandler}
            />
          </div>
        </nav>
        <section className={styles.content}>
          {memoData.size > 0 && (
            <>
              <ul className={styles.goals}>
                {memoData.get(currentData).map((v, i) => (
                  <li key={`goal_${i}`}>
                    <Goal
                      id={`goal_${i}`}
                      msg={v.msg}
                      status={v.status}
                      onCheckChange={onCheckChange}
                    />
                  </li>
                ))}
              </ul>
              <Input
                value={goalMsg}
                onClick={onMsgClickHandler}
                onChange={onChangeMsgHandler}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default MainCotainer;
