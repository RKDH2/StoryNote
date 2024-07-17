import stylys from "../components/styles/MainPage.module.css";
import Community from "../(community)/community/page";

export default function MainPage({ result, session }) {
  return (
    <div className={stylys.main_container}>
      <img className={stylys.main_img} src="/mainpageIMG.svg" />
      <div className={stylys.main_text_container}>
        <div className={stylys.img_title_text}>Community & Blog</div>
        <div className={stylys.img_sub_text}>Get the latest news!</div>
        <div className={stylys.img_text}>
          Connect with people, expand your knowledge,
          <br /> and write down your stories.
        </div>
      </div>
      <img className={stylys.main_img_mobile} src="/mainpageIMG.svg" />
      <Community />
    </div>
  );
}
