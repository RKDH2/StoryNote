import stylys from "../components/styles/MainPage.module.css";
import Community from "../(community)/community/page";
import { AiFillWechat } from "react-icons/ai";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

export default function MainPage({ result, session }) {
  return (
    <div className={stylys.main_container}>
      <div className={stylys.main_text_container}>
        <div className={stylys.title_text}>Community & Blog</div>
        <div className={stylys.sub_text}>Get the latest news!</div>
        <div className={stylys.text}>
          Connect with people, expand your knowledge,
          <br /> and write down your stories.
        </div>
      </div>
      <div className={stylys.info_text}>
        <div>
          <div>
            <AiFillWechat className={stylys.icon} size={35} />
          </div>
          <p>Communication</p>
        </div>
        <div>
          <div>
            <IoShareSocialOutline className={stylys.icon} size={35} />
          </div>
          <p>Share</p>
        </div>
        <div>
          <div>
            <IoSettingsOutline className={stylys.icon} size={35} />
          </div>
          <p>Simple Setting</p>
        </div>
      </div>
      <div>
        <Community />
      </div>
    </div>
  );
}
