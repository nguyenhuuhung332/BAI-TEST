import React, { useState, useEffect } from "react";

function App() {
  const [sun, setSun] = useState("");
  const [birds, setBirds] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [hour, setHour] = useState(6);
  const [originalBirds, setOriginalBirds] = useState([]);
  const [originalFlowers, setOriginalFlowers] = useState([]);

  // Initialize the original number of birds and flowers
  useEffect(() => {
    const initialBirds = [];
    const numBirds = Math.floor(Math.random() * 10) + 1; // set between 1 and 10
    for (let i = 0; i < numBirds; i++) {
      initialBirds.push({ id: i + 1 });
    }
    setBirds(initialBirds);
    setOriginalBirds(initialBirds);

    const initialFlowers = [];
    const numFlowers = Math.floor(Math.random() * 10) + 1; // set between 1 and 10
    for (let i = 0; i < numFlowers; i++) {
      initialFlowers.push({ id: i + 1, color: ["red", "green", "blue"][Math.floor(Math.random() * 3)], nectar: 0 });
    }
    setFlowers(initialFlowers);
    setOriginalFlowers(initialFlowers);
  }, []);

  // Update the state of sun, birds, and flowers based on the hour
  useEffect(() => {
    // Update the state of sun
    if (hour >= 6 && hour <= 18) {
      setSun("up");
    } else {
      setSun("down");
    }

    // Update the state of birds
    const newBirds = [];
    for (let i = 0; i < originalBirds.length; i++) {
      if (sun === "up") {
        if (hour >= 19 || hour <= 4) {
          newBirds.push({ ...originalBirds[i], status: "asleep" });
        } else {
          newBirds.push({ ...originalBirds[i], status: "awake" });
        }
      } else {
        newBirds.push({ ...originalBirds[i], status: "asleep" });
      }
    }
    setBirds(newBirds);

    // Update the state of flowers
    const newFlowers = [];
    for (let i = 0; i < originalFlowers.length; i++) {
      if (sun === "up") {
        if (hour >= 6 && hour <= 18) {
          const randomRatio = Math.floor(Math.random() * 3); // set between 0 and 2
          const nectar = originalFlowers[i].nectar;
          if (nectar === 0 && randomRatio === 0) {
            newFlowers.push({ ...originalFlowers[i], nectar: 1 });
          } else {
            newFlowers.push({ ...originalFlowers[i], nectar });
          }
        } else {
          const randomRatio = Math.floor(Math.random() * 3); // set between 0 and 2
          const nectar = originalFlowers[i].nectar;
          if (nectar > 0 && randomRatio === 0) {
            const newId = newFlowers.length + 1;
            newFlowers.push({ id: newId,
              color: originalFlowers[i].color,
              nectar: Math.floor(nectar / 2)
            });
          } else {
            newFlowers.push({ ...originalFlowers[i], nectar });
          }
        }
      } else {
        newFlowers.push({ ...originalFlowers[i], nectar: 0 });
      }
    }
    setFlowers(newFlowers);
  }, [hour, originalBirds, originalFlowers, sun]);

  // Check if 2 flowers of the same color have been visited by a bird in a row
  useEffect(() => {
  const visitedColors = birds.map((bird) => bird.visitedColor);
  for (let i = 0; i < visitedColors.length - 1; i++) {
  if (visitedColors[i] === visitedColors[i + 1]) {
  const newId = flowers.length + 1;
  const newFlower = { id: newId, color: visitedColors[i], nectar: 0 };
  setFlowers((prevFlowers) => [...prevFlowers, newFlower]);
  }
  }
  }, [birds, flowers]);
  
  // Update the hour every second
  useEffect(() => {
  const timer = setInterval(() => {
  if (hour < 24) {
  setHour((prevHour) => prevHour + 1);
  }
  }, 1000);
  return () => clearInterval(timer);
  }, [hour]);
  
  // Render the hourly changes of birds, flowers, and sun
  return (
  <div>
  <h2>Hour {hour}</h2>
  <p>Sun: {sun}</p>
  <p>Birds:</p>
  <ul>
  {birds.map((bird) => (
  <li key={bird.id}>
  Bird {bird.id}: {bird.status}
  </li>
  ))}
  </ul>
  <p>Flowers:</p>
  <ul>
  {flowers.map((flower) => (
  <li key={flower.id}>
  Flower {flower.id}: color - {flower.color}, nectar - {flower.nectar}
  </li>
  ))}
  </ul>
  </div>
  );
  }
  
  export default App;
