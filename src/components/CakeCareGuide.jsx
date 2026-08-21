import React from 'react';
import './CakeCareGuide.css';

import care1 from '../assets/care/care1.webp';
import care2 from '../assets/care/care2.webp';
import care3 from '../assets/care/care3.webp';
import care4 from '../assets/care/care4.webp';
import care5 from '../assets/care/care5.webp';
import care6 from '../assets/care/care6.webp';

const CakeCareGuide = () => {
  const instructions = [
    {
      img: care1,
      title: "Handle with Care",
      desc: "Pickup and carry from the bottom only. Never from the top or sides."
    },
    {
      img: care2,
      title: "Stay Level",
      desc: "Keep cake level at all times - during transport, storage and display."
    },
    {
      img: care3,
      title: "Cool Transport",
      desc: "Use an AC vehicle. Drive slowly, avoiding sudden stops and turns."
    },
    {
      img: care4,
      title: "Storage",
      desc: "Store in the fridge. Keep away from direct sunlight, moisture and heat."
    },
    {
      img: care5,
      title: "Serving",
      desc: "Take out 1-2h before serving and serve at room temperature."
    },
    {
      img: care6,
      title: "Leftovers",
      desc: "Store in an airtight container in the fridge for up to 4 days."
    }
  ];

  return (
    <div className="cake-care-section">
      <h3 className="care-heading">Cake Handling Instructions</h3>
      <div className="care-grid">
        {instructions.map((item, idx) => (
          <div key={idx} className="care-card">
            <div className="care-img-wrapper">
              <img src={item.img} alt={item.title} className="care-instruction-img" />
            </div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CakeCareGuide;
