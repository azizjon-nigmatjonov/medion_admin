import NoDataPng from "../../assets/images/no-data.png";
import cls from "./styles.module.scss";

const NoItems = () => (
  <div className={cls.wrapper}>
    <img
      className={cls.image}
      width={200}
      src={NoDataPng}
      alt="Ma'lumot topilmadi"
    />
    <p>Malumotlar mavjud emas</p>
  </div>
);

export default NoItems;
