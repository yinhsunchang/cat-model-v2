import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  label: string;
  percentage: number;
}

function SkillBar({ label, percentage }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = ref.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref}>
      <p className="wide">{label}</p>

      <div className="white">
        <div
          className="dark-grey"
          style={{
            height: "28px",
            width: visible ? `${percentage}%` : "0%",
            transition: "width 3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}

export default SkillBar;
