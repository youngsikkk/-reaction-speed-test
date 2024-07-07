"use client"
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [backColor, setBackColor] = useState("red");
  const [scores, setScores] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("게임을 시작하려면 클릭해주세요");
  const timerIdRef = useRef<any>(null);

  // 파란화면 -> 초록화면으로 랜덤하게 바뀌기
  const blockClick = () => {
    const waitTime = Math.floor(Math.random() * 10) + 1;
    timerIdRef.current = setTimeout(() => {
      const ti = Date.now();
      setStartTime(ti);
      setBackColor("green");
      setMessage("클릭하세요!");
      setIsWaiting(false);
    }, waitTime * 1000);
  }

  const reStart = () => {
    setIsWaiting(true);
    setBackColor("blue");
    setMessage("화면이 바뀔 때까지 기다려주세요.");
    blockClick();
  }

  

  const gameStart = () => {
    if(isStart) return;
    setIsStart(true);
    setIsWaiting(true);
    setBackColor("blue");
    setMessage("화면이 바뀔 때까지 기다려주세요.");
    blockClick();
  }
   
  const timeCheck = () => {
    if(isWaiting) {
      setStartTime(0);
      setBackColor("gray");
      setMessage("너무 빨리 클릭했습니다. 곧 대기 화면으로 전환됩니다.");
      clearTimeout(timerIdRef.current);
      timerIdRef.current = setTimeout(() => {
        setBackColor("blue");
        setMessage("화면이 바뀔 때까지 기다려주세요.");
        setIsWaiting(true);
        blockClick();
      }, 2000);
      return;
    }
    setIsClick(true);
    const ti = Date.now();
    const sc = ti - startTime;
    setScores(prevScores => [...prevScores, sc]);
    setBackColor("blue");
    setStartTime(0);
    setMessage("화면이 바뀔 때까지 기다려주세요.");
    setIsWaiting(true);
    clearTimeout(timerIdRef.current);
    blockClick();
    setIsClick(false);
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerIdRef.current); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, []);

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems: "center"}}>
      <h1 style={{marginBottom:"50px"}}>반응속도 테스트</h1>
      <div style={{width: "500px", height:"500px", backgroundColor: backColor,display:"flex", justifyContent:"center", alignItems: "flex-end"}} onClick={isStart ? timeCheck : gameStart}>
        <span>
          {message}
        </span>
      </div>
      <div style = {{display: "flex", flexDirection:"column", alignItems: "center", marginTop: "20px"}}>
        {scores.map((score, idx) => {
          return <span>{idx + 1}번째 시도 {score}ms</span>
        })}
      </div>
    </div>
  );
}
