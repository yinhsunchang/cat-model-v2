import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";

import alexis from "../../assets/alexis255.jpg";
import ephrem from "../../assets/ephrem255.jpg";
import yinhsun from "../../assets/yinhsun255.jpg";

interface CardProps {
  image: string;
  name: string;
  job: string;
  text: string;
}

function TestimonialCard({ image, name, job, text }: CardProps) {
  return (
    <div
      className="animate-zoom"
      style={{
        background: "#222",
        padding: "30px",
        color: "#fff",
        minHeight: "180px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={image}
          alt={name}
          className="left circle margin-right"
          style={{ width: "80px", height: "80px" }}
        />
      </div>
      <p>
        <span className="large margin-right">{name}</span>
        {job}
      </p>
      <p>{text}</p>
    </div>
  );
}

export default function Reputation() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      image: alexis,
      name: t("about.reputation.testimonial1"),
      job: t("about.reputation.job1"),
      text: t("about.reputation.text1"),
    },
    {
      id: 2,
      image: ephrem,
      name: t("about.reputation.testimonial2"),
      job: t("about.reputation.job2"),
      text: t("about.reputation.text2"),
    },
    {
      id: 3,
      image: yinhsun,
      name: t("about.reputation.testimonial3"),
      job: t("about.reputation.job3"),
      text: t("about.reputation.text3"),
    },
  ];

  return (
    <div className="content justify text-light-grey padding-16">
      <h3 style={{ marginBottom: "24px" }}>{t("about.reputation.title")}</h3>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
        }}
      >
        {testimonials.map((item) => (
          <SwiperSlide key={item.id}>
            <TestimonialCard
              image={item.image}
              name={item.name}
              job={item.job}
              text={item.text}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
